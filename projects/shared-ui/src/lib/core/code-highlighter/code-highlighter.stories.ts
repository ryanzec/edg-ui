import type { Meta, StoryObj } from '@storybook/angular';
import { CodeHighlighter } from './code-highlighter';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { UiThemeSwitcher } from '../../ui-theme/ui-theme-switcher/ui-theme-switcher';

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

  A syntax-highlighted code block powered by [Shiki](https://shiki.style). Automatically adapts
  to the current UI theme (light / dark) via \`UiThemeManager\`.

  ### Features
  - **Syntax highlighting**: Full token-level highlighting via Shiki
  - **Theme-aware**: Switches between \`github-light\` and \`github-dark\` based on active UI theme
  - **Block variant**: Standalone highlighted code block with border and scroll area
  - **Inline variant**: Inline code snippet that flows with text (no highlighting)
  - **Copy functionality**: Optional copy-to-clipboard button
  - **Ellipsis support**: CSS-only line clamping for long content
  - **Graceful loading**: Shows plain text while the Shiki highlighter initialises

  ### Supported Languages
  \`typescript\`, \`javascript\`, \`html\`, \`css\`, \`json\`, \`bash\`, \`shell\`, \`sql\`, \`yaml\`, \`markdown\`, \`text\`

  ### Usage Examples
  \`\`\`html
  <!-- TypeScript block -->
  <org-code-highlighter language="typescript" text="const x: number = 42;" />

  <!-- With copy button -->
  <org-code-highlighter language="json" text='{ "key": "value" }' [allowCopy]="true" />

  <!-- Inline code -->
  <div>Call <org-code-highlighter variant="inline" text="console.log()" /> to debug.</div>
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
        [ellipsisAt]="ellipsisAt"
        [scrollClass]="scrollClass"
      />
    `,
    moduleMetadata: {
      imports: [CodeHighlighter],
    },
  }),
};

export const Languages: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Syntax highlighting across different languages.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Language Examples"
        currentState="Comparing syntax highlighting across languages"
      >
        <org-storybook-example-container-section label="TypeScript">
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
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="JSON">
          <org-code-highlighter
            language="json"
            text='{
  "name": "angular-sandbox",
  "version": "1.0.0",
  "dependencies": {
    "@angular/core": "^21.0.0"
  }
}'
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Bash">
          <org-code-highlighter
            language="bash"
            text="# Install dependencies
npm install

# Start dev server
npm run start"
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="HTML">
          <org-code-highlighter
            language="html"
            text='&lt;div class="container"&gt;
  &lt;h1&gt;Hello World&lt;/h1&gt;
  &lt;p&gt;A simple paragraph.&lt;/p&gt;
&lt;/div&gt;'
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="SQL">
          <org-code-highlighter
            language="sql"
            text="SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS lifetime_value
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
GROUP BY u.id, u.name, u.email
ORDER BY lifetime_value DESC
LIMIT 50;"
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Each language uses Shiki's token-level grammar for accurate highlighting</li>
          <li>Colors follow the active theme (github-light / github-dark)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const LargerContainerThanContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Show where the container is larger than the content.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Language Examples"
        currentState="Comparing syntax highlighting across languages"
      >
        <org-storybook-example-container-section label="TypeScript">
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
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>the background should expand to the extire container and not just the content</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Block and inline variants side by side.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Variant Options"
        currentState="Comparing block and inline variants"
      >
        <org-storybook-example-container-section label="Block Variant">
          <org-code-highlighter language="typescript" text="const user = { name: 'John', age: 30 };" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inline Variant">
          <div>
            Use the <org-code-highlighter variant="inline" text="console.log()" /> function to debug your code.
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Block</strong>: Shiki-highlighted, with border and scroll area</li>
          <li><strong>Inline</strong>: Plain monospace code that flows with surrounding text</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CopyFeature: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Copy-to-clipboard button. Appears at reduced opacity and becomes visible on hover.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Copy to Clipboard"
        currentState="Demonstrating copy functionality"
      >
        <org-storybook-example-container-section label="Without Copy Button">
          <org-code-highlighter language="bash" text="npm install &#64;angular/core" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Copy Button">
          <org-code-highlighter
            language="bash"
            text="npm install &#64;angular/core"
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Copy button appears in the top-right corner when enabled</li>
          <li>Button has low opacity by default, increases on hover</li>
          <li>Clicking copies the raw (unhighlighted) text to clipboard</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const EllipsisFeature: Story = {
  parameters: {
    docs: {
      description: {
        story: 'CSS line clamping applied to the highlighted output.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Ellipsis Feature"
        currentState="Demonstrating line clamping"
      >
        <org-storybook-example-container-section label="No Ellipsis (Full Content)">
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
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Ellipsis After 2 Lines">
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
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Ellipsis clamps the displayed lines; syntax highlighting is preserved on visible lines</li>
          <li>Copy button (when enabled) copies the full untruncated text</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ThemeSwitching: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Toggle between light and dark themes. The highlighted output automatically re-renders using the appropriate Shiki theme.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Theme Switching"
        currentState="Demonstrating light/dark mode awareness"
      >
        <org-storybook-example-container-section label="Toggle Theme">
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
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Clicking the toggle switches between github-light and github-dark Shiki themes</li>
          <li>Highlighting re-renders automatically — no page reload required</li>
          <li>Theme state is managed by <strong>UiThemeManager</strong> (singleton)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection, UiThemeSwitcher],
    },
  }),
};

export const ScrollingContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Long highlighted code with both horizontal and vertical scrolling.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
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
    template: `
      <org-storybook-example-container
        title="Scrolling Highlighted Content"
        currentState="Both directions with hover-only scrollbars"
      >
        <org-storybook-example-container-section label="TypeScript with Scroll">
          <org-code-highlighter
            language="typescript"
            [text]="codeText"
            [allowCopy]="true"
            scrollClass="h-base w-xl"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Scrollbars appear on hover in both directions</li>
          <li>Syntax highlighting is preserved across the full scrollable content</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ScrollClass: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrating the scrollClass input to constrain the scroll area dimensions.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Scroll Class"
        currentState="Comparing no scroll class vs constrained dimensions"
      >
        <org-storybook-example-container-section label="No scrollClass (unconstrained)">
          <org-code-highlighter
            language="typescript"
            text="const a = 1;
const b = 2;
const c = 3;"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="scrollClass=&quot;h-sm w-base&quot;">
          <org-code-highlighter
            language="typescript"
            text="const a = 1;
const b = 2;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;"
            scrollClass="h-sm w-base"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="scrollClass=&quot;h-base w-xl&quot;">
          <org-code-highlighter
            language="typescript"
            text="const a = 1;
const b = 2;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3981734659238475629384756293847562394857623948576239458762394857629348576239485762394857623985762394857623948576;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;
const c = 3;"
            scrollClass="h-base w-xl"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>scrollClass passes css utility classes directly to the scroll area component</li>
          <li>Use height and width utilities to constrain the visible region and enable scrolling</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeHighlighter, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
