import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
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

/** default value for the closable input */
export const VIEW_OPTIONS_CLOSABLE_DEFAULT = false;

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
  /** reference to the host view-options brain directive; the template reads fields + counts through this */
  protected readonly brain = inject(ViewOptionsBrainDirective);

  /** the visible label for the field-selection section header; forwarded to the internal sub-component */
  public readonly sectionLabel = input<string>(VIEW_OPTIONS_FIELD_SELECTION_SECTION_LABEL_DEFAULT);

  /** when true, renders the header close button (which emits the closed output on click) */
  public readonly closable = input<boolean>(VIEW_OPTIONS_CLOSABLE_DEFAULT);

  /** emitted when the user clicks the header close button (only rendered when closable is true) */
  public readonly closed = output<void>();

  /** the resolved title for the panel header, defaulting to a generic label when the brain's ariaLabel is omitted */
  protected readonly resolvedPanelLabel = computed<string>(
    () => this.brain.ariaLabel() ?? VIEW_OPTIONS_PANEL_LABEL_DEFAULT
  );

  /** the icon name used in the panel header title prefix */
  protected readonly panelHeaderIconName: IconName = VIEW_OPTIONS_PANEL_HEADER_ICON;

  /** the icon name used in the panel header close button */
  protected readonly panelCloseIconName: IconName = VIEW_OPTIONS_PANEL_CLOSE_ICON;

  /** handles the close-button click by emitting the closed output */
  protected onCloseClick(): void {
    this.closed.emit();
  }
}
