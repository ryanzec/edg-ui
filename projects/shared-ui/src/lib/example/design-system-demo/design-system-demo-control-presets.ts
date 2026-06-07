import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { DropDownSelector } from '../../core/drop-down-selector/drop-down-selector';
import { type SelectionValue } from '../../core/drop-down-selector/drop-down-selector-brain';

/** a single named preset: a label shown in the dropdown and the value payload applied when it is selected */
export type DesignSystemDemoControlPreset<TValue = unknown> = {
  /** the user-facing label shown for the preset in the dropdown */
  label: string;
  /** the value payload emitted when the preset is selected */
  value: TValue;
};

/** default value for the label input */
export const DESIGN_SYSTEM_DEMO_CONTROL_PRESETS_LABEL_DEFAULT = 'Preset';

/**
 * a generic presets dropdown for a `org-design-system-demo` live demo. each option maps to a saved collection of
 * control values; selecting one re-emits that preset's payload so the host can push it back into its live-demo
 * form, letting a reviewer jump to a realistic configuration in a single click. generic over the preset payload
 * type so it works for any component's live demo.
 */
@Component({
  selector: 'org-design-system-demo-control-presets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownSelector],
  templateUrl: './design-system-demo-control-presets.html',
  styleUrl: './design-system-demo-control-presets.css',
})
export class DesignSystemDemoControlPresets<TValue = unknown> {
  /** the dropdown trigger label */
  public readonly label = input<string>(DESIGN_SYSTEM_DEMO_CONTROL_PRESETS_LABEL_DEFAULT);

  /** the selectable presets, each mapping a label to the value payload applied on selection */
  public readonly presets = input.required<DesignSystemDemoControlPreset<TValue>[]>();

  /** emits the chosen preset's value payload when a preset is selected */
  public readonly presetSelected = output<TValue>();

  /** the presets mapped to drop-down-selector items, with each item's value pointing at its preset index */
  protected readonly selectorItems = computed<SelectionValue<number>[]>(() =>
    this.presets().map((preset, index) => ({ value: index, display: preset.label }))
  );

  /** the drop-down-selector's two-way selection state; single-select, so it holds at most one item */
  protected readonly selectedItems = signal<SelectionValue<number>[]>([]);

  protected onSelectedItemsChange(selectedItems: SelectionValue<number>[]): void {
    this.selectedItems.set(selectedItems);

    const [selectedItem] = selectedItems;

    if (!selectedItem) {
      return;
    }

    this.presetSelected.emit(this.presets()[selectedItem.value].value);
  }
}
