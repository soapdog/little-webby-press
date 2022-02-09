import mime from "mime"
import { extractToc } from "../common/utils.js"
import Handlebars from "handlebars"

let tocIndexValue = 0

// TEMPLATE HELPERS
Handlebars.registerHelper("dateModified", function (context, _block) {
	return  new Date(context).toISOString().slice(0,-5) + "Z"
})

Handlebars.registerHelper("tocStartAt", function (v) {
	tocIndexValue = v
})

Handlebars.registerHelper("tocNextValue", function () {
	return tocIndexValue++
})

Handlebars.registerHelper("chapterTitle", function (context, _block) {
	let hs = extractToc(context, "any")

	if (hs.length >= 1) {
		return hs[0].text
	} else {
		return ""
	}
})

Handlebars.registerHelper("mime", function (context, _block) {
	return mime.getType(context)
})

Handlebars.registerHelper("withTocIndexSuffix", function (context, _block) {
  return `${context}-${tocIndexValue}`
})

Handlebars.registerHelper("isLastChapter", function () {
  return this.index === (this.spine.length - 1);
});

Handlebars.registerHelper("isFirstChapter", function () {
  return this.index === 0;
});

Handlebars.registerHelper("nextChapterLink", function () {
  console.log(this.spine)
  console.log(this.index)
  return this.spine[this.index+1].toc[0].file
});

Handlebars.registerHelper("previousChapterLink", function () {
  return this.spine[this.index-1].toc[0].file
});

Handlebars.registerHelper("firstChapter", function () {
  return this.spine[0].toc[0].file
});


