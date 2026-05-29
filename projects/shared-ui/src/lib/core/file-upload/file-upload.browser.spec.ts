import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import {
  FILE_UPLOAD_ARIA_LABEL_DEFAULT,
  FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT,
  FileUploadComponent,
  type FileUploadExternalState,
} from './file-upload';

/** builds a real File so the brain's mime/size/name pipeline runs end-to-end */
const buildFile = (name: string, type: string, contents = 'mock-contents'): File =>
  new File([contents], name, { type });

/**
 * stubs the native input's files collection and dispatches the change event the brain listens for.
 * preferred over userEvent.upload because it bypasses the accept-attribute filter (mirrors a user picking
 * "All files") and still fires when the input is disabled (needed to verify the brain's disabled no-op).
 */
const pickFile = (input: HTMLInputElement, file: File): void => {
  Object.defineProperty(input, 'files', { value: [file], configurable: true, writable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

/** builds a DataTransfer carrying a single file for drag-and-drop simulation */
const buildDataTransfer = (file: File | null): DataTransfer => {
  const dataTransfer = new DataTransfer();

  if (file) {
    dataTransfer.items.add(file);
  }

  return dataTransfer;
};

/** dispatches a real drag event carrying the optional file onto the host */
const dispatchDragEvent = (host: HTMLElement, type: 'dragover' | 'dragleave' | 'drop', file: File | null): void => {
  const dragEvent = new DragEvent(type, {
    dataTransfer: buildDataTransfer(file),
    bubbles: true,
    cancelable: true,
  });

  host.dispatchEvent(dragEvent);
};

@Component({
  selector: 'test-file-upload-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadComponent],
  host: { class: 'block' },
  template: `
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
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class FileUploadInteractiveHost {
  public readonly fileTypes = signal<string[]>([]);
  public readonly ariaLabel = signal<string>(FILE_UPLOAD_ARIA_LABEL_DEFAULT);
  public readonly disabled = signal<boolean>(false);
  public readonly externalState = signal<FileUploadExternalState | undefined>(undefined);
  public readonly errorMessage = signal<string | undefined>(undefined);
  public readonly prompt = signal<string>('Drop a file here, or');
  public readonly browseLabel = signal<string>('browse');
  public readonly hint = signal<string | undefined>(undefined);
  public readonly fileMeta = signal<string | undefined>(undefined);
  public readonly removeAriaLabel = signal<string>(FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT);

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
  selector: 'test-file-upload-reactive-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadComponent, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-file-upload data-testid="file-upload" [formControl]="formControl" [fileTypes]="['image/png']" />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class FileUploadReactiveFormHost {
  public readonly formControl = new FormControl<File | null>(null);

  /**
   * subscribes to every form-control event so OnPush change detection re-runs the readout after the cva
   * chain finishes pushing into the formControl, otherwise the readout reads a stale value
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
}

@Component({
  selector: 'test-file-upload-meta-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadComponent, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-file-upload data-testid="file-upload-with-ext" [formControl]="withExtensionControl" />
    <org-file-upload data-testid="file-upload-no-ext" [formControl]="withoutExtensionControl" />
  `,
})
class FileUploadMetaHost {
  public readonly withExtensionControl = new FormControl<File | null>(
    buildFile('document.pdf', 'application/pdf', 'x'.repeat(2048))
  );

  public readonly withoutExtensionControl = new FormControl<File | null>(
    buildFile('README', 'text/plain', 'x'.repeat(512))
  );
}

type FileUploadHostConfig = {
  fileTypes?: string[];
  ariaLabel?: string;
  disabled?: boolean;
  externalState?: FileUploadExternalState;
  errorMessage?: string;
  prompt?: string;
  browseLabel?: string;
  hint?: string;
  fileMeta?: string;
  removeAriaLabel?: string;
};

describe('FileUpload (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveFileUpload = (
    config: FileUploadHostConfig = {}
  ): ComponentFixture<FileUploadInteractiveHost> =>
    createFixture(FileUploadInteractiveHost, (instance) => {
      if (config.fileTypes !== undefined) {
        instance.fileTypes.set(config.fileTypes);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.externalState !== undefined) {
        instance.externalState.set(config.externalState);
      }

      if (config.errorMessage !== undefined) {
        instance.errorMessage.set(config.errorMessage);
      }

      if (config.prompt !== undefined) {
        instance.prompt.set(config.prompt);
      }

      if (config.browseLabel !== undefined) {
        instance.browseLabel.set(config.browseLabel);
      }

      if (config.hint !== undefined) {
        instance.hint.set(config.hint);
      }

      if (config.fileMeta !== undefined) {
        instance.fileMeta.set(config.fileMeta);
      }

      if (config.removeAriaLabel !== undefined) {
        instance.removeAriaLabel.set(config.removeAriaLabel);
      }
    });

  const getNativeInput = (host: HTMLElement): HTMLInputElement =>
    host.querySelector('[data-testid="file-upload-input"]') as HTMLInputElement;

  const getRemoveButton = (host: HTMLElement): HTMLButtonElement =>
    host.querySelector('[data-testid="file-upload-remove"]') as HTMLButtonElement;

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attributes and a11y', () => {
    it('renders the idle state by default', () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      expect(host.getAttribute('data-state')).toBe('idle');
    });

    it('renders the default aria-label', () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      expect(host.getAttribute('aria-label')).toBe(FILE_UPLOAD_ARIA_LABEL_DEFAULT);
    });

    it('reflects a custom aria-label', async () => {
      const fixture = createInteractiveFileUpload({ ariaLabel: 'Drop a resume' });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Drop a resume'));
    });

    it('omits the disabled attributes by default', () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects the disabled attributes when disabled', async () => {
      const fixture = createInteractiveFileUpload({ disabled: true });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('omits the invalid attributes by default', () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      expect(host.getAttribute('aria-invalid')).toBeNull();
      expect(host.getAttribute('aria-describedby')).toBeNull();
    });

    it('sets aria-invalid and aria-describedby when an error is present', async () => {
      const fixture = createInteractiveFileUpload({ errorMessage: 'Upload failed' });
      const host = queryByTestId(fixture, 'file-upload');

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
    });
  });

  describe('state transitions', () => {
    it('transitions to hover on drag over', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      dispatchDragEvent(host, 'dragover', null);

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('hover'));
    });

    it('transitions back to idle on drag leave', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      dispatchDragEvent(host, 'dragover', null);
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('hover'));

      dispatchDragEvent(host, 'dragleave', null);
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
    });

    it('transitions to selected after a valid pick', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));
    });

    it('ignores external state when no file is selected', async () => {
      const fixture = createInteractiveFileUpload({ externalState: 'uploading' });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
    });

    it('lets external state override once a file is selected', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));

      fixture.componentInstance.externalState.set('uploading');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('uploading'));

      fixture.componentInstance.externalState.set('success');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('success'));

      fixture.componentInstance.externalState.set('failure');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('failure'));
    });

    it('puts the host in the error state when an external error message is set', async () => {
      const fixture = createInteractiveFileUpload({ errorMessage: 'Upload failed' });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
    });

    it('gives the error message precedence over external state', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));
      fixture.componentInstance.externalState.set('uploading');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('uploading'));

      fixture.componentInstance.errorMessage.set('Upload failed');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
    });

    it('ignores drag events when disabled', async () => {
      const fixture = createInteractiveFileUpload({ disabled: true });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      dispatchDragEvent(host, 'dragover', null);
      await flush(fixture);

      expect(host.getAttribute('data-state')).toBe('idle');
    });
  });

  describe('file picking via native input', () => {
    it('emits fileSelected when picking a valid file', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));

      await waitFor(() => {
        expect(readout.textContent).toContain('fileSelectedCount=1');
        expect(readout.textContent).toContain('lastFileName=photo.png');
      });
    });

    it('is a no-op when disabled', async () => {
      const fixture = createInteractiveFileUpload({ disabled: true });
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));
      await flush(fixture);

      expect(readout.textContent).toContain('fileSelectedCount=0');
    });

    it('shows an error and does not emit for an invalid file', async () => {
      const fixture = createInteractiveFileUpload({ fileTypes: ['image/png'] });
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('notes.txt', 'text/plain'));

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBe('error');

        const hint = host.querySelector('.org-file-upload-hint') as HTMLElement;

        expect(hint?.textContent).toContain('Invalid file type');
        expect(hint?.textContent).toContain('image/png');
      });

      expect(readout.textContent).toContain('fileSelectedCount=0');
    });

    it('accepts a valid file via a prefix mime match', async () => {
      const fixture = createInteractiveFileUpload({ fileTypes: ['image/'] });
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('photo.jpeg', 'image/jpeg'));

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBe('selected');
        expect(readout.textContent).toContain('fileSelectedCount=1');
      });
    });

    it('rejects other types on an exact mime match', async () => {
      const fixture = createInteractiveFileUpload({ fileTypes: ['image/png'] });
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('photo.jpeg', 'image/jpeg'));

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
      expect(readout.textContent).toContain('fileSelectedCount=0');
    });

    it('accepts any file when file types are empty', async () => {
      const fixture = createInteractiveFileUpload({ fileTypes: [] });
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('notes.txt', 'text/plain'));

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBe('selected');
        expect(readout.textContent).toContain('fileSelectedCount=1');
      });
    });

    it('forwards the accept attribute from the file types', async () => {
      const fixture = createInteractiveFileUpload({ fileTypes: ['image/png', 'application/pdf'] });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(getNativeInput(host).accept).toBe('image/png,application/pdf'));
    });

    it('disables the native input when the component is disabled', async () => {
      const fixture = createInteractiveFileUpload({ disabled: true });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(getNativeInput(host).disabled).toBe(true));
    });
  });

  describe('drag and drop', () => {
    it('selects a dropped valid file and emits', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      dispatchDragEvent(host, 'drop', buildFile('dropped.png', 'image/png'));

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBe('selected');
        expect(readout.textContent).toContain('fileSelectedCount=1');
        expect(readout.textContent).toContain('lastFileName=dropped.png');
      });
    });

    it('clears the hover state on drop', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      dispatchDragEvent(host, 'dragover', null);
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('hover'));

      dispatchDragEvent(host, 'drop', buildFile('dropped.png', 'image/png'));
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));
    });

    it('ignores a drop when disabled', async () => {
      const fixture = createInteractiveFileUpload({ disabled: true });
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      dispatchDragEvent(host, 'drop', buildFile('dropped.png', 'image/png'));
      await flush(fixture);

      expect(host.getAttribute('data-state')).toBe('idle');
      expect(readout.textContent).toContain('fileSelectedCount=0');
    });

    it('is a no-op when dropping without a file', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      dispatchDragEvent(host, 'drop', null);

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
      expect(readout.textContent).toContain('fileSelectedCount=0');
    });
  });

  describe('removal', () => {
    it('clears the file and emits removed', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));

      await userEvent.click(getRemoveButton(host));

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBe('idle');
        expect(readout.textContent).toContain('removedCount=1');
      });
    });

    it('uses the default remove aria-label', () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      expect(getRemoveButton(host).getAttribute('aria-label')).toBe(FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT);
    });

    it('reflects a custom remove aria-label', async () => {
      const fixture = createInteractiveFileUpload({ removeAriaLabel: 'Clear selection' });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(getRemoveButton(host).getAttribute('aria-label')).toBe('Clear selection'));
    });

    it('disables the remove button when the component is disabled', async () => {
      const fixture = createInteractiveFileUpload({ disabled: true });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => expect(getRemoveButton(host).disabled).toBe(true));
    });
  });

  describe('view rendering', () => {
    it('renders the default prompt and browse label', () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');
      const promptText = host.querySelector('.org-file-upload-prompt') as HTMLElement;

      expect(promptText.textContent?.trim()).toContain('Drop a file here, or');
      expect(promptText.querySelector('.org-file-upload-cta')?.textContent?.trim()).toBe('browse');
    });

    it('renders a custom prompt and browse label', async () => {
      const fixture = createInteractiveFileUpload({ prompt: 'Drop your resume', browseLabel: 'select file' });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => {
        const promptText = host.querySelector('.org-file-upload-prompt') as HTMLElement;

        expect(promptText.textContent?.trim()).toContain('Drop your resume');
        expect(promptText.querySelector('.org-file-upload-cta')?.textContent?.trim()).toBe('select file');
      });
    });

    it('renders the hint when provided', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      expect(host.querySelector('.org-file-upload-hint')).toBeNull();

      fixture.componentInstance.hint.set('PNG, JPG · 5MB max');

      await waitFor(() => {
        const hint = host.querySelector('.org-file-upload-hint') as HTMLElement;

        expect(hint).not.toBeNull();
        expect(hint.textContent?.trim()).toBe('PNG, JPG · 5MB max');
      });
    });

    it('replaces the hint text with the error message', async () => {
      const fixture = createInteractiveFileUpload({ hint: 'PNG, JPG · 5MB max', errorMessage: 'Upload failed' });
      const host = queryByTestId(fixture, 'file-upload');

      await waitFor(() => {
        const hint = host.querySelector('.org-file-upload-hint') as HTMLElement;

        expect(hint.textContent?.trim()).toBe('Upload failed');
      });
    });

    it('renders the file name when a file is selected', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));

      await waitFor(() => {
        const fileName = host.querySelector('.org-file-upload-file-name') as HTMLElement;

        expect(fileName.textContent?.trim()).toBe('photo.png');
      });
    });

    it('auto-derives the file meta showing the extension and size', async () => {
      const fixture = createFixture(FileUploadMetaHost);
      const host = queryByTestId(fixture, 'file-upload-with-ext');

      await waitFor(() => {
        const meta = host.querySelector('.org-file-upload-file-meta') as HTMLElement;

        expect(meta).not.toBeNull();
        expect(meta.textContent?.trim()).toMatch(/^PDF · /);
      });
    });

    it('omits the extension in auto-derived meta when absent', async () => {
      const fixture = createFixture(FileUploadMetaHost);
      const host = queryByTestId(fixture, 'file-upload-no-ext');

      await waitFor(() => {
        const meta = host.querySelector('.org-file-upload-file-meta') as HTMLElement;

        expect(meta).not.toBeNull();
        expect(meta.textContent?.trim()).not.toContain('·');
      });
    });

    it('lets explicit file meta override the auto-derived value', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));
      fixture.componentInstance.fileMeta.set('Custom meta');

      await waitFor(() => {
        const meta = host.querySelector('.org-file-upload-file-meta') as HTMLElement;

        expect(meta.textContent?.trim()).toBe('Custom meta');
      });
    });

    it('suppresses the auto-derived meta with an empty explicit value', async () => {
      const fixture = createInteractiveFileUpload();
      const host = queryByTestId(fixture, 'file-upload');

      pickFile(getNativeInput(host), buildFile('photo.png', 'image/png'));
      fixture.componentInstance.fileMeta.set('');

      await waitFor(() => expect(host.querySelector('.org-file-upload-file-meta')).toBeNull());
    });
  });

  describe('reactive forms / cva', () => {
    it('sets the selected file from writeValue', async () => {
      const fixture = createFixture(FileUploadReactiveFormHost);
      const host = queryByTestId(fixture, 'file-upload');

      fixture.componentInstance.formControl.setValue(buildFile('preset.png', 'image/png'));

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBe('selected');

        const fileName = host.querySelector('.org-file-upload-file-name') as HTMLElement;

        expect(fileName.textContent?.trim()).toBe('preset.png');
      });
    });

    it('clears the selected file when writeValue receives null', async () => {
      const fixture = createFixture(FileUploadReactiveFormHost);
      const host = queryByTestId(fixture, 'file-upload');

      fixture.componentInstance.formControl.setValue(buildFile('preset.png', 'image/png'));
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('selected'));

      fixture.componentInstance.formControl.setValue(null);
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('idle'));
    });

    it('pushes a picked file into the form control', async () => {
      const fixture = createFixture(FileUploadReactiveFormHost);
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('upload.png', 'image/png'));

      await waitFor(() => {
        expect(readout.textContent).toContain('value=upload.png');
        expect(readout.textContent).toContain('dirty=true');
        expect(readout.textContent).toContain('touched=true');
      });
    });

    it('sets the form value to null when the file is removed', async () => {
      const fixture = createFixture(FileUploadReactiveFormHost);
      const host = queryByTestId(fixture, 'file-upload');
      const readout = queryByTestId(fixture, 'readout');

      pickFile(getNativeInput(host), buildFile('upload.png', 'image/png'));
      await waitFor(() => expect(readout.textContent).toContain('value=upload.png'));

      await userEvent.click(getRemoveButton(host));

      await waitFor(() => expect(readout.textContent).toContain('value=null'));
    });

    it('propagates a form disable to the component', async () => {
      const fixture = createFixture(FileUploadReactiveFormHost);
      const host = queryByTestId(fixture, 'file-upload');

      fixture.componentInstance.formControl.disable();

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
        expect(getNativeInput(host).disabled).toBe(true);
      });
    });

    it('reverses the disabled state on form enable', async () => {
      const fixture = createFixture(FileUploadReactiveFormHost);
      const host = queryByTestId(fixture, 'file-upload');

      fixture.componentInstance.formControl.disable();
      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      fixture.componentInstance.formControl.enable();

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBeNull();
        expect(host.getAttribute('aria-disabled')).toBeNull();
        expect(getNativeInput(host).disabled).toBe(false);
      });
    });
  });
});
