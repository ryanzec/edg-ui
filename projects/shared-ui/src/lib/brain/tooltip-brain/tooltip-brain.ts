import {
  DestroyRef,
  Directive,
  ElementRef,
  Injector,
  InjectionToken,
  OnDestroy,
  Signal,
  TemplateRef,
  ViewContainerRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkObserveContent } from '@angular/cdk/observers';
import { v4 as uuidv4 } from 'uuid';
import { logManager } from '@organization/shared-utils';

/** all valid tooltip trigger type values */
export const allTooltipTriggerTypes = ['hover', 'click'] as const;

/** how the tooltip is triggered */
export type TooltipTriggerType = (typeof allTooltipTriggerTypes)[number];

/** all valid tooltip placement values; 4 sides × 3 alignments */
export const allTooltipPlacementValues = [
  'top-start',
  'top',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end',
] as const;

/** placement of the tooltip relative to the trigger */
export type TooltipPlacement = (typeof allTooltipPlacementValues)[number];

/** all valid tooltip lifecycle phase values */
export const allTooltipPhaseValues = ['closed', 'opening', 'open', 'closing'] as const;

/** the lifecycle phase of the tooltip used to drive entrance / exit motion via data-state on the surface */
export type TooltipPhase = (typeof allTooltipPhaseValues)[number];

/** default value for the triggerType input */
export const TOOLTIP_TRIGGER_TYPE_DEFAULT: TooltipTriggerType = 'hover';

/** default value for the openDelay input (milliseconds) */
export const TOOLTIP_OPEN_DELAY_DEFAULT = 200;

/** default value for the closeDelay input (milliseconds) */
export const TOOLTIP_CLOSE_DELAY_DEFAULT = 0;

/** default value for the keepOpenOnHover input */
export const TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT = false;

/** default value for the placement input */
export const TOOLTIP_PLACEMENT_DEFAULT: TooltipPlacement = 'top';

/**
 * shape of the contextual data provided to the portaled tooltip surface so it can read brain-resolved placement
 * (after any auto-flip) and brain-driven phase (for css transitions) without coupling the surface to the brain
 * directly.
 */
export type TooltipOverlayContext = {
  resolvedPlacement: Signal<TooltipPlacement>;
  phase: Signal<TooltipPhase>;
};

/**
 * injection token used by the brain to provide overlay context (resolved placement + lifecycle phase) to the
 * portaled surface. resolves to undefined when the surface is rendered outside an overlay context, in which case
 * the surface falls back to its own inputs.
 */
export const TOOLTIP_OVERLAY_CONTEXT = new InjectionToken<TooltipOverlayContext>('TooltipOverlayContext');

/** internal state shape for the tooltip brain directive */
type TooltipBrainState = {
  phase: TooltipPhase;
  isHoveringTooltip: boolean;
  resolvedPlacement: TooltipPlacement;
};

/** numeric pixel offset between trigger and tooltip; matches --tooltip-anchor-offset (var(--spacing-2) = 8px) */
const PLACEMENT_OFFSET = 8;

/** total duration of the open / close transition (must match --tooltip-motion-duration = --motion-duration-fast) */
const PHASE_TRANSITION_DURATION_MS = 100;

/** maps each declared placement to its primary cdk overlay connection position */
const PLACEMENT_TO_POSITION: Record<TooltipPlacement, ConnectedPosition> = {
  'top-start': { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -PLACEMENT_OFFSET },
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -PLACEMENT_OFFSET },
  'top-end': { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -PLACEMENT_OFFSET },
  'bottom-start': {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: PLACEMENT_OFFSET,
  },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: PLACEMENT_OFFSET },
  'bottom-end': { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: PLACEMENT_OFFSET },
  'right-start': { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: PLACEMENT_OFFSET },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: PLACEMENT_OFFSET },
  'right-end': { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: PLACEMENT_OFFSET },
  'left-start': { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -PLACEMENT_OFFSET },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -PLACEMENT_OFFSET },
  'left-end': { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -PLACEMENT_OFFSET },
};

/** opposite-side mapping used to build the auto-flip fallback chain */
const OPPOSITE_PLACEMENT: Record<TooltipPlacement, TooltipPlacement> = {
  'top-start': 'bottom-start',
  top: 'bottom',
  'top-end': 'bottom-end',
  'bottom-start': 'top-start',
  bottom: 'top',
  'bottom-end': 'top-end',
  'right-start': 'left-start',
  right: 'left',
  'right-end': 'left-end',
  'left-start': 'right-start',
  left: 'right',
  'left-end': 'right-end',
};

