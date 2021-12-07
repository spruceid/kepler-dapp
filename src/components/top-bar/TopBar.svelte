<script>
  import { Button } from 'components';
  import { initWallet, walletData, remainingSessionKeysTime } from 'src/store';

  const connect = async () => {
    await initWallet();
  };
</script>

<div
  class="flex items-center justify-end w-full px-16 border-b py-9 border-gray-650"
>
  {#if $walletData}
    <span class="flex flex-grow"></span>
    <span class="px-6 py-2 rounded-lg bg-purple">
      {$walletData.account}
    </span>
  {:else}
    <Button text="Connect Wallet" mini onClick={connect} />
  {/if}
</div>
