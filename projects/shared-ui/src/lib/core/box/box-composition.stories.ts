import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControlsGroup } from '../../example/design-system-demo/design-system-demo-controls-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import {
  DesignSystemDemoControlPresets,
  type DesignSystemDemoControlPreset,
} from '../../example/design-system-demo/design-system-demo-control-presets';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  Box,
  allBoxColors,
  allBoxPaddingApplications,
  allBoxPaddings,
  BOX_BACKGROUND_DEFAULT,
  BOX_BORDER_DEFAULT,
  BOX_COLOR_DEFAULT,
  BOX_PADDING_APPLICATION_DEFAULT,
  BOX_PADDING_DEFAULT,
  type BoxColor,
  type BoxExpandedState,
  type BoxPadding,
  type BoxPaddingApplication,
} from './box';
import { BoxContent } from './box-content';
import { BoxFooter, allBoxFooterAlignments, BOX_FOOTER_ALIGNMENT_DEFAULT, type BoxFooterAlignment } from './box-footer';
import { BoxHeader, allBoxHeaderVariants, BOX_HEADER_VARIANT_DEFAULT, type BoxHeaderVariant } from './box-header';
import { BOX_HEADER_HEADING_LEVEL_DEFAULT } from './box-header-brain';
import { BoxImage } from './box-image';
import { BoxOuterHeader } from './box-outer-header';
import { Input } from '../input/input';

type LiveDemoColorChoice = 'none' | BoxColor;

/** which header (if any) the live demo projects into the box */
type LiveDemoHeaderChoice = 'none' | 'internal' | 'external';

/** which actions template (if any) the live demo projects into the header — none renders no template */
type LiveDemoActionsChoice = 'none' | 'ellipsis' | 'multiple';

/** which gradient direction (if any) the live demo paints — none paints no gradient */
type LiveDemoGradientPattern = 'none' | 'left-right' | 'top-bottom' | 'right-left' | 'bottom-top';

/** which element the live demo gradient is applied to */
type LiveDemoGradientApplication = 'box' | 'footer';

/** maps the live demo gradient pattern control values to the gradient utility class direction suffixes */
const GRADIENT_PATTERN_TO_DIRECTION: Record<Exclude<LiveDemoGradientPattern, 'none'>, string> = {
  'left-right': 'left-to-right',
  'top-bottom': 'top-to-bottom',
  'right-left': 'right-to-left',
  'bottom-top': 'bottom-to-top',
};

const allLiveDemoColorChoices: readonly LiveDemoColorChoice[] = ['none', ...allComponentColors] as const;

const liveDemoHeaderItems: ButtonToggleItem[] = (['none', 'internal', 'external'] as const).map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

const liveDemoActionsItems: ButtonToggleItem[] = (['none', 'ellipsis', 'multiple'] as const).map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

const liveDemoVariantItems: ButtonToggleItem[] = allBoxHeaderVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

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

const liveDemoPaddingItems: ButtonToggleItem[] = allBoxPaddings.map((padding) => ({
  label: padding,
  value: padding,
  buttonColor: 'primary',
}));

const liveDemoPaddingApplicationItems: ButtonToggleItem[] = allBoxPaddingApplications.map((paddingApplication) => ({
  label: paddingApplication,
  value: paddingApplication,
  buttonColor: 'primary',
}));

const liveDemoFooterAlignmentItems: ButtonToggleItem[] = allBoxFooterAlignments.map((alignment) => ({
  label: alignment,
  value: alignment,
  buttonColor: 'primary',
}));

const liveDemoGradientPatternItems: ButtonToggleItem[] = (
  ['none', 'left-right', 'top-bottom', 'right-left', 'bottom-top'] as const
).map((pattern) => ({
  label: pattern,
  value: pattern,
  buttonColor: 'primary',
}));

const liveDemoGradientApplicationItems: ButtonToggleItem[] = (['box', 'footer'] as const).map((application) => ({
  label: application,
  value: application,
  buttonColor: 'primary',
}));

const liveDemoHeadingLevelItems: ButtonToggleItem[] = (['1', '2', '3', '4', '5', '6'] as const).map((level) => ({
  label: level,
  value: level,
  buttonColor: 'primary',
}));

/** the subset of live-demo form controls a preset can drive; unset keys fall back to the form defaults */
type BoxCompositionPresetValue = Partial<{
  color: LiveDemoColorChoice;
  border: BoxBorder;
  padding: BoxPadding;
  paddingApplication: BoxPaddingApplication;
  useBackgroundColor: boolean;
  header: LiveDemoHeaderChoice;
  title: string;
  subtitle: string;
  variant: BoxHeaderVariant;
  isEmphasized: boolean;
  divider: boolean;
  actions: LiveDemoActionsChoice;
  pre: boolean;
  headingLevel: string;
  image: boolean;
  content: boolean;
  footer: boolean;
  footerDivider: boolean;
  footerAlignment: BoxFooterAlignment;
}>;

/**
 * realistic configurations surfaced as one-click presets in the live demo, lifted from the former "Realistic
 * compositions" showcase. each maps the box-composition controls; the live-demo content slot is a fixed
 * paragraph, so per-example body copy (KPI numbers, settings rows) is represented by the toggles rather than
 * literal text.
 */
const liveDemoPresets: DesignSystemDemoControlPreset<BoxCompositionPresetValue>[] = [
  {
    label: 'Notifications',
    value: {
      color: 'none',
      header: 'internal',
      title: 'Notifications',
      subtitle: "Choose how you'd like to be reached.",
      actions: 'ellipsis',
      content: true,
      footer: true,
      footerAlignment: 'end',
    },
  },
  {
    label: 'Active users (KPI)',
    value: {
      header: 'internal',
      title: 'Active users',
      subtitle: 'Last 30 days',
      actions: 'ellipsis',
      content: true,
      footer: false,
    },
  },
  {
    label: 'Article with image',
    value: {
      image: true,
      header: 'internal',
      title: 'A field guide to design tokens',
      subtitle: '14 min read · Published Mar 4',
      actions: 'none',
      content: true,
      footer: true,
      footerAlignment: 'start',
    },
  },
  {
    label: 'Trial expiring',
    value: {
      color: 'caution',
      border: 'border-emphasize',
      useBackgroundColor: true,
      header: 'internal',
      title: 'Trial expiring soon',
      subtitle: '4 days left on your team trial.',
      actions: 'none',
      content: false,
      footer: true,
    },
  },
  {
    label: 'Projects toolbar',
    value: {
      header: 'internal',
      title: '',
      subtitle: '',
      actions: 'multiple',
      content: true,
      footer: false,
    },
  },
];

