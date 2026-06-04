import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils, type SilencedLogManager } from '../../../../../../vitest-browser-utils';
import { Tooltip, type TooltipPlacement, type TooltipTriggerType } from './tooltip';
import { TooltipBrainDirective } from './tooltip-brain';
import { TooltipContent, type TooltipLayout, type TooltipPhase, type TooltipSize } from './tooltip-content';
import { TooltipTitle } from './tooltip-title';
import { TooltipBody } from './tooltip-body';
import { TooltipAction } from './tooltip-action';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const queryOverlaySurface = (): HTMLElement | null => document.body.querySelector('org-tooltip-content');

const allPlacementValues = [
  'top-start',
  'top',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end',
];

@Component({
  selector: 'test-tooltip-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tooltip, TooltipContent],
  host: { class: 'block' },
  template: `
    <org-tooltip
      [triggerType]="triggerType()"
      [openDelay]="openDelay()"
      [closeDelay]="closeDelay()"
      [keepOpenOnHover]="keepOpenOnHover()"
      [placement]="placement()"
      [disabled]="disabled()"
      (opened)="onOpened()"
      (closed)="onClosed()"
    >
      <button type="button" data-testid="trigger">Trigger</button>
      <ng-template #tooltipContent>
        <org-tooltip-content data-testid="surface">Hello tooltip</org-tooltip-content>
      </ng-template>
    </org-tooltip>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class TooltipShell {
  public readonly triggerType = signal<TooltipTriggerType>('hover');
  public readonly openDelay = signal<number>(0);
  public readonly closeDelay = signal<number>(0);
  public readonly keepOpenOnHover = signal<boolean>(false);
  public readonly placement = signal<TooltipPlacement>('top');
  public readonly disabled = signal<boolean>(false);

  protected readonly openedCount = signal<number>(0);
  protected readonly closedCount = signal<number>(0);

  protected readout(): string {
    return `openedCount=${this.openedCount()} closedCount=${this.closedCount()}`;
  }

  protected onOpened(): void {
    this.openedCount.update((value) => value + 1);
  }

  protected onClosed(): void {
    this.closedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-tooltip-content-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipContent],
  host: { class: 'block' },
  template: `
    <org-tooltip-content
      data-testid="surface"
      [layout]="layout()"
      [size]="size()"
      [placement]="placement()"
      [phase]="phase()"
      [arrow]="arrow()"
    >
      Surface content
    </org-tooltip-content>
  `,
})
class TooltipContentShell {
  public readonly layout = signal<TooltipLayout>('label');
  public readonly size = signal<TooltipSize>('base');
  public readonly placement = signal<TooltipPlacement>('top');
  public readonly phase = signal<TooltipPhase | null>(null);
  public readonly arrow = signal<boolean>(true);
}

@Component({
  selector: 'test-tooltip-rich-layout-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipContent, TooltipTitle, TooltipBody, TooltipAction],
  host: { class: 'block' },
  template: `
    <org-tooltip-content layout="rich" data-testid="surface">
      <org-tooltip-title data-testid="title">Title text</org-tooltip-title>
      <org-tooltip-body data-testid="body">Body text</org-tooltip-body>
      <org-tooltip-action data-testid="action" [href]="actionHref()">Action label</org-tooltip-action>
    </org-tooltip-content>
  `,
})
class TooltipRichLayoutShell {
  public readonly actionHref = signal<string>('#');
}

@Component({
  selector: 'test-tooltip-no-template-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tooltip],
  host: { class: 'block' },
  template: `
    <org-tooltip [openDelay]="0">
      <button type="button" data-testid="trigger">Trigger</button>
    </org-tooltip>
  `,
})
class TooltipNoTemplateShell {}

@Component({
  selector: 'test-tooltip-trigger-override-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipBrainDirective, TooltipContent],
  host: { class: 'block' },
  template: `
    <div orgTooltipBrain #brainRef="orgTooltipBrain" [templateRef]="contentTpl" [openDelay]="0">
      <button type="button" data-testid="default-trigger">Default</button>
      <button type="button" data-testid="manual-trigger">Manual</button>
    </div>
    <ng-template #contentTpl>
      <org-tooltip-content data-testid="surface">Hello override</org-tooltip-content>
    </ng-template>
  `,
})
class TooltipTriggerOverrideShell {
  public readonly brain = viewChild.required<TooltipBrainDirective>('brainRef');

  public overrideToManual(): void {
    const button = document.querySelector('[data-testid="manual-trigger"]') as HTMLElement;

    this.brain().setTriggerElement(button);
  }
}

describe('Tooltip (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes / backdrops left in the body so a stale surface can't leak into the next test
    document.body.querySelectorAll('.cdk-overlay-pane').forEach((pane) => pane.remove());
    document.body.querySelectorAll('.cdk-overlay-backdrop').forEach((backdrop) => backdrop.remove());
    document.body.querySelectorAll('org-tooltip-content').forEach((surface) => surface.remove());
  });

  describe('standalone surface', () => {
    it('renders the default host attributes', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      await flush(fixture);

      expect(surface.getAttribute('role')).toBe('tooltip');
      expect(surface.getAttribute('data-layout')).toBe('label');
      expect(surface.getAttribute('data-size')).toBe('base');
      expect(surface.getAttribute('data-placement')).toBe('top');
    });

    it('omits data-arrow by default', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      await flush(fixture);

      expect(surface.getAttribute('data-arrow')).toBeNull();
    });

    it('reflects data-arrow off when arrow is false', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      fixture.componentInstance.arrow.set(false);
      await flush(fixture);

      expect(surface.getAttribute('data-arrow')).toBe('off');
    });

    it('reflects the layout input', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      fixture.componentInstance.layout.set('rich');
      await flush(fixture);

      expect(surface.getAttribute('data-layout')).toBe('rich');
    });

    it('reflects the size input', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      fixture.componentInstance.size.set('sm');
      await flush(fixture);

      expect(surface.getAttribute('data-size')).toBe('sm');
    });

    it('reflects the placement input when standalone', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      fixture.componentInstance.placement.set('bottom-end');
      await flush(fixture);

      expect(surface.getAttribute('data-placement')).toBe('bottom-end');
    });

    it('reflects the phase input when standalone', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      fixture.componentInstance.phase.set('open');
      await flush(fixture);
      expect(surface.getAttribute('data-state')).toBe('open');

      fixture.componentInstance.phase.set('closing');
      await flush(fixture);
      expect(surface.getAttribute('data-state')).toBe('closing');
    });

    it('omits data-state when phase is null', async () => {
      const fixture = createFixture(TooltipContentShell);
      const surface = queryByTestId(fixture, 'surface');

      await flush(fixture);

      expect(surface.getAttribute('data-state')).toBeNull();
    });
  });

  describe('hover trigger', () => {
    it('opens on mouse enter', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);

      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());
    });

    it('closes on mouse leave', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);
      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

      await userEvent.unhover(trigger);
      await waitFor(() => expect(queryOverlaySurface()).toBeNull());
    });

    it('opens on focus in when hover trigger', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      trigger.focus();

      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());
    });

    it('closes on focus out when hover trigger', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      trigger.focus();
      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

      trigger.blur();
      await waitFor(() => expect(queryOverlaySurface()).toBeNull());
    });

    it('sets aria-describedby on the trigger when open', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      expect(trigger.getAttribute('aria-describedby')).toBeNull();

      await userEvent.hover(trigger);

      await waitFor(() => expect(trigger.getAttribute('aria-describedby')).not.toBeNull());
    });

    it('removes aria-describedby on the trigger when closed', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);
      await waitFor(() => expect(trigger.getAttribute('aria-describedby')).not.toBeNull());

      await userEvent.unhover(trigger);

      await waitFor(() => expect(trigger.getAttribute('aria-describedby')).toBeNull());
    });

    it('sets data-placement on the surface from the brain-resolved placement', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);

      await waitFor(() => {
        const surface = queryOverlaySurface();

        expect(surface).not.toBeNull();
        expect(allPlacementValues).toContain(surface!.getAttribute('data-placement'));
      });
    });
  });

  describe('click trigger', () => {
    it('opens on click when click trigger', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.triggerType.set('click');
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.click(trigger);

      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());
    });

    it('toggles closed on a second click when click trigger', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.triggerType.set('click');
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.click(trigger);
      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

      // once open, the transparent backdrop covers the trigger, so playwright's click is intercepted;
      // dispatch a raw click to exercise the toggle-closed path
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await waitFor(() => expect(queryOverlaySurface()).toBeNull());
    });

    it('does not open on hover when click trigger', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.triggerType.set('click');
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);
      trigger.focus();

      // allow any scheduled open setTimeout(0) to fire; click-mode trigger must not open on hover or focus
      await sleep(50);

      expect(queryOverlaySurface()).toBeNull();
    });

    it('closes the click tooltip on Escape', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.triggerType.set('click');
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.click(trigger);
      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

      await waitFor(() => expect(queryOverlaySurface()).toBeNull());
    });

    it('closes the click tooltip on backdrop click', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.triggerType.set('click');
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.click(trigger);
      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

      const backdrop = vitestBrowserUtils.queryCdkOverlayBackdrop();

      expect(backdrop).not.toBeNull();

      await userEvent.click(backdrop!, { position: { x: 5, y: 5 } });

      await waitFor(() => expect(queryOverlaySurface()).toBeNull());
    });
  });

  describe('disabled', () => {
    it('does not open on hover when disabled', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.disabled.set(true);
      });
      const trigger = queryByTestId(fixture, 'trigger');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.hover(trigger);

      // allow any scheduled open setTimeout(0) to fire; a disabled tooltip must not open
      await sleep(50);

      expect(queryOverlaySurface()).toBeNull();
      expect(readout.textContent).toContain('openedCount=0');
    });

    it('does not open on focus in when disabled', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.disabled.set(true);
      });
      const trigger = queryByTestId(fixture, 'trigger');

      trigger.focus();

      await sleep(50);

      expect(queryOverlaySurface()).toBeNull();
    });

    it('does not open on click when disabled', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.triggerType.set('click');
        instance.disabled.set(true);
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.click(trigger);

      await sleep(50);

      expect(queryOverlaySurface()).toBeNull();
    });

    it('closes an open tooltip when disabled flips to true', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);
      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      await waitFor(() => expect(queryOverlaySurface()).toBeNull());
    });

    it('still opens when disabled is false', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.disabled.set(false);
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);

      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());
    });
  });

  describe('output events', () => {
    it('emits opened when opening', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('openedCount=0');

      await userEvent.hover(trigger);

      // a stray mouseenter/leave cycle from the surface rendering near the parked cursor (open / close
      // delays are both 0 here) can bump the counter past 1, so assert opened fired at least once rather
      // than pinning to an exact count
      await waitFor(() => {
        const openedCount = Number(readout.textContent?.match(/openedCount=(\d+)/)?.[1] ?? 0);

        expect(openedCount).toBeGreaterThanOrEqual(1);
      });
    });

    it('emits closed when closing', async () => {
      const fixture = createFixture(TooltipShell);
      const trigger = queryByTestId(fixture, 'trigger');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.hover(trigger);
      await waitFor(() => expect(readout.textContent).toContain('openedCount=1'));

      expect(readout.textContent).toContain('closedCount=0');

      await userEvent.unhover(trigger);

      await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    });
  });

  describe('keep open on hover', () => {
    it('preserves the tooltip while hovering the surface', async () => {
      const fixture = createFixture(TooltipShell, (instance) => {
        instance.keepOpenOnHover.set(true);
        instance.closeDelay.set(100);
      });
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);
      await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

      await userEvent.unhover(trigger);

      const overlayPane = vitestBrowserUtils.queryCdkOverlayPane();

      expect(overlayPane).not.toBeNull();

      overlayPane!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      // wait longer than the configured 100ms closeDelay to confirm the scheduled close was cancelled
      await sleep(200);

      expect(queryOverlaySurface()).not.toBeNull();

      overlayPane!.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      await waitFor(() => expect(queryOverlaySurface()).toBeNull());
    });
  });

  describe('missing template', () => {
    let logManagerSilence: SilencedLogManager;

    beforeEach(() => {
      logManagerSilence = vitestBrowserUtils.silenceLogManager();
    });

    afterEach(() => {
      logManagerSilence.restore();
    });

    it('renders no overlay when no template is provided', async () => {
      const fixture = createFixture(TooltipNoTemplateShell);
      const trigger = queryByTestId(fixture, 'trigger');

      await userEvent.hover(trigger);

      // allow the scheduled open setTimeout(0) to fire so the brain's missing-template safety branch runs
      await sleep(50);

      expect(queryOverlaySurface()).toBeNull();
    });
  });

  describe('rich layout', () => {
    it('sets the rich layout host attribute', async () => {
      const fixture = createFixture(TooltipRichLayoutShell);
      const surface = queryByTestId(fixture, 'surface');

      await flush(fixture);

      expect(surface.getAttribute('data-layout')).toBe('rich');
    });

    it('renders projected title content', async () => {
      const fixture = createFixture(TooltipRichLayoutShell);
      const title = queryByTestId(fixture, 'title');

      await flush(fixture);

      expect(title.textContent?.trim()).toBe('Title text');
    });

    it('renders projected body content', async () => {
      const fixture = createFixture(TooltipRichLayoutShell);
      const body = queryByTestId(fixture, 'body');

      await flush(fixture);

      expect(body.textContent?.trim()).toBe('Body text');
    });

    it('renders the action anchor with the default href', async () => {
      const fixture = createFixture(TooltipRichLayoutShell);
      const action = queryByTestId(fixture, 'action');

      await flush(fixture);

      const anchor = action.querySelector('a');

      expect(anchor).not.toBeNull();
      expect(anchor?.getAttribute('href')).toBe('#');
      expect(anchor?.textContent?.trim()).toBe('Action label');
    });

    it('reflects the action href input', async () => {
      const fixture = createFixture(TooltipRichLayoutShell);
      const action = queryByTestId(fixture, 'action');

      fixture.componentInstance.actionHref.set('https://example.com');
      await flush(fixture);

      const anchor = action.querySelector('a');

      expect(anchor?.getAttribute('href')).toBe('https://example.com');
    });
  });

  describe('trigger override', () => {
    let logManagerSilence: SilencedLogManager;

    beforeEach(() => {
      logManagerSilence = vitestBrowserUtils.silenceLogManager();
    });

    afterEach(() => {
      logManagerSilence.restore();
    });

    it('overrides the auto-resolved trigger via setTriggerElement', async () => {
      const fixture = createFixture(TooltipTriggerOverrideShell);
      const defaultTrigger = queryByTestId(fixture, 'default-trigger');
      const manualTrigger = queryByTestId(fixture, 'manual-trigger');

      await userEvent.hover(defaultTrigger);
      await waitFor(() => expect(defaultTrigger.getAttribute('aria-describedby')).not.toBeNull());

      await userEvent.unhover(defaultTrigger);
      await waitFor(() => expect(queryOverlaySurface()).toBeNull());

      fixture.componentInstance.overrideToManual();
      await flush(fixture);

      await userEvent.hover(manualTrigger);

      await waitFor(() => {
        expect(queryOverlaySurface()).not.toBeNull();
        expect(manualTrigger.getAttribute('aria-describedby')).not.toBeNull();
        expect(defaultTrigger.getAttribute('aria-describedby')).toBeNull();
      });
    });
  });
});
