import m from "mithril"
import Press from "./press.js"
import Documentation from "./documentation.js"
import About from "./about.js"

const root = document.body

m.route(root, "/about", {
	"/press": Press,
	"/documentation": Documentation,
	"/about": About
})
