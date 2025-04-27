<script lang="ts">
  import {
    backIn,
    backOut,
    bounceIn,
    bounceInOut,
    circInOut,
    cubicIn,
    elasticIn,
    elasticOut
  } from 'svelte/easing';
  import type { HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
  import { fade, scale } from 'svelte/transition';
  import { getLinkDetails } from '~/api/link';
  import type { FromReturnedPromise } from '~/api/types';
  import icon from '~/assets/icosea';

  let {
    isShow = $bindable(true),
    onCreate
  }: {
    isShow?: boolean;
    onCreate?: (data: unknown) => void;
  } = $props();
  let previewData = $state<FromReturnedPromise<typeof getLinkDetails>>();

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
      return;
    }
  }

  const handle_key_down: HTMLInputAttributes['onkeydown'] = (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    const value = e.target.value;
    if (!value) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      checkIfValidUrl(value);
      getLinkDetails(value).then((v) => (previewData = v));
    }
  };

  const handle_on_paste: HTMLInputAttributes['onpaste'] = (e) => {
    console.log('onpaste event fired', e);
    if (!(e.target instanceof HTMLInputElement)) return;
    const textData = e.clipboardData?.getData('text');
    checkIfValidUrl(textData);
    if (!textData) return;
    getLinkDetails(textData).then((v) => (previewData = v));
  };

  const handle_paste_btn_click: HTMLButtonAttributes['onclick'] = function (e) {
    const inputElement = document.getElementById('create-by-link__link-input') as
      | HTMLInputElement
      | undefined;
    if (!inputElement) return;
    navigator.clipboard.readText().then((v) => {
      inputElement.value = v;
      checkIfValidUrl(v);
      getLinkDetails(v).then((v) => (previewData = v));
    });
  };
</script>

{#if isShow}
  <div transition:fade={{ duration: 200 }} class="fixed w-full h-full bg-black/50"></div>
  <div
    out:scale={{ easing: backOut, duration: 350 }}
    in:scale={{ easing: circInOut, duration: 350 }}
    class="fixed w-[600px] border bg-white left-1/2 top-1/5 -translate-x-1/2 rounded-lg"
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

      <div class="text-center mt-4">
        <button onclick={hide} class="btn">Cancel</button>
        <button disabled={!previewData} onclick={() => onCreate?.('hello')} class="btn btn-success"
          >Create</button
        >
      </div>
    </div>
  </div>
{/if}
