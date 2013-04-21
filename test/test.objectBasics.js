var assert = require('assert');
var eweda = require('./../eweda');

describe('prop', function() {
    var prop = eweda.prop;
    var person = {name: 'Fred', age:23};

    it('should return a function that fetches the appropriate property', function() {
        var nm = prop('name');
        assert.equal(typeof nm, 'function');
        assert.equal(nm(person), 'Fred');
    });

    it.skip('should be aliased by `get`', function() {
        assert.equal(eweda.get('age')(person), 23);
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
