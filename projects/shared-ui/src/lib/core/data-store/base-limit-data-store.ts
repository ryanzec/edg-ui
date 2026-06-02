import { computed, signal } from '@angular/core';
import { BaseDataStore } from './base-data-store';
import { ResponseMeta } from '@organization/shared-utils';

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

export abstract class BaseLimitDataStore<T, TMeta extends ResponseMeta = ResponseMeta> extends BaseDataStore<T, TMeta> {
  protected readonly limitState = signal<LimitState>(generateDefaultLimitState());

  /** the total number of pages based on total item count and limit */
  public readonly totalPages = computed(() => Math.ceil(this.limitState().totalItemCount / this.limitState().limit));

  /** the current page number */
  public readonly currentPage = computed(() => this.limitState().currentPage);

  /** the current pagination offset */
  public readonly offset = computed(() => this.limitState().offset);

  /** the number of items per page */
  public readonly limit = computed(() => this.limitState().limit);

  /** the total number of items across all pages */
  public readonly totalItemCount = computed(() => this.limitState().totalItemCount);

  constructor(idField: keyof T | undefined, defaultLimitState: Partial<LimitState> = {}) {
    super(idField);

    this.limitState.set({
      offset: defaultLimitState.offset ?? 0,
      limit: defaultLimitState.limit ?? 10,
      totalItemCount: defaultLimitState.totalItemCount ?? 0,
      currentPage: defaultLimitState.currentPage ?? 1,
    });
  }

  /** updates the limit pagination state from response metadata */
  public override setLocalMeta(meta: TMeta | undefined): void {
    super.setLocalMeta(meta);

    const currentPage = meta?.currentPage || 1;
    const offset = (currentPage > 0 ? currentPage - 1 : 0) * (meta?.itemsPerPage ?? 10);

    this.limitState.set({
      offset: offset ?? 0,
      limit: meta?.itemsPerPage ?? 10,
      totalItemCount: meta?.totalItemCount ?? 0,
      currentPage: meta?.currentPage ?? 1,
    });
  }

  /** resets the store and limit pagination state to defaults */
  public override reset(): void {
    super.reset();
    this.limitState.set(generateDefaultLimitState());
  }
}
