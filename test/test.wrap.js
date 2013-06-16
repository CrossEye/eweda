var assert = require('assert');
var Lib = require('./../eweda');

describe('wrap', function() {
    var wrap = Lib.wrap;

    it('surrounds the invocation of one function with another', function() {
        var greet = function(name) {return 'Hello ' + name;};
        var extendedGreet = wrap(greet, function(gr, name) {
            return gr('my dear ' + name) + ', how are you?';
        });
        assert.equal(greet('joe'), 'Hello joe');
        assert.equal(extendedGreet('joe'), 'Hello my dear joe, how are you?');
    });
});
