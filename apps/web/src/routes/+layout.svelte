<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	import CreateByLinkModal from '../Components/modals/CreateByLinkModal.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let {
		children
	}: {
		children: Snippet;
	} = $props();

	let createByLinkModal: CreateByLinkModal;

	const handleSearchChanged: HTMLInputAttributes['onkeypress'] = function (e) {
		const value = e.currentTarget.value;

		if (e.key === 'Enter' && value !== '') {
			goto('/search?d=' + value);
		}
	};
</script>

<CreateByLinkModal bind:this={createByLinkModal} />

<div class="bg-base-300 text-base-content fixed z-[199] w-full border-b border-gray-300 py-3">
	<div class="container mx-auto flex justify-between">
		<div class="flex items-center gap-4">
			<h5 class="font-medium"><a href={resolve('/')} class="">Resource Dex</a></h5>

			<button class="btn" onclick={() => createByLinkModal.show()}> Create By url</button>
		</div>
		<div class="w-3/6 min-w-[300px]">
			<input
				type="text"
				onkeypress={handleSearchChanged}
				class="input w-full"
				placeholder="Search"
			/>
		</div>

		<div class="">
			<ul class="flex justify-end">
				<li class=""><a href={resolve('/upload')} class="">Upload</a></li>
			</ul>
		</div>
	</div>
</div>

<!-- Shortcut button  -->

<div class="fixed bottom-5 right-5"></div>

{@render children()}
