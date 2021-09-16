<script lang="ts">
  import { Drawer, TopBar } from 'components';
</script>

<div class="flex w-full h-full dark:bg-gray overflow-hidden">
  <Drawer />
  <div class="flex flex-col  flex-grow">
    <TopBar />
    <div class="px-16 pt-16 flex flex-col overflow-y-auto">
      <slot />
    </div>
  </div>
</div>
