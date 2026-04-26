import type { Meta, StoryObj } from '@storybook/angular';
import { Markdown } from './markdown';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Markdown> = {
  title: 'Core/Components/Markdown/Use Cases',
  component: Markdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Markdown>;

const linkSanitizationMarkdown = `## Link With Query Parameters

[Search results](https://example.com/search?q=hello&lang=en&page=2)

## Link With Special Characters In Title

[Hover over me](https://example.com "Title with "quotes" and <brackets>")

## XSS Attempt Via href (javascript: protocol)

[Click me](javascript:alert('xss'))

## XSS Attempt Via href (data: protocol)

[Data URI link](data:text/html,<script>alert('xss')</script>)

## XSS Attempt Via Title Attribute Injection

[Injected title](https://example.com "legit" onmouseover="alert('xss')")

## Normal External Link

[GitHub](https://github.com)

## Normal Internal Link

[Go to settings](/settings/profile)`;

export const LinkSanitization: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Manually verify that link hrefs and titles with special characters, query params, and XSS payloads are correctly sanitized. Inspect the rendered anchor elements to confirm attribute values are properly escaped and dangerous protocols are stripped.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Link Sanitization"
        currentState="Showing links with special characters and XSS payloads"
      >
        <org-storybook-example-container-section label="Link Attribute Escaping and XSS Protection">
          <org-markdown [markdown]="markdown"></org-markdown>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Query params</strong>: href must preserve &amp; as &amp;amp; in the attribute value</li>
          <li><strong>Quotes in title</strong>: &quot; characters in title must be escaped so they do not break the attribute</li>
          <li><strong>javascript: href</strong>: must be stripped by DOMPurify — link must not be clickable</li>
          <li><strong>data: href</strong>: must be stripped by DOMPurify — link must not be clickable</li>
          <li><strong>Title attribute injection</strong>: injected attributes must not appear on the element</li>
          <li><strong>External links</strong>: must have rel="noopener noreferrer"</li>
          <li><strong>Internal links</strong>: must NOT have rel="noopener noreferrer"</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      markdown: linkSanitizationMarkdown,
    },
    moduleMetadata: {
      imports: [Markdown, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
