# Table of Contents Section

Little Webby Press will look all files specified in the _frontmatter, backmatter, and chapters_ fields to find out which sections belong to your table of contents. This section specifies the _rules_ used by Little Webby Press to find the items inside your content.

## Default values

```toml
[toc]
prefix = false
label = "h1,h2"
match = "all"
```

The default behaviour, which should work for most books, is to look inside all content files and pick all _headers_ of _level 1_ and _level 2_, and add them to the table of contents.

In the [Getting Started Guide chapter for the Moby Dick case study](/documentation/getting-started/case-study-moby-dick.md), you can see how in that book a different behaviour is specified by changing the values in these fields.

## Prefix

Some authors will use a combination of headers to specify a chapter, such as the following Markdown:

```markdown
### Chapter 3

# The Spouter-Inn.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

In this case, `### Chapter 3` is the _prefix_ for the _chapter label_ which is _The Spouter-Inn._. To make that work for your table of contents, the field should have the following value:

```toml
prefix = "h3"
```

> **Attention:** If you specify a _prefix_ and some of your chapters don't have the prefix, they won't appear in the table of contents. When you specify a value for prefix, you're telling Little Webby Press that every single table of content item will be found after a prefix.

## Label

This is the label that is used for each table of content item. By default Little Webby Press will get _headers level 1 and 2_.

```toml
label = "h1,h2"
```

In the case of Moby Dick, there are no _headers level 2_, so the label is specified as:

```toml
label = "h1"
```

## Match

Fiction books don't usually have multiple sections inside each chapter, so this field may sound less useful for fiction writers. On the other hand, non-fiction books tend to be organised around multiple sections.

What the _match_ field does is tell Little Webby Press if it should stop looking for table of contents items after the first match. Little Webby Press looks for table of content items by traversing all the items the collection of files that make up your book.

If _match_ is set to _first_, then it will move onto the next file after finding the first match for the current file. This is how it is set on the Moby Dick sample.

The default value is _all_ which makes it look for all matches inside each file.

In most cases you don't need to change this at all. In the case of the Moby Dick sample, having this field set to _all_ whould generate the exact same table of contents because each file has only one _header level 3 prefix_ and one _header level 1 label_. So, even if it looked further into each file for more matches, it wouldn't find them and move on.

## Important remarks

To be honest, the default values should work for the most cases. I don't think you should change this value unless you really need to. Just use headers level 1 and 2 for your sections and subsections and you'll be just fine with the default behaviour.

