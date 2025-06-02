# Using TOML

This chapter is just a quick introduction to TOML language. Their own [website](https://toml.io/en/) explains it really well, and I advise you spend some time reading it.

> A config file format for humans.
>
> TOML aims to be a minimal configuration file format that's easy to read due to obvious semantics. TOML is designed to map unambiguously to a hash table. TOML should be easy to parse into data structures in a wide variety of languages.
>
> &mdash; _Source: [TOML: Tom's Obvious Minimal Language](https://toml.io/en/)_

The quotation above is how they describe their own language, it makes more sense if you're a software developer. The important part is _a minimal configuration file format that's easy to read_, meaning that TOML is designed to be pleasant to the eyes of both humans and software.

In their website, they have a section called _A Quick Tour of TOML_ that goes over every aspect of the language, go read that after finishing this chapter.

If you ever edited a `.INI` file on Windows, then you'll feel just at home. For the purposes of Little Webby Press, a TOML file is divided into sections. Each section has a name that is always a single word and lowercase. So the section called _metadata_ is written in TOML as:

```toml
[[ metadata ]]
```

All content below a section declaration belongs to that section. Once a new section starts, the content below that section will belong to the new section. For example, consider:

```toml
[[ opinions ]]
chocolate = "I like it, but don't eat often"
grapes = "Goes well with cheese, I really like them"

[[ doubts ]]
cat = "My cat is from Brazil, does he meows in Portuguese?"
```

There are two sections in the sample above. One called _opinions_ has two fields in it: _chocolate_ and _grapes_. The content of those fields is my own opinion regarding _chocolate_ and _grapes_. The second section, _doubts_, holds a single field _cat_ with my own doubts about which language my cat meows in.

TOML is analogous to writing a paper form. You have sections, fields, and the content of those fields.

A TOML file is always a _plain text_ file. You should not use applications such as Word to write them, you should use a _plain text_ editor such as [Sublime Text](https://sublimetext.com), [Visual Studio Code](https://code.visualstudio.com), or [ATOM](https://atom.io). If you don't want to install one of those editors, you can use whatever _plain text_ editor comes with your operating system. On a Mac that is _TextEdit_, on Windows it is _Notepad_, and on Linux depends on your distro but you should have a couple installed.

In our [video tutorials](/documentation/video-tutorials/index.html) I talk a bit more about editors and why I think you should install a good one.

