import { derived, get, readable, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { Kepler, S3, zcapAuthenticator, siweAuthenticator, startSIWESession } from 'kepler-sdk';
import * as helpers from 'src/helpers/index';
import { Capabilities, didkey, genJWK } from '@spruceid/zcap-providers';
import * as didkit from '@spruceid/didkit-wasm';
import { Signer, providers } from "ethers";

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

// const keplerUrls = process.env.KEPLER_URLS;
const keplerUrls = ['http://test.mydomain.com:8000', 'http://test.mydomain.com:9000'];
// const keplerUrls = ['http://test.mydomain.com:8000'];
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

export const walletData: Writable<{
  account: string;
}> = writable(null);

export const wallet = writable<Signer>(null);
wallet.subscribe((w) => {
  if (!w) {
    return;
  }

  w.getAddress().then(account => walletData.set({ account }))
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

  const newKepler = new S3(
    keplerUrls[0],
    oid,
    await zcapAuthenticator(newSessionKey, sessionDoc)
  );

  kepler.set(newKepler);
};

export const initWallet = async (): Promise<void> => {
  try {
    // @ts-ignore
    const signer = new providers.Web3Provider(window.ethereum).getSigner();
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
