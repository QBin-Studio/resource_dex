<script lang="ts">
  import { backOut, circInOut } from 'svelte/easing';
  import type { HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
  import { fade, scale } from 'svelte/transition';
  import { createFilesByLink } from '~/api/files';
  import { getLinkDetails } from '~/api/link';
  import type { FromReturnedPromise } from '~/api/types';
  import icon from '~/assets/icosea';
  import { StatusState } from '@mrbns/svkit/states';
  let {
    isShow = $bindable(false),
    onCreate
  }: {
    isShow?: boolean;
    onCreate?: (data: unknown) => void;
  } = $props();
  let previewData = $state<FromReturnedPromise<typeof getLinkDetails>>();
  let inputUrl = $state<string>();
  let statusMessage = new StatusState();

  export const show = () => {
    isShow = true;
  };
  export const hide = () => {
    isShow = false;
    previewData = undefined;
  };

  function checkIfValidUrl(url: string | undefined) {
    if (!url || !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(url)) {
      alert('input content is not a valid URL');
      return false;
    }

    return true;
  }

  const resetModal = () => {
    const inputElement = document.getElementById('create-by-link__link-input') as
      | HTMLInputElement
      | undefined;
    if (!inputElement) return;
    previewData = undefined;
    inputElement.value = '';
  };
  const handle_key_down: HTMLInputAttributes['onkeydown'] = (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;

    inputUrl = e.target.value;

    if (!inputUrl) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!checkIfValidUrl(inputUrl)) return;
      getLinkDetails(inputUrl).then((v) => (previewData = v));
    }
  };

  const handle_on_paste: HTMLInputAttributes['onpaste'] = (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;

    inputUrl = e.clipboardData?.getData('text');
    if (!checkIfValidUrl(inputUrl)) return;
    if (!inputUrl) return;
    getLinkDetails(inputUrl).then((v) => (previewData = v));
  };

  const handle_paste_btn_click: HTMLButtonAttributes['onclick'] = function (e) {
    const inputElement = document.getElementById('create-by-link__link-input') as
      | HTMLInputElement
      | undefined;
    if (!inputElement) return;
    navigator.clipboard.readText().then((v) => {
      inputElement.value = v;
      inputUrl = v;
      if (!checkIfValidUrl(v)) return;
      getLinkDetails(v).then((v) => (previewData = v));
    });
  };

  const createFile = (url: string) => {
    statusMessage.set(10, 'pending', 'Creating New Resource');
    createFilesByLink({
      url,
      description: previewData?.description,
      img: previewData?.img,
      title: previewData?.title
    }).then((result) => {
      if (result.success) {
        resetModal();
        statusMessage.set(100, 'completed', result.message);
      } else {
        statusMessage.setFailed(result.message);
      }
    });
  };
</script>

{#if isShow}
  <div transition:fade={{ duration: 200 }} class="fixed w-full h-full bg-black/50 z-50"></div>
  <div
    out:scale={{ easing: backOut, duration: 350 }}
    in:scale={{ easing: circInOut, duration: 350 }}
    class="fixed w-[600px] border bg-white left-1/2 top-1/5 -translate-x-1/2 rounded-lg z-[51]"
  >
    <div class="relative pt-6 pb-2 px-4">
      {#if !previewData}
        <div
          class="absolute bg-gray-300/65 w-full h-full top-0 left-0 rounded-lg flex items-center justify-center"
        >
          <p class="">
            <span class="loading loading-ball loading-lg"></span>
            <span class="">Loading Previews</span>
          </p>
        </div>
        <div
          class="absolute bg-gray-400 w-full h-full top-0 rounded-lg left-0 flex items-center justify-center"
        >
          <p class="">Link Preview Will be Here. If available</p>
        </div>
      {/if}

      <!-- thumbnais -->
      <div class="aspect-[16/6] bg-gray-300 rounded-lg">
        <img src={previewData?.img} class="w-full h-full object-cover rounded-2xl" alt="" />
      </div>
      <h3 class="text-lg font-medium line-clamp-1">{previewData?.title}</h3>
      <p class="line-clamp-2">{previewData?.description}</p>
      <p class="">
        <a
          href={previewData?.url}
          target="_blank"
          class="text-accent-content underline line-clamp-1">{previewData?.url}</a
        >
      </p>
    </div>
    <div class="pt-2 pb-6 px-4">
      <div class="">
        <label for="create-by-link__link-input" class="mb-1 block"
          >{@html icon('link')} <span class="">Paste Link here</span></label
        >
        <div class="flex input w-full pr-1">
          <input
            autocomplete="off"
            onkeydown={handle_key_down}
            onpaste={handle_on_paste}
            type="text"
            id="create-by-link__link-input"
            class="block flex-1"
            placeholder="eg. https://ui8.net/file_unique_name"
          />
          <button onclick={handle_paste_btn_click} class="btn btn-soft btn-sm">Paste</button>
        </div>
      </div>
      {#if statusMessage.isCompleted()}
        <p class="text-success">{statusMessage.message}</p>
      {:else if statusMessage.isPending()}
        <p class="text-info">{statusMessage.message}</p>
      {:else if statusMessage.isFailed()}
        <p class="text-error">{statusMessage.message}</p>
      {/if}

      <div class="text-center mt-4">
        <button onclick={hide} class="btn">Cancel</button>
        <button
          disabled={!previewData || !inputUrl}
          onclick={() => createFile(inputUrl!)}
          class="btn btn-success">Create</button
        >
      </div>
    </div>
  </div>
{/if}
