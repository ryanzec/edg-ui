import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Box, type BoxBackground, type BoxBorder, type BoxColor, type BoxPadding } from './box';
import { BoxBrainDirective } from './box-brain';

@Component({
  selector: 'test-box-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box],
  host: { class: 'block' },
  template: `
    <org-box
      data-testid="box"
      [color]="color()"
      [border]="border()"
      [padding]="padding()"
      [background]="background()"
      (clicked)="handleClicked()"
    >
      <span data-testid="content">box content</span>
    </org-box>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class BoxInteractiveHost {
  protected readonly boxBrain = viewChild.required(BoxBrainDirective);

  public readonly color = signal<BoxColor | null | undefined>(undefined);
  public readonly border = signal<BoxBorder>('bordered');
  public readonly padding = signal<BoxPadding>('base');
  public readonly background = signal<BoxBackground>('colored');

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()} isPressed=${this.boxBrain().isPressed()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-box-static-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box],
  host: { class: 'block' },
  template: `
    <org-box data-testid="box">
      <span data-testid="content">static content</span>
    </org-box>
  `,
})
class BoxStaticHost {}

@Component({
  selector: 'test-box-external-clickable-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box],
  host: { class: 'block' },
  template: ` <org-box data-testid="box">external content</org-box> `,
})
class BoxExternalClickableHost {
  public readonly boxBrain = viewChild.required(BoxBrainDirective);
}

type BoxHostConfig = {
  color?: BoxColor | null;
  border?: BoxBorder;
  padding?: BoxPadding;
  background?: BoxBackground;
};

describe('Box (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveBox = (config: BoxHostConfig = {}): ComponentFixture<BoxInteractiveHost> =>
    createFixture(BoxInteractiveHost, (instance) => {
      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.border !== undefined) {
        instance.border.set(config.border);
      }

      if (config.padding !== undefined) {
        instance.padding.set(config.padding);
      }

      if (config.background !== undefined) {
        instance.background.set(config.background);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default border, padding, and background attributes and omits color', () => {
      const fixture = createFixture(BoxStaticHost);
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('data-border')).toBe('bordered');
      expect(host.getAttribute('data-padding')).toBe('base');
      expect(host.getAttribute('data-background')).toBe('colored');
      expect(host.getAttribute('data-color')).toBeNull();
    });

    it('reflects the color input on the host', () => {
      const fixture = createInteractiveBox({ color: 'danger' });
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('data-color')).toBe('danger');
    });

    it('reflects the border input on the host', () => {
      const fixture = createInteractiveBox({ border: 'borderless' });
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('data-border')).toBe('borderless');
    });

    it('reflects the padding input on the host', () => {
      const fixture = createInteractiveBox({ padding: 'lg' });
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('data-padding')).toBe('lg');
    });

    it('reflects the background input on the host', () => {
      const fixture = createInteractiveBox({ background: 'colorless' });
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('data-background')).toBe('colorless');
    });

    it('transforms a null color into an omitted attribute', async () => {
      const fixture = createInteractiveBox({ color: 'danger' });
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('data-color')).toBe('danger');

      fixture.componentInstance.color.set(null);
      await flush(fixture);

      expect(host.getAttribute('data-color')).toBeNull();
    });
  });

  describe('content projection', () => {
    it('projects child content', () => {
      const fixture = createFixture(BoxStaticHost);
      const host = queryByTestId(fixture, 'box');

      const content = host.querySelector('[data-testid="content"]');

      expect(content?.textContent).toBe('static content');
    });
  });

  describe('clickable detection', () => {
    it('omits the clickable host attributes for a static box', () => {
      const fixture = createFixture(BoxStaticHost);
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();
    });

    it('applies the clickable host attributes when a clicked listener is attached', () => {
      const fixture = createInteractiveBox();
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('role')).toBe('button');
      expect(host.getAttribute('tabindex')).toBe('0');
      expect(host.getAttribute('data-clickable')).toBe('');
    });

    it('enables the clickable host attributes when externally forced on', async () => {
      const fixture = createFixture(BoxExternalClickableHost);
      const host = queryByTestId(fixture, 'box');

      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();

      fixture.componentInstance.boxBrain().setExternallyClickable(true);
      await flush(fixture);

      expect(host.getAttribute('role')).toBe('button');
      expect(host.getAttribute('tabindex')).toBe('0');
      expect(host.getAttribute('data-clickable')).toBe('');
    });

    it('clears the clickable host attributes when externally forced off', async () => {
      const fixture = createFixture(BoxExternalClickableHost);
      const host = queryByTestId(fixture, 'box');

      fixture.componentInstance.boxBrain().setExternallyClickable(true);
      await flush(fixture);
      expect(host.getAttribute('data-clickable')).toBe('');

      fixture.componentInstance.boxBrain().setExternallyClickable(false);
      await flush(fixture);

      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();
    });
  });

  describe('clicked output', () => {
    it('emits clicked on a pointer click', async () => {
      const fixture = createInteractiveBox();
      const host = queryByTestId(fixture, 'box');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('clickCount=0');

      await userEvent.click(host);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=1');
    });

    it('emits clicked on Enter and prevents default', async () => {
      const fixture = createInteractiveBox();
      const host = queryByTestId(fixture, 'box');
      const readout = queryByTestId(fixture, 'readout');

      const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true });
      host.dispatchEvent(event);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=1');
      expect(event.defaultPrevented).toBe(true);
    });

    it('emits clicked on Space and prevents default', async () => {
      const fixture = createInteractiveBox();
      const host = queryByTestId(fixture, 'box');
      const readout = queryByTestId(fixture, 'readout');

      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
      host.dispatchEvent(event);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=1');
      expect(event.defaultPrevented).toBe(true);
    });

    it('does not emit clicked for other keys', async () => {
      const fixture = createInteractiveBox();
      const host = queryByTestId(fixture, 'box');
      const readout = queryByTestId(fixture, 'readout');

      const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true, bubbles: true });
      host.dispatchEvent(event);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('pressed state', () => {
    it('does not enter the pressed state on mouse down for a static box', async () => {
      const fixture = createFixture(BoxStaticHost);
      const host = queryByTestId(fixture, 'box');

      host.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flush(fixture);

      expect(host.getAttribute('data-pressed')).toBeNull();
    });

    it('flips data-pressed on mouse down and mouse up', async () => {
      const fixture = createInteractiveBox();
      const host = queryByTestId(fixture, 'box');
      const readout = queryByTestId(fixture, 'readout');

      host.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flush(fixture);
      expect(host.getAttribute('data-pressed')).toBe('');
      expect(readout.textContent).toContain('isPressed=true');

      host.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      await flush(fixture);
      expect(host.getAttribute('data-pressed')).toBeNull();
      expect(readout.textContent).toContain('isPressed=false');
    });

    it('clears data-pressed on mouse leave', async () => {
      const fixture = createInteractiveBox();
      const host = queryByTestId(fixture, 'box');
      const readout = queryByTestId(fixture, 'readout');

      host.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flush(fixture);
      expect(readout.textContent).toContain('isPressed=true');

      host.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await flush(fixture);
      expect(host.getAttribute('data-pressed')).toBeNull();
      expect(readout.textContent).toContain('isPressed=false');
    });
  });
});
