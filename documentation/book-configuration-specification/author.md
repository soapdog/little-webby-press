# Author Section

This is used to specify all sorts of information about the book authors. The reason behind placing author information on its own section is so that it is easier to copy and paste it as you create new books. If that information was part of the metadata section, it would be too easy to make a mistake and end up copying extra data you don't need or forgetting to copy something.

## Default values


```toml
[author]
name = false
bio = false
photo = false
```

Exactly, by default everything is ignored, and your book has no author. You really don't want that to be the case and should fill at least the _name_ field.

## Name

This is the name of the authors. You can use it to hold a single name, or add multiple names separated by commas. Names appear both in the eBook data and on the Website.

```toml
name = "André Alves Garzia"
```

## Bio

This is a mini-bio about the authors. If you're having challenges writing about yourself, check out this articles from Reedsy about [How to Write a Memorable Author Bio](https://blog.reedsy.com/author-bio/).

Mini-bios are not included in the eBook. If you want it on the eBook, you need to write it on either the frontmatter or the backmatter yourself. This data appears only on the Website.

You can use Markdown or even some HTML on this field. Since author's bios are usually longer than most of the other fields in the book configuration file, it is best to write them using multiple lines by using triple-double-quotes as shown in the example below.

```toml
bio = """
Andre is writer and developer. In the recent years he published books
about programming and managed a Web Literacy program in vulnerable
neighborhoods of Rio. He is a firm believer in empowerment through
technological experimentation. He lives in London with his wife, cats
and more IoT boards than he can ever put into use.
"""
```

Markdown will pick multiple consecutive lines of text and concatenate them in a single paragraph. To make multiple paragraphs, you need to leave a blank line between them.

## Photo

This is a small photo of the authors. It needs to be placed inside the `images` folder, and referenced in the field with the _images folder_ as part of it.


```toml
photo = "images/author.png"
```

This appears only on the Website, but since the photo is inside the `images` folder, you're free to use it in a _author bio chapter_ in your frontmatter or backmatter.

