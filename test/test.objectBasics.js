var assert = require('assert');
var eweda = require('./../eweda');

describe('prop', function() {
    var prop = eweda.prop;
    var fred = {name: 'Fred', age:23};

    it('should return a function that fetches the appropriate property', function() {
        var nm = prop('name');
        assert.equal(typeof nm, 'function');
        assert.equal(nm(fred), 'Fred');
    });

    it.skip('should be aliased by `get`', function() {
        assert.equal(eweda.get('age')(fred), 23);
        assert.strictEqual(eweda.get, prop);
    });
});

describe('pluck', function() {
    var pluck = eweda.pluck;
    var people = [{name: 'Fred', age: 23}, {name: 'Wilma', age: 21} , {name: 'Pebbles', age: 2}];

    it('should return a function that maps the appropriate property over an array', function() {
        var nm = pluck('name');
        assert.equal(typeof nm, 'function');
        assert.deepEqual(nm(people), ['Fred', 'Wilma', 'Pebbles']);
    });
});

describe('props', function() {
    var props = eweda.props;
    var fred = {name: 'Fred', age: 23, feet: 'large'};

    it('should return a function that fetches the appropriate properties from the initially supplied object', function() {
        var p = props(fred);
        assert.equal(p('name'), 'Fred');
        assert.equal(p('age'), 23);
        assert.equal(p('feet'), 'large');
    });
});
