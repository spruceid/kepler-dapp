<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  let clazz: string = '';
  export { clazz as class };
  export let name: string;
  export let placeholder: string = '';
  export let icon: typeof SvelteComponent;

  export let onInput: (event) => void;
</script>

<div class="relative h-12 w-full">
  {#if icon}
    <label
      class="absolute flex flex-row items-center justify-center w-10 h-12"
      for={name}
    >
      <svelte:component this={icon} class="w-4 h-4" />
    </label>
  {/if}
  <input
    on:input={onInput}
    class="py-2 h-12 pl-12 pr-2 w-full bg-transparent border-1 border-green rounded-md {clazz}"
    type="text"
    id={name}
    {name}
    {placeholder}
  />
</div>
