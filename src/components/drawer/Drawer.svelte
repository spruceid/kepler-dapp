<script lang="ts">
  import { Button, FullLogo, AllowListCaptcha } from 'components';

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

  {#if showCaptcha}
    <AllowListCaptcha />
  {/if}
</div>
