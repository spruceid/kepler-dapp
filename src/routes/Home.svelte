<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { Button, BasePage, Table, FileInfo } from 'components';
  import {
    files,
    walletData,
    uploadToKepler,
    fetchAllUris,
    FileListEntry,
  } from 'src/store';
  import { onMount } from 'svelte';
  import { formatBytes } from 'src/helpers';
  import { TableColumn } from 'src/types';
  import { element } from 'svelte/internal';
  import filesize from 'filesize';

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
      transform: (content: number, _) => filesize(content),
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

  let toggleFileInfo: (file: FileListEntry) => void;
</script>

<BasePage>
  <div class="p-16 relative h-full">
    <div class="flex flex-row z-10">
      <div class="text-2xl font-bold body mb-6 mr-4">My Storage</div>
      <Button onClick={fetchAllUris} text="Reload" class="mr-4" />
      <Button onClick={upload} text="Upload" />
    </div>

    <Table
      elements={$files}
      columns={tableColumns}
      onRowClick={(element, _) => toggleFileInfo(element)}
      class="z-10 relative"
    />

    <FileInfo bind:toggle={toggleFileInfo} />
  </div>
</BasePage>
