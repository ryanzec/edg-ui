import { Directive, input } from '@angular/core';

/**
 * provides typed `$implicit` context narrowing for `<ng-template>` slots that receive data via
 * `let-*`. the generic `TItem` is inferred from the array passed to the required `orgTypedContext`
 * input — the runtime value is unused, only the array's element type is consumed by the static
 * `ngTemplateContextGuard` to narrow the template's `$implicit` value.
 */
@Directive({
  selector: 'ng-template[orgTypedContext]',
})
export class TypedContextDirective<TItem> {
  /**
   * array whose element type defines the type of the template's `$implicit` context. runtime value
   * is unused — only the type is consumed by `ngTemplateContextGuard`.
   */
  public orgTypedContext = input.required<TItem[]>();

  /**
   * narrows the template context's `$implicit` value to `TItem` for the angular template
   * type-checker.
   */
  public static ngTemplateContextGuard<TItem>(
    _directive: TypedContextDirective<TItem>,
    _context: unknown
  ): _context is { $implicit: TItem } {
    return true;
  }
}
