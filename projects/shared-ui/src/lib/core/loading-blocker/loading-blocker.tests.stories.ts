import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  LoadingBlocker,
  type LoadingBlockerColor,
  type LoadingBlockerIntensity,
  type LoadingBlockerScope,
  type LoadingBlockerSpinnerSize,
} from './loading-blocker';

@Component({
  selector: 'story-loading-blocker-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker],
  host: { class: 'block' },
  template: `
    <div class="relative min-h-4xs">
      <org-loading-blocker
        data-testid="blocker"
        [isVisible]="isVisible()"
        [label]="label()"
        [intensity]="intensity()"
        [scope]="scope()"
        [color]="color()"
        [spinnerSize]="spinnerSize()"
      />
    </div>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-visible-on" (click)="isVisible.set(true)">visible-on</button>
      <button type="button" data-testid="ctl-visible-off" (click)="isVisible.set(false)">visible-off</button>
      <button type="button" data-testid="ctl-label-saving" (click)="label.set('Saving changes...')">
        label-saving
      </button>
      <button type="button" data-testid="ctl-label-empty" (click)="label.set('')">label-empty</button>
      <button type="button" data-testid="ctl-intensity-light" (click)="intensity.set('light')">intensity-light</button>
      <button type="button" data-testid="ctl-intensity-heavy" (click)="intensity.set('heavy')">intensity-heavy</button>
      <button type="button" data-testid="ctl-scope-viewport" (click)="scope.set('viewport')">scope-viewport</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-color-null" (click)="color.set(null)">color-null</button>
      <button type="button" data-testid="ctl-spinner-size-3xl" (click)="spinnerSize.set('3xl')">
        spinner-size-3xl
      </button>
    </div>
  `,
})
class StoryLoadingBlockerTestsShell {
  protected readonly isVisible = signal<boolean>(false);
  protected readonly label = signal<string>('');
  protected readonly intensity = signal<LoadingBlockerIntensity>('medium');
  protected readonly scope = signal<LoadingBlockerScope>('region');
  protected readonly color = signal<LoadingBlockerColor | null | undefined>(undefined);
  protected readonly spinnerSize = signal<LoadingBlockerSpinnerSize>('2xl');
}

@Component({
  selector: 'story-loading-blocker-static-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker],
  host: { class: 'block' },
  template: `
    <div class="relative min-h-4xs">
      <org-loading-blocker data-testid="blocker" />
    </div>
  `,
})
class StoryLoadingBlockerStaticShell {}

const meta: Meta = {
  title: 'Core/Components/Loading Blocker/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-loading-blocker-tests-shell />`,
  moduleMetadata: { imports: [StoryLoadingBlockerTestsShell] },
});

const renderStaticShell: Story['render'] = () => ({
  template: `<story-loading-blocker-static-shell />`,
  moduleMetadata: { imports: [StoryLoadingBlockerStaticShell] },
});

export const RendersDefaultDataAttributes: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('data-intensity')).toBe('medium');
    await expect(blocker.getAttribute('data-scope')).toBe('region');
    await expect(blocker.getAttribute('data-spinner-size')).toBe('2xl');
    await expect(blocker.getAttribute('data-color')).toBeNull();
    await expect(blocker.getAttribute('data-visible')).toBeNull();
  },
};

export const RendersStaticA11yAttributes: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('role')).toBe('status');
    await expect(blocker.getAttribute('tabindex')).toBe('-1');
    await expect(blocker.getAttribute('aria-live')).toBe('polite');
  },
};

export const OmitsDataVisibleWhenHidden: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('data-visible')).toBeNull();
  },
};

export const SetsDataVisibleWhenIsVisibleTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await userEvent.click(canvas.getByTestId('ctl-visible-on'));

    await waitFor(() => expect(blocker.getAttribute('data-visible')).toBe('1'));
  },
};

