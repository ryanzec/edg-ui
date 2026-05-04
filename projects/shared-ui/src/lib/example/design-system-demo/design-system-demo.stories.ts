import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Button } from '../../core/button/button';
import { ButtonGroup } from '../../core/button/button-group';
import { ButtonToggle, ButtonToggleItem } from '../../core/button-toggle/button-toggle';
import { DesignSystemDemo } from './design-system-demo';
import { DesignSystemDemoCanvas } from './design-system-demo-canvas';
import { DesignSystemDemoControls } from './design-system-demo-controls';
import { DesignSystemDemoHeader } from './design-system-demo-header';

const themeItems: ButtonToggleItem[] = [
  { label: 'Light', value: 'light', buttonColor: 'primary' },
  { label: 'Dark', value: 'dark', buttonColor: 'primary' },
];

const densityItems: ButtonToggleItem[] = [
  { label: 'Compact', value: 'compact', buttonColor: 'primary' },
  { label: 'Cozy', value: 'cozy', buttonColor: 'primary' },
];

const variantItems: ButtonToggleItem[] = [
  { label: 'WD', value: 'wd', buttonColor: 'primary' },
  { label: 'WS', value: 'ws', buttonColor: 'primary' },
  { label: 'WG', value: 'wg', buttonColor: 'primary' },
];

const intensityItems: ButtonToggleItem[] = [
  { label: 'On', value: 'on', buttonColor: 'primary' },
  { label: 'Off', value: 'off', buttonColor: 'primary' },
];

type MatrixColumn = { label: string; tone: 'light' | 'dark' };
type MatrixRow = { label: string; cssVar: string };

const matrixColumns: MatrixColumn[] = [
  { label: 'Light', tone: 'light' },
  { label: 'Dark', tone: 'dark' },
];

const matrixRows: MatrixRow[] = [
  { label: 'Red', cssVar: '--color-red-soft' },
  { label: 'Green', cssVar: '--color-green-soft' },
  { label: 'Blue', cssVar: '--color-blue-soft' },
  { label: 'Purple', cssVar: '--color-purple-soft' },
];

