<script lang="ts">
  import { FileListEntry } from 'src/store';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import filesize from 'filesize';

  export let toggle: (file: FileListEntry) => void;

  type Attribute = {
    label: string;
    value: string;
  };

  let attributes: Array<Attribute> = [];
  let visible: boolean = false;

  onMount(() => {
    toggle = (f: FileListEntry) => {
      attributes = [
        { label: 'Size', value: filesize(f.size) },
        { label: 'Type', value: f.type },
        {
          label: 'Created',
          value: f.createdAt.toLocaleString(undefined, {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }),
        },
        { label: 'Status', value: f.status },
      ];

      if (!visible) {
        visible = true;
      }
    };
  });

  const close = () => {
    visible = false;
  };

  const handleKeyUp = ({ key }) => {
    if (key == 'Escape') {
      close();
    }
  };
</script>

<svelte:window on:keyup={handleKeyUp} />

{#if visible}
  <div transition:fly={{ x: 384 }} class="absolute right-0 top-0 bottom-0 z-20 bg-gray-primary-03">
    <div class="flex flex-grow flex-col p-10 w-96">
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
  </div>

  <div class="absolute top-0 left-0 bottom-0 right-96 z-0" on:click={close} />
{/if}
