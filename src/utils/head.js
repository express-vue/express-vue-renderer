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
                if (metaItem.value) {
                    this.metaTags += `<meta name="${metaItem.name}" value="${metaItem.value}"/>\n`;
                } else if (metaItem.name) {
                    this.metaTags += `<meta name="${metaItem.name}" content="${metaItem.content}"/>\n`;
                } else if (metaItem.property) {
                    this.metaTags += `<meta property="${metaItem.property}" content="${metaItem.content}"/>\n`;
                } else if (metaItem.script) {
                    const charset = metaItem.charset || 'utf-8';
                    const async = metaItem.async ? ' async=true' : '';
                    this.metaTags += `<script src="${metaItem.script}" charset="${charset}"${async}></script>\n`;
                } else if (metaItem.charset) {
                    this.metaTags += `<meta charset="${metaItem.charset}"/>\n`;
                } else if (metaItem.style) {
                    const type = metaItem.type || 'text/css';
                    const rel = 'stylesheet';
                    this.metaTags += `<link rel="${rel}" type="${type}" href="${metaItem.style}">\n`;
                } else if (metaItem.rel) {
                    // <link rel="icon" type="image/png" href="/assets/favicons/favicon-32x32.png" sizes="32x32"/>
                    const rel = metaItem.rel ? `rel="${metaItem.rel}" ` : '';
                    const type = metaItem.type ? `type="${metaItem.type}" ` : '';
                    const href = metaItem.href ? `href="${metaItem.href}" ` : '';
                    const sizes = metaItem.sizes ? `sizes="${metaItem.sizes}" ` : '';
                    const itemprop = metaItem.itemprop ? `itemprop="${metaItem.itemprop}" ` : '';
                    const hreflang = metaItem.hreflang ? `hreflang="${metaItem.hreflang}" ` : '';
                    const crossorigin = metaItem.crossorigin ? `crossorigin="${metaItem.crossorigin}"` : '';
                    this.metaTags += `<link ${rel}${type}${href}${sizes}${itemprop}${hreflang}${crossorigin}>\n`;
                } else if (metaItem.srcContents) {
                    this.metaTags += `${metaItem.srcContents}\n`;
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
