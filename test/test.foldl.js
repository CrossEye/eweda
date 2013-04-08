var assert = require("assert");
var eweda = require("./../eweda");

describe('foldl', function() {
    var foldl = eweda.foldl;
    var add = function(a, b) {return a + b;};
    var mult = function(a, b) {return a * b;};

    it('should fold simple functions over arrays', function() {
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

    // TODO:  do we need to use a
    it.skip('should correctly report the arity of curried versions', function() {
        var sum = foldl(add, 0);
        assert.equal(1, sum.length);
    });

});