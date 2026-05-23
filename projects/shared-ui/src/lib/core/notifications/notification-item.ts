import { ChangeDetectionStrategy, Component, type TemplateRef, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { Button } from '../button/button';
import type { CardColor } from '../card/card';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icon-brain';
import { NotificationItemBrainDirective } from '../notifications/notification-item-brain';

/** default value for the title input */
export const NOTIFICATION_ITEM_TITLE_DEFAULT: string | undefined = undefined;

/** default value for the message input */
export const NOTIFICATION_ITEM_MESSAGE_DEFAULT: string | undefined = undefined;

/** default value for the contentTemplate input */
export const NOTIFICATION_ITEM_CONTENT_TEMPLATE_DEFAULT: TemplateRef<{ $implicit: string }> | undefined = undefined;

/** default value for the actionsTemplate input */
export const NOTIFICATION_ITEM_ACTIONS_TEMPLATE_DEFAULT: TemplateRef<{ $implicit: string }> | undefined = undefined;

/** default value for the icon input */
export const NOTIFICATION_ITEM_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the avatarUrl input */
export const NOTIFICATION_ITEM_AVATAR_URL_DEFAULT: string | undefined = undefined;

/** default value for the color input */
export const NOTIFICATION_ITEM_COLOR_DEFAULT: CardColor | undefined = undefined;

/** default value for the canClose input */
export const NOTIFICATION_ITEM_CAN_CLOSE_DEFAULT = true;

/** intent colors that use role="alert" for screen-reader interruption; everything else uses role="status" */
const ALERT_ROLE_COLORS = new Set<CardColor>(['danger', 'warning']);

/** maps each intent color to its default pre icon when the consumer does not supply one */
const INTENT_DEFAULT_ICON: Record<CardColor, IconName> = {
  info: 'info',
  safe: 'circle-check',
  caution: 'triangle-alert',
  warning: 'triangle-alert',
  danger: 'circle-x',
  primary: 'sparkles',
  secondary: 'notification',
  neutral: 'notification',
};

@Component({
  selector: 'org-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon, NgTemplateOutlet],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.css',
  hostDirectives: [
    {
      directive: NotificationItemBrainDirective,
      inputs: ['id', 'autoCloseIn', 'closeButtonAriaLabel', 'resetTimerOnHover'],
      outputs: ['closed'],
    },
  ],
  host: {
    '[attr.data-color]': 'resolvedColor()',
    '[attr.data-state]': 'dataState()',
    '[attr.data-show-close]': 'canClose() ? "1" : "0"',
    '[attr.data-has-progress]': 'hasProgress() ? "1" : "0"',
    '[attr.role]': 'role()',
    '[style.--_progress]': 'progressPercent()',
    '(animationend)': 'onAnimationEnd($event)',
    '(mouseenter)': 'brain.pauseAutoClose()',
    '(mouseleave)': 'brain.resumeAutoClose()',
    '(focusin)': 'brain.pauseAutoClose()',
    '(focusout)': 'brain.resumeAutoClose()',
  },
})
export class NotificationItem {
  protected readonly brain = inject(NotificationItemBrainDirective, { self: true });

  /** the title text rendered as the top line in the notification body */
  public readonly title = input<string | undefined, string | null | undefined>(NOTIFICATION_ITEM_TITLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the description text rendered below the title (or alone when no title is supplied) */
  public readonly message = input<string | undefined, string | null | undefined>(NOTIFICATION_ITEM_MESSAGE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional template that overrides title + message rendering entirely; receives the notification id as $implicit */
  public readonly contentTemplate = input<
    TemplateRef<{ $implicit: string }> | undefined,
    TemplateRef<{ $implicit: string }> | null | undefined
  >(NOTIFICATION_ITEM_CONTENT_TEMPLATE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional template for the actions row rendered below the body; receives the notification id as $implicit */
  public readonly actionsTemplate = input<
    TemplateRef<{ $implicit: string }> | undefined,
    TemplateRef<{ $implicit: string }> | null | undefined
  >(NOTIFICATION_ITEM_ACTIONS_TEMPLATE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** overrides the intent-default pre icon */
  public readonly icon = input<IconName | undefined, IconName | null | undefined>(NOTIFICATION_ITEM_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** when supplied, the pre media slot renders a circular avatar image instead of an icon */
  public readonly avatarUrl = input<string | undefined, string | null | undefined>(
    NOTIFICATION_ITEM_AVATAR_URL_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** the semantic intent driving the rail accent, pre icon color, and screen-reader role */
  public readonly color = input<CardColor | undefined, CardColor | null | undefined>(NOTIFICATION_ITEM_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the close button is rendered, allowing the user to manually dismiss the notification */
  public readonly canClose = input<boolean>(NOTIFICATION_ITEM_CAN_CLOSE_DEFAULT);

  /** resolved intent color used for the host data-color attribute; falls back to 'info' when no color is supplied */
  protected readonly resolvedColor = computed<CardColor>(() => this.color() ?? 'info');

  /** resolved pre icon: explicit icon input wins, otherwise the intent-default icon */
  protected readonly resolvedIcon = computed<IconName>(() => this.icon() ?? INTENT_DEFAULT_ICON[this.resolvedColor()]);

  /** whether the pre media slot should render an avatar image vs an icon */
  protected readonly hasAvatar = computed<boolean>(() => this.avatarUrl() !== undefined);

  /** whether the progress bar element should be rendered (only when there is a positive auto-close duration) */
  protected readonly hasProgress = computed<boolean>(() => {
    const autoCloseIn = this.brain.autoCloseIn();

    return autoCloseIn !== undefined && autoCloseIn > 0;
  });

  /** css value applied to the --_progress local that drives the progress bar fill width */
  protected readonly progressPercent = computed<string>(() => `${this.brain.progress() * 100}%`);

  /** current host data-state value driving the leave animation; entry direction is handled in css via :host-context */
  protected readonly dataState = computed<'leaving' | null>(() => (this.brain.isRemoving() ? 'leaving' : null));

  /** screen-reader role: 'alert' for high-urgency intents (danger / warning), 'status' for everything else */
  protected readonly role = computed<'alert' | 'status'>(() =>
    ALERT_ROLE_COLORS.has(this.resolvedColor()) ? 'alert' : 'status'
  );

  protected startClose(): void {
    this.brain.startClose();
  }

  /** notifies the brain when the host's fade-out animation has completed so it can emit the closed event */
  protected onAnimationEnd(event: AnimationEvent): void {
    if (!this.brain.isRemoving() || event.animationName !== 'notification-leave') {
      return;
    }

    this.brain.completeClose();
  }
}
