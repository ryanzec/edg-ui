import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils, type SilencedLogManager } from '../../../../../../vitest-browser-utils';
import { Button, type ButtonColor, type ButtonSize, type ButtonType, type ButtonVariant } from './button';
import { ButtonGroup, type ButtonGroupOrientation } from './button-group';
import { type IconName } from '../icon/icon-brain';

@Component({
  selector: 'test-button-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button
      data-testid="button"
      [label]="label()"
      [color]="color()"
      [variant]="variant()"
      [size]="size()"
      [type]="type()"
      [disabled]="disabled()"
      [loading]="loading()"
      [iconOnly]="iconOnly()"
      [isActive]="isActive()"
      [excludeSpacing]="excludeSpacing()"
      [buttonClass]="buttonClass()"
      [ariaLabel]="ariaLabel()"
      [ariaExpanded]="ariaExpanded()"
      [ariaPressed]="ariaPressed()"
      [ariaHaspopup]="ariaHaspopup()"
      [ariaControls]="ariaControls()"
      [ariaActivedescendant]="ariaActivedescendant()"
      [preIcon]="preIcon()"
      [postIcon]="postIcon()"
      (clicked)="handleClicked()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class ButtonInteractiveHost {
  protected readonly buttonComponent = viewChild.required(Button);

  public readonly label = signal<string>('click me');
  public readonly color = signal<ButtonColor>('primary');
  public readonly variant = signal<ButtonVariant>('filled');
  public readonly size = signal<ButtonSize>('base');
  public readonly type = signal<ButtonType>('button');
  public readonly disabled = signal<boolean>(false);
  public readonly loading = signal<boolean>(false);
  public readonly iconOnly = signal<boolean>(false);
  public readonly isActive = signal<boolean>(false);
  public readonly excludeSpacing = signal<boolean>(false);
  public readonly buttonClass = signal<string>('');
  public readonly ariaLabel = signal<string | null | undefined>(undefined);
  public readonly ariaExpanded = signal<boolean | null | undefined>(undefined);
  public readonly ariaPressed = signal<boolean | null | undefined>(undefined);
  public readonly ariaHaspopup = signal<string | null | undefined>(undefined);
  public readonly ariaControls = signal<string | null | undefined>(undefined);
  public readonly ariaActivedescendant = signal<string | null | undefined>(undefined);
  public readonly preIcon = signal<IconName | null | undefined>(undefined);
  public readonly postIcon = signal<IconName | null | undefined>(undefined);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    const button = this.buttonComponent();

    return `clickCount=${this.clickCount()} isPressed=${button.isPressed()} isFocused=${button.isFocused()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-button-content-projection-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button data-testid="button-content" label="fallback">
      <ng-template #content>
        <strong data-testid="custom-content">custom</strong>
      </ng-template>
    </org-button>

    <org-button data-testid="button-pre" label="pre slot">
      <ng-template #pre>
        <span data-testid="custom-pre">custom-pre</span>
      </ng-template>
    </org-button>

    <org-button data-testid="button-post" label="post slot">
      <ng-template #post>
        <span data-testid="custom-post">custom-post</span>
      </ng-template>
    </org-button>
  `,
})
class ButtonContentProjectionHost {}

@Component({
  selector: 'test-button-pre-conflict-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button data-testid="button" label="conflict" preIcon="check">
      <ng-template #pre>
        <span data-testid="projected-pre">projected</span>
      </ng-template>
    </org-button>
  `,
})
class ButtonPreConflictHost {}

@Component({
  selector: 'test-button-post-conflict-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button data-testid="button" label="conflict" postIcon="check">
      <ng-template #post>
        <span data-testid="projected-post">projected</span>
      </ng-template>
    </org-button>
  `,
})
class ButtonPostConflictHost {}

@Component({
  selector: 'test-button-group-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonGroup],
  host: { class: 'block' },
  template: `
    <org-button-group data-testid="group" [orientation]="orientation()">
      <org-button label="one" />
      <org-button label="two" />
    </org-button-group>
  `,
})
class ButtonGroupHost {
  public readonly orientation = signal<ButtonGroupOrientation>('horizontal');
}

type ButtonHostConfig = {
  label?: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  isActive?: boolean;
  excludeSpacing?: boolean;
  buttonClass?: string;
  ariaLabel?: string | null;
  ariaExpanded?: boolean | null;
  ariaPressed?: boolean | null;
  ariaHaspopup?: string | null;
  ariaControls?: string | null;
  ariaActivedescendant?: string | null;
  preIcon?: IconName | null;
  postIcon?: IconName | null;
};

