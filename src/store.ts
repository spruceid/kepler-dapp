import { derived, get, readable, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { Kepler, S3, zcapAuthenticator, siweAuthenticator, startSIWESession } from 'kepler-sdk';
import * as helpers from 'src/helpers/index';
import { Capabilities, didkey, genJWK } from '@spruceid/zcap-providers';
import * as didkit from '@spruceid/didkit-wasm';
import { Signer, providers } from "ethers";
import { base64url } from 'rfc4648';
import { SiweMessage } from 'siwe';

// The UI element for poping toast-like alerts
export const alert: Writable<{
  message: string;
  variant: 'error' | 'warning' | 'success' | 'info';
}> = writable<{
  message: string;
  variant: 'error' | 'warning' | 'success' | 'info';
}>(null);

export type FileListEntry = {
  name: string;
  size: number;
  type: string;
  createdAt: Date;
  status: string;
};

export const keplerUrls = process.env.KEPLER_URLS.split(',') || ['http://localhost:8000'];
const allowListUrl = process.env.ALLOW_LIST_URL;

let oid: string;

// Store that always contains the current time.
const currentTime = readable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return () => {
    clearInterval(interval);
  };
});

export const stepStore: Writable< {
  currentStep: number;
}> = writable(null);

export const walletData: Writable<{
  account: string;
  name: string | null;
  avatar: string | null;
}> = writable(null);

export const wallet = writable<Signer>(null);
wallet.subscribe((w) => {
  if (!w) {
    return;
  }

  w.getAddress().then(async account => {
    walletData.set({ account: `${account.slice(0,5)} ... ${account.slice(-4)}`, name: null, avatar: null})
    
    const provider = new providers.EtherscanProvider()
    provider.lookupAddress(account).then(name => {
      if(!name) return 

      walletData.set({ account: `${account.slice(0,5)} ... ${account.slice(-4)}`, name, avatar: null});

      provider.getAvatar(name).then(avatar => {
        if(!avatar) return;
        walletData.set({ account: `${account.slice(0,5)} ... ${account.slice(-4)}`, name, avatar})
      })
    });
  });
});

export const kepler = writable<S3>(null);

export const files: Writable<Array<FileListEntry>> = writable(
  //Array(60)
  //.fill(null)
  //.map(() => ({
  //name: (Math.random() + 1).toString(36).substring(2),
  //size: Math.floor(Math.random() * 10000000000),
  //createdAt: new Date(),
  //type:
  //Math.random() > 0.66 ? 'json' : Math.random() > 0.5 ? 'jpeg' : 'mp4',
  //cid: 'zb38SNctyN1Qo6TPPTmgHXFdXg18vE9ToUV2wzLkSrHo1dxZ6',
  //status: 'pinned',
  //}))
  []
);

const sessionKey = writable<Capabilities>(null);
const sessionKeyGeneratedAt = derived(kepler, ($kepler) =>
  $kepler ? new Date() : null
);

const sessionKeyDurationInMs = 60 * 1000 * 15;

export const remainingSessionKeysTime = derived(
  [currentTime, sessionKeyGeneratedAt],
  (stores) => {
    const [currentTime, sessionKeyGeneratedAt] = stores;

    if (!currentTime || !sessionKeyGeneratedAt) {
      return null;
    }

    return currentTime.getSeconds() - sessionKeyGeneratedAt.getSeconds();
  }
);

// Kepler interactions
const addToKepler = async (
  key: string,
  obj: Blob
): Promise<string> => {
  const localWallet = get(wallet);
  const localKepler = get(kepler);
  console.log(localKepler, localWallet)
  if (!localWallet || !localKepler) {
    return;
  }

  try {
    await helpers.addToKepler(
      localKepler,
      key,
      obj
    );
    alert.set({
      message: 'Successfully uploaded to Kepler',
      variant: 'success',
    });
    return key;
  } catch (e) {
    alert.set({
      message: e.message || JSON.stringify(e),
      variant: 'error',
    });
    throw e;
  }
};

export const shareFromKepler = async (key: string): Promise<string> => {
  const localWallet = get(wallet);

  if (!localWallet) {
    return;
  }

  const now = Date.now();

  // @ts-ignore
  const signer = new providers.Web3Provider(window.ethereum).getSigner();
  const sessionDoc = new SiweMessage({
    domain: window.location.hostname,
    address: await localWallet.getAddress(),
    uri: "did:*",
    version: "1", chainId: "1",
    statement: `Share ${key} with a link`,
    issuedAt: new Date(now).toISOString(),
    expirationTime: new Date(now + (2 * 60 * 1000 * 60 * 24)).toISOString(),
    resources: [`kepler://${oid}/s3/${key}#get`]
  });
  const m = sessionDoc.toMessage();
  const signature = await signer.signMessage(m);

  const p = new URLSearchParams();
  p.append('key', key);
  p.append('authz', base64url.stringify(new TextEncoder().encode(JSON.stringify([m, signature]))))
  return window.location.origin + "/index.html?" + p.toString();
}

