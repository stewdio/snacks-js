



//  Relax and have a tasty snack :)

const VERSION = '1.0.3'






    ////////////////
   //            //
  //   Sanity   //
 //            //
////////////////


//  BOOLEANS.

function isUsefulBoolean( b ){


	//  Not `null` or `undefined` or `NaN` or anything else.
	//  Strictly YES or NO.
	//  Note that `instance of Boolean` would NOT do the trick here!!
	//  Interesting, no?? Try it:
	//      var x = true
	//      x instanceof Boolean//  Evaluates to `false`.
	//      typeof x//  Evaluates to 'boolean'. 
	//  versus:
	//      var y = new Boolean( true )
	//      y instanceof Boolean//  Evaluates to `true`.
	//      typeof y//  Evaluates to 'object'.
	//  We could do ( typeof b === 'boolean' || b instanceof Boolean )
	//  but `y === true` actually evaluates to `false` which is NOT helpful!
	//  To be “useful” we really do have to narrow it down to this,
	// `new Boolean(…)` be damned!

	return b === true || b === false
}
function isNotUsefulBoolean( b ){

	return !isUsefulBoolean( b )
}


//  NUMBERS.

function isUsefulNumber( n ){

	return (


		//  This seems obvious right?
		//  Handles Number literals, variables that store Number literals,
		//  and even objects created by `new Number()` should you ever do that.

		( typeof n === 'number' || n instanceof Number ) &&
	

		//  While `NaN instanceof Number` evaluates to `false`,
		// `typeof NaN` evaluates to 'number' so `NaN` actually pass thru above.
		//  Time to fix that.

		isNaN( n ) === false && 
		
		
		// `isFinite` uses type coercion, so does NOT guarantee this is a Number. 
		//  Example: `isFinite( null )` becomes `isFinite( 0 )` which evaluates to true.
		//  Thankfully we have already guaranteed that `n` is numeric above.
		//  Note that this replaces `n !== Infinity` 
		//  but also the lesser known gotcha of `n !== -Infinity` !

		isFinite( n )
	)
}
function isNotUsefulNumber( n ){

	return !isUsefulNumber( n )
}
function isUsefulInteger( n ){

	return isUsefulNumber( n ) && Number.isInteger( n )
}
function isNotUsefulInteger( n ){

	return !isUsefulInteger( n )
}


//  STRINGS.

function isString( s ){

	//  Note that in the future we might decided to EXCLUDE 
	//  `s instanceof String`
	//  because of the `eval()` edge case:
	//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
	
	//  Note this does NOT include Template literals.
	//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

	return ( typeof s === 'string' || s instanceof String )
}
function isEmptyString( s ){

	return isString( s ) && s.length === 0
}
function isNonEmptyString( s ){

	return isString( s ) && s.length > 0
}
function isUsefulString( s ){
	
	return isNonEmptyString( s )
}
function isNotUsefulString( s ){

	return !isUsefulString( s )
}


//  ARRAYS.

function isArray( a ){

	return Array.isArray( a )
}
function isNotArray( a ){

	return !isArray( a )
}
function isEmptyArray( a ){

	return isArray( a ) && a.length === 0
}
function isNotEmptyArray( a ){

	return isArray( a ) && a.length > 0
}
function isUsefulArray( a ){

	return isNotEmptyArray( a ) &&
	a.some( function( e ){ 
		
		return e !== undefined
		//  Currently does not ask if isUsefulString( e ), or isUsefulArray( e ), etc.
	})
}
function isNotUsefulArray( a ){

	return !isUsefulArray( a )
}
function arrayCount( a ){

	//  Not the blind “length” but the actual number of values,
	//  even for sparse Arrays.
	//  Replace NonEmpty logic above??
	//    return Object.keys( a ).length
	//  But this still counted `undefined` as an entry!
	return a
	.reduce( function( n, e ){ 
		
		return e === undefined ? n : n + 1

	}, 0 )
}






    ///////////////////
   //               //
  //   Operators   //
 //               //
