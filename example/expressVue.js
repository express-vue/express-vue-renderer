
const Defaults = require('../lib/models').Defaults;
const expressVueRenderer = require('../lib');

//This is the Middlewarein express-vue this wont be in the file
function init(options) {
    //Make new object
    const GlobalOptions = new Defaults(options);
    //Middleware init
    return (req, res, next) => {
        //Res RenderVUE function
        res.renderVue = (componentPath, data, vueOptions) => {
            res.set('Content-Type', 'text/html');
            expressVueRenderer.renderToStream(componentPath, data, vueOptions, GlobalOptions)
                .then(stream => {
                    stream.on('data', chunk => res.write(chunk));
                    stream.on('end', () => res.end());
                })
                .catch(error => {
                    console.error(error);
                    res.send(error);
                });
        };
        return next();
    };
}

module.exports.init = init;
