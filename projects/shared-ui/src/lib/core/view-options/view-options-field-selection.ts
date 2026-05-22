import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ViewOptionsBrainDirective, type ViewField } from '../../brain/view-options-brain/view-options-brain';
import { List } from '../list/list';
import { Tag } from '../tags/tag';
import { TextDirective } from '../text-directive/text-directive';
import { ViewOptionsFieldRow } from './view-options-field-row';

/** the default section label for the field-selection internal section */
export const VIEW_OPTIONS_FIELD_SELECTION_SECTION_LABEL_DEFAULT = 'Fields';

@Component({
  selector: 'org-view-options-field-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, Tag, TextDirective, ViewOptionsFieldRow],
  templateUrl: './view-options-field-selection.html',
  styleUrl: './view-options-field-selection.css',
  host: {
    role: 'group',
    '[attr.aria-label]': 'sectionLabel()',
  },
})
export class ViewOptionsFieldSelection {
  /** reference to the parent view-options brain (hosted on org-view-options); reads fields and counts */
  protected readonly parentBrain = inject(ViewOptionsBrainDirective);

  /** the visible label for the section header; passed through by the public org-view-options component */
  public readonly sectionLabel = input<string>(VIEW_OPTIONS_FIELD_SELECTION_SECTION_LABEL_DEFAULT);

  /** the list of fields to render; sourced from the parent brain */
  protected readonly fields = computed<readonly ViewField[]>(() => this.parentBrain.fields());

  /** the number of fields whose enabled flag is true */
  protected readonly enabledCount = computed<number>(() => this.parentBrain.enabledCount());

  /** the total number of fields */
  protected readonly totalCount = computed<number>(() => this.parentBrain.totalCount());

  /** the count summary string used in the count tag */
  protected readonly countSummary = computed<string>(() => `${this.enabledCount()}/${this.totalCount()}`);

  /** the count announcement used in the screen-reader-only aria-live span */
  protected readonly countAnnouncement = computed<string>(
    () => `${this.enabledCount()} of ${this.totalCount()} fields shown`
  );
}
