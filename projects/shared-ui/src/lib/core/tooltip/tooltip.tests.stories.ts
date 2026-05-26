import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Tooltip, type TooltipPlacement, type TooltipTriggerType } from './tooltip';
import { TooltipBrainDirective } from './tooltip-brain';
import { TooltipContent, type TooltipLayout, type TooltipPhase, type TooltipSize } from './tooltip-content';
import { TooltipTitle } from './tooltip-title';
import { TooltipBody } from './tooltip-body';
import { TooltipAction } from './tooltip-action';

const queryOverlaySurface = (): HTMLElement | null => document.body.querySelector('org-tooltip-content');

const queryOverlayPane = (): HTMLElement | null => document.body.querySelector('.cdk-overlay-pane');

const queryOverlayBackdrop = (): HTMLElement | null => document.body.querySelector('.cdk-overlay-backdrop');

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
  selector: 'story-tooltip-tests-shell',
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
      (opened)="onOpened()"
      (closed)="onClosed()"
    >
      <button type="button" data-testid="trigger">Trigger</button>
      <ng-template #tooltipContent>
        <org-tooltip-content data-testid="surface">Hello tooltip</org-tooltip-content>
      </ng-template>
    </org-tooltip>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-trigger-click" (click)="triggerType.set('click')">trigger-click</button>
      <button type="button" data-testid="ctl-trigger-hover" (click)="triggerType.set('hover')">trigger-hover</button>
      <button type="button" data-testid="ctl-close-delay-100" (click)="closeDelay.set(100)">close-delay-100</button>
      <button type="button" data-testid="ctl-keep-open-on" (click)="keepOpenOnHover.set(true)">keep-open-on</button>
      <button type="button" data-testid="ctl-placement-bottom" (click)="placement.set('bottom')">
        placement-bottom
      </button>
    </div>
  `,
})
class StoryTooltipTestsShell {
  protected readonly triggerType = signal<TooltipTriggerType>('hover');
  protected readonly openDelay = signal<number>(0);
  protected readonly closeDelay = signal<number>(0);
  protected readonly keepOpenOnHover = signal<boolean>(false);
  protected readonly placement = signal<TooltipPlacement>('top');

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
  selector: 'story-tooltip-content-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-layout-rich" (click)="layout.set('rich')">layout-rich</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-placement-bottom-end" (click)="placement.set('bottom-end')">
        placement-bottom-end
      </button>
      <button type="button" data-testid="ctl-phase-open" (click)="phase.set('open')">phase-open</button>
      <button type="button" data-testid="ctl-phase-closing" (click)="phase.set('closing')">phase-closing</button>
      <button type="button" data-testid="ctl-arrow-off" (click)="arrow.set(false)">arrow-off</button>
    </div>
  `,
})
class StoryTooltipContentTestsShell {
  protected readonly layout = signal<TooltipLayout>('label');
  protected readonly size = signal<TooltipSize>('base');
  protected readonly placement = signal<TooltipPlacement>('top');
  protected readonly phase = signal<TooltipPhase | null>(null);
  protected readonly arrow = signal<boolean>(true);
}

@Component({
  selector: 'story-tooltip-rich-layout-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipContent, TooltipTitle, TooltipBody, TooltipAction],
  host: { class: 'block' },
  template: `
    <org-tooltip-content layout="rich" data-testid="surface">
      <org-tooltip-title data-testid="title">Title text</org-tooltip-title>
      <org-tooltip-body data-testid="body">Body text</org-tooltip-body>
      <org-tooltip-action data-testid="action" [href]="actionHref()">Action label</org-tooltip-action>
    </org-tooltip-content>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-href-target" (click)="actionHref.set('https://example.com')">
        href-target
      </button>
    </div>
  `,
})
class StoryTooltipRichLayoutShell {
  protected readonly actionHref = signal<string>('#');
}

@Component({
  selector: 'story-tooltip-no-template-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tooltip],
  host: { class: 'block' },
  template: `
    <org-tooltip [openDelay]="0">
      <button type="button" data-testid="trigger">Trigger</button>
    </org-tooltip>
  `,
})
class StoryTooltipNoTemplateShell {}

@Component({
  selector: 'story-tooltip-trigger-override-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-override-manual" (click)="overrideToManual()">override-manual</button>
    </div>
  `,
})
class StoryTooltipTriggerOverrideShell {
  protected readonly brain = viewChild.required<TooltipBrainDirective>('brainRef');

  protected overrideToManual(): void {
    const button = document.querySelector('[data-testid="manual-trigger"]') as HTMLElement;

    this.brain().setTriggerElement(button);
  }
}

const meta: Meta = {
  title: 'Core/Components/Tooltip/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-tooltip-tests-shell />`,
  moduleMetadata: { imports: [StoryTooltipTestsShell] },
});

