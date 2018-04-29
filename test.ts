import { AssertContext, test } from 'ava'
import * as fl from 'fantasy-land'
import { Option, None, Some } from './'
const { ap, chain, map, of } = fl

test('one', t =>
  t.is(new Some(3)
    .flatMap(() => new Some(5))
    .map(() => 'a')
    .orElse(new Some('b'))
    .getOrElse('c'), 'a'))

test('two', t => t.is(Option.of('a')
  .flatMap(() => new None())
  .orElse(Option.of('b'))
  .map(() => 'c')
  .orElse(Option.of('d'))
  .getOrElse('e'), 'c'))

test('three', t => {
  function foo(bar: any): Option<boolean> {
    return Option.of(Option.of(bar).isEmpty())
  }
  let a = foo('abcd').map(s => s.toString())
  t.is(a.getOrElse('bad'), 'false')
})

test('four', t => {
  t.plan(1)
  function foo(x: Option<boolean>) {
    t.is(x.getOrElse(false).toString(), 'true')
  }
  foo(Option.of(true))
})

test('Some#flatMap', t => t.is(Option.of(3).flatMap(_ => Option.of(_ * 2)).get(), 6))
test('Some#flatMap', t => t.is(Option.of(null).flatMap(() => Option.of(2)).isEmpty(), true))

test('Some#get', t => t.is(Option.of(3).get(), 3))

test('Some#getOrElse', t => t.is(Option.of(1).getOrElse(3), 1))
test('None#getOrElse', t => t.is(Option.of(null).getOrElse(3), 3))

test('Some#isEmpty', t => t.is(Option.of(3).isEmpty(), false))
test('None#isEmpty (1)', t => t.is(Option.of(null).isEmpty(), true))
test('None#isEmpty (2)', t => t.is(Option.of(undefined).isEmpty(), true))

test('Some#map', t => t.is(Option.of(3).map(() => 4).getOrElse(5), 4))
test('None#map', t => t.is(Option.of(null).map(() => 4).getOrElse(5), 5))

test('Some#nonEmpty', t => t.is(Option.of(3).nonEmpty(), true))
test('None#nonEmpty (1)', t => t.is(Option.of(null).nonEmpty(), false))
test('None#nonEmpty (2)', t => t.is(Option.of(undefined).nonEmpty(), false))

test('Some#orElse', t => t.is(Option.of(2).orElse(Option.of(3)).get(), 2))
test('None#orElse', t => t.is(Option.of(null).orElse(Option.of(3)).get(), 3))

test('Some#toString', t => t.is(Option.of(3) + '', 'Some(3)'))
test('None#toString', t => t.is(Option.of(null) + '', 'None'))

// fantasyland laws

test('Some:functor:identity', t => {
  let option = Option.of({})
  is(t)(option[map](_ => _), option)
})
test('None:functor:identity', t => {
  let option = Option.of(null)
  is(t)(option[map](_ => _), option)
})

test('Some:functor:composition', t => {
  let option = Option.of(1)
  let f = (_: number) => _ * 7
  let g = (_: number) => _ % 5
  is(t)(option[map](_ => f(g(_))), option[map](g)[map](f))
})
test('None:functor:composition', t => {
  let option = Option.of<number>(null)
  let f = (_: number) => _ * 7
  let g = (_: number) => _ % 5
  is(t)(option[map](_ => f(g(_))), option[map](g)[map](f))
})

test('Some:apply:composition', t => {
  type N = (_: number) => number
  let a = Option.of<N>(_ => _ * 7)
  let v = Option.of(2)
  let u = Option.of<N>(_ => _ % 5)
  let z = a[map]((f: N) => (g: N): ((x: number) => number) => (x: number): number => f(g(x)))
  is(t)(
    v[ap](u[ap](z)),
    v[ap](u)[ap](a)
  )
})
test('None:apply:composition', t => {
  type N = (_: number) => number
  let a = Option.of<N>(_ => _ * 7)
  let v = Option.of<number>(null)
  let u = Option.of<N>(_ => _ % 5)
  let z = a[map]((f: N) => (g: N): ((x: number) => number) => (x: number): number => f(g(x)))
  let af = u[ap](z)
  is(t)(
    v[ap](af),
    v[ap](u)[ap](a)
  )
})

test('Some:applicative:identity', t => {
  let a = Option.of(1)
  let b = Some[of]((_: number) => _)
  let c = a[ap](b)
  is(t)(c, a)
})
test('None:applicative:identity', t => {
  let a = Option.of<number>(null)
  is(t)(a[ap](Option[of]((_: number) => _)), a)
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
  let u = Option.of<N>(_ => _ * 7)
  let s = Option[of]((f: N) => f(y))
  is(t)(
    Option[of](y)[ap](u),
    (u[ap] as any)(s) // TODO: rm any
  )
})

test('Some:chain:associativity', t => {
  let option = Option.of(1)
  let f = (_: number) => Option.of(_ * 7)
  let g = (_: number) => Option.of(_ % 5)
  is(t)(
    option[chain](f)[chain](g),
    option[chain](x => f(x)[chain](g))
  )
})
test('None:chain:associativity', t => {
  let option = Option.of<number>(null)
  let f = (_: number) => Option.of(_ * 7)
  let g = (_: number) => Option.of(_ % 5)
  is(t)(
    option[chain](f)[chain](g),
    option[chain](x => f(x)[chain](g))
  )
})

test('Some:monad:left identity', t => {
  let f = (_: number) => Option.of(_ * 7)
  is(t)(
    Option[of](1)[chain](f),
    f(1)
  )
})
test('None:monad:left identity', t => {
  let f = (_: number | null) => Option.of<null>(null)
  is(t)(
    Option[of](null)[chain](f),
    f(null)
  )
})

test('Some:monad:right identity', t => {
  is(t)(
    Option.of(1)[chain](Some[of]),
    Option.of(1)
  )
})
test('None:monad:right identity', t => {
  is(t)(
    Option.of(null)[chain](Option[of]),
    Option.of(null)
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
