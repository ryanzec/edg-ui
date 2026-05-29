import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { EmptyIndicator } from './empty-indicator';
import { EmptyIndicatorIcon, type EmptyIndicatorIconColor } from './empty-indicator-icon';
import type { BoxBackground, BoxBorder, BoxColor, BoxPadding } from '../box/box';
import type { IconName } from '../icon/icon-brain';

@Component({
  selector: 'test-empty-indicator-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyIndicator, EmptyIndicatorIcon],
  host: { class: 'block' },
  template: `
    @if (withListener()) {
      <org-empty-indicator
        data-testid="indicator"
        [header]="header()"
        [description]="description()"
        [actionLabel]="actionLabel()"
        [boxColor]="boxColor()"
        [boxBorder]="boxBorder()"
        [boxPadding]="boxPadding()"
        [boxBackground]="boxBackground()"
        [statusRole]="statusRole()"
        (actionTriggered)="handleActionTriggered()"
      >
        @if (showIcon()) {
          <org-empty-indicator-icon data-testid="icon" name="inbox" />
        }
      </org-empty-indicator>
    } @else {
      <org-empty-indicator
        data-testid="indicator"
        [header]="header()"
        [description]="description()"
        [actionLabel]="actionLabel()"
        [boxColor]="boxColor()"
        [boxBorder]="boxBorder()"
        [boxPadding]="boxPadding()"
        [boxBackground]="boxBackground()"
        [statusRole]="statusRole()"
      >
        @if (showIcon()) {
          <org-empty-indicator-icon data-testid="icon" name="inbox" />
        }
      </org-empty-indicator>
    }
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class EmptyIndicatorHost {
  public readonly header = signal<string>('No items found');
  public readonly description = signal<string | null | undefined>(undefined);
  public readonly actionLabel = signal<string | null | undefined>(undefined);
  public readonly boxColor = signal<BoxColor | null | undefined>(undefined);
  public readonly boxBorder = signal<BoxBorder>('bordered');
  public readonly boxPadding = signal<BoxPadding>('base');
  public readonly boxBackground = signal<BoxBackground>('colorless');
  public readonly statusRole = signal<boolean>(true);
  public readonly withListener = signal<boolean>(false);
  public readonly showIcon = signal<boolean>(false);

  protected readonly actionCount = signal<number>(0);

  protected readout(): string {
    return `actionCount=${this.actionCount()}`;
  }

  protected handleActionTriggered(): void {
    this.actionCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-empty-indicator-icon-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyIndicator, EmptyIndicatorIcon],
  host: { class: 'block' },
  template: `
    <org-empty-indicator data-testid="indicator" header="header">
      <org-empty-indicator-icon data-testid="icon" [name]="name()" [color]="color()" [label]="label()" />
    </org-empty-indicator>
  `,
})
class EmptyIndicatorIconHost {
  public readonly name = signal<IconName>('inbox');
  public readonly color = signal<EmptyIndicatorIconColor>('inherit');
  public readonly label = signal<string | null | undefined>(undefined);
}

type EmptyIndicatorHostConfig = {
  header?: string;
  description?: string | null;
  actionLabel?: string | null;
  boxColor?: BoxColor | null;
  boxBorder?: BoxBorder;
  boxPadding?: BoxPadding;
  boxBackground?: BoxBackground;
  statusRole?: boolean;
  withListener?: boolean;
  showIcon?: boolean;
};

type EmptyIndicatorIconHostConfig = {
  name?: IconName;
  color?: EmptyIndicatorIconColor;
  label?: string | null;
};

describe('EmptyIndicator (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createEmptyIndicator = (config: EmptyIndicatorHostConfig = {}): ComponentFixture<EmptyIndicatorHost> =>
    createFixture(EmptyIndicatorHost, (instance) => {
      if (config.header !== undefined) {
        instance.header.set(config.header);
      }

      if (config.description !== undefined) {
        instance.description.set(config.description);
      }

      if (config.actionLabel !== undefined) {
        instance.actionLabel.set(config.actionLabel);
      }

      if (config.boxColor !== undefined) {
        instance.boxColor.set(config.boxColor);
      }

      if (config.boxBorder !== undefined) {
        instance.boxBorder.set(config.boxBorder);
      }

      if (config.boxPadding !== undefined) {
        instance.boxPadding.set(config.boxPadding);
      }

      if (config.boxBackground !== undefined) {
        instance.boxBackground.set(config.boxBackground);
      }

      if (config.statusRole !== undefined) {
        instance.statusRole.set(config.statusRole);
      }

      if (config.withListener !== undefined) {
        instance.withListener.set(config.withListener);
      }

      if (config.showIcon !== undefined) {
        instance.showIcon.set(config.showIcon);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('header and description', () => {
    it('renders the required header text', () => {
      const fixture = createEmptyIndicator();
      const indicator = queryByTestId(fixture, 'indicator');

      expect(indicator.querySelector('h3')?.textContent?.trim()).toBe('No items found');
    });

    it('renders no description by default', () => {
      const fixture = createEmptyIndicator();
      const indicator = queryByTestId(fixture, 'indicator');

      expect(indicator.querySelector('.description')).toBeNull();
    });

    it('renders the description when provided', async () => {
      const fixture = createEmptyIndicator({ description: 'A helpful description' });
      const indicator = queryByTestId(fixture, 'indicator');

      await flush(fixture);

      expect(indicator.querySelector('.description')?.textContent?.trim()).toBe('A helpful description');
    });

    it('transforms a null description into an omitted description', async () => {
      const fixture = createEmptyIndicator({ description: 'A helpful description' });
      const indicator = queryByTestId(fixture, 'indicator');

      expect(indicator.querySelector('.description')).not.toBeNull();

      fixture.componentInstance.description.set(null);
      await flush(fixture);

      expect(indicator.querySelector('.description')).toBeNull();
    });
  });

  describe('action button', () => {
    it('renders no action button by default', () => {
      const fixture = createEmptyIndicator();
      const indicator = queryByTestId(fixture, 'indicator');

      expect(indicator.querySelector('org-button')).toBeNull();
    });

    it('renders no action button when a label is set but no listener is present', async () => {
      const fixture = createEmptyIndicator({ actionLabel: 'Add item' });
      const indicator = queryByTestId(fixture, 'indicator');

      await flush(fixture);

      expect(indicator.querySelector('org-button')).toBeNull();
    });

    it('renders the action button when a label and listener are present', async () => {
      const fixture = createEmptyIndicator({ actionLabel: 'Add item', withListener: true });

      await flush(fixture);

      await waitFor(() => expect(queryByTestId(fixture, 'indicator').querySelector('org-button')).not.toBeNull());
    });

    it('hides the action button when the listener unsubscribes', async () => {
      const fixture = createEmptyIndicator({ actionLabel: 'Add item', withListener: true });

      await flush(fixture);

      await waitFor(() => expect(queryByTestId(fixture, 'indicator').querySelector('org-button')).not.toBeNull());

      fixture.componentInstance.withListener.set(false);
      await flush(fixture);

      await waitFor(() => expect(queryByTestId(fixture, 'indicator').querySelector('org-button')).toBeNull());
    });

    it('emits actionTriggered when the action button is clicked', async () => {
      const fixture = createEmptyIndicator({ actionLabel: 'Add item', withListener: true });
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      expect(readout.textContent).toContain('actionCount=0');

      await waitFor(() =>
        expect(queryByTestId(fixture, 'indicator').querySelector('org-button button')).not.toBeNull()
      );

      const actionButton = queryByTestId(fixture, 'indicator').querySelector('org-button button') as HTMLButtonElement;

      await userEvent.click(actionButton);
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('actionCount=1'));
    });

    it('transforms a null action label into an omitted action button', async () => {
      const fixture = createEmptyIndicator({ actionLabel: 'Add item', withListener: true });

      await flush(fixture);

      await waitFor(() => expect(queryByTestId(fixture, 'indicator').querySelector('org-button')).not.toBeNull());

      fixture.componentInstance.actionLabel.set(null);
      await flush(fixture);

      await waitFor(() => expect(queryByTestId(fixture, 'indicator').querySelector('org-button')).toBeNull());
    });
  });

  describe('inner box forwarding', () => {
    it('forwards the box color to the inner box', async () => {
      const fixture = createEmptyIndicator({ boxColor: 'info' });
      const innerBox = queryByTestId(fixture, 'indicator').querySelector('org-box');

      await waitFor(() => expect(innerBox?.getAttribute('data-color')).toBe('info'));
    });

    it('forwards the box border to the inner box', async () => {
      const fixture = createEmptyIndicator({ boxBorder: 'borderless' });
      const innerBox = queryByTestId(fixture, 'indicator').querySelector('org-box');

      await waitFor(() => expect(innerBox?.getAttribute('data-border')).toBe('borderless'));
    });

    it('forwards the box padding to the inner box', async () => {
      const fixture = createEmptyIndicator({ boxPadding: 'lg' });
      const innerBox = queryByTestId(fixture, 'indicator').querySelector('org-box');

      await waitFor(() => expect(innerBox?.getAttribute('data-padding')).toBe('lg'));
    });

    it('forwards the box background to the inner box', async () => {
      const fixture = createEmptyIndicator({ boxBackground: 'colored' });
      const innerBox = queryByTestId(fixture, 'indicator').querySelector('org-box');

      await waitFor(() => expect(innerBox?.getAttribute('data-background')).toBe('colored'));
    });

    it('transforms a null box color into an omitted data-color attribute', async () => {
      const fixture = createEmptyIndicator({ boxColor: 'info' });
      const innerBox = queryByTestId(fixture, 'indicator').querySelector('org-box');

      await waitFor(() => expect(innerBox?.getAttribute('data-color')).toBe('info'));

      fixture.componentInstance.boxColor.set(null);
      await flush(fixture);

      await waitFor(() => expect(innerBox?.getAttribute('data-color')).toBeNull());
    });
  });

  describe('status role', () => {
    it('applies role="status" to the host by default', () => {
      const fixture = createEmptyIndicator();
      const indicator = queryByTestId(fixture, 'indicator');

      expect(indicator.getAttribute('role')).toBe('status');
    });

    it('omits the role attribute when statusRole is false', async () => {
      const fixture = createEmptyIndicator({ statusRole: false });
      const indicator = queryByTestId(fixture, 'indicator');

      await waitFor(() => expect(indicator.getAttribute('role')).toBeNull());
    });
  });

  describe('icon projection', () => {
    it('projects the empty-indicator-icon above the header', async () => {
      const fixture = createEmptyIndicator();
      const indicator = queryByTestId(fixture, 'indicator');

      expect(indicator.querySelector('org-empty-indicator-icon')).toBeNull();

      fixture.componentInstance.showIcon.set(true);
      await flush(fixture);

      await waitFor(() => expect(indicator.querySelector('org-empty-indicator-icon')).not.toBeNull());
    });
  });
});

describe('EmptyIndicatorIcon (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createEmptyIndicatorIcon = (
    config: EmptyIndicatorIconHostConfig = {}
  ): ComponentFixture<EmptyIndicatorIconHost> =>
    createFixture(EmptyIndicatorIconHost, (instance) => {
      if (config.name !== undefined) {
        instance.name.set(config.name);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('color', () => {
    it('defaults the data-color attribute to inherit', () => {
      const fixture = createEmptyIndicatorIcon();
      const icon = queryByTestId(fixture, 'icon');

      expect(icon.getAttribute('data-color')).toBe('inherit');
    });

    it('reflects the color input on the data-color attribute', async () => {
      const fixture = createEmptyIndicatorIcon();
      const icon = queryByTestId(fixture, 'icon');

      fixture.componentInstance.color.set('primary');
      await flush(fixture);

      await waitFor(() => expect(icon.getAttribute('data-color')).toBe('primary'));

      fixture.componentInstance.color.set('danger');
      await flush(fixture);

      await waitFor(() => expect(icon.getAttribute('data-color')).toBe('danger'));
    });
  });

  describe('inner icon forwarding', () => {
    it('forwards the name to the inner icon', async () => {
      const fixture = createEmptyIndicatorIcon();
      const icon = queryByTestId(fixture, 'icon');

      expect(icon.querySelector('org-icon')?.getAttribute('data-icon')).toBe('inbox');

      fixture.componentInstance.name.set('search');
      await flush(fixture);

      await waitFor(() => expect(icon.querySelector('org-icon')?.getAttribute('data-icon')).toBe('search'));
    });

    it('keeps the inner icon size pinned to 4xl', async () => {
      const fixture = createEmptyIndicatorIcon();
      const icon = queryByTestId(fixture, 'icon');
      const innerIcon = icon.querySelector('org-icon') as HTMLElement;

      expect(innerIcon.getAttribute('data-size')).toBe('4xl');

      fixture.componentInstance.color.set('primary');
      await flush(fixture);

      await waitFor(() => expect(innerIcon.getAttribute('data-size')).toBe('4xl'));
    });

    it('keeps the inner icon color pinned to inherit', async () => {
      const fixture = createEmptyIndicatorIcon();
      const icon = queryByTestId(fixture, 'icon');
      const innerIcon = icon.querySelector('org-icon') as HTMLElement;

      expect(innerIcon.getAttribute('data-color')).toBe('inherit');

      fixture.componentInstance.color.set('danger');
      await flush(fixture);

      await waitFor(() => expect(innerIcon.getAttribute('data-color')).toBe('inherit'));
    });
  });

  describe('accessible label', () => {
    it('forwards the label to the inner icon aria-label', async () => {
      const fixture = createEmptyIndicatorIcon();
      const icon = queryByTestId(fixture, 'icon');

      fixture.componentInstance.label.set('No inbox items');
      await flush(fixture);

      await waitFor(() => {
        const svg = icon.querySelector('svg') as SVGElement;

        expect(svg.getAttribute('aria-label')).toBe('No inbox items');
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-hidden')).toBeNull();
      });
    });

    it('transforms a null label into a decorative icon', async () => {
      const fixture = createEmptyIndicatorIcon();
      const icon = queryByTestId(fixture, 'icon');

      fixture.componentInstance.label.set('No inbox items');
      await flush(fixture);

      await waitFor(() => {
        const svg = icon.querySelector('svg') as SVGElement;

        expect(svg.getAttribute('aria-label')).toBe('No inbox items');
      });

      fixture.componentInstance.label.set(null);
      await flush(fixture);

      await waitFor(() => {
        const svg = icon.querySelector('svg') as SVGElement;

        expect(svg.getAttribute('aria-label')).toBeNull();
        expect(svg.getAttribute('aria-hidden')).toBe('true');
        expect(svg.getAttribute('role')).toBeNull();
      });
    });
  });
});
