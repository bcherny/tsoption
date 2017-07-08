/** @see https://github.com/fantasyland/fantasy-land#functor */
type FunctorNone<T> = {
  map<U = T>(f: (value: T) => U): None<U>
}

/** @see https://github.com/fantasyland/fantasy-land#functor */
type FunctorSome<T> = {
  map<U = T>(f: (value: T) => null): None<U>
  map<U = T>(f: (value: T) => U): Some<U>
}

/** @see https://github.com/fantasyland/fantasy-land#chain */
type ChainNone<T> = {
  /* alias for map */
  chain<U = T>(f: (value: T) => U): None<U>
}

/** @see https://github.com/fantasyland/fantasy-land#chain */
type ChainSome<T> = {
  /* alias for map */
  chain<U = T>(f: (value: T) => null): None<U>
  chain<U = T>(f: (value: T) => U): Some<U>
}

/** @see https://github.com/fantasyland/fantasy-land#monad */
type MonadNone<T> = FunctorNone<T> & ChainNone<T> & {

}

/** @see https://github.com/fantasyland/fantasy-land#monad */
type MonadSome<T> = FunctorSome<T> & ChainSome<T> & {

}

export type None<T> = MonadNone<T> & {
  flatMap<U = T>(f: (value: T) => Some<U>): None<T>
  flatMap<U = T>(f: (value: T) => None<U>): None<T>
  getOrElse<U extends T>(def: U): U
  isEmpty(): true
  nonEmpty(): false
  orElse<U extends T>(alternative: None<U>): None<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  toString(): string
}

export type Some<T> = MonadSome<T> & {
  flatMap<U = T>(f: (value: T) => Some<U>): Some<U>
  flatMap<U = T>(f: (value: T) => None<U>): None<T>
  get(): T
  getOrElse<U extends T>(def: U): T
  isEmpty(): false
  nonEmpty(): true
  orElse<U extends T>(alternative: None<U>): Some<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  toString(): string
}

export type Option<T> = Some<T> | None<T>

export function None<T>(): None<T> {
  return {
    flatMap: <U>(_f: (value: T) => Option<U>): None<U> => None<U>(),
    getOrElse: <U extends T>(def: U) => def,
    isEmpty: () => true,
    map: <U>(_f: (value: T) => U): any => None<T>(),
    nonEmpty: () => false,
    orElse: <U extends T>(alternative: Option<U>): any => alternative,
    toString: () => 'None'
  }
}

export function Some<T>(value: T): Option<T> {

  if (value == null) {
    return None<T>()
  }

  return {
    flatMap: <U>(f: (value: T) => Option<U>): any => f(value),
    get: () => value,
    getOrElse: <U extends T>(def: U): T | U  => value || def,
    isEmpty: () => false,
    map: <U>(f: (value: T) => U): any => Option(f(value)),
    nonEmpty: () => true,
    orElse: <U extends T>(_alternative: Option<U>): any => Some(value),
    toString: () => `Some(${value})`
  }
}

type Applicative = {
  constructor: {
    of<T>(value: T | null): Option<T>
  }
}

type ApplicativeStatic = {
  of<T>(value: T | null): Option<T>
}

export type OptionStatic = ApplicativeStatic & {
  <T>(value: null): None<T>
  <T>(value: T): Some<T>
}

export let Option: OptionStatic = (<T>(value: T | null) => {
  if (value == null) {
    return None<T>()
  }
  return Some(value)
}) as any

Option.of = <T>(value: T | null) =>
  Option(value)
