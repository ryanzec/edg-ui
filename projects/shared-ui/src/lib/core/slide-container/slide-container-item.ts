import { ChangeDetectionStrategy, Component, ElementRef, computed, forwardRef, inject } from '@angular/core';
import { SlideContainerItemBrainDirective } from '../../brain/slide-container-brain/slide-container-item-brain';
import { SlideContainer } from './slide-container';

@Component({
  selector: 'org-slide-container-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './slide-container-item.css',
  hostDirectives: [SlideContainerItemBrainDirective],
  host: {
    '[attr.data-position]': 'position()',
    '[attr.data-orientation]': 'containerOrientation()',
    '[attr.data-size]': 'containerSize()',
  },
})
export class SlideContainerItem {
  /** reference to the parent slide container for orientation and size styling hooks */
  private readonly _container = inject<SlideContainer>(forwardRef(() => SlideContainer));

  /** reference to the item brain for the position state used by the presentation styling */
  private readonly _brain = inject(SlideContainerItemBrainDirective, { self: true });

  /** reference to the host element for measuring content height */
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  /** position of this item relative to the active slide, mirrored from the brain */
  protected readonly position = computed(() => this._brain.position());

  /** orientation mirrored from the parent container for css styling */
  protected readonly containerOrientation = computed(() => this._container.orientation());

  /** size mode mirrored from the parent container for css styling */
  protected readonly containerSize = computed(() => this._container.size());

  /**
   * sets the zero-based index of this item within the container by delegating to the brain
   * called by the parent SlideContainer during content synchronisation
   */
  public setIndex(index: number): void {
    this._brain.setIndex(index);
  }

  /** returns the rendered height of this item's host element in pixels */
  public getContentHeight(): number {
    return this._elementRef.nativeElement.offsetHeight;
  }
}
