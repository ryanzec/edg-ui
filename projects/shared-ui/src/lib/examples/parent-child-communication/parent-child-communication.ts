import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { EXAMPLENested1 } from './nested1/nested1';

@Component({
  selector: 'org-example-parent-child-communication',
  imports: [EXAMPLENested1],
  templateUrl: './parent-child-communication.html',
})
export class EXAMPLEParentChildCommunication implements AfterViewInit {
  @ViewChild('child1')
  private readonly child1Ref!: EXAMPLENested1;

  public ngAfterViewInit(): void {
    this.child1Ref.setValue('value from parent');
  }
}
