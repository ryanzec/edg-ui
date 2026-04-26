import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  inject,
  output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { TABS_COMPONENT } from './tabs';

/** default value for the disabled input */
export const TAB_DISABLED_DEFAULT = false;

@Component({
  selector: 'org-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tab.html',
  styleUrl: './tab.css',
  host: {
    '[attr.data-value]': 'value()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class Tab {
  private readonly _tabsComponent = inject(TABS_COMPONENT);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  @ViewChild('buttonRef')
  private readonly buttonRef!: ElementRef<HTMLButtonElement>;

  /** the value that identifies this tab */
  public value = input.required<string>();

  /** whether this tab is disabled */
  public disabled = input<boolean>(TAB_DISABLED_DEFAULT);

  /** emitted when the tab is clicked */
  public clicked = output<string>();

  /** whether this tab is the currently active tab */
  protected readonly isActive = computed<boolean>(() => {
    return this._tabsComponent.value() === this.value();
  });

  protected onClick(): void {
    if (this.disabled()) {
      return;
    }

    this._tabsComponent.value.set(this.value());
    this.clicked.emit(this.value());
  }

  /** focuses the inner button element */
  public focus(): void {
    this.buttonRef.nativeElement.focus();
  }

  /** scrolls the inner button element into view */
  public scrollIntoView(options?: ScrollIntoViewOptions): void {
    this.buttonRef.nativeElement.scrollIntoView(options);
  }

  /** whether the inner button element currently has focus */
  public hasFocus(): boolean {
    return document.activeElement === this.buttonRef.nativeElement;
  }

  /**
   * @internal Only exposed for testing purposes
   */
  public get _element(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
