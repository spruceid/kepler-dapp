<script lang="ts">
  import { Button, FullLogo, AllowListCaptcha } from 'components';
  import { createOrbit } from 'src/store';
  import { captcha } from 'src/captcha';
  import type { Captcha } from 'src/captcha';

  const handleCaptchaResult = async (token) => {
    console.log('handleCaptchaResult', token);
    await createOrbit(token);
  };

  const createNewOrbit = async () => {
      await createOrbit();
  };
</script>

<div class="flex flex-col items-center border-r py-9 lg:w-64 border-gray-650">
  <FullLogo class="w-64 px-10" />
  <Button
    class="mx-10 mt-10"
    fluid
    text="Create new orbit"
    onClick={createNewOrbit}
  />
</div>
