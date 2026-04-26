import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import {
  LucideDynamicIcon,
  LucideArrowDown,
  LucideArrowLeft,
  LucideArrowRight,
  LucideArrowUp,
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
  type LucideIcon,
  LucideSquareCheckBig,
  LucideCircleCheckBig,
} from '@lucide/angular';
import { allComponentColors, ComponentSize } from '../types/component-types';

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
] as const;

/** the icon name type derived from all registered icon names */
export type IconName = (typeof allIconNames)[number];

/** all valid icon size values */
export const allIconSizes = [
  '2xs',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
] as const satisfies readonly ComponentSize[];

/** size variants available for the icon component */
export type IconSize = (typeof allIconSizes)[number];

/** all valid icon color values */
export const allIconColors = ['inherit', ...allComponentColors] as const;

/** color variants available for the icon component */
export type IconColor = (typeof allIconColors)[number];

/** default value for the icon size input */
export const ICON_SIZE_DEFAULT: IconSize = 'base';

/** default value for the icon color input */
export const ICON_COLOR_DEFAULT: IconColor = 'inherit';

/** default value for the icon label input */
export const ICON_LABEL_DEFAULT = undefined;

const iconMap: Record<IconName, LucideIcon> = {
  'arrow-down': LucideArrowDown,
  'arrow-left': LucideArrowLeft,
  'arrow-right': LucideArrowRight,
  'arrow-up': LucideArrowUp,
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
};

@Component({
  selector: 'org-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.html',
  styleUrl: './icon.css',
  imports: [LucideDynamicIcon],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
  },
})
export class Icon {
  /** the semantic name of the icon to render */
  public name = input.required<IconName>();

  /** the size of the icon */
  public size = input<IconSize>(ICON_SIZE_DEFAULT);

  /** the color variant of the icon */
  public color = input<IconColor>(ICON_COLOR_DEFAULT);

  /**
   * accessible label for the icon; when provided the icon is treated as meaningful
   * (role="img") and aria-hidden is removed; omit for decorative icons
   */
  public label = input<string | undefined>(ICON_LABEL_DEFAULT);

  /** the resolved lucide icon object derived from the name input */
  protected readonly lucideIcon = computed<LucideIcon>(() => iconMap[this.name()]);
}
