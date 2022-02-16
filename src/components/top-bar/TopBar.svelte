<script>
  import { Button, Logo,
    Discord,
    GitHub,
    Twitter,
    SettingsIcon, } from 'components';
  import { initWallet, walletData, remainingSessionKeysTime, stepStore } from 'src/store';
  import { providers } from "ethers";

  const connect = async () => {
    await initWallet();
  };

  const handleOpenSettingsPopup = (e) => {
    const element = e.target;
    const popup = element.parentElement;

    const popupBody = popup.querySelector('.popup-body');
    const popupOverlay = popup.querySelector('.popup-overlay');

    popupBody.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
  };

  const handleCloseSettingsPopup = (e) => {
    const element = e.target;
    const popup = element.parentElement;

    const popupBody = popup.querySelector('.popup-body');
    const popupOverlay = popup.querySelector('.popup-overlay');

    popupBody.classList.add('hidden');
    popupOverlay.classList.add('hidden');
  };

  const disconnect = async () => {
    const provider = new providers.Web3Provider(window.ethereum);
    if(provider.disconnect) {
      await provider.disconnect();
    }
    if(provider.close) {
      await provider.close();
    }

    localStorage.clear();
    location.reload();

  }
</script>

<div class="fixed w-full flex items-center py-3 px-4 dark:bg-gray">
  <div class="w-2/12">
    <Logo />
  </div>
  <div class="w-10/12 flex items-center justify-end">
    <div class="flex items-center space-x-4">
      <div class="hidden sm:flex items-center space-x-4">
        <a href="http://discord.gg/WjvuYqvm5Y" target="_blank"><Discord /></a>
        <a href="https://github.com/spruceid" target="_blank"><GitHub /></a>
        <a href="https://twitter.com/spruceid" target="_blank"><Twitter /></a>
      </div>
      {#if $walletData}
        <span class="flex flex-grow"></span>
        <span class="wallet-data">
          {#if $walletData.name}
            {$walletData.name}
            {#if $walletData.avatar}
              <img src="{$walletData.avatar}" alt="#">
            {:else}
              <img src="/images/siwe-address-icon.png" alt="#">
            {/if}
          {:else}
            {$walletData.account}
          {/if}
        </span>
        {:else}
        <Button text="Connect Wallet" onClick={connect} />
      {/if}
      <div class="relative popup">
        <div class="popup-icon-wrap" on:click|preventDefault={handleOpenSettingsPopup}>
          <SettingsIcon class="pointer-events-none" />
        </div>
        <div class="popup-body flex hidden">
          <button class="px-3.5 py-2 text-white flex w-full" on:click|preventDefault={() => stepStore.set({currentStep: 0 })}>About</button>
          <button class="px-3.5 py-2 text-white flex w-full" on:click|preventDefault={disconnect}>Disconnect</button>
        </div>
        <div class="popup-overlay hidden" on:click|preventDefault={handleCloseSettingsPopup}></div>
      </div>
    </div>
  </div>
</div>
