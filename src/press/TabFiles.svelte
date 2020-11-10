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

	let profiles = Object.keys(book.config.profiles)

</script>

<div class="card mb-6">
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
      <code>Book.toml</code> profiles. The files are listed in alphabetical order to make them easier to locate. This is not your table of contents or spine.
    </p>
    <table class="table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2">filename</th>
					{#each profiles as profile}
          <th class="px-4 py-2">{profile}</th>
					{/each}
        </tr>
      </thead>
      <tbody>
        {#each files as file, i}
          <tr class:bg-gray-100={i % 2 == 0}>
            <td class="border px-4 py-2">{file.filepath}</td>
            {#each profiles as profile}
						<td class="border px-4 py-2">
              {#if includedInProfile(profile, file)}
                <i class="fas fa-check" />
              {/if}
            </td>
						{/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
