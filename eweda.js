(function (root, factory) {if (typeof exports === 'object') {module.exports = factory();} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.eweda = factory();}}(this, function () { // see https://github.com/umdjs/umd/blob/master/returnExports.js

    var E = {};

    var EMPTY = [];
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var isArray = function(val) {return toString.call(val) === "[object Array]";};
    var alias = function(oldName, newName) {
        E[newName] = E[oldName];
    };

    var _ = function(fn) {
        var arity = fn.length;
        var f = function(args) {
            return function () {
                var newArgs = args.concat(slice.call(arguments, 0));
                if (newArgs.length >= arity) {
                    return fn.apply(this, newArgs);
                }
                else {return f(newArgs);}
            };
        };
        return f(EMPTY);
    };

    var isEmpty = function(list) {
        return !list || !list.length;
    };

    // should prepend, head, tail, isAtom, etc be exposed?

    var prepend = E.prepend = function(el, arr) {
        return [el].concat(arr);
    };
    alias("prepend", "cons");

    var head = E.head = function(arr) {
        arr = arr || EMPTY;
        return (arr.length) ? arr[0] : EMPTY;
    };
    alias("head", "car");

    var tail = E.tail = function(arr) {
        arr = arr || EMPTY;
        return (arr.length > 1) ? arr.slice(1) : EMPTY;
    };
    alias("tail", "cdr");

    var isAtom = E.isAtom = function(x) {
        return (x !== null) && (x !== undefined) && !isArray(x);
    };

    var and = E.and = _(function (a, b) {
        return !!(a && b);
    });

    var or = E.or = _(function (a, b) {
        return !!(a || b);
    });

    var not = E.not = function (a) {
        return !a;
    };

    var eq = E.eq = _(function(a, b) {
        return a === b;
    });

    // Still not particularly happy with the names `andFn`, `orFn`, `notFn`, but at least Oliver Twist can pronounce one...

    var andFn = E.andFn = _(function(f, g) { // TODO: arity?
       return function() {return !!(f.apply(this, arguments) && g.apply(this, arguments));}
    });

    var orFn = E.orFn = _(function(f, g) { // TODO: arity?
       return function() {return !!(f.apply(this, arguments) || g.apply(this, arguments));}
    });

    var notFn = E.notFn = function (f) {
        return function() {return !f.apply(this, arguments)};
    };

    var foldl = E.foldl = _(function(fn, acc, arr) {
        return (isEmpty(arr)) ? acc : foldl(fn, fn(acc, head(arr)), tail(arr));
    });
    alias("foldl", "reduce");

    var foldl1 = E.foldl1 = _(function (fn, arr) {
        if (isEmpty(arr)) {
            throw new Error("foldl1 does not work on empty lists");
        }
        return foldl(fn, head(arr), tail(arr));
    });

    var foldr = E.foldr =_(function(fn, acc, arr) {
        return (isEmpty(arr)) ? acc : fn(head(arr), foldr(fn, acc, tail(arr)));
    });
    alias("foldr", "reduceRight");

    var foldr1 = E.foldr1 = _(function (fn, arr) {
        if (isEmpty(arr)) {
            throw new Error("foldr1 does not work on empty lists");
        }
        var rev = reverse(arr);
        return foldr(fn, head(rev), reverse(tail(rev)));
    });

    var flip = function(fn) {
        return function(a, b) {
            return fn.call(this, b, a);
        };
    };

    var append = E.append = _(function(arr1, arr2) {
        return (isEmpty(arr1)) ? arr2 :  prepend(head(arr1), append(tail(arr1), arr2));
    });

    var reverse = E.reverse = foldl(flip(prepend), EMPTY);

    var map = E.map = _(function(fn, arr) {
        return (isEmpty(arr)) ? EMPTY : prepend(fn(head(arr)), map(fn, tail(arr)));
    });

    var all = E.all = _(function (fn, arr) {
        return (isEmpty(arr)) ? true : fn(head(arr)) && all(fn, tail(arr));
    });
    alias("all", "every");

    var some = E.some = _(function(fn, arr) {
        return (isEmpty(arr)) ? false : fn(head(arr)) || some(fn, tail(arr));
    });
    alias("some", "any");

    var filter = E.filter = _(function(fn, arr) {
        return (isEmpty(arr)) ? EMPTY : (fn(head(arr))) ? prepend(head(arr), filter(fn, tail(arr))) : filter(fn, tail(arr));
    });

    var reject = E.reject = _(function(fn, arr) {
        return filter(notFn(fn), arr);
    });

    var lPartial = E.lPartial = function (fn) {
        var args = [].slice.call(arguments, 1);
        return function() {
            return fn.apply(this, args.concat([].slice.call(arguments)));
        };
    };
    alias("lPartial", "applyLeft");

    var rPartial = E.rPartial =function (fn) {
        var args = [].slice.call(arguments, 1);
        return function() {
            return fn.apply(this, [].slice.call(arguments).concat(args));
        };
    };
    alias("rPartial", "applyRight");

    var prop = E.prop = function(p) {return function(obj) {return obj[p];};};

    var pluck = E.pluck = function(p) {return map(prop(p));};
    // var pluck = E.pluck = map(prop); // TODO: shouldn't this work? // ANS: Duh, requires compose

    var uniq = E.uniq = function(arr) {
        var h = head(arr), t = tail(arr);
        return (isEmpty(arr)) ? EMPTY : (contains(h, t)) ? uniq(t) : prepend(h, uniq(t));
    };

    var take = E.take = _(function(n, arr) {
        return (isEmpty(arr) || !(n > 0)) ? EMPTY : prepend(head(arr), take(n -1, tail(arr)));
    });

    var skip = E.skip = _(function(n, arr) {
        return isEmpty(arr) ? EMPTY : (n > 0) ? skip(n - 1, tail(arr)) : arr;
    });
    alias('skip', 'drop');

    var xprodWith = E.xprodWith = _(function(fn, a, b) {
        return (isEmpty(a) || isEmpty(b)) ? EMPTY : foldl1(append, map(function(z) {return map(_(fn)(z), b);}, a));
    });

    var xprod = E.xprod = xprodWith(prepend);

    var zipWith = E.zipWith = _(function(fn, a, b) {
        return (isEmpty(a) || isEmpty(b)) ? EMPTY : prepend(fn(head(a), head(b)), zipWith(fn, tail(a), tail(b)));
    });

    var zip = E.zip = zipWith(prepend);

    var compose = E.compose = function() {
        var args = slice.call(arguments);
        return function(x) {
              // do cool stuff here
        };
    };
    alias("compose", "fog");

    var pipe = E.pipe = function() {
        var args = reverse(slice.call(arguments));
        return compose.apply(args);
    };
    alias("pipe", "sequence");

    var flatten = E.flatten = function(list) {
        var h = head(list), t = tail(list);
        return isEmpty(list) ? EMPTY : (isAtom(h)) ? prepend(h, flatten(t)) : append(flatten(h), flatten(t));
    };

    // would be nice to have a find for objects as well
    var find = E.find = _(function(fn, arr) {
        var h = head(arr), t = tail(arr);
        if (isEmpty(arr)) { return false; }
        if (isAtom(h)) { return fn(h) ? h : find(fn, t); }
        else { return find(fn, h) || find(fn, t); }
    });

    // express contains in terms of find?
    var contains = E.contains = _(function(a, arr) {
        var h = head(arr), t = tail(arr);
        if (isEmpty(arr)) { return false; }
        if (isAtom(h)) { return h === a || contains(a, t); }
        else { return contains(a, h) || contains(a, t); }
    });

    var tap = E.tap = _(function(x, y) {
        if (typeof y === "function") {
            y(x);
        }
        return x;
    });
    alias("tap", "K");

    var maybe = E.maybe = function(fn) {
        return function() {
            var undef, args = slice.call(arguments);
            return (isEmpty(args)) ? undef : some(function(a) { a === null }, args) ? undef : fn.apply(this, args);
        };
    };

    return E;
}));
