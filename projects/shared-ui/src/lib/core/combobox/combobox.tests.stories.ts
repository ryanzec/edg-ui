import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Combobox } from './combobox';
import type { ComboboxOption, ComboboxOptionInput } from '../combobox-store/combobox-store';

const simpleOptions: ComboboxOptionInput[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange', value: 'orange' },
];

const groupedOptions: ComboboxOptionInput[] = [
  { label: 'Apple', value: 'apple', groupLabel: 'Fruits' },
  { label: 'Banana', value: 'banana', groupLabel: 'Fruits' },
  { label: 'Carrot', value: 'carrot', groupLabel: 'Vegetables' },
  { label: 'Tomato', value: 'tomato', groupLabel: 'Vegetables' },
];

const disabledMixOptions: ComboboxOptionInput[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana', disabled: true },
  { label: 'Cherry', value: 'cherry' },
];

const startsWithFilter = (inputValue: string, option: ComboboxOption): boolean =>
  option.label.toLowerCase().startsWith(inputValue.toLowerCase());

/** queries the cdk overlay panel content for a given combobox. overlays render outside the canvas. */
const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-combobox-overlay');

@Component({
  selector: 'story-combobox-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .combobox-wrapper {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <div class="combobox-wrapper">
      <org-combobox
        data-testid="combobox"
        #comboboxComponent
        [name]="name()"
        [options]="options()"
        [placeholder]="placeholder()"
        [isMultiSelect]="isMultiSelect()"
        [autoShowOption]="autoShowOption()"
        [allowNewOptions]="allowNewOptions()"
        [isGroupingEnabled]="isGroupingEnabled()"
        [filterSelectedOptions]="filterSelectedOptions()"
        [disabled]="disabled()"
        [containerClass]="containerClass()"
        [optionFilter]="optionFilter()"
        (selectedValuesChanged)="onSelectedValuesChanged($event)"
        (inputValueChanged)="onInputValueChanged($event)"
        (focusedOptionChanged)="onFocusedOptionChanged($event)"
        (isOpenedChanged)="onIsOpenedChanged($event)"
        (focused)="onFocused()"
        (blurred)="onBlurred()"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-multi-on" (click)="isMultiSelect.set(true)">multi-on</button>
      <button type="button" data-testid="ctl-multi-off" (click)="isMultiSelect.set(false)">multi-off</button>
      <button type="button" data-testid="ctl-auto-show-off" (click)="autoShowOption.set(false)">auto-show-off</button>
      <button type="button" data-testid="ctl-auto-show-on" (click)="autoShowOption.set(true)">auto-show-on</button>
      <button type="button" data-testid="ctl-allow-new-on" (click)="allowNewOptions.set(true)">allow-new-on</button>
      <button type="button" data-testid="ctl-grouping-on" (click)="isGroupingEnabled.set(true)">grouping-on</button>
      <button type="button" data-testid="ctl-filter-selected-on" (click)="filterSelectedOptions.set(true)">
        filter-selected-on
      </button>
      <button type="button" data-testid="ctl-filter-selected-off" (click)="filterSelectedOptions.set(false)">
        filter-selected-off
      </button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-container-class-extra" (click)="containerClass.set('custom-container')">
        container-class-extra
      </button>
      <button type="button" data-testid="ctl-options-grouped" (click)="useGroupedOptions()">options-grouped</button>
      <button type="button" data-testid="ctl-options-disabled-mix" (click)="useDisabledMixOptions()">
        options-disabled-mix
      </button>
      <button type="button" data-testid="ctl-options-empty" (click)="options.set([])">options-empty</button>
      <button type="button" data-testid="ctl-filter-starts-with" (click)="optionFilter.set(startsWithFilter)">
        filter-starts-with
      </button>
      <button type="button" data-testid="ctl-filter-clear" (click)="optionFilter.set(undefined)">filter-clear</button>
      <button type="button" data-testid="ctl-api-open" (click)="comboboxComponent.open()">api-open</button>
      <button type="button" data-testid="ctl-api-close" (click)="comboboxComponent.close()">api-close</button>
      <button type="button" data-testid="ctl-api-set-apple" (click)="comboboxComponent.setSelectedOptions(['apple'])">
        api-set-apple
      </button>
      <button
        type="button"
        data-testid="ctl-api-set-apple-banana"
        (click)="comboboxComponent.setSelectedOptions(['apple', 'banana'])"
      >
        api-set-apple-banana
      </button>
      <button type="button" data-testid="ctl-api-clear" (click)="comboboxComponent.setSelectedOptions([])">
        api-clear
      </button>
    </div>
  `,
})
class StoryComboboxTestsShell {
  protected readonly startsWithFilter = startsWithFilter;

  protected readonly name = signal<string>('test-combobox');
  protected readonly options = signal<ComboboxOptionInput[]>(simpleOptions);
  protected readonly placeholder = signal<string>('Select...');
  protected readonly isMultiSelect = signal<boolean>(false);
  protected readonly autoShowOption = signal<boolean>(true);
  protected readonly allowNewOptions = signal<boolean>(false);
  protected readonly isGroupingEnabled = signal<boolean>(false);
  protected readonly filterSelectedOptions = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);
  protected readonly containerClass = signal<string>('');
  protected readonly optionFilter = signal<((inputValue: string, option: ComboboxOption) => boolean) | undefined>(
    undefined
  );

  protected readonly lastSelectedValues = signal<(string | number)[]>([]);
  protected readonly lastInputValue = signal<string>('');
  protected readonly lastFocusedValue = signal<string>('none');
  protected readonly lastIsOpened = signal<boolean>(false);
  protected readonly focusedCount = signal<number>(0);
  protected readonly blurredCount = signal<number>(0);
  protected readonly selectedValuesChangedCount = signal<number>(0);
  protected readonly inputValueChangedCount = signal<number>(0);
  protected readonly focusedOptionChangedCount = signal<number>(0);
  protected readonly isOpenedChangedCount = signal<number>(0);

  protected readout(): string {
    return [
      `selectedValues=[${this.lastSelectedValues().join(',')}]`,
      `inputValue="${this.lastInputValue()}"`,
      `focusedValue=${this.lastFocusedValue()}`,
      `isOpened=${this.lastIsOpened()}`,
      `selectedValuesChangedCount=${this.selectedValuesChangedCount()}`,
      `inputValueChangedCount=${this.inputValueChangedCount()}`,
      `focusedOptionChangedCount=${this.focusedOptionChangedCount()}`,
      `isOpenedChangedCount=${this.isOpenedChangedCount()}`,
      `focusedCount=${this.focusedCount()}`,
      `blurredCount=${this.blurredCount()}`,
    ].join(' ');
  }

  protected useGroupedOptions(): void {
    this.options.set(groupedOptions);
  }

  protected useDisabledMixOptions(): void {
    this.options.set(disabledMixOptions);
  }

  protected onSelectedValuesChanged(values: (string | number)[]): void {
    this.lastSelectedValues.set(values);
    this.selectedValuesChangedCount.update((value) => value + 1);
  }

  protected onInputValueChanged(value: string): void {
    this.lastInputValue.set(value);
    this.inputValueChangedCount.update((value) => value + 1);
  }

  protected onFocusedOptionChanged(option: ComboboxOption | null): void {
    this.lastFocusedValue.set(option ? String(option.value) : 'none');
    this.focusedOptionChangedCount.update((value) => value + 1);
  }

  protected onIsOpenedChanged(isOpened: boolean): void {
    this.lastIsOpened.set(isOpened);
    this.isOpenedChangedCount.update((value) => value + 1);
  }

  protected onFocused(): void {
    this.focusedCount.update((value) => value + 1);
  }

  protected onBlurred(): void {
    this.blurredCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-combobox-reactive-form-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, ReactiveFormsModule],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .combobox-wrapper {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <div class="combobox-wrapper">
      <org-combobox
        data-testid="combobox"
        name="reactive-form-combobox"
        [formControl]="formControl"
        [options]="options"
        [isMultiSelect]="true"
        placeholder="Pick fruits..."
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-form-set-apple" (click)="formControl.setValue(['apple'])">
        form-set-apple
      </button>
      <button type="button" data-testid="ctl-form-set-apple-banana" (click)="formControl.setValue(['apple', 'banana'])">
        form-set-apple-banana
      </button>
      <button type="button" data-testid="ctl-form-clear" (click)="formControl.setValue([])">form-clear</button>
      <button type="button" data-testid="ctl-form-disable" (click)="formControl.disable()">form-disable</button>
      <button type="button" data-testid="ctl-form-enable" (click)="formControl.enable()">form-enable</button>
    </div>
  `,
})
class StoryComboboxReactiveFormShell {
  protected readonly options = simpleOptions;
  protected readonly formControl = new FormControl<(string | number)[]>([], { nonNullable: true });

