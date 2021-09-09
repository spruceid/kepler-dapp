import { BeaconWallet } from '@taquito/beacon-wallet';
import {
  NetworkType,
  BeaconEvent,
  AccountInfo,
  PermissionResponseOutput,
  BlockExplorer,
  ConnectionContext,
} from '@airgap/beacon-sdk';
import { derived, get, readable, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { Kepler, startSession, didVmToParams } from 'kepler-sdk';
import * as helpers from 'src/helpers/index';
import { WalletInfo } from '@airgap/beacon-sdk/dist/cjs/events';
import { Capabilities } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';
import { tz } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';
import { didkey } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';
import { genJWK } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';
import * as didkit from '@spruceid/didkit-wasm';

// The UI element for poping toast-like alerts
export const alert: Writable<{
  message: string;
  variant: 'error' | 'warning' | 'success' | 'info';
}> = writable<{
  message: string;
  variant: 'error' | 'warning' | 'success' | 'info';
}>(null);

const keplerUrl = process.env.KEPLER_URL;
const allowListUrl = process.env.ALLOW_LIST_URL;

let oid: string;
let controller: Capabilities;

// Store that always contains the current time.
const currentTime = readable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date())
  }, 1000);

  return () => {
    clearInterval(interval);
  }
});

export const walletData: Writable<{
  account: AccountInfo;
  output: PermissionResponseOutput;
  blockExplorer: BlockExplorer;
  connectionContext: ConnectionContext;
  walletInfo: WalletInfo;
}> = writable(null);

export const wallet = writable<BeaconWallet>(null);
wallet.subscribe((w) => {
  if (!w) {
    return;
  }

  w.client.subscribeToEvent(
    BeaconEvent.PERMISSION_REQUEST_SUCCESS,
    async (data) => {
      walletData.set(data);
    }
  );
});

export const kepler = writable<Kepler>(null);
export const uris: Writable<Array<string>> = writable([]);

const sessionKey = writable<Capabilities>(null);
const sessionKeyGeneratedAt = derived(kepler, $kepler => $kepler ? new Date() : null);

const sessionKeyDurationInMs = 60 * 1000;

export const remainingSessionKeysTime = derived([currentTime, sessionKeyGeneratedAt], stores => {
  const [currentTime, sessionKeyGeneratedAt] = stores;

  if (!currentTime || !sessionKeyGeneratedAt) {
    return null;
  }

  return currentTime.getSeconds() - sessionKeyGeneratedAt.getSeconds();
});

// Kepler interactions
const addToKepler = async (
  orbit: string,
  ...obj: Array<any>
): Promise<Array<string>> => {
  const localWallet = get(wallet);
  const localKepler = get(kepler);

  try {
    let addresses = await helpers.addToKepler(
      localKepler,
      orbit,
      await localWallet.getPKH(),
      ...obj
    );
    alert.set({
      message: 'Successfully uploaded to Kepler',
      variant: 'success',
    });
    return addresses;
  } catch (e) {
    alert.set({
      message: e.message || JSON.stringify(e),
      variant: 'error',
    });
    throw e;
  }
};

const initKepler = async (): Promise<void> => {
  const localWallet = get(wallet);

  controller = await tz(localWallet.client as any, didkit);

  const params = didVmToParams(controller.id(), { index: "0" });
  oid = await fetch(`${allowListUrl}/${params}`, {
    method: 'PUT',
    body: JSON.stringify([controller.id()]),
    headers: {
      'Content-Type': 'application/json',
      'X-Hcaptcha-Sitekey': '10000000-ffff-ffff-ffff-000000000001',
      'X-Hcaptcha-Token': '10000000-aaaa-bbbb-cccc-000000000001'
    }
  }).then(async res => res.text());

  await fetch(`${keplerUrl}/al/${oid}`, {
    method: 'POST',
    body: params
  });

  const newSessionKey = await didkey(genJWK(didkit), didkit);
  sessionKey.set(newSessionKey);

  const newKepler = new Kepler(
    keplerUrl,
    await startSession(oid, controller, newSessionKey, ['put', 'del', 'get', 'list'], sessionKeyDurationInMs)
  );

  kepler.set(newKepler);
};

export const initWallet = async (): Promise<void> => {
  const options = {
    name: 'Kepler',
    iconUrl: 'https://tezostaquito.io/img/favicon.png',
    preferredNetwork: NetworkType.FLORENCENET,
  };

  const requestPermissionsInput = {
    network: {
      type: NetworkType.FLORENCENET,
      rpcUrl: `https://${NetworkType.FLORENCENET}.smartpy.io/`,
      name: NetworkType.FLORENCENET,
    },
  };

  const newWallet = new BeaconWallet(options);

  try {
    wallet.set(newWallet)
    await newWallet.requestPermissions(requestPermissionsInput);
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

  const listResponse = await localKepler.list(oid);
  if (listResponse.status == 200) {
    console.log(listResponse);

    const localUris = (await listResponse.json()) as Array<string>;
    uris.set(localUris);
  }
};

export const uploadToKepler = async (files: any) => {
  const saveResponse = await addToKepler(oid, { date: new Date() });
  console.debug(saveResponse);

  await fetchAllUris();
};
