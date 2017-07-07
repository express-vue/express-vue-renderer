# express-vue-renderer
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Greenkeeper badge](https://badges.greenkeeper.io/express-vue/express-vue-renderer.svg)](https://greenkeeper.io/)
> Rendering Engine for turning Vue files into Javascript Objects

## Installation

```sh
$ npm install --save express-vue-renderer
```

## Usage

Include the library at the top level like so

```js
const ExpressVueRenderer = require('express-vue-renderer');
```

The library returns a function called `renderer`

It takes 3 params, 2 required and one optional.

```js
ExpressVueRenderer.renderer(componentPath, data, [vueOptions])
```

The promise returns an object called `app`, or an `error`


```js

ExpressVueRenderer.renderer(componentPath, data, [vueOptions])
    .then(app => {
        //App is an object that contains 4 parts
        head: //a string of the head,
        app: //the VueJS App Object,
        script: //the script string including the <script> elements,
        template: //the template, if no template was passed into vueOptions,
        //it uses a backup template
    })
    .catch(error => {
        //Do something with the error here
    });
```


## License

Apache-2.0 © [Daniel Cherubini](https://github.com/express-vue)


[npm-image]: https://badge.fury.io/js/express-vue-renderer.svg
[npm-url]: https://npmjs.org/package/express-vue-renderer
[travis-image]: https://travis-ci.org/express-vue/express-vue-renderer.svg?branch=master
[travis-url]: https://travis-ci.org/express-vue/express-vue-renderer
[daviddm-image]: https://david-dm.org/express-vue/express-vue-renderer.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/express-vue/express-vue-renderer
[coveralls-image]: https://coveralls.io/repos/express-vue/express-vue-renderer/badge.svg
[coveralls-url]: https://coveralls.io/r/express-vue/express-vue-renderer
