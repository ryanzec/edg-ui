import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { allBoxBorders, type BoxBorder } from '../box/box';
import { Button } from '../button/button';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Icon } from '../icon/icon';
import { allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  Card,
  cardColors,
  CARD_BOX_BACKGROUND_DEFAULT,
  CARD_BOX_BORDER_DEFAULT,
  CARD_COLOR_DEFAULT,
  CARD_CONTAINER_CLASS_DEFAULT,
  type CardColor,
} from './card';
import { CardContent } from './card-content';
import { CardFooter, allCardAlignments, CARD_FOOTER_ALIGNMENT_DEFAULT, type CardAlignment } from './card-footer';
import { CardHeader } from './card-header';
import { CardImage } from './card-image';

type LiveDemoColorChoice = 'none' | CardColor;

const allLiveDemoColorChoices: readonly LiveDemoColorChoice[] = ['none', ...allComponentColors] as const;

const liveDemoColorItems: ButtonToggleItem[] = allLiveDemoColorChoices.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoBorderItems: ButtonToggleItem[] = allBoxBorders.map((border) => ({
  label: border,
  value: border,
  buttonColor: 'primary',
}));

const liveDemoFooterAlignmentItems: ButtonToggleItem[] = allCardAlignments.map((alignment) => ({
  label: alignment,
  value: alignment,
  buttonColor: 'primary',
}));

const SAMPLE_IMAGE_TOP =
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80';
const SAMPLE_IMAGE_INSET =
  'https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=800&q=80';
const SAMPLE_IMAGE_BOTTOM =
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80';

const meta: Meta<Card> = {
  title: 'Core/Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Card Component

  A presentational content surface composed from sub-components: an optional header (titles + actions),
  an optional bleeding image, a content slot, and an optional footer button row. Built on top of Box —
  Card inherits all of Box's color, border, and background behavior. Card itself has no interactive
  states; consumers wrap it in an interactive element if a click target is needed.

  ### Composition
  - **Card**: Root surface. Forwards \`color\`, \`boxBorder\`, \`boxBackground\` to the underlying Box.
  - **CardHeader**: Title / subtitle / actions row. Auto-detects an actions-only mode when no title or
    subtitle is provided. Heading level (h1–h6) is configured via the \`headingLevel\` brain input.
  - **CardImage**: Optional image with a \`fill\` mode (forced 16:9, default) or a \`default\` mode that
    renders at the explicit width / height inputs. Bleeds to the card edges by default; pass
    \`[fullWidth]="false"\` to inset it inside the shared 12px gutter.
  - **CardContent**: Body slot. No layout opinion — children flow normally.
  - **CardFooter**: Button row with \`start\` / \`center\` / \`end\` alignment (default \`end\`).

  ### Padding model
  Each sub-region owns its own 12px padding. Adjacent text regions collapse the doubled gap
  automatically (header + content / content + footer / header + footer). \`CardImage\` does not
  participate in the collapse — it has zero vertical padding to begin with.

  ### Usage
  \`\`\`html
  <org-card color="primary" boxBorder="border-emphasize">
    <org-card-header title="Notifications" subtitle="Choose how you'd like to be reached.">
      <org-button actions variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
    </org-card-header>
    <org-card-content>Body text…</org-card-content>
    <org-card-footer>
      <org-button color="neutral" variant="ghost" label="Discard" />
      <org-button color="primary" label="Save changes" />
    </org-card-footer>
  </org-card>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Card>;

export const Default: Story = {
  args: {
    color: CARD_COLOR_DEFAULT,
    boxBorder: CARD_BOX_BORDER_DEFAULT,
    boxBackground: CARD_BOX_BACKGROUND_DEFAULT,
    containerClass: CARD_CONTAINER_CLASS_DEFAULT,
  },
  argTypes: {
    color: {
      control: 'select',
      options: [null, ...cardColors],
      description: 'The semantic color forwarded to the underlying Box',
    },
    boxBorder: {
      control: 'select',
      options: allBoxBorders,
      description: 'The border / visual style variant forwarded to the underlying Box',
    },
    boxBackground: {
      control: 'select',
      options: ['colored', 'colorless'],
      description: 'Whether the color tints the card background (colored) or leaves it default (colorless)',
    },
    containerClass: {
      control: 'text',
      description: 'CSS class(es) applied to the outermost container element',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default card with header, content, and footer. Use the controls to drive the card-level inputs (projected sub-components are fixed in this story).',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <org-card [color]="color" [boxBorder]="boxBorder" [boxBackground]="boxBackground" [containerClass]="containerClass">
          <org-card-header title="Project settings" subtitle="Configuration shared across every environment." />
          <org-card-content>
            Cards group related content into a discrete visual block. Drop any composition inside — settings rows,
            KPI tiles, prose, or sub-components from elsewhere in the system.
          </org-card-content>
          <org-card-footer>
            <org-button color="neutral" variant="ghost" label="Cancel" />
            <org-button color="primary" label="Save" />
          </org-card-footer>
        </org-card>
      </div>
    `,
    moduleMetadata: {
      imports: [Card, CardHeader, CardContent, CardFooter, Button],
    },
  }),
};

