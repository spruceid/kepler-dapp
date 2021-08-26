import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-sdk';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { Kepler, authenticator } from 'kepler-sdk';

// The kepler server hostname
export const keplerInstance = process.env.KEPLER_URL;

// The end's user Wallet.
export const wallet: Writable<BeaconWallet> = writable(null);

export const initWallet: () => Promise<void> = async () => {
    const options = {
        name: 'Kepler',
        iconUrl: 'https://tezostaquito.io/img/favicon.png',
        preferredNetwork: NetworkType.MAINNET
    }

    const requestPermissionsInput = {
        network: {
            type: NetworkType.MAINNET,
            rpcUrl: `https://${NetworkType.MAINNET}.smartpy.io/`,
            name: NetworkType.MAINNET
        }
    };

    const newWallet = new BeaconWallet(options);
    try {
        wallet.set(newWallet);
        await newWallet.requestPermissions(requestPermissionsInput);

        const kepler = new Kepler(
            keplerInstance,
            await authenticator(newWallet.client, process.env.KEPLER_URL)
        );

        console.log('Wallet initialized');
        console.log('Kepler initialized');
    } catch (e) {
        wallet.set(null);
        console.log(e);
        throw e;
    }
}