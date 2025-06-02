# Introduction

Little Webby Press book and website generation is controlled by a file you create in your manuscript folder. This is the _book configuration file_ and it is used to:

* Specify the files — frontmatter, chapters, and backmatter — that composes your manuscript.
* Specify the files — frontmatter, chapters, and backmatter — that will be available on the website.
* Set which file inside the `images/` folder is your book cover.
* Set the _metadata_ for the book, things such as its title, author, publisher, etc.
* Set the marketing blurb, and author bio for the Website.
* Set WebMonetization Endpoint for the WebSite.

Most of the documentation for Little Webby Press refers to it as `Book.toml`. [TOML](https://toml.io) is a language for [configuration files](https://en.wikipedia.org/wiki/Configuration_file) that is easy to learn. In later chapters in this manual, we'll see how to write the same configuration file using different languages such as [JSON](https://www.json.org) and [YAML](https://yaml.org). So, if you already know any of those other two languages, and would prefer to use them, you'll be able to.

> TOML, YAML, and JSON, are different file formats. One thing they have in common is that they're all [plain text files](https://en.wikipedia.org/wiki/Plain_text), which means you should use a simple text editor to edit them. We recommend a programmers editor such as [Sublime Text](https://sublimetext.com), [Visual Studio Code](https://code.visualstudio.com), or [ATOM](https://atom.io).

Even though, from these first paragraphs, you might be preparing yourself for some complex tasks and tedious study, fear not for this stuff is simpler than it seems. After playing a bit with Little Webby Press, writing the configuration file will become boring and simple. In many cases, you'll be just copying and pasting from a previous book (unless you want to type your author bio again).

If this is the first manual you're reading, I'd like to urge you to stop and read the [Getting Started Guide](/documentation/getting-started/index.html) first. The content in this manual assumes you have done that, and understood how the basic workflow of generating a book and website using Little Webby Press. If you're not confident in your understanding, you might want to turn your attention to our [video tutorials](/documentation/video-tutorials/index.html) which might clear some doubts.

The _book configuration file_ is divided in multiple sections, each of these sections will be explained in the next following chapters. We will use TOML to explaion them. Later, after all the sections are understood, we'll have chapters about YAML and JSON.



