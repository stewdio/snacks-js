

#  JavaScript snacks

Relax and have a tasty snack.




<br>




##  The need for snacks

I love JavaScript. It’s an often misunderstood language, full of beauty and flexibility. “Minutes to learn, lifetime to master.” [Just about _everything_ in JavaScript is an Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object). In fact, JavaScript is _more_ object-oriented than most so-called “OO” programming languages. But for some reason its [dynamic typing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures#dynamic_and_weak_typing) and superior [prototypal inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) confuses those crusty-compiler naysayers, who only believe in strongly-typed, classically-inherited cruft. Dinosaurs. Inspired by [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)), “LiveScript” (One of JavaScript’s early monikers) had [first-class functions](https://en.wikipedia.org/wiki/First-class_function) and [lambdas](https://en.wikipedia.org/wiki/Anonymous_function) from the start. Given how speedily it was crafted, and all the ways the Web has careened right off the rails… It’s a better language than we perhaps deserve.

So why Snacks, then? Snacks is a small collection of constants, methods, and conveniences that I have needed with such frequency over the past two decades (Yes—I’ve been doing this a long time), that it made sense to bundle this grab-bag of logic together into something more modularly useful. In its first incarnations (before [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [Node](https://nodejs.org/en) even existed), Snacks just blissfully augmented built-in language prototypes which made for incredibly pleasant function-chaining like so:

```javascript
( 2 + 3 )
.multiply( 4.5 )
.round()
.toString()
.prepend( 'Our magic number:' )
.print()
```
Sadly, augmenting the built-in prototypes has become _so frowned upon_ (and no one has bothered to sandbox / scope it yet), that Snacks can no longer afford this approach. But the individual logic bits are still so useful—so tasty—that once you pop, you can’t stop. And this toolkit is so lightweight; it’s just the goodies. No heavy meals.




<br>




##  Sanity checks

The world can be a stabby, insane place. These sanity checks keep your snacks safe.


###  Booleans

<code><strong>isUsefulBoolean</strong>( b )</code>. 
Not `null` or `undefined` or `NaN` or anything else. Strictly `true` or `false`. Note that `instance of Boolean` and `typeof b === 'boolean'` would _not_ do the trick here. (See the [code comments](https://github.com/stewdio/snacks-js/blob/main/snacks.js#L23-L43) for details.) This is the simplest sanity check and already JavaScript has gotchas.  
<code><strong>isNotUsefulBoolean</strong>( b )</code>.
Inverts the above logic.


###  Numbers

<code><strong>isUsefulNumber</strong>( n )</code>.  Returns true if `n` is a numeric, finite number. It’s just a [hair trickier](https://github.com/stewdio/snacks-js/blob/main/snacks.js#L52-L79) than you’d expect. But we’ve got you covered.  
<code><strong>isNotUsefulNumber</strong>( n )</code>. Inverts the above logic.  
<code><strong>isUsefulInteger</strong>( n )</code>. 
Adds integer-checking to `isUsefulNumber`.  
<code><strong>isNotUsefulInteger</strong>( n )</code>. 
Inverts the above logic.  


###  Strings

<code><strong>isString</strong>( s )</code>. 
Is it? (Does _not_ include [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).)  
<code><strong>isEmptyString</strong>( s )</code>.
Is it a `String` with a `length` of exactly zero?  
<code><strong>isNonEmptyString</strong>( s )</code>.
Looking for `isString` and a `length` greater than zero.  
<code><strong>isUsefulString</strong>( s )</code>. 
Currently this is pegged to `isNonEmptyString`, though I could see arguments for otherwise.  
<code><strong>isNotUsefulString</strong>( s )</code>. 
Inverts the above logic.  


###  Arrays

<code><strong>isArray</strong>( a )</code>.  
<code><strong>isNotArray</strong>( a )</code>.  
<code><strong>isEmptyArray</strong>( a )</code>.  
<code><strong>isNotEmptyArray</strong>( a )</code>.  
<code><strong>isUsefulArray</strong>( a )</code>.  
__`arrayCount`__. What’s the difference between your grandma’s `Array.prototype.length` and `arrayCount`?  We only count the _defined_ entries—very useful for determining how many elements are actually in a [sparse Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections). 




##  Unitless goodies


###  Operators

How about some higher order logic that feels a bit like Lisp / Scheme? Bonus: These functions allow you to juggle _relative_ numeric values in addition to your normal, every day, absolutely-defined values.

`OPERATORS`. Object containing operator methods (and their common symbols / names) for the usual suspects like addition, subtraction, and so on.  
<code><strong>operate</strong>( operatorObject, ...args )</code>.  
<code><strong>parseRelativeNumber</strong>( a )</code>.  
<code><strong>applyRelativeNumber</strong>( a )</code>.  


###  Randomness

`random`  
`randomBetween`  
`randomInteger`  
`randomIntegerBetween`  


###  Misc unitless

`clamp`  
`round`  
`normalize`  
`normalize01`  
`lerp`  
`mapRange`  
`average`  
`circularAverage`  
`ratioToQuotient`  
`copySign`  
`signedPower`  


##  Geometry (and trigonometry)

`PI`. Alias for `Math.PI`.  
`TAU`. `Math.PI` × 2.  
`degreesToRadians`  
`radiansToDegrees`  
`radiansToPointsArray`  
`wrapToRange`  
`normalizeAngle`  
`polarToCartesian`  
`rotateCartesian`  
`findMidpoint`  
`distance2D`  


##  Color

`floatToHex`  
`hslToRgb`  


##  Metric system

`QUETTA`  
`RONNA`  
`YOTTA`  
`ZETTA`  
`EXA`  
`PETA`  
`TERA`  
`GIGA`  
`MEGA`  
`KILO`  
`HECTO`  
`DEKA`  
`UNIT`  
`DECI`  
`CENTA`  
`MILLI`  
`MICRO`  
`NANO`  
`PICO`  
`FEMTO`  
`ATTO`  
`ZEPTO`  
`YOCTO`  
`RONTO`  
`QUECTO`  
`convertMetric`  


##  Misc

`compareArraysByElementProperty`  
`timeAgo`  
`numberToFullWidthChars`  
`toSentenceCase`   
`toCamelCase`  
`css`  



