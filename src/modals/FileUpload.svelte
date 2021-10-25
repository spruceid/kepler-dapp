<script lang="ts">
  import { Button, TextBody1, CloudUpload, TrashIcon } from 'components';
  import { captcha } from 'src/captcha';
  import filesize from 'filesize';

  export let title: string;
  export let onSubmit: (data: any) => void;

  let files = [];

  let active = false;

  $: count = files.length;

  const setActive = (event) => {
    active = true;
  };

  const setInactive = (event) => {
    active = false;
  };

  const onDrop = (event) => {
    active = false;
    files = [
      ...files,
      ...event.dataTransfer.files,
    ];
  };

  const onInput = (event) => {
    files = [...files, ...event.target.files];
  };

  const remove = (index) => {
    files = [...files.slice(0, index), ...files.slice(index + 1, files.length)];
  };
</script>

<div
  class="absolute z-30 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-75"
>
  <div class="flex flex-col px-16 py-8 bg-gray-900 rounded-lg bg">
    <h5>{title}</h5>

    <div
      class="p-2 mt-8 bg-white bg-opacity-5"
      class:bg-opacity-5={!active}
      class:bg-opacity-50={active}
      ondragover="return false"
      on:dragenter|stopPropagation|preventDefault={setActive}
      on:dragleave|stopPropagation|preventDefault={setInactive}
      on:drop|stopPropagation|preventDefault={onDrop}
    >
      <div class="p-2 border-4 border-white border-dashed border-opacity-50">
        {#if count === 0}
          <div class="px-32 py-16">
            <CloudUpload class="w-32 h-32 mx-auto text-white text-opacity-75" />
            <div class="opacity-75">
              <label class="inline-block cursor-pointer" for="file-upload">
                <TextBody1 class="font-bold" value="Choose a file" />
              </label>
              <TextBody1 class="inline-block" value=" or drag it here." />
              <input
                class="hidden"
                type="file"
                id="file-upload"
                name="file-upload"
                on:change={onInput}
                accept="application/json"
                multiple
              />
            </div>
          </div>
        {:else}
          <div class="p-4">
            <div class="flex flex-col">
              <div class="flex flex-row items-center px-16 mb-4 opacity-75">
                <CloudUpload class="w-8 h-8 mr-2 text-white text-opacity-75" />
                <div>
                  <label class="inline-block cursor-pointer" for="file-upload">
                    <TextBody1 class="font-bold" value="Choose another file" />
                  </label>
                  <TextBody1 class="inline-block" value=" or drag more here." />
                  <input
                    class="hidden"
                    type="file"
                    id="file-upload"
                    name="file-upload"
                    on:change={onInput}
                    accept="application/json"
                    multiple
                  />
                </div>
              </div>

              <div class="flex flex-col">
                {#each files as file, i}
                  <div
                    class="flex flex-row items-center px-4 py-2 rounded-lg hover:bg-black hover:bg-opacity-10"
                  >
                    <span class="flex-grow">{file.name}</span>
                    <span class="flex-grow-0">{filesize(file.size)}</span>
                    <span
                      class="flex-grow-0 ml-4 cursor-pointer"
                      on:click={() => remove(i)}
                    >
                      <TrashIcon class="w-4 h-4" />
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="flex flex-row mt-8">
      <Button text="Cancel" onClick={() => {}} mini class="w-full uppercase" />

      <div class="w-8" />

      <Button
        text={count > 0 ? `Upload ${count} file(s)` : 'Upload'}
        disabled={count === 0}
        onClick={() => onSubmit(files)}
        mini
        class="w-full uppercase"
      />
    </div>
  </div>
</div>
