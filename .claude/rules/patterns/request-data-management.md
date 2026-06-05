---
alwaysApply: true
---
# Request Data Management Pattern

When you have request data that needs to be passed to an API or Data Store method, this pattern centralizes where those methods are called and groups the logic for the request data itself.

- **ALWAYS** store the request data in a `signal()`.
- **ALWAYS** use the `toObservable` rxjs-interop helper to manage making the request to the API or data store.

# Example
```ts
export class MyView implements AfterViewInit {
  // other code...
 
  private _fetchRequestData = signal<GetRequest>({
    limit: 10,
    offset: 0,
    orderBy: 'updatedAt',
    orderDirection: 'desc',
  });
 
  // other code...
 
  public ngAfterViewInit(): void {
    // we run this in here to avoid the init event storm that happens when the children components emit events that
    // update the fetch request data to prevent unnecessary duplicate fetch requests
    runInInjectionContext(this._injector, () => {
      toObservable(this._fetchRequestData)
        .pipe(
          debounceTime(0),
          takeUntilDestroyed(),
          distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current))
        )
        .subscribe((requestData) => {
          this._myDataStore.fetch(requestData);
        });
    });
  }
 
  protected onSortingChanged(sortingData: MySortingData): void {
    // code to update _fetchRequestData
  }
 
  protected onFilterChanged(filterData: MyFilterData): void {
    // code to update _fetchRequestData
  }
}
```
