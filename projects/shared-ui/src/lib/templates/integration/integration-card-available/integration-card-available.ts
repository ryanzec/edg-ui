import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Box } from '../../../core/box/box';
import { Button } from '../../../core/button/button';
import { type IconName } from '../../../core/icon/icon-brain';
import { Icon } from '../../../core/icon/icon';
import { Tag, type TagColor } from '../../../core/tags/tag';
import { Tags } from '../../../core/tags/tags';

/** the maximum number of tags rendered before the remaining tags are collapsed into a +N overflow tag */
const MAX_VISIBLE_TAGS = 3;

/** a tag entry displayed on an available integration card */
export type AvailableIntegrationTag = {
  /** display label for the tag */
  label: string;
  /** optional semantic color for the tag — defaults to neutral when omitted */
  color?: TagColor;
};

/** the integration record rendered by the available integration card */
export type AvailableIntegration = {
  /** unique id for the integration */
  id: string;
  /** display name for the integration */
  name: string;
  /** description of what the integration does */
  description: string;
  /** brand icon rendered in the header */
  iconName: IconName;
  /** tags associated with the integration */
  tags: AvailableIntegrationTag[];
};

@Component({
  selector: 'org-integration-card-available',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, Button, Icon, Tag, Tags],
  templateUrl: './integration-card-available.html',
  host: {
    class: 'block',
  },
})
export class IntegrationCardAvailable {
  /** the integration record to render */
  public integration = input.required<AvailableIntegration>();

  /** emits the integration when the "Add" button is clicked */
  public add = output<AvailableIntegration>();

  /** the first N tags rendered inline — the remaining tags are collapsed into the overflow tag */
  protected readonly visibleTags = computed<AvailableIntegrationTag[]>(() =>
    this.integration().tags.slice(0, MAX_VISIBLE_TAGS)
  );

  /** the number of tags collapsed into the +N overflow tag; 0 when no overflow is needed */
  protected readonly overflowTagCount = computed<number>(() =>
    Math.max(this.integration().tags.length - MAX_VISIBLE_TAGS, 0)
  );

  /** handles the add button click and emits the add output */
  protected onAdd(): void {
    this.add.emit(this.integration());
  }
}
