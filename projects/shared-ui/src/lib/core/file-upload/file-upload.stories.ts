import type { Meta, StoryObj } from '@storybook/angular';
import { FileUploadComponent, FILE_UPLOAD_ARIA_LABEL_DEFAULT, FILE_UPLOAD_FILE_TYPES_DEFAULT } from './file-upload';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<FileUploadComponent> = {
  title: 'Core/Components/File Upload',
  component: FileUploadComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## File Upload Component

  A component that provides drag-and-drop and click-to-select file upload functionality with file type validation.

  ### Features
  - Drag and drop file upload
  - Click to open file selector
  - File type validation with prefix or exact match support
  - Visual feedback for hover, success, and error states
  - Keyboard accessible via native button behavior
  - Emits selected file through \`fileSelected\` output

  ### File Type Validation
  - **Empty array**: Accepts all file types
  - **Prefix matching**: Use "image/" to accept all image types
  - **Exact matching**: Use "image/png" to accept only PNG images
  - **Multiple types**: Provide multiple entries in the array

  ### Usage Examples
  \`\`\`html
  <!-- Accept all file types -->
  <org-file-upload (fileSelected)="onUpload($event)"></org-file-upload>

  <!-- Accept all images -->
  <org-file-upload [fileTypes]="['image/']" (fileSelected)="onUpload($event)"></org-file-upload>

  <!-- Accept only PNG images -->
  <org-file-upload [fileTypes]="['image/png']" (fileSelected)="onUpload($event)"></org-file-upload>

  <!-- Accept multiple specific types -->
  <org-file-upload [fileTypes]="['image/png', 'image/jpeg', 'application/pdf']" (fileSelected)="onUpload($event)"></org-file-upload>

  <!-- Override the accessible label -->
  <org-file-upload ariaLabel="Upload your profile photo" (fileSelected)="onUpload($event)"></org-file-upload>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FileUploadComponent>;

export const Default: Story = {
  args: {
    fileTypes: FILE_UPLOAD_FILE_TYPES_DEFAULT,
    ariaLabel: FILE_UPLOAD_ARIA_LABEL_DEFAULT,
  },
  argTypes: {
    fileTypes: {
      control: 'object',
      description:
        'Array of accepted file types. Supports prefix matching (e.g., "image/") or exact matching (e.g., "image/png")',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label applied to the inner drop-zone button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: FILE_UPLOAD_ARIA_LABEL_DEFAULT },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default file upload with full controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<org-file-upload [fileTypes]="fileTypes" [ariaLabel]="ariaLabel"></org-file-upload>`,
    moduleMetadata: {
      imports: [FileUploadComponent],
    },
  }),
};

export const FileTypes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all file type restriction modes. Try uploading different file types to observe acceptance and error messages.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="File Type Restrictions"
        currentState="Try uploading files of different types to see acceptance behavior and error messages"
      >
        <org-storybook-example-container-section label="All File Types (Default)">
          <org-file-upload></org-file-upload>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Image Prefix (image/)">
          <org-file-upload [fileTypes]="['image/']"></org-file-upload>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Specific Type (image/png only)">
          <org-file-upload [fileTypes]="['image/png']"></org-file-upload>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multiple Types (PNG, JPEG, PDF)">
          <org-file-upload [fileTypes]="['image/png', 'image/jpeg', 'application/pdf']"></org-file-upload>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>All types</strong>: accepts any file when fileTypes is empty (default)</li>
          <li><strong>Prefix matching</strong>: "image/" accepts all image/* mime types</li>
          <li><strong>Exact matching</strong>: "image/png" accepts only that specific mime type</li>
          <li><strong>Multiple</strong>: combine any number of prefix or exact entries</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FileUploadComponent, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
