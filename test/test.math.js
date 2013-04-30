var assert = require("assert");
var eweda = require("./../eweda");

describe('sum', function() {
    var sum = eweda.sum;

    it('should add together two numbers', function() {
        assert.equal(10, sum(3, 7));
    });

    it('should be automatically curried', function() {
        var incr = sum(1);
        assert.equal(43, incr(42));
    });
});

describe('prod', function() {
    var prod = eweda.prod;

    it('should add together two numbers', function() {
        assert.equal(42, prod(6, 7));
    });

    it('should be automatically curried', function() {
        var dbl = prod(2);
        assert.equal(30, dbl(15));
    });
});

describe('diff', function() {
    var diff = eweda.diff;

    it('should subtract two numbers', function() {
        assert.equal(15, diff(22, 7));
    });

    it('should be automatically curried', function() {
        var ninesCompl = diff(9);
        assert.equal(3, ninesCompl(6));
    });
});

describe('quotient', function() {
    var quotient = eweda.quotient;

    it('should subtract two numbers', function() {
        assert.equal(4, quotient(28, 7));
    });

    it('should be automatically curried', function() {
        var divideInto120 = quotient(120);
        assert.equal(3, divideInto120(40));

        var half = eweda.flip(quotient)(2);
        assert.equal(10, half(20));
    });
});