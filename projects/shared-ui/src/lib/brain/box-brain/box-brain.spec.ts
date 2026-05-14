import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BoxBrainDirective } from './box-brain';

@Component({
  selector: 'test-box-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoxBrainDirective],
  template: `
    <div #withListenerBrain="orgBoxBrain" orgBoxBrain (clicked)="onClicked()" data-testid="with-listener">
      with listener
    </div>
    <div #withoutListenerBrain="orgBoxBrain" orgBoxBrain data-testid="without-listener">without listener</div>
  `,
})
class BoxBrainHost {
  public readonly clickCount = signal<number>(0);

  public readonly withListenerBrain = viewChild.required<BoxBrainDirective>('withListenerBrain');

  public readonly withoutListenerBrain = viewChild.required<BoxBrainDirective>('withoutListenerBrain');

  public onClicked(): void {
    this.clickCount.update((count) => count + 1);
  }
}

const getWithListener = (fixture: ComponentFixture<BoxBrainHost>): HTMLElement =>
  fixture.nativeElement.querySelector('[data-testid="with-listener"]') as HTMLElement;

const getWithoutListener = (fixture: ComponentFixture<BoxBrainHost>): HTMLElement =>
  fixture.nativeElement.querySelector('[data-testid="without-listener"]') as HTMLElement;

describe('BoxBrainDirective', () => {
  let fixture: ComponentFixture<BoxBrainHost>;
  let component: BoxBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('when the clicked output has a template listener', () => {
    it('applies the role, tabindex, and data-clickable host attributes', () => {
      const host = getWithListener(fixture);

      expect(host.getAttribute('role')).toBe('button');
      expect(host.getAttribute('tabindex')).toBe('0');
      expect(host.getAttribute('data-clickable')).toBe('');
    });

    it('emits clicked when the host is clicked', () => {
      const host = getWithListener(fixture);

      host.click();

      expect(component.clickCount()).toBe(1);
    });

    it('emits clicked and prevents default on Enter', () => {
      const host = getWithListener(fixture);
      const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
      const preventDefault = vi.spyOn(event, 'preventDefault');

      host.dispatchEvent(event);

      expect(component.clickCount()).toBe(1);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('emits clicked and prevents default on Space', () => {
      const host = getWithListener(fixture);
      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      const preventDefault = vi.spyOn(event, 'preventDefault');

      host.dispatchEvent(event);

      expect(component.clickCount()).toBe(1);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('flips data-pressed on mousedown / mouseup', () => {
      const host = getWithListener(fixture);

      host.dispatchEvent(new MouseEvent('mousedown'));
      fixture.detectChanges();

      expect(host.getAttribute('data-pressed')).toBe('');

      host.dispatchEvent(new MouseEvent('mouseup'));
      fixture.detectChanges();

      expect(host.getAttribute('data-pressed')).toBeNull();
    });
  });

  describe('when the clicked output has no listener', () => {
    it('does not apply the clickable host attributes', () => {
      const host = getWithoutListener(fixture);

      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();
    });

    it('does not enter pressed state on mousedown', () => {
      const host = getWithoutListener(fixture);

      host.dispatchEvent(new MouseEvent('mousedown'));
      fixture.detectChanges();

      expect(host.getAttribute('data-pressed')).toBeNull();
    });
  });

  describe('when setExternallyClickable(true) is called', () => {
    beforeEach(async () => {
      component.withoutListenerBrain().setExternallyClickable(true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the clickable host attributes without a direct listener', () => {
      const host = getWithoutListener(fixture);

      expect(host.getAttribute('role')).toBe('button');
      expect(host.getAttribute('tabindex')).toBe('0');
      expect(host.getAttribute('data-clickable')).toBe('');
    });
  });
});
