import slugify from "slugify"

let conf = {
	prefix: false,
	label: "h1",
	match: "all",
}

export function safeId(txt) {
  let s = slugify(txt, {
    remove: /[*+~.()'"!:@;,{}[]]-/g,
    lower: true,
    strict: true
  })
  return s
}

export function registerToCPrefix(prefix) {
	conf.prefix = prefix
}

export function registerToCLabel(label) {
	conf.label = label
}

export function registerToCMatchRules(match) {
	conf.match = match
}

export function extractToc(html, file) {
	const domparser = new DOMParser()
	const doc = domparser.parseFromString(html, "text/html")
	let label = ""
	let id = ""

	if (conf.match === "first") {
		if (conf.prefix) {
			const prefixEl = doc.querySelector(`${conf.prefix}`)
			const labelEl = doc.querySelector(`${conf.prefix} + ${conf.label}`)
			if (prefixEl && labelEl) {
				label = `${prefixEl.innerText} ${labelEl.innerText}`
				id = safeId(labelEl.id)
			}
		} else {
			const labelEl = doc.querySelector(`${conf.label}`)
			console.log("l", [file, labelEl])
			if (!labelEl) {
				console.log("l is null", { html, file })
				throw "error"
			}
			label = labelEl.innerText
			id = safeId(labelEl.id)
		}

		return [
			{
				file: file,
				id: id,
				text: `${label}`,
			},
		]
	}

	// TODO: fix for multiple ToC entries inside a single chapter file.
	if (conf.match === "all") {
		let r = []
		let hs = doc.querySelectorAll(`${conf.label}`)
		hs.forEach((h) => {
			r.push({
				file: file,
				id: safeId(h.id),
				text: h.innerText,
			})
		})
		return r
	}

	return []
}
