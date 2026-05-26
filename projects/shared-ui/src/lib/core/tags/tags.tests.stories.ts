import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tag, type TagColor, type TagSize, type TagVariant } from './tag';
import { TagIcon } from './tag-icon';
import { Tags } from './tags';

@Component({
  selector: 'story-tag-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag],
  host: { class: 'block' },
  template: `
    <org-tag
      data-testid="tag"
      [color]="color()"
      [size]="size()"
      [variant]="variant()"
      [removable]="removable()"
      [removeAriaLabel]="removeAriaLabel()"
      (removed)="handleRemoved()"
    >
      Tag Content
    </org-tag>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-variant-strong" (click)="variant.set('strong')">variant-strong</button>
      <button type="button" data-testid="ctl-size-xs" (click)="size.set('xs')">size-xs</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-base" (click)="size.set('base')">size-base</button>
      <button type="button" data-testid="ctl-removable-on" (click)="removable.set(true)">removable-on</button>
      <button type="button" data-testid="ctl-removable-off" (click)="removable.set(false)">removable-off</button>
      <button
        type="button"
        data-testid="ctl-remove-aria-label-set"
        (click)="removeAriaLabel.set('Remove the priority filter')"
      >
        remove-aria-label-set
      </button>
      <button type="button" data-testid="ctl-remove-aria-label-null" (click)="removeAriaLabel.set(null)">
        remove-aria-label-null
      </button>
    </div>
  `,
})
class StoryTagTestsShell {
  protected readonly color = signal<TagColor>('primary');
  protected readonly size = signal<TagSize>('sm');
  protected readonly variant = signal<TagVariant>('soft');
  protected readonly removable = signal<boolean>(false);
  protected readonly removeAriaLabel = signal<string | null | undefined>(undefined);

  protected readonly removedCount = signal<number>(0);

  protected readout(): string {
    return `removedCount=${this.removedCount()}`;
  }

  protected handleRemoved(): void {
    this.removedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-tag-defaults-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag],
  host: { class: 'block' },
  template: `<org-tag data-testid="tag" color="primary">Default</org-tag>`,
})
class StoryTagDefaultsShell {}

@Component({
  selector: 'story-tag-icon-clickable-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon],
  host: { class: 'block' },
  template: `
    <org-tag color="primary">
      <org-tag-icon data-testid="tag-icon" [name]="name()" [ariaLabel]="ariaLabel()" (clicked)="handleClicked()" />
      Clickable
    </org-tag>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-name-clear" (click)="name.set(null)">name-clear</button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('Open settings')">
        aria-label-set
      </button>
      <button type="button" data-testid="ctl-aria-label-null" (click)="ariaLabel.set(null)">aria-label-null</button>
    </div>
  `,
})
class StoryTagIconClickableShell {
  protected readonly name = signal<'cog' | null | undefined>('cog');
  protected readonly ariaLabel = signal<string | null | undefined>(undefined);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-tag-icon-static-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon],
  host: { class: 'block' },
  template: `
    <org-tag color="primary" [size]="size()">
      <org-tag-icon data-testid="tag-icon" name="cog" />
      Static
    </org-tag>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-xs" (click)="size.set('xs')">size-xs</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-base" (click)="size.set('base')">size-base</button>
    </div>
  `,
})
class StoryTagIconStaticShell {
  protected readonly size = signal<TagSize>('sm');
}

@Component({
  selector: 'story-tag-post-icon-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon],
  host: { class: 'block' },
  template: `
    <org-tag data-testid="tag" color="primary" [removable]="removable()">
      Label
      <org-tag-icon data-testid="post-icon" name="arrow-right" />
    </org-tag>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-removable-on" (click)="removable.set(true)">removable-on</button>
      <button type="button" data-testid="ctl-removable-off" (click)="removable.set(false)">removable-off</button>
    </div>
  `,
})
class StoryTagPostIconShell {
  protected readonly removable = signal<boolean>(false);
}

@Component({
  selector: 'story-tag-pre-icon-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon],
  host: { class: 'block' },
  template: `
    <org-tag data-testid="tag" color="primary" [removable]="true">
      <org-tag-icon data-testid="pre-icon" name="cog" />
      Label
      <org-tag-icon data-testid="post-icon" name="arrow-right" />
    </org-tag>
  `,
})
class StoryTagPreIconShell {}