const SAMPLE_IMAGE_TOP = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80';
const SAMPLE_IMAGE_INSET =
  'https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=800&q=80';
const SAMPLE_IMAGE_BOTTOM =
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80';

const meta: Meta<Box> = {
  title: 'Core/Components/Box Composition',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Box Composition

  A card-like content surface built entirely from Box and its slotted sub-components: an optional header
  (titles + actions), an optional bleeding image, a content slot, and an optional footer button row. Box is a
  vertical \`column\` flex container by default that spaces the regions with a shared gap; all of
  Box's color, border, background, and clickable behavior comes along for free.

  ### Composition
  - **Box**: Root surface (a vertical \`column\` flex container by default) owning \`color\`, \`border\`,
    \`background\`, \`padding\`, and the optional \`isClickable\` / \`isExpandable\` affordances.
  - **BoxHeader**: Title / subtitle / actions row, plus a \`pre\` slot for inline content before the title
    (e.g. a leading icon). Auto-detects an actions-only mode when no title or subtitle is provided. Heading
    level (h1–h6) is configured via the \`headingLevel\` brain input.
  - **BoxImage**: Optional image with a \`fill\` mode (forced 16:9, default) or a \`default\` mode that
    renders at the explicit width / height inputs. Bleeds to the box edges by default; pass
    \`[fullWidth]="false"\` to inset it inside the shared 12px gutter.
  - **BoxContent**: Body slot. No layout opinion — children flow normally.
  - **BoxFooter**: Button row with \`start\` / \`center\` / \`end\` alignment (default \`end\`).

  ### Clickable
  Setting \`[isClickable]="true"\` on \`org-box\` flips the whole surface into an interactive button (cursor,
  hover/pressed tint, focus-visible ring, role=button, tabindex=0, Enter/Space activation) and emits the
  \`clicked\` output on activation. Static boxes remain purely presentational. When the box is also
  \`isExpandable\`, the whole-surface clickable affordance is suppressed — the header toggle owns the interaction.

  ### Padding model
  The \`paddingApplication\` input controls where the box padding lives:
  - **container** (default): the padding amount sits on the box surface, so every region — including the
    header / footer dividers — is inset from the box border by the padding.
  - **inner-items**: the surface padding is removed and applied inside each region instead. Each region's
    content gets the inline (left / right) padding while its divider renders full-bleed (touching the box
    border); the first region gets the top padding and the last gets the bottom padding, and the shared gap
    between regions is unchanged. A full-width \`BoxImage\` keeps bleeding to all edges; a constrained
    (\`[fullWidth]="false"\`) image picks up the same inline inset as the other regions.

  ### Usage
  \`\`\`html
  <org-box color="primary" border="border-emphasize">
    <org-box-header title="Notifications" subtitle="Choose how you'd like to be reached.">
      <ng-template #actions>
        <org-button variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
      </ng-template>
    </org-box-header>
    <org-box-content>Body text…</org-box-content>
    <org-box-footer>
      <org-button color="neutral" variant="ghost" label="Discard" />
      <org-button color="primary" label="Save changes" />
    </org-box-footer>
  </org-box>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Box>;

export const Default: Story = {
  args: {
    color: BOX_COLOR_DEFAULT,
    border: BOX_BORDER_DEFAULT,
    background: BOX_BACKGROUND_DEFAULT,
    paddingApplication: BOX_PADDING_APPLICATION_DEFAULT,
  },
  argTypes: {
    color: {
      control: 'select',
      options: [null, ...allBoxColors],
      description: 'The semantic color applied to the box surface',
    },
    border: {
      control: 'select',
      options: allBoxBorders,
      description: 'The border / visual style variant of the box',
    },
    background: {
      control: 'select',
      options: ['colored', 'colorless'],
      description: 'Whether the color tints the box background (colored) or leaves it default (colorless)',
    },
    paddingApplication: {
      control: 'select',
      options: allBoxPaddingApplications,
      description:
        "Where the padding is applied; 'container' pads the surface, 'inner-items' moves it into the regions so their dividers render full-bleed",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default stacked box with header, content, and footer. Use the controls to drive the box-level inputs (projected sub-components are fixed in this story).',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <org-box [color]="color" [border]="border" [background]="background" [paddingApplication]="paddingApplication">
          <org-box-header title="Project settings" subtitle="Configuration shared across every environment." />
          <org-box-content>
            Stacked boxes group related content into a discrete visual block. Drop any composition inside — settings
            rows, KPI tiles, prose, or sub-components from elsewhere in the system.
          </org-box-content>
          <org-box-footer>
            <org-button color="neutral" variant="ghost" label="Cancel" />
            <org-button color="primary" label="Save" />
          </org-box-footer>
        </org-box>
      </div>
    `,
    moduleMetadata: {
      imports: [Box, BoxHeader, BoxContent, BoxFooter, Button],
    },
  }),
};

