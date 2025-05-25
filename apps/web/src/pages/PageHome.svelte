<script lang="ts">
  import { getAllFiles, openInFileManager } from '~/api/files';
  import icon from '~/assets/icosea';
  import { copy_text } from '~/lib/common/copy';
</script>

<section class="p-8 pt-25">
  {#await getAllFiles()}
    <p>Loading</p>
  {:then result}
    <div class="flex flex-wrap gap-x-4 gap-y-6 justify-center">
      {#each result as data}
        <div
          class="card block text-start hover:ring-primary ring-2l ring-transparent max-w-[350px] bg-base-200 border w-96"
        >
          <figure>
            <img src={data.thumbnail} alt="Shoes" class="aspect-[4/2.5] object-cover" />
          </figure>
          <div class="card-body p-4">
            <p class="card-title text-base line-clamp-2">{data.name}</p>
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
