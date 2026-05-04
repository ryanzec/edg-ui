import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, ViewChild, afterNextRender, input } from '@angular/core';
import { AutoScroll, AutoScrollState } from './auto-scroll';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { ScrollArea } from '../scroll-area/scroll-area';
import { Button } from '../button/button';

const meta: Meta<AutoScroll> = {
  title: 'Core/Components/Auto Scroll',
  component: AutoScroll,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Auto Scroll Component

  A component that provides automatic scrolling behavior to a scrollable parent element, commonly used for chat interfaces, log viewers, and live feeds.

  ### Features
  - Automatically scrolls to bottom when new content is added
  - Smart state management based on user scroll position
  - Programmatic scroll control with callback support
  - Detects user vs programmatic scrolls
  - Uses IntersectionObserver, ResizeObserver, and CdkObserveContent for optimal performance
  - Smooth scrolling behavior
  - Dynamically detects and adapts to scrollable parent changes

  ### State Management
  The component has three states:
  - **enabled**: Auto-scrolling is active, new content triggers scroll to bottom
  - **disabled**: Auto-scrolling is paused (typically when user scrolls up)
  - **forced-disabled**: Auto-scrolling is disabled via the input

  ### How It Works
  1. Component detects its scrollable parent using the scrollparent library
  2. When content is added, if the state is "enabled", the scrollable parent scrolls to bottom
  3. A sentinel element at the bottom determines if the user is viewing the end
  4. If the user scrolls up (sentinel out of view), state changes to "disabled"
  5. If the user scrolls back to bottom (sentinel in view), state changes to "enabled"
  6. Programmatic scrolls don't affect the state
  7. If the scrollable parent changes, the component automatically reinitializes

  ### Usage Examples
  \`\`\`html
  <!-- Basic usage - scrollable parent uses org-scroll-area component -->
  <org-scroll-area scrollClass="h-sm">
    <org-auto-scroll>
      <!-- Content here -->
    </org-auto-scroll>
  </org-scroll-area>

  <!-- With enabled control -->
  <org-scroll-area scrollClass="h-sm">
    <org-auto-scroll [autoScrollEnabled]="true">
      <!-- Content here -->
    </org-auto-scroll>
  </org-scroll-area>

  <!-- With ViewChild for programmatic control -->
  <org-scroll-area scrollClass="h-sm">
    <org-auto-scroll #scrollContainer>
      <!-- Content here -->
    </org-auto-scroll>
  </org-scroll-area>
  \`\`\`

  ### Programmatic Control
  \`\`\`typescript
  @ViewChild('scrollContainer')
  component!: AutoScroll;

  // Get current state
  const state = this.component.getAutoScrollState();

  // Change state
  this.component.setAutoScrollState('enabled');

  // Scroll to bottom with callback
  this.component.scrollToBottom({
    onAfterScroll: () => console.log('Scrolled!')
  });
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<AutoScroll>;

@Component({
  selector: 'story-auto-scroll-interactive-test',
  template: `
    <org-storybook-example-container title="Interactive Auto Scroll Test" [currentState]="currentState()">
      <org-storybook-example-container-section label="Interactive Demo">
        <div class="mb-4 flex flex-wrap gap-2">
          <org-button (click)="toggleInterval()">
            {{ intervalActive() ? 'Stop Adding Items' : 'Start Adding Items' }}
          </org-button>
          <org-button (click)="clearItems()"> Clear Items </org-button>
          <div class="w-full"></div>
          <org-button (click)="setState('enabled')"> Set State: Enabled </org-button>
          <org-button (click)="setState('disabled')"> Set State: Disabled </org-button>
          <org-button (click)="setState('forced-disabled')"> Set State: Forced-Disabled </org-button>
        </div>

        <div class="mb-4 rounded border border-default-color bg-muted/30 p-3 text-sm">
          <div>
            <strong>Auto-Scroll Internal State:</strong> <span class="font-mono">{{ getAutoScrollState() }}</span>
          </div>
          <div class="text-xs text-muted-foreground">
            @if (getAutoScrollState() === 'enabled') {
              Auto-scrolling is active - new content will trigger scroll to bottom
            } @else if (getAutoScrollState() === 'disabled') {
              Auto-scrolling is paused - user scrolled away from bottom
            } @else {
              Auto-scrolling is force disabled via input
            }
          </div>
        </div>

        <org-scroll-area containerClass="rounded-lg border border-default-color bg-muted/30" scrollClass="h-2xs">
          <org-auto-scroll #autoScrollComponent [containerClass]="'p-4'">
            @for (item of items(); track item.title) {
              <div class="mb-2 rounded border border-default-color bg-card p-3 text-sm">
                <div class="font-semibold text-primary">{{ item.title }}</div>
                <div class="text-muted-foreground">{{ item.timestamp }}</div>
              </div>
            }
          </org-auto-scroll>
        </org-scroll-area>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Click "Start Adding Items" to add items every 500ms</li>
        <li>Container auto-scrolls to bottom as new items appear</li>
        <li>Click state buttons to manually set the auto-scroll state</li>
        <li>Scroll up manually - auto-scroll pauses (state changes to "disabled")</li>
        <li>Scroll back to bottom - auto-scroll resumes (state changes to "enabled")</li>
        <li>Click "Stop Adding Items" to pause the interval</li>
        <li>Click "Clear Items" to remove all items</li>
        <li>Watch the "Auto-Scroll Internal State" display to see state changes in real-time</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [AutoScroll, ScrollArea, Button, StorybookExampleContainer, StorybookExampleContainerSection],
})
class AutoScrollInteractiveTestComponent {
  @ViewChild('autoScrollComponent')
  public autoScrollComponent!: AutoScroll;
  public items = signal<{ title: string; timestamp: string }[]>([]);
  public intervalActive = signal(false);
  public currentState = signal('Ready to start');

  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _itemCount = 0;

