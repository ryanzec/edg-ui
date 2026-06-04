import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Tag, type TagColor, type TagColorStrength, type TagSize } from './tag';
import { TagIcon } from './tag-icon';
import { Tags } from './tags';

@Component({
  selector: 'test-tag-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag],
  host: { class: 'block' },
  template: `
    <org-tag
      data-testid="tag"
      [color]="color()"
      [size]="size()"
      [colorStrength]="colorStrength()"
      [removable]="removable()"
      [removeAriaLabel]="removeAriaLabel()"
      (removed)="handleRemoved()"
    >
      Tag Content
    </org-tag>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class TagHost {
  public readonly color = signal<TagColor>('primary');
  public readonly size = signal<TagSize>('sm');
  public readonly colorStrength = signal<TagColorStrength>('soft');
  public readonly removable = signal<boolean>(false);
  public readonly removeAriaLabel = signal<string | null | undefined>(undefined);

  public readonly removedCount = signal<number>(0);

  protected readout(): string {
    return `removedCount=${this.removedCount()}`;
  }

  protected handleRemoved(): void {
    this.removedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-tag-defaults-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag],
  host: { class: 'block' },
  template: `<org-tag data-testid="tag" color="primary">Default</org-tag>`,
})
class TagDefaultsHost {}

@Component({
  selector: 'test-tag-icon-clickable-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon],
  host: { class: 'block' },
  template: `
    <org-tag color="primary">
      <org-tag-icon data-testid="tag-icon" [name]="name()" [ariaLabel]="ariaLabel()" (clicked)="handleClicked()" />
      Clickable
    </org-tag>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class TagIconClickableHost {
  public readonly name = signal<'cog' | null | undefined>('cog');
  public readonly ariaLabel = signal<string | null | undefined>(undefined);

  public readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-tag-icon-static-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon],
  host: { class: 'block' },
  template: `
    <org-tag color="primary" [size]="size()">
      <org-tag-icon data-testid="tag-icon" name="cog" />
      Static
    </org-tag>
  `,
})
class TagIconStaticHost {
  public readonly size = signal<TagSize>('sm');
}

@Component({
  selector: 'test-tag-post-icon-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon],
  host: { class: 'block' },
  template: `
    <org-tag data-testid="tag" color="primary" [removable]="removable()">
      Label
      <org-tag-icon data-testid="post-icon" name="arrow-right" />
    </org-tag>
  `,
})
class TagPostIconHost {
  public readonly removable = signal<boolean>(false);
}

