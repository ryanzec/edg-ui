import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Divider } from '../divider/divider';

/** all available box footer alignment values */
export const allBoxFooterAlignments = ['start', 'center', 'end'] as const;

/** the horizontal alignment type for box footer content */
export type BoxFooterAlignment = (typeof allBoxFooterAlignments)[number];

/** default value for the box footer alignment input */
export const BOX_FOOTER_ALIGNMENT_DEFAULT: BoxFooterAlignment = 'end';

/** default value for the box footer hasDivider input */
export const BOX_FOOTER_HAS_DIVIDER_DEFAULT = false;

/** container for box footer actions with configurable horizontal alignment */
@Component({
  selector: 'org-box-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Divider],
  templateUrl: './box-footer.html',
  styleUrl: './box-footer.css',
  host: {
    '[attr.data-alignment]': 'alignment()',
  },
})
export class BoxFooter {
  /** the horizontal alignment of footer content */
  public alignment = input<BoxFooterAlignment>(BOX_FOOTER_ALIGNMENT_DEFAULT);

  /** whether to render a divider above the footer content, separated by the box main gap */
  public hasDivider = input<boolean>(BOX_FOOTER_HAS_DIVIDER_DEFAULT);
}
