import moment from "moment"
import mime from "mime"
import { extractToc } from "../common/utils.js"

// TEMPLATE HELPERS
Handlebars.registerHelper("dateModified", function (context, _block) {
	return moment(Date(context)).format("YYYY-MM-DD[T]HH[:]mm[:00Z]")
});

Handlebars.registerHelper("tocIndex", function (context, _block) {
	let n = new Number(context)

	if (!isNaN(n)) {
		return n + 3
	} else {
		return context
	}
});

Handlebars.registerHelper("chapterTitle", function (context, _block) {
	let hs = extractToc(context, "any")

	if (hs.length >= 1) {
		return hs[0].text
	} else {
		return ""
	}
});

Handlebars.registerHelper("mime", function (context, _block) {
	return mime.getType(context)
});
