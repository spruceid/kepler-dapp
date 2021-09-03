<script>
  import { Drawer, TopBar } from 'components';
</script>

<div class="flex flex-grow dark:bg-gray">
  <Drawer />
  <div class="flex flex-grow flex-col">
    <TopBar />
    <slot />
  </div>
</div>
