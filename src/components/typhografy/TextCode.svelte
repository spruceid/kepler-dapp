<script lang="ts">
  import { CopyIcon } from 'components';

  let clazz: string = '';
  export { clazz as class };

  export let value: string;
  $: shorter =
    value.length > 32
      ? `${value.substring(0, 13)}...${value.substring(
          value.length - 16,
          value.length
        )}`
      : value;

  export let copy: boolean = false;

  const action = () => {
    navigator.clipboard.writeText(value);
  };
</script>

<div class="flex flex-row items-center">
  <p
    title={value}
    class={`${clazz} inline-block px-2 bg-gray-700 text-base text-white font-inconsolata rounded-md`}
  >
    {shorter}
  </p>

  {#if copy}
    <div class="cursor-pointer hover-show" on:click|stopPropagation={action}>
      <CopyIcon
        class="w-4 h-4 ml-2 text-white transform transition-all duration-100 hover:scale-110 "
      />
    </div>
  {/if}
</div>
