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
            console.log("dest", destinationPath)
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