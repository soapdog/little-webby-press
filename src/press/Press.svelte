<script>
  import Nav from "./Nav.svelte";
  import Editor from "./Editor.svelte";
  import { getFilesFromDataTransferItems } from "datatransfer-files-promise";
  import { onMount } from "svelte";
  import { initialize } from "./filesystem.js";
  import Book from "./book.js";
  import toml from "toml";

  let stage = "waiting"; // loading, loaded, over
  let msg, files, fs, book;
  let error = false;

  initialize()
    .then(bfs => {
      fs = require("fs");
      // import files
      console.log(fs);
    })
    .catch(e => {
      error = e.message;
    });

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
      // look for Book.toml
      let res = files.filter(file => {
        return file.name.toLowerCase() == "book.toml";
      })[0];

      if (res) {
        console.log(res);
        msg = "Parsing configuration...";

        let config = toml.parse(await res.text());
        console.log(config);

        book = new Book(config, fs, files)

        stage = "loaded";
      } else {
        stage = "error";
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
</style>

<div class="columns">
  <div class="column col-8 col-mx-auto">
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
