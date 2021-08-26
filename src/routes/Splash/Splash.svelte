<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { PrimaryButton } from 'components';
  import { initWallet } from 'src/store';
  import './splash.scss';

  const navigate = useNavigate();
  const connect = async () => {
    await initWallet();
  };
</script>

<div class="flex items-center justify-center h-screen">
  <PrimaryButton onClick={() => connect()} text="Connect Wallet" />
</div>
