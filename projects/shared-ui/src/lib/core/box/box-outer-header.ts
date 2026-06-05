import {
  Component,
  ChangeDetectionStrategy,
  computed,
  contentChild,
  inject,
  input,
  type TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { BoxHeaderBrainDirective } from '../box/box-header-brain';
import { Button } from '../button/button';
import { Box } from './box';

/** default value for the box outer header title input */
export const BOX_OUTER_HEADER_TITLE_DEFAULT: string | undefined = undefined;

/** default value for the box outer header subtitle input */
export const BOX_OUTER_HEADER_SUBTITLE_DEFAULT: string | undefined = undefined;

/**
 * the outer header for a box. visually identical to BoxHeader but projects into the box's unstyled outer wrapper
 * (outside the box surface) so it keeps rendering even when the box collapses to its 'none' expanded state. its
 * toggle drives the full <-> none transition (whereas BoxHeader's toggle drives full <-> header-only).
 */
@Component({
  selector: 'org-box-outer-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Button],
  templateUrl: './box-outer-header.html',
  styleUrl: './box-outer-header.css',
  hostDirectives: [
    {
      directive: BoxHeaderBrainDirective,
      inputs: ['headingLevel'],
    },
  ],
  host: {
    '[attr.data-actions-only]': 'actionsOnly() ? "" : null',
    '[attr.data-expandable]': 'isExpandable() ? "" : null',
    '[class.hidden]': '!hasContent()',
  },
})
export class BoxOuterHeader {
  private readonly _box = inject(Box);

  /** reference to the host box header brain directive owning the headingLevel input */
  protected readonly boxHeaderBrainDirective = inject(BoxHeaderBrainDirective);

  /** the title text displayed in the box outer header */
  public title = input<string | undefined, string | null | undefined>(BOX_OUTER_HEADER_TITLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the subtitle text displayed below the title */
  public subtitle = input<string | undefined, string | null | undefined>(BOX_OUTER_HEADER_SUBTITLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** consumer-supplied template (referenced via #actions) projected into the outer header's trailing actions slot */
  protected readonly actionsTemplate = contentChild<TemplateRef<unknown>>('actions');

  /** whether the title has a non-empty value */
  protected readonly hasTitle = computed<boolean>(() => !!this.title());

  /** whether the subtitle has a non-empty value */
  protected readonly hasSubtitle = computed<boolean>(() => !!this.subtitle());

  /** whether the parent box has opted in to the expandable affordance */
  protected readonly isExpandable = computed<boolean>(() => this._box.boxBrain.isExpandable());

  /**
   * whether the box surface is shown from the outer header's perspective; only meaningful when isExpandable() is
   * true. the outer header collapses the whole surface to 'none', so any state other than 'none' reads as shown.
   */
  protected readonly isExpanded = computed<boolean>(() => this._box.boxBrain.expandedState() !== 'none');

  /** the accessible label / icon name pairing for the toggle button driven by the current expanded state */
  protected readonly toggleLabel = computed<string>(() => (this.isExpanded() ? 'Collapse' : 'Expand'));

  /**
   * whether the header is in actions-only mode (no title and no subtitle and not expandable) — drives the
   * right-aligned single-column grid. an expandable header always renders a left-column toggle row (with at
   * least the chevron), so it never enters actions-only mode.
   */
  protected readonly actionsOnly = computed<boolean>(
    () => !this.isExpandable() && !this.hasTitle() && !this.hasSubtitle()
  );

  /** handles activation of the toggle area; delegates to the brain so the no-op-when-non-expandable guard stays in one place */
  protected onToggle(): void {
    this._box.boxBrain.toggleNone();
  }

  /** whether the header has any content to display; used to drive the hidden class on the header */
  protected hasContent = computed<boolean>(() => {
    return this.hasTitle() || this.hasSubtitle() || this.isExpandable() || !!this.actionsTemplate();
  });
}
