import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DatePickerInput } from '../date-picker-input/date-picker-input';
import { Icon } from '../icon/icon';
import { Label } from '../label/label';
import { allInputVariants } from '../input/input';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { TimeInput, allTimeInputFormats, type InputVariant, type TimeInputFormat } from './time-input';

const liveDemoFormatItems: ButtonToggleItem[] = allTimeInputFormats.map((format) => ({
  label: format,
  value: format,
  buttonColor: 'primary',
}));

const liveDemoVariantItems: ButtonToggleItem[] = allInputVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const meta: Meta<TimeInput> = {
  title: 'Core/Components/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## TimeInput Component

  A segmented time-picking field built on top of the org-input shell. Each segment (hours, minutes, optional meridiem) is its own click + keyboard target. The shell is the single tab stop; arrow keys move the active segment marker; digits / A / P keys mutate the focused segment.

  ### Features
  - 12-hour and 24-hour layouts
  - Real DOM segments (no native text input) with per-segment highlight band
  - Empty-state placeholder dashes — the field reads as time-shaped at rest
  - Keyboard model: ←/→ between segments, ↑/↓ step the focused segment, A/P set the meridiem, digits with smart auto-advancement
  - Tab moves focus out of the field — it does not cycle segments
  - Bordered / borderless / inline variants inherited from the Input shell
  - Disabled, readonly, and error states inherited from the Input shell
  - Form-association via reactive forms (ControlValueAccessor) AND two-way \`[(value)]\` model binding

  ### Value Format
  - 12-hour emits \`"hh:mm am/pm"\` (e.g. \`"09:41 am"\`)
  - 24-hour emits \`"HH:mm"\` (e.g. \`"14:30"\`)
  - Partial / unset state emits an empty string

  ### Keyboard Interactions
  - **Focus**: hours segment is automatically selected
  - **Left/Right arrow**: move between segments and wrap at the edges (12-hour: left-from-hours → meridiem, right-from-meridiem → hours)
  - **Up/Down arrow**: step the focused segment by one, looping at 12 / 23 / 59 / am↔pm
  - **Digit keys**: smart auto-advancement — 12-hour hours waits on 0–1; 24-hour hours waits on 0–2; minutes waits on 0–5
  - **A / P**: set the meridiem directly when the meridiem segment is focused
  - **Backspace / Delete**: clear the focused segment
  - **Tab**: leaves the field (does not cycle segments)
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TimeInput>;

export const Default: Story = {
  args: {
    name: 'time-input',
    format: '12-hour',
    variant: 'bordered',
    disabled: false,
    readonly: false,
    error: false,
    defaultValue: '',
    autoFocus: false,
    ariaLabel: undefined,
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'name attribute applied to the hidden form-value input',
    },
    format: {
      control: 'select',
      options: allTimeInputFormats,
      description: 'clock format — 12-hour shows three segments, 24-hour shows two',
    },
    variant: {
      control: 'select',
      options: allInputVariants,
      description: 'visual variant of the field shell',
    },
    disabled: {
      control: 'boolean',
      description: 'whether the field is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'whether the field is readonly',
    },
    error: {
      control: 'boolean',
      description: 'whether the field renders an error border',
    },
    defaultValue: {
      control: 'text',
      description: 'initial value applied at init when no reactive form value is present',
    },
    autoFocus: {
      control: 'boolean',
      description: 'whether the field should automatically receive focus on mount',
    },
    ariaLabel: {
      control: 'text',
      description: 'accessible label for the shell',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default time input. Use the controls below to interact with every input on the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-time-input
        [name]="name"
        [format]="format"
        [variant]="variant"
        [disabled]="disabled"
        [readonly]="readonly"
        [error]="error"
        [defaultValue]="defaultValue"
        [autoFocus]="autoFocus"
        [ariaLabel]="ariaLabel"
      />
    `,
    moduleMetadata: {
      imports: [TimeInput],
    },
  }),
};