  public getAutoScrollState(): string {
    return this.autoScrollComponent?.getAutoScrollState() || 'unknown';
  }

  public setState(state: AutoScrollState): void {
    this.autoScrollComponent.setAutoScrollState(state);
    this.currentState.set(`State manually set to: ${state}`);
  }

  public toggleInterval(): void {
    if (this.intervalActive()) {
      this._stopInterval();
    } else {
      this._startInterval();
    }
  }

  public clearItems(): void {
    this.items.set([]);
    this._itemCount = 0;
    this._stopInterval();
    this.currentState.set('Items cleared');
  }

  private _startInterval(): void {
    this.intervalActive.set(true);
    this.currentState.set('Adding items every 500ms...');

    this._intervalId = setInterval(() => {
      this._itemCount++;
      const now = new Date().toLocaleTimeString();
      this.items.update((items) => [
        ...items,
        {
          title: `Item ${this._itemCount}`,
          timestamp: `Added at ${now}`,
        },
      ]);
    }, 500);
  }

  private _stopInterval(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }

    this.intervalActive.set(false);
    this.currentState.set('Interval stopped');
  }
}

@Component({
  selector: 'story-auto-scroll-programmatic-demo',
  template: `
    <org-storybook-example-container title="Programmatic Scroll Control" [currentState]="currentState()">
      <org-storybook-example-container-section label="Interactive Demo">
        <div class="mb-4 flex gap-2">
          <org-button buttonStyle="primary" (click)="scrollToBottom()"> Scroll to Bottom </org-button>
          <org-button buttonStyle="secondary" (click)="scrollToTop()"> Scroll to Top </org-button>
          <org-button buttonStyle="secondary" (click)="scrollToMiddle()"> Scroll to Middle </org-button>
        </div>

        <div class="mb-4 rounded border border-default-color bg-muted/30 p-3 text-sm">
          <div>
            <strong>Auto-Scroll Internal State:</strong> <span class="font-mono">{{ getState() }}</span>
          </div>
          <div class="text-xs text-muted-foreground">
            @if (getState() === 'enabled') {
              Auto-scrolling is active - new content will trigger scroll to bottom
            } @else if (getState() === 'disabled') {
              Auto-scrolling is paused - user scrolled away from bottom
            } @else {
              Auto-scrolling is force disabled via input
            }
          </div>
        </div>

        <org-scroll-area
          #scrollParentComponent
          containerClass="rounded-lg border border-default-color bg-muted/30"
          scrollClass="h-2xs"
        >
          <org-auto-scroll #scrollContainerComponent [containerClass]="'p-4'">
            @for (item of items(); track item.title) {
              <div class="mb-2 rounded border border-default-color bg-card p-3 text-sm">
                <div class="font-semibold text-primary">{{ item.title }}</div>
                <div class="text-muted-foreground">{{ item.content }}</div>
              </div>
            }
          </org-auto-scroll>
        </org-scroll-area>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Container starts with enough content to require scrolling</li>
        <li>Click "Scroll to Bottom" to trigger programmatic scroll with callback</li>
        <li>Click "Scroll to Top" or "Scroll to Middle" to test user scroll behavior</li>
        <li>Watch the "Auto-Scroll Internal State" display to see state changes</li>
        <li>Programmatic scrolls don't change the auto-scroll state</li>
        <li>User scrolls change state based on position</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [AutoScroll, ScrollArea, Button, StorybookExampleContainer, StorybookExampleContainerSection],
})
class AutoScrollProgrammaticDemoComponent {
  @ViewChild('scrollContainerComponent')
  public scrollContainerComponent!: AutoScroll;

  @ViewChild('scrollParentComponent')
  public scrollParentComponent!: ScrollArea;

  public items = signal<{ title: string; content: string }[]>([]);
  public currentState = signal('Initializing...');

  constructor() {
    // generate initial content
    const initialItems = Array.from({ length: 30 }, (_, i) => ({
      title: `Message ${i + 1}`,
      content: `This is message number ${i + 1}. Lorem ipsum dolor sit amet.`,
    }));
    this.items.set(initialItems);

    afterNextRender(() => {
      // scroll to bottom on init using the component's public api
      setTimeout(() => {
        this.scrollContainerComponent.scrollToBottom({
          onAfterScroll: () => {
            this.currentState.set('Scrolled to bottom on load');
          },
        });
      }, 100);
    });
  }

  public scrollToBottom(): void {
    this.scrollContainerComponent.scrollToBottom({
      onAfterScroll: () => {
        this.currentState.set('Programmatic scroll to bottom completed');
      },
    });
  }

  public scrollToTop(): void {
    const element = this.scrollParentComponent.containerElement();
    element.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.currentState.set('Scrolled to top (user scroll simulation)');
  }

  public scrollToMiddle(): void {
    const element = this.scrollParentComponent.containerElement();
    const middle = (element.scrollHeight - element.clientHeight) / 2;
    element.scrollTo({
      top: middle,
      behavior: 'smooth',
    });
    this.currentState.set('Scrolled to middle (user scroll simulation)');
  }

  public getState(): string {
    return this.scrollContainerComponent?.getAutoScrollState() || 'unknown';
  }
}

@Component({
  selector: 'story-auto-scroll-default-demo',
  template: `
    <org-storybook-example-container title="Auto Scroll">
      <org-storybook-example-container-section label="Default">
        <div class="mb-4 rounded border border-default-color bg-muted/30 p-3 text-sm">
          <div>
            <strong>Auto-Scroll Internal State:</strong> <span class="font-mono">{{ getAutoScrollState() }}</span>
          </div>
          <div class="text-xs text-muted-foreground">
            @if (getAutoScrollState() === 'enabled') {
              Auto-scrolling is active - new content will trigger scroll to bottom
            } @else if (getAutoScrollState() === 'disabled') {
              Auto-scrolling is paused - user scrolled away from bottom
            } @else {
              Auto-scrolling is force disabled via input
            }
          </div>
        </div>

        <org-scroll-area containerClass="rounded-lg border border-default-color bg-muted/30" scrollClass="h-2xs">
          <org-auto-scroll #autoScrollComponent [autoScrollEnabled]="autoScrollEnabled()" [containerClass]="'p-4'">
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 1</div>
              <div class="text-sm text-muted-foreground">Initial message in the container</div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 2</div>
              <div class="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 3</div>
              <div class="text-sm text-muted-foreground">
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 4</div>
              <div class="text-sm text-muted-foreground">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 5</div>
              <div class="text-sm text-muted-foreground">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
              </div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 6</div>
              <div class="text-sm text-muted-foreground">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 7</div>
              <div class="text-sm text-muted-foreground">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
              </div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 8</div>
              <div class="text-sm text-muted-foreground">
                Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                sunt explicabo.
              </div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 9</div>
              <div class="text-sm text-muted-foreground">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </div>
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-3">
              <div class="font-semibold">Message 10</div>
              <div class="text-sm text-muted-foreground">
                This is the last message at the bottom of the scroll container.
              </div>
            </div>
          </org-auto-scroll>
        </org-scroll-area>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Container starts scrolled to the bottom</li>
        <li>Toggle "Auto Scroll Enabled" in the controls panel to switch between enabled and forced-disabled states</li>
        <li>Scroll up manually to see state change to "disabled"</li>
        <li>Scroll back to bottom to see state change back to "enabled"</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [AutoScroll, ScrollArea, StorybookExampleContainer, StorybookExampleContainerSection],
})
class AutoScrollDefaultDemoComponent {
  @ViewChild('autoScrollComponent')
  public autoScrollComponent!: AutoScroll;

