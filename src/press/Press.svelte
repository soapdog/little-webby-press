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
    border: solid 4px #4240d4;
  }

  .action-items {
    position: fixed;
    bottom: 0px;
  }

  .full-height {
    height: calc(100vh - 0.8rem);
  }
</style>

<div class="container grid-lg">
  <div class="columns m-2 full-height">
    <div class="column bg-secondary">
      <Nav />
      {#if error}
        <toast class="toast toast-error m-2">
          Error initializing filesystem: {error}
        </toast>
      {/if}
      {#if stage !== 'loaded'}
        <div class="empty drop-area" class:over={stage == 'over'}>
          {#if stage == 'over'}
            <div class="empty-icon">
              <i class="fas fa-smile-wink fa-3x" />
            </div>
            <p class="empty-title h5">Drop a book folder here!</p>
          {:else if stage == 'waiting'}
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
          {:else if stage == 'loading'}
            <div class="empty-icon">
              <i class="fas fa-spinner fa-3x fa-spin" />
            </div>
            <p class="empty-title h5">Loading...</p>
            <p class="empty-subtitle">{msg}</p>
          {/if}
        </div>
      {:else}
        <Editor {book} />
      {/if}
    </div>
  </div>
</div>