@Component({
  selector: 'story-time-input-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TimeInput,
    ButtonToggle,
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
        align-items: center;
        justify-content: center;
        min-height: 6rem;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="A working time picker. Focusing the field auto-selects the first segment; from there, click a segment or use arrows to move between them. ↑/↓ step the focused segment by one. ←/→ move between segments and wrap at the ends — left from hours jumps to the meridiem, right from meridiem comes back to hours. Tab moves focus out of the field entirely (natural form traversal), it does not cycle segments. In 12-hour mode, A and P set the meridiem directly. Switch Format to compare 12-hour and 24-hour layouts."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="Format">
            <org-button-toggle [items]="formatItems" formControlName="format" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Readonly">
            <org-checkbox-toggle name="live-demo-readonly" value="readonly" formControlName="readonly">
              {{ liveDemoForm.controls.readonly.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Error">
            <org-checkbox-toggle name="live-demo-error" value="error" formControlName="error">
              {{ liveDemoForm.controls.error.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-time-input
              name="live-demo-time-input"
              [format]="liveDemoForm.controls.format.value"
              [variant]="liveDemoForm.controls.variant.value"
              [disabled]="liveDemoForm.controls.disabled.value"
              [readonly]="liveDemoForm.controls.readonly.value"
              [error]="liveDemoForm.controls.error.value"
              [defaultValue]="'02:30 pm'"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class TimeInputLiveDemoStory {
  protected readonly formatItems = liveDemoFormatItems;
  protected readonly variantItems = liveDemoVariantItems;

  protected readonly liveDemoForm = new FormGroup({
    format: new FormControl<TimeInputFormat>('12-hour', { nonNullable: true }),
    variant: new FormControl<InputVariant>('bordered', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    readonly: new FormControl<boolean>(false, { nonNullable: true }),
    error: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to flip every visual input on the time field and observe the result in the canvas.',
      },
    },
  },
  render: () => ({
    template: '<story-time-input-live-demo />',
    moduleMetadata: {
      imports: [TimeInputLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase mirroring the design reference — format comparison (12-hour and 24-hour), per-segment selection states, field-level chrome states (focus / error / disabled / readonly), and the field embedded in real form contexts.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Format · 12-hour and 24-hour"
            description="12-hour mode stamps three segments with the meridiem at the end; 24-hour mode stamps two and drops the meridiem entirely. The track decides its own width from its segments — there is no fixed minimum — so both formats sit cleanly inside a max-width-constrained field."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 flex-wrap">
                <org-time-input name="format-12h-empty" format="12-hour" />
                <org-time-input name="format-12h-value" format="12-hour" [defaultValue]="'09:41 am'" />
                <org-time-input name="format-12h-midnight" format="12-hour" [defaultValue]="'12:00 am'" />
              </div>
              <div class="flex gap-2 flex-wrap">
                <org-time-input name="format-24h-empty" format="24-hour" />
                <org-time-input name="format-24h-value" format="24-hour" [defaultValue]="'14:30'" />
                <org-time-input name="format-24h-evening" format="24-hour" [defaultValue]="'22:05'" />
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>12-hour</strong>: three segments (hh / mm / meridiem); empty fields show <code>--:-- --</code></li>
            <li><strong>24-hour</strong>: two segments (HH / mm); no meridiem; empty fields show <code>--:--</code></li>
            <li>both formats render the same shell chrome (height, padding, border, focus border)</li>
            <li>the value model emits the format-appropriate string only when every segment is filled</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Selection"
            description="Exactly one segment carries data-selected at a time; the highlight band signals which segment is taking your keystrokes. The band only paints while the field itself is focused — at rest the field reads as a value-shaped input with no selected segment. A selected empty segment still shows the band when focused; the dashes pull from fg-faint to fg-muted so they read as 'you are about to type here' rather than competing with a real value."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 flex-wrap">
                <div
                  class="org-input"
                  data-time-input="1"
                  data-variant="bordered"
                  data-format="12-hour"
                  data-focused="1"
                  data-has-pre="1"
                  role="group"
                  aria-label="Hours focused"
                >
                  <span class="org-input-pre"><org-icon name="clock" /></span>
                  <div class="org-input-track">
                    <span class="org-time-input-segment" data-segment="hh" data-selected="1">09</span>
                    <span class="org-time-input-separator">:</span>
                    <span class="org-time-input-segment" data-segment="mm">41</span>
                    <span class="org-time-input-segment" data-segment="meridiem">AM</span>
                  </div>
                </div>
                <div
                  class="org-input"
                  data-time-input="1"
                  data-variant="bordered"
                  data-format="12-hour"
                  data-focused="1"
                  data-has-pre="1"
                  role="group"
                  aria-label="Minutes focused"
                >
                  <span class="org-input-pre"><org-icon name="clock" /></span>
                  <div class="org-input-track">
                    <span class="org-time-input-segment" data-segment="hh">09</span>
                    <span class="org-time-input-separator">:</span>
                    <span class="org-time-input-segment" data-segment="mm" data-selected="1">41</span>
                    <span class="org-time-input-segment" data-segment="meridiem">AM</span>
                  </div>
                </div>
                <div
                  class="org-input"
                  data-time-input="1"
                  data-variant="bordered"
                  data-format="12-hour"
                  data-focused="1"
                  data-has-pre="1"
                  role="group"
                  aria-label="Meridiem focused"
                >
                  <span class="org-input-pre"><org-icon name="clock" /></span>
                  <div class="org-input-track">
                    <span class="org-time-input-segment" data-segment="hh">09</span>
                    <span class="org-time-input-separator">:</span>
                    <span class="org-time-input-segment" data-segment="mm">41</span>
                    <span class="org-time-input-segment" data-segment="meridiem" data-selected="1">AM</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 flex-wrap">
                <div
                  class="org-input"
                  data-time-input="1"
                  data-variant="bordered"
                  data-format="12-hour"
                  data-focused="1"
                  data-has-pre="1"
                  role="group"
                  aria-label="Hours focused, empty"
                >
                  <span class="org-input-pre"><org-icon name="clock" /></span>
                  <div class="org-input-track">
                    <span class="org-time-input-segment" data-segment="hh" data-selected="1" data-empty="1">--</span>
                    <span class="org-time-input-separator">:</span>
                    <span class="org-time-input-segment" data-segment="mm" data-empty="1">--</span>
                    <span class="org-time-input-segment" data-segment="meridiem" data-empty="1">--</span>
                  </div>
                </div>
                <div
                  class="org-input"
                  data-time-input="1"
                  data-variant="bordered"
                  data-format="12-hour"
                  data-focused="1"
                  data-has-pre="1"
                  role="group"
                  aria-label="Minutes focused, partial"
                >
                  <span class="org-input-pre"><org-icon name="clock" /></span>
                  <div class="org-input-track">
                    <span class="org-time-input-segment" data-segment="hh">09</span>
                    <span class="org-time-input-separator">:</span>
                    <span class="org-time-input-segment" data-segment="mm" data-selected="1" data-empty="1">--</span>
                    <span class="org-time-input-segment" data-segment="meridiem" data-empty="1">--</span>
                  </div>
                </div>
                <div
                  class="org-input"
                  data-time-input="1"
                  data-variant="bordered"
                  data-format="12-hour"
                  data-focused="1"
                  data-has-pre="1"
                  role="group"
                  aria-label="Meridiem focused, empty"
                >
                  <span class="org-input-pre"><org-icon name="clock" /></span>
                  <div class="org-input-track">
                    <span class="org-time-input-segment" data-segment="hh">09</span>
                    <span class="org-time-input-separator">:</span>
                    <span class="org-time-input-segment" data-segment="mm">41</span>
                    <span class="org-time-input-segment" data-segment="meridiem" data-selected="1" data-empty="1">--</span>
                  </div>
                </div>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>the selection band only paints when the field itself is focused</li>
            <li>only one segment carries <code>data-selected="1"</code> at a time</li>
            <li>a selected empty segment reads with a stronger tone (the field's on-info foreground)</li>
            <li>unselected empty segments stay in the <code>fg-faint</code> ghost tone</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Field states"
            description="The field inherits every Input state — focus border, validity, disabled, readonly — without TimeInput re-implementing any of them. Disabled drops opacity and pointer events on the whole shell, including the segments inside; readonly keeps the field readable but flips the segment cursor back to default so the affordance reads as 'this is the value, not a control'."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2 flex-wrap">
              <org-time-input name="state-focus" [defaultValue]="'09:41 am'" [autoFocus]="true" />
              <org-time-input name="state-error" [error]="true" />
              <org-time-input name="state-disabled" [disabled]="true" [defaultValue]="'09:41 am'" />
              <org-time-input name="state-readonly" [readonly]="true" [defaultValue]="'09:41 am'" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Focus</strong>: the shell paints the focus border and exposes the segment highlight band</li>
            <li><strong>Error</strong>: the shell paints the danger border; selection still works while the band stays focus-only</li>
            <li><strong>Disabled</strong>: opacity drops, pointer events are suppressed, the segments inherit the muted treatment</li>
            <li><strong>Readonly</strong>: the field stays focusable but segment cursors flip to default — the value reads as data, not a control</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="In context"
            description="Wrapped in org-label with helper / error text below — the same field-wrapper rhythm any text Input uses. Because the trigger IS an Input, a TimeInput row in a stacked form lines up with a free-text Input row exactly, and pairs cleanly next to a DatePickerInput in a date-and-time pair."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 flex-wrap items-start">
              <div class="flex flex-col gap-1">
                <org-label text="Start time" htmlFor="in-context-start" />
                <org-time-input name="in-context-start" [defaultValue]="'09:30 am'" />
                <span class="text-xs text-fg-muted">Local time. Past times today are not allowed.</span>
              </div>
              <div class="flex flex-col gap-1">
                <org-label text="Departure time" htmlFor="in-context-departure" [isRequired]="true" />
                <org-time-input name="in-context-departure" [error]="true" />
                <span class="text-xs text-danger">Departure time is required.</span>
              </div>
              <div class="flex flex-col gap-1">
                <org-label text="Reminder" htmlFor="in-context-reminder" />
                <div class="flex gap-2 items-center">
                  <org-date-picker-input name="in-context-reminder-date" />
                  <org-time-input name="in-context-reminder" [defaultValue]="'09:30 am'" />
                </div>
                <span class="text-xs text-fg-muted">
                  DatePickerInput on the left, TimeInput on the right — same Input shell, same rhythm.
                </span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>TimeInput composes the same shell chrome as Input — labels, helper text, and error text wrap it identically</li>
            <li>required labels and error text behave the same as on a free-text Input row</li>
            <li>a date-and-time pair lines up cleanly because both fields share the same shell tokens</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        TimeInput,
        DatePickerInput,
        Icon,
        Label,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-time-input-non-form-usage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TimeInput,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        min-height: 6rem;
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Non-form usage"
          description="Drive the TimeInput's value via two-way [(value)] binding without any reactive form on top."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-time-input name="non-form-time-input" [(value)]="currentValue" />
            <div class="text-sm">
              <strong>Current value:</strong>
              <code>{{ currentValue() || '(empty)' }}</code>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><code>[(value)]</code> is a two-way model binding</li>
          <li>parent value updates in real time as the user types</li>
          <li>partial state emits an empty string until every segment is filled</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class TimeInputNonFormUsageStory {
  protected readonly currentValue = signal<string>('12:00 pm');
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Two-way binding via the value model() signal — no reactive form required.',
      },
    },
  },
  render: () => ({
    template: '<story-time-input-non-form-usage />',
    moduleMetadata: {
      imports: [TimeInputNonFormUsageStory],
    },
  }),
};

@Component({
  selector: 'story-time-input-reactive-form-integration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TimeInput,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        min-height: 6rem;
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive form integration"
          description="TimeInput implements ControlValueAccessor — bind a FormControl and the field participates in validation, dirty / touched tracking, and disabled propagation."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-time-input name="reactive-form-time-input" [formControl]="timeControl" />
            <div class="text-sm flex flex-col gap-1">
              <div>
                <strong>Value:</strong> <code>{{ timeControl.value || '(empty)' }}</code>
              </div>
              <div><strong>Valid:</strong> {{ timeControl.valid }}</div>
              <div><strong>Touched:</strong> {{ timeControl.touched }}</div>
              <div><strong>Dirty:</strong> {{ timeControl.dirty }}</div>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>form value updates as the user edits the time</li>
          <li>standard form-control flags (valid, dirty, touched) behave like any other input</li>
          <li><code>setDisabledState</code> propagates to the brain and gates all interaction</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class TimeInputReactiveFormIntegrationStory {
  protected readonly timeControl = new FormControl('03:15 pm');
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Reactive-form integration via ControlValueAccessor and FormControl.',
      },
    },
  },
  render: () => ({
    template: '<story-time-input-reactive-form-integration />',
    moduleMetadata: {
      imports: [TimeInputReactiveFormIntegrationStory],
    },
  }),
};
