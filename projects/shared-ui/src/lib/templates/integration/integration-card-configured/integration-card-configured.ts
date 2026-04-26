import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { type DateTime } from 'luxon';
import { Box } from '../../../core/box/box';
import { Button } from '../../../core/button/button';
import { ButtonIcon } from '../../../core/button/button-icon';
import { DatePipe } from '../../../core/date-pipe/date-pipe';
import { Divider } from '../../../core/divider/divider';
import { Icon, type IconName } from '../../../core/icon/icon';
import { OverlayMenu, type OverlayMenuItem, type OverlayMenuItemEntry } from '../../../core/overlay-menu/overlay-menu';
import { Tag, type TagColor } from '../../../core/tag/tag';
import { type ComponentColor } from '../../../core/types/component-types';

/** all available integration status values */
export const allIntegrationStatuses = ['active', 'connecting', 'error', 'disconnected'] as const;

/** the current lifecycle status of an integration */
export type IntegrationStatus = (typeof allIntegrationStatuses)[number];

/** a tag entry displayed on an integration card */
export type IntegrationTag = {
  /** display label for the tag */
  label: string;
  /** optional semantic color for the tag — defaults to neutral when omitted */
  color?: TagColor;
};

/** the integration record rendered by the configured integration card */
export type Integration = {
  /** unique id for the integration */
  id: string;
  /** display name for the integration */
  name: string;
  /** workspace the integration targets */
  workspace: string;
  /** channel the integration targets */
  channel: string;
  /** description of what the integration does */
  description: string;
  /** brand icon rendered in the header */
  iconName: IconName;
  /** current lifecycle status */
  status: IntegrationStatus;
  /** tags associated with the integration */
  tags: IntegrationTag[];
  /** the timestamp the integration was created */
  createdAt: DateTime;
  /** the timestamp the integration was last active */
  lastActivityAt: DateTime;
};

/** the action emitted when an overlay menu item is clicked */
type IntegrationMenuAction = 'edit' | 'reconnect' | 'delete';

/** the accessible label for the overlay menu */
const MENU_LABEL = 'Integration actions';

/** the maximum number of tags rendered before the remaining tags are collapsed into a +N overflow tag */
const MAX_VISIBLE_TAGS = 3;

/** per-status mapping of the footer status icon name */
const statusIconMap: Record<IntegrationStatus, IconName> = {
  active: 'circle-check-big',
  connecting: 'loader',
  error: 'circle-x',
  disconnected: 'power-off',
};

/** per-status mapping of the semantic color applied to the box shell and status icon */
const statusColorMap: Record<IntegrationStatus, ComponentColor> = {
  active: 'safe',
  connecting: 'info',
  error: 'danger',
  disconnected: 'neutral',
};

/** per-status mapping of the footer status label */
const statusLabelMap: Record<IntegrationStatus, string> = {
  active: 'Active',
  connecting: 'Connecting',
  error: 'Connection error',
  disconnected: 'Disconnected',
};

@Component({
  selector: 'org-integration-card-configured',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, Button, ButtonIcon, CdkMenuTrigger, DatePipe, Divider, Icon, OverlayMenu, Tag],
  templateUrl: './integration-card-configured.html',
  host: {
    class: 'block',
  },
})
export class IntegrationCardConfigured {
  /** the integration record to render */
  public integration = input.required<Integration>();

  /** emits the integration when the "Edit" menu item is clicked */
  public edit = output<Integration>();

  /** emits the integration when the "Re-connect" menu item is clicked */
  public reconnect = output<Integration>();

  /** emits the integration when the "Delete" menu item is clicked */
  public delete = output<Integration>();

  /** the resolved footer status icon name */
  protected readonly statusIcon = computed<IconName>(() => statusIconMap[this.integration().status]);

  /** the resolved status color applied to the box shell and footer status icon */
  protected readonly statusColor = computed<ComponentColor>(() => statusColorMap[this.integration().status]);

  /** the resolved footer status label text */
  protected readonly statusLabel = computed<string>(() => statusLabelMap[this.integration().status]);

  /** whether the integration is currently connecting and the status icon should spin */
  protected readonly isConnecting = computed<boolean>(() => this.integration().status === 'connecting');

  /** the first N tags rendered inline — the remaining tags are collapsed into the overflow tag */
  protected readonly visibleTags = computed<IntegrationTag[]>(() => this.integration().tags.slice(0, MAX_VISIBLE_TAGS));

  /** the number of tags collapsed into the +N overflow tag; 0 when no overflow is needed */
  protected readonly overflowTagCount = computed<number>(() =>
    Math.max(this.integration().tags.length - MAX_VISIBLE_TAGS, 0)
  );

  /** the overlay menu items — "Re-connect" only appears when the integration is in error state */
  protected readonly menuItems = computed<OverlayMenuItem<IntegrationMenuAction>[]>(() => {
    const items: OverlayMenuItem<IntegrationMenuAction>[] = [
      { id: 'edit', label: 'Edit', icon: 'pencil', meta: 'edit' },
    ];

    if (this.integration().status === 'error') {
      items.push({ id: 'reconnect', label: 'Re-connect', icon: 'power-off', meta: 'reconnect' });
    }

    items.push({ id: 'divider', type: 'divider' });
    items.push({ id: 'delete', label: 'Delete', icon: 'trash', meta: 'delete' });

    return items;
  });

  /** the accessible label for the overlay menu container */
  protected readonly menuLabel = MENU_LABEL;

  /** handles overlay menu item clicks and emits the matching output */
  protected onMenuItemClicked(item: OverlayMenuItemEntry<IntegrationMenuAction>): void {
    const action = item.meta;

    if (action === 'edit') {
      this.edit.emit(this.integration());

      return;
    }

    if (action === 'reconnect') {
      this.reconnect.emit(this.integration());

      return;
    }

    if (action === 'delete') {
      this.delete.emit(this.integration());
    }
  }
}
