import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TagIconBrainDirective } from '../../brain/tag-icon-brain/tag-icon-brain';
import { Icon } from '../icon/icon';
import { Tag } from './tag';

@Component({
  selector: 'org-tag-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './tag-icon.html',
  styleUrl: './tag-icon.css',
  hostDirectives: [
    {
      directive: TagIconBrainDirective,
      inputs: ['name', 'ariaLabel'],
      outputs: ['clicked'],
    },
  ],
  host: {
    '[attr.data-suppressed]': 'isSuppressedByParent() ? "" : null',
  },
})
export class TagIcon {
  /** reference to the parent tag for shared size context and removable-override detection */
  private readonly _tagComponent = inject(Tag);

  /** brain directive providing icon resolution, interactivity state, and a11y derivation for the template */
  protected readonly brain = inject(TagIconBrainDirective);

  /** the size inherited from the parent tag */
  protected readonly size = computed(() => this._tagComponent.size());

  /** true when the parent tag's removable input is set and this is the post tag-icon being overridden */
  protected readonly isSuppressedByParent = computed<boolean>(() => {
    return this._tagComponent.isRemovable() && this._tagComponent.lastTagIcon() === this;
  });
}
