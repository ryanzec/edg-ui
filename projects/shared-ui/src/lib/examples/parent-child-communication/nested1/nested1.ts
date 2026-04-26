import { Component, signal } from '@angular/core';
import { Button } from '../../../core/button/button';

@Component({
  selector: 'org-example-nested-1',
  imports: [Button],
  templateUrl: './nested1.html',
})
export class EXAMPLENested1 {
  private _value = signal<string>('');

  public readonly value = this._value.asReadonly();

  public setValue(value: string) {
    this._value.set(value);
  }
}
