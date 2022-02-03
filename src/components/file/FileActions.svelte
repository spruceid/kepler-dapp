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
      class="w-6 h-6 sm:w-7 sm:h-7 p-1.5 rounded-full border border-green text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>

  <div
    class="sr-onlycursor-pointer"
    title="Delete {name}"
    on:click|stopPropagation={onDelete}
  >
    <TrashIcon
      class="w-6 h-6 sm:w-7 sm:h-7 p-1.5 rounded-full border border-green text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>

  <div
    class="onlycursor-pointer"
    title="Share {name}"
    on:click|stopPropagation={onShare}
  >
    <CloudUpload
      class="w-6 h-6 sm:w-7 sm:h-7 p-1.5 rounded-full border border-green text-white transform transition-all duration-100 hover:scale-110 "
    />
  </div>
</div>
