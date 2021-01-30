import BrowserFS from "browserfs"


export function initializeFilesystem() {
    return new Promise((resolve, reject) => {
        fetch("templates.zip").then(function (response) {
            return response.arrayBuffer();
        }).then(function (zipData) {
            var Buffer = BrowserFS.BFSRequire("buffer").Buffer;

            BrowserFS.configure({
                fs: "MountableFileSystem",
                options: {
                    "/templates": {
                        fs: "ZipFS",
                        options: {
                            // Wrap as Buffer object.
                            zipData: Buffer.from(zipData)
                        }
                    },
                    "/tmp": { fs: "InMemory" },
                    "/books": { fs: "IndexedDB", options: { storeName: "books" } },
                    "/etc": { fs: "IndexedDB", options: { storeName: "etc" } },
                    "/integration": { fs: "IndexedDB", options: { storeName: "integration" } }

                }
            }, function (e) {
                if (e) {
                    reject(e)
                }
                BrowserFS.install(window)
                resolve(BrowserFS)
            });
        })
    })
}


export function copyFile(source, destination) {
    let fs = require("fs")

    if (fs.existsSync(source)) {
        let contents = fs.readFileSync(source)
        fs.writeFileSync(destination, contents, "utf8", "wx+")
    }
}

export function copyFolder(source, destination) {
    let fs = require("fs")

    let items = fs.readdirSync(source)
    for (let x = 0; x < items.length; x++) {
        let f = items[x]
        // skip handlebar files, copy the rest.
        if (f.indexOf(".hbs") === -1) {
            let sourcePath = `${source}/${f}`
            let destinationPath = `${destination}/${f}`
            ensureFolders(destinationPath)
            let s = fs.statSync(sourcePath)
            if (s.isDirectory()) {
                if (!fs.existsSync(destinationPath)) {
                    fs.mkdirSync(destinationPath)
                }
                copyFolder(sourcePath, destinationPath)
            } else {
                copyFile(sourcePath, destinationPath)
            }
        }
    }
}

export function getFileExtension(filename) {
    // TODO: this is stupid algo.
    let arr = filename.split(".")
    arr.reverse()
    return arr[0]
}

export function ensureFolders(path) {
    let fs = require("fs")

    let a = path.split("/")
    a.splice(0, 1)
    let a1 = `/${a.shift()}`
    while (a.length >= 1) {
        if (!fs.existsSync(a1)) {
            fs.mkdirSync(a1)
        }
        a1 = `${a1}/${a.shift()}`
    }
}

export function copyImages(book, destination) {
	let fs = require("fs")

	let files = book.files.filter(f => {
		if (f.filepath.match(/^images/)) {
			return true
		}

		return false
	});

	let fps = files.map(async f => {
		let file = f.filepath
		let data = await f.arrayBuffer()
		let Buffer = BrowserFS.BFSRequire("buffer").Buffer;
		let d2 = Buffer.from(data)
		let p = `${destination}/${file}`
		ensureFolders(p)
		fs.writeFileSync(p, d2)
	})
	return fps
}

export function addToZip(zip, slug, folder) {
	let fs = require("fs")

	let items = fs.readdirSync(folder)
	while (items.length > 0) {
		let a1 = `${folder}/${items.shift()}`
		let stat = fs.statSync(a1)
		if (stat.isDirectory()) {
			addToZip(zip, slug, a1)
		} else {
			let content = fs.readFileSync(a1)
			let destinationPath = a1.replace(`/tmp/${slug}/`, "")
			zip.file(destinationPath, content)
		}
	}
}
