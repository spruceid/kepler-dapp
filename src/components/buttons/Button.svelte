<script lang="ts">
  import { ButtonText } from 'components';

  let clazz: string = '';
  export { clazz as class };
  export let text: string;
  export let title: string = '';
  export let onClick: (() => void) | null;
  export let disabled: boolean = false;
  export let fluid: boolean = false;
  export let opacity: boolean = false;
  export let secondary: boolean = false;
  export let mini: boolean = false;
</script>

<button
  class={`dark:hover:bg-opacity-90 rounded-lg px-6 transition duration-300 ease-in-out ${clazz}`}
  class:dark:bg-purple={!secondary}
  class:dark:bg-cyan={secondary}
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
  <ButtonText bind:value={text} />
</button>
