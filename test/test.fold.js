var assert = require("assert");
var eweda = require("./../eweda");

describe('foldl', function() {
    var foldl = eweda.foldl;
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
        assert.equal(eweda.reduce(add, 0, [1, 2, 3, 4]), 10);
        assert.strictEqual(eweda.reduce, foldl);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var sum = foldl(add, 0);
        assert.equal(sum.length, 1);
    });
});

describe('foldl1', function() {
    var fold11 = eweda.fold11;
    var add = function(a, b) {return a + b;};
    var mult = function(a, b) {return a * b;};

    it('should fold simple functions over arrays without an accumulator', function() {
        assert.equal(fold11(add, [1, 2, 3, 4]), 10);
        assert.equal(fold11(mult, [1, 2, 3, 4]), 24);
    });

    it('should throw an error with an empty array', function() {
        assert.throws(function() {fold11(add, [])}, Error);
    });

    it('should be automatically curried', function() {
        var sum = fold11(add);
        assert.equal(sum([1, 2, 3, 4]), 10);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var sum = fold11(add);
        assert.equal(sum.length, 1);
    });
});

describe('foldr', function() {
    var foldr = eweda.foldr;
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
        assert.equal(eweda.reduceRight(avg, 54, [12, 4, 10, 6]), 12);
        assert.strictEqual(eweda.reduceRight, foldr);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var something = foldr(avg, 0);
        assert.equal(something.length, 1);
    });
});

describe('foldr1', function() {
    var foldr1 = eweda.foldr1;
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
