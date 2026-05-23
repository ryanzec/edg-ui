import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { Chat } from './chat';
import { ChatBlock } from './chat-block';
import { ChatComposer } from './chat-composer';
import { ChatDay } from './chat-day';
import { ChatEmptyState } from './chat-empty-state';
import { ChatMessage, allChatMessageRunPositions, type ChatMessageRunPosition } from './chat-message';
import { ChatQuote } from './chat-quote';
import { ChatReaction } from './chat-reaction';
import { ChatReactions } from './chat-reactions';
import { ChatStreaming } from './chat-streaming';
import { ChatSuggestion } from './chat-suggestion';
import { ChatSuggestions } from './chat-suggestions';
import { ChatTyping } from './chat-typing';
import { Button } from '../button/button';
import { ButtonGroup } from '../button/button-group';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import {
  type ChatMessageRole,
  type ChatMessageState,
  allChatMessageRoles,
  allChatMessageStates,
} from '../chat/chat-message-brain';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const liveDemoRoleItems: ButtonToggleItem[] = allChatMessageRoles.map((role) => ({
  label: role,
  value: role,
  buttonColor: 'primary',
}));

const liveDemoRunPositionItems: ButtonToggleItem[] = allChatMessageRunPositions.map((position) => ({
  label: position,
  value: position,
  buttonColor: 'primary',
}));

