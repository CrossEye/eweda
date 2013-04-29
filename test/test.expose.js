var assert = require('assert');
var eweda = require('./../eweda');

describe('eweda', function() {
    it('can be exposed on arbitrary object', function() {
        var ramda = {};
        eweda.expose(ramda);
        var times2 = function(x) {return x * 2;};
        assert.deepEqual(ramda.map(times2, [1, 2, 3, 4]), [2, 4, 6, 8]);
    });
});

