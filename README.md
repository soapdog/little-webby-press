# Little Webby Press

This is a webapp project to help authors generate eBooks and static websites.

More information about this project in [this teaser video](https://vimeo.com/431791037).

# Development

This project is done with Mithril JS


## Setup

There is no setup, this is a no-build web app. The JS that is in this repo is exactly what the browser runs.

## Running

To run it just point your favourite web server into the directory.

## Updating templates

The templates are served as zipfiles. They are not a part of the application code. To update them you need to run the `pack-templates.sh` shell script. The webapp will load the zip and unpack the templates at runtime.

## More information

Little Webby Press usage is fully documented in two online books. Check out the [Getting Started](https://little.webby.press/books/getting-started/book/getting-started.html) guide and the [Book Configuration Specification](https://little.webby.press/books/book-configuration-specification/book/introduction.html). I've also blogged about the development of this new version at [Experimenting with no-build Web Applications](https://andregarzia.com/2025/06/experimenting-with-no-build-web-applications.html).

# LICENSE

MIT