@Component({
  selector: 'story-tag-remove-icon-size-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag],
  host: { class: 'block' },
  template: `
    <org-tag data-testid="tag" color="primary" [size]="size()" [removable]="true">Sized</org-tag>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-xs" (click)="size.set('xs')">size-xs</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-base" (click)="size.set('base')">size-base</button>
    </div>
  `,
})
class StoryTagRemoveIconSizeShell {
  protected readonly size = signal<TagSize>('xs');
}

@Component({
  selector: 'story-tags-wrapper-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, Tags],
  host: { class: 'block' },
  template: `
    <org-tags data-testid="tags-wrapper">
      <org-tag color="primary">One</org-tag>
      <org-tag color="info">Two</org-tag>
      <org-tag color="safe">Three</org-tag>
    </org-tags>
  `,
})
class StoryTagsWrapperShell {}

const meta: Meta = {
  title: 'Core/Components/Tag/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-tag-tests-shell />`,
  moduleMetadata: { imports: [StoryTagTestsShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: () => ({
    template: `<story-tag-defaults-shell />`,
    moduleMetadata: { imports: [StoryTagDefaultsShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await expect(host.getAttribute('data-color')).toBe('primary');
    await expect(host.getAttribute('data-variant')).toBe('soft');
    await expect(host.getAttribute('data-size')).toBe('sm');
    await expect(host.getAttribute('data-removable')).toBeNull();
  },
};

export const ReflectsConfiguredHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await userEvent.click(canvas.getByTestId('ctl-variant-strong'));
    await userEvent.click(canvas.getByTestId('ctl-size-base'));
    await userEvent.click(canvas.getByTestId('ctl-removable-on'));

    await expect(host.getAttribute('data-color')).toBe('danger');
    await expect(host.getAttribute('data-variant')).toBe('strong');
    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-removable')).toBe('');
  },
};

export const DataRemovableClearsWhenTurnedOff: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));
    await expect(host.getAttribute('data-removable')).toBe('');

    await userEvent.click(canvas.getByTestId('ctl-removable-off'));
    await expect(host.getAttribute('data-removable')).toBeNull();
  },
};

export const DoesNotRenderRemoveButtonByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await expect(host.querySelector('.tag-remove')).toBeNull();
  },
};

export const RendersRemoveButtonWhenRemovable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));

    await waitFor(() => expect(host.querySelector('.tag-remove')).not.toBeNull());
  },
};

export const RemoveButtonHasButtonTypeToPreventFormSubmission: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));

    const removeButton = (await waitFor(() => {
      const found = host.querySelector('.tag-remove') as HTMLButtonElement | null;

      expect(found).not.toBeNull();

      return found as HTMLButtonElement;
    })) as HTMLButtonElement;

    await expect(removeButton.type).toBe('button');
  },
};

export const RemoveButtonEmitsRemovedOnClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));

    const removeButton = (await waitFor(() => {
      const found = host.querySelector('.tag-remove') as HTMLButtonElement | null;

      expect(found).not.toBeNull();

      return found as HTMLButtonElement;
    })) as HTMLButtonElement;

    await expect(readout.textContent).toContain('removedCount=0');

    await userEvent.click(removeButton);

    await expect(readout.textContent).toContain('removedCount=1');
  },
};

export const RemoveButtonUsesDefaultAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));

    const removeButton = (await waitFor(() => {
      const found = host.querySelector('.tag-remove') as HTMLButtonElement | null;

      expect(found).not.toBeNull();

      return found as HTMLButtonElement;
    })) as HTMLButtonElement;

    await expect(removeButton.getAttribute('aria-label')).toBe('Remove tag');
  },
};

export const RemoveButtonHonorsCustomAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));
    await userEvent.click(canvas.getByTestId('ctl-remove-aria-label-set'));

    const removeButton = (await waitFor(() => {
      const found = host.querySelector('.tag-remove') as HTMLButtonElement | null;

      expect(found).not.toBeNull();

      return found as HTMLButtonElement;
    })) as HTMLButtonElement;

    await waitFor(() => expect(removeButton.getAttribute('aria-label')).toBe('Remove the priority filter'));
  },
};

