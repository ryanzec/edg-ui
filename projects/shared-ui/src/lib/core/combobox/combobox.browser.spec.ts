import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
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

@Component({
  selector: 'test-combobox-interactive-host',
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
  `,
})
class ComboboxInteractiveHost {
  public readonly comboboxComponent = viewChild.required(Combobox);

  public readonly name = signal<string>('test-combobox');
  public readonly options = signal<ComboboxOptionInput[]>(simpleOptions);
  public readonly placeholder = signal<string>('Select...');
  public readonly isMultiSelect = signal<boolean>(false);
  public readonly autoShowOption = signal<boolean>(true);
  public readonly allowNewOptions = signal<boolean>(false);
  public readonly isGroupingEnabled = signal<boolean>(false);
  public readonly filterSelectedOptions = signal<boolean>(false);
  public readonly disabled = signal<boolean>(false);
  public readonly containerClass = signal<string>('');
  public readonly optionFilter = signal<((inputValue: string, option: ComboboxOption) => boolean) | undefined>(
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
  selector: 'test-combobox-reactive-form-host',
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
  `,
})
class ComboboxReactiveFormHost {
  protected readonly options = simpleOptions;
  public readonly formControl = new FormControl<(string | number)[]>([], { nonNullable: true });

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

type ComboboxHostConfig = {
  name?: string;
  options?: ComboboxOptionInput[];
  placeholder?: string;
  isMultiSelect?: boolean;
  autoShowOption?: boolean;
  allowNewOptions?: boolean;
  isGroupingEnabled?: boolean;
  filterSelectedOptions?: boolean;
  disabled?: boolean;
  containerClass?: string;
  optionFilter?: (inputValue: string, option: ComboboxOption) => boolean;
};

describe('Combobox (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveCombobox = (config: ComboboxHostConfig = {}): ComponentFixture<ComboboxInteractiveHost> =>
    createFixture(ComboboxInteractiveHost, (instance) => {
      if (config.name !== undefined) {
        instance.name.set(config.name);
      }

      if (config.options !== undefined) {
        instance.options.set(config.options);
      }

      if (config.placeholder !== undefined) {
        instance.placeholder.set(config.placeholder);
      }

      if (config.isMultiSelect !== undefined) {
        instance.isMultiSelect.set(config.isMultiSelect);
      }

      if (config.autoShowOption !== undefined) {
        instance.autoShowOption.set(config.autoShowOption);
      }

      if (config.allowNewOptions !== undefined) {
        instance.allowNewOptions.set(config.allowNewOptions);
      }

      if (config.isGroupingEnabled !== undefined) {
        instance.isGroupingEnabled.set(config.isGroupingEnabled);
      }

      if (config.filterSelectedOptions !== undefined) {
        instance.filterSelectedOptions.set(config.filterSelectedOptions);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.containerClass !== undefined) {
        instance.containerClass.set(config.containerClass);
      }

      if (config.optionFilter !== undefined) {
        instance.optionFilter.set(config.optionFilter);
      }
    });

  // the cdk overlay panel renders outside the fixture, attached to document.body
  const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-combobox-overlay');

  const waitForOverlayPanel = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

    return queryOverlayPanel() as HTMLElement;
  };

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes left in the body so a stale panel can't leak into the next test
    document.querySelectorAll('.org-combobox-overlay').forEach((panel) => panel.remove());
  });

  describe('host data attributes', () => {
    it('renders the default host data attributes', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      await flush(fixture);

      expect(host.getAttribute('data-auto-show-option')).toBe('');
      expect(host.getAttribute('data-allow-new-options')).toBeNull();
      expect(host.getAttribute('data-is-multi-select')).toBeNull();
      expect(host.getAttribute('data-filter-selected-options')).toBeNull();
      expect(host.getAttribute('data-is-grouping-enabled')).toBeNull();
    });

    it('reflects data-filtered-options when options exist', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      await flush(fixture);

      expect(host.getAttribute('data-filtered-options')).toBe('');
    });

    it('omits data-filtered-options when there are no options', async () => {
      const fixture = createInteractiveCombobox({ options: [] });
      const host = queryByTestId(fixture, 'combobox');

      await waitFor(() => expect(host.getAttribute('data-filtered-options')).toBeNull());
    });

    it('reflects the allow-new-options host attribute', async () => {
      const fixture = createInteractiveCombobox({ allowNewOptions: true });
      const host = queryByTestId(fixture, 'combobox');

      await waitFor(() => expect(host.getAttribute('data-allow-new-options')).toBe(''));
    });

    it('reflects the multi-select host attribute', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const host = queryByTestId(fixture, 'combobox');

      await waitFor(() => expect(host.getAttribute('data-is-multi-select')).toBe(''));
    });

    it('reflects the filter-selected-options host attribute', async () => {
      const fixture = createInteractiveCombobox({ filterSelectedOptions: true });
      const host = queryByTestId(fixture, 'combobox');

      await waitFor(() => expect(host.getAttribute('data-filter-selected-options')).toBe(''));
    });

    it('reflects the grouping-enabled host attribute', async () => {
      const fixture = createInteractiveCombobox({ isGroupingEnabled: true });
      const host = queryByTestId(fixture, 'combobox');

      await waitFor(() => expect(host.getAttribute('data-is-grouping-enabled')).toBe(''));
    });
  });

  describe('trigger / input rendering', () => {
    it('renders the placeholder on the input', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      await flush(fixture);

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.placeholder).toBe('Select...');
    });

    it('disables the input when disabled', async () => {
      const fixture = createInteractiveCombobox({ disabled: true });
      const host = queryByTestId(fixture, 'combobox');

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.disabled).toBe(true);
      });
    });

    it('stamps the selected label into the input in single-select', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple']);

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe('Apple');
      });
    });

    it('renders inline chips for selected values in multi-select', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple', 'banana']);

      await waitFor(() => {
        const chips = host.querySelectorAll('org-tag');

        expect(chips.length).toBe(2);
        expect(chips[0].textContent?.trim()).toBe('Apple');
        expect(chips[1].textContent?.trim()).toBe('Banana');
      });
    });
  });

  describe('opening and closing', () => {
    it('opens the panel on input focus when auto-show is on', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');

      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
    });

    it('does not open the panel on focus when auto-show is off', async () => {
      const fixture = createInteractiveCombobox({ autoShowOption: false });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
      await flush(fixture);
      expect(readout.textContent).toContain('isOpened=false');
    });

    it('opens the panel on input click even when auto-show is off', async () => {
      const fixture = createInteractiveCombobox({ autoShowOption: false });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;
      await userEvent.click(nativeInput);

      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
    });

    it('opens the panel on ArrowDown when closed', async () => {
      const fixture = createInteractiveCombobox({ autoShowOption: false });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;
      nativeInput.focus();
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
    });

    it('opens the panel on ArrowUp when closed', async () => {
      const fixture = createInteractiveCombobox({ autoShowOption: false });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;
      nativeInput.focus();
      await userEvent.keyboard('{ArrowUp}');

      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
    });

    it('closes the panel on Escape when open', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

      nativeInput.focus();
      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
    });

    it('closes the panel on Tab when open', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

      nativeInput.focus();
      await userEvent.keyboard('{Tab}');

      await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
    });

    it('closes the panel on blur', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

      nativeInput.blur();

      await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
    });
  });

  describe('option rendering', () => {
    it('renders all options in the panel when open', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      await vitestBrowserUtils.focusInput(host, 'input.native');

      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const options = panel.querySelectorAll('org-combobox-option');

        expect(options.length).toBe(simpleOptions.length);
      });
    });

    it('renders grouped options when grouping is enabled', async () => {
      const fixture = createInteractiveCombobox({ options: groupedOptions, isGroupingEnabled: true });
      const host = queryByTestId(fixture, 'combobox');

      await vitestBrowserUtils.focusInput(host, 'input.native');

      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const groups = panel.querySelectorAll('.combobox-group');

        expect(groups.length).toBe(2);
        expect(groups[0].querySelector('.combobox-group-label')?.textContent?.trim()).toBe('Fruits');
        expect(groups[1].querySelector('.combobox-group-label')?.textContent?.trim()).toBe('Vegetables');
      });
    });

    it('renders the empty message when there are no options', async () => {
      const fixture = createInteractiveCombobox({ options: [] });
      const host = queryByTestId(fixture, 'combobox');

      await vitestBrowserUtils.focusInput(host, 'input.native');

      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const empty = panel.querySelector('.combobox-empty');

        expect(empty?.textContent?.trim()).toBe('No options available');
      });
    });

    it('renders the new-option suggestion with an add prefix when allow-new-options and a typed value', async () => {
      const fixture = createInteractiveCombobox({ allowNewOptions: true });
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await userEvent.type(nativeInput, 'Zucchini');

      await waitFor(() => {
        const panel = queryOverlayPanel() as HTMLElement;
        const newOption = panel.querySelector('[data-option-value="Zucchini"]');

        expect(newOption?.textContent?.trim()).toBe('Add "Zucchini"');
      });
    });

    it('does not render the new-option suggestion when the typed value exactly matches an existing option', async () => {
      const fixture = createInteractiveCombobox({ allowNewOptions: true });
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await userEvent.type(nativeInput, 'Apple');

      await waitFor(() => {
        const panel = queryOverlayPanel() as HTMLElement;
        const options = panel.querySelectorAll('org-combobox-option');

        expect(options.length).toBe(1);
        expect(options[0].getAttribute('data-option-value')).toBe('apple');
      });
    });
  });

  describe('filtering', () => {
    it('filters options by label substring while typing', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await userEvent.type(nativeInput, 'an');

      await waitFor(() => {
        const panel = queryOverlayPanel() as HTMLElement;
        const options = panel.querySelectorAll('org-combobox-option');
        const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

        // "Banana", "Mango", "Orange" all contain "an" (case-insensitive)
        expect(values).toEqual(['banana', 'mango', 'orange']);
      });
    });

    it('restores all options when the input is cleared', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
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
    });

    it('replaces the default filter with a custom option filter', async () => {
      const fixture = createInteractiveCombobox({ optionFilter: startsWithFilter });
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await userEvent.type(nativeInput, 'a');

      await waitFor(() => {
        const panel = queryOverlayPanel() as HTMLElement;
        const options = panel.querySelectorAll('org-combobox-option');
        const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

        // starts-with "a" → only Apple (not Banana / Mango / Orange which contain "a")
        expect(values).toEqual(['apple']);
      });
    });

    it('hides already-selected options in the panel when filter-selected-options is true', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true, filterSelectedOptions: true });
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple']);
      await flush(fixture);

      await vitestBrowserUtils.focusInput(host, 'input.native');

      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const options = panel.querySelectorAll('org-combobox-option');
        const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

        expect(values).not.toContain('apple');
        expect(values.length).toBe(simpleOptions.length - 1);
      });
    });

    it('keeps already-selected options in the panel when filter-selected-options is false', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true, filterSelectedOptions: false });
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple']);
      await flush(fixture);

      await vitestBrowserUtils.focusInput(host, 'input.native');

      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const options = panel.querySelectorAll('org-combobox-option');
        const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

        expect(values).toContain('apple');
        expect(values.length).toBe(simpleOptions.length);
      });
    });

    it('combines the text filter with filter-selected-options', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true, filterSelectedOptions: true });
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple', 'banana']);
      await flush(fixture);

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await userEvent.type(nativeInput, 'an');

      await waitFor(() => {
        const panel = queryOverlayPanel() as HTMLElement;
        const options = panel.querySelectorAll('org-combobox-option');
        const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

        // "an" substring would match banana / mango / orange — banana already selected, so only mango + orange
        expect(values).toEqual(['mango', 'orange']);
      });
    });

    it('defaults filter-selected-options to false for the component', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple']);
      await flush(fixture);

      await vitestBrowserUtils.focusInput(host, 'input.native');

      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const options = panel.querySelectorAll('org-combobox-option');
        const values = Array.from(options).map((option) => option.getAttribute('data-option-value'));

        expect(values).toContain('apple');
      });
    });

    it('auto-opens the panel while typing when closed and auto-show is on', async () => {
      const fixture = createInteractiveCombobox({ autoShowOption: false });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;
      nativeInput.focus();

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
      await flush(fixture);
      expect(readout.textContent).toContain('isOpened=false');

      // flip auto-show back on so the typing handler can auto-open
      fixture.componentInstance.autoShowOption.set(true);
      await flush(fixture);
      nativeInput.focus();
      await userEvent.type(nativeInput, 'a');

      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
    });
  });

  describe('mouse selection', () => {
    it('selects an option on click in single-select', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
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
    });

    it('adds an option to the selection on click in multi-select', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
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
    });

    it('does not select a disabled option on mouse down', async () => {
      const fixture = createInteractiveCombobox({ options: disabledMixOptions });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      const bananaOption = panel.querySelector('[data-option-value="banana"]') as HTMLElement;

      await waitFor(() => expect(bananaOption.getAttribute('aria-disabled')).toBe('true'));

      // userEvent.click does pointer hit-testing and refuses to interact with elements that have
      // pointer-events: none (which the css applies to disabled options). dispatching mousedown
      // directly verifies the brain's disabled guard works.
      bananaOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('selectedValues=[]');
    });

    it('sets the focused option on mouse enter', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      const cherryOption = panel.querySelector('[data-option-value="cherry"]') as HTMLElement;
      await userEvent.hover(cherryOption);

      await waitFor(() => expect(readout.textContent).toContain('focusedValue=cherry'));
    });

    it('clears the focused option on mouse leave', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      const cherryOption = panel.querySelector('[data-option-value="cherry"]') as HTMLElement;
      await userEvent.hover(cherryOption);

      await waitFor(() => expect(readout.textContent).toContain('focusedValue=cherry'));

      await userEvent.unhover(cherryOption);

      await waitFor(() => expect(readout.textContent).toContain('focusedValue=none'));
    });
  });

  describe('keyboard selection', () => {
    it('selects the focused option on Enter', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));

      await userEvent.keyboard('{Enter}');

      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple]'));
    });

    it('selects the new-option suggestion on Enter when allow-new-options and no focused option', async () => {
      const fixture = createInteractiveCombobox({ allowNewOptions: true });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await userEvent.type(nativeInput, 'Zucchini');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[Zucchini]'));
    });

    it('focuses the first then the next option on ArrowDown', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));

      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=banana'));
    });

    it('focuses the last then the previous option on ArrowUp', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=orange'));

      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=mango'));
    });

    it('focuses the first option on Home', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=orange'));

      await userEvent.keyboard('{Home}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));
    });

    it('focuses the last option on End', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{End}');

      await waitFor(() => expect(readout.textContent).toContain('focusedValue=orange'));
    });

    it('focuses the first option of the first group on ArrowDown when grouping', async () => {
      const fixture = createInteractiveCombobox({ options: groupedOptions, isGroupingEnabled: true });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{ArrowDown}');

      // grouped options sort by group label, then by option label inside the group → first is "Apple" in "Fruits"
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=apple'));

      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(readout.textContent).toContain('focusedValue=banana'));
    });

    it('blurs the input on the second Escape press', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

      nativeInput.focus();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
      await flush(fixture);
      expect(readout.textContent).toContain('blurredCount=0');

      nativeInput.focus();
      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
    });
  });

  describe('multi-select chip removal', () => {
    it('deselects a value when its inline chip is removed', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple', 'banana']);

      await waitFor(() => expect(host.querySelectorAll('org-tag').length).toBe(2));

      const removeButtons = host.querySelectorAll('org-tag .tag-remove');
      await userEvent.click(removeButtons[0] as HTMLElement);

      await waitFor(() => {
        expect(readout.textContent).toContain('selectedValues=[banana]');
        expect(host.querySelectorAll('org-tag').length).toBe(1);
      });
    });
  });

  describe('output events', () => {
    it('emits selectedValuesChanged on selection', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
      await userEvent.click(appleOption);

      await waitFor(() => expect(readout.textContent).toContain('selectedValuesChangedCount=1'));
    });

    it('emits inputValueChanged on typing', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await userEvent.type(nativeInput, 'ab');

      await waitFor(() => {
        expect(readout.textContent).toContain('inputValue="ab"');
        expect(readout.textContent).toContain('inputValueChangedCount=2');
      });
    });

    it('emits focusedOptionChanged on hover', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
      await userEvent.hover(appleOption);

      await waitFor(() => expect(readout.textContent).toContain('focusedOptionChangedCount=1'));
    });

    it('emits isOpenedChanged on open and close', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitFor(() => expect(readout.textContent).toContain('isOpenedChangedCount=1'));

      nativeInput.blur();

      await waitFor(() => expect(readout.textContent).toContain('isOpenedChangedCount=2'));
    });

    it('emits focused on input focus', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    });

    it('emits blurred on input blur', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

      nativeInput.blur();

      await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
    });
  });

  describe('input a11y attributes', () => {
    it('applies aria-expanded reflecting the open state', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      await flush(fixture);
      expect(nativeInput.getAttribute('aria-expanded')).toBe('false');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      await waitFor(() => expect(nativeInput.getAttribute('aria-expanded')).toBe('true'));
    });

    it('applies the static aria attributes and combobox role', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      await flush(fixture);

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.getAttribute('role')).toBe('combobox');
      expect(nativeInput.getAttribute('aria-haspopup')).toBe('listbox');
      expect(nativeInput.getAttribute('aria-autocomplete')).toBe('list');
      expect(nativeInput.getAttribute('aria-controls')).toBe('combobox-listbox-test-combobox');
    });

    it('applies aria-activedescendant when an option is focused', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() => expect(nativeInput.getAttribute('aria-activedescendant')).toBe('org-combobox-option-apple'));
    });
  });

  describe('option a11y', () => {
    it('gives each option role=option and aria-selected=false by default', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const appleOption = panel.querySelector('[data-option-value="apple"]');

        expect(appleOption?.getAttribute('role')).toBe('option');
        expect(appleOption?.getAttribute('aria-selected')).toBe('false');
      });
    });

    it('reflects selection in the option aria-selected', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple']);
      await flush(fixture);

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const appleOption = panel.querySelector('[data-option-value="apple"]');

        expect(appleOption?.getAttribute('aria-selected')).toBe('true');
      });
    });

    it('reflects disabled in the option aria-disabled', async () => {
      const fixture = createInteractiveCombobox({ options: disabledMixOptions });
      const host = queryByTestId(fixture, 'combobox');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const bananaOption = panel.querySelector('[data-option-value="banana"]');
        const appleOption = panel.querySelector('[data-option-value="apple"]');

        expect(bananaOption?.getAttribute('aria-disabled')).toBe('true');
        expect(appleOption?.getAttribute('aria-disabled')).toBeNull();
      });
    });

    it('reflects the focused option in data-active', async () => {
      const fixture = createInteractiveCombobox();
      const host = queryByTestId(fixture, 'combobox');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      nativeInput.focus();
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() => {
        const appleOption = panel.querySelector('[data-option-value="apple"]');

        expect(appleOption?.getAttribute('data-active')).toBe('1');
      });
    });
  });

  describe('public api', () => {
    it('opens the panel via the open() method', async () => {
      const fixture = createInteractiveCombobox();
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.comboboxComponent().open();

      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));
    });

    it('closes the panel via the close() method', async () => {
      const fixture = createInteractiveCombobox();
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.comboboxComponent().open();
      await waitFor(() => expect(readout.textContent).toContain('isOpened=true'));

      fixture.componentInstance.comboboxComponent().close();

      await waitFor(() => expect(readout.textContent).toContain('isOpened=false'));
    });

    it('pushes values into the selection via setSelectedOptions()', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple', 'banana']);

      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple,banana]'));
    });

    it('clears the selection via setSelectedOptions([])', async () => {
      const fixture = createInteractiveCombobox({ isMultiSelect: true });
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.comboboxComponent().setSelectedOptions(['apple', 'banana']);
      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple,banana]'));

      fixture.componentInstance.comboboxComponent().setSelectedOptions([]);

      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[]'));
    });
  });

  describe('reactive form integration', () => {
    it('syncs a form-control setValue into the combobox', async () => {
      const fixture = createFixture(ComboboxReactiveFormHost);
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.formControl.setValue(['apple', 'banana']);

      await waitFor(() => {
        const chips = host.querySelectorAll('org-tag');

        expect(chips.length).toBe(2);
        expect(chips[0].textContent?.trim()).toBe('Apple');
        expect(chips[1].textContent?.trim()).toBe('Banana');
      });
    });

    it('disables the combobox when the form control is disabled', async () => {
      const fixture = createFixture(ComboboxReactiveFormHost);
      const host = queryByTestId(fixture, 'combobox');

      fixture.componentInstance.formControl.disable();

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.disabled).toBe(true);
      });
    });

    it('emits a selection to the form-control value', async () => {
      const fixture = createFixture(ComboboxReactiveFormHost);
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      const panel = await waitForOverlayPanel();

      const appleOption = panel.querySelector('[data-option-value="apple"]') as HTMLElement;
      await userEvent.click(appleOption);

      await waitFor(() => expect(readout.textContent).toContain('value=[apple]'));
    });

    it('marks the form control touched on blur', async () => {
      const fixture = createFixture(ComboboxReactiveFormHost);
      const host = queryByTestId(fixture, 'combobox');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);
      expect(readout.textContent).toContain('touched=false');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitForOverlayPanel();

      nativeInput.blur();

      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });
  });
});
