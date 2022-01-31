<script lang="ts">
  let clazz: string = '';
  export { clazz as class };
  export let value: string;
</script>

<span class={`text-white text-sm font-satoshi font-bold ${clazz}`}>
  {value}
</span>
