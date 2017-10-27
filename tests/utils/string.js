import test from 'ava';
import {
    scriptToString,
    mixinsToString,
    routesToString,
    routeComponentsToString
} from '../../src/utils';

const object = {
    'string': 'foo',
    'function': function () {
        return 'baz';
    },
    data: function () {
        return {
            foo: 'bar'
        }
    },
    'array': ['one', 'two', 'three'],
    'object': {
        dog: true,
        cat: false
    },
    'number': 42,
    'boolean': true
}

const object2 = {
    data: {
        foo: 'bar'
    }
}

const exampleMixin = {
    methods: {
        hello: function () {
            console.log('Hello');
        }
    }
};

const testString = scriptToString(object);
const testString2 = scriptToString(object2);
const mixins = mixinsToString([exampleMixin]);

//Tests
const hasString = testString.includes(`string: "foo"`);
const hasNumber = testString.includes(`number: 42`);
const hasArray = testString.includes(`array: ["one","two","three"]`);
const hasObject = testString.includes(`object: {dog: true,cat: false}`);
const hasBoolean = testString.includes(`boolean: true`);
const hasFunction = testString.includes(`function: function _function() {
        return 'baz';
    }`);
const hasDataFunc = testString.includes(`data: function(){return {"foo":"bar"}}`);
const hasDataObj = testString2.includes(`data: {"foo":"bar"}`);
const hasFinal = testString === `{string: "foo",function: function _function() {
        return 'baz';
    },data: function(){return {"foo":"bar"}},array: ["one","two","three"],object: {dog: true,cat: false},number: 42,boolean: true}`;

test('Has a String', t => {
    t.is(hasString, true);
});

test('Has a Number', t => {
    t.is(hasNumber, true);
});

test('Has a Array', t => {
    t.is(hasArray, true);
});

test('Has a Object', t => {
    t.is(hasObject, true);
});

test('Has a Boolean', t => {
    t.is(hasBoolean, true);
});

test('Has a Function', t => {
    t.is(hasFunction, true);
});

test('Has Data Function', t => {
    t.is(hasDataFunc, true);
})

test('Has Data Object', t => {
    t.is(hasDataObj, true);
})

test('Has a Fully formed String', t => {
    t.is(hasFinal, true);
});

test('Mixins', t => {
    t.is(mixins, `{methods: {hello: function hello() {
            console.log('Hello');
        }}},`);
});

// Test routesToString()
const routes = [
    { name: 'route1', path: '/route1', alias: ['asd', 'bsd', 'csd'], meta: { something: 'another' }, components: { mainview: 'mycomponent1', }, },
    {
        path: '/route2',
        components: { mainview: 'mycomponent2', },
        children: [
            { name: 'child1', path: 'child1', component: 'mychildcomponent1', alias: ['xsd', 'ysd', 'zsd'] },
            { name: 'child2', path: 'child2', components: { childview: 'mychildcomponent2', }, },
        ],
    },
    {
        path: '/route3', component: 'mycomponent3',
        beforeEnter: function (to, from, next) {
            console.log(to, from);
            next();
        },
    }
];

const routesString = routesToString(routes);
const hasComponent = routesString.includes(`component: __mycomponent3`);
const hasChildComponent = routesString.includes(`component: __mychildcomponent1`);
const hasNamedViewsComponents = routesString.includes(`components: {mainview: __mycomponent1}`);
const hasNamedViewsChildComponents = routesString.includes(`components: {childview: __mychildcomponent2}`);
const expectedRoutesString = `[{name: "route1",path: "/route1",alias: ["asd","bsd","csd"],meta: {something: "another"},components: {mainview: __mycomponent1}},{path: "/route2",components: {mainview: __mycomponent2},children: [{name: "child1",path: "child1",component: __mychildcomponent1,alias: ["xsd","ysd","zsd"]},{name: "child2",path: "child2",components: {childview: __mychildcomponent2}}]},{path: "/route3",component: __mycomponent3,beforeEnter: function beforeEnter(to, from, next) {
        console.log(to, from);
        next();
    }}]`;

test('Has component', t => t.is(hasComponent, true));
test('Has child component', t => t.is(hasChildComponent, true));
test('Has named views component', t => t.is(hasNamedViewsComponents, true));
test('Has named views child component', t => t.is(hasNamedViewsChildComponents, true));
test('Routes', t => t.is(routesString, expectedRoutesString));

// Test routeComponentsToString()
const components = {
    myview0: 'mycomponent0',
    myview1: 'mycomponent1',
    myview3: 'mycomponent2'
}

const componentsString = routeComponentsToString(components);
test('Route components', (t) => {
    t.is(componentsString.includes(`{myview0: __mycomponent0,myview1: __mycomponent1,myview3: __mycomponent2}`), true);
});

// Test scriptToString() using properties named 'component' and 'components'
const regularScript = {
    component: 'component',
    components: {
        prop0: 'prop0',
        prop1: 'prop1',
        prop2: 'prop2'
    }
}

const regularScriptString = scriptToString(regularScript);
test('Regular script components', (t) => {
    t.is(regularScriptString.includes(`{component: "component",components: {prop0: "prop0",prop1: "prop1",prop2: "prop2"}}`), true);
});
