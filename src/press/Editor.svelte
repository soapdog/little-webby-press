<script>
  import TabFiles from "./TabFiles.svelte";

  export let book;

  let views = {
    files: TabFiles
  };

  let currentView = "files";

  
</script>

<div class="container">
  <ul class="tab tab-block">
    <li class="tab-item" class:active={currentView == 'options'}>
      <a href="#">Options</a>
    </li>
    <li class="tab-item" class:active={currentView == 'metadata'}>
      <a href="#">Metadata</a>
    </li>
    <li class="tab-item" class:active={currentView == 'files'}>
      <a href="#">Files</a>
    </li>
    <li class="tab-item" class:active={currentView == 'preview'}>
      <a href="#">Preview</a>
    </li>
  </ul>
  <div class="columns">
    <svelte:component this={views[currentView]} {book}/>
  </div>
</div>
