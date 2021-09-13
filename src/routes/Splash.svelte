<script lang="ts">
  import { FullLogo, Button, TextBody1 } from 'components';
  import { useNavigate } from 'svelte-navigator';

  const navigate = useNavigate();

  const launchApp = () => {
    navigate('/app');
  };
</script>

<div class="flex flex-grow flex-col justify-between bg-indigo-600">
  <header>
    <div class="flex flex-row pt-20 md:px-20 px-8 items-center justify-between">
      <FullLogo />
      <Button text="Launch App" onClick={launchApp} mini class="uppercase" />
    </div>
  </header>
  <main>
    <div class="flex flex-col md:px-20 px-8 py-20">
      <div class="grid grid-cols-2">
        <div>
          <h2>Self-Sovereign Storage</h2>

          <TextBody1
            value="kepler is a decentralized storage network for high data
          availability, keypair and capabilities-based permissioning, and
          controlled data sharing."
          />

          <Button
            text="Learn more"
            onClick={() => {}}
            mini
            class="uppercase mt-3"
          />
        </div>

        <div />
      </div>
    </div>
  </main>
  <footer>
    <div class="flex flex-row flex-grow py-3 md:px-20 px-8 bg-blue-900">
      <p>Kepler &copy; 2021</p>
    </div>
  </footer>
</div>
