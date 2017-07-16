import { AssertContext, test } from 'ava'
import * as fl from 'fantasy-land'
import { Option } from './'
const {ap, chain, map, of} = fl

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
  t.is(option[map](_ => _), option)
})
test('None:functor:identity', t => {
  let option = Option(null)
  t.is(option[map](_ => _), option)
})

test('Some:functor:composition', t => {
  let option = Option(1)
  let f = (_: number) => _ * 7
  let g = (_: number) => _ % 5
  is(t)(option[map](_ => f(g(_))), option[map](g)[map](f))
})
test('None:functor:composition', t => {
  let option = Option<number>(null)
  let f = (_: number) => _ * 7
  let g = (_: number) => _ % 5
  is(t)(option[map](_ => f(g(_))), option[map](g)[map](f))
})

test('Some:apply:composition', t => {
  type N = (_: number) => number
  let a = Option<N>(_ => _ * 7)
  let v = Option(2)
  let u = Option<N>(_ => _ % 5)
  let z = a[map]((f: N) => (g: N): ((x: number) => number) => (x: number): number => f(g(x)))
  is(t)(
    v[ap](u[ap](z)),
    v[ap](u)[ap](a)
  )
})
test('None:apply:composition', t => {
  type N = (_: number) => number
  let a = Option<N>(_ => _ * 7)
  let v = Option(null)
  let u = Option<N>(_ => _ % 5)
  let z = a[map]((f: N) => (g: N): ((x: number) => number) => (x: number): number => f(g(x)))
  is(t)(
    v[ap](u[ap](z)),
    v[ap](u)[ap](a)
  )
})

test('Some:applicative:identity', t => {
  let a = Option(1)
  t.is(a[ap](Option[of]((_: number) => _)), a)
})
test('None:applicative:identity', t => {
  let a = Option<number>(null)
  t.is(a[ap](Option[of]((_: number) => _)), a)
})

test('Some:applicative:homomorphism', t => {
  let f = (_: number) => _ * 7
  is(t)(
    Option[of](1)[ap](Option[of](f)),
    Option[of](f(1))
  )
})
test('None:applicative:homomorphism', t => {
  let f = (_: null) => null
  is(t)(
    Option[of]<null>(null)[ap](Option[of](f)),
    Option[of]<null>(f(null))
  )
})

test('Some:applicative:interchange', t => {
  type N = (_: number) => number
  let y = 1
  let u = Option<N>(_ => _ * 7)
  is(t)(
    Option[of](y)[ap](u),
    u[ap](Option[of]<(f: N) => any>(f => f(y))) // TODO: rm any
  )
})

test('Some:chain:associativity', t => {
  let option = Option(1)
  let f = (_: number) => Option(_ * 7)
  let g = (_: number) => Option(_ % 5)
  is(t)(
    option[chain](f)[chain](g),
    option[chain](x => f(x)[chain](g))
  )
})
test('None:chain:associativity', t => {
  let option = Option<number>(null)
  let f = (_: number) => Option(_ * 7)
  let g = (_: number) => Option(_ % 5)
  is(t)(
    option[chain](f)[chain](g),
    option[chain](x => f(x)[chain](g))
  )
})

test('Some:monad:left identity', t => {
  let f = (_: number) => Option(_ * 7)
  is(t)(
    Option[of](1)[chain](f),
    f(1)
  )
})
test('None:monad:left identity', t => {
  let f = (_: number | null) => Option<number>(null)
  is(t)(
    Option[of]<number>(null)[chain](f),
    f(null)
  )
})

test('Some:monad:right identity', t => {
  is(t)(
    Option(1)[chain](Option[of]),
    Option(1)
  )
})
test('None:monad:right identity', t => {
  is(t)(
    Option(null)[chain](Option[of]),
    Option(null)
  )
})

function is(t: AssertContext) {
  return <T>(a: Option<T>, b: Option<T>) => {
    if (a.isEmpty() && b.isEmpty()) {
      return t.is(a.isEmpty(), b.isEmpty())
    }
    if (a.nonEmpty() && b.nonEmpty() && a.get() === b.get()) {
      return t.is(a.get(), b.get())
    }
    t.fail(`Option ${a} != Option ${b}`)
  }
}
