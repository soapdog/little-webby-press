
export function fixImages(html) {
  html = html.replace(/src="\//gi, "src=\"")
  return html
}

export function fixLinks(html) {
  html = html.replace(/href="\//gi, "href=\"")
  return html
}

export function fixLinksForSite(html) {
  html = html.replace(/.xhtml/gi, ".html")
  return html
}

export function fix(html) {
  html = fixImages(html)
  html = fixLinks(html)
  return html
}
