import { Component, ChangeDetectionStrategy, input, computed, inject, OnInit } from '@angular/core';
import { IconName } from '../../brain/icon-brain/icon-brain';
import { Icon } from '../icon/icon';
import { TextDirective, TextSize } from '../text-directive/text-directive';
import { ComponentSize } from '../types/component-types';
import { RADIO_GROUP_COMPONENT } from './radio-group';
import { logManager } from '@organization/shared-utils';
import { RadioBrainDirective } from '../../brain/radio-brain/radio-brain';

/** all available radio size values */
export const allRadioSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the radio */
export type RadioSize = (typeof allRadioSizes)[number];

/** default value for the name input */
export const RADIO_NAME_DEFAULT = '';

/** default value for the size input */
export const RADIO_SIZE_DEFAULT: RadioSize = 'sm';

@Component({
  selector: 'org-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TextDirective],
  templateUrl: './radio.html',
  styleUrl: './radio.css',
  hostDirectives: [
    {
      directive: RadioBrainDirective,
      inputs: ['disabled', 'value'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-checked]': 'isChecked() ? "" : null',
  },
})
export class Radio implements OnInit {
  private readonly _radioGroup = inject(RADIO_GROUP_COMPONENT, { optional: true });

  protected readonly brain = inject(RadioBrainDirective, { self: true });

  /** the name attribute for the radio input (required when not inside a radio group) */
  public readonly name = input<string>(RADIO_NAME_DEFAULT);

  /** the size variant of the radio */
  public readonly size = input<RadioSize>(RADIO_SIZE_DEFAULT);

  /** whether this radio is currently selected */
  public readonly isChecked = computed<boolean>(() => this.brain.isChecked());

  /** the resolved disabled state for this radio (local OR parent group disabled) */
  public readonly isDisabled = computed<boolean>(() => this.brain.effectiveDisabled());

  /** the resolved name — prefers group name over local name input */
  public readonly finalName = computed<string>(() => this._radioGroup?.name() ?? this.name());

  /** the text size derived from the radio size */
  public readonly textSize = computed<TextSize>(() => {
    return this.size() === 'lg' ? 'xl' : this.size();
  });

  /** the icon name representing the current checked state */
  public readonly currentIcon = computed<IconName>(() => {
    if (this.isChecked()) {
      return 'circle-check-big';
    }

    return 'circle';
  });

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
}
