<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { Button, BasePage } from 'components';
  import { files, walletData, uploadToKepler, fetchAllUris } from 'src/store';
  import { onMount } from 'svelte';
  import { formatBytes } from 'src/helpers';

  const navigate = useNavigate();

  let filesToUpload;

  const upload = async () => {
    try {
      await uploadToKepler(filesToUpload);
    } catch (e) {
      console.error(e);
    }
  };
</script>

<BasePage>
  <div class="p-16">
    <div class="text-2xl font-bold body mb-6">My Storage</div>

    <!-- <Button onClick={() => fetchAllUris()} text="Reload" /> -->

    <div class="flex flex-col flex-grow">
      <!-- <div class="mr-4 flex flex-col">
        {#if $walletData}
        <input type="file" bind:filesToUpload />
        <Button onClick={() => upload()} text="Upload" />
        {/if}
      </div> -->

      <table class="table-auto">
        <thead>
          <tr
            class="text-sm text-gray-500 font-medium border-b border-gray-650"
          >
            <td class="py-6 px-3">Name</td>
            <td class="py-6 px-3">Size</td>
            <td class="py-6 px-3">Type</td>
            <td class="py-6 px-3">Created</td>
            <td class="py-6 px-3">IPFS CID</td>
            <td class="py-6 px-3">Status</td>
          </tr>
        </thead>

        <tbody>
          {#each $files as file}
            <tr class="text-sm border-b border-gray-650">
              <td class="py-5 px-3 font-bold">{file.name}</td>
              <td class="py-5 px-3">{formatBytes(file.size)}</td>
              <td class="py-5 px-3">{file.type}</td>
              <td class="py-5 px-3"
                >{file.createdAt.toLocaleString(undefined, {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                })}</td
              >
              <td class="py-5 px-3">{file.cid}</td>
              <td class="py-5 px-3">{file.status}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</BasePage>
