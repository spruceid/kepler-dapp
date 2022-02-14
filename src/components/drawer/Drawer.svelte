<script lang="ts">
  import { Button } from 'components';
  import { createOrbit, kepler } from 'src/store';
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

<div class="wrapper-orbit">
  {#if $walletData}
  <Button
    class="mx-auto"
    text="Create new orbit"
    onClick={createNewOrbit}
  />
  <p class="text-drawer">Create your first Orbit to get started</p>
  {:else}
    <Button
      class="mx-auto"
      disabled
      text="Create new orbit"
      onClick={createNewOrbit}
    />
    <p class="text-drawer">Connect your wallet before create your first Orbit</p>
  {/if}
</div>
