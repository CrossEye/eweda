var assert = require("assert");
var eweda = require("./../eweda");

describe('compose', function() {
    var compose = eweda.compose;
    function a(x) {return x + "A";}
    function b(x) {return x + "B";}
    function c(x) {return x + "C";}
    function d(x) {return x + "D";}

    it("executes its passed in functions in order from right to left", function() {
        assert.equal(compose(a, b, c, d)(""), "DCBA");
    });
});

describe('pipe', function() {
    var pipe = eweda.pipe;
    function a(x) {return x + "A";}
    function b(x) {return x + "B";}
    function c(x) {return x + "C";}
    function d(x) {return x + "D";}
    it("executes its passed in functions in order from left to right", function() {
        assert.equal(pipe(a, b, c, d)(""), "ABCD");
    });
});

