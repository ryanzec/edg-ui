import {
  DestroyRef,
  Directive,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkObserveContent } from '@angular/cdk/observers';
import { v4 as uuidv4 } from 'uuid';
import { logManager } from '@organization/shared-utils';

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

/** default value for the triggerType input */
export const TOOLTIP_TRIGGER_TYPE_DEFAULT: TooltipTriggerType = 'hover';

/** default value for the openDelay input (milliseconds) */
export const TOOLTIP_OPEN_DELAY_DEFAULT = 200;

/** default value for the closeDelay input (milliseconds) */
export const TOOLTIP_CLOSE_DELAY_DEFAULT = 200;

/** default value for the keepOpenOnHover input */
export const TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT = false;

/** default value for the xPosition input */
export const TOOLTIP_X_POSITION_DEFAULT: TooltipXPosition = 'center';

/** default value for the yPosition input */
export const TOOLTIP_Y_POSITION_DEFAULT: TooltipYPosition = 'bottom';

/** the internal state shape for the tooltip brain directive */
type TooltipState = {
  isOpen: boolean;
  isHoveringTooltip: boolean;
};

/**
 * headless brain directive for the tooltip component. owns the open/close state machine, the cdk overlay and portal
 * lifecycle, position strategies, hover/focus debounce timeouts, the optional keep-open-on-tooltip-hover behaviour,
 * the aria-describedby wiring on the trigger, and cleanup. resolves the trigger element from the first projected
 * child of its host and stays in sync with mutations via cdkObserveContent. consumers can override the auto-resolved
 * trigger via setTriggerElement when projection-based resolution is not appropriate.
 */
