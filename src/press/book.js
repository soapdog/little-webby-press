import toml from "toml"
import yaml  from "js-yaml"
import _ from "lodash"

let configurationFiles = [
  "book.toml",
  "book.yaml",
  "book.json",
]

/**
 * This is the defaulf book configuration object.
 * Be aware that we change types depending on the content.
 *
 * Certain properties will be either `false` or have a string.
 */
export const defaultBookConfiguration = {
  metadata: {
    title: "Untitled",
    subtitle: false,
    date: new Date(),
    identifier: false,
    cover: false,
    language: "en",
    license: false,
  },
  publisher: {
    name: false,
    bio: false,
    links: []
  },
  author: {
    name: false,
    photo: false,
    bio: false,
    links: []
  },
  site: {
    enabled: false,
    theme: "generic",
    frontmatter: [],
    chapters: [],
    backmatter: [],
    blurb: false,
    actions: {
      "download": "Download the eBook",
      "read": "Free To Read Online",
      "toc": "Table Of Contents"
    },
    labels: {
      "about-book": "About The Book",
      "about-author": "About The Author",
      "toc": "Table Of Contents"
    }
  },
  webmonetization: {
    enabled: false,
    endpoint: false,
    frontmatter: [],
    chapters: [],
    backmatter: []
  },
  toc: {
    prefix: false,
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
      case "yaml":
        config = yaml.load(await conf.text())
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