  public autoScrollEnabled = input<boolean>(true);

  public getAutoScrollState(): string {
    return this.autoScrollComponent?.getAutoScrollState() || 'unknown';
  }
}

export const Default: Story = {
  args: {
    autoScrollEnabled: true,
    containerClass: '',
  },
  argTypes: {
    autoScrollEnabled: {
      control: 'boolean',
      description: 'Controls whether auto-scrolling is enabled',
    },
    containerClass: {
      control: 'text',
      description: 'CSS classes to apply to the content wrapper element',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default auto scroll behavior. The scrollable parent uses the org-scroll-area component. Scroll manually to see state changes. Use the controls to toggle enabled state.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: '<story-auto-scroll-default-demo [autoScrollEnabled]="autoScrollEnabled" />',
    moduleMetadata: {
      imports: [AutoScrollDefaultDemoComponent],
    },
  }),
};

export const InteractiveTest: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive test demo showing auto-scroll with content being added on an interval. Includes controls to manually set the auto-scroll state for testing purposes.',
      },
    },
  },
  render: () => ({
    template: '<story-auto-scroll-interactive-test />',
    moduleMetadata: {
      imports: [AutoScrollInteractiveTestComponent],
    },
  }),
};

export const ProgrammaticDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing programmatic scroll control using the component's public API. The container scrolls to bottom on load using autoScrollScrollToBottom().",
      },
    },
  },
  render: () => ({
    template: '<story-auto-scroll-programmatic-demo />',
    moduleMetadata: {
      imports: [AutoScrollProgrammaticDemoComponent],
    },
  }),
};

