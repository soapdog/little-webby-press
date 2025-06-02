import m from "mithril";
import { getFilesFromDataTransferItems } from "datatransfer-files-promise";
import Header from "./lib/header.js";
import Footer from "./lib/footer.js";
import { render } from "./lib/text-utilities.js";
import { bookFromFiles } from "./lib/book.js";
import { initializeFilesystem } from "./lib/fs.js";
import { generateEpub } from "./lib/epub.js";
import { generateSite } from "./lib/site.js";

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

let generatingSite = false;
let generatingBook = false;

const buildBook = async () => {
  generatingBook = true;
  await initializeFilesystem();
  await generateEpub(book);
  generatingBook = false;
};

const buildSite = async () => {
  generatingSite = true;
  generatingBook = true;
  await initializeFilesystem();
  await generateSite(book);
  generatingBook = false;
  generatingSite = false;
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
      m(".container", m(Metadata, { book })),
      m(
        "footer",
        m("nav", [
          m("ul", m("li", m("small", ""))),
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
              m(
                "button",
                {
                  onclick: buildSite,
                  "aria-busy": generatingSite ? "true" : "false",
                  disabled: generatingSite,
                },
                generatingSite
                  ? "Building Book & Website..."
                  : "Build Book & Website",
              ),
            ),
          ]),
        ]),
      ),
    ]);
  },
};

const Metadata = {
  oninit: (vnode) => {
    const metadata = vnode.attrs.book.config.metadata;
    const cover_path = metadata.cover;
    const cover_obj = book.files.find((f) => f.filepath == cover_path);
    vnode.state.loadingCover = true;
    vnode.state.cover = cover_obj;
    vnode.state.activeTab = "metadata";
  },
  view: (vnode) => {
    const book = vnode.attrs.book;
    const metadata = book.config.metadata;
    const author = book.config.author;
    const cover = vnode.state.cover;
    const activeTab = vnode.state.activeTab;

    return [
      m(
        "nav",
        m("ul", [
          m(
            "li",
            m("button", {
              disabled: activeTab == "metadata",
              onclick: ((e) => vnode.state.activeTab = "metadata"),
            }, "Information"),
          ),
          m(
            "li",
            m("button", {
              disabled: activeTab == "chapters",
              onclick: ((e) => vnode.state.activeTab = "chapters"),
            }, "Manuscript Files"),
          ),
        ]),
      ),
      activeTab == "metadata"
        ? m("div.book-info", [
          m("figure", [
            m("img", { src: URL.createObjectURL(cover) }),
          ]),
          m("div.metadata", [
            m("strong", "Title"),
            m("span", metadata.title),
            m("strong", "Subtitle"),
            m("span", metadata.subtitle),
            m("hr"),
            m("strong", "Author"),
            m("span", author.name),
            m("strong", "Author's Bio"),
            m("span", author.bio),
            m("strong", "Publisher"),
            m("span", book.config.publisher.name),
          ]),
        ])
        : m(
          "div.chapters",
          m(
            "table",
            m(
              "tbody",
              book.config.book.chapters.map((c) => m("tr", m("td", c))),
            ),
          ),
        ),
    ];
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

            m("input[type=file]", {
              class: "hidden",
              id: "file-input",
              webkitdirectory: true,
              multiple: true,
              directory: true,
              onchange: filesLoaded,
            }),

            m("li", [
              m(
                "a",
                { role: "button", onclick: loadFiles },
                "Load Manuscript Folder",
              ),
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
