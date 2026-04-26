import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** all available divider direction values */
export const allDividerDirections = ['horizontal', 'vertical'] as const;

/** the orientation of the divider line */
export type DividerDirection = (typeof allDividerDirections)[number];

/** default value for the divider direction input */
export const DIVIDER_DIRECTION_DEFAULT: DividerDirection = 'horizontal';

@Component({
  selector: 'org-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './divider.css',
  host: {
    '[attr.data-direction]': 'direction()',
  },
})
export class Divider {
  /** the orientation of the divider line — horizontal renders a top border across the full width, vertical renders a left border across the full height */
  public direction = input<DividerDirection>(DIVIDER_DIRECTION_DEFAULT);
}
