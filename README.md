Quiddle.js
=========

Quiddle is a JQuery plugin which lets you embed a html, js and css playground into every webpage. Similar to JSFiddle or Plunkr, html, js and css code can be modified and run inside a website, but Quiddle can't save any work.  Originally created to use in combination with impress.js and because of the lack of proper alternatives, it could be embedded into every website which can profit from an interactive code experience. 

In comparison to the alternatives:

* does not require serverside code (but doesn't work on file:// proto)
* clears the previewframe properly (clears js stack completely) 
* code is never executed in parent scope
* builds the complete code using a template before injecting into the iframe instead of manipulating the DOM afterwards (works properly with AngularJS and other DOM manipulating frameworks)
* small footprint


Usage
---------
Until the project made further progress, please check out the examples/ directory.
All examples only work served by a proper webserver (no file:// proto). To start a simple webserver using node:

    npm install

Now just run:

    grunt webserver

...and browse to [http://localhost:3000/examples/](http://localhost:3000/examples/)[choose an example]/

Building Quiddle.js
---------
Quiddle could be used without building it. To get a minified version or to contribute it needs to be build using Grunt.

Install needed packages:

    npm install

Now just run:

    grunt package

Minified version could be found under /build 

Contributing
-------------
Before contributing bigger fixes contact me per email please.

License
-------------
MIT License: See the license files in the source code for more details.

