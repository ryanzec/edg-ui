import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** all available dialog footer alignment values */
export const allDialogFooterAlignments = ['start', 'center', 'end'] as const;

/** the horizontal alignment type for dialog footer content */
export type DialogFooterAlignment = (typeof allDialogFooterAlignments)[number];

/** default value for the dialog footer alignment input */
export const DIALOG_FOOTER_ALIGNMENT_DEFAULT: DialogFooterAlignment = 'end';

@Component({
  selector: 'org-dialog-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-footer.html',
  styleUrl: './dialog-footer.css',
  host: {
    '[attr.data-alignment]': 'alignment()',
  },
})
export class DialogFooter {
  /** the horizontal alignment of footer content */
  public readonly alignment = input<DialogFooterAlignment>(DIALOG_FOOTER_ALIGNMENT_DEFAULT);
}
