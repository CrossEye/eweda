var assert = require("assert");
var eweda = require("./../eweda");

describe('map', function() {
    var map = eweda.map;
    var times2 = function(x) {return x * 2;};
    var add1 = function(x) {return x + 1;};

    it('should map simple functions over arrays', function() {
        assert.deepEqual([2, 4, 6, 8], map(times2, [1, 2, 3, 4]));
    });

    it('should be automatically curried', function() {
        var inc = map(add1);
        assert.deepEqual([2, 3, 4], inc([1, 2, 3]));
    });

    // TODO:  do we need to use a function constructor version of curry to make this work?
    it.skip('should correctly report the arity of curried versions', function() {
        var inc = map(add1);
        assert.equal(1, inc.length);
    });

});