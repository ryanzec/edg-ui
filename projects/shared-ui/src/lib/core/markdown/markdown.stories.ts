import type { Meta, StoryObj } from '@storybook/angular';
import { Markdown } from './markdown';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Markdown> = {
  title: 'Core/Components/Markdown',
  component: Markdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Markdown Component

  A component for rendering markdown content as HTML with GitHub flavored markdown support.

  ### Features
  - Full markdown syntax support
  - GitHub flavored markdown (tables, task lists, strikethrough, etc.)
  - XSS protection via DOMPurify sanitization
  - External links rendered with rel="noopener noreferrer" for security
  - Responsive tables
  - Customizable styling through CSS variables

  ### Supported Elements
  - **Headings**: H1-H6 with proper hierarchy
  - **Text formatting**: Bold, italic, strikethrough
  - **Lists**: Ordered, unordered, and task lists
  - **Links**: Auto-linking URLs
  - **Images**: With responsive sizing
  - **Code**: Inline code and code blocks
  - **Tables**: Full table support with headers
  - **Blockquotes**: For callouts and quotes
  - **Horizontal rules**: For section breaks

  ### Usage Examples
  \`\`\`html
  <!-- Basic markdown -->
  <org-markdown [markdown]="'# Hello World\\n\\nThis is **bold** text.'"></org-markdown>

  <!-- With bound content -->
  <org-markdown [markdown]="markdownContent"></org-markdown>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Markdown>;

export const Default: Story = {
  args: {
    markdown: '# Hello World\n\nThis is a **markdown** component with _italic_ text.',
  },
  argTypes: {
    markdown: {
      control: 'text',
      description: 'The markdown content to render',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default markdown component with basic formatting. Use the controls below to edit the markdown.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-markdown
        [markdown]="markdown"
      ></org-markdown>
    `,
    moduleMetadata: {
      imports: [Markdown],
    },
  }),
};

const headingsMarkdown = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

This demonstrates all heading levels supported in markdown.`;

export const Headings: Story = {
  parameters: {
    docs: {
      description: {
        story: 'All heading levels from H1 to H6.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Headings"
        currentState="Showing all heading levels (H1-H6)"
      >
        <org-storybook-example-container-section label="All Heading Levels">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>H1 is the largest heading (3xl)</li>
          <li>H6 is the smallest heading (sm)</li>
          <li>All headings have proper spacing and hierarchy</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: headingsMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const textFormattingMarkdown = `This is **bold text** using double asterisks.

This is __also bold__ using double underscores.

This is *italic text* using single asterisks.

This is _also italic_ using single underscores.

This is ***bold and italic*** text.

This is ~~strikethrough~~ text (GitHub flavored).

This is a paragraph with **bold**, *italic*, and ~~strikethrough~~ text combined.`;

export const TextFormatting: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Various text formatting options including bold, italic, and strikethrough.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Text Formatting"
        currentState="Showing bold, italic, and strikethrough"
      >
        <org-storybook-example-container-section label="Formatted Text">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Bold</strong>: Use ** or __ around text</li>
          <li><em>Italic</em>: Use * or _ around text</li>
          <li><del>Strikethrough</del>: Use ~~ around text (GitHub flavored)</li>
          <li>Combine multiple formats for emphasis</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: textFormattingMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const listsMarkdown = `## Unordered List

* Item 1
* Item 2
* Item 3
  * Nested item 3.1
  * Nested item 3.2
* Item 4

## Ordered List

1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2
4. Fourth item

## Task List (GitHub Flavored)

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Another incomplete task`;

export const Lists: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Unordered lists, ordered lists, and GitHub flavored task lists.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Lists"
        currentState="Showing unordered, ordered, and task lists"
      >
        <org-storybook-example-container-section label="Various List Types">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Unordered</strong>: Use *, -, or + for bullet points</li>
          <li><strong>Ordered</strong>: Use numbers followed by a period</li>
          <li><strong>Task Lists</strong>: Use - [ ] for unchecked, - [x] for checked (GitHub flavored)</li>
          <li><strong>Nesting</strong>: Indent with 2-4 spaces for nested items</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: listsMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const linksAndImagesMarkdown = `## Links

