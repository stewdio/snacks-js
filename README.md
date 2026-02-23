

#  JavaScript _snacks_

_Relax and have a tasty snack._

A lightweight collection of constants, utility functions, and conveniences 
that come in handy during creative JavaScript work. 
No dependencies.
No bloated meals. 
Just the snacks.  

Installation via NPM:
```shell
npm install snacks-js
```

Example import use:
```js
import { isUsefulNumber, clamp, lerp, Range } from 'snacks-js'
```




<br>




##  Why Snacks?

JavaScript is an often misunderstood language, full of beauty and flexibility. Its
[dynamic typing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures#dynamic_and_weak_typing)
and [prototypal inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)
give it expressive power that more rigid languages struggle to match. In some cases, that flexibility allows for a class of silent, hard-to-trace, frustrating bugs. Snacks addresses those rough edges directly, and bundles two decades’
worth of frequently-needed math, geometry, and type-checking utilities into a single
modular package.

In its earliest incarnations, Snacks augmented built-in prototypes, enabling pleasant
chains like:

```js
( 2 + 3 )
    .multiply( 4.5 )
    .round()
    .toString()
    .prepend( 'Our magic number:' )
    .print()
```

In the late 2010s, the idea of modifying built-in prototypes became taboo (sadly). So that approach has since been set aside in favor of explicit imports—but the goodies remain. Once you pop, you can't stop.




##  Sanity checks

The world can be a stabby, insane place. These sanity checks keep your snacks safe. 


###  Booleans

**`isUsefulBoolean( b )`**  
Returns `true` only for strict `true` or `false` — not `null`, `undefined`, `NaN`,
or a `new Boolean(...)` object. `typeof` and `instanceof` both have gotchas here
that this function quietly handles for you. See the
[source comments](https://github.com/stewdio/snacks-js/blob/main/snacks.js#L24-L44)
for the full breakdown.

**`isNotUsefulBoolean( b )`**  
Inverts the above.


###  Numbers

**`isUsefulNumber( n )`**  
Returns `true` if `n` is a numeric, finite number. Handles the `typeof NaN === 'number'`
gotcha, `new Number(...)` objects, and both `Infinity` and `-Infinity`.

**`isNotUsefulNumber( n )`**  

**`isUsefulInteger( n )`**  

**`isNotUsefulInteger( n )`**


###  Strings

**`isString( s )`**  
Covers both string literals and `new String(...)` objects. Does not include
[Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

**`isEmptyString( s )`** — `isString` with `length === 0`  

**`isNonEmptyString( s )`** — `isString` with `length > 0`  

**`isUsefulString( s )`** — currently an alias for `isNonEmptyString`  

**`isNotUsefulString( s )`**


###  Arrays

**`isArray( a )`**  

**`isNotArray( a )`**  

**`isEmptyArray( a )`**  

**`isNotEmptyArray( a )`**  

**`isUsefulArray( a )`** — non-empty and contains at least one defined value.  

**`isNotUsefulArray( a )`**

**`arrayCount( a )`**  
Unlike `Array.prototype.length`, counts only the _defined_ entries — useful when
working with [sparse arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections).

**`arrayShuffle$( a, s )`**  
In-place [Fisher–Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
Fast. Unbiased. The `$` suffix signals mutation. Optional second argument `s` slices
the result to the first `s` elements — handy for picking a random subset.

**`arrayShuffle( a, s )`**  
Non-mutating version. Creates a copy before shuffling.

```js
arrayShuffle([ 1, 2, 3, 4, 5 ])      //  e.g. [ 3, 1, 5, 2, 4 ]
arrayShuffle([ 1, 2, 3, 4, 5 ], 3 )  //  e.g. [ 3, 1, 5 ]
```




##  Range

A `Range` defines a span of values between a minimum and maximum, and serves as the
primary currency for mapping, clamping, wrapping, and normalizing throughout Snacks.

```js
//  Inclusive on both ends:
const rgb  = new Range( 0, 255 )

//  Wrapped: 360 === 0, max is exclusive:
const hue  = new Range( 0, 360, true )
```

The third constructor argument, `isWrapped`, distinguishes ranges where the upper
bound wraps around to the lower bound (angles, hues) from those where it doesn't
(RGB channels, pixel coordinates).

###  Instance properties

| Property | Description |
|---|---|
| `min` | Lower bound |
| `max` | Upper bound |
| `span` | `max - min` |
| `isWrapped` | Whether upper bound wraps to lower |

###  Instance methods

**`includes( n )`** / **`excludes( n )`**  
Respects `isWrapped` — a wrapped range excludes its `max`, an unwrapped one includes it.

**`clamp( n )`**  
Constrains `n` to the range. On a wrapped range, the `max` clamps back to `min`.

**`wrap( n )`**  
Folds `n` back into the range using modular arithmetic. Handles negative values and
non-zero minimums correctly. O(1).

```js
const hue = new Range( 0, 360, true )
hue.wrap( 370 )   //  10
hue.wrap( -10 )   //  350
```

**`normalize( n )`**  
Returns where `n` sits within the range as a value between 0 and 1.

**`map( sourceRange, n )`** or **`map( min, max, n )`**  
Re-expresses `n` from this range into another range proportionally.

```js
const audio   = new Range( 0, 1 )
const display = new Range( 0, 300 )
audio.map( display, 0.5 )  //  150
```

**`toArray( step? )`**  
Returns every value in the range as an array, optionally stepping by more than 1.

```js
new Range( 0, 10 ).toArray()     //  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
new Range( 0, 10 ).toArray( 2 )  //  [ 0, 2, 4, 6, 8, 10 ]
```

**`isNGreater( n )`** / **`isNLesser( n )`**  
Tests whether `n` falls beyond the range's upper or lower bound respectively.

###  Helper functions

**`isRange( n )`**  

**`isNotRange( n )`**




##  Operators

Higher-order arithmetic that feels a little like Lisp. Operators are first-class
objects, which means they can be stored, passed around, and looked up by symbol.

**`OPERATORS`**  
An object containing operator definitions for `add`, `sub`, `mul`, `div`, `mod`,
`exp`, `inc`, and `dec`. Each operator knows its common symbols — so `'+'`,
`'addition'`, and `'add'` all resolve to the same operator. `OPERATORS.symbols`
gives you a flat list of every recognised symbol.

**`operate( operator, ...args )`**  
Applies an operator to the given arguments. `operator` may be an operator object
or any recognised symbol string.

```js
operate( '+',  10, 5 )  //  15
operate( 'mod', 7, 3 )  //  1
operate( OPERATORS.mul, 4, 3, 2 )  //  24 (variadic)
```

###  Relative numbers

A convenient way to let your API accept both absolute and relative values —
`2`, `3.4`, `-5`, `'+6'`, `'*9'` — without your callers needing to care about
the distinction.

**`parseRelativeNumber( s )`**  
Parses a string like `'+5'` or `'*2'` into `{ operator, number, symbol }`.
A raw number is treated as additive (relative to 0).

**`applyRelativeNumber( absoluteValue, relativeValue )`**  
Applies a relative value to an absolute one.

```js
applyRelativeNumber( 10, '+5'  )  //  15
applyRelativeNumber( 10, '*2'  )  //  20
applyRelativeNumber( 10,  3    )  //  3  (absolute — raw numbers are absolute)
applyRelativeNumber( '+5'      )  //  5  (uses operator's identity value when no abs given)
```




<br>




##  Unitless math


###  Randomness

**`random( n )`**  
If `n` is a number, returns a random float between 0 and `n`. If `n` is an array,
returns a random element from it.

**`randomBetween( a, b )`**  
Random float between `a` and `b`.

**`randomInteger( n )`**  
Random integer from 0 (inclusive) to `n` (exclusive).

**`randomIntegerBetween( a, b )`**  
Random integer between `a` and `b`.


###  Numeric utilities

**`clamp( min, max, n )`**  
Constrains `n` between `min` and `max`.

**`round( n, decimalPlaces? )`**  
Rounds `n` to a given number of decimal places (default 0).

```js
round( 3.14159, 2 )  //  3.14
```

**`mod( x, n )`**  
Modulo that handles negative values correctly — unlike JavaScript's `%` operator.

```js
mod( -1, 360 )  //  359 (JS’s -1 % 360 gives -1)
```

**`normalize( min, max, n )`**  
Returns where `n` sits between `min` and `max` as an unbounded ratio.

**`normalize01( min, max, n )`**  
Same as `normalize`, clamped to 0..1.

**`lerp( min, max, t )`**  
Linear interpolation — returns the value at position `t` between `min` and `max`.

```js
lerp( 0, 100, 0.25 )  //  25
lerp( 0, 100, 0.75 )  //  75
```

**`mapRange( sourceMin, sourceMax, targetMin, targetMax, n )`**  
Re-expresses `n` from one numeric range into another. For a curried, `Range`-friendly
version see `mapRangeCurved` below.

**`mapRangeCurved( sourceRange )( targetRange )( curve )( n )`**  
A curried form of `mapRange` that accepts a `curve` function to apply easing or
other transformations to the normalized position before re-scaling. Any `t => t`
shaped function works. (I’m considering a Curves library that replicates how Pacer.js handles its tweening and easing functions… Note the examples here reference that theoretical / non-existant Curves library. Substitute your own favorite Tween library instead.)

```js
const toDisplay = mapRangeCurved
    ( new Range( 0, 1 ))
    ( new Range( 0, 300 ))

toDisplay( Curve.linear    )( 0.5 )  //  150
toDisplay( Curve.easeIn    )( 0.5 )  //  75
toDisplay( Curve.easeOut   )( 0.5 )  //  225
toDisplay( Curve.power( 3 ))( 0.5 )  //  37.5

//  One-off inline curve:
toDisplay( t => Math.sqrt( t ))( 0.25 )  //  150
```

**`average( numbersArray, weightsArray? )`**  
Weighted or unweighted average of an array of numbers.

**`circularAverage( numbersArray, weightsArray? )`**  
Correct average of circular values like angles or hues, where naively averaging
350° and 10° would give 180° instead of the correct 0°. Accepts optional weights.

**`ratioToQuotient( ratioString )`**  
Parses a ratio string in any common notation and returns its quotient.

```js
ratioToQuotient( '16:9' )   //  1.777...
ratioToQuotient( '4/3' )    //  1.333...
ratioToQuotient( '1.85x1' ) //  1.85
```

**`copySign( x, y )`**  
Returns a value with the magnitude of `x` and the sign of `y`.

**`signedPower( x, y )`**  
Raises `x` to the power `y` while preserving `x`'s sign. Useful for plotting all
four quadrants of a superellipse with a single loop.




##  Geometry and trigonometry

**`PI`** — Alias for `Math.PI` (π)  
**`TAU`** — `Math.PI * 2` (τ)

**`degreesToRadians( degrees )`**  

**`radiansToDegrees( radians )`**  

**`radiansToPointsArray( radians )`** — returns `[ cos(r), sin(r) ]`  

**`normalizeAngle( radians )`**  
Folds any radian value into the range 0..τ.

**`polarToCartesian( radius, theta, centerX?, centerY? )`**  
Converts polar coordinates to a `[ x, y ]` Cartesian pair. Center defaults to origin.  

**`rotateCartesian( x, y, radians )`**  
Rotates a Cartesian point by `radians` around the origin. Returns `[ x, y ]`.  

**`findMidpoint( a, b, velocityA?, velocityB?, range? )`**  
Finds the weighted midpoint between two angles on a circular range, accounting for
wraparound (so the midpoint of 350° and 10° is 0°, not 180°). Optional velocity
arguments bias the midpoint toward the faster-moving angle. `range` may be a
`Range` instance or a plain number (interpreted as the span from 0). Defaults to τ.  

**`distance2D( x1, y1, x2, y2 )`**  
Euclidean distance between two 2D points.  




##  Metric system

SI prefix constants and a conversion utility.

```js
convertMetric( 4.7, KILO, NANO )
//  4.7 kilowhatever → nanowhatever
//  = 4.7 × 10^12
//  = 4,700,000,000,000
```

**`convertMetric( n, fromPrefix, toPrefix )`**

Available prefix constants: `QUETTA`, `RONNA`, `YOTTA`, `ZETTA`, `EXA`, `PETA`,
`TERA`, `GIGA`, `MEGA`, `KILO`, `HECTO`, `DEKA`, `UNIT`, `DECI`, `CENTI`, `MILLI`,
`MICRO`, `NANO`, `PICO`, `FEMTO`, `ATTO`, `ZEPTO`, `YOCTO`, `RONTO`, `QUECTO`




<br>




##  Miscellaneous

**`compareArraysByElementProperty( a, b, property )`**  
Compares two arrays of objects by a shared property, returning `{ inBoth, onlyInA, onlyInB }`.

**`timeAgo( timestamp, now? )`**  
Returns a human-readable relative time string from seconds up to centuries.

```js
timeAgo( Date.now() - 3000 )    //  'just now'
timeAgo( Date.now() - 90000 )   //  '1 minute'
timeAgo( Date.now() - 9e8 )     //  '10 days'
```

**`numberToFullWidthChars( n )`**  
Converts a number to its full-width Unicode character equivalent.

```js
numberToFullWidthChars( 42 )  //  '４２'
```

**`toSentenceCase( str )`**  
Uppercases the first character of a string.

**`toCamelCase( str )`**  
Converts any whitespace- or underscore-delimited string to camelCase.

```js
toCamelCase( 'hello world' )   //  'helloWorld'
toCamelCase( 'foo_bar_baz' )   //  'fooBarBaz'
```

**`css`**  
A small object of useful default layout values mirrored as CSS custom properties.
`leading`, `leadingHalf`, `columnWidth`, `fontSize`.




##  Color

Color utilities have been removed from Snacks. A dedicated color library is in the works :)  
~~`floatToHex`~~  
~~`hslToRgb`~~




##  License

See [LICENSE](./LICENSE) for details.



