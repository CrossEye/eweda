(function (root, factory) {if (typeof exports === 'object') {module.exports = factory();} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.eweda = factory();}}(this, function () { // see https://github.com/umdjs/umd/blob/master/returnExports.js

    var E = {};

    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var isArray = function(val) {return toString.call(val) === "[object Array]";};
    var keys = function(obj) {
        var results = [];
        for (var prop in obj) {if (obj.hasOwnProperty(prop)) {
            results.push(prop);
        }}
        return results;
    };
    var forEach = function(fn, arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
          fn.call(this, arr[i], i, arr);
        }
    };
    var alias = function(oldName, newName) {
        E[newName] = E[oldName];
    };

    var _ = function(fn) { // should we spell out "curry" or "partial" or leave super-short?
        var arity = fn.length;
        var f = function(args) {
            return function () {
                var newArgs = args.concat(slice.call(arguments, 0));
                if (newArgs.length >= arity) {
                    return fn.apply(this, newArgs)
                }
                else return f(newArgs)
            }
        };
        return f([]);
    };

    var emptyList = function(list) {
        return !list || !list.length;
    };

    // should prepend, head, tail, isAtom, etc be exposed?

    var prepend = E.prepend = function(el, arr) {
        return [el].concat(arr);
    };

    var head = E.head = function(arr) {
        arr = arr || [];
        return (arr.length) ? arr[0] : [];
    };

    var tail = E.tail = function(arr) {
        arr = arr || [];
        return (arr.length > 1) ? arr.slice(1) : [];
    };

    var isAtom = E.isAtom = function(x) {
        return (x !== null) && (x !== undefined) && !isArray(x);
    };

    var append = E.append = _(function(arr1, arr2) {
        return (emptyList(arr1)) ? arr2 : arr1.concat(arr2);
    });

    var reverse = E.reverse = function(arr) {
        return (emptyList(arr)) ? [] : reverse(tail(arr)).concat(head(arr));
    };

    var foldl = E.foldl = _(function(fn, acc, arr) {
        return (emptyList(arr)) ? acc : foldl(fn, fn(acc, head(arr)), tail(arr));
    });
    alias("foldl", "reduce");

    var fold11 = E.fold11 = _(function (fn, arr) {
        if (emptyList(arr)) {
            throw new Error("foldl1 does not work on empty lists");
        }
        return foldl(fn, head(arr), tail(arr));
    });

    var foldr = E.foldr =_(function(fn, acc, arr) {
        return (emptyList(arr)) ? acc : fn(head(arr), foldr(fn, acc, tail(arr)));
    });
    alias("foldr", "reduceRight");

    var foldr1 = E.foldr1 = _(function (fn, arr) {
        if (emptyList(arr)) {
            throw new Error("foldr1 does not work on empty lists");
        }
        var rev = reverse(arr);
        return foldr(fn, head(rev), reverse(tail(rev)));
    });

    var map = E.map = _(function(fn, arr) {
        return (emptyList(arr)) ? [] : prepend(fn(head(arr)), map(fn, tail(arr)));
    });


    return E;
}));
