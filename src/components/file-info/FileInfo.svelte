<script lang="ts">
  type Attribute = {
    label: string;
    value: string;
  };

  const attributes: Array<Attribute> = [
    { label: 'Size', value: '1MB' },
    { label: 'Type', value: 'JPG' },
    { label: 'Created', value: '3/7/2021' },
    { label: 'Status', value: 'Public' },
  ];
</script>

<div class="flex flex-grow flex-col p-10 bg-gray w-96">
  <div class="flex flex-grow flex-row mb-10">
    <p class="font-bold text-lg">Dummy name</p>
  </div>

  <div class="w-full h-48 bg-blue-900 rounded-md mb-10" />

  {#each attributes as attribute}
    <div
      class="flex flex-grow flex-row justify-between border-b border-gray-650 font-medium text-sm text-left px-3 py-6"
    >
      <p class="text-gray-500">{attribute.label}</p>
      <p>{attribute.value}</p>
    </div>
  {/each}
</div>
