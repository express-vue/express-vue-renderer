// @flow
const Utils = require('../utils');
const Vue = require('vue');

const butternut = require('butternut');
const buttterNutOptions = {
    sourceMap: false
};

function createApp(script) {
    return new Vue(script);
}

function layoutUtil(component: Object) {
    let layout = {};
    layout.style = '';
    layout.script = component.script;
    if (component.style.length > 0) {
        layout.style += component.style;
    }
    return layout;
}


function renderedScript(script: Object, router): string {
    const routerString = router !== undefined ? `const __router = new VueRouter(${Utils.scriptToString(router)});` : '';
    let scriptString = Utils.scriptToString(script);
    let debugToolsString = '';

    if (router !== undefined) {
        scriptString = scriptString.substr(0, 1) + 'router: __router,' + scriptString.substr(1);
    }
    if (process.env.VUE_DEV) {
        debugToolsString = 'Vue.config.devtools = true;';
    }
    const javaScriptString = `(function () {'use strict';${routerString}var createApp = function () {return new Vue(${scriptString})};if (typeof module !== 'undefined' && module.exports) {module.exports = createApp} else {this.app = createApp()}}).call(this);${debugToolsString}app.$mount('#app');`;
    const finalString = butternut.squash(javaScriptString, buttterNutOptions).code;

    return `<script>\n${finalString}\n</script>`;
}

type htmlUtilType = {
    app: Object,
    scriptString: string,
    layout: Object,
    scriptStringRaw: string
};

function renderHtmlUtil(component: Object): htmlUtilType {
    const layout = layoutUtil(component);
    const renderedScriptString = renderedScript(layout.script);
    const app = createApp(layout.script);

    return {
        app: app,
        scriptString: renderedScriptString,
        layout: layout,
        scriptStringRaw: Utils.scriptToString(layout.script)
    };
}

module.exports.layoutUtil = layoutUtil;
module.exports.renderHtmlUtil = renderHtmlUtil;
