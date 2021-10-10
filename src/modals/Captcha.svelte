<script lang="ts">
  import { AllowListCaptcha, Button, TextBody1 } from 'components';
  import { captcha } from 'src/captcha';

  export let title: string;
  export let description: string;
  export let action: string;
  export let onSubmit: (data: any) => void;

  let enabled = false;
  let data: any;

  const captchaSubmit = (result) => {
    data = result;
    enabled = true;
  };

  const cancel = () => {
    captcha.set(null);
  };
</script>

<div
  class="absolute z-30 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-75"
>
  <div class="flex flex-col p-16 bg-gray-900 rounded-lg bg">
    <h5>{title}</h5>

    <TextBody1 class="mt-4" value={description} />

    <div class="self-center mt-8">
      <AllowListCaptcha onSubmit={captchaSubmit} />
    </div>

    <div class="flex flex-row mt-8">
      <Button text="Cancel" onClick={cancel} mini class="w-full uppercase" />

      <div class="w-8" />

      <Button
        text={action}
        disabled={!enabled}
        onClick={() => onSubmit(data)}
        mini
        class="w-full uppercase"
      />
    </div>
  </div>
</div>
