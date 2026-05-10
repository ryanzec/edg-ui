import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  EmptyIndicator,
  EMPTY_INDICATOR_ACTION_LABEL_DEFAULT,
  EMPTY_INDICATOR_BOX_BACKGROUND_DEFAULT,
  EMPTY_INDICATOR_BOX_BORDER_DEFAULT,
  EMPTY_INDICATOR_BOX_COLOR_DEFAULT,
  EMPTY_INDICATOR_BOX_PADDING_DEFAULT,
  EMPTY_INDICATOR_DESCRIPTION_DEFAULT,
} from './empty-indicator';
import { allEmptyIndicatorIconColors, EmptyIndicatorIcon, EmptyIndicatorIconColor } from './empty-indicator-icon';
import { allBoxBorders, allBoxPaddings, BoxBackground, BoxBorder, BoxPadding } from '../box/box';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { ListItemIcon } from '../list/list-item-icon';
import { allComponentColors, ComponentColor } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

type LiveDemoBoxColor = ComponentColor | 'none';

const allLiveDemoBoxColors = ['none', ...allComponentColors] as const satisfies readonly LiveDemoBoxColor[];

type LiveDemoIconName =
  | 'inbox'
  | 'search'
  | 'folder'
  | 'notification'
  | 'users'
  | 'file-text'
  | 'package'
  | 'circle-check-big'
  | 'sparkles';

const allLiveDemoIconNames = [
  'inbox',
  'search',
  'folder',
  'notification',
  'users',
  'file-text',
  'package',
  'circle-check-big',
  'sparkles',
] as const satisfies readonly LiveDemoIconName[];

const liveDemoBoxColorItems: ButtonToggleItem[] = allLiveDemoBoxColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoBoxBorderItems: ButtonToggleItem[] = allBoxBorders.map((border) => ({
  label: border,
  value: border,
  buttonColor: 'primary',
}));

const liveDemoBoxPaddingItems: ButtonToggleItem[] = allBoxPaddings.map((padding) => ({
  label: padding,
  value: padding,
  buttonColor: 'primary',
}));

const liveDemoIconItems: ButtonToggleItem[] = allLiveDemoIconNames.map((name) => ({
  label: name,
  value: name,
  buttonColor: 'primary',
}));