const liveDemoStateItems: ButtonToggleItem[] = allChatMessageStates.map((state) => ({
  label: state,
  value: state,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-chat-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Chat,
    ChatMessage,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs of a single chat-message to see how role, run-position, state, and metadata combine."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Role">
            <org-button-toggle [items]="roleItems" formControlName="role" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Run position">
            <org-button-toggle [items]="runPositionItems" formControlName="runPosition" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="State">
            <org-button-toggle [items]="stateItems" formControlName="state" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Edited">
            <org-checkbox-toggle name="live-demo-edited" value="edited" formControlName="edited">
              {{ liveDemoForm.controls.edited.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <org-chat>
            <org-chat-message
              [role]="liveDemoForm.controls.role.value!"
              [runPosition]="liveDemoForm.controls.runPosition.value!"
              [state]="liveDemoForm.controls.state.value!"
              authorName="Sarah Chen"
              time="2:14 PM"
              [edited]="liveDemoForm.controls.edited.value!"
              systemIcon="circle-help"
            >
              <p body>What's the rollout window for the v1.4 release?</p>
            </org-chat-message>
          </org-chat>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class ChatLiveDemoStory {
  protected readonly roleItems = liveDemoRoleItems;
  protected readonly runPositionItems = liveDemoRunPositionItems;
  protected readonly stateItems = liveDemoStateItems;

  protected readonly liveDemoForm = new FormGroup({
    role: new FormControl<ChatMessageRole>('user', { nonNullable: true }),
    runPosition: new FormControl<ChatMessageRunPosition>('only', { nonNullable: true }),
    state: new FormControl<ChatMessageState>('idle', { nonNullable: true }),
    edited: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

const meta: Meta<Chat> = {
  title: 'Core/Components/Chat',
  component: Chat,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Chat

  A vertical thread of role-bearing messages plus a composer. Assistant messages render as plain prose on the page;
  user and error messages wrap their body in an \`org-box\` so the eye can separate "what I said" from "what was
  said back". System messages render as a centered chrome pill.

  ### Composition
  - **Chat** — thread shell with the live-region aria semantics
  - **ChatMessage** — single message; role drives the surface, run-position drives the rhythm
  - **ChatBlock** — collapsible tool-call / thinking trace (assistant only)
  - **ChatSuggestions / ChatSuggestion** — chips for next-message suggestions
  - **ChatReactions / ChatReaction** — emoji + count chips with selected toggle
  - **ChatQuote** — quoted-reply preview rendered above a body
  - **ChatTyping** — three-dot bouncing indicator before the first token
  - **ChatStreaming** — pill badge that rides alongside in-flight prose
  - **ChatDay** — day separator with hairlines on either side
  - **ChatComposer** — wrapper around \`org-textarea\` with attach + send / stop affordances
  - **ChatEmptyState** — icon + heading + supporting copy + starter row inside an empty thread

  ### Roles
  - **user** — neutral bubble (org-box, borderless)
  - **assistant** — bare prose, no surface
  - **system** — centered chrome pill, no avatar / author
  - **error** — danger bubble (org-box, bordered)

  ### Run rhythm
  Set \`runPosition\` to \`only\`, \`first\`, \`middle\`, or \`last\` on each message. The component never inspects
  content — the consumer owns the grouping signal. Continuation messages keep the gutter so labels line up but hide
  the avatar and author label.

  ### States
  \`state\` accepts \`idle\`, \`pending\` (dims the surface, sets aria-busy), or \`failed\` (danger ramp,
  aria-invalid).
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Chat>;

export const Default: Story = {
  args: {},
  render: () => ({
    template: `
      <div class="w-3xl">
        <org-chat>
          <org-chat-message role="user" runPosition="only" authorName="Sarah Chen" time="2:14 PM">
            <p body>What's the rollout window for the v1.4 release?</p>
          </org-chat-message>

          <org-chat-message role="assistant" runPosition="only" authorName="Assistant" time="2:14 PM">
            <p body>The v1.4 rollout window is <strong>Tuesday 09:00 → Thursday 17:00 UTC</strong>, with a 5 → 25 → 100% ramp gated on error-rate and p95 latency.</p>
          </org-chat-message>
        </org-chat>
      </div>
    `,
    moduleMetadata: {
      imports: [Chat, ChatMessage],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Single chat-message with controls for every input that affects the visual output.',
      },
    },
  },
  render: () => ({
    template: '<story-chat-live-demo />',
    moduleMetadata: {
      imports: [ChatLiveDemoStory],
    },
  }),
};

export const Roles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Four roles and the surfaces they pull. user wears a soft neutral bubble; assistant renders bare on the page; system is a centered chrome banner; error uses the danger-soft ramp.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Roles" currentState="Comparing user, assistant, system, and error roles">
        <org-storybook-example-container-section label="User">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="user" runPosition="only" authorName="Sarah Chen" time="2:14 PM">
                <p body>What's the rollout window for the v1.4 release?</p>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Assistant">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="assistant" runPosition="only" authorName="Assistant" time="2:14 PM">
                <p body>The v1.4 rollout window is <strong>Tuesday 09:00 → Thursday 17:00 UTC</strong>. Ramp is 5% → 25% → 100% across the three days, gated on error-rate stability between bumps.</p>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="System">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="system" systemIcon="circle-help">
                <span body>Sarah Chen added Renée Marin to the thread.</span>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Error">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="error" runPosition="only" authorName="System" time="2:15 PM">
                <p body>Failed to send. <strong>Retry</strong> — the upstream model returned 503 while streaming.</p>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>User</strong>: neutral, borderless bubble (org-box)</li>
          <li><strong>Assistant</strong>: bare prose, no surface</li>
          <li><strong>System</strong>: centered chrome pill, no avatar / author</li>
          <li><strong>Error</strong>: danger ramp, bordered bubble</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const RunRhythm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Successive messages from the same author form a run. The avatar and author label show on the first message; continuation messages reserve the gutter (so labels line up) but hide both, and tighten the vertical gap.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Run rhythm"
        currentState="Three user messages forming a run, followed by an assistant only-message"
      >
        <org-storybook-example-container-section label="Run">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="user" runPosition="first" authorName="Sarah Chen" time="2:14 PM">
                <p body>Quick question on the deploy window.</p>
              </org-chat-message>
              <org-chat-message role="user" runPosition="middle">
                <p body>(I just realised I might have missed the standup notes —)</p>
              </org-chat-message>
              <org-chat-message role="user" runPosition="last">
                <p body>Is the v1.4 rollout still Tuesday?</p>
              </org-chat-message>

              <org-chat-message role="assistant" runPosition="only" authorName="Assistant" time="2:14 PM">
                <span body>
                  Yes — Tuesday 09:00 → Thursday 17:00 UTC, with a 5/25/100 ramp.
                  Standup notes were posted in #release-room at 10:32 — pinning them to this thread now.
                </span>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Avatar and author label render on <code>first</code> and <code>only</code> only</li>
          <li><code>middle</code> and <code>last</code> messages keep the avatar gutter (hidden) so bodies line up</li>
          <li>Vertical gap tightens within a run; widens between senders</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ToolAndThinkingBlocks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Collapsible cards inside an assistant message body, used for AI tool-call traces and reasoning. The header is always visible; the body collapses on click via the [(expanded)] two-way binding. A running block grows a thicker info rail on its pre edge so it stands apart from a finished one.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Tool and thinking blocks" currentState="Three blocks: a thinking trace, a finished tool-call, and a running tool-call">
        <org-storybook-example-container-section label="Blocks inside an assistant message">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="assistant" runPosition="only" authorName="Assistant" time="2:18 PM">
                <div body>
                  <p>Pulled up the rollout plan and cross-checked the changelog. Summary first, traces below.</p>
                  <org-chat-block kind="thinking" title="Thought for" titleEmphasis="3.4 s">
                    <p>The user wants the canonical rollout window for v1.4. release/v1.4.md is the source of truth; cross-check the changelog so the response includes confirmed gate thresholds.</p>
                  </org-chat-block>
                  <org-chat-block
                    kind="tool"
                    titleEmphasis="read_file(release/v1.4.md)"
                    meta="218 ms · 412 lines"
                    [expanded]="true"
                  >
                    <p># Release v1.4 — 2025-Q3 window: 2025-09-23T09:00 → 2025-09-25T17:00 UTC ramp: [5, 25, 100] gates: error-rate &lt; 0.5%, p95 latency &lt; 320ms</p>
                  </org-chat-block>
                  <org-chat-block kind="tool" state="running" titleEmphasis="grep(changelog/v1.4)" meta="running">
                    <p>(searching the changelog for v1.4 entries that mention rollout gates...)</p>
                  </org-chat-block>
                  <p>The rollout window is <strong>Tuesday 09:00 → Thursday 17:00 UTC</strong>, with a 5 → 25 → 100% ramp gated on error-rate and p95 latency.</p>
                </div>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Header is always visible; body collapses via the two-way <code>expanded</code> model on click</li>
          <li><code>kind="tool"</code> uses the info accent and a mono title-emphasis fragment</li>
          <li><code>kind="thinking"</code> uses the muted accent and an italic sans title-emphasis fragment</li>
          <li><code>state="running"</code> thickens the pre info rail; idle keeps the standard hairline</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Chat, ChatMessage, ChatBlock, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const StreamingAndTyping: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two states for "the model is composing". The typing indicator sits in place of body text before the first token arrives; once tokens are streaming, the body is replaced with the partial text and a streaming pill is appended.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Streaming and typing" currentState="Typing dots followed by a streaming pill">
        <org-storybook-example-container-section label="Typing then streaming">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="assistant" runPosition="first" authorName="Assistant" time="2:21 PM">
                <org-chat-typing body />
              </org-chat-message>

              <org-chat-message role="assistant" runPosition="last">
                <div body>
                  <p>The rollout window is Tuesday 09:00 → Thursday 17:00 UTC, with the standard 5 → 25 → 100% ramp. Each bump is gated on a 30-minute</p>
                  <org-chat-streaming />
                </div>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Three bouncing dots when no tokens have arrived yet</li>
          <li>Streaming pill rides under the partial body once tokens start flowing</li>
          <li>Both indicators collapse to a static state under <code>prefers-reduced-motion</code></li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Chat,
        ChatMessage,
        ChatTyping,
        ChatStreaming,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const ReactionsSuggestionsHoverActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Per-message ornaments that sit under the body. Reactions are emoji + count chips with a selected toggle; suggestions are next-message chips an assistant offers; hover actions surface copy / regenerate / thumbs on hover (or pinned).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Reactions, suggestions, hover actions"
        currentState="A reaction-decorated user message and an assistant message with hover actions (pinned) plus suggestions"
      >
        <org-storybook-example-container-section label="Reactions, suggestions, and hover actions">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="user" runPosition="only" authorName="Renée Marin" time="2:30 PM">
                <p body>I'd hold the Thursday bump until error-rate is clean for two consecutive 30-minute windows — yesterday's nudge tripped on a 28-minute streak.</p>
                <org-chat-reactions>
                  <org-chat-reaction emoji="👍" [count]="3" [selected]="true" />
                  <org-chat-reaction emoji="🚀" [count]="2" />
                  <org-chat-reaction emoji="👀" [count]="1" />
                </org-chat-reactions>
              </org-chat-message>

              <org-chat-message role="assistant" runPosition="only" authorName="Assistant" time="2:30 PM">
                <p body>Good call. I can wire a hold-on-streak rule into the runbook so future bumps refuse to advance until the 30-minute streak is clean. Want me to draft the change?</p>

                <org-button-group hoverActions data-pinned="1" data-variant="disconnected">
                  <org-button color="neutral" variant="text" size="sm" iconOnly="true" preIcon="copy" label="Copy" ariaLabel="Copy" />
                  <org-button color="neutral" variant="text" size="sm" iconOnly="true" preIcon="arrow-down-up" label="Regenerate" ariaLabel="Regenerate" />
                  <org-button color="neutral" variant="text" size="sm" iconOnly="true" preIcon="check" label="Helpful" ariaLabel="Helpful" />
                  <org-button color="neutral" variant="text" size="sm" iconOnly="true" preIcon="x" label="Not helpful" ariaLabel="Not helpful" />
                </org-button-group>

                <org-chat-suggestions>
                  <org-chat-suggestion label="Yes, draft the change" />
                  <org-chat-suggestion label="Show me the current rule first" />
                  <org-chat-suggestion label="What about the 5% bump?" />
                </org-chat-suggestions>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Reactions toggle visually (and via aria-pressed) between selected and unselected</li>
          <li>Suggestions are plain buttons; the consumer owns the click handler</li>
          <li>Hover actions reveal on hover / focus-within; <code>data-pinned="1"</code> keeps them visible</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Button,
        ButtonGroup,
        Chat,
        ChatMessage,
        ChatReaction,
        ChatReactions,
        ChatSuggestion,
        ChatSuggestions,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const MessageStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pending and failed states, plus the "(edited)" marker. data-state="pending" dims the bubble to flag in-flight; data-state="failed" pulls the danger ramp.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Message states"
        currentState="Pending, failed, and edited variants of the same user message"
      >
        <org-storybook-example-container-section label="Pending, failed, edited">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="user" runPosition="only" state="pending" authorName="Sarah Chen" meta="Sending...">
                <p body>Cool — pinging Ops to schedule the hold-on-streak deploy.</p>
              </org-chat-message>

              <org-chat-message role="error" runPosition="only" state="failed" authorName="Sarah Chen" meta="Failed — retry">
                <p body>Cool — pinging Ops to schedule the hold-on-streak deploy.</p>
              </org-chat-message>

              <org-chat-message role="user" runPosition="only" authorName="Sarah Chen" time="2:34 PM" [edited]="true">
                <p body>Cool — pinging Ops to schedule the hold-on-streak deploy. I'll attach the runbook draft once it's up.</p>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Pending</strong>: bubble dims, meta label replaces the time (e.g. "Sending..."), aria-busy=true</li>
          <li><strong>Failed</strong>: pulls the danger-soft surface and the danger border, aria-invalid=true</li>
          <li><strong>Edited</strong>: italic "(edited)" marker after the time</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Chat, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const DaySeparator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Centered tiny meta line with hairlines on either side. Sits in the thread between date groups; the consumer chooses when to render it.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Day separator" currentState="A day boundary between two messages">
        <org-storybook-example-container-section label="Yesterday → Today">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="user" runPosition="only" authorName="Sarah Chen" time="Yesterday · 4:48 PM">
                <p body>Heading out — back online tomorrow morning.</p>
              </org-chat-message>

              <org-chat-day label="Today" />

              <org-chat-message role="user" runPosition="only" authorName="Sarah Chen" time="9:02 AM">
                <p body>Morning. Did the v1.4 dry-run land overnight?</p>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Chat, ChatDay, ChatMessage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Composer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Stacked surface with three rows: queued attachments (optional), the textarea (auto-grows up to a cap then scrolls), and the action bar with attach + send. The send button flips to a Stop affordance while a response is streaming.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Composer" currentState="Idle, streaming, and locked composer surfaces">
        <org-storybook-example-container-section label="Idle with attachments">
          <div class="w-3xl">
            <org-chat-composer
              name="composer-idle"
              placeholder="Ask anything..."
              [attachments]="attachments"
              [value]="idleValue"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Streaming">
          <div class="w-3xl">
            <org-chat-composer
              name="composer-streaming"
              placeholder="Reply once the response finishes..."
              [streaming]="true"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Locked (no permission)">
          <div class="w-3xl">
            <org-chat-composer
              name="composer-locked"
              placeholder="You don't have permission to post in this thread."
              [disabled]="true"
              [showHint]="false"
              [showAttach]="false"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Idle</strong>: attachments above, textarea pill, attach + send buttons in the action bar</li>
          <li><strong>Streaming</strong>: textarea + attach disabled, send swaps to a red Stop button (still clickable)</li>
          <li><strong>Locked</strong>: whole composer dims, only a disabled send button remains</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      idleValue: 'Draft the hold-on-streak rule for the runbook, with a 30-minute window.',
      attachments: [
        { id: 'a1', label: 'release-v1.4.md', removable: true },
        { id: 'a2', label: 'changelog.md', removable: true },
      ],
    },
    moduleMetadata: {
      imports: [ChatComposer, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const EmptyThread: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When there are no messages, the thread still hosts the composer. A welcoming prompt lives above; on a fresh chat, render starter suggestions inside the empty area.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Empty thread" currentState="Empty state with starter suggestions and a composer below">
        <org-storybook-example-container-section label="Empty state with starters">
          <div class="w-3xl flex flex-col gap-2">
            <org-chat>
              <org-chat-empty-state
                heading="Ask anything about the rollout"
                supportingCopy="Connected to the v1.4 release runbook, changelog, and edge ingress dashboards. Try one of these to get started:"
              >
                <org-chat-suggestions>
                  <org-chat-suggestion label="Summarise the rollout window" />
                  <org-chat-suggestion label="What's the backout plan?" />
                  <org-chat-suggestion label="Who is captain this week?" />
                </org-chat-suggestions>
              </org-chat-empty-state>
            </org-chat>
            <org-chat-composer name="composer-empty" placeholder="Ask anything..." />
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Chat,
        ChatComposer,
        ChatEmptyState,
        ChatSuggestion,
        ChatSuggestions,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const QuotedReply: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A reply that quotes a prior message renders an `org-chat-quote` preview above its body.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Quoted reply" currentState="Assistant reply quoting a user message">
        <org-storybook-example-container-section label="Quoted reply">
          <div class="w-3xl">
            <org-chat>
              <org-chat-message role="user" runPosition="only" authorName="Sarah Chen" time="2:14 PM">
                <p body>What's the rollout window for the v1.4 release?</p>
              </org-chat-message>

              <org-chat-message role="assistant" runPosition="only" authorName="Assistant" time="2:14 PM">
                <org-chat-quote
                  quote
                  quoteAuthor="Sarah Chen"
                  quoteBody="What's the rollout window for the v1.4 release?"
                />
                <p body>Tuesday 09:00 → Thursday 17:00 UTC, gated on error-rate stability between bumps.</p>
              </org-chat-message>
            </org-chat>
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Chat, ChatMessage, ChatQuote, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CanonicalThread: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A canonical thread — user prompt, an assistant reply with a tool block, and a composer at the bottom. Mirrors the live demo from the implementation guide.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Canonical thread" currentState="A complete sample chat">
        <org-storybook-example-container-section label="Full thread">
          <div class="w-3xl flex flex-col gap-2">
            <org-chat>
              <org-chat-message role="user" runPosition="only" authorName="Sarah Chen" time="2:14 PM">
                <p body>What's the rollout window for the v1.4 release?</p>
              </org-chat-message>

              <org-chat-message role="system" systemIcon="circle-help">
                <span body>Sarah Chen added Renée Marin to the thread.</span>
              </org-chat-message>

              <org-chat-message role="assistant" runPosition="only" authorName="Assistant" time="2:14 PM">
                <div body>
                  <org-chat-block kind="thinking" title="Thought for" titleEmphasis="3.4 s">
                    <p>The user wants the canonical rollout window for v1.4. release/v1.4.md is the source of truth; cross-check the changelog so the response includes confirmed gate thresholds.</p>
                  </org-chat-block>
                  <org-chat-block kind="tool" titleEmphasis="read_file(release/v1.4.md)" meta="218 ms · 412 lines" [expanded]="true">
                    <p># Release v1.4 — 2025-Q3 window: 2025-09-23T09:00 → 2025-09-25T17:00 UTC ramp: [5, 25, 100] gates: error-rate &lt; 0.5%, p95 latency &lt; 320ms</p>
                  </org-chat-block>
                  <p>The v1.4 rollout window is <strong>Tuesday 09:00 → Thursday 17:00 UTC</strong>, with a 5 → 25 → 100% ramp gated on error-rate and p95 latency. You're listed as captain.</p>
                </div>
                <org-chat-suggestions>
                  <org-chat-suggestion label="Show the backout plan" />
                  <org-chat-suggestion label="Who's on call?" />
                  <org-chat-suggestion label="Draft a status update" />
                </org-chat-suggestions>
              </org-chat-message>
            </org-chat>
            <org-chat-composer name="composer-canonical" placeholder="Ask anything..." />
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Chat,
        ChatBlock,
        ChatComposer,
        ChatMessage,
        ChatSuggestion,
        ChatSuggestions,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};
