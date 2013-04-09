(function (root, factory) {if (typeof exports === 'object') {module.exports = factory();} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.eweda = factory();}}(this, function () { // see https://github.com/umdjs/umd/blob/master/returnExports.js

    var slice = Array.prototype.slice;

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

    var head = function(arr) {
        arr = arr || [];
        return (arr.length) ? arr[0] : [];
    };

    var tail = function(arr) {
        arr = arr || [];
        return (arr.length > 1) ? arr.slice(1) : [];
    };
    
    var foldl = _(function(fn, acc, list) {
        return (emptyList(list)) ? acc : foldl(fn, fn(acc, head(list)), tail(list));
    });


    return {
        foldl: foldl,
        head: head,
        tail: tail,
    };

}));
