type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type BuiltIn =
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | ((...args: unknown[]) => unknown);

/**
 * deeply makes every property in T optional and allows null at every nested level.
 * - the top-level T itself is not made nullable; only its properties and nested values are.
 * - primitives and built-in objects (Date, RegExp, Map, Set, WeakMap, WeakSet, functions) are treated as leaves and not recursed into.
 * - arrays have each element recursed with DeepPartial, and the array itself becomes `| null | undefined` when it appears as a nested value.
 */
export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends BuiltIn
    ? T
    : T extends (infer U)[]
      ? DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> | null }
        : T;
