<script>
  import _ from "lodash";
  export let book;

  let files = book.files.filter(f => {
    if (book.config.profiles.book.includes(f.name)) {
      return true
    }

    return false
  });

  const includedInProfile = (profile, file) => {
    if (file.filepath.match(/^images/)) {
      return true
    }

    let p = _.get(book, `config.profiles.${profile}`, [])
    
    return p.includes(file.name);
  };
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
    <p>
      The
      <em>files</em>
      tab only lists files listed in
      <code>Book.toml</code> profiles. The files are listed in alphabetical order to make them easier to find and not in ToC order.
    </p>
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
            <td>
              {#if includedInProfile('book', file)}
                <i class="fas fa-check" />
              {/if}
            </td>
            <td>
              {#if includedInProfile('sample', file)}
                <i class="fas fa-check" />
              {/if}
            </td>
            <td>
              {#if includedInProfile('pwa', file)}
                <i class="fas fa-check" />
              {/if}
            </td>
            <td>
              {#if includedInProfile('webmonetized', file)}
                <i class="fas fa-check" />
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
