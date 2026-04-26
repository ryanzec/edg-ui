import { computed, signal } from '@angular/core';
import { BaseDataStore } from './base-data-store';
import { ResponseMeta } from '@organization/shared-types';

type LimitState = {
  offset: number;
  limit: number;
  totalItemCount: number;
  currentPage: number;
};

const generateDefaultLimitState = (): LimitState => ({
  offset: 0,
  limit: 10,
  totalItemCount: 0,
  currentPage: 1,
});

export abstract class BaseLimitDataStore<T> extends BaseDataStore<T> {
  private readonly _limitState = signal<LimitState>(generateDefaultLimitState());

  /** the total number of pages based on total item count and limit */
  public readonly totalPages = computed(() => Math.ceil(this._limitState().totalItemCount / this._limitState().limit));

  /** the current page number */
  public readonly currentPage = computed(() => this._limitState().currentPage);

  /** the current pagination offset */
  public readonly offset = computed(() => this._limitState().offset);

  /** the number of items per page */
  public readonly limit = computed(() => this._limitState().limit);

  /** the total number of items across all pages */
  public readonly totalItemCount = computed(() => this._limitState().totalItemCount);

  constructor(idField: keyof T, defaultLimitState: Partial<LimitState> = {}) {
    super(idField);

    this._limitState.set({
      offset: defaultLimitState.offset ?? 0,
      limit: defaultLimitState.limit ?? 10,
      totalItemCount: defaultLimitState.totalItemCount ?? 0,
      currentPage: defaultLimitState.currentPage ?? 1,
    });
  }

  /** updates the limit pagination state from response metadata */
  public override setLocalMeta(meta: ResponseMeta | undefined): void {
    super.setLocalMeta(meta);

    this._limitState.set({
      offset: meta?.offset ?? 0,
      limit: meta?.itemsPerPage ?? 10,
      totalItemCount: meta?.totalItemCount ?? 0,
      currentPage: meta?.currentPage ?? 1,
    });
  }

  /** resets the store and limit pagination state to defaults */
  public override reset(): void {
    super.reset();
    this._limitState.set(generateDefaultLimitState());
  }
}
