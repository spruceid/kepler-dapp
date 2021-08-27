import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-sdk';
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

let localKepler: Kepler;

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
        await newWallet.requestPermissions(requestPermissionsInput);

        localKepler = new Kepler(
            keplerInstance,
            await authenticator(newWallet.client, process.env.KEPLER_URL)
        );

        console.debug('Wallet initialized');
        console.debug('Kepler initialized');

        let orbitId = await fetchOrbitId();

        // const saveResponse = await addToKepler(orbitId, { message: 'just a message' });
        // console.debug(saveResponse);

        const listResponse = await localKepler.list(orbitId);
        const uris = await listResponse.json() as Array<string>;
        uris.forEach(async (uri) => {
            const res = await localKepler.resolve(uri);
            const json = await res.json();
            console.log(json);
        })
    } catch (e) {
        wallet.set(null);
        console.error(e);
        throw e;
    }
}
