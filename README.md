# Slush BioJS 

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Dev. Dependency Status][daviddm-dev-image]][daviddm-dev-url]

> A [slush](https://slushjs.github.io/) generator for BioJS packages.


## Getting Started

### Installation

Install `slush-biojs` globally:

```bash
npm install -g slush-biojs
```

Remember to install `slush` globally as well, if you haven't already:

```bash
npm install -g slush
```

Warning: You might need to use `sudo`. 
You can also setup npm to install packages [into your userdir](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md).

### Usage

Create a new folder for your project:

```bash
mkdir my-module
```

Run the generator from within the new folder:

```bash
cd my-module && slush biojs
```


How to use
-----------


### 1. Test

~~~
gulp test
~~~

They are grouped into two sections:

* Non-DOM `gulp test-unit` (folder: `test/unit`)
* DOM-only `gulp test-dom` (folder: `test/dom`)

Gotchas:

* The Unit tests are run with PhantomJS, if you want to debug them open the `test/index.html` 
your browser.
* You need to add your _DOM_ tests to the `test/dom/index.js`.

If you want to auto-execute all your test on a file change, run:

~~~
gulp test-watch
~~~

### 2. Snippets

Allows you to write minimal example [snippets](https://github.com/biojs/biojs-sniper) of your visualization.
These snippets will be used for the [BioJS registry](http://registry.biojs.net).

~~~
npm run sniper
~~~

and open [http://localhost:9090/snippets](http://localhost:9090/snippets)


### 3. Watchify

Watches all your files and runs [browserify](http://browserify.org) on every change.
Combine this with the sniper.
(Subsequent runs of watchify are fast).

~~~
npm run watch
~~~

Enjoy.

[npm-url]: https://npmjs.org/package/slush-biojs
[npm-image]: https://badge.fury.io/js/slush-biojs.svg
[daviddm-url]: https://david-dm.org/biojs/slush-biojs
[daviddm-image]: https://david-dm.org/biojs/slush-biojs.svg?theme=shields.io
[daviddm-dev-url]: https://david-dm.org/biojs/slush-biojs#info=devDependencies
[daviddm-dev-image]: https://david-dm.org/biojs/slush-biojs/dev-status.svg?theme=shields.io
