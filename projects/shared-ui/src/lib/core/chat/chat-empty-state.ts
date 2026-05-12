import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { Icon } from '../icon/icon';
import { type IconName } from '../../brain/icon-brain/icon-brain';

/** default value for the icon input */
export const CHAT_EMPTY_STATE_ICON_DEFAULT: IconName | undefined = 'sparkles';

/** default value for the heading input */
export const CHAT_EMPTY_STATE_HEADING_DEFAULT = '';

/** default value for the supportingCopy input */
export const CHAT_EMPTY_STATE_SUPPORTING_COPY_DEFAULT: string | undefined = undefined;

/**
 * empty-thread state rendered inside an `org-chat-thread` when there are no messages yet. layout: icon + heading
 * + supporting copy + optional starter row. consumers project the starter row (typically an
 * `org-chat-suggestions`) as default content.
 */
@Component({
  selector: 'org-chat-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './chat-empty-state.html',
  styleUrl: './chat-empty-state.css',
})
export class ChatEmptyState {
  /** the pre icon rendered above the heading */
  public readonly icon = input<IconName | undefined, IconName | null | undefined>(CHAT_EMPTY_STATE_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the empty-state heading */
  public readonly heading = input<string>(CHAT_EMPTY_STATE_HEADING_DEFAULT);

  /** optional supporting copy rendered below the heading */
  public readonly supportingCopy = input<string | undefined, string | null | undefined>(
    CHAT_EMPTY_STATE_SUPPORTING_COPY_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );
}
