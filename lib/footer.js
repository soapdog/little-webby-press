import m from "mithril";

export default {
  view: (_vnode) => {
    return m(
      "footer",
      m("div.container", [
        m(
          "section",
          m("nav", [
            m(
              "ul",
              m(
                "li",
                m(
                  "small",
                  [
                    "Made with love in Edinburgh • Crafted by humans • No AI • ",
                    m("a", {
                      href: "https://ko-fi.com/W7W21WOAT",
                      target: "_blank",
                    }, "Buy me a coffee"),
                  ],
                ),
              ),
            ),
            m(
              "ul",
              m(
                "li",
                m("a", {
                  href: "https://github.com/soapdog/little-webby-press",
                  target: "_blank",
                }, "Source Code"),
              ),
            ),
          ]),
        ),
      ]),
    );
  },
};
