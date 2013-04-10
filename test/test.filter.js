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