///////////////////


//  The format of the `symbols` Array is
//  [ 0 ] === OPERATORS[ key ]
//  [ 1..x ] === typical symbols used for this operation.
//  [ y..z ] === other names for this operation.
//  Nice side effect:
//  This allows an operation object to know its `key`
//  because OPERATORS[ key ] === OPERATORS[ key ].symbols[ 0 ].

const OPERATORS = {

	add: { 
		
		symbols: [ 'add', '+', 'addition' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s + x, n ),
		identity: 0
	},
	sub: { 
		
		symbols: [ 'sub', '-', 'subtract', 'subtraction' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s - x, n ),
		identity: 0
	},
	mul: { 
		
		symbols: [ 'mul', '*', 'x', '×', 'mult', 'multiply', 'multiplication' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s * x, n ),
		identity: 1
	},
	div: { 
		
		symbols: [ 'div', '/', '÷', 'divide', 'division' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s / x, n ),
		identity: 1
	},
	mod: { 
		
		symbols: [ 'mod', '%', 'modulo', 'modulus', 'rem', 'remainder' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s / x, n )
	},
	exp: {
		
		symbols: [ 'exp', '^', '**', 'exponent', 'exponentiate', 'exponentiation' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s ** x, n )
	},
	inc: {
		
		symbols: [ 'inc', '++', 'increment' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s ++, n )
	},
	dec: {
		
		symbols: [ 'dec', '--', 'decrement' ],
		method:  ( n, ...args )=> args.reduce(( s, x )=> s --, n )
	}
}
OPERATORS.symbols = Object.values( OPERATORS )
.reduce( function( ops, op ){

	return ops.concat( op.symbols )

}, [])
function operate( o, ...args ){

	let operator
	if( isUsefulString( o )){


		//  If we’ve received a String
		//  then perhaps it’s an operator symbol (or key).

		operator = Object.values( OPERATORS )
		.find( function( op ){

			return op.symbols.indexOf( o.toLowerCase() ) > -1
		})
	}
	else {
		

		//  If we didn’t receive a String
		//  then we’re hoping we received an actual operator object.

		operator = Object.values( OPERATORS )
		.find(( op )=> op === o )
	}


	//  If we don’t have an actual operator to work with
	//  then there’s not much operating we can do!
	//  But if we’ve got a known operator in hand,
	//  all we have to do is apply its method :)
	
	if( !operator ) return null
	return operator.method.apply( this, args )
}


//  Parsing and applying “relative numbers” 
//  makes it easy for your API to accept several sorts of values,
//  like 2, 3.4, -5, '+6', '-7.8', '*9', and so on.
//  If it’s a number, it’s absolute.
//  If it’s a string with certain characteristics,
//  then it’s meant to be applied relative to a
//  pre-existing absolute value. 
// (Not “absolute” in the sense of |-x| === x,
//  but as in, a value relative to an implied numberline,
//  rather than relative to some other value.

