import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { logManager } from '@organization/shared-utils';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { ButtonBrainDirective } from './button-brain';

@Component({
  selector: 'test-button-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonBrainDirective],
  template: `
    <button
      orgButtonBrain
      #brainDirective="orgButtonBrain"
      [disabled]="disabled()"
      [loading]="loading()"
      [iconOnly]="iconOnly()"
      [active]="active()"
      [ariaLabel]="ariaLabel()"
      [ariaExpanded]="ariaExpanded()"
      [ariaPressed]="ariaPressed()"
      [ariaHaspopup]="ariaHaspopup()"
      [ariaControls]="ariaControls()"
      [ariaActivedescendant]="ariaActivedescendant()"
      (clicked)="onClicked()"
      data-testid="brain-button"
    >
      label
    </button>
  `,
})
class ButtonBrainHost {
  public readonly disabled = signal<boolean>(false);
  public readonly loading = signal<boolean>(false);
  public readonly iconOnly = signal<boolean>(false);
  public readonly active = signal<boolean>(false);
  public readonly ariaLabel = signal<string | null | undefined>(undefined);
  public readonly ariaExpanded = signal<boolean | null | undefined>(undefined);
  public readonly ariaPressed = signal<boolean | null | undefined>(undefined);
  public readonly ariaHaspopup = signal<string | null | undefined>(undefined);
  public readonly ariaControls = signal<string | null | undefined>(undefined);
  public readonly ariaActivedescendant = signal<string | null | undefined>(undefined);

  public onClicked = vi.fn();

  public readonly brainDirective = viewChild.required<ButtonBrainDirective>('brainDirective');
}

const getButton = (fixture: ComponentFixture<ButtonBrainHost>): HTMLButtonElement =>
  fixture.nativeElement.querySelector('[data-testid="brain-button"]') as HTMLButtonElement;

describe('ButtonBrainDirective', () => {
  let fixture: ComponentFixture<ButtonBrainHost>;
  let component: ButtonBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('aria host bindings', () => {
    it('applies aria-label when provided', async () => {
      component.ariaLabel.set('do thing');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton(fixture).getAttribute('aria-label')).toBe('do thing');
    });

    it('applies aria-expanded when provided', async () => {
      component.ariaExpanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton(fixture).getAttribute('aria-expanded')).toBe('true');
    });

    it('applies aria-pressed when provided', async () => {
      component.ariaPressed.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton(fixture).getAttribute('aria-pressed')).toBe('false');
    });

    it('applies aria-haspopup when provided', async () => {
      component.ariaHaspopup.set('menu');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton(fixture).getAttribute('aria-haspopup')).toBe('menu');
    });

    it('applies aria-controls when provided', async () => {
      component.ariaControls.set('panel-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton(fixture).getAttribute('aria-controls')).toBe('panel-1');
    });

    it('applies aria-activedescendant when provided', async () => {
      component.ariaActivedescendant.set('option-3');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton(fixture).getAttribute('aria-activedescendant')).toBe('option-3');
    });

    it('transforms null aria values to omitted attributes', async () => {
      component.ariaLabel.set(null);
      component.ariaExpanded.set(null);
      component.ariaPressed.set(null);
      component.ariaHaspopup.set(null);
      component.ariaControls.set(null);
      component.ariaActivedescendant.set(null);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = getButton(fixture);

      expect(button.getAttribute('aria-label')).toBeNull();
      expect(button.getAttribute('aria-expanded')).toBeNull();
      expect(button.getAttribute('aria-pressed')).toBeNull();
      expect(button.getAttribute('aria-haspopup')).toBeNull();
      expect(button.getAttribute('aria-controls')).toBeNull();
      expect(button.getAttribute('aria-activedescendant')).toBeNull();
    });
  });

  describe('disabled and loading host bindings', () => {
    it('does not set the native disabled attribute by default', () => {
      expect(getButton(fixture).disabled).toBe(false);
      expect(getButton(fixture).getAttribute('aria-disabled')).toBeNull();
      expect(getButton(fixture).getAttribute('aria-busy')).toBeNull();
    });

    it('sets disabled and aria-disabled when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = getButton(fixture);

      expect(button.disabled).toBe(true);
      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets disabled, aria-disabled, and aria-busy when loading is true', async () => {
      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = getButton(fixture);

      expect(button.disabled).toBe(true);
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(button.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('click handling', () => {
    it('emits clicked when the button is clicked', () => {
      getButton(fixture).click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('does not emit clicked when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getButton(fixture).click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });

    it('does not emit clicked when loading', async () => {
      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getButton(fixture).click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });

  describe('pressed state via mouse events', () => {
    it('sets isPressed on mousedown and clears it on mouseup', async () => {
      const button = getButton(fixture);

      button.dispatchEvent(new MouseEvent('mousedown'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(true);

      button.dispatchEvent(new MouseEvent('mouseup'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(false);
    });

    it('clears isPressed on mouseleave', async () => {
      const button = getButton(fixture);

      button.dispatchEvent(new MouseEvent('mousedown'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brainDirective().isPressed()).toBe(true);

      button.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(false);
    });

    it('does not enter the pressed state on mousedown when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getButton(fixture).dispatchEvent(new MouseEvent('mousedown'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(false);
    });
  });

  describe('pressed state via touch events', () => {
    it('sets isPressed on touchstart and clears it on touchend', async () => {
      const button = getButton(fixture);

      button.dispatchEvent(new Event('touchstart'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(true);

      button.dispatchEvent(new Event('touchend'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(false);
    });

    it('clears isPressed on touchcancel', async () => {
      const button = getButton(fixture);

      button.dispatchEvent(new Event('touchstart'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brainDirective().isPressed()).toBe(true);

      button.dispatchEvent(new Event('touchcancel'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(false);
    });

    it('does not enter the pressed state on touchstart when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getButton(fixture).dispatchEvent(new Event('touchstart'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isPressed()).toBe(false);
    });
  });

  describe('focus monitoring', () => {
    it('updates isFocused when the button gains and loses focus', async () => {
      const button = getButton(fixture);

      button.focus();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isFocused()).toBe(true);

      button.blur();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isFocused()).toBe(false);
    });
  });

  describe('isDisabled computed', () => {
    it('is true when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isDisabled()).toBe(true);
    });

    it('is true when loading is true', async () => {
      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isDisabled()).toBe(true);
    });

    it('is false when neither disabled nor loading is true', () => {
      expect(component.brainDirective().isDisabled()).toBe(false);
    });
  });

  describe('icon-only accessibility warning', () => {
    it('logs a warning when iconOnly is true and ariaLabel is missing', async () => {
      const warnSpy = vi.spyOn(logManager, 'warn').mockImplementation(() => {});

      component.iconOnly.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(warnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'button-missing-aria-label',
        })
      );
    });

    it('does not warn when iconOnly is true and ariaLabel is provided', async () => {
      const warnSpy = vi.spyOn(logManager, 'warn').mockImplementation(() => {});

      component.iconOnly.set(true);
      component.ariaLabel.set('close');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(warnSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'button-missing-aria-label',
        })
      );
    });
  });
});