const meta: Meta<EmptyIndicator> = {
  title: 'Core/Components/Empty Indicator',
  component: EmptyIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Empty Indicator Component

  A "no data" state — a centered Box with an optional 4xl icon, a header, an optional description, and an optional action button. The frame is a real \`org-box\`; Empty Indicator only adds layout (centering + vertical rhythm) and the typography for the header and description. It deliberately does not define its own border, padding, or color — those come from the underlying Box.

  ### Features
  - Required centered \`<h3>\` header
  - Optional description rendered below the header (capped at a comfortable reading column)
  - Optional projected icon via \`<org-empty-indicator-icon>\` rendered above the header at the largest icon size
  - Optional action button below the description
  - Box-based styling (color, border, padding, background) via pass-through inputs
  - Padding-aware spacing — \`lg\` padding triggers a slightly more generous internal stack rhythm
  - Conditional \`role="status"\` via the \`statusRole\` input — appropriate for action-result empty states, off for steady-state placeholders

  ### Composition Parts
  - **org-empty-indicator** — parent wrapper that arranges the icon slot, header, description, and action button
  - **org-empty-indicator-icon** — optional projected icon wrapper hard-pinned to the largest size; the slot owns the color and the inner icon picks it up via \`currentColor\`

  ### Usage Examples
  \`\`\`html
  <!-- Header only -->
  <org-empty-indicator header="No data available" />

  <!-- With description -->
  <org-empty-indicator
    header="No results found"
    description="Try adjusting your search filters"
  />

  <!-- With projected icon -->
  <org-empty-indicator header="No items to display">
    <org-empty-indicator-icon name="search" />
  </org-empty-indicator>

  <!-- With action button -->
  <org-empty-indicator
    header="No items to display"
    description="Get started by creating your first item"
    actionLabel="Add Item"
    (actionTriggered)="onAddItem()"
  />

  <!-- Custom Box styling -->
  <org-empty-indicator
    header="Warning state"
    boxColor="warning"
    boxBorder="border-thick"
    boxPadding="lg"
    boxBackground="colored"
  />
  \`\`\`

  ### Notes
  - The action button only displays if both \`actionLabel\` is provided and there is a listener on the \`actionTriggered\` output.
  - Box styling (\`boxColor\`, \`boxBorder\`, \`boxPadding\`, \`boxBackground\`) is forwarded to an internal \`org-box\`.
  - The component takes the surface from the underlying Box; it never paints its own border, padding, or background.
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<EmptyIndicator>;

export const Default: Story = {
  args: {
    header: 'No data available',
    description: EMPTY_INDICATOR_DESCRIPTION_DEFAULT,
    actionLabel: EMPTY_INDICATOR_ACTION_LABEL_DEFAULT,
    boxColor: EMPTY_INDICATOR_BOX_COLOR_DEFAULT,
    boxBorder: EMPTY_INDICATOR_BOX_BORDER_DEFAULT,
    boxPadding: EMPTY_INDICATOR_BOX_PADDING_DEFAULT,
    boxBackground: EMPTY_INDICATOR_BOX_BACKGROUND_DEFAULT,
  },
  argTypes: {
    header: {
      control: 'text',
      description: 'The required header text displayed above the description',
    },
    description: {
      control: 'text',
      description: 'Optional description text displayed below the header',
    },
    actionLabel: {
      control: 'text',
      description: 'Optional label for the action button',
    },
    boxColor: {
      control: 'select',
      options: [null, 'primary', 'secondary', 'neutral', 'safe', 'info', 'caution', 'warning', 'danger'],
      description: 'The semantic color applied to the inner Box component',
    },
    boxBorder: {
      control: 'select',
      options: ['bordered', 'borderless', 'border-thick', 'border-emphasize'],
      description: 'The border/visual style variant applied to the inner Box component',
    },
    boxPadding: {
      control: 'select',
      options: ['none', 'sm', 'base', 'lg'],
      description: 'The internal padding size applied to the inner Box component',
    },
    boxBackground: {
      control: 'select',
      options: ['colored', 'colorless'],
      description: 'Whether the inner Box tints its background using the boxColor input',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty indicator with header only. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onAction: () => {
        console.log('action triggered');
      },
    },
    template: `
      <org-empty-indicator
        [header]="header"
        [description]="description"
        [actionLabel]="actionLabel"
        [boxColor]="boxColor"
        [boxBorder]="boxBorder"
        [boxPadding]="boxPadding"
        [boxBackground]="boxBackground"
        (actionTriggered)="onAction()"
      />
    `,
    moduleMetadata: {
      imports: [EmptyIndicator],
    },
  }),
};

@Component({
  selector: 'story-empty-indicator-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    EmptyIndicator,
    EmptyIndicatorIcon,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      .canvas-stage {
        display: flex;
        align-items: stretch;
        justify-content: center;
        min-height: 12rem; /* 192px */
      }

      .canvas-stage > org-empty-indicator {
        flex: 1;
        max-width: 32rem; /* 512px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs to walk every combination — content slots, the Box's color / border / padding knobs, and which optional pieces are present."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Box color">
            <org-button-toggle [items]="boxColorItems" formControlName="boxColor" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Box border">
            <org-button-toggle [items]="boxBorderItems" formControlName="boxBorder" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Box padding">
            <org-button-toggle [items]="boxPaddingItems" formControlName="boxPadding" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Icon">
            <org-button-toggle [items]="iconItems" formControlName="icon" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Show icon">
            <org-checkbox-toggle name="live-demo-show-icon" value="show-icon" formControlName="showIcon">
              {{ liveDemoForm.controls.showIcon.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Show description">
            <org-checkbox-toggle name="live-demo-show-description" value="show-description" formControlName="showDescription">
              {{ liveDemoForm.controls.showDescription.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Show action">
            <org-checkbox-toggle name="live-demo-show-action" value="show-action" formControlName="showAction">
              {{ liveDemoForm.controls.showAction.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Tint bg">
            <org-checkbox-toggle name="live-demo-tint-bg" value="tint-bg" formControlName="tintBackground">
              {{ liveDemoForm.controls.tintBackground.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-empty-indicator
              [header]="header"
              [description]="liveDemoForm.controls.showDescription.value ? description : null"
              [actionLabel]="liveDemoForm.controls.showAction.value ? actionLabel : null"
              [boxColor]="resolvedBoxColor()"
              [boxBorder]="liveDemoForm.controls.boxBorder.value"
              [boxPadding]="liveDemoForm.controls.boxPadding.value"
              [boxBackground]="resolvedBoxBackground()"
              (actionTriggered)="onAction()"
            >
              @if (liveDemoForm.controls.showIcon.value) {
                <org-empty-indicator-icon [name]="liveDemoForm.controls.icon.value" />
              }
            </org-empty-indicator>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class EmptyIndicatorLiveDemoStory {
  protected readonly boxColorItems = liveDemoBoxColorItems;
  protected readonly boxBorderItems = liveDemoBoxBorderItems;
  protected readonly boxPaddingItems = liveDemoBoxPaddingItems;
  protected readonly iconItems = liveDemoIconItems;

  protected readonly header = 'No items found';
  protected readonly description = 'Try changing your filters or clearing the current search.';
  protected readonly actionLabel = 'Add item';

  protected readonly liveDemoForm = new FormGroup({
    boxColor: new FormControl<LiveDemoBoxColor>('none', { nonNullable: true }),
    boxBorder: new FormControl<BoxBorder>('bordered', { nonNullable: true }),
    boxPadding: new FormControl<BoxPadding>('base', { nonNullable: true }),
    icon: new FormControl<LiveDemoIconName>('inbox', { nonNullable: true }),
    showIcon: new FormControl<boolean>(true, { nonNullable: true }),
    showDescription: new FormControl<boolean>(true, { nonNullable: true }),
    showAction: new FormControl<boolean>(true, { nonNullable: true }),
    tintBackground: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected resolvedBoxColor(): ComponentColor | null {
    const value = this.liveDemoForm.controls.boxColor.value;

    return value === 'none' ? null : value;
  }

  protected resolvedBoxBackground(): BoxBackground {
    return this.liveDemoForm.controls.tintBackground.value ? 'colored' : 'colorless';
  }

  protected onAction(): void {
    console.log('live demo action triggered');
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input — content slots, Box color / border / padding, and the background tint — and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-empty-indicator-live-demo />`,
    moduleMetadata: {
      imports: [EmptyIndicatorLiveDemoStory],
    },
  }),
};