function parseRelativeNumber( s ){


	//  If this is NOT a String...
	
	if( isNotUsefulString( s )){
	

		//  Then perhaps it’s a raw Number.
		//  If that’s the case, we’ll consider it additively relative to 0.
		//  Otherwise, return NULL.
		
		if( isNotUsefulNumber( s )) return null
		return { operator: OPERATORS.add, s }
	}


	//  Does our string begin with a known operator symbol?

	s = s.trim()
	let symbol
	const operator = Object.values( OPERATORS )
	.find( function( op ){

		const res = op.symbols
		.find( function( sym ){

			const symMatch = s.startsWith( sym )
			if( symMatch ) symbol = sym//  Need to to note this for later String slicing!
			return symMatch
		})
		return res
	})


	//  Looks like we didn’t find an operator symbol match...

	if( !operator ){

		
		//  Could it be a Number that’s been cast a String? 
		//  If so, we’ll use a trick very similar to above.
		//  Otherwise, return NULL.

		const number = parseFloat( s )
		if( isNotUsefulNumber( number )) return null
		return { operator: OPERATORS.add, number }
	}

	
	//  This is why we needed to note which `symbol` was used;
	//  we need to slice up the input String
	//  in order to get at just the number value itself.

	const number = parseFloat( s.substring( symbol.length ).trim() )


	//  The specific `symbol` used isn’t necessary,
	//  but it might be nice for the caller of this function
	//  to know which specific one was used,
	//  and it’s so easy to send back... 
	//  Why not be kind?

	return { operator, number, symbol }
}
function applyRelativeNumber( absOrRel, rel ){

	let abs
	if( isUsefulNumber( rel ) || 
		isUsefulString( rel )){

		abs = absOrRel
	}
	else {
		
		rel = absOrRel
	}
	rel = parseRelativeNumber( rel )
	if( !rel ) rel = { 
		
		operator: OPERATORS.add, 
		number:   0
	}
	if( typeof abs === 'undefined' ){


		//  This is a subtle but neat trick:
		//  If we only received a relative number
		//  with no absolute value to tie it to,
		//  we can (in some cases)
		//  use the operator’s identity value.

		abs = isUsefulNumber( rel.operator.identity ) ? rel.operator.identity : 0
	}
	const res = operate( rel.operator, abs, rel.number )
	// console.log( abs, rel.symbol, rel.number, rel.operator )
	return res
}






    //////////////////
   //              //
  //   Unitless   //
 //              //
//////////////////


function random( n ){

	return Math.random() * n
}
function randomBetween( a, b ){

	if( a === b ) return Math.random() * a

	const
	min = Math.min( a, b ),
	max = Math.max( a, b ),
	range = max - min

	return Math.random() * range + min
}
function randomInteger( n ){

	return Math.floor( Math.random() * n )
}
function randomIntegerBetween( a, b ){

	return Math.floor( randomBetween( a, b ))
}
function clamp( n, min, max ){

	if( isNotUsefulNumber( max )){
	
		max = min
		min = 0
	}
	return Math.min( Math.max( n, min ), max )
}
function round( n, e ){
	
	if( isNotUsefulInteger( e )) e = 0
	const f = 10 ** e
	return Math.round( n * f ) / f
}
function normalize( n, minOrRange, max ){

	let 
	min   = 0,
	range = minOrRange

	if( isUsefulNumber( max )){
	
		min = minOrRange
		range = max - min
	}
	return ( n - min ) / range
}
function normalize01( n, minOrRange, max ){

	return clamp( normalize( n, minOrRange, max ), 0, 1 )
}
function lerp( n, minOrRange, max ){

	let 
	min   = 0,
	range = minOrRange

	if( isUsefulNumber( max )){
	
		min = minOrRange
		range = max - min
	}
	return min + range * n
}
function mapRange( value, min1, max1, min2, max2 ){
 
	return min2 + ( max2 - min2 ) * (( value - min1 ) / ( max1 - min1 ))
}