const renderContentShell: Story['render'] = () => ({
  template: `<story-tooltip-content-tests-shell />`,
  moduleMetadata: { imports: [StoryTooltipContentTestsShell] },
});

const renderRichShell: Story['render'] = () => ({
  template: `<story-tooltip-rich-layout-shell />`,
  moduleMetadata: { imports: [StoryTooltipRichLayoutShell] },
});

const renderNoTemplateShell: Story['render'] = () => ({
  template: `<story-tooltip-no-template-shell />`,
  moduleMetadata: { imports: [StoryTooltipNoTemplateShell] },
});

const renderOverrideShell: Story['render'] = () => ({
  template: `<story-tooltip-trigger-override-shell />`,
  moduleMetadata: { imports: [StoryTooltipTriggerOverrideShell] },
});

export const SurfaceRendersDefaultHostAttributes: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await expect(surface.getAttribute('role')).toBe('tooltip');
    await expect(surface.getAttribute('data-layout')).toBe('label');
    await expect(surface.getAttribute('data-size')).toBe('base');
    await expect(surface.getAttribute('data-placement')).toBe('top');
  },
};

export const SurfaceOmitsDataArrowByDefault: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await expect(surface.getAttribute('data-arrow')).toBeNull();
  },
};

export const SurfaceReflectsDataArrowOffWhenArrowFalse: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await userEvent.click(canvas.getByTestId('ctl-arrow-off'));

    await waitFor(() => expect(surface.getAttribute('data-arrow')).toBe('off'));
  },
};

export const SurfaceReflectsLayoutInput: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await userEvent.click(canvas.getByTestId('ctl-layout-rich'));

    await waitFor(() => expect(surface.getAttribute('data-layout')).toBe('rich'));
  },
};

export const SurfaceReflectsSizeInput: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    await waitFor(() => expect(surface.getAttribute('data-size')).toBe('sm'));
  },
};

export const SurfaceReflectsPlacementInputWhenStandalone: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await userEvent.click(canvas.getByTestId('ctl-placement-bottom-end'));

    await waitFor(() => expect(surface.getAttribute('data-placement')).toBe('bottom-end'));
  },
};

export const SurfaceReflectsPhaseInputWhenStandalone: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await userEvent.click(canvas.getByTestId('ctl-phase-open'));

    await waitFor(() => expect(surface.getAttribute('data-state')).toBe('open'));

    await userEvent.click(canvas.getByTestId('ctl-phase-closing'));

    await waitFor(() => expect(surface.getAttribute('data-state')).toBe('closing'));
  },
};

export const SurfaceOmitsDataStateWhenPhaseNull: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await expect(surface.getAttribute('data-state')).toBeNull();
  },
};

export const OpensOnHoverMouseEnter: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.hover(trigger);

    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());
  },
};

export const ClosesOnHoverMouseLeave: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.hover(trigger);
    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

    await userEvent.unhover(trigger);
    await waitFor(() => expect(queryOverlaySurface()).toBeNull());
  },
};

export const OpensOnFocusInWhenHoverTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    trigger.focus();

    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());
  },
};

export const ClosesOnFocusOutWhenHoverTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    trigger.focus();
    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

    trigger.blur();
    await waitFor(() => expect(queryOverlaySurface()).toBeNull());
  },
};

export const OpensOnClickWhenClickTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-trigger-click'));

    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(trigger);

    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());
  },
};

export const TogglesClosedOnSecondClickWhenClickTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-trigger-click'));

    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlaySurface()).toBeNull());
  },
};

export const DoesNotOpenOnHoverWhenClickTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-trigger-click'));

    const trigger = await canvas.findByTestId('trigger');

    await userEvent.hover(trigger);
    trigger.focus();

    // allow any scheduled open setTimeout(0) to fire; click-mode trigger must not open on hover or focus
    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(queryOverlaySurface()).toBeNull();
  },
};

export const SetsAriaDescribedbyOnTriggerWhenOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await expect(trigger.getAttribute('aria-describedby')).toBeNull();

    await userEvent.hover(trigger);

    await waitFor(() => expect(trigger.getAttribute('aria-describedby')).not.toBeNull());
  },
};

export const RemovesAriaDescribedbyOnTriggerWhenClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.hover(trigger);
    await waitFor(() => expect(trigger.getAttribute('aria-describedby')).not.toBeNull());

    await userEvent.unhover(trigger);

    await waitFor(() => expect(trigger.getAttribute('aria-describedby')).toBeNull());
  },
};

