import { Component, signal } from '@angular/core';
import { EXAMPLENested1 } from './nested1/nested1';

@Component({
  selector: 'org-example-child-parent-events-communication',
  imports: [EXAMPLENested1],
  templateUrl: './child-parent-events-communication.html',
})
export class EXAMPLEChildParentEventsCommunication {
  private _message = signal<string>('');

  protected readonly message = this._message.asReadonly();

  public receiveMessage(message: string) {
    this._message.set(message);
  }
}
