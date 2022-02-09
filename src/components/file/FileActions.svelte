<script lang="ts">
  import { getDownloadUrl, deleteFromKepler, shareFromKepler } from 'src/store';
  import { DownloadIcon, TrashIcon, CloudUpload } from 'components';

  export let name: string;

  const onDownload = async () => {
    const downloadUrl = await getDownloadUrl(name);
    window.open(downloadUrl, '_blank');
  };

  const onDelete = async () => {
    await deleteFromKepler(name);
  };

  const onShare = async () => {
    await navigator.clipboard.writeText(await shareFromKepler(name));
  };
</script>

<div class="flex flex-row space-x-1 sm:space-x-3">
  <div
    class="cursor-pointer"
    title="Download {name}"
    on:click|stopPropagation={onDownload}
  >
    <DownloadIcon
      class="icon-table"
    />
  </div>

  <div
    class="sr-onlycursor-pointer"
    title="Delete {name}"
    on:click|stopPropagation={onDelete}
  >
    <TrashIcon
      class="icon-table"
    />
  </div>

  <!-- <div
    class="onlycursor-pointer"
    title="Share {name}"
    on:click|stopPropagation={onShare}
  >
    <CloudUpload
      class="icon-table"
    />
  </div> -->
</div>