const removeFromKepler = async (obj: string): Promise<void> => {
  const localWallet = get(wallet);
  const localKepler = get(kepler);

  if (!localWallet || !localKepler) {
    return;
  }

  try {
    await helpers.removeFromKepler(
      localKepler,
      obj,
    );
    alert.set({
      message: 'Successfully removed from Kepler',
      variant: 'success',
    });
  } catch (e) {
    alert.set({
      message: e.message || JSON.stringify(e),
      variant: 'error',
    });
    throw e;
  }
};

const hostsToString = (h: { [key: string]: string[] }) =>
  Object.keys(h).map(host => `${host}:${h[host].join(",")}`).join("|")

export const createOrbit = async (captcha?: string): Promise<void> => {
  const localWallet = get(wallet);

  if (!localWallet) {
    console.log('no wallet');
    return;
  }

  const authn = await siweAuthenticator(localWallet, window.location.hostname, "1");

  const hosts = await keplerUrls.reduce<Promise<{ [k: string]: string[] }>>(async (h, url) => {
    const hs = await h;
    const k = new Kepler(url, authn);
    const id = await k.new_id();
    hs[id] = [await k.id_addr(id)];
    return hs
  }, Promise.resolve({}))
  const hostStr = hostsToString(hosts);

  let oid

  console.log(keplerUrls)
  for (const n in keplerUrls) {
    const url = keplerUrls[n]
    console.log('create at ', url);
    const k = new Kepler(url, authn);
    const res = await k.createOrbit([], { hosts: hostStr });
    if (res.status !== 200) {
      throw new Error(`orbit creation failed: ${await res.text()}`)
    }
    const newOid = await res.text()
    if (!oid) {
      oid = newOid
    } else if (oid !== newOid) {
      throw new Error("Oid not consistant between hosts")
    }
  }
  if (!oid) {
    throw new Error("No Hosts");
  }

  localStorage.setItem(await localWallet.getAddress(), oid);

  await initKepler()
};

export const restoreOrbit = async (): Promise<void> => {
  const localWallet = get(wallet);

  if (!localWallet) {
    return;
  }

  oid = localStorage.getItem(await localWallet.getAddress());
};

const initKepler = async (): Promise<void> => {
  await restoreOrbit();
  const localWallet = get(wallet);

  if (!oid) {
    console.log('need to setup an orbit first');
    return;
  }

  const newSessionKey = await didkey(genJWK(didkit), didkit);
  sessionKey.set(newSessionKey);
  const sessionDoc = await startSIWESession(
    oid,
    window.location.hostname,
    "1",
    await localWallet.getAddress(),
    newSessionKey.id(),
    ['put', 'del', 'get', 'list'],
    { exp: new Date(Date.now() + sessionKeyDurationInMs) }
  );
  sessionDoc.signature = await localWallet.signMessage(sessionDoc.toMessage());

  console.log(sessionDoc);

  const newKepler = new S3(
    keplerUrls[0],
    oid,
    await zcapAuthenticator(newSessionKey, sessionDoc)
  );

  kepler.set(newKepler);
  
  await fetchAllUris();
};

export const initWallet = async (): Promise<void> => {
  try {
    // @ts-ignore
    const provider = new providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []).then(console.log);
    const signer = provider.getSigner();
    wallet.set(signer);
    await initKepler();
  } catch (e) {
    wallet.set(null);
    alert.set({
      message: e.message || JSON.stringify(e),
      variant: 'error',
    });
    throw e;
  }
};

export const fetchAllUris = async () => {
  const localKepler = get(kepler);

  if (!localKepler) {
    return;
  }

  const listResponse = await localKepler.list();
  if (listResponse.status == 200) {
    const uris = (await listResponse.json()) as Array<string>;
    console.log(uris);
    const details = await Promise.all(
      uris.map(async (uri) => {
        const name = uri.split('/').slice(-1)[0];
        const fileResponse = await localKepler.head(name);
        const size = parseInt(fileResponse.headers.get('Content-Length') || "0");
        const modified = new Date(fileResponse.headers.get('last-modified') || new Date())
        return {
          name,
          size,
          createdAt: modified,
          type: name.split('.').slice(-1)[0],
          status: 'pinned',
        };
      })
    );

    files.set(details);
  }
};

export const uploadToKepler = async (files: Array<File>) => {
  console.log(files)
  await Promise.all(files.map(async file => console.log(await addToKepler(file.name, file))))

  await fetchAllUris();
};

export const deleteFromKepler = async (cid: string) => {
  const deleteResponse = await removeFromKepler(cid);
  console.debug(deleteResponse);

  await fetchAllUris();
};

export const getDownloadUrl = async (key: string) => {
  return `${keplerUrls[0]}/${oid}/s3/${key}`;
};
