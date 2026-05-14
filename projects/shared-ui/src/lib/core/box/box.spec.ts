import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect } from 'vitest';

import { Box } from './box';

describe('Box', () => {
  describe('when rendered standalone', () => {
    let component: Box;
    let fixture: ComponentFixture<Box>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Box],
      }).compileComponents();

      fixture = TestBed.createComponent(Box);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('does not apply clickable host attributes without a clicked listener', () => {
      fixture.detectChanges();

      const host = fixture.nativeElement as HTMLElement;

      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();
    });
  });

  describe('when a parent listens to clicked', () => {
    @Component({
      selector: 'test-box-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Box],
      template: `<org-box (clicked)="onClicked()" data-testid="box"></org-box>`,
    })
    class BoxHost {
      public readonly clickCount = signal<number>(0);

      public onClicked(): void {
        this.clickCount.update((count) => count + 1);
      }
    }

    let fixture: ComponentFixture<BoxHost>;
    let component: BoxHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BoxHost],
      }).compileComponents();

      fixture = TestBed.createComponent(BoxHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies clickable host attributes to the org-box element', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="box"]') as HTMLElement;

      expect(host.getAttribute('role')).toBe('button');
      expect(host.getAttribute('tabindex')).toBe('0');
      expect(host.getAttribute('data-clickable')).toBe('');
    });

    it('forwards the brain clicked emission to the parent listener', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="box"]') as HTMLElement;

      host.click();

      expect(component.clickCount()).toBe(1);
    });
  });
});
