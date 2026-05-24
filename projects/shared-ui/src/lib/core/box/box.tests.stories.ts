import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Box, type BoxBackground, type BoxBorder, type BoxColor, type BoxPadding } from './box';
import { BoxBrainDirective } from './box-brain';

@Component({
  selector: 'story-box-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-color-null" (click)="color.set(null)">color-null</button>
      <button type="button" data-testid="ctl-border-borderless" (click)="border.set('borderless')">
        border-borderless
      </button>
      <button type="button" data-testid="ctl-padding-lg" (click)="padding.set('lg')">padding-lg</button>
      <button type="button" data-testid="ctl-background-colorless" (click)="background.set('colorless')">
        background-colorless
      </button>
    </div>
  `,
})
class StoryBoxTestsShell {
  protected readonly boxBrain = viewChild.required(BoxBrainDirective);

  protected readonly color = signal<BoxColor | null | undefined>(undefined);
  protected readonly border = signal<BoxBorder>('bordered');
  protected readonly padding = signal<BoxPadding>('base');
  protected readonly background = signal<BoxBackground>('colored');

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()} isPressed=${this.boxBrain().isPressed()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-box-static-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box],
  host: { class: 'block' },
  template: `
    <org-box data-testid="box">
      <span data-testid="content">static content</span>
    </org-box>
  `,
})
class StoryBoxStaticShell {}

@Component({
  selector: 'story-box-external-clickable-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box],
  host: { class: 'block' },
  template: `
    <org-box data-testid="box">external content</org-box>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-externally-clickable-on" (click)="enableExternalClickable()">
        externally-clickable-on
      </button>
      <button type="button" data-testid="ctl-externally-clickable-off" (click)="disableExternalClickable()">
        externally-clickable-off
      </button>
    </div>
  `,
})
class StoryBoxExternalClickableShell {
  protected readonly boxBrain = viewChild.required(BoxBrainDirective);

  protected enableExternalClickable(): void {
    this.boxBrain().setExternallyClickable(true);
  }

  protected disableExternalClickable(): void {
    this.boxBrain().setExternallyClickable(false);
  }
}

const meta: Meta = {
  title: 'Core/Components/Box/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-box-tests-shell />`,
  moduleMetadata: { imports: [StoryBoxTestsShell] },
});

const renderStaticShell: Story['render'] = () => ({
  template: `<story-box-static-shell />`,
  moduleMetadata: { imports: [StoryBoxStaticShell] },
});

const renderExternalShell: Story['render'] = () => ({
  template: `<story-box-external-clickable-shell />`,
  moduleMetadata: { imports: [StoryBoxExternalClickableShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await expect(host.getAttribute('data-border')).toBe('bordered');
    await expect(host.getAttribute('data-padding')).toBe('base');
    await expect(host.getAttribute('data-background')).toBe('colored');
    await expect(host.getAttribute('data-color')).toBeNull();
  },
};

export const StaticBoxOmitsClickableHostAttributes: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await expect(host.getAttribute('role')).toBeNull();
    await expect(host.getAttribute('tabindex')).toBeNull();
    await expect(host.getAttribute('data-clickable')).toBeNull();
  },
};

export const StaticBoxDoesNotEnterPressedOnMouseDown: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    fireEvent.mouseDown(host);

    await expect(host.getAttribute('data-pressed')).toBeNull();
  },
};

export const ReflectsColorInputOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    await waitFor(() => expect(host.getAttribute('data-color')).toBe('danger'));
  },
};

export const ReflectsBorderInputOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await userEvent.click(canvas.getByTestId('ctl-border-borderless'));

    await waitFor(() => expect(host.getAttribute('data-border')).toBe('borderless'));
  },
};

export const ReflectsPaddingInputOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await userEvent.click(canvas.getByTestId('ctl-padding-lg'));

    await waitFor(() => expect(host.getAttribute('data-padding')).toBe('lg'));
  },
};

export const ReflectsBackgroundInputOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await userEvent.click(canvas.getByTestId('ctl-background-colorless'));

    await waitFor(() => expect(host.getAttribute('data-background')).toBe('colorless'));
  },
};

export const TransformsNullColorToOmittedAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await waitFor(() => expect(host.getAttribute('data-color')).toBe('danger'));

    await userEvent.click(canvas.getByTestId('ctl-color-null'));

    await waitFor(() => expect(host.getAttribute('data-color')).toBeNull());
  },
};

export const ProjectsChildContent: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    const content = host.querySelector('[data-testid="content"]');

    await expect(content?.textContent).toBe('static content');
  },
};

export const AppliesClickableHostAttributesWhenListenerAttached: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await expect(host.getAttribute('role')).toBe('button');
    await expect(host.getAttribute('tabindex')).toBe('0');
    await expect(host.getAttribute('data-clickable')).toBe('');
  },
};

export const EmitsClickedOnPointerClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('clickCount=0');

    await userEvent.click(host);

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
  },
};

export const EmitsClickedOnEnterAndPreventsDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');
    const readout = await canvas.findByTestId('readout');

    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true });
    host.dispatchEvent(event);

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
    await expect(event.defaultPrevented).toBe(true);
  },
};

export const EmitsClickedOnSpaceAndPreventsDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');
    const readout = await canvas.findByTestId('readout');

    const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
    host.dispatchEvent(event);

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
    await expect(event.defaultPrevented).toBe(true);
  },
};

export const OtherKeysDoNotEmitClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');
    const readout = await canvas.findByTestId('readout');

    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true, bubbles: true });
    host.dispatchEvent(event);

    await expect(readout.textContent).toContain('clickCount=0');
    await expect(event.defaultPrevented).toBe(false);
  },
};

export const FlipsDataPressedOnMouseDownAndMouseUp: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');
    const readout = await canvas.findByTestId('readout');

    fireEvent.mouseDown(host);
    await waitFor(() => expect(host.getAttribute('data-pressed')).toBe(''));
    await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

    fireEvent.mouseUp(host);
    await waitFor(() => expect(host.getAttribute('data-pressed')).toBeNull());
    await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
  },
};

export const ClearsDataPressedOnMouseLeave: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');
    const readout = await canvas.findByTestId('readout');

    fireEvent.mouseDown(host);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

    fireEvent.mouseLeave(host);
    await waitFor(() => expect(host.getAttribute('data-pressed')).toBeNull());
    await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
  },
};

export const ExternallyClickableEnablesClickableHostAttributes: Story = {
  render: renderExternalShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await expect(host.getAttribute('role')).toBeNull();
    await expect(host.getAttribute('tabindex')).toBeNull();
    await expect(host.getAttribute('data-clickable')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-externally-clickable-on'));

    await waitFor(() => {
      expect(host.getAttribute('role')).toBe('button');
      expect(host.getAttribute('tabindex')).toBe('0');
      expect(host.getAttribute('data-clickable')).toBe('');
    });
  },
};

export const ExternallyClickableOffClearsClickableHostAttributes: Story = {
  render: renderExternalShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('box');

    await userEvent.click(canvas.getByTestId('ctl-externally-clickable-on'));
    await waitFor(() => expect(host.getAttribute('data-clickable')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-externally-clickable-off'));

    await waitFor(() => {
      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();
    });
  },
};
