/** @see https://github.com/fantasyland/fantasy-land#functor */
export interface FunctorNone<T> {
  'fantasy-land/map'<U = T>(f: (value: T) => U): None<U>
}

/** @see https://github.com/fantasyland/fantasy-land#functor */
export interface FunctorSome<T> {
  'fantasy-land/map'<U = T>(f: (value: T) => null): None<U>
  'fantasy-land/map'<U = T>(f: (value: T) => U): Some<U>
}

/** @see https://github.com/fantasyland/fantasy-land#chain */
export interface ChainNone<T> {
  /* alias for flatMap */
  'fantasy-land/chain'<U = T>(f: (value: T) => Some<U>): None<T>
  'fantasy-land/chain'<U = T>(f: (value: T) => None<U>): None<T>
}

/** @see https://github.com/fantasyland/fantasy-land#chain */
export interface ChainSome<T> {
  /* alias for flatMap */
  'fantasy-land/chain'<U = T>(f: (value: T) => Some<U>): Some<U>
  'fantasy-land/chain'<U = T>(f: (value: T) => None<U>): None<T>
}

/** @see https://github.com/fantasyland/fantasy-land#apply */
/** @see https://github.com/fantasyland/fantasy-land#applicative */
export interface ApplicativeNone<T> {
  'fantasy-land/ap'(a: Some<(v: T) => T>): None<T>
  constructor: {
    'fantasy-land/of': typeof Option
  }
}

/** @see https://github.com/fantasyland/fantasy-land#apply */
/** @see https://github.com/fantasyland/fantasy-land#applicative */
export interface ApplicativeSome<T> {
  'fantasy-land/ap'(a: Some<(v: T) => null>): None<T>
  'fantasy-land/ap'(a: Some<(v: T) => T>): Some<T>
  constructor: {
    'fantasy-land/of': typeof Option
  }
}

/** @see https://github.com/fantasyland/fantasy-land#applicative */
export interface ApplicativeStatic {
  'fantasy-land/of': typeof Option
}

/** @see https://github.com/fantasyland/fantasy-land#monad */
export interface MonadNone<T> extends ApplicativeNone<T>, FunctorNone<T>, ChainNone<T> {}

/** @see https://github.com/fantasyland/fantasy-land#monad */
export interface MonadSome<T> extends ApplicativeSome<T>, FunctorSome<T>, ChainSome<T> {}

export interface None<T> extends MonadNone<T> {
  flatMap<U = T>(f: (value: T) => Some<U>): None<T>
  flatMap<U = T>(f: (value: T) => None<U>): None<T>
  getOrElse<U extends T>(def: U): U
  isEmpty(): this is None<T>
  map<U = T>(f: (value: T) => U): None<U>
  nonEmpty(): this is Some<T>
  orElse<U extends T>(alternative: None<U>): None<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  toString(): string
}

export interface Some<T> extends MonadSome<T> {
  flatMap<U = T>(f: (value: T) => Some<U>): Some<U>
  flatMap<U = T>(f: (value: T) => None<U>): None<T>
  get(): T
  getOrElse<U extends T>(def: U): T
  isEmpty(): this is None<T>
  map<U = T>(f: (value: T) => null): None<U>
  map<U = T>(f: (value: T) => U): Some<U>
  nonEmpty(): this is Some<T>
  orElse<U extends T>(alternative: None<U>): Some<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  toString(): string
}

export type Option<T> = Some<T> | None<T>

export function None<T>(): None<T> {

  let flatMap = <U>(_f: (value: T) => Option<U>): None<U> => None<U>()
  let map = <U>(_f: (value: T) => U): any => none

  let none: None<T> = {
    flatMap,
    getOrElse: <U extends T>(def: U) => def,
    isEmpty: () => true,
    map,
    nonEmpty: () => false,
    orElse: <U extends T>(alternative: Option<U>): any => alternative,
    toString: () => 'None',

    // fantasyland
    constructor: {
      'fantasy-land/of': Option
    },
    'fantasy-land/ap': (_a: Some<(v: T) => T | null>): any => none,
    'fantasy-land/chain': flatMap,
    'fantasy-land/map': map
  }

  return none
}

export function Some<T>(value: T): Option<T> {

  if (value == null) {
    return None<T>()
  }

  let flatMap = <U>(f: (value: T) => Option<U>): any => f(value)
  let map = <U>(f: (value: T) => U): any => {
    let v = f(value)
    if (v === value as any) {
      return some // obey functor identity law
    }
    return Option(v)
  }

  let some: Some<T> = {
    flatMap,
    get: () => value,
    getOrElse: <U extends T>(def: U): T | U  => value || def,
    isEmpty: () => false,
    map,
    nonEmpty: () => true,
    orElse: <U extends T>(_alternative: Option<U>): any => Some(value),
    toString: () => `Some(${value})`,

    // fantasyland
    constructor: {
      'fantasy-land/of': Option
    },
    'fantasy-land/ap': (a: Some<(v: T) => T | null>): any => {
      let v = a.get()(value)
      if (v === value) {
        return some
      }
      return Option(v)
    },
    'fantasy-land/chain': flatMap,
    'fantasy-land/map': map
  }

  return some
}

export type OptionStatic = ApplicativeStatic & {
  'fantasy-land/empty'<T>(): None<T>
  'fantasy-land/zero'<T>(): None<T>
  <T>(value: T): Some<T>
}

export let Option: OptionStatic = (<T>(value: T | null) => {
  if (value == null) {
    return None<T>()
  }
  return Some(value)
}) as OptionStatic

Option['fantasy-land/of'] = Option
Option['fantasy-land/empty'] = <T>() => None<T>()
Option['fantasy-land/zero'] = <T>() => None<T>()
