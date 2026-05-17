import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  UserDetails,
  mayaBrennanUser,
  type UserDetailsData,
  type UserDetailsFormValue,
  type UserDetailsPermissionChangedEvent,
  type UserDetailsTwoFactorActionEvent,
  type UserDetailsWorkspaceRoleChangedEvent,
} from '@organization/shared-ui';
import { logManager } from '@organization/shared-utils';

/**
 * page-level demo view that renders `<org-user-details>` against the canonical `mayaBrennanUser`
 * fixture exported from shared-ui so the view renders end-to-end without a real backend. the
 * surrounding application chrome is provided by the `<org-application-frame>` at the app shell level.
 */
@Component({
  selector: 'cp-demo-user-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserDetails],
  templateUrl: './user-details-view.html',
})
export class UserDetailsView {
  /** the mocked user record rendered by the embedded user-details template */
  protected readonly user = signal<UserDetailsData>(mayaBrennanUser);

  /** logs a save request emitted by the user-details template */
  protected onSaveRequested(value: UserDetailsFormValue): void {
    logManager.log({ type: 'demo-user-details-view-save-requested', value });
  }

  /** logs a message-button click emitted by the header */
  protected onMessageRequested(): void {
    logManager.log({ type: 'demo-user-details-view-message-requested' });
  }

  /** logs an overflow-menu click emitted by the header */
  protected onOverflowMenuRequested(): void {
    logManager.log({ type: 'demo-user-details-view-overflow-menu-requested' });
  }

  /** logs an upload-photo click emitted by the identity card */
  protected onUploadPhotoRequested(): void {
    logManager.log({ type: 'demo-user-details-view-upload-photo-requested' });
  }

  /** logs a remove-photo click emitted by the identity card */
  protected onRemovePhotoRequested(): void {
    logManager.log({ type: 'demo-user-details-view-remove-photo-requested' });
  }

  /** logs a use-gravatar click emitted by the identity card */
  protected onUseGravatarRequested(): void {
    logManager.log({ type: 'demo-user-details-view-use-gravatar-requested' });
  }

  /** logs a change-password click emitted by the password card */
  protected onChangePasswordRequested(): void {
    logManager.log({ type: 'demo-user-details-view-change-password-requested' });
  }

  /** logs a manage click emitted by the two-factor card */
  protected onTwoFactorManageRequested(): void {
    logManager.log({ type: 'demo-user-details-view-two-factor-manage-requested' });
  }

  /** logs a per-method action click emitted by the two-factor card */
  protected onTwoFactorMethodAction(event: UserDetailsTwoFactorActionEvent): void {
    logManager.log({ type: 'demo-user-details-view-two-factor-method-action', event });
  }

  /** logs a disconnect click emitted by the sso card */
  protected onSsoDisconnectRequested(): void {
    logManager.log({ type: 'demo-user-details-view-sso-disconnect-requested' });
  }

  /** logs an enforce-sso toggle emitted by the sso card */
  protected onSsoEnforcedChanged(enforced: boolean): void {
    logManager.log({ type: 'demo-user-details-view-sso-enforced-changed', enforced });
  }

  /** logs a session revocation emitted by the sessions card */
  protected onSessionRevoked(sessionId: string): void {
    logManager.log({ type: 'demo-user-details-view-session-revoked', sessionId });
  }

  /** logs a sign-out-all-others click emitted by the sessions card */
  protected onSignedOutAllOthers(): void {
    logManager.log({ type: 'demo-user-details-view-signed-out-all-others' });
  }

  /** logs an api-token revocation emitted by the api-tokens card */
  protected onApiTokenRevoked(tokenId: string): void {
    logManager.log({ type: 'demo-user-details-view-api-token-revoked', tokenId });
  }

  /** logs a new-token click emitted by the api-tokens card */
  protected onApiTokenCreated(): void {
    logManager.log({ type: 'demo-user-details-view-api-token-created' });
  }

  /** logs a suspend click emitted by the danger-zone card */
  protected onSuspendRequested(): void {
    logManager.log({ type: 'demo-user-details-view-suspend-requested' });
  }

  /** logs a delete-account click emitted by the danger-zone card */
  protected onDeleteRequested(): void {
    logManager.log({ type: 'demo-user-details-view-delete-requested' });
  }

  /** logs a scope-added event emitted by the custom-scopes card */
  protected onScopeAdded(scope: string): void {
    logManager.log({ type: 'demo-user-details-view-scope-added', scope });
  }

  /** logs a scope-removed event emitted by the custom-scopes card */
  protected onScopeRemoved(scopeId: string): void {
    logManager.log({ type: 'demo-user-details-view-scope-removed', scopeId });
  }

  /** logs an add-workspace click emitted by the workspaces card */
  protected onWorkspaceAdded(): void {
    logManager.log({ type: 'demo-user-details-view-workspace-added' });
  }

  /** logs a workspace removal emitted by the workspaces card */
  protected onWorkspaceRemoved(workspaceId: string): void {
    logManager.log({ type: 'demo-user-details-view-workspace-removed', workspaceId });
  }

  /** logs a per-workspace role change emitted by the workspaces card */
  protected onWorkspaceRoleChanged(event: UserDetailsWorkspaceRoleChangedEvent): void {
    logManager.log({ type: 'demo-user-details-view-workspace-role-changed', event });
  }

  /** logs a permission-checkbox change emitted by the permissions card */
  protected onPermissionChanged(event: UserDetailsPermissionChangedEvent): void {
    logManager.log({ type: 'demo-user-details-view-permission-changed', event });
  }

  /** logs a see-all click emitted by the role-audit-log card */
  protected onAuditSeeAllRequested(): void {
    logManager.log({ type: 'demo-user-details-view-audit-see-all-requested' });
  }
}
