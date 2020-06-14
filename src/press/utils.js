import BrowserFS from "browserfs"
import slug from "slug"

export function initializeFilesystem() {
    return new Promise((resolve, reject) => {
        fetch('templates.zip').then(function (response) {
            console.log(response)
            return response.arrayBuffer();
        }).then(function (zipData) {
            var Buffer = BrowserFS.BFSRequire('buffer').Buffer;

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
                    "/books": { fs: "IndexedDB", options: { storeName: "books" } }
                }
            }, function (e) {
                if (e) {
                    fs = false
                    reject(e)
                }
                BrowserFS.install(window)
                resolve(BrowserFS)
            });
        })
    })
}

function copyFile(source, destination) {
    let fs = require("fs")

    if (fs.existsSync(source)) {
        let contents = fs.readFileSync(source)
        fs.writeFileSync(destination, contents, "utf8","wx+")
    }
}

function copyFolder(source, destination) {
    let fs = require("fs")

    let items = fs.readdirSync(source)
    debugger
    items.forEach(f => {
        let sourcePath = `${source}/${f}`
        let destinationPath = `${destination}/${f}`
        let s = fs.statSync(sourcePath)
        if (s.isDirectory()) {
            fs.mkdirSync(destinationPath)
            copyFolder(sourcePath, destinationPath)
        } else {
            copyFile(sourcePath, destinationPath)
        }
    })

}

export function createEpubFolder(book) {
    let folder = slug(book.config.metadata.title)
    let fs = require("fs")
    folder = `/tmp/${folder}`

    fs.mkdirSync(folder)
    copyFolder("/templates/epub", folder)

}
