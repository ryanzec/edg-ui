import { computed, signal } from '@angular/core';
import { BaseDataStore } from './base-data-store';
import { ResponseMeta } from '@organization/shared-utils';

type CursorState = {
  currentCursor: string | null;
  nextCursor: string | null;
  previousCursor: string | null;
  limit: number;
  totalItemCount: number;
};

const generateDefaultCursorState = (): CursorState => ({
  currentCursor: null,
  nextCursor: null,
  previousCursor: null,
  limit: 10,
  totalItemCount: 0,
});

export abstract class BaseCursorDataStore<T> extends BaseDataStore<T> {
  private readonly _cursorState = signal<CursorState>(generateDefaultCursorState());

  /** the cursor for the current page */
  public readonly currentCursor = computed(() => this._cursorState().currentCursor);

  /** the cursor for the next page, or null if none */
  public readonly nextCursor = computed(() => this._cursorState().nextCursor);

  /** the cursor for the previous page, or null if none */
  public readonly previousCursor = computed(() => this._cursorState().previousCursor);

  /** the number of items per page */
  public readonly limit = computed(() => this._cursorState().limit);

  /** the total number of items across all pages */
  public readonly totalItemCount = computed(() => this._cursorState().totalItemCount);

  /** whether a next page is available */
  public readonly hasNext = computed(() => this._cursorState().nextCursor !== null);

  /** whether a previous page is available */
  public readonly hasPrevious = computed(() => this._cursorState().previousCursor !== null);

  constructor(idField: keyof T | undefined, defaultCursorState: Partial<CursorState> = {}) {
    super(idField);

    this._cursorState.set({
      currentCursor: defaultCursorState.currentCursor ?? null,
      nextCursor: defaultCursorState.nextCursor ?? null,
      previousCursor: defaultCursorState.previousCursor ?? null,
      limit: defaultCursorState.limit ?? 10,
      totalItemCount: defaultCursorState.totalItemCount ?? 0,
    });
  }

  /** updates the cursor pagination state from response metadata */
  public override setLocalMeta(meta: ResponseMeta | undefined): void {
    super.setLocalMeta(meta);

    this._cursorState.set({
      currentCursor: meta?.currentCursor ?? null,
      nextCursor: meta?.nextCursor ?? null,
      previousCursor: meta?.previousCursor ?? null,
      limit: meta?.itemsPerPage ?? 10,
      totalItemCount: meta?.totalItemCount ?? 0,
    });
  }

  /** resets the store and cursor pagination state to defaults */
  public override reset(): void {
    super.reset();
    this._cursorState.set(generateDefaultCursorState());
  }
}
