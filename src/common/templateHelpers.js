import moment from "moment"
import mime from "mime"
import { extractToc } from "../common/utils.js"

let tocIndexValue = 0

// TEMPLATE HELPERS
Handlebars.registerHelper("dateModified", function (context, _block) {
	return moment(Date(context)).format("YYYY-MM-DD[T]HH[:]mm[:00Z]")
})

Handlebars.registerHelper("tocStartAt", function (v) {
	tocIndexValue = v
})

Handlebars.registerHelper("tocNextValue", function () {
	tocIndexValue++
	return tocIndexValue
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
