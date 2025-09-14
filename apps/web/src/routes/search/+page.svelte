<script lang="ts">
	import { page } from '$app/state';
	import { openInFileManager, searchFilesByString } from '@/api/files';
	import icon from '@/assets/icosea';
	import { copy_text } from '@/lib/common/copy';

	// let { ...restProps }: {} = $props();
	const searchParam = $derived(page.url.searchParams);

	const searchedResult = $derived.by(async () => {
		const searchStr = searchParam.get('d');
		if (searchStr) {
			const v = await searchFilesByString(searchStr);
			return v;
		} else {
			return Promise.resolve(undefined);
		}
	});
</script>

<div class="container mx-auto pt-20">
	<div class="card my-10 flex-row gap-4">
		<button class="btn btn-sm"> Back </button>
		<h1 class="text-2xl">
			Search Result For <span class=" font-bold underline">{searchParam.get('d')}</span>
		</h1>
	</div>

	{#await searchedResult}
		<p>Looking for result</p>
	{:then result}
		{#if result?.data}
			<div class="flex flex-wrap">
				{#each result.data as data (data.id)}
					<div class=" p-4">
						<div
							class="card hover:ring-primary ring-2l bg-base-200 block w-96 max-w-[350px] border text-start ring-transparent"
						>
							<figure>
								<img src={data.thumbnail} alt="Shoes" class="aspect-[4/2.5] object-cover" />
							</figure>
							<div class="card-body p-4">
								<p class="card-title line-clamp-2 text-base">{data.name}</p>
							</div>
							<div class="card-actions">
								<button
									onclick={() => openInFileManager(data.location)}
									class="btn btn-xs text-base">{@html icon('open-file')}</button
								>
								<a href={data.meta_url} target="_blank" class="btn btn-xs text-base"
									>{@html icon('open-link')}</a
								>

								<button onclick={() => copy_text(data.location)} class="btn btn-xs text-base"
									>{@html icon('copy_file')}</button
								>
								<button onclick={() => copy_text(data.location)} class="btn btn-xs text-base"
									>Delete</button
								>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/await}
</div>
