# Little Webby Press

This is a webapp project to help authors generate eBooks and static websites.

More information about this project in [this teaser video](https://vimeo.com/431791037).

# Development

This project is done with NodeJS and Svelte.

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

I'm using these batch files all the time as I work through the epub generation and decided they are useful enough that other people might want to use them too. They are not needed for this web app to work, it is just helpful during development.

# LICENSE

MIT