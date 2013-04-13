var assert = require("assert");
var eweda = require("./../eweda");

describe('maybe', function() {
    var maybe = eweda.maybe;

    it("prevents null arguments", function() {
        maybe = eweda.maybe;
        var f = function(a, b, c) {
            return 1 + a + b + c;
        };
        assert.equal(isNaN(f()), true);
        assert.equal(typeof maybe(f)(), "undefined");
        assert.equal(maybe(f)(2, 3, 4), 10);
    });

    // this one fails--need variadic function handling?
    it("ensures all required arguments are present", function() {
        assert.equal(typeof maybe(f)(1), "undefined");
    });
});

