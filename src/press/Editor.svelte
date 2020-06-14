<script>
  import TabFiles from "./TabFiles.svelte";
  import TabOptions from "./TabFiles.svelte";
  import TabMetadata from "./TabMetadata.svelte";

  export let book;

  let views = {
    files: TabFiles,
    options: TabOptions,
    metadata: TabMetadata
  };

  let currentView = "files";
</script>

<div class="container">
  <ul class="tab tab-block">
    <li class="tab-item" class:active={currentView == "options"} on:click|preventDefault={() => currentView = "options"}>
      <a href="#">Options</a>
    </li>
    <li class="tab-item" class:active={currentView == "metadata"} on:click|preventDefault={() => currentView = "metadata"}>
      <a href="#">Metadata</a>
    </li>
    <li class="tab-item" class:active={currentView == "files"} on:click|preventDefault={() => currentView = "files"}>
      <a href="#">Files</a>
    </li>
    <li class="tab-item" class:active={currentView == "preview"} on:click|preventDefault={() => currentView = "preview"}>
      <a href="#">Preview</a>
    </li>
  </ul>
  <div class="columns">
    <svelte:component this={views[currentView]} {book} />
  </div>
</div>
