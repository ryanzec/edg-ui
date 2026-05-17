import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, type FormControlStatus } from '@angular/forms';
import { startWith, Subject } from 'rxjs';
import { z } from 'zod';
import { zodValidator } from '../../utils/validation';
import { UserDetailsApiTokens } from './user-details-api-tokens';
import { UserDetailsBio, type UserDetailsBioErrors } from './user-details-bio';
import { UserDetailsContact, type UserDetailsContactErrors } from './user-details-contact';
import { UserDetailsCustomScopes } from './user-details-custom-scopes';
import { UserDetailsDangerZone } from './user-details-danger-zone';
import { UserDetailsHeader } from './user-details-header';
import { UserDetailsIdentity, type UserDetailsIdentityErrors } from './user-details-identity';
import { UserDetailsLinkedAccounts, type UserDetailsLinkedAccountsErrors } from './user-details-linked-accounts';
import { UserDetailsLocalization } from './user-details-localization';
import { UserDetailsPassword } from './user-details-password';
import { UserDetailsPermissions } from './user-details-permissions';
import { UserDetailsPreferences } from './user-details-preferences';
import { UserDetailsRightRail } from './user-details-right-rail';
import { UserDetailsRoleAuditLog } from './user-details-role-audit-log';
import { UserDetailsRoles } from './user-details-roles';
import { UserDetailsSectionAnchor } from './user-details-section-anchor';
import { UserDetailsSessions } from './user-details-sessions';
import { UserDetailsSigninHistory } from './user-details-signin-history';
import { UserDetailsSso } from './user-details-sso';
import { UserDetailsTwoFactor } from './user-details-two-factor';
import {
  allUserDetailsSectionIds,
  userDetailsSectionIndexMap,
  userDetailsSectionLabelMap,
  userDetailsSectionSubtitleMap,
  type UserDetailsData,
  type UserDetailsFormValue,
  type UserDetailsPermissionChangedEvent,
  type UserDetailsPermissionResource,
  type UserDetailsRole,
  type UserDetailsSectionId,
  type UserDetailsTwoFactorActionEvent,
  type UserDetailsWorkspaceRoleChangedEvent,
} from './user-details-types';
import { UserDetailsWork, type UserDetailsWorkErrors } from './user-details-work';
import { UserDetailsWorkspaces } from './user-details-workspaces';

@Component({
  selector: 'org-user-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UserDetailsApiTokens,
    UserDetailsBio,
    UserDetailsContact,
    UserDetailsCustomScopes,
    UserDetailsDangerZone,
    UserDetailsHeader,
    UserDetailsIdentity,
    UserDetailsLinkedAccounts,
    UserDetailsLocalization,
    UserDetailsPassword,
    UserDetailsPermissions,
    UserDetailsPreferences,
    UserDetailsRightRail,
    UserDetailsRoleAuditLog,
    UserDetailsRoles,
    UserDetailsSectionAnchor,
    UserDetailsSessions,
    UserDetailsSigninHistory,
    UserDetailsSso,
    UserDetailsTwoFactor,
    UserDetailsWork,
    UserDetailsWorkspaces,
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
  host: {
    class: 'block',
  },
})
export class UserDetails implements AfterViewInit {
  private readonly _fb = inject(FormBuilder);

  private readonly _zone = inject(NgZone);

  private readonly _destroyRef = inject(DestroyRef);

  private readonly _saveRequested$ = new Subject<UserDetailsFormValue>();

  private readonly _messageRequested$ = new Subject<void>();

  private readonly _overflowMenuRequested$ = new Subject<void>();

  private readonly _uploadPhotoRequested$ = new Subject<void>();

  private readonly _removePhotoRequested$ = new Subject<void>();

  private readonly _useGravatarRequested$ = new Subject<void>();

  private readonly _changePasswordRequested$ = new Subject<void>();

  private readonly _twoFactorManageRequested$ = new Subject<void>();

  private readonly _twoFactorMethodActionRequested$ = new Subject<UserDetailsTwoFactorActionEvent>();

  private readonly _ssoDisconnectRequested$ = new Subject<void>();

  private readonly _ssoEnforcedChanged$ = new Subject<boolean>();

  private readonly _sessionRevoked$ = new Subject<string>();

  private readonly _signedOutAllOthers$ = new Subject<void>();

