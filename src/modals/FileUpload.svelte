<script lang="ts">
  import { Button, TextBody1, CloudUpload, TrashIcon } from 'components';
  import { captcha } from 'src/captcha';
  import filesize from 'filesize';

  // export let title: string;
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

<div class="flex flex-col w-full h-full">

  <div class="mt-5.5"
    class:bg-opacity-5={!active}
    class:bg-opacity-50={active}
    ondragover="return false"
    on:dragenter|stopPropagation|preventDefault={setActive}
    on:dragleave|stopPropagation|preventDefault={setInactive}
    on:drop|stopPropagation|preventDefault={onDrop}>
      {#if count === 0}
        <div class="border-2 border-green border-dotted min-h-70 flex flex-col items-center justify-center text-center border-opacity-75">
          <div class="p-2 flex flex-col">
            <div class="flex items-center">
              <TextBody1 class="inline-block" value="Drag files or " />
              <label class="inline-block cursor-pointer" for="file-upload">
                <TextBody1 class="font-bold" value="click to add" />
              </label>
              <input
                class="hidden"
                type="file"
                id="file-upload"
                name="file-upload"
                on:change={onInput}
                multiple
              />
            </div>
            <p class="text-gray-1 tracking-wide font-bold text-xs mt-1">(25 MB Limit)</p>
          </div>
        </div>
      {:else}
        <div class="p-2">
          <div class="flex flex-col overflow-y-auto max-h-78">
            <div class="flex flex-wrap items-center justify-center text-center px-2 sm:px-10 py-2 mb-2.5 border-2 border-dotted border-green">
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
                multiple
              />
            </div>

            <div class="flex flex-col ">
              {#each files as file, i}
                <div class="flex flex-row items-center pl-1 pr-4 py-2.5">
                  <span class="flex-grow text-sm tracking-wide break-all w-8/12 pr-3">{file.name}</span>
                  <span class="flex-grow-0 w-2/12 text-xs">{filesize(file.size)}</span>
                  <span
                    class="flex-grow-0 ml-4 flex items-center justify-center cursor-pointer w-2/12"
                    on:click={() => remove(i)}
                  >
                    <TrashIcon class="w-7 h-7 p-1.5 border border-green rounded-full" />
                  </span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
  </div>

  <div class="mx-auto mt-auto">

    <Button
      text={count > 0 ? `Upload ${count} file(s)` : 'Upload'}
      disabled={count === 0}
      onClick={() => onSubmit(files)}
      class="min-w-38.5"
    />
  </div>
</div>
