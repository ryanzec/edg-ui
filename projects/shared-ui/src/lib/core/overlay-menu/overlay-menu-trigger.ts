import { Directive, inject, input, effect, DestroyRef } from '@angular/core';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { type ConnectedPosition, FlexibleConnectedPositionStrategy, type OverlayRef } from '@angular/cdk/overlay';

/** all valid overlay menu trigger position values */
export const allOverlayMenuTriggerPositions = ['below', 'above', 'before', 'after'] as const;

/** the position of the overlay menu panel relative to its trigger element */
export type OverlayMenuTriggerPosition = (typeof allOverlayMenuTriggerPositions)[number];

/** default value for the overlayMenuTriggerPosition input */
export const OVERLAY_MENU_TRIGGER_POSITION_DEFAULT: OverlayMenuTriggerPosition = 'below';

/** default value for the overlayMenuTriggerCloseOnEscape input */
export const OVERLAY_MENU_TRIGGER_CLOSE_ON_ESCAPE_DEFAULT = true;

/** default value for the overlayMenuTriggerHover input */
export const OVERLAY_MENU_TRIGGER_HOVER_DEFAULT = false;

/** default value (in milliseconds) for the overlayMenuTriggerOpenDelay input */
export const OVERLAY_MENU_TRIGGER_OPEN_DELAY_DEFAULT = 200;

/**
 * default value (in milliseconds) for the overlayMenuTriggerCloseDelay input — the grace period that
 * lets the pointer travel from the trigger to the panel (across the position offset gap) without the
 * menu closing
 */
export const OVERLAY_MENU_TRIGGER_CLOSE_DELAY_DEFAULT = 150;

/**
 * cdk overlay position candidates for each supported overlay menu trigger position. each entry lists
 * the primary position first followed by fallback candidates so the cdk overlay can flip on the primary
 * axis (e.g. `below` → `above`) and on the cross-axis alignment (e.g. left-aligned → right-aligned)
 * when the panel would otherwise be clipped by the viewport
 */
const POSITION_CONFIGURATIONS: Record<OverlayMenuTriggerPosition, ConnectedPosition[]> = {
  below: [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
  ],
  above: [
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  ],
  before: [
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -4 },
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4 },
  ],
  after: [
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4 },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -4 },
  ],
};

/**
 * directive that attaches an overlay menu (rendered by `<org-overlay-menu>`) to a trigger element with
 * an embedded default position and the four-candidate flip matrix. composes `CdkMenuTrigger` via
 * `hostDirectives` so the cdk menu's keyboard navigation, focus trap, role assignment, escape and
 * outside-click handling remain intact. additionally, overrides `CdkMenuTrigger`'s hardcoded locked
 * position so the overlay can re-flip on scroll when room for the primary position appears or
 * disappears — matching the default behavior of `cdkConnectedOverlay`
 */
@Directive({
  selector: '[orgOverlayMenuTrigger]',
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: orgOverlayMenuTrigger'],
    },
  ],
  host: {
    '(mouseenter)': '_onTriggerMouseEnter()',
    '(mouseleave)': '_onTriggerMouseLeave()',
  },
})
export class OverlayMenuTriggerDirective {
  private readonly _cdkMenuTrigger = inject(CdkMenuTrigger);
  private readonly _destroyRef = inject(DestroyRef);

  private _onDocumentEscape: ((event: KeyboardEvent) => void) | null = null;

  private _openTimeoutId: number | null = null;
  private _closeTimeoutId: number | null = null;

  private _isHoveringTrigger = false;
  private _isHoveringPanel = false;

  private _panelElement: HTMLElement | null = null;

  /** the position of the overlay menu panel relative to the trigger element */
  public readonly overlayMenuTriggerPosition = input<OverlayMenuTriggerPosition>(OVERLAY_MENU_TRIGGER_POSITION_DEFAULT);

  /** when true, pressing Escape while the menu is open dismisses the overlay */
  public readonly overlayMenuTriggerCloseOnEscape = input<boolean>(OVERLAY_MENU_TRIGGER_CLOSE_ON_ESCAPE_DEFAULT);

  /**
   * when true, the menu also opens when the pointer hovers the trigger (after `overlayMenuTriggerOpenDelay`)
   * and stays open while the pointer is over the trigger or the panel. this is purely additive — click and
   * keyboard activation remain fully functional regardless of this value
   */
  public readonly overlayMenuTriggerHover = input<boolean>(OVERLAY_MENU_TRIGGER_HOVER_DEFAULT);

  /** delay (in milliseconds) before the menu opens after the pointer begins hovering the trigger */
  public readonly overlayMenuTriggerOpenDelay = input<number>(OVERLAY_MENU_TRIGGER_OPEN_DELAY_DEFAULT);

  /**
   * grace period (in milliseconds) before the menu closes after the pointer leaves both the trigger and the
   * panel — lets the pointer travel across the gap between them without the menu closing
   */
  public readonly overlayMenuTriggerCloseDelay = input<number>(OVERLAY_MENU_TRIGGER_CLOSE_DELAY_DEFAULT);