/**
 * derives one of the 12 placement keys from a cdk connection position. used after auto-flip resolves so the surface
 * can re-orient its arrow toward the actually-rendered side.
 */
function deriveResolvedPlacement(connection: ConnectedPosition): TooltipPlacement {
  if (connection.originY === 'top' && connection.overlayY === 'bottom') {
    if (connection.originX === 'start') {
      return 'top-start';
    }

    if (connection.originX === 'end') {
      return 'top-end';
    }

    return 'top';
  }

  if (connection.originY === 'bottom' && connection.overlayY === 'top') {
    if (connection.originX === 'start') {
      return 'bottom-start';
    }

    if (connection.originX === 'end') {
      return 'bottom-end';
    }

    return 'bottom';
  }

  if (connection.originX === 'end' && connection.overlayX === 'start') {
    if (connection.originY === 'top') {
      return 'right-start';
    }

    if (connection.originY === 'bottom') {
      return 'right-end';
    }

    return 'right';
  }

  if (connection.originX === 'start' && connection.overlayX === 'end') {
    if (connection.originY === 'top') {
      return 'left-start';
    }

    if (connection.originY === 'bottom') {
      return 'left-end';
    }

    return 'left';
  }

  return TOOLTIP_PLACEMENT_DEFAULT;
}

