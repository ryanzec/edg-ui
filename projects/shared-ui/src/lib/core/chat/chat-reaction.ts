import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { ChatReactionBrainDirective } from '../../brain/chat-reaction-brain/chat-reaction-brain';

/** default value for the emoji input */
export const CHAT_REACTION_EMOJI_DEFAULT = '';

/** default value for the count input */
export const CHAT_REACTION_COUNT_DEFAULT = 0;

/** default value for the selected model */
export const CHAT_REACTION_SELECTED_DEFAULT = false;

/** default value for the disabled input */
export const CHAT_REACTION_DISABLED_DEFAULT = false;

/**
 * single reaction chip rendered inside an `org-chat-reactions` row. the inner button hosts
 * `ChatReactionBrainDirective`, which owns the selected toggle state, the click handler, and the aria-pressed
 * attribute. the presentation carries the chrome (chip surface, count display, selected accent).
 */
@Component({
  selector: 'org-chat-reaction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatReactionBrainDirective],
  templateUrl: './chat-reaction.html',
  styleUrl: './chat-reaction.css',
  host: {
    '[attr.data-selected]': 'selected() ? "1" : "0"',
  },
})
export class ChatReaction {
  /** the emoji rendered as the pre glyph of the chip */
  public readonly emoji = input<string>(CHAT_REACTION_EMOJI_DEFAULT);

  /** the count rendered after the emoji */
  public readonly count = input<number>(CHAT_REACTION_COUNT_DEFAULT);

  /** whether the chip is currently selected by the viewer; two-way bindable via [(selected)] */
  public readonly selected = model<boolean>(CHAT_REACTION_SELECTED_DEFAULT);

  /** whether the chip is disabled */
  public readonly disabled = input<boolean>(CHAT_REACTION_DISABLED_DEFAULT);

  /** emitted when the reaction is toggled by the viewer; payload is the requested next selected value */
  public readonly toggled = output<boolean>();

  /** the count formatted for display; only shown when greater than zero */
  protected readonly hasCount = computed<boolean>(() => this.count() > 0);

  /** forwards the brain's toggled emission and updates the model */
  protected onBrainToggled(next: boolean): void {
    this.selected.set(next);
    this.toggled.emit(next);
  }
}
