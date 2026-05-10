import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { Button } from '../button/button';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Label } from '../label/label';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Textarea, TextareaVariant, allTextareaVariants } from './textarea';
import { TextareaToolbar } from './textarea-toolbar';
import { TextareaToolbarItem } from './textarea-toolbar-item';

const liveDemoVariantItems: ButtonToggleItem[] = allTextareaVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoStateItems: ButtonToggleItem[] = [
  { label: 'rest', value: 'rest', buttonColor: 'primary' },
  { label: 'error', value: 'error', buttonColor: 'primary' },
  { label: 'disabled', value: 'disabled', buttonColor: 'primary' },
  { label: 'readonly', value: 'readonly', buttonColor: 'primary' },
];

const liveDemoMinLinesItems: ButtonToggleItem[] = [
  { label: '1', value: '1', buttonColor: 'primary' },
  { label: '2', value: '2', buttonColor: 'primary' },
  { label: '3', value: '3', buttonColor: 'primary' },
  { label: '6', value: '6', buttonColor: 'primary' },
];

const meta: Meta<Textarea> = {
  title: 'Core/Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Textarea Component

  A multi-line text-entry shell. Sibling of Input — same variant ramp (\`bordered\`, \`borderless\`), same focus / hover / error vocabulary. The native &lt;textarea&gt; lives inside a styled wrapper so the wrapper can host an optional bottom toolbar with a built-in send button + keyboard hint, and own the focus-within border color.

  Auto-grow is the only height behaviour — there is no native resize handle. The shell sizes between \`minLines\` and \`maxLines\`, and content beyond \`maxLines\` scrolls inside.

  ### Features
  - Two variants: \`bordered\` (default), \`borderless\`
  - Auto-grow between \`minLines\` and \`maxLines\` using CSS \`field-sizing: content\` + \`lh\` units
  - Optional projected \`org-textarea-toolbar\` with built-in send button + keyboard hint
  - Full state set: hover, focus, error, disabled, readonly, loading
  - Form integration via \`ControlValueAccessor\` (works with reactive forms)
  - Submit-key routing (\`enter\` / \`shift+enter\`, configurable via \`inverseEnter\`)
  - Accessible: focus monitoring, aria-invalid driven by parent FormField validation message
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Textarea>;

export const Default: Story = {
  args: {
    name: 'textarea',
    variant: 'bordered',
    placeholder: 'Tell us what you’re working on...',
    value: '',
    disabled: false,
    readonly: false,
    loading: false,
    autoFocus: false,
    selectAllOnFocus: false,
    inverseEnter: false,
    minLines: 3,
    maxLines: 8,
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name attribute (also used as the element id for label association)',
    },
    variant: {
      control: 'select',
      options: allTextareaVariants,
      description: 'The visual variant of the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea',
    },
    value: {
      control: 'text',
      description: 'The current value of the textarea',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the textarea is readonly',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the textarea is in a loading state (tones any spinner inside the toolbar)',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Whether the textarea should auto-focus on mount',
    },
    selectAllOnFocus: {
      control: 'boolean',
      description: 'Whether to select all text when the textarea receives focus',
    },
    inverseEnter: {
      control: 'boolean',
      description: 'When true, Enter submits and Shift+Enter inserts newline (default is reversed)',
    },
    minLines: {
      control: 'number',
      description: 'Minimum visible lines — the textarea never collapses below this height',
    },
    maxLines: {
      control: 'number',
      description: 'Maximum visible lines — the textarea scrolls past this height instead of growing',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default textarea with full controls. Use the controls below to drive every visual input.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-textarea
        [name]="name"
        [variant]="variant"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [readonly]="readonly"
        [loading]="loading"
        [autoFocus]="autoFocus"
        [selectAllOnFocus]="selectAllOnFocus"
        [inverseEnter]="inverseEnter"
        [minLines]="minLines"
        [maxLines]="maxLines"
      />
    `,
    moduleMetadata: {
      imports: [Textarea],
    },
  }),
};

