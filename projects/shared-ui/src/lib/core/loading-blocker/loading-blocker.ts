import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

export const LOADING_BLOCKER_IS_VISIBLE_DEFAULT = false;
export const LOADING_BLOCKER_TEXT_DEFAULT = '';

@Component({
  selector: 'org-loading-blocker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTrapFocus, LoadingSpinner],
  templateUrl: './loading-blocker.html',
  styleUrl: './loading-blocker.css',
  host: {
    '[attr.data-visible]': 'isVisible() ? "" : null',
  },
})
export class LoadingBlocker {
  public isVisible = input<boolean>(LOADING_BLOCKER_IS_VISIBLE_DEFAULT);
  public text = input<string>(LOADING_BLOCKER_TEXT_DEFAULT);
}
