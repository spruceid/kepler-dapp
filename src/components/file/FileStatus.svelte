<script lang="ts">
  export let status: string;
</script>

{#if status === 'pinned'}
  <div class="flex flex-row items-center">
    <span class="inline-block w-2 h-2 mr-1 bg-green-500 rounded-full" />
    <span class="capitalize">{status}</span>
  </div>
{:else}
  <span class="capitalize">{status}</span>
{/if}
