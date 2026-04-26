import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Icon, type IconName } from '../icon/icon';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { Button } from './button';

@Component({
  selector: 'org-button-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, LoadingSpinner],
  templateUrl: './button-icon.html',
  styleUrl: './button-icon.css',
})
export class ButtonIcon {
  /** reference to the parent button for shared size and loading state. */
  private readonly _buttonComponent = inject(Button, { host: true });

  /** the icon to render inside the button. */
  public readonly name = input.required<IconName>();

  /** resolved size, inherited from the parent button. */
  protected readonly size = computed(() => {
    const buttonSize = this._buttonComponent.size();

    if (buttonSize === 'sm') {
      return 'xs';
    }

    if (buttonSize === 'lg') {
      return '2xl';
    }

    return 'base';
  });

  /** true when this icon is the first button icon under the parent button. */
  protected readonly isFirst = computed<boolean>(() => this._buttonComponent.firstButtonIcon() === this);

  /** true when the parent is loading and this icon is the first one, so it renders as the spinner. */
  protected readonly showSpinner = computed<boolean>(() => this._buttonComponent.loading() && this.isFirst());

  /** true when the icon should render as an icon (parent is not loading). */
  protected readonly showIcon = computed<boolean>(() => !this._buttonComponent.loading());
}
