<script lang="ts">
  import { get, sortBy } from 'lodash';
  import type { TableColumn } from '../../types';

  import Sort from './Sort.svelte';

  /**
   * Array containing the headers and it's respectives
   * configurations.
   */
  export let columns: Array<TableColumn>;

  /**
   * List of elements that sould be rendered in the table.
   */
  export let elements: Array<any>;

  /**
   * Wheter the list content should expand itself (not-scrollable)
   */
  export let fluid: boolean = false;

  /**
   * Helper tailwind classes
   * https://tailwindcss.com/docs
   */
  let clazz: string;
  export { clazz as class };

  export let onRowClick: (element, index: number) => void;

  let headers = columns.map((column) => column.header);

  let sortField: string = '';
  let sortDirection: boolean = false;
  $: sortedElements =
    sortField !== ''
      ? (() => {
          const column = columns.find(({ header }) => sortField === header.id);
          let ret = [...elements];
          if (column.comparator) {
            ret.sort(column.comparator);
          } else {
            ret = sortBy(ret, column.path);
          }
          if (!sortDirection) ret.reverse();
          return ret;
        })()
      : elements;
</script>

{#if elements.length > 0}
  <div class="min-w-full max-h-94.5 mt-8 {!fluid ? 'overflow-y-auto' : ''} {clazz}">
    <table class="min-w-full border-collapse">
      {#if headers != null && headers.length > 0}
        <thead class="sticky -top-px z-20 bg-gray">
          <tr class="bg-gray">
            {#each headers as header}
              {#if header?.options?.override}
                <th {...header.options}>
                  <div class="flex flex-row items-center">
                    <span>{header.title}</span>
                    {#if typeof header.allowSorting === 'undefined' || header.allowSorting}
                      <Sort
                        onSortAsc={() => {
                          sortField = header.id;
                          sortDirection = true;
                        }}
                        onSortDesc={() => {
                          sortField = header.id;
                          sortDirection = false;
                        }}
                      />
                    {/if}
                  </div>
                </th>
              {:else}
                <th
                  class={`text-gray-1 font-medium text-sm text-left px-2 py-2.5 sticky top-0 z-20 ${
                    header?.options?.class ?? ''
                  }`}
                >
                  <div class="flex flex-row items-center">
                    <span>{header.title}</span>
                    {#if typeof header.allowSorting === 'undefined' || header.allowSorting}
                      <Sort
                        onSortAsc={() => {
                          sortField = header.id;
                          sortDirection = true;
                        }}
                        onSortDesc={() => {
                          sortField = header.id;
                          sortDirection = false;
                        }}
                      />
                    {/if}
                  </div>
                </th>
              {/if}
            {/each}
          </tr>
        </thead>
      {/if}
      <tbody>
        {#each sortedElements as object, rowIndex}
          <tr
            class="text-sm transition-all ease-in-out duration-200 hover-show"
            class:cursor-pointer={onRowClick != null}
            on:click={() => onRowClick(object, rowIndex)}
          >
            {#each columns as column}
              <td class="px-2 py-2.5">
                {#if column.component != null}
                  <svelte:component
                    this={column.component}
                    {...column.options?.(
                      get(object, column.path, object),
                      rowIndex
                    )}
                  />
                {:else}
                  <div class="truncate max-w-48 sm:max-w-56 w-full"
                    {...column.options?.(
                      get(object, column.path, object),
                      rowIndex
                    )}
                  >
                    {column.transform?.(
                      get(object, column.path, object),
                      rowIndex
                    ) ?? get(object, column.path, object)}
                  </div>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <p class="min-w-full my-6">You haven't uploaded anything yet.</p>
{/if}
