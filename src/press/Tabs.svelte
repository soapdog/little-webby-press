<script>
	import { _ } from "svelte-i18n"
	import TabManuscript from "./TabManuscript.svelte"
	import TabOptions from "./TabOptions.svelte"
	import TabMetadata from "./TabMetadata.svelte"

	export let book

	let views = {
		manuscript: TabManuscript,
		options: TabOptions,
		metadata: TabMetadata,
	}

	let currentView = "options"
</script>

<style>

</style>

<div class="container mx-auto m-4 ">
	<ul class="flex">
		<li
			class="nav-pill"
			class:nav-pill-active={currentView == 'options'}
			on:click|preventDefault={() => (currentView = 'options')}>
			<span>{$_("options")}</span>
		</li>
		<li
			class="nav-pill"
			class:nav-pill-active={currentView == 'metadata'}
			on:click|preventDefault={() => (currentView = 'metadata')}>
			<span>{$_("metadata")}</span>
		</li>
		<li
			class="nav-pill"
			class:nav-pill-active={currentView == 'manuscript'}
			on:click|preventDefault={() => (currentView = 'manuscript')}>
			<span>{$_("manuscript")}</span>
		</li>
	</ul>
	<div class="columns tab">
		<svelte:component this={views[currentView]} {book} />
	</div>
</div>
