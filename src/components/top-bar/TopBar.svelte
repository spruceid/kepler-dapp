<script>
  import { Button, Logo,
    Discord,
    GitHub,
    Twitter,
    SettingsIcon, } from 'components';
  import { initWallet, walletData, remainingSessionKeysTime } from 'src/store';
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
        <Discord />
        <GitHub />
        <Twitter />
      </div>
      {#if $walletData}
        <span class="flex flex-grow"></span>
        <span class="rounded-xl border-green border px-3 py-3 h-10 flex items-center justify-center text-center text-sm font-bold text-white">
          {$walletData.account}
        </span>
        {:else}
        <Button text="Connect Wallet" onClick={connect} />
      {/if}
      <div class="relative popup">
        <div class="rounded-xl border-green border px-3 py-3 h-10 flex items-center justify-center text-center bg-gray z-10 cursor-pointer" on:click|preventDefault={handleOpenSettingsPopup}>
          <SettingsIcon class="pointer-events-none" />
        </div>
        <div class="popup-body absolute right-0 top-12 py-1 rounded-xl border-green border text-sm font-bold min-w-38.5 bg-gray text-left z-20 flex-col flex hidden">
          <a href="#temporary-link" target="_blank" class="px-3.5 py-2 text-white flex w-full">About</a>
          <button class="px-3.5 py-2 text-white flex w-full" on:click|preventDefault={disconnect}>Disconnect</button>
        </div>
        <div class="w-screen h-screen fixed top-0 left-0 z-10 popup-overlay hidden" on:click|preventDefault={handleCloseSettingsPopup}></div>
      </div>
    </div>
  </div>
</div>
