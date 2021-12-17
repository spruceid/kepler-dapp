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

<div class="flex flex-row">
  <div
    class="cursor-pointer"
    title="Download {name}"
    on:click|stopPropagation={onDownload}
  >
    <DownloadIcon
      class="w-4 h-4 text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>

  <div
    class="ml-3 sr-onlycursor-pointer"
    title="Delete {name}"
    on:click|stopPropagation={onDelete}
  >
    <TrashIcon
      class="w-4 h-4 text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>

  <div
    class="onlycursor-pointer"
    title="Share {name}"
    on:click|stopPropagation={onShare}
  >
    <CloudUpload
      class="w-4 h-4 text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>
</div>
