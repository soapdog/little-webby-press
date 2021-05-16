<script>
	import { createEventDispatcher } from "svelte"
	import { _ } from "svelte-i18n"
	import { ebookEpub3Generating, staticSiteGenerating} from "./stores.js"

	const dispatch = createEventDispatcher()

	const generateBook = (ev) => {
		dispatch("generateBook")
	}

	const generateSite = (ev) => {
		dispatch("generateSite")
	}
</script>

<nav>
	<div class="flex justify-center">
		<button class="btn btn-blue" disabled={$ebookEpub3Generating} on:click={generateBook}>
			{#if $ebookEpub3Generating}
				<i class="fas fa-spinner fa-lg fa-spin" />
				{$_("generating-book")}
			{:else}{$_("action-generate-ebook")}{/if}
		</button>

		<button class="btn btn-blue" disabled={$staticSiteGenerating} on:click={generateSite}>
			{#if $staticSiteGenerating}
				<i class="fas fa-spinner fa-lg fa-spin" />
				{$_("generating-site")}
			{:else}{$_("action-generate-site")}{/if}
		</button>
	</div>
</nav>
