import MarkdownIt from "markdown-it"
import saveAs from "file-saver"
import slugify from "slugify"
import {
	copyFolder,
	ensureFolders,
	copyImages,
	addToZip,
} from "../common/fs.js"
import "../common/templateHelpers.js"
import Handlebars from "handlebars"
import JSZip from "jszip"
import { generateEpub } from "./epub.js"
import { staticSiteGenerating} from "./stores.js"
// markdown & plugins
import MarkdownIt from "markdown-it"
import MarkdownFootnote from "markdown-it-footnote"
import MarkdownAnchor from "markdown-it-anchor"
import MarkdownAttrs from "markdown-it-attrs"
import MarkdownBracketedSpans from "markdown-it-bracketed-spans"
import MarkdownImplicitFigues from "markdown-it-implicit-figures"
import MarkdownCenterText from "markdown-it-center-text"
import MarkdownEmoji from "markdown-it-emoji"


// DEFAULT OPTIONS
let md = new MarkdownIt({
	xhtmlOut: true,
	linkify: true,
	typographer: true,
})
	.use(MarkdownFootnote)
	.use(MarkdownAnchor, { slugify })
	.use(MarkdownBracketedSpans)
	.use(MarkdownAttrs)
	.use(MarkdownImplicitFigues, { figcaption: true })
	.use(MarkdownEmoji)
	.use(MarkdownCenterText)

// IMPLEMENTATION

let currentTheme = "generic"

function setTheme(theme) {
	currentTheme = theme
}

function themeFolder() {
	return `/templates/${currentTheme}/site`
}

function themePathFor(file) {
	return `${themeFolder()}/${file}`
}

export function generateSite(book) {
	// Sit back, relax, and enjoy the waterfall...
	console.log("Generate site", book)
	return new Promise((resolve, reject) => {
		let bookSlug = slugify(book.config.metadata.title)
		let fs = require("fs")
		let siteFolder = `/tmp/${bookSlug}-site`
		let bookFile = `/books/${bookSlug}.epub`

		staticSiteGenerating.set(true)

		setTheme(book.config.book.theme)

		if (!fs.existsSync(themeFolder())) {
			reject({message: "theme-not-found"})
		}

		if (!fs.existsSync(bookFile)) {
			generateEpub(book).then(() => {
				generateSite(book)
					.then(() => resolve())
					.catch(n => reject(n))
			})
			return false
		}

		if (!fs.existsSync(siteFolder)) {
			fs.mkdirSync(siteFolder)
		}

		// Copy files over...
		ensureFolders(`${siteFolder}/files/${bookSlug}.epub`)
		copyFolder(themeFolder(), siteFolder)
		fs.writeFileSync(`${siteFolder}/files/${bookSlug}.epub`, fs.readFileSync(bookFile))

		let fi = copyImages(book, `${siteFolder}`)


		// Templating
		if (book.config.site.description) {
			book.config.site.description = md.render(book.config.site.description)
		}

		if (book.config.site.blurb) {
			book.config.site.blurb = md.render(book.config.site.blurb)
		}

		let indexTemplateHBS = fs.readFileSync(
			themePathFor("index.hbs"),
			"utf8"
		)

		let indexTemplate = Handlebars.compile(indexTemplateHBS)
		let contents = indexTemplate({book})
		fs.writeFileSync(`${siteFolder}/index.html`, contents)

		// site zip file...
		Promise.all([...fi]).then(() => {
			let zip = new JSZip()
			addToZip(zip, `${bookSlug}-site`, siteFolder)
			zip.generateAsync({ type: "blob" }).then(
				function (blob) {
					saveAs(blob, `${bookSlug}-site.zip`)
					staticSiteGenerating.set(false)
					resolve()
				},
				function (err) {
					staticSiteGenerating.set(false)
					reject(err)
				}
			)
		})
	})
}
