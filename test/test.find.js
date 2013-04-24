var assert = require("assert");
var eweda = require("./../eweda");

describe('find', function() {
    var find = eweda.find;
    var a = [11, [[[[10], 9, ['cow', {x: 100}], 8], 7, [100, 200, 300], 6], 4, 3, 2, 1], 0];
    var even = function(x) { return x % 2 === 0; };
    var gt100 = function(x) { return x > 100; };
    var isStr = function(x) { return typeof x === "string"; };

    it("returns the first element that satisfies the predicate", function() {
        assert.equal(find(even, a), 10);
        assert.equal(find(gt100, a), 200);
        assert.equal(find(isStr, a), 'cow');
    });

});
