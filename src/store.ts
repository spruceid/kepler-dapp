import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType, BeaconEvent } from '@airgap/beacon-sdk';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { Kepler, authenticator, getOrbitId } from 'kepler-sdk';
import * as helpers from 'src/helpers/index';

// The UI element for poping toast-like alerts
export const alert: Writable<{
    message: string;
    variant: 'error' | 'warning' | 'success' | 'info';
}> = writable<{
    message: string;
    variant: 'error' | 'warning' | 'success' | 'info';
}>(null);

// The kepler server hostname
export const keplerInstance = process.env.KEPLER_URL;

// The end's user Wallet.
export const wallet: Writable<BeaconWallet> = writable(null);
let localWallet: BeaconWallet;
wallet.subscribe((x) => {
    localWallet = x;
});

export const uris: Writable<Array<string>> = writable([]);

const kepler: Writable<Kepler> = writable(null);
let localKepler: Kepler;
kepler.subscribe((k) => {
    localKepler = k;
})

// Kepler interactions
const addToKepler = async (orbit: string, ...obj: Array<any>): Promise<Array<string>> => {
    try {
        let addresses = await helpers.addToKepler(localKepler, orbit, await localWallet.getPKH(), ...obj);
        alert.set({
            message: 'Successfully uploaded to Kepler',
            variant: 'success'
        });
        return addresses;
    } catch (e) {
        alert.set({
            message: e.message || JSON.stringify(e),
            variant: 'error'
        });
        throw e;
    }
}

const fetchOrbitId = async () => {
    let pkh = await localWallet.getPKH();
    let id = await getOrbitId(pkh, { domain: keplerInstance, index: 0 });
    return id;
}

const saveToKepler = async (
    ...obj: Array<any>
): Promise<Array<string>> => {
    try {
        let addresses = await helpers.saveToKepler(localKepler, await localWallet.getPKH(), ...obj);
        alert.set({
            message: 'Successfully uploaded to Kepler',
            variant: 'success'
        });
        return addresses;
    } catch (e) {
        alert.set({
            message: e.message || JSON.stringify(e),
            variant: 'error'
        });
        throw e;
    }
}

wallet.subscribe((w) => {
    if (!w) {
        localKepler = null;
        return;
    }

    w.client.subscribeToEvent(BeaconEvent.PERMISSION_REQUEST_SUCCESS, async (data) => {
        await initKepler(w);
    });
});

export const initWallet: () => Promise<void> = async () => {
    const options = {
        name: 'Kepler',
        iconUrl: 'https://tezostaquito.io/img/favicon.png',
        preferredNetwork: NetworkType.FLORENCENET
    }

    const requestPermissionsInput = {
        network: {
            type: NetworkType.FLORENCENET,
            rpcUrl: `https://${NetworkType.FLORENCENET}.smartpy.io/`,
            name: NetworkType.FLORENCENET
        }
    };

    const newWallet = new BeaconWallet(options);

    try {
        wallet.set(newWallet);
        await localWallet.requestPermissions(requestPermissionsInput);
    } catch (e) {
        wallet.set(null);
        console.error(e);
        throw e;
    }
}

const initKepler: (w: BeaconWallet) => Promise<void> = async (wallet) => {
    const newKepler = new Kepler(
        keplerInstance,
        await authenticator(wallet.client, keplerInstance)
    );

    kepler.set(newKepler);
}

export const fetchAllUris = async () => {
    if (!localKepler) { return; }

    let orbitId = await fetchOrbitId();
    const listResponse = await localKepler.list(orbitId);
    const localUris = await listResponse.json() as Array<string>;
    uris.set(localUris);

    const responses = await Promise.all(localUris.map((uri) => localKepler.resolve(uri)));
    const jsons = await Promise.all(responses.map((response) => response.json()));
    console.log(jsons);
}

kepler.subscribe(async (_) => await fetchAllUris());

export const uploadToKepler = async (formData: FormData) => {
    if (!localKepler) { return; }

    let orbitId = await fetchOrbitId();
    const saveResponse = await addToKepler(orbitId, formData);
    console.debug(saveResponse);

    await fetchAllUris();
}