<script>
//	import _ from "lodash";
	import { _ } from "svelte-i18n"

	export let book;
</script>

<form class="w-full max-w-lg" action="">
	<div class="card mb-6">

		<div class="card-header flex justify-between">
			<span class="card-title">{$_("options-ebook-section-header")}</span>
			<div class="mb-4">
				{#if book.config.book.enabled}
					<i class="fas fa-toggle-on" />
				{:else}
					<i class="fas fa-toggle-off" />
				{/if}
			</div>
		</div>

		{#if book.config.book.enabled}
			<div class="card-body">
				<div class="mb-3">
					<label class="block text-gray-700 text-md font-bold mb-2">
						{$_("options-theme")}
					</label>
					<span>{book.config.book.theme}</span>
				</div>
			</div>

			<div class="italic">
				{$_("options-book-format-blurb")}
			</div>
		{:else}
			<div class="italic">
				{$_("options-ebook-is-disabled")}
			</div>
		{/if}

	</div>

	<div class="card mb-6">

		<div class="card-header flex justify-between">
			<span class="card-title">{$_("options-website-section-header")}</span>
			<div class="mb-4">
				{#if book.config.site.enabled}
					<i class="fas fa-toggle-on" />
				{:else}
					<i class="fas fa-toggle-off" />
				{/if}
			</div>
		</div>

		{#if book.config.site.enabled}
			<div class="card-body">
        <div class="mb-3">
          <label class="block text-gray-700 text-md font-bold mb-2">
            {$_("options-theme")}
          </label>
          <span>{book.config.site.theme}</span>
        </div>
				<div class="mb-3">
					<label class="block text-gray-700 text-md font-bold mb-2">
						{$_("options-web-monetization")}
					</label>
					{#if book.config.webmonetization.enabled}
						<span>{$_("enabled")}</span>
					{:else}
						<span>{$_("disabled")}</span>
					{/if}
				</div>

        {#if book.config.webmonetization.enabled}
				<div class="mb-3">
					<label class="block text-gray-700 text-md font-bold mb-2">
						{$_("options-web-monetization-endpoint")}
					</label>
					<span>{book.config.webmonetization.endpoint}</span>
				</div>
        {/if}
			</div>

			<div class="italic">
				{$_("options-website-format-blurb")}
			</div>
		{:else}
			<div class="italic">
				{$_("options-website-is-disabled")}
			</div>
		{/if}
	</div>
</form>
