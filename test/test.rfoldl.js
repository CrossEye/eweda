var assert = require("assert");
var eweda = require("./../eweda");

describe("rfoldl", function() {
    var rfoldl = eweda.rfoldl;
    var add = function(a, b) {return a + b;};
    var mult = function(a, b) {return a * b;};

    it('should fold simple functions over arrays', function() {
        assert.equal(10, rfoldl(add, 0, [1, 2, 3, 4]));
        assert.equal(24, rfoldl(mult, 1, [1, 2, 3, 4]));
    });

    it('should return the accumulator for an empty array', function() {
        assert.equal(0, rfoldl(add, 0, []));
        assert.equal(1, rfoldl(mult, 1, []));
    });

    it('should be automatically curried', function() {
        var sum = rfoldl(add, 0);
        assert.equal(10, sum([1, 2, 3, 4]));
    });
});


