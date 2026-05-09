import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChatBrainDirective } from '../../brain/chat-brain/chat-brain';

@Component({
  selector: 'org-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  hostDirectives: [
    {
      directive: ChatBrainDirective,
      inputs: ['role', 'ariaLive'],
    },
  ],
})
export class Chat {}