  private readonly _apiTokenRevoked$ = new Subject<string>();

  private readonly _apiTokenCreated$ = new Subject<void>();

  private readonly _suspendRequested$ = new Subject<void>();

  private readonly _deleteRequested$ = new Subject<void>();

  private readonly _scopeAdded$ = new Subject<string>();

  private readonly _scopeRemoved$ = new Subject<string>();

  private readonly _workspaceAdded$ = new Subject<void>();

  private readonly _workspaceRemoved$ = new Subject<string>();

  private readonly _workspaceRoleChanged$ = new Subject<UserDetailsWorkspaceRoleChangedEvent>();

  private readonly _permissionChanged$ = new Subject<UserDetailsPermissionChangedEvent>();

  private readonly _auditSeeAllRequested$ = new Subject<void>();

  /** the user-details record to render */
  public readonly user = input.required<UserDetailsData>();

  /** emitted when the user clicks Save and the form is dirty + valid */
  public readonly saveRequested = outputFromObservable(this._saveRequested$);

  /** emitted when the user clicks the Message button in the header */
  public readonly messageRequested = outputFromObservable(this._messageRequested$);

  /** emitted when the user clicks the overflow menu (...) button in the header */
  public readonly overflowMenuRequested = outputFromObservable(this._overflowMenuRequested$);

  /** emitted when the user clicks Upload photo in the identity card */
  public readonly uploadPhotoRequested = outputFromObservable(this._uploadPhotoRequested$);

  /** emitted when the user clicks Remove (photo) in the identity card */
  public readonly removePhotoRequested = outputFromObservable(this._removePhotoRequested$);

  /** emitted when the user clicks Use Gravatar in the identity card */
  public readonly useGravatarRequested = outputFromObservable(this._useGravatarRequested$);

  /** emitted when the user clicks Change password */
  public readonly changePasswordRequested = outputFromObservable(this._changePasswordRequested$);

  /** emitted when the user clicks Manage on the two-factor card */
  public readonly twoFactorManageRequested = outputFromObservable(this._twoFactorManageRequested$);

  /** emitted when the user clicks a per-method action on the two-factor card */
  public readonly twoFactorMethodActionRequested = outputFromObservable(this._twoFactorMethodActionRequested$);

  /** emitted when the user clicks Disconnect in the sso card */
  public readonly ssoDisconnectRequested = outputFromObservable(this._ssoDisconnectRequested$);

  /** emitted when the user toggles Enforce SSO in the sso card */
  public readonly ssoEnforcedChanged = outputFromObservable(this._ssoEnforcedChanged$);

  /** emitted with the session id when the user revokes a session */
  public readonly sessionRevoked = outputFromObservable(this._sessionRevoked$);

  /** emitted when the user clicks Sign out all others on the sessions card */
  public readonly signedOutAllOthers = outputFromObservable(this._signedOutAllOthers$);

  /** emitted with the token id when the user revokes an api token */
  public readonly apiTokenRevoked = outputFromObservable(this._apiTokenRevoked$);

  /** emitted when the user clicks New token */
  public readonly apiTokenCreated = outputFromObservable(this._apiTokenCreated$);

  /** emitted when the user clicks Suspend in the danger zone */
  public readonly suspendRequested = outputFromObservable(this._suspendRequested$);

  /** emitted when the user clicks Delete account in the danger zone */
  public readonly deleteRequested = outputFromObservable(this._deleteRequested$);

  /** emitted with the scope label when the user adds a custom scope */
  public readonly scopeAdded = outputFromObservable(this._scopeAdded$);

  /** emitted with the scope id when the user removes a custom scope */
  public readonly scopeRemoved = outputFromObservable(this._scopeRemoved$);

  /** emitted when the user clicks Add workspace */
  public readonly workspaceAdded = outputFromObservable(this._workspaceAdded$);

  /** emitted with the workspace id when the user removes a workspace membership */
  public readonly workspaceRemoved = outputFromObservable(this._workspaceRemoved$);

  /** emitted when the user changes a per-workspace role */
  public readonly workspaceRoleChanged = outputFromObservable(this._workspaceRoleChanged$);

  /** emitted when the user toggles a permission checkbox */
  public readonly permissionChanged = outputFromObservable(this._permissionChanged$);

