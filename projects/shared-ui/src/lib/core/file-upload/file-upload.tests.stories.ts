import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import {
  FILE_UPLOAD_ARIA_LABEL_DEFAULT,
  FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT,
  FileUploadComponent,
  FileUploadExternalState,
} from './file-upload';

/** builds a real File so the brain's mime/size/name pipeline runs end-to-end */
const buildFile = (name: string, type: string, contents = 'mock-contents'): File =>
  new File([contents], name, { type });

/** builds a DataTransfer carrying a single file for drag-and-drop simulation */
const buildDataTransfer = (file: File | null): DataTransfer => {
  const dataTransfer = new DataTransfer();

  if (file) {
    dataTransfer.items.add(file);

    // synthetic drag events don't always propagate items into the files collection in test runtimes,
    // so we force the files list to expose the added file to the drop handler
    Object.defineProperty(dataTransfer, 'files', {
      value: [file],
      configurable: true,
      writable: true,
    });
  }

  return dataTransfer;
};

@Component({
  selector: 'story-file-upload-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadComponent],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .file-upload-wrapper {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <div class="file-upload-wrapper">
      <org-file-upload
        data-testid="file-upload"
        [fileTypes]="fileTypes()"
        [ariaLabel]="ariaLabel()"
        [disabled]="disabled()"
        [externalState]="externalState()"
        [errorMessage]="errorMessage()"
        [prompt]="prompt()"
        [browseLabel]="browseLabel()"
        [hint]="hint()"
        [fileMeta]="fileMeta()"
        [removeAriaLabel]="removeAriaLabel()"
        (fileSelected)="onFileSelected($event)"
        (removed)="onRemoved()"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-file-types-images" (click)="fileTypes.set(['image/'])">
        file-types-images
      </button>
      <button type="button" data-testid="ctl-file-types-png" (click)="fileTypes.set(['image/png'])">
        file-types-png
      </button>
      <button
        type="button"
        data-testid="ctl-file-types-pdf-png"
        (click)="fileTypes.set(['image/png', 'application/pdf'])"
      >
        file-types-pdf-png
      </button>
      <button type="button" data-testid="ctl-file-types-clear" (click)="fileTypes.set([])">file-types-clear</button>
      <button type="button" data-testid="ctl-aria-label-custom" (click)="ariaLabel.set('Drop a resume')">
        aria-label-custom
      </button>
      <button type="button" data-testid="ctl-prompt-custom" (click)="prompt.set('Drop your resume')">
        prompt-custom
      </button>
      <button type="button" data-testid="ctl-browse-label-custom" (click)="browseLabel.set('select file')">
        browse-label-custom
      </button>
      <button type="button" data-testid="ctl-hint-set" (click)="hint.set('PNG, JPG · 5MB max')">hint-set</button>
      <button type="button" data-testid="ctl-hint-clear" (click)="hint.set(undefined)">hint-clear</button>
      <button type="button" data-testid="ctl-file-meta-explicit" (click)="fileMeta.set('Custom meta')">
        file-meta-explicit
      </button>
      <button type="button" data-testid="ctl-file-meta-empty" (click)="fileMeta.set('')">file-meta-empty</button>
      <button type="button" data-testid="ctl-file-meta-clear" (click)="fileMeta.set(undefined)">file-meta-clear</button>
      <button type="button" data-testid="ctl-remove-aria-label-custom" (click)="removeAriaLabel.set('Clear selection')">
        remove-aria-label-custom
      </button>
      <button type="button" data-testid="ctl-error-set" (click)="errorMessage.set('Upload failed')">error-set</button>
      <button type="button" data-testid="ctl-error-clear" (click)="errorMessage.set(undefined)">error-clear</button>
      <button type="button" data-testid="ctl-external-uploading" (click)="externalState.set('uploading')">
        external-uploading
      </button>
      <button type="button" data-testid="ctl-external-success" (click)="externalState.set('success')">
        external-success
      </button>
      <button type="button" data-testid="ctl-external-failure" (click)="externalState.set('failure')">
        external-failure
      </button>
      <button type="button" data-testid="ctl-external-clear" (click)="externalState.set(undefined)">
        external-clear
      </button>
    </div>
  `,
})
class StoryFileUploadTestsShell {
  protected readonly fileTypes = signal<string[]>([]);
  protected readonly ariaLabel = signal<string>(FILE_UPLOAD_ARIA_LABEL_DEFAULT);
  protected readonly disabled = signal<boolean>(false);
  protected readonly externalState = signal<FileUploadExternalState | undefined>(undefined);
  protected readonly errorMessage = signal<string | undefined>(undefined);
  protected readonly prompt = signal<string>('Drop a file here, or');
  protected readonly browseLabel = signal<string>('browse');
  protected readonly hint = signal<string | undefined>(undefined);
  protected readonly fileMeta = signal<string | undefined>(undefined);
  protected readonly removeAriaLabel = signal<string>(FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT);

  protected readonly fileSelectedCount = signal<number>(0);
  protected readonly lastFileName = signal<string>('none');
  protected readonly removedCount = signal<number>(0);

  protected readout(): string {
    return [
      `fileSelectedCount=${this.fileSelectedCount()}`,
      `lastFileName=${this.lastFileName()}`,
      `removedCount=${this.removedCount()}`,
    ].join(' ');
  }

  protected onFileSelected(file: File): void {
    this.fileSelectedCount.update((value) => value + 1);
    this.lastFileName.set(file.name);
  }

  protected onRemoved(): void {
    this.removedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-file-upload-reactive-form-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadComponent, ReactiveFormsModule],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .file-upload-wrapper {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <div class="file-upload-wrapper">
      <org-file-upload data-testid="file-upload" [formControl]="formControl" [fileTypes]="['image/png']" />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-form-set-png" (click)="setPngFile()">form-set-png</button>
      <button type="button" data-testid="ctl-form-clear" (click)="formControl.setValue(null)">form-clear</button>
      <button type="button" data-testid="ctl-form-disable" (click)="formControl.disable()">form-disable</button>
      <button type="button" data-testid="ctl-form-enable" (click)="formControl.enable()">form-enable</button>
    </div>
  `,
})
class StoryFileUploadReactiveFormShell {
  protected readonly formControl = new FormControl<File | null>(null);

