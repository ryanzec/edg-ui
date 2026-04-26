import { Component, ViewChild } from '@angular/core';
import { EXAMPLENested1 } from './nested1/nested1';
import { Button } from '../../core/button/button';

@Component({
  selector: 'org-example-ref-forwarding',
  imports: [EXAMPLENested1, Button],
  templateUrl: './ref-forwarding.html',
})
export class EXAMPLERefForwarding {
  @ViewChild('nested1Component')
  public readonly nested1Component!: EXAMPLENested1;

  public focusNestedElement() {
    this.nested1Component.nested2Component.inputComponent.inputRef.nativeElement.focus();
  }
}
