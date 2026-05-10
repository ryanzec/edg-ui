import type { Meta, StoryObj } from '@storybook/angular';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DIALOG_TRIGGER, DialogBrainDirective } from '../../brain/dialog-brain/dialog-brain';
import { Button } from '../../core/button/button';
import { ButtonToggle, ButtonToggleItem } from '../../core/button-toggle/button-toggle';
import { CheckboxToggle } from '../../core/checkbox-toggle/checkbox-toggle';
import { Icon } from '../../core/icon/icon';
import { TypedContextDirective } from '../../core/typed-context-directive/typed-context-directive';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Dialog, DialogPosition, allDialogPositions } from '../../core/dialog/dialog';
import { DialogContent } from '../../core/dialog/dialog-content';
import { DialogFooter, DialogFooterAlignment, allDialogFooterAlignments } from '../../core/dialog/dialog-footer';
import { DialogHeader } from '../../core/dialog/dialog-header';
import { DialogIcon, DialogIconColor } from '../../core/dialog/dialog-icon';

type EXAMPLEDialogData = {
  title: string;
  message: string;
  position?: DialogPosition;
  hasRoundedCorners?: boolean;
  onEscapeKeyToggle?: (enabled: boolean) => void;
  onShowCloseIconToggle?: (show: boolean) => void;
};

type LiveDemoHeaderIconChoice = 'none' | 'info' | 'safe' | 'caution' | 'warning' | 'danger';

const allLiveDemoHeaderIconChoices = ['none', 'info', 'safe', 'caution', 'warning', 'danger'] as const;

const liveDemoPositionItems: ButtonToggleItem[] = allDialogPositions.map((position) => ({
  label: position,
  value: position,
  buttonColor: 'primary',
}));

const liveDemoFooterAlignmentItems: ButtonToggleItem[] = allDialogFooterAlignments.map((alignment) => ({
  label: alignment,
  value: alignment,
  buttonColor: 'primary',
}));

