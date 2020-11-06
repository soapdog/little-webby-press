<script>
	import { generateEpub } from "./epub.js";
  export let book;
  let generating = false;
  const generate = ev => {
    generating = true;
    generateEpub(book).then(() => (generating = false));
  };
</script>

<nav>
  <div class="flex justify-end">
    <button class="btn btn-blue" disabled={generating} on:click={generate}>
      {#if generating}
        <i class="fas fa-spinner fa-lg fa-spin" />
      {/if}
      Generate
    </button>
  </div>
</nav>