export const EmitsOpenedWhenOpening: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('openedCount=0');

    await userEvent.hover(trigger);

    await waitFor(() => expect(readout.textContent).toContain('openedCount=1'));
  },
};

export const EmitsClosedWhenClosing: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');
    const readout = await canvas.findByTestId('readout');

    await userEvent.hover(trigger);
    await waitFor(() => expect(readout.textContent).toContain('openedCount=1'));

    await expect(readout.textContent).toContain('closedCount=0');

    await userEvent.unhover(trigger);

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
  },
};

export const KeepOpenOnHoverPreservesTooltipWhileHoveringSurface: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-keep-open-on'));
    await userEvent.click(canvas.getByTestId('ctl-close-delay-100'));

    const trigger = await canvas.findByTestId('trigger');

    await userEvent.hover(trigger);
    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

    await userEvent.unhover(trigger);

    const overlayPane = queryOverlayPane();

    await expect(overlayPane).not.toBeNull();

    fireEvent.mouseEnter(overlayPane!);

    // wait longer than the configured 100ms closeDelay to confirm the scheduled close was cancelled
    await new Promise((resolve) => setTimeout(resolve, 200));

    await expect(queryOverlaySurface()).not.toBeNull();

    fireEvent.mouseLeave(overlayPane!);

    await waitFor(() => expect(queryOverlaySurface()).toBeNull());
  },
};

export const EscapeKeyClosesClickTooltip: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-trigger-click'));

    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(queryOverlaySurface()).toBeNull());
  },
};

export const BackdropClickClosesClickTooltip: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-trigger-click'));

    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlaySurface()).not.toBeNull());

    const backdrop = queryOverlayBackdrop();

    await expect(backdrop).not.toBeNull();

    fireEvent.click(backdrop!);

    await waitFor(() => expect(queryOverlaySurface()).toBeNull());
  },
};

export const SurfaceDataPlacementReflectsBrainResolvedPlacement: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.hover(trigger);

    await waitFor(() => {
      const surface = queryOverlaySurface();

      expect(surface).not.toBeNull();
      expect(allPlacementValues).toContain(surface!.getAttribute('data-placement'));
    });
  },
};

export const NoOverlayWhenNoTemplateProvided: Story = {
  render: renderNoTemplateShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.hover(trigger);

    // allow the scheduled open setTimeout(0) to fire so the brain's missing-template safety branch runs
    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(queryOverlaySurface()).toBeNull();
  },
};

export const RichLayoutSurfaceHostAttribute: Story = {
  render: renderRichShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surface = await canvas.findByTestId('surface');

    await expect(surface.getAttribute('data-layout')).toBe('rich');
  },
};

export const TitleRendersProjectedContent: Story = {
  render: renderRichShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = await canvas.findByTestId('title');

    await expect(title.textContent?.trim()).toBe('Title text');
  },
};

export const BodyRendersProjectedContent: Story = {
  render: renderRichShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = await canvas.findByTestId('body');

    await expect(body.textContent?.trim()).toBe('Body text');
  },
};

export const ActionRendersAnchorWithDefaultHref: Story = {
  render: renderRichShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const action = await canvas.findByTestId('action');
    const anchor = action.querySelector('a');

    await expect(anchor).not.toBeNull();
    await expect(anchor?.getAttribute('href')).toBe('#');
    await expect(anchor?.textContent?.trim()).toBe('Action label');
  },
};

export const ActionReflectsHrefInput: Story = {
  render: renderRichShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-target'));

    const action = await canvas.findByTestId('action');
    const anchor = action.querySelector('a');

    await waitFor(() => expect(anchor?.getAttribute('href')).toBe('https://example.com'));
  },
};

export const SetTriggerElementOverridesAutoResolvedTrigger: Story = {
  render: renderOverrideShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const defaultTrigger = await canvas.findByTestId('default-trigger');
    const manualTrigger = await canvas.findByTestId('manual-trigger');

    await userEvent.hover(defaultTrigger);
    await waitFor(() => expect(defaultTrigger.getAttribute('aria-describedby')).not.toBeNull());

    await userEvent.unhover(defaultTrigger);
    await waitFor(() => expect(queryOverlaySurface()).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-override-manual'));

    await userEvent.hover(manualTrigger);

    await waitFor(() => {
      expect(queryOverlaySurface()).not.toBeNull();
      expect(manualTrigger.getAttribute('aria-describedby')).not.toBeNull();
      expect(defaultTrigger.getAttribute('aria-describedby')).toBeNull();
    });
  },
};