  /**
   * subscribes to every form-control event (value / status / touched / pristine) so OnPush change detection
   * re-runs the readout after the cva chain finishes pushing into the formControl. without this, marking the
   * shell via the combobox's selectedValuesChanged output races ahead of the cva _onChange callback and the
   * readout reads stale formControl.value
   */
  private readonly _formEvents = toSignal(this.formControl.events, { initialValue: null });

  protected readout(): string {
    this._formEvents();

    return [
      `value=[${this.formControl.value.join(',')}]`,
      `disabled=${this.formControl.disabled}`,
      `touched=${this.formControl.touched}`,
      `dirty=${this.formControl.dirty}`,
    ].join(' ');
  }
}

const meta: Meta = {
  title: 'Core/Components/Combobox/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-combobox-tests-shell />`,
  moduleMetadata: { imports: [StoryComboboxTestsShell] },
});

const renderReactiveShell: Story['render'] = () => ({
  template: `<story-combobox-reactive-form-shell />`,
  moduleMetadata: { imports: [StoryComboboxReactiveFormShell] },
});

/** focuses the trigger input inside the combobox to open the panel via auto-show. */
const focusComboboxInput = async (host: HTMLElement): Promise<HTMLInputElement> => {
  const nativeInput = host.querySelector('input.native') as HTMLInputElement;
  nativeInput.focus();

  return nativeInput;
};

