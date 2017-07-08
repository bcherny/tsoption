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

test('Some#getOrElse', t => t.is(Option(1).getOrElse(3), 1))
test('None#getOrElse', t => t.is(Option(null).getOrElse(3), 3))

test('Some#isEmpty', t => t.is(Option(3).isEmpty(), false))
test('None#isEmpty (1)', t => t.is(Option(null).isEmpty(), true))
test('None#isEmpty (2)', t => t.is(Option(undefined).isEmpty(), true))

test('Some#nonEmpty', t => t.is(Option(3).nonEmpty(), true))
test('None#nonEmpty (1)', t => t.is(Option(null).nonEmpty(), false))
test('None#nonEmpty (2)', t => t.is(Option(undefined).nonEmpty(), false))

test('Some#map', t => t.is(Option(3).map(() => 4).getOrElse(5), 4))
test('None#map', t => t.is(Option(null).map(() => 4).getOrElse(5), 5))

test('Some#toString', t => t.is(Option(3) + '', 'Some(3)'))
test('None#toString', t => t.is(Option(null) + '', 'None'))