@Component({
  selector: 'story-textarea-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Textarea,
    TextareaToolbar,
    TextareaToolbarItem,
    Button,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
    FormField,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        gap: var(--spacing-2);
        min-height: 10rem;
      }
      .meta {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Real, focusable textarea — type to see auto-grow up to maxLines, then scroll. Toggle the controls to walk every state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="State">
            <org-button-toggle [items]="stateItems" formControlName="state" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Min lines">
            <org-button-toggle [items]="minLinesItems" formControlName="minLines" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Toolbar">
            <org-checkbox-toggle name="live-demo-toolbar" value="toolbar" formControlName="toolbar">
              {{ liveDemoForm.controls.toolbar.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (liveDemoForm.controls.state.value === 'error') {
              <org-form-field validationMessage="Description must be at least 20 characters.">
                <org-textarea
                  name="live-demo-textarea"
                  placeholder="Tell us what you’re working on..."
                  [variant]="liveDemoForm.controls.variant.value"
                  [disabled]="false"
                  [readonly]="false"
                  [minLines]="parsedMinLines()"
                  [maxLines]="8"
                >
                  @if (liveDemoForm.controls.toolbar.value) {
                    <org-textarea-toolbar [showHint]="true">
                      <org-textarea-toolbar-item>
                        <org-button [iconOnly]="true" label="attach" ariaLabel="attach" variant="text" preIcon="plus" />
                      </org-textarea-toolbar-item>
                      <org-textarea-toolbar-item>
                        <org-button [iconOnly]="true" label="mention" ariaLabel="mention" variant="text" preIcon="at-sign" />
                      </org-textarea-toolbar-item>
                    </org-textarea-toolbar>
                  }
                </org-textarea>
              </org-form-field>
            } @else {
              <org-textarea
                name="live-demo-textarea"
                placeholder="Tell us what you’re working on..."
                [variant]="liveDemoForm.controls.variant.value"
                [disabled]="liveDemoForm.controls.state.value === 'disabled'"
                [readonly]="liveDemoForm.controls.state.value === 'readonly'"
                [minLines]="parsedMinLines()"
                [maxLines]="8"
              >
                @if (liveDemoForm.controls.toolbar.value) {
                  <org-textarea-toolbar [showHint]="true">
                    <org-textarea-toolbar-item>
                      <org-button [iconOnly]="true" label="attach" ariaLabel="attach" variant="text" preIcon="plus" />
                    </org-textarea-toolbar-item>
                    <org-textarea-toolbar-item>
                      <org-button [iconOnly]="true" label="mention" ariaLabel="mention" variant="text" preIcon="at-sign" />
                    </org-textarea-toolbar-item>
                  </org-textarea-toolbar>
                }
              </org-textarea>
            }
            <p class="meta">
              data-variant="{{ liveDemoForm.controls.variant.value }}", lines={{ liveDemoForm.controls.minLines.value }}–8
            </p>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class TextareaLiveDemoStory {
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly stateItems = liveDemoStateItems;
  protected readonly minLinesItems = liveDemoMinLinesItems;

  protected readonly liveDemoForm = new FormGroup({
    variant: new FormControl<TextareaVariant>('bordered', { nonNullable: true }),
    state: new FormControl<'rest' | 'error' | 'disabled' | 'readonly'>('rest', { nonNullable: true }),
    minLines: new FormControl<string>('3', { nonNullable: true }),
    toolbar: new FormControl<boolean>(true, { nonNullable: true }),
  });

  protected readonly parsedMinLines = toSignal(
    this.liveDemoForm.controls.minLines.valueChanges.pipe(map((value) => parseInt(value, 10) || 3)),
    { initialValue: 3 }
  );
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the textarea (variant, state, min lines, toolbar) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-textarea-live-demo />`,
    moduleMetadata: {
      imports: [TextareaLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-textarea-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Textarea,
    TextareaToolbar,
    TextareaToolbarItem,
    Button,
    Label,
    FormField,
    FormFields,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Variants" description="Two shell treatments, all sharing the Input ramp." />
        <org-design-system-demo-canvas slot="canvas">
          <org-textarea name="showcase-bordered" placeholder="Tell us what you’re working on..." />
          <org-textarea name="showcase-borderless" variant="borderless" placeholder="Add a comment..." />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>bordered</strong>: Standard textarea with visible border (default)</li>
          <li><strong>borderless</strong>: No chrome at rest — meant to live inside another bordered surface</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Visual States" description="Every state, shown for the bordered variant." />
        <org-design-system-demo-canvas slot="canvas">
          <org-textarea name="showcase-state-default" placeholder="Write a reply..." />
          <org-form-field validationMessage="Description must be at least 20 characters.">
            <org-textarea name="showcase-state-error" />
          </org-form-field>
          <org-textarea name="showcase-state-disabled" [disabled]="true" placeholder="This payload is locked while the job runs." />
          <org-textarea name="showcase-state-readonly" [readonly]="true" value="Auto-generated from the latest commit message." />
          <org-textarea name="showcase-state-loading" [loading]="true" value="Streaming in progress..." />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Default</strong>: Hover and focus surface the info border color</li>
          <li><strong>Error</strong>: Border switches to danger red and survives hover / focus</li>
          <li><strong>Disabled</strong>: Reduced opacity, pointer events blocked</li>
          <li><strong>Readonly</strong>: Slightly tinted background, value still selectable</li>
          <li><strong>Loading</strong>: Forces native readonly; any toolbar spinner is toned to muted</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Toolbar" description="An optional bottom strip merged into the same shell — no internal divider. Holds tool buttons on the left and a built-in send button (with optional keyboard hint) on the right." />
        <org-design-system-demo-canvas slot="canvas">
          <org-textarea name="showcase-toolbar-followup" placeholder="Ask a follow-up...">
            <org-textarea-toolbar [showHint]="true">
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="attach" ariaLabel="attach" variant="text" preIcon="plus" />
              </org-textarea-toolbar-item>
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="image" ariaLabel="image" variant="text" preIcon="image" />
              </org-textarea-toolbar-item>
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="mention" ariaLabel="mention" variant="text" preIcon="at-sign" />
              </org-textarea-toolbar-item>
            </org-textarea-toolbar>
          </org-textarea>

          <org-textarea name="showcase-toolbar-release" placeholder="Write a release note...">
            <org-textarea-toolbar [showSendButton]="false">
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="bold" ariaLabel="bold" variant="text" preIcon="bold" />
              </org-textarea-toolbar-item>
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="italic" ariaLabel="italic" variant="text" preIcon="italic" />
              </org-textarea-toolbar-item>
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="code" ariaLabel="code" variant="text" preIcon="code" />
              </org-textarea-toolbar-item>
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="link" ariaLabel="link" variant="text" preIcon="link" />
              </org-textarea-toolbar-item>
              <org-button toolbar-right label="Save draft" variant="soft" color="neutral" size="sm" />
              <org-button toolbar-right label="Publish" variant="filled" color="primary" size="sm" />
            </org-textarea-toolbar>
          </org-textarea>

          <org-textarea name="showcase-toolbar-reply" placeholder="Reply with one click...">
            <org-textarea-toolbar [showHint]="true" hintLabel="to send · ⇧↵ for new line" />
          </org-textarea>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Toolbar is part of the shell — no internal divider, no separate background</li>
          <li><strong>Default slot</strong>: Project <code>org-textarea-toolbar-item</code> elements for the left edge</li>
          <li><strong><code>[toolbar-right]</code> slot</strong>: Project custom buttons that sit before the built-in send button</li>
          <li><strong><code>showSendButton</code></strong>: Drop the built-in send button entirely (e.g. drafts with Save / Publish)</li>
          <li><strong><code>showHint</code> + <code>hintLabel</code></strong>: Show a small kbd-styled keyboard hint (e.g. "↵ to send")</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Auto-grow" description="The shell sits between minLines and maxLines. Typing past maxLines scrolls inside the textarea — the field never grows past its ceiling." />
        <org-design-system-demo-canvas slot="canvas">
          <org-textarea
            name="showcase-grow-single"
            placeholder="Single-line, no auto-grow (1-line max)"
            [minLines]="1"
            [maxLines]="1"
          />
          <org-textarea
            name="showcase-grow-compact"
            placeholder="Compact: starts at 2 lines, caps at 4"
            [minLines]="2"
            [maxLines]="4"
          />
          <org-textarea
            name="showcase-grow-long"
            placeholder="Long-form: 6 starting lines, 12-line cap"
            [minLines]="6"
            [maxLines]="12"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>minLines</strong> sets the floor — the textarea never collapses below this height</li>
          <li><strong>maxLines</strong> sets the ceiling — content past this scrolls inside the textarea</li>
          <li>Auto-grow is driven by CSS <code>field-sizing: content</code> + <code>1lh</code> bounds — no JavaScript runs</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="In context — with Label" description="Stacked with a label and helper / error message via FormField." />
        <org-design-system-demo-canvas slot="canvas">
          <org-form-fields>
            <org-form-field>
              <org-label text="Description" htmlFor="showcase-context-description" [isRequired]="true" />
              <org-textarea name="showcase-context-description" placeholder="What does this do?" />
            </org-form-field>
            <org-form-field validationMessage="Entry must be at least 20 characters.">
              <org-label text="Changelog entry" htmlFor="showcase-context-changelog" [isRequired]="true" />
              <org-textarea name="showcase-context-changelog" value="tweaks" />
            </org-form-field>
          </org-form-fields>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>FormField wrapping</strong>: Provides validation message + reserved space; the textarea's error state is driven directly by the FormField</li>
          <li><strong>Label association</strong>: The label's <code>htmlFor</code> matches the textarea's <code>name</code> (which is also used as the element id)</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class TextareaShowcaseStory {}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every textarea axis — variants, visual states, toolbar configurations, auto-grow bounds, and in-context FormField composition — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `<story-textarea-showcase />`,
    moduleMetadata: {
      imports: [TextareaShowcaseStory],
    },
  }),
};

@Component({
  selector: 'story-textarea-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Textarea,
    TextareaToolbar,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Non-Form Usage" />
        <org-design-system-demo-canvas slot="canvas">
          <org-textarea
            name="non-form-textarea"
            placeholder="Type to update the value below"
            [(value)]="value"
          >
            <org-textarea-toolbar
              [showHint]="true"
              [sendDisabled]="value().trim().length === 0"
              (sendClicked)="onSend()"
            />
          </org-textarea>
          <p>
            Value: <strong>{{ value() }}</strong>
          </p>
          <p>
            Sent count: <strong>{{ sentCount() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Use <strong>[(value)]</strong> for two-way binding outside of a reactive form</li>
          <li>The toolbar's <strong>sendClicked</strong> output emits whenever the built-in send button is clicked</li>
          <li>The send button is gated locally via the <strong>sendDisabled</strong> input</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class TextareaNonFormStory {
  protected readonly value = signal<string>('');
  protected readonly sentCount = signal<number>(0);

  protected onSend(): void {
    this.sentCount.update((count) => count + 1);
    this.value.set('');
  }
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the textarea outside of a reactive form using `[(value)]` and listening to `(sendClicked)`.',
      },
    },
  },
  render: () => ({
    template: `<story-textarea-non-form />`,
    moduleMetadata: {
      imports: [TextareaNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-textarea-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Textarea,
    Label,
    FormField,
    FormFields,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive Form Integration"
          [description]="'Form Valid: ' + descriptionForm.valid + ', Form Value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="descriptionForm" class="flex flex-col gap-2">
            <org-form-fields>
              <org-form-field [validationMessage]="descriptionError()">
                <org-label text="Description" htmlFor="reactive-form-description" [isRequired]="true" />
                <org-textarea
                  name="reactive-form-description"
                  placeholder="What does this do?"
                  formControlName="description"
                />
              </org-form-field>
              <org-form-field [validationMessage]="changelogError()">
                <org-label text="Changelog entry" htmlFor="reactive-form-changelog" [isRequired]="true" />
                <org-textarea
                  name="reactive-form-changelog"
                  placeholder="Markdown supported"
                  formControlName="changelog"
                  [minLines]="4"
                />
              </org-form-field>
            </org-form-fields>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Uses <strong>formControlName</strong> for reactive forms via <code>ControlValueAccessor</code></li>
          <li>The <code>org-form-field</code> wraps each textarea and drives <code>data-state="error"</code> via <code>validationMessage</code></li>
          <li>Programmatic <strong>form.disable()</strong> / <strong>control.disable()</strong> reflects in the textarea</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class TextareaReactiveFormStory {
  protected readonly descriptionForm = new FormGroup({
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    changelog: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
  });

  protected readonly descriptionError = toSignal(
    this.descriptionForm.controls.description.statusChanges.pipe(
      map(() => {
        const errors = this.descriptionForm.controls.description.errors;

        if (!errors || !this.descriptionForm.controls.description.touched) {
          return '';
        }

        if (errors['required']) {
          return 'Description is required';
        }

        if (errors['minlength']) {
          return 'Description must be at least 10 characters';
        }

        return '';
      })
    ),
    { initialValue: '' }
  );

  protected readonly changelogError = toSignal(
    this.descriptionForm.controls.changelog.statusChanges.pipe(
      map(() => {
        const errors = this.descriptionForm.controls.changelog.errors;

        if (!errors || !this.descriptionForm.controls.changelog.touched) {
          return '';
        }

        if (errors['required']) {
          return 'Changelog entry is required';
        }

        if (errors['minlength']) {
          return 'Entry must be at least 20 characters.';
        }

        return '';
      })
    ),
    { initialValue: '' }
  );

  protected readonly formValueDisplay = toSignal(
    this.descriptionForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.descriptionForm.value) }
  );
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating the textarea with Angular reactive forms via `ControlValueAccessor`.',
      },
    },
  },
  render: () => ({
    template: `<story-textarea-reactive-form />`,
    moduleMetadata: {
      imports: [TextareaReactiveFormStory],
    },
  }),
};
