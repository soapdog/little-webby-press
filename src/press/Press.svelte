<script>
  import Tabs from "./Tabs.svelte"
  import TabsActions from "./TabsActions.svelte"
  import { getFilesFromDataTransferItems } from "datatransfer-files-promise"
  import { onMount } from "svelte"
  import { bookFromFiles } from "./book.js"
  import { generateEpub } from "./epub.js"
  import { generateSite } from "./site.js"
  import { _ } from "svelte-i18n"
  import { ebookEpub3Generating, staticSiteGenerating} from "./stores.js"

  let stage = "waiting" // loading, loaded, over
  let msg, files, book

  // function readFile(file) {
  //  return new Promise((resolve, _reject) => {
  //    var fr = new FileReader()
  //    fr.onload = () => {
  //      resolve(fr.result)
  //    }
  //    fr.readAsText(file.blob)
  //  })
  // }

  const actionGenerateBook = (_ev) => {
    generateEpub(book)
      .catch((n) => {
        ebookEpub3Generating.set(false)
        stage = "error"
        msg = n.message ? $_(n.message) : n
        console.error("error generating epub3", n)
      })
  }

  const actionGenerateSite = (_ev) => {
    generateSite(book)
      .catch((n) => {
        staticSiteGenerating.set(false)
        stage = "error"
        msg = n.message ? $_(n.message) : n
        console.error("error generating site", n)
      })
  }

  const loadFiles = (_evt) => {
    document.getElementById("file-input").click()
  }

  const filesLoaded = async (evt) => {
    evt.preventDefault()

    msg = $_("getting-file-list")
    stage = "loading"
    files = Array.from(evt.target.files)
    // FileList does not contain "filepath" property like DataTransferItem do.
    // That property is used by book.js.
    // It's value is apparently the same as name.
    files = files.map(i => {
      i.filepath = i.webkitRelativePath
      return i
    })

    msg = $_("loading-configuration")
    book = await bookFromFiles(files)
    if (book instanceof Error) {
      stage = "error"
      msg = $_(book.message)
    } else {
      stage = "loaded"
    }
  }

  onMount(() => {

    window.onunhandledrejection = (e) => {
      console.log("typeof", typeof e)
      console.log("we got exception, but the app has crashed", e)
      stage = "error"
      ebookEpub3Generating.set(false)
      staticSiteGenerating.set(false)
      msg = e.reason || e.message || e || "Unknown error"
    }

    const dropzone = document.querySelector(".drop-area")
    dropzone.addEventListener("dragover", (evt) => {
      evt.preventDefault()
      stage = "over"
    })
    dropzone.addEventListener("dragleave", (evt) => {
      evt.preventDefault()
      stage = "waiting"
    })
    dropzone.addEventListener("drop", async (evt) => {
      evt.preventDefault()

      msg = $_("getting-file-list")
      stage = "loading"
      files = await window.getFilesFromDataTransferItems(evt.dataTransfer.items)
      console.log("files", files)

      msg = $_("loading-configuration")
      book = await bookFromFiles(files)
      if (book instanceof Error) {
        stage = "error"
        msg = $_(book.message)
      } else {
        stage = "loaded"
      }
    })
  })
</script>

<style>
  .over {
    border: solid 4px #e3f2fd;
  }

  .full-height {
    height: calc(100vh - 48px);
  }
</style>

<div class="container p-0 mx-auto full-height">
  {#if stage === "error"}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded
      relative"
      role="alert">
      <strong class="font-bold">{$_("error-quip")}</strong>
      <span class="block sm:inline">{@html msg}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
      </span>
    </div>
    <div
      class="flex justify-center content-center h-100 text-center py-3"
      class:over={stage == "over"}>
      <div>
        <div class="empty-icon">
          <i class="fas fa-book fa-3x" />
        </div>
        <p class="text-xl">{$_("no_book")}</p>
        <p class="text-light">{$_("drag-and-drop-to-start")}</p>
        <div class="mt-6">
          <a class="btn btn-blue" href="/help">
            {@html $_("learn-more-long")}
          </a>
        </div>
        <div class="mt-6">
              <span class="btn btn-blue" on:click={loadFiles}>
                <input type="file" class="hidden" id="file-input" webkitdirectory multiple directory on:change={filesLoaded}>
                {@html $_("load-folder")}
              </span>
            </div>
      </div>
    </div>
  {/if}
  {#if stage !== "loaded"}
    <div
      class="flex justify-center content-center h-100 text-center"
      class:over={stage == "over"}>
      {#if stage == "over"}
        <div>
          <div class="empty-icon">
            <i class="fas fa-smile-wink fa-3x" />
          </div>
          <p class="text-xl">{$_("drop-a-book-folder-here")}</p>
        </div>
      {:else if stage == "waiting"}
        <div>
          <div class="empty-icon">
            <i class="fas fa-book fa-3x" />
          </div>
          <p class="text-xl">{$_("no_book")}</p>
          <p class="text-light">{$_("drag-and-drop-to-start")}</p>
          <div class="mt-6">
            <a class="btn btn-blue" href="/documentation/en/getting-started">
              {@html $_("learn-more-long")}
            </a>
          </div>
            <div class="mt-6">
              <span class="btn btn-blue" on:click={loadFiles}>
                <input type="file" class="hidden" id="file-input" webkitdirectory multiple directory on:change={filesLoaded}>
                {@html $_("load-folder")}
              </span>
            </div>
        </div>
      {:else if stage == "loading"}
        <div>
          <div class="empty-icon">
            <i class="fas fa-spinner fa-3x fa-spin" />
          </div>
          <p class="text-xl">{$_("loading")}</p>
          <p class="text-light">{msg}</p>
        </div>
      {/if}
    </div>
  {:else}
    <Tabs {book} />
    <TabsActions
      on:generateBook={actionGenerateBook}
      on:generateSite={actionGenerateSite} />
  {/if}
</div>
