import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import {
  LoadingBlocker,
  type LoadingBlockerColor,
  type LoadingBlockerIntensity,
  type LoadingBlockerScope,
  type LoadingBlockerSpinnerSize,
} from './loading-blocker';

@Component({
  selector: 'test-loading-blocker-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker],
  host: { class: 'block' },
  template: `
    <div class="relative min-h-4xs">
      <org-loading-blocker
        data-testid="blocker"
        [isVisible]="isVisible()"
        [label]="label()"
        [intensity]="intensity()"
        [scope]="scope()"
        [color]="color()"
        [spinnerSize]="spinnerSize()"
      />
    </div>
  `,
})
class LoadingBlockerInteractiveHost {
  public readonly isVisible = signal<boolean>(false);
  public readonly label = signal<string>('');
  public readonly intensity = signal<LoadingBlockerIntensity>('medium');
  public readonly scope = signal<LoadingBlockerScope>('region');
  public readonly color = signal<LoadingBlockerColor | null | undefined>(undefined);
  public readonly spinnerSize = signal<LoadingBlockerSpinnerSize>('2xl');
}

@Component({
  selector: 'test-loading-blocker-static-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker],
  host: { class: 'block' },
  template: `
    <div class="relative min-h-4xs">
      <org-loading-blocker data-testid="blocker" />
    </div>
  `,
})
class LoadingBlockerStaticHost {}

type LoadingBlockerHostConfig = {
  isVisible?: boolean;
  label?: string;
  intensity?: LoadingBlockerIntensity;
  scope?: LoadingBlockerScope;
  color?: LoadingBlockerColor | null;
  spinnerSize?: LoadingBlockerSpinnerSize;
};

describe('Loading Blocker (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveBlocker = (
    config: LoadingBlockerHostConfig = {}
  ): ComponentFixture<LoadingBlockerInteractiveHost> =>
    createFixture(LoadingBlockerInteractiveHost, (instance) => {
      if (config.isVisible !== undefined) {
        instance.isVisible.set(config.isVisible);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }

      if (config.intensity !== undefined) {
        instance.intensity.set(config.intensity);
      }

      if (config.scope !== undefined) {
        instance.scope.set(config.scope);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.spinnerSize !== undefined) {
        instance.spinnerSize.set(config.spinnerSize);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default data attributes', () => {
      const fixture = createFixture(LoadingBlockerStaticHost);
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('data-intensity')).toBe('medium');
      expect(blocker.getAttribute('data-scope')).toBe('region');
      expect(blocker.getAttribute('data-spinner-size')).toBe('2xl');
      expect(blocker.getAttribute('data-color')).toBeNull();
      expect(blocker.getAttribute('data-visible')).toBeNull();
    });

    it('renders the static a11y attributes', () => {
      const fixture = createFixture(LoadingBlockerStaticHost);
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('role')).toBe('status');
      expect(blocker.getAttribute('tabindex')).toBe('-1');
      expect(blocker.getAttribute('aria-live')).toBe('polite');
    });

    it('omits data-visible when hidden', () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('data-visible')).toBeNull();
    });

    it('sets data-visible when isVisible is true', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      fixture.componentInstance.isVisible.set(true);
      await flush(fixture);

      await waitFor(() => expect(blocker.getAttribute('data-visible')).toBe('1'));
    });

    it('reflects aria-busy from isVisible', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('aria-busy')).toBe('false');

      fixture.componentInstance.isVisible.set(true);
      await flush(fixture);

      await waitFor(() => expect(blocker.getAttribute('aria-busy')).toBe('true'));
    });

    it('reflects the intensity attribute', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('data-intensity')).toBe('medium');

      fixture.componentInstance.intensity.set('heavy');
      await flush(fixture);
      await waitFor(() => expect(blocker.getAttribute('data-intensity')).toBe('heavy'));

      fixture.componentInstance.intensity.set('light');
      await flush(fixture);
      await waitFor(() => expect(blocker.getAttribute('data-intensity')).toBe('light'));
    });

    it('reflects the scope attribute', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('data-scope')).toBe('region');

      fixture.componentInstance.scope.set('viewport');
      await flush(fixture);

      await waitFor(() => expect(blocker.getAttribute('data-scope')).toBe('viewport'));
    });

    it('reflects the spinner-size attribute', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('data-spinner-size')).toBe('2xl');

      fixture.componentInstance.spinnerSize.set('3xl');
      await flush(fixture);

      await waitFor(() => expect(blocker.getAttribute('data-spinner-size')).toBe('3xl'));
    });

    it('omits data-color by default', () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('data-color')).toBeNull();
    });

    it('reflects the color attribute when set', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      fixture.componentInstance.color.set('danger');
      await flush(fixture);

      await waitFor(() => expect(blocker.getAttribute('data-color')).toBe('danger'));
    });

    it('transforms a null color into an omitted attribute', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      fixture.componentInstance.color.set('danger');
      await flush(fixture);
      await waitFor(() => expect(blocker.getAttribute('data-color')).toBe('danger'));

      fixture.componentInstance.color.set(null);
      await flush(fixture);

      await waitFor(() => expect(blocker.getAttribute('data-color')).toBeNull());
    });
  });

  describe('accessibility label', () => {
    it('falls back to Loading when label is empty', () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.getAttribute('aria-label')).toBe('Loading');
    });

    it('uses the provided label', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      fixture.componentInstance.label.set('Saving changes...');
      await flush(fixture);

      await waitFor(() => expect(blocker.getAttribute('aria-label')).toBe('Saving changes...'));
    });
  });

  describe('text rendering', () => {
    it('omits the text span when label is empty', () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      expect(blocker.querySelector('.text')).toBeNull();
    });

    it('renders the text span with the label', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      fixture.componentInstance.label.set('Saving changes...');
      await flush(fixture);

      await waitFor(() => {
        const text = blocker.querySelector('.text');

        expect(text?.textContent?.trim()).toBe('Saving changes...');
      });
    });
  });

  describe('inner loading spinner', () => {
    it('renders the inner loading spinner with the spinner size', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');

      const spinner = blocker.querySelector('org-loading-spinner');

      expect(spinner).not.toBeNull();
      expect(spinner?.getAttribute('data-size')).toBe('2xl');

      fixture.componentInstance.spinnerSize.set('3xl');
      await flush(fixture);

      await waitFor(() => {
        expect(blocker.querySelector('org-loading-spinner')?.getAttribute('data-size')).toBe('3xl');
      });
    });
  });

  describe('focus trapping', () => {
    it('traps focus when visible', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');
      const parent = blocker.parentElement as HTMLElement;

      fixture.componentInstance.isVisible.set(true);
      await flush(fixture);

      await waitFor(() => {
        const anchors = parent.querySelectorAll('.cdk-focus-trap-anchor');

        expect(anchors.length).toBe(2);
        expect(anchors[0].getAttribute('tabindex')).toBe('0');
        expect(anchors[1].getAttribute('tabindex')).toBe('0');
      });
    });

    it('does not trap focus when hidden', async () => {
      const fixture = createInteractiveBlocker();
      const blocker = queryByTestId(fixture, 'blocker');
      const parent = blocker.parentElement as HTMLElement;

      await waitFor(() => {
        const anchors = parent.querySelectorAll('.cdk-focus-trap-anchor');

        expect(anchors.length).toBe(2);
        expect(anchors[0].getAttribute('tabindex')).toBeNull();
        expect(anchors[1].getAttribute('tabindex')).toBeNull();
      });
    });
  });
});
