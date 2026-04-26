import type { Meta, StoryObj } from '@storybook/angular';
import { Chat } from './chat';
import { ChatMessage, type ChatMessageData } from './chat-message';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../button/button';

const meta: Meta<Chat> = {
  title: 'Core/Components/Chat',
  component: Chat,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Chat Components

  A comprehensive chat system with two components: \`Chat\` (wrapper) and \`ChatMessage\` (individual message).

  ### Features
  - Multiple message sources (user, AI, system)
  - Status indicators (in-progress, completed, failed)
  - Expandable steps with checklist
  - Duration display
  - Custom actions slots
  - Responsive alignment based on message source

  ### Message Sources
  - **user**: Messages from the user, right-aligned with background
  - **ai**: Messages from AI, left-aligned with background
  - **system**: System messages, center-aligned with bold text, no background

  ### Usage Examples
  \`\`\`html
  <!-- Basic chat with messages -->
  <org-chat>
    <org-chat-message [chatMessage]="userMessage" />
    <org-chat-message [chatMessage]="aiMessage" />
    <org-chat-message [chatMessage]="systemMessage" />
  </org-chat>

  <!-- Message with status and duration -->
  <org-chat-message [chatMessage]="{
    id: '1',
    message: 'Processing your request...',
    source: 'ai',
    status: 'in-progress',
    startedAt: '2024-01-01T10:00:00Z',
    completedAt: '2024-01-01T10:01:30Z'
  }" />

  <!-- Message with steps -->
  <org-chat-message [chatMessage]="{
    id: '2',
    message: 'Task completed',
    source: 'ai',
    status: 'completed',
    steps: [
      { id: '1', label: 'Step 1', status: 'valid' },
      { id: '2', label: 'Step 2', status: 'valid' }
    ]
  }" />

  <!-- Message with custom actions -->
  <org-chat-message [chatMessage]="message">
    <org-button actions color="primary" size="sm">Copy</org-button>
  </org-chat-message>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Chat>;

const sampleUserMessage: ChatMessageData = {
  id: '1',
  message: 'Hello, can you help me with this task?',
  source: 'user',
};

const sampleAiMessage: ChatMessageData = {
  id: '2',
  message: 'Of course! I can help you with that. Let me process your request.',
  source: 'ai',
  status: 'completed',
  startedAt: '2024-01-01T10:00:00Z',
  completedAt: '2024-01-01T10:00:45Z',
};

const sampleSystemMessage: ChatMessageData = {
  id: '3',
  message: 'Connection established',
  source: 'system',
};

const messageWithSteps: ChatMessageData = {
  id: '4',
  message: 'I have completed your request with the following steps:',
  source: 'ai',
  status: 'completed',
  startedAt: '2024-01-01T10:00:00Z',
  completedAt: '2024-01-01T10:02:30Z',
  steps: [
    { id: 's1', label: 'Analyzing request', status: 'valid' },
    { id: 's2', label: 'Processing data', status: 'valid' },
    { id: 's3', label: 'Generating response', status: 'valid' },
  ],
};

const inProgressMessage: ChatMessageData = {
  id: '5',
  message: 'Working on your request...',
  source: 'ai',
  status: 'in-progress',
  startedAt: '2024-01-01T10:00:00Z',
  completedAt: '2024-01-01T10:00:15Z',
};

const failedMessage: ChatMessageData = {
  id: '6',
  message: 'Sorry, I encountered an error processing your request.',
  source: 'ai',
  status: 'failed',
  startedAt: '2024-01-01T10:00:00Z',
  completedAt: '2024-01-01T10:00:10Z',
};

const messageWithNestedSteps: ChatMessageData = {
  id: '7',
  message: 'I have completed a complex multi-stage process with detailed sub-tasks:',
  source: 'ai',
  status: 'completed',
  startedAt: '2024-01-01T10:00:00Z',
  completedAt: '2024-01-01T10:05:45Z',
  steps: [
    {
      id: 'n1',
      label: 'Data Collection Phase',
      status: 'valid',
      items: [
        { id: 'n1.1', label: 'Gathering user inputs', status: 'valid' },
        { id: 'n1.2', label: 'Validating data format', status: 'valid' },
        { id: 'n1.3', label: 'Sanitizing input data', status: 'valid' },
      ],
    },
    {
      id: 'n2',
      label: 'Processing Phase',
      status: 'valid',
      items: [
        { id: 'n2.1', label: 'Analyzing patterns', status: 'valid' },
        { id: 'n2.2', label: 'Running algorithms', status: 'valid' },
        { id: 'n2.3', label: 'Optimizing results', status: 'valid' },
      ],
    },
    {
      id: 'n3',
      label: 'Finalization Phase',
      status: 'valid',
      items: [
        { id: 'n3.1', label: 'Formatting output', status: 'valid' },
        { id: 'n3.2', label: 'Quality checks', status: 'valid' },
      ],
    },
  ],
};

export const Default: Story = {
  args: {},
  render: () => ({
    template: `
      <div class="w-lg">
        <org-chat>
          <org-chat-message [chatMessage]="sampleUserMessage" />
          <org-chat-message [chatMessage]="sampleAiMessage" />
        </org-chat>
      </div>
    `,
    props: {
      sampleUserMessage,
      sampleAiMessage,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage],
    },
  }),
};

export const MessageSources: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all three message sources: user (right-aligned with background), AI (left-aligned with background), and system (center-aligned, bold, no background).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Message Sources"
        currentState="Comparing user, AI, and system messages"
      >
        <org-storybook-example-container-section label="User Message">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="sampleUserMessage" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="AI Message">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="sampleAiMessage" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="System Message">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="sampleSystemMessage" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>User</strong>: Right-aligned with level2 background color</li>
          <li><strong>AI</strong>: Left-aligned with level2 background color</li>
          <li><strong>System</strong>: Center-aligned, bold text, no background</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      sampleUserMessage,
      sampleAiMessage,
      sampleSystemMessage,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const StatusStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different status states: in-progress (info indicator with pulse animation), completed (safe indicator), and failed (danger indicator).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Status States"
        currentState="Comparing in-progress, completed, and failed states"
      >
        <org-storybook-example-container-section label="In Progress">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="inProgressMessage" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Completed">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="sampleAiMessage" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Failed">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="failedMessage" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>In Progress</strong>: Info indicator with pulse animation and "In Progress" text</li>
          <li><strong>Completed</strong>: Safe indicator with "Completed" text</li>
          <li><strong>Failed</strong>: Danger indicator with "Failed" text</li>
          <li>Duration is displayed when both startedAt and completedAt are provided</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      inProgressMessage,
      sampleAiMessage,
      failedMessage,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithSteps: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Message with expandable checklist steps. The steps are hidden by default and can be toggled.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Message with Steps"
        currentState="Message with expandable checklist"
      >
        <org-storybook-example-container-section label="AI Message with Steps">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="messageWithSteps" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Steps are hidden by default</li>
          <li>Toggle button shows/hides steps with count</li>
          <li>Steps are displayed using the Checklist component</li>
          <li>Each step shows status with appropriate icon</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      messageWithSteps,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithNestedSteps: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Message with expandable checklist steps that include nested sub-tasks. Parent steps can be expanded to reveal their child items, demonstrating multi-level task hierarchies.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Message with Nested Steps"
        currentState="Message with hierarchical checklist steps"
      >
        <org-storybook-example-container-section label="AI Message with Nested Steps">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="messageWithNestedSteps" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Main steps are shown with an expand/collapse control</li>
          <li>Each parent step displays a count of nested items</li>
          <li>Clicking a parent step reveals its nested sub-tasks</li>
          <li>Nested items are indented to show hierarchy</li>
          <li>All items show appropriate status icons</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      messageWithNestedSteps,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithCustomActions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Message with custom actions slot for additional controls.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Message with Custom Actions"
        currentState="Message with actions slot"
      >
        <org-storybook-example-container-section label="AI Message with Actions">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="sampleAiMessage">
                <org-button actions color="neutral" variant="text" size="sm">Copy</org-button>
                <org-button actions color="neutral" variant="text" size="sm">Share</org-button>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Custom actions can be placed in the actions slot</li>
          <li>Actions appear in the metadata section with status and duration</li>
          <li>Use the <code>[actions]</code> selector for the ng-content slot</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      sampleAiMessage,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection, Button],
    },
  }),
};

export const WithActionsOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Message with custom actions but no status or duration, verifying the actions slot renders correctly when the metadata row has no status/duration content.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Message with Actions Only (No Status or Duration)"
        currentState="Actions slot visible without status or duration"
      >
        <org-storybook-example-container-section label="AI Message with Actions Only">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="messageWithActionsOnly">
                <org-button actions color="neutral" variant="text" size="sm">Copy</org-button>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The actions slot renders even when the message has no status or duration</li>
          <li>Copy button should be visible below the message bubble</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      messageWithActionsOnly: {
        id: 'a1',
        message: 'Here is the result of your request.',
        source: 'ai',
      } as ChatMessageData,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection, Button],
    },
  }),
};

export const ConversationExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A complete conversation example showing multiple messages in a typical chat flow.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Conversation Example"
        currentState="Complete chat conversation"
      >
        <org-storybook-example-container-section label="Full Conversation">
          <div class="w-lg">
            <org-chat>
              <org-chat-message [chatMessage]="systemMessage" />
              <org-chat-message [chatMessage]="userMessage1" />
              <org-chat-message [chatMessage]="aiMessage1" />
              <org-chat-message [chatMessage]="userMessage2" />
              <org-chat-message [chatMessage]="aiMessage2" />
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Messages are stacked vertically with spacing</li>
          <li>User messages align right, AI messages align left</li>
          <li>System messages center-aligned</li>
          <li>Each message source has distinct visual styling</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      systemMessage: sampleSystemMessage,
      userMessage1: sampleUserMessage,
      aiMessage1: sampleAiMessage,
      userMessage2: {
        id: '7',
        message: 'Can you show me the detailed steps?',
        source: 'user',
      } as ChatMessageData,
      aiMessage2: messageWithSteps,
    },
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
