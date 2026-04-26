import { Component, inject } from '@angular/core';
import { EXAMPLENested1 } from './nested1/nested1';
import { EXAMPLENested2Store } from './nested2-store';
import { Nested2Token } from './nested2/nested2';
import { Nested2_1Token } from './nested2-1/nested2-1';

@Component({
  selector: 'org-example-parent-child-multiple-nested-communication',
  imports: [EXAMPLENested1],
  providers: [
    { provide: Nested2Token, useClass: EXAMPLENested2Store },
    { provide: Nested2_1Token, useClass: EXAMPLENested2Store },
  ],
  templateUrl: './parent-child-multiple-nested-communication.html',
})
export class EXAMPLEParentChildMultipleNestedCommunication {
  private readonly _store = inject(Nested2Token);
  private readonly _store_1 = inject(Nested2_1Token);

  constructor() {
    this._store.setValue('initial value from parent for nested 2');
    this._store_1.setValue('initial value from parent for nested 2-1');
  }
}
