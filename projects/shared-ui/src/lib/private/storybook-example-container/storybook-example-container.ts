import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { cssUtils } from '@organization/shared-utils';

@Component({
  selector: 'org-storybook-example-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './storybook-example-container.html',
  host: {
    class: 'text-sm',
  },
})
export class StorybookExampleContainer {
  public title = input<string>('');
  public currentState = input<string>('');
  public containerClass = input<string>('');

  public mergeClasses = cssUtils.merge;
}
