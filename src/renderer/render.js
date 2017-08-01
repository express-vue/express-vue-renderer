// @flow
const {
    Types
} = require('../models');
const Utils = require('../utils');
const paramCase = require('param-case');
const Vue = require('vue');

const types = new Types();

function createApp(script) {
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
            componentsString = componentsString + `Vue.component('${paramCase(component.name)}', ${Utils.scriptToString(component.script)});\n`;
        }
    }

    return componentsString;
}

function renderedScript(script, components) {

    const componentsString = renderVueComponents(script, components);
    const scriptString = Utils.scriptToString(script);
    let debugToolsString = '';

    if (process.env.VUE_DEV) {
        debugToolsString = 'Vue.config.devtools = true;';
    }
    return `<script>\n(function () {'use strict';${componentsString}var createApp = function () {return new Vue(${scriptString})};if (typeof module !== 'undefined' && module.exports) {module.exports = createApp} else {this.app = createApp()}}).call(this);${debugToolsString}app.$mount('#app');\n</script>`;
}

type htmlUtilType = {
    app: Object,
    scriptString: string,
    layout: Object
};

function renderHtmlUtil(components: Object[]): htmlUtilType {
    const layout = layoutUtil(components);
    const renderedScriptString = renderedScript(layout.script, components);
    const app = createApp(layout.script);

    return {
        app: app,
        scriptString: renderedScriptString,
        layout: layout
    };
}


module.exports.layoutUtil = layoutUtil;
module.exports.renderHtmlUtil = renderHtmlUtil;
module.exports.renderVueComponents = renderVueComponents;
