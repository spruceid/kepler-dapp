<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { PrimaryButton } from 'components';
  import { initWallet, uris } from 'src/store';
  import './splash.scss';

  const navigate = useNavigate();
  const connect = async () => {
    await initWallet();
  };
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
                <PrimaryButton
                  onClick={() => connect()}
                  text="Connect Wallet"
                />
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
