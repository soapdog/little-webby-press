/*
Used to use ZenFS but now I'm gonna macgyver the shit out of this

Storing all the filesystem data into a JS object now, let the garbage collector
handle that shit.
*/

import JSZip from "jszip";
import mime from "mime";

const vfs = {};

export function fileExists(filePath) {
  // console.dir(Object.keys(vfs))
  if (Object.hasOwn(vfs, filePath)) {
    return true;
  }

  let keys = Object.keys(vfs);
  let matches = keys.filter((f) => f.startsWith(filePath));

  if (matches.length > 0) {
    return true;
  }

  return false;
}

export function dumpVFS() {
  return vfs;
}

export function readFile(filePath) {
  return vfs[filePath];
}

export function writeFile(filePath, contents) {
  vfs[filePath] = contents;
  // console.log(`wrote ${filePath}`)
}

export function filesFromFolder(folder) {
  const files = Object.keys(vfs);
  const matches = files.filter((p) => p.startsWith(folder));
  return matches.map((p) => {
    p = p.replace(folder, "");

    if (p.startsWith("/")) {
      p = p.slice(1);
    }
    return p;
  });
}

export function extname(filePath) {
  const temp = filePath.split(".");
  return "." + temp.pop();
}

export async function initializeFilesystem() {
  // a gambi é forte aqui.
  const response = await fetch("files/templates.zip");
  const zipData = await response.arrayBuffer();

  let ps = [];

  let zip = await JSZip.loadAsync(zipData);

  zip.forEach((r, f) => {
    // console.log(`zip ${r}`, f);

    if (f.dir) {
      return;
    }

    if (r.endsWith(".DS_Store")) {
      return;
    }

    if (r.endsWith("/")) {
      r = r.slice(0, -1);
    }

    let type = mime.getType(r);

    let asyncType = "string";

    if (type == null) {
      type = "text/plain";
    }

    if (type.startsWith("image/")) {
      asyncType = "arraybuffer";
    }

    ps.push(
      new Promise((resolve, reject) => {
        f.async(asyncType).then((data) => {
          vfs[`/templates/${r}`] = data;
          resolve();
        });
      }),
    );
  });
  await Promise.allSettled(ps);

  return vfs;
}

export function copyFile(source, destination) {
  if (fileExists(source)) {
    let contents = readFile(source);
    writeFile(destination, contents);
  } else {
    console.warn("copyFile, source doesn't exist", source);
    console.log(Object.keys(vfs));
    console.log(Object.keys(vfs).filter((p) => p.startsWith(source)));
  }
}

export function copyFolder(source, destination) {
  let items = filesFromFolder(source);
  for (let x = 0; x < items.length; x++) {
    let f = items[x]; //.split("/").pop();
    // skip handlebar files, copy the rest.
    // console.log(`attempting copy from ${f} to ${destination} `)
    if (f.indexOf(".hbs") === -1) {
      let sourcePath = `${source}/${f}`;
      let destinationPath = destination + "/" + f.replace(source, "");

      copyFile(sourcePath, destinationPath);
      // console.log(Object.keys(vfs))
    }
  }
}

export function getFileExtension(filename) {
  // TODO: this is stupid algo.
  let arr = filename.split(".");
  return arr.pop();
}

export function copyImages(book, destination) {
  let files = book.files.filter((f) => {
    if (f.filepath.match(/^images/)) {
      return true;
    }

    return false;
  });

  let fps = files.map(async (f) => {
    let file = f.filepath;
    let data = await f.arrayBuffer();
    let p = `${destination}/${file}`;
    writeFile(p, data);
  });
  return fps;
}

export async function generateResizedCovers(book, folder) {
  let coverPath = book.config.metadata.cover;
  let ext = extname(coverPath);
  let resizedCoverPath = book.config.metadata.cover
    .replace(ext, `-med${ext}`);
  console.log("coverPath", coverPath);
  console.log("res", `${folder}/${resizedCoverPath}`);
  copyFile(`${folder}/${coverPath}`, `${folder}/${resizedCoverPath}`);
}

export function loadExternalTheme(book) {
  let files = book.files.filter((f) => {
    if (f.filepath.match(/^_theme/)) {
      return true;
    }

    return false;
  });

  let fps = files.map(async (f) => {
    let file = f.filepath.replace("_theme/", "");
    let data = await f.arrayBuffer();
    let p = `/templates/${file}`;
    writeFile(p, data);
  });
  return fps;
}

export function addToZip(zip, slug, folder) {
  let items = filesFromFolder(folder);
  while (items.length > 0) {
    let a1 = `${folder}/${items.shift()}`;

    let content = readFile(a1);
    let destinationPath = a1.replace(`/tmp/${slug}/`, "");
    zip.file(destinationPath, content);
    // console.log(`added ${destinationPath} to zip`);
  }
}
