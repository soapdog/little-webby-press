<script>
	import { _ } from "svelte-i18n"
	import TabFiles from "./TabFiles.svelte"
	import TabOptions from "./TabOptions.svelte"
	import TabMetadata from "./TabMetadata.svelte"
	import EditorControls from "./EditorControls.svelte"

	export let book

	let views = {
		files: TabFiles,
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
			class:nav-pill-active={currentView == 'files'}
			on:click|preventDefault={() => (currentView = 'files')}>
			<span>{$_("files")}</span>
		</li>
	</ul>
	<div class="columns tab">
		<svelte:component this={views[currentView]} {book} />
	</div>
	<EditorControls {book} />
</div>
