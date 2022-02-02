<script lang="ts">
  let clazz: string = '';
  export { clazz as class };
  export let value: string;
</script>

<p class={`${clazz} text-sm text-white mr-1`}>
  {value}
</p>
