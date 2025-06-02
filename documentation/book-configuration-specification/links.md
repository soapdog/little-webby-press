# Links Section

Links are repeatable sections that add buttons to your author bio on the website.

```toml
[[links]]
url = "http://instagram.com/my-account"
label = "My Instagram"

[[links]]
url = "http://goodreads.com/my-author-page"
label = "My Goodreads"
```

In the example above, there are two _Links_ sections. They will become two buttons in the _author bio_ section of the website.

## Default values

The CTA has an empty default value. It is only present if you add it.

## cta

You can add as many _Links_ sections you want, remember that repeatable sections are enclosed in double square brackets.

```toml
[[links]]
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
