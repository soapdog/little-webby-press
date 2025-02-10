/*
Documentation for ZenFS: https://zenfs.dev/core/documents/Overview.html

- Converting from BrowserFS to ZenFS (wip)
*/


import { configure, InMemory, fs } from '@zenfs/core';
import { IndexedDB } from '@zenfs/dom';
import { Zip } from '@zenfs/archives';


export async function loadManuscriptFromURL(pURL) {
  console.log("attempting to fetch", pURL)
  let data = await fetch(pURL)
  console.log(data)
}

export function initializeFilesystem() {
  return new Promise((resolve, reject) => {
      fetch("templates.zip").then(function(response) {
        return response.arrayBuffer();
      }).then(function(zipData) {

          configure({
                mounts: {
                  "/templates": { backend: Zip, data: zipData },
                  "/tmp": InMemory,
                  "/books": InMemory,
                  "/sites": InMemory
                }

              }
            },
            function(e) {
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
  if (fs.existsSync(source)) {
    let contents = fs.readFileSync(source)
    fs.writeFileSync(destination, contents, "utf8", "wx+")
  } else {
    console.warn("copyFile, source doesn't exist", source)
  }
}

export function copyFolder(source, destination) {
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

export async function generateResizedCovers(book, folder) {
  // const fs = require("fs")
  // const path = require("path")
  // const reduce = Reduce()

  // let coverPath = book.config.metadata.cover
  // let ext = path.extname(coverPath)
  // let resizedCoverPath = book.config.metadata.cover
  //   .replace(ext, `-med${ext}`)

  // let cover = book.files.find(f => f.filepath === coverPath)
  // let Buffer = BrowserFS.BFSRequire("buffer").Buffer;

  // let resizedBlob = await reduce.toBlob(cover, {max: 512})
  // let resizedData = Buffer.from(await resizedBlob.arrayBuffer())

  // fs.writeFileSync(`${folder}/${resizedCoverPath}`, resizedData)
  const path = require("path")
  let coverPath = book.config.metadata.cover
  let ext = path.extname(coverPath)
  let resizedCoverPath = book.config.metadata.cover
    .replace(ext, `-med${ext}`)
  console.log("coverPath", coverPath)
  console.log("res", `${folder}/${resizedCoverPath}`)
  copyFile(`${folder}/${coverPath}`, `${folder}/${resizedCoverPath}`)

}

export function loadExternalTheme(book) {
  let files = book.files.filter(f => {
    if (f.filepath.match(/^_theme/)) {
      return true
    }

    return false
  });

  let fps = files.map(async f => {
    let file = f.filepath.replace("_theme/", "")
    let data = await f.arrayBuffer()
    let Buffer = BrowserFS.BFSRequire("buffer").Buffer;
    let d2 = Buffer.from(data)
    let p = `/templates/${file}`
    ensureFolders(p)
    fs.writeFileSync(p, d2)
  })
  return fps
}

export function addToZip(zip, slug, folder) {
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
