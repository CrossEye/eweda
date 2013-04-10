var assert = require("assert");
var eweda = require("./../eweda");

describe('all', function() {
    var all = eweda.all;
    var even = function(n) { return n % 2 === 0; };
    var T = function() { return true; };

    it('returns true if all elements satisfy the predicate', function() {
        assert.equal(all(even, [2,4,6,8,10,12]), true);
    });

    it('returns false if any element fails to satisfy the predicate', function() {
        assert.equal(all(even, [2,4,6,8,9,10]), false);
    });

    it('returns true for an empty list', function() {
        assert.equal(all(T, []), true);
    });

});

describe("some", function() {
    var some = eweda.some;
    var odd = function(n) { return n % 2 === 1; };
    var T = function() { return true; };

    it('returns true if any element satisfies the predicate', function() {
        assert.equal(some(odd, [2,4,6,8,10,11,12]), true);
    });

    it('returns false if all elements fails to satisfy the predicate', function() {
        assert.equal(some(odd, [2,4,6,8,10,12]), false);
    });

    it('returns false for an empty list', function() {
        assert.equal(some(T, []), false);
    });
});