export const RemoveButtonTransformsNullAriaLabelToDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));
    await userEvent.click(canvas.getByTestId('ctl-remove-aria-label-set'));
    await userEvent.click(canvas.getByTestId('ctl-remove-aria-label-null'));

    const removeButton = (await waitFor(() => {
      const found = host.querySelector('.tag-remove') as HTMLButtonElement | null;

      expect(found).not.toBeNull();

      return found as HTMLButtonElement;
    })) as HTMLButtonElement;

    await waitFor(() => expect(removeButton.getAttribute('aria-label')).toBe('Remove tag'));
  },
};

const renderRemoveIconSizeShell: Story['render'] = () => ({
  template: `<story-tag-remove-icon-size-shell />`,
  moduleMetadata: { imports: [StoryTagRemoveIconSizeShell] },
});

export const RemoveIconSizeMapsForXs: Story = {
  render: renderRemoveIconSizeShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-size-xs'));

    const icon = (await waitFor(() => {
      const found = host.querySelector('.tag-remove org-icon') as HTMLElement | null;

      expect(found).not.toBeNull();

      return found as HTMLElement;
    })) as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('2xs');
  },
};

export const RemoveIconSizeMapsForSm: Story = {
  render: renderRemoveIconSizeShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    const icon = (await waitFor(() => {
      const found = host.querySelector('.tag-remove org-icon') as HTMLElement | null;

      expect(found).not.toBeNull();

      return found as HTMLElement;
    })) as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('2xs');
  },
};

export const RemoveIconSizeMapsForBase: Story = {
  render: renderRemoveIconSizeShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag');

    await userEvent.click(canvas.getByTestId('ctl-size-base'));

    const icon = (await waitFor(() => {
      const found = host.querySelector('.tag-remove org-icon') as HTMLElement | null;

      expect(found).not.toBeNull();

      return found as HTMLElement;
    })) as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('xs');
  },
};

const renderClickableIconShell: Story['render'] = () => ({
  template: `<story-tag-icon-clickable-shell />`,
  moduleMetadata: { imports: [StoryTagIconClickableShell] },
});

const renderStaticIconShell: Story['render'] = () => ({
  template: `<story-tag-icon-static-shell />`,
  moduleMetadata: { imports: [StoryTagIconStaticShell] },
});

export const TagIconRendersInnerButtonWhenNameProvided: Story = {
  render: renderStaticIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    await expect(host.querySelector('button.tag-icon-btn')).not.toBeNull();
  },
};

export const TagIconRendersNothingWhenNameCleared: Story = {
  render: renderClickableIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    await expect(host.querySelector('button.tag-icon-btn')).not.toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-name-clear'));

    await waitFor(() => expect(host.querySelector('button.tag-icon-btn')).toBeNull());
  },
};

export const TagIconForwardsNameToOrgIcon: Story = {
  render: renderStaticIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    const icon = host.querySelector('org-icon') as HTMLElement | null;

    await expect(icon).not.toBeNull();
    await expect(icon?.getAttribute('data-icon')).toBe('cog');
  },
};

export const TagIconInheritsSizeFromParentTag: Story = {
  render: renderStaticIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    const icon = host.querySelector('org-icon') as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('sm');

    await userEvent.click(canvas.getByTestId('ctl-size-base'));

    await waitFor(() => expect(icon.getAttribute('data-size')).toBe('base'));

    await userEvent.click(canvas.getByTestId('ctl-size-xs'));

    await waitFor(() => expect(icon.getAttribute('data-size')).toBe('xs'));
  },
};

export const TagIconWithoutClickListenerIsNotClickable: Story = {
  render: renderStaticIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

    await expect(innerButton.disabled).toBe(true);
    await expect(innerButton.getAttribute('data-clickable')).toBeNull();
  },
};

