<script>
import { _ } from "svelte-i18n"
import MarkdownIt from "markdown-it"
import MarkdownFootnote from "markdown-it-footnote"
import MarkdownAnchor from "markdown-it-anchor"
import MarkdownAttrs from "markdown-it-attrs"
import MarkdownBracketedSpans from "markdown-it-bracketed-spans"
import MarkdownImplicitFigues from "markdown-it-implicit-figures"
import MarkdownCenterText from "markdown-it-center-text"
import MarkdownEmoji from "markdown-it-emoji"
import { safeId } from "../common/utils.js"

let md = new MarkdownIt({
  xhtmlOut: true,
  linkify: true,
  typographer: true,
})
  .use(MarkdownFootnote)
  .use(MarkdownAnchor, { safeId })
  .use(MarkdownBracketedSpans)
  .use(MarkdownAttrs)
  .use(MarkdownImplicitFigues, { figcaption: true })
  .use(MarkdownEmoji)
  .use(MarkdownCenterText)

const content = md.render($_("about"))
</script>


<div class="container mx-auto full-height">
  <article class="prose lg:prose-xl">
    {@html content}
  </article>
</div>