@Component({
  selector: 'story-auto-scroll-dynamic-parent-demo',
  template: `
    <org-storybook-example-container title="Dynamic Scrollable Parent Detection" [currentState]="currentState()">
      <org-storybook-example-container-section label="Interactive Demo">
        <div class="mb-4 flex gap-2">
          <org-button buttonStyle="primary" (click)="toggleContainer()">
            {{ showLargeContainer() ? 'Switch to Small Container' : 'Switch to Large Container' }}
          </org-button>
          <org-button buttonStyle="secondary" (click)="addItem()"> Add Item </org-button>
        </div>

        <div class="mb-4 rounded border border-default-color bg-muted/30 p-3 text-sm">
          <div>
            <strong>Auto-Scroll Internal State:</strong> <span class="font-mono">{{ getAutoScrollState() }}</span>
          </div>
          <div class="text-xs text-muted-foreground">
            @if (getAutoScrollState() === 'enabled') {
              Auto-scrolling is active - new content will trigger scroll to bottom
            } @else if (getAutoScrollState() === 'disabled') {
              Auto-scrolling is paused - user scrolled away from bottom
            } @else {
              Auto-scrolling is force disabled via input
            }
          </div>
        </div>

        <div class="rounded-lg border border-default-color bg-muted/30 p-4">
          @if (showLargeContainer()) {
            <org-scroll-area containerClass="rounded border border-default-color bg-app" scrollClass="h-sm">
              <org-auto-scroll #autoScrollComponent [containerClass]="'p-4'">
                @for (item of items(); track item.id) {
                  <div class="mb-2 rounded border border-default-color bg-card p-3 text-sm">
                    <div class="font-semibold text-primary">{{ item.title }}</div>
                    <div class="text-muted-foreground">{{ item.description }}</div>
                  </div>
                }
              </org-auto-scroll>
            </org-scroll-area>
          } @else {
            <org-scroll-area containerClass="rounded border border-default-color bg-app" scrollClass="h-5xs">
              <org-auto-scroll #autoScrollComponent [containerClass]="'p-4'">
                @for (item of items(); track item.id) {
                  <div class="mb-2 rounded border border-default-color bg-card p-3 text-sm">
                    <div class="font-semibold text-primary">{{ item.title }}</div>
                    <div class="text-muted-foreground">{{ item.description }}</div>
                  </div>
                }
              </org-auto-scroll>
            </org-scroll-area>
          }
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Click "Switch to Large Container" / "Switch to Small Container" to toggle the parent container</li>
        <li>The component automatically detects the new scrollable parent when it changes</li>
        <li>Auto-scroll continues to work after the parent change</li>
        <li>Click "Add Item" to add content and observe auto-scrolling behavior</li>
        <li>The component reinitializes observers and listeners for the new parent</li>
        <li>Watch the "Auto-Scroll Internal State" display to see state persistence across parent changes</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [AutoScroll, ScrollArea, Button, StorybookExampleContainer, StorybookExampleContainerSection],
})
class AutoScrollDynamicParentDemoComponent {
  @ViewChild('autoScrollComponent')
  public autoScrollComponent!: AutoScroll;
  public showLargeContainer = signal(true);
  public items = signal<{ id: number; title: string; description: string }[]>([]);
  public currentState = signal('Ready to test dynamic parent changes');

  private _itemCounter = 0;

  public getAutoScrollState(): string {
    return this.autoScrollComponent?.getAutoScrollState() || 'unknown';
  }

  constructor() {
    // generate initial content
    const initialItems = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      title: `Initial Item ${i + 1}`,
      description: `This is initial item number ${i + 1}.`,
    }));
    this.items.set(initialItems);
    this._itemCounter = initialItems.length;
  }

  public toggleContainer(): void {
    this.showLargeContainer.update((current) => !current);
    this.currentState.set(
      this.showLargeContainer()
        ? 'Switched to large container (400px height)'
        : 'Switched to small container (200px height)'
    );
  }

  public addItem(): void {
    this._itemCounter++;
    const now = new Date().toLocaleTimeString();
    this.items.update((items) => [
      ...items,
      {
        id: this._itemCounter,
        title: `Item ${this._itemCounter}`,
        description: `Added at ${now}`,
      },
    ]);
    this.currentState.set(`Added item ${this._itemCounter}`);
  }
}

export const DynamicParent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates that auto-scroll continues to work when the scrollable parent is swapped. When Angular destroys and recreates the component inside a new parent, the component reinitializes its observers and listeners automatically.',
      },
    },
  },
  render: () => ({
    template: '<story-auto-scroll-dynamic-parent-demo />',
    moduleMetadata: {
      imports: [AutoScrollDynamicParentDemoComponent],
    },
  }),
};

@Component({
  selector: 'story-auto-scroll-states-demo',
  template: `
    <org-storybook-example-container
      title="Auto Scroll States"
      currentState="Comparing enabled, disabled, and forced-disabled states"
    >
      <org-storybook-example-container-section label="Enabled (autoScrollEnabled=true)">
        <div class="mb-2 rounded border border-default-color bg-muted/30 p-2 text-xs">
          <strong>Auto-Scroll Internal State:</strong> <span class="font-mono">{{ getEnabledState() }}</span>
        </div>

        <org-scroll-area containerClass="rounded-lg border border-default-color bg-muted/30" scrollClass="h-5xs">
          <org-auto-scroll #enabledComponent [autoScrollEnabled]="true" [containerClass]="'p-4'">
            <div class="mb-2 text-sm font-semibold text-primary">State: Enabled</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">
              Auto-scrolling is active. If new content is added, it will scroll to bottom automatically.
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 1</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 2</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 3</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 4</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 5</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 6</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 7</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 8 (last)</div>
          </org-auto-scroll>
        </org-scroll-area>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Forced Disabled (autoScrollEnabled=false)">
        <div class="mb-2 rounded border border-default-color bg-muted/30 p-2 text-xs">
          <strong>Auto-Scroll Internal State:</strong> <span class="font-mono">{{ getDisabledState() }}</span>
        </div>

        <org-scroll-area containerClass="rounded-lg border border-default-color bg-muted/30" scrollClass="h-5xs">
          <org-auto-scroll #disabledComponent [autoScrollEnabled]="false" [containerClass]="'p-4'">
            <div class="mb-2 text-sm font-semibold text-destructive">State: Forced Disabled</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">
              Auto-scrolling is disabled via input. Content will not auto-scroll even when added.
            </div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 1</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 2</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 3</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 4</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 5</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 6</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 7</div>
            <div class="mb-2 rounded border border-default-color bg-card p-2 text-xs">Message 8 (last)</div>
          </org-auto-scroll>
        </org-scroll-area>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>enabled</strong>: Auto-scrolling is active, new content triggers scroll</li>
        <li><strong>disabled</strong>: Auto-scrolling paused (happens when user scrolls up)</li>
        <li><strong>forced-disabled</strong>: Auto-scrolling disabled via autoScrollEnabled input</li>
        <li>Scroll up in the enabled example to see state change to "disabled"</li>
        <li>Scroll back to bottom to change state back to "enabled"</li>
        <li>Watch the "Auto-Scroll Internal State" displays to see real-time state</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [AutoScroll, ScrollArea, StorybookExampleContainer, StorybookExampleContainerSection],
})
class AutoScrollStatesDemoComponent {
  @ViewChild('enabledComponent')
  public enabledComponent!: AutoScroll;

  @ViewChild('disabledComponent')
  public disabledComponent!: AutoScroll;

  public getEnabledState(): string {
    return this.enabledComponent?.getAutoScrollState() || 'unknown';
  }

  public getDisabledState(): string {
    return this.disabledComponent?.getAutoScrollState() || 'unknown';
  }
}

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different auto-scroll states.',
      },
    },
  },
  render: () => ({
    template: '<story-auto-scroll-states-demo />',
    moduleMetadata: {
      imports: [AutoScrollStatesDemoComponent],
    },
  }),
};
