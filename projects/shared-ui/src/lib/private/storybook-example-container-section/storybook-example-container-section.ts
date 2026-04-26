import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'org-storybook-example-container-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './storybook-example-container-section.html',
  host: {},
})
export class StorybookExampleContainerSection {
  public label = input.required<string>();
}
