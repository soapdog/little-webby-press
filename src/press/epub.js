import BrowserFS from "browserfs"

import MarkdownIt from "markdown-it"
import MarkdownFootnote from "markdown-it-footnote"
import MarkdownAnchor from "markdown-it-anchor"
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
} from "../common/utils.js"

// DEFAULT OPTIONS
let md = new MarkdownIt({
	xhtmlOut: true,
})
	.use(MarkdownFootnote)
	.use(MarkdownAnchor, { slugify })

// IMPLEMENTATION

export function generateEpub(book) {
	// Sit back, relax, and enjoy the waterfall...
	return new Promise((resolve, reject) => {
		console.log(book.config)
		let bookSlug = slugify(book.config.metadata.title)
		let fs = require("fs")
		let folder = `/tmp/${bookSlug}`
		let toc = {}
		let manifest = []

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder)
		}
		ensureFolders("${folder}/OPS/package.opf")
		copyFolder("/templates/epub", folder)
		let fi = copyImages(book, `${folder}/OPS`)

		registerToCLabel(book.config.toc.label)
		registerToCMatchRules(book.config.toc.match)
		registerToCPrefix(book.config.toc.prefix)

		let chapterTemplateHBS = fs.readFileSync(
			"/templates/epub/chapter.hbs",
			"utf8"
		)
		let chapterTemplate = Handlebars.compile(chapterTemplateHBS)

		// Add HTML Chapters
		let contentFiles = [
			...book.config.ebook.frontmatter,
			...book.config.ebook.chapters,
		]
		let fp = contentFiles.map(async (chapterFilename) => {
			let file = book.files.filter((f) => f.name === chapterFilename)[0]

			let contentMarkdown = await file.text()
			let contentHtml = md.render(contentMarkdown)
			contentHtml = fix(contentHtml)
			let destinationFilename = chapterFilename.replace(".md", ".xhtml")
			let destination = `${folder}/OPS/${destinationFilename}`
			let data = chapterTemplate({ html: contentHtml })
			fs.writeFileSync(destination, data)

			// due to the async nature of this code, the ToC won't ready until
			// all promises complete.
			if (!book.config.ebook.frontmatter.includes(chapterFilename)) {
				toc[destinationFilename] = extractToc(contentHtml, destinationFilename)
			}
		})

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
			f = f.replace(".md", ".xhtml")
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

		let packageHBS = fs.readFileSync("/templates/epub/package.hbs", "utf8")
		let packageTemplate = Handlebars.compile(packageHBS)
		let packageData = packageTemplate({ book, manifest, spine })
		fs.writeFileSync(`${folder}/OPS/package.opf`, packageData)

		// toc.ncx
		let tocncxHBS = fs.readFileSync("/templates/epub/toc.ncx.hbs", "utf8")
		let tocncxTemplate = Handlebars.compile(tocncxHBS)
		let tocncxData = tocncxTemplate({ book, manifest, spine })
		fs.writeFileSync(`${folder}/OPS/toc.ncx`, tocncxData)

		// cover.xhtml
		let coverHBS = fs.readFileSync("/templates/epub/cover.hbs", "utf8")
		let coverTemplate = Handlebars.compile(coverHBS)
		let coverData = coverTemplate({ book })
		fs.writeFileSync(`${folder}/OPS/cover.xhtml`, coverData)

		Promise.all([...fi, ...fp]).then(() => {
			// toc.xhtml
			let tocHBS = fs.readFileSync("/templates/epub/toc.hbs", "utf8")
			let tocTemplate = Handlebars.compile(tocHBS)
			spine = spine.map((s) => {
				s.toc = toc[s.htmlFile]
				return s
			})
			let tocData = tocTemplate({ book, manifest, spine })
			fs.writeFileSync(`${folder}/OPS/toc.xhtml`, tocData)

			// EPUB3 file
			let zip = new JSZip()
			let mimetype = fs.readFileSync(`${folder}/mimetype`)
			zip.file("mimetype", mimetype)
			addToZip(zip, bookSlug, folder)
			zip.generateAsync({ type: "blob" }).then(
				function (epubBlob) {
					epubBlob.arrayBuffer().then((epubBuffer) => {
						let Buffer = BrowserFS.BFSRequire("buffer").Buffer
						console.log(epubBlob)
						fs.writeFileSync(`/tmp/${bookSlug}.epub`, Buffer.from(epubBuffer))
						saveAs(epubBlob, `${bookSlug}.epub`)
						resolve()
					})
				},
				function (err) {
					reject(err)
				}
			)
		})
	})
}
