import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { angularUtils, logManager } from '@organization/shared-utils';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { ScrollArea } from '../scroll-area/scroll-area';
import { type IconName } from '../icon/icon-brain';
import {
  CodeBlockBrainDirective,
  CODE_BLOCK_ALLOW_COPY_DEFAULT,
  CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT,
  CODE_BLOCK_ELLIPSIS_AT_DEFAULT,
  CODE_BLOCK_HIGHLIGHT_LANGUAGE_DEFAULT,
  CODE_BLOCK_VARIANT_DEFAULT,
  type CodeBlockVariant,
} from '../code-block/code-block-brain';

export type { CodeBlockVariant, SyntaxKind } from '../code-block/code-block-brain';
export {
  allCodeBlockVariants,
  allCodeBlockHighlightLanguages,
  allSyntaxKinds,
  CODE_BLOCK_ALLOW_COPY_DEFAULT,
  CODE_BLOCK_COLLAPSABLE_DEFAULT,
  CODE_BLOCK_COLLAPSED_DEFAULT,
  CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT,
  CODE_BLOCK_ELLIPSIS_AT_DEFAULT,
  CODE_BLOCK_EXPANDED_DEFAULT,
  CODE_BLOCK_HIGHLIGHT_LANGUAGE_DEFAULT,
  CODE_BLOCK_VARIANT_DEFAULT,
} from '../code-block/code-block-brain';

/** all valid inline tone values */
export const allCodeBlockTones = ['none', 'token', 'danger', 'safe'] as const;

/** the inline tone variant that tints background and foreground for short snippets */
export type CodeBlockTone = (typeof allCodeBlockTones)[number];

/** default value for the tone input */
export const CODE_BLOCK_TONE_DEFAULT: CodeBlockTone = 'none';

/** default value for the wrap input */
export const CODE_BLOCK_WRAP_DEFAULT = false;

/** default value for the headerLabel input */
export const CODE_BLOCK_HEADER_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the headerIcon input */
export const CODE_BLOCK_HEADER_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the scrollClass input */
export const CODE_BLOCK_SCROLL_CLASS_DEFAULT = '';

/** default value for the showMoreLabel input */
export const CODE_BLOCK_SHOW_MORE_LABEL_DEFAULT = 'Show more';

/** default value for the showLessLabel input */
export const CODE_BLOCK_SHOW_LESS_LABEL_DEFAULT = 'Show less';

@Component({
  selector: 'org-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon, ScrollArea],
  templateUrl: './code-block.html',
  styleUrl: './code-block.css',
  host: {
    '[attr.data-variant]': 'brain.variant()',
    '[attr.data-tone]': 'tone() === "none" ? null : tone()',
    '[attr.data-wrap]': 'wrap() ? "" : null',
    '[attr.data-has-ellipsis]': 'brain.hasEllipsis() ? "" : null',
    '[attr.data-expanded]': 'brain.expanded() ? "" : null',
    '[attr.data-overflowing]': 'brain.isOverflowing() ? "" : null',
    '[attr.data-copied]': 'brain.isCopied() ? "" : null',
    '[attr.data-allow-copy]': 'brain.allowCopy() ? "" : null',
    '[attr.data-has-header]': 'hasHeader() ? "" : null',
    '[attr.data-collapsable]': 'brain.canCollapse() ? "" : null',
    '[attr.data-collapsed]': 'brain.collapsed() ? "" : null',
  },
  hostDirectives: [
    {
      directive: CodeBlockBrainDirective,
      inputs: [
        'text',
        'variant',
        'allowCopy',
        'copyAriaLabel',
        'ellipsisAt',
        'highlightLanguage',
        'expanded',
        'collapsable: isCollapsable',
        'collapsed: isCollapsed',
      ],
      outputs: ['copied', 'expandedChange', 'collapsedChange: isCollapsedChange'],
    },
  ],
})
export class CodeBlock implements AfterViewInit {
  protected readonly brain = inject(CodeBlockBrainDirective, { self: true });

  private readonly _destroyRef = inject(DestroyRef);

  private _resizeObserver: ResizeObserver | null = null;

  /** reference to the body element used to measure overflow when ellipsis clamping is active */
  protected readonly bodyRef = viewChild<ElementRef<HTMLElement>>('bodyRef');

  /** the code text content used for both display and clipboard interactions; forwarded to the host brain directive */
  public readonly text = input.required<string>();

