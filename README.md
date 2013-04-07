Project Eweda
=============

A practical functional library for Javascript programmers.  _Eweda lamb!_



Goals
-----

Using this library should feel as much like using Javascript as possible.  Of course it's functional Javascript, but
we're not introducting lambda expressions in strings, we're not borrowing CONSed lists, we're not porting over all of
the Clojure functions.

Our basic data structures will be normal Javascript objects, and our usual collections will be Javascript arrays.  We
will not try to reach the point where all the functions have only zero, one, or two arguments.  We will certainly try
to keep some of the normal features of Javascript that seem to be unusual in functional languages, including variable
length function signatures and functions as objects with properties.

Functional programming is in good part about immutable objects and side-effect free functions.  We will stick to that
as much as feasible, but will not be dogmatic about it.


Structure
---------

The functions included should automatically allow for partial application without an explicit call to lPartial.  Many of
these operate on arrays.  A single array parameter should probably come last, which might conflict with the design of
other libraries that have strong functional components (I'm looking at you Underscore!)

The idea is that, if foldl has this signature:

    var foldl = function(fn, accum, arr) { /* ... */}

then, instead of having to manually call lPartial like this:

     var sum = lPartial(foldl, 0, add);
     var total = sum([1, 2, 3, 4]);

we could just do this:

     var sum = foldl(0, add);
     var total = sum([1, 2, 3, 4]);

**Question**: Is this really a good idea?  Is this convenience worth the implementation complexity, and would users
really find it that helpful?  It is part of what makes functional languages like Haskell so clean, but they are very
different languages.


Functions to include
--------------------

We want to include the basic functions that will help a Javscript programmer work with objects and arrays.  We will try
to use the most common names for these, possibly using multiple aliases for those that are most debated.


### Arrays ###

  * map
  * foldl/foldr (reduce/reduceRight)
  * filter
  * reject
  * find
  * all (every)
  * any (some)
  * contains
  * pluck
  * flatten
  * zip
  * (cartesian product -- what's a good name?)
  * first (head)
  * rest (tail)
  * splat ?

### Functions ###

  * compose (but standard ordering seems wrong)
  * flip
  * lPartial/rPartial (applyLeft/applyRight)
  * memoize
  * once
  * wrap
  * not

### Objects ###

  * tap
  * get (Ex: `var bday = get("dob"), day1 = bday(fred), day2 = bday(wilma);`)
  * props ? (Ex: `var p = props(person), var birthday = p("dob"), name = p("name");`)
  * identity (along with some utility versions such as alwaysTrue, alwaysFalse, alwaysZero, etc.)
  * maybe



To-Do
-----

Obviously the most important thing is to get started on the code.  But there are several other things we would like to
make sure are done.

  * This should come with a good set of unit tests right from the beginning.  We have to choose the test framework.
  * By default this should probably be built with a wrapper that lets it run with browser globals, with an AMD loader
    or in the Common.js loader.  This is straightforward.  But we should provide a mechanism that allows the user
    instead to choose the target environment.  This is probably to include a grunt script along with the code, and
    possibly to push several outputs up with each change.
  * At the moment, this looks small enough that it may not matter, but if this grows, it would also be nice to offer
    the ability to generate modular builds, which would require us to track dependencies.  It might be worth finding
    a way to do that from the start.