import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect } from 'vitest';

import { CardHeaderBrainDirective } from './card-header-brain';
import { CardImageBrainDirective } from './card-image-brain';

describe('CardHeaderBrainDirective', () => {
  @Component({
    selector: 'test-card-header-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardHeaderBrainDirective],
    template: `
      <div
        orgCardHeaderBrain
        #brain="orgCardHeaderBrain"
        [headingLevel]="headingLevel()"
        data-testid="card-header-brain"
      ></div>
    `,
  })
  class CardHeaderBrainHost {
    public readonly headingLevel = signal<number>(3);

    public readonly brain = viewChild.required<CardHeaderBrainDirective>('brain');
  }

  let fixture: ComponentFixture<CardHeaderBrainHost>;
  let component: CardHeaderBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeaderBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHeaderBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('headingLevel', () => {
    it('defaults to 3 when no headingLevel input is provided', async () => {
      expect(component.brain().headingLevel()).toBe(3);
    });

    it('reflects the headingLevel input value', async () => {
      component.headingLevel.set(1);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().headingLevel()).toBe(1);
    });
  });
});

describe('CardImageBrainDirective', () => {
  @Component({
    selector: 'test-card-image-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardImageBrainDirective],
    template: `
      <div
        orgCardImageBrain
        #brain="orgCardImageBrain"
        [src]="src()"
        [alt]="alt()"
        data-testid="card-image-brain"
      ></div>
    `,
  })
  class CardImageBrainHost {
    public readonly src = signal<string>('https://example.com/img.png');
    public readonly alt = signal<string>('cover photo');

    public readonly brain = viewChild.required<CardImageBrainDirective>('brain');
  }

  let fixture: ComponentFixture<CardImageBrainHost>;
  let component: CardImageBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardImageBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CardImageBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('src and alt inputs', () => {
    it('exposes the src input value', () => {
      expect(component.brain().src()).toBe('https://example.com/img.png');
    });

    it('exposes the alt input value', () => {
      expect(component.brain().alt()).toBe('cover photo');
    });

    it('updates the src value when the input changes', async () => {
      component.src.set('https://example.com/other.png');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().src()).toBe('https://example.com/other.png');
    });

    it('updates the alt value when the input changes', async () => {
      component.alt.set('a different label');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().alt()).toBe('a different label');
    });
  });
});