  /** the rendering variant; forwarded to the host brain directive */
  public readonly variant = input<CodeBlockVariant>(CODE_BLOCK_VARIANT_DEFAULT);

  /** whether the copy-to-clipboard interaction is enabled; forwarded to the host brain directive */
  public readonly allowCopy = input<boolean>(CODE_BLOCK_ALLOW_COPY_DEFAULT);

  /** accessible label applied to the copy button; forwarded to the host brain directive */
  public readonly copyAriaLabel = input<string>(CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT);

  /** number of lines after which to apply ellipsis line clamping; 0 disables ellipsis; forwarded to the host brain directive */
  public readonly ellipsisAt = input<number>(CODE_BLOCK_ELLIPSIS_AT_DEFAULT);

  /** the language used to syntax-highlight the block body; undefined renders plain text; forwarded to the host brain directive */
  public readonly highlightLanguage = input<string | undefined, string | null | undefined>(
    CODE_BLOCK_HIGHLIGHT_LANGUAGE_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** the inline tone variant; ignored for the block variant */
  public readonly tone = input<CodeBlockTone>(CODE_BLOCK_TONE_DEFAULT);

  /** when true, the block body wraps long lines instead of horizontally scrolling */
  public readonly wrap = input<boolean>(CODE_BLOCK_WRAP_DEFAULT);

  /** the file label rendered in the optional block header; when undefined the header is not rendered */
  public readonly headerLabel = input<string | undefined, string | null | undefined>(CODE_BLOCK_HEADER_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the optional icon rendered before the header label */
  public readonly headerIcon = input<IconName | undefined, IconName | null | undefined>(
    CODE_BLOCK_HEADER_ICON_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** additional css class applied to the inner scroll-area element */
  public readonly scrollClass = input<string>(CODE_BLOCK_SCROLL_CLASS_DEFAULT);

  /** the visible label rendered on the expand toggle while the body is collapsed */
  public readonly showMoreLabel = input<string>(CODE_BLOCK_SHOW_MORE_LABEL_DEFAULT);

  /** the visible label rendered on the expand toggle while the body is expanded */
  public readonly showLessLabel = input<string>(CODE_BLOCK_SHOW_LESS_LABEL_DEFAULT);

  /** whether the block header should be rendered */
  protected readonly hasHeader = computed<boolean>(() => this.headerLabel() !== undefined);

  public constructor() {
    // re-measure overflow whenever the content or clamp settings change so the show-more affordance stays accurate
    effect(() => {
      this.brain.text();
      this.brain.ellipsisAt();
      this.brain.variant();
      this.wrap();
      this.brain.expanded();

      queueMicrotask(() => {
        this._measureOverflow();
      });
    });

    // the collapse toggle lives in the header, so collapsable is meaningless without a header to host it
    effect(() => {
      if (!this.brain.collapsable() || this.hasHeader()) {
        return;
      }

      logManager.warn({
        type: 'code-block-collapsable-without-header',
        message: 'isCollapsable is set but no headerLabel was provided; the collapse toggle requires a header',
      });
    });
  }

  public ngAfterViewInit(): void {
    const bodyElement = this.bodyRef()?.nativeElement;

    if (!bodyElement) {
      return;
    }

    this._resizeObserver = new ResizeObserver(() => {
      this._measureOverflow();
    });
    this._resizeObserver.observe(bodyElement);

    this._destroyRef.onDestroy(() => {
      this._resizeObserver?.disconnect();
      this._resizeObserver = null;
    });

    this._measureOverflow();
  }

  /** toggles the collapsed state when the collapsible header is clicked */
  protected onHeaderClick(): void {
    this.brain.toggleCollapsed();
  }

  /** toggles the collapsed state from keyboard activation of the collapsible header (enter / space) */
  protected onHeaderKeydown(event: Event): void {
    event.preventDefault();
    this.brain.toggleCollapsed();
  }

  private _measureOverflow(): void {
    const bodyElement = this.bodyRef()?.nativeElement;

    if (!bodyElement) {
      this.brain.setOverflowing(false);

      return;
    }

    if (!this.brain.hasEllipsis() || this.brain.variant() !== 'block') {
      this.brain.setOverflowing(false);

      return;
    }

    const isOverflowing = bodyElement.scrollHeight - bodyElement.clientHeight > 1;

    this.brain.setOverflowing(isOverflowing);
  }
}
