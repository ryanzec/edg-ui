import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Icon } from '../icon/icon';
import {
  FileUploadBrainDirective,
  FILE_UPLOAD_ARIA_LABEL_DEFAULT,
  FILE_UPLOAD_FILE_TYPES_DEFAULT,
} from '../../brain/file-upload-brain/file-upload-brain';

export { FILE_UPLOAD_ARIA_LABEL_DEFAULT, FILE_UPLOAD_FILE_TYPES_DEFAULT };

@Component({
  selector: 'org-file-upload',
  imports: [Icon, FileUploadBrainDirective],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-hovering]': '_dataHovering()',
    '[attr.data-has-file]': '_dataHasFile()',
    '[attr.data-has-error]': '_dataHasError()',
  },
})
export class FileUploadComponent implements AfterViewInit {
  private readonly _brainDirective = viewChild.required(FileUploadBrainDirective);
  private readonly _fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInputRef');

  /** accepted file types; supports prefix (e.g. "image/") or exact mime type (e.g. "image/png") */
  public readonly fileTypes = input<string[]>(FILE_UPLOAD_FILE_TYPES_DEFAULT);

  /** accessible label applied to the inner drop-zone button */
  public readonly ariaLabel = input<string>(FILE_UPLOAD_ARIA_LABEL_DEFAULT);

  /** emits the selected file when a valid file is chosen */
  public readonly fileSelected = output<File>();

  /** drives the data-hovering style hook on the host */
  protected readonly _dataHovering = computed<string | null>(() => (this._brainDirective().isHovering() ? '' : null));

  /** drives the data-has-file style hook on the host */
  protected readonly _dataHasFile = computed<string | null>(() => (this._brainDirective().fileName() ? '' : null));

  /** drives the data-has-error style hook on the host */
  protected readonly _dataHasError = computed<string | null>(() => (this._brainDirective().error() ? '' : null));

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    this._brainDirective().setOpenPicker((event) => {
      // guard against the native input's click event bubbling back into the button and re-triggering open
      if (event.target === this._fileInputRef().nativeElement) {
        return;
      }

      this._fileInputRef().nativeElement.click();
    });
  }

  /** re-emits the brain's fileSelected as the component's public fileSelected output */
  protected onBrainFileSelected(file: File): void {
    this.fileSelected.emit(file);
  }
}
