import {
  Directive,
  input,
  inject,
  Renderer2,
  ElementRef,
  effect,
  createComponent,
  ComponentRef,
  computed,
  EnvironmentInjector,
  OnDestroy,
} from '@angular/core';
import { Icon, IconName } from '../icon/icon';
import { SortingStore } from '../sorting-store/sorting-store';

/**
 * default value for sortableEnabled input
 */
export const SORTABLE_ENABLED_DEFAULT = true;

@Directive({
  selector: '[orgSortableKey]',
  host: {
    '(click)': 'onClick()',
    '(keydown.enter)': 'onKeydown($event)',
    '(keydown.space)': 'onKeydown($event)',
    '[attr.role]': 'sortableEnabled() ? "button" : null',
    '[attr.tabindex]': 'sortableEnabled() ? "0" : null',
    '[attr.data-sortable-enabled]': 'sortableEnabled() ? "" : null',
  },
})
export class SortableDirective implements OnDestroy {
  private readonly _renderer = inject(Renderer2);
  private readonly _elementRef = inject(ElementRef);
  private readonly _environmentInjector = inject(EnvironmentInjector);
  private readonly _sortingStore = inject(SortingStore);

  /** the dynamically created icon component reference */
  private _iconComponentRef: ComponentRef<Icon> | null = null;

  /** the sort key this directive manages */
  public orgSortableKey = input.required<string>();

  /**
   * controls whether sorting functionality is enabled
   */
  public sortableEnabled = input<boolean>(SORTABLE_ENABLED_DEFAULT);

  /** whether this directive's key is the currently active sort key with a direction set */
  private readonly _isActivelySorting = computed<boolean>(() => {
    const key = this._sortingStore.key();
    const direction = this._sortingStore.direction();
    const selectableValue = this.orgSortableKey();

    return key === selectableValue && direction !== null;
  });

  /** the icon name reflecting the current sorting state for this key */
  private readonly _iconName = computed<IconName>(() => {
    const isActivelySorting = this._isActivelySorting();
    const direction = this._sortingStore.direction();

    if (!isActivelySorting) {
      return 'arrow-down-up';
    }

    return direction === 'asc' ? 'arrow-up' : 'arrow-down';
  });

  constructor() {
    // keep icon up-to-date with state updates
    effect(() => {
      this._updateIcon(this._iconName(), this._isActivelySorting());
    });

    // handle dynamic enable/disable of sorting functionality
    effect(() => {
      const enabled = this.sortableEnabled();

      if (enabled) {
        this._createIcon();

        return;
      }

      this._destroyIcon();
    });
  }

  ngOnDestroy(): void {
    this._iconComponentRef?.destroy();
  }

  /** toggles the sort for this key when the host element is clicked */
  protected onClick(): void {
    const enabled = this.sortableEnabled();

    if (!enabled) {
      return;
    }

    const selectableValue = this.orgSortableKey();

    if (!selectableValue) {
      return;
    }

    this._sortingStore.toggleSort(selectableValue);
  }

  /** handles keyboard events to trigger sort toggling and prevent default scroll on space */
  protected onKeydown(event: Event): void {
    event.preventDefault();
    this.onClick();
  }

  /** updates the icon name and active state styling on the injected icon component */
  private _updateIcon(iconName: IconName, isActivelySorting: boolean): void {
    if (!this._iconComponentRef) {
      return;
    }

    const iconElement = this._iconComponentRef.location.nativeElement;

    this._iconComponentRef.setInput('name', iconName);

    if (isActivelySorting) {
      this._renderer.removeAttribute(iconElement, 'data-sortable-inactive');
    }

    if (!isActivelySorting) {
      this._renderer.setAttribute(iconElement, 'data-sortable-inactive', '');
    }

    this._iconComponentRef.changeDetectorRef.detectChanges();
  }

  /** creates the icon component and appends it to the host element */
  private _createIcon(): void {
    // don't create if already exists
    if (this._iconComponentRef) {
      return;
    }

    this._iconComponentRef = createComponent(Icon, {
      environmentInjector: this._environmentInjector,
    });

    const iconElement = this._iconComponentRef.location.nativeElement;
    const hostElement = this._elementRef.nativeElement;

    this._renderer.appendChild(hostElement, iconElement);

    this._updateIcon(this._iconName(), this._isActivelySorting());
  }

  /** removes the icon component from the host element and destroys it */
  private _destroyIcon(): void {
    if (!this._iconComponentRef) {
      return;
    }

    const iconElement = this._iconComponentRef.location.nativeElement;
    const hostElement = this._elementRef.nativeElement;

    this._renderer.removeChild(hostElement, iconElement);
    this._iconComponentRef.destroy();
    this._iconComponentRef = null;
  }
}
