import { Directive, computed, input, output, signal } from '@angular/core';

/** default value for the fileUploadFileTypes input */
export const FILE_UPLOAD_FILE_TYPES_DEFAULT: string[] = [];

/** the internal state shape for the file-upload brain directive */
type FileUploadState = {
  fileName: string | undefined;
  isHovering: boolean;
  error: string | undefined;
};

/**
 * headless brain directive for the file-upload component. owns the drop-zone hover state, the selected-file name,
 * the validation error message, file-type validation against the configured accept list, and the public api the
 * presentation calls from native drag / drop / change events.
 */
@Directive({
  selector: '[orgFileUploadBrain]',
  exportAs: 'orgFileUploadBrain',
  host: {
    '(dragover)': 'handleDragOver($event)',
    '(dragleave)': 'handleDragLeave($event)',
    '(drop)': 'handleDrop($event)',
  },
})
export class FileUploadBrainDirective {
  private readonly _state = signal<FileUploadState>({
    fileName: undefined,
    isHovering: false,
    error: undefined,
  });

  /** accepted file types; supports prefix (e.g. "image/") or exact mime type (e.g. "image/png") */
  public readonly fileUploadFileTypes = input<string[]>(FILE_UPLOAD_FILE_TYPES_DEFAULT);

  /** emits the selected file when a valid file is chosen */
  public readonly fileUploadFileSelected = output<File>();

  /** the name of the currently selected file */
  public readonly fileName = computed<string | undefined>(() => this._state().fileName);

  /** whether the drop zone is currently being hovered during a drag operation */
  public readonly isHovering = computed<boolean>(() => this._state().isHovering);

  /** current validation or selection error message */
  public readonly error = computed<string | undefined>(() => this._state().error);

  /** comma-separated accepted file types string for the native input accept attribute */
  public readonly fileTypesAsString = computed<string>(() => this.fileUploadFileTypes().join(','));

  /** activates hover state during drag-over */
  public handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: true }));
  }

  /** clears hover state when drag leaves the drop zone */
  public handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: false }));
  }

  /** processes a dropped file from a drag-and-drop operation */
  public handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: false }));

    const file = event.dataTransfer?.files[0];

    this._processFile(file);
  }

  /** processes a file picked through the native input change event */
  public handleNativeFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this._processFile(file);
  }

  private _isFileValid(file: File): boolean {
    const types = this.fileUploadFileTypes();

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
        error: `Invalid file type. Please select one of the following: ${this.fileUploadFileTypes().join(', ')}.`,
      }));

      return;
    }

    this._state.update((state) => ({ ...state, fileName: file.name, error: undefined }));
    this.fileUploadFileSelected.emit(file);
  }
}
