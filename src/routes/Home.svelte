<script lang="ts">
  import {
    onDestroy
  } from 'svelte';
  import {
    get
  } from 'svelte/store';
  import {
    useNavigate
  } from 'svelte-navigator';
  import {
    Button, BasePage, Table, FileInfo, FileActions, IconButton, RefreshIcon, UploadIcon, FileStatus, TextCode, TextField, SearchIcon, FilterIcon, Tabs, TabList, TabPanel, Tab,
  } from 'components';
  import {
    files, uploadToKepler, fetchAllUris, FileListEntry,
  } from 'src/store';
  import type {
    TableColumn
  } from 'src/types';
  import filesize from 'filesize';
  import {
    sortBy
  } from 'lodash';
  import Fuse from 'fuse.js';

  import FileUpload from 'src/modals/FileUpload.svelte';

  const navigate = useNavigate();

  const submit = async (value: any) => {
    try {
        await uploadToKepler(value);
      } catch (e) {
        console.error(e);
      };
  };

  const tableColumns: Array < TableColumn > = [{
      header: {
        title: 'Name',
        id: 'name'
      },
      path: 'name',
    },
    {
      header: {
        title: 'Size',
        id: 'size'
      },
      path: 'size',
      transform: (content: number, _) => filesize(content),
    },
    {
      header: {
        title: 'Type',
        id: 'type',
        allowSorting: false
      },
      path: 'type',
      transform: (content) => content.toUpperCase(),
    },
    {
      header: {
        title: 'Created',
        id: 'created'
      },
      path: 'createdAt',
      transform: (content: Date, _) =>
        content.toLocaleString(undefined, {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }),
    },
    {
      header: {
        title: 'Status',
        id: 'status'
      },
      path: 'status',
      options: (status) => ({
        status,
      }),
      component: FileStatus,
    },
    {
      header: {
        title: 'Actions',
        id: 'actions',
        allowSorting: false
      },
      path: 'name',
      options: (name) => ({
        name,
      }),
      component: FileActions,
    },
  ];

  let toggleFileInfo: (file: FileListEntry) => void;
  let toggleFilter: () => void;

  const buildSearchInstance = (value) => {
    return new Fuse(value, {
      keys: ['name'],
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

  onDestroy(() => {
    unsubscribeFiles();
  });

  let filterSection: boolean = false;
  $: filtersAvailable = [...new Set(get(files).map((f) => f.type))];
  let filterType = [];

  const toggleFilterSection = () => {
    filterSection = !filterSection;
  };

  const allFilters = (
    files, {
      search: {
        instance,
        query
      },
      filter: {
        type
      }
    }
  ) => {
    let ret = files;

    if (query !== '') {
      ret = sortBy(instance.search(query), 'score').map((e) => e.item);
    }

    if (type.length > 0) {
      ret = ret.filter((f) => type.includes(f.type));
    }

    return ret;
  };

  $: filteredFiles = allFilters(get(files), {
    search: {
      instance: searchInstance,
      query: searchString,
    },
    filter: {
      type: filterType,
    },
  });
</script>

<BasePage>

  <Tabs>
    <TabList>
      <Tab>Upload</Tab>
      <Tab>Files</Tab>
    </TabList>

    <TabPanel>
      <FileUpload title="Upload to Orbit" onSubmit={submit} />
    </TabPanel>

    <TabPanel>
      <div class="flex flex-row items-center justify-between mt-5.5">
        <TextField icon={SearchIcon} name="search" placeholder="Search files..." onInput={onSearchInput} />
        <IconButton icon={FilterIcon} onClick={toggleFilterSection} class="ml-4 flex items-center justify-center" />
      </div>

    {#if filterSection}
    <div class="px-4 py-2 mb-6 border-2 border-gray-800 rounded-md">
      <div class="text-lg text-gray-400">Filter by File Type</div>
      <div
        class="flex flex-row flex-wrap items-center justify-center mt-2 mb-4"
      >
        {#each filtersAvailable as filter}
          <label class="flex flex-row items-center mx-4 cursor-pointer">
            <input
              class="w-6 h-6 mr-2 bg-transparent border-2 rounded-md border-gray-650 text-purple"
              type="checkbox"
              bind:group={filterType}
              name="filter-type"
              value={filter}
            />
            <span class="text-lg uppercase">{filter}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <Table
    elements={filteredFiles}
    columns={tableColumns}
    onRowClick={(element, _) => toggleFileInfo(element)}
    class="z-10"
  />

  <FileInfo bind:toggle={toggleFileInfo} />
    </TabPanel>
  </Tabs>
</BasePage>
