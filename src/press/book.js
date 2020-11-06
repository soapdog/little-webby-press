import toml from "toml";

export default class Book {
    constructor(config, files) {
        this.config = config
        this.files = files
    }
}

export async function bookFromFiles(files) {
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