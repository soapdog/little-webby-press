import BrowserFS from "browserfs"
import slug from "slug"
import marked from "marked"
import mime from "mime"
import saveAs from "file-saver"
import Book from "./book.js";
import toml from "toml";

marked.setOptions({
    xhtml: true
})

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

function copyImages(book, destination) {
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
        let Buffer = BrowserFS.BFSRequire('buffer').Buffer;
        let d2 = Buffer.from(data)
        let p = `${destination}/${file}`
        ensureFolders(p)
        fs.writeFileSync(p, d2)
    })
    return fps

}

function addToZip(zip, slug, folder) {
    let fs = require("fs")

    let items = fs.readdirSync(folder)
    console.log(folder, items)
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

function ensureFolders(path) {
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



export function createEpubFolder(book) {
    let bookSlug = slug(book.config.metadata.title)
    let fs = require("fs")
    let folder = `/tmp/${bookSlug}`

    fs.mkdirSync(folder)
    let fp = copyFolder("/templates/epub", folder)
    fs.mkdirSync(`${folder}/OPS/images`)
    let fi = copyImages(book, `${folder}/OPS`)

    let chapterTemplateHBS = fs.readFileSync("/templates/epub/chapter.hbs", "utf8")
    let chapterTemplate = Handlebars.compile(chapterTemplateHBS)
    book.config.profiles.book.forEach(async chapterFilename => {
        let file = book.files.filter(f => f.name === chapterFilename)[0]

        let contentMarkdown = await file.text()
        let contentHtml = marked(contentMarkdown)
        let destinationFilename = chapterFilename.replace(".md", ".xhtml")
        let destination = `${folder}/OPS/${destinationFilename}`
        let data = chapterTemplate({ html: contentHtml })
        fs.writeFileSync(destination, data)

    })
    let manifest = []

    let files = book.files.filter(f => {
        if (book.config.profiles.book.includes(f.name)) {
            return true
        }

        if (f.filepath.match(/^images/)) {
            return true
        }

        return false
    });
    files.forEach(file => {
        let f = file.filepath
        f = f.replace(".md", ".xhtml")
        let m = mime.getType(f)
        let i = file.name.split(".")[0]
        manifest.push({
            id: i,
            file: f,
            mime: m
        })
    })

    let spine = book.config.profiles.book.map(f => f.split(".")[0])

    book.config.metadata.date = book.config.metadata.date.toISOString()
    let packateHBS = fs.readFileSync("/templates/epub/package.hbs", "utf8")
    let packageTemplate = Handlebars.compile(packateHBS)
    let packageData = packageTemplate({ book, manifest, spine })
    fs.writeFileSync(`${folder}/OPS/package.opf`, packageData)
    // console.log(packageData)

    Promise.all(fi).then(() => {
        let zip = new JSZip()
        let mimetype = fs.readFileSync(`${folder}/mimetype`)
        zip.file("mimetype", mimetype)
        addToZip(zip, bookSlug, folder)
        zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, `${bookSlug}.epub`);
        }, function (err) {
            console.error(err);
        });
    })
}

export async function processDroppedFiles(files) {
    // look for Book.toml
    let tomlFile = files.filter(file => {
        return file.name.toLowerCase() == "book.toml";
    })[0];

    if (tomlFile) {
        let rootFolder = tomlFile.filepath.split("/").reverse();
        rootFolder.shift();
        rootFolder.reverse().join("/");

        files = files.map(f => {
            f.filepath = f.filepath.replace(`${rootFolder}/`, "");
            return f;
        });

        let config = toml.parse(await tomlFile.text());
        let book = new Book(config, files);
        return book
    } else {
        return new Error("Can't find Book.toml file")
    }
}