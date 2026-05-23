import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { ComboboxOptionBrainDirective } from '../combobox/combobox-option-brain';
import type { ComboboxOption as ComboboxOptionData } from '../combobox-store/combobox-store';

/** default value for the displayLabelPrefix input */
export const COMBOBOX_OPTION_DISPLAY_LABEL_PREFIX_DEFAULT: string | undefined = undefined;

/**
 * renders a single option inside the combobox dropdown. all interaction state, a11y attributes, and
 * mouse routing live on the brain (applied as host bindings on this element); this component only owns
 * the visual presentation: the optional label plus background effect.
 */
@Component({
  selector: 'org-combobox-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combobox-option.html',
  styleUrl: './combobox-option.css',
  hostDirectives: [
    {
      directive: ComboboxOptionBrainDirective,
      inputs: ['option'],
    },
  ],
})
export class ComboboxOption {
  protected readonly brain = inject(ComboboxOptionBrainDirective, { self: true });

  /** the option data to render. */
  public readonly option = input.required<ComboboxOptionData>();

  /** optional label-wrapper prefix (e.g. `Add` to produce `Add "label"`); when undefined the raw label is rendered. */
  public readonly displayLabelPrefix = input<string | undefined, string | null | undefined>(
    COMBOBOX_OPTION_DISPLAY_LABEL_PREFIX_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** the resolved display label, applying the optional prefix wrapper around the raw option label. */
  protected readonly displayLabel = computed<string>(() => {
    const prefix = this.displayLabelPrefix();
    const optionLabel = this.option().label;

    if (prefix === undefined) {
      return optionLabel;
    }

    return `${prefix} "${optionLabel}"`;
  });
}