  /** emitted when the user clicks See all in the role audit log card */
  public readonly auditSeeAllRequested = outputFromObservable(this._auditSeeAllRequested$);

  /** anchored section host elements used as IntersectionObserver targets */
  @ViewChildren('sectionAnchorRef', { read: ElementRef })
  protected readonly sectionAnchorRefs!: QueryList<ElementRef<HTMLElement>>;

  /** the unified form group backing every editable field */
  protected readonly form: FormGroup = this._buildForm();

  /** the currently-active section id derived from scroll position */
  protected readonly activeSection = signal<UserDetailsSectionId>('profile');

  /** signal mirror of the form's status so dirty/validity can drive computeds reactively */
  private readonly _formStatus = signal<FormControlStatus>(this.form.status);

  /** signal mirror of whether the form has any pending edits */
  private readonly _formIsDirty = signal<boolean>(false);

  /** whether the form is currently dirty (forwarded to the right-rail) */
  protected readonly isDirty = computed<boolean>(() => this._formIsDirty());

  /** the section metadata used to render the anchored sections in order */
  protected readonly sections = computed(() =>
    allUserDetailsSectionIds.map((id) => ({
      id,
      index: userDetailsSectionIndexMap[id],
      title: userDetailsSectionLabelMap[id],
      subtitle: userDetailsSectionSubtitleMap[id],
    }))
  );

  /** sub-form references — typed accessors for cleaner template + sub-component wiring */
  protected readonly identityGroup = computed<FormGroup>(() => this.form.get('identity') as FormGroup);

  protected readonly contactGroup = computed<FormGroup>(() => this.form.get('contact') as FormGroup);

  protected readonly workGroup = computed<FormGroup>(() => this.form.get('work') as FormGroup);

  protected readonly bioGroup = computed<FormGroup>(() => this.form.get('bio') as FormGroup);

  protected readonly linkedAccountsGroup = computed<FormGroup>(() => this.form.get('linkedAccounts') as FormGroup);

  protected readonly localizationGroup = computed<FormGroup>(() => this.form.get('localization') as FormGroup);

  protected readonly preferencesGroup = computed<FormGroup>(() => this.form.get('preferences') as FormGroup);

  protected readonly rolesGroup = computed<FormGroup>(() => this.form.get('rolesGroup') as FormGroup);

  protected readonly permissionsArray = computed<FormArray<FormGroup>>(
    () => this.form.get('permissions') as FormArray<FormGroup>
  );

  /** per-section validation message maps (only fields with non-trivial rules surface messages) */
  protected readonly identityErrors = computed<UserDetailsIdentityErrors>(() => {
    this._formStatus();

    return {
      firstName: this._readControlError('identity.firstName'),
      lastName: this._readControlError('identity.lastName'),
    };
  });

  protected readonly contactErrors = computed<UserDetailsContactErrors>(() => {
    this._formStatus();

    return {
      workEmail: this._readControlError('contact.workEmail'),
      personalEmail: this._readControlError('contact.personalEmail'),
    };
  });

  protected readonly workErrors = computed<UserDetailsWorkErrors>(() => {
    this._formStatus();

    return {};
  });

  protected readonly bioErrors = computed<UserDetailsBioErrors>(() => {
    this._formStatus();

    return {
      body: this._readControlError('bio.body'),
    };
  });

  protected readonly linkedAccountsErrors = computed<UserDetailsLinkedAccountsErrors>(() => {
    this._formStatus();

    return {};
  });

  constructor() {
    /**
     * keeps the local _formStatus signal in sync with the form's actual status. computeds depending on
     * validation messages re-evaluate whenever any control's validity changes.
     */
    this.form.statusChanges
      .pipe(startWith(this.form.status), takeUntilDestroyed())
      .subscribe((status) => this._formStatus.set(status));

    /** keeps the local _formIsDirty signal in sync. value changes are the cheapest trigger we have. */
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this._formIsDirty.set(this.form.dirty));

