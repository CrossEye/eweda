var assert = require('assert');
var eweda = require('./../eweda');

describe('identitity', function() {
    var identity = eweda.identity;
    it('should return a function that returns the object initially supplied', function() {
        var theMeaning = identity(42);
        assert.equal(theMeaning(), 42);
        assert.equal(theMeaning(10), 42);
        assert.equal(theMeaning(false), 42);
    });

    it('should work with various types', function() {
        assert.equal(identity(false)(), false);
        assert.equal(identity('abc')(), 'abc');
        assert.deepEqual(identity({a: 1, b: 2})(), {a: 1, b: 2});
        var obj = {a: 1, b: 2};
        assert.strictEqual(identity(obj)(), obj);
        var now = new Date(1776, 6, 4);
        assert.deepEqual(identity(now)(), new Date(1776, 6, 4));
    });
});

describe ('alwaysZero', function() {
    var alwaysZero = eweda.alwaysZero;
    it('should always return zero', function() {
        assert.equal(alwaysZero(), 0);
        assert.equal(alwaysZero(10), 0);
        assert.equal(alwaysZero(false), 0);
    });
});

describe ('alwaysFalse', function() {
    var alwaysFalse = eweda.alwaysFalse;
    it('should always return false', function() {
        assert.equal(alwaysFalse(), false);
        assert.equal(alwaysFalse(10), false);
        assert.equal(alwaysFalse(true), false);
    });
});

describe ('alwaysTrue', function() {
    var alwaysTrue = eweda.alwaysTrue;
    it('should always return true', function() {
        assert.equal(alwaysTrue(), true);
        assert.equal(alwaysTrue(10), true);
        assert.equal(alwaysTrue(true), true);
    });
});