function alignWeights( numbersArray, weightsArray ){

	if( isNotArray( weightsArray )){
		
		weightsArray = new Array( numbersArray.length )
		.fill( 1 )
	}
	if( weightsArray.length < numbersArray.length ){

		weightsArray = weightsArray
		.concat( new Array( numbersArray.length - weightsArray.length )
		.fill( 1 ))
	}
	const totalWeight = weightsArray
		.reduce( function( sum, weight ){

			return sum + weight

		}, 0 )
	return [ weightsArray, totalWeight ]
}
function average( numbersArray, weightsArray ){

	if( isNotArray( numbersArray )) return false
	if( isEmptyArray( numbersArray )) return 0
	let totalWeight
	[ weightsArray, totalWeight ] = alignWeights( numbersArray, weightsArray )
	
	const 
	weightedTotal = numbersArray
	.reduce( function( sum, n, i ){

		return sum += n * weightsArray[ i ]

	}, 0 )

	return weightedTotal / totalWeight
}
function circularAverage( numbersArray, weightsArray ){

	if( isNotArray( numbersArray )) return false
	if( isEmptyArray( numbersArray )) return 0
	let totalWeight
	[ weightsArray, totalWeight ] = alignWeights( numbersArray, weightsArray )

	const 
	points = numbersArray
	.map( degreesToRadians )
	.map( radiansToPointsArray ),
	weightedTotalX = points
	.reduce( function( sum, point, i ){ 
		
		return sum + point[ 0 ] * weightsArray[ i ]
	
	}, 0 ),
	weightedTotalY = points
	.reduce( function( sum, point, i ){ 
		
		return sum + point[ 1 ] * weightsArray[ i ]
	
	}, 0 )

	let circularAverage = radiansToDegrees( Math.atan2( 
		
		weightedTotalY / totalWeight, 
		weightedTotalX / totalWeight 
	))
	if( circularAverage < 0 ){
		
		circularAverage += 360
	}
	return circularAverage
}


/*


Example problem:
Hues don’t “feel” evenly distributed on the HSL color wheel. 
There’s a whole lot of green no-man’s land between 80˚ and 140˚.

Incoming value is between 0 and 360.


Input:   0     45    90    135   180   225   270   315   360
         |         / \         /\                        | 
		 |        /   \       /  \                       |
 Output:  0   35  55     110       190 210 240 280   320 360
         Red Org Ylw    Grn       LtB Blu Ind Prp    Mgn Red


LOW should be INCLUSIVE
HIGH should be EXCLUSIVE

SHRINK in  0.. 80 ->   0..45
EXPAND in 80.. 90 ->  45..100
SHRINK in 90..170 -> 100..130
etc

** the remapping needs to be clamped! 
** if the value is outside of the remap instructions, just return the original value!

value = n
rules = [

	[ low IN, high IN, low OUT, high OUT ]
]


*/

function mapDelux( value, rules ){

	//  TK !
}


//  Difference is these remappings are CLAMPED just to the remapping range!

function mapRanges( numberOrList, listOfMaps ){

	//  Map 45˚ to 90˚ --> 50˚ to 270 ?
	if( isUsefulNumber( numberOrList )){

		listOfMaps.forEach( function(){


		})
	}
	else if( numberOrList instanceof Array ){

		return numberOrList.map( function(){

			//  Do each remap and return 
			listOfMaps.forEach()
		})
	}
	return NaN
}


//  Expecting a String
//  containing two numbers
//  separated by a single symbol indicating proportional relationship.

function ratioToQuotient( ratioString ){

	const numbers = ratioString
		.trim()
		.replace( /\:|᛬|\/|÷|➗|x|×|✖️|✕|✖/g, ',' )
		.split( ',' )
		.map( function( n ){

			return parseFloat( n )
		})
	if( numbers.length !== 2 ) return NaN
	return numbers[ 0 ] / numbers[ 1 ]
}


//  Returns a number with the magnitude of x and the sign of y.
//  Credit to @winwaed: https://github.com/winwaed/superellipse/blob/master/SuperEllipse.py

function copySign( x, y ){

	return Math.abs( x ) * Math.sign( y )
}


//  Returns x to the power y while preserving the sign of x.
//  This allows us to plot all four quadrants with a single loop
//  and no additional sign logic.
//  Credit to @winwaed: https://github.com/winwaed/superellipse/blob/master/SuperEllipse.py

function signedPower( x, y ){

	return copySign( Math.abs( x ) ** y, x )
}






    //////////////////
   //              //
  //   Geometry   //
 //              //
//////////////////


const 
PI  = Math.PI,    //  π
TAU = Math.PI * 2,//  τ

