import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  inject,
  input,
  output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkObserveContent } from '@angular/cdk/observers';
import scrollparent from 'scrollparent';
import { logManager } from '@organization/shared-utils';
import {
  AutoScrollBrainDirective,
  type AutoScrollScrollToBottomOptions,
  type AutoScrollState,
} from '../../brain/auto-scroll-brain/auto-scroll-brain';

export type {
  AutoScrollState,
  AutoScrollAriaLive,
  AutoScrollScrollToBottomOptions,
} from '../../brain/auto-scroll-brain/auto-scroll-brain';
export {
  allAutoScrollStates as autoScrollStates,
  allAutoScrollAriaLives,
} from '../../brain/auto-scroll-brain/auto-scroll-brain';

/** the default enabled value for the auto scroll component */
export const AUTO_SCROLL_ENABLED_DEFAULT = true;

@Component({
  selector: 'org-auto-scroll',
  templateUrl: './auto-scroll.html',
  styleUrl: './auto-scroll.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-auto-scroll-enabled]': 'autoScrollEnabled() ? "" : null',
  },
  hostDirectives: [
    {
      directive: AutoScrollBrainDirective,
      inputs: ['enabled: autoScrollEnabled', 'ariaLive'],
      outputs: ['stateChange', 'ready'],
    },
    {
      directive: CdkObserveContent,
      outputs: ['cdkObserveContent'],
    },
  ],
})
export class AutoScroll {
  private readonly _elementRef = inject(ElementRef);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cdkObserveContent = inject(CdkObserveContent);
  protected readonly brain = inject(AutoScrollBrainDirective, { self: true });

  public readonly autoScrollEnabled = input<boolean>(AUTO_SCROLL_ENABLED_DEFAULT);
  public readonly containerClass = input<string>('');

  public readonly stateChange = output<AutoScrollState>();
  public readonly ready = output<void>();

  @ViewChild('sentinelRef', { static: true })
  private _sentinelRef!: ElementRef<HTMLElement>;

  @ViewChild('contentWrapperRef', { static: true })
  private _contentWrapperRef!: ElementRef<HTMLElement>;

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      afterNextRender(() => {
        this._warnIfNoScrollableParent();
        this.brain.setSentinelElement(this._sentinelRef.nativeElement);
        this.brain.setContentWrapperElement(this._contentWrapperRef.nativeElement);
      });
    }

    this._cdkObserveContent.event.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.brain.notifyContentChanged();
    });
  }

  /** updates the brain's auto-scroll state */
  public setAutoScrollState(newState: AutoScrollState): void {
    this.brain.setAutoScrollState(newState);
  }

  /** returns the brain's current auto-scroll state */
  public getAutoScrollState(): AutoScrollState {
    return this.brain.getAutoScrollState();
  }

  /** programmatically scrolls to the bottom via the brain */
  public scrollToBottom(options?: AutoScrollScrollToBottomOptions): void {
    this.brain.scrollToBottom(options);
  }

  /** logs a warning when the auto-scroll has no usable scrollable ancestor; matches the original component contract */
  private _warnIfNoScrollableParent(): void {
    const parent = scrollparent(this._elementRef.nativeElement as HTMLElement);

    if (parent && parent !== document.documentElement && parent !== document.body) {
      return;
    }

    logManager.warn({
      type: 'auto-scroll-no-scrollable-parent',
      message:
        'no scrollable parent found for auto-scroll component. auto-scroll functionality will not be initialized.',
    });
  }
}
