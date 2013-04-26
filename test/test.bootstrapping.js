var assert = require('assert');
var eweda = require('./../eweda');

describe('eweda bootstrapping', function() {
    it('runs with our bootstrapped configuration', function() {
        var headCtr = 0, tailCtr = 0;
        var ramda = eweda(function() {
            var EMPTY = [];
            return {
                EMPTY: EMPTY,
                isEmpty: function(arr) {return !arr || !arr.length;},
                prepend: function(el, arr) {return [el].concat(arr);},
                head: function(arr) {
                    headCtr++;
                    arr = arr || EMPTY;
                    return (arr.length) ? arr[0] : EMPTY;
                },
                tail: function(arr) {
                    tailCtr++;
                    arr = arr || EMPTY;
                    return (arr.length > 1) ? arr.slice(1) : EMPTY;
                },
                isAtom: function(x) {return (x !== null) && (x !== undefined) && Object.prototype.toString.call(x) !== "[object Array]";}
            };
        }());
        var map = ramda.map;
        var times2 = function(x) {return x * 2;};
        assert.deepEqual(map(times2, [1, 2, 3, 4]), [2, 4, 6, 8]);
        assert(headCtr > 0);
        assert(tailCtr > 0);
    });

});

