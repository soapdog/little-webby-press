import BrowserFS from "browserfs"

import MarkdownIt from "markdown-it"
import MarkdownFootnote from "markdown-it-footnote"
import MarkdownAnchor from "markdown-it-anchor"
import MarkdownAttrs from "markdown-it-attrs"
import MarkdownBracketedSpans from "markdown-it-bracketed-spans"
import MarkdownImplicitFigues from "markdown-it-implicit-figures"
import MarkdownCenterText from "markdown-it-center-text"
import MarkdownEmoji from "markdown-it-emoji"
import slugify from "slugify"
import {
  copyFolder,
  ensureFolders,
  copyImages,
  addToZip,
  loadExternalTheme
} from "../common/fs.js"
import { fix } from "../common/fixes.js"
import "../common/templateHelpers.js"
import {
  extractToc,
  registerToCLabel,
  registerToCMatchRules,
  registerToCPrefix,
  safeId,
} from "../common/utils.js"
import Handlebars from "handlebars"
import JSZip from "jszip"
import { ebookEpub3Generating } from "./stores.js"

let md = new MarkdownIt({
  xhtmlOut: true,
  linkify: true,
  typographer: true,
})
  .use(MarkdownFootnote)
  .use(MarkdownAnchor, { slugify: safeId })
  .use(MarkdownBracketedSpans)
  .use(MarkdownAttrs)
  .use(MarkdownImplicitFigues, { figcaption: true })
  .use(MarkdownEmoji)
  .use(MarkdownCenterText)

// eslint-disable-next-line no-undef
let asciidoctor = new Asciidoctor()

let currentTheme = "generic" // default theme, same as in the defaultBookConfiguration.

function setTheme(theme) {
  currentTheme = theme
}

function themeFolder() {
  return `/templates/${currentTheme}/epub`
}

function themePathFor(file) {
  return `${themeFolder()}/${file}`
}

export async function generateEpub(book) {
  // Sit back, relax, and enjoy the waterfall...
  console.time("Generating eBook")
  console.log("Book configuration", book)

  let bookSlug = slugify(book.config.metadata.title)
  let fs = require("fs")
  let path = require("path")
  let folder = `/tmp/${bookSlug}`
  let toc = {}
  let manifest = []

  ebookEpub3Generating.set(true)

  await Promise.all(loadExternalTheme(book))

  setTheme(book.config.book.theme)

  if (!fs.existsSync(themeFolder())) {
    throw { message: "theme-not-found" }
  }

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }

  ensureFolders("${folder}/OPS/package.opf")
  copyFolder(themeFolder(), folder)

  await Promise.all(copyImages(book, `${folder}/OPS`))

  registerToCLabel(book.config.toc.label)
  registerToCMatchRules(book.config.toc.match)
  registerToCPrefix(book.config.toc.prefix)

  let chapterTemplateHBS = fs.readFileSync(themePathFor("chapter.hbs"), "utf8")
  let chapterTemplate = Handlebars.compile(chapterTemplateHBS)

  // Add HTML Chapters
  let contentFiles = [
    ...book.config.book.frontmatter,
    ...book.config.book.chapters,
    ...book.config.book.backmatter,
  ]

  await Promise.all(
    contentFiles.map(async (chapterFilename) => {
      try {
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
          default:
          case ".md":
            contentHtml = md.render(content)
            break
        }
        console.log("content", contentHtml)
        contentHtml = fix(contentHtml)
        let destinationFilename = chapterFilename.replace(ext, ".xhtml")
        let destination = `${folder}/OPS/${destinationFilename}`
        let data = chapterTemplate({ html: contentHtml })
        fs.writeFileSync(destination, data)

        // due to the async nature of this code, the ToC won't ready until
        // all promises complete.
        if (!book.config.book.frontmatter.includes(chapterFilename)) {
          toc[destinationFilename] = extractToc(
            contentHtml,
            destinationFilename
          )
        }
      } catch (e) {
        console.error(e)
        throw `Problem processing chapter: <b>${chapterFilename}</b>.<br><br>Remember that chapter files cannot be empty.`
      }
    })
  )

  // Find which files to add to manifest
  let files = book.files.filter((f) => {
    if (contentFiles.includes(f.name)) {
      return true
    }

    if (f.filepath.match(/^images/)) {
      return true
    }

    return false
  })

  // Adding fonts to manifest
  let fonts = fs.readdirSync(`${folder}/OPS/fonts/`)
  fonts.forEach((f) => {
    files.push({
      filepath: `fonts/${f}`,
      name: f,
    })
  })

  // adds files to manifest
  files.forEach((file) => {
    if (file.filepath == book.config.metadata.cover) {
      return
    }

    let f = file.filepath
    let ext = path.extname(f)
    f = f.replace(ext, ".xhtml")
    let i = file.name.split(".")[0]
    let linear = "yes"

    if (f.indexOf(".xhtml") == -1) {
      linear = "no"
      i = `r-${i}`
    }

    manifest.push({
      id: `c-${i}`,
      file: f,
      linear,
    })
  })

  // package.opf
  let spine = contentFiles.map((f) => {
    let i = f.split(".")[0]
    return { id: `c-${i}`, file: i, htmlFile: `${i}.xhtml` }
  })

  let packageHBS = fs.readFileSync(themePathFor("package.hbs"), "utf8")
  let packageTemplate = Handlebars.compile(packageHBS)
  let packageData = packageTemplate({ book, manifest, spine })
  fs.writeFileSync(`${folder}/OPS/package.opf`, packageData)

  // cover.xhtml
  let coverHBS = fs.readFileSync(themePathFor("cover.hbs"), "utf8")
  let coverTemplate = Handlebars.compile(coverHBS)
  let coverData = coverTemplate({ book })
  fs.writeFileSync(`${folder}/OPS/cover.xhtml`, coverData)

  // toc.xhtml
  let tocHBS = fs.readFileSync(themePathFor("toc.hbs"), "utf8")
  let tocTemplate = Handlebars.compile(tocHBS)
  spine = spine.map((s) => {
    s.toc = toc[s.htmlFile]
    return s
  })
  let tocData = tocTemplate({ book, manifest, spine })
  fs.writeFileSync(`${folder}/OPS/toc.xhtml`, tocData)

  // toc.ncx
  let tocncxHBS = fs.readFileSync(themePathFor("toc.ncx.hbs"), "utf8")
  let tocncxTemplate = Handlebars.compile(tocncxHBS)
  let tocncxData = tocncxTemplate({ book, manifest, spine })
  fs.writeFileSync(`${folder}/OPS/toc.ncx`, tocncxData)

  // EPUB3 file
  let zip = new JSZip()
  let mimetype = fs.readFileSync(`${folder}/mimetype`)
  zip.file("mimetype", mimetype) // mimetype needs to be the first file in the zip. That is part of the EPUB spec.
  addToZip(zip, bookSlug, folder)

  try {
    let epubBlob = await zip.generateAsync({ type: "blob" })
    let epubBuffer = await epubBlob.arrayBuffer()
    let Buffer = BrowserFS.BFSRequire("buffer").Buffer
    fs.writeFileSync(`/books/${bookSlug}.epub`, Buffer.from(epubBuffer))
    // saveAs(epubBlob, `${bookSlug}.epub`)
    ebookEpub3Generating.set(false)
    console.timeEnd("Generating eBook")
    return true
  } catch(err) {
    ebookEpub3Generating.set(false)
    throw err
  }
}