/**
 * headless brain directive for the tooltip. owns the closed → opening → open → closing → closed lifecycle, the cdk
 * overlay and portal lifecycle, position resolution (with auto-flip fallback), the optional keep-open-on-hover
 * behaviour, click-outside / escape dismissal for click triggers, the aria-describedby wiring on the trigger, and
 * full cleanup. resolves the trigger element from the first projected child of its host and stays in sync with
 * mutations via cdkObserveContent. consumers can override the auto-resolved trigger via setTriggerElement when
 * projection-based resolution is not appropriate. the brain provides a TOOLTIP_OVERLAY_CONTEXT to the portaled
 * surface so the surface can consume the resolved placement (after auto-flip) and lifecycle phase without
 * depending on the brain directly.
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
  private readonly _injector = inject(Injector);
  private readonly _cdkObserveContent = inject(CdkObserveContent);
  private readonly _destroyRef = inject(DestroyRef);

  /** unique id used to associate the tooltip overlay with its trigger via aria-describedby */
  private readonly _tooltipId = `tooltip-${uuidv4()}`;

  private readonly _state = signal<TooltipBrainState>({
    phase: 'closed',
    isHoveringTooltip: false,
    resolvedPlacement: TOOLTIP_PLACEMENT_DEFAULT,
  });

  private readonly _triggerElement = signal<HTMLElement | null>(null);

  private readonly _activeTemplateRef = signal<TemplateRef<unknown> | null>(null);

  private _overlayRef: OverlayRef | null = null;
  private _portal: TemplatePortal | null = null;
  private _portalInjector: Injector | null = null;
  private _openTimeoutId: number | null = null;
  private _closeTimeoutId: number | null = null;
  private _phaseTransitionTimeoutId: number | null = null;
  private _openingFrameId: number | null = null;
  private _hoverListenersAttached = false;
  private _hasManualTriggerOverride = false;
  private _onDocumentEscape: ((event: KeyboardEvent) => void) | null = null;
  private _backdropClickSubscriptionDispose: (() => void) | null = null;

  /** how the tooltip is triggered */
  public readonly triggerType = input<TooltipTriggerType>(TOOLTIP_TRIGGER_TYPE_DEFAULT);

  /**
   * template for the tooltip content. optional because the brain is most commonly used through the org-tooltip
   * wrapper, which supplies its content-projected template via setTemplate(). consumers who use the brain directly
   * may bind to this input instead.
   */
  public readonly templateRef = input<TemplateRef<unknown> | undefined>(undefined);

  /** delay in milliseconds before showing the tooltip */
  public readonly openDelay = input<number>(TOOLTIP_OPEN_DELAY_DEFAULT);

  /** delay in milliseconds before hiding the tooltip */
  public readonly closeDelay = input<number>(TOOLTIP_CLOSE_DELAY_DEFAULT);

  /** whether to keep the tooltip open when hovering over its overlay */
  public readonly keepOpenOnHover = input<boolean>(TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT);

  /** placement of the tooltip relative to the trigger (one of 12 = 4 sides × 3 alignments) */
  public readonly placement = input<TooltipPlacement>(TOOLTIP_PLACEMENT_DEFAULT);

  /** emitted when the tooltip opens */
  public readonly opened = output<void>();

  /** emitted when the tooltip closes */
  public readonly closed = output<void>();

  /** the resolved trigger element used to anchor the overlay and own aria-describedby */
  public readonly triggerElement = this._triggerElement.asReadonly();

  /**
   * the placement actually used after cdk overlay applies any auto-flip fallback. the surface reads this via
   * TOOLTIP_OVERLAY_CONTEXT to keep its arrow pointing at the trigger.
   */
  public readonly resolvedPlacement: Signal<TooltipPlacement> = computed(() => this._state().resolvedPlacement);

  /** the current lifecycle phase. consumed by the surface via TOOLTIP_OVERLAY_CONTEXT to drive css transitions. */
  public readonly phase: Signal<TooltipPhase> = computed(() => this._state().phase);

  constructor() {
    /** keep the internal template signal in sync with the input so direct consumers of the brain still work */
    effect(() => {
      const inputTemplate = this.templateRef();

      if (!inputTemplate) {
        return;
      }

      this._activeTemplateRef.set(inputTemplate);
    });

    /** recreate the portal whenever the active template reference changes so the overlay always reflects the latest */
    effect(() => {
      const contentTemplate = this._activeTemplateRef();

      if (!contentTemplate) {
        this._portal = null;

        return;
      }

      this._portalInjector = this._buildPortalInjector();
      this._portal = new TemplatePortal(contentTemplate, this._viewContainerRef, undefined, this._portalInjector);
    });

    /** when placement input changes while the overlay is open, swap the position strategy in place */
    effect(() => {
      const placement = this.placement();
      const trigger = this._triggerElement();

      if (!this._overlayRef || !trigger) {
        return;
      }

      this._overlayRef.updatePositionStrategy(this._buildPositionStrategy(trigger, placement));
    });

    afterNextRender(() => {
      this._autoResolveTriggerElement();
    });

    this._cdkObserveContent.event.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._autoResolveTriggerElement();
    });
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this._clearTimeouts();
    this._cancelOpeningFrame();
    this._detachTooltipHoverListeners();
    this._detachEscapeListener();
    this._detachBackdropListener();

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

  /**
   * sets the tooltip content template programmatically. the org-tooltip wrapper component uses this to forward its
   * content-projected <ng-template tooltipContent> into the brain so consumers can compose the surface as a real dom
   * child rather than passing a template ref input.
   */
  public setTemplate(template: TemplateRef<unknown> | null): void {
    this._activeTemplateRef.set(template);
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

    if (this._isVisuallyOpen()) {
      this._beginClose();

      return;
    }

    this._beginOpen();
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

    if (this._isVisuallyOpen()) {
      return;
    }

    this._openTimeoutId = window.setTimeout(() => {
      this._beginOpen();
    }, this.openDelay());
  }

  private _scheduleClose(): void {
    this._clearOpenTimeout();

    if (!this._isVisuallyOpen()) {
      return;
    }

    this._closeTimeoutId = window.setTimeout(() => {
      if (this.keepOpenOnHover() && this._state().isHoveringTooltip) {
        return;
      }

      this._beginClose();
    }, this.closeDelay());
  }

  private _beginOpen(): void {
    if (this._isVisuallyOpen()) {
      return;
    }

    const trigger = this._triggerElement();

    if (!trigger) {
      return;
    }

    if (!this._portal) {
      logManager.warn({
        type: 'tooltip-missing-template',
        message:
          'tooltip cannot open without a content template. provide one via [templateRef] on the brain directive or via <ng-template tooltipContent> inside an org-tooltip wrapper.',
      });

      return;
    }

    this._cancelPhaseTransition();

    if (!this._overlayRef) {
      this._createOverlay(trigger);
    }

    if (this._portal && this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);

      if (this.triggerType() === 'hover' && this.keepOpenOnHover()) {
        this._attachTooltipHoverListeners();
      }

      if (this.triggerType() === 'click') {
        this._attachEscapeListener();
        this._attachBackdropListener();
      }
    }

    trigger.setAttribute('aria-describedby', this._tooltipId);

    this._state.update((state) => ({
      ...state,
      phase: 'opening',
    }));

    this.opened.emit();

    // flip to 'open' on the next animation frame so the css transition has a chance to start from the
    // 'opening' frame; rendering a fresh dom node + an attribute swap in the same paint would skip the entrance
    this._cancelOpeningFrame();
    this._openingFrameId = window.requestAnimationFrame(() => {
      this._openingFrameId = null;

      this._state.update((state) => ({
        ...state,
        phase: 'open',
      }));
    });
  }

  private _beginClose(): void {
    if (!this._isVisuallyOpen()) {
      return;
    }

    this._cancelOpeningFrame();
    this._cancelPhaseTransition();

    const trigger = this._triggerElement();

    if (trigger) {
      trigger.removeAttribute('aria-describedby');
    }

    this._state.update((state) => ({
      ...state,
      phase: 'closing',
      isHoveringTooltip: false,
    }));

    this._phaseTransitionTimeoutId = window.setTimeout(() => {
      this._phaseTransitionTimeoutId = null;
      this._completeClose();
    }, PHASE_TRANSITION_DURATION_MS);
  }

  private _completeClose(): void {
    this._detachTooltipHoverListeners();
    this._detachEscapeListener();
    this._detachBackdropListener();

    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }

    this._state.update((state) => ({
      ...state,
      phase: 'closed',
    }));

    this.closed.emit();
  }

  private _isVisuallyOpen(): boolean {
    const phase = this._state().phase;

    return phase === 'open' || phase === 'opening';
  }

  private _createOverlay(trigger: HTMLElement): void {
    const positionStrategy = this._buildPositionStrategy(trigger, this.placement());
    const isClickTrigger = this.triggerType() === 'click';

    this._overlayRef = this._overlay.create({
      positionStrategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      // click triggers use a transparent backdrop so we can dismiss on outside click without painting an overlay
      hasBackdrop: isClickTrigger,
      backdropClass: isClickTrigger ? 'cdk-overlay-transparent-backdrop' : '',
    });

    const overlayElement = this._overlayRef.overlayElement;

    overlayElement.setAttribute('id', this._tooltipId);
  }

  private _buildPositionStrategy(
    trigger: HTMLElement | null,
    placement: TooltipPlacement
  ): FlexibleConnectedPositionStrategy {
    const positions = this._getPositionsForPlacement(placement);
    // when first wired, the trigger may not be resolved yet — fall back to the host element so the strategy can be
    // built without throwing; the next placement effect run will swap it in
    const anchor = trigger ?? this._elementRef.nativeElement;

    const strategy = this._overlay.position().flexibleConnectedTo(anchor).withPositions(positions);

    strategy.positionChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((change) => {
      this._onPositionChange(change);
    });

    return strategy;
  }

  private _onPositionChange(change: ConnectedOverlayPositionChange): void {
    const resolved = deriveResolvedPlacement(change.connectionPair);

    this._state.update((state) => ({
      ...state,
      resolvedPlacement: resolved,
    }));
  }

  /**
   * builds the ordered position list used by the flexible position strategy: the requested placement first, then
   * the opposite side (auto-flip), then a center fallback so we always render somewhere on screen.
   */
  private _getPositionsForPlacement(placement: TooltipPlacement): ConnectedPosition[] {
    const primary = PLACEMENT_TO_POSITION[placement];
    const flipped = PLACEMENT_TO_POSITION[OPPOSITE_PLACEMENT[placement]];
    const center = PLACEMENT_TO_POSITION.top;

    return [primary, flipped, center];
  }

  private _buildPortalInjector(): Injector {
    const context: TooltipOverlayContext = {
      resolvedPlacement: this.resolvedPlacement,
      phase: this.phase,
    };

    return Injector.create({
      parent: this._injector,
      providers: [{ provide: TOOLTIP_OVERLAY_CONTEXT, useValue: context }],
    });
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

  private _attachEscapeListener(): void {
    if (this._onDocumentEscape) {
      return;
    }

    this._onDocumentEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (!this._isVisuallyOpen()) {
        return;
      }

      this._beginClose();
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

  private _attachBackdropListener(): void {
    if (!this._overlayRef || this._backdropClickSubscriptionDispose) {
      return;
    }

    const subscription = this._overlayRef.backdropClick().subscribe(() => {
      this._beginClose();
    });

    this._backdropClickSubscriptionDispose = () => subscription.unsubscribe();
  }

  private _detachBackdropListener(): void {
    if (!this._backdropClickSubscriptionDispose) {
      return;
    }

    this._backdropClickSubscriptionDispose();
    this._backdropClickSubscriptionDispose = null;
  }

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

  private _cancelPhaseTransition(): void {
    if (this._phaseTransitionTimeoutId !== null) {
      window.clearTimeout(this._phaseTransitionTimeoutId);
      this._phaseTransitionTimeoutId = null;
    }
  }

  private _cancelOpeningFrame(): void {
    if (this._openingFrameId !== null) {
      window.cancelAnimationFrame(this._openingFrameId);
      this._openingFrameId = null;
    }
  }

  private _clearTimeouts(): void {
    this._clearOpenTimeout();
    this._clearCloseTimeout();
    this._cancelPhaseTransition();
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
