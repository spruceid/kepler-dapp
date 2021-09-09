<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { Button, BasePage } from 'components';
  import { uris, walletData, uploadToKepler, fetchAllUris } from 'src/store';
  import { onMount } from 'svelte';

  const navigate = useNavigate();

  let files;

  const upload = async () => {
    try {
      await uploadToKepler(files);
    } catch (e) {
      console.error(e);
    }
  };
</script>

<BasePage>
  <div class="text-2xl font-bold body">My Storage</div>

  <Button onClick={() => fetchAllUris()} text="Reload" />

  <div class="flex flex-col items-center">
    <div class="mr-4 flex flex-col">
      <!-- {#if $walletData} -->
        <input type="file" bind:files />
        <Button onClick={() => upload()} text="Upload" />
      <!-- {/if} -->
    </div>

    <div class="flex-col flex-wrap items-center justify-center">
      <ul>
        {#each $uris as uri}
          <li>{uri}</li>
        {/each}
      </ul>
    </div>
  </div>
</BasePage>
