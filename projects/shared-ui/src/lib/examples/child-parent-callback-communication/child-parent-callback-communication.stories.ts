import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLEChildParentCallbackCommunication } from './child-parent-callback-communication';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../../core/button/button';
import { Component, output, input, signal } from '@angular/core';

const meta: Meta<EXAMPLEChildParentCallbackCommunication> = {
  title: 'Examples/Patterns/Child -> Parent Communication',
  component: EXAMPLEChildParentCallbackCommunication,
};

export default meta;
type Story = StoryObj<EXAMPLEChildParentCallbackCommunication>;

// Child component that uses output() for event emission
@Component({
  selector: 'story-example-child-with-output',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex flex-col gap-2">
      <div class="text-sm text-text">Child Component (Using output())</div>
      <org-button color="primary" (click)="messageEmitted.emit('Hello from child via output()!')">
        Send Message via Output
      </org-button>
    </div>
  `,
})
class ChildWithOutput {
  messageEmitted = output<string>();
}

// Child component that uses callback function
@Component({
  selector: 'story-example-child-with-callback',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex flex-col gap-2">
      <div class="text-sm text-text">Child Component (Using callback)</div>
      <org-button color="secondary" (click)="onSendMessage()"> Send Message via Callback </org-button>
    </div>
  `,
})
class ChildWithCallback {
  onMessageCallback = input<((message: string) => void) | undefined>();

  onSendMessage() {
    const callback = this.onMessageCallback();

    if (callback) {
      callback('Hello from child via callback!');
    }
  }
}

// Wrapper component to demonstrate the patterns with state
@Component({
  selector: 'story-example-output-vs-callback-demo',
  standalone: true,
  imports: [StorybookExampleContainer, StorybookExampleContainerSection, ChildWithOutput, ChildWithCallback],
  template: `
    <org-storybook-example-container
      title="Communication Patterns"
      currentState="Comparing output() vs callback approaches"
    >
      <org-storybook-example-container-section label="Using output() (Recommended)">
        <div class="flex flex-col gap-4">
          <story-example-child-with-output (messageEmitted)="onOutputMessage($event)" />
          <div class="rounded border border-safe-border bg-safe-background-subtle p-3">
            <div class="text-sm font-medium text-text">Message Received:</div>
            <div class="text-sm text-text">{{ outputMessage() }}</div>
          </div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Using Callback (Not Recommended)">
        <div class="flex flex-col gap-4">
          <story-example-child-with-callback [onMessageCallback]="onCallbackMessage" />
          <div class="rounded border border-caution-border bg-caution-background-subtle p-3">
            <div class="text-sm font-medium text-text">Message Received:</div>
            <div class="text-sm text-text">{{ callbackMessage() }}</div>
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>output()</strong>: Better decoupling, no need for arrow functions or 'this' binding</li>
        <li><strong>Callback</strong>: Requires arrow functions to maintain 'this' context, tighter coupling</li>
        <li>Use callbacks only in complex situations where the event system is not practical</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class OutputVsCallbackDemo {
  outputMessage = signal('Click the button above to send a message');
  callbackMessage = signal('Click the button above to send a message');

  onOutputMessage(message: string) {
    this.outputMessage.set(message);
  }

  // Must use arrow function to preserve 'this' context
  onCallbackMessage = (message: string) => {
    this.callbackMessage.set(message);
  };
}

export const OutputVsCallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of the two approaches: signal-based output() (preferred) vs callback functions (not recommended for most cases).',
      },
    },
  },
  render: () => ({
    template: `<story-example-output-vs-callback-demo />`,
    moduleMetadata: {
      imports: [OutputVsCallbackDemo],
    },
  }),
};

// Wrapper component for output pattern demo
@Component({
  selector: 'story-example-output-pattern-demo',
  standalone: true,
  imports: [StorybookExampleContainer, StorybookExampleContainerSection, ChildWithOutput],
  template: `
    <org-storybook-example-container
      title="Output Pattern (Recommended)"
      currentState="Using signal-based output() for child-to-parent communication"
    >
      <org-storybook-example-container-section label="Child Component Code">
        <pre class="rounded border border-border bg-backgrond p-4 text-xs"><code>@Component({{ '{' }}
  selector: 'child-component',
  template: &#96;&lt;button (click)="messageEmitted.emit('Hello!')"&gt;Send&lt;/button&gt;&#96;
{{ '}' }})
class ChildComponent {{ '{' }}
  messageEmitted = output&lt;string&gt;();
{{ '}' }}</code></pre>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Parent Component Code">
        <pre class="rounded border border-border bg-backgrond p-4 text-xs"><code>@Component({{ '{' }}
  selector: 'parent-component',
  template: &#96;&lt;child-component (messageEmitted)="onMessage($event)" /&gt;&#96;
{{ '}' }})
class ParentComponent {{ '{' }}
  onMessage(message: string) {{ '{' }}
    console.log(message);
  {{ '}' }}
{{ '}' }}</code></pre>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Live Example">
        <div class="flex flex-col gap-4">
          <story-example-child-with-output (messageEmitted)="onMessage($event)" />
          <div class="rounded border border-border bg-background p-3">
            <div class="text-sm font-medium text-text">Message Received:</div>
            <div class="text-sm text-text">{{ message() }}</div>
            <div class="mt-2 text-sm font-medium text-text">Benefits:</div>
            <ul class="mt-2 list-inside list-disc flex flex-col gap-1 text-sm text-text">
              <li>No need to worry about 'this' context</li>
              <li>Better type safety</li>
              <li>Cleaner separation of concerns</li>
              <li>Follows Angular best practices</li>
            </ul>
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Use <strong>output()</strong> to create type-safe event emitters</li>
        <li>Parent listens to events using standard Angular event binding syntax</li>
        <li>No arrow functions or 'this' binding required</li>
        <li>Promotes better component decoupling</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class OutputPatternDemo {
  message = signal('Click the button above to send a message');

  onMessage(message: string) {
    this.message.set(message);
  }
}

export const OutputPattern: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Detailed example of the recommended output() pattern showing how to properly emit events from child to parent.',
      },
    },
  },
  render: () => ({
    template: `<story-example-output-pattern-demo />`,
    moduleMetadata: {
      imports: [OutputPatternDemo],
    },
  }),
};

