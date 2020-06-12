import BrowserFS from "browserfs"

export function initialize() {
    return new Promise((resolve, reject) => {
        BrowserFS.configure({
            fs: "MountableFileSystem",
            options: {
                "/tmp": { fs: "InMemory" },
                "/books": { fs: "IndexedDB", options: { storeName: "books" }}
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
}
