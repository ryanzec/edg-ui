import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from '../button/button';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Icon } from '../icon/icon';
import { Input } from '../input/input';
import { Link } from '../link/link';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Label } from './label';

const meta: Meta<Label> = {
  title: 'Core/Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Label Component

  A form-field label with built-in indicators for required (a danger-colored asterisk) and loading (a spinner). Renders as a real \`<label>\` linked by \`for\` / \`id\` when the field is a single native control, or as a styled \`<div>\` for compound fields where the linked-id model breaks down.

  ### Features
  - Required indicator generated as a decorative \`::after\` marker (danger color, semibold)
  - Loading indicator composed from \`org-loading-spinner\`, restyled to muted foreground
  - Post slot for help icons, inline links, badges, character counters — children inherit muted foreground unless they opt into a different color
  - Renders as native \`<label>\` (default) or as \`<div>\` for compound fields

  ### Accessibility
  - The \`*\` marker is purely visual (rendered with empty alt text so it is not announced by screen readers)
  - The "required" semantic is delegated to the underlying form control via the \`required\` / \`aria-required\` attributes
  - Use \`htmlFor\` to link the label to its associated control by id

  ### Usage Examples
  \`\`\`html
  <!-- basic label -->
  <org-label htmlFor="email" text="Email address" />

  <!-- required field -->
  <org-label htmlFor="email" text="Email address" [isRequired]="true" />

  <!-- loading -->
  <org-label htmlFor="org" text="Organization" [isLoading]="true" />

  <!-- post slot -->
  <org-label htmlFor="bio" text="Bio">
    <span post>24 / 160</span>
  </org-label>

  <!-- compound field -->
  <org-label [asLabel]="false" text="Plan" [isRequired]="true" />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Label>;

export const Default: Story = {
  args: {
    text: 'Email address',
    isLoading: false,
    isRequired: false,
    htmlFor: 'default-email',
    asLabel: true,
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The visible text content acting as the accessible name for the associated form control',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether to render the loading spinner alongside the label text',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether to render the required-field marker (danger asterisk)',
    },
    htmlFor: {
      control: 'text',
      description: 'The html for attribute linking the label to its associated form control',
    },
    asLabel: {
      control: 'boolean',
      description: 'When true renders as a native <label> element; when false renders as a <div>',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default label. Use the controls below to walk every documented input.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-label
        [text]="text"
        [isLoading]="isLoading"
        [isRequired]="isRequired"
        [htmlFor]="htmlFor"
        [asLabel]="asLabel"
      />
    `,
    moduleMetadata: {
      imports: [Label],
    },
  }),
};

