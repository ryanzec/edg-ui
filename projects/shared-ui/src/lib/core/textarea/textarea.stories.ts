import type { Meta, StoryObj } from '@storybook/angular';
import { Textarea, allTextareaVariants, allTextareaIconAlignments } from './textarea';
import { TextareaToolbar } from './textarea-toolbar';
import { TextareaToolbarItem } from './textarea-toolbar-item';
import { allIconNames } from '../../brain/icon-brain/icon-brain';
import { FormField } from '../form-fields/form-field';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { FormFields } from '../form-fields/form-fields';
import { Button } from '../button/button';

const meta: Meta<Textarea> = {
  title: 'Core/Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Textarea Component

  A flexible textarea component with support for icons, validation, inline items (tags), icon alignment, and accessibility features.

  ### Features
  - Two visual variants: bordered and borderless
  - Optional pre and post icons with alignment control
  - Inline items/tags support
  - Validation message display
  - Select all on focus behavior
  - Auto-focus support
  - Disabled and readonly states
  - Configurable rows
  - Inverse enter behavior (Shift+Enter vs Enter for submission)
  - Full keyboard accessibility

  ### Variants
  - **bordered**: Standard textarea with visible border
  - **borderless**: Minimal textarea without border

  ### Icon Alignment
  - **start**: Icon aligned to the top
  - **center**: Icon aligned to the middle (default for postIcon)
  - **end**: Icon aligned to the bottom (default for preIcon)

  ### Usage Examples
  \`\`\`html
  <!-- Basic textarea -->
  <org-textarea name="textarea" placeholder="Enter text..." />

  <!-- Textarea with variant -->
  <org-textarea name="textarea" variant="borderless" placeholder="Borderless textarea" />

  <!-- Textarea with icons -->
  <org-textarea name="textarea" preIcon="cog" placeholder="Settings" />
  <org-textarea name="textarea" postIcon="arrow-right" placeholder="Submit" />

  <!-- Textarea with icon alignment -->
  <org-textarea
    name="textarea"
    postIcon="arrow-right"
    postIconAlignment="end"
    placeholder="Icon at bottom"
  />

  <!-- Textarea with inline items (tags) -->
  <org-textarea
    name="textarea"
    placeholder="Add tags..."
    [inlineItems]="[
      { id: '1', label: 'React', removable: true },
      { id: '2', label: 'Angular', removable: true }
    ]"
  />

  <!-- Textarea with inverse enter behavior -->
  <org-textarea
    name="textarea"
    [inverseEnter]="true"
    placeholder="Press Enter to submit, Shift+Enter for new line"
  />

  <!-- Textarea with custom rows -->
  <org-textarea name="textarea" [rows]="5" placeholder="Larger textarea" />
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Textarea>;

export const Default: Story = {
  args: {
    name: 'textarea',
    placeholder: 'Enter text...',
    preIcon: null,
    postIcon: null,
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'the name attribute for the textarea element',
    },
    variant: {
      control: 'select',
      options: allTextareaVariants,
      description: 'the visual variant of the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder text for the textarea',
    },
    value: {
      control: 'text',
      description: 'the current value of the textarea',
    },
    disabled: {
      control: 'boolean',
      description: 'whether the textarea is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'whether the textarea is readonly',
    },
    preIcon: {
      control: 'select',
      options: [null, ...allIconNames],
      description: 'icon to display before the textarea text',
    },
    preIconAriaLabel: {
      control: 'text',
      description: 'accessible label for the pre-icon button when it is interactive',
    },
    postIcon: {
      control: 'select',
      options: [null, ...allIconNames],
      description: 'icon to display after the textarea text',
    },
    postIconAriaLabel: {
      control: 'text',
      description: 'accessible label for the post-icon button when it is interactive',
    },
    preIconAlignment: {
      control: 'select',
      options: allTextareaIconAlignments,
      description: 'vertical alignment of the pre icon',
    },
    postIconAlignment: {
      control: 'select',
      options: allTextareaIconAlignments,
      description: 'vertical alignment of the post icon',
    },
    selectAllOnFocus: {
      control: 'boolean',
      description: 'whether to select all text when the textarea receives focus',
    },
    autoFocus: {
      control: 'boolean',
      description: 'whether the textarea should automatically receive focus',
    },
    inlineItems: {
      control: 'object',
      description: 'array of inline items (tags) to display inside the textarea',
    },
    inverseEnter: {
      control: 'boolean',
      description: 'when true, enter submits and shift+enter adds new line (inverse of default)',
    },
    rows: {
      control: 'number',
      description: 'number of visible text rows',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default textarea with bordered variant. Use the controls below to interact with the component.',
      },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of bordered and borderless variants.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Variant Comparison"
        currentState="Comparing bordered and borderless variants"
      >
        <org-storybook-example-container-section label="Bordered (default)">
          <org-textarea name="textarea" variant="bordered" placeholder="Bordered textarea" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Borderless">
          <org-textarea name="textarea" variant="borderless" placeholder="Borderless textarea" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>bordered</strong>: Standard textarea with visible border (default)</li>
          <li><strong>borderless</strong>: Minimal styling without border</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Textareas with pre icons, post icons, or both.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Icon Variations"
        currentState="Comparing textareas with different icon configurations"
      >
        <org-storybook-example-container-section label="No icons">
          <org-textarea name="textarea" placeholder="No icons" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Pre icon only">
          <org-textarea name="textarea" preIcon="cog" placeholder="Settings" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Post icon only">
          <org-textarea name="textarea" postIcon="arrow-right" placeholder="Submit" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Both icons">
          <org-textarea name="textarea" preIcon="cog" postIcon="arrow-right" placeholder="Both icons" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>preIcon</strong>: Icon displayed before the textarea text</li>
          <li><strong>postIcon</strong>: Icon displayed after the textarea text</li>
          <li>Both icons can be used simultaneously</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const IconAlignment: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Icon alignment options (start, center, end) for vertical positioning.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Icon Alignment"
        currentState="Comparing different icon alignment options"
      >
        <org-storybook-example-container-section label="Post icon - Start (top)">
          <org-textarea
            postIcon="arrow-right"
            postIconAlignment="start"
            placeholder="Icon at top"
            [rows]="5"
            name="textarea"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Post icon - Center (middle)">
          <org-textarea
            postIcon="arrow-right"
            postIconAlignment="center"
            placeholder="Icon at center"
            [rows]="5"
            name="textarea"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Post icon - End (bottom)">
          <org-textarea
            postIcon="arrow-right"
            postIconAlignment="end"
            placeholder="Icon at bottom"
            [rows]="5"
            name="textarea"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Pre icon - Start (top)">
          <org-textarea
            preIcon="cog"
            preIconAlignment="start"
            placeholder="Icon at top"
            [rows]="5"
            name="textarea"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>start</strong>: Icon aligned to the top (default for preIcon)</li>
          <li><strong>center</strong>: Icon aligned to the middle</li>
          <li><strong>end</strong>: Icon aligned to the bottom (default for postIcon)</li>
          <li>Alignment is particularly useful for multi-row textareas</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const EnterBehavior: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Normal vs. inverse enter key behavior for form submission.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Enter Key Behavior"
        currentState="Comparing normal and inverse enter behavior"
      >
        <org-storybook-example-container-section label="Normal (default)">
          <org-textarea
            placeholder="Enter = new line, Shift+Enter = submit"
            [rows]="3"
            name="textarea"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inverse">
          <org-textarea
            [inverseEnter]="true"
            placeholder="Enter = submit, Shift+Enter = new line"
            [rows]="3"
            name="textarea"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Normal</strong>: Enter adds new line, Shift+Enter emits submitKeyPressed event</li>
          <li><strong>Inverse</strong>: Enter emits submitKeyPressed event, Shift+Enter adds new line</li>
          <li>Useful for chat interfaces or quick-submit forms</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const InlineItems: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Textarea with inline items (tags/chips) displayed inside the field.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Inline Items (Tags)"
        currentState="Textarea with tags displayed inline"
      >
        <org-storybook-example-container-section label="Without inline items">
          <org-textarea name="textarea" placeholder="Add tags..." />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With inline items (removable)">
          <org-textarea
            name="textarea"
            placeholder="Add more tags..."
            [inlineItems]="[
      { id: '1', label: 'React', removable: true },
      { id: '2', label: 'Angular', removable: true },
              { id: '3', label: 'Vue', removable: true }
            ]"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With non-removable items">
          <org-textarea
            name="textarea"
            placeholder="Type here..."
            [inlineItems]="[
              { id: '1', label: 'TypeScript', removable: false },
              { id: '2', label: 'JavaScript', removable: false }
            ]"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Inline items are displayed as tags inside the textarea</li>
          <li>Items with <strong>removable: true</strong> show an X button</li>
          <li>Clicking the X button emits <strong>inlineItemRemoved</strong> event</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of disabled, readonly, and normal states.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Textarea States"
        currentState="Comparing disabled, readonly, and normal states"
      >
        <org-storybook-example-container-section label="Normal (enabled)">
          <org-textarea name="textarea" placeholder="Normal textarea" value="Editable text" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled">
          <org-textarea name="textarea" [disabled]="true" placeholder="Disabled textarea" value="Cannot edit" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Readonly">
          <org-textarea
            name="textarea"
            [readonly]="true"
            placeholder="Readonly textarea"
            value="Cannot edit but can focus"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Normal</strong>: Fully interactive and editable</li>
          <li><strong>Disabled</strong>: Cannot focus, edit, or interact</li>
          <li><strong>Readonly</strong>: Can focus but cannot edit</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Validation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Textarea with validation error messages.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Validation States"
        currentState="Comparing valid and invalid textareas"
      >
        <org-storybook-example-container-section label="Valid (no error)">
          <org-textarea name="textarea" placeholder="Valid textarea" value="This is valid content" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid (with error message)">
          <org-form-field validationMessage="Description must be at least 20 characters">
            <org-textarea
              name="textarea"
              placeholder="Invalid textarea"
              value="Too short"
            />
          </org-form-field>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Borderless with error">
          <org-form-field validationMessage="This field is required">
            <org-textarea
              name="textarea"
              variant="borderless"
              placeholder="Required field"
            />
          </org-form-field>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With icon and error">
          <org-form-field validationMessage="Description is too short">
            <org-textarea
              name="textarea"
              preIcon="cog"
              placeholder="Description"
              value="Invalid"
            />
          </org-form-field>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>When <strong>validationMessage</strong> is provided, textarea shows error state</li>
          <li>Error message is displayed below the textarea</li>
          <li>Textarea border changes to error color (red)</li>
          <li>Works with all variants and icon configurations</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, FormField, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const RowSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Textareas with different row counts for varying heights.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Row Sizes"
        currentState="Comparing different row counts"
      >
        <org-storybook-example-container-section label="Small (2 rows)">
          <org-textarea name="textarea" [rows]="2" placeholder="Small textarea with 2 rows" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Default (3 rows)">
          <org-textarea name="textarea" [rows]="3" placeholder="Default textarea with 3 rows" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Medium (5 rows)">
          <org-textarea name="textarea" [rows]="5" placeholder="Medium textarea with 5 rows" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large (8 rows)">
          <org-textarea name="textarea" [rows]="8" placeholder="Large textarea with 8 rows" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>rows</strong>: Controls the visible height of the textarea</li>
          <li>Default is 3 rows</li>
          <li>Textarea is still resizable by the user (browser default)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const SpecialBehaviors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Special textarea behaviors like select all on focus and auto-focus.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Special Behaviors"
        currentState="Demonstrating select all on focus behavior"
      >
        <org-storybook-example-container-section label="Normal focus behavior">
          <org-textarea name="textarea" placeholder="Click to focus" value="Normal focus behavior" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Select all on focus">
            <org-textarea
            name="textarea"
            [selectAllOnFocus]="true"
            placeholder="Click to focus"
            value="Text will be selected on focus"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>selectAllOnFocus</strong>: Automatically selects all text when textarea receives focus</li>
          <li><strong>autoFocus</strong>: Automatically focuses the textarea when component mounts</li>
          <li>Useful for forms where quick editing is needed</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ClickableIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Textareas with pre and post icons that emit click events when outputs are observed.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Clickable Icons"
        currentState="Demonstrating clickable pre and post icon events"
      >
        <org-storybook-example-container-section label="Clickable pre-icon">
          <org-textarea
            name="textarea-pre"
            preIcon="cog"
            preIconAriaLabel="open settings"
            placeholder="click the cog icon"
            (preIconClicked)="onPreIconClicked()"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Clickable post-icon">
          <org-textarea
            name="textarea-post"
            postIcon="arrow-right"
            postIconAriaLabel="submit"
            placeholder="click the arrow icon"
            (postIconClicked)="onPostIconClicked()"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Both icons clickable">
          <org-textarea
            name="textarea-both"
            preIcon="cog"
            preIconAriaLabel="open settings"
            postIcon="arrow-right"
            postIconAriaLabel="submit"
            placeholder="both icons are clickable"
            (preIconClicked)="onPreIconClicked()"
            (postIconClicked)="onPostIconClicked()"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>icons with an observed output render as interactive buttons</li>
          <li>clicking a pre or post icon emits the respective output event (check the browser console)</li>
          <li>disabled and readonly states prevent icon click events from firing</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
    props: {
      onPreIconClicked: () => console.log('pre icon clicked'),
      onPostIconClicked: () => console.log('post icon clicked'),
    },
  }),
};

export const ValidationSpaceReservation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of validation space reservation behavior. When reserveValidationSpace is true, space is always reserved for validation messages to maintain consistent layout. When false, space is only used when a validation message is present.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Validation Space Reservation"
        currentState="Comparing space reservation behaviors"
      >
        <org-storybook-example-container-section label="Reserve Space = true (default)">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="true">
              <org-textarea
                name="reserve-true-textarea-1"
                placeholder="Textarea 1 (no error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
              <org-textarea
                name="reserve-true-textarea-2"
                placeholder="Textarea 2 (with error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true">
              <org-textarea
                name="reserve-true-textarea-3"
                placeholder="Textarea 3 (no error)"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Reserve Space = false">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="false">
              <org-textarea
                name="reserve-false-textarea-1"
                placeholder="Textarea 1 (no error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
              <org-textarea
                name="reserve-false-textarea-2"
                placeholder="Textarea 2 (with error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false">
              <org-textarea
                name="reserve-false-textarea-3"
                placeholder="Textarea 3 (no error)"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>reserveValidationSpace=true</strong>: Space is always reserved for validation messages (maintains consistent spacing between textareas)</li>
          <li><strong>reserveValidationSpace=false</strong>: Space is only allocated when a validation message is present (textareas collapse together when no errors)</li>
          <li>Notice how the left column maintains equal spacing between all textareas</li>
          <li>Notice how the right column's textareas 1 and 3 are closer together since they have no error messages</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, FormField, FormFields, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Textarea with an optional toolbar projected via content. The toolbar renders at the bottom of the textarea within the border and includes a send icon button aligned to the right, with projected toolbar items on the left.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Textarea with Toolbar"
        currentState="Demonstrating the optional textarea toolbar"
      >
        <org-storybook-example-container-section label="Toolbar with items">
          <org-textarea name="textarea-toolbar" placeholder="Type a message...">
            <org-textarea-toolbar (sendClicked)="onSendClicked()">
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="attach" ariaLabel="attach" variant="text" preIcon="plus" />
              </org-textarea-toolbar-item>
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="settings" ariaLabel="settings" variant="text" preIcon="cog" />
              </org-textarea-toolbar-item>
            </org-textarea-toolbar>
          </org-textarea>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Toolbar with no items">
          <org-textarea name="textarea-toolbar-empty" placeholder="Type a message...">
            <org-textarea-toolbar (sendClicked)="onSendClicked()" />
          </org-textarea>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Toolbar with inline items (tags)">
          <org-textarea
            name="textarea-toolbar-tags"
            placeholder="Type a message..."
            [inlineItems]="[
              { id: '1', label: 'React', removable: true },
              { id: '2', label: 'Angular', removable: true }
            ]"
          >
            <org-textarea-toolbar (sendClicked)="onSendClicked()">
              <org-textarea-toolbar-item>
                <org-button [iconOnly]="true" label="attach" ariaLabel="attach" variant="text" preIcon="plus" />
              </org-textarea-toolbar-item>
            </org-textarea-toolbar>
          </org-textarea>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Toolbar renders at the bottom of the textarea within the border</li>
          <li>Projected toolbar items align to the left</li>
          <li>Send icon button always aligns to the right</li>
          <li>Clicking the send button emits the <strong>sendClicked</strong> event (check the browser console)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Textarea,
        TextareaToolbar,
        TextareaToolbarItem,
        Button,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
    props: {
      onSendClicked: () => console.log('send clicked'),
    },
  }),
};

export const Lines: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Textarea with a properly configured `lines` input. The textarea starts at the minimum line count and auto-grows until it reaches the maximum, at which point it scrolls.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Auto-Resize by Lines"
        currentState="Textarea starts at 2 lines, grows up to 6 lines, then scrolls"
      >
        <org-storybook-example-container-section label="lines = [2, 6]">
          <org-textarea
            name="textarea-lines-valid"
            placeholder="type multiple lines to see the textarea grow..."
            [lines]="[2, 6]"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Textarea starts at <strong>2 lines</strong> tall (the minimum)</li>
          <li>As content is added, the textarea grows until it reaches <strong>6 lines</strong> (the maximum)</li>
          <li>Beyond the maximum, the textarea scrolls instead of growing further</li>
          <li>Removing content shrinks the textarea back down to the minimum</li>
          <li>When <strong>lines</strong> is valid, the <strong>rows</strong> input is ignored</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const LinesInvalidLength: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Textarea with a `lines` input that does not have exactly 2 elements. Auto-resize is disabled and the `rows` input is used as a fallback. An error is logged to the console.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Invalid Lines - Wrong Length"
        currentState="lines has 1 element instead of 2"
      >
        <org-storybook-example-container-section label="lines = [3] (invalid, falls back to rows)">
          <org-textarea
            name="textarea-lines-invalid-length"
            placeholder="auto-resize disabled, using rows=4"
            [lines]="[3]"
            [rows]="4"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The <strong>lines</strong> input must contain exactly 2 elements</li>
          <li>When invalid, the auto-resize feature is disabled</li>
          <li>The <strong>rows</strong> input is used as a fallback for sizing</li>
          <li>An error with type <strong>textarea-lines-invalid-length</strong> is logged to the browser console</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const LinesInvalidValues: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Textarea with a `lines` input where one or both elements are 0 or negative. Auto-resize is disabled and the `rows` input is used as a fallback. An error is logged to the console.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Invalid Lines - Non-Positive Values"
        currentState="lines has a value that is 0 or negative"
      >
        <org-storybook-example-container-section label="lines = [0, 5] (invalid, falls back to rows)">
          <org-textarea
            name="textarea-lines-invalid-values"
            placeholder="auto-resize disabled, using rows=4"
            [lines]="[0, 5]"
            [rows]="4"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Both elements of <strong>lines</strong> must be greater than 0</li>
          <li>When invalid, the auto-resize feature is disabled</li>
          <li>The <strong>rows</strong> input is used as a fallback for sizing</li>
          <li>An error with type <strong>textarea-lines-invalid-values</strong> is logged to the browser console</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const LinesInvalidOrder: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Textarea with a `lines` input where the second element is less than or equal to the first. Auto-resize is disabled and the `rows` input is used as a fallback. An error is logged to the console.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Invalid Lines - Wrong Order"
        currentState="lines second element is not greater than the first"
      >
        <org-storybook-example-container-section label="lines = [5, 3] (invalid, falls back to rows)">
          <org-textarea
            name="textarea-lines-invalid-order"
            placeholder="auto-resize disabled, using rows=4"
            [lines]="[5, 3]"
            [rows]="4"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The second element of <strong>lines</strong> (max) must be greater than the first (min)</li>
          <li>When invalid, the auto-resize feature is disabled</li>
          <li>The <strong>rows</strong> input is used as a fallback for sizing</li>
          <li>An error with type <strong>textarea-lines-invalid-order</strong> is logged to the browser console</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const InverseEnter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the `inverseEnter` input. When `inverseEnter` is false (default), Shift+Enter emits the `submitKeyPressed` output and Enter inserts a newline. When `inverseEnter` is true, Enter emits the `submitKeyPressed` output and Shift+Enter inserts a newline. Open the browser console to observe when the output fires.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Inverse Enter Behavior"
        currentState="Comparing inverseEnter = false and inverseEnter = true with live output wiring"
      >
        <org-storybook-example-container-section label="inverseEnter = false (default)">
          <org-textarea
            name="textarea-inverse-enter-false"
            placeholder="press Shift+Enter to submit, Enter for newline"
            [rows]="3"
            [inverseEnter]="false"
            (submitKeyPressed)="onSubmitKeyPressed('inverseEnter=false')"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="inverseEnter = true">
          <org-textarea
            name="textarea-inverse-enter-true"
            placeholder="press Enter to submit, Shift+Enter for newline"
            [rows]="3"
            [inverseEnter]="true"
            (submitKeyPressed)="onSubmitKeyPressed('inverseEnter=true')"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>inverseEnter = false</strong>: Enter inserts a newline; Shift+Enter emits the <strong>submitKeyPressed</strong> output</li>
          <li><strong>inverseEnter = true</strong>: Enter emits the <strong>submitKeyPressed</strong> output; Shift+Enter inserts a newline</li>
          <li>Check the browser console to observe when the output fires and which configuration emitted it</li>
          <li>Useful for chat-like interfaces where Enter should submit instead of adding a newline</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Textarea, StorybookExampleContainer, StorybookExampleContainerSection],
    },
    props: {
      onSubmitKeyPressed: (source: string) => console.log('submitKeyPressed fired from', source),
    },
  }),
};
