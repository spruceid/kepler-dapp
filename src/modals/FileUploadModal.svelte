<script lang="ts">
  import { onDestroy } from 'svelte';

  import { fileUpload } from 'src/file-upload.ts';
  import type { FileUpload } from 'src/file-upload.ts';

  import FileUploadModal from './FileUpload.svelte';

  let show: bool = false;
  let data: FileUpload = null;

  const unsub = fileUpload.subscribe((value) => {
    if (value) {
      show = true;
      data = value;
    } else {
      show = false;
      data = null;
    }
  });

  const submit = async (value: any) => {
    await data.callback(value);
    fileUpload.set(null);
  };

  onDestroy(unsub);
</script>

{#if show}
  <FileUploadModal title={data.title} onSubmit={submit} />
{/if}
