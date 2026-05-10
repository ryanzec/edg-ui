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
import { UiThemeSwitcher } from '../../ui-theme/ui-theme-switcher/ui-theme-switcher';
import { CodeHighlighter, type CodeHighlighterVariant } from './code-highlighter';

type LiveDemoLanguageChoice = 'typescript' | 'sql';
type LiveDemoEllipsisChoice = '0' | '5';

const liveDemoLanguageItems: ButtonToggleItem[] = [
  { label: 'typescript', value: 'typescript', buttonColor: 'primary' },
  { label: 'sql', value: 'sql', buttonColor: 'primary' },
];

const liveDemoVariantItems: ButtonToggleItem[] = [
  { label: 'block', value: 'block', buttonColor: 'primary' },
  { label: 'inline', value: 'inline', buttonColor: 'primary' },
];

const liveDemoEllipsisItems: ButtonToggleItem[] = [
  { label: 'off', value: '0', buttonColor: 'primary' },
  { label: '5 lines', value: '5', buttonColor: 'primary' },
];

const liveDemoTypescriptText = `import { useEffect, useState } from 'react';
import { flags, type FlagKey } from '@org/flags';

// reads a feature flag for the current viewer. subscribes to remote
// updates so the value flips live when an operator toggles it.
export function useFeatureFlag<K extends FlagKey>(key: K, fallback: boolean = false): boolean {
  const [value, setValue] = useState(() => flags.peek(key) ?? fallback);

  useEffect(() => {
    const unsubscribe = flags.subscribe(key, (next) => setValue(next));
    return unsubscribe;
  }, [key]);

  return value;
}`;

const liveDemoSqlText = `-- workspace + index DDL for the multi-tenant schema
create table workspace (
  id          uuid primary key default gen_random_uuid(),
  slug        citext not null unique,
  name        text not null,
  plan        plan_tier not null default 'free',
  seat_limit  int not null default 5,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index workspace_slug_idx on workspace (slug);
create index workspace_plan_idx on workspace (plan)
  where deleted_at is null;`;

