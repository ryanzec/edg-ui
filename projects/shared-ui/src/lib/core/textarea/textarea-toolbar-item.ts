import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'org-textarea-toolbar-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class TextareaToolbarItem {}
