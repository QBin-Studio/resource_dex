<script lang="ts">
	import { getAllFiles, openInFileManager } from '@/api/files';
	import icon from '@/assets/icosea';
	import { copy_text } from '$lib/common/copy';
</script>

<section class="pt-25 p-8">
	{#await getAllFiles()}
		<p>Loading</p>
	{:then result}
		<div class="flex flex-wrap justify-center gap-x-4 gap-y-6">
			{#each result as data (data.id)}
				<div
					class="card hover:ring-primary ring-2l bg-base-200 block w-96 max-w-[350px] border text-start ring-transparent"
				>
					<figure>
						<img src={data.thumbnail} alt="Shoes" class="aspect-[4/2.5] object-cover" />
					</figure>
					<div class="card-body p-4">
						<p class="card-title line-clamp-2 text-base">{data.name}</p>
						{#if data.platform}
							<p class="">platform {data.platform.name}</p>
						{/if}
					</div>
					<div class="card-actions">
						<button onclick={() => openInFileManager(data.location)} class="btn btn-xs text-base"
							>{@html icon('open-file')}</button
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
			{/each}
		</div>
	{/await}
</section>
