// @flow
const test = require('ava');
const ExpressVueRenderer = require('../src');
const Models = require('../src/models');
const path = require('path');

const options = {
    rootPath: path.join(__dirname, 'example/vueFiles')
};

const data = {
    title: 'Express Vue',
    message: 'Hello world',
    uuid: 'farts'
};

const vueOptions = {
    head: {
        title: 'Page Title'
    }
}

const exampleHead = `<head>\n<title>Page Title</title>\n<style>.red{color:#9acd32}.pink{color:pink;text-decoration:underline}.test{color:#00f}</style></head>`;
const exampleScript = `<script>(function(){"use strict";var t=function(){return new Vue({mixins:[{methods:{hello:function(){console.log('Hello')}}}],data:function(){return{"title":"Express Vue","message":"Hello world","uuid":"farts"}},methods:{test:function(){console.error('test')}},components:{uuid:{props:{uuid:{required:!0,default:"missing"}},data:function(){return{}},components:{inner:{data:function(){return{}},template:"<div><p class=\\"pink\\">Inner Text</p></div>"}},styles:".pink{color:pink;text-decoration:underline}",template:"<div><inner></inner><h2 class=\\"test\\">Uuid: {{uuid ? uuid : 'no uuid'}}</h2></div>"},uuid2:{props:["uuid2"],data:function(){return{}},template:"<div><h3 class=\\"red\\">Uuid2: {{uuid2 ? uuid2 : 'no uuid'}}</h3></div>"}},styles:".pink{color:pink;text-decoration:underline}.test{color:#00f}.red{color:#9acd32}",template:"<div><h1>{{title}}</h1><p>Welcome to the {{title}} demo. Click a link:</p><input v-model=\\"message\\" placeholder=\\"edit me\\"><p>{{message}}</p><uuid :uuid=\\"uuid\\"></uuid><uuid2 :uuid2=\\"uuid2\\"></uuid2><button type=\\"button\\" name=\\"button\\" v-on:click=\\"this.hello\\">Test mixin</button> <button type=\\"button\\" name=\\"button\\" v-on:click=\\"this.test\\">Test method</button></div>"})};typeof module!=='undefined'&&module.exports?(module.exports=t):(this.app=t())}).call(this),app.$mount('#app')</script>`;

test('renders App object', t => {
    const renderer = new ExpressVueRenderer(options);
    return renderer.createAppObject('main', data, vueOptions)
        .then(app => {
            t.is(app.head, exampleHead);
            t.is(app.script, exampleScript);
        })
        .catch(error => {
            t.fail(error.stack);
        });
});


test('renders App object with custom layout', t => {
    const vueOptionsWithLayout = {
        layout: {
            html: {
                start: 'html-start',
                end: 'html-end',
            },
            body: {
                start: 'body-start',
                end: 'body-end'
            },
            template: {
                start: "template-start",
                end: "template-end"
            },
        }
    };
    const renderer = new ExpressVueRenderer(options);
    return renderer.createAppObject('main', data, vueOptionsWithLayout)
        .then(app => {
            t.is(app.template.html.start, "html-start");
            t.is(app.template.html.end, "html-end");
            t.is(app.template.body.start, "body-start");
            t.is(app.template.body.end, "body-end");
            t.is(app.template.template.start, "template-start");
            t.is(app.template.template.end, "template-end");
        })
        .catch(error => {
            t.fail(error.stack);
        });
});
