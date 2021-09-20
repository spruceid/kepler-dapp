<script lang="ts">
  import { createOrbit } from 'src/store';
  import 'vanilla-hcaptcha';

  const submit = async ({ token }) => {
    console.log('captcha: ', token);
    await createOrbit(token);
  };
</script>

<h-captcha
  on:verified={submit}
  site-key="10000000-ffff-ffff-ffff-000000000001"
/>
