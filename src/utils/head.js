// @flow

type VueObjectType = {
    head: {
        title: string,
        meta: Object[],
        structuredData: Object
    }
}
// vue: {
//     head: {
//         title: 'Page Title',
//         meta: [
//             { property:'og:title', content: 'Page Title'},
//             { name:'twitter:title', content: 'Page Title'},
//         ]
//     }
// }
class HeadUtil {
    metaTags: string;
    title: string;
    structuredData: string;
    style: string;
    constructor(vueObject: VueObjectType, styleString: string) {
        this.setupStyleString(styleString);
        this.setupMetaTags(vueObject);
        this.setupTitle(vueObject);
        this.setupStructuredData(vueObject);
    }
    setupMetaTags(vueObject: Object) {
        if (this.metaTags === undefined) {
            this.metaTags = '';
        }
        if (vueObject.head && vueObject.head.meta) {
            for (let metaItem of vueObject.head.meta) {
                if (metaItem.name) {
                    this.metaTags += `<meta name="${metaItem.name}" content="${metaItem.content}"/>\n`;
                } else if (metaItem.property) {
                    this.metaTags += `<meta property="${metaItem.property}" content="${metaItem.content}"/>\n`;
                } else if (metaItem.script) {
                    const charset = metaItem.charset || 'utf-8';
                    const async = metaItem.async ? ' async=true' : '';
                    this.metaTags += `<script src="${metaItem.script}" charset="${charset}"${async}></script>\n`;
                } else if (metaItem.style) {
                    const type = metaItem.type || 'text/css';
                    const rel = metaItem.rel || 'stylesheet';
                    this.metaTags += `<link rel="${rel}" type="${type}" href="${metaItem.style}">\n`;
                }
            }
        }
    }
    setupTitle(vueObject: Object) {
        if (vueObject && vueObject.head && vueObject.head.title) {
            this.title = `<title>${vueObject.head.title}</title>\n`;
        } else {
            this.title = '';
        }
    }
    setupStructuredData(vueObject: Object) {
        if (vueObject && vueObject.head && vueObject.head.structuredData) {
            this.structuredData = `<script type="application/ld+json">\n${JSON.stringify(vueObject.head.structuredData)}\n</script>\n`;
        } else {
            this.structuredData = '';
        }
    }
    setupStyleString(styleString: string) {
        if (styleString) {
            this.style = `<style>${styleString}</style>`;
        } else {
            this.style = '';
        }
    }
    toString(): string {
        return '<head>\n' + this.title + this.metaTags + this.structuredData + this.style + '</head>';
    }
}

module.exports = HeadUtil;
