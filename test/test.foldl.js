var assert = require("assert");
var eweda = require("./../eweda");

describe('foldl', function() {
    var foldl = eweda.foldl;
    var add = function(a, b) {return a + b;};
    var mult = function(a, b) {return a * b;};

    it('should fold simple functions over arrays with the supplied accumulator', function() {
        assert.equal(10, foldl(add, 0, [1, 2, 3, 4]));
        assert.equal(24, foldl(mult, 1, [1, 2, 3, 4]));
    });

    it('should return the accumulator for an empty array', function() {
        assert.equal(0, foldl(add, 0, []));
        assert.equal(1, foldl(mult, 1, []));
    });

    it('should be automatically curried', function() {
        var sum = foldl(add, 0);
        assert.equal(10, sum([1, 2, 3, 4]));
    });

    it('should be aliased by `reduce`', function() {
        assert.equal(10, eweda.reduce(add, 0, [1, 2, 3, 4]));
        assert.strictEqual(foldl, eweda.reduce);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var sum = foldl(add, 0);
        assert.equal(1, sum.length);
    });
});

describe('foldl1', function() {
    var fold11 = eweda.fold11;
    var add = function(a, b) {return a + b;};
    var mult = function(a, b) {return a * b;};

    it('should fold simple functions over arrays', function() {
        assert.equal(10, fold11(add, [1, 2, 3, 4]));
        assert.equal(24, fold11(mult, [1, 2, 3, 4]));
    });

    it('should throw an error with an empty array', function() {
        assert.throws(function() {fold11(add, [])}, Error);
    });

    it('should be automatically curried', function() {
        var sum = fold11(add);
        assert.equal(10, sum([1, 2, 3, 4]));
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var sum = fold11(add);
        assert.equal(1, sum.length);
    });
});