@Component({
  selector: 'story-code-highlighter-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CodeHighlighter,
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
      .canvas-stage org-code-highlighter {
        width: 100%;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle language, variant, copy, and clamp. Theme follows the page-level toggle in the top bar."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Language">
            <org-button-toggle [items]="languageItems" formControlName="language" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Copy">
            <org-checkbox-toggle name="live-demo-copy" value="copy" formControlName="allowCopy">
              {{ liveDemoForm.controls.allowCopy.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Clamp">
            <org-button-toggle [items]="ellipsisItems" formControlName="ellipsisAt" buttonSize="sm" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @switch (liveDemoForm.controls.language.value) {
              @case ('typescript') {
                <org-code-highlighter
                  language="typescript"
                  [text]="typescriptText"
                  [variant]="liveDemoForm.controls.variant.value"
                  [allowCopy]="liveDemoForm.controls.allowCopy.value"
                  [ellipsisAt]="ellipsisAtNumeric"
                />
              }
              @case ('sql') {
                <org-code-highlighter
                  language="sql"
                  [text]="sqlText"
                  [variant]="liveDemoForm.controls.variant.value"
                  [allowCopy]="liveDemoForm.controls.allowCopy.value"
                  [ellipsisAt]="ellipsisAtNumeric"
                />
              }
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class CodeHighlighterLiveDemoStory {
  protected readonly languageItems = liveDemoLanguageItems;
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly ellipsisItems = liveDemoEllipsisItems;
  protected readonly typescriptText = liveDemoTypescriptText;
  protected readonly sqlText = liveDemoSqlText;

  protected readonly liveDemoForm = new FormGroup({
    language: new FormControl<LiveDemoLanguageChoice>('typescript', { nonNullable: true }),
    variant: new FormControl<CodeHighlighterVariant>('block', { nonNullable: true }),
    allowCopy: new FormControl<boolean>(false, { nonNullable: true }),
    ellipsisAt: new FormControl<LiveDemoEllipsisChoice>('0', { nonNullable: true }),
  });

  protected get ellipsisAtNumeric(): number {
    return Number(this.liveDemoForm.controls.ellipsisAt.value);
  }
}

const meta: Meta<CodeHighlighter> = {
  title: 'Core/Components/Code Highlighter',
  component: CodeHighlighter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Code Highlighter Component

  A syntax-highlighted code block. Token spans are emitted as semantic \`.org-syntax-*\`
  classes whose colors come from base design tokens — light/dark theming flows through the
  global \`.dark\` selector (no shiki re-render on theme change).

  ### Features
  - **Syntax highlighting**: Token-level highlighting via shiki tokenization, rendered as \`.org-syntax-*\` spans
  - **Theme-aware**: Token colors driven by base design tokens (no theme-coupled inline styles)
  - **Block variant**: Standalone highlighted code block with border, background, and scroll area
  - **Inline variant**: Inline highlighted code that flows with text
  - **Copy functionality**: Optional copy-to-clipboard button
  - **Ellipsis support**: CSS-only line clamping for long content
  - **Graceful loading**: Falls back to plain monospace text while shiki initialises or on tokenization error

  ### Supported Languages
  \`typescript\`, \`javascript\`, \`html\`, \`css\`, \`json\`, \`bash\`, \`shell\`, \`sql\`, \`yaml\`, \`markdown\`, \`text\`

  ### Usage Examples
  \`\`\`html
  <!-- typescript block -->
  <org-code-highlighter language="typescript" text="const x: number = 42;" />

  <!-- with copy button -->
  <org-code-highlighter language="json" text='{ "key": "value" }' [allowCopy]="true" />

  <!-- inline highlighted code -->
  <div>Call <org-code-highlighter variant="inline" language="typescript" text="console.log()" /> to debug.</div>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<CodeHighlighter>;

export const Default: Story = {
  args: {
    text: 'const greeting = "Hello World";',
    language: 'typescript',
    variant: 'block',
    allowCopy: false,
    copyAriaLabel: 'Copy code',
    ellipsisAt: 0,
    scrollClass: '',
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The code text to display (required)',
    },
    language: {
      control: 'select',
      options: ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'shell', 'sql', 'yaml', 'markdown', 'text'],
      description: 'Language for syntax highlighting',
    },
    variant: {
      control: 'select',
      options: ['block', 'inline'],
      description: 'The display variant of the code block',
    },
    allowCopy: {
      control: 'boolean',
      description: 'Whether to show the copy-to-clipboard button',
    },
    copyAriaLabel: {
      control: 'text',
      description: 'Accessible label applied to the copy button',
    },
    ellipsisAt: {
      control: 'number',
      description: 'Number of lines before ellipsis (0 = no ellipsis)',
    },
    scrollClass: {
      control: 'text',
      description: 'CSS class applied to the scroll area (e.g. "h-base w-xl" to constrain dimensions)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default block with TypeScript highlighting. Use the controls to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-code-highlighter
        [text]="text"
        [language]="language"
        [variant]="variant"
        [allowCopy]="allowCopy"
        [copyAriaLabel]="copyAriaLabel"
        [ellipsisAt]="ellipsisAt"
        [scrollClass]="scrollClass"
      />
    `,
    moduleMetadata: {
      imports: [CodeHighlighter],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Drive language, variant, copy, and clamp. Light/dark theming follows the global UI theme automatically.',
      },
    },
  },
  render: () => ({
    template: `<story-code-highlighter-live-demo />`,
    moduleMetadata: {
      imports: [CodeHighlighterLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every code-highlighter axis — languages, variants, copy, truncation, theme switching, scroll dimensions, and oversized containers — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Languages" />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-highlighter
              language="typescript"
              text="interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}"
              [allowCopy]="true"
            />
            <org-code-highlighter
              language="json"
              text='{
  &quot;name&quot;: &quot;angular-sandbox&quot;,
  &quot;version&quot;: &quot;1.0.0&quot;,
  &quot;dependencies&quot;: {
    &quot;@angular/core&quot;: &quot;^21.0.0&quot;
  }
}'
              [allowCopy]="true"
            />
            <org-code-highlighter
              language="bash"
              text="# install dependencies
npm install

# start dev server
npm run start"
              [allowCopy]="true"
            />
            <org-code-highlighter
              language="html"
              text='&lt;div class=&quot;container&quot;&gt;
  &lt;h1&gt;Hello World&lt;/h1&gt;
  &lt;p&gt;A simple paragraph.&lt;/p&gt;
&lt;/div&gt;'
              [allowCopy]="true"
            />
            <org-code-highlighter
              language="sql"
              text="select
  u.id,
  u.name,
  u.email,
  count(o.id) as order_count,
  sum(o.total) as lifetime_value
from users u
left join orders o on o.user_id = u.id
where u.created_at >= '2024-01-01'
  and u.status = 'active'
group by u.id, u.name, u.email
order by lifetime_value desc
limit 50;"
              [allowCopy]="true"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Each language uses shiki's grammar to tokenize source</li>
            <li>Token colors come from base design tokens via the <code>.org-syntax-*</code> classes</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-highlighter language="typescript" text="const user = { name: 'John', age: 30 };" />
            <div>
              Use the <org-code-highlighter variant="inline" language="typescript" text="console.log()" /> function to debug your code.
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Block</strong>: Highlighted, with border and scroll area</li>
            <li><strong>Inline</strong>: Highlighted code that flows with surrounding text</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Copy" />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-highlighter language="bash" text="npm install &#64;angular/core" />
            <org-code-highlighter language="bash" text="npm install &#64;angular/core" [allowCopy]="true" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Copy button appears in the top-right corner when enabled</li>
            <li>Button has low opacity by default, increases on hover and focus</li>
            <li>Clicking copies the raw (unhighlighted) text to clipboard</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Truncation" />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-highlighter
              language="typescript"
              text="function calculateTotal(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}"
            />
            <org-code-highlighter
              language="typescript"
              text="function calculateTotal(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}"
              [ellipsisAt]="2"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Ellipsis clamps the displayed lines; syntax highlighting is preserved on visible lines</li>
            <li>Copy button (when enabled) copies the full untruncated text</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Theme Switching" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4">
              <org-ui-theme-switcher />
              <org-code-highlighter
                language="typescript"
                text="import { Component, inject } from '&#64;angular/core';
import { UiThemeManager } from '&#64;shared-ui';

&#64;Component({ selector: 'app-root', template: '' })
export class AppComponent {
  private readonly themeManager = inject(UiThemeManager);
  protected readonly isDarkMode = this.themeManager.isDarkMode;
}"
                [allowCopy]="true"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Toggle flips the global <code>.dark</code> selector</li>
            <li>Token colors flip in the same paint cycle (no shiki re-render)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Scrolling Content" />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-highlighter
              language="typescript"
              [text]="codeText"
              [allowCopy]="true"
              scrollClass="h-base w-xl"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Scrollbars appear on hover in both directions</li>
            <li>Syntax highlighting is preserved across the full scrollable content</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Scroll Class" />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-highlighter
              language="typescript"
              text="const a = 1;
const b = 2;
const c = 3;"
            />
            <org-code-highlighter
              language="typescript"
              text="const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
const f = 6;
const g = 7;
const h = 8;
const i = 9;
const j = 10;
const k = 11;
const l = 12;
const m = 13;
const n = 14;
const o = 15;
const p = 16;
const q = 17;
const r = 18;
const s = 19;
const t = 20;"
              scrollClass="h-sm w-base"
            />
            <org-code-highlighter
              language="typescript"
              text="const longLine = 3981734659238475629384756293847562394857623948576239458762394857629348576239485762394857623985762394857623948576;
const a = 1;
const b = 2;
const c = 3;
const d = 4;"
              scrollClass="h-base w-xl"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>scrollClass passes css utility classes directly to the scroll area component</li>
            <li>Use height and width utilities to constrain the visible region and enable scrolling</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Larger Container Than Content" />
          <org-design-system-demo-canvas slot="canvas">
            <org-code-highlighter
              scrollClass="h-sm"
              language="typescript"
              text="interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}"
              [allowCopy]="true"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Background expands to fill the entire container, not just the content</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    props: {
      codeText: `import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  private _httpClient = inject(HttpClient);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  private _state = signal({
    users: [] as User[],
    loading: false,
    error: null as string | null,
    selectedUserId: null as string | null,
  });

  public users = computed(() => this._state().users);
  public loading = computed(() => this._state().loading);
  public error = computed(() => this._state().error);
  public selectedUser = computed(() => {
    const userId = this._state().selectedUserId;
    return this._state().users.find(user => user.id === userId);
  });

  public ngOnInit(): void {
    this._loadUsers();
  }

  private _loadUsers(): void {
    this._state.update(state => ({ ...state, loading: true, error: null }));
    this._httpClient.get<User[]>('/api/users').subscribe({
      next: (users) => this._state.update(state => ({ ...state, users, loading: false })),
      error: () => this._state.update(state => ({ ...state, loading: false, error: 'Failed to load users.' })),
    });
  }
}`,
    },
    moduleMetadata: {
      imports: [
        CodeHighlighter,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        UiThemeSwitcher,
      ],
    },
  }),
};