const liveDemoHeaderIconItems: ButtonToggleItem[] = allLiveDemoHeaderIconChoices.map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-example-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogHeader, DialogContent, DialogFooter, Dialog],
  template: `
    @if (isInDialog) {
      <org-dialog [position]="resolvedPosition()" [hasRoundedCorners]="resolvedHasRoundedCorners()">
        <org-dialog-header [title]="data.title" />
        <org-dialog-content>{{ data.message }}</org-dialog-content>
        <org-dialog-footer>
          <org-button color="neutral" label="Cancel" (clicked)="onCancel()" />
          <org-button color="primary" label="Confirm" (clicked)="onConfirm()" />
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

  /** position used by the panel: prefers the value forwarded through DIALOG_DATA from the trigger instance */
  protected readonly resolvedPosition = computed<DialogPosition>(() => this.data.position ?? this.position());

  /** rounded-corners flag used by the panel: prefers the value forwarded through DIALOG_DATA */
  protected readonly resolvedHasRoundedCorners = computed<boolean>(
    () => this.data.hasRoundedCorners ?? this.hasRoundedCorners(),
  );

  public openDialog(data?: EXAMPLEDialogData): DialogRef<EXAMPLEDialog, EXAMPLEDialog> | null {
    // forward the trigger instance's visual inputs through DIALOG_DATA — cdk dialog does not bind component
    // inputs on the spawned instance, so without this the in-overlay instance would always render with defaults.
    const payload: EXAMPLEDialogData = {
      title: data?.title ?? '',
      message: data?.message ?? '',
      position: data?.position ?? this.position(),
      hasRoundedCorners: data?.hasRoundedCorners ?? this.hasRoundedCorners(),
      onEscapeKeyToggle: data?.onEscapeKeyToggle,
      onShowCloseIconToggle: data?.onShowCloseIconToggle,
    };

    return this._brain.openDialog<EXAMPLEDialog>(EXAMPLEDialog, payload as Record<string, unknown>);
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
    <org-button label="Open Dialog" (click)="openDialog()" />
  `,
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
  ## Dialog Component

  A modal surface composed of a header (title + optional leading semantic icon), a scrollable content region, a footer (configurable alignment), and a floating close button. Lives inside a stage that owns the scrim + position.

  ### Anatomy
  - **org-dialog** — the panel; controls position and rounded corners.
  - **org-dialog-close-button** — auto-rendered floating close affordance in the top-right.
  - **org-dialog-header** — title slot with optional projected leading icon.
  - **org-dialog-icon** — optional semantic-tinted leading icon next to the header title.
  - **org-dialog-content** — scrollable body region (uses org-scroll-area internally).
  - **org-dialog-footer** — actions row with start / center / end alignment.

  ### Positions
  - **center** — default centered modal.
  - **top / bottom** — sheet (full-width banner along the matching edge).
  - **left / right** — drawer (full-height edge panel).

  ### Sizing
  - Default centered width is 28rem; drawer flips to 24rem; sheet uses 18rem height.
  - Apply \`.org-dialog-w-sm\` (18rem) or \`.org-dialog-w-lg\` (32rem) on the host for an explicit width override.
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

@Component({
  selector: 'story-dialog-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Button,
    ButtonToggle,
    CheckboxToggle,
    Dialog,
    DialogHeader,
    DialogIcon,
    DialogContent,
    DialogFooter,
    Icon,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
    EXAMPLEDialog,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        min-height: 6rem;
      }
      .canvas-stage org-dialog {
        align-self: center;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Every input on the dialog is driven by the controls below. The inline preview reflects the panel; click the button to open the same configuration in a real cdk overlay."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Position">
            <org-button-toggle [items]="positionItems" formControlName="position" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Footer alignment">
            <org-button-toggle [items]="footerAlignmentItems" formControlName="footerAlignment" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Header icon">
            <org-button-toggle [items]="headerIconItems" formControlName="headerIcon" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Rounded corners">
            <org-checkbox-toggle name="live-demo-rounded" value="rounded" formControlName="hasRoundedCorners">
              {{ liveDemoForm.controls.hasRoundedCorners.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Backdrop">
            <org-checkbox-toggle name="live-demo-backdrop" value="backdrop" formControlName="hasBackdrop">
              {{ liveDemoForm.controls.hasBackdrop.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Close on click outside">
            <org-checkbox-toggle
              name="live-demo-close-outside"
              value="close-outside"
              formControlName="enableCloseOnClickOutside"
            >
              {{ liveDemoForm.controls.enableCloseOnClickOutside.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Escape key">
            <org-checkbox-toggle name="live-demo-escape" value="escape" formControlName="enableEscapeKey">
              {{ liveDemoForm.controls.enableEscapeKey.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Close icon">
            <org-checkbox-toggle name="live-demo-close-icon" value="close-icon" formControlName="showCloseIcon">
              {{ liveDemoForm.controls.showCloseIcon.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-dialog [hasRoundedCorners]="liveDemoForm.controls.hasRoundedCorners.value">
              <org-dialog-header title="Live preview">
                @if (liveDemoForm.controls.headerIcon.value !== 'none') {
                  <org-dialog-icon icon [color]="headerIconColor()">
                    <org-icon [name]="headerIconName()" size="2xl" />
                  </org-dialog-icon>
                }
              </org-dialog-header>
              <org-dialog-content>
                Adjust the controls above to see how each input changes the dialog. Click the button below to open the
                same configuration in a real cdk overlay.
              </org-dialog-content>
              <org-dialog-footer [alignment]="liveDemoForm.controls.footerAlignment.value">
                <org-button color="neutral" label="Cancel" />
                <org-button color="primary" label="Save" />
              </org-dialog-footer>
            </org-dialog>
            <story-example-dialog
              #dialogComponent
              [position]="liveDemoForm.controls.position.value"
              [hasRoundedCorners]="liveDemoForm.controls.hasRoundedCorners.value"
              [hasBackdrop]="liveDemoForm.controls.hasBackdrop.value"
              [enableCloseOnClickOutside]="liveDemoForm.controls.enableCloseOnClickOutside.value"
              [enableEscapeKey]="liveDemoForm.controls.enableEscapeKey.value"
              [showCloseIcon]="liveDemoForm.controls.showCloseIcon.value"
            />
            <org-button label="Open in cdk overlay" (click)="openDialog()" />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class DialogLiveDemoStory {
  protected readonly positionItems = liveDemoPositionItems;
  protected readonly footerAlignmentItems = liveDemoFooterAlignmentItems;
  protected readonly headerIconItems = liveDemoHeaderIconItems;

  protected readonly liveDemoForm = new FormGroup({
    position: new FormControl<DialogPosition>('center', { nonNullable: true }),
    footerAlignment: new FormControl<DialogFooterAlignment>('end', { nonNullable: true }),
    headerIcon: new FormControl<LiveDemoHeaderIconChoice>('none', { nonNullable: true }),
    hasRoundedCorners: new FormControl<boolean>(true, { nonNullable: true }),
    hasBackdrop: new FormControl<boolean>(true, { nonNullable: true }),
    enableCloseOnClickOutside: new FormControl<boolean>(false, { nonNullable: true }),
    enableEscapeKey: new FormControl<boolean>(true, { nonNullable: true }),
    showCloseIcon: new FormControl<boolean>(true, { nonNullable: true }),
  });

  @ViewChild('dialogComponent')
  public readonly dialogComponent!: EXAMPLEDialog;

  protected headerIconColor(): DialogIconColor {
    const choice = this.liveDemoForm.controls.headerIcon.value;

    return choice === 'none' ? 'info' : choice;
  }

  protected headerIconName(): 'info' | 'circle-check' | 'circle-alert' | 'triangle-alert' | 'circle-x' {
    switch (this.liveDemoForm.controls.headerIcon.value) {
      case 'safe':
        return 'circle-check';
      case 'caution':
        return 'circle-alert';
      case 'warning':
        return 'triangle-alert';
      case 'danger':
        return 'circle-x';
      default:
        return 'info';
    }
  }

  protected openDialog(): void {
    this.dialogComponent.openDialog({
      title: 'Live demo',
      message: 'This dialog reflects the live demo controls — close on click outside, escape key, and close icon all honor the chosen settings.',
    });
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Drive every visual and behavioural input on the dialog, observe the inline preview, and open the same configuration in a real cdk overlay to test the runtime behaviours (escape key, click outside, close button).',
      },
    },
  },
  render: () => ({
    template: `<story-dialog-live-demo />`,
    moduleMetadata: {
      imports: [DialogLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every dialog visual axis — surface variants, header semantic icons, footer alignment, sizing, scrolling content, positions, and close-behaviour configuration — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Surface variants"
            description="Two corner treatments. Rounded is the default. Sharp corners are used when the dialog hosts edge-bleeding media or when the application chrome already runs square."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start">
              <org-dialog>
                <org-dialog-header title="Invite teammate" />
                <org-dialog-content>
                  Send a workspace invite by email. They'll receive a link valid for 7 days.
                </org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Send invite" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog [hasRoundedCorners]="false">
                <org-dialog-header title="Invite teammate" />
                <org-dialog-content>
                  Send a workspace invite by email. They'll receive a link valid for 7 days.
                </org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Send invite" />
                </org-dialog-footer>
              </org-dialog>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Rounded (default)</strong>: Container has rounded corners via radius-lg</li>
            <li><strong>Sharp</strong>: Reserved for full-bleed media — set [hasRoundedCorners]="false"</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Header — leading semantic icon"
            description="Optional leading icon sits to the left of the title. Its tone reads from the shared semantic ramp via the dialog-icon color input — info, safe, caution, warning, danger."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap gap-4 items-start">
              <org-dialog>
                <org-dialog-header title="Heads up — release notes">
                  <org-dialog-icon icon color="info"><org-icon name="info" size="2xl" /></org-dialog-icon>
                </org-dialog-header>
                <org-dialog-content>A short note about something you might care about. Informational tone.</org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Continue" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog>
                <org-dialog-header title="Workspace verified">
                  <org-dialog-icon icon color="safe"><org-icon name="circle-check" size="2xl" /></org-dialog-icon>
                </org-dialog-header>
                <org-dialog-content>Your workspace passed every health check. No action needed.</org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Continue" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog>
                <org-dialog-header title="Approaching plan limit">
                  <org-dialog-icon icon color="caution"><org-icon name="circle-alert" size="2xl" /></org-dialog-icon>
                </org-dialog-header>
                <org-dialog-content>You're at 82% of your monthly query budget. Consider upgrading before the cap.</org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Continue" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog>
                <org-dialog-header title="Connection unstable">
                  <org-dialog-icon icon color="warning"><org-icon name="triangle-alert" size="2xl" /></org-dialog-icon>
                </org-dialog-header>
                <org-dialog-content>We lost contact with one source — auto-reconnect is in progress.</org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Continue" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog>
                <org-dialog-header title="Delete project?">
                  <org-dialog-icon icon color="danger"><org-icon name="circle-x" size="2xl" /></org-dialog-icon>
                </org-dialog-header>
                <org-dialog-content>This permanently removes the project, its records, and every connected source.</org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="danger" label="Delete project" />
                </org-dialog-footer>
              </org-dialog>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Bare glyph</strong>: No background tile — color alone carries the meaning</li>
            <li><strong>Same convention</strong>: Mirrors Tag / Indicator / Button semantic colors</li>
            <li><strong>Default tone</strong>: info — override per dialog with the color input</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Footer — alignment"
            description="Three values on the footer's alignment input: start, center, end. End is the most common — primary action far right, supporting actions to its left."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4">
              <org-dialog>
                <org-dialog-header title="Save changes" />
                <org-dialog-content>Your draft will be saved to this project.</org-dialog-content>
                <org-dialog-footer alignment="end">
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog>
                <org-dialog-header title="Welcome back" />
                <org-dialog-content>We've prepared your workspace for the new release.</org-dialog-content>
                <org-dialog-footer alignment="center">
                  <org-button color="primary" label="Get started" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog>
                <org-dialog-header title="Read the changelog" />
                <org-dialog-content>Browse what's new since your last visit.</org-dialog-content>
                <org-dialog-footer alignment="start">
                  <org-button color="primary" variant="text" label="View changelog" postIcon="arrow-right" />
                </org-dialog-footer>
              </org-dialog>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>End</strong>: Default — primary action far right, supporting actions to its left</li>
            <li><strong>Center</strong>: Single confirmation actions sit centered</li>
            <li><strong>Start</strong>: Secondary-only or tertiary actions hug the leading edge</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sizing"
            description="The default centered width comes from --dialog-default-width (28rem). Drop .org-dialog-w-sm (18rem) or .org-dialog-w-lg (32rem) on the host to override per use."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4">
              <org-dialog class="org-dialog-w-sm">
                <org-dialog-header title="Confirm" />
                <org-dialog-content>Continue?</org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="No" />
                  <org-button color="primary" label="Yes" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog>
                <org-dialog-header title="Edit profile" />
                <org-dialog-content>Update the name and avatar your teammates see in this workspace.</org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-dialog-footer>
              </org-dialog>
              <org-dialog class="org-dialog-w-lg">
                <org-dialog-header title="Connect a data source" />
                <org-dialog-content>
                  Choose a source to import records from. We support CSV, Postgres, Snowflake, and the Airbyte
                  connector library.
                </org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Back" />
                  <org-button color="primary" label="Continue" />
                </org-dialog-footer>
              </org-dialog>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default (28rem)</strong>: From --dialog-default-width</li>
            <li><strong>org-dialog-w-sm (18rem)</strong>: For confirm-style dialogs</li>
            <li><strong>org-dialog-w-lg (32rem)</strong>: For dialogs that need more breathing room</li>
            <li><strong>max-width</strong>: Clamped to 100% so the panel never bursts the viewport</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Scrolling content"
            description="When the body grows past --dialog-max-vh, scrolling lives inside org-dialog-content. The header and footer pin so the title and the primary action are always visible, regardless of how far the body has scrolled."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="canvas-scroll-stage">
              <org-dialog>
                <org-dialog-header title="Terms of service">
                  <org-dialog-icon icon color="caution"><org-icon name="circle-alert" size="2xl" /></org-dialog-icon>
                </org-dialog-header>
                <org-dialog-content>
                  <p>These terms describe the rules for using the workspace and the data, code, and content you place inside it. By continuing, you agree to abide by every section below.</p>
                  <p class="mt-3">1. Account integrity. You are responsible for the accuracy of the workspace name, the membership list, and the connected data sources you publish to other members of the workspace.</p>
                  <p class="mt-3">2. Acceptable use. Workspaces are for product, research, and analytics use cases. Reverse-engineering, scraping, or attempting to extract source code is prohibited.</p>
                  <p class="mt-3">3. Data residency. Data ingested through connected sources is stored in the region selected at workspace creation time. Region migration is available on request.</p>
                  <p class="mt-3">4. Service availability. We target 99.9% uptime measured monthly, excluding scheduled maintenance windows announced at least 72 hours in advance.</p>
                  <p class="mt-3">5. Termination. Workspaces inactive for more than 180 days will be archived. Archived workspaces can be restored within 30 days; after that, data is permanently deleted.</p>
                </org-dialog-content>
                <org-dialog-footer>
                  <org-button color="neutral" label="Decline" />
                  <org-button color="primary" label="Accept" />
                </org-dialog-footer>
              </org-dialog>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Header pins</strong>: Title and leading icon stay visible while content scrolls</li>
            <li><strong>Footer pins</strong>: Primary action stays visible while content scrolls</li>
            <li><strong>Content scrolls</strong>: Body region uses org-scroll-area internally</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Positions" description="Center is the default. Top / bottom render as full-width sheets; left / right render as full-height drawers." />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap gap-2">
              <story-example-story-dialog position="center" />
              <story-example-story-dialog position="top" />
              <story-example-story-dialog position="bottom" />
              <story-example-story-dialog position="left" [hasRoundedCorners]="false" />
              <story-example-story-dialog position="right" [hasRoundedCorners]="false" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Center</strong>: Centered modal (default)</li>
            <li><strong>Top / Bottom</strong>: Full-width sheet anchored to the matching edge</li>
            <li><strong>Left / Right</strong>: Full-height drawer; rounded corners are dropped automatically</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Close on click outside"
            description="Click the backdrop to close. Disabled by default to prevent accidental dismissal during data entry."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-example-story-dialog position="center" [enableCloseOnClickOutside]="true" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Backdrop click</strong>: Closes the dialog when enableCloseOnClickOutside is true</li>
            <li><strong>Escape key</strong>: Always available for keyboard users</li>
            <li><strong>Default behaviour</strong>: Backdrop click is disabled to avoid accidental dismissal</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Escape key disabled"
            description="When enableEscapeKey is false at open time, the escape key cannot close the dialog and the close icon is also disabled."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-example-story-dialog position="center" [enableEscapeKey]="false" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Escape key</strong>: Does NOT close the dialog</li>
            <li><strong>Close icon</strong>: Rendered with reduced opacity and not clickable</li>
            <li><strong>Footer buttons</strong>: Still close the dialog normally</li>
            <li><strong>Use case</strong>: Critical operations where dismissal must be intentional</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    styles: [
      `
        .canvas-scroll-stage {
          height: 18rem;
          display: flex;
          justify-content: center;
        }
      `,
    ],
    moduleMetadata: {
      imports: [
        Button,
        Dialog,
        DialogHeader,
        DialogIcon,
        DialogContent,
        DialogFooter,
        Icon,
        EXAMPLEStoryDialog,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
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
      <org-button label="Open Dialog" (click)="openDialog()" />

      @if (closeCount() > 0) {
        <div class="p-4 bg-secondary-soft rounded-lg">
          <p class="text-sm font-medium">Dialog Closed Events: {{ closeCount() }}</p>
          <p class="text-xs text-muted mt-1">Open and close the dialog to see the count increase</p>
        </div>
      }
    </div>
  `,
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
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Dialog with Closed Event" />
          <org-design-system-demo-canvas slot="canvas">
            <story-example-story-dialog-with-closed-event />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Closed Event</strong>: Emitted whenever dialog closes by any means</li>
            <li><strong>Event Counter</strong>: Tracks how many times the dialog has been closed</li>
            <li><strong>Console Logging</strong>: Check console for logged close events</li>
            <li><strong>State Management</strong>: Useful for clearing selected data when dialog closes</li>
            <li><strong>Multiple Close Methods</strong>: Works with backdrop click, Escape key, and button clicks</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        EXAMPLEStoryDialogWithClosedEvent,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
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
      <org-button label="Open Dialog" (click)="openDialog()" />
    </div>
  `,
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
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Dialog Backdrop Toggle" />
          <org-design-system-demo-canvas slot="canvas">
            <story-example-story-dialog-with-backdrop-toggle />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Backdrop Enabled</strong>: Dialog appears with a semi-transparent overlay covering the page content</li>
            <li><strong>Backdrop Disabled</strong>: Dialog appears without overlay, allowing interaction with page content behind it</li>
            <li><strong>Escape Key</strong>: Works to close dialog regardless of backdrop setting</li>
            <li><strong>Page Interaction</strong>: When backdrop is disabled, you can interact with elements behind the dialog</li>
            <li><strong>Visual Contrast</strong>: Backdrop provides visual separation and focus on the dialog content</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        EXAMPLEStoryDialogWithBackdropToggle,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
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
          <org-button color="neutral" label="Cancel" (clicked)="onCancel()" />
          <org-button color="primary" label="Confirm" (clicked)="onConfirm()" />
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
      <org-button label="Open Dialog" (click)="openDialog()" />
    </div>
  `,
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
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Dialog Close Icon" />
          <org-design-system-demo-canvas slot="canvas">
            <story-example-story-dialog-with-close-icon />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Close Icon</strong>: X button appears in the top-right corner when enabled (default: enabled)</li>
            <li><strong>Click to Close</strong>: Clicking the X button closes the dialog</li>
            <li><strong>Toggle Inside Dialog</strong>: Use the checkbox inside the dialog to show or hide the close icon in real-time</li>
            <li><strong>Accessibility</strong>: Close icon has proper aria-label for screen readers</li>
            <li><strong>Styling</strong>: Matches the notifications pattern (text variant, neutral color)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        EXAMPLEStoryDialogWithCloseIcon,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
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
          <org-button color="neutral" label="Cancel" (clicked)="onCancel()" />
          <org-button color="primary" label="Confirm" (clicked)="onConfirm()" />
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
      <org-button label="Open Dialog" (click)="openDialog()" />
    </div>
  `,
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
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Dialog Dynamic Close Control" />
          <org-design-system-demo-canvas slot="canvas">
            <story-example-story-dialog-dynamic-escape-key />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Open Dialog</strong>: Click the button to open the dialog</li>
            <li><strong>Inside Dialog Toggle</strong>: Use the checkbox INSIDE the dialog to enable/disable escape key and close icon</li>
            <li><strong>Synchronized State</strong>: Close icon (X button) and escape key are always in sync</li>
            <li><strong>Real-time Update</strong>: Close icon becomes enabled/disabled immediately when toggled while dialog is open</li>
            <li><strong>Disabled State</strong>: When disabled, the X button appears with reduced opacity (40%) and does not respond to clicks</li>
            <li><strong>Use Case</strong>: Useful for preventing accidental closes during critical operations (like form submission)</li>
            <li><strong>Button Close</strong>: Cancel and Confirm buttons still work regardless of escape key setting</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        EXAMPLEStoryDialogDynamicEscapeKey,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-example-story-template-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Dialog, DialogHeader, DialogContent, DialogFooter, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <org-button label="Open Dialog" (click)="openDialog()" />

      <ng-template [orgTypedContext]="dialogContextType" #dialogTemplateRef let-context>
        <org-dialog [position]="position()">
          <org-dialog-header title="Template-Based Dialog" />
          <org-dialog-content>
            <p>This dialog content is defined inline as a template reference — no separate component required.</p>
            <p class="mt-2 text-sm text-muted">{{ context.message }}</p>
          </org-dialog-content>
          <org-dialog-footer>
            <org-button color="neutral" label="Cancel" (clicked)="onCancel()" />
            <org-button color="primary" label="Confirm" (clicked)="onConfirm()" />
          </org-dialog-footer>
        </org-dialog>
      </ng-template>
    </div>
  `,
  hostDirectives: [DialogBrainDirective],
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
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Template-Based Dialog" />
          <org-design-system-demo-canvas slot="canvas">
            <story-example-story-template-dialog position="center" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>No Separate Component</strong>: Dialog content is defined inline in the parent template</li>
            <li><strong>Parent Scope Access</strong>: Template bindings call methods directly on the parent component</li>
            <li><strong>Template Context</strong>: Data passed to openDialog() is available via the let-* binding (typed via the orgTypedContext directive)</li>
            <li><strong>Escape Key</strong>: Works the same as component-based dialogs</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        EXAMPLEStoryTemplateDialog,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