/** waits for the overlay panel and returns its root element. */
const waitForOverlayPanel = async (): Promise<HTMLElement> => {
  await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

  return queryOverlayPanel() as HTMLElement;
};

// host data-attributes

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await expect(host.getAttribute('data-auto-show-option')).toBe('');
    await expect(host.getAttribute('data-allow-new-options')).toBeNull();
    await expect(host.getAttribute('data-is-multi-select')).toBeNull();
    await expect(host.getAttribute('data-filter-selected-options')).toBeNull();
    await expect(host.getAttribute('data-is-grouping-enabled')).toBeNull();
  },
};

export const ReflectsFilteredOptionsHostAttributeWhenOptionsExist: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await expect(host.getAttribute('data-filtered-options')).toBe('');
  },
};

export const ReflectsFilteredOptionsHostAttributeNullWhenEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-options-empty'));

    await waitFor(() => expect(host.getAttribute('data-filtered-options')).toBeNull());
  },
};

export const ReflectsAllowNewOptionsHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-allow-new-on'));

    await waitFor(() => expect(host.getAttribute('data-allow-new-options')).toBe(''));
  },
};

export const ReflectsIsMultiSelectHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));

    await waitFor(() => expect(host.getAttribute('data-is-multi-select')).toBe(''));
  },
};

export const ReflectsFilterSelectedOptionsHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-filter-selected-on'));

    await waitFor(() => expect(host.getAttribute('data-filter-selected-options')).toBe(''));
  },
};

export const ReflectsIsGroupingEnabledHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-grouping-on'));

    await waitFor(() => expect(host.getAttribute('data-is-grouping-enabled')).toBe(''));
  },
};

