<script lang="ts">
  import icon from '~/assets/icosea';

  let {
    file
  }: {
    file: File;
  } = $props();
</script>

<div class="p-2 border rounded-lg">
  <div class="bg-slate-200 aspect-[16/6] rounded-lg">
    <div class="p-2 pt-6 text-center grid place-items-center">
      <p class="text-slate-400">No Thumbnail Link Found</p>
      <div
        class="flex w-full border border-gray-300 group ring-2 ring-transparent focus-within:ring-neutral items-center rounded bg-gray-100"
      >
        <button
          tabindex="-1"
          class="text-xl hover:bg-gray-100 group-focus-within:text-neutral group-focus-within:border-r-neutral cursor-pointer text-gray-400 px-1 border-r"
        >
          {@html icon('link')}</button
        >
        <input
          type="text"
          class="h-auto font-medium focus:outline-0 font-mono tracking-tight pl-1.5 text-sm py-0.5 border-0 w-full"
          placeholder="Paste thumbnail link here"
        />
      </div>
    </div>
  </div>
  <div class=" mt-1.5">
    <p class="bg-gray-100 text-sm px-2 py-0.5 border text-gray-600 rounded font-mono">
      {file.name}
    </p>

    <div
      class="flex mt-3 border border-gray-300 group ring-2 ring-transparent focus-within:ring-primary rounded bg-gray-50"
    >
      <button
        tabindex="-1"
        class="text-xl hover:bg-gray-100 group-focus-within:text-primary group-focus-within:border-r-primary cursor-pointer text-gray-400 px-1 border-r"
      >
        {@html icon('link')}</button
      >
      <textarea
        class="h-auto font-medium max-h-[50px] min-h focus:outline-0 font-mono tracking-tight pl-1.5 text-sm py-0.5 border-0 w-full"
        placeholder="Paste content link"
      ></textarea>
    </div>

    <div class="text-xs mt-3 text-gray-500">
      <p class="">Platform: <strong>{'ui8'}</strong></p>
    </div>

    <div class=" join join-item w-full mt-2">
      <button class="btn flex-1 btn-xs text-xs text-error">Remove</button>
      <button class="btn flex-1 btn-xs text-xs btn-success">Save</button>
    </div>
  </div>
</div>
