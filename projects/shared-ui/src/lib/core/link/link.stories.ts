import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { Link } from './link';
import { Icon } from '../icon/icon';
import { Input } from '../input/input';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { allLinkTargets, type LinkTarget } from '../link/link-brain';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

const liveDemoTargetItems: ButtonToggleItem[] = [
  { label: 'Same tab', value: '_self', buttonColor: 'primary' },
  { label: 'New tab', value: '_blank', buttonColor: 'primary' },
];

const meta: Meta<Link> = {
  title: 'Core/Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Link Component

  An inline hyperlink primitive that inherits font-size and font-weight from the surrounding text.

  ### Features
  - Renders as a real \`<a>\` (or a \`<span>\` when disabled, since native \`<a>\` has no disabled state)
  - Inherits font-size and font-weight from the surrounding text — no size variants
  - Auto-injects a post affordance icon for \`target="_blank"\` (external-link) and \`download\` (download)
  - Suppress the auto-affordance via \`affordance="false"\` or by projecting your own \`#post\` template
  - Optional \`#pre\` and \`#post\` template projection slots for inline icons
  - Auto-applies \`rel="noopener noreferrer"\` when \`target="_blank"\` and no consumer rel is provided
  - Action-link mode when \`href\` is omitted: emits \`clicked\`, focusable, keyboard-activated via Enter or Space
  - Underline appears on hover and keyboard focus only

  ### Usage Examples
  \`\`\`html
  <!-- standard link -->
  <org-link href="/settings">Settings</org-link>

  <!-- new tab with auto rel + auto external-link icon -->
  <org-link href="https://example.com" target="_blank">External docs</org-link>

  <!-- download with auto download icon -->
  <org-link href="/file.pdf" download>Download PDF</org-link>

  <!-- suppress the auto affordance icon -->
  <org-link href="https://example.com" target="_blank" [affordance]="false">Open in new tab</org-link>

  <!-- pre icon via the #pre slot -->
  <org-link href="/help">
    <ng-template #pre><org-icon name="book-open" /></ng-template>
    Get help
  </org-link>

  <!-- action link, emits clicked -->
  <org-link (clicked)="handleAction()">Run action</org-link>

  <!-- disabled, renders as a span -->
  <org-link href="https://example.com" [disabled]="true">Locked</org-link>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Link>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    target: '_self',
    disabled: false,
    affordance: true,
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'the url the link navigates to; leave blank for action-link mode',
    },
    target: {
      control: 'select',
      options: allLinkTargets,
      description: 'the html target attribute',
    },
    disabled: {
      control: 'boolean',
      description: 'when true the link is non-interactive and renders as a span with disabled styling',
    },
    affordance: {
      control: 'boolean',
      description: 'when true, an external-link / download icon is auto-injected when applicable',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default link with full controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<org-link [href]="href" [target]="target" [disabled]="disabled" [affordance]="affordance">Example link</org-link>`,
    moduleMetadata: {
      imports: [Link],
    },
  }),
};

