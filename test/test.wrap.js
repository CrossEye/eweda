var assert = require("assert");
var eweda = require("./../eweda");

describe('wrap', function() {
    var wrap = eweda.wrap, reduce = eweda.reduce, zipWith = eweda.zipWith;
    // TODO: remove this in favor of something simpler.
    it('surrounds the invocation of one function with another', function() {
        var curves = [11, 4, 18],
            grades = {
                alice: [75, 86, 67],
                bob: [64, 77, 72],
                carol: [81, 93, 78]
            },
            plus = function(a, b) {return a + b;},
            // TODO: this should be easier
            avg = function(arr) {return reduce(plus, 0)(arr) / arr.length;},
            average = function(grades) {
                var results = {};
                for (name in grades) {if (grades.hasOwnProperty(name)) {
                    results[name] = avg(grades[name]);
                }}
                return results;
            },
            curvedAverage = wrap(average, function(wrapped, grades) {
                var adjusted = {};
                for (name in grades) {if (grades.hasOwnProperty(name)) {
                    adjusted[name] = zipWith(plus, grades[name], curves);
                }}
                return wrapped(adjusted);
            });
        assert.deepEqual(average(grades), {alice: 76, bob: 71, carol: 84});
        assert.deepEqual(curvedAverage(grades), {alice: 87, bob: 82, carol: 95});
    });
});