function degreesToRadians( degrees ){

	return degrees * Math.PI / 180
}
function radiansToDegrees( radians ){

	return radians * 180 / Math.PI
}
function radiansToPointsArray( radians ){

	return [ Math.cos( radians ), Math.sin( radians )]
}
function wrapToRange( n, range ){

	while( n < 0 ) n += range
	return n % range
}
function normalizeAngle( radians ){
	
	if( radians < 0 ) return TAU - ( Math.abs( radians ) % TAU )
	return radians % TAU
}
function polarToCartesian( radius, theta, centerX = 0, centerY = 0 ){
	
	return [ 

		centerX + Math.cos( theta ) * radius, 
		centerY + Math.sin( theta ) * radius
	]
}
function rotateCartesian( x, y, radians ){
	
	return [
	
		Math.cos( radians ) * x - Math.sin( radians ) * y,
		Math.sin( radians ) * x + Math.cos( radians ) * y
	]
}
function findMidpoint( a, b, av, bv, range ){

	if( isNotUsefulNumber( av )) av = 1
	if( isNotUsefulNumber( bv )) bv = 1


	//  It’s likely we’re finding a point between two angles
	//  given in radians (a range of 0..2π, and 2π = TAU).
	//  But it’s trivial to specify the range as 0..360˚ instead.

	if( isNotUsefulNumber( range )) range = TAU
	const halfRange = range / 2


	//  Let’s start out be ensuring that both numbers 
	//  are within our wrapped range.
	
	const
	aWrapped = wrapToRange( a, range ),
	bWrapped = wrapToRange( b, range )


	//  Now we’ll find the shortest span between these numbers.
	//  We’ll use this example:
	//  a     =  15˚
	//  b     = 355˚
	//  range = 360˚

	let
	smaller  = aWrapped,
	smallerV = av,
	larger   = bWrapped,
	largerV  = bv,
	diff     = larger - smaller


	//  Did we goof by confusing which value was smaller?
	//  That’s easily fixable.

	if( larger < smaller ){
	
		const tempN = larger
		larger  = smaller
		smaller = tempN
		diff    = larger - smaller
		const tempV = largerV
		largerV  = smallerV
		smallerV = tempV
	}


	//  At this point we find that diff === 340˚,
	//  but we know from experience that 
	//  15˚ and 355˚ are actually only 20˚ apart.
	//  Let’s fix that.

	if( diff > halfRange ){
	
		const tempN = larger
		larger  = smaller + range
		smaller = tempN
		diff    = larger - smaller
		const tempV = largerV
		largerV  = smallerV
		smallerV = tempV
	}
	

	//  Decide where in that range we should pick a value.
	
	const 
	smallerVAbs = Math.abs( smallerV ),
	largerVAbs  = Math.abs( largerV ),
	velocitiesTotal = smallerVAbs + largerVAbs,
	weight   = norm( smallerVAbs, velocitiesTotal ),
	midPoint = lerp( smallerVAbs, largerVAbs, weight )

	// ********** the above may be wrong as
	//  smaller or larger may have negative values...
	//  how do we pick the sign value????????!?!?!?!
	
	/*console.log( 
	
		'\n a˚ ', round( radiansToDegrees( a ), 2 ),
		'\n a v', round( av, 2 ),
		'\n b˚ ', round( radiansToDegrees( b ), 2 ),
		'\n b v', round( bv, 2 ),
		'\n range:',   range,
		'\n smaller˚ ', round( radiansToDegrees( smaller ), 2 ),
		'\n larger˚  ', round( radiansToDegrees( larger ), 2 ),
		'\n diff˚    ', round( radiansToDegrees( diff ), 2 ),
		'\n weight   ', round( weight, 2 ),
		'\n midPoint˚', round( radiansToDegrees( midPoint ), 2 )
	)*/
	return midPoint	
}
function distance2D( x1, x2, y1, y2 ){

	const
	a = x2 - x1,
	b = y2 - y1,
	d = Math.hypot( a, b )

	return d
}






    ///////////////
   //           //
  //   Color   //
 //           //
