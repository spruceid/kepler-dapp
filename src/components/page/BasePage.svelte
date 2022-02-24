<script lang="ts">
  import {
    Drawer,
    TopBar,
    Logo,
    Button,
    CheckArrow,
    Toast
  } from 'components';
  import { kepler, stepStore } from 'src/store';
  import { get} from 'svelte/store';

  stepStore.set({currentStep: 1 });

</script>

<TopBar />
<div class="flex flex-col items-center py-24 sm:py-42 px-4 sm:px-0 w-full dark:bg-gray flex-grow">
  {#if $stepStore}
    {#if $stepStore.currentStep === 0}
      <div class="step-wrap">
        <div class="flex flex-col">
          <div class="mx-auto mb-4 sm:mb-10.5">
            <Logo />
          </div>
          <p class="font-normal text-sm tracking-wide text-white mb-2.5">This is an example dapp using Kepler. First, a user can connect their wallet and sign in with Ethereum to create a new Orbit. As part of the sign in with Ethereum request, the user delegates to a session key which grants permissions to automatically sign for operations around storage to enable an easier UX. Finally, a user can upload files, and then download or delete those files from their Orbit.</p>
          <p class="font-normal text-sm tracking-wide text-white mb-2.5">Note: this dapp has not undergone any formal audit, and is just an example. It should not be used for production purposes.</p>
        </div>
        <div class="mt-auto">
          <Button text="Enter" class='min-w-38.5 mx-auto' onClick={()=> stepStore.set({ currentStep: 1 })} />
        </div>
      </div>
    {/if}
    {#if $stepStore.currentStep === 1 && !$kepler}
      <Drawer handleNextStep={()=> stepStore.set({ currentStep: 2 })} />
    {/if}
    {#if ($stepStore.currentStep === 2 || $kepler) && $stepStore.currentStep !== 0}
      <div class="step-wrap">
        <slot />
      </div>
    {/if}
  {/if}
</div>

<Toast />
