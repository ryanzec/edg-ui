import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  DIVIDER_DIRECTION_DEFAULT,
  DividerBrainDirective,
  type DividerDirection,
} from '../../brain/divider-brain/divider-brain';

export {
  type DividerDirection,
  allDividerDirections,
  DIVIDER_DIRECTION_DEFAULT,
} from '../../brain/divider-brain/divider-brain';

@Component({
  selector: 'org-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './divider.css',
  hostDirectives: [
    {
      directive: DividerBrainDirective,
      inputs: ['direction'],
    },
  ],
})
export class Divider {
  /** the orientation of the divider line — horizontal renders a top border across the full width, vertical renders a left border across the full height */
  public readonly direction = input<DividerDirection>(DIVIDER_DIRECTION_DEFAULT);
}
