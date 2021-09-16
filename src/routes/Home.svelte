<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import {
    Button,
    BasePage,
    Table,
    FileInfo,
    IconButton,
    RefreshIcon,
    UploadIcon,
  } from 'components';
  import {
    files,
    uploadToKepler,
    fetchAllUris,
    FileListEntry,
  } from 'src/store';
  import type { TableColumn } from 'src/types';
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
  <div class="flex flex-row z-10 mb-6 items-center">
    <div class="text-2xl font-bold body flex-grow">My Storage</div>
    <IconButton icon={RefreshIcon} onClick={fetchAllUris} />
    <IconButton icon={UploadIcon} onClick={upload} />
  </div>

  <Table
    elements={$files}
    columns={tableColumns}
    onRowClick={(element, _) => toggleFileInfo(element)}
    class="z-10"
  />

  <FileInfo bind:toggle={toggleFileInfo} />
</BasePage>
