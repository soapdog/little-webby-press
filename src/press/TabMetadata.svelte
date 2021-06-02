<script>
	import { _ } from "svelte-i18n"

	export let book;

	let author = book.config.author.name || ""
	let publisher = book.config.publisher.name || ""
	let title = book.config.metadata.title || ""
</script>

<div class="card mb-6">
	<div class="mb-3">
		<label class="form-label" for="book-title">{$_("metadata-book-title")}</label>
		<span>{title}</span>
	</div>
	<div class="mb-3">
		<label class="form-label" for="author-name">{$_("metadata-author-name")}</label>
		<span>{author}</span>
	</div>
	<div class="mb-3">
		<label class="form-label" for="publisher-name">{$_("metadata-publisher-name")}</label>
		<span>{publisher}</span>
	</div>
</div>
