import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ExpandableBrainDirective } from './expandable-brain';

@Component({
  selector: 'story-expandable-brain-consumer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  hostDirectives: [
    {
      directive: ExpandableBrainDirective,
      inputs: ['isExpandable', 'isExpanded'],
      outputs: ['isExpandedChange'],
    },
  ],
  template: ` <button type="button" data-testid="ctl-call-toggle" (click)="callToggle()">call-toggle</button> `,
})
class StoryExpandableBrainConsumer {
  private readonly _brain = inject(ExpandableBrainDirective);

  protected callToggle(): void {
    this._brain.toggle();
  }
}

@Component({
  selector: 'story-expandable-brain-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryExpandableBrainConsumer],
  host: { class: 'block' },
  template: `
    <story-expandable-brain-consumer
      data-testid="consumer"
      [isExpandable]="isExpandable()"
      [(isExpanded)]="isExpanded"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-expandable-on" (click)="isExpandable.set(true)">expandable-on</button>
      <button type="button" data-testid="ctl-expandable-off" (click)="isExpandable.set(false)">expandable-off</button>
      <button type="button" data-testid="ctl-set-expanded-false" (click)="isExpanded.set(false)">
        set-expanded-false
      </button>
      <button type="button" data-testid="ctl-set-expanded-true" (click)="isExpanded.set(true)">
        set-expanded-true
      </button>
    </div>
  `,
})
class StoryExpandableBrainTestsShell {
  protected readonly isExpandable = signal<boolean>(false);
  protected readonly isExpanded = signal<boolean>(true);

  protected readout(): string {
    return `isExpandable=${this.isExpandable()} isExpanded=${this.isExpanded()}`;
  }
}

const meta: Meta = {
  title: 'Core/Directives/Expandable Brain/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-expandable-brain-tests-shell />`,
  moduleMetadata: { imports: [StoryExpandableBrainTestsShell] },
});

export const AppliesDefaultIsExpandableFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('isExpandable=false');
  },
};

export const AppliesDefaultIsExpandedTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('isExpanded=true');
  },
};

export const ToggleNoOpsWhenNotExpandable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('isExpandable=false');
    await expect(readout.textContent).toContain('isExpanded=true');

    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));
    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));
    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));

    await expect(readout.textContent).toContain('isExpanded=true');
  },
};

export const ToggleFlipsIsExpandedFromTrueToFalseWhenExpandable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => expect(readout.textContent).toContain('isExpandable=true'));
    await expect(readout.textContent).toContain('isExpanded=true');

    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));

    await waitFor(() => expect(readout.textContent).toContain('isExpanded=false'));
  },
};

export const ToggleFlipsIsExpandedFromFalseToTrueWhenExpandable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-expanded-false'));

    await waitFor(() => expect(readout.textContent).toContain('isExpanded=false'));

    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));

    await waitFor(() => expect(readout.textContent).toContain('isExpanded=true'));
  },
};

export const TwoWayBindingUpdatesBrainFromParent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-expanded-false'));

    await waitFor(() => expect(readout.textContent).toContain('isExpanded=false'));

    // calling toggle on the brain should now flip back to true, proving the brain received the
    // parent-driven `isExpanded=false` value (otherwise it would have flipped to false instead).
    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));

    await waitFor(() => expect(readout.textContent).toContain('isExpanded=true'));
  },
};

export const TwoWayBindingEmitsBrainChangesToParent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => expect(readout.textContent).toContain('isExpandable=true'));
    await expect(readout.textContent).toContain('isExpanded=true');

    // brain-driven toggle should propagate the new value out to the parent's bound signal, which
    // the readout reads from — proving the model emits changes back through `[(isExpanded)]`.
    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));
    await waitFor(() => expect(readout.textContent).toContain('isExpanded=false'));

    await userEvent.click(canvas.getByTestId('ctl-call-toggle'));
    await waitFor(() => expect(readout.textContent).toContain('isExpanded=true'));
  },
};
