import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils, type SilencedLogManager } from '../../../../../../vitest-browser-utils';
import { Label } from './label';

@Component({
  selector: 'test-label-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Label],
  host: { class: 'block' },
  template: `
    <org-label
      data-testid="label"
      [text]="text()"
      [isLoading]="isLoading()"
      [isRequired]="isRequired()"
      [htmlFor]="htmlFor()"
      [asLabel]="asLabel()"
    />
  `,
})
class LabelInteractiveHost {
  public readonly text = signal<string>('Email address');
  public readonly isLoading = signal<boolean>(false);
  public readonly isRequired = signal<boolean>(false);
  public readonly htmlFor = signal<string | null | undefined>('email-input');
  public readonly asLabel = signal<boolean>(true);
}

@Component({
  selector: 'test-label-post-projection-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Label],
  host: { class: 'block' },
  template: `
    <org-label data-testid="label" htmlFor="post-input" text="Bio">
      <span post data-testid="post-content">24 / 160</span>
    </org-label>
  `,
})
class LabelPostProjectionHost {}

@Component({
  selector: 'test-label-association-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Label],
  host: { class: 'block' },
  template: `
    <org-label data-testid="label" htmlFor="associated-input" text="Email address" />
    <input data-testid="associated-input" id="associated-input" type="email" />
  `,
})
class LabelAssociationHost {}

type LabelHostConfig = {
  text?: string;
  asLabel?: boolean;
  isLoading?: boolean;
  isRequired?: boolean;
  htmlFor?: string | null;
};

