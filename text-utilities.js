import MarkdownIt from "markdown-it"
// import MarkdownFootnote from "markdown-it-footnote"
// import MarkdownAnchor from "markdown-it-anchor"
// import MarkdownBracketedSpans from "markdown-it-bracketed-spans"
// import MarkdownEmoji from "markdown-it-emoji"
import slugify from "slugify"

export function safeId(txt) {
  const s = slugify(txt, {
    remove: /[*+~.()'"!:@;,{}[]]-/g,
    lower: true,
    strict: true
  })
  return s
}

const md = new MarkdownIt({
  xhtmlOut: true,
  linkify: true,
  typographer: true,
})
  // .use(MarkdownFootnote)
  // .use(MarkdownAnchor, { slugify: safeId })
  // .use(MarkdownBracketedSpans)
  // .use(MarkdownEmoji)

  export function render(content) {
  	return md.render(content)
  }