const showcaseListItems = [
  { label: 'Aurora landing page' },
  { label: 'Internal tooling rewrite' },
  { label: 'Quarterly review deck' },
];

const showcaseIconColors: readonly EmptyIndicatorIconColor[] = allEmptyIndicatorIconColors;

@Component({
  selector: 'story-empty-indicator-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EmptyIndicator,
    EmptyIndicatorIcon,
    List,
    ListItem,
    ListItemIcon,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--spacing-4);
      }

      .grid-4 {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--spacing-4);
      }

      .section-label {
        display: block;
        margin-bottom: var(--spacing-2);
        font-size: var(--font-size-xs);
        letter-spacing: var(--letter-spacing-wide);
        text-transform: uppercase;
        color: var(--color-fg-muted);
      }

      .list-row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Visual states"
          description="The four canonical content layouts the spec calls out — header only, header + description, header + description + icon, and header + description + icon + action button."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="grid-2">
            <div>
              <span class="section-label">Header only</span>
              <org-empty-indicator header="No items found" />
            </div>
            <div>
              <span class="section-label">Header + description</span>
              <org-empty-indicator
                header="No items found"
                description="Try changing your filters or clearing the current search."
              />
            </div>
            <div>
              <span class="section-label">Header + description + icon</span>
              <org-empty-indicator
                header="Inbox is empty"
                description="When you receive new messages, they'll show up here."
              >
                <org-empty-indicator-icon name="inbox" />
              </org-empty-indicator>
            </div>
            <div>
              <span class="section-label">Header + description + icon + action</span>
              <org-empty-indicator
                header="No projects yet"
                description="Create a project to start organizing your work into shared spaces."
                actionLabel="Create project"
                (actionTriggered)="onAction('create-project')"
              >
                <org-empty-indicator-icon name="folder" />
              </org-empty-indicator>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Header only</strong>: Just the centered &lt;h3&gt;</li>
          <li><strong>+ Description</strong>: Description is muted, capped at a 44ch reading column</li>
          <li><strong>+ Icon</strong>: 4xl glyph above the stack with extra breathing room</li>
          <li><strong>+ Action</strong>: Button sits below the description with extra top margin so it reads as a separate decision</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Icon tints"
          description="Each value of the icon slot's data-color attribute. The slot itself paints the color and the inner icon picks it up via currentColor."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="grid-4">
            @for (color of iconColors; track color) {
              <div>
                <span class="section-label">{{ color }}</span>
                <org-empty-indicator header="No items">
                  <org-empty-indicator-icon name="inbox" [color]="color" />
                </org-empty-indicator>
              </div>
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>inherit (default)</strong>: Falls back to the host text color (--color-fg)</li>
          <li><strong>muted / faint</strong>: Lower-emphasis foreground tones for steady-state placeholders</li>
          <li><strong>semantic colors</strong>: primary, secondary, neutral, safe, info, caution, warning, danger</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Box color × border"
          description="The Box knobs (data-color, data-border, data-padding) pass through to the inner frame. The empty indicator itself stays neutral — only the surrounding Box reflects the chosen tone."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="grid-2">
            <div>
              <span class="section-label">color: info · border: bordered</span>
              <org-empty-indicator
                header="No matching results"
                description="Adjust your search terms or clear filters to see more."
                boxColor="info"
                boxBackground="colored"
              >
                <org-empty-indicator-icon name="search" color="info" />
              </org-empty-indicator>
            </div>
            <div>
              <span class="section-label">color: caution · border: border-emphasize</span>
              <org-empty-indicator
                header="Notifications paused"
                description="Resume notifications to see updates in real time."
                actionLabel="Resume notifications"
                boxColor="caution"
                boxBorder="border-emphasize"
                boxBackground="colored"
                (actionTriggered)="onAction('resume-notifications')"
              >
                <org-empty-indicator-icon name="notification" color="caution" />
              </org-empty-indicator>
            </div>
            <div>
              <span class="section-label">color: danger · border: border-thick</span>
              <org-empty-indicator
                header="Couldn't load data"
                description="We hit an issue fetching your projects. Check your connection and try again."
                actionLabel="Retry"
                boxColor="danger"
                boxBorder="border-thick"
                boxBackground="colored"
                (actionTriggered)="onAction('retry')"
              >
                <org-empty-indicator-icon name="circle-alert" color="danger" />
              </org-empty-indicator>
            </div>
            <div>
              <span class="section-label">color: safe · border: borderless</span>
              <org-empty-indicator
                header="Inbox zero"
                description="Nice work. You're all caught up for the day."
                boxColor="safe"
                boxBorder="borderless"
                boxBackground="colored"
              >
                <org-empty-indicator-icon name="circle-check" color="safe" />
              </org-empty-indicator>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>boxColor</strong>: Forwarded to the inner Box; combine with semantic icon tints to reinforce meaning</li>
          <li><strong>boxBorder</strong>: bordered / borderless / border-thick / border-emphasize</li>
          <li><strong>boxBackground</strong>: colored tints the Box background, colorless leaves it transparent</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Box padding"
          description="The same content at the four boxPadding options. The internal stack rhythm subtly increases at lg so the layout reads as composed at any scale."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="grid-4">
            <div>
              <span class="section-label">padding · none</span>
              <org-empty-indicator
                header="No items"
                description="When you add items, they'll appear here."
                boxPadding="none"
              >
                <org-empty-indicator-icon name="package" />
              </org-empty-indicator>
            </div>
            <div>
              <span class="section-label">padding · sm</span>
              <org-empty-indicator
                header="No items"
                description="When you add items, they'll appear here."
                boxPadding="sm"
              >
                <org-empty-indicator-icon name="package" />
              </org-empty-indicator>
            </div>
            <div>
              <span class="section-label">padding · base</span>
              <org-empty-indicator
                header="No items"
                description="When you add items, they'll appear here."
              >
                <org-empty-indicator-icon name="package" />
              </org-empty-indicator>
            </div>
            <div>
              <span class="section-label">padding · lg</span>
              <org-empty-indicator
                header="No items"
                description="When you add items, they'll appear here."
                boxPadding="lg"
              >
                <org-empty-indicator-icon name="package" />
              </org-empty-indicator>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>none / sm / base</strong>: Default internal spacing rhythm</li>
          <li><strong>lg</strong>: Stack, icon, and action gaps shift up one notch so the layout still feels balanced at scale</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="In context · empty list"
          description="A common consumer: replace a List that has zero rows with an EmptyIndicator. The outer frame is an org-box with borderless + no padding so the empty indicator owns the whole panel."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="grid-2">
            <div>
              <span class="section-label">List · with rows</span>
              <div class="list-row">
                <org-list>
                  @for (item of listItems; track item.label) {
                    <org-list-item [label]="item.label">
                      <org-list-item-icon name="folder" />
                    </org-list-item>
                  }
                </org-list>
              </div>
            </div>
            <div>
              <span class="section-label">List · zero rows</span>
              <org-empty-indicator
                header="No projects yet"
                description="Create your first project to get started."
                actionLabel="Create project"
                boxBorder="borderless"
                boxPadding="lg"
                (actionTriggered)="onAction('create-project')"
              >
                <org-empty-indicator-icon name="folder" />
              </org-empty-indicator>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Empty list pattern</strong>: Swap the List for an EmptyIndicator when the data set is empty</li>
          <li><strong>Box knobs</strong>: borderless + lg padding lets the indicator own the panel without competing borders</li>
          <li><strong>Action</strong>: Wire the Add / Create call-to-action through the actionTriggered output</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class EmptyIndicatorShowcaseStory {
  protected readonly listItems = showcaseListItems;
  protected readonly iconColors = showcaseIconColors;

  protected onAction(source: string): void {
    console.log('showcase action triggered', source);
  }
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every empty-indicator axis — visual states, icon tints, box color × border, box padding, and an in-context empty list — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `<story-empty-indicator-showcase />`,
    moduleMetadata: {
      imports: [EmptyIndicatorShowcaseStory],
    },
  }),
};
