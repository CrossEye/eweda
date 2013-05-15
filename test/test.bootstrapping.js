var assert = require('assert');
var eweda = require('./../eweda');

describe('eweda bootstrapping', function() {
    var headCtr = 0, tailCtr = 0, sizeCtr = 0;
    var bootstrap = (function() {
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
            isAtom: function(x) {return (x !== null) && (x !== undefined) && Object.prototype.toString.call(x) !== "[object Array]";},
            size: function(arr) {
                sizeCtr++;
                return arr.length;
            }
        };
    }());
    it('runs with copy of bootstrap configuration, without affecting original version', function() {
        var headCtr = 0, storedHeadCtr = 0, tailCtr = 0, storedTailCtr = 0;
        var ramda = eweda(bootstrap);
        var map2 = ramda.map;
        var times2 = function(x) {return x * 2;};
        assert.deepEqual(map2(times2, [1, 2, 3, 4]), [2, 4, 6, 8]);
        assert.equal(storedHeadCtr, headCtr);
        assert.equal(storedTailCtr, tailCtr);
    });

    it('uses optional core functiosn of bootstrap configuration', function() {
        var ramda = eweda(bootstrap);
        var test = ['a', 'b', 'c', 'd'];
        var size2 = ramda.size;
        sizeCtr = 0;
        assert.equal(size2(test), 4);
        assert(sizeCtr > 0);
    });
 });
