<script lang="ts">
	import FilesDragAndDrop from '@/Components/FilesDragAndDrop.svelte';
	import FilesUploader from '@/Components/FiresUploader.svelte';

	let files = $state.raw<FileList>();
</script>

<div class="container mx-auto">
	<div class="grid grid-cols-4 gap-x-4 gap-y-8 pt-20">
		<FilesUploader
			file={new File(['hello'], 'productized-design-figma_NjdlY2Y0MTI0NTk2ZTUwMDM4MWY2ZjNm')}
		/>
		<FilesUploader
			file={new File(['hello'], ' 2 productized-design-figma_NjdlY2Y0MTI0NTk2ZTUwMDM4MWY2ZjNm')}
		/>
		<FilesUploader
			file={new File(['hello'], '3 productized-design-figma_NjdlY2Y0MTI0NTk2ZTUwMDM4MWY2ZjNm')}
		/>
		<FilesUploader
			file={new File(['hello'], '4 productized-design-figma_NjdlY2Y0MTI0NTk2ZTUwMDM4MWY2ZjNm')}
		/>
	</div>

	{#if files?.length}
		<ul>
			{#each files as file, idx (file.name + idx)}
				<li class="">{file.name}</li>
			{/each}
		</ul>
	{:else}
		<FilesDragAndDrop onFiles={(_f) => (files = _f)} />
	{/if}
</div>
