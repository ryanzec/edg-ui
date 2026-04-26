import { Component, signal } from '@angular/core';

@Component({
  selector: 'org-example-child-parent-callback-communication',
  templateUrl: './child-parent-callback-communication.html',
})
export class EXAMPLEChildParentCallbackCommunication {
  private _message = signal<string>('');

  protected readonly message = this._message.asReadonly();

  public receiveMessage(message: string) {
    this._message.set(message);
  }
}
