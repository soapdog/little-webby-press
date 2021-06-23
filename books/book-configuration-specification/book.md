# Book Section

Arguably the most important section in the configuration file. This is the section that specifies your manuscript files. The order in which you specify them will form the spine of the book.

All fields that belong to this section have information that goes into the eBook.

## Default values

```toml
[book]
enabled = true,
theme = "generic",
frontmatter = [],
chapters = [],
backmatter = []
```

There is a lot to be said about each field, and it is best tackled in their own section.

## Enabled

This field dictates if Little Webby Press should generate an eBook for you. Some authors might have books generated using other tools and still want to use Little Webby Press to generate the Website for them. By setting this value to `false`, they're able to bypass book generation and just create a Website.

The default behavior is to generate the eBook. You only need to touch this field if your intention is to disable it.

```toml
enabled = true
```

## Theme

Which theme should be used to generate your eBook. At the moment we only have one theme called _generic_. In the near future we plan to have more themes, and also a way for you to override our theme selection and provide your own. Right now, you should simply ignore this field.

```toml
theme = "Generic"
```

## Frontmatter and Backmatter

Those two sections behave exactly the same, but one is put before the book chapters, and the other after them.

Frontmatter and backmatter are what computer scientists call an [Array](https://www.bbc.co.uk/bitesize/guides/zy9thyc/revision/1). This is fancy speak, and the way you can understand them is as _a collection of stuff_. In our case they're _a collection of files_. So when you write down any of these sections, you do so by writing a collection of files that are part of that section.

```toml
fontmatter = [
  "copyright.md",
  "praise-for-the-book.md",
  "acknowledgements.md"
]
```

and

```toml
backmatter = [
  "bio.md",
  "contact.md",
  "other-works.md"
]
```

A collection is placed between _square brackets_ and each item is _quoted_ and separated from each other using _commas_. You could write them all in a single line but writing each item in their own line makes it easier to remove items and to reorder them.

Most eReaders will not place frontmatter or backmatter in the table of contents for the book. Readers will still be able to read them as they flip through the pages. Also, many eReaders will open a book in the first chapter and not in the frontmatter. This is a reason why many authors prefer to add things to the backmatter than the frontmatter, usually leaving it with only the copyright notice.

## Chapters

**Finally! This is the most important section in the whole configuration!**

It took us a while to arrive to this section, this is where you specify the files that make up your book. Be aware that even though the field is called _chapters_, the relationship between one file and one chapter is arbitrary and there is nothing preventing you from breaking your chapters into multiple files. The field is called _chapters_ because all the files inside this collection will be what ends up being your book's chapters.

```toml
chapters = [
  "001-life-is-good.md",
  "002-life-still-good-but-other-pov.md",
  "003-shit-happens.md",
  "004-accepting-the-shit-is-hard.md",
  "005-mentor-appears.md",
  "006-mentor-teaches-shit-acceptance.md",
  "007-heroine-is-one-with-the-shit.md",
  "008-heroine-faces-harder-shit.md",
  "009-heroine-cannot-take-any-more-shit.md",
  "010-the-important-shit-is-friendship.md",
  "011-friends-get-their-shit-together.md",
  "012-friends-overcome-final-shit.md",
  "013-life-is-good-and-we-have-changed.md"
]
```

Those among you that know your storycraft will recognize the hero's journey (or the story circle, or...) in the example above.

## Important remarks

The _Table of Contents_ is specified by the information in another section. All that _frontmatter, backmatter, and chapters_ specify is what content files belong to your book and their order.

If you have Markdown files in your manuscript folder, but you don't place them in any of these collections, they won't be processed or appear in your book.

If you have Markdown file names in your collections that don't actually exist on your manuscript folder, the book generation will break because of the missing file. Only add files to these collections after you have created them.
