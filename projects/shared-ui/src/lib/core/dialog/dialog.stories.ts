import type { Meta, StoryObj } from '@storybook/angular';
import { DIALOG_TRIGGER, DialogBrainDirective } from '../../brain/dialog-brain/dialog-brain';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../../core/button/button';
import { ChangeDetectionStrategy, Component, inject, input, ViewChild, signal, TemplateRef } from '@angular/core';
import { DialogHeader } from '../../core/dialog/dialog-header';
import { DialogContent } from '../../core/dialog/dialog-content';
import { DialogFooter } from '../../core/dialog/dialog-footer';
import { Dialog, DialogPosition, allDialogPositions } from '../../core/dialog/dialog';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CheckboxToggle } from '../../core/checkbox-toggle/checkbox-toggle';
import { TypedContextDirective } from '../../core/typed-context-directive/typed-context-directive';

type EXAMPLEDialogData = {
  title: string;
  message: string;
  hasRoundedCorners?: boolean;
  onEscapeKeyToggle?: (enabled: boolean) => void;
  onShowCloseIconToggle?: (show: boolean) => void;
};

@Component({
  selector: 'story-example-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogHeader, DialogContent, DialogFooter, Dialog],
  template: `
    @if (isInDialog) {
      <org-dialog [position]="position()" [hasRoundedCorners]="hasRoundedCorners()">
        <org-dialog-header [title]="data.title" />
        <org-dialog-content>{{ data.message }}</org-dialog-content>
        <org-dialog-footer>
          <org-button color="neutral" (clicked)="onCancel()">Cancel</org-button>
          <org-button color="primary" (clicked)="onConfirm()">Confirm</org-button>
        </org-dialog-footer>
      </org-dialog>
    }
  `,
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: ['hasBackdrop', 'enableCloseOnClickOutside', 'enableEscapeKey', 'showCloseIcon'],
      outputs: ['closed'],
    },
  ],
  host: {},
})
class EXAMPLEDialog {
  private readonly _selfBrain = inject(DialogBrainDirective, { self: true });
  private readonly _triggerBrain = inject(DIALOG_TRIGGER, { optional: true });
  private readonly _brain = this._triggerBrain ?? this._selfBrain;

  private readonly _dialogRef = inject(DialogRef<EXAMPLEDialog>, { optional: true });

  public readonly position = input<DialogPosition>('center');
  public readonly hasRoundedCorners = input<boolean>(true);

  protected readonly data = inject<EXAMPLEDialogData>(DIALOG_DATA, { optional: true }) ?? {
    title: '',
    message: '',
  };
  protected readonly isInDialog = !!this._dialogRef;

  public openDialog(data?: EXAMPLEDialogData): DialogRef<EXAMPLEDialog, EXAMPLEDialog> | null {
    return this._brain.openDialog<EXAMPLEDialog>(EXAMPLEDialog, data as Record<string, unknown> | undefined);
  }

  public closeDialog(): void {
    this._brain.closeDialog();
  }

  public setEnableEscapeKey(enabled: boolean): void {
    this._brain.setEnableEscapeKey(enabled);
  }

  public setShowCloseIcon(show: boolean): void {
    this._brain.setShowCloseIcon(show);
  }

  protected onCancel(): void {
    console.log('cancel button clicked');
    this.closeDialog();
  }

  protected onConfirm(): void {
    console.log('confirm button clicked');
    this.closeDialog();
  }
}

@Component({
  selector: 'story-example-story-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EXAMPLEDialog, Button],
  template: `
    <story-example-dialog
      #dialogComponent
      [position]="position()"
      [hasRoundedCorners]="hasRoundedCorners()"
      [enableCloseOnClickOutside]="enableCloseOnClickOutside()"
      [showCloseIcon]="showCloseIcon()"
      [enableEscapeKey]="enableEscapeKey()"
    />
    <org-button (click)="openDialog()">Open Dialog</org-button>
  `,
  host: {},
})
class EXAMPLEStoryDialog {
  public position = input<DialogPosition>('center');
  public enableCloseOnClickOutside = input<boolean>(false);
  public hasRoundedCorners = input<boolean>(true);
  public showCloseIcon = input<boolean>(true);
  public enableEscapeKey = input<boolean>(true);