// trigger / input rendering

export const RendersPlaceholderOnInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.placeholder).toBe('Select...');
  },
};

export const RendersDisabledInputWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.disabled).toBe(true);
    });
  },
};

export const SingleSelectStampsSelectedLabelIntoInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-api-set-apple'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe('Apple');
    });
  },
};

export const RendersInlineChipsForSelectedValuesInMultiSelect: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple-banana'));

    await waitFor(() => {
      const chips = host.querySelectorAll('org-tag');

      expect(chips.length).toBe(2);
      expect(chips[0].textContent?.trim()).toBe('Apple');
      expect(chips[1].textContent?.trim()).toBe('Banana');
    });
  },
};

// opening / closing

export const OpensPanelOnInputFocusWhenAutoShowOptionIsOn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);

    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
  },
};

export const DoesNotOpenPanelOnFocusWhenAutoShowOptionIsOff: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-auto-show-off'));
    await focusComboboxInput(host);

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    await expect(readout.textContent).toContain('isOpened=false');
  },
};

export const OpensPanelOnInputClickEvenWhenAutoShowIsOff: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-auto-show-off'));

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    await userEvent.click(nativeInput);

    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
  },
};

export const OpensPanelOnArrowDownWhenClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-auto-show-off'));

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    nativeInput.focus();
    await userEvent.keyboard('{ArrowDown}');

    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
  },
};

export const OpensPanelOnArrowUpWhenClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-auto-show-off'));

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    nativeInput.focus();
    await userEvent.keyboard('{ArrowUp}');

    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
  },
};

export const ClosesPanelOnEscapeWhenOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

    nativeInput.focus();
    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
  },
};

export const ClosesPanelOnTabWhenOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

    nativeInput.focus();
    await userEvent.keyboard('{Tab}');

    await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
  },
};

export const ClosesPanelOnBlur: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

    nativeInput.blur();

    await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
  },
};

// option rendering

export const RendersAllOptionsInPanelWhenOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await focusComboboxInput(host);

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const options = panel.querySelectorAll('org-combobox-option');

      expect(options.length).toBe(simpleOptions.length);
    });
  },
};

export const RendersGroupedOptionsWhenIsGroupingEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-options-grouped'));
    await userEvent.click(canvas.getByTestId('ctl-grouping-on'));
    await focusComboboxInput(host);

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const groups = panel.querySelectorAll('.combobox-group');

      expect(groups.length).toBe(2);
      expect(groups[0].querySelector('.combobox-group-label')?.textContent?.trim()).toBe('Fruits');
      expect(groups[1].querySelector('.combobox-group-label')?.textContent?.trim()).toBe('Vegetables');
    });
  },
};

export const RendersEmptyMessageWhenNoOptions: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-options-empty'));
    await focusComboboxInput(host);

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const empty = panel.querySelector('.combobox-empty');

      expect(empty?.textContent?.trim()).toBe('No options available');
    });
  },
};

export const RendersNewOptionSuggestionWithAddPrefixWhenAllowNewOptionsAndTypedValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-allow-new-on'));

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'Zucchini');

    await waitFor(() => {
      const panel = queryOverlayPanel() as HTMLElement;
      const newOption = panel.querySelector('[data-option-value="Zucchini"]');

      expect(newOption?.textContent?.trim()).toBe('Add "Zucchini"');
    });
  },
};

export const DoesNotRenderNewOptionSuggestionWhenTypedValueExactlyMatchesExistingOption: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-allow-new-on'));

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'Apple');

    await waitFor(() => {
      const panel = queryOverlayPanel() as HTMLElement;
      const options = panel.querySelectorAll('org-combobox-option');

      expect(options.length).toBe(1);
      expect(options[0].getAttribute('data-option-value')).toBe('apple');
    });
  },
};

// filtering

export const TypingFiltersOptionsByLabelSubstring: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'an');

    await waitFor(() => {
      const panel = queryOverlayPanel() as HTMLElement;
      const options = panel.querySelectorAll('org-combobox-option');
      const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

      // "Banana", "Mango", "Orange" all contain "an" (case-insensitive)
      expect(values).toEqual(['banana', 'mango', 'orange']);
    });
  },
};

