var assert = require("assert");
var eweda = require("./../eweda");

describe('range', function() {
    var range = eweda.range;

    it('should return list of numbers', function() {
        assert.deepEqual(range(0, 5), [0, 1, 2, 3, 4]);
        assert.deepEqual(range(4, 7), [4, 5, 6]);
    });

    it('should return the empty list if the first parameter is not larger than the second', function() {
        assert.deepEqual(range(7, 3), []);
        assert.deepEqual(range(5, 5), []);
    });
});