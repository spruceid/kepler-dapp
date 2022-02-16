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
          <p class="font-normal text-sm tracking-wide text-white mb-2.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
          <p class="font-normal text-sm tracking-wide text-white mb-2.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
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
