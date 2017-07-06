const expressVueRenderer = require('../lib');



expressVueRenderer.expressVueRenderer().then(app => {
    expressVueRenderer.renderToString(app).then(string => {
        console.error(string);
    }).catch(error => {
        console.error(error);
    });
}).catch(error => {
    console.error(error);
});
