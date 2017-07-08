type MonadNone<T> = {
  ap<U, V extends Some<(value: U) => U>>(option: V): None<U>
  chain<U>(f: (value: T) => Some<U>): None<T>
  chain<U>(f: (value: T) => None<U>): None<T>
}

type MonadSome<T> = {
  ap<U, V extends Some<(value: U) => U>>(option: V): Some<U>
  chain<U>(f: (value: T) => Some<U>): Some<U>
  chain<U>(f: (value: T) => None<U>): None<T>
}

export type None<T> = MonadNone<T> & {
  flatMap<U>(f: (value: T) => Some<U>): None<T>
  flatMap<U>(f: (value: T) => None<U>): None<T>
}

export type Some<T> = MonadSome<T> & {
  flatMap<U>(f: (value: T) => Some<U>): Some<U>
  flatMap<U>(f: (value: T) => None<U>): None<T>
}

export type Option<T> = Some<T> | None<T>

export function None<T>(): None<T> {}
export function Some<T>(value: T): Option<T> {}

export let Option = <T>(value: T | null) => {
  if (value == null) {
    return None<T>()
  }
  return Some(value)
}
