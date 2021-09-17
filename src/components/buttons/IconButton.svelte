<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  let clazz: string = '';
  export { clazz as class };
  export let title: string = '';
  export let onClick: (() => void) | null;
  export let disabled: boolean = false;
  export let fluid: boolean = false;
  export let opacity: boolean = false;
  export let mini: boolean = false;
  export let icon: typeof SvelteComponent;
</script>

<button
  class={`dark:hover:bg-opacity-5 dark:hover:bg-white rounded-full p-4 transition duration-300 ease-in-out ${clazz}`}
  class:flex={fluid}
  class:py-2={mini}
  class:py-4={!mini}
  class:opacity-20={opacity}
  class:opacity-50={disabled}
  class:cursor-not-allowed={disabled}
  on:click|preventDefault={disabled ? null : onClick}
  aria-label={title}
  {disabled}
  {title}
>
  <svelte:component this={icon} class="w-8 h-8" />
</button>
