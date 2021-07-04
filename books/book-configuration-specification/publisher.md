# Publisher Section

A small section to specify the publisher. Little Webby Press is mostly targetted at self-publishers, so this section will usually point towards the authors themselves or some company set by them.

## Default values

```toml
[publisher]
name = false
bio = false
link = false
```

At the moment this field only appears in the eBook.

## Name

The publisher's name.

```toml
name = "That company with a Penguin Logo Press"
```

## Bio

A bio for the publisher. **This field is currently ignored.** I haven't yet found where to surface this data on the Website template. You can write it down for when the Website templates takes it into account in the future.

```toml
bio = """
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
"""
```

## Link

Once the bio is displayed on the Website, this field will be used to specify a link to the publisher's website and be placed alongside the bio.

```toml
link = "https://my-own-press.website"
```

