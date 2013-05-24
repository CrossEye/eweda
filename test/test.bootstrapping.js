var assert = require('assert');
var eweda = require('./../eweda');

describe('simple bootstrapping', function() {
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

    it('uses optional core functions of bootstrap configuration', function() {
        var ramda = eweda(bootstrap);
        var test = ['a', 'b', 'c', 'd'];
        var size2 = ramda.size;
        sizeCtr = 0;
        assert.equal(size2(test), 4);
        assert(sizeCtr > 0);
    });
 });


describe('complete bootstrapping', function() {
    var cons = function(x, y) {
        var fn = function(pick) {
            return pick(x, y);
        };
        fn.toString = function() {
            return "(" + asArray(this).join(" ") + ")";
        };
        fn.pair = true; // to support atom? function
        return fn;
    };

    var car = function(fn) {
        return fn(function(x, y) { return x; });
    };

    var cdr = function(fn) {
        return fn(function(x, y) { return y; });
    };

    var atom = function(x) {
        return (x !== null) && (x !== undefined) && !x.pair;
    };

    var list = function() {
        var args = [].slice.call(arguments);
        return (args.length === 0) ? null : cons(args.shift(), list.apply(null, args));
    };
    var asArray = function(list) {
        var arr = arguments[1] || [];
        return (list && car(list)) ? (arr.push(car(list)), asArray(cdr(list), arr)) : arr;
    };
    var equal = function(l, r) {
        return  (l === null && r === null) ||
                (l === undefined && r === undefined) ||
                (atom(l) && atom(r) && l == r) ||
                (l.pair && r.pair && equal(car(l), car(r)) && equal(cdr(l), cdr(r)));
    };

    var ramda = eweda({
        EMPTY: null,
        isEmpty: function(list) {return list == null;},
        prepend: cons,
        head: car,
        tail: cdr,
        isAtom: atom
    });



    describe('all', function() {
        var all = ramda.all;
        var even = function(n) {return n % 2 === 0;};
        var T = function() {return true;};

        it('returns true if all elements satisfy the predicate', function() {
            assert.equal(all(even, list(2, 4, 6, 8, 10, 12)), true);
        });

        it('returns false if any element fails to satisfy the predicate', function() {
            assert.equal(all(even, list(2, 4, 6, 8, 9, 10)), false);
        });

        it('returns true for an empty list', function() {
            assert.equal(all(T, null), true);
        });

        it('should short-circuit on first false value', function() {
            var count = 0;
            var test = function(n) {count++; return even(n);};
            var result = all(test, list(2, 4, 6, 7, 8, 10));
            assert(!result);
            assert.equal(count, 4);
        });

        it('should be aliased by `every`', function() {
            assert.equal(ramda.every(even, list(2, 4, 6, 8, 10)), true);
            assert.strictEqual(ramda.every, all);
        });
    });

    describe("any", function() {
        var any = ramda.any;
        var odd = function(n) {return n % 2 === 1;};
        var T = function() {return true;};

        it('returns true if any element satisfies the predicate', function() {
            assert.equal(any(odd, list(2, 4, 6, 8, 10, 11, 12)), true);
        });

        it('returns false if all elements fails to satisfy the predicate', function() {
            assert.equal(any(odd, list(2, 4, 6, 8, 10, 12)), false);
        });

        it('returns false for an empty list', function() {
            assert.equal(any(T, null), false);
        });

        it('should short-circuit on first true value', function() {
            var count = 0;
            var test = function(n) {count++; return odd(n);};
            var result = any(test, list(2, 4, 6, 7, 8, 10));
            assert(result);
            assert.equal(count, 4);
        });

        it('should be aliased by `some`', function() {
            assert.equal(ramda.some(odd, list(2, 4, 6, 8, 10, 11, 12)), true);
            assert.strictEqual(ramda.some, any);
        });
    });

    describe("contains", function() {
        var contains = ramda.contains;
        it("returns true if an element is in a list", function() {
            assert.equal(contains(7, list(1, 2, 3, 9, 8, 7, 100, 200, 300)), true);
        });

        it("returns false if an element is not in a list", function() {
            assert.equal(contains(99, list(1, 2, 3, 9, 8, 7, 100, 200, 300)), false);
        });

        it("returns false for the empty list", function() {
            assert.equal(contains(1, null), false);
        });
    });


    describe('uniq', function() {
        var uniq = ramda.uniq;

        it('returns a set from any array (i.e. purges duplicate elements)', function() {
            var lst = list(1, 2, 3, 1, 2, 3, 1, 2, 3);
            assert(equal(uniq(lst), list(1, 2, 3)));
        });

        it('returns an empty list for an empty list', function() {
            assert(equal(uniq(null), null));
        });

    });

    describe('isEmpty', function() {
        var isEmpty = ramda.isEmpty;

        it('returns true if the list is empty', function() {
            assert.equal(isEmpty(null), true);
        });

        it('returns false if the list is not empty', function() {
            assert.equal(isEmpty(list('')), false);
        });
    });

    describe('prepend', function() {
        var prepend = ramda.prepend;

        it('adds the element to the beginning of the list', function() {
            assert(equal(prepend('x', list('y', 'z')), list('x', 'y', 'z')));
        });
    });

    describe('append', function() {
        var append = ramda.append;

        it('adds the element to the end of the list', function() {
            assert(equal(append('z', list('x', 'y')), list('x', 'y', 'z')));
        });
    });

    describe('merge', function() {
        var merge = ramda.merge;

        it('adds combines the elements of the two lists', function() {
            assert(equal(merge(list('a', 'b'), list('c', 'd')), list('a', 'b', 'c', 'd')));
        });
    });

    describe('head', function() {
        var head = ramda.head;

        it('returns the first element of a list', function() {
            assert.equal(head(list('a', 'b', 'c', 'd')), 'a');
        });
    });

    describe('tail', function() {
        var tail = ramda.tail;

        it('returns a new list containing all the elements after the first element of a list', function() {
            assert(equal(list('b', 'c', 'd'), tail(list('a', 'b', 'c', 'd'))));
        });
    });

    describe('size', function() {
        var size = ramda.size;

        it('counts the elements of a list', function() {
            assert.equal(size(list('a', 'b', 'c', 'd')), 4);
        });
    });

    describe('filter', function() {
        var filter = ramda.filter;
        var even = function(x) {return !(x % 2);};

        it('should reduce an array to those matching a filter', function() {
            assert(equal(filter(even, list(1, 2, 3, 4, 5)), list(2, 4)));
        });

        it('should be automatically curried', function() {
            var onlyEven = filter(even);
            assert(equal(onlyEven(list(1, 2, 3,4, 5, 6, 7)), list(2, 4, 6)));
        });
    });

    describe('reject', function() {
        var reject = ramda.reject;
        var even = function(x) {return !(x % 2);};

        it('should reduce an array to those not matching a filter', function() {
            assert(equal(reject(even, list(1, 2, 3, 4, 5)), list(1, 3, 5)));
        });

        it('should be automatically curried', function() {
            var odd = reject(even);
            assert(equal(odd(list(1, 2, 3,4, 5, 6, 7)), list(1, 3, 5, 7)));
        });
    });

//    describe('take', function() {
//        var take = ramda.take;
//
//        it('should take only the first `n` elements from a list', function() {
//            assert(equal(take(3, list('a', 'b', 'c', 'd', 'e', 'f', 'g'), list('a', 'b', 'c'))));
//        });
//
//        it('should be automatically curried', function() {
//            var take3 = take(3);
//            assert(equal(take3(list('a', 'b', 'c', 'd', 'e', 'f', 'g')), list('a', 'b', 'c')));
//            assert(equal(take3(list('w', 'x', 'y', 'z'), list('w', 'x', 'y'))));
//
//        });
//    });
//
//    describe('skip', function() {
//        var skip = ramda.skip;
//
//        it('should skip the first `n` elements from a list, returning the remainder', function() {
//            assert(equal(skip(3, list('a', 'b', 'c', 'd', 'e', 'f', 'g')), list('d', 'e', 'f', 'g')));
//        });
//
//        it('should be automatically curried', function() {
//            var skip2 = skip(2);
//            assert(equal(skip2(list('a', 'b', 'c', 'd', 'e')), list('c', 'd', 'e')));
//            assert(equal(skip2(list('x', 'y', 'z')), list('z')));
//        });
//
//        it('should be aliased by `drop`', function() {
//            assert(equal(ramda.drop(1, list('a', 'b', 'c')), list('b', 'c')));
//            assert.strictEqual(ramda.drop, skip);
//        });
//    });

    describe('foldl', function() {
        var foldl = ramda.foldl;
        var add = function(a, b) {return a + b;};
        var mult = function(a, b) {return a * b;};

        it('should fold simple functions over arrays with the supplied accumulator', function() {
            assert.equal(foldl(add, 0, list(1, 2, 3, 4)), 10);
            assert.equal(foldl(mult, 1, list(1, 2, 3, 4)), 24);
        });

        it('should return the accumulator for an empty array', function() {
            assert.equal(foldl(add, 0, null), 0);
            assert.equal(foldl(mult, 1, null), 1);
        });

        it('should be automatically curried', function() {
            var sum = foldl(add, 0);
            assert.equal(sum(list(1, 2, 3, 4)), 10);
        });

        it('should be aliased by `reduce`', function() {
            assert.equal(ramda.reduce(add, 0, list(1, 2, 3, 4)), 10);
            assert.strictEqual(ramda.reduce, foldl);
        });
    });

    describe('foldl1', function() {
        var foldl1 = ramda.foldl1;
        var add = function(a, b) {return a + b;};
        var mult = function(a, b) {return a * b;};

        it('should fold simple functions over lists without an accumulator', function() {
            assert.equal(foldl1(add, list(1, 2, 3, 4)), 10);
            assert.equal(foldl1(mult, list(1, 2, 3, 4)), 24);
        });

        it('should throw an error with an empty list', function() {
            assert.throws(function() {foldl1(add, null)}, Error);
        });

        it('should be automatically curried', function() {
            var sum = foldl1(add);
            assert.equal(sum(list(1, 2, 3, 4)), 10);
        });
    });

    describe('foldr', function() {
        var foldr = ramda.foldr;
        var avg = function(a, b) {return (a + b) / 2;};

        it('should fold simple functions over arrays with the supplied accumulator', function() {
            assert.equal(foldr(avg, 54, list(12, 4, 10, 6)), 12);
        });

        it('should return the accumulator for an empty array', function() {
            assert.equal(foldr(avg, 0, null), 0);
        });

        it('should be automatically curried', function() {
            var something = foldr(avg, 54);
            assert.equal(something(list(12, 4, 10, 6)), 12);
        });

        it('should be aliased by `reduceRight`', function() {
            assert.equal(ramda.reduceRight(avg, 54, list(12, 4, 10, 6)), 12);
            assert.strictEqual(ramda.reduceRight, foldr);
        });
    });

    describe('foldr1', function() {
        var foldr1 = ramda.foldr1;
        var avg = function(a, b) {return (a + b) / 2;};

        it('should fold simple functions over arrays without an accumulator', function() {
            assert.equal(foldr1(avg,  list(12, 4, 10, 6, 54)), 12);
        });

        it('should throw an error with an empty array', function() {
            assert.throws(function() {foldr1(avg, null)}, Error);
        });

        it('should be automatically curried', function() {
            var something = foldr1(avg);
            assert.equal(something(list(12, 4, 10, 6, 54)), 12);
        });
    });

    describe('map', function() {
        var map = ramda.map;
        var times2 = function(x) {return x * 2;};
        var add1 = function(x) {return x + 1;};

        it('should map simple functions over arrays', function() {
            assert(equal(map(times2, list(1, 2, 3, 4)), list(2, 4, 6, 8)));
        });

        it('should be automatically curried', function() {
            var inc = map(add1);
            assert(equal(inc(list(1, 2, 3)), list(2, 3, 4)));
        });
    });

//    describe('xprod', function() {
//        var xprod = ramda.xprod;
//        var a = list(1, 2), b = list('a', 'b', 'c');
//
//        it('should create the collection of all cross-product pairs of its parameters', function() {
//            assert(equal(xprod(a, b), list(list(1, 'a'), list(1, 'b'), list(1, 'c'), list(2, 'a'), list(2, 'b'), list(2, 'c'))));
//        });
//
//        it('should be automatically curried', function() {
//            var something = xprod(b);
//            assert(equal(something(a), list(list('a', 1), list('a', 2), list('b', 1), list('b', 2), list('c', 1), list('c', 2))));
//        });
//    });

    describe('xprodWith', function() {
        var xprodWith = ramda.xprodWith;
        var concat = function(x, y) {return '' + x + y;};
        var a = list(1, 2), b = list('a', 'b', 'c');

        it('should create the collection of all cross-product pairs of its parameters', function() {
            assert(equal(xprodWith(concat, a, b), list('1a', '1b', '1c', '2a', '2b', '2c')));
        });

        it('should be automatically curried', function() {
            var f1 = xprodWith(concat);
            assert(equal(f1(b, a), list('a1', 'a2', 'b1', 'b2', 'c1', 'c2')));
            var f2 = f1(a);
            assert(equal(f2(b), list('1a', '1b', '1c', '2a', '2b', '2c')));
        });
    });

    describe('range', function() {
        var range = ramda.range;

        it('should return list of numbers', function() {
            assert(equal(range(0, 5), list(0, 1, 2, 3, 4)));
            assert(equal(range(4, 7), list(4, 5, 6)));
        });

        it('should return the empty list if the first parameter is not larger than the second', function() {
            assert(equal(range(7, 3), null));
            assert(equal(range(5, 5), null));
        });
    });

    describe('reverse', function() {
        var reverse = ramda.reverse;

        it('should reverse arrays', function() {
            assert(equal(reverse(list(1, 2, 3, 4)), list(4, 3, 2, 1)));
        });

        it('should return the empty list to itself', function() {
            assert(equal(reverse(null), null));
        });
    });

    describe('zipWith', function() {
        var zipWith = ramda.zipWith;
        var a = list(1, 2, 3), b = list(100, 200, 300), c = list(10, 20, 30, 40, 50, 60);
        var add = function(a, b) { return a + b; };
        var x = function(a, b) { return a * b; };
        var s = function(a, b) { return a + ' cow ' + b; };
        it("returns a list created by applying its passed-in function pair-wise on its passed in lists", function() {
            assert(equal(zipWith(add, a, b), list(101, 202, 303)));
            assert(equal(zipWith(x, a, b), list(100, 400, 900)));
            assert(equal(zipWith(s, a, b), list('1 cow 100', '2 cow 200', '3 cow 300')));
        });

        it("returns a list whose length is equal to the shorter of its input lists", function() {
            assert.equal(zipWith(add, a, c).length, a.length);
        })
    });

//    describe('zip', function() {
//        it("returns an array of 'tuples'", function() {
//            var zip = ramda.zip;
//            var a = list(1, 2, 3), b = list(100, 200, 300);
//            assert(equal(zip(a, b), list(list(1, 100), list(2, 200), list(3, 300))));
//        });
//    });
});
