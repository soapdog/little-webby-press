import m from "mithril";
import Header from "./lib/header.js";
import { render } from "./lib/text-utilities.js";

const documentation_books = [
  {
    id: "getting-started",
    cover: "books/getting-started/book/images/cover.png",
    title: "Getting Started With Little Webby Press",
  },
  {
    id: "book-configuration-specification",
    cover: "books/book-configuration-specification/book/images/cover.png",
    title: "Book Configuration File Specification",
  },
];

const videos_section = `
### Videos 

* [Introduction to Little Webby Press](/files/lwp.mp4)
`;

const samples_section = `
### Sample Books

Sample book folders for your reference.

* [Moby Dick](https://little.webby.press/files/moby-dick.zip)
`;

const templates_section = `
### Templates 

The generic template used to generate both eBooks and Websites. 
Use it as a starting point to create your own custom template.

* [template.zip](https://little.webby.press/files/templates.zip)
`;

const Books = {
  view: (_vnode) => {
    return m(
      "section",
      m("div.grid", [
        documentation_books.map((d) =>
          m(
            "a",
            { href: `/books/${d.id}/`, target: "_blank" },
            m("figure", [
              m("img", { src: d.cover, style: { "max-width": "200px" } }),
              m("figcaption", d.title),
            ]),
          )
        ),
      ]),
    );
  },
};

const Videos = {
  view: (vnode) => {
    return m("section", m.trust(render(videos_section)));
  },
};

const Samples = {
  view: (vnode) => {
    return m("section", m.trust(render(samples_section)));
  },
};

const Templates = {
  view: (vnode) => {
    return m("section", m.trust(render(templates_section)));
  },
};

export default {
  view: (vnode) => {
    return [
      m(Header),
      m("main.container", [
        m(Books),
        m(Videos),
        m(Samples),
        m(Templates),
      ]),
      m("footer"),
    ];
  },
};
