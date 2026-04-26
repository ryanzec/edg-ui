import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ComboboxStore, ComboboxOption, ComboboxOptionInput } from './combobox-store';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const simpleOptions: ComboboxOptionInput[] = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' },
];

const fruitOptions: ComboboxOptionInput[] = [
  { label: 'Apple', value: 'apple', groupLabel: 'Fruits' },
  { label: 'Banana', value: 'banana', groupLabel: 'Fruits' },
  { label: 'Cherry', value: 'cherry', groupLabel: 'Fruits' },
  { label: 'Mango', value: 'mango', groupLabel: 'Fruits' },
  { label: 'Orange', value: 'orange', groupLabel: 'Fruits' },
  { label: 'Strawberry', value: 'strawberry', groupLabel: 'Fruits' },
  { label: 'Carrot', value: 'carrot', groupLabel: 'Vegetables' },
  { label: 'Broccoli', value: 'broccoli', groupLabel: 'Vegetables' },
  { label: 'Spinach', value: 'spinach', groupLabel: 'Vegetables' },
  { label: 'Tomato', value: 'tomato', groupLabel: 'Vegetables' },
  { label: 'Chicken', value: 'chicken', groupLabel: 'Proteins' },
  { label: 'Beef', value: 'beef', groupLabel: 'Proteins' },
  { label: 'Tofu', value: 'tofu', groupLabel: 'Proteins' },
  { label: 'Salmon', value: 'salmon', groupLabel: 'Proteins' },
];

