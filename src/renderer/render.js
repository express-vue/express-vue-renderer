// @flow
const {Types}     = require('../models');
const Utils       = require('../utils');
const paramCase   = require('param-case');
const Vue         = require('vue');
const stringHash  = require('string-hash');

const types       = new Types();

function createApp(script, defaults) {
    // caching for mixin vue parsing
    if (defaults.vue && defaults.vue.mixins) {
        if (defaults.vue.mixins.length > 0) {
            if (!defaults.cache.get(stringHash(defaults.vue.mixins.toString()))){
                for (let mixin of defaults.vue.mixins) {
                    Vue.mixin(mixin);
                }
                defaults.cache.set(stringHash(defaults.vue.mixins.toString()), true);
            }
        }
    }

    return new Vue(script);
}

function layoutUtil(components: Object[]) {
    let layout = {};
    layout.style = '';
    for (var component of components) {
        switch (component.type) {
        case types.COMPONENT:
            layout.script = component.script;
            if (component.style.length > 0) {
                layout.style += component.style;
            }
            break;
        case types.SUBCOMPONENT:
            if (component.style.length > 0) {
                layout.style += component.style;
            }
            if (layout.script.components) {
                layout.script.components[component.name] = component.script;
            } else {
                layout.script.components = {};
                layout.script.components[component.name] = component.script;
            }
            break;
        }
    }
    return layout;
}

function renderVueComponents(script: Object, components: Object[]) {
    let componentsString = '';
    for (const component of components) {
        if (component.type === types.SUBCOMPONENT) {
            componentsString = componentsString + `const __${component.name} = Vue.component('${paramCase(component.name)}', ${Utils.scriptToString(component.script)});\n`;
        }
    }

    return componentsString;
}

function renderVueMixins(mixins: Array<Object>) {
    let mixinString = '';
    for (var mixin of mixins) {
        mixinString = mixinString + `Vue.mixin(${Utils.scriptToString(mixin)});`;
    }

    return mixinString;
}

function renderedScript(script, components, mixins: Array<Object>, router) {
    const componentsString = renderVueComponents(script, components);
    const mixinString      = mixins !== undefined ? renderVueMixins(mixins) : '';
    const routerString     = router !== undefined ?  `const __router = new VueRouter(${Utils.scriptToString(router)});` : '';
    let scriptString       = Utils.scriptToString(script);
    let debugToolsString   = '';

    if (router !== undefined) {
        scriptString = scriptString.substr(0, 1) + 'router: __router,' + scriptString.substr(1);
    }
    if (process.env.VUE_DEV) {
        debugToolsString = 'Vue.config.devtools = true;';
    }
    return `<script>\n(function () {'use strict';${mixinString}${componentsString}${routerString}var createApp = function () {return new Vue(${scriptString})};if (typeof module !== 'undefined' && module.exports) {module.exports = createApp} else {this.app = createApp()}}).call(this);${debugToolsString}app.$mount('#app');\n</script>`;
}

function renderHtmlUtil(components: Object[], defaults: Object): {app: Object, scriptString: string, layout: Object} {
    let mixins: Array<Object> = [];
    if (defaults.vue && defaults.vue.mixins) {
        mixins = defaults.vue.mixins;
    }

    let router: Object = null;
    if (defaults.vue && defaults.vue.router) {
        router = defaults.vue.router;
    }

    const layout = layoutUtil(components);
    const renderedScriptString = renderedScript(layout.script, components, mixins, router);
    const app = createApp(layout.script, defaults);

    return {
        app: app,
        scriptString: renderedScriptString,
        layout: layout
    };
}


module.exports.layoutUtil = layoutUtil;
module.exports.renderHtmlUtil = renderHtmlUtil;
module.exports.renderVueComponents = renderVueComponents;
module.exports.renderVueMixins = renderVueMixins;
