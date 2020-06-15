<script>
  import { generateEbook } from "./utils.js";
  export let book;
  let generating = false;
  const generate = ev => {
    generating = true;
    generateEbook(book).then(() => (generating = false));
  };
</script>

<section class="float-left">
  <button class="btn btn-primary">Save</button>
</section>
<section class="float-right">
  <button
    class="btn btn-primary"
    class:loading={generating}
    on:click={generate}>
    Generate
  </button>
</section>
