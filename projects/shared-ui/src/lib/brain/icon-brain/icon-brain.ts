import { Directive, computed, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import {
  LucideArrowDown,
  LucideArrowLeft,
  LucideArrowRight,
  LucideArrowUp,
  LucideArrowUpRight,
  LucideArrowDownUp,
  LucideBell,
  LucideBellOff,
  LucideCalendar,
  LucideChevronDown,
  LucideChevronFirst,
  LucideChevronLast,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronUp,
  LucideCheck,
  LucideCircle,
  LucideCopy,
  LucideEllipsis,
  LucideDownload,
  LucideMail,
  LucideEye,
  LucideEyeOff,
  LucideSettings,
  LucideLockKeyhole,
  LucideCircleMinus,
  LucideSquareMinus,
  LucidePencil,
  LucidePlus,
  LucideLogOut,
  LucideLoader,
  LucidePowerOff,
  LucideSquare,
  LucideTrash,
  LucideUpload,
  LucideX,
  LucideCircleX,
  LucideCog,
  LucideSearch,
  LucideSend,
  LucideSparkles,
  type LucideIcon,
  LucideSquareCheckBig,
  LucideCircleCheckBig,
  LucideHouse,
  LucideUsers,
  LucideFileText,
  LucideFolder,
  LucidePackage,
  LucideCreditCard,
  LucideCircleHelp,
} from '@lucide/angular';

/**
 * All registered icon names. This list exists to:
 * - provide type safety via the derived `IconName` type
 * - abstract the icon implementation details away
 * - map semantic names to icons to avoid multiple icons for the same purpose (e.g. `notification` -> `LucideBell`)
 * - catalog which of the 1000+ lucide icons are actually in use
 *
 * When a new icon or semantic name is needed, add to this list.
 */
export const allIconNames = [
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'arrow-up-right',
  'arrow-down-up',
  'notification',
  'notification-off',
  'calendar',
  'chevron-down',
  'chevron-first',
  'chevron-last',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'check',
  'circle-check-big',
  'cog',
  'square-check-big',
  'circle',
  'copy',
  'ellipsis',
  'download',
  'mail',
  'eye',
  'eye-off',
  'settings',
  'lock-keyhole',
  'circle-minus',
  'square-minus',
  'pencil',
  'plus',
  'log-out',
  'loader',
  'power-off',
  'square',
  'trash',
  'upload',
  'x',
  'circle-x',
  'search',
  'send',
  'sparkles',
  'house',
  'users',
  'file-text',
  'folder',
  'package',
  'credit-card',
  'circle-help',
] as const;

/** the icon name type derived from all registered icon names */
export type IconName = (typeof allIconNames)[number];

/** default value for the label input */
export const ICON_BRAIN_LABEL_DEFAULT: string | undefined = undefined;

const iconMap: Record<IconName, LucideIcon> = {
  'arrow-down': LucideArrowDown,
  'arrow-left': LucideArrowLeft,
  'arrow-right': LucideArrowRight,
  'arrow-up': LucideArrowUp,
  'arrow-up-right': LucideArrowUpRight,
  'arrow-down-up': LucideArrowDownUp,
  notification: LucideBell,
  'notification-off': LucideBellOff,
  calendar: LucideCalendar,
  'chevron-down': LucideChevronDown,
  'chevron-first': LucideChevronFirst,
  'chevron-last': LucideChevronLast,
  'chevron-left': LucideChevronLeft,
  'chevron-right': LucideChevronRight,
  'chevron-up': LucideChevronUp,
  check: LucideCheck,
  'circle-check-big': LucideCircleCheckBig,
  cog: LucideCog,
  'square-check-big': LucideSquareCheckBig,
  circle: LucideCircle,
  copy: LucideCopy,
  ellipsis: LucideEllipsis,
  download: LucideDownload,
  mail: LucideMail,
  eye: LucideEye,
  'eye-off': LucideEyeOff,
  settings: LucideSettings,
  'lock-keyhole': LucideLockKeyhole,
  'circle-minus': LucideCircleMinus,
  'square-minus': LucideSquareMinus,
  pencil: LucidePencil,
  plus: LucidePlus,
  'log-out': LucideLogOut,
  loader: LucideLoader,
  'power-off': LucidePowerOff,
  square: LucideSquare,
  trash: LucideTrash,
  upload: LucideUpload,
  x: LucideX,
  'circle-x': LucideCircleX,
  search: LucideSearch,
  send: LucideSend,
  sparkles: LucideSparkles,
  house: LucideHouse,
  users: LucideUsers,
  'file-text': LucideFileText,
  folder: LucideFolder,
  package: LucidePackage,
  'credit-card': LucideCreditCard,
  'circle-help': LucideCircleHelp,
};

/**
 * headless brain directive for the icon. owns the semantic icon name registry, the lucide icon resolution logic,
 * and the accessibility derivation (role, aria-label, aria-hidden) for the rendered svg. carries no styling,
 * sizing, or color concerns — apply it to a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgIconBrain]',
  exportAs: 'orgIconBrain',
})
export class IconBrainDirective {
  /** the semantic name of the icon to render */
  public readonly name = input.required<IconName>();

  /**
   * accessible label for the icon; when provided the icon is treated as meaningful (role="img") and aria-hidden
   * is removed; omit for decorative icons
   */
  public readonly label = input<string | undefined, string | null | undefined>(ICON_BRAIN_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the resolved lucide icon object derived from the name input */
  public readonly lucideIcon = computed<LucideIcon>(() => iconMap[this.name()]);

  /** aria-hidden attribute value — true for decorative icons (no label), null when the icon is meaningful */
  public readonly ariaHidden = computed<true | null>(() => (this.label() ? null : true));

  /** aria-label attribute value — the label string when meaningful, null when decorative */
  public readonly ariaLabel = computed<string | null>(() => this.label() ?? null);

  /** role attribute value — "img" when the icon has a label, null when decorative */
  public readonly role = computed<'img' | null>(() => (this.label() ? 'img' : null));
}
