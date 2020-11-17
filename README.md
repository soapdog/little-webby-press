# Little Webby Press

This is a webapp project to help authors generate eBooks and static websites.

More information about this project in [this teaser video](https://vimeo.com/431791037).

# Development

This project is done with NodeJS and Svelte.

> **Editor gotcha**
>
> VSCode svelte plugin has a mind of its own and is overriding the configurations of prettier and editorconfig. It keeps using single quotes even though all the configuration files says for it to use double quotes. Every time I format a source file, it reverts the double quotes into single quotes inside the svelte template section. I'm tired of fighting this and will worry about it later, already lost a whole day on this stupid thing.

## Setup

Just install the dependencies with:

~~~
PS> npm install
~~~

## Running

To run in development mode:

~~~
PS> npm run dev
~~~

## Bundled tools

To help during development, this repo is bundling epubcheck 4.2.3 and has two batch files to help inspect generated books.

* `check.bat <path to epub>`: will run the given epub through epubcheck.
* `edit.bat <path to epub>`: will copy and unzip the epub and open the epub in Visual Studio Code Insiders. If you're using a different editor, please replace the final edit command there.
* `remove.bat <path to epub>`: Deletes the epub and the expanded epub dir created by `edit.bat`. Be aware that if you have spaces in your path, you need to quote them properly or this will delete the wrong folder.

I'm using these batch files all the time as I work through the epub generation and decided they are useful enough that other people might want to use them too. They are not needed for this web app to work, it is just helpful during development.

# LICENSE

MIT
