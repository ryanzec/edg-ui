import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { TicketsKanban, type TicketsKanbanStatusChangedEvent } from './tickets-kanban';
import { defaultKanbanTickets } from './tickets-kanban-types';

@Component({
  selector: 'story-tickets-kanban-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TicketsKanban, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Live demo"
        description="Drag a card to a different lane to update its status; click a card to fire the click event. The template owns its own static ticket list — there are no inputs."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="block h-lg">
          <org-tickets-kanban (ticketStatusChanged)="onStatusChanged($event)" (ticketClicked)="onClicked($event)" />
        </div>
        <div class="text-xs text-muted pt-2">Last event: {{ lastEvent() ?? '—' }}</div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class TicketsKanbanLiveDemoStory {
  protected readonly lastEvent = signal<string | null>(null);

  protected onStatusChanged(event: TicketsKanbanStatusChangedEvent): void {
    this.lastEvent.set(`ticketStatusChanged → ${event.ticketId} = ${event.status}`);
  }

  protected onClicked(ticketId: string): void {
    this.lastEvent.set(`ticketClicked → ${ticketId}`);
  }
}

@Component({
  selector: 'story-tickets-kanban-standard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TicketsKanban],
  template: `
    <div class="block h-lg">
      <org-tickets-kanban />
    </div>
  `,
})
class TicketsKanbanStandardStory {}

const meta: Meta<TicketsKanban> = {
  title: 'Templates/Tickets Kanban',
  component: TicketsKanban,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        TicketsKanban,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Tickets Kanban

  A template view that renders a static list of tickets across four status swimlanes
  (\`Opened\`, \`In Progress\`, \`Reviewing\`, \`Completed\`) using the core
  \`org-kanban-board\`. The ticket list lives inside the template and is grouped by
  \`status\` via per-status \`computed()\` properties.

  ### Features
  - One swimlane per \`KanbanTicketStatus\` value, in workflow order
  - Cross-lane drag updates the dragged ticket's status and emits \`ticketStatusChanged\`
  - Within-lane drag is a no-op (no explicit order field on the data model)
  - Clicking a card emits \`ticketClicked\` with the ticket id
  - Each card shows the title, a 2-line-clamped description, tag pills, the
    creator (gravatar + name), and a relative "updated" timestamp via \`dateUtils.fromNow()\`

  ### Outputs
  - \`ticketStatusChanged\`: \`{ ticketId: string; status: KanbanTicketStatus }\`
  - \`ticketClicked\`: \`string\` (the ticket id)

  ### Usage
  \`\`\`html
  <org-tickets-kanban
    (ticketStatusChanged)="onStatusChanged($event)"
    (ticketClicked)="onTicketClicked($event)"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<TicketsKanban>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default tickets kanban with all four lanes populated from the internal static list. The template has no inputs — outputs are the only interaction surface.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="block h-lg">
        <org-tickets-kanban />
      </div>
    `,
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo wired to the two outputs. Drag a card across lanes to fire ticketStatusChanged; click a card to fire ticketClicked. The "Last event" line reflects the most recent payload.',
      },
    },
  },
  render: () => ({
    template: '<story-tickets-kanban-live-demo />',
    moduleMetadata: {
      imports: [TicketsKanbanLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Showcase covering the standard view and the expected behaviors of drag-to-change-status and card click.',
      },
    },
  },
  render: () => ({
    props: {
      totalTickets: defaultKanbanTickets.length,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Tickets Kanban — Showcase" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Standard view (all four lanes populated)</div>
            <story-tickets-kanban-standard />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Four swimlanes render in workflow order: <strong>Opened</strong>, <strong>In Progress</strong>, <strong>Reviewing</strong>, <strong>Completed</strong></li>
          <li>The internal seed list contains <strong>{{ totalTickets }}</strong> tickets distributed across the four statuses</li>
          <li><strong>Cross-lane drag</strong>: dragging a card into another lane updates its <code>status</code> and emits <code>ticketStatusChanged</code></li>
          <li><strong>Within-lane drag</strong>: no-op (no explicit ordering field on the data model)</li>
          <li><strong>Card click</strong>: emits <code>ticketClicked</code> with the ticket id</li>
          <li><strong>Card content</strong>: title, 2-line-clamped description, tag pills, creator avatar + name, relative "updated" timestamp</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        TicketsKanbanStandardStory,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
