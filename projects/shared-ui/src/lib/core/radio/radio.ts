import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { logManager } from '@organization/shared-utils';
import { TextDirective, TextSize } from '../text-directive/text-directive';
import { ComponentSize } from '../types/component-types';
import { FORM_FIELD_COMPONENT } from '../form-fields/form-field';
import { RadioBrainDirective } from '../radio/radio-brain';
import { RADIO_GROUP_COMPONENT } from './radio-group';

/** all available radio size values */
export const allRadioSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the radio */
export type RadioSize = (typeof allRadioSizes)[number];

/** all available radio color values */
export const allRadioColors = ['primary', 'danger'] as const;

/** the color variant of the radio */
export type RadioColor = (typeof allRadioColors)[number];

/** default value for the name input */
export const RADIO_NAME_DEFAULT = '';

/** default value for the size input */
export const RADIO_SIZE_DEFAULT: RadioSize = 'base';

/** default value for the color input */
export const RADIO_COLOR_DEFAULT: RadioColor = 'primary';

/** default value for the description input */
export const RADIO_DESCRIPTION_DEFAULT = '';

@Component({
  selector: 'org-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextDirective],
  templateUrl: './radio.html',
  styleUrl: './radio.css',
  hostDirectives: [
    {
      directive: RadioBrainDirective,
      inputs: ['disabled', 'value'],
      outputs: ['selectionRequested'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-checked]': 'brain.isChecked() ? "" : null',
    '[attr.data-disabled]': 'brain.effectiveDisabled() ? "1" : null',
    '[attr.data-state]': 'brain.ariaInvalid() ? "error" : null',
  },
})
export class Radio implements OnInit {
  private readonly _radioGroup = inject(RADIO_GROUP_COMPONENT, { optional: true });
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });

  protected readonly brain = inject(RadioBrainDirective, { self: true });

  /** @ViewChild reference to the hidden native input element */
  @ViewChild('inputRef', { static: true })
  public readonly inputRef!: ElementRef<HTMLInputElement>;

  /** the name attribute for the radio input (required when not inside a radio group) */
  public readonly name = input<string>(RADIO_NAME_DEFAULT);

  /** the size variant of the radio */
  public readonly size = input<RadioSize>(RADIO_SIZE_DEFAULT);

  /** the color variant of the radio */
  public readonly color = input<RadioColor>(RADIO_COLOR_DEFAULT);

  /** optional description sub-line rendered beneath the label */
  public readonly description = input<string>(RADIO_DESCRIPTION_DEFAULT);

  /** the resolved name — prefers group name over local name input */
  public readonly effectiveName = computed<string>(() => this._radioGroup?.name() ?? this.name());

  /** the text size derived from the radio size */
  public readonly textSize = computed<TextSize>(() => {
    return this.size() === 'lg' ? 'xl' : this.size();
  });

  constructor() {
    /**
     * syncs validation context from a parent form-field (when the radio is used standalone in a form-field)
     * into the brain so it can derive aria-invalid / aria-describedby. when the radio is inside a radio group,
     * the group itself owns this wiring and pushes the context down through the group brain.
     */
    effect(() => {
      const formFieldBrain = this._formField?.brain;
      const hasMessage = !!formFieldBrain?.hasValidationMessage();
      const messageId = hasMessage ? (formFieldBrain?.validationMessageId ?? null) : null;

      this.brain.setValidationContext(hasMessage, messageId);
    });
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    const groupName = this._radioGroup?.name() ?? '';
    const radioName = this.name();

    if (!groupName && !radioName) {
      logManager.error({
        type: 'radio-missing-name',
        message: 'radio component requires a name either directly on the radio or from a parent radio-group',
      });
    }
  }

  /** routes the native input's `change` event into the brain so selection is recorded */
  protected onChange(): void {
    this.brain.handleNativeChange();
  }
}
