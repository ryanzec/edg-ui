import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScrollArea } from '../scroll-area/scroll-area';

@Component({
  selector: 'org-dialog-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollArea],
  templateUrl: './dialog-content.html',
  styleUrl: './dialog-content.css',
})
export class DialogContent {}
