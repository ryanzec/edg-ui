import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { ScrollArea } from '../scroll-area/scroll-area';
import {
  CodeBlockBrainDirective,
  CODE_BLOCK_ALLOW_COPY_DEFAULT,
  CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT,
  CODE_BLOCK_VARIANT_DEFAULT,
  type CodeBlockVariant,
} from '../../brain/code-block-brain/code-block-brain';

export type { CodeBlockVariant } from '../../brain/code-block-brain/code-block-brain';
export {
  allCodeBlockVariants,
  CODE_BLOCK_ALLOW_COPY_DEFAULT,
  CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT,
  CODE_BLOCK_VARIANT_DEFAULT,
} from '../../brain/code-block-brain/code-block-brain';

/** default value for the ellipsisAt input */
export const CODE_BLOCK_ELLIPSIS_AT_DEFAULT = 0;

/** default value for the scrollClass input */
export const CODE_BLOCK_SCROLL_CLASS_DEFAULT = '';

@Component({
  selector: 'org-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, ScrollArea],
  templateUrl: './code-block.html',
  styleUrl: './code-block.css',
  host: {
    '[attr.data-variant]': 'brain.variant()',
    '[attr.data-has-ellipsis]': 'hasEllipsis() ? "" : null',
    '[attr.data-allow-copy]': 'brain.allowCopy() ? "" : null',
  },
  hostDirectives: [
    {
      directive: CodeBlockBrainDirective,
      inputs: ['text', 'variant', 'allowCopy', 'copyAriaLabel'],
      outputs: ['copied'],
    },
  ],
})
export class CodeBlock {
  protected readonly brain = inject(CodeBlockBrainDirective, { self: true });

  /** the code text content used for both display and clipboard interactions; forwarded to the host brain directive */
  public readonly text = input.required<string>();

  /** the rendering variant; forwarded to the host brain directive */
  public readonly variant = input<CodeBlockVariant>(CODE_BLOCK_VARIANT_DEFAULT);

  /** whether the copy-to-clipboard interaction is enabled; forwarded to the host brain directive */
  public readonly allowCopy = input<boolean>(CODE_BLOCK_ALLOW_COPY_DEFAULT);

  /** accessible label applied to the copy button; forwarded to the host brain directive */
  public readonly copyAriaLabel = input<string>(CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT);

  /** number of lines after which to apply ellipsis line clamping; 0 disables ellipsis */
  public readonly ellipsisAt = input<number>(CODE_BLOCK_ELLIPSIS_AT_DEFAULT);

  /** additional css class applied to the inner scroll-area element */
  public readonly scrollClass = input<string>(CODE_BLOCK_SCROLL_CLASS_DEFAULT);

  /** whether the ellipsis line clamp should be active */
  public readonly hasEllipsis = computed<boolean>(() => this.ellipsisAt() > 0);
}
