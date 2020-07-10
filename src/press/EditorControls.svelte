<script>
  import { generateEbook } from "./utils.js";
  export let book;
  let generating = false;
  const generate = ev => {
    generating = true;
    generateEbook(book).then(() => (generating = false));
  };
</script>

<nav
  class="navbar fixed-bottom navbar-expand-lg navbar-light"
  style="background-color: #e3f2fd;">
  <div class="container-fluid justify-content-end">
    <button class="btn btn-primary" disabled={generating} on:click={generate}>
      {#if generating}
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true" />
      {/if}
      Generate
    </button>
  </div>
</nav>
