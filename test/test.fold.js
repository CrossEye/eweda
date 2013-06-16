var assert = require("assert");
var Lib = require("./../eweda");

describe('foldl', function() {
    var foldl = Lib.foldl;
    var add = function(a, b) {return a + b;};
    var mult = function(a, b) {return a * b;};

    it('should fold simple functions over arrays with the supplied accumulator', function() {
        assert.equal(foldl(add, 0, [1, 2, 3, 4]), 10);
        assert.equal(foldl(mult, 1, [1, 2, 3, 4]), 24);
    });

    it('should return the accumulator for an empty array', function() {
        assert.equal(foldl(add, 0, []), 0);
        assert.equal(foldl(mult, 1, []), 1);
    });

    it('should be automatically curried', function() {
        var sum = foldl(add, 0);
        assert.equal(sum([1, 2, 3, 4]), 10);
    });

    it('should be aliased by `reduce`', function() {
        assert.equal(Lib.reduce(add, 0, [1, 2, 3, 4]), 10);
        assert.strictEqual(Lib.reduce, foldl);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var sum = foldl(add, 0);
        assert.equal(sum.length, 1);
    });
});

describe('foldl1', function() {
    var foldl1 = Lib.foldl1;
    var add = function(a, b) {return a + b;};
    var mult = function(a, b) {return a * b;};

    it('should fold simple functions over arrays without an accumulator', function() {
        assert.equal(foldl1(add, [1, 2, 3, 4]), 10);
        assert.equal(foldl1(mult, [1, 2, 3, 4]), 24);
    });

    it('should throw an error with an empty array', function() {
        assert.throws(function() {foldl1(add, [])}, Error);
    });

    it('should be automatically curried', function() {
        var sum = foldl1(add);
        assert.equal(sum([1, 2, 3, 4]), 10);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var sum = foldl1(add);
        assert.equal(sum.length, 1);
    });
});

describe('foldr', function() {
    var foldr = Lib.foldr;
    var avg = function(a, b) {return (a + b) / 2;};

    it('should fold simple functions over arrays with the supplied accumulator', function() {
        assert.equal(foldr(avg, 54, [12, 4, 10, 6]), 12);
    });

    it('should return the accumulator for an empty array', function() {
        assert.equal(foldr(avg, 0, []), 0);
    });

    it('should be automatically curried', function() {
        var something = foldr(avg, 54);
        assert.equal(something([12, 4, 10, 6]), 12);
    });

    it('should be aliased by `reduceRight`', function() {
        assert.equal(Lib.reduceRight(avg, 54, [12, 4, 10, 6]), 12);
        assert.strictEqual(Lib.reduceRight, foldr);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var something = foldr(avg, 0);
        assert.equal(something.length, 1);
    });
});

describe('foldr1', function() {
    var foldr1 = Lib.foldr1;
    var avg = function(a, b) {return (a + b) / 2;};

    it('should fold simple functions over arrays without an accumulator', function() {
        assert.equal(foldr1(avg,  [12, 4, 10, 6, 54]), 12);
    });

    it('should throw an error with an empty array', function() {
        assert.throws(function() {foldr1(avg, [])}, Error);
    });

    it('should be automatically curried', function() {
        var something = foldr1(avg);
        assert.equal(something([12, 4, 10, 6, 54]), 12);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var something = foldr1(avg, 0);
        assert.equal(something.length, 1);
    });
});
