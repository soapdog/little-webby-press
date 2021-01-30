import MarkdownIt from "markdown-it"
import saveAs from "file-saver"
import slugify from "slugify"
import {
	copyFolder,
	ensureFolders,
	copyImages,
	addToZip,
} from "../common/fs.js"

// IMPLEMENTATION

export function generateSite(book) {
	// Sit back, relax, and enjoy the waterfall...
	return new Promise((resolve, reject) => {
		let bookSlug = slugify(book.config.metadata.title)
		let fs = require("fs")
		let siteFolder = `/tmp/${bookSlug}-site`
		let bookFile = `/tmp/${bookSlug}.epub`

		if (!fs.existsSync(bookFile)) {
			reject("no epub")
		}

		if (!fs.existsSync(siteFolder)) {
			fs.mkdirSync(siteFolder)
		}
		ensureFolders("${siteFolder}/index.html")
		copyFolder("/templates/site", siteFolder)
		fs.writeFileSync(
			`${siteFolder}/${bookSlug}.epub`,
			fs.readFileSync(bookFile)
		)

		// site zip file
		let zip = new JSZip()
		addToZip(zip, bookSlug, siteFolder)
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
