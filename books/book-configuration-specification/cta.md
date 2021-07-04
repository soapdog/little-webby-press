# Call To Action Section

Some people might find the actions in the _above the fold_ for the website too restrictive for their needs. By default, the site only sports buttons for _Downloading the eBook_, _Reading it online_, and _Viewing the Table of Contents_. Using the CTA section, you can add your own buttons. Combining CTA items and the site configuration, you can disable the buttons you do not want and add new buttons.

The Call To Action section can be repeated inside the configuration. Each item you add becomes a new button.

```toml
[[cta]]
url = "http://example.com"
label = "Visit Example Site"

[[cta]]
url = "http://kobo.com"
label = "Get it from Kobo"
```

In the example above, there are two _Call To Action_ items. They will become two buttons in the _above the fold_ area of the website.

## Default values

The CTA has an empty default value. It is only present if you add it.

## cta

You can add as many _Call To Action_ sections you want, remember that repeatable sections are enclosed in double square brackets.

```toml
[[cta]]
```

## url

This is the URL the button links to. One good usage is adding links to purchase the book in other stores such as your own store, Kobo, or Amazon.

```toml
url = "https://my-own-store.com/my-book/purchase"
```

## label

This is the label for the button associated with that section.

```toml
label = "Purchase my eBook, plz"

```
