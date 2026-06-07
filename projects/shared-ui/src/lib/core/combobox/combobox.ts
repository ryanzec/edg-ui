import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  ViewChild,
  forwardRef,
  effect,
  untracked,
  AfterViewInit,
  afterNextRender,
  inject,
  Injector,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { angularUtils } from '@organization/shared-utils';
import { Input, type InputInlineItem } from '../input/input';
import {
  ComboboxStore,
  type ComboboxOption,
  type ComboboxOptionInput,
  type ComboboxGroupedOptions,
} from '../combobox-store/combobox-store';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ComboboxOptions } from './combobox-options';
import { ComboboxBrainDirective } from '../combobox/combobox-brain';

/** default value for the autoShowOption input */
export const COMBOBOX_AUTO_SHOW_OPTION_DEFAULT = true;

/** default value for the allowNewOptions input */
export const COMBOBOX_ALLOW_NEW_OPTIONS_DEFAULT = false;

/** default value for the isMultiSelect input */
export const COMBOBOX_IS_MULTI_SELECT_DEFAULT = false;

/** default value for the optionFilter input */
export const COMBOBOX_OPTION_FILTER_DEFAULT: ((inputValue: string, option: ComboboxOption) => boolean) | undefined =
  undefined;

/** default value for the filterSelectedOptions input */
export const COMBOBOX_FILTER_SELECTED_OPTIONS_DEFAULT = false;

/** default value for the placeholder input */
export const COMBOBOX_PLACEHOLDER_DEFAULT = 'Select...';

/** default value for the isGroupingEnabled input */
export const COMBOBOX_IS_GROUPING_ENABLED_DEFAULT = false;

/** default value for the options input */
export const COMBOBOX_OPTIONS_DEFAULT: ComboboxOptionInput[] = [];

/** default value for the disabled input */
export const COMBOBOX_DISABLED_DEFAULT = false;

/** default value for the containerClass input */
export const COMBOBOX_CONTAINER_CLASS_DEFAULT = '';

/** default value for the enableFiltering input */
export const COMBOBOX_ENABLE_FILTERING_DEFAULT = true;

/** all available drop-down width modes for the combobox */
export const allComboboxDropDownWidthModes = ['match', 'minimum', 'minimum-match'] as const;

/** union type of all available drop-down width modes */
export type ComboboxDropDownWidthMode = (typeof allComboboxDropDownWidthModes)[number];

/** default value for the dropDownWidthMode input */
export const COMBOBOX_DROP_DOWN_WIDTH_MODE_DEFAULT: ComboboxDropDownWidthMode = 'minimum';

/**
 * combobox component for single/multi-select autocomplete functionality
 */
