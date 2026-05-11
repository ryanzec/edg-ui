import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Label } from '../label/label';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  FILE_UPLOAD_ARIA_LABEL_DEFAULT,
  FILE_UPLOAD_BROWSE_LABEL_DEFAULT,
  FILE_UPLOAD_DISABLED_DEFAULT,
  FILE_UPLOAD_FILE_TYPES_DEFAULT,
  FILE_UPLOAD_HINT_DEFAULT,
  FILE_UPLOAD_PROMPT_DEFAULT,
  FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT,
  FileUploadComponent,
  FileUploadExternalState,
  allFileUploadExternalStates,
} from './file-upload';

const externalStateItems: ButtonToggleItem[] = [
  { label: 'none', value: 'none', buttonColor: 'primary' },
  ...allFileUploadExternalStates.map<ButtonToggleItem>((state) => ({
    label: state,
    value: state,
    buttonColor: 'primary',
  })),
];

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

  A drag-and-drop file selector with a click-to-open file picker. Single file. Built as a styled \`<label>\` wrapping a hidden \`<input type="file">\` — clicking anywhere in the drop zone opens the native picker; dragging activates the hover state; selecting (or dropping) replaces the empty-state copy with a selected-file row in-place. State is driven entirely by \`data-state\` on the host.

  ### Features
  - Drag and drop file picking
  - Click anywhere to open the native picker
  - File type validation with prefix or exact mime match
  - Visual states: idle, hover (drag-over), selected, uploading, success, failure, error, disabled
  - Externally driven upload-pipeline states (uploading / success / failure) for hosts wrapping their own upload logic
  - Externally driven error message override
  - Auto-derived file meta (extension + size) with override support
  - Remove affordance with destructive intent on hover
  - Reactive Forms integration via ControlValueAccessor (value type \`File | null\`)
  - Keyboard accessible (focus the input + Enter / Space)

  ### File Type Validation
  - **Empty array** (default): accepts all file types
  - **Prefix matching**: \`"image/"\` accepts all image/* mime types
  - **Exact matching**: \`"image/png"\` accepts only that mime type
  - **Multiple types**: provide multiple entries in the array

  ### External State Override
  When the host wraps its own upload pipeline, pass \`externalState\` (\`uploading\` / \`success\` / \`failure\`) to overlay the visual state once a file has been selected. Brain still owns idle / hover / selected / error.
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
    disabled: FILE_UPLOAD_DISABLED_DEFAULT,
    prompt: FILE_UPLOAD_PROMPT_DEFAULT,
    browseLabel: FILE_UPLOAD_BROWSE_LABEL_DEFAULT,
    hint: FILE_UPLOAD_HINT_DEFAULT,
    fileMeta: undefined,
    errorMessage: undefined,
    externalState: undefined,
    removeAriaLabel: FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT,
  },
  argTypes: {
    fileTypes: {
      control: 'object',
      description: 'Array of accepted file types. Supports prefix matching ("image/") or exact matching ("image/png")',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label applied to the drop-zone label element',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the drop zone is disabled and non-interactive',
    },
    prompt: {
      control: 'text',
      description: 'Prompt copy rendered before the cta in the empty state',
    },
    browseLabel: {
      control: 'text',
      description: 'CTA text rendered as a link affordance after the prompt',
    },
    hint: {
      control: 'text',
      description: 'Hint copy rendered beneath the prompt; doubles as the error message slot in error state',
    },
    fileMeta: {
      control: 'text',
      description: 'Meta copy rendered beneath the file name; auto-derived from the file when not provided',
    },
    errorMessage: {
      control: 'text',
      description: 'External error message override; takes precedence over internal validation errors when set',
    },
    externalState: {
      control: 'select',
      options: [undefined, ...allFileUploadExternalStates],
      description: 'Externally driven state overlay for upload-pipeline visuals (only honoured when a file is selected)',
    },
    removeAriaLabel: {
      control: 'text',
      description: 'Accessible label applied to the remove button',
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
    template: `
      <org-file-upload
        [fileTypes]="fileTypes"
        [ariaLabel]="ariaLabel"
        [disabled]="disabled"
        [prompt]="prompt"
        [browseLabel]="browseLabel"
        [hint]="hint"
        [fileMeta]="fileMeta"
        [errorMessage]="errorMessage"
        [externalState]="externalState"
        [removeAriaLabel]="removeAriaLabel"
      />
    `,
    moduleMetadata: {
      imports: [FileUploadComponent],
    },
  }),
};

@Component({
  selector: 'story-file-upload-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FileUploadComponent,
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
        align-items: stretch;
        justify-content: center;
        width: 100%;
        min-height: 6rem; /* 96px */
      }

      .canvas-stage org-file-upload {
        width: 100%;
        max-width: 28rem; /* 448px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Drag a file onto the zone or click to open the picker. The accept list is set to image/png, image/jpeg, application/pdf — drop something else in to see the validation error."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="External state">
            <org-button-toggle [items]="externalStateItems" formControlName="externalState" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-file-upload
              [fileTypes]="acceptedTypes"
              [disabled]="liveDemoForm.controls.disabled.value"
              [externalState]="resolvedExternalState()"
              hint="Accepts PNG, JPG, PDF · up to 10MB"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class FileUploadLiveDemoStory {
  protected readonly externalStateItems = externalStateItems;

  protected readonly acceptedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

  protected readonly liveDemoForm = new FormGroup({
    externalState: new FormControl<string>('none', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
  });

  /** maps the toggle's "none" value to undefined so the brain falls back to its own state */
  protected readonly resolvedExternalState = toSignal(
    this.liveDemoForm.controls.externalState.valueChanges.pipe(
      map((value) => (value === 'none' ? undefined : (value as FileUploadExternalState)))
    ),
    { initialValue: undefined as FileUploadExternalState | undefined }
  );
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Toggle the external state to overlay an uploading / success / failure visual on top of a picked file, or disable the zone entirely. Drop or pick an unsupported file type to trigger the validation error.',
      },
    },
  },
  render: () => ({
    template: `<story-file-upload-live-demo />`,
    moduleMetadata: {
      imports: [FileUploadLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-file-upload-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FileUploadComponent,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="States" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <div class="flex flex-col gap-1">
              <small class="font-weight-medium text-muted text-uppercase letter-spacing-wide">Idle · Empty</small>
              <org-file-upload hint="Accepts PNG, JPG · up to 10MB" />
            </div>
            <div class="flex flex-col gap-1">
              <small class="font-weight-medium text-muted text-uppercase letter-spacing-wide">Selected</small>
              <org-file-upload [formControl]="selectedFile" fileMeta="PDF · 2.4 MB" />
            </div>
            <div class="flex flex-col gap-1">
              <small class="font-weight-medium text-muted text-uppercase letter-spacing-wide">Upload · Success</small>
              <org-file-upload
                [formControl]="successFile"
                externalState="success"
                fileMeta="Uploaded · 2.4 MB"
              />
            </div>
            <div class="flex flex-col gap-1">
              <small class="font-weight-medium text-muted text-uppercase letter-spacing-wide">Upload · Failure</small>
              <org-file-upload
                [formControl]="failureFile"
                externalState="failure"
                fileMeta="Upload failed · retry"
              />
            </div>
            <div class="flex flex-col gap-1">
              <small class="font-weight-medium text-muted text-uppercase letter-spacing-wide">Error · Validation</small>
              <org-file-upload errorMessage='"notes.txt" isn&#39;t an accepted file type. Try PNG, JPG, or PDF.' />
            </div>
            <div class="flex flex-col gap-1">
              <small class="font-weight-medium text-muted text-uppercase letter-spacing-wide">Disabled</small>
              <org-file-upload [disabled]="true" hint="Uploads are paused for this project" />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Idle</strong>: Resting drop zone with surface-2 background and default-color dashed border</li>
          <li><strong>Hover</strong>: Drag-over only — info-tinted border + background + icon (not driven by CSS :hover)</li>
          <li><strong>Selected</strong>: File row replaces the empty stack; outer padding tightens; remove button revealed</li>
          <li><strong>Uploading / Success / Failure</strong>: Externally driven overlays for hosts wrapping their own upload pipeline; meta text recolors per state</li>
          <li><strong>Error</strong>: Empty stack stays; danger-tinted border + background + icon; hint slot carries the message</li>
          <li><strong>Disabled</strong>: Fades the zone, blocks pointer events, and disables both the input and the remove button</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="File Type Restrictions" />
        <org-design-system-demo-canvas slot="canvas">
          <org-file-upload hint="No restrictions · all file types accepted" />
          <org-file-upload [fileTypes]="['image/']" hint="Images only" />
          <org-file-upload [fileTypes]="['image/png']" hint="PNG only" />
          <org-file-upload [fileTypes]="['image/png', 'image/jpeg', 'application/pdf']" hint="PNG, JPG, or PDF" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>All types</strong>: accepts any file when fileTypes is empty (default)</li>
          <li><strong>Prefix matching</strong>: "image/" accepts all image/* mime types</li>
          <li><strong>Exact matching</strong>: "image/png" accepts only that specific mime type</li>
          <li><strong>Multiple</strong>: combine any number of prefix or exact entries</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class FileUploadShowcaseStory {
  /** mock files seed the brain's selected-file state so the file-row states render in the showcase */
  protected readonly selectedFile = new FormControl<File | null>(
    new File(['mock'], 'design-spec.pdf', { type: 'application/pdf' })
  );

  protected readonly successFile = new FormControl<File | null>(
    new File(['mock'], 'design-spec.pdf', { type: 'application/pdf' })
  );

  protected readonly failureFile = new FormControl<File | null>(
    new File(['mock'], 'design-spec.pdf', { type: 'application/pdf' })
  );
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every file-upload state — idle, drag-over (hover), selected, uploading, success, failure, validation error, and disabled — alongside the file type restriction modes.',
      },
    },
  },
  render: () => ({
    template: `<story-file-upload-showcase />`,
    moduleMetadata: {
      imports: [FileUploadShowcaseStory],
    },
  }),
};

@Component({
  selector: 'story-file-upload-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FileUploadComponent,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Non-Form Usage" />
        <org-design-system-demo-canvas slot="canvas">
          <org-file-upload (fileSelected)="onFileSelected($event)" (removed)="onRemoved()" />
          <p>
            Selected:
            <strong>{{ selectedFileName() ?? 'none' }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Listens to the <code>fileSelected</code> output to track the picked file</li>
          <li>Listens to the <code>removed</code> output to clear local state when the user clicks the remove button</li>
          <li>The host owns the file reference — no Angular Forms binding involved</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class FileUploadNonFormStory {
  protected readonly selectedFileName = signal<string | undefined>(undefined);

  protected onFileSelected(file: File): void {
    this.selectedFileName.set(file.name);
  }

  protected onRemoved(): void {
    this.selectedFileName.set(undefined);
  }
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the file-upload outside of a reactive form using the `(fileSelected)` and `(removed)` outputs.',
      },
    },
  },
  render: () => ({
    template: `<story-file-upload-non-form />`,
    moduleMetadata: {
      imports: [FileUploadNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-file-upload-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FileUploadComponent,
    FormFields,
    FormField,
    Label,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    ReactiveFormsModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive Form Integration"
          [description]="'Form Valid: ' + uploadForm.valid + ', Has File: ' + (formValueDisplay() ? 'yes' : 'no')"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="uploadForm" class="flex flex-col gap-2">
            <org-form-fields>
              <org-form-field>
                <org-label text="Resume" />
                <org-file-upload [fileTypes]="['application/pdf']" hint="PDF only · 5 MB max." formControlName="resume" />
              </org-form-field>
            </org-form-fields>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Uses <strong>formControlName</strong> for reactive forms integration via ControlValueAccessor</li>
          <li>Form value is the picked <code>File</code> instance, or <code>null</code> when removed</li>
          <li>Calling <strong>form.disable()</strong> or <strong>control.disable()</strong> reflects in the drop zone via setDisabledState</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class FileUploadReactiveFormStory {
  protected readonly uploadForm = new FormGroup({
    resume: new FormControl<File | null>(null),
  });

  protected readonly formValueDisplay = toSignal(
    this.uploadForm.valueChanges.pipe(map((value) => !!value.resume)),
    { initialValue: false }
  );
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating the file upload with Angular reactive forms via ControlValueAccessor.',
      },
    },
  },
  render: () => ({
    template: `<story-file-upload-reactive-form />`,
    moduleMetadata: {
      imports: [FileUploadReactiveFormStory],
    },
  }),
};
