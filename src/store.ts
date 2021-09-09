import { BeaconWallet } from '@taquito/beacon-wallet';
import {
  NetworkType,
  BeaconEvent,
  AccountInfo,
  PermissionResponseOutput,
  BlockExplorer,
  ConnectionContext,
} from '@airgap/beacon-sdk';
import { readable, writable } from 'svelte/store';
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

const sessionKey = writable<Capabilities>(null);
const sessionKeyDurationInMs = 60 * 1000;

export const wallet = writable<BeaconWallet>(null);
let localWallet: BeaconWallet;
wallet.subscribe(w => localWallet = w);

export const kepler = writable<Kepler>(null);
let localKepler: Kepler;
kepler.subscribe(k => localKepler = k);

export const uris: Writable<Array<string>> = writable([]);

// Kepler interactions
const addToKepler = async (
  orbit: string,
  ...obj: Array<any>
): Promise<Array<string>> => {
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

export const walletData: Writable<{
  account: AccountInfo;
  output: PermissionResponseOutput;
  blockExplorer: BlockExplorer;
  connectionContext: ConnectionContext;
  walletInfo: WalletInfo;
}> = writable(null);

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

const initKepler = async (): Promise<void> => {
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

export const fetchAllUris = async () => {
  const listResponse = await localKepler.list(oid);
  if (listResponse.status == 200) {
    console.log(listResponse);

    const localUris = (await listResponse.json()) as Array<string>;
    uris.set(localUris.map(uri => uri.split('/').slice(-1)[0]));

    // const responses = await Promise.all(
    //   localUris.map((uri) => kepler.resolve(uri))
    // );
    // const jsons = await Promise.all(
    //   responses.map((response) => response.json())
    // );
    // console.log(jsons);
  }
};

export const uploadToKepler = async (files: any) => {
  if (!kepler) {
    return;
  }

  const saveResponse = await addToKepler(oid, { date: new Date() });
  console.debug(saveResponse);

  await fetchAllUris();
};