  @ViewChild('dialogComponent')
  public readonly dialogComponent!: EXAMPLEDialog;

  protected openDialog(): void {
    this.dialogComponent.openDialog({
      title: 'Example Dialog',
      message: 'This is a minimalistic example of Angular CDK Dialog.',
    });
  }
}

const meta: Meta<EXAMPLEStoryDialog> = {
  title: 'Core/Components/Dialog',
  component: EXAMPLEStoryDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Angular CDK Dialog Example

  A minimalistic example demonstrating Angular CDK's Dialog functionality. Consumers create a custom dialog component that applies the \`DialogBrainDirective\` as a \`hostDirective\`, exposes \`openDialog()\` / \`closeDialog()\` methods, and conditionally renders its modal content when \`DialogRef\` is injected (i.e. when the component is being rendered inside the cdk overlay).

  ### Features
  - Uses Angular CDK Dialog module for accessible modals
  - Configurable position, backdrop, rounded corners, escape-key behavior, and close-icon visibility
  - Backdrop click to close (disabled by default, can be enabled via enableCloseOnClickOutside input)
  - Keyboard support (Escape to close, controlled via enableEscapeKey input)
  - Automatic focus management
  - Programmatic dialog opening and closing

  ### Usage Example
  \`\`\`html
  <app-confirm-dialog #dlg position="center" (closed)="onClosed()" />
  <org-button (clicked)="dlg.openDialog({ title, message })">Open</org-button>
  \`\`\`

  ### CDK Dialog Concepts
  - **Brain Directive**: Wraps the cdk \`Dialog\` service, escape-key gating, and the close-icon state signals
  - **Single Component**: The same component class plays both the trigger role (in the parent template) and the content role (rendered inside the cdk overlay)
  - **Data Passing**: Send data to the dialog content via \`openDialog(data)\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<EXAMPLEStoryDialog>;

export const Default: Story = {
  args: {
    position: 'center',
    hasRoundedCorners: true,
    enableCloseOnClickOutside: false,
    showCloseIcon: true,
    enableEscapeKey: true,
  },
  argTypes: {
    position: {
      control: 'select',
      options: allDialogPositions,
      description: 'position of the dialog on the screen',
    },
    hasRoundedCorners: {
      control: 'boolean',
      description: 'whether the dialog container has rounded corners',
    },
    enableCloseOnClickOutside: {
      control: 'boolean',
      description: 'whether clicking the backdrop closes the dialog',
    },
    showCloseIcon: {
      control: 'boolean',
      description: 'whether the close icon (X button) is shown',
    },
    enableEscapeKey: {
      control: 'boolean',
      description: 'whether the escape key closes the dialog',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default dialog example with controls to adjust all inputs. Click the button to open the dialog.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <story-example-story-dialog
        [position]="position"
        [hasRoundedCorners]="hasRoundedCorners"
        [enableCloseOnClickOutside]="enableCloseOnClickOutside"
        [showCloseIcon]="showCloseIcon"
        [enableEscapeKey]="enableEscapeKey"
      />
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialog],
    },
  }),
};

export const Positions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of different dialog positions using custom panel classes.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog Positions"
        currentState="Comparing different dialog positioning configurations"
      >
        <org-storybook-example-container-section label="Center (Default)">
          <story-example-story-dialog position="center" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Top">
          <story-example-story-dialog position="top" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Bottom">
          <story-example-story-dialog position="bottom" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Left">
          <story-example-story-dialog position="left" [hasRoundedCorners]="false" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Right">
          <story-example-story-dialog position="right" [hasRoundedCorners]="false" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Center</strong>: Dialog appears in the center of the screen</li>
          <li><strong>Top</strong>: Dialog appears at the top of the screen</li>
          <li><strong>Bottom</strong>: Dialog appears at the bottom of the screen</li>
          <li><strong>Left</strong>: Dialog appears at the left like a peek panel</li>
          <li><strong>Right</strong>: Dialog appears at the right like a peek panel</li>
          <li>Click the backdrop or press Escape to close the dialog</li>
          <li>Focus is automatically managed when dialog opens/closes</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialog, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const HasRoundedCorners: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstration of the hasRoundedCorners input. Left/right position dialogs typically disable rounded corners since they span the full height.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog Rounded Corners"
        currentState="Comparing rounded vs sharp corners"
      >
        <org-storybook-example-container-section label="Rounded Corners (Default)">
          <story-example-story-dialog position="center" [hasRoundedCorners]="true" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="No Rounded Corners">
          <story-example-story-dialog position="center" [hasRoundedCorners]="false" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Rounded (default)</strong>: Dialog container has rounded corners via border-radius</li>
          <li><strong>No rounded corners</strong>: Dialog container has sharp square corners — intended for full-edge positions like left/right</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialog, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CloseOnClickOutsideEnabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example demonstrating dialog with enableCloseOnClickOutside set to true. This allows users to close the dialog by clicking the backdrop, in addition to using the Escape key or action buttons.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog with Close on Click Outside Enabled"
        currentState="Demonstrating backdrop click to close functionality"
      >
        <org-storybook-example-container-section label="Try Interactions">
          <story-example-story-dialog position="center" [enableCloseOnClickOutside]="true" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Backdrop Click</strong>: Click outside dialog to close it (enabled in this story)</li>
          <li><strong>Escape Key</strong>: Press Escape to close the dialog</li>
          <li><strong>Confirm Button</strong>: Logs confirmation and closes dialog</li>
          <li><strong>Cancel Button</strong>: Logs cancellation and closes dialog</li>
          <li><strong>Focus Management</strong>: Focus is trapped within dialog when open</li>
          <li><strong>Navigation</strong>: Dialog closes automatically on navigation</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialog, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const EnableEscapeKey: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstration of enableEscapeKey set to false at open time. The escape key will not close this dialog — use the Cancel or Confirm buttons instead.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog with Escape Key Disabled"
        currentState="Demonstrating escape key disabled at open time"
      >
        <org-storybook-example-container-section label="Escape Key Disabled">
          <story-example-story-dialog position="center" [enableEscapeKey]="false" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Escape Key</strong>: Pressing Escape does NOT close this dialog</li>
          <li><strong>Close Icon</strong>: The X button is also disabled (opacity reduced, not clickable)</li>
          <li><strong>Buttons</strong>: Cancel and Confirm buttons still close the dialog normally</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialog, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-example-story-dialog-with-closed-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EXAMPLEDialog, Button],
  template: `
    <div class="flex flex-col gap-4">
      <story-example-dialog #dialogComponent position="center" (closed)="onDialogClosed()" />
      <org-button (click)="openDialog()">Open Dialog</org-button>

      @if (closeCount() > 0) {
        <div class="p-4 bg-secondary-soft rounded-lg">
          <p class="text-sm font-medium">Dialog Closed Events: {{ closeCount() }}</p>
          <p class="text-xs text-muted mt-1">Open and close the dialog to see the count increase</p>
        </div>
      }
    </div>
  `,
  host: {},
})
class EXAMPLEStoryDialogWithClosedEvent {
  protected readonly closeCount = signal(0);

  @ViewChild('dialogComponent')
  public readonly dialogComponent!: EXAMPLEDialog;

  protected openDialog(): void {
    this.dialogComponent.openDialog({
      title: 'Dialog with Closed Event',
      message: 'Close this dialog to see the closed event being triggered.',
    });
  }

  protected onDialogClosed(): void {
    this.closeCount.update((count) => count + 1);
    console.log('Dialog closed event triggered. Total closes:', this.closeCount());
  }
}

export const ClosedEvent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example demonstrating the closed output event. The dialog component emits a closed event whenever the dialog is closed by any means (backdrop click, escape key, or programmatic close).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog with Closed Event"
        currentState="Demonstrating dialog closed event handling"
      >
        <org-storybook-example-container-section label="Try Opening and Closing">
          <story-example-story-dialog-with-closed-event />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Closed Event</strong>: Emitted whenever dialog closes by any means</li>
          <li><strong>Event Counter</strong>: Tracks how many times the dialog has been closed</li>
          <li><strong>Console Logging</strong>: Check console for logged close events</li>
          <li><strong>State Management</strong>: Useful for clearing selected data when dialog closes</li>
          <li><strong>Multiple Close Methods</strong>: Works with backdrop click, Escape key, and button clicks</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialogWithClosedEvent, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-example-story-dialog-with-backdrop-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EXAMPLEDialog, Button, CheckboxToggle],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <org-checkbox-toggle
          name="hasBackdrop"
          value="hasBackdrop"
          [checked]="hasBackdrop()"
          (checkedChange)="onBackdropToggle($event)"
        >
          Has Backdrop
        </org-checkbox-toggle>
      </div>

      <story-example-dialog
        #dialogComponent
        [position]="hasBackdrop() ? 'center' : 'right'"
        [hasBackdrop]="hasBackdrop()"
      />
      <org-button (click)="openDialog()">Open Dialog</org-button>
    </div>
  `,
  host: {},
})
class EXAMPLEStoryDialogWithBackdropToggle {
  protected readonly hasBackdrop = signal(true);

