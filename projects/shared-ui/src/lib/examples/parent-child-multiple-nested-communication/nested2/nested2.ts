import { Component, inject, InjectionToken } from '@angular/core';
import { EXAMPLENested2Store } from '../nested2-store';

export const Nested2Token = new InjectionToken<EXAMPLENested2Store>('Nested2Token');
@Component({
  selector: 'org-example-nested-2',
  templateUrl: './nested2.html',
  providers: [
    {
      provide: EXAMPLENested2Store,
      useExisting: Nested2Token,
    },
  ],
})
export class EXAMPLENested2 {
  private readonly _store = inject(Nested2Token);

  public readonly value = this._store.value;
}
