import { test } from 'ava'
import { Option } from './'

test('one', t =>
  t.is(Option(3)
    .flatMap(() => Option(5))
    .map(() => 'a')
    .orElse(Option('b'))
    .getOrElse('c'), 'a'))

test('two', t => t.is(Option('a')
  .map(() => null)
  .orElse(Option('b'))
  .map(() => null)
  .orElse(Option('c'))
  .getOrElse('d'), 'c'))

test('Some#flatMap', t => t.is(Option(3).flatMap(_ => Option(_ * 2)).get(), 6))
test('Some#flatMap', t => t.is(Option(null).flatMap(() => Option(2)).isEmpty(), true))

test('Some#get', t => t.is(Option(3).get(), 3))

test('Some#getOrElse', t => t.is(Option(1).getOrElse(3), 1))
test('None#getOrElse', t => t.is(Option(null).getOrElse(3), 3))

test('Some#isEmpty', t => t.is(Option(3).isEmpty(), false))
test('None#isEmpty (1)', t => t.is(Option(null).isEmpty(), true))
test('None#isEmpty (2)', t => t.is(Option(undefined).isEmpty(), true))

test('Some#map', t => t.is(Option(3).map(() => 4).getOrElse(5), 4))
test('None#map', t => t.is(Option(null).map(() => 4).getOrElse(5), 5))

test('Some#nonEmpty', t => t.is(Option(3).nonEmpty(), true))
test('None#nonEmpty (1)', t => t.is(Option(null).nonEmpty(), false))
test('None#nonEmpty (2)', t => t.is(Option(undefined).nonEmpty(), false))

test('Some#orElse', t => t.is(Option(2).orElse(Option(3)).get(), 2))
test('None#orElse', t => t.is(Option(null).orElse(Option(3)).get(), 3))

test('Some#toString', t => t.is(Option(3) + '', 'Some(3)'))
test('None#toString', t => t.is(Option(null) + '', 'None'))

// fantasyland laws

test('Some:functor:identity', t => {
  let option = Option({})
  t.is(option.map(_ => _), option)
})
test('None:functor:identity', t => {
  let option = Option(null)
  t.is(option.map(_ => _), option)
})

test('Some:functor:composition', t => {
  let option = Option(1)
  let f = (_: number) => _ * 7
  let g = (_: number) => _ % 5
  t.is(option.map(_ => f(g(_))).get(), option.map(g).map(f).get())
})
test('None:functor:composition', t => {
  let option = Option<number>(null)
  let f = (_: number) => _ * 7
  let g = (_: number) => _ % 5
  t.is(option.map(_ => f(g(_))).getOrElse(-1), option.map(g).map(f).getOrElse(-1))
})

// test('Some:apply:composition', t => {
//   let option = Option(1)
//   t.is(
//     option.ap(option.ap(a.map(f => g => x => f(g(x))))).get(),
//     option.ap(u).ap(a)
//   )
// })

test('Some:chain:associativity', t => {
  let option = Option(1)
  let f = (_: number) => Option(_ * 7)
  let g = (_: number) => Option(_ % 5)
  t.is(
    option.chain(f).chain(g).get(),
    option.chain(x => f(x).chain(g)).get()
  )
})
test('None:chain:associativity', t => {
  let option = Option<number>(null)
  let f = (_: number) => Option(_ * 7)
  let g = (_: number) => Option(_ % 5)
  t.is(
    option.chain(f).chain(g).getOrElse(-1),
    option.chain(x => f(x).chain(g)).getOrElse(-1)
  )
})

test('Some:monad:left identity', t => {
  let f = (_: number) => Option(_ * 7)
  t.is(
    Option.of(1).chain(f).get(),
    f(1).get()
  )
})
test('None:monad:left identity', t => {
  let f = (_: number | null) => Option<number>(null)
  t.is(
    Option.of<number>(null).chain(f).getOrElse(-1),
    f(null).getOrElse(-1)
  )
})

test('Some:monad:right identity', t => {
  t.is(
    Option(1).chain(Option.of).get(),
    Option(1).get()
  )
})
test('None:monad:right identity', t => {
  t.is(
    Option(null).chain(Option.of).getOrElse(-1),
    Option(null).getOrElse(-1)
  )
})