///////////////


function floatToHex( color ){
	
	return '#' + color.map( c => ( c * 255 ).toString( 16 ).padStart( 2, '0' )).join( '' )
}


//  Expects HSL --> 0..360˚, 0..100%, 0..100%.
//  and outputs RGB 0..255

function hslToRgb( h, s, l ){
	
	h /= 360
	s /= 100
	l /= 100
	let r, g, b
	if( s === 0 ){
	
		r = g = b = l//  Achromatic (grayscale)
	} 
	else {
		
		function hue2rgb( p, q, t ){

			if( t < 0 ) t += 1
			if( t > 1 ) t -= 1
			if( t < 1 / 6 ) return p + ( q - p ) * 6 * t
			if( t < 1 / 2 ) return q
			if( t < 2 / 3 ) return p + ( q - p ) * ( 2 / 3 - t ) * 6
			return p
		}

		const 
		q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q

		r = hue2rgb( p, q, h + 1 / 3 )
		g = hue2rgb( p, q, h )
		b = hue2rgb( p, q, h - 1 / 3 )
	}
	const rgb = [

		r = Math.round( r * 255 ),
		g = Math.round( g * 255 ),
		b = Math.round( b * 255 )
	]
	return rgb
}






    ///////////////////////
   //                   //
  //   Metric system   //
 //                   //
///////////////////////


//  Metrics unit prefixes. 
//  https://www.nist.gov/pml/owm/metric-si-prefixes

QUETTA =  30,
RONNA  =  27,
YOTTA  =  24,
ZETTA  =  21,
EXA    =  18,
PETA   =  15,
TERA   =  12,
GIGA   =   9,
MEGA   =   6,
KILO   =   3,
HECTO  =   2,
DEKA   =   1,
UNIT   =   0,
DECI   =  -1,
CENTA  =  -2,
MILLI  =  -3,
MICRO  =  -6,
NANO   =  -9,
PICO   = -12,
FEMTO  = -15,
ATTO   = -18,
ZEPTO  = -21,
YOCTO  = -24,
RONTO  = -27,
QUECTO = -30


//  Example: 
//  convertMetric( 4.7, KILO, NANO )
//  convertMetric( 4.7, 3, -9 )
//  4.7 * 10 ** ( 3 + 9 )
//  4.7 * 10 ** 12
//  4,700,000,000,000

function convertMetric( n, from, to ){

	return n * 10 ** ( from - to )
}






    //////////////
   //          //
  //   Misc   //
 //          //
//////////////


function compareArraysByElementProperty( a, b, property ){

	const 
	propsA  = new Set( a.map( e => e[ property ])),
	propsB  = new Set( b.map( e => e[ property ])),
	inBoth  = a.filter( e =>  propsB.has( e[ property ])),
	onlyInA = a.filter( e => !propsB.has( e[ property ])),
	onlyInB = b.filter( e => !propsA.has( e[ property ]))

	return { inBoth, onlyInA, onlyInB }
}


function timeAgo( timestamp, now ){
  	
	if( typeof now === 'undefined' ) now = new Date()
	
	const 
	past      = new Date( timestamp ),
	timeDiff  = now.getTime() - past.getTime(),
	seconds   = Math.floor( timeDiff / 1000 ),
	minutes   = Math.floor( seconds / 60 ),
	hours     = Math.floor( minutes / 60 ),
	days      = Math.floor( hours / 24 ),
	months    = Math.floor( days / 30 ),
	years     = Math.floor( months / 12 ),
	decades   = Math.floor( years / 10 ),
	centuries = Math.floor( decades / 10 )

	if( seconds < 60 ){
		return seconds < 5 ? 'just now' : `${ seconds } seconds`
	}
	else if( minutes < 60 ){
	
		return `${ minutes } minute${ minutes === 1 ? '' : 's' }`
	}
	else if( hours < 24 ){
	
		return `${ hours } hour${ hours === 1 ? '' : 's' }`
	} 
	else if( days < 30 ){
	
		return `${ days } day${ days === 1 ? '' : 's' }`
	}
	else if( months < 12 ){
		
		return `${ months } month${ months === 1 ? '' : 's' }`
	} 
	else if( years < 10 ){

		return `${ years } year${ years === 1 ? '' : 's' }`
	}
	else if( decades < 10 ){
	
		return `${ decades } decade${ decades === 1 ? '' : 's' }`
	}
	else return `${ centuries } ${ centuries === 1 ? 'century' : 'centuries' }`
}