@Component({
  selector: 'story-card-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardImage,
    Button,
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
        min-height: 12rem; /* 192px */
      }
      .card-shell {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs to see every visual combination of the wrapper. Sub-component slots can be turned on or off independently."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Border">
            <org-button-toggle [items]="borderItems" formControlName="border" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="UseBackgroundColor">
            <org-checkbox-toggle name="live-demo-use-bg" value="use-bg" formControlName="useBackgroundColor">
              {{ liveDemoForm.controls.useBackgroundColor.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Header">
            <org-checkbox-toggle name="live-demo-header" value="header" formControlName="header">
              {{ liveDemoForm.controls.header.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Subtitle">
            <org-checkbox-toggle name="live-demo-subtitle" value="subtitle" formControlName="subtitle">
              {{ liveDemoForm.controls.subtitle.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Actions">
            <org-checkbox-toggle name="live-demo-actions" value="actions" formControlName="actions">
              {{ liveDemoForm.controls.actions.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Image">
            <org-checkbox-toggle name="live-demo-image" value="image" formControlName="image">
              {{ liveDemoForm.controls.image.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Content">
            <org-checkbox-toggle name="live-demo-content" value="content" formControlName="content">
              {{ liveDemoForm.controls.content.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Footer">
            <org-checkbox-toggle name="live-demo-footer" value="footer" formControlName="footer">
              {{ liveDemoForm.controls.footer.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Footer align">
            <org-button-toggle [items]="footerAlignmentItems" formControlName="footerAlignment" buttonSize="sm" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="card-shell">
              <org-card
                [color]="liveDemoForm.controls.color.value === 'none' ? null : liveDemoForm.controls.color.value"
                [boxBorder]="liveDemoForm.controls.border.value"
                [boxBackground]="liveDemoForm.controls.useBackgroundColor.value ? 'colored' : 'colorless'"
              >
                @if (liveDemoForm.controls.header.value || liveDemoForm.controls.actions.value) {
                  <org-card-header
                    [title]="liveDemoForm.controls.header.value ? 'Project settings' : null"
                    [subtitle]="
                      liveDemoForm.controls.header.value && liveDemoForm.controls.subtitle.value
                        ? 'Configuration shared across every environment.'
                        : null
                    "
                  >
                    @if (liveDemoForm.controls.actions.value) {
                      <org-button
                        actions
                        variant="text"
                        color="neutral"
                        label="More options"
                        preIcon="ellipsis"
                        [iconOnly]="true"
                        ariaLabel="More options"
                      />
                    }
                  </org-card-header>
                }
                @if (liveDemoForm.controls.image.value) {
                  <org-card-image src="${SAMPLE_IMAGE_TOP}" alt="Workspace photo" />
                }
                @if (liveDemoForm.controls.content.value) {
                  <org-card-content>
                    Cards group related content into a discrete visual block. Drop any composition inside —
                    settings rows, KPI tiles, prose, or sub-components from elsewhere in the system.
                  </org-card-content>
                }
                @if (liveDemoForm.controls.footer.value) {
                  <org-card-footer [alignment]="liveDemoForm.controls.footerAlignment.value">
                    <org-button color="neutral" variant="ghost" label="Cancel" />
                    <org-button color="primary" label="Save" />
                  </org-card-footer>
                }
              </org-card>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class CardLiveDemoStory {
  protected readonly colorItems = liveDemoColorItems;
  protected readonly borderItems = liveDemoBorderItems;
  protected readonly footerAlignmentItems = liveDemoFooterAlignmentItems;

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<LiveDemoColorChoice>('none', { nonNullable: true }),
    border: new FormControl<BoxBorder>(CARD_BOX_BORDER_DEFAULT, { nonNullable: true }),
    useBackgroundColor: new FormControl<boolean>(true, { nonNullable: true }),
    header: new FormControl<boolean>(true, { nonNullable: true }),
    subtitle: new FormControl<boolean>(true, { nonNullable: true }),
    actions: new FormControl<boolean>(true, { nonNullable: true }),
    image: new FormControl<boolean>(false, { nonNullable: true }),
    content: new FormControl<boolean>(true, { nonNullable: true }),
    footer: new FormControl<boolean>(true, { nonNullable: true }),
    footerAlignment: new FormControl<CardAlignment>(CARD_FOOTER_ALIGNMENT_DEFAULT, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Toggle every sub-component on/off, swap color and border treatments, flip the background tint, and drive the footer alignment to see every visual combination.',
      },
    },
  },
  render: () => ({
    template: `<story-card-live-demo />`,
    moduleMetadata: {
      imports: [CardLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every card axis — color × border matrix, CardHeader visual states, CardFooter alignment, CardImage variants, and realistic compositions — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Color × border matrix"
            description="The same Card composition (header + content) across the eight semantic colors and four border treatments. useBackgroundColor is true here — the live demo above lets you flip it off so only the border carries color."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-[8rem_repeat(4,1fr)] gap-3 items-center">
              <div></div>
              <div class="text-xs uppercase text-fg-muted text-center">bordered</div>
              <div class="text-xs uppercase text-fg-muted text-center">border-thick</div>
              <div class="text-xs uppercase text-fg-muted text-center">border-emphasize</div>
              <div class="text-xs uppercase text-fg-muted text-center">borderless</div>

              <div class="text-xs text-fg-muted">Primary</div>
              <org-card color="primary" boxBorder="bordered">
                <org-card-header title="Primary" subtitle="bordered" />
              </org-card>
              <org-card color="primary" boxBorder="border-thick">
                <org-card-header title="Primary" subtitle="border-thick" />
              </org-card>
              <org-card color="primary" boxBorder="border-emphasize">
                <org-card-header title="Primary" subtitle="border-emphasize" />
              </org-card>
              <org-card color="primary" boxBorder="borderless">
                <org-card-header title="Primary" subtitle="borderless" />
              </org-card>

              <div class="text-xs text-fg-muted">Secondary</div>
              <org-card color="secondary" boxBorder="bordered">
                <org-card-header title="Secondary" subtitle="bordered" />
              </org-card>
              <org-card color="secondary" boxBorder="border-thick">
                <org-card-header title="Secondary" subtitle="border-thick" />
              </org-card>
              <org-card color="secondary" boxBorder="border-emphasize">
                <org-card-header title="Secondary" subtitle="border-emphasize" />
              </org-card>
              <org-card color="secondary" boxBorder="borderless">
                <org-card-header title="Secondary" subtitle="borderless" />
              </org-card>

              <div class="text-xs text-fg-muted">Neutral</div>
              <org-card color="neutral" boxBorder="bordered">
                <org-card-header title="Neutral" subtitle="bordered" />
              </org-card>
              <org-card color="neutral" boxBorder="border-thick">
                <org-card-header title="Neutral" subtitle="border-thick" />
              </org-card>
              <org-card color="neutral" boxBorder="border-emphasize">
                <org-card-header title="Neutral" subtitle="border-emphasize" />
              </org-card>
              <org-card color="neutral" boxBorder="borderless">
                <org-card-header title="Neutral" subtitle="borderless" />
              </org-card>

              <div class="text-xs text-fg-muted">Safe</div>
              <org-card color="safe" boxBorder="bordered">
                <org-card-header title="Safe" subtitle="bordered" />
              </org-card>
              <org-card color="safe" boxBorder="border-thick">
                <org-card-header title="Safe" subtitle="border-thick" />
              </org-card>
              <org-card color="safe" boxBorder="border-emphasize">
                <org-card-header title="Safe" subtitle="border-emphasize" />
              </org-card>
              <org-card color="safe" boxBorder="borderless">
                <org-card-header title="Safe" subtitle="borderless" />
              </org-card>

              <div class="text-xs text-fg-muted">Info</div>
              <org-card color="info" boxBorder="bordered">
                <org-card-header title="Info" subtitle="bordered" />
              </org-card>
              <org-card color="info" boxBorder="border-thick">
                <org-card-header title="Info" subtitle="border-thick" />
              </org-card>
              <org-card color="info" boxBorder="border-emphasize">
                <org-card-header title="Info" subtitle="border-emphasize" />
              </org-card>
              <org-card color="info" boxBorder="borderless">
                <org-card-header title="Info" subtitle="borderless" />
              </org-card>

              <div class="text-xs text-fg-muted">Caution</div>
              <org-card color="caution" boxBorder="bordered">
                <org-card-header title="Caution" subtitle="bordered" />
              </org-card>
              <org-card color="caution" boxBorder="border-thick">
                <org-card-header title="Caution" subtitle="border-thick" />
              </org-card>
              <org-card color="caution" boxBorder="border-emphasize">
                <org-card-header title="Caution" subtitle="border-emphasize" />
              </org-card>
              <org-card color="caution" boxBorder="borderless">
                <org-card-header title="Caution" subtitle="borderless" />
              </org-card>

              <div class="text-xs text-fg-muted">Warning</div>
              <org-card color="warning" boxBorder="bordered">
                <org-card-header title="Warning" subtitle="bordered" />
              </org-card>
              <org-card color="warning" boxBorder="border-thick">
                <org-card-header title="Warning" subtitle="border-thick" />
              </org-card>
              <org-card color="warning" boxBorder="border-emphasize">
                <org-card-header title="Warning" subtitle="border-emphasize" />
              </org-card>
              <org-card color="warning" boxBorder="borderless">
                <org-card-header title="Warning" subtitle="borderless" />
              </org-card>

              <div class="text-xs text-fg-muted">Danger</div>
              <org-card color="danger" boxBorder="bordered">
                <org-card-header title="Danger" subtitle="bordered" />
              </org-card>
              <org-card color="danger" boxBorder="border-thick">
                <org-card-header title="Danger" subtitle="border-thick" />
              </org-card>
              <org-card color="danger" boxBorder="border-emphasize">
                <org-card-header title="Danger" subtitle="border-emphasize" />
              </org-card>
              <org-card color="danger" boxBorder="borderless">
                <org-card-header title="Danger" subtitle="borderless" />
              </org-card>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Color</strong>: Tints the border and (when useBackgroundColor is true) the soft background fill</li>
            <li><strong>bordered</strong>: 1px border using the color's border ramp (default)</li>
            <li><strong>border-thick</strong>: 2px border for emphasized cards</li>
            <li><strong>border-emphasize</strong>: 1px border with a heavier left rail (still tinted by the color input)</li>
            <li><strong>borderless</strong>: No border — only the soft background fill (when enabled) carries color</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="CardHeader · visual states"
            description="Every spec'd combination of title, subtitle, and the actions slot. Title uses font-size-lg / semibold; subtitle is font-size-base / muted; subtitle stacks below the title with actions to the right."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-[10rem_1fr] gap-3 items-center">
              <div class="text-xs uppercase text-fg-muted">Title only</div>
              <org-card>
                <org-card-header title="Project settings" />
              </org-card>

              <div class="text-xs uppercase text-fg-muted">Title + subtitle</div>
              <org-card>
                <org-card-header title="Project settings" subtitle="Configuration shared across every environment." />
              </org-card>

              <div class="text-xs uppercase text-fg-muted">Title + actions</div>
              <org-card>
                <org-card-header title="Project settings">
                  <org-button actions variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
                </org-card-header>
              </org-card>

              <div class="text-xs uppercase text-fg-muted">Title + subtitle + actions</div>
              <org-card>
                <org-card-header title="Project settings" subtitle="Configuration shared across every environment.">
                  <org-button actions variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
                </org-card-header>
              </org-card>

              <div class="text-xs uppercase text-fg-muted">Actions only</div>
              <org-card>
                <org-card-header>
                  <div actions class="flex gap-1">
                    <org-button variant="ghost" color="neutral" size="sm" label="Filter" />
                    <org-button color="primary" size="sm" label="New" />
                  </div>
                </org-card-header>
              </org-card>

              <div class="text-xs uppercase text-fg-muted">Empty</div>
              <org-card>
                <org-card-header />
              </org-card>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Title only</strong>: Single-line heading with no actions</li>
            <li><strong>Title + subtitle</strong>: Subtitle stacks underneath the title in the same column</li>
            <li><strong>Title + actions</strong>: Title hugs left, actions hug right via grid <code>1fr auto</code></li>
            <li><strong>Title + subtitle + actions</strong>: Titles column stays left-aligned even when actions are present</li>
            <li><strong>Actions only</strong>: Header auto-detects actions-only mode (no title / no subtitle) and right-aligns the actions in a single full-width column</li>
            <li><strong>Empty</strong>: Renders no content; useful when the surrounding card composition needs no header semantics</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="CardFooter · alignment"
            description="Footer renders a button row. Three alignment values control horizontal placement."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <org-card>
                <org-card-content>Aligned <code>start</code> (left).</org-card-content>
                <org-card-footer alignment="start">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-card-footer>
              </org-card>
              <org-card>
                <org-card-content>Aligned <code>center</code>.</org-card-content>
                <org-card-footer alignment="center">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-card-footer>
              </org-card>
              <org-card>
                <org-card-content>Aligned <code>end</code> (right) — the most common pattern.</org-card-content>
                <org-card-footer alignment="end">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-card-footer>
              </org-card>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>start</strong>: Buttons hug the left edge</li>
            <li><strong>center</strong>: Buttons centered horizontally</li>
            <li><strong>end</strong>: Buttons hug the right edge (default)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="CardImage · variants"
            description="Image bleeds to the card edges and inherits the rounded outer corners only when it sits at the top or bottom. Constrained-width and bottom-position modes are also shown."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-3 gap-3 items-start">
              <org-card>
                <org-card-image src="${SAMPLE_IMAGE_TOP}" alt="Workspace photo" />
                <org-card-header title="Full-width · top" subtitle="Image rounds the top corners only." />
              </org-card>

              <org-card>
                <org-card-header title="Constrained" subtitle="Inset image with the card's gutter." />
                <org-card-image src="${SAMPLE_IMAGE_INSET}" alt="Workspace photo" [fullWidth]="false" />
                <org-card-content>Body content underneath an inset image.</org-card-content>
              </org-card>

              <org-card>
                <org-card-content>Image at the bottom rounds the bottom corners only.</org-card-content>
                <org-card-image src="${SAMPLE_IMAGE_BOTTOM}" alt="Workspace photo" />
              </org-card>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Full-width · top</strong>: Image bleeds edge to edge and inherits the card's outer rounding at the top</li>
            <li><strong>Constrained</strong>: Image insets within the 12px gutter and gets its own 6px inner radius</li>
            <li><strong>Full-width · bottom</strong>: Image bleeds edge to edge and inherits the card's outer rounding at the bottom</li>
            <li><strong>Fill mode</strong>: Default — forces a 16:9 aspect ratio so cards in a grid line up consistently</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Realistic compositions"
            description="Card doesn't enforce a specific shape — these examples just mix the sub-components."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-3 items-start">
              <org-card>
                <org-card-header title="Notifications" subtitle="Choose how you'd like to be reached.">
                  <org-button actions variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
                </org-card-header>
                <org-card-content>
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <div class="font-weight-medium">Email digests</div>
                        <div class="text-xs text-fg-muted">Sent every Monday at 09:00.</div>
                      </div>
                      <org-button variant="ghost" color="neutral" size="sm" label="Configure" />
                    </div>
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <div class="font-weight-medium">Mention alerts</div>
                        <div class="text-xs text-fg-muted">Push notification when someone @mentions you.</div>
                      </div>
                      <org-button variant="ghost" color="neutral" size="sm" label="Off" />
                    </div>
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <div class="font-weight-medium">Build failures</div>
                        <div class="text-xs text-fg-muted">Always emailed to project owners.</div>
                      </div>
                      <org-button variant="ghost" color="neutral" size="sm" label="On" />
                    </div>
                  </div>
                </org-card-content>
                <org-card-footer>
                  <org-button color="neutral" variant="ghost" label="Discard" />
                  <org-button color="primary" label="Save changes" />
                </org-card-footer>
              </org-card>

              <org-card>
                <org-card-header title="Active users" subtitle="Last 30 days">
                  <org-button actions variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
                </org-card-header>
                <org-card-content>
                  <div class="flex items-baseline gap-2">
                    <div class="text-2xl font-weight-semibold">12,438</div>
                    <div class="text-sm" style="color: var(--color-safe-border-strong);">+8.4%</div>
                  </div>
                </org-card-content>
              </org-card>

              <org-card>
                <org-card-image src="${SAMPLE_IMAGE_TOP}" alt="Cover" />
                <org-card-header title="A field guide to design tokens" subtitle="14 min read · Published Mar 4" />
                <org-card-content>
                  Practical patterns for naming, scaling, and theming tokens that survive a real product over time.
                </org-card-content>
                <org-card-footer alignment="start">
                  <org-button variant="text" color="primary" label="Read more" />
                </org-card-footer>
              </org-card>

              <org-card color="caution" boxBorder="border-emphasize">
                <org-card-header title="Trial expiring soon" subtitle="4 days left on your team trial." />
                <org-card-footer>
                  <org-button color="caution" label="Add payment" />
                </org-card-footer>
              </org-card>

              <org-card containerClass="col-span-2">
                <org-card-header>
                  <div actions class="flex gap-1">
                    <org-button variant="ghost" color="neutral" size="sm" label="All" />
                    <org-button variant="ghost" color="neutral" size="sm" label="Mine" />
                    <org-button variant="ghost" color="neutral" size="sm" label="Archived" />
                    <org-button color="primary" size="sm" preIcon="plus" label="New project" />
                  </div>
                </org-card-header>
                <org-card-content>
                  Cards do not enforce a specific composition — an actions-only header followed by content is also valid.
                </org-card-content>
              </org-card>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Actions slot</strong>: Project content with the <code>actions</code> attribute selector to render it in the right cell of the header grid</li>
            <li><strong>Header + content + footer</strong>: Padding collapses between adjacent regions so the visual rhythm stays at one 12px step rather than two</li>
            <li><strong>Image at top</strong>: Inherits the card's outer 8px rounding at the top corners only</li>
            <li><strong>Color + border-emphasize</strong>: The 7px left rail and the soft background fill both pick up the color input</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Card,
        CardHeader,
        CardImage,
        CardContent,
        CardFooter,
        Button,
        Icon,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
