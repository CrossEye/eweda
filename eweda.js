(function (root, factory) {if (typeof exports === 'object') {module.exports = factory();} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.eweda = factory();}}(this, function () { // see https://github.com/umdjs/umd/blob/master/returnExports.js

    var E = {};
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var isArray = function(val) {return toString.call(val) === "[object Array]";};

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

    // should prepend, head, tail, atom, etc be exposed?

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

    var foldl = E.foldl = _(function(fn, acc, list) {
        return (emptyList(list)) ? acc : foldl(fn, fn(acc, head(list)), tail(list));
    });

    var fold11 = E.fold11 = _(function (fn, arr) {
        if (emptyList(arr)) {
            throw new Error("foldl does not work on empty lists");
        }
        return foldl(fn, head(arr), tail(arr));
    });

    var map = E.map = _(function(fn, arr) {
        return (emptyList(arr)) ? [] : prepend(fn(head(arr)), map(fn, tail(arr)));
    });

    // TODO: A lot of effort for a little gain.  Can do the below without a full Object.keys shim.  Probably better.
    // somewhat simplified from https://github.com/kangax/protolicious/blob/master/experimental/object.for_in.js#L18
    // We can shim this one without issue as we use it directly.
    var keys = Object.keys = Object.keys || (function () { // TODO: expose as eweda.keys?
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
            DontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            DontEnumsLength = DontEnums.length;

        return function (o) {
            if (typeof o != "object" && typeof o != "function" || o === null) {
                throw new TypeError("Object.keys called on a non-object");
            }
            var result = [];
            for (var name in o) {
                if (hasOwnProperty.call(o, name)) {
                    result.push(name);
                }
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < DontEnumsLength; i++) {
                    if (hasOwnProperty.call(o, DontEnums[i])) {
                        result.push(DontEnums[i]);
                    }
                }
            }

            return result;
        };
    }());

    // Should we shim Array.prototype forEach?  We don't actually use it directly.
    var forEach = function(fn, arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
          fn.call(this, arr[i], i, arr);
        }
    };

    var aliases = {
        foldl: ["reduce"],
        foldr: ["reduceRight"]
    };

    forEach(function(key) {
        forEach(function(alias) {
            E[alias] = E[key];
        }, aliases[key]);
    }, keys(aliases));

    return E;
}));