describe('Label (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveLabel = (config: LabelHostConfig = {}): ComponentFixture<LabelInteractiveHost> =>
    createFixture(LabelInteractiveHost, (instance) => {
      if (config.text !== undefined) {
        instance.text.set(config.text);
      }

      if (config.asLabel !== undefined) {
        instance.asLabel.set(config.asLabel);
      }

      if (config.isLoading !== undefined) {
        instance.isLoading.set(config.isLoading);
      }

      if (config.isRequired !== undefined) {
        instance.isRequired.set(config.isRequired);
      }

      if (config.htmlFor !== undefined) {
        instance.htmlFor.set(config.htmlFor);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('element rendering', () => {
    it('renders as a native label by default', () => {
      const fixture = createInteractiveLabel();
      const host = queryByTestId(fixture, 'label');

      expect(host.querySelector('label')).not.toBeNull();
      expect(host.querySelector('div.org-label')).toBeNull();
    });

    it('renders as a div when asLabel is false', () => {
      const fixture = createInteractiveLabel({ asLabel: false });
      const host = queryByTestId(fixture, 'label');

      expect(host.querySelector('label')).toBeNull();
      expect(host.querySelector('div.org-label')).not.toBeNull();
    });

    it('swaps the rendered element when asLabel toggles', async () => {
      const fixture = createInteractiveLabel();
      const host = queryByTestId(fixture, 'label');

      expect(host.querySelector('label')).not.toBeNull();

      fixture.componentInstance.asLabel.set(false);
      await flush(fixture);

      expect(host.querySelector('label')).toBeNull();
      expect(host.querySelector('div.org-label')).not.toBeNull();

      fixture.componentInstance.asLabel.set(true);
      await flush(fixture);

      expect(host.querySelector('label')).not.toBeNull();
      expect(host.querySelector('div.org-label')).toBeNull();
    });
  });

  describe('htmlFor', () => {
    let logManagerSilence: SilencedLogManager;

    beforeEach(() => {
      logManagerSilence = vitestBrowserUtils.silenceLogManager();
    });

    afterEach(() => {
      logManagerSilence.restore();
    });

    it('applies htmlFor as the for attribute', () => {
      const fixture = createInteractiveLabel();
      const host = queryByTestId(fixture, 'label');
      const labelElement = host.querySelector('label') as HTMLLabelElement;

      expect(labelElement.getAttribute('for')).toBe('email-input');
    });

    it('omits the for attribute when htmlFor is null', async () => {
      const fixture = createInteractiveLabel();
      const host = queryByTestId(fixture, 'label');

      fixture.componentInstance.htmlFor.set(null);
      await flush(fixture);

      const labelElement = host.querySelector('label') as HTMLLabelElement;

      expect(labelElement.getAttribute('for')).toBeNull();
    });
  });

  describe('text', () => {
    it('renders text inside the label text span', () => {
      const fixture = createInteractiveLabel();
      const host = queryByTestId(fixture, 'label');
      const textSpan = host.querySelector('.org-label-text') as HTMLSpanElement;

      expect(textSpan.textContent?.trim()).toBe('Email address');
    });

    it('updates the text when the input changes', async () => {
      const fixture = createInteractiveLabel();
      const host = queryByTestId(fixture, 'label');
      const textSpan = host.querySelector('.org-label-text') as HTMLSpanElement;

      expect(textSpan.textContent?.trim()).toBe('Email address');

      fixture.componentInstance.text.set('Updated text');

      await waitFor(() => expect(textSpan.textContent?.trim()).toBe('Updated text'));
    });
  });

  describe('data attributes', () => {
    it('omits data-loading and data-required by default', () => {
      const fixture = createInteractiveLabel();
      const host = queryByTestId(fixture, 'label');
      const labelElement = host.querySelector('label') as HTMLLabelElement;

      expect(labelElement.getAttribute('data-loading')).toBeNull();
      expect(labelElement.getAttribute('data-required')).toBeNull();
    });

    it('sets data-loading and renders a spinner when isLoading is true', () => {
      const fixture = createInteractiveLabel({ isLoading: true });
      const host = queryByTestId(fixture, 'label');
      const labelElement = host.querySelector('label') as HTMLLabelElement;

      expect(labelElement.getAttribute('data-loading')).toBe('1');
      expect(labelElement.querySelector('org-loading-spinner')).not.toBeNull();
    });

    it('removes the spinner and data-loading when isLoading turns off', async () => {
      const fixture = createInteractiveLabel({ isLoading: true });
      const host = queryByTestId(fixture, 'label');

      fixture.componentInstance.isLoading.set(false);
      await flush(fixture);

      const labelElement = host.querySelector('label') as HTMLLabelElement;

      expect(labelElement.getAttribute('data-loading')).toBeNull();
      expect(labelElement.querySelector('org-loading-spinner')).toBeNull();
    });

    it('sets data-required when isRequired is true', () => {
      const fixture = createInteractiveLabel({ isRequired: true });
      const host = queryByTestId(fixture, 'label');
      const labelElement = host.querySelector('label') as HTMLLabelElement;

      expect(labelElement.getAttribute('data-required')).toBe('1');
    });

    it('removes data-required when isRequired turns off', async () => {
      const fixture = createInteractiveLabel({ isRequired: true });
      const host = queryByTestId(fixture, 'label');

      fixture.componentInstance.isRequired.set(false);
      await flush(fixture);

      const labelElement = host.querySelector('label') as HTMLLabelElement;

      expect(labelElement.getAttribute('data-required')).toBeNull();
    });

    it('applies data attributes when rendered as a div', () => {
      const fixture = createInteractiveLabel({ asLabel: false, isRequired: true, isLoading: true });
      const host = queryByTestId(fixture, 'label');
      const divElement = host.querySelector('div.org-label') as HTMLDivElement;

      expect(divElement.getAttribute('data-required')).toBe('1');
      expect(divElement.getAttribute('data-loading')).toBe('1');
      expect(divElement.querySelector('org-loading-spinner')).not.toBeNull();
    });
  });

  describe('content projection', () => {
    it('renders projected post content', () => {
      const fixture = createFixture(LabelPostProjectionHost);
      const host = queryByTestId(fixture, 'label');
      const postSlot = host.querySelector('.org-label-post') as HTMLSpanElement;

      expect(postSlot.querySelector('[data-testid="post-content"]')).not.toBeNull();
      expect(postSlot.textContent?.trim()).toBe('24 / 160');
    });
  });

  describe('label association', () => {
    it('focuses the associated control when the label is clicked', async () => {
      const fixture = createFixture(LabelAssociationHost);
      const host = queryByTestId(fixture, 'label');
      const labelElement = host.querySelector('label') as HTMLLabelElement;
      const associatedInput = queryByTestId(fixture, 'associated-input') as HTMLInputElement;

      expect(document.activeElement).not.toBe(associatedInput);

      await userEvent.click(labelElement);

      await waitFor(() => expect(document.activeElement).toBe(associatedInput));
    });
  });
});
