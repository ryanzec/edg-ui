import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { Button } from '../button/button';
import { Tag } from '../tags/tag';
import { Textarea } from '../textarea/textarea';
import { TextareaToolbar } from '../textarea/textarea-toolbar';
import { TextareaToolbarItem } from '../textarea/textarea-toolbar-item';

/** represents a queued attachment chip rendered above the chat composer textarea */
export type ChatComposerAttachment = {
  id: string;
  label: string;
  removable?: boolean;
};

/** default value for the placeholder input */
export const CHAT_COMPOSER_PLACEHOLDER_DEFAULT = 'Ask anything...';

/** default value for the value input */
export const CHAT_COMPOSER_VALUE_DEFAULT = '';

/** default value for the attachments input */
export const CHAT_COMPOSER_ATTACHMENTS_DEFAULT: ChatComposerAttachment[] = [];

/** default value for the disabled input */
export const CHAT_COMPOSER_DISABLED_DEFAULT = false;

/** default value for the streaming input */
export const CHAT_COMPOSER_STREAMING_DEFAULT = false;

/** default value for the readonly input */
export const CHAT_COMPOSER_READONLY_DEFAULT = false;

/** default value for the showAttach input */
export const CHAT_COMPOSER_SHOW_ATTACH_DEFAULT = true;

/** default value for the showHint input */
export const CHAT_COMPOSER_SHOW_HINT_DEFAULT = true;

/** default value for the hintLabel input */
export const CHAT_COMPOSER_HINT_LABEL_DEFAULT = 'to send';

/** default value for the hintKey input */
export const CHAT_COMPOSER_HINT_KEY_DEFAULT = '↵';

/** default value for the sendAriaLabel input */
export const CHAT_COMPOSER_SEND_ARIA_LABEL_DEFAULT = 'Send';

/** default value for the stopAriaLabel input */
export const CHAT_COMPOSER_STOP_ARIA_LABEL_DEFAULT = 'Stop';

/** default value for the attachAriaLabel input */
export const CHAT_COMPOSER_ATTACH_ARIA_LABEL_DEFAULT = 'Attach';

/** default value for the streamingLabel input */
export const CHAT_COMPOSER_STREAMING_LABEL_DEFAULT = 'Streaming...';

/**
 * thin wrapper around `org-textarea` + `org-textarea-toolbar` that owns the chat thread composer chrome: the optional
 * attachments-chip row above the textarea and the streaming swap that flips the toolbar's built-in send button to a
 * red stop button while keeping the wrapper interactive. consumers project additional toolbar buttons (e.g. "Tools")
 * via the default `<ng-content />` slot which lands on the toolbar's left edge alongside the attach button.
 */
@Component({
  selector: 'org-chat-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Tag, Textarea, TextareaToolbar, TextareaToolbarItem],
  templateUrl: './chat-composer.html',
  styleUrl: './chat-composer.css',
  host: {
    '[attr.data-disabled]': 'disabled() ? "1" : "0"',
    '[attr.data-streaming]': 'streaming() ? "1" : "0"',
  },
})
export class ChatComposer {
  /** the form name applied to the inner textarea */
  public readonly name = input.required<string>();

  /** the placeholder rendered in the textarea when empty */
  public readonly placeholder = input<string>(CHAT_COMPOSER_PLACEHOLDER_DEFAULT);

  /** the textarea value; two-way bindable via [(value)] */
  public readonly value = model<string>(CHAT_COMPOSER_VALUE_DEFAULT);

  /** queued attachment chips rendered above the textarea (separate row, not inline) */
  public readonly attachments = input<ChatComposerAttachment[]>(CHAT_COMPOSER_ATTACHMENTS_DEFAULT);

  /** whether the composer is fully disabled (chips + textarea + buttons all dim, no interaction) */
  public readonly disabled = input<boolean>(CHAT_COMPOSER_DISABLED_DEFAULT);

