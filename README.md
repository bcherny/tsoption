# tsoption [![Build Status][build]](https://circleci.com/gh/bcherny/tsoption) [![npm]](https://www.npmjs.com/package/tsoption) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/tsoption.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/tsoption.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/tsoption.svg?style=flat-square

> Correct, easy to use Option type for TypeScript

## Installation

```sh
npm i tsoption -S
```

## Usage

*Note: You can use JavaScript instead of TypeScript, but it's not as fun.*

```ts
let a = Option(3)
  .flatMap(_ => Option(5))  // Some(5)
  .map(_ => 'a')            // Some('a')
  .orElse(Option('b'))      // Some('a')   -- non-string type gives a compile error
  .getOrElse('c')           // 'a'

let b = Option('a')         // Some('a')
  .map(() => null)          // None(null)  -- map can map to any type
  .orElse(Option('b'))      // Some('b')   -- non-string type gives a compile error
  .get()                    // 'b'
```

## API

```ts
// Create an option
Option(3)                                // Some(3)
Option('abc')                            // Some('abc')
Option(null)                             // None
Option(undefined)                        // None

// #flatMap
Option(3).flatMap(_ => Option(_ * 2))    // Some(6)
Option(null).flatMap(_ => Option(_ * 2)) // None  (known at compile time too!)

// #get
Option(3).get()                          // 3
Option(null).get()                       // COMPILE ERROR! Can't call get() on None

// #getOrElse
Option(1).getOrElse(2)                   // 1
Option(null).getOrElse(2)                // 2

// #isEmpty
Option(2).isEmpty()                      // false (known at compile time too!)
Option(null).isEmpty()                   // true  (known at compile time too!)

// #map
Option(2).map(_ => _ * 2)                // Option(4)
Option(null).map(() => 2)                // None  (known at compile time too!)

// #nonEmpty
Option(2).nonEmpty()                     // true  (known at compile time too!)
Option(null).nonEmpty()                  // false (known at compile time too!)

// #orElse
Option(2).orElse(Option(3))              // Some(2)
Option(null).orElse(Option(3))           // Some(3)

// #toString
Option(2).toString()                     // "Some(2)"
Option(null).toString()                  // "None"
```

## Tests

```sh
npm test
```

## License

MIT
