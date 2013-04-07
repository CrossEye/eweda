(function (root, factory) {if (typeof exports === 'object') {module.exports = factory();} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.eweda = factory();}}(this, function () { // see https://github.com/umdjs/umd/blob/master/returnExports.js
/*
    var NIL = function() {
        return function() {return null;};
    };

    var makeList = function(arr) {
        // TODO: non-arrays.
        if (arr.length === 0) {return NIL}
        var fn = function(f) {
            return f(arr, 0, arr.length);
        };
        fn.toString = function() {
            return "(" + asArray(this).join(" ") + ")";
        }
        return fn;
    };

    var asArray = function(list) {
        var arr = arguments[1] || [];
        return (list && head(list)) ? (arr.push(head(list)), asArray(tail(list), arr)) : arr;
    };

    var head = function(list) {
        return list(function(arr, start, end) {
            return arr.length ? arr[0] : null;
        });
    };

    var tail = function(list) {
        return list(function(arr, start, end) {
            return (start < end) ? function(f) {
                return f(arr, start + 1, end);
            } : NIL;
        });
    };


    var foldl = function(fn, acc, list) {
        return (list === NIL) ? acc : foldl(fn, fn(acc, head(list)), tail(list));
    };

    return {
        test: function() {return 42;},
        foldl: function(fn, acc, arr) {return foldl(fn, acc, makeList(arr))}
    };
*/

    var foldl = function(fn, acc, arr) {
        var total = acc;
        for (var i = 0, len = arr.length; i <len; i++) {
            total = fn(total, arr[i]);
        }
        return total;
    };

    return {
        foldl: foldl
    };

}));
