<script>
  import TabFiles from "./TabFiles.svelte";
  import TabOptions from "./TabOptions.svelte";
  import TabMetadata from "./TabMetadata.svelte";
  import EditorControls from "./EditorControls.svelte";

  export let book;

  let views = {
    files: TabFiles,
    options: TabOptions,
    metadata: TabMetadata
  };

  let currentView = "options";
</script>
<style>
</style>

<div class="container mx-auto m-4 ">
  <ul class="nav nav-pills nav-fill">
    <li
      class="nav-item"
      on:click|preventDefault={() => (currentView = 'options')}>
      <a class="nav-link" class:active={currentView == 'options'} href="#">
        Options
      </a>
    </li>
    <li
      class="nav-item"
      on:click|preventDefault={() => (currentView = 'metadata')}>
      <a class="nav-link" class:active={currentView == 'metadata'} href="#">
        Metadata
      </a>
    </li>
    <li
      class="nav-item"
      on:click|preventDefault={() => (currentView = 'files')}>
      <a class="nav-link" class:active={currentView == 'files'} href="#">
        Files
      </a>
    </li>
  </ul>
  <div class="columns tab">
    <svelte:component this={views[currentView]} {book} />
  </div>
  <EditorControls {book} />
</div>
