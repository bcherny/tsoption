export type None<T> = {
  flatMap<U = T>(f: (value: T) => Some<U>): None<T>
  flatMap<U = T>(f: (value: T) => None<U>): None<T>
  getOrElse<U extends T>(def: U): U
  isEmpty(): true
  map<U = T>(f: (value: T) => U): None<U>
  nonEmpty(): false
  orElse<U extends T>(alternative: None<U>): None<T>
  orElse<U extends T>(alternative: Some<U>): Some<U>
  toString(): string
}

export type Some<T> = {
  flatMap<U = T>(f: (value: T) => Some<U>): Some<U>
  flatMap<U = T>(f: (value: T) => None<U>): None<T>
  get(): T
  getOrElse<U extends T>(def: U): T
  isEmpty(): false
  map<U = T>(f: (value: T) => null): None<U>
  map<U = T>(f: (value: T) => U): Some<U>
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

export function Option<T>(value: null): None<T>
export function Option<T>(value: T): Some<T>
export function Option<T>(value: T | null) {
  if (value == null) {
    return None<T>()
  }
  return Some(value)
}
