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

<div class="step-2 pb-2 pt-7 px-11 rounded-2xl border-green border max-w-125 w-full mx-auto flex flex-col">
  <Button
    class="mx-auto"
    text="Create new orbit"
    onClick={createNewOrbit}
  />
  <p class="font-normal text-sm tracking-wide text-white mb-2.5 text-center pt-4">Create your first Orbit to get started</p>
</div>
