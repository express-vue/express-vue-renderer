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
                style: '/assets/rendered/style.css',
                type: 'text/css',
                rel: 'stylesheet'
            }
        ],
        structuredData: {
            foo: true
        }
    }
};

const newMetaString = new HeadUtils(newHead).toString();

//New Tests
const newStringIsCorrect = '<title>It was a Pleasure</title>\n<meta name="application-name" content="Name of my application"/>\n<meta name="description" content="A description of the page"/>\n<meta name="twitter:title" content="Content Title"/>\n<meta property="fb:app_id" content="123456789"/>\n<meta property="og:title" content="Content Title"/>\n<script src="/assets/scripts/hammer.min.js" charset="utf-8"></script>\n<script src="/assets/scripts/vue-touch.min.js" charset="utf-8"></script>\n<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">\n<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">\n<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">\n<script type="application/ld+json">\n{"foo":true}\n</script>\n</head>'
const newHasTitle = newMetaString.includes('<title>It was a Pleasure</title>');
const newHasMetaName = newMetaString.includes(`<meta name="application-name" content="Name of my application"/>`);
const newHasMetaProperty = newMetaString.includes(`<meta property="og:title" content="Content Title"/>`);
const newHasScript = newMetaString.includes(`<script src="/assets/scripts/hammer.min.js" charset="utf-8">`)
const newHasStyle = newMetaString.includes(`<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">`)
const newHasStructured = newMetaString.includes(`<script type="application/ld+json">\n{"foo":true}\n</script>`);

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
