import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { expect, userEvent, within } from 'storybook/test';
import { LastUpdated } from './last-updated';
import { type LastUpdatedFormat, type LastUpdatedState } from './last-updated-brain';

const FIXED_DATE_TIME = DateTime.fromISO('2026-05-02T14:02:00');

@Component({
  selector: 'story-last-updated-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LastUpdated],
  host: { class: 'block' },
  template: `
    <org-last-updated
      data-testid="last-updated"
      [state]="state()"
      [format]="format()"
      [label]="label()"
      [refreshable]="refreshable()"
      [tooltipText]="tooltipText()"
      [dateTime]="dateTime()"
      (refresh)="handleRefresh()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-state-stale" (click)="state.set('stale')">state-stale</button>
      <button type="button" data-testid="ctl-state-error" (click)="state.set('error')">state-error</button>
      <button type="button" data-testid="ctl-state-loading" (click)="state.set('loading')">state-loading</button>
      <button type="button" data-testid="ctl-state-fresh" (click)="state.set('fresh')">state-fresh</button>
      <button type="button" data-testid="ctl-format-relative" (click)="format.set('relative')">format-relative</button>
      <button type="button" data-testid="ctl-format-custom" (click)="format.set('yyyy-MM-dd')">format-custom</button>
      <button type="button" data-testid="ctl-format-absolute" (click)="format.set('absolute')">format-absolute</button>
      <button type="button" data-testid="ctl-refreshable-on" (click)="refreshable.set(true)">refreshable-on</button>
      <button type="button" data-testid="ctl-refreshable-off" (click)="refreshable.set(false)">refreshable-off</button>
      <button type="button" data-testid="ctl-tooltip-set" (click)="tooltipText.set('absolute time')">
        tooltip-set
      </button>
      <button type="button" data-testid="ctl-tooltip-null" (click)="setTooltipNull()">tooltip-null</button>
      <button type="button" data-testid="ctl-tooltip-clear" (click)="tooltipText.set(undefined)">tooltip-clear</button>
      <button type="button" data-testid="ctl-datetime-invalid" (click)="setInvalidDateTime()">datetime-invalid</button>
    </div>
  `,
})
class StoryLastUpdatedTestsShell {
  protected readonly state = signal<LastUpdatedState>('fresh');
  protected readonly format = signal<LastUpdatedFormat>('absolute');
  protected readonly label = signal<string>('Last updated');
  protected readonly refreshable = signal<boolean>(false);
  protected readonly tooltipText = signal<string | null | undefined>(undefined);
  protected readonly dateTime = signal<DateTime>(FIXED_DATE_TIME);

  protected readonly refreshCount = signal<number>(0);

  protected readout(): string {
    return `refreshCount=${this.refreshCount()}`;
  }

  protected handleRefresh(): void {
    this.refreshCount.update((value) => value + 1);
  }

  protected setTooltipNull(): void {
    this.tooltipText.set(null);
  }

  protected setInvalidDateTime(): void {
    this.dateTime.set(DateTime.invalid('test reason'));
  }
}

const meta: Meta = {
  title: 'Core/Components/Last Updated/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-last-updated-tests-shell />`,
  moduleMetadata: { imports: [StoryLastUpdatedTestsShell] },
});

export const RendersDefaultHostStateAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('data-state')).toBe('fresh');
  },
};

export const RendersDefaultHostFormatAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('data-format')).toBe('absolute');
  },
};

export const HostHasRoleStatus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('role')).toBe('status');
  },
};

export const ReflectsStaleStateInHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-state-stale'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('data-state')).toBe('stale');
  },
};

export const ReflectsErrorStateInHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-state-error'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('data-state')).toBe('error');
  },
};

export const ReflectsLoadingStateInHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-state-loading'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('data-state')).toBe('loading');
  },
};

export const ReflectsRelativeFormatInHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-format-relative'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('data-format')).toBe('relative');
  },
};

export const ReflectsCustomFormatInHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-format-custom'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('data-format')).toBe('custom');
  },
};

export const AriaLabelForLoadingState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-state-loading'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('aria-label')).toBe('loading last updated');
  },
};

export const AriaLabelForNonLoadingState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');

    await expect(host.getAttribute('aria-label')).toBe('Last updated (fresh): 5/2/26 2:02 PM');
  },
};