  /**
   * subscribes to every form-control event so OnPush change detection re-runs the readout
   * after the cva chain finishes pushing into the formControl
   */
  private readonly _formEvents = toSignal(this.formControl.events, { initialValue: null });

  protected readout(): string {
    this._formEvents();

    return [
      `value=${this.formControl.value?.name ?? 'null'}`,
      `disabled=${this.formControl.disabled}`,
      `touched=${this.formControl.touched}`,
      `dirty=${this.formControl.dirty}`,
    ].join(' ');
  }

  protected setPngFile(): void {
    this.formControl.setValue(buildFile('preset.png', 'image/png'));
  }
}

@Component({
  selector: 'story-file-upload-meta-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadComponent, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-file-upload data-testid="file-upload-with-ext" [formControl]="withExtensionControl" />
    <org-file-upload data-testid="file-upload-no-ext" [formControl]="withoutExtensionControl" />
  `,
})
class StoryFileUploadMetaShell {
  protected readonly withExtensionControl = new FormControl<File | null>(
    buildFile('document.pdf', 'application/pdf', 'x'.repeat(2048))
  );

  protected readonly withoutExtensionControl = new FormControl<File | null>(
    buildFile('README', 'text/plain', 'x'.repeat(512))
  );
}

const meta: Meta = {
  title: 'Core/Components/File Upload/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-file-upload-tests-shell />`,
  moduleMetadata: { imports: [StoryFileUploadTestsShell] },
});

const renderReactiveShell: Story['render'] = () => ({
  template: `<story-file-upload-reactive-form-shell />`,
  moduleMetadata: { imports: [StoryFileUploadReactiveFormShell] },
});

const renderMetaShell: Story['render'] = () => ({
  template: `<story-file-upload-meta-shell />`,
  moduleMetadata: { imports: [StoryFileUploadMetaShell] },
});

const getNativeInput = (host: HTMLElement): HTMLInputElement =>
  host.querySelector('[data-testid="file-upload-input"]') as HTMLInputElement;

