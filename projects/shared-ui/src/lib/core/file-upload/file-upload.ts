import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { Icon } from '../icon/icon';
import { FileUploadBrainDirective } from '../../brain/file-upload-brain/file-upload-brain';

/** default value for the fileTypes input */
export const FILE_UPLOAD_FILE_TYPES_DEFAULT: string[] = [];

@Component({
  selector: 'org-file-upload',
  imports: [Icon],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: FileUploadBrainDirective,
      inputs: ['fileTypes'],
    },
  ],
  host: {
    '[attr.data-hovering]': 'isHovering() ? "" : null',
    '[attr.data-has-file]': 'fileName() ? "" : null',
    '[attr.data-has-error]': 'error() ? "" : null',
  },
})
export class FileUploadComponent {
  protected readonly brain = inject(FileUploadBrainDirective, { self: true });

  /** emits the selected file when a valid file is chosen */
  public readonly fileUpload = output<File>();

  /** accepted file types; supports prefix (e.g. "image/") or exact mime type (e.g. "image/png") */
  public readonly fileTypes = input<string[]>(FILE_UPLOAD_FILE_TYPES_DEFAULT);

  /** the name of the currently selected file (proxied from brain) */
  protected readonly fileName = computed<string | undefined>(() => this.brain.fileName());

  /** whether the drop zone is currently being hovered (proxied from brain) */
  protected readonly isHovering = computed<boolean>(() => this.brain.isHovering());

  /** current validation or selection error message (proxied from brain) */
  protected readonly error = computed<string | undefined>(() => this.brain.error());

  /** comma-separated accepted file types string for the native input accept attribute (proxied from brain) */
  protected readonly fileTypesAsString = computed<string>(() => this.brain.fileTypesAsString());

  @ViewChild('fileInputRef', { static: true })
  private readonly _fileInputRef!: ElementRef<HTMLInputElement>;

  constructor() {
    this.brain.fileSelected.subscribe((file) => this.fileUpload.emit(file));
  }

  /** handles native file input change event by delegating to the brain */
  protected onFileSelected(event: Event): void {
    this.brain.handleNativeFileSelected(event);
  }

  /**
   * opens the native file picker dialog; guards against the input's click event
   * bubbling back up to the button and triggering a second open
   */
  protected openFileSelector(event: MouseEvent): void {
    if (event.target === this._fileInputRef.nativeElement) {
      return;
    }

    this._fileInputRef.nativeElement.click();
  }
}
