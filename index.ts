/** @see https://github.com/fantasyland/fantasy-land#functor */
export interface FunctorNone<T> {
  'fantasy-land/map'<U = T>(f: (value: T) => U): None<U>
}

/** @see https://github.com/fantasyland/fantasy-land#functor */
export interface FunctorSome<T> {
  'fantasy-land/map'<U = T>(f: (value: T) => U): Some<U>
}

/** @see https://github.com/fantasyland/fantasy-land#chain */
export interface ChainNone<T> {
  /* alias for flatMap */
  'fantasy-land/chain'<U = T>(f: (value: T) => Option<U>): None<T>
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
  'fantasy-land/ap'(a: Option<(v: T) => T>): None<T>
}

/** @see https://github.com/fantasyland/fantasy-land#apply */
/** @see https://github.com/fantasyland/fantasy-land#applicative */
export interface ApplicativeSome<T> {
  'fantasy-land/ap'(a: Option<(v: T) => T>): Some<T>
}

/** @see https://github.com/fantasyland/fantasy-land#monad */
export interface MonadNone<T> extends ApplicativeNone<T>, FunctorNone<T>, ChainNone<T> {}

/** @see https://github.com/fantasyland/fantasy-land#monad */
export interface MonadSome<T> extends ApplicativeSome<T>, FunctorSome<T>, ChainSome<T> {}

export abstract class Option<T> {

  abstract flatMap<U>(f: (value: T) => Option<U>): Option<U>
  abstract getOrElse<U extends T>(def: U): T | U
  abstract isEmpty(): this is None<T>
  abstract map<U>(f: (value: T) => U): Option<U>
  abstract nonEmpty(): this is Some<T>
  abstract orElse<U extends T>(alternative: Option<U>): Option<T> | Option<U>
  abstract toString(): string

  static of<T = {}>(value?: null | undefined): None<T>
  static of<T>(value?: T): Some<T>
  static of<T>(value?: T | null | undefined): Option<T> {
    return value == null ? new None<T>() : new Some<T>(value)
  }

  // fantasyland

  abstract 'fantasy-land/ap'(a: Option<(v: T) => T>): Option<T>
  abstract 'fantasy-land/chain'<U = T>(f: (value: T) => Option<U>): Option<T>
  abstract 'fantasy-land/map'<U = T>(f: (value: T) => U): Option<U>

  static 'fantasy-land/of'<T>(value: T): Option<T> {
    return new Some(value)
  }
  static 'fantasy-land/empty'<T>() {
    return new None<T>()
  }
  static 'fantasy-land/zero'<T>() {
    return new None<T>()
  }
}

export class None<T> extends Option<T> implements MonadNone<T> {

  flatMap<U>(_f: (value: T) => Option<U>): None<U> {
    return new None<U>()
  }
  getOrElse<U extends T>(def: U) {
    return def
  }
  isEmpty() {
    return true
  }
  map<U>(_f: (value: T) => U): None<U> {
    return new None<U>()
  }
  nonEmpty(): this is Some<T> & false { return false }

  orElse<U extends T>(alternative: None<U>): None<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  orElse<U extends T>(alternative: Some<U> | None<U>): None<T> | Some<U> {
    if (alternative.nonEmpty()) {
      return alternative
    }
    return this
  }
  toString() {
    return 'None'
  }

  // fantasyland
  'fantasy-land/ap'(_a: Option<(v: T) => T>): None<T> {
    return this
  }
  'fantasy-land/chain'<U = T>(f: (value: T) => Option<U>): None<T>
  'fantasy-land/chain'(): None<T> {
    return this
  }
  'fantasy-land/map'<U = T>(_f: (value: T) => U): None<U> {
    return new None<U>()
  }

  static 'fantasy-land/of'<T>() {
    return new None<T>()
  }
}

export class Some<T> extends Option<T> implements MonadSome<T> {

  constructor(private value: T) {
    super()
  }

  flatMap<U = T>(f: (value: T) => Some<U>): Some<U>
  flatMap<U = T>(f: (value: T) => None<U>): None<U>
  flatMap<U = T>(f: (value: T) => Option<U>): Option<U>
  flatMap<U = T>(f: (value: T) => Option<U>): Option<U> {
    return f(this.value)
  }

  get() {
    return this.value
  }

  getOrElse<U extends T>(def: U): T | U {
    return this.value || def
  }

  isEmpty(): this is None<T> & false {
    return false
  }

  map<U>(f: (value: T) => U): Some<U> {
    return new Some(f(this.value))
  }

  nonEmpty(): this is Some<T> & true {
    return true
  }

  orElse<U extends T>(alternative: None<U>): Some<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  orElse<U extends T>(_alternative: Option<U>) {
    return this
  }

  toString() {
    return `Some(${this.value})`
  }

  // fantasyland
  'fantasy-land/ap'(a: Some<(t: T) => T>): Some<T> {
    return a.flatMap(this.map.bind(this))
  }

  'fantasy-land/chain'<U = T>(f: (value: T) => Some<U>): Some<U>
  'fantasy-land/chain'<U = T>(f: (value: T) => None<U>): None<U>
  'fantasy-land/chain'<U = T>(f: (value: T) => Option<U>): Option<U> {
    return f(this.value)
  }

  'fantasy-land/map'<U>(f: (value: T) => U) {
    return this.map(f)
  }

  static 'fantasy-land/of'<T>(value: T) {
    return new Some(value)
  }
}
