//     eweda.js 0.0.1
//     https://github.com/CrossEye/eweda
//     (c) 2013 Scott Sauyet and Michael Hurley
//     Underscore may be freely distributed under the MIT license.

// Basic Setup
// -----------
// Uses a technique from the [Universal Module Definition][umd] to wrap this up for use in Node.js or in the browser,
// with or without an AMD-style loader.
//
//  [umd]: https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {if (typeof exports === 'object') {module.exports = factory(root);} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.eweda = factory(root);}}(this, function (global) {

    // The basic implementation of lists is replaceable.  A default one base on arrays is supplied below.
    // `bootstrap` represents that implementation, which must contain:
    //
    //   - `EMPTY`: prototypical (or only) empty list
    //   - `isAtom`: boolean function which is `true` for non-list, `false` for a list
    //   - `isEmpty`: boolean function which reports whether a list is empty
    //   - `prepend`: function which returns a new list with the new element at the front, and the existing elements following
    //   - `head`: function which returns the first element of a list
    //   - `tail`: function which returns the rest of the list after the first element

    var lib = function(bootstrap) {

        // This function is what is actually returned, with all the functions attached as properties.  That allows
        //
        //     var myLib = eweda({
        //         EMPTY: /* ... */,
        //         isAtom: /* ... */,
        //         /* ... */
        //     });
        //     var result = myLib.map(someFunction, someCollection);
        //
        // where `someCollection` is built to match the style of collection described by the parameter to the first call.

        var E = function() {return lib.apply(this, arguments);};

        // Internal Functions and Properties
        // ---------------------------------

        var undef = (function(){})(), EMPTY;

        // Makes an alias for one of the public functions:
        var aliasFor = function(oldName) {
            var fn = function(newName) {E[newName] = E[oldName]; return fn;};
            return (fn.is = fn.are = fn.and = fn);
        };
        // Partial replacement for native `bind`.
        var bind = function(fn, context) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function() {
                return fn.apply(context || this, args.concat(Array.prototype.slice.call(arguments)));
            };
        };
        // Standard Array and Object methods implemented as pure functions
        var slice = bind(Function.prototype.call, Array.prototype.slice);
        var toString = bind(Function.prototype.call, Object.prototype.toString);
        var isArray = function(val) {return toString(val) === "[object Array]";};

        // Fills out an array to the specified length
        var expand = function(a, len) {
            var arr = a ? isArray(a) ? a : slice(a) : [];
            while(arr.length < len) {arr[arr.length] = undef;}
            return arr;
        };

        // Local version of partial application.
        var _ = function(fn) {
            var arity = fn.length;
            var f = function(args) {
                return function () {
                    var newArgs = (args || []).concat(slice(arguments, 0));
                    if (newArgs.length >= arity) {
                        return fn.apply(this, newArgs);
                    }
                    else {return f(newArgs);}
                };
            };

            return f(EMPTY);
        };

        // Internal version of `forEach`.  Possibly to be exposed later.
        var each = _(function(fn, arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                fn(arr[i]);
            }
        });
		

		// Core Functions Supplied
		// -----------------------
		//
        // Local copies of the basic list functions supplies in the initial parameter.  Almost all of these become
        // public.
        EMPTY = bootstrap.EMPTY;
        var isEmpty = E.isEmpty = bootstrap.isEmpty;
        var prepend = E.prepend = bootstrap.prepend;
        aliasFor("prepend").is("cons"); // TODO: really?
        var head = E.head = bootstrap.head;
        aliasFor("head").is("car");  // TODO: really? sure! positively?
        var tail = E.tail = bootstrap.tail;
        aliasFor("tail").is("cdr");  // TODO: really? absolutely! without doubt?
        var isAtom = E.isAtom = bootstrap.isAtom;

		// Core Functions Derived
		// ----------------------
		//
        E.append = function(el, arr) {
            return reverse(prepend(el, reverse(arr)));
        };

        var merge = E.merge = _(function(arr1, arr2) {
            return (isEmpty(arr1)) ? arr2 :  prepend(head(arr1), merge(tail(arr1), arr2));
        });

        // Function functions :-)
        // ----------------------

        // Creates a new function that runs each of the functions supplied as parameters in turn, passing the output
        // of each one to the next one, starting with whatever arguments were passed to the initial invocation.
        // Note that if `var h = compose(f, g)`, `h(x)` calls `g(x)` first, passing the result of that to `f()`.
        var compose = E.compose = function() {  // TODO: type check of arguments?
            var fns = slice(arguments);
            return function() {
                return foldr(function(fn, args) {return [fn.apply(this, args)];}, slice(arguments), fns)[0];
            }
        };
        aliasFor("compose").is("fog"); // TODO: really?

        // Similar to `compose`, but processes the functions in the reverse order so that if if `var h = pipe(f, g)`,
        // `h(x)` calls `f(x)` first, passing the result of that to `g()`.
        var pipe = E.pipe = function() { // TODO: type check of arguments?
            return compose.apply(this, slice(arguments).reverse());
        };
        aliasFor("pipe").is("sequence");

        // Returns a new function much like the supplied one except that the first two arguments are inverted.
        var flip = E.flip = function(fn) {
            return _(function(a, b) {
                return fn.apply(this, [b, a].concat(slice(arguments, 2)));
            });
        };

        // Creates a new function that acts like the supplied function except that the left-most parameters are
        // pre-filled.
        var lPartial = E.lPartial = function (fn) {
            var args = slice(arguments, 1);
            return function() {
                return fn.apply(this, args.concat(slice(arguments)));
            };
        };
        aliasFor("lPartial").is("applyLeft");

        // Creates a new function that acts like the supplied function except that the right-most parameters are
        // pre-filled.
        var rPartial = E.rPartial =function (fn) {
            var args = slice(arguments, 1);
            return function() {
                return fn.apply(this, slice(arguments).concat(args));
            };
        };
        aliasFor("rPartial").is("applyRight");

        // Creates a new function that stores the results of running the supplied function and returns those
        // stored value when the same request is made.  **Note**: this really only handles string and number parameters.
        E.memoize = function(fn) {
            var cache = {};
            return function() {
                var position = foldl(function(cache, arg) {return cache[arg] || (cache[arg] = {});}, cache,
                        slice(arguments, 0, arguments.length - 1));
                var arg = arguments[arguments.length - 1];
                return (position[arg] || (position[arg] = fn.apply(this, arguments)));
            };
        };

        // Wraps a function up in one that will only call the internal one once, no matter how many times the outer one
        // is called.  ** Note**: this is not really pure; it's mostly meant to keep side-effects from repeating.
        E.once = function(fn) {
            var called = false, result;
            return function() {
                if (called) {return result;}
                called = true;
                return (result = fn.apply(this, arguments));
            }
        };

        // Wrap a function inside another to allow you to make adjustments to the parameters or do other processing
        // either before the internal function is called or with its results.
        E.wrap = function(fn, wrapper) {
            return function() {
                return wrapper.apply(this, [fn].concat(slice(arguments)));
            };
        };

        // List Functions
        // --------------

        var map = E.map = _(function(fn, arr) {
            return (isEmpty(arr)) ? EMPTY : prepend(fn(head(arr)), map(fn, tail(arr)));
        });

        var foldl = E.foldl = _(function(fn, acc, arr) {
            return (isEmpty(arr)) ? acc : foldl(fn, fn(acc, head(arr)), tail(arr));
        });
        aliasFor("foldl").is("reduce");

        var foldl1 = E.foldl1 = _(function (fn, arr) {
            if (isEmpty(arr)) {
                throw new Error("foldl1 does not work on empty lists");
            }
            return foldl(fn, head(arr), tail(arr));
        });

        var foldr = E.foldr =_(function(fn, acc, arr) {
            return (isEmpty(arr)) ? acc : fn(head(arr), foldr(fn, acc, tail(arr)));
        });
        aliasFor("foldr").is("reduceRight");

        var foldr1 = E.foldr1 = _(function (fn, arr) {
            if (isEmpty(arr)) {
                throw new Error("foldr1 does not work on empty lists");
            }
            var rev = reverse(arr);
            return foldr(fn, head(rev), reverse(tail(rev)));
        });

        var filter = E.filter = _(function(fn, arr) {
            return (isEmpty(arr)) ? EMPTY : (fn(head(arr))) ? prepend(head(arr), filter(fn, tail(arr))) : filter(fn, tail(arr));
        });

        E.reject = _(function(fn, arr) {
            return filter(notFn(fn), arr);
        });

        var take = E.take = _(function(n, arr) {
            return (isEmpty(arr) || !(n > 0)) ? EMPTY : prepend(head(arr), take(n - 1, tail(arr)));
        });

        var skip = E.skip = _(function(n, arr) {
            return isEmpty(arr) ? EMPTY : (n > 0) ? skip(n - 1, tail(arr)) : arr;
        });
        aliasFor('skip').is('drop');

        // would be nice to have a find for objects as well
        var find = E.find = _(function(fn, lat) {
            var h = head(lat);
            return (isEmpty(lat)) ? false : fn(h) ? h : find(fn, tail(lat));
        });

        var all = E.all = _(function (fn, arr) {
            return (isEmpty(arr)) ? true : fn(head(arr)) && all(fn, tail(arr));
        });
        aliasFor("all").is("every");

        var any = E.any = _(function(fn, arr) {
            return (isEmpty(arr)) ? false : fn(head(arr)) || any(fn, tail(arr));
        });
        aliasFor("any").is("some");

        // express contains in terms of find?
        var contains = E.contains = _(function(a, lat) {
            return (isEmpty(lat)) ? false : head(lat) === a || contains(a, tail(lat));
        });

        var uniq = E.uniq = function(arr) {
            var h = head(arr), t = tail(arr);
            return (isEmpty(arr)) ? EMPTY : (contains(h, t)) ? uniq(t) : prepend(h, uniq(t));
        };

        E.pluck = function(p) {return map(prop(p));};

        var flatten = E.flatten = function(list) {
            var h = head(list), t = tail(list);
            return isEmpty(list) ? EMPTY : (isAtom(h)) ? prepend(h, flatten(t)) : merge(flatten(h), flatten(t));
        };

        var zipWith = E.zipWith = _(function(fn, a, b) {
            return (isEmpty(a) || isEmpty(b)) ? EMPTY : prepend(fn(head(a), head(b)), zipWith(fn, tail(a), tail(b)));
        });

        E.zip = zipWith(prepend);
		
        var xprodWith = E.xprodWith = _(function(fn, a, b) {
            return (isEmpty(a) || isEmpty(b)) ? EMPTY : foldl1(merge, map(function(z) {return map(_(fn)(z), b);}, a));
        });

        E.xprod = xprodWith(prepend);

        var reverse = E.reverse = foldl(flip(prepend), EMPTY);

		
		// Object Functions
		// ----------------

        var tap = E.tap = _(function(x, y) {
            if (typeof y === "function") {
                y(x);
            }
            return x;
        });
        aliasFor("tap").is("K");

        E.eq = _(function(a, b) {
            return a === b;
        });

	    var prop = E.prop = function(p) {return function(obj) {return obj[p];};};
        
		E.func = function(n) {return function(obj) {return obj[n].apply(obj, slice(arguments, 1));};};

        var props = E.props = function(obj) {
            return function(prop) {return obj && obj[prop];};
        };

        var identity = E.identity = function(val) {
            return function() {return val;};
        };

        E.alwaysZero = identity(0);
        E.alwaysFalse = identity(false);
        E.alwaysTrue = identity(true);

        var anyBlanks = any(function(val) {return val === null || val === undef;});

        E.maybe = function (fn) {
            return function () {
                return (arguments.length === 0 || anyBlanks(expand(arguments, fn.length))) ? undef : fn.apply(this, arguments);
            };
        };
		
        var keys = E.keys = function(obj) {
            var results = [];
            for (var name in obj) {if (obj.hasOwnProperty(name)) {
                results.push(name);
            }}
            return results;
        };
        E.values = function(obj) {
            return map(props(obj), keys(obj));
        };
		
		// Logic Functions
		// ---------------
		
        E.and = _(function (a, b) {
            return !!(a && b);
        });

        E.or = _(function (a, b) {
            return !!(a || b);
        });

        E.not = function (a) {
            return !a;
        };

        // Still not particularly happy with the names `andFn`, `orFn`, `notFn`, but at least Oliver Twist can pronounce one...
        E.andFn = _(function(f, g) { // TODO: arity?
           return function() {return !!(f.apply(this, arguments) && g.apply(this, arguments));};
        });

        E.orFn = _(function(f, g) { // TODO: arity?
           return function() {return !!(f.apply(this, arguments) || g.apply(this, arguments));};
        });

        var notFn = E.notFn = function (f) {
            return function() {return !f.apply(this, arguments);};
        };
		
		
		// Arithmetic Functions
		// --------------------
		
        var add = E.add = _(function(a, b) {return a + b;});
        var multiply = E.multiply = _(function(a, b) {return a * b;});
        E.subtract = _(function(a, b) {return a - b;});
        E.divide = _(function(a, b) {return a / b;});
        E.sum = foldl(add, 0);
        E.product = foldl(multiply, 1);

		
		// Miscellaneous Functions
		// -----------------------
		
        E.inContext = function(obj) {
            each(function(key) {
                (obj || global)[key] = E[key];
            })(keys(E));
        };

        return E;
    };

	// Default Core Functions
	// ----------------------
	//
	// The default core uses simple arrays for its lists
    return lib(function() {
        var EMPTY = [];
        return {
            EMPTY: EMPTY,
            isEmpty: function(arr) {
                return !arr || !arr.length;
            },
            prepend: function(el, arr) {
                return [el].concat(arr);
            },
            head: function(arr) {
                arr = arr || EMPTY;
                return (arr.length) ? arr[0] : EMPTY;
            },
            tail: function(arr) {
                arr = arr || EMPTY;
                return (arr.length > 1) ? arr.slice(1) : EMPTY;
            },
            isAtom: function(x) {
                return (x !== null) && (x !== undefined) && Object.prototype.toString.call(x) !== "[object Array]";
            }
        };
    }());
}));
