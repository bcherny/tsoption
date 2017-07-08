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

test('three', t => t.is(Option(null)
  .getOrElse(3), 3))

test('four', t => t.is(Option(3).isEmpty(), false))
test('five', t => t.is(Option(null).isEmpty(), true))
test('six', t => t.is(Option(undefined).isEmpty(), true))

test('seven', t => t.is(Option(null)
  .map(() => 4).getOrElse(5), 5))
