<script>
  import Nav from "./Nav.svelte";
  import Editor from "./Editor.svelte";
  import { getFilesFromDataTransferItems } from "datatransfer-files-promise";
  import { onMount } from "svelte";
  import { processDroppedFiles } from "./utils.js";

  let stage = "waiting"; // loading, loaded, over
  let msg, files, book;
  let error = false;

  function readFile(file) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsText(file.blob);
    });
  }

  onMount(() => {
    const dropzone = document.querySelector(".drop-area");
    dropzone.addEventListener("dragover", evt => {
      evt.preventDefault();
      stage = "over";
    });
    dropzone.addEventListener("dragleave", evt => {
      evt.preventDefault();
      stage = "waiting";
    });
    dropzone.addEventListener("drop", async evt => {
      evt.preventDefault();

      msg = "Getting file list...";
      stage = "loading";
      files = await window.getFilesFromDataTransferItems(
        evt.dataTransfer.items
      );

      msg = "Loading configuration...";
      book = await processDroppedFiles(files);
      if (book instanceof Error) {
        stage = "error";
        msg = book.message;
      } else {
        stage = "loaded";
      }
    });
  });
</script>

<style>
  .over {
    border: solid 4px #e3f2fd;
  }

  .action-items {
    position: fixed;
    bottom: 0px;
  }

  .full-height {
    height: calc(100vh - 48px);
  }
</style>

<div
  class="container-fluid p-0 mx-auto full-height drop-area"
  >

  <Nav />
  {#if error}
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <img src="..." class="rounded mr-2" alt="..." />
        <strong class="mr-auto">Error</strong>
        <button
          type="button"
          class="ml-2 mb-1 close"
          data-dismiss="toast"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">Error initializing filesystem: {error}</div>
    </div>
  {/if}
  {#if stage !== 'loaded'}
    <div class="d-flex justify-content-center align-items-center h-100 text-center" class:over={stage == 'over'}>
      {#if stage == 'over'}
        <div>
          <div class="empty-icon">
            <i class="fas fa-smile-wink fa-3x" />
          </div>
          <p class="empty-title h5">Drop a book folder here!</p>
        </div>
      {:else if stage == 'waiting'}
        <div>
          <div class="empty-icon">
            <i class="fas fa-book fa-3x" />
          </div>
          <p class="empty-title h5">The book is empty.</p>
          <p class="empty-subtitle">
            Drag &amp; Drop a folder with book data here to start.
          </p>
          <div class="empty-action">
            <button class="btn btn-primary">
              Learn more about how to build books using
              <em>little.webby.press</em>
            </button>
          </div>
        </div>
      {:else if stage == 'loading'}
        <div>
          <div class="empty-icon">
            <i class="fas fa-spinner fa-3x fa-spin" />
          </div>
          <p class="empty-title h5">Loading...</p>
          <p class="empty-subtitle">{msg}</p>
        </div>
      {/if}
    </div>
  {:else}
    <Editor {book} />
  {/if}
</div>
