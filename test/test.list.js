var assert = require("assert");
var eweda = require("./../eweda");

describe('indexOf', function() {
  it("returns a number indicating an object's position in a list", function() {
    var list = [0, 10, 20, 30];
    assert.equal(eweda.indexOf(30, list), 3);
  });
  it("returns -1 if the object is not in the list", function() {
    var list = [0, 10, 20, 30];
    assert.equal(eweda.indexOf(40, list), -1);
  });
});

describe('lastIndexOf', function() {
  it("returns a number indicating an object's last position in a list", function() {
    var list = [0, 10, 20, 30, 0, 10, 20, 30, 0, 10];
    assert.equal(eweda.lastIndexOf(30, list), 7);
  });
  it("returns -1 if the object is not in the list", function() {
    var list = [0, 10, 20, 30];
    assert.equal(eweda.lastIndexOf(40, list), -1);
  });

});

describe("join", function() {
  it("concatenates a list's elements to a string, with an seperator string between elements", function() {
    var list = [1,2,3,4];
    assert.equal(eweda.join("~", list), "1~2~3~4");
  });
});

describe("splice", function() {
  it("removes specified elements from a list", function() {
    var list = [0,1,2,3,4,5,6,7,8,9];
    assert.deepEqual(eweda.splice(3, 2, list), [0,1,2,5,6,7,8,9]);
  });
});