  @ViewChild('dialogComponent')
  public readonly dialogComponent!: EXAMPLEDialog;

  protected openDialog(): void {
    this.dialogComponent.openDialog({
      title: 'Dialog with Backdrop Toggle',
      message: 'Try toggling the backdrop setting and opening the dialog to see the difference.',
    });
  }

  protected onBackdropToggle(value: boolean): void {
    this.hasBackdrop.set(value);
  }
}

export const Backdrop: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example demonstrating dialog with and without backdrop. Toggle the backdrop setting before opening the dialog to see how it affects the visual presentation and interaction behavior.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog Backdrop Toggle"
        currentState="Demonstrating dialog with backdrop enabled/disabled"
      >
        <org-storybook-example-container-section label="Try Backdrop Toggle">
          <story-example-story-dialog-with-backdrop-toggle />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Backdrop Enabled</strong>: Dialog appears with a semi-transparent overlay covering the page content</li>
          <li><strong>Backdrop Disabled</strong>: Dialog appears without overlay, allowing interaction with page content behind it</li>
          <li><strong>Escape Key</strong>: Works to close dialog regardless of backdrop setting</li>
          <li><strong>Page Interaction</strong>: When backdrop is disabled, you can interact with elements behind the dialog</li>
          <li><strong>Visual Contrast</strong>: Backdrop provides visual separation and focus on the dialog content</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialogWithBackdropToggle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-example-dialog-with-close-icon-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogHeader, DialogContent, DialogFooter, Dialog, CheckboxToggle],
  template: `
    @if (isInDialog) {
      <org-dialog [position]="position()" [hasRoundedCorners]="data.hasRoundedCorners ?? true">
        <org-dialog-header [title]="data.title" />
        <org-dialog-content>
          <div class="flex flex-col gap-4">
            <p>{{ data.message }}</p>

            <div class="p-4 bg-secondary-soft rounded-lg">
              <p class="text-sm font-medium mb-2">Close Icon Control</p>
              <org-checkbox-toggle
                name="showCloseIcon"
                value="showCloseIcon"
                [checked]="showCloseIcon()"
                (checkedChange)="onShowCloseIconToggle($event)"
              >
                Show Close Icon
              </org-checkbox-toggle>
              <p class="text-xs text-muted mt-2">
                Toggle this checkbox to show or hide the close icon (X button) in the top-right corner of this dialog in
                real-time.
              </p>
            </div>
          </div>
        </org-dialog-content>
        <org-dialog-footer>
          <org-button color="neutral" (clicked)="onCancel()">Cancel</org-button>
          <org-button color="primary" (clicked)="onConfirm()">Confirm</org-button>
        </org-dialog-footer>
      </org-dialog>
    }
  `,
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: ['hasBackdrop', 'enableCloseOnClickOutside', 'enableEscapeKey', 'showCloseIcon'],
      outputs: ['closed'],
    },
  ],
})
class EXAMPLEDialogWithCloseIconToggle {
  private readonly _selfBrain = inject(DialogBrainDirective, { self: true });
  private readonly _triggerBrain = inject(DIALOG_TRIGGER, { optional: true });
  private readonly _brain = this._triggerBrain ?? this._selfBrain;

