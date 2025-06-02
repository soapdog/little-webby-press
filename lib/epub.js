import MarkdownIt from "markdown-it"
import MarkdownFootnote from "markdown-it-footnote"
import MarkdownAnchor from "markdown-it-anchor"
import MarkdownAttrs from "markdown-it-attrs"
import MarkdownBracketedSpans from "markdown-it-bracketed-spans"
import MarkdownImplicitFigues from "markdown-it-implicit-figures"
import MarkdownCenterText from "markdown-it-center-text"
import textile from "textile-js"
import Asciidoctor from "asciidoctor"
import slugify from "slugify"
import {
  copyFolder,
  copyImages,
  addToZip,
  loadExternalTheme,
  fileExists,
  readFile,
  extname,
  writeFile,
  filesFromFolder,
  dumpVFS
} from "./fs.js"
import { fix } from "./fixes.js"
import "./templateHelpers.js"
import {
  extractToc,
  registerToCLabel,
  registerToCMatchRules,
  registerToCPrefix,
  registerToCSeparator,
  safeId,
} from "./utils.js"
import Handlebars from "handlebars"
import JSZip from "jszip"
import saveAs from "file-saver"


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
  .use(MarkdownCenterText)

let asciidoctor = new Asciidoctor() // inserted with <script> because it fails to build with webpack

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
  let folder = `/tmp/${bookSlug}`
  let toc = {}
  let manifest = []

  await Promise.all(loadExternalTheme(book))

  setTheme(book.config.book.theme)

  if (!fileExists(themeFolder())) {
    throw { message: `theme-not-found: ${themeFolder()}` }
  }

  copyFolder(themeFolder(), folder)

  console.log("Copying images...")
  await Promise.all(copyImages(book, `${folder}/OPS`))

  registerToCLabel(book.config.toc.label)
  registerToCMatchRules(book.config.toc.match)
  registerToCPrefix(book.config.toc.prefix)
  registerToCSeparator(book.config.toc.separator)

  let chapterTemplateHBS = readFile(themePathFor("chapter.hbs"), "utf8")
  let chapterTemplate = Handlebars.compile(chapterTemplateHBS)

  // Add HTML Chapters
  let contentFiles = [
    ...book.config.book.frontmatter,
    ...book.config.book.chapters,
    ...book.config.book.backmatter,
  ]

  console.log("Starting on chapters...")
  await Promise.all(
    contentFiles.map(async (chapterFilename) => {
      try {
        let file = book.files.filter((f) => f.name === chapterFilename)[0]
        let ext = extname(chapterFilename)
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
        let destinationFilename = chapterFilename.replace(ext, ".xhtml")
        let destination = `${folder}/OPS/${destinationFilename}`
        let data = chapterTemplate({ html: contentHtml })
        writeFile(destination, data)

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
  let fonts = filesFromFolder(`${folder}/OPS/fonts/`)
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
    let ext = extname(f)
    if (contentFiles.includes(file.filepath)) {
      f = f.replace(ext, ".xhtml")
    }
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

  let packageHBS = readFile(themePathFor("package.hbs"), "utf8")
  let packageTemplate = Handlebars.compile(packageHBS)
  let packageData = packageTemplate({ book, manifest, spine })
  writeFile(`${folder}/OPS/package.opf`, packageData)

  // cover.xhtml
  let coverHBS = readFile(themePathFor("cover.hbs"), "utf8")
  let coverTemplate = Handlebars.compile(coverHBS)
  let coverData = coverTemplate({ book })
  writeFile(`${folder}/OPS/cover.xhtml`, coverData)

  // toc.xhtml
  let tocHBS = readFile(themePathFor("toc.hbs"), "utf8")
  let tocTemplate = Handlebars.compile(tocHBS)
  spine = spine.map((s) => {
    s.toc = toc[s.htmlFile]
    return s
  })
  let tocData = tocTemplate({ book, manifest, spine })
  writeFile(`${folder}/OPS/toc.xhtml`, tocData)

  // toc.ncx
  let tocncxHBS = readFile(themePathFor("toc.ncx.hbs"), "utf8")
  let tocncxTemplate = Handlebars.compile(tocncxHBS)
  let tocncxData = tocncxTemplate({ book, manifest, spine })
  writeFile(`${folder}/OPS/toc.ncx`, tocncxData)

  // EPUB3 file
  let zip = new JSZip()
  let mimetype = readFile(`${folder}/mimetype`)
  zip.file("mimetype", mimetype) // mimetype needs to be the first file in the zip. That is part of the EPUB spec.
  addToZip(zip, bookSlug, folder)

  try {
    let epubBlob = await zip.generateAsync({ type: "blob" })
    let epubBuffer = await epubBlob.arrayBuffer()
    writeFile(`/books/${bookSlug}.epub`, epubBuffer)
    saveAs(epubBlob, `${bookSlug}.epub`)
    console.timeEnd("Generating eBook")
    // let k = Object.keys(vfs)
    // k.forEach(f => console.log(f))
    return true
  } catch(err) {
    throw err
  }
}
