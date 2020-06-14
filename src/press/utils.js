import BrowserFS from "browserfs"
import slug from "slug"
import marked from "marked"

export function initializeFilesystem() {
    return new Promise((resolve, reject) => {
        fetch('templates.zip').then(function (response) {
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
        fs.writeFileSync(destination, contents, "utf8", "wx+")
    }
}

function copyFolder(source, destination) {
    let fs = require("fs")

    let items = fs.readdirSync(source)

    items.forEach(f => {
        // skip handlebar files, copy the rest.
        if (f.indexOf(".hbs") === -1) { 
            let sourcePath = `${source}/${f}`
            let destinationPath = `${destination}/${f}`
            let s = fs.statSync(sourcePath)
            if (s.isDirectory()) {
                fs.mkdirSync(destinationPath)
                copyFolder(sourcePath, destinationPath)
            } else {
                copyFile(sourcePath, destinationPath)
            }
        }
    })

}

export function createEpubFolder(book) {
    let folder = slug(book.config.metadata.title)
    let fs = require("fs")
    folder = `/tmp/${folder}`

    fs.mkdirSync(folder)
    copyFolder("/templates/epub", folder) 

    let chapterTemplateHBS = fs.readFileSync("/templates/epub/chapter.hbs", "utf8")
    let chapterTemplate = Handlebars.compile(chapterTemplateHBS)
    book.config.profiles.book.forEach(async chapterFilename => {
        let file = book.files.filter(f => f.name === chapterFilename)[0]

        let contentMarkdown = await file.text()
        let contentHtml = marked(contentMarkdown)
        let destinationFilename = chapterFilename.replace(".md",".html")
        let destination = `${folder}/OPS/${destinationFilename}`
        let data = chapterTemplate({html: contentHtml})
        fs.writeFileSync(destination, data)
    })
}
