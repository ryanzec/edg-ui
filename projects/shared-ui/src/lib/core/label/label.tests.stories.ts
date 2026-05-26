import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Label } from './label';

@Component({
  selector: 'story-label-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Label],
  host: { class: 'block' },
  template: `
    <org-label
      data-testid="label"
      [text]="text()"
      [isLoading]="isLoading()"
      [isRequired]="isRequired()"
      [htmlFor]="htmlFor()"
      [asLabel]="asLabel()"
    />
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-text-updated" (click)="text.set('Updated text')">text-updated</button>
      <button type="button" data-testid="ctl-loading-on" (click)="isLoading.set(true)">loading-on</button>
      <button type="button" data-testid="ctl-loading-off" (click)="isLoading.set(false)">loading-off</button>
      <button type="button" data-testid="ctl-required-on" (click)="isRequired.set(true)">required-on</button>
      <button type="button" data-testid="ctl-required-off" (click)="isRequired.set(false)">required-off</button>
      <button type="button" data-testid="ctl-as-label-off" (click)="asLabel.set(false)">as-label-off</button>
      <button type="button" data-testid="ctl-as-label-on" (click)="asLabel.set(true)">as-label-on</button>
      <button type="button" data-testid="ctl-html-for-clear" (click)="htmlFor.set(null)">html-for-clear</button>
      <button type="button" data-testid="ctl-html-for-set" (click)="htmlFor.set('email-input')">html-for-set</button>
    </div>
  `,
})
class StoryLabelTestsShell {
  protected readonly text = signal<string>('Email address');
  protected readonly isLoading = signal<boolean>(false);
  protected readonly isRequired = signal<boolean>(false);
  protected readonly htmlFor = signal<string | null | undefined>('email-input');
  protected readonly asLabel = signal<boolean>(true);
}

@Component({
  selector: 'story-label-post-projection-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Label],
  host: { class: 'block' },
  template: `
    <org-label data-testid="label" htmlFor="post-input" text="Bio">
      <span post data-testid="post-content">24 / 160</span>
    </org-label>
  `,
})
class StoryLabelPostProjectionShell {}

@Component({
  selector: 'story-label-association-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Label],
  host: { class: 'block' },
  template: `
    <org-label data-testid="label" htmlFor="associated-input" text="Email address" />
    <input data-testid="associated-input" id="associated-input" type="email" />
  `,
})
class StoryLabelAssociationShell {}

const meta: Meta = {
  title: 'Core/Components/Label/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-label-tests-shell />`,
  moduleMetadata: { imports: [StoryLabelTestsShell] },
});

export const RendersAsLabelByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');

    await expect(host.querySelector('label')).not.toBeNull();
    await expect(host.querySelector('div.org-label')).toBeNull();
  },
};

export const RendersAsDivWhenAsLabelFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-as-label-off'));

    const host = await canvas.findByTestId('label');

    await expect(host.querySelector('label')).toBeNull();
    await expect(host.querySelector('div.org-label')).not.toBeNull();
  },
};

export const ToggleAsLabelSwapsRenderedElement: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');

    await expect(host.querySelector('label')).not.toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-as-label-off'));

    await expect(host.querySelector('label')).toBeNull();
    await expect(host.querySelector('div.org-label')).not.toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-as-label-on'));

    await expect(host.querySelector('label')).not.toBeNull();
    await expect(host.querySelector('div.org-label')).toBeNull();
  },
};

export const AppliesHtmlForAsForAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;

    await expect(labelElement.getAttribute('for')).toBe('email-input');
  },
};

export const OmitsForAttributeWhenHtmlForIsNull: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-html-for-clear'));

    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;

    await expect(labelElement.getAttribute('for')).toBeNull();
  },
};

export const RendersTextInsideLabelTextSpan: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');
    const textSpan = host.querySelector('.org-label-text') as HTMLSpanElement;

    await expect(textSpan.textContent?.trim()).toBe('Email address');
  },
};

export const UpdatesTextWhenInputChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');
    const textSpan = host.querySelector('.org-label-text') as HTMLSpanElement;

    await expect(textSpan.textContent?.trim()).toBe('Email address');

    await userEvent.click(canvas.getByTestId('ctl-text-updated'));

    await waitFor(() => expect(textSpan.textContent?.trim()).toBe('Updated text'));
  },
};

export const DefaultsOmitDataLoadingAndDataRequiredAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;

    await expect(labelElement.getAttribute('data-loading')).toBeNull();
    await expect(labelElement.getAttribute('data-required')).toBeNull();
  },
};

export const IsLoadingSetsDataLoadingAndRendersSpinner: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;

    await expect(labelElement.getAttribute('data-loading')).toBe('1');
    await expect(labelElement.querySelector('org-loading-spinner')).not.toBeNull();
  },
};

export const IsLoadingOffRemovesSpinnerAndDataLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));
    await userEvent.click(canvas.getByTestId('ctl-loading-off'));

    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;

    await expect(labelElement.getAttribute('data-loading')).toBeNull();
    await expect(labelElement.querySelector('org-loading-spinner')).toBeNull();
  },
};

export const IsRequiredSetsDataRequiredAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-required-on'));

    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;

    await expect(labelElement.getAttribute('data-required')).toBe('1');
  },
};

export const IsRequiredOffRemovesDataRequired: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-required-on'));
    await userEvent.click(canvas.getByTestId('ctl-required-off'));

    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;

    await expect(labelElement.getAttribute('data-required')).toBeNull();
  },
};

export const DataAttributesApplyWhenRenderedAsDiv: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-as-label-off'));
    await userEvent.click(canvas.getByTestId('ctl-required-on'));
    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    const host = await canvas.findByTestId('label');
    const divElement = host.querySelector('div.org-label') as HTMLDivElement;

    await expect(divElement.getAttribute('data-required')).toBe('1');
    await expect(divElement.getAttribute('data-loading')).toBe('1');
    await expect(divElement.querySelector('org-loading-spinner')).not.toBeNull();
  },
};

export const RendersProjectedPostContent: Story = {
  render: () => ({
    template: `<story-label-post-projection-shell />`,
    moduleMetadata: { imports: [StoryLabelPostProjectionShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');
    const postSlot = host.querySelector('.org-label-post') as HTMLSpanElement;

    await expect(postSlot.querySelector('[data-testid="post-content"]')).not.toBeNull();
    await expect(postSlot.textContent?.trim()).toBe('24 / 160');
  },
};

export const LabelClickFocusesAssociatedControl: Story = {
  render: () => ({
    template: `<story-label-association-shell />`,
    moduleMetadata: { imports: [StoryLabelAssociationShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('label');
    const labelElement = host.querySelector('label') as HTMLLabelElement;
    const associatedInput = (await canvas.findByTestId('associated-input')) as HTMLInputElement;

    await expect(document.activeElement).not.toBe(associatedInput);

    await userEvent.click(labelElement);

    await waitFor(() => expect(document.activeElement).toBe(associatedInput));
  },
};
