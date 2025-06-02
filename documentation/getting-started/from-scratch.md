# Creating A New Book

In this chapter we'll create a new book from scratch together. The book will be fake but the process will be the exact same process you'd use for your own work. This is a _follow along_ chapter, so please get your computer ready and join the journey by replicating the same steps on your own.

## A Folder For Our Book

Each book needs to live in it's own folder on your computer. You can place this folder wherever you want, but ideally you'd place it somewhere safe and make backups often.

To begin, create a folder called `sample-book`. All the files and folders we create in this tutorial chapter will be placed inside this folder.

## The Most Important Part Of A Book Is The Content

In the previous chapter we spent a long time exploring the _Book Configuration File_. It could cause people to imagine that that file is the most important file in our book, but that is a mistake. The most important part is always your content, your manuscript. All the rest is just extra steps to make sure your content is in a good shape to delight your readers.

Our sample book will have four chapters in total — one for frontmatter, two for fake content, one for backmatter — and we'll begin by creating them all. Most of your time will always be spent writing and revising your manuscript. If you need help with that process, I recommend you check out the following resources:

* [Reedsy Learning](https://blog.reedsy.com/learning/) - FREE courses on all topics related to writing. I really love Reedsy.
* [The Creative Penn](https://www.thecreativepenn.com/) - Joanna Penn writes and podcasts wonderful content about how to write, publish, and market your book.
* [Chris Fox Courses](https://chris-fox-writes.teachable.com/) - Chris Fox has a wonderful course called _5,000 Words Per Hour_ that is easy to digest and might just change how you write.

### The Frontmatter

Create a file called `00-frontmatter.md` and place the following content into it.

```markdown
> _"Peaches Are Yummy" — Some Important Author_

# Acknowldgements

I just want to say thanks to the important author who inspired me to really enjoy eating peaches.
```

Content files are written in [Markdown](https://markdown.org), if this is looking a bit odd to you, you might want to learn a bit more about Markdown before continuing.

### Chapter 1

Create a file called `01-first.md`. The names are not really important because what matters will be the order we'll place them in the _Book Configuration File_, still naming the file with a _zero-padded number_ at the front will help your computer show the files in the correct order when you look at them. For our first chapter, do something like:

```markdown
# The opening sequence

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

Be aware that I just _copied and pasted_ this lorem-ipsum placeholder text from the Web. Use whatever content you want there. This sample book is fake but it is yours, you should play with it.

### Chapter 2

Create a file called `02-second.md`. You could just copy and paste from the first chapter and make some alterations:

```markdown
# The sequence after the opening sequence

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

### The Backmatter

Create a file called `03-backmatter.md`, and add your important _Author's note_

```markdown
# Author's Notes

My favourite note is F sharp.

```

## The Book Configuration File

Now that we're happy with our content, it is time to create a very minimal _Book Configuration File_. That file should be named `Book.toml`, that is the file that Little Webby Press will look for, if you name it something different, Little Webby Press won't be able to find it and won't be able to work with your book.

```toml
[metadata]
title = "A Sample Book"
subtitle = "Not a real book"
date = 2021-06-15T12:00:00Z
identifier = "https://example.com/not-a-real-book"
cover = "images/cover.png"

[author]
name = "An Aspiring Author"
bio = """
An author that loves peaches.
"""

[publisher]
name = "Little Webby Press"

[site]
blurb = """
A book that will change your life.
"""

[book]
frontmatter = [
  "00-frontmatter.md"
]
chapters = [
  "01-first.md",
  "02-second.md"
]
backmatter = [
  "03-backmatter.md"
]

```

Notice that we can enclose text with quotes like `"my text"` or if we want to write multi-line text, we can enclose it in triple-double-quotes, like:

```toml
bio = """
this is a multi-level
content
"""
```

This is good for when you're writing the _author bio_ or the _marketing blurb_.

Be aware that our configuration is declaring a book cover in `images/cover.png`, which doesn't exist. So create a folder called `images` and place any image inside it named `cover.png`. Once you do that, we're ready!

## Assembling The Sample Book

As I mentioned a couple times before, Little Webby Press will generate both an eBook and a Website for your book. There are two _action buttons_ in the interface, one to generate the book, another to generate the site. The site includes a link to download the eBook, so pressing _generate site_ will also generate the eBook if you haven't assembled it yet.

Open [Little Webby Press](https://little.webby.press) and use the _Select Manuscript Folder_ to select your `sample-book` folder. You can also simply drag and drop that folder on top of _Little Webby Press_ interface, it will change letting you know if it can accept the drop. Once you loaded your _Manuscript Folder_ and it correctly processed your _Book Configuration File_, you'll see the familiar Little Webby Press tabbed interface.

![Our sample book](images/sample-book-in-lwp.png)

Clicking _Generate Site_ will assemble both the Website and the eBook. You can click the _downwards arrow_ in the _Products Tab_ to download the Website once the process is done.

![Where To Click To Download](images/how-to-download.png)

Unpack the zip file to see the contents, you should have the following files:

![These are the Website files](images/files.png)

Opening `index.html` will show you the website for our sample book, and clicking _Free To Read Online_ will let you read the amazing insight and clever prose inside that book. You'll notice that there is an EPUB3 file called `A-Sample-Book.epub` there as well. This was added so that the download buttons on the Website work. You can open that file on your favourite eReader device or app.

The way you work with Little Webby Press is by changing the files on disk, and when needed reloading the Little Webby Press Web Application and opening your _Manuscript Folder_ again. Personally, I prefer simply to drag and drop it again on the interface. Once it is reloaded, you can use the action buttons to assemble new versions of the eBook or Website.



