const calver = require("calver")
const pkg = require("./package.json")
const fs = require("fs")

const format = "yyyy.mm.minor"
const nextVersion = calver.inc(format,pkg.version,"minor")

pkg.version = nextVersion

fs.writeFileSync("./package.json", JSON.stringify(pkg,null,2))

