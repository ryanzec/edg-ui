import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TableActionsDirective } from './table-actions-directive';
import { Box } from '../box/box';
import { Button } from '../button/button';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-table-actions-default-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableActionsDirective, Box, Button, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Table Actions Directive"
      currentState="Compare clicking the inner button on each row — the directive should stop the outer box from also being activated"
    >
      <org-storybook-example-container-section label="Without orgTableActions">
        <org-box (clicked)="onUnguardedRowClicked()" class="flex flex-row items-center justify-between gap-2 w-full">
          <span>Row body (clickable)</span>
          <org-button
            color="neutral"
            variant="ghost"
            size="sm"
            label="Inner action"
            (clicked)="onUnguardedActionClicked()"
          />
        </org-box>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="With orgTableActions">
        <org-box (clicked)="onGuardedRowClicked()" class="flex flex-row items-center justify-between gap-2 w-full">
          <span>Row body (clickable)</span>
          <org-button
            orgTableActions
            color="neutral"
            variant="ghost"
            size="sm"
            label="Inner action"
            (clicked)="onGuardedActionClicked()"
          />
        </org-box>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Counters">
        <div class="flex flex-col gap-1">
          <div><strong>Unguarded row clicks:</strong> {{ unguardedRowCount() }}</div>
          <div><strong>Unguarded inner action clicks:</strong> {{ unguardedActionCount() }}</div>
          <div><strong>Guarded row clicks:</strong> {{ guardedRowCount() }}</div>
          <div><strong>Guarded inner action clicks:</strong> {{ guardedActionCount() }}</div>
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class TableActionsDefaultDemo {
  public readonly unguardedRowCount = signal<number>(0);
  public readonly unguardedActionCount = signal<number>(0);
  public readonly guardedRowCount = signal<number>(0);
  public readonly guardedActionCount = signal<number>(0);

  public onUnguardedRowClicked(): void {
    this.unguardedRowCount.update((current) => current + 1);
  }

  public onUnguardedActionClicked(): void {
    this.unguardedActionCount.update((current) => current + 1);
  }

  public onGuardedRowClicked(): void {
    this.guardedRowCount.update((current) => current + 1);
  }

  public onGuardedActionClicked(): void {
    this.guardedActionCount.update((current) => current + 1);
  }
}

@Component({
  selector: 'story-table-actions-keyboard-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableActionsDirective, Box, Button, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Keyboard Activation"
      currentState="Tab to the inner button and press Enter or Space — the surrounding row's click handler should not run"
    >
      <org-storybook-example-container-section label="Guarded Row">
        <org-box (clicked)="onRowClicked()" class="flex flex-row items-center justify-between gap-2 w-full">
          <span>Row body (clickable)</span>
          <org-button
            orgTableActions
            color="neutral"
            variant="ghost"
            size="sm"
            label="Inner action"
            (clicked)="onActionClicked()"
          />
        </org-box>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Counters">
        <div class="flex flex-col gap-1">
          <div><strong>Row activations:</strong> {{ rowCount() }}</div>
          <div><strong>Inner action activations:</strong> {{ actionCount() }}</div>
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class TableActionsKeyboardDemo {
  public readonly rowCount = signal<number>(0);
  public readonly actionCount = signal<number>(0);

  public onRowClicked(): void {
    this.rowCount.update((current) => current + 1);
  }

  public onActionClicked(): void {
    this.actionCount.update((current) => current + 1);
  }
}

const meta: Meta<TableActionsDirective> = {
  title: 'Core/Directives/TableActions',
  component: TableActionsDirective,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Table Actions Directive

  Applied to an interactive control placed inside a clickable container (e.g. a clickable table row, clickable card, or clickable list item) so the control's own click and keyboard-activation events do not bubble up and also trigger the surrounding container's click handler.

  ### Behavior
  - Stops native \`click\` events from bubbling to ancestor click handlers.
  - For \`Enter\` and \`Space\` keydown events, stops propagation **and** prevents the default action so the browser does not synthesize a click on a parent clickable container.

  ### Usage Example
  \`\`\`html
  <org-button
    orgTableActions
    color="neutral"
    variant="ghost"
    size="sm"
    iconOnly
    preIcon="ellipsis"
    label="Row actions"
    [orgOverlayMenuTrigger]="rowActionsMenu"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TableActionsDirective>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison: without the directive, clicking the inner action also activates the surrounding row; with the directive, only the inner action is activated.',
      },
    },
  },
  render: () => ({
    template: `<story-table-actions-default-demo />`,
    moduleMetadata: {
      imports: [TableActionsDefaultDemo],
    },
  }),
};

export const KeyboardActivation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tab to the inner action and activate it with Enter or Space — the directive suppresses both event propagation and the default action so the surrounding row is not also activated.',
      },
    },
  },
  render: () => ({
    template: `<story-table-actions-keyboard-demo />`,
    moduleMetadata: {
      imports: [TableActionsKeyboardDemo],
    },
  }),
};
