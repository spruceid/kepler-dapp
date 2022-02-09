<script lang="ts">
  import ArrowUp from '../icons/ArrowUp.svelte';
  import ArrowDown from '../icons/ArrowDown.svelte';

  export let onSortAsc: () => void;
  export let onSortDesc: () => void;
</script>

<div class="inline-flex flex-col justify-between ml-2">
  <span
    on:click={onSortAsc}
    class="sort-icon"
  >
    <ArrowUp class="w-2 h-2 text-gray-1" />
  </span>
  <span
    on:click={onSortDesc}
    class="sort-icon"
  >
    <ArrowDown class="w-2 h-2 text-gray-1" />
  </span>
</div>
