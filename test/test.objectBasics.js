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

    it.skip('should be aliased by `get`', function() { // TODO: should it?
        assert.equal(eweda.get('age')(fred), 23);
        assert.strictEqual(eweda.get, prop);
    });
});

describe('func', function() {
    var func = eweda.func;

    it('should return a function that applies the appropriate function to the supplied object', function() {
        var fred = {first: 'Fred', last: 'Flintstone', getName: function() {return this.first + ' ' + this.last;}};
        var barney = {first: 'Barney', last: 'Rubble', getName: function() {return this.first + ' ' + this.last;}};
        var gName = func('getName');
        assert.equal(typeof gName, 'function');
        assert.equal(gName(fred), 'Fred Flintstone');
        assert.equal(gName(barney), 'Barney Rubble');
    });

    it('should apply additional arguments to the function', function() {
        var Point = function(x, y) {this.x = x; this.y = y;};
        Point.prototype.moveBy = function(dx, dy) {this.x += dx; this.y += dy;};
        var p1 = new Point(10, 20);
        var moveBy = func('moveBy');
        moveBy(p1, 5, 7);
        assert.equal(p1.x, 15);
        assert.equal(p1.y, 27);
    });
});

// TODO: This needs a better home than objectBasics
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