  /** whether the composer is in streaming mode (textarea + attach disabled, send swaps to stop) */
  public readonly streaming = input<boolean>(CHAT_COMPOSER_STREAMING_DEFAULT);

  /** whether the textarea itself is readonly (still focusable, but value cannot change) */
  public readonly textareaReadonly = input<boolean>(CHAT_COMPOSER_READONLY_DEFAULT);

  /** whether to render the attach (+) button in the toolbar */
  public readonly showAttach = input<boolean>(CHAT_COMPOSER_SHOW_ATTACH_DEFAULT);

  /** whether to render the keyboard hint label in the toolbar */
  public readonly showHint = input<boolean>(CHAT_COMPOSER_SHOW_HINT_DEFAULT);

  /** descriptive text rendered after the kbd in the keyboard hint */
  public readonly hintLabel = input<string>(CHAT_COMPOSER_HINT_LABEL_DEFAULT);

  /** keyboard glyph rendered inside the kbd in the keyboard hint */
  public readonly hintKey = input<string>(CHAT_COMPOSER_HINT_KEY_DEFAULT);

  /** accessible label applied to the send icon button */
  public readonly sendAriaLabel = input<string>(CHAT_COMPOSER_SEND_ARIA_LABEL_DEFAULT);

  /** accessible label applied to the stop icon button (streaming mode) */
  public readonly stopAriaLabel = input<string>(CHAT_COMPOSER_STOP_ARIA_LABEL_DEFAULT);

  /** accessible label applied to the attach icon button */
  public readonly attachAriaLabel = input<string>(CHAT_COMPOSER_ATTACH_ARIA_LABEL_DEFAULT);

  /** the visible label rendered next to the stop button while streaming */
  public readonly streamingLabel = input<string>(CHAT_COMPOSER_STREAMING_LABEL_DEFAULT);

  /** emitted when the viewer activates the send affordance (button click or submit-key) while not streaming */
  public readonly sent = output<string>();

  /** emitted when the viewer activates the stop affordance while streaming */
  public readonly stopped = output<void>();

  /** emitted when the viewer activates the attach affordance */
  public readonly attached = output<void>();

  /** emitted when the viewer removes one of the queued attachment chips */
  public readonly attachmentRemoved = output<ChatComposerAttachment>();

  /** whether any attachments are currently queued */
  protected readonly hasAttachments = computed<boolean>(() => this.attachments().length > 0);

  /** whether the textarea must be disabled (true while disabled or streaming) */
  protected readonly isTextareaDisabled = computed<boolean>(() => this.disabled() || this.streaming());

  /** whether the attach affordance must be disabled (true while disabled or streaming) */
  protected readonly isAttachDisabled = computed<boolean>(() => this.disabled() || this.streaming());

  /** whether the send button must be disabled (true while disabled or value is empty) */
  protected readonly isSendDisabled = computed<boolean>(() => this.disabled() || this.value().trim().length === 0);

  /** whether the toolbar should render its built-in send button (hidden in streaming mode) */
  protected readonly showSendButton = computed<boolean>(() => !this.streaming());

  /** whether the toolbar should render its keyboard hint (hidden in streaming mode) */
  protected readonly showToolbarHint = computed<boolean>(() => !this.streaming() && this.showHint());

  /** handles the send affordance — emits the current value */
  protected onSend(): void {
    if (this.isSendDisabled()) {
      return;
    }

    this.sent.emit(this.value());
  }

  /** handles the stop affordance — emits the stopped event */
  protected onStop(): void {
    this.stopped.emit();
  }

  /** handles the attach affordance — emits the attached event */
  protected onAttach(): void {
    if (this.isAttachDisabled()) {
      return;
    }

    this.attached.emit();
  }

  /** handles attachment chip removal — emits the removed item */
  protected onAttachmentRemove(attachment: ChatComposerAttachment): void {
    this.attachmentRemoved.emit(attachment);
  }

  /** forwards the textarea's submit-key emission to the send pathway */
  protected onSubmitKeyPressed(): void {
    this.onSend();
  }
}
