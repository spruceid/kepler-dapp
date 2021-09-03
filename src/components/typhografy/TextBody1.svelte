<script lang="ts">
  let clazz: string = '';
  export { clazz as class };
  export let value: string;
</script>

<p class={`${clazz} text-lg dark:text-white font-poppins`}>
  {value}
</p>
