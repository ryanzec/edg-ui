import { Directive, computed, input, output, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

/** default value for the fileTypes input */
export const FILE_UPLOAD_FILE_TYPES_DEFAULT: string[] = [];

/** default value for the ariaLabel input */
export const FILE_UPLOAD_ARIA_LABEL_DEFAULT = 'Upload file — click or drag and drop to select a file';

/** static a11y role applied to the error region */
export const FILE_UPLOAD_ERROR_ROLE = 'alert';

/** static a11y aria-live value applied to the error region */
export const FILE_UPLOAD_ERROR_ARIA_LIVE = 'polite';

/** the internal state shape for the file-upload brain directive */
type FileUploadState = {
  fileName: string | undefined;
  isHovering: boolean;
  error: string | undefined;
};

/**
 * headless brain directive for the file-upload component. owns the drop-zone hover state, the selected-file name,
 * the validation error message, file-type validation against the configured accept list, all event handlers
 * (click / drag / drop / native input change), and all aria attributes applied to the host button. carries no
 * styling or template — apply it to a native button element inside a presentation component. opening the native
 * file picker is delegated to the consumer through `setOpenPicker`.
 */
@Directive({
  selector: 'button[orgFileUploadBrain]',
  exportAs: 'orgFileUploadBrain',
  host: {
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-invalid]': 'error() ? "true" : null',
    '[attr.aria-describedby]': 'error() ? errorRegionId : null',
    '(click)': 'click($event)',
    '(dragover)': 'dragOver($event)',
    '(dragleave)': 'dragLeave($event)',
    '(drop)': 'drop($event)',
  },
})
export class FileUploadBrainDirective {
  private readonly _state = signal<FileUploadState>({
    fileName: undefined,
    isHovering: false,
    error: undefined,
  });

  private _openPicker: (event: MouseEvent) => void = () => {
    // needs to be overridden by the consumer via setOpenPicker
  };

  /** accepted file types; supports prefix (e.g. "image/") or exact mime type (e.g. "image/png") */
  public readonly fileTypes = input<string[]>(FILE_UPLOAD_FILE_TYPES_DEFAULT);

  /** accessible label applied to the host button */
  public readonly ariaLabel = input<string>(FILE_UPLOAD_ARIA_LABEL_DEFAULT);

  /** static a11y role to apply to the error region */
  public readonly errorRole = FILE_UPLOAD_ERROR_ROLE;

  /** static a11y aria-live value to apply to the error region */
  public readonly errorAriaLive = FILE_UPLOAD_ERROR_ARIA_LIVE;

  /** stable dom id for the error region; used by aria-describedby on the host button */
  public readonly errorRegionId = `file-upload-error-${uuidv4()}`;

  /** emits the selected file when a valid file is chosen */
  public readonly fileSelected = output<File>();

  /** the name of the currently selected file */
  public readonly fileName = computed<string | undefined>(() => this._state().fileName);

  /** whether the drop zone is currently being hovered during a drag operation */
  public readonly isHovering = computed<boolean>(() => this._state().isHovering);

  /** current validation or selection error message */
  public readonly error = computed<string | undefined>(() => this._state().error);

  /** comma-separated accepted file types string for the native input accept attribute */
  public readonly fileTypesAsString = computed<string>(() => this.fileTypes().join(','));

  /** registers the function the brain calls to open the native file picker; lets the consumer own the input ref */
  public setOpenPicker(opener: (event: MouseEvent) => void): void {
    this._openPicker = opener;
  }

  /** processes a file picked through the native input change event; called from the consumer template */
  public nativeFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this._processFile(file);
  }

  /** delegates click handling to the registered opener; the opener guards against the native input bubble loop */
  protected click(event: MouseEvent): void {
    this._openPicker(event);
  }

  /** activates hover state during drag-over */
  protected dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: true }));
  }

  /** clears hover state when drag leaves the drop zone */
  protected dragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: false }));
  }

  /** processes a dropped file from a drag-and-drop operation */
  protected drop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: false }));

    const file = event.dataTransfer?.files[0];

    this._processFile(file);
  }

  private _isFileValid(file: File): boolean {
    const types = this.fileTypes();

    return types.length === 0 || types.some((type) => file.type.startsWith(type));
  }

  private _processFile(file: File | undefined): void {
    if (!file) {
      this._state.update((state) => ({ ...state, error: 'No file was selected.' }));

      return;
    }

    if (!this._isFileValid(file)) {
      this._state.update((state) => ({
        ...state,
        error: `Invalid file type. Please select one of the following: ${this.fileTypes().join(', ')}.`,
      }));

      return;
    }

    this._state.update((state) => ({ ...state, fileName: file.name, error: undefined }));
    this.fileSelected.emit(file);
  }
}