@Component({
  selector: 'story-link-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Link,
    Input,
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
        align-items: center;
        justify-content: center;
        min-height: 6rem; /* 96px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="All links below are real and interactive — hover, focus, press, or tab through them to see every state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Link text">
            <org-input name="live-demo-text" formControlName="text" placeholder="Read the documentation" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Target">
            <org-button-toggle [items]="targetItems" formControlName="target" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Download">
            <org-checkbox-toggle name="live-demo-download" value="download" formControlName="download">
              {{ liveDemoForm.controls.download.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Affordance">
            <org-checkbox-toggle name="live-demo-affordance" value="affordance" formControlName="affordance">
              {{ liveDemoForm.controls.affordance.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-link
              href="https://example.com"
              [target]="liveDemoForm.controls.target.value"
              [download]="liveDemoForm.controls.download.value ? 'example.pdf' : null"
              [disabled]="liveDemoForm.controls.disabled.value"
              [affordance]="liveDemoForm.controls.affordance.value"
            >
              {{ liveDemoForm.controls.text.value || 'Read the documentation' }}
            </org-link>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class LinkLiveDemoStory {
  protected readonly targetItems = liveDemoTargetItems;

  protected readonly liveDemoForm = new FormGroup({
    text: new FormControl<string>('Read the documentation', { nonNullable: true }),
    target: new FormControl<LinkTarget>('_self', { nonNullable: true }),
    download: new FormControl<boolean>(false, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    affordance: new FormControl<boolean>(true, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the link (text, target, download, disabled, affordance) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-link-live-demo />`,
    moduleMetadata: {
      imports: [LinkLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every link axis — interactive states, affordance icons, size inheritance, and in-context placements — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Interactive states" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 7rem;">Resting</span>
              <org-link href="https://example.com" [affordance]="false">Open the documentation</org-link>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 7rem;">Hover</span>
              <span>(move mouse over) <org-link href="https://example.com" [affordance]="false">Open the documentation</org-link></span>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 7rem;">Pressed</span>
              <span>(click and hold) <org-link href="https://example.com" [affordance]="false">Open the documentation</org-link></span>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 7rem;">Focus-visible</span>
              <span>(tab to focus) <org-link href="https://example.com" [affordance]="false">Open the documentation</org-link></span>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 7rem;">Disabled</span>
              <org-link href="https://example.com" [disabled]="true" [affordance]="false">Open the documentation</org-link>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 7rem;">Visited</span>
              <span><org-link href="https://example.com" [affordance]="false">Open the documentation</org-link> &mdash; treated the same as resting; product UI doesn't carry a permanent visited tint.</span>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Resting</strong>: No underline; the link is identifiable by color alone</li>
            <li><strong>Hover</strong>: Underline appears and color steps to the hover token</li>
            <li><strong>Pressed</strong>: Color steps to the active token</li>
            <li><strong>Focus-visible</strong>: Underline appears via keyboard focus, no extra outline ring</li>
            <li><strong>Disabled</strong>: Renders as a span with the disabled color, not focusable, no pointer events</li>
            <li><strong>Visited</strong>: Resets to the resting color so revisited routes don't read as stale</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Affordance icons" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 11rem;">Internal</span>
              <org-link href="/components">Back to component index</org-link>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 11rem;">External</span>
              <org-link href="https://example.com" target="_blank">Read the full RFC on example.com</org-link>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 11rem;">Download</span>
              <org-link href="/q4-financial-report.pdf" download>Download Q4 financial report</org-link>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 11rem;">External + download</span>
              <org-link href="https://example.com/data.csv" target="_blank" download>Save the source CSV</org-link>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 11rem;">Pre icon</span>
              <org-link href="/spec">
                <ng-template #pre><org-icon class="link-icon" name="book-open" data-position="pre" /></ng-template>
                Read the spec
              </org-link>
            </div>
            <div class="flex gap-4 items-baseline">
              <span class="text-muted text-xs uppercase letter-spacing-wide" style="min-width: 11rem;">Suppress affordance</span>
              <org-link href="https://example.com" target="_blank" [affordance]="false">Open in new tab — no icon</org-link>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Internal</strong>: No icon — the link is a same-origin navigation</li>
            <li><strong>External</strong>: <code>target="_blank"</code> auto-injects the external-link icon</li>
            <li><strong>Download</strong>: <code>[download]</code> auto-injects the download icon</li>
            <li><strong>External + download</strong>: Download wins because it's the more specific action</li>
            <li><strong>Pre icon</strong>: A <code>#pre</code> template renders an icon before the label</li>
            <li><strong>Suppress affordance</strong>: <code>[affordance]="false"</code> opts out of the auto-injected post icon</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Size inheritance" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-baseline text-xs">
              <span class="text-muted uppercase letter-spacing-wide" style="min-width: 3rem;">XS</span>
              <span>Read the changelog &middot; <org-link href="https://example.com/changelog" target="_blank">jump to v2.4 release notes</org-link></span>
            </div>
            <div class="flex gap-4 items-baseline text-sm">
              <span class="text-muted uppercase letter-spacing-wide text-xs" style="min-width: 3rem;">SM</span>
              <span>By signing up you agree to our <org-link href="/terms">Terms of Service</org-link> and <org-link href="/privacy">Privacy Policy</org-link>.</span>
            </div>
            <div class="flex gap-4 items-baseline text-base">
              <span class="text-muted uppercase letter-spacing-wide text-xs" style="min-width: 3rem;">Base</span>
              <span>Need help with the migration? <org-link href="/contact">Talk to the platform team</org-link>.</span>
            </div>
            <div class="flex gap-4 items-baseline text-lg">
              <span class="text-muted uppercase letter-spacing-wide text-xs" style="min-width: 3rem;">LG</span>
              <span>Try it now — <org-link href="/sandbox">spin up a sandbox</org-link>.</span>
            </div>
            <div class="flex gap-4 items-baseline text-xl">
              <span class="text-muted uppercase letter-spacing-wide text-xs" style="min-width: 3rem;">XL</span>
              <org-link href="https://example.com/announcement" target="_blank">Read the announcement</org-link>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Inherits font</strong>: The link picks up the surrounding text's font-size and font-weight via <code>font: inherit</code></li>
            <li><strong>No size variants</strong>: There is no size input — control sizing through the surrounding text</li>
            <li><strong>Affordance icons scale</strong>: Post icons use 1em sizing so they stay visually proportional from caption text up through page-title-adjacent copy</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="In context" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4" style="max-width: 28rem;">
              <p>
                The application frame ships with a minimal token set —
                <org-link href="/tokens">all surface, foreground, border, and accent values</org-link>
                — that every component reads from. If you want to add a new color, please
                <org-link href="/rfc/new">file an RFC</org-link>
                before extending the scale.
              </p>

              <p>
                The full motion guidelines live on
                <org-link href="https://example.com/design" target="_blank">the design site</org-link>,
                and the latest exported
                <org-link href="https://example.com/motion-tokens.json" target="_blank" download>motion tokens JSON</org-link>
                is available for the Figma plugin.
              </p>

              <div class="flex flex-col gap-1 p-3 border-default-color rounded-base">
                <span class="text-muted text-xs uppercase letter-spacing-wide">Resources</span>
                <div class="flex gap-3 flex-wrap">
                  <org-link href="/docs">Documentation</org-link>
                  <org-link href="/components">Component library</org-link>
                  <org-link href="https://status.example.com" target="_blank">Status page</org-link>
                  <org-link href="/brand-kit.zip" download>Brand kit</org-link>
                </div>
                <span class="text-faint text-xs">Internal wiki</span>
              </div>

              <p>
                Last synced 4 minutes ago.
                <org-link>Refresh now</org-link>
              </p>

              <p>
                A long link can wrap across multiple lines — for example,
                <org-link href="https://example.com/very/long/destination/that/does/not/fit/on/a/single/line" target="_blank">this is a very long external destination that doesn't fit on a single line at this width</org-link>
                — and the underline tracks each line cleanly because it lives in the text-decoration channel rather than as a bottom border.
              </p>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Inline in paragraphs</strong>: Links flow with the surrounding text and wrap correctly across lines</li>
            <li><strong>Underline on wrap</strong>: The underline tracks each wrapped line because it uses <code>text-decoration-line</code>, not a bottom border</li>
            <li><strong>Footer / resource strip</strong>: Multiple links sit comfortably side-by-side with normal whitespace separation</li>
            <li><strong>Action link in flow</strong>: An <code>href</code>-less link (Refresh now) renders inline with role="button" and Enter / Space activation</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Link,
        Icon,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-link-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Action Link"
        description="A link without href that emits clicked when activated. Renders with role='button' and tabindex='0'."
      />
      <org-design-system-demo-canvas slot="canvas">
        <org-link (clicked)="onLinkClicked()">Run action</org-link>
        <span data-testid="click-count">Click count: {{ clickCount }}</span>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LinkActionStory {
  protected clickCount = 0;

  protected onLinkClicked(): void {
    this.clickCount += 1;
    console.log('action link clicked');
  }
}

export const ActionLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the action-link mode where href is omitted and the clicked output emits instead. The link is focusable, activates on Enter / Space, and increments a runtime counter on each fire.',
      },
    },
  },
  render: () => ({
    template: `<story-link-action />`,
    moduleMetadata: {
      imports: [LinkActionStory],
    },
  }),
};
