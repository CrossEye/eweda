var assert = require("assert");
var eweda = require("./../eweda");

describe("head", function() {
    var head = eweda.head;
    var arr = [1,2,3,4,5,6,7,8,9];

    it("returns the first element of the passed-in list", function() {
        assert.equal(1, head(arr));
    });

    it("does not mutate the passed-in list", function() {
        head(arr);
        assert.equal(head(arr), arr[0]);
        assert.equal(arr.length, 9);
    });

    it("returns empty array for the empty list", function() {
        assert.equal(Array.isArray(head([])) && head([]).length === 0, true);
    })
});

describe("tail", function() {
    var tail = eweda.tail;
    var arr = [1,2,3,4,5];
    it("returns a copy of everything but the first element of the passed-in array", function() {
        assert.equal(tail(arr).length, arr.length - 1);
        for (var i = 0, len = tail(arr).length; i < len; i++) {
            assert.equal(tail(arr)[i], arr[i + 1]);
        }
    });

    it("does not mutate the passed-in array", function() {
        var arr = [1,2,3,4,5,6,7];
        tail(tail(arr));
        for (var i = 0, len = arr.length; i < len; i++) {
            assert.equal(arr[i], i+1);
        }
    });
});



