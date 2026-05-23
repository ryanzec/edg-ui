import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ViewOptionsBrainDirective } from '../view-options/view-options-brain';
import { Icon } from '../icon/icon';
import { TextDirective } from '../text-directive/text-directive';
import type { IconName } from '../icon/icon-brain';
import {
  VIEW_OPTIONS_FIELD_SELECTION_SECTION_LABEL_DEFAULT,
  ViewOptionsFieldSelection,
} from './view-options-field-selection';

export {
  VIEW_OPTIONS_BRAIN_ARIA_LABEL_DEFAULT,
  VIEW_OPTIONS_BRAIN_FIELDS_DEFAULT,
} from '../view-options/view-options-brain';
export type { ViewField, ViewOptionsFieldEdge, ViewOptionsFieldsChangeEvent } from '../view-options/view-options-brain';
export { VIEW_OPTIONS_FIELD_SELECTION_SECTION_LABEL_DEFAULT } from './view-options-field-selection';

/** default value for the panelLabel input */
export const VIEW_OPTIONS_PANEL_LABEL_DEFAULT = 'View options';

/** the icon used in the panel header title prefix */
const VIEW_OPTIONS_PANEL_HEADER_ICON: IconName = 'sliders-horizontal';

/** the icon used in the panel header close button */
const VIEW_OPTIONS_PANEL_CLOSE_ICON: IconName = 'panel-right-close';

@Component({
  selector: 'org-view-options',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TextDirective, ViewOptionsFieldSelection],
  templateUrl: './view-options.html',
  styleUrl: './view-options.css',
  hostDirectives: [
    {
      directive: ViewOptionsBrainDirective,
      inputs: ['fields', 'ariaLabel: panelLabel'],
      outputs: ['fieldsChange', 'fieldsChanged'],
    },
  ],
})
export class ViewOptions {
  private readonly _closed$ = new Subject<void>();

  /** reference to the host view-options brain directive; the template reads fields + counts through this */
  protected readonly brain = inject(ViewOptionsBrainDirective);

  /** the visible label for the field-selection section header; forwarded to the internal sub-component */
  public readonly sectionLabel = input<string>(VIEW_OPTIONS_FIELD_SELECTION_SECTION_LABEL_DEFAULT);

  /** emitted when the user clicks the header close button; the button is only rendered when there's a listener */
  public readonly closed = outputFromObservable(this._closed$.asObservable());

  /** whether a consumer has subscribed to the closed output; drives conditional rendering of the close button */
  protected readonly hasClosedListener = computed<boolean>(() => this._closed$.observed);

  /** the resolved title for the panel header, defaulting to a generic label when the brain's ariaLabel is omitted */
  protected readonly resolvedPanelLabel = computed<string>(
    () => this.brain.ariaLabel() ?? VIEW_OPTIONS_PANEL_LABEL_DEFAULT
  );

  /** the icon name used in the panel header title prefix */
  protected readonly panelHeaderIconName: IconName = VIEW_OPTIONS_PANEL_HEADER_ICON;

  /** the icon name used in the panel header close button */
  protected readonly panelCloseIconName: IconName = VIEW_OPTIONS_PANEL_CLOSE_ICON;

  /** handles the close-button click by emitting on the closed subject */
  protected onCloseClick(): void {
    this._closed$.next();
  }
}
