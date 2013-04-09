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

    it('should fold simple functions over arrays without an accumulator', function() {
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

describe('foldr', function() {
    var foldr = eweda.foldr;
    var avg = function(a, b) {return (a + b) / 2;};

    it('should fold simple functions over arrays with the supplied accumulator', function() {
        assert.equal(12, foldr(avg, 54, [12, 4, 10, 6]));
    });

    it('should return the accumulator for an empty array', function() {
        assert.equal(0, foldr(avg, 0, []));
    });

    it('should be automatically curried', function() {
        var something = foldr(avg, 54);
        assert.equal(12, something([12, 4, 10, 6]));
    });

    it('should be aliased by `reduceRight`', function() {
        assert.equal(12, eweda.reduceRight(avg, 54, [12, 4, 10, 6]));
        assert.strictEqual(foldr, eweda.reduceRight);
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var something = foldr(avg, 0);
        assert.equal(1, something.length);
    });
});

describe('foldr1', function() {
    var foldr1 = eweda.foldr1;
    var avg = function(a, b) {return (a + b) / 2;};

    it('should fold simple functions over arrays without an accumulator', function() {
        assert.equal(12, foldr1(avg,  [12, 4, 10, 6, 54]));
    });

    it('should throw an error with an empty array', function() {
        assert.throws(function() {foldr1(avg, [])}, Error);
    });

    it('should be automatically curried', function() {
        var something = foldr1(avg);
        assert.equal(12, something([12, 4, 10, 6, 54]));
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var something = foldr1(avg, 0);
        assert.equal(1, something.length);
    });
});
