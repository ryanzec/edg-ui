import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Icon } from '../icon/icon';
import { ScrollArea } from '../scroll-area/scroll-area';

export const allCodeBlockVariants = ['block', 'inline'] as const;

export type CodeBlockVariant = (typeof allCodeBlockVariants)[number];

@Component({
  selector: 'org-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, CdkCopyToClipboard, ScrollArea],
  templateUrl: './code-block.html',
  styleUrl: './code-block.css',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-has-ellipsis]': 'hasEllipsis() ? "" : null',
    '[attr.data-allow-copy]': 'allowCopy() ? "" : null',
  },
})
export class CodeBlock {
  public text = input.required<string>();
  public variant = input<CodeBlockVariant>('block');
  public allowCopy = input<boolean>(false);
  public ellipsisAt = input<number>(0);
  public scrollClass = input<string>('');

  public hasEllipsis = computed<boolean>(() => this.ellipsisAt() > 0);
}