@Component({
  selector: 'test-tag-pre-icon-host',
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
class TagPreIconHost {}

@Component({
  selector: 'test-tag-remove-icon-size-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag],
  host: { class: 'block' },
  template: ` <org-tag data-testid="tag" color="primary" [size]="size()" [removable]="true">Sized</org-tag> `,
})
class TagRemoveIconSizeHost {
  public readonly size = signal<TagSize>('xs');
}

@Component({
  selector: 'test-tags-wrapper-host',
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
class TagsWrapperHost {}

describe('Tags (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  describe('host attributes', () => {
    it('renders default host attributes', () => {
      const fixture = createFixture(TagDefaultsHost);
      const host = queryByTestId(fixture, 'tag');

      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-color-strength')).toBe('soft');
      expect(host.getAttribute('data-size')).toBe('sm');
      expect(host.getAttribute('data-removable')).toBeNull();
    });

    it('reflects configured host attributes', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      fixture.componentInstance.color.set('danger');
      fixture.componentInstance.colorStrength.set('strong');
      fixture.componentInstance.size.set('base');
      fixture.componentInstance.removable.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-color')).toBe('danger');
      expect(host.getAttribute('data-color-strength')).toBe('strong');
      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-removable')).toBe('');
    });

    it('clears data-removable when turned off', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      fixture.componentInstance.removable.set(true);
      await flush(fixture);
      expect(host.getAttribute('data-removable')).toBe('');

      fixture.componentInstance.removable.set(false);
      await flush(fixture);
      expect(host.getAttribute('data-removable')).toBeNull();
    });
  });

  describe('remove button', () => {
    it('does not render the remove button by default', () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      expect(host.querySelector('.tag-remove')).toBeNull();
    });

    it('renders the remove button when removable', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      fixture.componentInstance.removable.set(true);
      await flush(fixture);

      await waitFor(() => expect(host.querySelector('.tag-remove')).not.toBeNull());
    });

    it('has button type to prevent form submission', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      fixture.componentInstance.removable.set(true);
      await flush(fixture);

      const removeButton = host.querySelector('.tag-remove') as HTMLButtonElement;

      expect(removeButton.type).toBe('button');
    });

    it('emits removed on click', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.removable.set(true);
      await flush(fixture);

      const removeButton = host.querySelector('.tag-remove') as HTMLButtonElement;

      expect(readout.textContent).toContain('removedCount=0');

      await userEvent.click(removeButton);

      await waitFor(() => expect(readout.textContent).toContain('removedCount=1'));
    });

    it('uses the default aria-label', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      fixture.componentInstance.removable.set(true);
      await flush(fixture);

      const removeButton = host.querySelector('.tag-remove') as HTMLButtonElement;

      expect(removeButton.getAttribute('aria-label')).toBe('Remove tag');
    });

    it('honors a custom aria-label', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      fixture.componentInstance.removable.set(true);
      fixture.componentInstance.removeAriaLabel.set('Remove the priority filter');
      await flush(fixture);

      const removeButton = host.querySelector('.tag-remove') as HTMLButtonElement;

      await waitFor(() => expect(removeButton.getAttribute('aria-label')).toBe('Remove the priority filter'));
    });

    it('transforms a null aria-label to the default', async () => {
      const fixture = createFixture(TagHost);
      const host = queryByTestId(fixture, 'tag');

      fixture.componentInstance.removable.set(true);
      fixture.componentInstance.removeAriaLabel.set('Remove the priority filter');
      await flush(fixture);

      fixture.componentInstance.removeAriaLabel.set(null);
      await flush(fixture);

      const removeButton = host.querySelector('.tag-remove') as HTMLButtonElement;

      await waitFor(() => expect(removeButton.getAttribute('aria-label')).toBe('Remove tag'));
    });
  });

  describe('remove icon size', () => {
    const createRemoveIconSize = (size: TagSize): ComponentFixture<TagRemoveIconSizeHost> =>
      createFixture(TagRemoveIconSizeHost, (instance) => {
        instance.size.set(size);
      });

    it('maps to 2xs for the xs size', async () => {
      const fixture = createRemoveIconSize('xs');
      const host = queryByTestId(fixture, 'tag');

      const icon = host.querySelector('.tag-remove org-icon') as HTMLElement;

      await waitFor(() => expect(icon.getAttribute('data-size')).toBe('2xs'));
    });

    it('maps to 2xs for the sm size', async () => {
      const fixture = createRemoveIconSize('sm');
      const host = queryByTestId(fixture, 'tag');

      const icon = host.querySelector('.tag-remove org-icon') as HTMLElement;

      await waitFor(() => expect(icon.getAttribute('data-size')).toBe('2xs'));
    });

    it('maps to xs for the base size', async () => {
      const fixture = createRemoveIconSize('base');
      const host = queryByTestId(fixture, 'tag');

      const icon = host.querySelector('.tag-remove org-icon') as HTMLElement;

      await waitFor(() => expect(icon.getAttribute('data-size')).toBe('xs'));
    });
  });

  describe('tag icon', () => {
    it('renders the inner button when a name is provided', () => {
      const fixture = createFixture(TagIconStaticHost);
      const host = queryByTestId(fixture, 'tag-icon');

      expect(host.querySelector('button.tag-icon-btn')).not.toBeNull();
    });

    it('renders nothing when the name is cleared', async () => {
      const fixture = createFixture(TagIconClickableHost);
      const host = queryByTestId(fixture, 'tag-icon');

      expect(host.querySelector('button.tag-icon-btn')).not.toBeNull();

      fixture.componentInstance.name.set(null);
      await flush(fixture);

      await waitFor(() => expect(host.querySelector('button.tag-icon-btn')).toBeNull());
    });

    it('forwards the name to org-icon', () => {
      const fixture = createFixture(TagIconStaticHost);
      const host = queryByTestId(fixture, 'tag-icon');

      const icon = host.querySelector('org-icon') as HTMLElement | null;

      expect(icon).not.toBeNull();
      expect(icon?.getAttribute('data-icon')).toBe('cog');
    });

    it('inherits the size from the parent tag', async () => {
      const fixture = createFixture(TagIconStaticHost);
      const host = queryByTestId(fixture, 'tag-icon');

      const icon = host.querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('sm');

      fixture.componentInstance.size.set('base');
      await flush(fixture);
      await waitFor(() => expect(icon.getAttribute('data-size')).toBe('base'));

      fixture.componentInstance.size.set('xs');
      await flush(fixture);
      await waitFor(() => expect(icon.getAttribute('data-size')).toBe('xs'));
    });

    it('is not clickable without a click listener', () => {
      const fixture = createFixture(TagIconStaticHost);
      const host = queryByTestId(fixture, 'tag-icon');

      const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

      expect(innerButton.disabled).toBe(true);
      expect(innerButton.getAttribute('data-clickable')).toBeNull();
    });

    it('is clickable with a click listener', () => {
      const fixture = createFixture(TagIconClickableHost);
      const host = queryByTestId(fixture, 'tag-icon');

      const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

      expect(innerButton.disabled).toBe(false);
      expect(innerButton.getAttribute('data-clickable')).toBe('');
    });

    it('emits the clicked output on click', async () => {
      const fixture = createFixture(TagIconClickableHost);
      const host = queryByTestId(fixture, 'tag-icon');
      const readout = queryByTestId(fixture, 'readout');

      const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

      expect(readout.textContent).toContain('clickCount=0');

      await userEvent.click(innerButton);

      await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
    });

    it('inner button has button type to prevent form submission', () => {
      const fixture = createFixture(TagIconStaticHost);
      const host = queryByTestId(fixture, 'tag-icon');

      const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

      expect(innerButton.type).toBe('button');
    });

    it('uses the default icon aria-label', () => {
      const fixture = createFixture(TagIconClickableHost);
      const host = queryByTestId(fixture, 'tag-icon');

      const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

      expect(innerButton.getAttribute('aria-label')).toBe('Icon action');
    });

    it('honors a custom icon aria-label', async () => {
      const fixture = createFixture(TagIconClickableHost);
      const host = queryByTestId(fixture, 'tag-icon');

      fixture.componentInstance.ariaLabel.set('Open settings');
      await flush(fixture);

      const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

      await waitFor(() => expect(innerButton.getAttribute('aria-label')).toBe('Open settings'));
    });

    it('transforms a null icon aria-label to the default', async () => {
      const fixture = createFixture(TagIconClickableHost);
      const host = queryByTestId(fixture, 'tag-icon');

      fixture.componentInstance.ariaLabel.set('Open settings');
      await flush(fixture);

      fixture.componentInstance.ariaLabel.set(null);
      await flush(fixture);

      const innerButton = host.querySelector('button.tag-icon-btn') as HTMLButtonElement;

      await waitFor(() => expect(innerButton.getAttribute('aria-label')).toBe('Icon action'));
    });
  });

  describe('post / pre icon suppression', () => {
    it('suppresses the post tag-icon when the parent is removable', async () => {
      const fixture = createFixture(TagPostIconHost);
      const postIcon = queryByTestId(fixture, 'post-icon');

      expect(postIcon.getAttribute('data-suppressed')).toBeNull();
      expect(postIcon.querySelector('button.tag-icon-btn')).not.toBeNull();

      fixture.componentInstance.removable.set(true);
      await flush(fixture);

      await waitFor(() => expect(postIcon.getAttribute('data-suppressed')).toBe(''));
      expect(postIcon.querySelector('button.tag-icon-btn')).toBeNull();
    });

    it('restores the post tag-icon when removable is turned off', async () => {
      const fixture = createFixture(TagPostIconHost);
      const postIcon = queryByTestId(fixture, 'post-icon');

      fixture.componentInstance.removable.set(true);
      await flush(fixture);

      await waitFor(() => expect(postIcon.getAttribute('data-suppressed')).toBe(''));

      fixture.componentInstance.removable.set(false);
      await flush(fixture);

      await waitFor(() => expect(postIcon.getAttribute('data-suppressed')).toBeNull());
      expect(postIcon.querySelector('button.tag-icon-btn')).not.toBeNull();
    });

    it('does not suppress the pre tag-icon when the parent is removable', () => {
      const fixture = createFixture(TagPreIconHost);
      const preIcon = queryByTestId(fixture, 'pre-icon');
      const postIcon = queryByTestId(fixture, 'post-icon');
      const host = queryByTestId(fixture, 'tag');

      expect(preIcon.getAttribute('data-suppressed')).toBeNull();
      expect(preIcon.querySelector('button.tag-icon-btn')).not.toBeNull();

      expect(postIcon.getAttribute('data-suppressed')).toBe('');
      expect(postIcon.querySelector('button.tag-icon-btn')).toBeNull();

      expect(host.querySelector('.tag-remove')).not.toBeNull();
    });
  });

  describe('tags wrapper', () => {
    it('renders projected tag children', () => {
      const fixture = createFixture(TagsWrapperHost);
      const wrapper = queryByTestId(fixture, 'tags-wrapper');

      expect(wrapper.querySelectorAll('org-tag').length).toBe(3);
    });
  });
});