    /**
     * re-hydrates the form whenever the `user` input changes. uses `emitEvent: false` so the seed write
     * does not falsely mark the form as dirty.
     */
    effect(() => {
      const data = this.user();
      this._hydrateForm(data);
      this._formIsDirty.set(this.form.dirty);
      this._formStatus.set(this.form.status);
    });
  }

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    this._zone.runOutsideAngular(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          const top = visible[0];

          if (!top) {
            return;
          }

          const id = top.target.getAttribute('data-section-id') as UserDetailsSectionId | null;

          if (!id) {
            return;
          }

          this._zone.run(() => this.activeSection.set(id));
        },
        {
          // null root tracks viewport intersection, which is correct now that the page (not the
          // component) is the scroll container
          root: null,
          rootMargin: '0px 0px -70% 0px',
          threshold: 0,
        }
      );

      this.sectionAnchorRefs.forEach((ref) => observer.observe(ref.nativeElement));

      this._destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** scrolls the content column so the requested section's anchor sits at the top of the viewport */
  protected onNavItemClicked(id: UserDetailsSectionId): void {
    const target = this.sectionAnchorRefs.find((ref) => ref.nativeElement.getAttribute('data-section-id') === id);

    if (!target) {
      return;
    }

    target.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * runs the save flow per the agreed save semantics: pristine forms no-op silently; dirty forms validate;
   * invalid surfaces validation messages; valid emits and resets dirty state.
   */
  protected onSaveClicked(): void {
    if (this.form.pristine) {
      return;
    }

    this.form.markAllAsTouched();
    // poke statusChanges so error computeds re-evaluate with the new touched state
    this._formStatus.set(this.form.status);

    if (this.form.invalid) {
      return;
    }

    this._saveRequested$.next(this._toFormValue());
    this.form.markAsPristine();
    this._formIsDirty.set(false);
  }

  protected onMessageRequested(): void {
    this._messageRequested$.next();
  }

  protected onOverflowMenuRequested(): void {
    this._overflowMenuRequested$.next();
  }

  protected onUploadPhotoRequested(): void {
    this._uploadPhotoRequested$.next();
  }

  protected onRemovePhotoRequested(): void {
    this._removePhotoRequested$.next();
  }

  protected onUseGravatarRequested(): void {
    this._useGravatarRequested$.next();
  }

  protected onChangePasswordRequested(): void {
    this._changePasswordRequested$.next();
  }

  protected onTwoFactorManageRequested(): void {
    this._twoFactorManageRequested$.next();
  }

  protected onTwoFactorMethodAction(event: UserDetailsTwoFactorActionEvent): void {
    this._twoFactorMethodActionRequested$.next(event);
  }

  protected onSsoDisconnectRequested(): void {
    this._ssoDisconnectRequested$.next();
  }

  protected onSsoEnforcedChanged(checked: boolean): void {
    this._ssoEnforcedChanged$.next(checked);
  }

  protected onSessionRevoked(id: string): void {
    this._sessionRevoked$.next(id);
  }

  protected onSignedOutAllOthers(): void {
    this._signedOutAllOthers$.next();
  }

  protected onApiTokenRevoked(id: string): void {
    this._apiTokenRevoked$.next(id);
  }

  protected onApiTokenCreated(): void {
    this._apiTokenCreated$.next();
  }

  protected onSuspendRequested(): void {
    this._suspendRequested$.next();
  }

  protected onDeleteRequested(): void {
    this._deleteRequested$.next();
  }

  protected onScopeAdded(scope: string): void {
    this._scopeAdded$.next(scope);
  }

  protected onScopeRemoved(scopeId: string): void {
    this._scopeRemoved$.next(scopeId);
  }

  protected onWorkspaceAdded(): void {
    this._workspaceAdded$.next();
  }

  protected onWorkspaceRemoved(id: string): void {
    this._workspaceRemoved$.next(id);
  }

  protected onWorkspaceRoleChanged(event: UserDetailsWorkspaceRoleChangedEvent): void {
    this._workspaceRoleChanged$.next(event);
  }

  protected onAuditSeeAllRequested(): void {
    this._auditSeeAllRequested$.next();
  }

  /** builds the full form scaffold; control values are populated separately in `_hydrateForm` */
  private _buildForm(): FormGroup {
    return this._fb.group({
      identity: this._fb.group({
        firstName: ['', zodValidator(z.string().min(1, 'First name is required'))],
        lastName: ['', zodValidator(z.string().min(1, 'Last name is required'))],
        displayName: [''],
        pronouns: [''],
      }),
      contact: this._fb.group({
        workEmail: ['', zodValidator(z.string().email('Enter a valid email'))],
        personalEmail: ['', zodValidator(z.union([z.string().email('Enter a valid email'), z.literal('')]))],
        phone: [''],
        location: [''],
      }),
      work: this._fb.group({
        title: [''],
        department: [''],
        manager: [''],
      }),
      bio: this._fb.group({
        body: ['', zodValidator(z.string().max(280, 'Max 280 characters'))],
      }),
      linkedAccounts: this._fb.group({
        website: [''],
        github: [''],
        linkedIn: [''],
      }),
      localization: this._fb.group({
        timezone: [''],
        language: [''],
      }),
      preferences: this._fb.group({
        emailDigest: [false],
        mentionNotifications: [false],
        typingIndicator: [false],
        compactDensity: [false],
      }),
      rolesGroup: this._fb.group({
        primaryRole: ['admin' as UserDetailsRole],
      }),
      permissions: this._fb.array<FormGroup>([]),
    });
  }

  /** writes the input data into the form without marking it dirty or emitting valueChanges noise */
  private _hydrateForm(data: UserDetailsData): void {
    this.form.patchValue(
      {
        identity: {
          firstName: data.profile.identity.firstName,
          lastName: data.profile.identity.lastName,
          displayName: data.profile.identity.displayName,
          pronouns: data.profile.identity.pronouns,
        },
        contact: {
          workEmail: data.profile.contact.workEmail,
          personalEmail: data.profile.contact.personalEmail,
          phone: data.profile.contact.phone,
          location: data.profile.contact.location,
        },
        work: {
          title: data.profile.work.title,
          department: data.profile.work.department,
          manager: data.profile.work.manager.name,
        },
        bio: { body: data.profile.bio.body },
        linkedAccounts: data.profile.linkedAccounts,
        localization: data.profile.localization,
        preferences: data.profile.preferences,
        rolesGroup: { primaryRole: data.roles.primaryRole },
      },
      { emitEvent: false }
    );

    this._rebuildPermissionsArray(data.roles.permissions);

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  /** rebuilds the permissions FormArray to match the new permission resource list */
  private _rebuildPermissionsArray(permissions: UserDetailsPermissionResource[]): void {
    const array = this.form.get('permissions') as FormArray<FormGroup>;
    const previousLength = array.length;

    for (let i = previousLength - 1; i >= 0; i -= 1) {
      array.removeAt(i, { emitEvent: false });
    }

    for (const permission of permissions) {
      array.push(
        this._fb.group({
          id: [permission.id],
          read: [permission.read],
          write: [permission.write],
          delete: [permission.delete],
        }),
        { emitEvent: false }
      );
    }
  }

  /** reads a single control's zod error string when the control has been touched */
  private _readControlError(path: string): string | undefined {
    const control = this.form.get(path);

    if (!control || (!control.touched && !control.dirty)) {
      return undefined;
    }

    const errors = control.errors;

    if (!errors) {
      return undefined;
    }

    return (errors['zod'] as string | undefined) ?? undefined;
  }

  /** converts the form's current value into the consumer-facing UserDetailsFormValue shape */
  private _toFormValue(): UserDetailsFormValue {
    const raw = this.form.getRawValue() as Record<string, unknown>;
    const permissions = (raw['permissions'] as Record<string, unknown>[]).map((perm) => ({
      id: String(perm['id'] ?? ''),
      label: this.user().roles.permissions.find((p) => p.id === String(perm['id'] ?? ''))?.label ?? '',
      description: this.user().roles.permissions.find((p) => p.id === String(perm['id'] ?? ''))?.description ?? '',
      read: Boolean(perm['read']),
      write: Boolean(perm['write']),
      delete: Boolean(perm['delete']),
    }));

    return {
      identity: raw['identity'] as UserDetailsFormValue['identity'],
      contact: raw['contact'] as UserDetailsFormValue['contact'],
      work: raw['work'] as UserDetailsFormValue['work'],
      bio: raw['bio'] as UserDetailsFormValue['bio'],
      linkedAccounts: raw['linkedAccounts'] as UserDetailsFormValue['linkedAccounts'],
      localization: raw['localization'] as UserDetailsFormValue['localization'],
      preferences: raw['preferences'] as UserDetailsFormValue['preferences'],
      primaryRole: ((raw['rolesGroup'] as Record<string, unknown>)['primaryRole'] ?? 'admin') as UserDetailsRole,
      permissions,
    };
  }
}
