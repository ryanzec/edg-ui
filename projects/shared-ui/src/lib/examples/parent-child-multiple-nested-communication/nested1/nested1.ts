import { Component, inject } from '@angular/core';
import { EXAMPLENested2, Nested2Token } from '../nested2/nested2';
import { EXAMPLENested2_1, Nested2_1Token } from '../nested2-1/nested2-1';
import { EXAMPLENested2Store } from '../nested2-store';
import { Button } from '../../../core/button/button';

@Component({
  selector: 'org-example-nested-1',
  imports: [EXAMPLENested2, EXAMPLENested2_1, Button],
  providers: [
    { provide: EXAMPLENested2Store, useExisting: Nested2Token },
    { provide: EXAMPLENested2Store, useExisting: Nested2_1Token },
  ],
  templateUrl: './nested1.html',
})
export class EXAMPLENested1 {
  private readonly _store = inject(Nested2Token);
  private readonly _store2 = inject(Nested2_1Token);

  protected setValue() {
    this._store.setValue('value from nested level 1 for nested 2');
  }

  protected setValue2() {
    this._store2.setValue('value from nested level 1 for nested 2-1');
  }
}
