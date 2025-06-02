# Metadata Section

The metadata section contains fields that would be used for archival purposes in a library or shop.

## Default values

Each of these fields has a sensible default value, so you should only fill the ones you need. Below is a metadata section with the default values being explicitly shown:

```toml
[[ metadata ]]
title = "Untitled Book"
subtitle = false
date = new Date()
identifier = false
cover = false
language = "en"
license = false
```

If you don't add a field to your `Book.toml` file, their default value will be used. Usually, if the default value is `false` it means that the value is ignored.

> The software developers among you might have noticed that the fields change type from `boolean: false` to a `string` when filled in. That is by design and makes checking for them in templates easier.

## Title

You book's title. This is added to both the eBook and the Website.

Example:

```toml
title = "Moby Dick, or, The Whale"
```

## Subtitle

An optional field to hold your book subtitle. If it is present, it is added to both the eBook and the Website.

Example:

```toml
subtitle = "That classic book about a whale you have to read for school"
```

## Date

The publication date for the book. The default value will make it the current date when you're generating the book. If you want to fill it in, you need to write the date in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.

Example:

```toml
date = 2019-08-08T12:00:00Z
```

It is `<year>-<month>-<day>T<hour>:<minute>:<seconds>Z`. The _year_ should always be four numbers, and all the other items should be two numbers, so put a leading zero if the value is below ten.

## Identifier

This is the unique `identifier` that will be used to _identify_ your book. This can be an ISBN, or any other unique value that is compatible with the platforms you'll distribute your eBook on. A unique URL pointing to your book is a good identifier.

Example:

```toml
identifier = "http://www.gutenberg.org/ebooks/2701"
```

## Cover

The cover image file for the book. This file, like all other images in your book, should be placed inside a folder called `images` inside your _manuscript folder_.

```toml
cover = "images/cover.jpg"
```

## Language

The language the book is written in. The value for this field should be in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format, which is a two letter code to represent a language.

Here are some of example language codes:

| Language | ISO 639-1 Code |
| :--- | :---: |
| English | en |
| Chinese | zh |
| Spanish | es |
| Portuguese | pt |
| German | de |
| Italian | it |
| Swahili | sw |
| Korean | ko |
| Japanese | ja |
| French | fr |
| Xhosa | xh |
| Guarani | gn |

Example:

```toml
language = "pt"
```

## License

This is the license for your book. It can be an HTML chunk if you want to add an image and link to the license. The intended use case for this is so that it becomes easier to tell the reader that your book is using copyleft licenses such as [Creative Commons](https://creativecommons.org/).

Be aware that Little Webby Press does not generate a copyright page for your book. You should do it yourself, and add it to the frontmatter.

The value of this license field is used only on the Website landing page.

Example:

```toml
license = "<a href='https://creativecommons.org/licenses/by-nc/4.0/deed.en_GB'><img src='book/images/license.svg'></a>"
```

The example above is a bit complex, it uses an HTML chunk to create a link to the _Creative Commons Website_ page for a specific version of the license, and it uses an image that is in the manuscript folder.
