import {
  Directive,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { v4 as uuidv4 } from 'uuid';

/** all valid tooltip trigger type values */
export const allTooltipTriggerTypes = ['hover', 'click'] as const;

/** how the tooltip is triggered */
export type TooltipTriggerType = (typeof allTooltipTriggerTypes)[number];

/** all valid horizontal position values for the tooltip relative to the trigger */
export const allTooltipXPositionValues = ['left', 'center', 'right'] as const;

/** horizontal position of the tooltip relative to the trigger */
export type TooltipXPosition = (typeof allTooltipXPositionValues)[number];

/** all valid vertical position values for the tooltip relative to the trigger */
export const allTooltipYPositionValues = ['top', 'center', 'bottom'] as const;

/** vertical position of the tooltip relative to the trigger */
export type TooltipYPosition = (typeof allTooltipYPositionValues)[number];

/** default value for the tooltipTriggerType input */
export const TOOLTIP_TRIGGER_TYPE_DEFAULT: TooltipTriggerType = 'hover';

/** default value for the tooltipOpenDelay input (milliseconds) */
export const TOOLTIP_OPEN_DELAY_DEFAULT = 200;

/** default value for the tooltipCloseDelay input (milliseconds) */
export const TOOLTIP_CLOSE_DELAY_DEFAULT = 200;

/** default value for the tooltipKeepOpenOnHover input */
export const TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT = false;

/** default value for the tooltipXPosition input */
export const TOOLTIP_X_POSITION_DEFAULT: TooltipXPosition = 'center';

/** default value for the tooltipYPosition input */
export const TOOLTIP_Y_POSITION_DEFAULT: TooltipYPosition = 'bottom';

/** the internal state shape for the tooltip brain directive */
type TooltipState = {
  isOpen: boolean;
  isHoveringTooltip: boolean;
};

/**
 * headless brain directive for the tooltip component. owns the open/close state machine, the cdk overlay and portal
 * lifecycle, position strategies, hover/focus debounce timeouts, the optional keep-open-on-tooltip-hover behaviour,
 * the aria-describedby wiring on the trigger, and cleanup. the brain injects its own ElementRef which (when applied
 * as a hostDirective on org-tooltip) is the trigger wrapper element — its first child is treated as the trigger.
 */
@Directive({
  selector: '[orgTooltipBrain]',
  exportAs: 'orgTooltipBrain',
  host: {
    '(mouseenter)': 'onTriggerMouseEnter()',
    '(mouseleave)': 'onTriggerMouseLeave()',
    '(click)': 'onTriggerClick()',
    '(focusin)': 'onTriggerFocusIn()',
    '(focusout)': 'onTriggerFocusOut()',
  },
})
export class TooltipBrainDirective implements OnDestroy {
  private readonly _overlay = inject(Overlay);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  /** unique id used to associate the tooltip overlay with its trigger via aria-describedby */
  private readonly _tooltipId = `tooltip-${uuidv4()}`;

  private readonly _state = signal<TooltipState>({
    isOpen: false,
    isHoveringTooltip: false,
  });

  private _overlayRef: OverlayRef | null = null;
  private _portal: TemplatePortal | null = null;
  private _openTimeoutId: number | null = null;
  private _closeTimeoutId: number | null = null;
  private _hoverListenersAttached = false;

  /** how the tooltip is triggered */
  public readonly tooltipTriggerType = input<TooltipTriggerType>(TOOLTIP_TRIGGER_TYPE_DEFAULT);

  /** template for the tooltip content */
  public readonly tooltipTemplateRef = input.required<TemplateRef<unknown>>();

  /** delay in milliseconds before showing the tooltip */
  public readonly tooltipOpenDelay = input<number>(TOOLTIP_OPEN_DELAY_DEFAULT);

  /** delay in milliseconds before hiding the tooltip */
  public readonly tooltipCloseDelay = input<number>(TOOLTIP_CLOSE_DELAY_DEFAULT);

  /** whether to keep the tooltip open when hovering over its overlay */
  public readonly tooltipKeepOpenOnHover = input<boolean>(TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT);

  /** horizontal position of the tooltip relative to the trigger */
  public readonly tooltipXPosition = input<TooltipXPosition>(TOOLTIP_X_POSITION_DEFAULT);

  /** vertical position of the tooltip relative to the trigger */
  public readonly tooltipYPosition = input<TooltipYPosition>(TOOLTIP_Y_POSITION_DEFAULT);

  /** emitted when the tooltip opens */
  public readonly tooltipOpened = output<void>();

  /** emitted when the tooltip closes */
  public readonly tooltipClosed = output<void>();

  constructor() {
    /** recreate the portal whenever the template reference changes so the overlay always reflects the latest template */
    effect(() => {
      const contentTemplate = this.tooltipTemplateRef();

      this._portal = new TemplatePortal(contentTemplate, this._viewContainerRef);
    });
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this._clearTimeouts();
    this._detachTooltipHoverListeners();

    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  protected onTriggerMouseEnter(): void {
    if (this.tooltipTriggerType() !== 'hover') {
      return;
    }

    this._scheduleOpen();
  }

  protected onTriggerMouseLeave(): void {
    if (this.tooltipTriggerType() !== 'hover') {
      return;
    }

    this._scheduleClose();
  }

  protected onTriggerClick(): void {
    if (this.tooltipTriggerType() !== 'click') {
      return;
    }

    if (this._state().isOpen) {
      this._closeTooltip();

      return;
    }

    this._openTooltip();
  }

  protected onTriggerFocusIn(): void {
    if (this.tooltipTriggerType() !== 'hover') {
      return;
    }

    this._scheduleOpen();
  }

  protected onTriggerFocusOut(): void {
    if (this.tooltipTriggerType() !== 'hover') {
      return;
    }

    this._scheduleClose();
  }

  private _scheduleOpen(): void {
    this._clearCloseTimeout();

    if (this._state().isOpen) {
      return;
    }

    this._openTimeoutId = window.setTimeout(() => {
      this._openTooltip();
    }, this.tooltipOpenDelay());
  }

  private _scheduleClose(): void {
    this._clearOpenTimeout();

    if (!this._state().isOpen) {
      return;
    }

    this._closeTimeoutId = window.setTimeout(() => {
      if (this.tooltipKeepOpenOnHover() && this._state().isHoveringTooltip) {
        return;
      }

      this._closeTooltip();
    }, this.tooltipCloseDelay());
  }

  private _openTooltip(): void {
    if (this._state().isOpen) {
      return;
    }

    this.tooltipOpened.emit();

    if (!this._overlayRef) {
      this._createOverlay();
    }

    if (this._portal && this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);

      if (this.tooltipTriggerType() === 'hover' && this.tooltipKeepOpenOnHover()) {
        this._attachTooltipHoverListeners();
      }
    }

    this._triggerElement.setAttribute('aria-describedby', this._tooltipId);

    this._state.update((state) => ({
      ...state,
      isOpen: true,
    }));
  }

  private _closeTooltip(): void {
    if (!this._state().isOpen) {
      return;
    }

    this.tooltipClosed.emit();
    this._triggerElement.removeAttribute('aria-describedby');
    this._detachTooltipHoverListeners();

    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }

    this._state.update((state) => ({
      ...state,
      isOpen: false,
      isHoveringTooltip: false,
    }));
  }

  private _createOverlay(): void {
    const positions = this._getPositionStrategies();
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._triggerElement)
      .withPositions(positions);

    this._overlayRef = this._overlay.create({
      positionStrategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });

    // set accessibility attributes on the overlay pane so screen readers can associate the tooltip with its trigger
    this._overlayRef.overlayElement.setAttribute('role', 'tooltip');
    this._overlayRef.overlayElement.setAttribute('id', this._tooltipId);
  }

  private _getPositionStrategies(): ConnectedPosition[] {
    const xPos = this.tooltipXPosition();
    const yPos = this.tooltipYPosition();

    const xMapping = {
      left: { originX: 'start' as const, overlayX: 'end' as const, offsetX: -8 },
      center: { originX: 'center' as const, overlayX: 'center' as const, offsetX: 0 },
      right: { originX: 'end' as const, overlayX: 'start' as const, offsetX: 8 },
    };

    const yMapping = {
      top: { originY: 'top' as const, overlayY: 'bottom' as const, offsetY: -8 },
      center: { originY: 'center' as const, overlayY: 'center' as const, offsetY: 0 },
      bottom: { originY: 'bottom' as const, overlayY: 'top' as const, offsetY: 8 },
    };

    const primary: ConnectedPosition = {
      ...xMapping[xPos],
      ...yMapping[yPos],
    };

    const fallbacks: ConnectedPosition[] = [];

    if (yPos !== 'center') {
      const oppositeY = yPos === 'top' ? 'bottom' : 'top';

      fallbacks.push({
        ...xMapping[xPos],
        ...yMapping[oppositeY],
      });
    }

    if (xPos !== 'center') {
      const oppositeX = xPos === 'left' ? 'right' : 'left';

      fallbacks.push({
        ...xMapping[oppositeX],
        ...yMapping[yPos],
      });
    }

    if (xPos !== 'center' || yPos !== 'center') {
      fallbacks.push({
        ...xMapping.center,
        ...yMapping.center,
      });
    }

    return [primary, ...fallbacks];
  }

  private _attachTooltipHoverListeners(): void {
    if (!this._overlayRef || this._hoverListenersAttached) {
      return;
    }

    const overlayElement = this._overlayRef.overlayElement;

    overlayElement.addEventListener('mouseenter', this._onTooltipMouseEnter);
    overlayElement.addEventListener('mouseleave', this._onTooltipMouseLeave);
    this._hoverListenersAttached = true;
  }

  private _detachTooltipHoverListeners(): void {
    if (!this._overlayRef || !this._hoverListenersAttached) {
      return;
    }

    const overlayElement = this._overlayRef.overlayElement;

    overlayElement.removeEventListener('mouseenter', this._onTooltipMouseEnter);
    overlayElement.removeEventListener('mouseleave', this._onTooltipMouseLeave);
    this._hoverListenersAttached = false;
  }

  private _onTooltipMouseEnter = (): void => {
    this._clearCloseTimeout();

    this._state.update((state) => ({
      ...state,
      isHoveringTooltip: true,
    }));
  };

  private _onTooltipMouseLeave = (): void => {
    this._state.update((state) => ({
      ...state,
      isHoveringTooltip: false,
    }));

    this._scheduleClose();
  };

  private _clearOpenTimeout(): void {
    if (this._openTimeoutId !== null) {
      window.clearTimeout(this._openTimeoutId);
      this._openTimeoutId = null;
    }
  }

  private _clearCloseTimeout(): void {
    if (this._closeTimeoutId !== null) {
      window.clearTimeout(this._closeTimeoutId);
      this._closeTimeoutId = null;
    }
  }

  private _clearTimeouts(): void {
    this._clearOpenTimeout();
    this._clearCloseTimeout();
  }

  private get _triggerElement(): HTMLElement {
    return (this._elementRef.nativeElement.firstElementChild as HTMLElement) ?? this._elementRef.nativeElement;
  }
}
