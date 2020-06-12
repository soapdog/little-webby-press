<script>
  export let book;

  let files = book.files
</script>

<div class="column">
  {#if files.length == 0}
    <div class="empty">
      <div class="empty-icon">
        <i class="fas fa-book fa-3x" />
      </div>
      <p class="empty-title h5">No files found.</p>
      <p class="empty-subtitle">
        Drag &amp; Drop a folder with book data here to start.
      </p>
      <div class="empty-action">
        <button class="btn btn-primary">Learn more about book data :-)</button>
      </div>
    </div>
  {:else}
    <div class="toast toast-primary m-2">
      The
      <em>files</em>
      tab only lists files listed in
      <code>Book.toml</code>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>filename</th>
          <th>ePub</th>
          <th>Sample</th>
          <th>PWA</th>
          <th>PWA + WebMonetized</th>
        </tr>
      </thead>
      <tbody>
        {#each files as file}
          <tr>
            <td>{file.filepath}</td>
            <td />
            <td />
            <td />
            <td />
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