function numberToFullWidthChars( d ){
	
	if( typeof d === 'string' ) d = parseInt( d, 10 )
	if( isNotUsefulInteger( d )) return null
	const fullWidthChars = '０１２３４５６７８９'
	return d
	.toString()
	.split( '' )
	.reduce( function( output, item ){
	
		return output + fullWidthChars.charAt( item.charCodeAt( 0 ) - 48 )

	}, '' )
}


function toSentenceCase( str ){

	if( typeof str !== 'string' ) return null
	return str.charAt( 0 ).toUpperCase() + 
		str.slice( 1 )//.toLowerCase()
}
function toCamelCase( str ){
			
	if( typeof str !== 'string' ) return null
	const split  = str.split( /\W+|_+/ )
	let joined = split[ 0 ]
	for( let i = 1; i < split.length; i ++ )
		joined += toSentenceCase( split[ i ] )
	return joined
}


//  Useful defaults to mirror as CSS variables
//  in your stylesheets.

const css = {

	leading:     24,
	leadingHalf: 12,
	columnWidth: 24 * 2,
	fontSize:    16
}






    ////////////////////
   //                //
  //   Snack menu   //
 //                //
////////////////////


export {

	VERSION,


	//  Sanity.

	isUsefulBoolean,
	isNotUsefulBoolean,
	
	isUsefulNumber,
	isNotUsefulNumber,
	isUsefulInteger,
	isNotUsefulInteger,
	
	isString,
	isEmptyString,
	isNonEmptyString,
	isUsefulString,
	isNotUsefulString,
	
	isArray,
	isNotArray,
	isEmptyArray,
	isNotEmptyArray,
	isUsefulArray,
	arrayCount,


	//  Unitless goodies. 

	OPERATORS,
	operate,	
	parseRelativeNumber,
	applyRelativeNumber,

	random,
	randomBetween,
	randomInteger,
	randomIntegerBetween,
	
	clamp,
	round,
	normalize,
	normalize01,
	lerp,
	mapRange,
	average,
	circularAverage,
	//mapDelux,
	//mapRanges,
	ratioToQuotient,
	copySign,
	signedPower,


	//  Geometry (and trigonometry).
	
	PI,
	TAU,
	degreesToRadians,
	radiansToDegrees,
	radiansToPointsArray,
	wrapToRange,
	normalizeAngle,
	polarToCartesian,
	rotateCartesian,
	findMidpoint,
	distance2D,


	//  Color.

	floatToHex,
	hslToRgb,


	//  Metric system.
	
	QUETTA,
	RONNA ,
	YOTTA ,
	ZETTA ,
	EXA   ,
	PETA  ,
	TERA  ,
	GIGA  ,
	MEGA  ,
	KILO  ,
	HECTO ,
	DEKA  ,
	UNIT  ,
	DECI  ,
	CENTA ,
	MILLI ,
	MICRO ,
	NANO  ,
	PICO  ,
	FEMTO ,
	ATTO  ,
	ZEPTO ,
	YOCTO ,
	RONTO ,
	QUECTO,
	convertMetric,


	//  Misc.

	compareArraysByElementProperty,
	timeAgo,
	numberToFullWidthChars,
	toSentenceCase,
	toCamelCase,
	css
}