export const ClearingInputRestoresAllOptions: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'an');

    await waitFor(() => {
      const panel = queryOverlayPanel() as HTMLElement;

      expect(panel.querySelectorAll('org-combobox-option').length).toBe(3);
    });

    await userEvent.clear(nativeInput);

    await waitFor(() => {
      const panel = queryOverlayPanel() as HTMLElement;

      expect(panel.querySelectorAll('org-combobox-option').length).toBe(simpleOptions.length);
    });
  },
};

export const CustomOptionFilterReplacesDefaultFilter: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-filter-starts-with'));

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'a');

    await waitFor(() => {
      const panel = queryOverlayPanel() as HTMLElement;
      const options = panel.querySelectorAll('org-combobox-option');
      const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

      // starts-with "a" → only Apple (not Banana / Mango / Orange which contain "a")
      expect(values).toEqual(['apple']);
    });
  },
};

export const FilterSelectedOptionsTrueHidesAlreadySelectedInPanel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-filter-selected-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple'));

    await focusComboboxInput(host);

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const options = panel.querySelectorAll('org-combobox-option');
      const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

      expect(values).not.toContain('apple');
      expect(values.length).toBe(simpleOptions.length - 1);
    });
  },
};

export const FilterSelectedOptionsFalseKeepsAlreadySelectedInPanel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    // shell default is already filterSelectedOptions=false; this is explicit for clarity
    await userEvent.click(canvas.getByTestId('ctl-filter-selected-off'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple'));

    await focusComboboxInput(host);

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const options = panel.querySelectorAll('org-combobox-option');
      const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

      expect(values).toContain('apple');
      expect(values.length).toBe(simpleOptions.length);
    });
  },
};

export const FilterCombinesWithFilterSelectedOptions: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-filter-selected-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple-banana'));

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'an');

    await waitFor(() => {
      const panel = queryOverlayPanel() as HTMLElement;
      const options = panel.querySelectorAll('org-combobox-option');
      const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

      // "an" substring would match banana / mango / orange — banana already selected, so only mango + orange
      expect(values).toEqual(['mango', 'orange']);
    });
  },
};

export const FilterSelectedDefaultIsFalseForComponent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple'));

    await focusComboboxInput(host);

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const options = panel.querySelectorAll('org-combobox-option');
      const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

      expect(values).toContain('apple');
    });
  },
};

export const TypingAutoOpensPanelWhenClosedAndAutoShowOptionIsOn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    // start with auto-show off so the focus does not open the panel
    await userEvent.click(canvas.getByTestId('ctl-auto-show-off'));

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    nativeInput.focus();

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    await expect(readout.textContent).toContain('isOpened=false');

    // flip auto-show back on so the typing handler can auto-open
    await userEvent.click(canvas.getByTestId('ctl-auto-show-on'));
    nativeInput.focus();
    await userEvent.type(nativeInput, 'a');

    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
  },
};

// selection (mouse)

export const MouseDownOnOptionSelectsItInSingleSelect: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
    await userEvent.click(appleOption);

    await waitFor(() => {
      expect(readout.textContent).toContain('selectedValues=[apple]');
      expect(readout.textContent).toContain('isOpened=false');
    });

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe('Apple');
    });
  },
};

export const MouseDownOnOptionAddsToSelectionInMultiSelect: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
    await userEvent.click(appleOption);

    await waitFor(() => {
      expect(readout.textContent).toContain('selectedValues=[apple]');
      expect(readout.textContent).toContain('isOpened=true');
    });

    const bananaOption = panel.querySelector('[data-option-value="banana"]') as HTMLElement;
    await userEvent.click(bananaOption);

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple,banana]'));
  },
};

