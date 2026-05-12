import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { angularUtils, fileUtils } from '@organization/shared-utils';
import { Icon } from '../icon/icon';
import {
  FileUploadBrainDirective,
  FILE_UPLOAD_ARIA_LABEL_DEFAULT,
  FILE_UPLOAD_DISABLED_DEFAULT,
  FILE_UPLOAD_ERROR_MESSAGE_DEFAULT,
  FILE_UPLOAD_EXTERNAL_STATE_DEFAULT,
  FILE_UPLOAD_FILE_TYPES_DEFAULT,
  allFileUploadExternalStates,
  allFileUploadStates,
} from '../../brain/file-upload-brain/file-upload-brain';
import type { FileUploadExternalState, FileUploadState } from '../../brain/file-upload-brain/file-upload-brain';

export {
  FILE_UPLOAD_ARIA_LABEL_DEFAULT,
  FILE_UPLOAD_DISABLED_DEFAULT,
  FILE_UPLOAD_ERROR_MESSAGE_DEFAULT,
  FILE_UPLOAD_EXTERNAL_STATE_DEFAULT,
  FILE_UPLOAD_FILE_TYPES_DEFAULT,
  allFileUploadExternalStates,
  allFileUploadStates,
};
export type { FileUploadExternalState, FileUploadState };

/** default value for the prompt input */
export const FILE_UPLOAD_PROMPT_DEFAULT = 'Drop a file here, or';

/** default value for the browseLabel input */
export const FILE_UPLOAD_BROWSE_LABEL_DEFAULT = 'browse';

/** default value for the hint input */
export const FILE_UPLOAD_HINT_DEFAULT: string | undefined = undefined;

/** default value for the fileMeta input */
export const FILE_UPLOAD_FILE_META_DEFAULT: string | undefined = undefined;

/** default value for the removeAriaLabel input */
export const FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT = 'Remove file';

@Component({
  selector: 'org-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  hostDirectives: [
    {
      directive: FileUploadBrainDirective,
      inputs: ['fileTypes', 'ariaLabel', 'disabled', 'externalState', 'errorMessage'],
      outputs: ['fileSelected', 'removed'],
    },
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  protected readonly brain = inject(FileUploadBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: File | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /** accepted file types; supports prefix (e.g. "image/") or exact mime type (e.g. "image/png") */
  public readonly fileTypes = input<string[]>(FILE_UPLOAD_FILE_TYPES_DEFAULT);

  /** accessible label applied to the drop-zone label element */
  public readonly ariaLabel = input<string>(FILE_UPLOAD_ARIA_LABEL_DEFAULT);

  /** whether the drop zone is disabled and non-interactive */
  public readonly disabled = input<boolean>(FILE_UPLOAD_DISABLED_DEFAULT);

  /** externally-driven state overlay for upload-pipeline visuals (uploading | success | failure) */
  public readonly externalState = input<
    FileUploadExternalState | undefined,
    FileUploadExternalState | null | undefined
  >(FILE_UPLOAD_EXTERNAL_STATE_DEFAULT, { transform: angularUtils.transformNullToUndefined });

  /** externally-driven error message; takes precedence over internal validation errors when set */
  public readonly errorMessage = input<string | undefined, string | null | undefined>(
    FILE_UPLOAD_ERROR_MESSAGE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** customizable prompt copy rendered before the cta in the empty state */
  public readonly prompt = input<string>(FILE_UPLOAD_PROMPT_DEFAULT);

  /** customizable cta text rendered as a link affordance after the prompt */
  public readonly browseLabel = input<string>(FILE_UPLOAD_BROWSE_LABEL_DEFAULT);

  /** customizable hint copy rendered beneath the prompt; doubles as the error message slot in error state */
  public readonly hint = input<string | undefined, string | null | undefined>(FILE_UPLOAD_HINT_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** customizable meta copy rendered beneath the file name; auto-derived from the file when not provided */
  public readonly fileMeta = input<string | undefined, string | null | undefined>(FILE_UPLOAD_FILE_META_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label applied to the remove button */
  public readonly removeAriaLabel = input<string>(FILE_UPLOAD_REMOVE_ARIA_LABEL_DEFAULT);

  /** re-exposed brain output emitted when a valid file is selected via picker or drop */
  public readonly fileSelected = output<File>();

  /** re-exposed brain output emitted when the selected file is cleared */
  public readonly removed = output<void>();

  /** resolved meta copy — explicit input wins, otherwise auto-derived from the selected file */
  protected readonly resolvedFileMeta = computed<string>(() => {
    const explicit = this.fileMeta();

    if (explicit !== undefined) {
      return explicit;
    }

    const file = this.brain.selectedFile();

    if (!file) {
      return '';
    }

    const extension = fileUtils.getFileExtension(file.name);
    const size = fileUtils.formatBytes(file.size);

    return extension ? `${extension} · ${size}` : size;
  });

  constructor() {
    this.brain.fileSelected.subscribe((file) => {
      this._onChange(file);
      this._onTouched();
    });

    this.brain.removed.subscribe(() => {
      this._onChange(null);
      this._onTouched();
    });
  }

  /** handles the native input change event; delegates the picked file to the brain */
  protected onNativeChange(event: Event): void {
    this.brain.nativeFileSelected(event);
  }

  /** handles the remove button click; prevents the label from re-opening the picker */
  protected onRemoveClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.brain.removeFile();
  }

  /** sets the selected file from the reactive forms api */
  public writeValue(value: File | null): void {
    this.brain.setSelectedFile(value ?? undefined);
  }

  /** registers the on-change callback for reactive forms */
  public registerOnChange(fn: (value: File | null) => void): void {
    this._onChange = fn;
  }

  /** registers the on-touched callback for reactive forms */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** receives the form-disabled state from reactive forms */
  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}
