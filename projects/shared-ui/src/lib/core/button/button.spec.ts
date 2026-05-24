import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { logManager } from '@organization/shared-utils';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { Button } from './button';
import { ButtonGroup } from './button-group';

describe('Button', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('host attributes', () => {
    @Component({
      selector: 'test-button-defaults-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `<org-button label="click me" data-testid="button" />`,
    })
    class ButtonDefaultsHost {}

    let fixture: ComponentFixture<ButtonDefaultsHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonDefaultsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonDefaultsHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default color, variant, and size host attributes', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="button"]') as HTMLElement;

      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-variant')).toBe('filled');
      expect(host.getAttribute('data-size')).toBe('base');
    });

    it('omits the boolean host attributes by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="button"]') as HTMLElement;

      expect(host.getAttribute('data-icon-only')).toBeNull();
      expect(host.getAttribute('data-exclude-spacing')).toBeNull();
      expect(host.getAttribute('data-loading')).toBeNull();
      expect(host.getAttribute('data-active')).toBeNull();
    });
  });

  describe('host attributes driven by inputs', () => {
    @Component({
      selector: 'test-button-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `
        <org-button
          label="click me"
          color="danger"
          variant="ghost"
          size="lg"
          [iconOnly]="iconOnly()"
          [excludeSpacing]="excludeSpacing()"
          [loading]="loading()"
          [isActive]="isActive()"
          ariaLabel="close"
          data-testid="button"
        />
      `,
    })
    class ButtonAttrsHost {
      public readonly iconOnly = signal<boolean>(true);
      public readonly excludeSpacing = signal<boolean>(true);
      public readonly loading = signal<boolean>(false);
      public readonly isActive = signal<boolean>(true);
    }

    let fixture: ComponentFixture<ButtonAttrsHost>;
    let component: ButtonAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects color, variant, and size on the host element', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="button"]') as HTMLElement;

      expect(host.getAttribute('data-color')).toBe('danger');
      expect(host.getAttribute('data-variant')).toBe('ghost');
      expect(host.getAttribute('data-size')).toBe('lg');
    });

    it('reflects iconOnly, excludeSpacing, and isActive as empty-string attributes', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="button"]') as HTMLElement;

      expect(host.getAttribute('data-icon-only')).toBe('');
      expect(host.getAttribute('data-exclude-spacing')).toBe('');
      expect(host.getAttribute('data-active')).toBe('');
    });

    it('toggles the data-loading attribute when the loading input flips', async () => {
      const host = fixture.nativeElement.querySelector('[data-testid="button"]') as HTMLElement;

      expect(host.getAttribute('data-loading')).toBeNull();

      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.getAttribute('data-loading')).toBe('');
    });
  });

  describe('inner button rendering', () => {
    @Component({
      selector: 'test-button-inner-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `
        <org-button
          label="save"
          [type]="type()"
          [buttonClass]="buttonClass()"
          [disabled]="disabled()"
          data-testid="button"
        />
      `,
    })
    class ButtonInnerHost {
      public readonly type = signal<'button' | 'submit' | 'reset'>('submit');
      public readonly buttonClass = signal<string>('extra-class');
      public readonly disabled = signal<boolean>(false);
    }

    let fixture: ComponentFixture<ButtonInnerHost>;
    let component: ButtonInnerHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonInnerHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonInnerHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the label inside a <span> in the inner button', () => {
      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;
      const labelSpan = innerButton.querySelector('span');

      expect(labelSpan?.textContent?.trim()).toBe('save');
    });

    it('forwards the type input to the native button type attribute', () => {
      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;

      expect(innerButton.type).toBe('submit');
    });

    it('applies the buttonClass input to the inner button element', () => {
      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;

      expect(innerButton.classList.contains('extra-class')).toBe(true);
    });

    it('disables the inner button when the disabled input is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;

      expect(innerButton.disabled).toBe(true);
    });
  });

  describe('icon-only mode', () => {
    @Component({
      selector: 'test-button-icon-only-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `<org-button label="hidden" [iconOnly]="true" ariaLabel="close" preIcon="x" data-testid="button" />`,
    })
    class ButtonIconOnlyHost {}

    it('does not render the label span when iconOnly is true', async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonIconOnlyHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(ButtonIconOnlyHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;

      expect(innerButton.querySelector('span')).toBeNull();
    });
  });

  describe('loading state', () => {
    @Component({
      selector: 'test-button-loading-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `
        <org-button label="save" [loading]="loading()" preIcon="check" postIcon="check" data-testid="button" />
      `,
    })
    class ButtonLoadingHost {
      public readonly loading = signal<boolean>(true);
    }

    let fixture: ComponentFixture<ButtonLoadingHost>;
    let component: ButtonLoadingHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonLoadingHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonLoadingHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the loading spinner and hides the pre/post icons while loading', () => {
      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;

      expect(innerButton.querySelector('org-loading-spinner')).not.toBeNull();
      expect(innerButton.querySelector('.pre-icon')).toBeNull();
      expect(innerButton.querySelector('.post-icon')).toBeNull();
    });

    it('hides the spinner and restores icons once loading turns off', async () => {
      component.loading.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;

      expect(innerButton.querySelector('org-loading-spinner')).toBeNull();
      expect(innerButton.querySelector('.pre-icon')).not.toBeNull();
      expect(innerButton.querySelector('.post-icon')).not.toBeNull();
    });
  });

  describe('icon size mapping', () => {
    @Component({
      selector: 'test-button-icon-size-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `<org-button label="save" preIcon="check" [size]="size()" data-testid="button" />`,
    })
    class ButtonIconSizeHost {
      public readonly size = signal<'sm' | 'base' | 'lg'>('base');
    }

    let fixture: ComponentFixture<ButtonIconSizeHost>;
    let component: ButtonIconSizeHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonIconSizeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonIconSizeHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('maps button size sm to icon size xs', async () => {
      component.size.set('sm');
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector('[data-testid="button"] org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('xs');
    });

    it('maps button size base to icon size base', () => {
      const icon = fixture.nativeElement.querySelector('[data-testid="button"] org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('base');
    });

    it('maps button size lg to icon size 2xl', async () => {
      component.size.set('lg');
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector('[data-testid="button"] org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('2xl');
    });
  });

  describe('content projection', () => {
    @Component({
      selector: 'test-button-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `
        <org-button label="fallback" data-testid="content-projected">
          <ng-template #content>
            <strong data-testid="custom-content">custom</strong>
          </ng-template>
        </org-button>

        <org-button label="pre slot" data-testid="pre-projected">
          <ng-template #pre>
            <span data-testid="custom-pre">custom-pre</span>
          </ng-template>
        </org-button>

        <org-button label="post slot" data-testid="post-projected">
          <ng-template #post>
            <span data-testid="custom-post">custom-post</span>
          </ng-template>
        </org-button>
      `,
    })
    class ButtonProjectionHost {}

    let fixture: ComponentFixture<ButtonProjectionHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonProjectionHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the projected #content template instead of the label span', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="content-projected"]') as HTMLElement;

      expect(host.querySelector('[data-testid="custom-content"]')).not.toBeNull();
      expect(host.querySelector('button > span')).toBeNull();
    });

    it('renders the projected #pre template when provided', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="pre-projected"]') as HTMLElement;

      expect(host.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
    });

    it('renders the projected #post template when provided', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="post-projected"]') as HTMLElement;

      expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    });
  });

  describe('icon vs projected template conflicts', () => {
    @Component({
      selector: 'test-button-pre-conflict-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `
        <org-button label="conflict" preIcon="check" data-testid="button">
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
      template: `
        <org-button label="conflict" postIcon="check" data-testid="button">
          <ng-template #post>
            <span data-testid="projected-post">projected</span>
          </ng-template>
        </org-button>
      `,
    })
    class ButtonPostConflictHost {}

    it('renders the projected #pre template instead of preIcon and warns', async () => {
      const warnSpy = vi.spyOn(logManager, 'warn').mockImplementation(() => {});

      await TestBed.configureTestingModule({
        imports: [ButtonPreConflictHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(ButtonPreConflictHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="button"]') as HTMLElement;

      expect(host.querySelector('[data-testid="projected-pre"]')).not.toBeNull();
      expect(host.querySelector('.pre-icon')).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'button-conflicting-pre-slot',
        })
      );
    });

    it('renders the projected #post template instead of postIcon and warns', async () => {
      const warnSpy = vi.spyOn(logManager, 'warn').mockImplementation(() => {});

      await TestBed.configureTestingModule({
        imports: [ButtonPostConflictHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(ButtonPostConflictHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="button"]') as HTMLElement;

      expect(host.querySelector('[data-testid="projected-post"]')).not.toBeNull();
      expect(host.querySelector('.post-icon')).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'button-conflicting-post-slot',
        })
      );
    });
  });

  describe('clicked output', () => {
    @Component({
      selector: 'test-button-clicked-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Button],
      template: `
        <org-button
          label="save"
          [disabled]="disabled()"
          [loading]="loading()"
          (clicked)="onClicked()"
          data-testid="button"
        />
      `,
    })
    class ButtonClickedHost {
      public readonly disabled = signal<boolean>(false);
      public readonly loading = signal<boolean>(false);
      public onClicked = vi.fn();
    }

    let fixture: ComponentFixture<ButtonClickedHost>;
    let component: ButtonClickedHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonClickedHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonClickedHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('emits clicked when the inner button is clicked', () => {
      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;

      innerButton.click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('does not emit clicked when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;
      innerButton.click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });

    it('does not emit clicked when loading', async () => {
      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const innerButton = fixture.nativeElement.querySelector('[data-testid="button"] button') as HTMLButtonElement;
      innerButton.click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });
});

describe('ButtonGroup', () => {
  describe('when rendered standalone', () => {
    let component: ButtonGroup;
    let fixture: ComponentFixture<ButtonGroup>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonGroup],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonGroup);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('applies the default horizontal orientation host attribute', () => {
      const host = fixture.nativeElement as HTMLElement;

      expect(host.getAttribute('data-orientation')).toBe('horizontal');
    });
  });

  describe('when configured by a parent host', () => {
    @Component({
      selector: 'test-button-group-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [ButtonGroup, Button],
      template: `
        <org-button-group [orientation]="orientation()" data-testid="group">
          <org-button label="one" />
          <org-button label="two" />
        </org-button-group>
      `,
    })
    class ButtonGroupHost {
      public readonly orientation = signal<'horizontal' | 'vertical'>('vertical');
    }

    let fixture: ComponentFixture<ButtonGroupHost>;
    let component: ButtonGroupHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonGroupHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonGroupHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the configured orientation on the host element', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;

      expect(host.getAttribute('data-orientation')).toBe('vertical');
    });

    it('updates the orientation attribute when the input changes', async () => {
      component.orientation.set('horizontal');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;

      expect(host.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('renders the projected button children', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;

      expect(host.querySelectorAll('org-button').length).toBe(2);
    });
  });
});
