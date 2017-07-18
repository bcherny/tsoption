# tsoption [![Build Status][build]](https://circleci.com/gh/bcherny/tsoption) [![npm]](https://www.npmjs.com/package/tsoption) [![mit]](https://opensource.org/licenses/MIT) [![fantasy]](https://github.com/fantasyland/fantasy-land#monad)

[build]: https://img.shields.io/circleci/project/bcherny/tsoption.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/tsoption.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/tsoption.svg?style=flat-square
[fantasy]: https://img.shields.io/badge/Fantasyland-Monad-ff4ba4.svg?style=flat-square

> Correct, easy to use Option type for TypeScript. Like Scala options, but treats Some(null) as None, because TypeScript can. See the [introductory blog post](https://performancejs.com/post/ewff3hj/Options-in-TypeScript).

## Installation

```sh
npm i tsoption -S
```

## Usage

*Note: You can use JavaScript instead of TypeScript, but it's not as fun.*

```ts
let a = Option.from(3)                // Some<number>(3)
  .flatMap(_ => Some(5))              // Some<number>(5)
  .map(_ => 'a')                      // Some<string>('a')
  .orElse(Option.from('b'))           // Some<string>('a')   (non-string type gives a compile error)
  .getOrElse('c')                     // 'a'

let b = Option.from('a')              // Some<string>('a')
  .flatMap(_ => None())               // None<string>()      (flatMap can map to any type)
  .orElse(Option.from('b'))           // Some<string>('b')   (non-string type gives a compile error)
  .get()                              // 'b'
```

## API

```ts
// Create an option
Option.from(3)                        // Some(3)
Option.from('abc')                    // Some('abc')
Option.from(null)                     // None                (for convenience)
Option.from(undefined)                // None                (for convenience)
Some(3)                               // Some(3)
Some(null)                            // Some(null)
None()                                // None

// #flatMap
Some(3).flatMap(_ => Some(_ * 2))     // Some(6)
None().flatMap(() => Some(2))         // None  (known at compile time too!)

// #get
Some(3).get()                         // 3
None().get()                          // COMPILE ERROR! Can't call get() on None

// #getOrElse
Some(1).getOrElse(2)                  // 1
None().getOrElse(2)                   // 2

// #isEmpty
Some(2).isEmpty()                     // false (known at compile time too!)
None().isEmpty()                      // true  (known at compile time too!)

// #map
Some(2).map(_ => _ * 2)               // Option.from(4)
None().map(() => 2)                   // None  (known at compile time too!)

// #nonEmpty
Some(2).nonEmpty()                    // true  (known at compile time too!)
None().nonEmpty()                     // false (known at compile time too!)

// #orElse
Some(2).orElse(Option.from(3))        // Some(2)
None().orElse(Option.from(3))         // Some(3)

// #toString
Some(2).toString()                    // "Some(2)"
None().toString()                     // "None"
```

## Fantasyland

TSOption is [Fantasyland](https://github.com/fantasyland/fantasy-land)-compliant. It implements:

- [x] [Applicative](https://github.com/fantasyland/fantasy-land#applicative)
- [x] [Apply](https://github.com/fantasyland/fantasy-land#apply)
- [x] [Chain](https://github.com/fantasyland/fantasy-land#chain)
- [x] [Functor](https://github.com/fantasyland/fantasy-land#functor)
- [x] [Monad](https://github.com/fantasyland/fantasy-land#monad)

### Fantasyland-Compatible API

```ts
import * as fl from 'fantasy-land'
const {ap, chain, map, of} = fl

// Create an option
Option[of](3)                                // Some(3)
Option[of]('abc')                            // Some('abc')
Option[of](null)                             // None
Option[of](undefined)                        // None
Option[of](3).constructor[of](4)             // Some(4)
Option[of](3).constructor[of](null)          // None

// #chain
Option[of](3)[chain](_ => Option[of](_ * 2)) // Some(6)
Option[of](null)[chain](() => Option[of](2)) // None  (known at compile time too!)

// #map
Option[of](2)[map](_ => _ * 2)               // Option.from(4)
Option[of](null)[map](() => 2)               // None  (known at compile time too!)

// #ap
Option[of](2)[ap](Option[of](_ => _ * 2))    // Option.from(4)
Option[of](null)[ap](Option[of](() => 2))    // None  (known at compile time too!)
```

## Tests

```sh
npm test
```

## License

MIT
