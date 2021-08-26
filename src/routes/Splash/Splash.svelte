<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import {PrimaryButton} from 'components';
  import './splash.scss';

  const navigate = useNavigate();
  const connect = () => {
    console.log('Hello World');
  };
</script>

<div class="flex items-center justify-center h-screen">
  <PrimaryButton onClick={() => connect()} text="Connect Wallet" />
</div>
