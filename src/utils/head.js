// @flow

// vue: {
//     head: {
//         title: 'Page Title',
//         meta: [
//             { property:'og:title', content: 'Page Title'},
//             { name:'twitter:title', content: 'Page Title'},
//         ]
//     }
// }
function createMetaTags(metaTags: string, vueObject: Object): string {
    if (vueObject.head && vueObject.head.meta) {
        for (let metaItem of vueObject.head.meta) {
            if (metaItem.name) {
                metaTags += `<meta name="${metaItem.name}" content="${metaItem.content}"/>\n`;
            } else if (metaItem.property) {
                metaTags += `<meta property="${metaItem.property}" content="${metaItem.content}"/>\n`;
            } else if (metaItem.script) {
                const charset = metaItem.charset || 'utf-8';
                const async = metaItem.async ? ' async=true' : '';
                metaTags += `<script src="${metaItem.script}" charset="${charset}"${async}></script>\n`;
            } else if (metaItem.style) {
                const type = metaItem.type || 'text/css';
                const rel  = metaItem.rel || 'stylesheet';
                metaTags += `<link rel="${rel}" type="${type}" href="${metaItem.style}">\n`;
            }
        }
    }
    return metaTags;
}

function headUtil(vueObject: Object, styleString: string) {
    let metaTags       = '';
    let title          = '';
    let structuredData = '';
    let style          = '';
    if (vueObject) {
        metaTags = createMetaTags(metaTags, vueObject);

        if (vueObject.head) {
            if (vueObject.head.title) {
                title = `<title>${vueObject.head.title}</title>\n`;
            }
            if (vueObject.head.structuredData) {
                structuredData = `<script type="application/ld+json">\n${JSON.stringify(vueObject.head.structuredData)}\n</script>\n`;
            }
        }

        if (styleString) {
            style = `<style>${styleString}</style>`;
        }
    }

    return title + metaTags + structuredData + style + '</head>';
}

module.exports = headUtil;
