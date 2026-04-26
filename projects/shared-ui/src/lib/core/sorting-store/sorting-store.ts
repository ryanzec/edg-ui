import { Injectable, computed, signal } from '@angular/core';

/** all valid sorting direction values */
export const allSortingDirections = ['asc', 'desc'] as const;

/** the direction a sort can be applied in */
export type SortingDirection = (typeof allSortingDirections)[number];

/** the current state of a sort operation */
export type SortingState = {
  key: string | null;
  direction: SortingDirection | null;
};

@Injectable()
export class SortingStore {
  /** the internal unified state signal */
  private readonly _state = signal<SortingState>({
    key: null,
    direction: null,
  });

  /** the currently active sort key, or null when not sorting */
  public readonly key = computed<string | null>(() => this._state().key);

  /** the currently active sort direction, or null when not sorting */
  public readonly direction = computed<SortingDirection | null>(() => this._state().direction);

  /** whether a sort is currently active */
  public readonly isSorting = computed<boolean>(() => this.key() !== null && this.direction() !== null);

  /**
   * sets the sort key and direction explicitly; passing null for key clears the sort entirely
   */
  public setSort(key: string | null, direction: SortingDirection | null = null): void {
    this._state.set({
      key,
      direction: key === null ? null : direction,
    });
  }

  /**
   * cycles the sort state for the given key: asc → desc → null (clear);
   * switching to a new key resets to asc
   */
  public toggleSort(key: string): void {
    const currentState = this._state();

    if (currentState.key !== key) {
      this._state.set({
        key,
        direction: 'asc',
      });

      return;
    }

    if (currentState.direction === 'asc') {
      this._state.update((state) => ({
        ...state,
        direction: 'desc',
      }));

      return;
    }

    if (currentState.direction === 'desc') {
      this._state.update((state) => ({
        ...state,
        direction: null,
      }));

      return;
    }

    this._state.update((state) => ({
      ...state,
      direction: 'asc',
    }));
  }

  /** resets the sort state to its initial cleared state */
  public clearSort(): void {
    this._state.set({
      key: null,
      direction: null,
    });
  }
}
