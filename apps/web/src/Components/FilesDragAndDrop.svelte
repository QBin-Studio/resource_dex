<script lang="ts">
  import type { ChangeEventHandler, DragEventHandler } from 'svelte/elements';

  let {
    onFiles
  }: {
    onFiles?: (files: FileList) => void;
  } = $props();

  let is_dragged = $state(false);

  const handle_file_drop: DragEventHandler<HTMLDivElement> = function (e) {
    e.preventDefault();
    is_dragged = false;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFiles?.(files);
    }
  };

  const handle_input_changes: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target instanceof HTMLInputElement) {
      if (e.target.files?.length) {
        onFiles?.(e.target.files);
      }
    }
  };
</script>

<div
  tabindex="0"
  role="button"
  ondragover={(e) => {
    e.preventDefault();
    is_dragged = true;
  }}
  ondragleave={() => (is_dragged = false)}
  ondrop={handle_file_drop}
  class="bg-base-200 select-none rounded mt-8 w-full border-2 text-center py-40 space-y-3 border-dashed {is_dragged
    ? 'border-cyan-400'
    : 'border-gray-800'}"
>
  <p class="text-black underline underline-offset-8">Drop your Files here</p>
  <p class="">or</p>
  <div class="">
    <label for="files-upload" class="btn btn-neutral">
      <input
        onchange={handle_input_changes}
        multiple
        id="files-upload"
        type="file"
        name=""
        class="hidden"
      />
      <span class="">Click Here to Upload Files</span>
    </label>
  </div>
</div>
