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



Functions included
-------------------

We want to include the basic functions that will help a Javscript programmer work with objects and arrays.  We will try
to use the most common names for these, possibly using multiple aliases for those that are most debated.

(**Note** a ` ✓ ` means that the function has at least minimal unit tests written.)


### Collections ###

  * ✓ map
  * ✓ foldl (reduce)
  * ✓ foldl1
  * ✓ foldr (reduceRight)
  * ✓ foldr1
  * ✓ filter
  * ✓ reject
  * ✓ take
  * ✓ skip (drop)
  * ✓ find
  * ✓ all (every)
  * ✓ some (any)
  * ✓ contains
  * ✓ uniq
  * ✓ pluck
  * ✓ flatten
  * ✓ zip
  * ✓ zipWith
  * ✓ xprod (i.e. cartesian product)
  * ✓ xprodWith (i.e. cartesian product with function)
  * ✓ reverse

### Functions ###

  * ✓ compose (fog)
  * ✓ pipe (sequence) (i.e., like compose but in reverse order)
  * ✓ flip
  * ✓ partial (applyLeft)
  * ✓ rPartial (applyRight)
  * ✓ memoize
  * ✓ once
  * ✓ wrap

### Objects ###

  * ✓ tap
  * ✓ eq
  * ✓ prop (Ex: `var bday = prop("dob"), day1 = bday(fred), day2 = bday(wilma);`)
  * ✓ props  (Ex: `var p = props(person), var birthday = p("dob"), name = p("name");`)
  * ✓ identity (K)
  * ✓ alwaysTrue
  * ✓ alwaysFalse
  * ✓ alwaysZero
  * ✓ maybe

### Logic ###

  * and
  * or
  * not
  * andFn
  * orFn
  * notFn

### Internals (perhaps should not be exposed?) ###

  * first (head, car)
  * rest (tail, cdr)
  * prepend (cons)
  * isAtom
  * append