export const MouseDownOnDisabledOptionDoesNotSelect: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-options-disabled-mix'));
    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const bananaOption = panel.querySelector('[data-option-value="banana"]') as HTMLElement;

    await waitFor(() => expect(bananaOption.getAttribute('aria-disabled')).toBe('true'));

    // userEvent.click does pointer hit-testing and refuses to interact with elements that have
    // pointer-events: none (which the css applies to disabled options). fireEvent.mouseDown
    // dispatches the event directly so we can verify the brain's disabled guard works.
    fireEvent.mouseDown(bananaOption);

    await expect(readout.textContent).toContain('selectedValues=[]');
  },
};

export const MouseEnterOnOptionSetsFocusedOption: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const cherryOption = panel.querySelector('[data-option-value="cherry"]') as HTMLElement;
    await userEvent.hover(cherryOption);

    await waitFor(() => expect(readout.textContent).toContain('focusedValue=cherry'));
  },
};

export const MouseLeaveOnOptionClearsFocusedOption: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const cherryOption = panel.querySelector('[data-option-value="cherry"]') as HTMLElement;
    await userEvent.hover(cherryOption);

    await waitFor(() => expect(readout.textContent).toContain('focusedValue=cherry'));

    await userEvent.unhover(cherryOption);

    await waitFor(() => expect(readout.textContent).toContain('focusedValue=none'));
  },
};

// selection (keyboard)

export const EnterSelectsFocusedOption: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));

    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple]'));
  },
};

export const EnterSelectsNewOptionSuggestionWhenAllowNewOptionsAndNoFocusedOption: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-new-on'));

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'Zucchini');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[Zucchini]'));
  },
};

export const ArrowDownFocusesFirstThenNext: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=banana'));
  },
};

export const ArrowUpFocusesLastThenPrevious: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=orange'));

    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=mango'));
  },
};

export const HomeFocusesFirst: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=orange'));

    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));
  },
};

export const EndFocusesLast: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{End}');

    await waitFor(() => expect(readout.textContent).toContain('focusedValue=orange'));
  },
};

export const ArrowDownInGroupingFocusesFirstOptionOfFirstGroup: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-options-grouped'));
    await userEvent.click(canvas.getByTestId('ctl-grouping-on'));

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{ArrowDown}');

    // grouped options sort by group label, then by option label inside the group → first is "Apple" in "Fruits"
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout.textContent).toContain('focusedValue=banana'));
  },
};

export const EscapeOnSecondPressBlursInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

    nativeInput.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
    await expect(readout.textContent).toContain('blurredCount=0');

    nativeInput.focus();
    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
  },
};

// multi-select chip remove

export const RemovingInlineChipDeselectsValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple-banana'));

    await waitFor(() => expect(host.querySelectorAll('org-tag').length).toBe(2));

    const removeButtons = host.querySelectorAll('org-tag .tag-remove');
    await userEvent.click(removeButtons[0] as HTMLElement);

    await waitFor(() => {
      expect(readout.textContent).toContain('selectedValues=[banana]');
      expect(host.querySelectorAll('org-tag').length).toBe(1);
    });
  },
};

// output events

export const EmitsSelectedValuesChangedOnSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
    await userEvent.click(appleOption);

    await waitFor(() => expect(readout.textContent).toContain('selectedValuesChangedCount=1'));
  },
};

export const EmitsInputValueChangedOnTyping: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    await userEvent.type(nativeInput, 'ab');

    await waitFor(() => {
      expect(readout.textContent).toContain('inputValue="ab"');
      expect(readout.textContent).toContain('inputValueChangedCount=2');
    });
  },
};

export const EmitsFocusedOptionChangedOnHover: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
    await userEvent.hover(appleOption);

    await waitFor(() => expect(readout.textContent).toContain('focusedOptionChangedCount=1'));
  },
};

export const EmitsIsOpenedChangedOnOpenAndClose: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitFor(() => expect(readout.textContent).toContain('isOpenedChangedCount=1'));

    nativeInput.blur();

    await waitFor(() => expect(readout.textContent).toContain('isOpenedChangedCount=2'));
  },
};

