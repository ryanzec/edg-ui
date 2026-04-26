import { Component, ViewChild } from '@angular/core';
import { Input } from '../../../core/input/input';
import { Button } from '../../../core/button/button';

@Component({
  selector: 'org-example-nested-2',
  templateUrl: './nested2.html',
  imports: [Input, Button],
})
export class EXAMPLENested2 {
  @ViewChild('inputComponent')
  public readonly inputComponent!: Input;

  public focusInput() {
    this.inputComponent.inputRef.nativeElement.focus();
  }
}
