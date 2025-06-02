import m from "mithril"

const menus = [
	{link: "/press", label: "Generate Book"},
	{link: "/documentation", label: "Documentation"},
	{link: "/about", label: "About"},
]

const Menu = {
	view: vnode => {
		const link = vnode.attrs.link
		const label = vnode.attrs.label

		return m("li", m(m.route.Link, {href: link}, label))
	}
}

export default {
	view: _vnode => {
		return m("header.container", m("nav", [
			m("ul", m("li", m("strong", {class: "pico-color-azure-500"}, "Little.Webby.Press"))), 
			m("ul", menus.map(mm => m(Menu, mm)))
		]))
	}
}