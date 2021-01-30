<script>
	import { generateEpub } from "./epub.js"
	import { generateSite } from "./site.js"

	import { _ } from "svelte-i18n"

	export let book
	let generating = false
	let generatingSite = false

	const generate = ev => {
		generating = true
		generateEpub(book).then(() => (generating = false))
	}

	const makeSite = ev => {
		generatingSite = true
		generateSite(book).then(() => (generatingSite = false))
	}
</script>

<nav>
	<div class="flex justify-end">

		<button class="btn btn-blue" disabled={generating} on:click={generate}>
			{#if generating}
				<i class="fas fa-spinner fa-lg fa-spin" />
				{$_('generating-book')}
			{:else}{$_('action-generate-ebook')}{/if}
		</button>

		<button class="btn btn-blue" disabled={generatingSite} on:click={makeSite}>
			{#if generatingSite}
				<i class="fas fa-spinner fa-lg fa-spin" />
				{$_('generating-site')}
			{:else}{$_('action-generate-site')}{/if}
		</button>
	</div>
</nav>
