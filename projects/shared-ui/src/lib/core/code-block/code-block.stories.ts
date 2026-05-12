import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Input } from '../input/input';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { CodeBlock, CodeBlockTone, CodeBlockVariant, allCodeBlockTones, allCodeBlockVariants } from './code-block';

const liveDemoVariantItems: ButtonToggleItem[] = allCodeBlockVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoToneItems: ButtonToggleItem[] = allCodeBlockTones.map((tone) => ({
  label: tone,
  value: tone,
  buttonColor: 'primary',
}));

const liveDemoBlockSample = `# Build a release branch and push to the registry
git switch -c release/$(date +%Y.%m.%d)
pnpm install --frozen-lockfile
pnpm run build --filter=@org/components
pnpm run test --filter=@org/components
pnpm changeset publish --tag latest
git push origin HEAD --tags`;

const liveDemoInlineSample = '--color-primary';

const meta: Meta<CodeBlock> = {
  title: 'Core/Components/Code Block',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Code Block Component

  A monospace surface for technical strings, snippets, and token names. Two variants — **inline** (sits in flowing text) and **block** (a card with optional header + copy button).

  ### Features
  - **Block variant**: card with optional header (icon + filename), optional copy affordance, optional line clamp with show-more reveal, and optional wrap mode.
  - **Inline variant**: small chip that sits in flowing text; sized at \`0.85em\` of the surrounding type.
  - **Tones (inline only)**: \`token\`, \`danger\`, \`safe\` for visually distinct chips.
  - **Copy affordance**: composes \`org-button\` with a 1.2s confirm flash on success.
  - **Line clamp**: \`ellipsisAt\` clamps the body to N lines with a fade mask; a "Show more" affordance only renders when the body actually overflows.
  - **Wrap mode**: opt-in pre-wrap rendering for prose-y snippets.

  ### Usage Examples
  \`\`\`html
  <!-- inline -->
  <org-code-block variant="inline" text="--color-primary" />
  <org-code-block variant="inline" tone="token" text="primary.500" />

  <!-- block with header + copy -->
  <org-code-block
    text="const x = 1;"
    headerLabel="app.tsx"
    headerIcon="file"
    [allowCopy]="true"
  />

  <!-- clamped block with show-more -->
  <org-code-block
    [text]="longCode"
    [ellipsisAt]="4"
    [allowCopy]="true"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<CodeBlock>;

export const Default: Story = {
  args: {
    text: 'const greeting = "Hello World";',
    variant: 'block',
    allowCopy: false,
    ellipsisAt: 0,
    tone: 'none',
    wrap: false,
    headerLabel: undefined,
    headerIcon: undefined,
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The code text to display (required).',
    },
    variant: {
      control: 'select',
      options: allCodeBlockVariants,
      description: 'The display variant.',
    },
    allowCopy: {
      control: 'boolean',
      description: 'Whether to render the copy-to-clipboard button (block only).',
    },
    ellipsisAt: {
      control: 'number',
      description: 'Number of lines before clamping; 0 disables the clamp.',
    },
    tone: {
      control: 'select',
      options: allCodeBlockTones,
      description: 'Inline-only tone variant.',
    },
    wrap: {
      control: 'boolean',
      description: 'When true, the block body wraps long lines instead of horizontally scrolling.',
    },
    headerLabel: {
      control: 'text',
      description: 'When set, renders a header bar in the block variant with this label.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default code block with full controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-code-block
        [text]="text"
        [variant]="variant"
        [allowCopy]="allowCopy"
        [ellipsisAt]="ellipsisAt"
        [tone]="tone"
        [wrap]="wrap"
        [headerLabel]="headerLabel"
        [headerIcon]="headerIcon"
      />
    `,
    moduleMetadata: {
      imports: [CodeBlock],
    },
  }),
};

