Project Eweda
=============

A practical functional library for Javascript programmers.  _Eweda lamb!_



Goals
-----

Using this library should feel as much like using Javascript as possible.  Of course it's functional Javascript, but
we're not introducting lambda expressions in strings, we're not borrowing CONsed lists, we're not porting over all of
the Clojure functions.

Our basic data structures will be normal Javascript objects, and our usual collections will be Javascript arrays.  We
will not try to reach the point where all the functions have only zero, one, or two arguments.  We will certainly try
to keep some of the normal features of Javascript that seem to be unusual in functional languages, including variable
length function signatures and functions as objects with properties.

Functional programming is in good part about immutable objects and side-effect free functions.  We will stick to that
as much as feasible, but will not be dogmatic about it.

As much as we can, we would like the implementation to be both clean and elegant.  But the API is king: we will
sacrifice a great deal of implementation elegance for even a slightly cleaner API.


Structure
---------

The functions included should automatically allow for partial application without an explicit call to lPartial.  Many of
these operate on arrays.  A single array parameter should probably come last, which might conflict with the design of
other libraries that have strong functional components (I'm looking at you Underscore!)

The idea is that, if foldl has this signature:

    var foldl = function(fn, accum, arr) { /* ... */}

and we have this simple function:

    var add = function(a, b) {return a + b;};

then, instead of having to manually call lPartial like this:

     var sum = lPartial(foldl, add, 0);
     var total = sum([1, 2, 3, 4]);

we could just do this:

     var sum = foldl(add, 0);
     var total = sum([1, 2, 3, 4]);

**Question**: Is this really a good idea?  Is this convenience worth the implementation complexity, and would users
really find it that helpful?  It is part of what makes functional languages like Haskell so clean, but they are very
different languages.


Functions to include
--------------------

We want to include the basic functions that will help a Javscript programmer work with objects and arrays.  We will try
to use the most common names for these, possibly using multiple aliases for those that are most debated.


### Arrays ###

  * ✓ map
  * ✓ foldl/foldr (reduce/reduceRight)
  * ✓ filter
  * ✓ reject
  * find
  * ✓ all (every)
  * ✓ any (some)
  * ✓ contains
  * ✓ pluck
  * flatten
  * ✓ zip
  * ✓ zipWith
  * ✓ xprod / xprodWith (cartesian product)
  * ✓ first (head)
  * ✓ rest (tail)
  * ✓ take
  * ✓ skip (drop)

### Functions ###

  * compose (but standard ordering seems wrong)
  * ✓ flip
  * ✓ Partial/rPartial (applyLeft/applyRight)
  * memoize
  * once
  * wrap
  * ✓ not

### Objects ###

  * tap
  * ✓ prop (Ex: `var bday = prop("dob"), day1 = bday(fred), day2 = bday(wilma);`)
  * props ? (Ex: `var p = props(person), var birthday = p("dob"), name = p("name");`)
  * identity (along with some utility versions such as alwaysTrue, alwaysFalse, alwaysZero, etc.)
  * maybe



To-Do
-----

Obviously the most important thing is to get started on the code.  But there are several other things we would like to
make sure are done.

  * Replace `emptyList()` with `isEmpty()`.  Create a constant (`EMTPY` ?) to use in place of all the `[]` instances.
    (Probably should also rename all the `arr` variables to `list` too.)  Then make sure that everything else is
    bootstrapped from just `prepend`, `head`, `tail`, `isEmpty`, and `EMPTY`.  This could make it very clean to change the
    basic underlying data structure without breaking any functionality.
  * <del>This should come with a good set of unit tests right from the beginning.  We have to choose the test
    framework.</del> *Done*: Using Mocha, at least for now, with a custom wrapper to let it run in both Node and
    in the browser.  We'll see if that wrapper holds up to more than casual use.
  * <del>By default this should probably be built with a wrapper that lets it run with browser globals, with an AMD
    loader or in the Common.js loader.</del>  *Done*.  But we should provide a mechanism that allows the user
    instead to choose the target environment.  This is probably to include a grunt script along with the code, and
    possibly to push several outputs up with each change.
  * At the moment, this looks small enough that it may not matter, but if this grows, it would also be nice to offer
    the ability to generate modular builds, which would require us to track dependencies.  It might be worth finding
    a way to do that from the start.


Open Question
-------------

It might be possible to extend the [cons, car, cdr][cons] notion [buzzdecafe][mike] has been leading to work with actual
arrays rather than the CONsed pairs.  Is it worth doing this?  There would certainly make for cleaner, more elegant
code, with the difference between this:

     var foldl = function(fn, acc, arr) {
         var total = acc;
         for (var i = 0, len = arr.length; i <len; i++) {
             total = fn(total, arr[i]);
         }
         return total;
     };

and this:

     var foldl = function(fn, acc, list) {
         return (isEmpty(list)) ? acc : foldl(fn, fn(acc, head(list)), tail(list));
     }

The question is how big a performance hit such code would introduce.  Obviously the original CONsed list wouldn't do,
but if we had a list implementation that worked similarly but was actually backed by an array, using native array
operations underneath when necessary, and just fiddling with indices for things like `tail,` this might not be too
costly and might therefore be worth considering.


  [cons]: https://gist.github.com/buzzdecafe/5272249
  [mike]: https://github.com/buzzdecafe
