import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Icon } from '../icon/icon';
import { Indicator, type IndicatorColor, type IndicatorPosition, type IndicatorSize } from './indicator';
import { IndicatorAnchor } from './indicator-anchor';

@Component({
  selector: 'story-indicator-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator, Icon],
  host: { class: 'block' },
  template: `
    <org-indicator
      data-testid="indicator"
      [color]="color()"
      [size]="size()"
      [number]="number()"
      [ring]="ring()"
      [pulse]="pulse()"
      [hasFade]="hasFade()"
      [position]="position()"
      [ariaLabel]="ariaLabel()"
    >
      @if (showIcon()) {
        <org-icon data-testid="projected-icon" name="check" size="2xs" />
      }
    </org-indicator>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-number-3" (click)="number.set(3)">number-3</button>
      <button type="button" data-testid="ctl-number-42" (click)="number.set(42)">number-42</button>
      <button type="button" data-testid="ctl-number-99" (click)="number.set(99)">number-99</button>
      <button type="button" data-testid="ctl-number-100" (click)="number.set(100)">number-100</button>
      <button type="button" data-testid="ctl-number-150" (click)="number.set(150)">number-150</button>
      <button type="button" data-testid="ctl-number-zero" (click)="number.set(0)">number-zero</button>
      <button type="button" data-testid="ctl-number-null" (click)="number.set(null)">number-null</button>
      <button type="button" data-testid="ctl-ring-on" (click)="ring.set(true)">ring-on</button>
      <button type="button" data-testid="ctl-ring-off" (click)="ring.set(false)">ring-off</button>
      <button type="button" data-testid="ctl-pulse-on" (click)="pulse.set(true)">pulse-on</button>
      <button type="button" data-testid="ctl-pulse-off" (click)="pulse.set(false)">pulse-off</button>
      <button type="button" data-testid="ctl-fade-on" (click)="hasFade.set(true)">fade-on</button>
      <button type="button" data-testid="ctl-fade-off" (click)="hasFade.set(false)">fade-off</button>
      <button type="button" data-testid="ctl-position-bottom-right" (click)="position.set('bottom-right')">
        position-bottom-right
      </button>
      <button type="button" data-testid="ctl-position-null" (click)="position.set(null)">position-null</button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('3 unread')">aria-label-set</button>
      <button type="button" data-testid="ctl-aria-label-null" (click)="ariaLabel.set(null)">aria-label-null</button>
      <button type="button" data-testid="ctl-show-icon-on" (click)="showIcon.set(true)">show-icon-on</button>
      <button type="button" data-testid="ctl-show-icon-off" (click)="showIcon.set(false)">show-icon-off</button>
    </div>
  `,
})
class StoryIndicatorTestsShell {
  protected readonly color = signal<IndicatorColor>('primary');
  protected readonly size = signal<IndicatorSize>('base');
  protected readonly number = signal<number | null | undefined>(undefined);
  protected readonly ring = signal<boolean>(false);
  protected readonly pulse = signal<boolean>(false);
  protected readonly hasFade = signal<boolean>(false);
  protected readonly position = signal<IndicatorPosition | null | undefined>(undefined);
  protected readonly ariaLabel = signal<string | null | undefined>(undefined);
  protected readonly showIcon = signal<boolean>(false);
}

@Component({
  selector: 'story-indicator-anchor-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator, IndicatorAnchor],
  host: { class: 'block' },
  template: `
    <org-indicator-anchor data-testid="anchor">
      <span data-testid="anchor-child" class="anchor-child">child</span>
      <org-indicator data-testid="anchored-indicator" color="safe" position="bottom-right" [ring]="true" />
    </org-indicator-anchor>
  `,
})
class StoryIndicatorAnchorTestsShell {}

const meta: Meta = {
  title: 'Core/Components/Indicator/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-indicator-tests-shell />`,
  moduleMetadata: { imports: [StoryIndicatorTestsShell] },
});

const renderAnchorShell: Story['render'] = () => ({
  template: `<story-indicator-anchor-tests-shell />`,
  moduleMetadata: { imports: [StoryIndicatorAnchorTestsShell] },
});

export const RendersDefaultModeColorAndSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await expect(host.getAttribute('data-mode')).toBe('dot');
    await expect(host.getAttribute('data-color')).toBe('primary');
    await expect(host.getAttribute('data-size')).toBe('base');
  },
};

export const OmitsPositionRingPulseAndFadeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await expect(host.getAttribute('data-position')).toBeNull();
    await expect(host.getAttribute('data-ring')).toBeNull();
    await expect(host.getAttribute('data-pulse')).toBeNull();
    await expect(host.getAttribute('data-fade')).toBeNull();
  },
};

export const AppliesRoleStatusToHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await expect(host.getAttribute('role')).toBe('status');
  },
};

export const NoAriaLabelByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await expect(host.getAttribute('aria-label')).toBeNull();
  },
};

export const ReflectsAriaLabelInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('3 unread'));
  },
};

