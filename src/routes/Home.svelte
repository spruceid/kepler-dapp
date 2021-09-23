<script lang="ts">
  import { onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { useNavigate } from 'svelte-navigator';
  import {
    Button,
    BasePage,
    Table,
    FileInfo,
    IconButton,
    RefreshIcon,
    UploadIcon,
    FileStatus,
    TextCode,
    TextField,
    SearchIcon,
    FilterIcon,
  } from 'components';
  import {
    files,
    uploadToKepler,
    fetchAllUris,
    FileListEntry,
  } from 'src/store';
  import type { TableColumn } from 'src/types';
  import filesize from 'filesize';
  import { sortBy } from 'lodash';
  import Fuse from 'fuse.js';

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
      header: { title: 'Name', id: 'name' },
      path: 'name',
    },
    {
      header: { title: 'Size', id: 'size' },
      path: 'size',
      transform: (content: number, _) => filesize(content),
    },
    {
      header: { title: 'Type', id: 'type', allowSorting: false },
      path: 'type',
      transform: (content) => content.toUpperCase(),
    },
    {
      header: { title: 'Created', id: 'created' },
      path: 'createdAt',
      transform: (content: Date, _) =>
        content.toLocaleString(undefined, {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }),
    },
    {
      header: { title: 'IPFS CID', id: 'cid' },
      path: 'cid',
      options: (cid) => ({
        value: cid,
        copy: true,
      }),
      component: TextCode,
    },
    {
      header: { title: 'Status', id: 'status' },
      path: 'status',
      options: (status) => ({
        status,
      }),
      component: FileStatus,
    },
  ];

  let toggleFileInfo: (file: FileListEntry) => void;
  let toggleFilter: () => void;

  const buildSearchInstance = (value) => {
    return new Fuse(value, {
      keys: ['name', 'cid'],
    });
  };

  let searchInstance = buildSearchInstance(get(files));

  const unsubscribeFiles = files.subscribe((value) => {
    searchInstance = buildSearchInstance(value);
  });

  let searchString: string = '';
  let onSearchInput: (event) => void = (event) => {
    searchString = event.target.value;
  };

  $: filteredFiles =
    searchString !== ''
      ? sortBy(searchInstance.search(searchString), 'score').map((e) => e.item)
      : get(files);

  onDestroy(() => {
    unsubscribeFiles();
  });
</script>

<BasePage>
  <div class="z-10 flex flex-row items-center mb-6">
    <div class="flex-grow text-2xl font-bold body">My Storage</div>
    <IconButton icon={RefreshIcon} onClick={fetchAllUris} />
    <IconButton icon={UploadIcon} onClick={upload} />
  </div>

  <div class="flex flex-row items-center justify-end mx-4 mb-6">
    <TextField
      icon={SearchIcon}
      name="search"
      placeholder="Search files..."
      onInput={onSearchInput}
    />
  </div>

  <Table
    elements={filteredFiles}
    columns={tableColumns}
    onRowClick={(element, _) => toggleFileInfo(element)}
    class="z-10"
  />

  <FileInfo bind:toggle={toggleFileInfo} />
</BasePage>
