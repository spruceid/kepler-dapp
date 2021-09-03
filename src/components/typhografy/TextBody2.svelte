<script lang="ts">
  let clazz: string = '';
  export { clazz as class };
  export let value: string;
</script>

<p class={`${clazz} text-base dark:text-white font-satoshi`}>
  {value}
</p>
