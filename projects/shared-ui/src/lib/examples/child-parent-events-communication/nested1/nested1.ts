import { Component, output } from '@angular/core';
import { Button } from '../../../core/button/button';

@Component({
  selector: 'org-example-nested-1',
  imports: [Button],
  templateUrl: './nested1.html',
})
export class EXAMPLENested1 {
  public messageEvent = output<string>();

  public emitEvent() {
    this.messageEvent.emit('message from child');
  }
}
