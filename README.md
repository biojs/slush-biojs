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

__Warning__: You might need to use `sudo`. 
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

`npm run` provides a run environment with all locally installed modules in the
`PATH` var. So if you hate typing, you can install the programm globally (`-g`).

### 1. Snippets / Examples (only for visualization)

Allows you to write minimal example [snippets](https://github.com/biojs/biojs-sniper) of your visualization.
These snippets will be used for the [BioJS registry](http://biojs.io) and each snippet can visualize for one specific use case of your component (e.g. adjusting the menubar or changing default color). Those snippets can later be easily edited in a web editor like JSBin and thus should be minimal. A rule of thumb maximum for a snippet is 10 lines (otherwise your component is probably really hard to use).

~~~
npm run sniper
~~~

and open [http://localhost:9090/examples](http://localhost:9090/examples)

Executed command: `biojs-sniper`

### 2. Watchify (only for visualization)

Watches all your files and runs [browserify](http://browserify.org) on every change.
Combine this with the sniper.
(Subsequent runs of watchify are fast).

~~~
npm run watch
~~~

Executed command: `gulp watch`

### 3. Test (optional)

~~~
npm run test
~~~

Executed command: `gulp test`

They are grouped into two sections:

* Non-DOM `gulp test-unit` (folder: `test/unit`)
* DOM-only `gulp test-dom` (folder: `test/dom`)

Gotchas:

* The Unit tests are run with PhantomJS, if you want to debug them open the `test/index.html` 
your browser.
* You need to add your _DOM_ tests to the `test/dom/index.js`.

If you want to auto-execute all your test on a file change, run:

~~~
npm run test-watch
~~~

### 4. CSS (optional + only for visualization)

The will run `parcelify` and bundle all your CSS resources.

~~~
npm run css
~~~

(you can add transforms for SASS or LESS and use the `npm run watch-css` to constantly watch for css changes)

[Learn more about CSS Stylesheets in BioJS](https://github.com/biojs/biojs/wiki/Adding-CSS-stylesheets)

### 5. Run everything at once

~~~
npm run w
~~~

This will be available depending on your slush configuration.
It is an alias for:

~~~
prunner "npm run task1" "npm run task2"
~~~

Prunner allows on to run multiple npm tasks in one shell.
Normally at least `npm run sniper` and `npm run watch` are included in this. Check your `package.json` for your exact configuration.

Configuration
---------------

* command line arguments (parsed by minimist)
* environment variables prefixed with `slush-biojs_`
* if you passed an option `--config file` then from that file
* a local `.slush-biojsrc` or the first found looking in `./ ../ ../../ ../../../` etc.
* `$HOME/.slush-biojsrc`
* `$HOME/.slush-biojs/config`
* `$HOME/.config/slush-biojs`
* `$HOME/.config/slush-biojs/config`
* `/etc/slush-biojsrc`
* `/etc/slush-biojs/config`

### Example

```
{
  "authorName": "greenify",
  "authorEmail": "greeenify@gmail.com",
  "userName": "greenify"
  "license": "MIT"
}
```

[npm-url]: https://npmjs.org/package/slush-biojs
[npm-image]: https://badge.fury.io/js/slush-biojs.svg
[daviddm-url]: https://david-dm.org/biojs/slush-biojs
[daviddm-image]: https://david-dm.org/biojs/slush-biojs.svg?theme=shields.io
[daviddm-dev-url]: https://david-dm.org/biojs/slush-biojs#info=devDependencies
[daviddm-dev-image]: https://david-dm.org/biojs/slush-biojs/dev-status.svg?theme=shields.io