export const RendersIndicatorForFreshState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');
    const indicator = host.querySelector('org-indicator.pre');

    await expect(indicator).not.toBeNull();
    await expect(indicator?.getAttribute('data-color')).toBe('safe');
  },
};

export const IndicatorColorForStaleIsCaution: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-state-stale'));

    const host = await canvas.findByTestId('last-updated');
    const indicator = host.querySelector('org-indicator.pre');

    await expect(indicator?.getAttribute('data-color')).toBe('caution');
  },
};

export const IndicatorColorForErrorIsDanger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-state-error'));

    const host = await canvas.findByTestId('last-updated');
    const indicator = host.querySelector('org-indicator.pre');

    await expect(indicator?.getAttribute('data-color')).toBe('danger');
  },
};

export const RendersSpinnerForLoadingState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-state-loading'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.querySelector('org-loading-spinner.spinner')).not.toBeNull();
    await expect(host.querySelector('org-indicator.pre')).toBeNull();
    await expect(host.querySelector('org-button.refresh')).toBeNull();
  },
};

export const RendersRefreshButtonWhenRefreshableAndNotLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-refreshable-on'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.querySelector('org-button.refresh')).not.toBeNull();
    await expect(host.querySelector('org-indicator.pre')).toBeNull();
    await expect(host.querySelector('org-loading-spinner.spinner')).toBeNull();
  },
};

export const LoadingTakesPrecedenceOverRefreshable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-refreshable-on'));
    await userEvent.click(canvas.getByTestId('ctl-state-loading'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.querySelector('org-loading-spinner.spinner')).not.toBeNull();
    await expect(host.querySelector('org-button.refresh')).toBeNull();
  },
};

export const RendersLabelText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');
    const label = host.querySelector('.label');

    await expect(label?.textContent?.trim()).toBe('Last updated');
  },
};

export const RendersTimeElementWithIsoDatetimeAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');
    const time = host.querySelector('time');

    await expect(time).not.toBeNull();
    await expect(time?.getAttribute('datetime')).toContain('2026-05-02T14:02:00');
  },
};

export const RendersFormattedTimeForAbsolute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');
    const time = host.querySelector('time');

    await expect(time?.textContent?.trim()).toBe('5/2/26 2:02 PM');
  },
};

export const RendersFormattedTimeForCustomFormat: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-format-custom'));

    const host = await canvas.findByTestId('last-updated');
    const time = host.querySelector('time');

    await expect(time?.textContent?.trim()).toBe('2026-05-02');
  },
};

export const InvalidDateTimeShowsPlaceholderAndEmptyDatetime: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-datetime-invalid'));

    const host = await canvas.findByTestId('last-updated');
    const time = host.querySelector('time');

    await expect(time?.textContent?.trim()).toBe('----');
    await expect(time?.getAttribute('datetime')).toBe('');
  },
};

export const ClickingRefreshButtonEmitsRefresh: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-refreshable-on'));

    const host = await canvas.findByTestId('last-updated');
    const refreshButton = host.querySelector('org-button.refresh button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('refreshCount=0');

    await userEvent.click(refreshButton);

    await expect(readout.textContent).toContain('refreshCount=1');
  },
};

export const LoadingClobbersPendingRefreshButton: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-refreshable-on'));

    const host = await canvas.findByTestId('last-updated');
    const refreshButton = host.querySelector('org-button.refresh button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(refreshButton);

    await expect(readout.textContent).toContain('refreshCount=1');

    await userEvent.click(canvas.getByTestId('ctl-state-loading'));

    await expect(host.querySelector('org-button.refresh')).toBeNull();
    await expect(host.querySelector('org-loading-spinner.spinner')).not.toBeNull();
  },
};

export const WrapsInTooltipWhenTooltipTextProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-tooltip-set'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.querySelector('org-tooltip')).not.toBeNull();
  },
};

export const DoesNotWrapInTooltipWhenTooltipTextUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('last-updated');

    await expect(host.querySelector('org-tooltip')).toBeNull();
  },
};

export const TooltipTextNullTransformedToUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-tooltip-set'));

    const host = await canvas.findByTestId('last-updated');

    await expect(host.querySelector('org-tooltip')).not.toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-tooltip-null'));

    await expect(host.querySelector('org-tooltip')).toBeNull();
  },
};
