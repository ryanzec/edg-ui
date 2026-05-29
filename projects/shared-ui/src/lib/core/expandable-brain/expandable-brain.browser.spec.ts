import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { ExpandableBrainDirective } from './expandable-brain';

@Component({
  selector: 'test-expandable-brain-consumer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  hostDirectives: [
    {
      directive: ExpandableBrainDirective,
      inputs: ['isExpandable', 'isExpanded'],
      outputs: ['isExpandedChange'],
    },
  ],
  template: ``,
})
class ExpandableBrainConsumer {
  public readonly brain = inject(ExpandableBrainDirective);
}

@Component({
  selector: 'test-expandable-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ExpandableBrainConsumer],
  host: { class: 'block' },
  template: `
    <test-expandable-brain-consumer
      data-testid="consumer"
      [isExpandable]="isExpandable()"
      [(isExpanded)]="isExpanded"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class ExpandableBrainHost {
  public readonly consumerComponent = viewChild.required(ExpandableBrainConsumer);

  public readonly isExpandable = signal<boolean>(false);
  public readonly isExpanded = signal<boolean>(true);

  protected readout(): string {
    return `isExpandable=${this.isExpandable()} isExpanded=${this.isExpanded()}`;
  }
}

type ExpandableBrainHostConfig = {
  isExpandable?: boolean;
  isExpanded?: boolean;
};

describe('ExpandableBrain (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createHost = (config: ExpandableBrainHostConfig = {}): ComponentFixture<ExpandableBrainHost> =>
    createFixture(ExpandableBrainHost, (instance) => {
      if (config.isExpandable !== undefined) {
        instance.isExpandable.set(config.isExpandable);
      }

      if (config.isExpanded !== undefined) {
        instance.isExpanded.set(config.isExpanded);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('defaults', () => {
    it('defaults isExpandable to false', () => {
      const fixture = createHost();
      const readout = queryByTestId(fixture, 'readout');

      expect(fixture.componentInstance.consumerComponent().brain.isExpandable()).toBe(false);
      expect(readout.textContent).toContain('isExpandable=false');
    });

    it('defaults isExpanded to true', () => {
      const fixture = createHost();
      const readout = queryByTestId(fixture, 'readout');

      expect(fixture.componentInstance.consumerComponent().brain.isExpanded()).toBe(true);
      expect(readout.textContent).toContain('isExpanded=true');
    });
  });

  describe('toggle', () => {
    it('no-ops when not expandable', async () => {
      const fixture = createHost();
      const readout = queryByTestId(fixture, 'readout');
      const brain = fixture.componentInstance.consumerComponent().brain;

      expect(readout.textContent).toContain('isExpandable=false');
      expect(readout.textContent).toContain('isExpanded=true');

      brain.toggle();
      brain.toggle();
      brain.toggle();
      await flush(fixture);

      expect(readout.textContent).toContain('isExpanded=true');
    });

    it('flips isExpanded from true to false when expandable', async () => {
      const fixture = createHost({ isExpandable: true });
      const readout = queryByTestId(fixture, 'readout');
      const brain = fixture.componentInstance.consumerComponent().brain;

      expect(readout.textContent).toContain('isExpandable=true');
      expect(readout.textContent).toContain('isExpanded=true');

      brain.toggle();
      await flush(fixture);

      expect(readout.textContent).toContain('isExpanded=false');
    });

    it('flips isExpanded from false to true when expandable', async () => {
      const fixture = createHost({ isExpandable: true, isExpanded: false });
      const readout = queryByTestId(fixture, 'readout');
      const brain = fixture.componentInstance.consumerComponent().brain;

      expect(readout.textContent).toContain('isExpanded=false');

      brain.toggle();
      await flush(fixture);

      expect(readout.textContent).toContain('isExpanded=true');
    });
  });

  describe('two-way binding', () => {
    it('updates the brain when the parent drives isExpanded', async () => {
      const fixture = createHost({ isExpandable: true });
      const readout = queryByTestId(fixture, 'readout');
      const brain = fixture.componentInstance.consumerComponent().brain;

      fixture.componentInstance.isExpanded.set(false);
      await flush(fixture);

      expect(brain.isExpanded()).toBe(false);

      // toggling the brain should now flip back to true, proving the brain received the parent-driven
      // `isExpanded=false` value (otherwise it would have flipped to false instead).
      brain.toggle();
      await flush(fixture);

      expect(readout.textContent).toContain('isExpanded=true');
    });

    it('emits brain changes back to the parent', async () => {
      const fixture = createHost({ isExpandable: true });
      const readout = queryByTestId(fixture, 'readout');
      const brain = fixture.componentInstance.consumerComponent().brain;

      expect(readout.textContent).toContain('isExpanded=true');

      // brain-driven toggle should propagate the new value out to the parent's bound signal, which the
      // readout reads from — proving the model emits changes back through `[(isExpanded)]`.
      brain.toggle();
      await flush(fixture);
      expect(fixture.componentInstance.isExpanded()).toBe(false);
      expect(readout.textContent).toContain('isExpanded=false');

      brain.toggle();
      await flush(fixture);
      expect(fixture.componentInstance.isExpanded()).toBe(true);
      expect(readout.textContent).toContain('isExpanded=true');
    });
  });
});