export const AriaBusyReflectsIsVisible: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('aria-busy')).toBe('false');

    await userEvent.click(canvas.getByTestId('ctl-visible-on'));

    await waitFor(() => expect(blocker.getAttribute('aria-busy')).toBe('true'));
  },
};

export const AriaLabelFallsBackToLoadingWhenLabelEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('aria-label')).toBe('Loading');
  },
};

export const AriaLabelUsesProvidedLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await userEvent.click(canvas.getByTestId('ctl-label-saving'));

    await waitFor(() => expect(blocker.getAttribute('aria-label')).toBe('Saving changes...'));
  },
};

export const ReflectsIntensityAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('data-intensity')).toBe('medium');

    await userEvent.click(canvas.getByTestId('ctl-intensity-heavy'));
    await waitFor(() => expect(blocker.getAttribute('data-intensity')).toBe('heavy'));

    await userEvent.click(canvas.getByTestId('ctl-intensity-light'));
    await waitFor(() => expect(blocker.getAttribute('data-intensity')).toBe('light'));
  },
};

export const ReflectsScopeAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('data-scope')).toBe('region');

    await userEvent.click(canvas.getByTestId('ctl-scope-viewport'));

    await waitFor(() => expect(blocker.getAttribute('data-scope')).toBe('viewport'));
  },
};

export const ReflectsSpinnerSizeAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('data-spinner-size')).toBe('2xl');

    await userEvent.click(canvas.getByTestId('ctl-spinner-size-3xl'));

    await waitFor(() => expect(blocker.getAttribute('data-spinner-size')).toBe('3xl'));
  },
};

export const OmitsDataColorByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.getAttribute('data-color')).toBeNull();
  },
};

export const ReflectsColorAttributeWhenSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    await waitFor(() => expect(blocker.getAttribute('data-color')).toBe('danger'));
  },
};

export const NullColorTransformsToUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await waitFor(() => expect(blocker.getAttribute('data-color')).toBe('danger'));

    await userEvent.click(canvas.getByTestId('ctl-color-null'));

    await waitFor(() => expect(blocker.getAttribute('data-color')).toBeNull());
  },
};

export const OmitsTextSpanWhenLabelEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await expect(blocker.querySelector('.text')).toBeNull();
  },
};

export const RendersTextSpanWithLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    await userEvent.click(canvas.getByTestId('ctl-label-saving'));

    await waitFor(() => {
      const text = blocker.querySelector('.text');

      expect(text?.textContent?.trim()).toBe('Saving changes...');
    });
  },
};

export const RendersInnerLoadingSpinnerWithSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');

    const spinner = blocker.querySelector('org-loading-spinner');

    await expect(spinner).not.toBeNull();
    await expect(spinner?.getAttribute('data-size')).toBe('2xl');

    await userEvent.click(canvas.getByTestId('ctl-spinner-size-3xl'));

    await waitFor(() => {
      expect(blocker.querySelector('org-loading-spinner')?.getAttribute('data-size')).toBe('3xl');
    });
  },
};

export const TrapsFocusWhenVisible: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');
    const parent = blocker.parentElement as HTMLElement;

    await userEvent.click(canvas.getByTestId('ctl-visible-on'));

    await waitFor(() => {
      const anchors = parent.querySelectorAll('.cdk-focus-trap-anchor');

      expect(anchors.length).toBe(2);
      expect(anchors[0].getAttribute('tabindex')).toBe('0');
      expect(anchors[1].getAttribute('tabindex')).toBe('0');
    });
  },
};

export const DoesNotTrapFocusWhenHidden: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocker = await canvas.findByTestId('blocker');
    const parent = blocker.parentElement as HTMLElement;

    await waitFor(() => {
      const anchors = parent.querySelectorAll('.cdk-focus-trap-anchor');

      expect(anchors.length).toBe(2);
      expect(anchors[0].getAttribute('tabindex')).toBeNull();
      expect(anchors[1].getAttribute('tabindex')).toBeNull();
    });
  },
};
