import { Directive, computed, input, output, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { v4 as uuidv4 } from 'uuid';

/** all valid externally-driven file-upload states (consumer-controlled overlay) */
export const allFileUploadExternalStates = ['uploading', 'success', 'failure'] as const;

/** externally-driven state used to overlay an upload pipeline on the brain's internal state */
export type FileUploadExternalState = (typeof allFileUploadExternalStates)[number];

/** all valid resolved file-upload states (the value applied to `data-state`) */
export const allFileUploadStates = [
  'idle',
  'hover',
  'selected',
  'uploading',
  'success',
  'failure',
  'error',
] as const;

/** the resolved state surfaced via `data-state` on the host */
export type FileUploadState = (typeof allFileUploadStates)[number];

/** default value for the fileTypes input */
export const FILE_UPLOAD_FILE_TYPES_DEFAULT: string[] = [];

/** default value for the ariaLabel input */
export const FILE_UPLOAD_ARIA_LABEL_DEFAULT = 'Upload file — click or drag and drop to select a file';

/** default value for the disabled input */
export const FILE_UPLOAD_DISABLED_DEFAULT = false;

/** default value for the externalState input */
export const FILE_UPLOAD_EXTERNAL_STATE_DEFAULT: FileUploadExternalState | undefined = undefined;

/** default value for the errorMessage input */
export const FILE_UPLOAD_ERROR_MESSAGE_DEFAULT: string | undefined = undefined;

/** static a11y role applied to the error region */
export const FILE_UPLOAD_ERROR_ROLE = 'alert';

/** static a11y aria-live value applied to the error region */
export const FILE_UPLOAD_ERROR_ARIA_LIVE = 'polite';

/** the internal state shape for the directive */
type InternalState = {
  selectedFile: File | undefined;
  isHovering: boolean;
  internalError: string | undefined;
  formDisabled: boolean;
};

/**
 * headless brain directive for the file-upload component. owns the drag-over hover state, the selected file,
 * the internal validation error, file-type validation against the configured accept list, drag-and-drop event
 * handlers, and the resolved `data-state` value. carries no styling or template — apply it via host directives.
 * opening the native file picker is handled by the consumer template (a `<label>` wrapping a clipped
 * `<input type="file">`) using native browser behaviour; no click handler is required.
 */
@Directive({
  selector: '[orgFileUploadBrain]',
  exportAs: 'orgFileUploadBrain',
  host: {
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-invalid]': 'error() ? "true" : null',
    '[attr.aria-describedby]': 'error() ? errorRegionId : null',
    '(dragover)': 'dragOver($event)',
    '(dragleave)': 'dragLeave($event)',
    '(drop)': 'drop($event)',
  },
})
export class FileUploadBrainDirective {
  private readonly _state = signal<InternalState>({
    selectedFile: undefined,
    isHovering: false,
    internalError: undefined,
    formDisabled: false,
  });

  /** accepted file types; supports prefix (e.g. "image/") or exact mime type (e.g. "image/png") */
  public readonly fileTypes = input<string[]>(FILE_UPLOAD_FILE_TYPES_DEFAULT);

  /** accessible label applied to the host element */
  public readonly ariaLabel = input<string>(FILE_UPLOAD_ARIA_LABEL_DEFAULT);

  /** whether the drop zone is disabled and non-interactive */
  public readonly disabled = input<boolean>(FILE_UPLOAD_DISABLED_DEFAULT);

