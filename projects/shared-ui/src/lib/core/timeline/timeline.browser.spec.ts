import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { type IconName } from '../icon/icon-brain';
import { Timeline } from './timeline';
import { TimelineContent } from './timeline-content';
import { TimelineHeader } from './timeline-header';
import { TimelineItem, type TimelineItemColor, type TimelineItemColorMode } from './timeline-item';
import { TimelineTime } from './timeline-time';

@Component({
  selector: 'test-timeline-default-host',
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
class TimelineDefaultHost {}

@Component({
  selector: 'test-timeline-host',
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
  `,
})
class TimelineHost {
  public readonly role = signal<string | null | undefined>('list');
  public readonly color = signal<TimelineItemColor>('neutral');
  public readonly colorMode = signal<TimelineItemColorMode>('line');
  public readonly dotIcon = signal<IconName | null | undefined>(undefined);
}

@Component({
  selector: 'test-timeline-header-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineHeader],
  host: { class: 'block' },
  template: `<org-timeline-header data-testid="header" [headingLevel]="headingLevel()"
    >Heading Text</org-timeline-header
  >`,
})
class TimelineHeaderHost {
  public readonly headingLevel = signal<number>(3);
}

describe('Timeline (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  type TimelineHostConfig = {
    role?: string | null | undefined;
    color?: TimelineItemColor;
    colorMode?: TimelineItemColorMode;
    dotIcon?: IconName | null | undefined;
  };

  const createTimeline = (config: TimelineHostConfig = {}): ComponentFixture<TimelineHost> =>
    createFixture(TimelineHost, (instance) => {
      if (config.role !== undefined) {
        instance.role.set(config.role);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.colorMode !== undefined) {
        instance.colorMode.set(config.colorMode);
      }

      if (config.dotIcon !== undefined) {
        instance.dotIcon.set(config.dotIcon);
      }
    });

  describe('default rendering', () => {
    it('exposes the timeline host with the list role by default', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const timeline = queryByTestId(fixture, 'timeline');

      expect(timeline.getAttribute('role')).toBe('list');
    });

    it('projects each timeline item', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const timeline = queryByTestId(fixture, 'timeline');

      expect(timeline.querySelectorAll('org-timeline-item').length).toBe(2);
    });

    it('exposes the timeline item host with the listitem role', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('role')).toBe('listitem');
    });

    it('defaults the item data-color to neutral', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-color')).toBe('neutral');
    });

    it('defaults the item data-color-mode to line', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-color-mode')).toBe('line');
    });

    it('omits data-has-icon by default', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-has-icon')).toBeNull();
    });

    it('omits the icon element when dotIcon is undefined', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const item = queryByTestId(fixture, 'item');

      expect(item.querySelector('org-icon')).toBeNull();
    });

    it('projects the time and content text into the item', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const item = queryByTestId(fixture, 'item');

      expect(item.textContent).toContain('10:00 AM');
      expect(item.textContent).toContain('Your order has been received.');
    });

    it('renders an h3 header by default', () => {
      const fixture = createFixture(TimelineDefaultHost);
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('h3')).not.toBeNull();
    });
  });

  describe('timeline role input', () => {
    it('reflects a custom role', async () => {
      const fixture = createTimeline();
      const timeline = queryByTestId(fixture, 'timeline');

      fixture.componentInstance.role.set('feed');
      await flush(fixture);

      expect(timeline.getAttribute('role')).toBe('feed');
    });

    it('removes the role when set to null', async () => {
      const fixture = createTimeline();
      const timeline = queryByTestId(fixture, 'timeline');

      fixture.componentInstance.role.set(null);
      await flush(fixture);

      expect(timeline.getAttribute('role')).toBeNull();
    });
  });

  describe('timeline item color inputs', () => {
    it('reflects the color input', async () => {
      const fixture = createTimeline();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.color.set('danger');
      await flush(fixture);

      expect(item.getAttribute('data-color')).toBe('danger');
    });

    it('reflects the colorMode input', async () => {
      const fixture = createTimeline();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.colorMode.set('both');
      await flush(fixture);

      expect(item.getAttribute('data-color-mode')).toBe('both');
    });
  });

  describe('timeline item dotIcon input', () => {
    it('sets data-has-icon when a dotIcon is provided', async () => {
      const fixture = createTimeline();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.dotIcon.set('check');
      await flush(fixture);

      expect(item.getAttribute('data-has-icon')).toBe('');
    });

    it('transforms a null dotIcon back to undefined', async () => {
      const fixture = createTimeline();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.dotIcon.set('check');
      await flush(fixture);
      expect(item.getAttribute('data-has-icon')).toBe('');

      fixture.componentInstance.dotIcon.set(null);
      await flush(fixture);
      expect(item.getAttribute('data-has-icon')).toBeNull();
    });

    it('renders the icon element inside the dot when a dotIcon is provided', async () => {
      const fixture = createTimeline();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.dotIcon.set('check');
      await flush(fixture);

      expect(item.querySelector('.dot org-icon')).not.toBeNull();
    });
  });

  describe('timeline header headingLevel input', () => {
    it('renders an h1 when headingLevel is one', async () => {
      const fixture = createFixture(TimelineHeaderHost);
      const header = queryByTestId(fixture, 'header');

      fixture.componentInstance.headingLevel.set(1);
      await flush(fixture);

      expect(header.querySelector('h1')).not.toBeNull();
    });

    it('renders an h6 when headingLevel is six', async () => {
      const fixture = createFixture(TimelineHeaderHost);
      const header = queryByTestId(fixture, 'header');

      fixture.componentInstance.headingLevel.set(6);
      await flush(fixture);

      expect(header.querySelector('h6')).not.toBeNull();
    });

    it('projects the header content inside the heading element', () => {
      const fixture = createFixture(TimelineHeaderHost);
      const header = queryByTestId(fixture, 'header');

      const h3 = header.querySelector('h3');

      expect(h3).not.toBeNull();
      expect(h3?.textContent?.trim()).toBe('Heading Text');
    });
  });
});