  constructor() {
    // forward our resolved position fallback matrix into cdk menu trigger's menuPosition so the cdk
    // menu uses our flip-aware candidate list instead of cdk's default single-position fallback
    effect(() => {
      this._cdkMenuTrigger.menuPosition = POSITION_CONFIGURATIONS[this.overlayMenuTriggerPosition()];
    });

    // CdkMenuTrigger hardcodes `.withLockedPosition()` (defaults to true) when building its position
    // strategy, which prevents the panel from flipping between primary and fallback positions on
    // scroll. patching the strategy after open restores the dynamic flip behavior consumers expect.
    // cdk emits `opened` BEFORE assigning `overlayRef` (see @angular/cdk/menu source: opened.next()
    // runs prior to createOverlayRef()), so we defer the read to the next microtask to ensure the
    // overlay has been created by the time we patch its strategy
    const openedSubscription = this._cdkMenuTrigger.opened.subscribe(() => {
      this._attachEscapeListener();

      queueMicrotask(() => {
        const overlayRef = (this._cdkMenuTrigger as unknown as { overlayRef: OverlayRef | null }).overlayRef;

        if (!overlayRef) {
          return;
        }

        const positionStrategy = overlayRef.getConfig().positionStrategy;

        if (positionStrategy instanceof FlexibleConnectedPositionStrategy) {
          positionStrategy.withLockedPosition(false);
        }

        // bridge the trigger→panel gap so the menu stays open while the pointer is over the panel (not just
        // the trigger). only relevant when hover is enabled
        if (this.overlayMenuTriggerHover()) {
          this._attachPanelHoverListeners(overlayRef.overlayElement);
        }
      });
    });

    const closedSubscription = this._cdkMenuTrigger.closed.subscribe(() => {
      this._detachEscapeListener();
      this._detachPanelHoverListeners();
      this._clearOpenTimeout();
      this._clearCloseTimeout();
      this._isHoveringTrigger = false;
      this._isHoveringPanel = false;
    });

    this._destroyRef.onDestroy(() => {
      openedSubscription.unsubscribe();
      closedSubscription.unsubscribe();
      this._detachEscapeListener();
      this._detachPanelHoverListeners();
      this._clearOpenTimeout();
      this._clearCloseTimeout();
    });
  }

  protected _onTriggerMouseEnter(): void {
    if (!this.overlayMenuTriggerHover()) {
      return;
    }

    this._isHoveringTrigger = true;
    this._scheduleOpen();
  }

  protected _onTriggerMouseLeave(): void {
    if (!this.overlayMenuTriggerHover()) {
      return;
    }

    this._isHoveringTrigger = false;
    this._scheduleClose();
  }

  private _scheduleOpen(): void {
    this._clearCloseTimeout();

    if (this._cdkMenuTrigger.isOpen()) {
      return;
    }

    this._clearOpenTimeout();

    this._openTimeoutId = window.setTimeout(() => {
      this._openTimeoutId = null;

      if (!this._cdkMenuTrigger.isOpen()) {
        this._cdkMenuTrigger.open();
      }
    }, this.overlayMenuTriggerOpenDelay());
  }

  private _scheduleClose(): void {
    this._clearOpenTimeout();

    if (!this._cdkMenuTrigger.isOpen()) {
      return;
    }

    this._clearCloseTimeout();

    this._closeTimeoutId = window.setTimeout(() => {
      this._closeTimeoutId = null;

      // keep the menu open while the pointer is still over either the trigger or the panel
      if (this._isHoveringTrigger || this._isHoveringPanel) {
        return;
      }

      this._cdkMenuTrigger.close();
    }, this.overlayMenuTriggerCloseDelay());
  }

  private _clearOpenTimeout(): void {
    if (this._openTimeoutId === null) {
      return;
    }

    window.clearTimeout(this._openTimeoutId);
    this._openTimeoutId = null;
  }

  private _clearCloseTimeout(): void {
    if (this._closeTimeoutId === null) {
      return;
    }

    window.clearTimeout(this._closeTimeoutId);
    this._closeTimeoutId = null;
  }

  private _onPanelMouseEnter = (): void => {
    this._clearCloseTimeout();
    this._isHoveringPanel = true;
  };

  private _onPanelMouseLeave = (): void => {
    this._isHoveringPanel = false;
    this._scheduleClose();
  };

  private _attachPanelHoverListeners(overlayElement: HTMLElement): void {
    if (this._panelElement) {
      return;
    }

    overlayElement.addEventListener('mouseenter', this._onPanelMouseEnter);
    overlayElement.addEventListener('mouseleave', this._onPanelMouseLeave);
    this._panelElement = overlayElement;
  }

  private _detachPanelHoverListeners(): void {
    if (!this._panelElement) {
      return;
    }

    this._panelElement.removeEventListener('mouseenter', this._onPanelMouseEnter);
    this._panelElement.removeEventListener('mouseleave', this._onPanelMouseLeave);
    this._panelElement = null;
  }

  private _attachEscapeListener(): void {
    if (this._onDocumentEscape) {
      return;
    }

    this._onDocumentEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (!this.overlayMenuTriggerCloseOnEscape()) {
        return;
      }

      this._cdkMenuTrigger.close();
    };

    document.addEventListener('keydown', this._onDocumentEscape);
  }

  private _detachEscapeListener(): void {
    if (!this._onDocumentEscape) {
      return;
    }

    document.removeEventListener('keydown', this._onDocumentEscape);
    this._onDocumentEscape = null;
  }
}