@Component({
  selector: 'story-combobox-store-single-select-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Input, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [ComboboxStore],
  template: `
    <org-storybook-example-container
      title="Single Select Combobox"
      [currentState]="'Selected: ' + (store.selectedOptions().length > 0 ? store.selectedOptions()[0].label : 'None')"
    >
      <org-storybook-example-container-section label="Input & Options">
        <div class="flex flex-col gap-3 max-w-lg">
          <org-input
            name="combobox-input"
            [value]="store.inputValue()"
            (input)="inputChange($event)"
            placeholder="Type to filter options..."
          />

          <div class="flex flex-col gap-2 max-h-2xs overflow-y-auto border rounded p-2">
            @if (store.filteredOptions().length === 0) {
              <div class="text-sm text-neutral-text-subtle p-2">No options available</div>
            }
            @for (option of store.filteredOptions(); track option.value) {
              <button
                class="px-3 py-2 text-sm text-left border rounded cursor-pointer hover:bg-neutral-background-subtle"
                [class.bg-info-background-subtle]="store.selectedValues().includes(option.value)"
                [class.ring-2]="store.focusedOption()?.value === option.value"
                [class.ring-primary-border]="store.focusedOption()?.value === option.value"
                [disabled]="option.disabled"
                (click)="selectOption(option)"
                (mouseenter)="store.setFocusedOption(option)"
              >
                <span [class.opacity-50]="option.disabled">{{ option.label }}</span>
                @if (option.groupLabel !== 'Uncategorized') {
                  <span class="text-xs text-neutral-text-subtle ml-2">({{ option.groupLabel }})</span>
                }
              </button>
            }
          </div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (click)="store.focusNext()">Focus Next</org-button>
          <org-button color="primary" size="sm" (click)="store.focusPrevious()">Focus Previous</org-button>
          <org-button color="primary" size="sm" (click)="store.focusFirst()">Focus First</org-button>
          <org-button color="primary" size="sm" (click)="store.focusLast()">Focus Last</org-button>
          <org-button color="secondary" size="sm" (click)="store.setSelectedValues([])">Clear Selection</org-button>
          <org-button color="secondary" size="sm" (click)="store.clearInputValue()">Clear Input</org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Selected Value:</strong> {{ store.selectedValues()[0] ?? 'None' }}</div>
          <div><strong>Input Value:</strong> "{{ store.inputValue() }}"</div>
          <div><strong>Focused Option:</strong> {{ store.focusedOption()?.label ?? 'None' }}</div>
          <div><strong>Filtered Options Count:</strong> {{ store.filteredOptions().length }}</div>
          <div><strong>Total Options Count:</strong> {{ store.options().length }}</div>
        </div>
        <div class="mt-3">
          <div class="text-sm font-semibold mb-1">Selected Options (JSON):</div>
          <pre class="text-xs bg-neutral-background-subtle p-2 rounded border overflow-x-auto">{{
            getSelectedOptionsJson()
          }}</pre>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Single selection mode - only one option can be selected at a time</li>
        <li>Input value updates to match selected option label</li>
        <li>Options can be filtered by typing in the input</li>
        <li>Focus navigation with keyboard-like controls (Next/Previous/First/Last)</li>
        <li>Focused option is highlighted with a ring</li>
        <li>Options are grouped and sorted alphabetically</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxStoreSingleSelectDemo {
  protected readonly store = inject(ComboboxStore);

  constructor() {
    this.store.initialize(fruitOptions, {
      isMultiSelect: false,
      filterSelectedOptions: false,
      allowNewOptions: false,
      optionFilter: (inputValue, option) => option.label.toLowerCase().includes(inputValue.toLowerCase()),
    });

    // subscribe to events for demonstration
    this.store.inputValueChanged$.subscribe((value) => {
      console.log('Input value changed:', value);
    });

    this.store.selectedValuesChanged$.subscribe((values) => {
      console.log('Selected values changed:', values);
    });

    this.store.focusedOptionChanged$.subscribe((option) => {
      console.log('Focused option changed:', option);
    });
  }

  protected inputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.setInputValue(input.value);
  }

  protected selectOption(option: ComboboxOption): void {
    if (!option.disabled) {
      this.store.setSelectedValues([option.value]);
    }
  }

  protected getSelectedOptionsJson(): string {
    return JSON.stringify(this.store.selectedOptions(), null, 2);
  }
}

@Component({
  selector: 'story-combobox-store-multi-select-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Input, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [ComboboxStore],
  template: `
    <org-storybook-example-container
      title="Multi Select Combobox"
      [currentState]="'Selected: ' + store.selectedValues().length + ' items'"
    >
      <org-storybook-example-container-section label="Selected Items">
        <div class="flex flex-wrap gap-2 min-h-9xs">
          @if (store.selectedOptions().length === 0) {
            <div class="text-sm text-neutral-text-subtle">No items selected</div>
          }
          @for (option of store.selectedOptions(); track option.value) {
            <div class="flex items-center gap-2 px-3 py-1 text-sm border rounded bg-info-background-subtle">
              <span>{{ option.label }}</span>
              @if (option.isNew) {
                <span class="text-xs text-success-text">(New)</span>
              }
              <button class="text-danger-text hover:text-danger-text-emphasis" (click)="removeSelection(option.value)">
                ×
              </button>
            </div>
          }
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Input & Options">
        <div class="flex flex-col gap-3 max-w-lg">
          <org-input
            name="combobox-store-multi-select-demo-input"
            [value]="store.inputValue()"
            (input)="inputChange($event)"
            (keydown.enter)="enterKey()"
            placeholder="Type to filter or add new options..."
          />

          <div class="flex flex-col gap-2 max-h-2xs overflow-y-auto border rounded p-2">
            @if (store.filteredOptions().length === 0 && store.inputValue()) {
              <div class="text-sm text-neutral-text-subtle p-2">
                No matching options. Press Enter to add "{{ store.inputValue() }}"
              </div>
            }
            @for (option of store.filteredOptions(); track option.value) {
              <button
                class="px-3 py-2 text-sm text-left border rounded cursor-pointer hover:bg-neutral-background-subtle"
                [class.bg-info-background-subtle]="store.selectedValues().includes(option.value)"
                [class.ring-2]="store.focusedOption()?.value === option.value"
                [class.ring-primary-border]="store.focusedOption()?.value === option.value"
                [disabled]="option.disabled"
                (click)="toggleOption(option)"
                (mouseenter)="store.setFocusedOption(option)"
              >
                <span [class.opacity-50]="option.disabled">{{ option.label }}</span>
                @if (option.groupLabel !== 'Uncategorized') {
                  <span class="text-xs text-neutral-text-subtle ml-2">({{ option.groupLabel }})</span>
                }
              </button>
            }
          </div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (click)="store.groupFocusNext()">Group Focus Next</org-button>
          <org-button color="primary" size="sm" (click)="store.groupFocusPrevious()"> Group Focus Previous </org-button>
          <org-button color="primary" size="sm" (click)="store.groupFocusFirst()">Group Focus First</org-button>
          <org-button color="primary" size="sm" (click)="store.groupFocusLast()">Group Focus Last</org-button>
          <org-button color="secondary" size="sm" (click)="store.setSelectedValues([])">Clear All</org-button>
          <org-button
            color="secondary"
            size="sm"
            (click)="store.setFilterSelectedOptions(!store.config().filterSelectedOptions)"
          >
            {{ store.config().filterSelectedOptions ? 'Show' : 'Hide' }} Selected
          </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Selected Count:</strong> {{ store.selectedValues().length }}</div>
          <div><strong>Input Value:</strong> "{{ store.inputValue() }}"</div>
          <div><strong>Focused Option:</strong> {{ store.focusedOption()?.label ?? 'None' }}</div>
          <div><strong>Filter Selected:</strong> {{ store.config().filterSelectedOptions }}</div>
          <div><strong>Allow New Options:</strong> {{ store.allowNewOptions() }}</div>
          <div><strong>Filtered Options Count:</strong> {{ store.filteredOptions().length }}</div>
        </div>
        <div class="mt-3">
          <div class="text-sm font-semibold mb-1">Selected Options (JSON):</div>
          <pre class="text-xs bg-neutral-background-subtle p-2 rounded border overflow-x-auto">{{
            getSelectedOptionsJson()
          }}</pre>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Multi-selection mode - multiple options can be selected</li>
        <li>Input clears after each selection</li>
        <li>New options can be added by typing and pressing Enter</li>
        <li>Selected items show as chips with remove buttons</li>
        <li>Toggle to hide already selected options from list</li>
        <li>Group-aware focus navigation</li>
        <li>New options are marked with "(New)" badge</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxStoreMultiSelectDemo {
  protected readonly store = inject(ComboboxStore);

  constructor() {
    this.store.initialize(fruitOptions, {
      isMultiSelect: true,
      filterSelectedOptions: true,
      allowNewOptions: true,
      optionFilter: (inputValue, option) => option.label.toLowerCase().includes(inputValue.toLowerCase()),
    });
  }

  protected inputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.setInputValue(input.value);
  }

  protected enterKey(): void {
    const inputValue = this.store.inputValue().trim();

    if (inputValue && this.store.allowNewOptions()) {
      const existingOption = this.store.options().find((opt) => opt.label.toLowerCase() === inputValue.toLowerCase());

      if (!existingOption) {
        // add new value to selection
        const currentSelected = this.store.selectedValues();
        this.store.setSelectedValues([...currentSelected, inputValue]);
        this.store.clearInputValue();
      }
    }
  }

  protected toggleOption(option: ComboboxOption): void {
    if (option.disabled) {
      return;
    }

    const currentSelected = this.store.selectedValues();
    const isSelected = currentSelected.includes(option.value);

    if (isSelected) {
      this.store.setSelectedValues(currentSelected.filter((v) => v !== option.value));

      return;
    }

    this.store.setSelectedValues([...currentSelected, option.value]);
  }

  protected removeSelection(value: string | number): void {
    const currentSelected = this.store.selectedValues();
    this.store.setSelectedValues(currentSelected.filter((v) => v !== value));
  }

  protected getSelectedOptionsJson(): string {
    return JSON.stringify(this.store.selectedOptions(), null, 2);
  }
}

@Component({
  selector: 'story-combobox-store-grouped-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Input, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [ComboboxStore],
  template: `
    <org-storybook-example-container
      title="Grouped Options"
      [currentState]="'Groups: ' + store.groupedOptions().length"
    >
      <org-storybook-example-container-section label="Input">
        <div class="max-w-lg">
          <org-input
            name="combobox-store-grouped-demo-input"
            [value]="store.inputValue()"
            (input)="inputChange($event)"
            placeholder="Type to filter options..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Grouped Options">
        <div class="flex flex-col gap-4 max-h-sm overflow-y-auto max-w-lg">
          @for (group of store.filteredGroupedOptions(); track group.groupLabel) {
            <div class="border rounded p-3">
              <div class="text-sm font-semibold mb-2 text-neutral-text-emphasis">
                {{ group.groupLabel }} ({{ group.options.length }})
              </div>
              <div class="flex flex-col gap-1">
                @for (option of group.options; track option.value) {
                  <button
                    class="px-3 py-2 text-sm text-left border rounded cursor-pointer hover:bg-neutral-background-subtle"
                    [class.bg-info-background-subtle]="store.selectedValues().includes(option.value)"
                    [class.ring-2]="store.focusedOption()?.value === option.value"
                    [class.ring-primary-border]="store.focusedOption()?.value === option.value"
                    [disabled]="option.disabled"
                    (click)="toggleOption(option)"
                    (mouseenter)="store.setFocusedOption(option)"
                  >
                    {{ option.label }}
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Focus Navigation">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (click)="store.groupFocusNext()">Next in Group</org-button>
          <org-button color="primary" size="sm" (click)="store.groupFocusPrevious()">Previous in Group</org-button>
          <org-button color="primary" size="sm" (click)="store.groupFocusFirst()">First Option</org-button>
          <org-button color="primary" size="sm" (click)="store.groupFocusLast()">Last Option</org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Group Index Info">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Focused Group Index:</strong> {{ store.getFocusedOptionGroupIndex().groupIndex }}</div>
          <div>
            <strong>Focused Option Index in Group:</strong> {{ store.getFocusedOptionGroupIndex().optionIndex }}
          </div>
          <div><strong>Focused Option:</strong> {{ store.focusedOption()?.label ?? 'None' }}</div>
          <div><strong>Total Groups:</strong> {{ store.filteredGroupedOptions().length }}</div>
        </div>
        <div class="mt-3">
          <div class="text-sm font-semibold mb-1">Selected Options (JSON):</div>
          <pre class="text-xs bg-neutral-background-subtle p-2 rounded border overflow-x-auto">{{
            getSelectedOptionsJson()
          }}</pre>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Options are organized by group labels</li>
        <li>Groups are sorted alphabetically</li>
        <li>Focus navigation respects group boundaries</li>
        <li>Group index tracking for keyboard navigation</li>
        <li>Options within groups maintain alphabetical order</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxStoreGroupedDemo {
  protected readonly store = inject(ComboboxStore);

  constructor() {
    this.store.initialize(fruitOptions, {
      isMultiSelect: true,
      filterSelectedOptions: false,
      allowNewOptions: false,
      optionFilter: (inputValue, option) => option.label.toLowerCase().includes(inputValue.toLowerCase()),
    });
  }

  protected inputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.setInputValue(input.value);
  }

  protected toggleOption(option: ComboboxOption): void {
    if (option.disabled) {
      return;
    }

    const currentSelected = this.store.selectedValues();
    const isSelected = currentSelected.includes(option.value);

    if (isSelected) {
      this.store.setSelectedValues(currentSelected.filter((v) => v !== option.value));

      return;
    }

    this.store.setSelectedValues([...currentSelected, option.value]);
  }

  protected getSelectedOptionsJson(): string {
    return JSON.stringify(this.store.selectedOptions(), null, 2);
  }
}

@Component({
  selector: 'story-combobox-store-dynamic-options-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Input, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [ComboboxStore],
  template: `
    <org-storybook-example-container
      title="Dynamic Options Management"
      [currentState]="'Options: ' + store.options().length"
    >
      <org-storybook-example-container-section label="Current Selection">
        <div class="flex flex-wrap gap-2 min-h-9xs">
          @if (store.selectedOptions().length === 0) {
            <div class="text-sm text-neutral-text-subtle">No items selected</div>
          }
          @for (option of store.selectedOptions(); track option.value) {
            <div class="px-3 py-1 text-sm border rounded bg-info-background-subtle">
              {{ option.label }}
            </div>
          }
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Available Options">
        <div class="flex flex-col gap-2 max-h-5xs overflow-y-auto border rounded p-2 max-w-lg">
          @for (option of store.options(); track option.value) {
            <button
              class="px-3 py-2 text-sm text-left border rounded cursor-pointer hover:bg-neutral-background-subtle"
              [class.bg-info-background-subtle]="store.selectedValues().includes(option.value)"
              (click)="toggleOption(option)"
            >
              {{ option.label }} ({{ option.groupLabel }})
            </button>
          }
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Dynamic Updates">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (click)="loadFruitsOnly()">Load Fruits Only</org-button>
          <org-button color="primary" size="sm" (click)="loadVegetablesOnly()">Load Vegetables Only</org-button>
          <org-button color="primary" size="sm" (click)="loadAllOptions()">Load All Options</org-button>
          <org-button color="secondary" size="sm" (click)="addRandomOption()">Add Random Option</org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Total Options:</strong> {{ store.options().length }}</div>
          <div><strong>Selected Count:</strong> {{ store.selectedValues().length }}</div>
          <div>
            <strong>Maintained Selections:</strong>
            {{ maintainedSelectionsMessage() }}
          </div>
        </div>
        <div class="mt-3">
          <div class="text-sm font-semibold mb-1">Selected Options (JSON):</div>
          <pre class="text-xs bg-neutral-background-subtle p-2 rounded border overflow-x-auto">{{
            getSelectedOptionsJson()
          }}</pre>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Options can be dynamically updated at runtime</li>
        <li>Selections are maintained if options still exist after update</li>
        <li>Selections are cleared if options no longer exist</li>
        <li>New options are automatically sorted alphabetically</li>
        <li>Store handles option updates gracefully</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxStoreDynamicOptionsDemo {
  protected readonly store = inject(ComboboxStore);
  protected readonly maintainedSelectionsMessage = signal<string>('No updates yet');

  private _randomCounter = 1;

  constructor() {
    this.store.initialize(fruitOptions, {
      isMultiSelect: true,
    });

    // track selection changes
    this.store.selectedValuesChanged$.subscribe((values) => {
      const before = this.store.selectedValues().length;
      const after = values.length;

      if (before !== after) {
        this.maintainedSelectionsMessage.set(`${after} of ${before} selections maintained`);
      }
    });
  }

  protected toggleOption(option: ComboboxOption): void {
    const currentSelected = this.store.selectedValues();
    const isSelected = currentSelected.includes(option.value);

    if (isSelected) {
      this.store.setSelectedValues(currentSelected.filter((v) => v !== option.value));

      return;
    }

    this.store.setSelectedValues([...currentSelected, option.value]);
  }

  protected loadFruitsOnly(): void {
    const fruitsOnly = fruitOptions.filter((opt) => opt.groupLabel === 'Fruits');
    this.store.setOptions(fruitsOnly);
  }

  protected loadVegetablesOnly(): void {
    const vegetablesOnly = fruitOptions.filter((opt) => opt.groupLabel === 'Vegetables');
    this.store.setOptions(vegetablesOnly);
  }

  protected loadAllOptions(): void {
    this.store.setOptions(fruitOptions);
  }

  protected addRandomOption(): void {
    const newOption: ComboboxOptionInput = {
      label: `Random Item ${this._randomCounter}`,
      value: `random-${this._randomCounter}`,
      groupLabel: 'Random',
    };

    this._randomCounter++;

    const currentOptions = this.store.options();
    this.store.setOptions([...currentOptions, newOption]);
  }

  protected getSelectedOptionsJson(): string {
    return JSON.stringify(this.store.selectedOptions(), null, 2);
  }
}

@Component({
  selector: 'story-combobox-store-opened-state-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Input, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [ComboboxStore],
  template: `
    <org-storybook-example-container
      title="Opened State Management"
      [currentState]="'Combobox is ' + (store.isOpened() ? 'opened' : 'closed')"
    >
      <org-storybook-example-container-section label="Combobox Dropdown">
        <div class="max-w-lg">
          <org-input
            name="combobox-store-opened-state-demo-input"
            [value]="store.inputValue()"
            (input)="inputChange($event)"
            (click)="store.open()"
            placeholder="Click to open or type to filter..."
          />

          @if (store.isOpened()) {
            <div class="mt-2 flex flex-col gap-2 max-h-2xs overflow-y-auto border rounded p-2 bg-white shadow-lg">
              @if (store.filteredOptions().length === 0) {
                <div class="text-sm text-neutral-text-subtle p-2">No options available</div>
              }
              @for (option of store.filteredOptions(); track option.value) {
                <button
                  class="px-3 py-2 text-sm text-left border rounded cursor-pointer hover:bg-neutral-background-subtle"
                  [class.bg-info-background-subtle]="store.selectedValues().includes(option.value)"
                  (click)="selectOption(option)"
                >
                  {{ option.label }}
                </button>
              }
            </div>
          }
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (click)="store.open()">Open</org-button>
          <org-button color="primary" size="sm" (click)="store.close()">Close</org-button>
          <org-button color="primary" size="sm" (click)="store.toggle()">Toggle</org-button>
          <org-button color="secondary" size="sm" (click)="store.setIsOpened(true)">Set Opened (true)</org-button>
          <org-button color="secondary" size="sm" (click)="store.setIsOpened(false)">Set Opened (false)</org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Is Opened:</strong> {{ store.isOpened() }}</div>
          <div><strong>Selected Value:</strong> {{ store.selectedValues()[0] ?? 'None' }}</div>
          <div><strong>Input Value:</strong> "{{ store.inputValue() }}"</div>
          <div><strong>Event Log:</strong></div>
          <div class="text-xs bg-neutral-background-subtle p-2 rounded border max-h-8xs overflow-y-auto">
            @for (event of _eventLog(); track $index) {
              <div>{{ event }}</div>
            }
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Combobox tracks opened/closed state</li>
        <li>Provides open(), close(), toggle() convenience methods</li>
        <li>Emits isOpenedChanged$ events when state changes</li>
        <li>Dropdown visibility controlled by isOpened state</li>
        <li>Can be opened by clicking input or programmatically</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxStoreOpenedStateDemo {
  protected readonly store = inject(ComboboxStore);
  protected readonly _eventLog = signal<string[]>([]);

  constructor() {
    this.store.initialize(fruitOptions, {
      isMultiSelect: false,
      optionFilter: (inputValue, option) => option.label.toLowerCase().includes(inputValue.toLowerCase()),
    });

    // track opened state changes
    this.store.isOpenedChanged$.subscribe((isOpened) => {
      this._eventLog.update((log) => [
        `${new Date().toLocaleTimeString()}: isOpened = ${isOpened}`,
        ...log.slice(0, 9),
      ]);
    });
  }

  protected inputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.setInputValue(input.value);
    this.store.open();
  }

  protected selectOption(option: ComboboxOption): void {
    if (!option.disabled) {
      this.store.setSelectedValues([option.value]);
      this.store.close();
    }
  }
}

@Component({
  selector: 'story-combobox-store-default-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [ComboboxStore],
  template: `
    <org-storybook-example-container title="Default" [currentState]="'Options: ' + store.options().length">
      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Selected Values:</strong> {{ store.selectedValues().join(', ') || 'None' }}</div>
          <div><strong>Input Value:</strong> "{{ store.inputValue() }}"</div>
          <div><strong>Is Opened:</strong> {{ store.isOpened() }}</div>
          <div><strong>Options Count:</strong> {{ store.options().length }}</div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="store.open()">Open</org-button>
          <org-button color="primary" size="sm" (clicked)="store.close()">Close</org-button>
          <org-button color="secondary" size="sm" (clicked)="store.setSelectedValues([])">Clear</org-button>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Store initialized with basic options</li>
        <li>Tracks selected values, input value, and opened state</li>
        <li>Use open/close to control dropdown state</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxStoreDefaultDemo {
  protected readonly store = inject(ComboboxStore);

  constructor() {
    this.store.initialize(simpleOptions, {
      isMultiSelect: false,
    });
  }
}

const meta: Meta<ComboboxStore> = {
  title: 'Core/Services/Combobox Store',
  component: ComboboxStore,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## ComboboxStore Service

  A signal-based state management service for handling combobox/autocomplete functionality in Angular applications, supporting both single and multi-select modes with advanced features like filtering, grouping, and keyboard navigation.

  ### Features
  - Signal-based reactive state management
  - Single and multi-select modes (switchable at runtime)
  - Option filtering
  - Grouped options with alpha sorting
  - Keyboard navigation with focus management
  - Support for creating new options
  - Event streams for state changes
  - Immutable state updates
  - Not provided in root - must be manually provided

  ### State Properties
  - **options**: All available options (readonly, sorted alphabetically)
  - **selectedValues**: Array of selected values (always an array, even for single select)
  - **selectedOptions**: Full option objects for selected values (includes synthetic options for new values)
  - **inputValue**: Current input text value
  - **focusedOption**: Currently focused option for keyboard navigation
  - **filteredOptions**: Options after applying filters
  - **groupedOptions**: Options organized by group
  - **filteredGroupedOptions**: Filtered options organized by group
  - **isMultiSelect**: Whether multi-select is enabled
  - **allowNewOptions**: Whether new options can be created
  - **isOpened**: Whether the combobox is currently opened
  - **config**: Full configuration object

  ### Core Methods

  #### Initialization
  - **initialize(options, config)**: Initialize store with options and configuration

  #### Option Management
  - **setOptions(options)**: Update options, maintaining valid selections
  - **getOptionByValue(value)**: Get option object by its value

  #### Selection
  - **setSelectedValues(values)**: Set selected values (validates and enforces single/multi mode)

  #### Input
  - **setInputValue(value)**: Set input text value
  - **clearInputValue()**: Clear input text

  #### Focus Navigation
  - **setFocusedOption(option)**: Set focused option
  - **getFocusedOptionIndex()**: Get index in filtered list
  - **getFocusedOptionGroupIndex()**: Get group and option indices
  - **focusNext()**: Focus next option in flat list
  - **focusPrevious()**: Focus previous option in flat list
  - **focusFirst()**: Focus first option in flat list
  - **focusLast()**: Focus last option in flat list
  - **groupFocusNext()**: Focus next option respecting groups
  - **groupFocusPrevious()**: Focus previous option respecting groups
  - **groupFocusFirst()**: Focus first option in grouped view
  - **groupFocusLast()**: Focus last option in grouped view

  #### Configuration
  - **setConfig(config)**: Update full or partial configuration
  - **setIsMultiSelect(value)**: Toggle single/multi-select mode
  - **setAllowNewOptions(value)**: Enable/disable creating new options
  - **setFilterSelectedOptions(value)**: Enable/disable filtering out selected options
  - **setOptionFilter(filter)**: Set custom filter function

  #### Opened State
  - **setIsOpened(value)**: Set opened state
  - **open()**: Open the combobox
  - **close()**: Close the combobox
  - **toggle()**: Toggle opened state

  ### Event Streams (RxJS Observables)
  - **inputValueChanged$**: Emits when input value changes
  - **selectedValuesChanged$**: Emits when selected values change
  - **focusedOptionChanged$**: Emits when focused option changes
  - **isOpenedChanged$**: Emits when opened state changes

  ### Configuration Options
  \`\`\`typescript
  type ComboboxConfig = {
    isMultiSelect: boolean;              // single vs multi-select mode
    allowNewOptions: boolean;            // allow creating new options
    filterSelectedOptions: boolean;      // hide selected options from list
    optionFilter: ((inputValue: string, option: ComboboxOption) => boolean) | null;
  };
  \`\`\`

  ### Option Structure
  \`\`\`typescript
  type ComboboxOption = {
    label: string;                       // display text
    value: string | number;              // unique identifier
    disabled: boolean;                   // whether selectable (default: false)
    groupLabel: string;                  // group name (default: 'Uncategorized')
    isNew?: boolean;                     // indicates synthetic option for new value
  };
  \`\`\`

  ### Usage Example

  #### Step 1: Provide the Store
  \`\`\`typescript
  @Component({
    selector: 'app-my-combobox',
    providers: [ComboboxStore],  // provide at component level
  })
  export class MyComboboxComponent {
    private readonly comboboxStore = inject(ComboboxStore);

    constructor() {
      // initialize with options and config
      this.comboboxStore.initialize(
        [
          { label: 'Apple', value: 1, groupLabel: 'Fruits' },
          { label: 'Banana', value: 2, groupLabel: 'Fruits' },
          { label: 'Carrot', value: 3, groupLabel: 'Vegetables' },
        ],
        {
          isMultiSelect: false,
          allowNewOptions: false,
          filterSelectedOptions: true,
          optionFilter: (inputValue, option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase()),
        }
      );
    }
  }
  \`\`\`

  #### Step 2: Use in Template
  \`\`\`typescript
  // subscribe to events
  this.comboboxStore.selectedValuesChanged$.subscribe(values => {
    console.log('Selection changed:', values);
  });

  // handle input
  inputChange(value: string) {
    this.comboboxStore.setInputValue(value);
  }

  // handle selection
  onOptionClick(option: ComboboxOption) {
    this.comboboxStore.setSelectedValues([option.value]);
  }

  // keyboard navigation
  onArrowDown() {
    this.comboboxStore.focusNext();
  }

  onArrowUp() {
    this.comboboxStore.focusPrevious();
  }

  onEnter() {
    const focused = this.comboboxStore.focusedOption();
    if (focused) {
      this.comboboxStore.setSelectedValues([focused.value]);
    }
  }
  \`\`\`

  ### Single vs Multi-Select Behavior

  **Single Select:**
  - Only one value can be selected
  - Setting multiple values logs error and uses first value only
  - Input value updates to show selected option label
  - Switching to multi-select keeps first selected value

  **Multi-Select:**
  - Multiple values can be selected
  - Input value clears when selection changes
  - Can toggle individual selections
  - Switching to single-select keeps only first value

  ### New Options Feature

  When \`allowNewOptions\` is enabled:
  - Values not in options list can be selected
  - \`selectedOptions\` includes synthetic options with \`isNew: true\`
  - Useful for tag/chip inputs where users create custom values
  - New options use value as label and 'Uncategorized' group

  ### Filtering Behavior

  **Internal Filtering:**
  - \`filterSelectedOptions\`: Hides selected options from the list
  - Useful to prevent re-selecting already selected items

  **Option Filtering:**
  - Custom filter function: \`(inputValue, option) => boolean\`
  - Applied to options based on input value
  - Common use: text search/autocomplete
  - Can be changed at runtime

  ### Grouping

  - Options automatically grouped by \`groupLabel\`
  - Groups sorted alphabetically
  - Options within groups sorted alphabetically
  - Access via \`groupedOptions\` or \`filteredGroupedOptions\`
  - Group-aware focus navigation available

  ### Why Not Provided in Root?

  This store is designed to be provided at the component level because:
  - Each combobox instance needs its own independent state
  - Multiple comboboxes can coexist without interference
  - Better for testing with isolated instances
  - Clearer component-level dependency injection
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ComboboxStore>;

export const Default: Story = {
  render: () => ({
    template: '<story-combobox-store-default-demo />',
    moduleMetadata: {
      imports: [ComboboxStoreDefaultDemo],
    },
  }),
};

export const SingleSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo of single-select combobox with filtering and focus navigation. Only one option can be selected at a time, and the input updates to show the selected option label.',
      },
    },
  },
  render: () => ({
    template: `<story-combobox-store-single-select-demo />`,
    moduleMetadata: {
      imports: [ComboboxStoreSingleSelectDemo],
    },
  }),
};

export const MultiSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo of multi-select combobox with new option creation. Multiple options can be selected, shown as removable chips. Type a new value and press Enter to create a new option.',
      },
    },
  },
  render: () => ({
    template: `<story-combobox-store-multi-select-demo />`,
    moduleMetadata: {
      imports: [ComboboxStoreMultiSelectDemo],
    },
  }),
};

export const GroupedOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demo of grouped options with group-aware focus navigation. Options are organized by categories and sorted alphabetically within groups. Focus navigation respects group boundaries.',
      },
    },
  },
  render: () => ({
    template: `<story-combobox-store-grouped-demo />`,
    moduleMetadata: {
      imports: [ComboboxStoreGroupedDemo],
    },
  }),
};

export const DynamicOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demo of dynamic option management. Options can be updated at runtime, and the store maintains existing selections when possible. Shows how selections are preserved or cleared based on option availability.',
      },
    },
  },
  render: () => ({
    template: `<story-combobox-store-dynamic-options-demo />`,
    moduleMetadata: {
      imports: [ComboboxStoreDynamicOptionsDemo],
    },
  }),
};

export const OpenedState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demo of opened state management. The store tracks whether the combobox is opened or closed, providing methods like open(), close(), and toggle(). The isOpenedChanged$ observable emits events when the state changes.',
      },
    },
  },
  render: () => ({
    template: `<story-combobox-store-opened-state-demo />`,
    moduleMetadata: {
      imports: [ComboboxStoreOpenedStateDemo],
    },
  }),
};
