import { Injectable, computed, signal } from '@angular/core';

export type Nested2State = {
  value: string;
};

@Injectable()
export class EXAMPLENested2Store {
  private readonly _state = signal<Nested2State>({
    value: '',
  });

  public readonly value = computed<string>(() => this._state().value);

  public setValue(value: string) {
    this._state.update((state) => ({ ...state, value }));
  }
}
