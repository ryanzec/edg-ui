import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ChartConfiguration } from 'chart.js/auto';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { ChartBrainDirective } from './chart-brain';

describe('ChartBrainDirective', () => {
  @Component({
    selector: 'test-chart-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChartBrainDirective],
    template: `
      <div orgChartBrain #brain="orgChartBrain" [config]="config()" [isLoading]="isLoading()" data-testid="brain"></div>
      <canvas #canvasRef></canvas>
    `,
  })
  class ChartBrainHost {
    public readonly config = signal<ChartConfiguration | null | undefined>(undefined);
    public readonly isLoading = signal<boolean>(false);

    public readonly brain = viewChild.required<ChartBrainDirective>('brain');
    public readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasRef');
  }

  let fixture: ComponentFixture<ChartBrainHost>;
  let component: ChartBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('default state', () => {
    it('exposes a null error', () => {
      expect(component.brain().error()).toBeNull();
    });

    it('reports hasError as false', () => {
      expect(component.brain().hasError()).toBe(false);
    });

    it('reports isEmpty as true when no config and not loading', () => {
      expect(component.brain().isEmpty()).toBe(true);
    });

    it('reports shouldShowChart as false when no config is provided', () => {
      expect(component.brain().shouldShowChart()).toBe(false);
    });

    it('returns the fallback "chart" canvasAriaLabel when no config is provided', () => {
      expect(component.brain().canvasAriaLabel()).toBe('chart');
    });
  });

  describe('isEmpty', () => {
    it('becomes false when isLoading is true', async () => {
      component.isLoading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().isEmpty()).toBe(false);
    });

    it('becomes false when a config is provided', async () => {
      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().isEmpty()).toBe(false);
    });
  });

  describe('shouldShowChart', () => {
    it('is true when a config is provided and not loading (and no canvas attached so no chart-creation error)', async () => {
      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().shouldShowChart()).toBe(true);
    });

    it('is false when isLoading is true even with a config', async () => {
      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
      });
      component.isLoading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().shouldShowChart()).toBe(false);
    });
  });

  describe('canvasAriaLabel', () => {
    it('returns the fallback when the title text is an empty string', async () => {
      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: { plugins: { title: { text: '' } } },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().canvasAriaLabel()).toBe('chart');
    });

    it('returns the title text when provided as a non-empty string', async () => {
      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: { plugins: { title: { text: 'My Chart Title' } } },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().canvasAriaLabel()).toBe('My Chart Title');
    });

    it('joins an array title with spaces', async () => {
      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: { plugins: { title: { text: ['Line One', 'Line Two'] } } },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().canvasAriaLabel()).toBe('Line One Line Two');
    });
  });

  describe('config null transform', () => {
    it('treats a null config as no config so isEmpty stays true', async () => {
      component.config.set(null);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().isEmpty()).toBe(true);
    });
  });

  describe('setCanvasElement', () => {
    it('sets role="img" on the provided canvas element', () => {
      const canvas = component.canvasRef().nativeElement;

      component.brain().setCanvasElement(canvas);

      expect(canvas.getAttribute('role')).toBe('img');
    });

    it('accepts null without throwing', () => {
      expect(() => component.brain().setCanvasElement(null)).not.toThrow();
    });
  });

  describe('canvas aria-label sync', () => {
    it('sets the default aria-label "chart" on the canvas once it is registered', async () => {
      const canvas = component.canvasRef().nativeElement;

      component.brain().setCanvasElement(canvas);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(canvas.getAttribute('aria-label')).toBe('chart');
    });

    it('updates the canvas aria-label when the chart title changes', async () => {
      const canvas = component.canvasRef().nativeElement;

      component.brain().setCanvasElement(canvas);
      fixture.detectChanges();
      await fixture.whenStable();

      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: { plugins: { title: { text: 'Updated' } } },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(canvas.getAttribute('aria-label')).toBe('Updated');
    });
  });

  describe('chart lifecycle while loading', () => {
    // the error-population path cannot be exercised under jsdom without canvas mocking: chart.js
    // logs and silently returns when getContext is unavailable rather than throwing, so the brain's
    // try/catch never fires. only the "no chart creation while loading" path is testable here.
    it('keeps error null while isLoading is true even with a config and canvas registered', async () => {
      const canvas = component.canvasRef().nativeElement;

      component.brain().setCanvasElement(canvas);
      component.isLoading.set(true);
      component.config.set({
        type: 'bar',
        data: { labels: [], datasets: [] },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().error()).toBeNull();
    });
  });
});
