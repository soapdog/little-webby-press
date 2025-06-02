import m from "mithril"
import Header from "./header.js"
import { render } from "./text-utilities.js"

const about_message = `
Little Webby Press is a _Web Application_ to convert your manuscript into both an eBook and a Website. 
It helps reduce the friction between writing and publishing, so that you can focus your time and energy 
into your craft.

You can use it to generate as many books as you want. There is no need for an account because your data never 
leaves your computer. Since Little Webby Press doesn't rely on expensive to scale servers, it can be offered for free.

Little Webby Press is developed by [André Alves Garzia](https://andregarzia.com) in Edinburgh, Scotland. 
If you want to support my work, you can [buy me a coffee](https://ko-fi.com/andregarzia).

**This version of Little Webby Press is considered a MVP.** 
Feel free to reach out over [Bluesky](https://bsky.app/profile/andreshouldwrite.bsky.social), 
[Mastodon](https://toot.cafe/@soapdog/) with doubts, comments, or feedback.
`

export default {
	view: vnode => {
		return [
			m(Header),
			m("main.container", m.trust(render(about_message))),
			m("footer")
		]
	}
}