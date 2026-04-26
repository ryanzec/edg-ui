import { Component, ViewChild } from '@angular/core';
import { EXAMPLENested2 } from '../nested2/nested2';
import { Button } from '../../../core/button/button';

@Component({
  selector: 'org-example-nested-1',
  imports: [EXAMPLENested2, Button],
  templateUrl: './nested1.html',
})
export class EXAMPLENested1 {
  @ViewChild('nested2Component')
  public readonly nested2Component!: EXAMPLENested2;

  public focusNestedElement() {
    this.nested2Component.inputComponent.inputRef.nativeElement.focus();
  }
}
