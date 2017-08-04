import test from 'ava';
import Layout from '../../src/models/layout';

test('Default HTML', t => {
    const testing = new Layout.HTML();
    const expected = {
        start: '<!DOCTYPE html><html>',
        end: '</html>'
    }
    t.is(testing.start, expected.start);
    t.is(testing.end, expected.end);
});

test('Custom HTML', t => {
    const expected = {
        start: '<!DOCTYPE html><html lang="en">',
        end: '\n</html>'
    }
    const testing = new Layout.HTML(expected);

    t.is(testing.start, expected.start);
    t.is(testing.end, expected.end);
});

test('Default Body', t => {
    const testing = new Layout.Body();
    const expected = {
        start: '<body>',
        end: '</body>'
    }
    t.is(testing.start, expected.start);
    t.is(testing.end, expected.end);
});

test('Custom Body', t => {
    const expected = {
        start: '<body id="test">',
        end: '\n</body>'
    }
    const testing = new Layout.Body(expected);

    t.is(testing.start, expected.start);
    t.is(testing.end, expected.end);
});

test('Default Template', t => {
    const testing = new Layout.Template();
    const expected = {
        start: '<div id="app">',
        end: '</div>'
    }
    t.is(testing.start, expected.start);
    t.is(testing.end, expected.end);
});

test('Custom Template', t => {
    const expected = {
        start: '<div><div id="app">',
        end: '</div></div>'
    }
    const testing = new Layout.Template(expected);

    t.is(testing.start, expected.start);
    t.is(testing.end, expected.end);
});

test('Default Layout', t => {
    const expected = {
        template: {
            start: '<div id="app">',
            end: '</div>'
        },
        body: {
            start: '<body>',
            end: '</body>'
        },
        html: {
            start: '<!DOCTYPE html><html>',
            end: '</html>'
        }
    }

    const testing = new Layout.Layout();

    t.is(testing.template.start, expected.template.start);
    t.is(testing.template.end, expected.template.end);
    t.is(testing.html.start, expected.html.start);
    t.is(testing.html.end, expected.html.end);
    t.is(testing.body.start, expected.body.start);
    t.is(testing.body.end, expected.body.end);
});

test('Custom Layout', t => {
    const expected = {
        template: {
            start: '<div><div id="app">',
            end: '</div></div>'
        },
        body: {
            start: '<body class="foo">',
            end: '\n</body>'
        },
        html: {
            start: '<!DOCTYPE html><html lang="en">',
            end: '\n</html>'
        }
    }

    const testing = new Layout.Layout(expected);

    t.is(testing.template.start, expected.template.start);
    t.is(testing.template.end, expected.template.end);
    t.is(testing.html.start, expected.html.start);
    t.is(testing.html.end, expected.html.end);
    t.is(testing.body.start, expected.body.start);
    t.is(testing.body.end, expected.body.end);
});
