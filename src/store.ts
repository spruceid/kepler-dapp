import { BeaconWallet } from '@taquito/beacon-wallet';
import {
  NetworkType,
  BeaconEvent,
  AccountInfo,
  PermissionResponseOutput,
  BlockExplorer,
  ConnectionContext,
} from '@airgap/beacon-sdk';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { Kepler, startSession, didVmToParams } from 'kepler-sdk';
import * as helpers from 'src/helpers/index';
import { WalletInfo } from '@airgap/beacon-sdk/dist/cjs/events';
import { Capabilities } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';
import { tz } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';
import { didkey } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';
import { genJWK } from '../../kepler-sdk/node_modules/@spruceid/zcap-providers/dist';

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
let sessionKey: Capabilities;
let wallet: BeaconWallet;
let kepler: Kepler;

export const uris: Writable<Array<string>> = writable([]);

// Kepler interactions
const addToKepler = async (
  orbit: string,
  ...obj: Array<any>
): Promise<Array<string>> => {
  try {
    let addresses = await helpers.addToKepler(
      kepler,
      orbit,
      await wallet.getPKH(),
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
  if (wallet) {
    return;
  }

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

  wallet = new BeaconWallet(options);

  try {
    await wallet.requestPermissions(requestPermissionsInput);
    wallet.client.subscribeToEvent(
      BeaconEvent.PERMISSION_REQUEST_SUCCESS,
      async (data) => {
        walletData.set(data);
        await initKepler();
      }
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const initKepler = async (): Promise<void> => {
  controller = await tz(wallet.client as any, didkit);

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

  await fetch(`${kepler}/al/${oid}`, {
    method: 'POST',
    body: params
  });

  sessionKey = await didkey(genJWK(didkit), didkit);

  kepler = new Kepler(
    keplerUrl,
    await startSession(oid, controller, sessionKey, ['put', 'del', 'get', 'list'])
  );
};

export const fetchAllUris = async () => {
  if (!kepler) {
    return;
  }

  const listResponse = await kepler.list(oid);
  if (listResponse.status !== 404) {
    console.log(listResponse);

    const localUris = (await listResponse.json()) as Array<string>;
    uris.set(localUris);

    const responses = await Promise.all(
      localUris.map((uri) => kepler.resolve(uri))
    );
    const jsons = await Promise.all(
      responses.map((response) => response.json())
    );
    console.log(jsons);
  }
};

export const uploadToKepler = async (files: any) => {
  if (!kepler) {
    return;
  }

  const saveResponse = await addToKepler(oid, files);
  console.debug(saveResponse);

  await fetchAllUris();
};