  private readonly _dialogRef = inject(DialogRef<EXAMPLEDialogWithCloseIconToggle>, { optional: true });

  public readonly position = input<DialogPosition>('center');

  protected readonly data = inject<EXAMPLEDialogData>(DIALOG_DATA, { optional: true }) ?? {
    title: '',
    message: '',
  };
  protected readonly isInDialog = !!this._dialogRef;
  protected readonly showCloseIcon = signal(true);

  public openDialog(data?: EXAMPLEDialogData) {
    return this._brain.openDialog<EXAMPLEDialogWithCloseIconToggle>(
      EXAMPLEDialogWithCloseIconToggle,
      data as Record<string, unknown> | undefined
    );
  }

  public closeDialog(): void {
    this._brain.closeDialog();
  }

  public setShowCloseIcon(show: boolean): void {
    this._brain.setShowCloseIcon(show);
  }

  protected onCancel(): void {
    console.log('cancel button clicked');
    this.closeDialog();
  }

  protected onConfirm(): void {
    console.log('confirm button clicked');
    this.closeDialog();
  }

  protected onShowCloseIconToggle(value: boolean): void {
    this.showCloseIcon.set(value);
    this.data.onShowCloseIconToggle?.(value);
  }
}

@Component({
  selector: 'story-example-story-dialog-with-close-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EXAMPLEDialogWithCloseIconToggle, Button],
  template: `
    <div class="flex flex-col gap-4">
      <story-example-dialog-with-close-icon-toggle #dialogComponent position="center" />
      <org-button (click)="openDialog()">Open Dialog</org-button>
    </div>
  `,
  host: {},
})
class EXAMPLEStoryDialogWithCloseIcon {
  @ViewChild('dialogComponent')
  public readonly dialogComponent!: EXAMPLEDialogWithCloseIconToggle;

