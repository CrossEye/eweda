var assert = require("assert");
var eweda = require("./../eweda");

describe('all', function() {
    var all = eweda.all;
    var even = function(n) {return n % 2 === 0;};
    var T = function() {return true;};

    it('returns true if all elements satisfy the predicate', function() {
        assert.equal(all(even, [2, 4, 6, 8, 10, 12]), true);
    });

    it('returns false if any element fails to satisfy the predicate', function() {
        assert.equal(all(even, [2, 4, 6, 8, 9, 10]), false);
    });

    it('returns true for an empty list', function() {
        assert.equal(all(T, []), true);
    });

    it('should short-circuit on first false value', function() {
        var count = 0;
        var test = function(n) {count++; return even(n);};
        var result = all(test, [2, 4, 6, 7, 8, 10]);
        assert(!result);
        assert.equal(count, 4);
    });

    it('should be aliased by `every`', function() {
        assert.equal(eweda.every(even, [2, 4, 6, 8, 10]), true);
        assert.strictEqual(eweda.every, all);
    });
});

describe("some", function() {
    var some = eweda.some;
    var odd = function(n) {return n % 2 === 1;};
    var T = function() {return true;};

    it('returns true if any element satisfies the predicate', function() {
        assert.equal(some(odd, [2, 4, 6, 8, 10, 11, 12]), true);
    });

    it('returns false if all elements fails to satisfy the predicate', function() {
        assert.equal(some(odd, [2, 4, 6, 8, 10, 12]), false);
    });

    it('returns false for an empty list', function() {
        assert.equal(some(T, []), false);
    });

    it('should short-circuit on first true value', function() {
        var count = 0;
        var test = function(n) {count++; return odd(n);};
        var result = some(test, [2, 4, 6, 7, 8, 10]);
        assert(result);
        assert.equal(count, 4);
    });

    it('should be aliased by `any`', function() {
        assert.equal(eweda.any(odd, [2, 4, 6, 8, 10, 11, 12]), true);
        assert.strictEqual(eweda.any, some);
    });

    // TODO: remove superfluous alias used for testing `and`
    it('should be aliased by `atLeastOne`', function() {
        assert.equal(eweda.atLeastOne(odd, [2, 4, 6, 8, 10, 11, 12]), true);
        assert.strictEqual(eweda.atLeastOne, some);
    });
});

