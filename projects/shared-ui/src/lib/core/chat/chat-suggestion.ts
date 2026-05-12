import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { Icon } from '../icon/icon';
import { type IconName } from '../../brain/icon-brain/icon-brain';

/** default value for the label input */
export const CHAT_SUGGESTION_LABEL_DEFAULT = '';

/** default value for the icon input */
export const CHAT_SUGGESTION_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the disabled input */
export const CHAT_SUGGESTION_DISABLED_DEFAULT = false;

/**
 * single suggestion chip rendered inside an `org-chat-suggestions` row. plain button surface — emits `clicked`
 * when activated and lets the consumer decide what to do with it.
 */
@Component({
  selector: 'org-chat-suggestion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './chat-suggestion.html',
  styleUrl: './chat-suggestion.css',
})
export class ChatSuggestion {
  /** the visible label rendered inside the chip */
  public readonly label = input<string>(CHAT_SUGGESTION_LABEL_DEFAULT);

  /** optional pre icon rendered before the label */
  public readonly icon = input<IconName | undefined, IconName | null | undefined>(CHAT_SUGGESTION_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the chip is disabled */
  public readonly disabled = input<boolean>(CHAT_SUGGESTION_DISABLED_DEFAULT);

  /** emitted when the suggestion is activated by the viewer */
  public readonly clicked = output<void>();

  /** handles button activation */
  protected onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.clicked.emit();
  }
}
