var assert = require('assert');
var Lib = require('./../eweda');

describe('bootstrapping of library', function() {
    var cons = function(x, y) {
        var fn = function(pick) {
            return pick(x, y);
        };
        fn.toString =function() {
            if (isEmpty(this)) {return "()";}
            var h = car(this), t = cdr(this), nested = arguments.length > 0;
            return (nested ? "" : "(") + (pair(h) ? h.toString() : h) + (isEmpty(t) ? "" : " " + t.toString(nested)) + (nested ? "" : ")");
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

    var makeList = function() {
        var args = [].slice.call(arguments);
        return (args.length === 0) ? null : cons(args.shift(), makeList.apply(null, args));
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

    var sheepda = Lib({
        EMPTY: null,
        isEmpty: function(list) {return list == null;},
        prepend: cons,
        head: car,
        tail: cdr,
        isAtom: atom
    });



    describe('all', function() {
        var all = sheepda.all;
        var even = function(n) {return n % 2 === 0;};
        var T = function() {return true;};

        it('returns true if all elements satisfy the predicate', function() {
            assert.equal(all(even, makeList(2, 4, 6, 8, 10, 12)), true);
        });

        it('returns false if any element fails to satisfy the predicate', function() {
            assert.equal(all(even, makeList(2, 4, 6, 8, 9, 10)), false);
        });

        it('returns true for an empty list', function() {
            assert.equal(all(T, null), true);
        });

        it('should short-circuit on first false value', function() {
            var count = 0;
            var test = function(n) {count++; return even(n);};
            var result = all(test, makeList(2, 4, 6, 7, 8, 10));
            assert(!result);
            assert.equal(count, 4);
        });

        it('should be aliased by `every`', function() {
            assert.equal(sheepda.every(even, makeList(2, 4, 6, 8, 10)), true);
            assert.strictEqual(sheepda.every, all);
        });
    });

    describe("any", function() {
        var any = sheepda.any;
        var odd = function(n) {return n % 2 === 1;};
        var T = function() {return true;};

        it('returns true if any element satisfies the predicate', function() {
            assert.equal(any(odd, makeList(2, 4, 6, 8, 10, 11, 12)), true);
        });

        it('returns false if all elements fails to satisfy the predicate', function() {
            assert.equal(any(odd, makeList(2, 4, 6, 8, 10, 12)), false);
        });

        it('returns false for an empty list', function() {
            assert.equal(any(T, null), false);
        });

        it('should short-circuit on first true value', function() {
            var count = 0;
            var test = function(n) {count++; return odd(n);};
            var result = any(test, makeList(2, 4, 6, 7, 8, 10));
            assert(result);
            assert.equal(count, 4);
        });

        it('should be aliased by `some`', function() {
            assert.equal(sheepda.some(odd, makeList(2, 4, 6, 8, 10, 11, 12)), true);
            assert.strictEqual(sheepda.some, any);
        });
    });

    describe("contains", function() {
        var contains = sheepda.contains;
        it("returns true if an element is in a list", function() {
            assert.equal(contains(7, makeList(1, 2, 3, 9, 8, 7, 100, 200, 300)), true);
        });

        it("returns false if an element is not in a list", function() {
            assert.equal(contains(99, makeList(1, 2, 3, 9, 8, 7, 100, 200, 300)), false);
        });

        it("returns false for the empty list", function() {
            assert.equal(contains(1, null), false);
        });
    });


    describe('uniq', function() {
        var uniq = sheepda.uniq;

        it('returns a set from any array (i.e. purges duplicate elements)', function() {
            var lst = makeList(1, 2, 3, 1, 2, 3, 1, 2, 3);
            assert(equal(uniq(lst), makeList(1, 2, 3)));
        });

        it('returns an empty list for an empty list', function() {
            assert(equal(uniq(null), null));
        });

    });

    describe('isEmpty', function() {
        var isEmpty = sheepda.isEmpty;

        it('returns true if the list is empty', function() {
            assert.equal(isEmpty(null), true);
        });

        it('returns false if the list is not empty', function() {
            assert.equal(isEmpty(makeList('')), false);
        });
    });

    describe('prepend', function() {
        var prepend = sheepda.prepend;

        it('adds the element to the beginning of the list', function() {
            assert(equal(prepend('x', makeList('y', 'z')), makeList('x', 'y', 'z')));
        });
    });

    describe('append', function() {
        var append = sheepda.append;

        it('adds the element to the end of the list', function() {
            assert(equal(append('z', makeList('x', 'y')), makeList('x', 'y', 'z')));
        });
    });

    describe('merge', function() {
        var merge = sheepda.merge;

        it('adds combines the elements of the two lists', function() {
            assert(equal(merge(makeList('a', 'b'), makeList('c', 'd')), makeList('a', 'b', 'c', 'd')));
        });
    });

    describe('head', function() {
        var head = sheepda.head;

        it('returns the first element of a list', function() {
            assert.equal(head(makeList('a', 'b', 'c', 'd')), 'a');
        });
    });

    describe('tail', function() {
        var tail = sheepda.tail;

        it('returns a new list containing all the elements after the first element of a list', function() {
            assert(equal(makeList('b', 'c', 'd'), tail(makeList('a', 'b', 'c', 'd'))));
        });
    });

    describe('size', function() {
        var size = sheepda.size;

        it('counts the elements of a list', function() {
            assert.equal(size(makeList('a', 'b', 'c', 'd')), 4);
        });
    });

    describe('filter', function() {
        var filter = sheepda.filter;
        var even = function(x) {return !(x % 2);};

        it('should reduce an array to those matching a filter', function() {
            assert(equal(filter(even, makeList(1, 2, 3, 4, 5)), makeList(2, 4)));
        });

        it('should be automatically curried', function() {
            var onlyEven = filter(even);
            assert(equal(onlyEven(makeList(1, 2, 3,4, 5, 6, 7)), makeList(2, 4, 6)));
        });
    });

    describe('reject', function() {
        var reject = sheepda.reject;
        var even = function(x) {return !(x % 2);};

        it('should reduce an array to those not matching a filter', function() {
            assert(equal(reject(even, makeList(1, 2, 3, 4, 5)), makeList(1, 3, 5)));
        });

        it('should be automatically curried', function() {
            var odd = reject(even);
            assert(equal(odd(makeList(1, 2, 3,4, 5, 6, 7)), makeList(1, 3, 5, 7)));
        });
    });

    describe('takeWhile', function() {
        var takeWhile = sheepda.takeWhile;

        it('should continue taking elements while the function reports `true`', function() {
            assert(equal(takeWhile(function(x) {return x != 5;}, makeList(1, 3, 5, 7, 9)), makeList(1, 3)));
        });

        it('should be automatically curried', function() {
            var takeUntil7 = takeWhile(function(x) {return x != 7;});
            assert(equal(takeUntil7(makeList(1, 3, 5, 7, 9)), makeList(1, 3, 5)));
            assert(equal(takeUntil7(makeList(2, 4, 6, 8, 10)), makeList(2, 4, 6, 8, 10)));
        });
    });

    describe('take', function() {
        var take = sheepda.take;

        it('should take only the first `n` elements from a list', function() {
            assert(equal(take(3, makeList('a', 'b', 'c', 'd', 'e', 'f', 'g')), makeList('a', 'b', 'c')));
        });

        it('should be automatically curried', function() {
            var take3 = take(3);
            assert(equal(take3(makeList('a', 'b', 'c', 'd', 'e', 'f', 'g')), makeList('a', 'b', 'c')));
            assert(equal(take3(makeList('w', 'x', 'y', 'z')), makeList('w', 'x', 'y')));

        });
    });

    describe('skipUntil', function() {
        var skipUntil = sheepda.skipUntil;

        it('should continue taking elements while the function reports `true`', function() {
            assert(equal(skipUntil(function(x) {return x === 5;}, makeList(1, 3, 5, 7, 9)), makeList(5, 7, 9)));
        });

        it('should be automatically curried', function() {
            var skipUntil7 = skipUntil(function(x) {return x === 7;});
            assert(equal(skipUntil7(makeList(1, 3, 5, 7, 9)), makeList(7, 9)));
            assert(equal(skipUntil7(makeList(2, 4, 6, 8, 10)), makeList()));
        });
    });

    describe('skip', function() {
        var skip = sheepda.skip;

        it('should skip the first `n` elements from a list, returning the remainder', function() {
            assert(equal(skip(3, makeList('a', 'b', 'c', 'd', 'e', 'f', 'g')), makeList('d', 'e', 'f', 'g')));
        });

        it('should be automatically curried', function() {
            var skip2 = skip(2);
            assert(equal(skip2(makeList('a', 'b', 'c', 'd', 'e')), makeList('c', 'd', 'e')));
            assert(equal(skip2(makeList('x', 'y', 'z')), makeList('z')));
        });

        it('should be aliased by `drop`', function() {
            assert(equal(sheepda.drop(1, makeList('a', 'b', 'c')), makeList('b', 'c')));
            assert.strictEqual(sheepda.drop, skip);
        });
    });

    describe('find', function() {
        var find = sheepda.find;
        var obj1 = {x: 100};
        var obj2 = {x: 200};
        var a = makeList(11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0);
        var even = function(x) { return x % 2 === 0; };
        var gt100 = function(x) { return x > 100; };
        var isStr = function(x) { return typeof x === "string"; };
        var xGt100 = function(o) { return o && o.x > 100; };

        it("returns the first element that satisfies the predicate", function() {
            assert.equal(find(even, a), 10);
            assert.equal(find(gt100, a), 200);
            assert.equal(find(isStr, a), 'cow');
            assert.equal(find(xGt100, a), obj2);
        });

    });

    describe('foldl', function() {
        var foldl = sheepda.foldl;
        var add = function(a, b) {return a + b;};
        var mult = function(a, b) {return a * b;};

        it('should fold simple functions over arrays with the supplied accumulator', function() {
            assert.equal(foldl(add, 0, makeList(1, 2, 3, 4)), 10);
            assert.equal(foldl(mult, 1, makeList(1, 2, 3, 4)), 24);
        });

        it('should return the accumulator for an empty array', function() {
            assert.equal(foldl(add, 0, null), 0);
            assert.equal(foldl(mult, 1, null), 1);
        });

        it('should be automatically curried', function() {
            var sum = foldl(add, 0);
            assert.equal(sum(makeList(1, 2, 3, 4)), 10);
        });

        it('should be aliased by `reduce`', function() {
            assert.equal(sheepda.reduce(add, 0, makeList(1, 2, 3, 4)), 10);
            assert.strictEqual(sheepda.reduce, foldl);
        });
    });

    describe('foldl1', function() {
        var foldl1 = sheepda.foldl1;
        var add = function(a, b) {return a + b;};
        var mult = function(a, b) {return a * b;};

        it('should fold simple functions over lists without an accumulator', function() {
            assert.equal(foldl1(add, makeList(1, 2, 3, 4)), 10);
            assert.equal(foldl1(mult, makeList(1, 2, 3, 4)), 24);
        });

        it('should throw an error with an empty list', function() {
            assert.throws(function() {foldl1(add, null)}, Error);
        });

        it('should be automatically curried', function() {
            var sum = foldl1(add);
            assert.equal(sum(makeList(1, 2, 3, 4)), 10);
        });
    });

    describe('foldr', function() {
        var foldr = sheepda.foldr;
        var avg = function(a, b) {return (a + b) / 2;};

        it('should fold simple functions over arrays with the supplied accumulator', function() {
            assert.equal(foldr(avg, 54, makeList(12, 4, 10, 6)), 12);
        });

        it('should return the accumulator for an empty array', function() {
            assert.equal(foldr(avg, 0, null), 0);
        });

        it('should be automatically curried', function() {
            var something = foldr(avg, 54);
            assert.equal(something(makeList(12, 4, 10, 6)), 12);
        });

        it('should be aliased by `reduceRight`', function() {
            assert.equal(sheepda.reduceRight(avg, 54, makeList(12, 4, 10, 6)), 12);
            assert.strictEqual(sheepda.reduceRight, foldr);
        });
    });

    describe('foldr1', function() {
        var foldr1 = sheepda.foldr1;
        var avg = function(a, b) {return (a + b) / 2;};

        it('should fold simple functions over arrays without an accumulator', function() {
            assert.equal(foldr1(avg,  makeList(12, 4, 10, 6, 54)), 12);
        });

        it('should throw an error with an empty array', function() {
            assert.throws(function() {foldr1(avg, null)}, Error);
        });

        it('should be automatically curried', function() {
            var something = foldr1(avg);
            assert.equal(something(makeList(12, 4, 10, 6, 54)), 12);
        });
    });

    describe('map', function() {
        var map = sheepda.map;
        var times2 = function(x) {return x * 2;};
        var add1 = function(x) {return x + 1;};

        it('should map simple functions over arrays', function() {
            assert(equal(map(times2, makeList(1, 2, 3, 4)), makeList(2, 4, 6, 8)));
        });

        it('should be automatically curried', function() {
            var inc = map(add1);
            assert(equal(inc(makeList(1, 2, 3)), makeList(2, 3, 4)));
        });
    });

    describe('pluck', function() {
        var pluck = sheepda.pluck;
        var people = makeList({name: 'Fred', age: 23}, {name: 'Wilma', age: 21} , {name: 'Pebbles', age: 2});

        it('should return a function that maps the appropriate property over a list', function() {
            var nm = pluck('name');
            assert.equal(typeof nm, 'function');
            assert(equal(nm(people), makeList('Fred', 'Wilma', 'Pebbles')));
        });
    });

    describe('xprod', function() {
        var xprod = sheepda.xprod;
        var a = makeList(1, 2), b = makeList('a', 'b', 'c');

        it('should create the collection of all cross-product pairs of its parameters', function() {
            assert(equal(xprod(a, b), makeList(cons(1, 'a'), cons(1, 'b'), cons(1, 'c'), cons(2, 'a'), cons(2, 'b'), cons(2, 'c'))));
        });

        it('should be automatically curried', function() {
            var something = xprod(b);
            assert(equal(something(a), makeList(cons('a', 1), cons('a', 2), cons('b', 1), cons('b', 2), cons('c', 1), cons('c', 2))));
        });
    });

    describe('xprodWith', function() {
        var xprodWith = sheepda.xprodWith;
        var concat = function(x, y) {return '' + x + y;};
        var a = makeList(1, 2), b = makeList('a', 'b', 'c');

        it('should create the collection of all cross-product pairs of its parameters', function() {
            assert(equal(xprodWith(concat, a, b), makeList('1a', '1b', '1c', '2a', '2b', '2c')));
        });

        it('should be automatically curried', function() {
            var f1 = xprodWith(concat);
            assert(equal(f1(b, a), makeList('a1', 'a2', 'b1', 'b2', 'c1', 'c2')));
            var f2 = f1(a);
            assert(equal(f2(b), makeList('1a', '1b', '1c', '2a', '2b', '2c')));
        });
    });

    describe('range', function() {
        var range = sheepda.range;

        it('should return list of numbers', function() {
            assert(equal(range(0, 5), makeList(0, 1, 2, 3, 4)));
            assert(equal(range(4, 7), makeList(4, 5, 6)));
        });

        it('should return the empty list if the first parameter is not larger than the second', function() {
            assert(equal(range(7, 3), null));
            assert(equal(range(5, 5), null));
        });
    });

    describe('reverse', function() {
        var reverse = sheepda.reverse;

        it('should reverse arrays', function() {
            assert(equal(reverse(makeList(1, 2, 3, 4)), makeList(4, 3, 2, 1)));
        });

        it('should return the empty list to itself', function() {
            assert(equal(reverse(null), null));
        });
    });

    describe('zipWith', function() {
        var zipWith = sheepda.zipWith;
        var a = makeList(1, 2, 3), b = makeList(100, 200, 300), c = makeList(10, 20, 30, 40, 50, 60);
        var add = function(a, b) { return a + b; };
        var x = function(a, b) { return a * b; };
        var s = function(a, b) { return a + ' cow ' + b; };
        it("returns a list created by applying its passed-in function pair-wise on its passed in lists", function() {
            assert(equal(zipWith(add, a, b), makeList(101, 202, 303)));
            assert(equal(zipWith(x, a, b), makeList(100, 400, 900)));
            assert(equal(zipWith(s, a, b), makeList('1 cow 100', '2 cow 200', '3 cow 300')));
        });

        it("returns a list whose length is equal to the shorter of its input lists", function() {
            assert.equal(zipWith(add, a, c).length, a.length);
        })
    });

    describe('zip', function() {
        it("returns an array of 'tuples'", function() {
            var zip = sheepda.zip;
            var a = makeList(1, 2, 3), b = makeList(100, 200, 300);
            assert(equal(zip(a, b), makeList(cons(1, 100), cons(2, 200), cons(3, 300))));
        });
    });
});

describe('bootstrapping capabilities', function() {
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
        var ramda = Lib(bootstrap);
        var map2 = ramda.map;
        var times2 = function(x) {return x * 2;};
        assert.deepEqual(map2(times2, [1, 2, 3, 4]), [2, 4, 6, 8]);
        assert.equal(storedHeadCtr, headCtr);
        assert.equal(storedTailCtr, tailCtr);
    });

    it('uses optional core functions of bootstrap configuration', function() {
        var ramda = Lib(bootstrap);
        var test = ['a', 'b', 'c', 'd'];
        var size2 = ramda.size;
        sizeCtr = 0;
        assert.equal(size2(test), 4);
        assert(sizeCtr > 0);
    });
 });


