import type { Meta, StoryObj } from '@storybook/angular';
import { ScrollArea } from './scroll-area';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta = {
  title: 'Core/Components/Scroll Area/Use Cases',
  component: ScrollArea,
};

export default meta;
type Story = StoryObj;

export const ExternalWrapperSizing: Story = {
  name: 'External Wrapper Sizing',
  parameters: {
    docs: {
      description: {
        story: `
When a parent component cannot apply sizing directly to \`org-scroll-area\` due to Angular's view encapsulation,
wrap the component in an outer element that owns the sizing constraints and set \`scrollClass="h-full w-full"\`
so the scroll area fills it.

**Why this is needed**: Angular's view encapsulation scopes component styles to the host element. A parent
component's CSS cannot reach into a child component's internal DOM elements. Rather than exposing internal
scroll area implementation details as API inputs, the parent wraps \`org-scroll-area\` in a div and applies
the sizing to that wrapper instead.

**Pattern**:
\`\`\`html
<!-- Wrapper element owns sizing, border, and overflow containment -->
<div class="my-scroll-wrapper">
  <org-scroll-area
    direction="vertical"
    containerClass=""
    scrollClass="h-full w-full"
  >
    <!-- content -->
  </org-scroll-area>
</div>
\`\`\`

\`\`\`css
/* In parent component's encapsulated CSS */
.my-scroll-wrapper {
  max-height: 300px;
  max-width: 600px;
  overflow: hidden;
}
\`\`\`

This is the approach used by the \`org-combobox\` component for its options dropdown.
        `,
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="External Wrapper Sizing Pattern"
        currentState="Comparing standard sizing vs wrapper-based sizing"
      >
        <org-storybook-example-container-section label="Standard: scrollClass controls size">
          <org-scroll-area
            direction="vertical"
            containerClass="rounded-lg border border-border"
            scrollClass="h-6xs"
            spacingClass="p-4"
          >
            <div>Option 1</div>
            <div>Option 2</div>
            <div>Option 3</div>
            <div>Option 4</div>
            <div>Option 5</div>
            <div>Option 6</div>
            <div>Option 7</div>
            <div>Option 8</div>
            <div>Option 9</div>
            <div>Option 10</div>
          </org-scroll-area>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Wrapper pattern: outer div controls size (used when view encapsulation prevents direct styling)">
          <div>
            If you need to control the size of the scroll area with css (need explicit values), then you would apply that to the outer div and set the scroll scroll to 100% (usually using flexbox to prevent the scroll area from overflowing the parent).
          </div>
          <div class="max-h-6xs max-w-6xs flex flex-col border border-border rounded-md">
            <org-scroll-area
              direction="vertical"
              containerClass="flex flex-col"
              scrollClass="h-full w-full min-h-0"
              spacingClass="p-4"
            >
              <div>Option 1</div>
              <div>Option 2</div>
              <div>Option 3</div>
              <div>Option 4</div>
              <div>Option 5</div>
              <div>Option 6</div>
              <div>Option 7</div>
              <div>Option 8</div>
              <div>Option 9</div>
              <div>Option 10</div>
            </org-scroll-area>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Standard</strong>: scrollClass sets the explicit height — works when the component can style scroll area directly</li>
          <li><strong>Wrapper pattern</strong>: outer div owns height/width/border; scroll area uses <code>scrollClass="h-full w-full"</code> to fill it</li>
          <li>The wrapper pattern avoids leaking internal scroll area structure into the parent component's API</li>
          <li>Used by <code>org-combobox</code> for its options dropdown, where view encapsulation prevents direct scroll area styling</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [ScrollArea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