@Component({
  selector: 'story-design-system-demo-anatomy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoCanvas,
    Button,
    ButtonGroup,
    ButtonToggle,
  ],
  styles: [
    `
      :host {
        display: block;
        background-color: var(--color-bg-app);
        color: var(--color-fg);
        padding: var(--spacing-8);
        min-height: 100vh;
      }
      .page {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-8);
        max-width: 80rem; /* 1280px */
        margin: 0 auto;
      }
      .page-header {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
      }
      .page-eyebrow {
        color: var(--design-system-demo-page-eyebrow-color);
        font-size: var(--design-system-demo-header-eyebrow-font-size);
        font-weight: var(--design-system-demo-header-eyebrow-font-weight);
        letter-spacing: var(--design-system-demo-header-eyebrow-letter-spacing);
        text-transform: uppercase;
      }
      .page-title {
        margin: 0;
        color: var(--design-system-demo-page-title-color);
        font-size: var(--font-size-4xl);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
      }
      .page-description {
        margin: 0;
        max-width: 48rem; /* 768px */
        color: var(--design-system-demo-page-description-color);
        font-size: var(--font-size-base);
        line-height: var(--line-height-normal);
      }
      .annotation {
        display: flex;
        flex-direction: column;
        gap: var(--design-system-demo-annotation-row-gap);
        margin: 0;
        padding: 0;
      }
      .annotation-row {
        display: grid;
        grid-template-columns: minmax(6.5rem, 8rem) minmax(0, 1fr); /* 104-128 | rest */
        column-gap: var(--design-system-demo-annotation-column-gap);
        align-items: baseline;
      }
      .annotation-row dt {
        margin: 0;
        color: var(--design-system-demo-annotation-key-color);
        font-family: var(--design-system-demo-annotation-font-family);
        font-size: var(--design-system-demo-annotation-font-size);
        font-weight: var(--design-system-demo-annotation-key-font-weight);
        letter-spacing: var(--design-system-demo-annotation-key-letter-spacing);
        line-height: var(--design-system-demo-annotation-line-height);
        text-transform: uppercase;
      }
      .annotation-row dd {
        margin: 0;
        color: var(--design-system-demo-annotation-value-color);
        font-family: var(--design-system-demo-annotation-font-family);
        font-size: var(--design-system-demo-annotation-font-size);
        line-height: var(--design-system-demo-annotation-line-height);
      }
      .annotation-token {
        color: var(--design-system-demo-annotation-token-color);
      }
      .demo-label {
        color: var(--color-fg-muted);
        font-family: var(--font-mono);
        font-size: var(--font-size-2xs);
        letter-spacing: var(--letter-spacing-wide);
        text-transform: uppercase;
      }
      .demo-title-row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-1);
      }
      .demo-title-row .heading {
        margin: 0;
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        line-height: var(--line-height-tight);
      }
      .demo-title-row .subtitle {
        color: var(--color-fg-muted);
        font-size: var(--font-size-sm);
      }
      .demo-section-card {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
        background-color: var(--color-bg-surface);
        border: var(--border-width) solid var(--color-border-soft);
        border-radius: var(--radius-sm);
      }
      .matrix {
        display: grid;
        gap: var(--spacing-2);
      }
      .matrix-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 2.5rem; /* 40px */
        padding: var(--spacing-2);
        border-radius: var(--radius-xs);
        font-family: var(--font-mono);
        font-size: var(--font-size-2xs);
        color: var(--color-fg);
      }
      .matrix-cell.is-header {
        font-size: var(--font-size-2xs);
        color: var(--color-fg-muted);
        letter-spacing: var(--letter-spacing-wide);
        text-transform: uppercase;
        background-color: transparent;
      }
      .padding-hero {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 5rem; /* 80px */
        padding: var(--spacing-8);
        background-color: var(--color-info-soft);
        border-radius: var(--radius-sm);
      }
      .padding-hero .padding-inner {
        padding: var(--spacing-3) var(--spacing-5);
        background-color: var(--color-bg-surface);
        border-radius: var(--radius-xs);
        font-family: var(--font-mono);
        font-size: var(--font-size-xs);
      }
      .label-pill {
        display: inline-flex;
        align-items: center;
        padding: var(--spacing-1) var(--spacing-2);
        background-color: var(--color-bg-surface);
        border: var(--border-width) solid var(--color-border-soft);
        border-radius: var(--radius-pill);
        font-family: var(--font-mono);
        font-size: var(--font-size-2xs);
        color: var(--color-fg-muted);
        letter-spacing: var(--letter-spacing-wide);
        text-transform: uppercase;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }
      .row {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        flex-wrap: wrap;
      }
    `,
  ],
  template: `
    <div class="page">
      <header class="page-header">
        <div class="page-eyebrow">Org · Design System · Components</div>
        <h1 class="page-title">Demo Section · Anatomy</h1>
        <p class="page-description">
          The reference frame every component page uses to introduce a single variant in visual example. A header, a
          description, an optional control row for live tweaking, and the demo surface itself — combined into a unified
          specification documentation block, enough to reproduce the pattern in any framework without reading the
          implementation.
        </p>
      </header>

      <!-- 1. At a glance -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          eyebrow="Section 01"
          title="At a glance"
          description="The header pairs an eyebrow label, a title, and a short description that sets context for the demo body. Use this section to anchor the example before it appears."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="matrix" style="grid-template-columns: 4rem repeat(2, 1fr)">
            <div class="matrix-cell is-header"></div>
            @for (column of matrixColumns; track column.label) {
              <div class="matrix-cell is-header">{{ column.label }}</div>
            }
            @for (row of matrixRows; track row.label) {
              <div class="matrix-cell is-header">{{ row.label }}</div>
              @for (column of matrixColumns; track column.label) {
                <div class="matrix-cell" [style.background-color]="'var(' + row.cssVar + ')'">aa</div>
              }
            }
          </div>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Heading</dt>
            <dd>Eyebrow + title + description; <span class="annotation-token">--font-size-2xl</span> for title.</dd>
          </div>
          <div class="annotation-row">
            <dt>Body</dt>
            <dd>Demo on the left, annotation column on the right.</dd>
          </div>
          <div class="annotation-row">
            <dt>Surface</dt>
            <dd>
              <span class="annotation-token">--color-bg-surface</span> with
              <span class="annotation-token">--color-border-soft</span> border.
            </dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 2. Structure -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Structure"
          description="How each part composes vertically. The body of the cell is a single column with the visual stage on top and a footer slot, which the page can then opt in or out of."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="demo-section-card">
            <div class="demo-title-row">
              <h3 class="heading">Title row</h3>
              <span class="subtitle">Short description</span>
            </div>
            <div class="row">
              <span class="label-pill">aa</span>
              <span class="label-pill">bb</span>
              <span class="label-pill">cc</span>
            </div>
            <div
              class="matrix-cell"
              style="min-height: 4rem; background-color: var(--color-bg-surface-2); border: 1px dashed var(--color-border-soft)"
            >
              demo body
            </div>
          </div>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Display</dt>
            <dd>Vertical stack: flex column.</dd>
          </div>
          <div class="annotation-row">
            <dt>Gap</dt>
            <dd><span class="annotation-token">--spacing-3</span> between title row and body.</dd>
          </div>
          <div class="annotation-row">
            <dt>Border</dt>
            <dd>
              <span class="annotation-token">--color-border-soft</span> ·
              <span class="annotation-token">--border-width</span>.
            </dd>
          </div>
          <div class="annotation-row">
            <dt>Background</dt>
            <dd><span class="annotation-token">--color-bg-surface</span>.</dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 3. Header -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Header"
          description="The compact text row. Together they answer 'what am I looking at?' before the eye reaches the demo."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="demo-section-card">
            <div class="demo-title-row">
              <h3 class="heading">Realistic filling</h3>
              <span class="subtitle"
                >Two lines of text demonstrate spacing among different compositions — short main title, longer
                supporting copy, optional metadata.</span
              >
            </div>
          </div>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Display</dt>
            <dd>Vertical stack. Title sits above description.</dd>
          </div>
          <div class="annotation-row">
            <dt>Spacing</dt>
            <dd>
              <span class="annotation-token">--spacing-1</span> between title and description;
              <span class="annotation-token">--spacing-2</span> to the body section beneath.
            </dd>
          </div>
          <div class="annotation-row">
            <dt>Eyebrow</dt>
            <dd>
              Optional. <span class="annotation-token">--design-system-demo-header-eyebrow-color</span>; uppercase;
              tracked.
            </dd>
          </div>
          <div class="annotation-row">
            <dt>Divider</dt>
            <dd>None. The header is two flex items stacked vertically.</dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 4. Title -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Title" description="Just the heading element." />
        <org-design-system-demo-canvas slot="canvas">
          <h2
            style="margin: 0; font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); line-height: var(--line-height-tight)"
          >
            Color + border matrix
          </h2>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Element</dt>
            <dd>Heading 2. The page always provides the heading 1.</dd>
          </div>
          <div class="annotation-row">
            <dt>Font Family</dt>
            <dd><span class="annotation-token">--font-sans</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Font Size</dt>
            <dd><span class="annotation-token">--font-size-2xl</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Font Weight</dt>
            <dd><span class="annotation-token">--font-weight-semibold</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Line Height</dt>
            <dd><span class="annotation-token">--line-height-tight</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Color</dt>
            <dd><span class="annotation-token">--color-fg</span>.</dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 5. Description -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Description" description="Just the description text." />
        <org-design-system-demo-canvas slot="canvas">
          <p
            style="margin: 0; max-width: 32rem; color: var(--color-fg-muted); font-size: var(--font-size-sm); line-height: var(--line-height-normal)"
          >
            One example per section. We have at least 30 word for spacing, but it can be a touch longer if it has to to
            land with the right reading. Wrap to a second line.
          </p>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Element</dt>
            <dd>Paragraph.</dd>
          </div>
          <div class="annotation-row">
            <dt>Font Family</dt>
            <dd><span class="annotation-token">--font-sans</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Font Size</dt>
            <dd><span class="annotation-token">--font-size-sm</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Color</dt>
            <dd><span class="annotation-token">--color-fg-muted</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Width</dt>
            <dd>
              One sentence; isn't reader fatigue. The reading lane is constrained: in a contained area below other
              props.
            </dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 6. Controls -->
      <form [formGroup]="anatomyForm">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Controls"
            description="Optional row of live toggles. Wraps to one line when the canvas gets narrow. Most pages use it to swap a small number of related variants."
          />
          <org-design-system-demo-controls slot="controls">
            <org-button-toggle [items]="themeItems" formControlName="theme" />
            <org-button-toggle [items]="densityItems" formControlName="density" />
            <org-button-group>
              <org-button variant="soft" color="primary" size="sm">aa</org-button>
              <org-button variant="soft" color="primary" size="sm">bb</org-button>
            </org-button-group>
          </org-design-system-demo-controls>
          <org-design-system-demo-canvas slot="canvas">
            <div class="row">
              <span class="label-pill">theme: {{ anatomyForm.controls.theme.value }}</span>
              <span class="label-pill">density: {{ anatomyForm.controls.density.value }}</span>
            </div>
          </org-design-system-demo-canvas>
          <dl class="annotation" slot="annotation">
            <div class="annotation-row">
              <dt>Display</dt>
              <dd>
                Horizontal cluster, wraps to one line when there's not enough room. Sits atop the canvas in a narrow
                margin.
              </dd>
            </div>
            <div class="annotation-row">
              <dt>Gap</dt>
              <dd>
                <span class="annotation-token">--spacing-3</span> between adjacent control groups. Wider than
                <span class="annotation-token">--spacing-1</span> so each group reads as a unit.
              </dd>
            </div>
            <div class="annotation-row">
              <dt>Alignment</dt>
              <dd>
                <span class="annotation-token">align-items: center</span>;
                <span class="annotation-token">justify-content: flex-start</span>.
              </dd>
            </div>
            <div class="annotation-row">
              <dt>Surface</dt>
              <dd>None. Transparent: it inherits the section background without compositing.</dd>
            </div>
            <div class="annotation-row">
              <dt>Sizing</dt>
              <dd>
                <span class="annotation-token">--button-toggle-padding</span> ·
                <span class="annotation-token">--button-padding-y-base</span> baseline.
              </dd>
            </div>
          </dl>
        </org-design-system-demo>
      </form>

      <!-- 7. Control group -->
      <form [formGroup]="anatomyForm">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Control group"
            description="A single bound segmented switch. Several can be placed inside one Controls row above."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-toggle [items]="densityItems" formControlName="density" />
          </org-design-system-demo-canvas>
          <dl class="annotation" slot="annotation">
            <div class="annotation-row">
              <dt>Element</dt>
              <dd><span class="annotation-token">org-button-toggle</span>.</dd>
            </div>
            <div class="annotation-row">
              <dt>Composition</dt>
              <dd><span class="annotation-token">org-button-group</span> — two buttons.</dd>
            </div>
          </dl>
        </org-design-system-demo>
      </form>

      <!-- 8. Label -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Label" description="Inline text." />
        <org-design-system-demo-canvas slot="canvas">
          <span class="label-pill">background</span>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Font Family</dt>
            <dd><span class="annotation-token">--font-mono</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Font Size</dt>
            <dd><span class="annotation-token">--font-size-2xs</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Letter Spacing</dt>
            <dd><span class="annotation-token">--letter-spacing-wide</span>.</dd>
          </div>
          <div class="annotation-row">
            <dt>Transform</dt>
            <dd>uppercase.</dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 9. Segmented switch -->
      <form [formGroup]="anatomyForm">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Segmented switch"
            description="Pill-style binary or n-ary toggle, used in the controls row to swap variants in place."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-toggle [items]="variantItems" formControlName="variant" />
          </org-design-system-demo-canvas>
          <dl class="annotation" slot="annotation">
            <div class="annotation-row">
              <dt>Display</dt>
              <dd>Inline-flex.</dd>
            </div>
            <div class="annotation-row">
              <dt>Background</dt>
              <dd><span class="annotation-token">--button-toggle-background</span>.</dd>
            </div>
            <div class="annotation-row">
              <dt>Border</dt>
              <dd><span class="annotation-token">--button-toggle-border</span>.</dd>
            </div>
            <div class="annotation-row">
              <dt>Padding</dt>
              <dd><span class="annotation-token">--button-toggle-padding</span>.</dd>
            </div>
          </dl>
        </org-design-system-demo>
      </form>

      <!-- 10. Demo -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Demo"
          description="The visual area itself. Everything inside is the consumer's own composition: the demo can be the surface and a default control system that's analyzed elsewhere."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="matrix" style="grid-template-columns: 4rem repeat(2, 1fr)">
            <div class="matrix-cell is-header"></div>
            @for (column of matrixColumns; track column.label) {
              <div class="matrix-cell is-header">{{ column.label }}</div>
            }
            @for (row of matrixRows; track row.label) {
              <div class="matrix-cell is-header">{{ row.label }}</div>
              @for (column of matrixColumns; track column.label) {
                <div class="matrix-cell" [style.background-color]="'var(' + row.cssVar + ')'">aa</div>
              }
            }
          </div>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Display</dt>
            <dd>Vertical stack. Subjects rendered all in a constant header.</dd>
          </div>
          <div class="annotation-row">
            <dt>Gap</dt>
            <dd>
              <span class="annotation-token">--spacing-2</span> between rows; slightly tighter than the surrounding
              section's <span class="annotation-token">--spacing-3</span> so it reads as a tighter cluster.
            </dd>
          </div>
          <div class="annotation-row">
            <dt>Surface</dt>
            <dd><span class="annotation-token">--design-system-demo-canvas-background</span> with dashed border.</dd>
          </div>
          <div class="annotation-row">
            <dt>Sizing</dt>
            <dd><span class="annotation-token">--design-system-demo-canvas-padding</span> on all sides.</dd>
          </div>
          <div class="annotation-row">
            <dt>Overflow</dt>
            <dd>The demo is in flex, not aspect-locked.</dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 11. Idea cluster -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Idea cluster"
          description="Horizontal cluster, drops into a constant block: when the row gets narrow it stacks below labels, sticking with the cluster underneath them."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="row">
            <span class="label-pill">aa</span>
            <span class="label-pill">bb</span>
            <span class="label-pill">cc</span>
            <span class="label-pill">dd</span>
          </div>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Display</dt>
            <dd>Inline cluster: flex with wrap.</dd>
          </div>
          <div class="annotation-row">
            <dt>Gap</dt>
            <dd><span class="annotation-token">--spacing-2</span>. Tighter than control gaps.</dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 12. Matrix -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Matrix"
          description="A two-axis grid of swatches. Used in a constant column header that aligns to columns; rows get a sticky label on the left."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="matrix" style="grid-template-columns: 5rem repeat(2, 1fr)">
            <div class="matrix-cell is-header"></div>
            @for (column of matrixColumns; track column.label) {
              <div class="matrix-cell is-header">{{ column.label }}</div>
            }
            @for (row of matrixRows; track row.label) {
              <div class="matrix-cell is-header">{{ row.label }}</div>
              @for (column of matrixColumns; track column.label) {
                <div class="matrix-cell" [style.background-color]="'var(' + row.cssVar + ')'">{{ column.tone }}</div>
              }
            }
          </div>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Dimensions</dt>
            <dd>
              One row per swatch group; one column per tone variant. Labels track
              <span class="annotation-token">--font-size-2xs</span>.
            </dd>
          </div>
          <div class="annotation-row">
            <dt>Cell Min Height</dt>
            <dd>2.5rem so a single line stays vertically centered without collapsing.</dd>
          </div>
          <div class="annotation-row">
            <dt>Gap</dt>
            <dd><span class="annotation-token">--spacing-2</span> between adjacent cells.</dd>
          </div>
          <div class="annotation-row">
            <dt>Row Label</dt>
            <dd>Left column, no background, muted color.</dd>
          </div>
          <div class="annotation-row">
            <dt>Column Label</dt>
            <dd>Top row, same treatment as row labels.</dd>
          </div>
        </dl>
      </org-design-system-demo>

      <!-- 13. Worked example -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Worked example"
          description="All four parts in concrete combinations together: a real component page combining header, controls, canvas, and annotation in one drop, no abstraction."
        />
        <org-design-system-demo-controls slot="controls">
          <org-button-toggle [items]="intensityItems" formControlName="intensity" />
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="stack">
            <div class="demo-title-row">
              <h3 class="heading">Worked example heading</h3>
              <span class="subtitle">Composed using all four parts above, just like a real page would.</span>
            </div>
            <div class="row">
              <span class="label-pill">intensity: {{ anatomyForm.controls.intensity.value }}</span>
              <span class="label-pill">{{ anatomyForm.controls.theme.value }}</span>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>

      <!-- 14. Padding -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Padding"
          description="The padding hero — same in. is one striking visual: shows the inset that frames every demo without distracting from the demo itself."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="padding-hero">
            <div class="padding-inner">demo</div>
          </div>
        </org-design-system-demo-canvas>
        <dl class="annotation" slot="annotation">
          <div class="annotation-row">
            <dt>Outer</dt>
            <dd><span class="annotation-token">--spacing-8</span> on all sides — the section frame.</dd>
          </div>
          <div class="annotation-row">
            <dt>Inner</dt>
            <dd>
              <span class="annotation-token">--spacing-3</span> top/bottom ·
              <span class="annotation-token">--spacing-5</span> left/right around the demo content.
            </dd>
          </div>
          <div class="annotation-row">
            <dt>Background</dt>
            <dd>
              Outer: <span class="annotation-token">--color-info-soft</span>. Inner:
              <span class="annotation-token">--color-bg-surface</span>.
            </dd>
          </div>
        </dl>
      </org-design-system-demo>
    </div>
  `,
})
class DesignSystemDemoAnatomyStory {
  protected readonly themeItems = themeItems;
  protected readonly densityItems = densityItems;
  protected readonly variantItems = variantItems;
  protected readonly intensityItems = intensityItems;
  protected readonly matrixColumns = matrixColumns;
  protected readonly matrixRows = matrixRows;

