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
.controls {
  position: fixed;
  bottom: 20px;
  width: 910px;
  margin: auto
}
</style>

<div class="container">
  <ul class="tab tab-block">
    <li
      class="tab-item"
      class:active={currentView == 'options'}
      on:click|preventDefault={() => (currentView = 'options')}>
      <a href="#">Options</a>
    </li>
    <li
      class="tab-item"
      class:active={currentView == 'metadata'}
      on:click|preventDefault={() => (currentView = 'metadata')}>
      <a href="#">Metadata</a>
    </li>
    <li
      class="tab-item"
      class:active={currentView == 'files'}
      on:click|preventDefault={() => (currentView = 'files')}>
      <a href="#">Files</a>
    </li>
  </ul>
  <div class="columns tab">
    <svelte:component this={views[currentView]} {book} />
  </div>
  <div class="controls">
    <EditorControls {book} />
  </div>
</div>
