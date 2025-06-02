import slugify from "slugify";
import {
  addToZip,
  copyFolder,
  copyImages,
  extname,
  fileExists,
  filesFromFolder,
  generateResizedCovers,
  loadExternalTheme,
  readFile,
  writeFile,
} from "./fs.js";
import { fix, fixLinksForSite } from "./fixes.js";
import "./templateHelpers.js";
import {
  extractToc,
  registerToCLabel,
  registerToCMatchRules,
  registerToCPrefix,
  registerToCSeparator,
  safeId,
} from "./utils.js";

import Handlebars from "handlebars";
import JSZip from "jszip";
import { generateEpub } from "./epub.js";

import MarkdownIt from "markdown-it";
import MarkdownFootnote from "markdown-it-footnote";
import MarkdownAnchor from "markdown-it-anchor";
import MarkdownAttrs from "markdown-it-attrs";
import MarkdownBracketedSpans from "markdown-it-bracketed-spans";
import MarkdownImplicitFigues from "markdown-it-implicit-figures";
import MarkdownCenterText from "markdown-it-center-text";
import textile from "textile-js";
import Asciidoctor from "asciidoctor";

let md = new MarkdownIt({
  xhtmlOut: false,
  linkify: true,
  typographer: true,
})
  .use(MarkdownFootnote)
  .use(MarkdownAnchor, { safeId })
  .use(MarkdownBracketedSpans)
  .use(MarkdownAttrs)
  .use(MarkdownImplicitFigues, { figcaption: true })
  .use(MarkdownCenterText);

// eslint-disable-next-line no-undef
let asciidoctor = new Asciidoctor();

// IMPLEMENTATION

let currentTheme = "generic"; // matches default theme from Book() default configuration.

function setTheme(theme) {
  currentTheme = theme;
}

function themeFolder() {
  return `/templates/${currentTheme}/site`;
}

function themePathFor(file) {
  return `${themeFolder()}/${file}`;
}

function contentFilesFromConfiguration(book) {
  let frontmatter = book.config.site.frontmatter.length > 0
    ? book.config.site.frontmatter
    : book.config.book.frontmatter;
  let chapters = book.config.site.chapters.length > 0
    ? book.config.site.chapters
    : book.config.book.chapters;
  let backmatter = book.config.site.backmatter.length > 0
    ? book.config.site.backmatter
    : book.config.book.backmatter;

  let contentFiles = [...frontmatter, ...chapters, ...backmatter];

  return contentFiles;
}

export async function generateSite(book) {
  // Sit back, relax, and enjoy the waterfall...
  console.time("Generating site");

  let bookSlug = slugify(book.config.metadata.title);
  let siteFolder = `/tmp/${bookSlug}-site`;
  let bookFile = `/books/${bookSlug}.epub`;
  let toc = {};

  await Promise.all(loadExternalTheme(book));

  setTheme(book.config.site.theme);

  if (!fileExists(themeFolder())) {
    throw { message: "theme-not-found" };
  }

  if (book.config.book.enabled && !fileExists(bookFile)) {
    await generateEpub(book);
    await generateSite(book);
    return true;
  }

  book.products = {
    epub: `${bookSlug}.epub`,
  };

  // Copy files over...
  copyFolder(themeFolder(), siteFolder);

  registerToCLabel(book.config.toc.label);
  registerToCMatchRules(book.config.toc.match);
  registerToCPrefix(book.config.toc.prefix);
  registerToCSeparator(book.config.toc.separator);

  if (book.config.site.download) {
    writeFile(
      `${siteFolder}/files/${bookSlug}.epub`,
      readFile(bookFile),
    );
  }

  await Promise.all(copyImages(book, `${siteFolder}/book`));
  await generateResizedCovers(book, `${siteFolder}/book`);

  let coverPath = book.config.metadata.cover;
  let ext = extname(coverPath);
  book.config.metadata.coverMedium = book.config.metadata.cover
    .replace(ext, `-med${ext}`);

  let contentFiles = contentFilesFromConfiguration(book);

  let chapterTemplateHBS = readFile(themePathFor("chapter.hbs"), "utf8");
  let chapterTemplate = Handlebars.compile(chapterTemplateHBS);

  await Promise.all(
    contentFiles.map(async (chapterFilename) => {
      let file = book.files.filter((f) => f.name === chapterFilename)[0];
      let ext = extname(chapterFilename);
      let contentHtml = "";
      let content = await file.text();
      switch (ext) {
        case ".html":
          contentHtml = content;
          break;
        case ".adoc":
          contentHtml = asciidoctor.convert(content, {
            "safe": "server",
            "attributes": { "showtitle": true, "icons": "font" },
          });
          break;
        case ".textile":
          contentHtml = textile(content);
          break;
        default:
        case ".md":
          contentHtml = md.render(content);
          break;
      }
      contentHtml = fix(contentHtml);
      contentHtml = fixLinksForSite(contentHtml);
      let destinationFilename = chapterFilename.replace(ext, ".html");
      let destination = `${siteFolder}/book/${destinationFilename}`;

      const possibleToc = extractToc(contentHtml, destinationFilename);

      if (possibleToc) {
        toc[destinationFilename] = possibleToc;
        toc[destinationFilename].content = contentHtml;
        toc[destinationFilename].destination = destination;
      }
    }),
  );

  let spine = contentFiles.map((f) => {
    let i = f.split(".")[0];
    return { id: `c-${i}`, file: i, htmlFile: `${i}.html` };
  });

  // site zip file...

  spine = spine.map((s) => {
    s.toc = toc[s.htmlFile];
    return s;
  });

  // Templating
  if (book.config.site.description) {
    book.config.site.description = md.render(book.config.site.description);
  }

  if (book.config.site.blurb) {
    book.config.site.blurb = md.render(book.config.site.blurb);
  }

  if (book.config.author.bio) {
    book.config.author.bio = md.render(book.config.author.bio);
  }

  if (book.config.site.landing) {
    let indexTemplateHBS = readFile(themePathFor("index.hbs"), "utf8");

    let indexTemplate = Handlebars.compile(indexTemplateHBS);
    let contents = indexTemplate({ book, spine });
    writeFile(`${siteFolder}/index.html`, contents);
  } else {
    let firstChapter = spine[0].toc[0].file;
    let refresher = `
        <html>
        <head>
        <meta http-equiv="refresh" content="0;url=book/${firstChapter}">
        </head>
        <body></body>
        </html>
        `;
    writeFile(`${siteFolder}/index.html`, refresher);
  }

  // Chapters
  if (book.config.site.reader) {
    spine.forEach((item, index) => {
      let data = chapterTemplate({
        book,
        spine,
        index,
        html: item.toc.content,
      });
      writeFile(item.toc.destination, data);
    });
  }

  let zip = new JSZip();
  addToZip(zip, `${bookSlug}-site`, siteFolder);

  try {
    let blob = await zip.generateAsync({ type: "blob" });
    let siteBuffer = await blob.arrayBuffer();
    writeFile(`/sites/${bookSlug}-site.zip`, siteBuffer);
    saveAs(blob, `${bookSlug}-site.zip`);
    console.timeEnd("Generating site");
    return true;
  } catch (err) {
    throw err;
  }
}