  protected openDialog(): void {
    this.dialogComponent.openDialog({
      title: 'Dialog with Close Icon',
      message: 'Use the toggle inside this dialog to show or hide the X button in real-time.',
      onShowCloseIconToggle: (show: boolean) => {
        this.dialogComponent.setShowCloseIcon(show);
      },
    });
  }
}

export const CloseIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example demonstrating the close icon (X button) in the dialog. The close icon appears in the top-right corner and allows users to close the dialog. Open the dialog and use the toggle inside to show or hide the X button in real-time.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog Close Icon"
        currentState="Demonstrating dialog close icon (X button)"
      >
        <org-storybook-example-container-section label="Try Close Icon Toggle">
          <story-example-story-dialog-with-close-icon />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Close Icon</strong>: X button appears in the top-right corner when enabled (default: enabled)</li>
          <li><strong>Click to Close</strong>: Clicking the X button closes the dialog</li>
          <li><strong>Toggle Inside Dialog</strong>: Use the checkbox inside the dialog to show or hide the close icon in real-time</li>
          <li><strong>Accessibility</strong>: Close icon has proper aria-label for screen readers</li>
          <li><strong>Styling</strong>: Matches the notifications pattern (text variant, neutral color)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialogWithCloseIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-example-dialog-with-escape-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogHeader, DialogContent, DialogFooter, Dialog, CheckboxToggle],
  template: `
    @if (isInDialog) {
      <org-dialog [position]="position()" [hasRoundedCorners]="data.hasRoundedCorners ?? true">
        <org-dialog-header [title]="data.title" />
        <org-dialog-content>
          <div class="flex flex-col gap-4">
            <p>{{ data.message }}</p>

            <div class="p-4 bg-secondary-soft rounded-lg">
              <p class="text-sm font-medium mb-2">Dynamic Close Control</p>
              <org-checkbox-toggle
                name="enableEscapeKey"
                value="enableEscapeKey"
                [checked]="enableEscapeKey()"
                (checkedChange)="onEnableEscapeKeyToggle($event)"
              >
                Enable Escape Key & Close Icon
              </org-checkbox-toggle>
              <p class="text-xs text-muted mt-2">
                Toggle this checkbox to see the close icon (X button) become enabled/disabled in real-time. When
                disabled, it appears with reduced opacity and doesn't respond to clicks.
              </p>
            </div>
          </div>
        </org-dialog-content>
        <org-dialog-footer>
          <org-button color="neutral" (clicked)="onCancel()">Cancel</org-button>
          <org-button color="primary" (clicked)="onConfirm()">Confirm</org-button>
        </org-dialog-footer>
      </org-dialog>
    }
  `,
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: ['hasBackdrop', 'enableCloseOnClickOutside', 'enableEscapeKey', 'showCloseIcon'],
      outputs: ['closed'],
    },
  ],
})
class EXAMPLEDialogWithEscapeToggle {
  private readonly _selfBrain = inject(DialogBrainDirective, { self: true });
  private readonly _triggerBrain = inject(DIALOG_TRIGGER, { optional: true });
  private readonly _brain = this._triggerBrain ?? this._selfBrain;

