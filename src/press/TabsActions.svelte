<script>
	import { createEventDispatcher } from "svelte"
	import { _ } from "svelte-i18n"

	const dispatch = createEventDispatcher()

	export let generatingBook = false
	export let generatingSite = false

	const generateBook = (ev) => {
		dispatch("generateBook")
	}

	const generateSite = (ev) => {
		dispatch("generateSite")
	}
</script>

<nav>
	<div class="flex justify-center">
		<button class="btn btn-blue" disabled={generatingBook} on:click={generateBook}>
			{#if generatingBook}
				<i class="fas fa-spinner fa-lg fa-spin" />
				{$_("generating-book")}
			{:else}{$_("action-generate-ebook")}{/if}
		</button>

		<button class="btn btn-blue" disabled={generatingSite} on:click={generateSite}>
			{#if generatingSite}
				<i class="fas fa-spinner fa-lg fa-spin" />
				{$_("generating-site")}
			{:else}{$_("action-generate-site")}{/if}
		</button>
	</div>
</nav>
