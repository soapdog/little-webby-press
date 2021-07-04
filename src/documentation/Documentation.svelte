<script>

const activeLocale = "en"

const books = {
  en: [
    {
      id: "getting-started",
      cover: "book/images/cover.png",
      title: "Getting Started With Little Webby Press"
    },
    {
      id: "book-configuration-specification",
      cover: "book/images/cover.png",
      title: "Book Configuration File Specification"
    }
  ]
}
</script>

<style type="text/css">
  .mini-cover {
    max-width: 200px;
  }
  .blue {
    color: rgba(59, 130, 246);
  }
</style>

<div class="container mx-auto full-height">
  <div class="flex justify-center content-center h-100 text-center">
    {#each books[activeLocale] as b}
    <div class="p-2">
      <a href="/documentation/{activeLocale}/{b.id}/index.html" target="_blank">
        <figure class="text-center max-w-xs cursor-pointer">
          <img
            class="mini-cover mx-auto"
            src="/documentation/{activeLocale}/{b.id}/{b.cover}"
            alt="{b.title}"
          />
          <figcaption>{b.title}</figcaption>
        </figure>
      </a>
    </div>
    {/each}
  </div>
  <br />
  <h3 class="font-semibold text-xl blue">Sample Books</h3>
  <p>Sample book folders for your reference.</p>
  <ul>
    <li>• <a class="blue" href="../../samples/moby-dick.zip">Moby Dick</a></li>
  </ul>
</div>