  private readonly _dialogRef = inject(DialogRef<EXAMPLEDialogWithEscapeToggle>, { optional: true });

  public readonly position = input<DialogPosition>('center');

  protected readonly data = inject<EXAMPLEDialogData>(DIALOG_DATA, { optional: true }) ?? {
    title: '',
    message: '',
  };
  protected readonly isInDialog = !!this._dialogRef;
  protected readonly enableEscapeKey = signal(true);

  public openDialog(data?: EXAMPLEDialogData) {
    return this._brain.openDialog<EXAMPLEDialogWithEscapeToggle>(
      EXAMPLEDialogWithEscapeToggle,
      data as Record<string, unknown> | undefined
    );
  }

  public closeDialog(): void {
    this._brain.closeDialog();
  }

  public setEnableEscapeKey(enabled: boolean): void {
    this._brain.setEnableEscapeKey(enabled);
  }

  protected onCancel(): void {
    console.log('cancel button clicked');
    this.closeDialog();
  }

  protected onConfirm(): void {
    console.log('confirm button clicked');
    this.closeDialog();
  }

  protected onEnableEscapeKeyToggle(value: boolean): void {
    this.enableEscapeKey.set(value);
    this.data.onEscapeKeyToggle?.(value);
  }
}

@Component({
  selector: 'story-example-story-dialog-dynamic-escape-key',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EXAMPLEDialogWithEscapeToggle, Button],
  template: `
    <div class="flex flex-col gap-4">
      <story-example-dialog-with-escape-toggle #dialogComponent position="center" />
      <org-button (click)="openDialog()">Open Dialog</org-button>
    </div>
  `,
  host: {},
})
class EXAMPLEStoryDialogDynamicEscapeKey {
  @ViewChild('dialogComponent')
  public readonly dialogComponent!: EXAMPLEDialogWithEscapeToggle;

  protected openDialog(): void {
    this.dialogComponent.openDialog({
      title: 'Dialog with Dynamic Close Control',
      message: 'Use the toggle inside this dialog to enable/disable the escape key and close icon.',
      onEscapeKeyToggle: (enabled: boolean) => {
        this.dialogComponent.setEnableEscapeKey(enabled);
      },
    });
  }
}

