import { Directive, computed, input, output } from '@angular/core';
import { DateTime } from 'luxon';
import { angularUtils, dateUtils, DateTimeFormat } from '@organization/shared-utils';
import { type ComponentColor } from '../../core/types/component-types';

/** all valid state values for the last-updated component */
export const allLastUpdatedStates = ['fresh', 'stale', 'error', 'loading'] as const;

/** the state driving the last-updated leading slot, indicator color, and label tone */
export type LastUpdatedState = (typeof allLastUpdatedStates)[number];

/** all valid leading slot identifiers; selects which leading element the presentation renders */
export const allLastUpdatedLeadingSlots = ['indicator', 'refresh', 'spinner'] as const;

/** the leading slot identifier */
export type LastUpdatedLeadingSlot = (typeof allLastUpdatedLeadingSlots)[number];

/** sentinel format values handled internally; any other string is passed to luxon's `DateTime.toFormat()` */
export const allLastUpdatedFormatSentinels = ['relative', 'absolute'] as const;

/** the format axis: `'absolute'` uses the standard datetime format, `'relative'` uses from-now, anything else is a luxon `toFormat` string */
export type LastUpdatedFormat = 'relative' | 'absolute' | string;

/** the styling-stable value surfaced as `data-format` on the host root */
export type LastUpdatedFormatAttribute = 'relative' | 'absolute' | 'custom';

/** placeholder rendered when the bound DateTime is invalid */
export const LAST_UPDATED_INVALID_PLACEHOLDER = '----';

/** default value for the state input */
export const LAST_UPDATED_STATE_DEFAULT: LastUpdatedState = 'fresh';

/** default value for the format input */
export const LAST_UPDATED_FORMAT_DEFAULT: LastUpdatedFormat = 'absolute';

/** default value for the label input */
export const LAST_UPDATED_LABEL_DEFAULT = 'Last updated';

/** default value for the refreshable input */
export const LAST_UPDATED_REFRESHABLE_DEFAULT = false;

/** default value for the tooltipText input */
export const LAST_UPDATED_TOOLTIP_TEXT_DEFAULT: string | undefined = undefined;

/**
 * headless brain directive for the last-updated component. owns the state, format, datetime, label, and
 * refreshability inputs along with the derived leading slot, indicator color, formatted time string, and
 * accessibility surface (role, aria-label) for the presentation to bind. carries no styling or template —
 * apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgLastUpdatedBrain]',
  exportAs: 'orgLastUpdatedBrain',
  host: {
    role: 'status',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class LastUpdatedBrainDirective {
  /** the current state */
  public readonly state = input<LastUpdatedState>(LAST_UPDATED_STATE_DEFAULT);

  /** the format used to render the time string */
  public readonly format = input<LastUpdatedFormat>(LAST_UPDATED_FORMAT_DEFAULT);

  /** the datetime to render */
  public readonly dateTime = input.required<DateTime>();

  /** the label rendered before the time (e.g., "Last updated", "Failed", "Refreshing…") */
  public readonly label = input<string>(LAST_UPDATED_LABEL_DEFAULT);

  /** when true and not loading, the leading slot becomes a refresh button */
  public readonly refreshable = input<boolean>(LAST_UPDATED_REFRESHABLE_DEFAULT);

  /** optional tooltip text surfaced on hover via the org-tooltip component */
  public readonly tooltipText = input<string | undefined, string | null | undefined>(
    LAST_UPDATED_TOOLTIP_TEXT_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** emitted when the refresh button is invoked; gated by `state !== 'loading'` */
  public readonly refresh = output<void>();

  /** the leading slot identifier — drives which leading element the presentation renders */
  public readonly leadingSlot = computed<LastUpdatedLeadingSlot>(() => {
    if (this.state() === 'loading') {
      return 'spinner';
    }

    if (this.refreshable()) {
      return 'refresh';
    }

    return 'indicator';
  });

  /** the indicator color derived from the current state */
  public readonly indicatorColor = computed<ComponentColor>(() => {
    const currentState = this.state();

    if (currentState === 'stale') {
      return 'caution';
    }

    if (currentState === 'error') {
      return 'danger';
    }

    return 'safe';
  });

  /** the styling-stable `data-format` attribute value derived from the format input */
  public readonly formatAttribute = computed<LastUpdatedFormatAttribute>(() => {
    const currentFormat = this.format();

    if (currentFormat === 'relative') {
      return 'relative';
    }

    if (currentFormat === 'absolute') {
      return 'absolute';
    }

    return 'custom';
  });

  /** the rendered time string; gracefully handles invalid datetimes by returning the placeholder */
  public readonly formattedTime = computed<string>(() => {
    const currentDateTime = this.dateTime();

    if (!currentDateTime?.isValid) {
      return LAST_UPDATED_INVALID_PLACEHOLDER;
    }

    const currentFormat = this.format();

    if (currentFormat === 'relative') {
      return dateUtils.fromNow(currentDateTime);
    }

    if (currentFormat === 'absolute') {
      return currentDateTime.toFormat(DateTimeFormat.STANDARD);
    }

    return currentDateTime.toFormat(currentFormat);
  });

  /** the iso-formatted datetime string suitable for the html `<time datetime="…">` attribute */
  public readonly dateTimeIso = computed<string>(() => {
    const currentDateTime = this.dateTime();

    if (!currentDateTime?.isValid) {
      return '';
    }

    return currentDateTime.toISO() ?? '';
  });

  /** accessible label describing the current state for screen readers */
  public readonly ariaLabel = computed<string>(() => {
    const currentState = this.state();

    if (currentState === 'loading') {
      return 'loading last updated';
    }

    return `${this.label()} (${currentState}): ${this.formattedTime()}`;
  });

  /** emit the refresh event — gated by `state !== 'loading'` so consumers do not need to defensively check */
  public requestRefresh(): void {
    if (this.state() === 'loading') {
      return;
    }

    this.refresh.emit();
  }
}