export const CallbackPattern: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example of the callback pattern (not recommended for most cases) showing the challenges with this approach.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Callback Pattern (Not Recommended)"
        currentState="Using callback functions for child-to-parent communication"
      >
        <org-storybook-example-container-section label="Child Component Code">
          <pre class="rounded border border-border bg-backgrond p-4 text-xs"><code>@Component({{ '{' }}
  selector: 'child-component',
  template: &#96;&lt;button (click)="onSendMessage()"&gt;Send&lt;/button&gt;&#96;
{{ '}' }})
class ChildComponent {{ '{' }}
  onMessageCallback?: (message: string) => void;

  onSendMessage() {{ '{' }}
    if (this.onMessageCallback) {{ '{' }}
      this.onMessageCallback('Hello!');
    {{ '}' }}
  {{ '}' }}
{{ '}' }}</code></pre>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Parent Component Code (Incorrect)">
          <pre class="rounded border border-danger-border bg-danger-background-subtle p-4 text-xs"><code>@Component({{ '{' }}
  selector: 'parent-component',
  template: &#96;&lt;child-component [onMessageCallback]="onMessage" /&gt;&#96;
{{ '}' }})
class ParentComponent {{ '{' }}
  onMessage(message: string) {{ '{' }}
    // ❌ 'this' context is lost!
    console.log(this.someProperty); // undefined
  {{ '}' }}
{{ '}' }}</code></pre>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Parent Component Code (Correct but Awkward)">
          <pre class="rounded border border-border bg-background p-4 text-xs"><code>@Component({{ '{' }}
  selector: 'parent-component',
  template: &#96;&lt;child-component [onMessageCallback]="onMessage" /&gt;&#96;
{{ '}' }})
class ParentComponent {{ '{' }}
  // ⚠️ Must use arrow function to preserve 'this'
  onMessage = (message: string) => {{ '{' }}
    console.log(this.someProperty); // works but feels odd in class
  {{ '}' }}
{{ '}' }}</code></pre>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Problem 1</strong>: Requires arrow functions to maintain 'this' context</li>
          <li><strong>Problem 2</strong>: Easy to forget and leads to bugs</li>
          <li><strong>Problem 3</strong>: Tighter coupling between parent and child</li>
          <li><strong>Problem 4</strong>: Doesn't follow Angular conventions</li>
          <li>Only use callbacks in complex scenarios where output() is not practical</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
