<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { Button, BasePage, Table, FileInfo } from 'components';
  import { files, walletData, uploadToKepler, fetchAllUris } from 'src/store';
  import { onMount } from 'svelte';
  import { formatBytes } from 'src/helpers';
  import { TableColumn } from 'src/types';

  const navigate = useNavigate();

  let filesToUpload;

  const upload = async () => {
    try {
      await uploadToKepler(filesToUpload);
    } catch (e) {
      console.error(e);
    }
  };

  const tableColumns: Array<TableColumn> = [
    {
      header: { title: 'Name' },
      path: 'name',
    },
    {
      header: { title: 'Size' },
      path: 'size',
      transform: (content: number, _) => formatBytes(content),
    },
    {
      header: { title: 'Type' },
      path: 'type',
    },
    {
      header: { title: 'Created' },
      path: 'createdAt',
      transform: (content: Date, _) =>
        content.toLocaleString(undefined, {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }),
    },
    {
      header: { title: 'IPFS CID' },
      path: 'cid',
    },
    {
      header: { title: 'Status' },
      path: 'status',
    },
  ];
</script>

<BasePage>
  <div class="relative z-0">
  <div class="p-16">
    <div class="flex flex-row">
      <div class="text-2xl font-bold body mb-6 mr-4">My Storage</div>
      <Button onClick={fetchAllUris} text="Reload" class="mr-4" />
      <Button onClick={upload} text="Upload" />
    </div>

    <Table elements={$files} columns={tableColumns} />
  </div>

  <div class="absolute right-0 top-0">
      <FileInfo />
    </div>
  </div>
</BasePage>
