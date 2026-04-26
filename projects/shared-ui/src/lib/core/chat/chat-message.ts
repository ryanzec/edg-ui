import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { DateTime } from 'luxon';
import { Indicator } from '../indicator/indicator';
import { ChatMessageSteps } from './chat-message-steps';
import type { ChecklistItemData } from '../checklist/checklist';

/** all available chat message status values */
export const allChatMessageStatuses = ['in-progress', 'completed', 'failed'] as const;

/** the status of an ai-driven chat message */
export type ChatMessageStatus = (typeof allChatMessageStatuses)[number];

/** all available chat message source values */
export const allChatMessageSources = ['user', 'ai', 'system'] as const;

/** the originator of a chat message */
export type ChatMessageSource = (typeof allChatMessageSources)[number];

/** the data shape for a single chat message */
export type ChatMessageData = {
  /** unique id for the message */
  id: string;
  /** the text content of the message */
  message: string;
  /** optional processing status for ai messages */
  status?: ChatMessageStatus;
  /** optional ordered list of steps taken to produce the message */
  steps?: ChecklistItemData[];
  /** iso formatted date string for when processing started */
  startedAt?: string;
  /** iso formatted date string for when processing completed */
  completedAt?: string;
  /** the originator of the message */
  source: ChatMessageSource;
};

@Component({
  selector: 'org-chat-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator, ChatMessageSteps],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
  host: {
    '[attr.data-source]': 'messageSource()',
    '[attr.data-status]': 'chatMessage().status ?? null',
  },
})
export class ChatMessage {
  /** the message data to render */
  public chatMessage = input.required<ChatMessageData>();

  /** the source of the message, reflected as a host attribute for styling */
  protected readonly messageSource = computed<ChatMessageSource>(() => this.chatMessage().source);

  /** whether the message has a status value */
  protected hasStatus = computed<boolean>(() => {
    return !!this.chatMessage().status;
  });

  /** whether the message has both a start and end time for duration display */
  protected hasDuration = computed<boolean>(() => {
    const message = this.chatMessage();

    return !!message.startedAt && !!message.completedAt;
  });

  /** the human-readable label for the current status */
  protected statusDisplay = computed<string>(() => {
    const status = this.chatMessage().status;

    if (!status) {
      return '';
    }

    if (status === 'in-progress') {
      return 'In Progress';
    }

    if (status === 'completed') {
      return 'Completed';
    }

    if (status === 'failed') {
      return 'Failed';
    }

    return '';
  });

  /** the indicator color mapped from the current status */
  protected statusIndicatorColor = computed<'info' | 'safe' | 'danger'>(() => {
    const status = this.chatMessage().status;

    if (status === 'in-progress') {
      return 'info';
    }

    if (status === 'completed') {
      return 'safe';
    }

    return 'danger';
  });

  /** the formatted elapsed time between startedAt and completedAt */
  protected durationDisplay = computed<string>(() => {
    const message = this.chatMessage();

    if (!message.startedAt || !message.completedAt) {
      return '';
    }

    const start = DateTime.fromISO(message.startedAt);
    const end = DateTime.fromISO(message.completedAt);
    const diff = end.diff(start, ['minutes', 'seconds']);

    const minutes = Math.floor(diff.minutes);
    const seconds = Math.floor(diff.seconds);

    if (minutes === 0) {
      return `${seconds}s`;
    }

    if (seconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${seconds}s`;
  });
}