const getRemoveButton = (host: HTMLElement): HTMLButtonElement =>
  host.querySelector('[data-testid="file-upload-remove"]') as HTMLButtonElement;

// host data-attributes / a11y

export const RendersIdleStateByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await expect(host.getAttribute('data-state')).toBe('idle');
  },
};

export const RendersDefaultAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await expect(host.getAttribute('aria-label')).toBe(FILE_UPLOAD_ARIA_LABEL_DEFAULT);
  },
};

export const ReflectsCustomAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-custom'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Drop a resume'));
  },
};

export const OmitsDisabledAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const ReflectsDisabledAttributesWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const OmitsInvalidAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await expect(host.getAttribute('aria-invalid')).toBeNull();
    await expect(host.getAttribute('aria-describedby')).toBeNull();
  },
};

export const SetsAriaInvalidAndDescribedByWhenErrorPresent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-error-set'));

    await waitFor(() => {
      expect(host.getAttribute('aria-invalid')).toBe('true');

      const describedBy = host.getAttribute('aria-describedby');

      expect(describedBy).not.toBeNull();
      expect(describedBy).toMatch(/^file-upload-error-/);

      const errorRegion = host.querySelector(`#${describedBy}`) as HTMLElement;

      expect(errorRegion).not.toBeNull();
      expect(errorRegion.getAttribute('role')).toBe('alert');
      expect(errorRegion.getAttribute('aria-live')).toBe('polite');
    });
  },
};

// state transitions

export const TransitionsToHoverOnDragOver: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    fireEvent.dragOver(host, { dataTransfer: buildDataTransfer(null) });

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('hover'));
  },
};

export const TransitionsBackToIdleOnDragLeave: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    fireEvent.dragOver(host, { dataTransfer: buildDataTransfer(null) });

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('hover'));

    fireEvent.dragLeave(host, { dataTransfer: buildDataTransfer(null) });

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
  },
};

export const TransitionsToSelectedAfterValidPick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));
  },
};

export const ExternalStateIgnoredWhenNoFileSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-external-uploading'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
  },
};

export const ExternalStateOverridesWhenFileSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));

    await userEvent.click(canvas.getByTestId('ctl-external-uploading'));
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('uploading'));

    await userEvent.click(canvas.getByTestId('ctl-external-success'));
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('success'));

    await userEvent.click(canvas.getByTestId('ctl-external-failure'));
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('failure'));
  },
};

export const ExternalErrorMessagePutsHostInErrorState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-error-set'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
  },
};

export const ErrorTakesPrecedenceOverExternalState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));
    await userEvent.click(canvas.getByTestId('ctl-external-uploading'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('uploading'));

    await userEvent.click(canvas.getByTestId('ctl-error-set'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
  },
};

export const DragEventsIgnoredWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    fireEvent.dragOver(host, { dataTransfer: buildDataTransfer(null) });

    // give state a chance to (incorrectly) change before asserting it didn't
    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));
    await expect(host.getAttribute('data-state')).toBe('idle');
  },
};

// file picking via native input

export const PickingValidFileEmitsFileSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));

    await waitFor(() => {
      expect(readout.textContent).toContain('fileSelectedCount=1');
      expect(readout.textContent).toContain('lastFileName=photo.png');
    });
  },
};

export const PickingIsNoOpWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    // input is disabled in the DOM, but force-dispatch the change event to verify the brain still no-ops
    Object.defineProperty(nativeInput, 'files', {
      value: [buildFile('photo.png', 'image/png')],
      configurable: true,
    });
    fireEvent.change(nativeInput);

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));
    await expect(readout.textContent).toContain('fileSelectedCount=0');
  },
};

export const PickingInvalidFileShowsErrorAndDoesNotEmit: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.click(canvas.getByTestId('ctl-file-types-png'));
    // applyAccept: false lets the file bypass user-event's accept-attribute filter so the brain's
    // own validation runs (mirrors a user choosing "All files" in the native picker)
    await userEvent.upload(nativeInput, buildFile('notes.txt', 'text/plain'), { applyAccept: false });

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('error');

      const hint = host.querySelector('.org-file-upload-hint') as HTMLElement;

      expect(hint?.textContent).toContain('Invalid file type');
      expect(hint?.textContent).toContain('image/png');
    });

    await expect(readout.textContent).toContain('fileSelectedCount=0');
  },
};

