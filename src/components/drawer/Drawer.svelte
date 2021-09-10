<script lang="ts">
  import { Button, FullLogo } from 'components';
  // import 'allowlist-hcaptcha-component';

  let showCaptcha: boolean;

  const createNewOrbit = () => {
    showCaptcha = true;
  };

  const handleCaptchaResult = (result) => {};
</script>

<div class="flex flex-col py-9 items-center lg:w-64 border-r border-gray-650">
  <FullLogo class="px-10 w-64" />
  <Button
    class="mx-10 mt-10"
    fluid
    text="Create new orbit"
    onClick={createNewOrbit}
  />
<!-- 
  {#if showCaptcha}
    <allowlist-captcha
      allowlistapi="http://localhost:8000/"
      controllers={['did:example:1', 'did:example:2']}
      params="did;did=did:example:1"
      sitekey="10000000-ffff-ffff-ffff-000000000001"
      onResult={handleCaptchaResult}
    />
  {/if} -->
</div>
