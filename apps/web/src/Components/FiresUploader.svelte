<script lang="ts">
	import icon from '@/assets/icosea';

	let {
		file
	}: {
		file: File;
	} = $props();
</script>

<div class="rounded-lg border p-2">
	<div class="aspect-[16/6] rounded-lg bg-slate-200">
		<div class="grid place-items-center p-2 pt-6 text-center">
			<p class="text-slate-400">No Thumbnail Link Found</p>
			<div
				class="focus-within:ring-neutral group flex w-full items-center rounded border border-gray-300 bg-gray-100 ring-2 ring-transparent"
			>
				<button
					tabindex="-1"
					class="group-focus-within:text-neutral group-focus-within:border-r-neutral cursor-pointer border-r px-1 text-xl text-gray-400 hover:bg-gray-100"
				>
					{@html icon('link')}</button
				>
				<input
					type="text"
					class="h-auto w-full border-0 py-0.5 pl-1.5 font-mono text-sm font-medium tracking-tight focus:outline-0"
					placeholder="Paste thumbnail link here"
				/>
			</div>
		</div>
	</div>
	<div class=" mt-1.5">
		<p class="rounded border bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-600">
			{file.name}
		</p>

		<div
			class="focus-within:ring-primary group mt-3 flex rounded border border-gray-300 bg-gray-50 ring-2 ring-transparent"
		>
			<button
				tabindex="-1"
				class="group-focus-within:text-primary group-focus-within:border-r-primary cursor-pointer border-r px-1 text-xl text-gray-400 hover:bg-gray-100"
			>
				{@html icon('link')}</button
			>
			<textarea
				class="min-h h-auto max-h-[50px] w-full border-0 py-0.5 pl-1.5 font-mono text-sm font-medium tracking-tight focus:outline-0"
				placeholder="Paste content link"
			></textarea>
		</div>

		<div class="mt-3 text-xs text-gray-500">
			<p class="">Platform: <strong>{'ui8'}</strong></p>
		</div>

		<div class=" join join-item mt-2 w-full">
			<button class="btn btn-xs text-error flex-1 text-xs">Remove</button>
			<button class="btn btn-xs btn-success flex-1 text-xs">Save</button>
		</div>
	</div>
</div>
