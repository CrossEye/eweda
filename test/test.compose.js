var assert = require("assert");
var eweda = require("./../eweda");

describe('compose', function() {
    var compose = eweda.compose;
    function a(x) { return "A" + x; }
    function b(x) { return "B" + x; }
    function c(x) { return "C" + x; }
    function d(x) { return "D" + x; }

    it("executes its passed in functions in order from right to left", function() {
        assert.equal(compose(a, b, c, d)(""), "DCBA");
    });
});

describe('pipe', function() {
    var pipe = eweda.pipe;
    function a(x) { return "A" + x; }
    function b(x) { return "B" + x; }
    function c(x) { return "C" + x; }
    function d(x) { return "D" + x; }
    it("executes its passed in functions in order from left to right", function() {
        assert.equal(pipe(a, b, c, d)(""), "ABCD");
    });
});

