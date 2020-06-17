<script>
  import _ from "lodash";
  export let book;

  let author = _.get(book.config, "metadata.author", "");
  let publisher = _.get(book.config, "metadata.publisher", "");
</script>

  <form action="" class="mt-2">
    <div class="mb-3">
      <label class="form-label" for="author-name">Author Name</label>
      <input
        class="form-control"
        type="text"
        id="author-name"
        bind:value={author}
        placeholder="Name" />
    </div>
    <div class="mb-3">
      <label class="form-label" for="publisher-name">Publisher Name</label>
      <input
        class="form-control"
        type="text"
        id="publisher-name"
        bind:value={publisher}
        placeholder="Name" />
    </div>
  </form>
