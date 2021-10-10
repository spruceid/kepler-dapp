<script lang="ts">
  import 'vanilla-hcaptcha';

  export let onSubmit: () => void;

  const submit = async (result) => {
    console.log('captcha: ', result);
    if (onSubmit) onSubmit(result.token);
  };
</script>

<h-captcha
  on:verified={submit}
  site-key="10000000-ffff-ffff-ffff-000000000001"
/>
