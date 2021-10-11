<script lang="ts">
  import { getDownloadUrl, deleteFromKepler } from 'src/store';
  import { DownloadIcon, TrashIcon } from 'components';

  export let cid: string;

  const onDownload = async () => {
    const downloadUrl = await getDownloadUrl(cid);
    window.open(downloadUrl, '_blank');
  };

  const onDelete = async () => {
    await deleteFromKepler(cid);
  };
</script>

<div class="flex flex-row">
  <div
    class="cursor-pointer"
    title="Download {cid}"
    on:click|stopPropagation={onDownload}
  >
    <DownloadIcon
      class="w-4 h-4 text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>

  <div
    class="ml-3 sr-onlycursor-pointer"
    title="Delete {cid}"
    on:click|stopPropagation={onDelete}
  >
    <TrashIcon
      class="w-4 h-4 text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>
</div>
