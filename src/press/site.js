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
import JSZip from "jszip"
import { generateEpub } from "./epub.js"



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
	return new Promise((resolve, reject) => {
		let bookSlug = slugify(book.config.metadata.title)
		let fs = require("fs")
		let siteFolder = `/tmp/${bookSlug}-site`
		let bookFile = `/tmp/${bookSlug}.epub`

		setTheme(book.config.book.theme)

		if (!fs.existsSync(themeFolder())) {
			reject({message: "theme-not-found"})
		}

		if (!fs.existsSync(bookFile)) {
			generateEpub(book)
		}

		if (!fs.existsSync(siteFolder)) {
			fs.mkdirSync(siteFolder)
		}


		ensureFolders("${siteFolder}/index.html")
		copyFolder(themeFolder(), siteFolder)
		fs.writeFileSync(`${siteFolder}/book.epub`, fs.readFileSync(bookFile))

		// site zip file
		let zip = new JSZip()
		addToZip(zip, `${bookSlug}-site`, siteFolder)
		zip.generateAsync({ type: "blob" }).then(
			function (blob) {
				saveAs(blob, `${bookSlug}-site.zip`)
				resolve()
			},
			function (err) {
				reject(err)
			}
		)
	})
}
