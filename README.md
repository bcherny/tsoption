# tsoption [![Build Status][build]](https://circleci.com/gh/bcherny/tsoption) [![npm]](https://www.npmjs.com/package/tsoption) [![mit]](https://opensource.org/licenses/MIT) [![fantasy]](https://github.com/fantasyland/fantasy-land#monad)

[build]: https://img.shields.io/circleci/project/bcherny/tsoption.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/tsoption.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/tsoption.svg?style=flat-square
[fantasy]: https://img.shields.io/badge/fantasyland-Monad-ff4ba4.svg?style=flat-square

> Correct, easy to use Option type for TypeScript. Like Scala options; see the [introductory blog post](https://performancejs.com/post/ewff3hj/Options-in-TypeScript).

## Installation

```sh
# Using Yarn:
yarn add tsoption

# Or, using NPM:
npm install tsoption --save
```

## Usage

*Note: You can use JavaScript instead of TypeScript, but it's not as fun.*

```ts
let a = Option.of(3)                  // Some<number>(3)
  .flatMap(_ => Some.of(5))           // Some<number>(5)
  .map(_ => 'a')                      // Some<string>('a')
  .orElse(Option.of('b'))             // Some<string>('a')   (non-string type gives a compile error)
  .getOrElse('c')                     // 'a'

let b = Option.of('a')                // Some<string>('a')
  .flatMap(_ => new None)             // None<string>()      (flatMap can map to any type)
  .orElse(Option.of('b'))             // Some<string>('b')   (non-string type gives a compile error)
  .get()                              // 'b'
```

## API

*Note: The types of each of the expressions below are known at compile time.*

```ts
// Create an option
Option.of(3)                            // Some(3)
Option.of('abc')                        // Some('abc')
Option.of(null)                         // None                (for convenience)
Option.of(undefined)                    // None                (for convenience)
Some.of(3)                              // Some(3)
Some.of(null)                           // Some(null)
new Some([1, 2, 3])                     // Some([1, 2, 3])
new None                                // None

// #flatMap
Some.of(3).flatMap(_ => Some.of(_ * 2)) // Some(6)
None.of().flatMap(() => Some.of(2))     // None

// #get
Some.of(3).get()                        // 3
None.of().get()                         // COMPILE ERROR! Can't call get() on None

// #getOrElse
Some.of(1).getOrElse(2)                 // 1
None.of().getOrElse(2)                  // 2

// #isEmpty
Some.of(2).isEmpty()                    // false (known at compile time too!)
None.of().isEmpty()                     // true (known at compile time too!)

// #map
Some.of(2).map(_ => _ * 2)              // Some(4)
None.of().map(() => 2)                  // None (known at compile time too!)

// #nonEmpty
Some.of(2).nonEmpty()                   // true (known at compile time too!)
None.of().nonEmpty()                    // false (known at compile time too!)

// #orElse
Some.of(2).orElse(Option.of(3))         // Some(2)
None.of().orElse(Option.of(3))          // Some(3)

// #toString
Some.of(2).toString()                   // "Some(2)"
None.of().toString()                    // "None"
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
Option[of](3)                           // Some(3)
Option[of]('abc')                       // Some('abc')
Option[of](null)                        // None
Option[of](undefined)                   // None

// #chain
Option[of](3)[chain](_ => Option[of](_ * 2)) // Some(6)
Option[of](null)[chain](() => Option[of](2)) // None (known at compile time too!)

// #map
Option[of](2)[map](_ => _ * 2)          // Some(4)
Option[of](null)[map](() => 2)          // None (known at compile time too!)

// #ap
Option[of](2)[ap](Option[of]((_: number) => _ * 2)) // Some(4)
Option[of](null)[ap](Option[of](() => 2)) // None (known at compile time too!)
```

## Tests

```sh
npm test
```

## License

MIT
