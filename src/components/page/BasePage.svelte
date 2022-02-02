<script lang="ts">
  import {
    Drawer,
    TopBar,
    Logo,
    Button
  } from 'components';

  let step = 1;
  const handleNextStep = () => {
    step++;
  }
</script>

<TopBar />
<div class="flex flex-col items-center py-24 sm:py-42 px-4 sm:px-0 w-full h-full dark:bg-gray flex-grow">
  {#if step === 1}
    <div class="step-1 pb-6 sm:pb-9 pt-5 sm:pt-8 px-4 sm:px-11 rounded-2xl border-green border max-w-125 w-full mx-auto flex flex-col min-h-144.5">
      <div class="flex flex-col">
        <div class="mx-auto mb-4 sm:mb-10.5">
          <Logo />
        </div>
        <p class="font-normal text-sm tracking-wide text-white mb-2.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        <p class="font-normal text-sm tracking-wide text-white mb-2.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
      </div>
      <div class="mt-auto">
        <Button text="Enter" class='min-w-38.5 mx-auto' onClick={handleNextStep} />
      </div>
    </div>
  {/if}
  {#if step === 2}
    <Drawer handleNextStep={handleNextStep} />
  {/if}
  {#if step === 3}
    <div class="pb-6 sm:pb-9 pt-5 sm:pt-8 px-4 sm:px-11 text-white rounded-2xl border-green border max-w-125 w-full mx-auto flex flex-col min-h-144.5">
      <slot />
    </div>
  {/if}
</div>
