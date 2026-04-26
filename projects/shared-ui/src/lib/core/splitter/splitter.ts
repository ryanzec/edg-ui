import {
  Component,
  ChangeDetectionStrategy,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { logManager } from '@organization/shared-utils';
import {
  SPLITTER_COLLAPSED_SIDE_DEFAULT as BRAIN_SPLITTER_COLLAPSED_SIDE_DEFAULT,
  SPLITTER_DEFAULT_SIZE_DEFAULT as BRAIN_SPLITTER_DEFAULT_SIZE_DEFAULT,
  SPLITTER_IS_ENABLED_DEFAULT as BRAIN_SPLITTER_IS_ENABLED_DEFAULT,
  SPLITTER_MINIMUM_SIZE_DEFAULT as BRAIN_SPLITTER_MINIMUM_SIZE_DEFAULT,
  SplitterBrainDirective,
  type SplitterCollapsedSide as BrainSplitterCollapsedSide,
  type SplitterDirection as BrainSplitterDirection,
} from '../../brain/splitter-brain/splitter-brain';

/** all available splitter direction values */
export const allSplitterDirections = ['horizontal', 'vertical'] as const;

/** the orientation of the split layout */
export type SplitterDirection = BrainSplitterDirection;

/** all available splitter collapsed side values */
export const allSplitterCollapsedSides = ['first', 'second'] as const;

/** which section is collapsed to take up no space */
export type SplitterCollapsedSide = BrainSplitterCollapsedSide;

/** the default minimum size in pixels for each section */
export const SPLITTER_MINIMUM_SIZE_DEFAULT: number[] = BRAIN_SPLITTER_MINIMUM_SIZE_DEFAULT;

/** the default initial size as a percentage for the first section */
export const SPLITTER_DEFAULT_SIZE_DEFAULT: number[] = BRAIN_SPLITTER_DEFAULT_SIZE_DEFAULT;

/** the default enabled state of the splitter divider */
export const SPLITTER_IS_ENABLED_DEFAULT = BRAIN_SPLITTER_IS_ENABLED_DEFAULT;

/** the default collapsed side of the splitter */
export const SPLITTER_COLLAPSED_SIDE_DEFAULT: SplitterCollapsedSide | null = BRAIN_SPLITTER_COLLAPSED_SIDE_DEFAULT;

@Component({
  selector: 'org-splitter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './splitter.html',
  styleUrl: './splitter.css',
  hostDirectives: [
    {
      directive: SplitterBrainDirective,
      inputs: [
        'splitterDirection: direction',
        'splitterMinimumSize: minimumSize',
        'splitterDefaultSize: defaultSize',
        'splitterIsEnabled: isEnabled',
        'splitterCollapsedSide: collapsedSide',
      ],
    },
  ],
  host: {
    '[attr.data-direction]': 'direction()',
    '[attr.data-enabled]': 'isEnabled() ? "" : null',
    '[attr.data-collapsed-side]': 'collapsedSide()',
    '[attr.data-dragging]': 'brain.isDragging() ? "" : null',
  },
})
export class Splitter {
  protected readonly brain = inject(SplitterBrainDirective, { self: true });

  /** @internal all ng-template #section elements provided as projected content */
  private readonly _sections = contentChildren(TemplateRef);

  /** the orientation of the split layout */
  public readonly direction = input.required<SplitterDirection>();

  /** the minimum size in pixels for each section; single value applies to both sides */
  public readonly minimumSize = input<number[]>(SPLITTER_MINIMUM_SIZE_DEFAULT);

  /** the initial size as a percentage for the first section; single value sets first with remainder for second */
  public readonly defaultSize = input<number[]>(SPLITTER_DEFAULT_SIZE_DEFAULT);

  /** whether the divider is interactive and draggable */
  public readonly isEnabled = input<boolean>(SPLITTER_IS_ENABLED_DEFAULT);

  /** which section is collapsed to take up all space, null means neither section is collapsed */
  public readonly collapsedSide = input<SplitterCollapsedSide | null>(SPLITTER_COLLAPSED_SIDE_DEFAULT);

  /** the first section template ref from projected ng-template #section */
  protected readonly firstSectionTemplate = computed<TemplateRef<unknown> | null>(() => {
    return this._sections()[0] ?? null;
  });

  /** the second section template ref from projected ng-template #section */
  protected readonly secondSectionTemplate = computed<TemplateRef<unknown> | null>(() => {
    return this._sections()[1] ?? null;
  });

  constructor() {
    // logs an error when more than 2 section templates are provided
    effect(() => {
      if (this._sections().length > 2) {
        logManager.error({
          type: 'splitter-too-many-sections',
          message: 'splitter only supports 2 sections; additional section templates will be ignored',
        });
      }
    });
  }
}
