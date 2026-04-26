import { Component, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils, logManager } from '@organization/shared-utils';

/** default value for the asLabel input */
export const LABEL_AS_LABEL_DEFAULT = true;

/** default value for the isLoading input */
export const LABEL_IS_LOADING_DEFAULT = false;

/** default value for the isRequired input */
export const LABEL_IS_REQUIRED_DEFAULT = false;

/** default value for the htmlFor input */
export const LABEL_HTML_FOR_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner, NgTemplateOutlet],
  templateUrl: './label.html',
  styleUrl: './label.css',
  host: {
    '[attr.data-as-label]': 'asLabel() ? "" : null',
    '[attr.data-is-loading]': 'isLoading() ? "" : null',
    '[attr.data-is-required]': 'isRequired() ? "" : null',
  },
})
export class Label {
  /** whether to render as a native label element; when false, renders as a div */
  public readonly asLabel = input<boolean>(LABEL_AS_LABEL_DEFAULT);

  /** the visible label text */
  public readonly label = input.required<string>();

  /** whether to show the loading spinner */
  public readonly isLoading = input<boolean>(LABEL_IS_LOADING_DEFAULT);

  /** whether to show the required field indicator */
  public readonly isRequired = input<boolean>(LABEL_IS_REQUIRED_DEFAULT);

  /** the html for attribute value linking the label to its form control */
  public readonly htmlFor = input<string | undefined, string | null | undefined>(LABEL_HTML_FOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  constructor() {
    // validates that htmlFor is provided when rendering as a native label element
    effect(() => {
      if (this.asLabel() && !this.htmlFor()) {
        logManager.error({
          type: 'label-missing-html-for',
          message: 'htmlFor input is required when asLabel is set to true',
        });
      }
    });
  }
}
