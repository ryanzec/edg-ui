import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'org-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  host: {
    role: 'log',
    'aria-live': 'polite',
  },
})
export class Chat {}
