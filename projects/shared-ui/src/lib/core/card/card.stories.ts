import type { Meta, StoryObj } from '@storybook/angular';
import { Card, cardColors, CARD_BOX_BORDER_DEFAULT, CARD_COLOR_DEFAULT, CARD_CONTAINER_CLASS_DEFAULT } from './card';
import { CardHeader } from './card-header';
import { CardContent } from './card-content';
import { CardImage } from './card-image';
import { CardFooter } from './card-footer';
import { Button } from '../button/button';
import { allBoxBorders } from '../box/box';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Card> = {
  title: 'Core/Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Card Component

  A flexible card component system with multiple sub-components for building rich content layouts.

  ### Components
  - **Card**: Main container with optional colored border
  - **CardHeader**: Header section with title, subtitle, and configurable heading level
  - **CardImage**: Image section with optimized loading; renders in fill mode when width/height are omitted
  - **CardContent**: Main content area
  - **CardFooter**: Footer section with configurable button alignment

  ### Features
  - Compositional design with sub-components
  - Optional colored borders (9 color variants)
  - Configurable border/visual style via boxBorder
  - Flexible content layout
  - Responsive image support with fill mode fallback
  - Footer alignment options (start, center, end)
  - Accessible heading level control on card header

  ### Color Options
  - **null/default**: No colored border (default)
  - **primary**: Primary color border
  - **secondary**: Secondary accent color border
  - **neutral**: Neutral gray border
  - **safe**: Success/safe state border (green)
  - **info**: Informational state border (blue)
  - **caution**: Caution state border (yellow)
  - **warning**: Warning state border (orange)
  - **danger**: Danger/error state border (red)

  ### Usage Examples
  \`\`\`html
  <!-- Basic card -->
  <org-card>
    <org-card-content>
      Simple card content
    </org-card-content>
  </org-card>

  <!-- Card with header -->
  <org-card>
    <org-card-header title="Card Title" subtitle="Optional subtitle" />
    <org-card-content>
      Card content
    </org-card-content>
  </org-card>

  <!-- Card with image (explicit dimensions) -->
  <org-card>
    <org-card-header title="Image Card" />
    <org-card-image
      src="image.jpg"
      alt="Description"
      [width]="400"
      [height]="200"
    />
    <org-card-content>
      Card with image
    </org-card-content>
  </org-card>

  <!-- Card with image (fill mode) -->
  <org-card>
    <org-card-image src="image.jpg" alt="Description" />
    <org-card-content>Card with fill-mode image</org-card-content>
  </org-card>

  <!-- Complete card with footer -->
  <org-card color="primary">
    <org-card-header title="Complete Card" subtitle="All sections" [headingLevel]="2" />
    <org-card-image src="image.jpg" alt="Description" [width]="400" [height]="200" />
    <org-card-content>
      Card content with all sections
    </org-card-content>
    <org-card-footer alignment="end">
      <org-button color="secondary">Cancel</org-button>
      <org-button color="primary">Save</org-button>
    </org-card-footer>
  </org-card>
  \`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Card>;

export const Default: Story = {
  args: {
    color: CARD_COLOR_DEFAULT,
    boxBorder: CARD_BOX_BORDER_DEFAULT,
    containerClass: CARD_CONTAINER_CLASS_DEFAULT,
  },
  argTypes: {
    color: {
      control: 'select',
      options: [null, ...cardColors],
      description: 'The color variant of the card border',
    },
    boxBorder: {
      control: 'select',
      options: allBoxBorders,
      description: 'The border/visual style variant of the card container',
    },
    containerClass: {
      control: 'text',
      description: 'CSS class(es) applied to the outermost container element',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default card with header and content. Use the controls to interact with the component. Note: projected content (header/content) is fixed in this story; only card-level inputs are interactive.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <org-card [color]="color" [boxBorder]="boxBorder" [containerClass]="containerClass">
          <org-card-header title="Card Title" subtitle="Optional subtitle" />
          <org-card-content>
            This is a card with header and content.
          </org-card-content>
        </org-card>
      </div>
    `,
    moduleMetadata: {
      imports: [Card, CardHeader, CardContent],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all color variants for card borders (default and 9 color options).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants"
        currentState="Comparing default and all 9 color border options"
      >
        <org-storybook-example-container-section label="Default (No Border Color)">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Default Card" />
              <org-card-content>
                Card with no colored border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary">
          <div class="max-w-sm">
            <org-card color="primary">
              <org-card-header title="Primary Card" />
              <org-card-content>
                Card with primary color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <div class="max-w-sm">
            <org-card color="secondary">
              <org-card-header title="Secondary Card" />
              <org-card-content>
                Card with secondary color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <div class="max-w-sm">
            <org-card color="neutral">
              <org-card-header title="Neutral Card" />
              <org-card-content>
                Card with neutral color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe (Success)">
          <div class="max-w-sm">
            <org-card color="safe">
              <org-card-header title="Safe Card" />
              <org-card-content>
                Card with safe (success) color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <div class="max-w-sm">
            <org-card color="info">
              <org-card-header title="Info Card" />
              <org-card-content>
                Card with info color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <div class="max-w-sm">
            <org-card color="caution">
              <org-card-header title="Caution Card" />
              <org-card-content>
                Card with caution color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <div class="max-w-sm">
            <org-card color="warning">
              <org-card-header title="Warning Card" />
              <org-card-content>
                Card with warning color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger (Error)">
          <div class="max-w-sm">
            <org-card color="danger">
              <org-card-header title="Danger Card" />
              <org-card-content>
                Card with danger (error) color border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Default</strong>: No colored border, standard card appearance</li>
          <li><strong>Primary</strong>: Primary color for main content cards</li>
          <li><strong>Secondary</strong>: Secondary accent color for supporting content</li>
          <li><strong>Neutral</strong>: Neutral gray for low-emphasis cards</li>
          <li><strong>Safe</strong>: Green for success/positive status cards</li>
          <li><strong>Info</strong>: Blue for informational cards</li>
          <li><strong>Caution</strong>: Yellow for caution/warning cards</li>
          <li><strong>Warning</strong>: Orange for important warnings</li>
          <li><strong>Danger</strong>: Red for error/critical status cards</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Card, CardHeader, CardContent, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const BoxBorders: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all box border options that control the card border/visual style.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Box Borders"
        currentState="Comparing bordered, borderless, and border-thick borders"
      >
        <org-storybook-example-container-section label="Bordered (Default)">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Bordered Card" />
              <org-card-content>
                Card with standard bordered style.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Borderless">
          <div class="max-w-sm">
            <org-card boxBorder="borderless">
              <org-card-header title="Borderless Card" />
              <org-card-content>
                Card with no border.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Border Thick">
          <div class="max-w-sm">
            <org-card boxBorder="border-thick">
              <org-card-header title="Thick Border Card" />
              <org-card-content>
                Card with a thick border style.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Bordered</strong>: Standard thin border around the card</li>
          <li><strong>Borderless</strong>: No visible border</li>
          <li><strong>Border Thick</strong>: Heavier border weight for emphasis</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Card, CardHeader, CardContent, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Compositions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different card compositions using various combinations of sub-components (header, image, content, footer).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Card Compositions"
        currentState="Comparing different combinations of card sub-components"
      >
        <org-storybook-example-container-section label="Content Only">
          <div class="max-w-sm">
            <org-card>
              <org-card-content>
                Minimal card with just content.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Header + Content">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Card Title" subtitle="Optional subtitle" />
              <org-card-content>
                Card with header and content.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Header + Image + Content">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Image Card" />
              <org-card-image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                alt="Example image"
                [width]="400"
                [height]="200"
              />
              <org-card-content>
                Card with header, image, and content.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Image + Content (No Header)">
          <div class="max-w-sm">
            <org-card>
              <org-card-image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                alt="Example image"
                [width]="400"
                [height]="200"
              />
              <org-card-content>
                Card with image at top, no header.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Header + Content + Footer">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Action Card" />
              <org-card-content>
                Card with header, content, and footer actions.
              </org-card-content>
              <org-card-footer alignment="end">
                <org-button color="primary">Action</org-button>
              </org-card-footer>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Complete (All Sections)">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Complete Card" subtitle="All sections" />
              <org-card-image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                alt="Example image"
                [width]="400"
                [height]="200"
              />
              <org-card-content>
                Card with all available sections.
              </org-card-content>
              <org-card-footer alignment="end">
                <org-button color="secondary">Cancel</org-button>
                <org-button color="primary">Save</org-button>
              </org-card-footer>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Content Only</strong>: Minimal card structure with just content</li>
          <li><strong>Header + Content</strong>: Standard card with title/subtitle and content</li>
          <li><strong>Header + Image + Content</strong>: Card with full-width image below header</li>
          <li><strong>Image + Content</strong>: Image-first card without header</li>
          <li><strong>Header + Content + Footer</strong>: Card with action buttons in footer</li>
          <li><strong>Complete</strong>: All sections combined for maximum flexibility</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Card,
        CardHeader,
        CardImage,
        CardContent,
        CardFooter,
        Button,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const FooterAlignments: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different footer alignment options (start, center, end).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Footer Alignments"
        currentState="Comparing start, center, and end alignments"
      >
        <org-storybook-example-container-section label="Start Aligned (Left)">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Start Aligned" />
              <org-card-content>
                Footer buttons aligned to the start (left).
              </org-card-content>
              <org-card-footer alignment="start">
                <org-button color="primary">Action</org-button>
              </org-card-footer>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Center Aligned">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Center Aligned" />
              <org-card-content>
                Footer buttons aligned to the center.
              </org-card-content>
              <org-card-footer alignment="center">
                <org-button color="primary">Action</org-button>
              </org-card-footer>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="End Aligned (Right)">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="End Aligned" />
              <org-card-content>
                Footer buttons aligned to the end (right).
              </org-card-content>
              <org-card-footer alignment="end">
                <org-button color="primary">Action</org-button>
              </org-card-footer>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Start</strong>: Buttons aligned to the left side of the footer</li>
          <li><strong>Center</strong>: Buttons centered in the footer</li>
          <li><strong>End</strong>: Buttons aligned to the right side of the footer (default for action buttons)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Card,
        CardHeader,
        CardContent,
        CardFooter,
        Button,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const CardImageFullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of card image full width on and off.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Card Image Full Width"
        currentState="Comparing fullWidth true and false"
      >
        <org-storybook-example-container-section label="Full Width (Default)">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Full Width Image" />
              <org-card-image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                alt="Example image"
                [width]="400"
                [height]="200"
              />
              <org-card-content>
                Image stretches to the full width of the card.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Not Full Width">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Contained Image" />
              <org-card-image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                alt="Example image"
                [width]="400"
                [height]="200"
                [fullWidth]="false"
              />
              <org-card-content>
                Image rendered at its natural dimensions inside the card.
              </org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Full Width</strong>: Image stretches to fill the card width edge to edge</li>
          <li><strong>Not Full Width</strong>: Image renders at its intrinsic dimensions</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Card, CardHeader, CardImage, CardContent, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CardHeaderHeadingLevel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different heading levels on card header. Use the appropriate level to match the document outline where the card is placed.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Card Header Heading Level"
        currentState="Comparing heading levels h1 through h6"
      >
        <org-storybook-example-container-section label="H1">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Heading Level 1" subtitle="headingLevel=1" [headingLevel]="1" />
              <org-card-content>Card content.</org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="H2">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Heading Level 2" subtitle="headingLevel=2" [headingLevel]="2" />
              <org-card-content>Card content.</org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="H3 (Default)">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Heading Level 3" subtitle="headingLevel=3 (default)" />
              <org-card-content>Card content.</org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="H4">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Heading Level 4" subtitle="headingLevel=4" [headingLevel]="4" />
              <org-card-content>Card content.</org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="H5">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Heading Level 5" subtitle="headingLevel=5" [headingLevel]="5" />
              <org-card-content>Card content.</org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="H6">
          <div class="max-w-sm">
            <org-card>
              <org-card-header title="Heading Level 6" subtitle="headingLevel=6" [headingLevel]="6" />
              <org-card-content>Card content.</org-card-content>
            </org-card>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>All heading levels render with the same visual styles</li>
          <li>Choose the level that matches the document outline where the card is placed</li>
          <li>Default is h3; use h2 for top-level section cards</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Card, CardHeader, CardContent, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