@Directive({
  selector: '[orgTooltipBrain]',
  exportAs: 'orgTooltipBrain',
  hostDirectives: [CdkObserveContent],
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
  private readonly _cdkObserveContent = inject(CdkObserveContent);
  private readonly _destroyRef = inject(DestroyRef);

  /** unique id used to associate the tooltip overlay with its trigger via aria-describedby */
  private readonly _tooltipId = `tooltip-${uuidv4()}`;

  private readonly _state = signal<TooltipState>({
    isOpen: false,
    isHoveringTooltip: false,
  });

  private readonly _triggerElement = signal<HTMLElement | null>(null);

  private _overlayRef: OverlayRef | null = null;
  private _portal: TemplatePortal | null = null;
  private _openTimeoutId: number | null = null;
  private _closeTimeoutId: number | null = null;
  private _hoverListenersAttached = false;
  private _hasManualTriggerOverride = false;

  /** how the tooltip is triggered */
  public readonly triggerType = input<TooltipTriggerType>(TOOLTIP_TRIGGER_TYPE_DEFAULT);

  /** template for the tooltip content */
  public readonly templateRef = input.required<TemplateRef<unknown>>();

  /** delay in milliseconds before showing the tooltip */
  public readonly openDelay = input<number>(TOOLTIP_OPEN_DELAY_DEFAULT);

  /** delay in milliseconds before hiding the tooltip */
  public readonly closeDelay = input<number>(TOOLTIP_CLOSE_DELAY_DEFAULT);

  /** whether to keep the tooltip open when hovering over its overlay */
  public readonly keepOpenOnHover = input<boolean>(TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT);

  /** horizontal position of the tooltip relative to the trigger */
  public readonly xPosition = input<TooltipXPosition>(TOOLTIP_X_POSITION_DEFAULT);

  /** vertical position of the tooltip relative to the trigger */
  public readonly yPosition = input<TooltipYPosition>(TOOLTIP_Y_POSITION_DEFAULT);

  /** emitted when the tooltip opens */
  public readonly opened = output<void>();

  /** emitted when the tooltip closes */
  public readonly closed = output<void>();

  /** the resolved trigger element used to anchor the overlay and own aria-describedby */
  public readonly triggerElement = this._triggerElement.asReadonly();

  constructor() {
    /** recreate the portal whenever the template reference changes so the overlay always reflects the latest template */
    effect(() => {
      const contentTemplate = this.templateRef();

      this._portal = new TemplatePortal(contentTemplate, this._viewContainerRef);
    });

    /** keep state-derived data attributes on the overlay element in sync while the overlay is attached */
    effect(() => {
      const triggerType = this.triggerType();
      const xPosition = this.xPosition();
      const yPosition = this.yPosition();

      if (!this._overlayRef || !this._overlayRef.hasAttached()) {
        return;
      }

      const overlayElement = this._overlayRef.overlayElement;

      overlayElement.setAttribute('data-trigger-type', triggerType);
      overlayElement.setAttribute('data-x-position', xPosition);
      overlayElement.setAttribute('data-y-position', yPosition);
    });

    // resolve the trigger after the host's projected content has been rendered
    afterNextRender(() => {
      this._autoResolveTriggerElement();
    });

    // re-resolve when projected children mutate (e.g. trigger swapped via @if)
    this._cdkObserveContent.event.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._autoResolveTriggerElement();
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

  /**
   * overrides the auto-resolved trigger element. once called, the brain stops auto-resolving from projected children
   * and uses the explicitly provided element. pass null to clear and re-enable auto-resolution.
   */
  public setTriggerElement(element: HTMLElement | null): void {
    this._hasManualTriggerOverride = element !== null;
    this._triggerElement.set(element);
  }

  protected onTriggerMouseEnter(): void {
    if (this.triggerType() !== 'hover') {
      return;
    }

    this._scheduleOpen();
  }

  protected onTriggerMouseLeave(): void {
    if (this.triggerType() !== 'hover') {
      return;
    }

    this._scheduleClose();
  }

  protected onTriggerClick(): void {
    if (this.triggerType() !== 'click') {
      return;
    }

    if (this._state().isOpen) {
      this._closeTooltip();

      return;
    }

    this._openTooltip();
  }

  protected onTriggerFocusIn(): void {
    if (this.triggerType() !== 'hover') {
      return;
    }

    this._scheduleOpen();
  }

  protected onTriggerFocusOut(): void {
    if (this.triggerType() !== 'hover') {
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
    }, this.openDelay());
  }

  private _scheduleClose(): void {
    this._clearOpenTimeout();

    if (!this._state().isOpen) {
      return;
    }

    this._closeTimeoutId = window.setTimeout(() => {
      if (this.keepOpenOnHover() && this._state().isHoveringTooltip) {
        return;
      }

      this._closeTooltip();
    }, this.closeDelay());
  }

  private _openTooltip(): void {
    if (this._state().isOpen) {
      return;
    }

    const trigger = this._triggerElement();

    if (!trigger) {
      return;
    }

    this.opened.emit();

    if (!this._overlayRef) {
      this._createOverlay(trigger);
    }

    if (this._portal && this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);

      if (this.triggerType() === 'hover' && this.keepOpenOnHover()) {
        this._attachTooltipHoverListeners();
      }
    }

    trigger.setAttribute('aria-describedby', this._tooltipId);

    this._state.update((state) => ({
      ...state,
      isOpen: true,
    }));
  }

  private _closeTooltip(): void {
    if (!this._state().isOpen) {
      return;
    }

    this.closed.emit();

    const trigger = this._triggerElement();

    if (trigger) {
      trigger.removeAttribute('aria-describedby');
    }

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

  private _createOverlay(trigger: HTMLElement): void {
    const positions = this._getPositionStrategies();
    const positionStrategy = this._overlay.position().flexibleConnectedTo(trigger).withPositions(positions);

    this._overlayRef = this._overlay.create({
      positionStrategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });

    const overlayElement = this._overlayRef.overlayElement;

    // a11y wiring: the overlay element is the live region screen readers associate with the trigger
    overlayElement.setAttribute('role', 'tooltip');
    overlayElement.setAttribute('id', this._tooltipId);

    // state-derived attributes for css styling targeting on the overlay
    overlayElement.setAttribute('data-trigger-type', this.triggerType());
    overlayElement.setAttribute('data-x-position', this.xPosition());
    overlayElement.setAttribute('data-y-position', this.yPosition());
  }

  private _getPositionStrategies(): ConnectedPosition[] {
    const xPos = this.xPosition();
    const yPos = this.yPosition();

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

  /**
   * resolves the trigger element from the host's element children. skipped when an explicit override has been
   * provided via setTriggerElement. emits a warning when ambiguous (more than one element child).
   */
  private _autoResolveTriggerElement(): void {
    if (this._hasManualTriggerOverride) {
      return;
    }

    const elementChildren = this._elementRef.nativeElement.children;

    if (elementChildren.length === 0) {
      this._triggerElement.set(null);

      return;
    }

    if (elementChildren.length > 1) {
      logManager.warn({
        type: 'tooltip-multiple-trigger-elements',
        message:
          'tooltip received more than one element child as a trigger; using the first. wrap your trigger in a single element to suppress this warning.',
      });
    }

    this._triggerElement.set(elementChildren[0] as HTMLElement);
  }
}
