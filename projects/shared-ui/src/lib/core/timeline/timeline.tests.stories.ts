import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type IconName } from '../icon/icon-brain';
import { Timeline } from './timeline';
import { TimelineContent } from './timeline-content';
import { TimelineHeader } from './timeline-header';
import { TimelineItem, type TimelineItemColor, type TimelineItemColorMode } from './timeline-item';
import { TimelineTime } from './timeline-time';

@Component({
  selector: 'story-timeline-default-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Timeline, TimelineItem, TimelineTime, TimelineHeader, TimelineContent],
  host: { class: 'block' },
  template: `
    <org-timeline data-testid="timeline">
      <org-timeline-item data-testid="item">
        <org-timeline-time>10:00 AM</org-timeline-time>
        <org-timeline-header data-testid="header">Order Placed</org-timeline-header>
        <org-timeline-content>Your order has been received.</org-timeline-content>
      </org-timeline-item>
      <org-timeline-item>
        <org-timeline-header>Processing</org-timeline-header>
      </org-timeline-item>
    </org-timeline>
  `,
})
class StoryTimelineDefaultShell {}

@Component({
  selector: 'story-timeline-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Timeline, TimelineItem, TimelineTime, TimelineHeader, TimelineContent],
  host: { class: 'block' },
  template: `
    <org-timeline data-testid="timeline" [role]="role()">
      <org-timeline-item data-testid="item" [color]="color()" [colorMode]="colorMode()" [dotIcon]="dotIcon()">
        <org-timeline-time>10:00 AM</org-timeline-time>
        <org-timeline-header>Order Placed</org-timeline-header>
        <org-timeline-content>Your order has been received.</org-timeline-content>
      </org-timeline-item>
    </org-timeline>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-role-feed" (click)="role.set('feed')">role-feed</button>
      <button type="button" data-testid="ctl-role-null" (click)="role.set(null)">role-null</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-color-mode-both" (click)="colorMode.set('both')">color-mode-both</button>
      <button type="button" data-testid="ctl-dot-icon-check" (click)="dotIcon.set('check')">dot-icon-check</button>
      <button type="button" data-testid="ctl-dot-icon-null" (click)="dotIcon.set(null)">dot-icon-null</button>
    </div>
  `,
})
class StoryTimelineTestsShell {
  protected readonly role = signal<string | null | undefined>('list');
  protected readonly color = signal<TimelineItemColor>('neutral');
  protected readonly colorMode = signal<TimelineItemColorMode>('line');
  protected readonly dotIcon = signal<IconName | null | undefined>(undefined);
}

@Component({
  selector: 'story-timeline-header-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineHeader],
  host: { class: 'block' },
  template: `
    <org-timeline-header data-testid="header" [headingLevel]="headingLevel()">Heading Text</org-timeline-header>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-level-1" (click)="headingLevel.set(1)">level-1</button>
      <button type="button" data-testid="ctl-level-6" (click)="headingLevel.set(6)">level-6</button>
    </div>
  `,
})
class StoryTimelineHeaderTestsShell {
  protected readonly headingLevel = signal<number>(3);
}

const meta: Meta = {
  title: 'Core/Components/Timeline/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderDefaultShell: Story['render'] = () => ({
  template: `<story-timeline-default-shell />`,
  moduleMetadata: { imports: [StoryTimelineDefaultShell] },
});

const renderShell: Story['render'] = () => ({
  template: `<story-timeline-tests-shell />`,
  moduleMetadata: { imports: [StoryTimelineTestsShell] },
});

const renderHeaderShell: Story['render'] = () => ({
  template: `<story-timeline-header-tests-shell />`,
  moduleMetadata: { imports: [StoryTimelineHeaderTestsShell] },
});

export const TimelineHostHasListRoleByDefault: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const timeline = await canvas.findByTestId('timeline');

    await expect(timeline.getAttribute('role')).toBe('list');
  },
};

export const TimelineProjectsTimelineItems: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const timeline = await canvas.findByTestId('timeline');

    await expect(timeline.querySelectorAll('org-timeline-item').length).toBe(2);
  },
};

export const TimelineItemHostHasListitemRole: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('role')).toBe('listitem');
  },
};

export const TimelineItemDefaultsToNeutralDataColor: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-color')).toBe('neutral');
  },
};

export const TimelineItemDefaultsToLineDataColorMode: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-color-mode')).toBe('line');
  },
};

export const TimelineItemOmitsDataHasIconByDefault: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-has-icon')).toBeNull();
  },
};

export const TimelineItemOmitsIconElementWhenDotIconUndefined: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.querySelector('org-icon')).toBeNull();
  },
};

export const TimelineItemProjectsTimeAndContentText: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.textContent).toContain('10:00 AM');
    await expect(item.textContent).toContain('Your order has been received.');
  },
};

export const TimelineHeaderRendersH3ByDefault: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await expect(header.querySelector('h3')).not.toBeNull();
  },
};

export const TimelineHostReflectsCustomRole: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const timeline = await canvas.findByTestId('timeline');

    await userEvent.click(canvas.getByTestId('ctl-role-feed'));

    await waitFor(() => expect(timeline.getAttribute('role')).toBe('feed'));
  },
};

export const TimelineHostRemovesRoleWhenNull: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const timeline = await canvas.findByTestId('timeline');

    await userEvent.click(canvas.getByTestId('ctl-role-null'));

    await waitFor(() => expect(timeline.getAttribute('role')).toBeNull());
  },
};

export const TimelineItemReflectsColorInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    await waitFor(() => expect(item.getAttribute('data-color')).toBe('danger'));
  },
};

export const TimelineItemReflectsColorModeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-color-mode-both'));

    await waitFor(() => expect(item.getAttribute('data-color-mode')).toBe('both'));
  },
};

export const TimelineItemSetsDataHasIconWhenDotIconProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-dot-icon-check'));

    await waitFor(() => expect(item.getAttribute('data-has-icon')).toBe(''));
  },
};

export const TimelineItemTransformsNullDotIconToUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-dot-icon-check'));

    await waitFor(() => expect(item.getAttribute('data-has-icon')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-dot-icon-null'));

    await waitFor(() => expect(item.getAttribute('data-has-icon')).toBeNull());
  },
};

export const TimelineItemRendersIconElementInsideDotWhenDotIconProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-dot-icon-check'));

    await waitFor(() => {
      const icon = item.querySelector('.dot org-icon');

      expect(icon).not.toBeNull();
    });
  },
};

export const TimelineHeaderRendersH1WhenHeadingLevelOne: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-level-1'));

    await waitFor(() => expect(header.querySelector('h1')).not.toBeNull());
  },
};

export const TimelineHeaderRendersH6WhenHeadingLevelSix: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-level-6'));

    await waitFor(() => expect(header.querySelector('h6')).not.toBeNull());
  },
};

export const TimelineHeaderProjectsContentInsideHeading: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    const h3 = header.querySelector('h3');

    await expect(h3).not.toBeNull();
    await expect(h3?.textContent?.trim()).toBe('Heading Text');
  },
};
