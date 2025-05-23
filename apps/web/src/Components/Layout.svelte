<script lang="ts">
  import { route } from '@mateothegreat/svelte5-router';
  import type { Snippet } from 'svelte';
  import { render } from 'svelte/server';
  import CreateByLinkModal from './modals/CreateByLinkModal.svelte';

  let {
    children
  }: {
    children: Snippet;
  } = $props();

  let createByLinkModal: CreateByLinkModal;
</script>

<CreateByLinkModal bind:this={createByLinkModal} />

<div class="bg-base-300 py-3 fixed w-full z-[199] border-gray-300 border-b text-base-content">
  <div class="container mx-auto flex">
    <div class="flex items-center gap-4">
      <h5 class="font-medium"><a href="/" use:route class="">Resource Dex</a></h5>

      <button class="btn" onclick={() => createByLinkModal.show()}> Create By url</button>
    </div>

    <div class="flex-1">
      <ul class="flex justify-end">
        <li class=""><a href="/upload" use:route class="">Upload</a></li>
      </ul>
    </div>
  </div>
</div>

<!-- Shortcut button  -->

<div class="fixed right-5 bottom-5"></div>

{@render children()}
