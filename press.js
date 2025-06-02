import m from "mithril";
import { getFilesFromDataTransferItems } from "datatransfer-files-promise";
import Header from "./header.js";
import Footer from "./footer.js";
import { render } from "./text-utilities.js";
import { bookFromFiles } from "./book.js";
import { initializeFilesystem } from "./common/fs.js"
import { generateEpub } from "./epub.js";

/**
 * BE AWARE
 *
 * This book generation tool is spaghettish. The code was done while maniacally giggling and pondering
 * how beautiful waterfalls are.
 *
 * In this file you'll find:
 *
 * - All the book generation workflow.
 * - A "tabbed" section that allows the user to inspect all the information about the book
 */

let bookLoaded = false;
let book;
let files = [];

/*
== Metadata & Book Generation Actions ========================================================================
*/

let status = "";
let generatingSite = false;
let generatingBook = false;

const buildBook = async () => {
  generatingBook = true;
  let vfs = await initializeFilesystem()
  let r = await generateEpub(book)
  generatingBook = false;
};

const buildSite = () => {
  generatingSite = true;
};

const Press = {
  view: (vnode) => {
    return m("article", [
      m(
        "header",
        m("hgroup", [
          m("h5", book.config.metadata.title ?? "Unknown Title"),
          book.config.metadata.subtitle
            ? m("p", book.config.metadata.subtitle)
            : "",
        ]),
      ),
      m(".container"),
      m(
        "footer",
        m("nav", [
          m("ul", m("li", m("small", status))),
          m("ul", [
            m(
              "li",
              m("button", {
                onclick: buildBook,
                "aria-busy": generatingBook ? "true" : "false",
                disabled: generatingBook,
              }, generatingBook ? "Building book..." : "Build Book"),
            ),
            m(
              "li",
              m("button", {
                onclick: buildSite,
                "aria-busy": generatingSite ? "true" : "false",
                disabled: generatingSite,
              }, generatingSite ? "Building Website...":"Build Website"),
            ),
          ]),
        ]),
      ),
    ]);
  },
};

/*
== Instructions & File Drop Area =============================================================================
*/

const instructions = `
Drag & Drop a folder containing your manuscript to get started.

Little Webby Press is a tool to build _books_ and _websites_ from a _manuscript folder_. You write your book
on your computer. There is no back-end service involved, the book generation happens locally. It is all done in your browser. 
At the end of it, you'll have two zip files, one containing your book in EPUB3 non-DRM format and another with the HTML for 
a website.  

Your manuscript folder needs to follow some rules, check out the [getting started guide](/books/getting-started/) to learn more. If you prefer you can
[watch a video](https://youtu.be/rqsmSJY21Vw) about it.	
`;

const loadFiles = (_evt) => {
  document.getElementById("file-input").click();
};

const filesLoaded = async (evt) => {
  evt.preventDefault();

  files = Array.from(evt.target.files);
  // FileList does not contain "filepath" property like DataTransferItem do.
  // That property is used by book.js.
  // It's value is apparently the same as name.
  files = files.map((i) => {
    i.filepath = i.webkitRelativePath;
    return i;
  });

  book = await bookFromFiles(files);
  if (book instanceof Error) {
    //stage = "error";
    bookLoaded = false;
    console.log("error", book);
  } else {
    bookLoaded = true;
    console.log("book", book);
  }
};

const Splash = {
  oncreate: (_vnode) => {
    const dropzone = document.querySelector(".drop-area");
    dropzone.addEventListener("dragover", (evt) => {
      evt.preventDefault();
      // stage = "over";
      dropzone.classList.add("over");
    });
    dropzone.addEventListener("dragleave", (evt) => {
      evt.preventDefault();
      // stage = "waiting";
      dropzone.classList.remove("over");
    });
    dropzone.addEventListener("drop", async (evt) => {
      evt.preventDefault();

      // msg = $_("getting-file-list");
      // stage = "loading";
      dropzone.classList.remove("over");

      files = await getFilesFromDataTransferItems(
        evt.dataTransfer.items,
      );
      console.log("files", files);

      // msg = $_("loading-configuration");
      book = await bookFromFiles(files);
      if (book instanceof Error) {
        // stage = "error";
        bookLoaded = false;
      } else {
        // stage = "loaded";
        bookLoaded = true;
      }
      m.redraw();
    });
  },
  view: (vnode) => {
    return m("article.drop-area", [
      m("strong", "You haven't loaded any book."),
      m("p", m.trust(render(instructions))),
      m(
        "footer",
        m("nav", [
          m("ul"),
          m("ul", [
            m(
              "li",
              m("a", {
                role: "button",
                href: "/books/getting-started/",
                target: "_blank",
              }, "Read The Getting Started Guide"),
            ),
            m("li", [
              m("button", { onclick: loadFiles }, "Load Manuscript Folder"),
              m("input[type=file]", {
                class: "hidden",
                id: "file-input",
                webkitdirectory: true,
                multiple: true,
                directory: true,
                onchange: filesLoaded,
              }),
            ]),
          ]),
        ]),
      ),
    ]);
  },
};

/*
== Root ===========================================================================================================
*/

export default {
  view: (vnode) => {
    return [
      m(Header),
      m("main.container", bookLoaded ? m(Press) : m(Splash)),
      m(Footer),
    ];
  },
};
