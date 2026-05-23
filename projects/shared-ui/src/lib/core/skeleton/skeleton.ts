import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonBrainDirective } from '../skeleton/skeleton-brain';

/** all available skeleton variants */
export const allSkeletonVariants = ['card', 'card-headless', 'table', 'table-varied'] as const;

/** the layout variant for the skeleton component */
export type SkeletonVariant = (typeof allSkeletonVariants)[number];

/** internal width step values applied to skeleton bars via data-width */
type SkeletonBarWidth = 'full' | '3/4' | '2/3' | '1/2' | '1/3' | '1/4';

/** internal width cycle used by the table-varied variant */
const TABLE_VARIED_WIDTH_CYCLE: readonly SkeletonBarWidth[] = [
  'full',
  '3/4',
  '2/3',
  '1/2',
  'full',
  '3/4',
  '1/3',
  '2/3',
  '3/4',
  '1/2',
  'full',
  '1/4',
] as const;

/** default value for the variant input */
export const SKELETON_VARIANT_DEFAULT: SkeletonVariant = 'card';

/** default value for the bordered input */
export const SKELETON_BORDERED_DEFAULT = true;

/** default value for the rows input */
export const SKELETON_ROWS_DEFAULT = 7;

/** entry returned by the table bars computed used to render a single bar in a table variant */
type SkeletonTableBar = {
  index: number;
  width: SkeletonBarWidth;
};

@Component({
  selector: 'org-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
  hostDirectives: [
    {
      directive: SkeletonBrainDirective,
      inputs: ['ariaLabel'],
    },
  ],
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-bordered]': 'bordered() ? "1" : "0"',
  },
})
export class Skeleton {
  /** the layout variant of the skeleton */
  public variant = input<SkeletonVariant>(SKELETON_VARIANT_DEFAULT);

  /** whether the skeleton renders its bordered surface frame */
  public bordered = input<boolean>(SKELETON_BORDERED_DEFAULT);

  /** number of rows rendered for the table and table-varied variants; ignored for card variants */
  public rows = input<number>(SKELETON_ROWS_DEFAULT);

  /** bar entries for the table and table-varied variants */
  protected readonly tableBars = computed<SkeletonTableBar[]>(() => {
    const variant = this.variant();

    if (variant !== 'table' && variant !== 'table-varied') {
      return [];
    }

    const count = Math.max(0, this.rows());
    const isVaried = variant === 'table-varied';

    return Array.from({ length: count }, (_, index) => ({
      index,
      width: isVaried ? TABLE_VARIED_WIDTH_CYCLE[index % TABLE_VARIED_WIDTH_CYCLE.length] : 'full',
    }));
  });
}
