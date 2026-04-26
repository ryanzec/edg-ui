import { Component, inject, InjectionToken } from '@angular/core';
import { EXAMPLENested2Store } from '../nested2-store';

export const Nested2_1Token = new InjectionToken<EXAMPLENested2Store>('Nested2_1Token');

@Component({
  selector: 'org-example-nested-2-1',
  templateUrl: './nested2-1.html',
  providers: [
    {
      provide: EXAMPLENested2Store,
      useExisting: Nested2_1Token,
    },
  ],
})
export class EXAMPLENested2_1 {
  private readonly _store = inject(Nested2_1Token);

  public readonly value = this._store.value;
}
