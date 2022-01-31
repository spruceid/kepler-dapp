<script lang="ts">
  import {
    Drawer,
    TopBar,
    Logo,
    Button
  } from 'components';
</script>

<TopBar />
<div class="flex flex-col items-center pt-42 w-full h-full dark:bg-gray">
  <div class="step-1 pb-9 pt-8 px-11 rounded-2xl border-green border max-w-125 w-full mx-auto flex flex-col min-h-144.5">
    <div class="flex flex-col">
      <div class="mx-auto mb-8">
        <Logo />
      </div>
      <p class="font-normal text-sm tracking-wide text-white mb-2.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
      <p class="font-normal text-sm tracking-wide text-white mb-2.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
    </div>
    <div class="mt-auto">
      <Button text="Enter" class='min-w-38.5 mx-auto' />
    </div>
  </div>
  <Drawer />
  <div class="px-16 pt-16 flex flex-col overflow-y-auto text-white">
    <slot />
  </div>
</div>
