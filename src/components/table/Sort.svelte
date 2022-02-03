<script lang="ts">
  import ArrowUp from '../icons/ArrowUp.svelte';
  import ArrowDown from '../icons/ArrowDown.svelte';

  export let onSortAsc: () => void;
  export let onSortDesc: () => void;
</script>

<div class="inline-flex flex-col justify-between ml-2">
  <span
    on:click={onSortAsc}
    class="cursor-pointer transition-all duration-100 transform hover:scale-110"
  >
    <ArrowUp class="w-2 h-2 text-gray-1" />
  </span>
  <span
    on:click={onSortDesc}
    class="cursor-pointer transition-all duration-100 transform hover:scale-110"
  >
    <ArrowDown class="w-2 h-2 text-gray-1" />
  </span>
</div>
