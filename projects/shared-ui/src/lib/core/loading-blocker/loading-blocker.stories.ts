import type { Meta, StoryObj } from '@storybook/angular';
import { LoadingBlocker } from './loading-blocker';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal } from '@angular/core';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<LoadingBlocker> = {
  title: 'Core/Components/Loading Blocker',
  component: LoadingBlocker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Loading Blocker Component

  A component that overlays content to block user interaction while content is loading. The blocker displays a loading spinner with optional text.

  ### Features
  - Overlays parent element with semi-transparent background
  - Centers loading spinner and optional text
  - Blocks all pointer events to prevent interaction
  - Focus trapping to prevent tabbing to blocked content
  - Accessible with aria-busy and aria-live attributes
  - Supports dynamic text updates

  ### Usage Examples
  \`\`\`html
  <!-- Basic loading blocker -->
  <div class="relative h-2xs">
    <org-loading-blocker [isVisible]="true" />
    <!-- Your content here -->
  </div>

  <!-- With text -->
  <div class="relative h-2xs">
    <org-loading-blocker [isVisible]="true" text="Loading data..." />
    <!-- Your content here -->
  </div>

  <!-- Conditionally visible -->
  <div class="relative h-2xs">
    <org-loading-blocker [isVisible]="isLoading()" [text]="loadingMessage()" />
    <!-- Your content here -->
  </div>
  \`\`\`

  ### Important Notes
  - The parent element must have \`position: relative\` set
  - The blocker uses \`position: absolute\` to overlay the parent
  - The blocker has a fixed z-index using the \`--z-index-overlay\` token
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<LoadingBlocker>;

export const Default: Story = {
  args: {
    isVisible: true,
    text: '',
  },
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Controls visibility of the loading blocker',
    },
    text: {
      control: 'text',
      description: 'Optional text to display next to the loading spinner',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="relative h-2xs border rounded-md p-4">
        <org-loading-blocker [isVisible]="isVisible" [text]="text" />
        <div class="flex flex-col gap-4">
          <h3 class="text-xl font-bold">Sample Content</h3>
          <p>This is some content that would be blocked while loading.</p>
          <button class="px-4 py-2 bg-primary rounded-md w-6xs">
            Sample Button
          </button>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [LoadingBlocker],
    },
  }),
};

export const States: Story = {
  render: () => ({
    props: {},
    template: `
      <org-storybook-example-container>
        <org-storybook-example-container-section label="Visible Without Text">
          <div class="relative h-5xs border rounded-md p-4">
            <org-loading-blocker [isVisible]="true" />
            <div>
              <h3 class="text-lg font-bold">Content Area</h3>
              <p>This content is blocked by the loading overlay.</p>
            </div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Visible With Text">
          <div class="relative h-5xs border rounded-md p-4">
            <org-loading-blocker [isVisible]="true" text="Loading data..." />
            <div>
              <h3 class="text-lg font-bold">Content Area</h3>
              <p>This content is blocked by the loading overlay.</p>
            </div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Hidden">
          <div class="relative h-5xs border rounded-md p-4">
            <org-loading-blocker [isVisible]="false" text="Loading..." />
            <div>
              <h3 class="text-lg font-bold">Content Area</h3>
              <p>The loading blocker is not visible, so this content is accessible.</p>
            </div>
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LoadingBlocker, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithDifferentTextLengths: Story = {
  render: () => ({
    props: {},
    template: `
      <org-storybook-example-container>
        <org-storybook-example-container-section label="Short Text">
          <div class="relative h-5xs w-2xs border rounded-md p-4 overflow-hidden">
            <org-loading-blocker [isVisible]="true" text="Loading..." />
            <div>Content</div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Medium Text">
          <div class="relative h-5xs w-2xs border rounded-md p-4 overflow-hidden">
            <org-loading-blocker [isVisible]="true" text="Loading your data, please wait..." />
            <div>Content</div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Long Text">
          <div class="relative h-5xs w-2xs border rounded-md p-4 overflow-hidden">
            <org-loading-blocker [isVisible]="true" text="Loading your data from the server, this may take a few moments..." />
            <div>Content</div>
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LoadingBlocker, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-dynamic-text-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker],
  template: `
    <div class="relative h-2xs border rounded-md p-4">
      <org-loading-blocker [isVisible]="true" [text]="currentText()" />
      <div class="flex flex-col gap-4">
        <h3 class="text-xl font-bold">Dynamic Loading Text</h3>
        <p>Watch the loading message change every second.</p>
        <p class="text-sm">Current message: {{ currentText() }}</p>
      </div>
    </div>
  `,
})
class DynamicTextExampleComponent implements OnInit, OnDestroy {
  private readonly _loadingMessages = [
    'Initializing...',
    'Loading data...',
    'Processing request...',
    'Fetching records...',
    'Almost done...',
    'Finalizing...',
  ];

  private _currentIndex = 0;
  private _intervalId: ReturnType<typeof setInterval> | null = null;

  public currentText = signal<string>(this._loadingMessages[0]);

  public ngOnInit(): void {
    this._intervalId = setInterval(() => {
      this._currentIndex = (this._currentIndex + 1) % this._loadingMessages.length;
      this.currentText.set(this._loadingMessages[this._currentIndex]);
    }, 1000);
  }

  public ngOnDestroy(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }
}

export const DynamicText: Story = {
  render: () => ({
    props: {},
    template: `<story-dynamic-text-example />`,
    moduleMetadata: {
      imports: [DynamicTextExampleComponent],
    },
  }),
};

export const DifferentContainerSizes: Story = {
  render: () => ({
    props: {},
    template: `
      <org-storybook-example-container>
        <org-storybook-example-container-section label="Small Container">
          <div class="relative h-6xs w-2xs border rounded-md p-4">
            <org-loading-blocker [isVisible]="true" text="Loading..." />
            <div>Small content area</div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Medium Container">
          <div class="relative h-5xs w-md border rounded-md p-4">
            <org-loading-blocker [isVisible]="true" text="Loading your data..." />
            <div>Medium content area</div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large Container">
          <div class="relative h-sm w-full border rounded-md p-4">
            <org-loading-blocker [isVisible]="true" text="Loading all records from the database..." />
            <div>Large content area with more space</div>
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LoadingBlocker, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
