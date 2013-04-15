var assert = require("assert");
var eweda = require("./../eweda");

describe('maybe', function() {
    var maybe = eweda.maybe;
    var undef;
    function f(a, b, c) {
        return 1 + a + b + c;
    }

    it("prevents null arguments", function() {
        assert.equal(isNaN(f()), true);
        assert.equal(typeof maybe(f)(), "undefined");
        assert.equal(maybe(f)(2, 3, 4), 10);
    });

    it("ensures all required arguments are present", function() {
        assert.equal(maybe(f)(), undef);
        assert.equal(maybe(f)(1), undef);
        assert.equal(maybe(f)(1, 2), undef);
        assert.equal(maybe(f)(1, 2, 3), 7);
    });
});

