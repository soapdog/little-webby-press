<script>
	import lo from "lodash"
	import { _ } from "svelte-i18n"

	export let book

	let fm = book.config.book.frontmatter || []
	let chapters = book.config.book.chapters || []

	let files = fm.concat(chapters)

</script>

<div class="card mb-6">
	{#if files.length == 0}
		<div class="empty">
			<div class="empty-icon">
				<i class="fas fa-book fa-3x" />
			</div>
			<p class="empty-title h5">{$_('no-files-found')}</p>
			<p class="empty-subtitle">{$_('drag-and-drop-to-start')}</p>
			<div class="empty-action">
				<button class="btn btn-primary">{$_('get-help')}</button>
			</div>
		</div>
	{:else}
		<p>{@html $_('manuscript-tab-description')}</p>
		<table class="table-auto">
			<thead>
				<tr>
					<th class="px-4 py-2">{$_('header-filename')}</th>
				</tr>
			</thead>
			<tbody>
				{#each files as file, i}
					<tr class:bg-gray-100={i % 2 == 0}>
						<td class="border px-4 py-2">{file}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
