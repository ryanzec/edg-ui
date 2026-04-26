import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'org-dialog-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-content.html',
  styleUrl: './dialog-content.css',
})
export class DialogContent {}
