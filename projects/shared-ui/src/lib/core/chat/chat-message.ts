import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { Avatar, AVATAR_SHAPE_VARIANT_DEFAULT, type AvatarShapeVariant } from '../avatar/avatar';
import { Box, type BoxBorder, type BoxColor } from '../box/box';
import { Icon } from '../icon/icon';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import {
  ChatMessageBrainDirective,
  CHAT_MESSAGE_ROLE_DEFAULT,
  CHAT_MESSAGE_STATE_DEFAULT,
} from '../../brain/chat-brain/chat-message-brain';

/** all available chat message run-position values */
export const allChatMessageRunPositions = ['only', 'first', 'middle', 'last'] as const;

/**
 * the position of the message inside a sender run. consumers set this to drive vertical rhythm and to hide the
 * avatar / author label on continuation messages.
 */
export type ChatMessageRunPosition = (typeof allChatMessageRunPositions)[number];

/** default value for the runPosition input */
export const CHAT_MESSAGE_RUN_POSITION_DEFAULT: ChatMessageRunPosition = 'only';

/** default value for the authorName input */
export const CHAT_MESSAGE_AUTHOR_NAME_DEFAULT = '';

/** default value for the time input */
export const CHAT_MESSAGE_TIME_DEFAULT: string | undefined = undefined;

/** default value for the meta input (overrides time when present, e.g. "Sending...") */
export const CHAT_MESSAGE_META_DEFAULT: string | undefined = undefined;

/** default value for the edited input */
export const CHAT_MESSAGE_EDITED_DEFAULT = false;

/** default value for the avatarImgSrc input */
export const CHAT_MESSAGE_AVATAR_IMG_SRC_DEFAULT: string | undefined = undefined;

/** default value for the avatarImgEmail input */
export const CHAT_MESSAGE_AVATAR_IMG_EMAIL_DEFAULT: string | undefined = undefined;

/** default value for the avatarShape input */
export const CHAT_MESSAGE_AVATAR_SHAPE_DEFAULT: AvatarShapeVariant = AVATAR_SHAPE_VARIANT_DEFAULT;

/** default value for the systemIcon input */
export const CHAT_MESSAGE_SYSTEM_ICON_DEFAULT: IconName | undefined = undefined;

// re-export role/state defaults so consumers can keep importing them from the core barrel
export { CHAT_MESSAGE_ROLE_DEFAULT, CHAT_MESSAGE_STATE_DEFAULT };

/**
 * single chat message rendered as a two-column grid (avatar gutter + body column). composes
 * `ChatMessageBrainDirective` for the role-driven aria semantics (system → status, others → article) and the
 * pending / failed aria states. user and error roles wrap the body slot in an `org-box` for the bubble surface;
 * assistant renders the body bare; system collapses the grid to a centred chrome pill with an optional pre
 * `systemIcon`. the gutter avatar is rendered internally as an `org-avatar` driven by the `authorName`,
 * `avatarImgSrc`, `avatarImgEmail`, and `avatarShape` inputs — there is no avatar projection slot. consumers
 * project content via three named slots: `[quote]` for an optional quoted-reply preview above the body, `[body]`
 * for the body content (auto-wrapped for user / error), and the default slot for post column items
 * (suggestions, reactions). hover-actions sit on a separate row via `[hoverActions]`.
 */
@Component({
  selector: 'org-chat-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Box, Icon, NgTemplateOutlet],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
  hostDirectives: [
    {
      directive: ChatMessageBrainDirective,
      inputs: ['role', 'state'],
    },
  ],
  host: {
    '[attr.data-role]': 'brain.role()',
    '[attr.data-state]': 'brain.state()',
    '[attr.data-run-position]': 'runPosition()',
  },
})
export class ChatMessage {
  /** reference to the host chat-message brain directive owning role / state aria semantics */
  protected readonly brain = inject(ChatMessageBrainDirective);

  /** the position of the message inside a sender run; drives top margin + author / avatar visibility */
  public readonly runPosition = input<ChatMessageRunPosition>(CHAT_MESSAGE_RUN_POSITION_DEFAULT);

  /** the rendered author display name; also the source of the avatar's initials and color */
  public readonly authorName = input<string>(CHAT_MESSAGE_AUTHOR_NAME_DEFAULT);

  /** the rendered timestamp (e.g. "2:14 PM"); omitted when meta is present */
  public readonly time = input<string | undefined, string | null | undefined>(CHAT_MESSAGE_TIME_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** override label for the time slot (e.g. "Sending...", "Failed — retry"); takes precedence over time */
  public readonly meta = input<string | undefined, string | null | undefined>(CHAT_MESSAGE_META_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether to render the "(edited)" marker in the author / meta row */
  public readonly edited = input<boolean>(CHAT_MESSAGE_EDITED_DEFAULT);

  /** explicit image url forwarded to the avatar; takes priority over avatarImgEmail */
  public readonly avatarImgSrc = input<string | undefined, string | null | undefined>(
    CHAT_MESSAGE_AVATAR_IMG_SRC_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** email forwarded to the avatar to fetch a gravatar image when avatarImgSrc is absent */
  public readonly avatarImgEmail = input<string | undefined, string | null | undefined>(
    CHAT_MESSAGE_AVATAR_IMG_EMAIL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** shape variant forwarded to the avatar; circle for people, square for organisations / teams / projects */
  public readonly avatarShape = input<AvatarShapeVariant>(CHAT_MESSAGE_AVATAR_SHAPE_DEFAULT);

  /** optional pre icon for the system pill; ignored for non-system roles */
  public readonly systemIcon = input<IconName | undefined, IconName | null | undefined>(
    CHAT_MESSAGE_SYSTEM_ICON_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** convenience: true when the message role renders as a centered system pill */
  protected readonly isSystem = computed<boolean>(() => this.brain.role() === 'system');

  /** convenience: true when the run-position is the start of a run (or its only message) */
  protected readonly isLeadOfRun = computed<boolean>(() => {
    const position = this.runPosition();

    return position === 'first' || position === 'only';
  });

  /** whether the body should be wrapped in an `org-box` (user / error roles) */
  protected readonly useSurface = computed<boolean>(() => {
    const role = this.brain.role();

    return role === 'user' || role === 'error';
  });

  /** the box color mapped from the role; only consulted when useSurface() is true */
  protected readonly boxColor = computed<BoxColor>(() => (this.brain.role() === 'error' ? 'danger' : 'neutral'));

  /** the box border style mapped from the role; only consulted when useSurface() is true */
  protected readonly boxBorder = computed<BoxBorder>(() => (this.brain.role() === 'error' ? 'bordered' : 'borderless'));

  /** the post meta label rendered after the author name; meta() takes precedence over time() */
  protected readonly postMeta = computed<string | undefined>(() => this.meta() ?? this.time());

  /** whether the post meta label should render */
  protected readonly hasPostMeta = computed<boolean>(() => !!this.postMeta());

  /** whether the meta input is the source of the post label (drives the muted styling vs. faint time) */
  protected readonly postIsMeta = computed<boolean>(() => !!this.meta());

  /** whether to render the "(edited)" marker */
  protected readonly hasEdited = computed<boolean>(() => this.edited());

  /** whether the system pill should render its pre icon */
  protected readonly hasSystemIcon = computed<boolean>(() => !!this.systemIcon());
}
