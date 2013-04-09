var assert = require("assert");
var eweda = require("./../eweda");

describe('reverse', function() {
    var reverse = eweda.reverse;

    it('should reverse arrays', function() {
        assert.deepEqual([4, 3, 2, 1], reverse([1, 2, 3, 4]));
    });

    it('should return the empty list to itself', function() {
        assert.deepEqual([], reverse([]));
    });

});