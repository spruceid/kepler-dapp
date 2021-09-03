<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { Button, BasePage } from 'components';
  import { uris, wallet, uploadToKepler, fetchAllUris } from 'src/store';
  import { onMount } from 'svelte';

  const navigate = useNavigate();

  let files;

  const upload = async () => {
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      await uploadToKepler(formData);
    } catch (e) {
      console.error(e);
    }
  };

  onMount(async () => {
    await fetchAllUris();
  });
</script>

<BasePage>
  <div class="text-2xl font-bold body">My Storage</div>

  <div class="flex flex-col items-center">
    <div class="mr-4 flex flex-col">
      {#if $wallet}
        <input type="file" bind:files />
        <Button onClick={() => upload()} text="Upload" />
      {:else}{/if}
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
