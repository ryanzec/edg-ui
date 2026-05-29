import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Avatar, type AvatarShapeVariant, type AvatarSize } from './avatar';
import { AvatarStack, type AvatarStackSize } from './avatar-stack';

@Component({
  selector: 'test-avatar-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar],
  host: { class: 'block' },
  template: `
    <org-avatar
      data-testid="avatar"
      [label]="label()"
      [size]="size()"
      [shape]="shape()"
      [disabled]="disabled()"
      [isOverflow]="isOverflow()"
      [count]="count()"
      [hasIndicator]="hasIndicator()"
      [showLabel]="showLabel()"
      [subLabel]="subLabel()"
      [imgSrc]="imgSrc()"
      [imgEmail]="imgEmail()"
      [imgAlt]="imgAlt()"
      (clicked)="handleClicked()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class AvatarInteractiveHost {
  public readonly label = signal<string>('Alice');
  public readonly size = signal<AvatarSize>('base');
  public readonly shape = signal<AvatarShapeVariant>('circle');
  public readonly disabled = signal<boolean>(false);
  public readonly isOverflow = signal<boolean>(false);
  public readonly count = signal<number>(5);
  public readonly hasIndicator = signal<boolean>(false);
  public readonly showLabel = signal<boolean>(false);
  public readonly subLabel = signal<string | null | undefined>(undefined);
  public readonly imgSrc = signal<string | null | undefined>(undefined);
  public readonly imgEmail = signal<string | null | undefined>(undefined);
  public readonly imgAlt = signal<string | null | undefined>(undefined);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-avatar-static-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar],
  host: { class: 'block' },
  template: `<org-avatar data-testid="avatar" label="Alice" />`,
})
class AvatarStaticHost {}

@Component({
  selector: 'test-avatar-stack-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, AvatarStack],
  host: { class: 'block' },
  template: `
    <org-avatar data-testid="solo" label="Solo" size="sm" />
    <org-avatar-stack data-testid="stack" [size]="stackSize()">
      <org-avatar data-testid="stacked" label="Stacked" size="sm" />
      <org-avatar label="Bob" />
    </org-avatar-stack>
  `,
})
class AvatarStackHost {
  public readonly stackSize = signal<AvatarStackSize>('lg');
}

type AvatarHostConfig = {
  label?: string;
  size?: AvatarSize;
  shape?: AvatarShapeVariant;
  disabled?: boolean;
  isOverflow?: boolean;
  count?: number;
  hasIndicator?: boolean;
  showLabel?: boolean;
  subLabel?: string | null;
  imgSrc?: string | null;
  imgEmail?: string | null;
  imgAlt?: string | null;
};

/**
 * waits for the avatar's <img> to become unhidden, resolving on the transient hidden=false window that
 * occurs when the source resets before any new network 404 flips it back to hidden; rejects after 2s.
 */
const waitForImgUnhidden = (host: HTMLElement): Promise<void> => {
  const isUnhidden = (): boolean => {
    const img = host.querySelector('img');

    return !!img && !img.hidden;
  };

  const observePromise = new Promise<void>((resolve) => {
    if (isUnhidden()) {
      resolve();

      return;
    }

    const observer = new MutationObserver(() => {
      if (!isUnhidden()) {
        return;
      }

      observer.disconnect();
      resolve();
    });

    observer.observe(host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden'],
    });
  });

  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error('img did not become unhidden within timeout')), 2000);
  });

  return Promise.race([observePromise, timeoutPromise]);
};

describe('Avatar (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveAvatar = (config: AvatarHostConfig = {}): ComponentFixture<AvatarInteractiveHost> =>
    createFixture(AvatarInteractiveHost, (instance) => {
      if (config.label !== undefined) {
        instance.label.set(config.label);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.shape !== undefined) {
        instance.shape.set(config.shape);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.isOverflow !== undefined) {
        instance.isOverflow.set(config.isOverflow);
      }

      if (config.count !== undefined) {
        instance.count.set(config.count);
      }

      if (config.hasIndicator !== undefined) {
        instance.hasIndicator.set(config.hasIndicator);
      }

      if (config.showLabel !== undefined) {
        instance.showLabel.set(config.showLabel);
      }

      if (config.subLabel !== undefined) {
        instance.subLabel.set(config.subLabel);
      }

      if (config.imgSrc !== undefined) {
        instance.imgSrc.set(config.imgSrc);
      }

      if (config.imgEmail !== undefined) {
        instance.imgEmail.set(config.imgEmail);
      }

      if (config.imgAlt !== undefined) {
        instance.imgAlt.set(config.imgAlt);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default size, shape, and color index', () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-shape')).toBe('circle');
      expect(host.getAttribute('data-color-index')).toBe('1');
    });

    it('omits the overflow and disabled attributes by default', () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      expect(host.getAttribute('data-overflow')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
    });

    it('reflects the size and shape inputs', async () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      fixture.componentInstance.size.set('lg');
      fixture.componentInstance.shape.set('square');
      await flush(fixture);

      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-shape')).toBe('square');
    });

    it('reflects the overflow attribute when isOverflow is true', () => {
      const fixture = createInteractiveAvatar({ isOverflow: true });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.getAttribute('data-overflow')).toBe('true');
    });

    it('reflects the disabled attribute when disabled is true', () => {
      const fixture = createInteractiveAvatar({ disabled: true });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.getAttribute('data-disabled')).toBe('true');
    });
  });

  describe('color index', () => {
    it('falls back to color index zero for a blank label', () => {
      const fixture = createInteractiveAvatar({ label: '   ' });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.getAttribute('data-color-index')).toBe('0');
    });

    it('produces a different color index for a different leading character', async () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      // default label is 'Alice' (starts with 'a')
      const aliceIndex = host.getAttribute('data-color-index');

      fixture.componentInstance.label.set('Bob');
      await flush(fixture);

      expect(host.getAttribute('data-color-index')).not.toBe(aliceIndex);
    });

    it('wraps the color index using modulo', async () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      // 'a' (97) % 8 === 1
      const aIndex = host.getAttribute('data-color-index');

      fixture.componentInstance.label.set('Iris');
      await flush(fixture);

      // 'i' (105) % 8 === 1 — same as 'a'
      expect(host.getAttribute('data-color-index')).toBe(aIndex);
    });
  });

  describe('overflow', () => {
    it('renders the +N count inside the shape when overflowing', () => {
      const fixture = createInteractiveAvatar({ isOverflow: true });
      const host = queryByTestId(fixture, 'avatar');

      const shape = host.querySelector('org-avatar-shape') as HTMLElement | null;

      expect(shape?.textContent?.trim()).toBe('+5');
    });

    it('suppresses the indicator, image, and label when overflowing', () => {
      const fixture = createInteractiveAvatar({
        hasIndicator: true,
        showLabel: true,
        imgSrc: 'https://example.com/img.png',
        isOverflow: true,
      });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-indicator')).toBeNull();
      expect(host.querySelector('org-avatar-image')).toBeNull();
      expect(host.querySelector('org-avatar-label')).toBeNull();
    });

    it('renders no initials span when overflowing', () => {
      const fixture = createInteractiveAvatar({ isOverflow: true });
      const host = queryByTestId(fixture, 'avatar');

      const shape = host.querySelector('org-avatar-shape') as HTMLElement;

      expect(shape.querySelector('span')).toBeNull();
    });
  });

  describe('image rendering', () => {
    it('renders no image by default', () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-image')).toBeNull();
    });

    it('renders the image when imgSrc is provided', () => {
      const fixture = createInteractiveAvatar({ imgSrc: 'https://example.com/img.png' });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-image')).not.toBeNull();
    });

    it('renders the image when imgEmail is provided', () => {
      const fixture = createInteractiveAvatar({ imgEmail: 'alice@example.com' });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-image')).not.toBeNull();
    });

    it('renders no img element when there is no source', () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('img')).toBeNull();
    });

    it('reflects the provided src on the img', () => {
      const fixture = createInteractiveAvatar({ imgSrc: 'https://example.com/img.png' });
      const host = queryByTestId(fixture, 'avatar');

      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
    });

    it('builds a gravatar url matching the expected shape', () => {
      const fixture = createInteractiveAvatar({ imgEmail: 'alice@example.com' });
      const host = queryByTestId(fixture, 'avatar');

      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toMatch(/^https:\/\/www\.gravatar\.com\/avatar\/[0-9a-f]{32}\?d=404$/);
    });

    it('produces different gravatar urls for different emails', async () => {
      const fixture = createInteractiveAvatar({ imgEmail: 'alice@example.com' });
      const host = queryByTestId(fixture, 'avatar');

      const aliceUrl = (host.querySelector('img') as HTMLImageElement).getAttribute('src');

      expect(aliceUrl).not.toBeNull();

      fixture.componentInstance.imgEmail.set('bob@example.com');
      await flush(fixture);

      const bobUrl = (host.querySelector('img') as HTMLImageElement).getAttribute('src');

      expect(bobUrl).not.toBe(aliceUrl);
    });

    it('prefers explicit imgSrc over imgEmail', () => {
      const fixture = createInteractiveAvatar({
        imgEmail: 'alice@example.com',
        imgSrc: 'https://example.com/img.png',
      });
      const host = queryByTestId(fixture, 'avatar');

      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
    });

    it('does not hide the img initially', async () => {
      const fixture = createInteractiveAvatar({ imgSrc: 'https://example.com/img.png' });
      const host = queryByTestId(fixture, 'avatar');

      await waitFor(() => {
        const img = host.querySelector('img') as HTMLImageElement;

        expect(img.hidden).toBe(false);
      });
    });

    it('hides the img after its error event fires', async () => {
      const fixture = createInteractiveAvatar({ imgSrc: 'https://example.com/img.png' });
      const host = queryByTestId(fixture, 'avatar');

      let img: HTMLImageElement | null = null;

      await waitFor(() => {
        img = host.querySelector('img') as HTMLImageElement;

        expect(img).not.toBeNull();
      });

      img!.dispatchEvent(new Event('error'));

      await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(true));
    });

    it('resets the hidden state when the src changes', async () => {
      const fixture = createInteractiveAvatar({ imgSrc: 'https://example.com/img.png' });
      const host = queryByTestId(fixture, 'avatar');

      await waitFor(() => expect(host.querySelector('img')).not.toBeNull());

      (host.querySelector('img') as HTMLImageElement).dispatchEvent(new Event('error'));

      await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(true));

      // observe before triggering the src change so we capture the transient hidden=false moment before
      // the new src's network 404 fires and flips hidden back to true
      const unhiddenPromise = waitForImgUnhidden(host);

      fixture.componentInstance.imgSrc.set('https://example.com/other.png');
      await flush(fixture);
      await unhiddenPromise;
    });

    it('resets the hidden state when the email changes', async () => {
      const fixture = createInteractiveAvatar({ imgEmail: 'alice@example.com' });
      const host = queryByTestId(fixture, 'avatar');

      await waitFor(() => expect(host.querySelector('img')).not.toBeNull());

      (host.querySelector('img') as HTMLImageElement).dispatchEvent(new Event('error'));

      await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(true));

      // observe before triggering the email change so we capture the transient hidden=false moment
      // on remount before the new gravatar url's 404 fires and flips hidden back to true
      const unhiddenPromise = waitForImgUnhidden(host);

      fixture.componentInstance.imgEmail.set(undefined);
      await flush(fixture);
      fixture.componentInstance.imgEmail.set('bob@example.com');
      await flush(fixture);
      await unhiddenPromise;
    });
  });

  describe('image alt', () => {
    it('falls back to the parent label for the img alt', () => {
      const fixture = createInteractiveAvatar({ label: 'Alice Smith', imgSrc: 'https://example.com/img.png' });
      const host = queryByTestId(fixture, 'avatar');

      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('Alice Smith');
    });

    it('uses the explicit imgAlt when provided', () => {
      const fixture = createInteractiveAvatar({ imgSrc: 'https://example.com/img.png', imgAlt: 'custom alt' });
      const host = queryByTestId(fixture, 'avatar');

      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('custom alt');
    });

    it('falls back to the parent label when imgAlt is null', () => {
      const fixture = createInteractiveAvatar({
        label: 'Alice Smith',
        imgSrc: 'https://example.com/img.png',
        imgAlt: null,
      });
      const host = queryByTestId(fixture, 'avatar');

      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('Alice Smith');
    });
  });

  describe('indicator', () => {
    it('renders no indicator by default', () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-indicator')).toBeNull();
    });

    it('renders the indicator when hasIndicator is true', () => {
      const fixture = createInteractiveAvatar({ hasIndicator: true });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-indicator')).not.toBeNull();
    });
  });

  describe('label and initials', () => {
    it('renders no label by default', () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-label')).toBeNull();
    });

    it('renders the label when showLabel is true', () => {
      const fixture = createInteractiveAvatar({ showLabel: true });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-label')).not.toBeNull();
    });

    it('renders the main label text', () => {
      const fixture = createInteractiveAvatar({ label: 'Alice Smith', showLabel: true });
      const host = queryByTestId(fixture, 'avatar');

      const main = host.querySelector('org-avatar-label .label') as HTMLElement;

      expect(main.textContent?.trim()).toBe('Alice Smith');
    });

    it('renders no sub-label by default', () => {
      const fixture = createInteractiveAvatar({ showLabel: true });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-label')).not.toBeNull();
      expect(host.querySelector('org-avatar-label .sub-label')).toBeNull();
    });

    it('renders the sub-label when provided', () => {
      const fixture = createInteractiveAvatar({ showLabel: true, subLabel: 'Engineer' });
      const host = queryByTestId(fixture, 'avatar');

      const subLabel = host.querySelector('org-avatar-label .sub-label') as HTMLElement;

      expect(subLabel.textContent?.trim()).toBe('Engineer');
    });

    it('renders two-word initials', () => {
      const fixture = createInteractiveAvatar({ label: 'Alice Smith' });
      const host = queryByTestId(fixture, 'avatar');

      const initials = host.querySelector('org-avatar-shape span') as HTMLElement;

      expect(initials.textContent?.trim()).toBe('AS');
    });

    it('renders single-word initials', () => {
      const fixture = createInteractiveAvatar({ label: 'alpha' });
      const host = queryByTestId(fixture, 'avatar');

      const initials = host.querySelector('org-avatar-shape span') as HTMLElement;

      expect(initials.textContent?.trim()).toBe('AL');
    });

    it('renders no initials span when the label is empty', () => {
      const fixture = createInteractiveAvatar({ label: '' });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-shape span')).toBeNull();
    });

    it('renders no initials span when the label is whitespace', () => {
      const fixture = createInteractiveAvatar({ label: '   ' });
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('org-avatar-shape span')).toBeNull();
    });
  });

  describe('clickable and clicked output', () => {
    it('omits the clickable attribute for a static avatar', () => {
      const fixture = createFixture(AvatarStaticHost);
      const host = queryByTestId(fixture, 'avatar');

      expect(host.getAttribute('data-clickable')).toBeNull();
    });

    it('renders an inner button with an aria-label when clickable', () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');

      const innerButton = host.querySelector('button');

      expect(innerButton).not.toBeNull();
      expect(innerButton?.getAttribute('aria-label')).toBe('Alice');
      expect(host.getAttribute('data-clickable')).toBe('true');
    });

    it('renders a span instead of a button when static', () => {
      const fixture = createFixture(AvatarStaticHost);
      const host = queryByTestId(fixture, 'avatar');

      expect(host.querySelector('button')).toBeNull();
      expect(host.querySelector(':scope > span')).not.toBeNull();
    });

    it('emits clicked on inner button click', async () => {
      const fixture = createInteractiveAvatar();
      const host = queryByTestId(fixture, 'avatar');
      const innerButton = host.querySelector('button') as HTMLButtonElement;
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('clickCount=0');

      await userEvent.click(innerButton);

      await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
    });

    it('disables the inner button when disabled', () => {
      const fixture = createInteractiveAvatar({ disabled: true });
      const host = queryByTestId(fixture, 'avatar');

      const innerButton = host.querySelector('button') as HTMLButtonElement;

      expect(innerButton.disabled).toBe(true);
    });

    it('does not emit clicked when disabled', async () => {
      const fixture = createInteractiveAvatar({ disabled: true });
      const host = queryByTestId(fixture, 'avatar');
      const innerButton = host.querySelector('button') as HTMLButtonElement;
      const readout = queryByTestId(fixture, 'readout');

      innerButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });
  });

  describe('avatar stack', () => {
    it('uses the local size for a solo avatar', () => {
      const fixture = createFixture(AvatarStackHost);
      const solo = queryByTestId(fixture, 'solo');

      expect(solo.getAttribute('data-size')).toBe('sm');
    });

    it('inherits the stack size over the local size for a stacked avatar', () => {
      const fixture = createFixture(AvatarStackHost);
      const stacked = queryByTestId(fixture, 'stacked');

      expect(stacked.getAttribute('data-size')).toBe('lg');
    });

    it('updates the stacked avatar size when the stack size changes', async () => {
      const fixture = createFixture(AvatarStackHost);
      const stacked = queryByTestId(fixture, 'stacked');

      fixture.componentInstance.stackSize.set('base');
      await flush(fixture);

      expect(stacked.getAttribute('data-size')).toBe('base');
    });

    it('reflects the size attribute on the stack', () => {
      const fixture = createFixture(AvatarStackHost);
      const stack = queryByTestId(fixture, 'stack');

      expect(stack.getAttribute('data-size')).toBe('lg');
    });

    it('updates the stack size attribute when changed', async () => {
      const fixture = createFixture(AvatarStackHost);
      const stack = queryByTestId(fixture, 'stack');

      fixture.componentInstance.stackSize.set('sm');
      await flush(fixture);

      expect(stack.getAttribute('data-size')).toBe('sm');
    });

    it('projects the child avatars into the stack', () => {
      const fixture = createFixture(AvatarStackHost);
      const stack = queryByTestId(fixture, 'stack');

      expect(stack.querySelectorAll('org-avatar').length).toBe(2);
    });
  });
});
