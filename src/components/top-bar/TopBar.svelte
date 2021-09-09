<script>
  import { Button } from 'components';
  import { initWallet, walletData } from 'src/store';

  const connect = async () => {
    await initWallet();
  };
</script>

<div class="p-9 flex w-full items-center justify-end">
  {#if $walletData}
    <span class="flex flex-grow">Search</span>
    <span class="rounded-lg bg-purple px-6 py-2">
      {$walletData.account.address}
    </span>
  {:else}
    <Button text="Connect Wallet" mini onClick={connect} />
  {/if}
</div>