@Component({
  selector: 'story-code-block-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CodeBlock,
    ButtonToggle,
    CheckboxToggle,
    Input,
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
        min-height: 6rem;
      }
      .stage-block {
        width: 32rem;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the variant, header, copy affordance, ellipsis, wrap, and inline tone to see every combination."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          @if (liveDemoForm.controls.variant.value === 'block') {
            <org-design-system-demo-control-group label="Header">
              <org-checkbox-toggle name="live-demo-header" value="header" formControlName="header">
                {{ liveDemoForm.controls.header.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-group>
            @if (liveDemoForm.controls.header.value) {
              <org-design-system-demo-control-group label="Header label">
                <org-input name="live-demo-header-label" formControlName="headerLabel" ariaLabel="Header label" />
              </org-design-system-demo-control-group>
            }
            <org-design-system-demo-control-group label="Copy">
              <org-checkbox-toggle name="live-demo-copy" value="copy" formControlName="allowCopy">
                {{ liveDemoForm.controls.allowCopy.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-group>
            <org-design-system-demo-control-group label="Clamp">
              <org-checkbox-toggle name="live-demo-clamp" value="clamp" formControlName="clamp">
                {{ liveDemoForm.controls.clamp.value ? '4 lines' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-group>
            <org-design-system-demo-control-group label="Wrap">
              <org-checkbox-toggle name="live-demo-wrap" value="wrap" formControlName="wrap">
                {{ liveDemoForm.controls.wrap.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-group>
          }
          @if (liveDemoForm.controls.variant.value === 'inline') {
            <org-design-system-demo-control-group label="Tone">
              <org-button-toggle [items]="toneItems" formControlName="tone" buttonSize="sm" />
            </org-design-system-demo-control-group>
          }
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (liveDemoForm.controls.variant.value === 'block') {
              <div class="stage-block">
                <org-code-block
                  variant="block"
                  [text]="blockSample"
                  [allowCopy]="liveDemoForm.controls.allowCopy.value"
                  [ellipsisAt]="liveDemoForm.controls.clamp.value ? 4 : 0"
                  [wrap]="liveDemoForm.controls.wrap.value"
                  [headerLabel]="liveDemoForm.controls.header.value ? liveDemoForm.controls.headerLabel.value : null"
                  headerIcon="file-text"
                />
              </div>
            } @else {
              <div>
                Override the
                <org-code-block variant="inline" [tone]="liveDemoForm.controls.tone.value" [text]="inlineSample" />
                token to retheme the surface.
              </div>
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class CodeBlockLiveDemoStory {
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly toneItems = liveDemoToneItems;
  protected readonly blockSample = liveDemoBlockSample;
  protected readonly inlineSample = liveDemoInlineSample;

  protected readonly liveDemoForm = new FormGroup({
    variant: new FormControl<CodeBlockVariant>('block', { nonNullable: true }),
    header: new FormControl<boolean>(true, { nonNullable: true }),
    headerLabel: new FormControl<string>('release.sh', { nonNullable: true }),
    allowCopy: new FormControl<boolean>(true, { nonNullable: true }),
    clamp: new FormControl<boolean>(false, { nonNullable: true }),
    wrap: new FormControl<boolean>(false, { nonNullable: true }),
    tone: new FormControl<CodeBlockTone>('none', { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Toggle the variant, header, copy affordance, ellipsis, wrap, and inline tone to walk every combination.',
      },
    },
  },
  render: () => ({
    template: `<story-code-block-live-demo />`,
    moduleMetadata: {
      imports: [CodeBlockLiveDemoStory],
    },
  }),
};

const showcaseHeaderlessSample = `curl -X POST https://api.org.example/v1/projects \\
  -H "Authorization: Bearer $ORG_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"website-redesign","visibility":"private"}'`;

const showcaseTokensSample = `:root {
  --color-primary:        oklch(0.55 0.18 260);
  --color-primary-hover:  oklch(0.49 0.18 260);
  --color-primary-soft:   oklch(0.94 0.04 260);
  --radius-sm: 6px;
  --radius-base: 8px;
}`;

const showcaseLongTsSample = `import { useEffect, useState } from 'react';
import { flags, type FlagKey } from '@org/flags';

// reads a feature flag for the current viewer; subscribes to remote
// updates so the value flips live when an operator toggles it in admin.
export function useFeatureFlag<K extends FlagKey>(key: K, fallback: boolean = false) {
  const [value, setValue] = useState(() => flags.peek(key) ?? fallback);

  useEffect(() => {
    const unsubscribe = flags.subscribe(key, (next) => setValue(next));
    return unsubscribe;
  }, [key]);

  return value;
}`;

const showcaseInstallLogSample = `$ pnpm install
Lockfile is up to date, resolution step is skipped
Progress: resolved 1842, reused 1840, downloaded 2, added 0
Progress: resolved 1842, reused 1840, downloaded 2, added 1/2
Progress: resolved 1842, reused 1840, downloaded 2, added 2/2
Done in 4.2s
> postinstall: applying patches
> patching package @org/components
> patched 1 file, 0 conflicts`;

const showcaseSchemaSample = `create table workspace (
  id          uuid primary key default gen_random_uuid(),
  slug        citext not null unique,
  name        text not null,
  plan        plan_tier not null default 'free',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index workspace_slug_idx on workspace (slug);`;

const showcaseShellSample = `curl https://api.org.example/v1/me \\
  -H "Authorization: Bearer $ORG_TOKEN"`;

const showcaseThemeOverrideSample = `:root[data-brand="acme"] {
  --color-primary:        oklch(0.62 0.16 35);
  --color-primary-hover:  oklch(0.56 0.17 35);
  --color-primary-soft:   oklch(0.95 0.05 35);
}`;

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every code-block variant axis — inline (with tones), block (headerless / with-header / language-tag), truncation (clamped + show-more), and realistic in-context placements.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Inline"
            description="The default variant. Renders as a small chip that sits in flowing text. Sized at 0.85em of the surrounding type so it does not disrupt the line height."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2">
              <p>
                Run <org-code-block variant="inline" text="npm run build" /> to compile the bundle, then push to <org-code-block variant="inline" text="main" />. The output lands in <org-code-block variant="inline" text="dist/" />.
              </p>
              <p>
                To override the primary colour, set the <org-code-block variant="inline" tone="token" text="--color-primary" /> token at the document root. All button variants will pick up the new value through the cascade.
              </p>
              <p>
                Calling <org-code-block variant="inline" text="delete()" /> on a record is <org-code-block variant="inline" tone="danger" text="irreversible" /> — use the soft-delete API for anything user-facing.
              </p>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span>TONE</span>
              <org-code-block variant="inline" text="default" />
              <org-code-block variant="inline" tone="token" text="--color-primary" />
              <org-code-block variant="inline" tone="safe" text="200 OK" />
              <org-code-block variant="inline" tone="danger" text="404 Not Found" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Inline chips never break mid-token; whitespace between chips still wraps normally</li>
            <li><strong>token</strong>: tinted backdrop for design-token references</li>
            <li><strong>safe</strong>: green tint for success-y values (e.g. 200 OK)</li>
            <li><strong>danger</strong>: red tint for irreversible / failure-y values (e.g. 404, irreversible)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Block — headerless / copy floats"
            description="Card variant for multi-line snippets. Without a header, the copy affordance floats in the top-right corner of the body."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-block
              [text]="headerlessSample"
              [allowCopy]="true"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Long lines scroll horizontally by default — opt into wrap with the <strong>wrap</strong> input</li>
            <li>Copy button rests at low opacity and lifts to full opacity on hover or focus</li>
            <li>Clicking the copy button holds a green confirm tint for ~1.2 seconds</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Block — with header"
            description="Optional header bar carries a file label and the copy affordance."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-block
              [text]="tokensSample"
              headerLabel="tokens.css"
              [allowCopy]="true"
            />
            <org-code-block
              [text]="longTsSample"
              headerLabel="useFeatureFlag.ts"
              headerIcon="file-text"
              [allowCopy]="true"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Header label truncates with an ellipsis if it cannot fit the bar</li>
            <li>Optional <strong>headerIcon</strong> renders before the label</li>
            <li>Copy affordance lives inside the header bar instead of floating</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Truncation"
            description="Set ellipsisAt to N to clamp the body to N lines. The bottom edge fades into the surface and a 'Show more' button reveals the rest."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-row gap-2">
              <org-code-block
                [text]="installLogSample"
                headerLabel="install.log"
                [ellipsisAt]="4"
                [allowCopy]="true"
              />
              <org-code-block
                [text]="schemaSample"
                headerLabel="schema.sql"
                [ellipsisAt]="6"
                [allowCopy]="true"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The clamp uses the line-height as its unit so the cut always lands on a line boundary</li>
            <li>The "Show more" button only renders when the content actually overflows the clamp</li>
            <li>Clicking "Show more" lifts the clamp; the affordance is hidden once expanded</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="In context"
            description="Realistic compositions: a doc paragraph mixing inline + block, and a token-aliasing example."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <strong>Authenticating a request</strong>
              <p>
                Every request must include a bearer token in the <org-code-block variant="inline" tone="token" text="Authorization" /> header. Tokens are scoped to a single workspace and expire after 30 days; rotate with <org-code-block variant="inline" text="org auth rotate" />.
              </p>
              <p>A minimal example:</p>
              <org-code-block
                [text]="shellSample"
                headerLabel="shell"
                [allowCopy]="true"
              />
              <p>
                A successful call returns the viewer's profile; an expired token returns <org-code-block variant="inline" tone="danger" text="401 Unauthorized" />.
              </p>
            </div>
            <div class="flex flex-col gap-3">
              <strong>Override a token at the root</strong>
              <p>
                Set <org-code-block variant="inline" tone="token" text="--color-primary" /> on <org-code-block variant="inline" text=":root" /> (or any ancestor) and every consumer in the cascade picks up the new hue. The component layer never reads a colour value directly.
              </p>
              <org-code-block
                [text]="themeOverrideSample"
                headerLabel="theme-override.css"
                headerIcon="file-text"
                [allowCopy]="true"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Inline chips read fluidly inside paragraphs and inherit the surrounding line-height</li>
            <li>Block snippets break paragraph flow and provide a copy affordance for terminal commands and config</li>
            <li>Tones (<strong>token</strong>, <strong>safe</strong>, <strong>danger</strong>) carry semantic meaning in inline use</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    props: {
      headerlessSample: showcaseHeaderlessSample,
      tokensSample: showcaseTokensSample,
      longTsSample: showcaseLongTsSample,
      installLogSample: showcaseInstallLogSample,
      schemaSample: showcaseSchemaSample,
      shellSample: showcaseShellSample,
      themeOverrideSample: showcaseThemeOverrideSample,
    },
    moduleMetadata: {
      imports: [
        CodeBlock,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
