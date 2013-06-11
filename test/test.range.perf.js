var assert = require("assert");
var eweda = require("./../eweda");

describe('range.perf', function() {
    var range = eweda.range;

    it('should not fail on larger lists', function() {
        assert.doesNotThrow(function() {var r = range(0, 3481);}); // this seemed to be the breaking point for old code
        assert.doesNotThrow(function() {var r = range(0, 13925);}); // this seemed to be the breaking point for refactored code
        assert.doesNotThrow(function() {var r = range(0, 100000);}); // this one now works with trampolining, but takes > 10 seconds
    });
});