export const PrefixMimeMatchAcceptsValidFile: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.click(canvas.getByTestId('ctl-file-types-images'));
    // image/ is a prefix mime match (not a valid HTML accept value) so user-event's accept filter
    // would reject the file; applyAccept: false defers validation to the brain
    await userEvent.upload(nativeInput, buildFile('photo.jpeg', 'image/jpeg'), { applyAccept: false });

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('selected');
      expect(readout.textContent).toContain('fileSelectedCount=1');
    });
  },
};

export const ExactMimeMatchRejectsOtherTypes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.click(canvas.getByTestId('ctl-file-types-png'));
    // bypass user-event's accept filter so the brain's mime validation produces the error state
    await userEvent.upload(nativeInput, buildFile('photo.jpeg', 'image/jpeg'), { applyAccept: false });

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
    await expect(readout.textContent).toContain('fileSelectedCount=0');
  },
};

export const EmptyFileTypesAcceptsAnyFile: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.click(canvas.getByTestId('ctl-file-types-clear'));
    await userEvent.upload(nativeInput, buildFile('notes.txt', 'text/plain'));

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('selected');
      expect(readout.textContent).toContain('fileSelectedCount=1');
    });
  },
};

export const NativeInputForwardsAcceptFromFileTypes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-file-types-pdf-png'));

    await waitFor(() => {
      const nativeInput = getNativeInput(host);

      expect(nativeInput.accept).toBe('image/png,application/pdf');
    });
  },
};

export const NativeInputDisabledWhenComponentDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(getNativeInput(host).disabled).toBe(true));
  },
};

// drag-and-drop

export const DroppingValidFileSelectsItAndEmits: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');

    fireEvent.drop(host, { dataTransfer: buildDataTransfer(buildFile('dropped.png', 'image/png')) });

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('selected');
      expect(readout.textContent).toContain('fileSelectedCount=1');
      expect(readout.textContent).toContain('lastFileName=dropped.png');
    });
  },
};

export const DroppingClearsHoverState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    fireEvent.dragOver(host, { dataTransfer: buildDataTransfer(null) });
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('hover'));

    fireEvent.drop(host, { dataTransfer: buildDataTransfer(buildFile('dropped.png', 'image/png')) });

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));
  },
};

export const DropIgnoredWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    fireEvent.drop(host, { dataTransfer: buildDataTransfer(buildFile('dropped.png', 'image/png')) });

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));
    await expect(host.getAttribute('data-state')).toBe('idle');
    await expect(readout.textContent).toContain('fileSelectedCount=0');
  },
};

export const DropWithoutFileIsNoOp: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');

    fireEvent.drop(host, { dataTransfer: buildDataTransfer(null) });

    // a drop without a file still clears the hover state but does not change selection
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
    await expect(readout.textContent).toContain('fileSelectedCount=0');
  },
};

// removal

export const RemoveClearsFileAndEmitsRemoved: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));

    await userEvent.click(getRemoveButton(host));

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('idle');
      expect(readout.textContent).toContain('removedCount=1');
    });
  },
};

export const RemoveButtonHasDefaultAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await expect(getRemoveButton(host).getAttribute('aria-label')).toBe(FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT);
  },
};

export const RemoveButtonReflectsCustomAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-remove-aria-label-custom'));

    await waitFor(() => expect(getRemoveButton(host).getAttribute('aria-label')).toBe('Clear selection'));
  },
};

export const RemoveButtonDisabledWhenComponentDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(getRemoveButton(host).disabled).toBe(true));
  },
};

// view rendering

export const RendersDefaultPromptAndBrowseLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const promptText = host.querySelector('.org-file-upload-prompt') as HTMLElement;

    await expect(promptText.textContent?.trim()).toContain('Drop a file here, or');
    await expect(promptText.querySelector('.org-file-upload-cta')?.textContent?.trim()).toBe('browse');
  },
};

export const RendersCustomPromptAndBrowseLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-prompt-custom'));
    await userEvent.click(canvas.getByTestId('ctl-browse-label-custom'));

    await waitFor(() => {
      const promptText = host.querySelector('.org-file-upload-prompt') as HTMLElement;

      expect(promptText.textContent?.trim()).toContain('Drop your resume');
      expect(promptText.querySelector('.org-file-upload-cta')?.textContent?.trim()).toBe('select file');
    });
  },
};

export const RendersHintWhenProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await expect(host.querySelector('.org-file-upload-hint')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-hint-set'));

    await waitFor(() => {
      const hint = host.querySelector('.org-file-upload-hint') as HTMLElement;

      expect(hint).not.toBeNull();
      expect(hint.textContent?.trim()).toBe('PNG, JPG · 5MB max');
    });
  },
};

export const ErrorMessageReplacesHintText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-hint-set'));
    await userEvent.click(canvas.getByTestId('ctl-error-set'));

    await waitFor(() => {
      const hint = host.querySelector('.org-file-upload-hint') as HTMLElement;

      expect(hint.textContent?.trim()).toBe('Upload failed');
    });
  },
};

export const RendersFileNameWhenFileSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));

    await waitFor(() => {
      const fileName = host.querySelector('.org-file-upload-file-name') as HTMLElement;

      expect(fileName.textContent?.trim()).toBe('photo.png');
    });
  },
};

export const AutoDerivedFileMetaShowsExtensionAndSize: Story = {
  render: renderMetaShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload-with-ext');

    await waitFor(() => {
      const meta = host.querySelector('.org-file-upload-file-meta') as HTMLElement;

      expect(meta).not.toBeNull();
      expect(meta.textContent?.trim()).toMatch(/^PDF · /);
    });
  },
};

export const AutoDerivedFileMetaOmitsExtensionWhenAbsent: Story = {
  render: renderMetaShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload-no-ext');

    await waitFor(() => {
      const meta = host.querySelector('.org-file-upload-file-meta') as HTMLElement;

      expect(meta).not.toBeNull();
      expect(meta.textContent?.trim()).not.toContain('·');
    });
  },
};

export const ExplicitFileMetaOverridesAutoDerived: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));
    await userEvent.click(canvas.getByTestId('ctl-file-meta-explicit'));

    await waitFor(() => {
      const meta = host.querySelector('.org-file-upload-file-meta') as HTMLElement;

      expect(meta.textContent?.trim()).toBe('Custom meta');
    });
  },
};

export const EmptyExplicitFileMetaSuppressesAutoDerived: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('photo.png', 'image/png'));
    await userEvent.click(canvas.getByTestId('ctl-file-meta-empty'));

    await waitFor(() => expect(host.querySelector('.org-file-upload-file-meta')).toBeNull());
  },
};

// reactive forms / cva

export const WriteValueSetsSelectedFile: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-form-set-png'));

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('selected');

      const fileName = host.querySelector('.org-file-upload-file-name') as HTMLElement;

      expect(fileName.textContent?.trim()).toBe('preset.png');
    });
  },
};

export const WriteValueNullClearsSelectedFile: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-form-set-png'));
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));

    await userEvent.click(canvas.getByTestId('ctl-form-clear'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
  },
};

export const PickingFilePushesFileIntoFormControl: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('upload.png', 'image/png'));

    await waitFor(() => {
      expect(readout.textContent).toContain('value=upload.png');
      expect(readout.textContent).toContain('dirty=true');
      expect(readout.textContent).toContain('touched=true');
    });
  },
};

export const RemovingFileSetsFormValueToNull: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = getNativeInput(host);

    await userEvent.upload(nativeInput, buildFile('upload.png', 'image/png'));
    await waitFor(() => expect(readout.textContent).toContain('value=upload.png'));

    await userEvent.click(getRemoveButton(host));

    await waitFor(() => expect(readout.textContent).toContain('value=null'));
  },
};

export const FormDisablePropagatesToComponent: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
      expect(getNativeInput(host).disabled).toBe(true);
    });
  },
};

export const FormEnableReversesDisabledState: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('file-upload');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));
    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-form-enable'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
      expect(getNativeInput(host).disabled).toBe(false);
    });
  },
};
