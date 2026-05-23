import { Component, ChangeDetectionStrategy, computed, contentChildren, inject, input } from '@angular/core';
import { TagBrainDirective } from '../tags/tag-brain';
import { Icon, type IconSize } from '../icon/icon';
import { ComponentColor, ComponentSize } from '../types/component-types';
import { TagIcon } from './tag-icon';

/** the color variant of the tag */
export type TagColor = ComponentColor;

/** all available tag size values */
export const allTagSizes = ['xs', 'sm', 'base'] as const satisfies readonly ComponentSize[];

/** the size variant of the tag */
export type TagSize = (typeof allTagSizes)[number];

/** all available tag variant values */
export const allTagVariants = ['strong', 'soft'] as const;

/** the visual style variant of the tag */
export type TagVariant = (typeof allTagVariants)[number];

/** the default size of the tag */
export const TAG_SIZE_DEFAULT: TagSize = 'sm';

/** the default variant of the tag */
export const TAG_VARIANT_DEFAULT: TagVariant = 'soft';

/** maps a tag size to the org-icon size used for the built-in remove affordance */
const TAG_REMOVE_ICON_SIZE: Record<TagSize, IconSize> = {
  xs: '2xs',
  sm: '2xs',
  base: 'xs',
};

@Component({
  selector: 'org-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './tag.html',
  styleUrl: './tag.css',
  hostDirectives: [
    {
      directive: TagBrainDirective,
      inputs: ['removable', 'removeAriaLabel'],
      outputs: ['removed'],
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-removable]': 'brain.removable() ? "" : null',
  },
})
export class Tag {
  /** all slotted tag-icon content children, used by TagIcon to detect which one is the suppressed post icon */
  private readonly _tagIcons = contentChildren(TagIcon);

  /** reference to the host tag brain directive owning the removable affordance state and a11y derivation */
  protected readonly brain = inject(TagBrainDirective);

  /** the color variant applied to the tag */
  public readonly color = input.required<TagColor>();

  /** the size of the tag */
  public readonly size = input<TagSize>(TAG_SIZE_DEFAULT);

  /** the visual style variant of the tag */
  public readonly variant = input<TagVariant>(TAG_VARIANT_DEFAULT);

  /** computed mirror of the brain's removable state, exposed so child TagIcons can react */
  public readonly isRemovable = computed<boolean>(() => this.brain.removable());

  /** the last slotted TagIcon under this tag, exposed so the post TagIcon can suppress itself */
  public readonly lastTagIcon = computed<TagIcon | undefined>(() => {
    const icons = this._tagIcons();

    return icons[icons.length - 1];
  });

  /** the org-icon size used inside the built-in remove button, mapped from the tag's size */
  protected readonly removeIconSize = computed<IconSize>(() => TAG_REMOVE_ICON_SIZE[this.size()]);
}
