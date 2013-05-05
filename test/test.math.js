var assert = require("assert");
var eweda = require("./../eweda");

describe('add', function() {
    var add = eweda.add;

    it('should add together two numbers', function() {
        assert.equal(10, add(3, 7));
    });

    it('should be automatically curried', function() {
        var incr = add(1);
        assert.equal(43, incr(42));
    });
});

describe('multiply', function() {
    var multiply = eweda.multiply;

    it('should add together two numbers', function() {
        assert.equal(42, multiply(6, 7));
    });

    it('should be automatically curried', function() {
        var dbl = multiply(2);
        assert.equal(30, dbl(15));
    });
});

describe('subtract', function() {
    var subtract = eweda.subtract;

    it('should subtract two numbers', function() {
        assert.equal(15, subtract(22, 7));
    });

    it('should be automatically curried', function() {
        var ninesCompl = subtract(9);
        assert.equal(3, ninesCompl(6));
    });
});

describe('subtractN', function() {
    var subtractN = eweda.subtractN;

    it('should subtract two numbers', function() {
        assert.equal(15, subtractN(7,22));
    });

    it('should be automatically curried', function() {
        var minus6 = subtractN(6);
        assert.equal(3, minus6(9));
    });
});

describe('divide', function() {
    var divide = eweda.divide;

    it('should divide two numbers', function() {
        assert.equal(4, divide(28, 7));
    });

    it('should be automatically curried', function() {
        var divideInto120 = divide(120);
        assert.equal(3, divideInto120(40));
    });
});

describe('divideBy', function() {
    var divideBy = eweda.divideBy;

    it('should divide two numbers', function() {
        assert.equal(4, divideBy(7, 28));
    });

    it('should be automatically curried', function() {
        var half = divideBy(2);
        assert.equal(20, half(40));

    });
});

describe('sum', function() {
    var sum = eweda.sum;

    it('should add together the array of numbers supplied', function() {
        assert.equal(10, sum([1, 2, 3, 4]));
    });
});

describe('product', function() {
    var product = eweda.product;

    it('should multiply together the array of numbers supplied', function() {
        assert.equal(24, product([1, 2, 3, 4]));
    });
});

// TODO: doesn't really belong with math, but where?
describe('join', function() {
    var join = eweda.join;

    it('should concatenate the strings in a list', function() {
        assert.equal('abcd', join(['a', 'b', 'c', 'd']));
    });
});