  protected readonly anatomyForm = new FormGroup({
    theme: new FormControl<string>('light', { nonNullable: true }),
    density: new FormControl<string>('cozy', { nonNullable: true }),
    variant: new FormControl<string>('wd', { nonNullable: true }),
    intensity: new FormControl<string>('on', { nonNullable: true }),
  });
}

const meta: Meta = {
  title: 'Examples/Design System Demo/Anatomy',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">

# Demo Section · Anatomy

The vertical frame every component page uses to introduce one variant in visual example. A header, title, description, an optional control row for live tweaking, and the demo surface itself — combined into a unified specification documentation block, enough to reproduce the pattern in any framework without reading the implementation.

## Components

- **\`org-design-system-demo\`** — outer frame; lays out a header slot, a stage area (controls + canvas), and an optional annotation column
- **\`org-design-system-demo-header\`** — title + description + optional eyebrow label
- **\`org-design-system-demo-controls\`** — horizontal row that wraps any number of toggles / buttons used to drive the demo
- **\`org-design-system-demo-canvas\`** — the dashed-bordered visual stage where the actual demo content lives

## Slot composition

\`\`\`html
<org-design-system-demo>
  <org-design-system-demo-header slot="header" title="Title" description="..." />
  <org-design-system-demo-controls slot="controls">
    <!-- any controls -->
  </org-design-system-demo-controls>
  <org-design-system-demo-canvas slot="canvas">
    <!-- demo visual -->
  </org-design-system-demo-canvas>
  <dl slot="annotation">
    <!-- annotation rows -->
  </dl>
</org-design-system-demo>
\`\`\`

</div>
        `,
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [DesignSystemDemoAnatomyStory],
    }),
  ],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full anatomy page rendered as a single fullscreen story. Each of the 14 anatomy sections is an instance of `org-design-system-demo` composing the header / controls / canvas / annotation slots.',
      },
    },
  },
  render: () => ({
    template: `<story-design-system-demo-anatomy />`,
  }),
};
