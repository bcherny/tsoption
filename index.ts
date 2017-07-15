/** @see https://github.com/fantasyland/fantasy-land#functor */
export interface FunctorNone<T> {
  map<U = T>(f: (value: T) => U): None<U>
}

/** @see https://github.com/fantasyland/fantasy-land#functor */
export interface FunctorSome<T> {
  map<U = T>(f: (value: T) => null): None<U>
  map<U = T>(f: (value: T) => U): Some<U>
}

/** @see https://github.com/fantasyland/fantasy-land#chain */
export interface ChainNone<T> {
  /* alias for flatMap */
  chain<U = T>(f: (value: T) => Some<U>): None<T>
  chain<U = T>(f: (value: T) => None<U>): None<T>
}

/** @see https://github.com/fantasyland/fantasy-land#chain */
export interface ChainSome<T> {
  /* alias for flatMap */
  chain<U = T>(f: (value: T) => Some<U>): Some<U>
  chain<U = T>(f: (value: T) => None<U>): None<T>
}

// interface ApplyNone<T> {
//   // ap<U>(option: None<U>): None<U>
//   ap<U, V extends Some<(value: U) => U>>(option: V): None<U>
//   constructor: {
//     of: typeof Option
//   }
// }

// interface ApplySome<T> {
//   // ap<U>(option: None<U>): None<U>
//   ap(f: ApplySome<T>): Some<T>
//   constructor: {
//     of: typeof Option
//   }
// }

/** @see https://github.com/fantasyland/fantasy-land#monad */
export interface MonadNone<T> extends FunctorNone<T>, ChainNone<T> {}

/** @see https://github.com/fantasyland/fantasy-land#monad */
export interface MonadSome<T> extends FunctorSome<T>, ChainSome<T> {}

export interface None<T> extends MonadNone<T> {
  flatMap<U = T>(f: (value: T) => Some<U>): None<T>
  flatMap<U = T>(f: (value: T) => None<U>): None<T>
  getOrElse<U extends T>(def: U): U
  isEmpty(): true
  nonEmpty(): false
  orElse<U extends T>(alternative: None<U>): None<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  toString(): string
}

export interface Some<T> extends MonadSome<T> {
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

  let flatMap = <U>(_f: (value: T) => Option<U>): None<U> => None<U>()

  let none: None<T> = {
    flatMap,
    getOrElse: <U extends T>(def: U) => def,
    isEmpty: () => true,
    nonEmpty: () => false,
    orElse: <U extends T>(alternative: Option<U>): any => alternative,
    toString: () => 'None',

    // fantasyland
    chain: flatMap,
    map: <U>(_f: (value: T) => U): any => none
  }

  return none
}

export function Some<T>(value: T): Option<T> {

  if (value == null) {
    return None<T>()
  }

  let flatMap = <U>(f: (value: T) => Option<U>): any => f(value)

  let some: Some<T> = {
    flatMap,
    get: () => value,
    getOrElse: <U extends T>(def: U): T | U  => value || def,
    isEmpty: () => false,
    nonEmpty: () => true,
    orElse: <U extends T>(_alternative: Option<U>): any => Some(value),
    toString: () => `Some(${value})`,

    // fantasyland
    chain: flatMap,
    map: <U>(f: (value: T) => U): any => {
      let v = f(value)
      if (v === value as any) {
        return some // obey functor identity law
      }
      return Option(v)
    }
  }

  return some
}

export type ApplicativeStatic = {
  of: typeof Option
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

Option.of = Option