This is a [link to Google](https://www.google.com).

This is an auto-linked URL: https://www.github.com

This is a [link with title](https://www.example.com "Example Website").

## Images

![Alt text for image](https://via.placeholder.com/400x200?text=Sample+Image)

![Image with title](https://via.placeholder.com/300x150?text=Another+Image "Image Title")`;

export const LinksAndImages: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Links with various formats and images with alt text and titles.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Links and Images"
        currentState="Showing different link and image formats"
      >
        <org-storybook-example-container-section label="Links and Images">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Links</strong>: Use [text](url) or [text](url "title")</li>
          <li><strong>Auto-linking</strong>: URLs are automatically converted to links</li>
          <li><strong>Images</strong>: Use ![alt](url) or ![alt](url "title")</li>
          <li><strong>Responsive</strong>: Images scale to fit container width</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: linksAndImagesMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const externalLinkSecurityMarkdown = `## External Links

[External link to GitHub](https://www.github.com)

Auto-linked: https://www.google.com

## Internal Links

[Internal link](/some/internal/path)`;

export const ExternalLinkSecurity: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Validates that external links include rel="noopener noreferrer" and internal links do not.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="External Link Security"
        currentState="Showing external vs internal link rendering"
      >
        <org-storybook-example-container-section label="Link Security Attributes">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>External links</strong>: Must have rel="noopener noreferrer" (inspect the anchor element)</li>
          <li><strong>Internal links</strong>: Must NOT have rel="noopener noreferrer"</li>
          <li><strong>Auto-linked URLs</strong>: External auto-linked URLs must also carry the rel attribute</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: externalLinkSecurityMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const codeMarkdown = `## Inline Code

Use \`console.log()\` to print to the console.

The variable \`userName\` stores the user's name.

## Code Blocks

\`\`\`javascript
function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('World');
\`\`\`

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};
\`\`\`

\`\`\`json
{
  "name": "markdown-component",
  "version": "1.0.0",
  "description": "A markdown renderer"
}
\`\`\``;

export const Code: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inline code and code blocks with syntax highlighting support.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Code"
        currentState="Showing inline code and code blocks"
      >
        <org-storybook-example-container-section label="Code Examples">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Inline Code</strong>: Use backticks around text</li>
          <li><strong>Code Blocks</strong>: Use triple backticks with optional language</li>
          <li><strong>Languages</strong>: Specify language identifier for fenced blocks (no syntax highlighting)</li>
          <li><strong>Scrollable</strong>: Long code blocks scroll horizontally</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: codeMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const blockquotesMarkdown = `## Single Blockquote

> This is a blockquote.
> It can span multiple lines.

## Nested Blockquotes

> This is the first level of quoting.
>
> > This is nested blockquote.
> > It's indented further.
>
> Back to the first level.

## Blockquote with Formatting

> **Important:** This is a blockquote with **bold** text and *italic* text.
>
> It can also contain \`code\` and [links](https://example.com).`;

export const Blockquotes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Blockquotes for highlighting important content or quotes.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Blockquotes"
        currentState="Showing single, nested, and formatted blockquotes"
      >
        <org-storybook-example-container-section label="Blockquote Examples">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Basic</strong>: Use > at the start of lines</li>
          <li><strong>Nested</strong>: Use >> for nested quotes</li>
          <li><strong>Formatting</strong>: All markdown formatting works inside blockquotes</li>
          <li><strong>Styling</strong>: Left border indicates quoted content</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: blockquotesMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const tablesMarkdown = `## Simple Table

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
| Row 3 Col 1 | Row 3 Col 2 | Row 3 Col 3 |

## Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| Text | Text | Text |
| Data | Data | Data |

## Table with Formatting

| Name | Status | Description |
|------|--------|-------------|
| **Project A** | ~~Completed~~ | This project is *finished* |
| **Project B** | In Progress | Currently \`working\` on it |
| **Project C** | Planned | Will start **soon** |`;

export const Tables: Story = {
  parameters: {
    docs: {
      description: {
        story: 'GitHub flavored markdown tables with headers, alignment, and formatting.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Tables"
        currentState="Showing various table configurations"
      >
        <org-storybook-example-container-section label="Table Examples">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Structure</strong>: Use pipes | to separate columns</li>
          <li><strong>Headers</strong>: First row with --- separator</li>
          <li><strong>Alignment</strong>: Use :--- (left), :---: (center), ---: (right)</li>
          <li><strong>Formatting</strong>: All markdown formatting works in cells</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: tablesMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const horizontalRulesMarkdown = `## Section 1

This is content before the horizontal rule.

---

## Section 2

This is content after the first horizontal rule.

***

## Section 3

This is content after the second horizontal rule.

___

## Section 4

This is content after the third horizontal rule.`;

export const HorizontalRules: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Horizontal rules for separating content sections.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Horizontal Rules"
        currentState="Showing horizontal rules as section separators"
      >
        <org-storybook-example-container-section label="Section Separators">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Syntax</strong>: Use ---, ***, or ___ on their own line</li>
          <li><strong>Purpose</strong>: Visual separation between content sections</li>
          <li><strong>Styling</strong>: Rendered as a horizontal line with spacing</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: horizontalRulesMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

const comprehensiveMarkdown = `# Comprehensive Markdown Example

## Introduction

This document demonstrates **all** markdown features supported by the component, including *GitHub flavored markdown*.

---

## Text Formatting

You can use **bold text** with double asterisks or __double underscores__.

You can use *italic text* with single asterisks or _single underscores_.

You can combine ***bold and italic*** together.

### Strikethrough (GitHub Flavored)

You can use ~~strikethrough~~ for deleted or outdated text.

Example: The price was ~~$99.99~~ now only **$79.99**!

Status updates: ~~Pending~~ ~~In Progress~~ **Completed**

---

## Lists

### Unordered List

* First item
* Second item
* Third item
  * Nested item 1
  * Nested item 2
* Fourth item

### Ordered List

1. First step
2. Second step
3. Third step
   1. Sub-step 3.1
   2. Sub-step 3.2
4. Fourth step

### Task List (GitHub Flavored)

Track your progress with interactive checkboxes:

- [x] Design component architecture
- [x] Implement markdown parsing
- [x] Add GitHub flavored markdown support
- [ ] Write comprehensive tests
- [ ] Add accessibility features
- [x] Create documentation
- [ ] Performance optimization

#### Project Milestones

- [x] Phase 1: Core functionality
- [x] Phase 2: Styling and theming
- [ ] Phase 3: Advanced features
- [ ] Phase 4: Production release

---

## Links and Images

Visit [Google](https://www.google.com) for searching.

Auto-linked URL: https://www.github.com

![Sample Image](https://via.placeholder.com/400x200?text=Markdown+Example "Example Image")

---

## Code

Inline code: Use \`const greeting = 'Hello World';\` in JavaScript.

Code block:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

---

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > This is a nested blockquote.
>
> You can include **formatting** and \`code\` inside blockquotes.

---

## Tables (GitHub Flavored)

| Feature | Status | Priority |
|---------|:------:|----------:|
| Headings | ✓ | High |
| Lists | ✓ | High |
| Tables | ✓ | Medium |
| Code | ✓ | High |

---

## Horizontal Rules

Three or more hyphens, asterisks, or underscores create a horizontal rule.

---

## All Heading Levels

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Conclusion

This example covers all major markdown features including **GitHub flavored markdown** extensions.`;

export const ComprehensiveExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive example showcasing all markdown features in a single document.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Comprehensive Example"
        currentState="Showing all markdown features together"
      >
        <org-storybook-example-container-section label="Complete Markdown Document">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>All heading levels (H1-H6)</li>
          <li>Text formatting (bold, italic, combined)</li>
          <li><strong>Strikethrough</strong> with ~~ syntax (GitHub flavored)</li>
          <li>Lists (unordered, ordered)</li>
          <li><strong>Task lists</strong> with checkboxes (GitHub flavored)</li>
          <li>Links (inline, auto-linked)</li>
          <li>Images with alt text and titles</li>
          <li>Code (inline and blocks with language support)</li>
          <li>Blockquotes (single and nested)</li>
          <li>Tables with alignment (GitHub flavored)</li>
          <li>Horizontal rules for section breaks</li>
          <li>All GitHub flavored markdown extensions</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: comprehensiveMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
