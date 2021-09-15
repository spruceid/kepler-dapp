<script lang="ts">
  import get from 'lodash/get';
  import type { TableColumn } from '../../types';

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
   * Wheter the list content should expand itself
   */
  export let fluid: boolean = true;

  /**
   * Helper tailwind classes
   * https://tailwindcss.com/docs
   */
  let clazz: string;
  export { clazz as class };

  export let onRowClick: (element, index: number) => void;

  let headers = columns.map((column) => column.header);
</script>

{#if elements.length > 0}
  <div class="flex min-w-full {!fluid ? 'h-4/5 overflow-y-auto' : ''} {clazz}">
    <table class="border-collapse min-w-full">
      {#if headers != null && headers.length > 0}
        <thead>
          <tr class="border-b border-gray-650">
            {#each headers as header}
              {#if header?.options?.override}
                <th {...header.options}>{header.title}</th>
              {:else}
                <th
                  class={`text-gray-500 font-medium text-sm text-left px-3 py-6 ${
                    header?.options?.class ?? ''
                  }`}
                >
                  {header.title}
                </th>
              {/if}
            {/each}
          </tr>
        </thead>
      {/if}
      <tbody>
        {#each elements as object, rowIndex}
          <tr
            class="text-sm border-b border-gray-650 hover:bg-blue-800 hover:bg-opacity-10"
            class:cursor-pointer={onRowClick != null}
            on:click={() => onRowClick(object, rowIndex)}
          >
            {#each columns as column}
              <td class="py-5 px-3">
                {#if column.component != null}
                  <svelte:component
                    this={column.component}
                    {...column.options?.(
                      get(object, column.path, object),
                      rowIndex
                    )}
                  />
                {:else}
                  <div
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
  <p class="mt-8 mb-8 min-w-full">No items available</p>
{/if}