  /** externally-driven state overlay for upload-pipeline visuals; only honoured when a file is selected */
  public readonly externalState = input<FileUploadExternalState | undefined, FileUploadExternalState | null | undefined>(
    FILE_UPLOAD_EXTERNAL_STATE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** externally-driven error message; takes precedence over the brain's internal validation error when set */
  public readonly errorMessage = input<string | undefined, string | null | undefined>(
    FILE_UPLOAD_ERROR_MESSAGE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** static a11y role to apply to the error region */
  public readonly errorRole = FILE_UPLOAD_ERROR_ROLE;

  /** static a11y aria-live value to apply to the error region */
  public readonly errorAriaLive = FILE_UPLOAD_ERROR_ARIA_LIVE;

  /** stable dom id for the error region; used by aria-describedby on the host */
  public readonly errorRegionId = `file-upload-error-${uuidv4()}`;

  /** emits the selected file when a valid file is chosen */
  public readonly fileSelected = output<File>();

  /** emits when the selected file is cleared via removeFile() */
  public readonly removed = output<void>();

  /** the currently selected file (or undefined when none is selected) */
  public readonly selectedFile = computed<File | undefined>(() => this._state().selectedFile);

  /** the name of the currently selected file */
  public readonly fileName = computed<string | undefined>(() => this._state().selectedFile?.name);

  /** the size in bytes of the currently selected file */
  public readonly fileSize = computed<number | undefined>(() => this._state().selectedFile?.size);

  /** the mime type of the currently selected file */
  public readonly fileType = computed<string | undefined>(() => this._state().selectedFile?.type);

  /** whether the drop zone is currently being hovered during a drag operation */
  public readonly isHovering = computed<boolean>(() => this._state().isHovering);

  /** resolved disabled state — the `disabled` input OR the form-disabled state set via reactive forms */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._state().formDisabled);

  /** resolved error message — externally provided takes precedence over internal validation */
  public readonly error = computed<string | undefined>(() => this.errorMessage() ?? this._state().internalError);

  /** comma-separated accepted file types string for the native input accept attribute */
  public readonly fileTypesAsString = computed<string>(() => this.fileTypes().join(','));

  /** resolved data-state — externalState only overrides idle/selected when a file is present */
  public readonly state = computed<FileUploadState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this._state().isHovering) {
      return 'hover';
    }

    const external = this.externalState();
    const hasFile = !!this._state().selectedFile;

    if (external && hasFile) {
      return external;
    }

    if (hasFile) {
      return 'selected';
    }

    return 'idle';
  });

  /** processes a file picked through the native input change event; called from the consumer template */
  public nativeFileSelected(event: Event): void {
    if (this.isDisabled()) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];

    // user dismissed the picker without choosing a file — treat as a no-op, not an error
    if (!file) {
      return;
    }

    this._processFile(file);
  }

  /** clears the currently selected file and any internal validation error; emits the removed output */
  public removeFile(): void {
    if (this.isDisabled()) {
      return;
    }

    this._state.update((state) => ({ ...state, selectedFile: undefined, internalError: undefined }));
    this.removed.emit();
  }

  /** sets the currently selected file from an external source (e.g. ControlValueAccessor.writeValue) */
  public setSelectedFile(file: File | undefined): void {
    this._state.update((state) => ({ ...state, selectedFile: file, internalError: undefined }));
  }

  /** sets the form-disabled state from the reactive forms api (ControlValueAccessor.setDisabledState) */
  public setFormDisabled(isFormDisabled: boolean): void {
    this._state.update((state) => ({ ...state, formDisabled: isFormDisabled }));
  }

  /** activates hover state during drag-over */
  protected dragOver(event: DragEvent): void {
    if (this.isDisabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: true }));
  }

  /** clears hover state when drag leaves the drop zone */
  protected dragLeave(event: DragEvent): void {
    if (this.isDisabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: false }));
  }

  /** processes a dropped file from a drag-and-drop operation */
  protected drop(event: DragEvent): void {
    if (this.isDisabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this._state.update((state) => ({ ...state, isHovering: false }));

    const file = event.dataTransfer?.files[0];

    if (!file) {
      return;
    }

    this._processFile(file);
  }

  private _isFileValid(file: File): boolean {
    const types = this.fileTypes();

    return types.length === 0 || types.some((type) => file.type.startsWith(type));
  }

  private _processFile(file: File): void {
    if (!this._isFileValid(file)) {
      this._state.update((state) => ({
        ...state,
        internalError: `Invalid file type. Please select one of the following: ${this.fileTypes().join(', ')}.`,
      }));

      return;
    }

    this._state.update((state) => ({ ...state, selectedFile: file, internalError: undefined }));
    this.fileSelected.emit(file);
  }
}
