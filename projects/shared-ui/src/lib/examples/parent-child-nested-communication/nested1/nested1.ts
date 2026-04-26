import { Component, inject } from '@angular/core';
import { EXAMPLENested2 } from '../nested2/nested2';
import { EXAMPLENested2Store } from '../nested2-store';
import { Button } from '../../../core/button/button';

@Component({
  selector: 'org-example-nested-1',
  imports: [EXAMPLENested2, Button],
  templateUrl: './nested1.html',
})
export class EXAMPLENested1 {
  private readonly _store = inject(EXAMPLENested2Store);

  protected setValue() {
    this._store.setValue('value from nested level 1');
  }
}
