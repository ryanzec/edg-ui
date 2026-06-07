import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { OverlayMenu, type OverlayMenuItem, type OverlayMenuItemEntry } from './overlay-menu';
import { OverlayMenuTriggerDirective } from './overlay-menu-trigger';
import { Tag } from '../tags/tag';
import { TagIcon } from '../tags/tag-icon';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';

type TagTriggerMeta = {
  value: string;
};

@Component({
  selector: 'story-overlay-menu-tag-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OverlayMenuTriggerDirective,
    Tag,
    TagIcon,
    OverlayMenu,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Tag as Menu Trigger" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Tag Trigger With Meta-Driven Label</div>
          <org-tag [orgOverlayMenuTrigger]="menu" color="neutral">
            {{ triggerText() }}
            <org-tag-icon name="chevron-down" />
          </org-tag>
          <ng-template #menu>
            <org-overlay-menu [items]="menuItems" (itemClicked)="handleMenuItemClicked($event)" />
          </ng-template>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>The tag acts as the menu trigger via <strong>orgOverlayMenuTrigger</strong></li>
        <li>The tag text starts as <strong>Select value</strong></li>
        <li>Selecting a menu item sets the tag text to that item's <strong>meta.value</strong></li>
        <li>Reopening the menu and selecting a different item updates the tag text again</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class OverlayMenuTagTriggerStory {
  protected readonly menuItems: OverlayMenuItem<TagTriggerMeta>[] = [
    { id: '1', label: 'Apple', icon: 'circle', meta: { value: 'Apple' } },
    { id: '2', label: 'Broccoli', icon: 'circle', meta: { value: 'Broccoli' } },
    { id: '3', label: 'Chicken', icon: 'circle', meta: { value: 'Chicken' } },
  ];

  protected readonly triggerText = signal<string>('Select value');

  protected handleMenuItemClicked(item: OverlayMenuItemEntry<TagTriggerMeta>): void {
    if (!item.meta) {
      return;
    }

    this.triggerText.set(item.meta.value);
  }
}

const meta: Meta<OverlayMenuTagTriggerStory> = {
  title: 'Core/Components/Overlay Menu/Use Cases',
  component: OverlayMenuTagTriggerStory,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OverlayMenuTagTriggerStory>;

export const TagAsTrigger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Uses the Tag component as the menu trigger. The tag text defaults to "Select value" and updates to the selected item meta.value when a menu item is clicked.',
      },
    },
  },
  render: () => ({
    template: `<story-overlay-menu-tag-trigger />`,
    moduleMetadata: {
      imports: [OverlayMenuTagTriggerStory],
    },
  }),
};
