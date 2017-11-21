import test from 'ava';
import {
    HeadUtils
} from '../../src/utils';

const newHead = {
    head: {
        title: 'It was a Pleasure',
        meta: [{
                name: 'application-name',
                content: 'Name of my application'
            },
            {
                name: 'description',
                content: 'A description of the page',
                id: 'desc'
            },
            {
                name: 'twitter:title',
                content: 'Content Title'
            },
            {
                property: 'fb:app_id',
                content: '123456789'
            },
            {
                property: 'og:title',
                content: 'Content Title'
            },
            {
                script: '/assets/scripts/hammer.min.js'
            },
            {
                script: '/assets/scripts/vue-touch.min.js',
                charset: 'utf-8'
            },
            {
                style: '/assets/rendered/style.css'
            },
            {
                style: '/assets/rendered/style.css',
                type: 'text/css'
            },
            {
                rel: 'icon',
                type: 'image/png',
                href: '/assets/favicons/favicon-32x32.png',
                sizes: '32x32'
            },
            {
                srcContents: '<script>var foo = false;</script>'
            },
            {
                rel: 'preconnect',
                href: 'http://www.example.com',
                itemprop: 'url',
                hreflang: 'en',
                crossorigin: 'anonymous'
            },
            {
                name: 'google',
                value: 'notranslate'
            },
            {
                charset: 'UTF-8'
            }
        ],
        structuredData: {
            foo: true
        }
    }
};

const newMetaString = new HeadUtils(newHead).toString();

//New Tests
const newStringIsCorrect = '<head>\n<title>It was a Pleasure</title>\n<meta name="application-name" content="Name of my application"/>\n<meta name="description" content="A description of the page"/>\n<meta name="twitter:title" content="Content Title"/>\n<meta property="fb:app_id" content="123456789"/>\n<meta property="og:title" content="Content Title"/>\n<script src="/assets/scripts/hammer.min.js" charset="utf-8"></script>\n<script src="/assets/scripts/vue-touch.min.js" charset="utf-8"></script>\n<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">\n<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">\n<link rel="icon" type="image/png" href="/assets/favicons/favicon-32x32.png" sizes="32x32" >\n<script>var foo = false;</script>\n<link rel="preconnect" href="http://www.example.com" itemprop="url" hreflang="en" crossorigin="anonymous">\n<meta name="google" value="notranslate"/>\n<meta charset="UTF-8"/>\n<script type="application/ld+json">\n{"foo":true}\n</script>\n</head>'
const newHasTitle = newMetaString.includes('<title>It was a Pleasure</title>');
const newHasMetaName = newMetaString.includes(`<meta name="application-name" content="Name of my application"/>`);
const newHasMetaProperty = newMetaString.includes(`<meta property="og:title" content="Content Title"/>`);
const newHasScript = newMetaString.includes(`<script src="/assets/scripts/hammer.min.js" charset="utf-8">`)
const newHasStyle = newMetaString.includes(`<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">`)
const newHasStructured = newMetaString.includes(`<script type="application/ld+json">\n{"foo":true}\n</script>`);
const newHasSrcContents = newMetaString.includes(`<script>var foo = false;</script>`);
const newHasLinkWithAttrs = newMetaString.includes(`<link rel="preconnect" href="http://www.example.com" itemprop="url" hreflang="en" crossorigin="anonymous">`);
const newHasMetaValue = newMetaString.includes(`<meta name="google" value="notranslate"/>`);
const newHasMetaCharset = newMetaString.includes(`<meta charset="UTF-8"/>`);

test('Head is correct', t => {
    t.is(newMetaString, newStringIsCorrect);
});

test('Head has title section', t => {
    t.is(newHasTitle, true);
});

test('Head has meta name section', t => {
    t.is(newHasMetaName, true);
});

test('Head has meta property section', t => {
    t.is(newHasMetaProperty, true);
});

test('Head has scripts', t => {
    t.is(newHasScript, true);
});

test('Head has style 🎷', t => {
    t.is(newHasStyle, true);
});

test('Head has Structured Data', t => {
    t.is(newHasStructured, true);
});

test('Head has srcContents', t => {
    t.is(newHasSrcContents, true);
});

test('Head has link with rel, href, itemprop, hreflang & crossorigin attributes', t => {
    t.is(newHasLinkWithAttrs, true);
});

test('Head has meta value section', t => {
    t.is(newHasMetaValue, true);
});

test('Head has meta charset section', t => {
    t.is(newHasMetaCharset, true);
});