@Component({
  selector: 'story-label-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Label,
    Input,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlInput,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem; /* 8px */
      }
      .canvas-stage org-input {
        width: 16rem; /* 256px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs to walk every combination of the documented inputs — text, isRequired, isLoading, and asLabel."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="Label text">
            <org-input name="live-demo-text" formControlName="text" ariaLabel="Label text" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Required (*)">
            <org-checkbox-toggle name="live-demo-is-required" value="isRequired" formControlName="isRequired">
              {{ liveDemoForm.controls.isRequired.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Loading">
            <org-checkbox-toggle name="live-demo-is-loading" value="isLoading" formControlName="isLoading">
              {{ liveDemoForm.controls.isLoading.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="As <label>">
            <org-checkbox-toggle name="live-demo-as-label" value="asLabel" formControlName="asLabel">
              {{ liveDemoForm.controls.asLabel.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-label
              htmlFor="live-demo-input"
              [text]="liveDemoForm.controls.text.value"
              [isRequired]="liveDemoForm.controls.isRequired.value"
              [isLoading]="liveDemoForm.controls.isLoading.value"
              [asLabel]="liveDemoForm.controls.asLabel.value"
            />
            <org-input name="live-demo-target-input" placeholder="you@example.com" />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class LabelLiveDemoStory {
  protected readonly liveDemoForm = new FormGroup({
    text: new FormControl<string>('Email address', { nonNullable: true }),
    isRequired: new FormControl<boolean>(false, { nonNullable: true }),
    isLoading: new FormControl<boolean>(false, { nonNullable: true }),
    asLabel: new FormControl<boolean>(true, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Toggle every documented input to walk required, loading, and the native-element choice. The label is linked to a real <input> so the for / id association is exercised.',
      },
    },
  },
  render: () => ({
    template: `<story-label-live-demo />`,
    moduleMetadata: {
      imports: [LabelLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every label variant axis — the indicator matrix (asLabel x required x loading), the post slot (help icon, inline link, character counter, combinations with required and loading), and real-world stacked-form composition.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Indicator matrix" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-5 gap-3 items-center">
              <span class="text-xs font-weight-medium text-muted">&nbsp;</span>
              <span class="text-xs font-weight-medium text-muted">DEFAULT</span>
              <span class="text-xs font-weight-medium text-muted">REQUIRED</span>
              <span class="text-xs font-weight-medium text-muted">LOADING</span>
              <span class="text-xs font-weight-medium text-muted">REQUIRED + LOADING</span>

              <span class="text-xs font-weight-medium text-muted">AS &lt;LABEL&gt;</span>
              <org-label htmlFor="matrix-label-default" text="Email address" />
              <org-label htmlFor="matrix-label-required" text="Email address" [isRequired]="true" />
              <org-label htmlFor="matrix-label-loading" text="Email address" [isLoading]="true" />
              <org-label
                htmlFor="matrix-label-both"
                text="Email address"
                [isRequired]="true"
                [isLoading]="true"
              />

              <span class="text-xs font-weight-medium text-muted">AS &lt;DIV&gt;</span>
              <org-label [asLabel]="false" text="Email address" />
              <org-label [asLabel]="false" text="Email address" [isRequired]="true" />
              <org-label [asLabel]="false" text="Email address" [isLoading]="true" />
              <org-label
                [asLabel]="false"
                text="Email address"
                [isRequired]="true"
                [isLoading]="true"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: Renders the bare label text.</li>
            <li><strong>Required</strong>: Generates a decorative danger-colored <code>*</code> as a <code>::after</code> marker on the text wrapper. Screen readers ignore it; the form control's <code>required</code> attribute carries the semantic.</li>
            <li><strong>Loading</strong>: Renders a muted <code>org-loading-spinner</code> after the text.</li>
            <li><strong>Required + Loading</strong>: The asterisk sits flush with the text and the spinner sits to the right of it.</li>
            <li><strong>asLabel = false</strong>: Renders a <code>&lt;div&gt;</code> instead of a <code>&lt;label&gt;</code>; identical visual styling. Use for compound fields where <code>htmlFor</code> association breaks down.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Post slot" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-3 items-center">
              <span class="text-xs font-weight-medium text-muted">HELP ICON</span>
              <org-label htmlFor="post-help-icon" text="API key">
                <org-icon post name="circle-help" size="sm" color="inherit" />
              </org-label>

              <span class="text-xs font-weight-medium text-muted">INLINE LINK</span>
              <org-label htmlFor="post-link" text="Password">
                <org-link post href="#" ariaLabel="Forgot password">Forgot?</org-link>
              </org-label>

              <span class="text-xs font-weight-medium text-muted">CHARACTER COUNTER</span>
              <org-label htmlFor="post-counter" text="Bio">
                <span post>24 / 160</span>
              </org-label>

              <span class="text-xs font-weight-medium text-muted">REQUIRED + POST</span>
              <org-label htmlFor="post-required" text="Display name" [isRequired]="true">
                <org-icon post name="circle-check" size="sm" color="inherit" />
              </org-label>

              <span class="text-xs font-weight-medium text-muted">REQUIRED + LOADING + POST</span>
              <org-label
                htmlFor="post-required-loading"
                text="Organization"
                [isRequired]="true"
                [isLoading]="true"
              >
                <org-icon post name="circle-check" size="sm" color="inherit" />
              </org-label>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Post slot</strong>: Project content with the <code>post</code> attribute. Sits after the loading spinner, in the muted foreground color.</li>
            <li><strong>Help icon</strong>: An <code>org-icon</code> as a help affordance.</li>
            <li><strong>Inline link</strong>: An <code>org-link</code> for jump-to-recovery / "Forgot?" patterns.</li>
            <li><strong>Character counter</strong>: A bare <code>&lt;span post&gt;</code> for live counters.</li>
            <li><strong>Combinations</strong>: Post content composes with the required asterisk and the loading spinner; the spinner always sits between the text and the post content.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="In context" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <org-label htmlFor="ctx-email" text="Email address" [isRequired]="true" />
                <org-input name="ctx-email" type="email" placeholder="you@example.com" />
              </div>

              <div class="flex flex-col gap-1">
                <org-label htmlFor="ctx-password" text="Password" [isRequired]="true">
                  <org-link post href="#" ariaLabel="Forgot password">Forgot?</org-link>
                </org-label>
                <org-input name="ctx-password" type="password" placeholder="••••••••" />
              </div>

              <div class="flex flex-col gap-1">
                <org-label htmlFor="ctx-org" text="Organization" [isLoading]="true" />
                <org-input name="ctx-org" placeholder="Acme" />
              </div>

              <div class="flex flex-col gap-1">
                <org-label htmlFor="ctx-display-name" text="Display name">
                  <span post>7 / 40</span>
                </org-label>
                <org-input name="ctx-display-name" placeholder="Noah F." />
              </div>

              <div class="flex flex-col gap-1 col-span-2">
                <org-label htmlFor="ctx-workspace" text="Workspace URL" [isRequired]="true" />
                <org-input name="ctx-workspace" placeholder="acme corp" />
              </div>
            </div>

            <div class="mt-3 flex justify-end">
              <org-button color="primary" label="Save profile" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Stacked layout</strong>: The label sits above the control it labels with a small gap between them.</li>
            <li><strong>Required + post</strong>: A "Forgot?" inline link composes with the required asterisk in the same label.</li>
            <li><strong>Loading mid-flow</strong>: A field can announce live validation via the spinner without changing layout.</li>
            <li><strong>Character counter</strong>: A post counter pairs naturally with the field's max length.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Label,
        Input,
        Button,
        Icon,
        Link,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
