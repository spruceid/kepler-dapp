<script lang="ts">
  import { Button } from 'components';
  import { createOrbit } from 'src/store';
  import { initWallet, walletData, remainingSessionKeysTime } from 'src/store';

  const handleCaptchaResult = async (token) => {
    console.log('handleCaptchaResult', token);
    await createOrbit(token);
  };

  export let handleNextStep: (() => void) | null;

  const createNewOrbit = async () => {
      await createOrbit();
      handleNextStep();
  };
</script>

<div class="pb-2 pt-7 px-4 sm:px-11 rounded-2xl border-green border max-w-125 w-full mx-auto flex flex-col">
  {#if $walletData}
  <Button
    class="mx-auto"
    text="Create new orbit"
    onClick={createNewOrbit}
  />
  <p class="font-normal text-sm tracking-wide text-white mb-2.5 text-center pt-4">Create your first Orbit to get started</p>
  {:else}
    <Button
      class="mx-auto"
      disabled
      text="Create new orbit"
      onClick={createNewOrbit}
    />
    <p class="font-normal text-sm tracking-wide text-white mb-2.5 text-center pt-4">Connect your wallet before create your first Orbit</p>
  {/if}
</div>
