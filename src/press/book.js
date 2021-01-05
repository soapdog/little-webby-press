import toml from "toml"

// TODO: implement them all
let configurationFiles = [
	"book.lua",
	"book.toml",
	"book.ini",
	"book.json",
	"book.txt",
]

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
			default:
				return new Error("error-no-configuration")
		}

		let book = new Book(config, files)
		return book
	} else {
		return new Error("error-no-configuration")
	}
}
