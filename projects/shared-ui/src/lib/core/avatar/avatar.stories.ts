import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Avatar, allAvatarShapeVariants, allAvatarSizes, AvatarShapeVariant, AvatarSize } from './avatar';
import { AvatarStack } from './avatar-stack';

type LiveDemoImageMode = 'none' | 'gravatar' | 'custom';

const liveDemoSizeItems: ButtonToggleItem[] = allAvatarSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoShapeItems: ButtonToggleItem[] = allAvatarShapeVariants.map((shape) => ({
  label: shape,
  value: shape,
  buttonColor: 'primary',
}));

const liveDemoImageItems: ButtonToggleItem[] = (['none', 'gravatar', 'custom'] as const).map((value) => ({
  label: value,
  value,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-avatar-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Avatar,
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
      .text-input {
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--color-border-default);
        border-radius: 0.25rem;
        font: inherit;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Edit the label, toggle the image, sub-label, shape, clickable, and status pip — every visual axis updates against a single live avatar."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Label">
            <input class="text-input" type="text" formControlName="label" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Sub-label">
            <input class="text-input" type="text" formControlName="subLabel" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Shape">
            <org-button-toggle [items]="shapeItems" formControlName="shape" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Image">
            <org-button-toggle [items]="imageItems" formControlName="image" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Show label">
            <org-checkbox-toggle name="live-demo-show-label" value="show-label" formControlName="showLabel">
              {{ liveDemoForm.controls.showLabel.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Show sub-label">
            <org-checkbox-toggle name="live-demo-show-sub" value="show-sub" formControlName="showSubLabel">
              {{ liveDemoForm.controls.showSubLabel.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Clickable">
            <org-checkbox-toggle name="live-demo-clickable" value="clickable" formControlName="clickable">
              {{ liveDemoForm.controls.clickable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Status pip">
            <org-checkbox-toggle name="live-demo-status" value="status" formControlName="statusPip">
              {{ liveDemoForm.controls.statusPip.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Overflow">
            <org-checkbox-toggle name="live-demo-overflow" value="overflow" formControlName="isOverflow">
              {{ liveDemoForm.controls.isOverflow.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Count">
            <input class="text-input" type="number" min="0" formControlName="count" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (liveDemoForm.controls.clickable.value) {
              <org-avatar
                [label]="liveDemoForm.controls.label.value"
                [size]="liveDemoForm.controls.size.value"
                [shape]="liveDemoForm.controls.shape.value"
                [disabled]="liveDemoForm.controls.disabled.value"
                [hasIndicator]="liveDemoForm.controls.statusPip.value"
                indicatorColor="safe"
                [showLabel]="liveDemoForm.controls.showLabel.value"
                [subLabel]="resolvedSubLabel()"
                [imgSrc]="resolvedImgSrc()"
                [imgEmail]="resolvedImgEmail()"
                [isOverflow]="liveDemoForm.controls.isOverflow.value"
                [count]="liveDemoForm.controls.count.value"
                (clicked)="onClicked()"
              />
            } @else {
              <org-avatar
                [label]="liveDemoForm.controls.label.value"
                [size]="liveDemoForm.controls.size.value"
                [shape]="liveDemoForm.controls.shape.value"
                [disabled]="liveDemoForm.controls.disabled.value"
                [hasIndicator]="liveDemoForm.controls.statusPip.value"
                indicatorColor="safe"
                [showLabel]="liveDemoForm.controls.showLabel.value"
                [subLabel]="resolvedSubLabel()"
                [imgSrc]="resolvedImgSrc()"
                [imgEmail]="resolvedImgEmail()"
                [isOverflow]="liveDemoForm.controls.isOverflow.value"
                [count]="liveDemoForm.controls.count.value"
              />
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class AvatarLiveDemoStory {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly shapeItems = liveDemoShapeItems;
  protected readonly imageItems = liveDemoImageItems;

  protected readonly liveDemoForm = new FormGroup({
    label: new FormControl<string>('Sarah Chen', { nonNullable: true }),
    subLabel: new FormControl<string>('sarah@org.dev', { nonNullable: true }),
    size: new FormControl<AvatarSize>('base', { nonNullable: true }),
    shape: new FormControl<AvatarShapeVariant>('circle', { nonNullable: true }),
    image: new FormControl<LiveDemoImageMode>('none', { nonNullable: true }),
    showLabel: new FormControl<boolean>(true, { nonNullable: true }),
    showSubLabel: new FormControl<boolean>(false, { nonNullable: true }),
    clickable: new FormControl<boolean>(false, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    statusPip: new FormControl<boolean>(false, { nonNullable: true }),
    isOverflow: new FormControl<boolean>(false, { nonNullable: true }),
    count: new FormControl<number>(5, { nonNullable: true }),
  });

  protected resolvedSubLabel(): string | null {
    return this.liveDemoForm.controls.showSubLabel.value ? this.liveDemoForm.controls.subLabel.value : null;
  }

  protected resolvedImgSrc(): string | null {
    if (this.liveDemoForm.controls.image.value !== 'custom') {
      return null;
    }

    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.liveDemoForm.controls.label.value}`;
  }

  protected resolvedImgEmail(): string | null {
    return this.liveDemoForm.controls.image.value === 'gravatar' ? 'test1@example.com' : null;
  }

  protected onClicked(): void {
    console.log('avatar clicked');
  }
}

const meta: Meta<Avatar> = {
  title: 'Core/Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Avatar Component

  A self-contained representation of a user or entity. The root sets size, shape, label, optional adjacent label, and optional image overlay — no projected sub-components.

  ### Inputs
  - **label** — display name; drives initials, image alt fallback, and the clickable button aria-label
  - **size** — sm / base / lg
  - **shape** — circle (people) / square (organisations / teams / projects)
  - **showLabel** — when true, renders the adjacent name (and optional sub-label) block
  - **subLabel** — secondary text rendered below the main label (only when showLabel is true)
  - **imgSrc** — explicit image url overlaying the colored shape; takes priority over imgEmail
  - **imgEmail** — email used to fetch a gravatar image when no imgSrc is provided
  - **imgAlt** — overrides the image alt text; falls back to the label when omitted
  - **hasIndicator** + **indicatorColor** / **indicatorNumber** / **indicatorPosition** — optional status indicator pinned to the corner

  ### Size Options
  - **sm**: 32px circle
  - **base**: 48px circle (default)
  - **lg**: 64px circle

  ### Shape Options
  - **circle**: default — represents a person
  - **square**: softly rounded — represents an organisation, team, or project

  ### Image Priority
  1. Explicit imgSrc URL
  2. Gravatar (via imgEmail)
  3. None — initials remain visible

  ### Initials Generation
  - Single word: First 2 letters (e.g., "John" → "JO")
  - Multiple words: First letter of first + last word (e.g., "John Doe" → "JD")

  ### Overflow Mode
  - Set **isOverflow** to true (with a numeric **count** input) to render a "+N" overflow pill in place of the normal initials / image / indicator / label render. Typically used as the last child of an org-avatar-stack to collapse the tail.

  ### Companion Components
  - **org-avatar-stack** — overlapping row layout container
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Avatar & { label: string; disabled: boolean }>;

export const Default: Story = {
  args: {
    label: 'Sarah Chen',
    size: 'base',
    shape: 'circle',
    showLabel: true,
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The display name; drives initials, image alt fallback, and the clickable button aria-label',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size of the avatar; shared with internal sub-components',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'The shape of the avatar; circle for people, square for organisations / teams / projects',
    },
    showLabel: {
      control: 'boolean',
      description: 'When true, renders the adjacent name / sub-label block to the side of the avatar shape',
    },
    disabled: {
      control: 'boolean',
      description: 'When clickable, disables interaction and applies the disabled visual treatment',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default avatar configuration with label, size, shape, and showLabel controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-avatar [label]="label" [size]="size" [shape]="shape" [showLabel]="showLabel" [disabled]="disabled" />
    `,
    moduleMetadata: {
      imports: [Avatar],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Edit the label to see deterministic color hashing and initials update; toggle every visual axis on a single live avatar.',
      },
    },
  },
  render: () => ({
    template: `<story-avatar-live-demo />`,
    moduleMetadata: {
      imports: [AvatarLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every avatar variant axis — size, shape, image / fallback behaviour, color hashing, label composition, clickable behaviour, status indicator anchoring, and realistic in-context placements.',
      },
    },
  },
  render: () => ({
    props: {
      onAvatarClicked: () => console.log('avatar clicked'),
    },
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Sizes" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-center">
              <org-avatar label="Sarah Chen" size="sm" />
              <org-avatar label="Sarah Chen" />
              <org-avatar label="Sarah Chen" size="lg" />
            </div>
            <div class="flex gap-4 items-center">
              <org-avatar label="Sarah Chen" size="sm" [showLabel]="true" />
              <org-avatar label="Sarah Chen" [showLabel]="true" />
              <org-avatar label="Sarah Chen" size="lg" [showLabel]="true" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong>: 32px circle, 12px initials, 13px label</li>
            <li><strong>base</strong>: 48px circle, 16px initials, 14px label (default)</li>
            <li><strong>lg</strong>: 64px circle, 20px initials, 16px label</li>
            <li>Circle, initials, ring thickness, and adjacent label rhythm scale together by size</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Shape" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-end">
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Sarah Chen" />
                <span class="text-xs text-muted">Circle &middot; person</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Acme Corp" shape="square" />
                <span class="text-xs text-muted">Square &middot; org "Acme"</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Design Systems" shape="square" />
                <span class="text-xs text-muted">Square &middot; team "Design Systems"</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Circle</strong>: default shape — represents a person</li>
            <li><strong>Square</strong>: softly rounded — represents an organisation, team, or project</li>
            <li>The square shape reads as "not a person" while still feeling like an avatar</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Image &amp; Fallback" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-end">
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Sarah Chen" size="lg" imgSrc="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                <span class="text-xs text-muted">Image loaded</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Noah Park" size="lg" imgSrc="https://api.dicebear.com/7.x/avataaars/svg?seed=Noah" />
                <span class="text-xs text-muted">Image loaded</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Renée Marin" size="lg" imgSrc="https://invalid-url.com/missing.jpg" />
                <span class="text-xs text-muted">Image error → initials</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Avery Tan" size="lg" />
                <span class="text-xs text-muted">No image — initials</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The image overlays the colored circle; when missing or failing to load, the underlying initials read through</li>
            <li>Failed images set the <code>hidden</code> attribute on the underlying &lt;img&gt; — the colored initials stay in identity</li>
            <li>Don't replace failed images with a generic person glyph; the colored initials carry identity</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color hashing" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2 items-center">
              <org-avatar label="Alex" />
              <org-avatar label="Bo" />
              <org-avatar label="Cal" />
              <org-avatar label="Drew" />
              <org-avatar label="Eli" />
              <org-avatar label="Fin" />
              <org-avatar label="Gio" />
              <org-avatar label="Hal" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Background is one of 8 categorical hues, picked deterministically from the lowercased first character of the label</li>
            <li>Same label always produces the same color, every render</li>
            <li>Color is identity, not status — status lives in a pinned indicator</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Initials generation" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-center">
              <org-avatar label="John" />
              <org-avatar label="John Doe" />
              <org-avatar label="John Michael Doe" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Single name</strong>: first 2 letters (e.g., "John" → "JO")</li>
            <li><strong>Two names</strong>: first letter of each (e.g., "John Doe" → "JD")</li>
            <li><strong>Three+ names</strong>: first letter of first + last word (e.g., "John Michael Doe" → "JD")</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Adjacent label" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <org-avatar label="Sarah Chen" [showLabel]="true" />
              <org-avatar label="Noah Park" [showLabel]="true" subLabel="noah@org.dev" />
              <org-avatar label="Renée Marin" [showLabel]="true" subLabel="Engineering &middot; Lead" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The label block sits next to the circle</li>
            <li>The primary line uses medium weight; the optional sub-label is faint, for emails, roles, or status text</li>
            <li>Long names ellipsis-truncate within their min-width container</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Clickable" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-center">
              <org-avatar label="Sarah Chen" [showLabel]="true" subLabel="View profile" (clicked)="onAvatarClicked()" />
              <org-avatar label="Noah Park" (clicked)="onAvatarClicked()" />
              <org-avatar
                label="Renée Marin"
                [disabled]="true"
                [showLabel]="true"
                subLabel="Disabled"
                (clicked)="onAvatarClicked()"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Binding <code>(clicked)</code> renders the avatar as a real &lt;button&gt; — focus ring, keyboard activation, all native</li>
            <li>Hover dims slightly, focus shows the system focus ring, active dims further</li>
            <li><code>[disabled]="true"</code> on a clickable avatar applies cursor: not-allowed and 50% opacity, and suppresses click emission</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="With status indicator" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-6 items-end">
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Sarah Chen" size="lg" [hasIndicator]="true" indicatorColor="safe" />
                <span class="text-xs text-muted">Online</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="James K" size="lg" [hasIndicator]="true" indicatorColor="caution" />
                <span class="text-xs text-muted">Away</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar label="Renée Marin" size="lg" [hasIndicator]="true" indicatorColor="neutral" />
                <span class="text-xs text-muted">Offline</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-avatar
                  label="Avery Tan"
                  size="lg"
                  [hasIndicator]="true"
                  indicatorColor="danger"
                  indicatorPosition="top-right"
                  [indicatorNumber]="3"
                />
                <span class="text-xs text-muted">Unread count</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Set <code>[hasIndicator]="true"</code> on the avatar; the dot is automatically anchored to the corner of the circle (not the avatar's full bounding box)</li>
            <li>Customize via <code>indicatorColor</code>, <code>indicatorNumber</code>, and <code>indicatorPosition</code> (top-right, top-left, bottom-right, bottom-left) inputs</li>
            <li>The indicator renders inside the avatar regardless of whether the adjacent label is visible</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="In context" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3 w-full">
              <div class="flex items-center justify-between p-3 border border-default-color rounded-base">
                <org-avatar label="Sarah Chen" [showLabel]="true" subLabel="commented 2h ago" />
                <span class="text-xs text-muted">#1284</span>
              </div>
              <div class="flex items-center justify-between p-3 border border-default-color rounded-base">
                <org-avatar label="Noah Park" [showLabel]="true" subLabel="opened this issue" />
                <span class="text-xs text-muted">#1283</span>
              </div>
              <div class="flex items-center justify-between p-3 border border-default-color rounded-base">
                <org-avatar label="Renée Marin" [showLabel]="true" subLabel="requested review" />
                <span class="text-xs text-muted">#1282</span>
              </div>
              <div class="flex items-center justify-between p-3 border border-default-color rounded-base">
                <div class="flex items-center gap-3">
                  <span class="text-sm">Shared with</span>
                  <org-avatar-stack size="sm">
                    <org-avatar label="Sarah Chen" size="sm" />
                    <org-avatar label="Noah Park" size="sm" />
                    <org-avatar label="Renée Marin" size="sm" />
                    <org-avatar label="7 more team members" size="sm" [isOverflow]="true" [count]="7" />
                  </org-avatar-stack>
                </div>
                <span class="text-xs text-muted">11 members</span>
              </div>
              <div class="flex items-center justify-between p-3 border border-default-color rounded-base">
                <org-avatar
                  label="Acme Corp"
                  shape="square"
                  [showLabel]="true"
                  subLabel="3 projects &middot; 24 members"
                />
                <span class="text-xs text-muted">Switch workspace ›</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Realistic placements — comments list, "shared with" row, and a workspace switcher with a square org avatar</li>
            <li>The compositions read as identity-first — name + sub-line, plus optional metadata to the right</li>
            <li>Square shape on the workspace avatar signals "not a person" alongside the people-shaped circles</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Avatar,
        AvatarStack,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

type StackStory = StoryObj<AvatarStack>;

export const StackDefault: StackStory = {
  args: {
    size: 'base',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size of the avatar stack',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default avatar stack with base size. Use the controls below to interact with the component. Note: the stack child avatars match the stack size automatically and the stacked ring auto-applies inside a stack.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-avatar-stack [size]="size">
        <org-avatar label="Sarah Chen" [size]="size" />
        <org-avatar label="Noah Park" [size]="size" />
        <org-avatar label="Renée Marin" [size]="size" />
        <org-avatar label="Avery Tan" [size]="size" />
      </org-avatar-stack>
    `,
    moduleMetadata: {
      imports: [AvatarStack, Avatar],
    },
  }),
};

export const StackShowcase: StackStory = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every avatar-stack variant axis — size variants, image / initials / gravatar children, multi-word labels, and the post overflow pill that collapses long tails.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Stack sizes" />
          <org-design-system-demo-canvas slot="canvas">
            <org-avatar-stack size="sm">
              <org-avatar label="Sarah Chen" size="sm" />
              <org-avatar label="Noah Park" size="sm" />
              <org-avatar label="Renée Marin" size="sm" />
              <org-avatar label="3 more members" size="sm" [isOverflow]="true" [count]="3" />
            </org-avatar-stack>
            <org-avatar-stack size="base">
              <org-avatar label="Sarah Chen" />
              <org-avatar label="Noah Park" />
              <org-avatar label="Renée Marin" />
              <org-avatar label="4 more members" [isOverflow]="true" [count]="4" />
            </org-avatar-stack>
            <org-avatar-stack size="lg">
              <org-avatar label="Sarah Chen" size="lg" />
              <org-avatar label="Noah Park" size="lg" />
              <org-avatar label="Renée Marin" size="lg" />
              <org-avatar label="12 more members" size="lg" [isOverflow]="true" [count]="12" />
            </org-avatar-stack>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong> / <strong>base</strong> / <strong>lg</strong>: stack overlap scales with circle diameter (60% of the circle)</li>
            <li>Each stacked circle gets a surface-colored ring so adjacent siblings stay visually separated</li>
            <li>The post overflow avatar (<code>[isOverflow]="true"</code>) reads as a count, not a person</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Stack avatar types" />
          <org-design-system-demo-canvas slot="canvas">
            <org-avatar-stack size="base">
              <org-avatar label="Sarah Chen" />
              <org-avatar label="Noah Park" />
              <org-avatar label="Renée Marin" />
              <org-avatar label="Avery Tan" />
            </org-avatar-stack>
            <org-avatar-stack size="base">
              <org-avatar label="User 1" imgEmail="test1@example.com" />
              <org-avatar label="User 2" imgEmail="test2@example.com" />
              <org-avatar label="User 3" imgEmail="user3@example.com" />
              <org-avatar label="User 4" imgEmail="test3@example.com" />
            </org-avatar-stack>
            <org-avatar-stack size="base">
              <org-avatar label="Sarah Chen" imgSrc="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
              <org-avatar label="Noah Park" imgSrc="https://api.dicebear.com/7.x/avataaars/svg?seed=Noah" />
              <org-avatar label="Renée Marin" imgSrc="https://api.dicebear.com/7.x/avataaars/svg?seed=Renee" />
              <org-avatar label="Avery Tan" imgSrc="https://api.dicebear.com/7.x/avataaars/svg?seed=Avery" />
            </org-avatar-stack>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Initials</strong>: deterministic per-user color makes individuals readable at a glance</li>
            <li><strong>Gravatar</strong>: image overlays the initials, preserving the same overall shape</li>
            <li><strong>Custom images</strong>: stack sizing stays consistent regardless of source</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Stack label variations" />
          <org-design-system-demo-canvas slot="canvas">
            <org-avatar-stack size="base">
              <org-avatar label="John" />
              <org-avatar label="Jane" />
              <org-avatar label="Bob" />
              <org-avatar label="Alice" />
            </org-avatar-stack>
            <org-avatar-stack size="base">
              <org-avatar label="User 1" />
              <org-avatar label="User 2" />
              <org-avatar label="User 3" />
              <org-avatar label="User 4" />
              <org-avatar label="User 5" />
              <org-avatar label="User 6" />
              <org-avatar label="User 7" />
              <org-avatar label="User 8" />
            </org-avatar-stack>
            <org-avatar-stack size="base">
              <org-avatar label="John Doe" />
              <org-avatar label="Jane Smith" />
              <org-avatar label="Bob Johnson" />
              <org-avatar label="Alice Williams" />
            </org-avatar-stack>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Single names</strong>: deterministic per-letter color keeps the row readable</li>
            <li><strong>Many avatars</strong>: spacing stays consistent — pair with an overflow pill once the row gets long</li>
            <li><strong>Multi-word names</strong>: two-letter initials maintain hierarchy in the stack</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        AvatarStack,
        Avatar,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
