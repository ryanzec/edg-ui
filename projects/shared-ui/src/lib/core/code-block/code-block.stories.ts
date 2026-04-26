import type { Meta, StoryObj } from '@storybook/angular';
import { CodeBlock } from './code-block';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
const meta: Meta<CodeBlock> = {
  title: 'Core/Components/Code Block',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The code text to display (required)',
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
  },
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Code Block Component

  A basic component for displaying code-like information (source code, terminal output, etc.) in a simple way.

  ### Features
  - **Block variant**: Standalone code block with border and background
  - **Inline variant**: Inline code snippet that flows with text
  - **Copy functionality**: Optional copy-to-clipboard button
  - **Ellipsis support**: CSS-only line clamping for long content
  - **Monospace font**: Uses system monospace fonts for code display
  - **Scrollable**: Horizontal scrolling for long lines (block variant)

  ### Variants
  - **block** (default): Standalone code block with padding, border, and background
  - **inline**: Inline code that can be embedded within text

  ### Usage Examples
  \`\`\`html
  <!-- Basic block code -->
  <org-code-block text="const greeting = 'Hello World';" />

  <!-- Inline code -->
  <div>Use the <org-code-block variant="inline" text="console.log()" /> function.</div>

  <!-- With copy button -->
  <org-code-block
    text="npm install @angular/core"
    [allowCopy]="true"
  />

  <!-- With ellipsis after 3 lines -->
  <org-code-block
    text="line 1\\nline 2\\nline 3\\nline 4\\nline 5"
    [ellipsisAt]="3"
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Default code block with block variant. Use the controls below to interact with the component.',
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
      />
    `,
    moduleMetadata: {
      imports: [CodeBlock],
    },
  }),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of block and inline variants.',
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
          <org-code-block text="const user = { name: 'John', age: 30 };" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inline Variant">
          <div>
            Use the <org-code-block variant="inline" text="console.log()" /> function to debug your code.
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Block</strong>: Standalone code block with border, background, and padding</li>
          <li><strong>Inline</strong>: Inline code that flows with surrounding text</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeBlock, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CopyFeature: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Code block with copy-to-clipboard functionality. The copy button appears with reduced opacity and becomes more visible on hover.',
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
          <org-code-block text="npm install &#64;angular/core" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Copy Button">
          <org-code-block
            text="npm install &#64;angular/core"
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Copy button appears in the top-right corner when enabled</li>
          <li>Button has 0.1 opacity by default</li>
          <li>Opacity increases to 0.8 when hovering over the container</li>
          <li>Clicking copies the full text to clipboard</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeBlock, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const EllipsisFeature: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Code block with CSS-only ellipsis after a specified number of lines.',
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
          <org-code-block
            text="function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Ellipsis After 2 Lines">
          <org-code-block
            text="function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}"
            [ellipsisAt]="2"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Ellipsis After 3 Lines">
          <org-code-block
            text="function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}"
            [ellipsisAt]="3"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>When <code>ellipsisAt</code> is 0, all content is shown</li>
          <li>When <code>ellipsisAt</code> is greater than 0, content is clamped to that many lines</li>
          <li>Uses CSS line-clamp for pure CSS implementation</li>
          <li>Ellipsis appears automatically when content exceeds the limit</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeBlock, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const MultilineCode: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples of multiline code blocks with different content types.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Multiline Code Examples"
        currentState="Demonstrating different code types"
      >
        <org-storybook-example-container-section label="TypeScript Code">
          <org-code-block
            text="interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}"
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Terminal Output">
          <org-code-block
            text="$ npm run build
> Building application...
✓ Compiled successfully
✓ Output written to dist/"
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="JSON Data">
          <org-code-block
            text='{
  "name": "angular-sandbox",
  "version": "1.0.0",
  "dependencies": {
    "&#64;angular/core": "^20.0.0"
  }
}'
            [allowCopy]="true"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Preserves whitespace and line breaks</li>
          <li>Horizontal scrolling for long lines</li>
          <li>Monospace font for code readability</li>
          <li>Works with any text-based content</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeBlock, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CombinedFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Code block with both copy and ellipsis features enabled.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Combined Features"
        currentState="Copy button + ellipsis"
      >
        <org-storybook-example-container-section label="Copy + Ellipsis">
          <org-code-block
            text="const longFunction = () => {
  console.log('Line 1');
  console.log('Line 2');
  console.log('Line 3');
  console.log('Line 4');
  console.log('Line 5');
}"
            [allowCopy]="true"
            [ellipsisAt]="3"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Copy button copies the full text, not just visible lines</li>
          <li>Ellipsis only affects display, not clipboard content</li>
          <li>Both features work independently</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CodeBlock, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ScrollingContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates scrolling in both directions with hover-only scrollbars using CodeBlock component.',
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

  public userForm: FormGroup;

  constructor() {
    this.userForm = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\\\\d{10}$/)]],
      address: this._formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['', [Validators.pattern(/^\\\\d{5}$/)]],
      }),
    });
  }

  public ngOnInit(): void {
    this._loadUsers();
  }

  private _loadUsers(): void {
    this._state.update(state => ({ ...state, loading: true, error: null }));

    this._httpClient.get<User[]>('/api/users').subscribe({
      next: (users) => {
        this._state.update(state => ({ ...state, users, loading: false }));
      },
      error: (error) => {
        this._state.update(state => ({
          ...state,
          loading: false,
          error: 'Failed to load users. Please try again.'
        }));
      },
    });
  }

  public selectUser(userId: string): void {
    this._state.update(state => ({ ...state, selectedUserId: userId }));
  }

  public submitForm(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log('Form submitted:', formData);
      // handle form submission
    }
  }
}`,
    },
    template: `
      <org-storybook-example-container
        title="Shifting Content with CodeBlock"
        currentState="Both directions with hover-only scrollbars"
      >
        <org-storybook-example-container-section label="CodeBlock with Both Directions">
            <org-code-block
              variant="block"
              [text]="codeText"
              [allowCopy]="true"
              scrollClass="h-md w-xl"
            />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Scrollbars only appear when hovering over the content area</li>
          <li>Both horizontal and vertical scrolling are enabled</li>
          <li>CodeBlock component maintains its styling within the scroll area</li>
          <li>Smooth transitions when scrollbars appear/disappear</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [StorybookExampleContainer, StorybookExampleContainerSection, CodeBlock],
    },
  }),
};
