<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  let clazz: string = '';
  export { clazz as class };
  export let name: string;
  export let placeholder: string = '';
  export let icon: typeof SvelteComponent;

  export let onInput: (event) => void;
</script>

<div class="relative h-16">
  {#if icon}
    <label
      class="absolute flex flex-row items-center justify-center w-12 h-16"
      for={name}
    >
      <svelte:component this={icon} class="w-4 h-4" />
    </label>
  {/if}
  <input
    on:input={onInput}
    class="py-4 h-16 pl-12 pr-6 bg-transparent border-2 border-gray-700 rounded-md {clazz}"
    type="text"
    id={name}
    {name}
    {placeholder}
  />
</div>