export const EmitsFocusedOnInputFocus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
  },
};

export const EmitsBlurredOnInputBlur: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = await focusComboboxInput(host);
    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

    nativeInput.blur();

    await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
  },
};

// a11y attributes on input

export const AppliesAriaExpandedReflectingOpenState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.getAttribute('aria-expanded')).toBe('false');

    await focusComboboxInput(host);
    await waitForOverlayPanel();

    await waitFor(() => expect(nativeInput.getAttribute('aria-expanded')).toBe('true'));
  },
};

export const AppliesStaticAriaAttributesAndRoleCombobox: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.getAttribute('role')).toBe('combobox');
    await expect(nativeInput.getAttribute('aria-haspopup')).toBe('listbox');
    await expect(nativeInput.getAttribute('aria-autocomplete')).toBe('list');
    await expect(nativeInput.getAttribute('aria-controls')).toBe('combobox-listbox-test-combobox');
  },
};

export const AppliesAriaActivedescendantWhenOptionIsFocused: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{ArrowDown}');

    await waitFor(() => expect(nativeInput.getAttribute('aria-activedescendant')).toBe('org-combobox-option-apple'));
  },
};

// option a11y

export const OptionHasRoleOptionAndAriaSelectedFalseByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const appleOption = panel.querySelector('[data-option-value="apple"]');

      expect(appleOption?.getAttribute('role')).toBe('option');
      expect(appleOption?.getAttribute('aria-selected')).toBe('false');
    });
  },
};

export const OptionAriaSelectedReflectsSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple'));

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const appleOption = panel.querySelector('[data-option-value="apple"]');

      expect(appleOption?.getAttribute('aria-selected')).toBe('true');
    });
  },
};

export const OptionAriaDisabledReflectsDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-options-disabled-mix'));

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const bananaOption = panel.querySelector('[data-option-value="banana"]');
      const appleOption = panel.querySelector('[data-option-value="apple"]');

      expect(bananaOption?.getAttribute('aria-disabled')).toBe('true');
      expect(appleOption?.getAttribute('aria-disabled')).toBeNull();
    });
  },
};

export const OptionDataActiveReflectsFocused: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    const nativeInput = await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    nativeInput.focus();
    await userEvent.keyboard('{ArrowDown}');

    await waitFor(() => {
      const appleOption = panel.querySelector('[data-option-value="apple"]');

      expect(appleOption?.getAttribute('data-active')).toBe('1');
    });
  },
};

// public api

export const OpenMethodOpensPanel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-api-open'));

    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
  },
};

export const CloseMethodClosesPanel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-api-open'));
    await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

    await userEvent.click(canvas.getByTestId('ctl-api-close'));

    await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
  },
};

export const SetSelectedOptionsApiPushesIntoSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple-banana'));

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple,banana]'));
  },
};

export const SetSelectedOptionsApiClearsSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-multi-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-set-apple-banana'));
    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple,banana]'));

    await userEvent.click(canvas.getByTestId('ctl-api-clear'));

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[]'));
  },
};

// reactive form integration

export const FormControlSetValueSyncsToCombobox: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-form-set-apple-banana'));

    await waitFor(() => {
      const chips = host.querySelectorAll('org-tag');

      expect(chips.length).toBe(2);
      expect(chips[0].textContent?.trim()).toBe('Apple');
      expect(chips[1].textContent?.trim()).toBe('Banana');
    });
  },
};

export const FormControlDisableDisablesCombobox: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.disabled).toBe(true);
    });
  },
};

export const SelectionEmitsToFormControlValue: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await focusComboboxInput(host);
    const panel = await waitForOverlayPanel();

    const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
    await userEvent.click(appleOption);

    await waitFor(() => expect(readout.textContent).toContain('value=[apple]'));
  },
};

export const BlurMarksFormControlTouched: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('combobox');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('touched=false');

    const nativeInput = await focusComboboxInput(host);
    await waitForOverlayPanel();

    nativeInput.blur();

    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};
