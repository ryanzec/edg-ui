import { Directive, computed, effect, input, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import SparkMD5 from 'spark-md5';

/** default value for the src input */
export const AVATAR_IMAGE_BRAIN_SRC_DEFAULT: string | undefined = undefined;

/** default value for the email input */
export const AVATAR_IMAGE_BRAIN_EMAIL_DEFAULT: string | undefined = undefined;

/** default value for the alt input */
export const AVATAR_IMAGE_BRAIN_ALT_DEFAULT: string | undefined = undefined;

/** the internal state shape for the avatar image brain directive */
type AvatarImageState = {
  loadError: boolean;
};

/**
 * headless brain directive for avatar images. owns image load error state, error event handling, resolution of
 * the effective image url (explicit src takes priority over a gravatar fallback derived from email), and the alt
 * accessibility label. carries no styling or template — apply it to a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgAvatarImageBrain]',
  exportAs: 'orgAvatarImageBrain',
})
export class AvatarImageBrainDirective {
  /** @internal internal state for the image load error */
  private readonly _state = signal<AvatarImageState>({
    loadError: false,
  });

  /** explicit image url; takes priority over gravatar */
  public readonly src = input<string | undefined, string | null | undefined>(AVATAR_IMAGE_BRAIN_SRC_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** email address used to fetch a gravatar image when no src is provided */
  public readonly email = input<string | undefined, string | null | undefined>(AVATAR_IMAGE_BRAIN_EMAIL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** overrides the alt text; when undefined, the presentation falls back to the parent avatar label */
  public readonly alt = input<string | undefined, string | null | undefined>(AVATAR_IMAGE_BRAIN_ALT_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** resolved image url — prefers src, falls back to gravatar, then undefined */
  public readonly imageSrc = computed<string | undefined>(() => {
    if (this.src()) {
      return this.src();
    }

    if (this.email()) {
      return this._generateGravatarUrl(this.email()!);
    }

    return undefined;
  });

  /** true when an image source is available and has not errored */
  public readonly shouldShowImage = computed<boolean>(() => {
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

  /** marks the image as errored so the host hides itself and reveals the underlying initials */
  public error(): void {
    this._state.update((state) => ({ ...state, loadError: true }));
  }

  /** generates a gravatar url from an email address using md5 hashing */
  private _generateGravatarUrl(email: string): string {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = SparkMD5.hash(trimmedEmail);

    return `https://www.gravatar.com/avatar/${hash}?d=404`;
  }
}
