import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { SkeletonBrainDirective } from '../../brain/skeleton-brain/skeleton-brain';

/** available skeleton display types */
export type SkeletonType = 'table' | 'card';

/** all available skeleton types */
export const skeletonTypes: SkeletonType[] = ['table', 'card'];

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
    '[attr.data-type]': 'type()',
  },
})
export class Skeleton {
  /** the type of skeleton to display */
  public type = input.required<SkeletonType>();

  /** whether the current type is table */
  protected readonly isTable = computed<boolean>(() => {
    return this.type() === 'table';
  });

  /** whether the current type is card */
  protected readonly isCard = computed<boolean>(() => {
    return this.type() === 'card';
  });

  /** indices used to render the table skeleton bars via @for */
  protected readonly tableBars = Array.from({ length: 7 }, (_, i) => i);
}
