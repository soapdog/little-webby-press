<script>
	import _ from "lodash";
	export let book;

	let author = _.get(book.config, "metadata.author", "");
	let publisher = _.get(book.config, "metadata.publisher", "");
	let title = _.get(book.config, "metadata.title", "");
</script>

<div class="card mb-6">
	<div class="mb-3">
		<label class="form-label" for="book-title">Book Title</label>
		<span>{title}</span>
	</div>
	<div class="mb-3">
		<label class="form-label" for="author-name">Author Name</label>
		<span>{author}</span>
	</div>
	<div class="mb-3">
		<label class="form-label" for="publisher-name">Publisher Name</label>
		<span>{publisher}</span>
	</div>
</div>
