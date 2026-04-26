import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import SparkMD5 from 'spark-md5';
import { Avatar } from './avatar';

/** default value for the src input. */
export const AVATAR_IMAGE_SRC_DEFAULT: string | undefined = undefined;

/** default value for the email input. */
export const AVATAR_IMAGE_EMAIL_DEFAULT: string | undefined = undefined;

/** default value for the alt input. */
export const AVATAR_IMAGE_ALT_DEFAULT: string | undefined = undefined;

type AvatarImageState = {
  loadError: boolean;
};

@Component({
  selector: 'org-avatar-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-image.html',
  styleUrl: './avatar-image.css',
})
export class AvatarImage {
  /** @internal reference to the parent avatar component for label-based alt fallback */
  private readonly _avatarComponent = inject(Avatar, { host: true });

  /** @internal internal state for the image load error */
  private readonly _state = signal<AvatarImageState>({
    loadError: false,
  });

  /** explicit image url; takes priority over gravatar. */
  public src = input<string | undefined, string | null | undefined>(AVATAR_IMAGE_SRC_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** email address used to fetch a gravatar image when no src is provided. */
  public email = input<string | undefined, string | null | undefined>(AVATAR_IMAGE_EMAIL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** overrides the alt text; when undefined, falls back to the parent avatar label. */
  public alt = input<string | undefined, string | null | undefined>(AVATAR_IMAGE_ALT_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** resolved image url — prefers src, falls back to gravatar, then undefined. */
  protected readonly imageSrc = computed<string | undefined>(() => {
    if (this.src()) {
      return this.src();
    }

    if (this.email()) {
      return this._generateGravatarUrl(this.email()!);
    }

    return undefined;
  });

  /** resolved alt text — prefers the explicit alt input, falls back to the parent avatar label. */
  protected readonly effectiveAlt = computed<string>(() => {
    return this.alt() ?? this._avatarComponent.label();
  });

  /** true when an image source is available and has not errored. */
  protected readonly shouldShowImage = computed<boolean>(() => {
    return !!this.imageSrc() && this._state().loadError === false;
  });

  constructor() {
    // reset the load error flag whenever the source inputs change so a newly provided src or email gets a fresh load attempt
    effect(() => {
      this.src();
      this.email();
      this._state.update((state) => ({ ...state, loadError: false }));
    });
  }

  /** marks the image as errored so the component hides itself and reveals the underlying initials. */
  protected onError(): void {
    this._state.update((state) => ({ ...state, loadError: true }));
  }

  /** generates a gravatar url from an email address using md5 hashing. */
  private _generateGravatarUrl(email: string): string {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = SparkMD5.hash(trimmedEmail);

    return `https://www.gravatar.com/avatar/${hash}?d=404`;
  }
}
