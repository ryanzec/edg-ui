import { Component, inject } from '@angular/core';
import { EXAMPLENested2Store } from '../nested2-store';

@Component({
  selector: 'org-example-nested-2',
  templateUrl: './nested2.html',
})
export class EXAMPLENested2 {
  private readonly _store = inject(EXAMPLENested2Store);

  public readonly value = this._store.value;
}