describe('Button (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveButton = (config: ButtonHostConfig = {}): ComponentFixture<ButtonInteractiveHost> =>
    createFixture(ButtonInteractiveHost, (instance) => {
      if (config.label !== undefined) {
        instance.label.set(config.label);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.variant !== undefined) {
        instance.variant.set(config.variant);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.type !== undefined) {
        instance.type.set(config.type);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.loading !== undefined) {
        instance.loading.set(config.loading);
      }

      if (config.iconOnly !== undefined) {
        instance.iconOnly.set(config.iconOnly);
      }

      if (config.isActive !== undefined) {
        instance.isActive.set(config.isActive);
      }

      if (config.excludeSpacing !== undefined) {
        instance.excludeSpacing.set(config.excludeSpacing);
      }

      if (config.buttonClass !== undefined) {
        instance.buttonClass.set(config.buttonClass);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }

      if (config.ariaExpanded !== undefined) {
        instance.ariaExpanded.set(config.ariaExpanded);
      }

      if (config.ariaPressed !== undefined) {
        instance.ariaPressed.set(config.ariaPressed);
      }

      if (config.ariaHaspopup !== undefined) {
        instance.ariaHaspopup.set(config.ariaHaspopup);
      }

      if (config.ariaControls !== undefined) {
        instance.ariaControls.set(config.ariaControls);
      }

      if (config.ariaActivedescendant !== undefined) {
        instance.ariaActivedescendant.set(config.ariaActivedescendant);
      }

      if (config.preIcon !== undefined) {
        instance.preIcon.set(config.preIcon);
      }

      if (config.postIcon !== undefined) {
        instance.postIcon.set(config.postIcon);
      }
    });

  const getInnerButton = (fixture: ComponentFixture<unknown>): HTMLButtonElement =>
    queryByTestId(fixture, 'button').querySelector('button') as HTMLButtonElement;

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    let logManagerSilence: SilencedLogManager;

    beforeEach(() => {
      logManagerSilence = vitestBrowserUtils.silenceLogManager();
    });

    afterEach(() => {
      logManagerSilence.restore();
    });

    it('renders the default color, variant, and size attributes', () => {
      const fixture = createInteractiveButton();
      const host = queryByTestId(fixture, 'button');

      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-variant')).toBe('filled');
      expect(host.getAttribute('data-size')).toBe('base');
    });

    it('omits the boolean host attributes by default', () => {
      const fixture = createInteractiveButton();
      const host = queryByTestId(fixture, 'button');

      expect(host.getAttribute('data-icon-only')).toBeNull();
      expect(host.getAttribute('data-exclude-spacing')).toBeNull();
      expect(host.getAttribute('data-loading')).toBeNull();
      expect(host.getAttribute('data-active')).toBeNull();
    });

    it('reflects the configured host attributes', () => {
      const fixture = createInteractiveButton({
        color: 'danger',
        variant: 'ghost',
        size: 'lg',
        iconOnly: true,
        excludeSpacing: true,
        isActive: true,
      });
      const host = queryByTestId(fixture, 'button');

      expect(host.getAttribute('data-color')).toBe('danger');
      expect(host.getAttribute('data-variant')).toBe('ghost');
      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-icon-only')).toBe('');
      expect(host.getAttribute('data-exclude-spacing')).toBe('');
      expect(host.getAttribute('data-active')).toBe('');
    });

    it('toggles the data-loading attribute', async () => {
      const fixture = createInteractiveButton();
      const host = queryByTestId(fixture, 'button');

      expect(host.getAttribute('data-loading')).toBeNull();

      fixture.componentInstance.loading.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-loading')).toBe('');
    });
  });

  describe('label, type, class, and disabled', () => {
    it('renders the label inside a span', () => {
      const fixture = createInteractiveButton();
      const labelSpan = getInnerButton(fixture).querySelector('span');

      expect(labelSpan?.textContent?.trim()).toBe('click me');
    });

    it('forwards the type to the native button', () => {
      const fixture = createInteractiveButton({ type: 'submit' });

      expect(getInnerButton(fixture).type).toBe('submit');
    });

    it('applies the button class to the inner button', () => {
      const fixture = createInteractiveButton({ buttonClass: 'extra-class' });

      expect(getInnerButton(fixture).classList.contains('extra-class')).toBe(true);
    });

    it('disables the inner button when disabled', async () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);

      expect(innerButton.disabled).toBe(false);

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(innerButton.disabled).toBe(true);
    });
  });

  describe('icon and loading rendering', () => {
    it('hides the label span in icon-only mode', () => {
      const fixture = createInteractiveButton({ ariaLabel: 'do thing', preIcon: 'check', iconOnly: true });

      expect(getInnerButton(fixture).querySelector('span')).toBeNull();
    });

    it('renders the spinner and hides the icons while loading', () => {
      const fixture = createInteractiveButton({ preIcon: 'check', postIcon: 'check', loading: true });
      const innerButton = getInnerButton(fixture);

      expect(innerButton.querySelector('org-loading-spinner')).not.toBeNull();
      expect(innerButton.querySelector('.pre-icon')).toBeNull();
      expect(innerButton.querySelector('.post-icon')).toBeNull();
    });

    it('restores the icons when loading is turned off', async () => {
      const fixture = createInteractiveButton({ preIcon: 'check', postIcon: 'check', loading: true });
      const innerButton = getInnerButton(fixture);

      fixture.componentInstance.loading.set(false);
      await flush(fixture);

      expect(innerButton.querySelector('org-loading-spinner')).toBeNull();
      expect(innerButton.querySelector('.pre-icon')).not.toBeNull();
      expect(innerButton.querySelector('.post-icon')).not.toBeNull();
    });

    it('maps the icon size to xs for a small button', () => {
      const fixture = createInteractiveButton({ preIcon: 'check', size: 'sm' });
      const icon = queryByTestId(fixture, 'button').querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('xs');
    });

    it('maps the icon size to base for a base button', () => {
      const fixture = createInteractiveButton({ preIcon: 'check' });
      const icon = queryByTestId(fixture, 'button').querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('base');
    });

    it('maps the icon size to 2xl for a large button', () => {
      const fixture = createInteractiveButton({ preIcon: 'check', size: 'lg' });
      const icon = queryByTestId(fixture, 'button').querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('2xl');
    });
  });

  describe('content projection', () => {
    let logManagerSilence: SilencedLogManager;

    beforeEach(() => {
      logManagerSilence = vitestBrowserUtils.silenceLogManager();
    });

    afterEach(() => {
      logManagerSilence.restore();
    });

    it('renders the projected content template instead of the label', () => {
      const fixture = createFixture(ButtonContentProjectionHost);
      const host = queryByTestId(fixture, 'button-content');

      expect(host.querySelector('[data-testid="custom-content"]')).not.toBeNull();
      expect(host.querySelector('button > span')).toBeNull();
    });

    it('renders the projected pre template', () => {
      const fixture = createFixture(ButtonContentProjectionHost);
      const host = queryByTestId(fixture, 'button-pre');

      expect(host.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
    });

    it('renders the projected post template', () => {
      const fixture = createFixture(ButtonContentProjectionHost);
      const host = queryByTestId(fixture, 'button-post');

      expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    });

    it('lets the projected pre template win over the pre icon', () => {
      const fixture = createFixture(ButtonPreConflictHost);
      const host = queryByTestId(fixture, 'button');

      expect(host.querySelector('[data-testid="projected-pre"]')).not.toBeNull();
      expect(host.querySelector('.pre-icon')).toBeNull();
    });

    it('lets the projected post template win over the post icon', () => {
      const fixture = createFixture(ButtonPostConflictHost);
      const host = queryByTestId(fixture, 'button');

      expect(host.querySelector('[data-testid="projected-post"]')).not.toBeNull();
      expect(host.querySelector('.post-icon')).toBeNull();
    });
  });

  describe('clicked output', () => {
    it('emits clicked on click', async () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('clickCount=0');

      await userEvent.click(innerButton);

      await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
    });

    it('does not emit clicked when disabled', async () => {
      const fixture = createInteractiveButton({ disabled: true });
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });

    it('does not emit clicked when loading', async () => {
      const fixture = createInteractiveButton({ loading: true });
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });
  });

  describe('aria attributes', () => {
    it('applies the aria-label attribute', () => {
      const fixture = createInteractiveButton({ ariaLabel: 'do thing' });

      expect(getInnerButton(fixture).getAttribute('aria-label')).toBe('do thing');
    });

    it('applies the aria-expanded attribute', () => {
      const fixture = createInteractiveButton({ ariaExpanded: true });

      expect(getInnerButton(fixture).getAttribute('aria-expanded')).toBe('true');
    });

    it('applies the aria-pressed attribute', () => {
      const fixture = createInteractiveButton({ ariaPressed: false });

      expect(getInnerButton(fixture).getAttribute('aria-pressed')).toBe('false');
    });

    it('applies the aria-haspopup attribute', () => {
      const fixture = createInteractiveButton({ ariaHaspopup: 'menu' });

      expect(getInnerButton(fixture).getAttribute('aria-haspopup')).toBe('menu');
    });

    it('applies the aria-controls attribute', () => {
      const fixture = createInteractiveButton({ ariaControls: 'panel-1' });

      expect(getInnerButton(fixture).getAttribute('aria-controls')).toBe('panel-1');
    });

    it('applies the aria-activedescendant attribute', () => {
      const fixture = createInteractiveButton({ ariaActivedescendant: 'option-3' });

      expect(getInnerButton(fixture).getAttribute('aria-activedescendant')).toBe('option-3');
    });

    it('transforms null aria values into omitted attributes', async () => {
      const fixture = createInteractiveButton({
        ariaLabel: 'do thing',
        ariaExpanded: true,
        ariaPressed: false,
        ariaHaspopup: 'menu',
        ariaControls: 'panel-1',
        ariaActivedescendant: 'option-3',
      });
      const innerButton = getInnerButton(fixture);

      fixture.componentInstance.ariaLabel.set(null);
      fixture.componentInstance.ariaExpanded.set(null);
      fixture.componentInstance.ariaPressed.set(null);
      fixture.componentInstance.ariaHaspopup.set(null);
      fixture.componentInstance.ariaControls.set(null);
      fixture.componentInstance.ariaActivedescendant.set(null);
      await flush(fixture);

      expect(innerButton.getAttribute('aria-label')).toBeNull();
      expect(innerButton.getAttribute('aria-expanded')).toBeNull();
      expect(innerButton.getAttribute('aria-pressed')).toBeNull();
      expect(innerButton.getAttribute('aria-haspopup')).toBeNull();
      expect(innerButton.getAttribute('aria-controls')).toBeNull();
      expect(innerButton.getAttribute('aria-activedescendant')).toBeNull();
    });
  });

  describe('disabled and loading accessibility', () => {
    it('defaults to not disabled with no aria-busy', () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);

      expect(innerButton.disabled).toBe(false);
      expect(innerButton.getAttribute('aria-disabled')).toBeNull();
      expect(innerButton.getAttribute('aria-busy')).toBeNull();
    });

    it('sets native disabled and aria-disabled when disabled', () => {
      const fixture = createInteractiveButton({ disabled: true });
      const innerButton = getInnerButton(fixture);

      expect(innerButton.disabled).toBe(true);
      expect(innerButton.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets aria-busy and aria-disabled when loading', () => {
      const fixture = createInteractiveButton({ loading: true });
      const innerButton = getInnerButton(fixture);

      expect(innerButton.disabled).toBe(true);
      expect(innerButton.getAttribute('aria-disabled')).toBe('true');
      expect(innerButton.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('pressed state', () => {
    it('sets pressed on mouse down and clears it on mouse up', async () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

      innerButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
    });

    it('clears pressed on mouse leave', async () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

      innerButton.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
    });

    it('does not enter pressed on mouse down when disabled', async () => {
      const fixture = createInteractiveButton({ disabled: true });
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('isPressed=false');
    });

    it('sets pressed on touch start and clears it on touch end', async () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

      innerButton.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
    });

    it('clears pressed on touch cancel', async () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

      innerButton.dispatchEvent(new TouchEvent('touchcancel', { bubbles: true }));
      await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
    });

    it('does not enter pressed on touch start when disabled', async () => {
      const fixture = createInteractiveButton({ disabled: true });
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('isPressed=false');
    });
  });

  describe('focus state', () => {
    it('updates isFocused on focus and blur', async () => {
      const fixture = createInteractiveButton();
      const innerButton = getInnerButton(fixture);
      const readout = queryByTestId(fixture, 'readout');

      innerButton.focus();
      await waitFor(() => expect(readout.textContent).toContain('isFocused=true'));

      innerButton.blur();
      await waitFor(() => expect(readout.textContent).toContain('isFocused=false'));
    });
  });

  describe('button group', () => {
    it('renders the default horizontal orientation', () => {
      const fixture = createFixture(ButtonGroupHost);
      const group = queryByTestId(fixture, 'group');

      expect(group.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('reflects the orientation input', async () => {
      const fixture = createFixture(ButtonGroupHost);
      const group = queryByTestId(fixture, 'group');

      fixture.componentInstance.orientation.set('vertical');
      await flush(fixture);

      expect(group.getAttribute('data-orientation')).toBe('vertical');

      fixture.componentInstance.orientation.set('horizontal');
      await flush(fixture);

      expect(group.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('renders the projected button children', () => {
      const fixture = createFixture(ButtonGroupHost);
      const group = queryByTestId(fixture, 'group');

      expect(group.querySelectorAll('org-button').length).toBe(2);
    });
  });
});
