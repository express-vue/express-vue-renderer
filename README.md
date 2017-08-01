# express-vue-renderer
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][cov-image]][cov-url] [![Greenkeeper badge](https://badges.greenkeeper.io/express-vue/express-vue-renderer.svg)](https://greenkeeper.io/) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/51e27f21101e492fabf93dc6d81b8f28)](https://www.codacy.com/app/intothemild/express-vue-renderer?utm_source=github.com&utm_medium=referral&utm_content=express-vue/express-vue-renderer&utm_campaign=badger)
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

## VueOptions

```js
{
    rootPath: path.join(__dirname, '/../tests'),
    viewsPath: 'vueFiles',
    componentsPath: 'vueFiles/components',
    layout: {
        start: '<body><div id="app">',
        end: '</div></body>'
    },
    vue: {
        head: {
            meta: [{
                    property: 'og:title',
                    content: 'Page Title'
                },
                {
                    name: 'twitter:title',
                    content: 'Page Title'
                },
                {
                    script: 'https://unpkg.com/vue@2.3.4/dist/vue.js'
                }, {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                }
            ]
        }
    },
    data: {
        thing: true
    }
```


## License

Apache-2.0 © [Daniel Cherubini](https://github.com/express-vue)


[npm-image]: https://badge.fury.io/js/express-vue-renderer.svg
[npm-url]: https://npmjs.org/package/express-vue-renderer
[travis-image]: https://travis-ci.org/express-vue/express-vue-renderer.svg?branch=master
[travis-url]: https://travis-ci.org/express-vue/express-vue-renderer
[daviddm-image]: https://david-dm.org/express-vue/express-vue-renderer.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/express-vue/express-vue-renderer
[cov-image]: https://codecov.io/gh/express-vue/express-vue-renderer/branch/master/graph/badge.svg
[cov-url]: https://codecov.io/gh/express-vue/express-vue-renderer
