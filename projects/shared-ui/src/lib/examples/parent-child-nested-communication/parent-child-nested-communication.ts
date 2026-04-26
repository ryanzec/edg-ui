import { Component, inject } from '@angular/core';
import { EXAMPLENested1 } from './nested1/nested1';
import { EXAMPLENested2Store } from './nested2-store';

@Component({
  selector: 'org-example-parent-child-nested-communication',
  imports: [EXAMPLENested1],
  providers: [EXAMPLENested2Store],
  templateUrl: './parent-child-nested-communication.html',
})
export class EXAMPLEParentChildNestedCommunication {
  private readonly _store = inject(EXAMPLENested2Store);

  constructor() {
    this._store.setValue('initial value from parent');
  }
}