export const NullAriaLabelTransformsToOmitted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('3 unread'));

    await userEvent.click(canvas.getByTestId('ctl-aria-label-null'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBeNull());
  },
};

export const ReflectsColorInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    await waitFor(() => expect(host.getAttribute('data-color')).toBe('danger'));
  },
};

export const ReflectsSizeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    await waitFor(() => expect(host.getAttribute('data-size')).toBe('sm'));
  },
};

export const DotModeByDefaultWithNoNumberOrIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await expect(host.getAttribute('data-mode')).toBe('dot');
    await expect(host.querySelector(':scope > span')).toBeNull();
  },
};

export const NumberModeWhenNumberProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-number-3'));

    await waitFor(() => {
      expect(host.getAttribute('data-mode')).toBe('number');

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('3');
    });
  },
};

export const IconModeWhenIconProjectedAndNoNumber: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-show-icon-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-mode')).toBe('icon');
      expect(host.querySelector('org-icon')).not.toBeNull();
    });
  },
};

export const NumberWinsOverProjectedIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-show-icon-on'));
    await userEvent.click(canvas.getByTestId('ctl-number-3'));

    await waitFor(() => {
      expect(host.getAttribute('data-mode')).toBe('number');

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('3');
      // template gates ng-content behind the @else, so the projected icon must not be rendered
      expect(host.querySelector('org-icon')).toBeNull();
    });
  },
};

export const NullNumberTransformsBackToDot: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-number-3'));

    await waitFor(() => expect(host.getAttribute('data-mode')).toBe('number'));

    await userEvent.click(canvas.getByTestId('ctl-number-null'));

    await waitFor(() => {
      expect(host.getAttribute('data-mode')).toBe('dot');
      expect(host.querySelector(':scope > span')).toBeNull();
    });
  },
};

export const RendersNumberBelowHundredAsIs: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-number-42'));

    await waitFor(() => {
      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('42');
    });
  },
};

export const RendersOverflowAsNinetyNinePlus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-number-150'));

    await waitFor(() => {
      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('99+');
    });
  },
};

export const BoundaryHundredRendersAsNinetyNinePlus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-number-100'));

    await waitFor(() => {
      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('99+');
    });
  },
};

export const BoundaryNinetyNineRendersExact: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-number-99'));

    await waitFor(() => {
      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('99');
    });
  },
};

export const ZeroRendersAsZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-number-zero'));

    await waitFor(() => {
      // verifies hasNumber uses !== undefined, not truthiness — 0 must still produce number mode
      expect(host.getAttribute('data-mode')).toBe('number');

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('0');
    });
  },
};

export const ReflectsRingAttributeWhenRingTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-ring-on'));

    await waitFor(() => expect(host.getAttribute('data-ring')).toBe(''));
  },
};

export const ReflectsPulseAttributeWhenPulseTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-pulse-on'));

    await waitFor(() => expect(host.getAttribute('data-pulse')).toBe(''));
  },
};

export const ReflectsFadeAttributeWhenHasFadeTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-fade-on'));

    await waitFor(() => expect(host.getAttribute('data-fade')).toBe(''));
  },
};

export const OmitsBooleanAttributesWhenFlagsFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-ring-on'));
    await userEvent.click(canvas.getByTestId('ctl-pulse-on'));
    await userEvent.click(canvas.getByTestId('ctl-fade-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-ring')).toBe('');
      expect(host.getAttribute('data-pulse')).toBe('');
      expect(host.getAttribute('data-fade')).toBe('');
    });

    await userEvent.click(canvas.getByTestId('ctl-ring-off'));
    await userEvent.click(canvas.getByTestId('ctl-pulse-off'));
    await userEvent.click(canvas.getByTestId('ctl-fade-off'));

    await waitFor(() => {
      expect(host.getAttribute('data-ring')).toBeNull();
      expect(host.getAttribute('data-pulse')).toBeNull();
      expect(host.getAttribute('data-fade')).toBeNull();
    });
  },
};

export const ReflectsPositionInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-position-bottom-right'));

    await waitFor(() => expect(host.getAttribute('data-position')).toBe('bottom-right'));
  },
};

export const NullPositionTransformsToOmitted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('indicator');

    await userEvent.click(canvas.getByTestId('ctl-position-bottom-right'));

    await waitFor(() => expect(host.getAttribute('data-position')).toBe('bottom-right'));

    await userEvent.click(canvas.getByTestId('ctl-position-null'));

    await waitFor(() => expect(host.getAttribute('data-position')).toBeNull());
  },
};

export const AnchorProjectsItsChildren: Story = {
  render: renderAnchorShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const anchor = await canvas.findByTestId('anchor');

    await expect(anchor.querySelector('[data-testid="anchor-child"]')).not.toBeNull();
    await expect(anchor.querySelector('[data-testid="anchored-indicator"]')).not.toBeNull();
  },
};

export const AnchorRendersAsHostElement: Story = {
  render: renderAnchorShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const anchor = await canvas.findByTestId('anchor');

    await expect(anchor.tagName.toLowerCase()).toBe('org-indicator-anchor');
  },
};
