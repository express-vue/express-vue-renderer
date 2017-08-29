// @flow
const Utils = require('../utils');
var Vue = require('vue');

const butternut = require('butternut');
const buttterNutOptions = {
    sourceMap: false
};

function createApp(script: Object, plugins: Object[]) {
    if (plugins && plugins.length > 0) {
        for (const plugin of plugins) {
            Vue.use(plugin);
        }
    }

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


function renderedScript(script: Object, vueOptions: Object): string {
    const routerString = vueOptions.router !== undefined ? `const __router = new VueRouter(${Utils.scriptToString(vueOptions.router)});` : '';
    let pluginString = '';
    if (vueOptions.plugins) {
        for (const plugin of vueOptions.plugins) {
            pluginString += `Vue.use(${Utils.scriptToString(plugin)});`;
        }
    }

    let scriptString = Utils.scriptToString(script);
    let debugToolsString = '';

    if (vueOptions.router !== undefined) {
        scriptString = scriptString.substr(0, 1) + 'router: __router,' + scriptString.substr(1);
    }

    if (process.env.VUE_DEV) {
        debugToolsString = 'Vue.config.devtools = true;';
    }
    const javaScriptString = `(function () {
        'use strict';
        ${pluginString}
        ${routerString}
        var createApp = function () {
            return new Vue(${scriptString})};
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = createApp
            } else {
                this.app = createApp()
            }
        }).call(this);
        ${debugToolsString}
        app.$mount('#app');`;

    const finalString = butternut.squash(javaScriptString, buttterNutOptions).code;

    return `<script>${finalString}</script>`;
}

type htmlUtilType = {
    app: Object,
    scriptString: string,
    layout: Object,
    scriptStringRaw: string
};

function renderHtmlUtil(component: Object, vueOptions: Object): htmlUtilType {
    const layout = layoutUtil(component);
    const renderedScriptString = renderedScript(layout.script, vueOptions);
    const app = createApp(layout.script, vueOptions.plugins);

    return {
        app: app,
        scriptString: renderedScriptString,
        layout: layout,
        scriptStringRaw: Utils.scriptToString(layout.script)
    };
}

module.exports.layoutUtil = layoutUtil;
module.exports.renderHtmlUtil = renderHtmlUtil;
