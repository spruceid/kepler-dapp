<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { PrimaryButton } from 'components';
  import {
    initWallet,
    uris,
    wallet,
    uploadToKepler,
    fetchAllUris,
  } from 'src/store';
  import './splash.scss';
  import { onMount } from 'svelte';

  const navigate = useNavigate();
  const connect = async () => {
    await initWallet();
  };

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

<div class="flex items-center justify-center h-screen">
  <div class="flex flex-wrap justify-center w-full h-full">
    <div
      class="flex flex-col self-center justify-around overflow-visible md:mx-10"
    >
      <div class="table-container fade-in dropshadow-default mb-20">
        <div class="header-row-container">
          <div class="body flex flex-row items-center w-full justify-between">
            <div class="text-2xl font-bold body">My Storage</div>

            <div class="flex flex-row items-center">
              <div class="mr-4">
                {#if $wallet}
                  <input type="file" bind:files />
                  <PrimaryButton onClick={() => upload()} text="Upload" />
                {:else}
                  <PrimaryButton
                    onClick={() => connect()}
                    text="Connect Wallet"
                  />
                {/if}
              </div>
            </div>
          </div>
        </div>

        <div class="flex-col flex-wrap items-center justify-center">
          <ul>
            {#each $uris as uri}
              <li>{uri}</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