export const TagIconWithClickListenerIsClickable: Story = {
  render: renderClickableIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    const innerButton = (await waitFor(() => {
      const found = host.querySelector('button.tag-icon-btn') as HTMLButtonElement | null;

      expect(found).not.toBeNull();
      expect(found?.disabled).toBe(false);

      return found as HTMLButtonElement;
    })) as HTMLButtonElement;

    await expect(innerButton.getAttribute('data-clickable')).toBe('');
  },
};

export const TagIconClickEmitsClickedOutput: Story = {
  render: renderClickableIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');
    const readout = await canvas.findByTestId('readout');

    const innerButton = (await waitFor(() => {
      const found = host.querySelector('button.tag-icon-btn') as HTMLButtonElement | null;

      expect(found).not.toBeNull();
      expect(found?.disabled).toBe(false);

      return found as HTMLButtonElement;
    })) as HTMLButtonElement;

    await expect(readout.textContent).toContain('clickCount=0');

    await userEvent.click(innerButton);

    await expect(readout.textContent).toContain('clickCount=1');
  },
};

export const TagIconInnerButtonHasButtonTypeToPreventFormSubmission: Story = {
  render: renderStaticIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

    await expect(innerButton.type).toBe('button');
  },
};

export const TagIconUsesDefaultAriaLabel: Story = {
  render: renderClickableIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-label')).toBe('Icon action');
  },
};

export const TagIconHonorsCustomAriaLabel: Story = {
  render: renderClickableIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

    await waitFor(() => expect(innerButton.getAttribute('aria-label')).toBe('Open settings'));
  },
};

export const TagIconTransformsNullAriaLabelToDefault: Story = {
  render: renderClickableIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tag-icon');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-label-null'));

    const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

    await waitFor(() => expect(innerButton.getAttribute('aria-label')).toBe('Icon action'));
  },
};

export const PostTagIconSuppressedWhenParentIsRemovable: Story = {
  render: () => ({
    template: `<story-tag-post-icon-shell />`,
    moduleMetadata: { imports: [StoryTagPostIconShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const postIcon = await canvas.findByTestId('post-icon');

    await expect(postIcon.getAttribute('data-suppressed')).toBeNull();
    await expect(postIcon.querySelector('button.tag-icon-btn')).not.toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));

    await waitFor(() => expect(postIcon.getAttribute('data-suppressed')).toBe(''));
    await expect(postIcon.querySelector('button.tag-icon-btn')).toBeNull();
  },
};

export const PostTagIconRestoredWhenRemovableTurnedOff: Story = {
  render: () => ({
    template: `<story-tag-post-icon-shell />`,
    moduleMetadata: { imports: [StoryTagPostIconShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const postIcon = await canvas.findByTestId('post-icon');

    await userEvent.click(canvas.getByTestId('ctl-removable-on'));

    await waitFor(() => expect(postIcon.getAttribute('data-suppressed')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-removable-off'));

    await waitFor(() => expect(postIcon.getAttribute('data-suppressed')).toBeNull());
    await expect(postIcon.querySelector('button.tag-icon-btn')).not.toBeNull();
  },
};

export const PreTagIconNotSuppressedWhenParentIsRemovable: Story = {
  render: () => ({
    template: `<story-tag-pre-icon-shell />`,
    moduleMetadata: { imports: [StoryTagPreIconShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const preIcon = await canvas.findByTestId('pre-icon');
    const postIcon = await canvas.findByTestId('post-icon');
    const host = await canvas.findByTestId('tag');

    await expect(preIcon.getAttribute('data-suppressed')).toBeNull();
    await expect(preIcon.querySelector('button.tag-icon-btn')).not.toBeNull();

    await expect(postIcon.getAttribute('data-suppressed')).toBe('');
    await expect(postIcon.querySelector('button.tag-icon-btn')).toBeNull();

    await expect(host.querySelector('.tag-remove')).not.toBeNull();
  },
};

export const TagsWrapperRendersProjectedTagChildren: Story = {
  render: () => ({
    template: `<story-tags-wrapper-shell />`,
    moduleMetadata: { imports: [StoryTagsWrapperShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const wrapper = await canvas.findByTestId('tags-wrapper');

    await expect(wrapper.querySelectorAll('org-tag').length).toBe(3);
  },
};
