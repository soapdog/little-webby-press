<script>
  import { _ } from "svelte-i18n"
  import { ebookEpub3Generating, staticSiteGenerating } from "./stores.js"
  import saveAs from "file-saver"
  import slugify from "slugify"

  let fs = require("fs")

  export let book

  let bookSlug = slugify(book.config.metadata.title)

  const downloadGenericEpub3 = () => {
    let path = `/books/${bookSlug}.epub`
    if (fs.existsSync(path)) {
      let data = fs.readFileSync(path)
      let f = new File([data.buffer], `${bookSlug}.epub`, {
        type: "application/zip+epub",
      })
      saveAs(f)
    } else {
      console.log("404", path)
    }
  }

  const downloadSite = () => {
    let path = `/sites/${bookSlug}-site.zip`
    if (fs.existsSync(path)) {
      let data = fs.readFileSync(path)
      let f = new File([data.buffer], `${bookSlug}-site.zip`, {
        type: "application/zip",
      })
      saveAs(f)
    } else {
      console.log("404", path)
    }
  }
</script>

<div class="card mb-6">
  <div class="flex flex-row">
    <div class="mb-3 flex-1">
      <label class="form-label" for="book-title">eBook</label>
      {#if $ebookEpub3Generating}
      <span>
        <i class="fas fa-spinner fa-lg fa-spin" />
        {$_("generating-book")}
      </span>
      {:else}
      <span class="cursor-pointer" on:click="{downloadGenericEpub3}">
        Generic ePub3 eBook
        <i class="fas fa-download fa-lg" />
      </span>
      {/if}
    </div>
    <div class="mb-3 flex-1">
      <label class="form-label" for="author-name">Site</label>
      {#if $staticSiteGenerating}
      <span>
        <i class="fas fa-spinner fa-lg fa-spin" />
        {$_("generating-site")}
      </span>
      {:else}
      <span class="cursor-pointer" on:click="{downloadSite}">
        Static Site
        <i class="fas fa-download fa-lg" />
      </span>
      {/if}
    </div>
  </div>
</div>
