import {
  ComponentRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  Renderer2,
  computed,
  createComponent,
  effect,
  inject,
} from '@angular/core';
import { IconName } from '../icon/icon-brain';
import { SortableBrainDirective } from '../sortable-directive/sortable-brain';
import { Icon } from '../icon/icon';

@Directive({
  selector: '[orgSortableKey]',
  hostDirectives: [
    {
      directive: SortableBrainDirective,
      inputs: ['orgSortableBrain: orgSortableKey', 'enabled: sortableEnabled'],
    },
  ],
})
export class SortableDirective implements OnDestroy {
  private readonly _renderer = inject(Renderer2);
  private readonly _elementRef = inject(ElementRef);
  private readonly _environmentInjector = inject(EnvironmentInjector);
  /** the headless brain driving this sortable; exposed so host components (e.g. `org-table-th`) can mirror sort state */
  public readonly brain = inject(SortableBrainDirective);

  private _iconComponentRef: ComponentRef<Icon> | null = null;

  /** maps the brain's sort direction to the icon name shown by the host element */
  private readonly _iconName = computed<IconName>(() => {
    const direction = this.brain.direction();

    if (direction === null) {
      return 'arrow-down-up';
    }

    return direction === 'asc' ? 'arrow-up' : 'arrow-down';
  });

  constructor() {
    // create or destroy the visual indicator icon to mirror the brain's enabled state
    effect(() => {
      if (this.brain.enabled()) {
        this._createIcon();

        return;
      }

      this._destroyIcon();
    });

    // keep the rendered icon's name and inactive-state styling in sync with the brain
    effect(() => {
      this._updateIcon(this._iconName(), this.brain.isActivelySorting());
    });
  }

  public ngOnDestroy(): void {
    this._iconComponentRef?.destroy();
  }

  /** updates the icon name and inactive-state styling on the injected icon component */
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
    if (this._iconComponentRef) {
      return;
    }

    this._iconComponentRef = createComponent(Icon, {
      environmentInjector: this._environmentInjector,
    });

    const iconElement = this._iconComponentRef.location.nativeElement;
    const hostElement = this._elementRef.nativeElement;

    this._renderer.appendChild(hostElement, iconElement);

    this._updateIcon(this._iconName(), this.brain.isActivelySorting());
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
