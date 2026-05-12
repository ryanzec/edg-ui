---
alwaysApply: true
---
# Detecting Output Has Listener

When you need to detect if an `output()` of a component has a listener, you need to use an RxJS Subject and the `outputFromObservable()` helper method. The pattern looks like this:
```ts
export class Table<T = unknown> {
  private readonly _rowClicked$ = new Subject<T>();

  public readonly rowClicked = outputFromObservable(this._rowClicked$);

  // just and EXAMPLE usage
  protected readonly hasRowClickedListener = computed<boolean>(() => this._rowClicked$.observed);
}
```
