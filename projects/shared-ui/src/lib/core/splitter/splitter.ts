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
import { angularUtils, logManager } from '@organization/shared-utils';
import { DividerBrainDirective } from '../divider/divider-brain';
import {
  SPLITTER_COLLAPSED_SIDE_DEFAULT,
  SPLITTER_IS_ENABLED_DEFAULT,
  SPLITTER_MINIMUM_SIZE_DEFAULT,
  SPLITTER_SIZE_DEFAULT,
  SplitterBrainDirective,
  type SplitterCollapsedSide,
  type SplitterDirection,
} from '../splitter/splitter-brain';

export {
  type SplitterDirection,
  type SplitterCollapsedSide,
  allSplitterDirections,
  allSplitterCollapsedSides,
  SPLITTER_MINIMUM_SIZE_DEFAULT,
  SPLITTER_SIZE_DEFAULT,
  SPLITTER_IS_ENABLED_DEFAULT,
  SPLITTER_COLLAPSED_SIDE_DEFAULT,
} from '../splitter/splitter-brain';

/** the default animate-resize state of the splitter */
export const SPLITTER_ANIMATE_RESIZE_DEFAULT = true;

@Component({
  selector: 'org-splitter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, DividerBrainDirective],
  templateUrl: './splitter.html',
  styleUrl: './splitter.css',
  hostDirectives: [
    {
      directive: SplitterBrainDirective,
      inputs: ['direction', 'minimumSize', 'size', 'isEnabled', 'collapsedSide'],
      outputs: ['sizeChange: sizeChanged', 'dragStarted', 'dragCompleted'],
    },
  ],
  host: {
    '[attr.data-animate-resize]': 'animateResize() ? "" : null',
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

  /** the size as a percentage for each section; single value sets first with remainder for second; updated by drag and keyboard */
  public readonly size = input<number[]>(SPLITTER_SIZE_DEFAULT);

  /** whether the divider is interactive and draggable */
  public readonly isEnabled = input<boolean>(SPLITTER_IS_ENABLED_DEFAULT);

  /** which section is collapsed to take up all space, undefined means neither section is collapsed */
  public readonly collapsedSide = input<SplitterCollapsedSide | undefined, SplitterCollapsedSide | null | undefined>(
    SPLITTER_COLLAPSED_SIDE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** whether section size changes are animated; dragging is never animated regardless */
  public readonly animateResize = input<boolean>(SPLITTER_ANIMATE_RESIZE_DEFAULT);

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
