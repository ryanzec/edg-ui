import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ChartConfiguration } from 'chart.js/auto';
import { beforeEach, describe, it, expect } from 'vitest';

import { Chart } from './chart';

describe('Chart', () => {
  describe('host data-is-loading attribute', () => {
    @Component({
      selector: 'test-chart-loading-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Chart],
      template: `<org-chart [isLoading]="isLoading()" data-testid="chart" />`,
    })
    class ChartLoadingHost {
      public readonly isLoading = signal<boolean>(false);
    }

    let fixture: ComponentFixture<ChartLoadingHost>;
    let component: ChartLoadingHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChartLoadingHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChartLoadingHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('omits the data-is-loading attribute by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="chart"]') as HTMLElement;

      expect(host.getAttribute('data-is-loading')).toBeNull();
    });

    it('sets data-is-loading="" when isLoading is true', async () => {
      component.isLoading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="chart"]') as HTMLElement;

      expect(host.getAttribute('data-is-loading')).toBe('');
    });
  });

  describe('containerClass merging', () => {
    @Component({
      selector: 'test-chart-class-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Chart],
      template: `<org-chart [containerClass]="containerClass()" data-testid="chart" />`,
    })
    class ChartClassHost {
      public readonly containerClass = signal<string>('');
    }

    let fixture: ComponentFixture<ChartClassHost>;
    let component: ChartClassHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChartClassHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChartClassHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the chart-container class by default', () => {
      const container = fixture.nativeElement.querySelector('[data-testid="chart"] .chart-container');

      expect(container).not.toBeNull();
    });

    it('merges a custom containerClass alongside chart-container', async () => {
      component.containerClass.set('custom-class');
      fixture.detectChanges();
      await fixture.whenStable();

      const container = fixture.nativeElement.querySelector('[data-testid="chart"] .chart-container') as HTMLElement;

      expect(container.classList.contains('chart-container')).toBe(true);
      expect(container.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('state-driven rendering', () => {
    @Component({
      selector: 'test-chart-states-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Chart],
      template: `<org-chart [config]="config()" [isLoading]="isLoading()" data-testid="chart" />`,
    })
    class ChartStatesHost {
      public readonly config = signal<ChartConfiguration | null | undefined>(undefined);
      public readonly isLoading = signal<boolean>(false);
    }

    let fixture: ComponentFixture<ChartStatesHost>;
    let component: ChartStatesHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChartStatesHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChartStatesHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the loading spinner when isLoading is true', async () => {
      component.isLoading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="chart"]') as HTMLElement;

      expect(host.querySelector('org-loading-spinner')).not.toBeNull();
    });

    it('renders the empty indicator when no config is provided and not loading', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="chart"]') as HTMLElement;

      expect(host.querySelector('org-empty-indicator')).not.toBeNull();
    });

    // the error and shouldShowChart branches are not reachable in jsdom: chart.js silently fails
    // when getContext is unavailable rather than throwing, so the brain's error state never flips
    // and the shouldShowChart branch can only be exercised via canvas mocking (excluded).
  });
});
