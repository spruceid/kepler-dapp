<script lang="ts">
  import { ButtonText } from 'components';

  let clazz: string = '';
  export { clazz as class };
  export let text: string;
  export let title: string = '';
  export let onClick: (() => void) | null;
  export let disabled: boolean = false;
  export let opacity: boolean = false;
</script>

<button
  class={`rounded-xl border-green border px-6 py-3 h-10 flex items-center justify-center text-center transition duration-300 ease-in-out bg-gray hover:bg-green ${clazz}`}
  class:opacity-20={opacity}
  class:opacity-50={disabled}
  class:border-gray-1={disabled}
  class:cursor-not-allowed={disabled}
  class:pointer-events-none={disabled}
  on:click|preventDefault={disabled ? null : onClick}
  aria-label={title}
  {disabled}
  {title}
>
  <ButtonText bind:value={text} />
</button>