@Component({
  selector: 'story-box-composition-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Box,
    BoxHeader,
    BoxOuterHeader,
    BoxContent,
    BoxFooter,
    BoxImage,
    Button,
    Icon,
    Input,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlsGroup,
    DesignSystemDemoControlInput,
    DesignSystemDemoControlPresets,
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
      .box-shell {
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
        <org-design-system-demo-control-presets
          slot="control-presets"
          label="Preset"
          [presets]="presets"
          (presetSelected)="onPresetSelected($event)"
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-controls-group label="Container">
            <org-design-system-demo-control-input label="Color">
              <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Border">
              <org-button-toggle [items]="borderItems" formControlName="border" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Padding">
              <org-button-toggle [items]="paddingItems" formControlName="padding" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Padding application">
              <org-button-toggle
                [items]="paddingApplicationItems"
                formControlName="paddingApplication"
                buttonSize="sm"
              />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="UseBackgroundColor">
              <org-checkbox-toggle name="live-demo-use-bg" value="use-bg" formControlName="useBackgroundColor">
                {{ liveDemoForm.controls.useBackgroundColor.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Header">
            <org-design-system-demo-control-input label="Header">
              <org-button-toggle [items]="headerItems" formControlName="header" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Title">
              <org-input name="live-demo-title" placeholder="Title text" formControlName="title" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Subtitle">
              <org-input name="live-demo-subtitle" placeholder="Subtitle text" formControlName="subtitle" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Variant">
              <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Emphasized">
              <org-checkbox-toggle name="live-demo-emphasized" value="emphasized" formControlName="isEmphasized">
                {{ liveDemoForm.controls.isEmphasized.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Divider">
              <org-checkbox-toggle name="live-demo-divider" value="divider" formControlName="divider">
                {{ liveDemoForm.controls.divider.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Actions">
              <org-button-toggle [items]="actionsItems" formControlName="actions" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Pre">
              <org-checkbox-toggle name="live-demo-pre" value="pre" formControlName="pre">
                {{ liveDemoForm.controls.pre.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Header level">
              <org-button-toggle [items]="headingLevelItems" formControlName="headingLevel" buttonSize="sm" />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Second header">
            <org-design-system-demo-control-input label="Render">
              <org-checkbox-toggle
                name="live-demo-second-render"
                value="second-render"
                formControlName="secondHeaderRender"
              >
                {{ liveDemoForm.controls.secondHeaderRender.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Header">
              <org-button-toggle [items]="headerItems" formControlName="secondHeader" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Title">
              <org-input name="live-demo-second-title" placeholder="Title text" formControlName="secondTitle" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Subtitle">
              <org-input
                name="live-demo-second-subtitle"
                placeholder="Subtitle text"
                formControlName="secondSubtitle"
              />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Variant">
              <org-button-toggle [items]="variantItems" formControlName="secondVariant" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Emphasized">
              <org-checkbox-toggle
                name="live-demo-second-emphasized"
                value="emphasized"
                formControlName="secondIsEmphasized"
              >
                {{ liveDemoForm.controls.secondIsEmphasized.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Divider">
              <org-checkbox-toggle name="live-demo-second-divider" value="divider" formControlName="secondDivider">
                {{ liveDemoForm.controls.secondDivider.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Actions">
              <org-button-toggle [items]="actionsItems" formControlName="secondActions" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Pre">
              <org-checkbox-toggle name="live-demo-second-pre" value="pre" formControlName="secondPre">
                {{ liveDemoForm.controls.secondPre.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Header level">
              <org-button-toggle [items]="headingLevelItems" formControlName="secondHeadingLevel" buttonSize="sm" />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Content">
            <org-design-system-demo-control-input label="Image">
              <org-checkbox-toggle name="live-demo-image" value="image" formControlName="image">
                {{ liveDemoForm.controls.image.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Content">
              <org-checkbox-toggle name="live-demo-content" value="content" formControlName="content">
                {{ liveDemoForm.controls.content.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Footer">
            <org-design-system-demo-control-input label="Footer">
              <org-checkbox-toggle name="live-demo-footer" value="footer" formControlName="footer">
                {{ liveDemoForm.controls.footer.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Footer divider">
              <org-checkbox-toggle
                name="live-demo-footer-divider"
                value="footer-divider"
                formControlName="footerDivider"
              >
                {{ liveDemoForm.controls.footerDivider.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Footer align">
              <org-button-toggle [items]="footerAlignmentItems" formControlName="footerAlignment" buttonSize="sm" />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Behavior">
            <org-design-system-demo-control-input label="Clickable">
              <org-checkbox-toggle name="live-demo-clickable" value="clickable" formControlName="clickable">
                {{ liveDemoForm.controls.clickable.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Expandable">
              <org-checkbox-toggle name="live-demo-expandable" value="expandable" formControlName="expandable">
                {{ liveDemoForm.controls.expandable.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Gradient pattern">
              <org-button-toggle [items]="gradientPatternItems" formControlName="gradientPattern" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Gradient application">
              <org-button-toggle
                [items]="gradientApplicationItems"
                formControlName="gradientApplication"
                buttonSize="sm"
              />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="box-shell">
              <org-box
                [color]="liveDemoForm.controls.color.value === 'none' ? null : liveDemoForm.controls.color.value"
                [border]="liveDemoForm.controls.border.value"
                [padding]="liveDemoForm.controls.padding.value"
                [paddingApplication]="liveDemoForm.controls.paddingApplication.value"
                [background]="liveDemoForm.controls.useBackgroundColor.value ? 'colored' : 'colorless'"
                [surfaceClass]="gradientClass('box')"
                [isExpandable]="liveDemoForm.controls.expandable.value"
                [(expandedState)]="expandedState"
                [isClickable]="liveDemoForm.controls.clickable.value"
                (clicked)="onCardClicked()"
              >
                @if (liveDemoForm.controls.header.value === 'external') {
                  <org-box-outer-header
                    [title]="liveDemoForm.controls.title.value"
                    [subtitle]="liveDemoForm.controls.subtitle.value"
                    [headingLevel]="+liveDemoForm.controls.headingLevel.value"
                  >
                    @if (liveDemoForm.controls.pre.value) {
                      <org-icon pre name="info" />
                    }
                    @if (liveDemoForm.controls.actions.value !== 'none') {
                      <ng-template #actions>
                        @switch (liveDemoForm.controls.actions.value) {
                          @case ('ellipsis') {
                            <org-button
                              variant="text"
                              color="neutral"
                              label="More options"
                              preIcon="ellipsis"
                              [iconOnly]="true"
                              ariaLabel="More options"
                            />
                          }
                          @case ('multiple') {
                            <org-button variant="text" color="neutral" label="Action 1" />
                            <org-button variant="text" color="neutral" label="Action 2" />
                          }
                        }
                      </ng-template>
                    }
                  </org-box-outer-header>
                }
                @if (liveDemoForm.controls.header.value === 'internal') {
                  <org-box-header
                    [title]="liveDemoForm.controls.title.value"
                    [subtitle]="liveDemoForm.controls.subtitle.value"
                    [headingLevel]="+liveDemoForm.controls.headingLevel.value"
                    [hasDivider]="liveDemoForm.controls.divider.value"
                    [variant]="liveDemoForm.controls.variant.value"
                    [isEmphasized]="liveDemoForm.controls.isEmphasized.value"
                  >
                    @if (liveDemoForm.controls.pre.value) {
                      <org-icon pre name="info" />
                    }
                    @if (liveDemoForm.controls.actions.value !== 'none') {
                      <ng-template #actions>
                        @switch (liveDemoForm.controls.actions.value) {
                          @case ('ellipsis') {
                            <org-button
                              variant="text"
                              color="neutral"
                              label="More options"
                              preIcon="ellipsis"
                              [iconOnly]="true"
                              ariaLabel="More options"
                            />
                          }
                          @case ('multiple') {
                            <org-button variant="text" color="neutral" label="Action 1" />
                            <org-button variant="text" color="neutral" label="Action 2" />
                          }
                        }
                      </ng-template>
                    }
                  </org-box-header>
                }
                @if (liveDemoForm.controls.secondHeaderRender.value) {
                  @if (liveDemoForm.controls.secondHeader.value === 'external') {
                    <org-box-outer-header
                      [title]="liveDemoForm.controls.secondTitle.value"
                      [subtitle]="liveDemoForm.controls.secondSubtitle.value"
                      [headingLevel]="+liveDemoForm.controls.secondHeadingLevel.value"
                    >
                      @if (liveDemoForm.controls.secondPre.value) {
                        <org-icon pre name="info" />
                      }
                      @if (liveDemoForm.controls.secondActions.value !== 'none') {
                        <ng-template #actions>
                          @switch (liveDemoForm.controls.secondActions.value) {
                            @case ('ellipsis') {
                              <org-button
                                variant="text"
                                color="neutral"
                                label="More options"
                                preIcon="ellipsis"
                                [iconOnly]="true"
                                ariaLabel="More options"
                              />
                            }
                            @case ('multiple') {
                              <org-button variant="text" color="neutral" label="Action 1" />
                              <org-button variant="text" color="neutral" label="Action 2" />
                            }
                          }
                        </ng-template>
                      }
                    </org-box-outer-header>
                  }
                  @if (liveDemoForm.controls.secondHeader.value === 'internal') {
                    <org-box-header
                      [title]="liveDemoForm.controls.secondTitle.value"
                      [subtitle]="liveDemoForm.controls.secondSubtitle.value"
                      [headingLevel]="+liveDemoForm.controls.secondHeadingLevel.value"
                      [hasDivider]="liveDemoForm.controls.secondDivider.value"
                      [variant]="liveDemoForm.controls.secondVariant.value"
                      [isEmphasized]="liveDemoForm.controls.secondIsEmphasized.value"
                    >
                      @if (liveDemoForm.controls.secondPre.value) {
                        <org-icon pre name="info" />
                      }
                      @if (liveDemoForm.controls.secondActions.value !== 'none') {
                        <ng-template #actions>
                          @switch (liveDemoForm.controls.secondActions.value) {
                            @case ('ellipsis') {
                              <org-button
                                variant="text"
                                color="neutral"
                                label="More options"
                                preIcon="ellipsis"
                                [iconOnly]="true"
                                ariaLabel="More options"
                              />
                            }
                            @case ('multiple') {
                              <org-button variant="text" color="neutral" label="Action 1" />
                              <org-button variant="text" color="neutral" label="Action 2" />
                            }
                          }
                        </ng-template>
                      }
                    </org-box-header>
                  }
                }
                @if (liveDemoForm.controls.image.value) {
                  <org-box-image src="${SAMPLE_IMAGE_TOP}" alt="Workspace photo" />
                }
                @if (liveDemoForm.controls.content.value) {
                  <org-box-content>
                    Cards group related content into a discrete visual block. Drop any composition inside — settings
                    rows, KPI tiles, prose, or sub-components from elsewhere in the system.
                  </org-box-content>
                }
                @if (liveDemoForm.controls.footer.value) {
                  <org-box-footer
                    [alignment]="liveDemoForm.controls.footerAlignment.value"
                    [hasDivider]="liveDemoForm.controls.footerDivider.value"
                    [class]="gradientClass('footer')"
                  >
                    <org-button color="neutral" variant="ghost" label="Cancel" />
                    <org-button color="primary" label="Save" />
                  </org-box-footer>
                }
              </org-box>
              @if (liveDemoForm.controls.expandable.value) {
                <div class="text-xs text-fg-muted mt-2">
                  Expanded state: <strong>{{ expandedState() }}</strong>
                </div>
              }
              @if (liveDemoForm.controls.clickable.value) {
                <div class="text-xs text-fg-muted mt-2">
                  Box click count: <strong>{{ boxClickCount() }}</strong>
                </div>
              }
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class BoxCompositionLiveDemoStory {
  protected readonly colorItems = liveDemoColorItems;
  protected readonly borderItems = liveDemoBorderItems;
  protected readonly paddingItems = liveDemoPaddingItems;
  protected readonly paddingApplicationItems = liveDemoPaddingApplicationItems;
  protected readonly footerAlignmentItems = liveDemoFooterAlignmentItems;
  protected readonly headerItems = liveDemoHeaderItems;
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly actionsItems = liveDemoActionsItems;
  protected readonly gradientPatternItems = liveDemoGradientPatternItems;
  protected readonly gradientApplicationItems = liveDemoGradientApplicationItems;
  protected readonly headingLevelItems = liveDemoHeadingLevelItems;
  protected readonly presets = liveDemoPresets;

  protected readonly boxClickCount = signal<number>(0);

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<LiveDemoColorChoice>('none', { nonNullable: true }),
    border: new FormControl<BoxBorder>(BOX_BORDER_DEFAULT, { nonNullable: true }),
    padding: new FormControl<BoxPadding>(BOX_PADDING_DEFAULT, { nonNullable: true }),
    paddingApplication: new FormControl<BoxPaddingApplication>(BOX_PADDING_APPLICATION_DEFAULT, { nonNullable: true }),
    useBackgroundColor: new FormControl<boolean>(true, { nonNullable: true }),
    header: new FormControl<LiveDemoHeaderChoice>('internal', { nonNullable: true }),
    title: new FormControl<string>('Project settings', { nonNullable: true }),
    subtitle: new FormControl<string>('Configuration shared across every environment.', { nonNullable: true }),
    variant: new FormControl<BoxHeaderVariant>(BOX_HEADER_VARIANT_DEFAULT, { nonNullable: true }),
    isEmphasized: new FormControl<boolean>(false, { nonNullable: true }),
    divider: new FormControl<boolean>(false, { nonNullable: true }),
    actions: new FormControl<LiveDemoActionsChoice>('ellipsis', { nonNullable: true }),
    pre: new FormControl<boolean>(false, { nonNullable: true }),
    headingLevel: new FormControl<string>(String(BOX_HEADER_HEADING_LEVEL_DEFAULT), { nonNullable: true }),
    secondHeaderRender: new FormControl<boolean>(false, { nonNullable: true }),
    secondHeader: new FormControl<LiveDemoHeaderChoice>('internal', { nonNullable: true }),
    secondTitle: new FormControl<string>('Project settings', { nonNullable: true }),
    secondSubtitle: new FormControl<string>('Configuration shared across every environment.', { nonNullable: true }),
    secondVariant: new FormControl<BoxHeaderVariant>(BOX_HEADER_VARIANT_DEFAULT, { nonNullable: true }),
    secondIsEmphasized: new FormControl<boolean>(false, { nonNullable: true }),
    secondDivider: new FormControl<boolean>(false, { nonNullable: true }),
    secondActions: new FormControl<LiveDemoActionsChoice>('ellipsis', { nonNullable: true }),
    secondPre: new FormControl<boolean>(false, { nonNullable: true }),
    secondHeadingLevel: new FormControl<string>('4', { nonNullable: true }),
    image: new FormControl<boolean>(false, { nonNullable: true }),
    content: new FormControl<boolean>(true, { nonNullable: true }),
    footer: new FormControl<boolean>(true, { nonNullable: true }),
    footerDivider: new FormControl<boolean>(false, { nonNullable: true }),
    footerAlignment: new FormControl<BoxFooterAlignment>(BOX_FOOTER_ALIGNMENT_DEFAULT, { nonNullable: true }),
    clickable: new FormControl<boolean>(false, { nonNullable: true }),
    expandable: new FormControl<boolean>(false, { nonNullable: true }),
    gradientPattern: new FormControl<LiveDemoGradientPattern>('none', { nonNullable: true }),
    gradientApplication: new FormControl<LiveDemoGradientApplication>('box', { nonNullable: true }),
  });

  protected readonly expandedState = signal<BoxExpandedState>('full');

  /** the form's initial values, captured once so a preset can reset to a clean baseline before applying */
  private readonly _defaultFormValue = this.liveDemoForm.getRawValue();

  protected onCardClicked(): void {
    this.boxClickCount.update((count) => count + 1);
  }

  /** applies a preset by resetting to the form defaults then patching in the preset's overrides */
  protected onPresetSelected(value: BoxCompositionPresetValue): void {
    this.liveDemoForm.reset(this._defaultFormValue);
    this.liveDemoForm.patchValue(value);
  }

  /**
   * builds the gradient utility class for the given target, or an empty string when no gradient applies.
   * the gradient color tracks the box Color control, falling back to primary when Color is 'none'.
   */
  protected gradientClass(target: LiveDemoGradientApplication): string {
    const pattern = this.liveDemoForm.controls.gradientPattern.value;

    if (pattern === 'none' || this.liveDemoForm.controls.gradientApplication.value !== target) {
      return '';
    }

    const color =
      this.liveDemoForm.controls.color.value === 'none' ? 'primary' : this.liveDemoForm.controls.color.value;

    return `gradient-${color}-${GRADIENT_PATTERN_TO_DIRECTION[pattern]}`;
  }
}

@Component({
  selector: 'story-box-composition-clickable-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Box,
    BoxHeader,
    BoxContent,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Clickable"
        description="Setting [isClickable]=true on org-box forwards the underlying Box's clickable affordance to the whole surface and emits the clicked output on activation. Static boxes (isClickable false) remain purely presentational."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid grid-cols-2 gap-3 items-start max-w-3xl">
          <org-box>
            <org-box-header title="Static card" subtitle="isClickable is false." />
            <org-box-content>
              Hovering and focusing change nothing — the card is a purely presentational surface.
            </org-box-content>
          </org-box>
          <org-box color="info" [isClickable]="true" (clicked)="onClicked('info card')">
            <org-box-header title="Clickable · info" subtitle="[isClickable]=true." />
            <org-box-content>
              The whole surface is interactive. Hover, click, or tab-then-Enter / Space.
            </org-box-content>
          </org-box>
          <org-box color="safe" border="border-emphasize" [isClickable]="true" (clicked)="onClicked('safe emphasize')">
            <org-box-header title="Clickable · safe · emphasize" subtitle="Pairs with any visual variant." />
            <org-box-content>The clickable affordance respects all other card visual inputs.</org-box-content>
          </org-box>
          <org-box
            color="caution"
            background="colorless"
            [isClickable]="true"
            (clicked)="onClicked('caution colorless')"
          >
            <org-box-header title="Clickable · caution · colorless" subtitle="Hover / pressed use neutral tints." />
            <org-box-content>
              In colorless mode the hover and pressed states fall back to neutral background tokens.
            </org-box-content>
          </org-box>
        </div>
        <div class="text-xs text-fg-muted mt-3">
          Last activation: <strong>{{ lastActivated() ?? '—' }}</strong> · Total clicks:
          <strong>{{ totalClicks() }}</strong>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="list-inside list-disc flex flex-col gap-1">
        <li>
          <strong>Explicit opt-in</strong>: setting [isClickable]=true on org-box flips the inner box into clickable
          mode
        </li>
        <li>
          <strong>Static cards stay static</strong>: cards with isClickable false show no cursor / hover / focus / aria
          affordance
        </li>
        <li>
          <strong>Clicked output</strong>: while clickable, activation emits the card's (clicked) output for consumers
          to handle
        </li>
        <li><strong>Keyboard</strong>: Enter and Space activate the card; Space's default page scroll is suppressed</li>
        <li><strong>Aria</strong>: role="button" and tabindex="0" applied to the org-box host element</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class BoxCompositionClickableShowcaseStory {
  protected readonly totalClicks = signal<number>(0);

  protected readonly lastActivated = signal<string | null>(null);

  protected onClicked(label: string): void {
    this.totalClicks.update((count) => count + 1);
    this.lastActivated.set(label);
  }
}

@Component({
  selector: 'story-box-composition-expandable-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Box,
    BoxHeader,
    BoxOuterHeader,
    BoxContent,
    BoxFooter,
    BoxImage,
    Button,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Expandable"
        description="Setting [isExpandable]=true makes a header act as a toggle button driving the tri-state [(expandedState)] model (full | header-only | none). The internal org-box-header toggle flips full ⟷ header-only (collapsing the image / content / footer regions); the org-box-outer-header toggle flips full ⟷ none (removing the whole box surface while the outer header keeps rendering). Per design, the [isClickable] whole-card affordance is not wired up when the card is expandable — the header toggle owns the interaction."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid grid-cols-2 gap-3 items-start max-w-3xl">
          <org-box [isExpandable]="true" [(expandedState)]="expandedDefault">
            <org-box-header title="Internal · default expanded" subtitle="Click the header to collapse to header-only.">
              <div post>test</div>
            </org-box-header>
            <org-box-content>
              The content, footer, and image regions all self-hide when the card collapses to header-only. Click the
              header again to expand.
            </org-box-content>
            <org-box-footer>
              <org-button color="neutral" variant="ghost" label="Cancel" />
              <org-button color="primary" label="Save" />
            </org-box-footer>
          </org-box>

          <org-box [isExpandable]="true" [(expandedState)]="expandedCollapsedInitial">
            <org-box-header title="Internal · starts header-only" subtitle="expandedState was passed as header-only." />
            <org-box-content>
              Initial state honors the bound [expandedState] value. Click the header to expand to full.
            </org-box-content>
          </org-box>

          <org-box color="info" border="border-emphasize" [isExpandable]="true" [(expandedState)]="expandedWithImage">
            <org-box-image src="${SAMPLE_IMAGE_TOP}" alt="Workspace photo" />
            <org-box-header title="Internal · with image" subtitle="The image hides with the rest when collapsed." />
            <org-box-content>The image, content, and footer all react to the collapse together.</org-box-content>
          </org-box>

          <org-box [isExpandable]="true" [(expandedState)]="expandedOuter">
            <org-box-outer-header
              title="External · toggles full ⟷ none"
              subtitle="The outer header survives the none state."
            >
              <ng-template #actions>
                <org-button
                  variant="text"
                  color="neutral"
                  label="More options"
                  preIcon="ellipsis"
                  [iconOnly]="true"
                  ariaLabel="More options"
                />
              </ng-template>
            </org-box-outer-header>
            <org-box-content>
              Toggling the outer header removes this entire box surface (expandedState none) while the outer header
              itself keeps rendering — and stays keyboard-operable to restore it.
            </org-box-content>
          </org-box>
        </div>
        <div class="text-xs text-fg-muted mt-3">
          State — default: <strong>{{ expandedDefault() }}</strong> · starts-header-only:
          <strong>{{ expandedCollapsedInitial() }}</strong> · with-image: <strong>{{ expandedWithImage() }}</strong> ·
          external:
          <strong>{{ expandedOuter() }}</strong>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="list-inside list-disc flex flex-col gap-1">
        <li>
          <strong>Header toggle</strong>: the title / subtitle block becomes a real &lt;button&gt; with a trailing
          chevron-down / chevron-up indicator
        </li>
        <li>
          <strong>Actions stay clickable</strong>: the actions template is rendered outside the toggle button so
          projected action buttons remain independent click targets
        </li>
        <li>
          <strong>header-only (internal toggle)</strong>: image, content, and footer set display: none while the box
          surface and header stay visible
        </li>
        <li>
          <strong>none (outer toggle)</strong>: the whole box surface is removed from the DOM, leaving only the outer
          header — which remains focusable so it can restore the box
        </li>
        <li>
          <strong>Keyboard</strong>: native &lt;button&gt; gives Enter and Space activation, focus-visible background
          tint, and proper focus order for free
        </li>
        <li><strong>Aria</strong>: aria-expanded reflects the current state on each toggle button</li>
        <li>
          <strong>Mutually exclusive with [isClickable]</strong>: when isExpandable is true, the whole-card
          [isClickable] affordance is intentionally skipped — only one click target per surface
        </li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class BoxCompositionExpandableShowcaseStory {
  protected readonly expandedDefault = signal<BoxExpandedState>('full');
  protected readonly expandedCollapsedInitial = signal<BoxExpandedState>('header-only');
  protected readonly expandedWithImage = signal<BoxExpandedState>('full');
  protected readonly expandedOuter = signal<BoxExpandedState>('full');
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
    template: `<story-box-composition-live-demo />`,
    moduleMetadata: {
      imports: [BoxCompositionLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every card axis — color × border matrix, BoxHeader visual states, BoxFooter alignment, and BoxImage variants — in a single scrollable view.',
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
            description="The same Box composition (header + content) across the eight semantic colors and four border treatments. useBackgroundColor is true here — the live demo above lets you flip it off so only the border carries color."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-[8rem_repeat(4,1fr)] gap-3 items-center">
              <div></div>
              <div class="text-xs uppercase text-fg-muted text-center">bordered</div>
              <div class="text-xs uppercase text-fg-muted text-center">border-thick</div>
              <div class="text-xs uppercase text-fg-muted text-center">border-emphasize</div>
              <div class="text-xs uppercase text-fg-muted text-center">borderless</div>

              <div class="text-xs text-fg-muted">Primary</div>
              <org-box color="primary" border="bordered">
                <org-box-header title="Primary" subtitle="bordered" />
              </org-box>
              <org-box color="primary" border="border-thick">
                <org-box-header title="Primary" subtitle="border-thick" />
              </org-box>
              <org-box color="primary" border="border-emphasize">
                <org-box-header title="Primary" subtitle="border-emphasize" />
              </org-box>
              <org-box color="primary" border="borderless">
                <org-box-header title="Primary" subtitle="borderless" />
              </org-box>

              <div class="text-xs text-fg-muted">Secondary</div>
              <org-box color="secondary" border="bordered">
                <org-box-header title="Secondary" subtitle="bordered" />
              </org-box>
              <org-box color="secondary" border="border-thick">
                <org-box-header title="Secondary" subtitle="border-thick" />
              </org-box>
              <org-box color="secondary" border="border-emphasize">
                <org-box-header title="Secondary" subtitle="border-emphasize" />
              </org-box>
              <org-box color="secondary" border="borderless">
                <org-box-header title="Secondary" subtitle="borderless" />
              </org-box>

              <div class="text-xs text-fg-muted">Neutral</div>
              <org-box color="neutral" border="bordered">
                <org-box-header title="Neutral" subtitle="bordered" />
              </org-box>
              <org-box color="neutral" border="border-thick">
                <org-box-header title="Neutral" subtitle="border-thick" />
              </org-box>
              <org-box color="neutral" border="border-emphasize">
                <org-box-header title="Neutral" subtitle="border-emphasize" />
              </org-box>
              <org-box color="neutral" border="borderless">
                <org-box-header title="Neutral" subtitle="borderless" />
              </org-box>

              <div class="text-xs text-fg-muted">Safe</div>
              <org-box color="safe" border="bordered">
                <org-box-header title="Safe" subtitle="bordered" />
              </org-box>
              <org-box color="safe" border="border-thick">
                <org-box-header title="Safe" subtitle="border-thick" />
              </org-box>
              <org-box color="safe" border="border-emphasize">
                <org-box-header title="Safe" subtitle="border-emphasize" />
              </org-box>
              <org-box color="safe" border="borderless">
                <org-box-header title="Safe" subtitle="borderless" />
              </org-box>

              <div class="text-xs text-fg-muted">Info</div>
              <org-box color="info" border="bordered">
                <org-box-header title="Info" subtitle="bordered" />
              </org-box>
              <org-box color="info" border="border-thick">
                <org-box-header title="Info" subtitle="border-thick" />
              </org-box>
              <org-box color="info" border="border-emphasize">
                <org-box-header title="Info" subtitle="border-emphasize" />
              </org-box>
              <org-box color="info" border="borderless">
                <org-box-header title="Info" subtitle="borderless" />
              </org-box>

              <div class="text-xs text-fg-muted">Caution</div>
              <org-box color="caution" border="bordered">
                <org-box-header title="Caution" subtitle="bordered" />
              </org-box>
              <org-box color="caution" border="border-thick">
                <org-box-header title="Caution" subtitle="border-thick" />
              </org-box>
              <org-box color="caution" border="border-emphasize">
                <org-box-header title="Caution" subtitle="border-emphasize" />
              </org-box>
              <org-box color="caution" border="borderless">
                <org-box-header title="Caution" subtitle="borderless" />
              </org-box>

              <div class="text-xs text-fg-muted">Warning</div>
              <org-box color="warning" border="bordered">
                <org-box-header title="Warning" subtitle="bordered" />
              </org-box>
              <org-box color="warning" border="border-thick">
                <org-box-header title="Warning" subtitle="border-thick" />
              </org-box>
              <org-box color="warning" border="border-emphasize">
                <org-box-header title="Warning" subtitle="border-emphasize" />
              </org-box>
              <org-box color="warning" border="borderless">
                <org-box-header title="Warning" subtitle="borderless" />
              </org-box>

              <div class="text-xs text-fg-muted">Danger</div>
              <org-box color="danger" border="bordered">
                <org-box-header title="Danger" subtitle="bordered" />
              </org-box>
              <org-box color="danger" border="border-thick">
                <org-box-header title="Danger" subtitle="border-thick" />
              </org-box>
              <org-box color="danger" border="border-emphasize">
                <org-box-header title="Danger" subtitle="border-emphasize" />
              </org-box>
              <org-box color="danger" border="borderless">
                <org-box-header title="Danger" subtitle="borderless" />
              </org-box>
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
            title="BoxHeader · visual states"
            description="Every spec'd combination of title, subtitle, and the actions slot, plus the muted / emphasized title modifiers. Title uses font-size-lg / semibold; subtitle is font-size-base / muted; subtitle stacks below the title with actions to the right."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-[10rem_1fr] gap-3 items-center">
              <div class="text-xs uppercase text-fg-muted">Title only</div>
              <org-box>
                <org-box-header title="Project settings" />
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Title + subtitle</div>
              <org-box>
                <org-box-header title="Project settings" subtitle="Configuration shared across every environment." />
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Muted variant</div>
              <org-box>
                <org-box-header
                  variant="muted"
                  title="Project settings"
                  subtitle="Configuration shared across every environment."
                />
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Emphasized title</div>
              <org-box>
                <org-box-header
                  [isEmphasized]="true"
                  title="Project settings"
                  subtitle="Configuration shared across every environment."
                />
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Muted + emphasized</div>
              <org-box>
                <org-box-header
                  variant="muted"
                  [isEmphasized]="true"
                  title="Project settings"
                  subtitle="Configuration shared across every environment."
                />
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Title + actions</div>
              <org-box>
                <org-box-header title="Project settings">
                  <ng-template #actions>
                    <org-button variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
                  </ng-template>
                </org-box-header>
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Title + subtitle + actions</div>
              <org-box>
                <org-box-header title="Project settings" subtitle="Configuration shared across every environment.">
                  <ng-template #actions>
                    <org-button variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
                  </ng-template>
                </org-box-header>
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Title + subtitle + divider</div>
              <org-box>
                <org-box-header
                  title="Project settings"
                  subtitle="Configuration shared across every environment."
                  [hasDivider]="true"
                />
                <org-box-content>A divider separates the header from the content using the box's main section gap.</org-box-content>
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Title + pre icon</div>
              <org-box>
                <org-box-header title="Project settings">
                  <org-icon pre name="info" />
                </org-box-header>
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Pre icon + subtitle + actions</div>
              <org-box>
                <org-box-header title="Project settings" subtitle="Configuration shared across every environment.">
                  <org-icon pre name="info" />
                  <ng-template #actions>
                    <org-button variant="text" color="neutral" label="More" preIcon="ellipsis" [iconOnly]="true" ariaLabel="More" />
                  </ng-template>
                </org-box-header>
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Actions only</div>
              <org-box>
                <org-box-header>
                  <ng-template #actions>
                    <div class="flex gap-1">
                      <org-button variant="ghost" color="neutral" size="sm" label="Filter" />
                      <org-button color="primary" size="sm" label="New" />
                    </div>
                  </ng-template>
                </org-box-header>
              </org-box>

              <div class="text-xs uppercase text-fg-muted">Empty</div>
              <org-box>
                <org-box-header />
              </org-box>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Title only</strong>: Single-line heading with no actions</li>
            <li><strong>Title + subtitle</strong>: Subtitle stacks underneath the title in the same column</li>
            <li><strong>Muted variant</strong>: <code>variant="muted"</code> renders the title in the muted foreground color (subtitle is already muted)</li>
            <li><strong>Emphasized title</strong>: <code>[isEmphasized]="true"</code> visually uppercases the title via <code>text-transform</code>; the underlying title text is unchanged for assistive tech</li>
            <li><strong>Muted + emphasized</strong>: The two title modifiers are orthogonal and combine — a muted, uppercased title</li>
            <li><strong>Title + actions</strong>: Title hugs left, actions hug right via grid <code>1fr auto</code></li>
            <li><strong>Title + subtitle + actions</strong>: Titles column stays left-aligned even when actions are present</li>
            <li><strong>Title + subtitle + divider</strong>: <code>[hasDivider]=true</code> renders an <code>org-divider</code> below the header content, spaced by the box's main section gap</li>
            <li><strong>Pre slot</strong>: Project content with the <code>pre</code> attribute selector to render it inline before the title (e.g. a leading icon); the slot collapses to nothing when empty</li>
            <li><strong>Actions only</strong>: Header auto-detects actions-only mode (no title / no subtitle) and right-aligns the actions in a single full-width column</li>
            <li><strong>Empty</strong>: Renders no content; useful when the surrounding card composition needs no header semantics</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="BoxFooter · alignment"
            description="Footer renders a button row. Three alignment values control horizontal placement."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <org-box>
                <org-box-content>Aligned <code>start</code> (left).</org-box-content>
                <org-box-footer alignment="start">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-box-footer>
              </org-box>
              <org-box>
                <org-box-content>Aligned <code>center</code>.</org-box-content>
                <org-box-footer alignment="center">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-box-footer>
              </org-box>
              <org-box>
                <org-box-content>Aligned <code>end</code> (right) — the most common pattern.</org-box-content>
                <org-box-footer alignment="end">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-box-footer>
              </org-box>
              <org-box>
                <org-box-content>With a top divider via <code>[hasDivider]=true</code>.</org-box-content>
                <org-box-footer alignment="end" [hasDivider]="true">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-box-footer>
              </org-box>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>start</strong>: Buttons hug the left edge</li>
            <li><strong>center</strong>: Buttons centered horizontally</li>
            <li><strong>end</strong>: Buttons hug the right edge (default)</li>
            <li><strong>divider</strong>: <code>[hasDivider]=true</code> renders an <code>org-divider</code> above the button row, spaced by the box's main section gap</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="BoxImage · variants"
            description="Image bleeds to the card edges and inherits the rounded outer corners only when it sits at the top or bottom. Constrained-width and bottom-position modes are also shown."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-3 gap-3 items-start">
              <org-box>
                <org-box-image src="${SAMPLE_IMAGE_TOP}" alt="Workspace photo" />
                <org-box-header title="Full-width · top" subtitle="Image rounds the top corners only." />
              </org-box>

              <org-box>
                <org-box-header title="Constrained" subtitle="Inset image with the card's gutter." />
                <org-box-image src="${SAMPLE_IMAGE_INSET}" alt="Workspace photo" [fullWidth]="false" />
                <org-box-content>Body content underneath an inset image.</org-box-content>
              </org-box>

              <org-box>
                <org-box-content>Image at the bottom rounds the bottom corners only.</org-box-content>
                <org-box-image src="${SAMPLE_IMAGE_BOTTOM}" alt="Workspace photo" />
              </org-box>
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
            title="Padding application"
            description="The same composition (full-width image + header with divider + content + footer with divider, plus a constrained image) under both paddingApplication modes. In inner-items the dividers reach the box border while the content stays inset."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-3 items-start">
              <org-box paddingApplication="container">
                <org-box-image src="${SAMPLE_IMAGE_TOP}" alt="Workspace photo" />
                <org-box-header title="container (default)" subtitle="Padding sits on the box surface." [hasDivider]="true" />
                <org-box-content>The header / footer dividers are inset from the box border by the padding.</org-box-content>
                <org-box-image src="${SAMPLE_IMAGE_INSET}" alt="Inset photo" [fullWidth]="false" />
                <org-box-footer [hasDivider]="true">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-box-footer>
              </org-box>

              <org-box paddingApplication="inner-items">
                <org-box-image src="${SAMPLE_IMAGE_TOP}" alt="Workspace photo" />
                <org-box-header title="inner-items" subtitle="Padding moves into the regions." [hasDivider]="true" />
                <org-box-content>The dividers render full-bleed to the box border while the content stays inset.</org-box-content>
                <org-box-image src="${SAMPLE_IMAGE_INSET}" alt="Inset photo" [fullWidth]="false" />
                <org-box-footer [hasDivider]="true">
                  <org-button color="neutral" variant="ghost" label="Cancel" />
                  <org-button color="primary" label="Save" />
                </org-box-footer>
              </org-box>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>container</strong> (default): the padding amount is applied to the box surface, insetting every region — dividers included — from the box border</li>
            <li><strong>inner-items</strong>: the surface padding is removed and applied inside each region, so header / footer dividers render full-bleed to the box border while their content stays inset</li>
            <li><strong>Inline padding</strong>: every region's content gets the left / right padding; the first region gets the top padding and the last gets the bottom padding</li>
            <li><strong>Shared gap</strong>: the gap between regions is the same in both modes — only the surface-vs-region placement of the padding changes</li>
            <li><strong>Image</strong>: a full-width image still bleeds to all edges; a constrained (<code>[fullWidth]=false</code>) image picks up the same inline inset as the other regions</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-box-composition-clickable-showcase />

        <story-box-composition-expandable-showcase />
      </div>
    `,
    moduleMetadata: {
      imports: [
        Box,
        BoxHeader,
        BoxImage,
        BoxContent,
        BoxFooter,
        Button,
        Icon,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        BoxCompositionClickableShowcaseStory,
        BoxCompositionExpandableShowcaseStory,
      ],
    },
  }),
};
