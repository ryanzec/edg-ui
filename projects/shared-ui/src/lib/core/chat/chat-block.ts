import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { Icon } from '../icon/icon';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import { ChatBlockBrainDirective } from '../../brain/chat-block-brain/chat-block-brain';

/** all available chat block kind values */
export const allChatBlockKinds = ['tool', 'thinking'] as const;

/** the kind of work the block represents — drives icon and accent colour mapping */
export type ChatBlockKind = (typeof allChatBlockKinds)[number];

/** all available chat block state values */
export const allChatBlockStates = ['idle', 'running'] as const;

/** the lifecycle state of a chat block; running thickens the pre info rail */
export type ChatBlockState = (typeof allChatBlockStates)[number];

/** default value for the kind input */
export const CHAT_BLOCK_KIND_DEFAULT: ChatBlockKind = 'tool';

/** default value for the state input */
export const CHAT_BLOCK_STATE_DEFAULT: ChatBlockState = 'idle';

/** default value for the title input */
export const CHAT_BLOCK_TITLE_DEFAULT = '';

/** default value for the titleEmphasis input */
export const CHAT_BLOCK_TITLE_EMPHASIS_DEFAULT: string | undefined = undefined;

/** default value for the meta input */
export const CHAT_BLOCK_META_DEFAULT: string | undefined = undefined;

/** default value for the expanded model (collapsed at rest) */
export const CHAT_BLOCK_EXPANDED_DEFAULT = false;

/**
 * collapsible card rendered inside an assistant message body for tool-call traces and thinking summaries. the
 * inner header button hosts `ChatBlockBrainDirective`, which owns the expanded state and the aria-expanded
 * binding. the body collapses via `data-expanded` on the host element. consumers project body content as default
 * `<ng-content />`.
 */
@Component({
  selector: 'org-chat-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, ChatBlockBrainDirective],
  templateUrl: './chat-block.html',
  styleUrl: './chat-block.css',
  host: {
    '[attr.data-kind]': 'kind()',
    '[attr.data-state]': 'state()',
    '[attr.data-expanded]': 'expanded() ? "1" : "0"',
  },
})
export class ChatBlock {
  /** the kind of block — tool calls and thinking traces share chrome but differ in accent and icon */
  public readonly kind = input<ChatBlockKind>(CHAT_BLOCK_KIND_DEFAULT);

  /** the lifecycle state of the block; running messages thicken the info rail */
  public readonly state = input<ChatBlockState>(CHAT_BLOCK_STATE_DEFAULT);

  /** the visible header title rendered between the kind icon and the meta */
  public readonly title = input<string>(CHAT_BLOCK_TITLE_DEFAULT);

  /** an optional emphasised fragment rendered inside the title (e.g. a tool-call signature in mono) */
  public readonly titleEmphasis = input<string | undefined, string | null | undefined>(
    CHAT_BLOCK_TITLE_EMPHASIS_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** the post meta line rendered after the title (e.g. duration, line count, status) */
  public readonly meta = input<string | undefined, string | null | undefined>(CHAT_BLOCK_META_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the block body is expanded; two-way bindable via [(expanded)] for consumer control */
  public readonly expanded = model<boolean>(CHAT_BLOCK_EXPANDED_DEFAULT);

  /** the icon name resolved from the kind input — sparkles for thinking, package for tool */
  protected readonly kindIcon = computed<IconName>(() => (this.kind() === 'thinking' ? 'sparkles' : 'package'));

  /** whether a meta line is present and should render */
  protected readonly hasMeta = computed<boolean>(() => !!this.meta());

  /** whether a title-emphasis fragment is present and should render */
  protected readonly hasTitleEmphasis = computed<boolean>(() => !!this.titleEmphasis());
}
