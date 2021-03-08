import toml from "toml"
import _ from "lodash"

let configurationFiles = [
	"book.toml",
	"book.json",
]

export const defaultBookConfiguration = {
	metadata: {
		title: "Untitled",
		author: "Unnamed Author",
		publisher: "",
		date: new Date("2021-03-08T17:52:15"),
		identifier: "",
	},
	site: {
		enabled: false,
	},
	webmonetization: {
		enabled: false,
		endpoint: "",
	},
	toc: {
		prefix: "",
		label: "h1",
		match: "all"
	},
	book: {
		enabled: false,
		theme: "generic",
		frontmatter: [],
		chapters: [],
		backmatter: []
	}
}

export default class Book {
	constructor(config, files) {
		this.config = config
		this.files = files
	}
}

export async function bookFromFiles(files) {
	// look for Book configuration files
	let conf = files.filter((file) => {
		return configurationFiles.includes(file.name.toLowerCase())
	})[0]

	if (conf) {
		let rootFolder = conf.filepath.split("/").reverse()
		rootFolder.shift()
		rootFolder.reverse().join("/")

		files = files.map((f) => {
			f.filepath = f.filepath.replace(`${rootFolder}/`, "")
			return f
		})

		let config = {}
		let ext = conf.filepath.split(".").reverse()[0]
		switch (ext) {
			case "toml":
				config = toml.parse(await conf.text())
				break
			case "json":
				config = JSON.parse(await conf.text())
				break
			default:
				return new Error("error-no-configuration")
		}

		let book = new Book(_.defaultsDeep(config, defaultBookConfiguration), files)
		return book
	} else {
		return new Error("error-no-configuration")
	}
}
