<script lang="ts">
  import { onDestroy } from 'svelte';

  import { captcha } from 'src/captcha.ts';
  import type { Captcha } from 'src/captcha.ts';

  import CaptchaModal from './Captcha.svelte';

  let show: bool = false;
  let data: Captcha = null;

  const unsub = captcha.subscribe((value) => {
    if (value) {
      show = true;
      data = value;
    } else {
      show = false;
      data = null;
    }
  });

  const submit = async (value: any) => {
    await data.callback(value);
    captcha.set(null);
  };

  onDestroy(unsub);
</script>

{#if show}
  <CaptchaModal
    title={data.title}
    description={data.description}
    action={data.action}
    onSubmit={submit}
  />
{/if}
