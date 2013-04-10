var assert = require("assert");
var eweda = require("./../eweda");

describe('filter', function() {
    var filter = eweda.filter;
    var even = function(x) {return !(x % 2);};

    it('should reduce an array to those matching a filter', function() {
        assert.deepEqual(filter(even, [1, 2, 3, 4, 5]), [2, 4]);
    });

    it('should be automatically curried', function() {
        var onlyEven = filter(even);
        assert.deepEqual(onlyEven([1, 2, 3,4, 5, 6, 7]), [2, 4, 6]);
    });
});

describe('reject', function() {
    var reject = eweda.reject;
    var even = function(x) {return !(x % 2);};

    it('should reduce an array to those not matching a filter', function() {
        assert.deepEqual(reject(even, [1, 2, 3, 4, 5]), [1, 3, 5]);
    });

    it('should be automatically curried', function() {
        var odd = reject(even);
        assert.deepEqual(odd([1, 2, 3,4, 5, 6, 7]), [1, 3, 5, 7]);
    });
});
