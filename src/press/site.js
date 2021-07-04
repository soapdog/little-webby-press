import BrowserFS from "browserfs"

import saveAs from "file-saver"
import slugify from "slugify"
import {
  copyFolder,
  ensureFolders,
  copyImages,
  addToZip,
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

function isFrontmatter(book, file) {
  let frontmatter =
    book.config.site.frontmatter.length > 0
      ? book.config.site.frontmatter
      : book.config.book.frontmatter
  return frontmatter.includes(file)
}

function isBackmatter(book, file) {
  let backmatter =
    book.config.site.backmatter.length > 0
      ? book.config.site.backmatter
      : book.config.book.backmatter
  return backmatter.includes(file)
}

export function generateSite(book) {
  // Sit back, relax, and enjoy the waterfall...
  console.time("Generating site")
  return new Promise((resolve, reject) => {
    let bookSlug = slugify(book.config.metadata.title)
    let fs = require("fs")
    let siteFolder = `/tmp/${bookSlug}-site`
    let bookFile = `/books/${bookSlug}.epub`
    let toc = {}

    staticSiteGenerating.set(true)

    setTheme(book.config.site.theme)

    if (!fs.existsSync(themeFolder())) {
      reject({ message: "theme-not-found" })
    }

    if (book.config.book.enabled && !fs.existsSync(bookFile)) {
      generateEpub(book).then(() => {
        generateSite(book)
          .then(() => resolve())
          .catch((n) => reject(n))
      })
      return false
    }

    book.products = {
      epub: `${bookSlug}.epub`
    }

    if (!fs.existsSync(siteFolder)) {
      fs.mkdirSync(siteFolder)
    }

    // Copy files over...
    ensureFolders(`${siteFolder}/files/${bookSlug}.epub`)
    copyFolder(themeFolder(), siteFolder)
    fs.writeFileSync(
      `${siteFolder}/files/${bookSlug}.epub`,
      fs.readFileSync(bookFile)
    )

    let fi = copyImages(book, `${siteFolder}/book`)

    let contentFiles = contentFilesFromConfiguration(book)

    let chapterTemplateHBS = fs.readFileSync(
      themePathFor("chapter.hbs"),
      "utf8"
    )
    let chapterTemplate = Handlebars.compile(chapterTemplateHBS)

    let fp = contentFiles.map(async (chapterFilename) => {
      let file = book.files.filter((f) => f.name === chapterFilename)[0]
      let contentMarkdown = await file.text()
      let contentHtml = md.render(contentMarkdown)
      contentHtml = fix(contentHtml)
      let destinationFilename = chapterFilename.replace(".md", ".html")
      let destination = `${siteFolder}/book/${destinationFilename}`

      toc[destinationFilename] = extractToc(contentHtml, destinationFilename)
      toc[destinationFilename].content = contentHtml
      toc[destinationFilename].destination = destination
    })

    let spine = contentFiles.map((f) => {
      let i = f.split(".")[0]
      return { id: `c-${i}`, file: i, htmlFile: `${i}.html` }
    })

    // site zip file...
    Promise.all([...fi, ...fp]).then(() => {
      spine = spine.map((s) => {
        s.toc = toc[s.htmlFile]
        return s
      })

      console.log(spine)

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
      spine.forEach((item, index) => {
        let data = chapterTemplate({ book, spine, index, html: item.toc.content })
        ensureFolders(item.toc.destination)
        fs.writeFileSync(item.toc.destination, data)
      })

      let zip = new JSZip()
      addToZip(zip, `${bookSlug}-site`, siteFolder)
      zip.generateAsync({ type: "blob" }).then(
        function (blob) {
          blob.arrayBuffer().then((siteBuffer) => {
            let Buffer = BrowserFS.BFSRequire("buffer").Buffer
            fs.writeFileSync(
              `/sites/${bookSlug}-site.zip`,
              Buffer.from(siteBuffer)
            )
            staticSiteGenerating.set(false)
            console.timeEnd("Generating site")
            resolve()
          })
        },
        function (err) {
          staticSiteGenerating.set(false)
          reject(err)
        }
      )
    })
  })
}
