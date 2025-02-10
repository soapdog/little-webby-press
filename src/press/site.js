import { fs } from '@zenfs/core'
import { path } from "path"
import slugify from "slugify"
import {
  copyFolder,
  ensureFolders,
  copyImages,
  addToZip,
  loadExternalTheme,
  generateResizedCovers,
} from "../common/fs.js"
import { fix, fixLinksForSite } from "../common/fixes.js"
import "../common/templateHelpers.js"
import {
  extractToc,
  registerToCLabel,
  registerToCMatchRules,
  registerToCPrefix,
  registerToCSeparator,
  safeId,
} from "../common/utils.js"

import Handlebars from "handlebars"
import JSZip from "jszip"
import { generateEpub } from "./epub.js"
import { staticSiteGenerating } from "./stores.js"

import MarkdownIt from "markdown-it"
import MarkdownFootnote from "markdown-it-footnote"
import MarkdownAnchor from "markdown-it-anchor"
import MarkdownAttrs from "markdown-it-attrs"
import MarkdownBracketedSpans from "markdown-it-bracketed-spans"
import MarkdownImplicitFigues from "markdown-it-implicit-figures"
import MarkdownCenterText from "markdown-it-center-text"
import MarkdownEmoji from "markdown-it-emoji"
import textile from "textile-js"

let md = new MarkdownIt({
  xhtmlOut: false,
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

// eslint-disable-next-line no-undef
let asciidoctor = new Asciidoctor()

// IMPLEMENTATION

let currentTheme = "generic" // matches default theme from Book() default configuration.

function setTheme(theme) {
  currentTheme = theme
}

function themeFolder() {
  return `/templates/${currentTheme}/site`
}

function themePathFor(file) {
  return `${themeFolder()}/${file}`
}

function contentFilesFromConfiguration(book) {
  let frontmatter =
    book.config.site.frontmatter.length > 0
      ? book.config.site.frontmatter
      : book.config.book.frontmatter
  let chapters =
    book.config.site.chapters.length > 0
      ? book.config.site.chapters
      : book.config.book.chapters
  let backmatter =
    book.config.site.backmatter.length > 0
      ? book.config.site.backmatter
      : book.config.book.backmatter

  let contentFiles = [...frontmatter, ...chapters, ...backmatter]

  return contentFiles
}

export async function generateSite(book) {
  // Sit back, relax, and enjoy the waterfall...
  console.time("Generating site")

  let bookSlug = slugify(book.config.metadata.title)
  let siteFolder = `/tmp/${bookSlug}-site`
  let bookFile = `/books/${bookSlug}.epub`
  let toc = {}

  staticSiteGenerating.set(true)

  await Promise.all(loadExternalTheme(book))

  setTheme(book.config.site.theme)

  if (!fs.existsSync(themeFolder())) {
    throw { message: "theme-not-found" }
  }

  if (book.config.book.enabled && !fs.existsSync(bookFile)) {
    await generateEpub(book)
    await generateSite(book)
    return true
  }

  book.products = {
    epub: `${bookSlug}.epub`,
  }

  if (!fs.existsSync(siteFolder)) {
    fs.mkdirSync(siteFolder)
  }

  // Copy files over...
  ensureFolders(`${siteFolder}/files/${bookSlug}.epub`)
  copyFolder(themeFolder(), siteFolder)

  registerToCLabel(book.config.toc.label)
  registerToCMatchRules(book.config.toc.match)
  registerToCPrefix(book.config.toc.prefix)
  registerToCSeparator(book.config.toc.separator)

  if (book.config.site.download) {
    fs.writeFileSync(
      `${siteFolder}/files/${bookSlug}.epub`,
      fs.readFileSync(bookFile)
    )
  }

  await Promise.all(copyImages(book, `${siteFolder}/book`))
  await generateResizedCovers(book,`${siteFolder}/book`)

  let coverPath = book.config.metadata.cover
  let ext = path.extname(coverPath)
  book.config.metadata.coverMedium = book.config.metadata.cover
      .replace(ext, `-med${ext}`)

  let contentFiles = contentFilesFromConfiguration(book)

  let chapterTemplateHBS = fs.readFileSync(themePathFor("chapter.hbs"), "utf8")
  let chapterTemplate = Handlebars.compile(chapterTemplateHBS)

  await Promise.all(
    contentFiles.map(async (chapterFilename) => {
      let file = book.files.filter((f) => f.name === chapterFilename)[0]
      let ext = path.extname(chapterFilename)
      let contentHtml = ""
      let content = await file.text()
      switch(ext) {
        case ".html":
          contentHtml = content
          break
        case ".adoc":
          contentHtml = asciidoctor.convert(content, { "safe": "server", "attributes": { "showtitle": true, "icons": "font" } })
          break
        case ".textile":
          contentHtml = textile(content)
          break
        default:
        case ".md":
          contentHtml = md.render(content)
          break
      }
      contentHtml = fix(contentHtml)
      contentHtml = fixLinksForSite(contentHtml)
      let destinationFilename = chapterFilename.replace(ext, ".html")
      let destination = `${siteFolder}/book/${destinationFilename}`

      const possibleToc = extractToc(contentHtml, destinationFilename)

      if (possibleToc) {
        toc[destinationFilename] = possibleToc
        toc[destinationFilename].content = contentHtml
        toc[destinationFilename].destination = destination
      }
    })
  )

  let spine = contentFiles.map((f) => {
    let i = f.split(".")[0]
    return { id: `c-${i}`, file: i, htmlFile: `${i}.html` }
  })

  // site zip file...

  spine = spine.map((s) => {
    s.toc = toc[s.htmlFile]
    return s
  })

  // Templating
  if (book.config.site.description) {
    book.config.site.description = md.render(book.config.site.description)
  }

  if (book.config.site.blurb) {
    book.config.site.blurb = md.render(book.config.site.blurb)
  }

  if (book.config.author.bio) {
    book.config.author.bio = md.render(book.config.author.bio)
  }

  if (book.config.site.landing) {
    let indexTemplateHBS = fs.readFileSync(themePathFor("index.hbs"), "utf8")

    let indexTemplate = Handlebars.compile(indexTemplateHBS)
    let contents = indexTemplate({ book, spine })
    fs.writeFileSync(`${siteFolder}/index.html`, contents)
  } else {
    let firstChapter = spine[0].toc[0].file
    let refresher = `
        <html>
        <head>
        <meta http-equiv="refresh" content="0;url=book/${firstChapter}">
        </head>
        <body></body>
        </html>
        `
    fs.writeFileSync(`${siteFolder}/index.html`, refresher)
  }

  // Chapters
  if (book.config.site.reader) {
    spine.forEach((item, index) => {
      let data = chapterTemplate({ book, spine, index, html: item.toc.content })
      ensureFolders(item.toc.destination)
      fs.writeFileSync(item.toc.destination, data)
    })
  }

  let zip = new JSZip()
  addToZip(zip, `${bookSlug}-site`, siteFolder)

  try {
    let blob = await zip.generateAsync({ type: "blob" })
    let siteBuffer = await blob.arrayBuffer()
    let Buffer = BrowserFS.BFSRequire("buffer").Buffer
    fs.writeFileSync(`/sites/${bookSlug}-site.zip`, Buffer.from(siteBuffer))
    staticSiteGenerating.set(false)
    console.timeEnd("Generating site")
    return true

  } catch (err) {
    staticSiteGenerating.set(false)
    throw err
  }
}
