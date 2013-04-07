var assert = require("assert");
var eweda = require("./../eweda");

describe('foldl', function() {
   it('should fold simple functions over arrays', function() {
       var fn = function(a, b) {return a + b;}
       assert.equal(10, eweda.foldl(fn, 0, [1, 2, 3, 4]));
   });
});