@Component({
  selector: 'org-combobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, CdkOverlayOrigin, CdkConnectedOverlay, ComboboxOptions],
  templateUrl: './combobox.html',
  providers: [
    ComboboxStore,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Combobox),
      multi: true,
    },
  ],
  hostDirectives: [
    {
      directive: ComboboxBrainDirective,
      inputs: [
        'autoShowOption',
        'allowNewOptions',
        'isMultiSelect',
        'isGroupingEnabled',
        'disabled',
        'isLoading',
        'characterThreshold',
        'name',
      ],
      outputs: ['focused', 'blurred'],
    },
  ],
  styleUrl: './combobox.css',
  host: {
    '[attr.data-filtered-options]': 'hasFilteredOptions() ? "" : null',
    '[attr.data-auto-show-option]': 'autoShowOption() ? "" : null',
    '[attr.data-allow-new-options]': 'allowNewOptions() ? "" : null',
    '[attr.data-is-multi-select]': 'isMultiSelect() ? "" : null',
    '[attr.data-filter-selected-options]': 'filterSelectedOptions() ? "" : null',
    '[attr.data-is-grouping-enabled]': 'isGroupingEnabled() ? "" : null',
  },
})
export class Combobox implements AfterViewInit, ControlValueAccessor {
  private readonly _store = inject(ComboboxStore);
  private readonly _injector = inject(Injector);
  protected readonly brain = inject(ComboboxBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: (string | number)[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  @ViewChild('inputComponent', { static: true })
  protected readonly inputComponent!: Input;

  @ViewChild(CdkConnectedOverlay)
  protected readonly connectedOverlayDirective?: CdkConnectedOverlay;

  @ViewChild('trigger')
  protected readonly triggerOrigin?: CdkOverlayOrigin;

  // input properties
  public readonly autoShowOption = input<boolean>(COMBOBOX_AUTO_SHOW_OPTION_DEFAULT);
  public readonly allowNewOptions = input<boolean>(COMBOBOX_ALLOW_NEW_OPTIONS_DEFAULT);
  public readonly isMultiSelect = input<boolean>(COMBOBOX_IS_MULTI_SELECT_DEFAULT);
  public readonly optionFilter = input<
    ((inputValue: string, option: ComboboxOption) => boolean) | undefined,
    ((inputValue: string, option: ComboboxOption) => boolean) | null | undefined
  >(COMBOBOX_OPTION_FILTER_DEFAULT, { transform: angularUtils.transformNullToUndefined });
  public readonly filterSelectedOptions = input<boolean>(COMBOBOX_FILTER_SELECTED_OPTIONS_DEFAULT);
  public readonly placeholder = input<string>(COMBOBOX_PLACEHOLDER_DEFAULT);
  public readonly isGroupingEnabled = input<boolean>(COMBOBOX_IS_GROUPING_ENABLED_DEFAULT);
  public readonly options = input<ComboboxOptionInput[]>(COMBOBOX_OPTIONS_DEFAULT);
  public readonly disabled = input<boolean>(COMBOBOX_DISABLED_DEFAULT);
  public readonly containerClass = input<string>(COMBOBOX_CONTAINER_CLASS_DEFAULT);
  public readonly enableFiltering = input<boolean>(COMBOBOX_ENABLE_FILTERING_DEFAULT);
  public readonly dropDownWidthMode = input<ComboboxDropDownWidthMode>(COMBOBOX_DROP_DOWN_WIDTH_MODE_DEFAULT);
  public readonly name = input.required<string>();

  // output events - proxy from store
  public readonly inputValueChanged = outputFromObservable(this._store.inputValueChanged$);
  public readonly selectedValuesChanged = outputFromObservable(this._store.selectedValuesChanged$);
  public readonly focusedOptionChanged = outputFromObservable(this._store.focusedOptionChanged$);
  public readonly isOpenedChanged = outputFromObservable(this._store.isOpenedChanged$);

  // additional output events
  public readonly focused = output<void>();
  public readonly blurred = output<void>();

  // computed properties
  public readonly isOpened = computed<boolean>(() => this._store.isOpened());
  public readonly filteredOptions = computed<ComboboxOption[]>(() => this._store.filteredOptions());
  public readonly filteredGroupedOptions = computed<ComboboxGroupedOptions[]>(() =>
    this._store.filteredGroupedOptions()
  );
  protected readonly selectedOptions = computed<ComboboxOption[]>(() => this._store.selectedOptions());
  public readonly focusedOption = computed<ComboboxOption | null>(() => this._store.focusedOption());
  protected readonly hasFilteredOptions = computed<boolean>(() => this.filteredOptions().length > 0);

  /** synthetic option to display when allowNewOptions is true and input doesn't exactly match any existing option (proxied from brain) */
  public readonly newOptionSuggestion = computed<ComboboxOption | null>(() => this.brain.newOptionSuggestion());

  /** consumer-managed loading state (proxied from brain) */
  public readonly isLoading = computed<boolean>(() => this.brain.isLoading());

  /** whether the current input value is below the required character threshold (proxied from brain) */
  public readonly isBelowCharacterThreshold = computed<boolean>(() => this.brain.isBelowCharacterThreshold());

  /** the required character threshold (proxied from brain) */
  public readonly characterThreshold = computed<number>(() => this.brain.characterThreshold());

  /**
   * inline items for multi-select display
   */
  protected readonly inlineItems = computed<InputInlineItem[]>(() => {
    if (!this.isMultiSelect()) {
      return [];
    }

    return this.selectedOptions().map((option) => ({
      id: String(option.value),
      label: option.label,
      removable: true,
    }));
  });

  protected readonly overlayPositions = [
    {
      originX: 'start' as const,
      originY: 'bottom' as const,
      overlayX: 'start' as const,
      overlayY: 'top' as const,
      offsetY: 4,
    },
    {
      originX: 'start' as const,
      originY: 'top' as const,
      overlayX: 'start' as const,
      overlayY: 'bottom' as const,
      offsetY: -4,
    },
  ];

  constructor() {
    // initialize store (use untracked to avoid triggering effects during init)
    untracked(() => {
      this._store.initialize(this.options(), {
        isMultiSelect: this.isMultiSelect(),
        allowNewOptions: this.allowNewOptions(),
        optionFilter: this.optionFilter() ?? null,
        filterSelectedOptions: this.filterSelectedOptions(),
        enableFiltering: this.enableFiltering(),
      });
    });

    // sync options when they change (skip first run since we just initialized)
    effect(() => {
      const currentOptions = this.options();
      untracked(() => {
        this._store.setOptions(currentOptions);
      });
    });

    // sync config when inputs change (skip first run since we just initialized)
    effect(() => {
      const config = {
        isMultiSelect: this.isMultiSelect(),
        allowNewOptions: this.allowNewOptions(),
        optionFilter: this.optionFilter() ?? null,
        filterSelectedOptions: this.filterSelectedOptions(),
        enableFiltering: this.enableFiltering(),
      };
      untracked(() => {
        this._store.setConfig(config);
      });
    });

    // sync selected values changes to form control via the brain (which gates on isFormControlled + isInitializing)
    effect(() => {
      const selectedValues = this._store.selectedValues();

      untracked(() => {
        this.brain.notifySelectedValuesIfFormControlled(selectedValues);
      });
    });

    // forward brain's form-controlled selected-values notifications to the cva _onChange callback
    this.brain.selectedValuesNotified.subscribe((values) => {
      this._onChange(values);
    });

    // brain notifies the input was touched on blur (when no selection remains, etc.)
    this.brain.blurred.subscribe(() => {
      this._onTouched();
    });

    // brain requests an overlay position update (e.g. multi-select tag size change)
    this.brain.overlayPositionUpdateRequested.subscribe(() => {
      this._updateOverlayPosition();
    });

    // update overlay position when selected values change in multi-select mode
    effect(() => {
      const selectedOptions = this.selectedOptions();
      const isMultiSelect = this.isMultiSelect();
      const isOpened = this.isOpened();

      if (isMultiSelect && isOpened && selectedOptions) {
        untracked(() => {
          this._updateOverlayPosition();
        });
      }
    });
  }

  public ngAfterViewInit(): void {
    // wire input-focus / input-blur callbacks for the brain to call
    this.brain.setInputAccessors(
      () => this.inputComponent.focusInput(),
      () => this.inputComponent.blurInput()
    );

    // mark initialization as complete after view is initialized
    this.brain.completeInitialization();
  }

  // template event handlers — all delegate to the brain
  public inputValueChange(value: string): void {
    this.brain.handleInputValueChange(value);
  }

  public inputFocus(): void {
    this.brain.handleInputFocus();
  }

  public inputClick(): void {
    this.brain.handleInputClick();
  }

  public inputBlur(): void {
    this.brain.handleInputBlur();
  }

  public keyDown(event: KeyboardEvent): void {
    this.brain.handleKeyDown(event);
  }

  public optionMouseDown(event: MouseEvent, option: ComboboxOption): void {
    this.brain.handleOptionMouseDown(event, option);
  }

  public optionMouseEnter(event: MouseEvent, option: ComboboxOption): void {
    this.brain.handleOptionMouseEnter(event, option);
  }

  public optionMouseLeave(event: MouseEvent, option: ComboboxOption): void {
    this.brain.handleOptionMouseLeave(event, option);
  }

  public inlineItemRemove(item: InputInlineItem): void {
    this.brain.handleInlineItemRemove(item.id);
  }

  /**
   * public api: get selected options
   */
  public getSelectedOptions(): ComboboxOption[] {
    return this.selectedOptions();
  }

  /**
   * public api: set selected options
   */
  public setSelectedOptions(values: (string | number)[]): void {
    this._store.setSelectedValues(values);
  }

  /**
   * public api: open the combobox
   */
  public open(): void {
    this._store.open();
  }

  /**
   * public api: close the combobox
   */
  public close(): void {
    this._store.close();
  }

  // control value accessor implementation
  public writeValue(value: (string | number)[]): void {
    // there seem to be cases where the options are updated for the component but not the store to this ensure
    // that works properly
    this._store.setOptions(this.options());

    if (value) {
      this._store.setSelectedValues(value);

      return;
    }

    this._store.setSelectedValues([]);
  }

  public registerOnChange(fn: (value: (string | number)[]) => void): void {
    this.brain.setFormControlled();
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }

  /**
   * resolves the overlay width binding: only constrained when matching the trigger width exactly (an empty string
   * leaves the panel content-determined)
   */
  protected overlayWidth(): string | number {
    return this.dropDownWidthMode() === 'match' ? this._triggerWidth() || '' : '';
  }

  /**
   * resolves the overlay min-width binding: only constrained when the trigger width is the minimum (an empty string
   * applies no minimum)
   */
  protected overlayMinWidth(): string | number {
    return this.dropDownWidthMode() === 'minimum-match' ? this._triggerWidth() || '' : '';
  }

  /**
   * the rendered width of the trigger container (the element the overlay is anchored to)
   */
  private _triggerWidth(): number {
    return this.triggerOrigin?.elementRef.nativeElement.offsetWidth ?? 0;
  }

  /**
   * updates the overlay position to account for changes in origin size
   */
  private _updateOverlayPosition(): void {
    // wait for next render to ensure DOM is updated with new inline items
    afterNextRender(
      () => {
        if (this.connectedOverlayDirective) {
          this.connectedOverlayDirective.overlayRef?.updatePosition();

          return;
        }

        // fallback: force position recalculation using native APIs
        const trigger = this.inputComponent?.inputRef?.nativeElement;

        if (trigger) {
          void trigger.offsetHeight;
        }
      },
      { injector: this._injector }
    );
  }
}