export const DynamicCloseControl: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example demonstrating dynamic control of the close icon and escape key. The toggle is inside the dialog itself - use it to see the close icon (X button) become enabled/disabled in real-time. When disabled, the icon appears with reduced opacity and does not respond to clicks. The close icon state is synced with the escape key setting.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dialog Dynamic Close Control"
        currentState="Demonstrating dynamic close icon and escape key control"
      >
        <org-storybook-example-container-section label="Try Dynamic Toggle">
          <story-example-story-dialog-dynamic-escape-key />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Open Dialog</strong>: Click the button to open the dialog</li>
          <li><strong>Inside Dialog Toggle</strong>: Use the checkbox INSIDE the dialog to enable/disable escape key and close icon</li>
          <li><strong>Synchronized State</strong>: Close icon (X button) and escape key are always in sync</li>
          <li><strong>Real-time Update</strong>: Close icon becomes enabled/disabled immediately when toggled while dialog is open</li>
          <li><strong>Disabled State</strong>: When disabled, the X button appears with reduced opacity (40%) and does not respond to clicks</li>
          <li><strong>Use Case</strong>: Useful for preventing accidental closes during critical operations (like form submission)</li>
          <li><strong>Button Close</strong>: Cancel and Confirm buttons still work regardless of escape key setting</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryDialogDynamicEscapeKey, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-example-story-template-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Dialog, DialogHeader, DialogContent, DialogFooter, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <org-button (click)="openDialog()">Open Dialog</org-button>

      <ng-template [orgTypedContext]="dialogContextType" #dialogTemplateRef let-context>
        <org-dialog [position]="position()">
          <org-dialog-header title="Template-Based Dialog" />
          <org-dialog-content>
            <p>This dialog content is defined inline as a template reference — no separate component required.</p>
            <p class="mt-2 text-sm text-muted">{{ context.message }}</p>
          </org-dialog-content>
          <org-dialog-footer>
            <org-button color="neutral" (clicked)="onCancel()">Cancel</org-button>
            <org-button color="primary" (clicked)="onConfirm()">Confirm</org-button>
          </org-dialog-footer>
        </org-dialog>
      </ng-template>
    </div>
  `,
  hostDirectives: [DialogBrainDirective],
  host: {},
})
class EXAMPLEStoryTemplateDialog {
  private readonly _brain = inject(DialogBrainDirective, { self: true });

  public readonly position = input<DialogPosition>('center');

  @ViewChild('dialogTemplateRef')
  public readonly dialogTemplateRef!: TemplateRef<{ $implicit: { message: string } }>;

  /** sentinel array used purely for template-context type inference by `TypedContextDirective` */
  protected readonly dialogContextType: { message: string }[] = [];

  protected openDialog(): void {
    this._brain.openDialog(this.dialogTemplateRef, {
      message: 'Passed via template context from the parent component.',
    });
  }

  protected onCancel(): void {
    console.log('cancel button clicked');
    this._brain.closeDialog();
  }

  protected onConfirm(): void {
    console.log('confirm button clicked');
    this._brain.closeDialog();
  }
}

export const TemplateBasedDialog: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Example demonstrating the template-based approach where dialog content is defined inline using a TemplateRef, without requiring a separate dialog component. The template runs in the parent component's scope, giving it direct access to parent state and methods. Data can also be passed via template context.",
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Template-Based Dialog"
        currentState="Demonstrating inline template content without a separate component"
      >
        <org-storybook-example-container-section label="Template Dialog">
          <story-example-story-template-dialog position="center" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>No Separate Component</strong>: Dialog content is defined inline in the parent template</li>
          <li><strong>Parent Scope Access</strong>: Template bindings call methods directly on the parent component</li>
          <li><strong>Template Context</strong>: Data passed to openDialog() is available via the let-* binding (typed via the orgTypedContext directive)</li>
          <li><strong>Escape Key</strong>: Works the same as component-based dialogs</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEStoryTemplateDialog, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
