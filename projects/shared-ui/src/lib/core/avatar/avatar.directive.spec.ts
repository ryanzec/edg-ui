import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { AvatarBrainDirective } from './avatar-brain';
import { AvatarImageBrainDirective } from './avatar-image-brain';

describe('AvatarBrainDirective', () => {
  @Component({
    selector: 'test-avatar-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AvatarBrainDirective],
    template: `
      <div
        orgAvatarBrain
        #clickableBrain="orgAvatarBrain"
        [label]="label()"
        [disabled]="disabled()"
        [isOverflow]="isOverflow()"
        (clicked)="onClicked()"
        data-testid="clickable"
      ></div>
      <div orgAvatarBrain #staticBrain="orgAvatarBrain" [label]="label()" data-testid="static"></div>
    `,
  })
  class AvatarBrainHost {
    public readonly label = signal<string>('Alice Smith');
    public readonly disabled = signal<boolean>(false);
    public readonly isOverflow = signal<boolean>(false);
    public onClicked = vi.fn();

    public readonly clickableBrain = viewChild.required<AvatarBrainDirective>('clickableBrain');
    public readonly staticBrain = viewChild.required<AvatarBrainDirective>('staticBrain');
  }

  let fixture: ComponentFixture<AvatarBrainHost>;
  let component: AvatarBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isClickable', () => {
    it('is true when a consumer binds a listener to the clicked output', () => {
      expect(component.clickableBrain().isClickable()).toBe(true);
    });

    it('is false when no listener is bound to the clicked output', () => {
      expect(component.staticBrain().isClickable()).toBe(false);
    });
  });

  describe('isDisabled', () => {
    it('is false by default', () => {
      expect(component.clickableBrain().isDisabled()).toBe(false);
    });

    it('is true when the disabled input is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.clickableBrain().isDisabled()).toBe(true);
    });
  });

  describe('initials', () => {
    it('returns the first + last word initials uppercase for a multi-word label', () => {
      expect(component.clickableBrain().initials()).toBe('AS');
    });

    it('returns the first two characters uppercase for a single-word label', async () => {
      component.label.set('alpha');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.clickableBrain().initials()).toBe('AL');
    });

    it('returns an empty string when the label is blank or whitespace only', async () => {
      component.label.set('   ');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.clickableBrain().initials()).toBe('');
    });

    it('returns an empty string when in overflow mode regardless of the label', async () => {
      component.isOverflow.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.clickableBrain().initials()).toBe('');
    });
  });

  describe('click', () => {
    it('emits clicked when not disabled', () => {
      component.clickableBrain().click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('does not emit clicked when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.clickableBrain().click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });
});

describe('AvatarImageBrainDirective', () => {
  @Component({
    selector: 'test-avatar-image-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AvatarImageBrainDirective],
    template: `
      <div
        orgAvatarImageBrain
        #brain="orgAvatarImageBrain"
        [src]="src()"
        [email]="email()"
        [alt]="alt()"
        data-testid="image-brain"
      ></div>
    `,
  })
  class AvatarImageBrainHost {
    public readonly src = signal<string | null | undefined>(undefined);
    public readonly email = signal<string | null | undefined>(undefined);
    public readonly alt = signal<string | null | undefined>(undefined);

    public readonly brain = viewChild.required<AvatarImageBrainDirective>('brain');
  }

  let fixture: ComponentFixture<AvatarImageBrainHost>;
  let component: AvatarImageBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarImageBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarImageBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('imageSrc resolution', () => {
    it('returns undefined when neither src nor email is provided', () => {
      expect(component.brain().imageSrc()).toBeUndefined();
    });

    it('returns the explicit src when provided', async () => {
      component.src.set('https://example.com/img.png');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().imageSrc()).toBe('https://example.com/img.png');
    });

    it('returns a gravatar url matching the expected shape when only email is provided', async () => {
      component.email.set('alice@example.com');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().imageSrc()).toMatch(/^https:\/\/www\.gravatar\.com\/avatar\/[0-9a-f]{32}\?d=404$/);
    });

    it('produces different gravatar urls for different emails', async () => {
      component.email.set('alice@example.com');
      fixture.detectChanges();
      await fixture.whenStable();
      const aliceUrl = component.brain().imageSrc();

      component.email.set('bob@example.com');
      fixture.detectChanges();
      await fixture.whenStable();
      const bobUrl = component.brain().imageSrc();

      expect(aliceUrl).not.toBe(bobUrl);
    });

    it('prefers an explicit src over an email-derived gravatar url', async () => {
      component.src.set('https://example.com/img.png');
      component.email.set('alice@example.com');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().imageSrc()).toBe('https://example.com/img.png');
    });
  });

  describe('shouldRender', () => {
    it('is false when no image source is available', () => {
      expect(component.brain().shouldRender()).toBe(false);
    });

    it('is true once a src is provided', async () => {
      component.src.set('https://example.com/img.png');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().shouldRender()).toBe(true);
    });
  });

  describe('error and isHidden', () => {
    beforeEach(async () => {
      component.src.set('https://example.com/img.png');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('is not hidden initially', () => {
      expect(component.brain().isHidden()).toBe(false);
    });

    it('becomes hidden after error() is called', async () => {
      component.brain().error();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().isHidden()).toBe(true);
    });

    it('resets isHidden back to false when the src input changes', async () => {
      component.brain().error();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brain().isHidden()).toBe(true);

      component.src.set('https://example.com/different.png');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().isHidden()).toBe(false);
    });

    it('resets isHidden back to false when the email input changes', async () => {
      component.src.set(undefined);
      component.email.set('alice@example.com');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().error();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brain().isHidden()).toBe(true);

      component.email.set('bob@example.com');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().isHidden()).toBe(false);
    });
  });

  describe('alt', () => {
    it('exposes the alt input value', async () => {
      component.alt.set('custom alt');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().alt()).toBe('custom alt');
    });

    it('transforms a null alt input to undefined', async () => {
      component.alt.set(null);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().alt()).toBeUndefined();
    });
  });
});
