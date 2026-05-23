import { DateTime } from 'luxon';
import type { IconName } from '../../core/icon/icon-brain';
import type { ComponentColor } from '../../core/types/component-types';

/** the section ids surfaced in the right-rail on-this-page nav */
export const allUserDetailsSectionIds = ['profile', 'security', 'roles-access'] as const;

/** id of a top-level section within the user-details view */
export type UserDetailsSectionId = (typeof allUserDetailsSectionIds)[number];

/** display label for each top-level section, used by the right-rail nav */
export const userDetailsSectionLabelMap: Record<UserDetailsSectionId, string> = {
  profile: 'Profile',
  security: 'Security',
  'roles-access': 'Roles & access',
};

/** numeric index label for each section, rendered as a small left-of-title affordance */
export const userDetailsSectionIndexMap: Record<UserDetailsSectionId, string> = {
  profile: '01',
  security: '02',
  'roles-access': '03',
};

/** subtitle text rendered beside the section title (e.g. "Personal info, contact, and bio.") */
export const userDetailsSectionSubtitleMap: Record<UserDetailsSectionId, string> = {
  profile: 'Personal info, contact, and bio.',
  security: 'Password, 2FA, SSO, sessions, tokens.',
  'roles-access': 'Role, permissions, scopes, audit.',
};

/** lifecycle status of the user account */
export type UserDetailsStatus = 'active' | 'invited' | 'suspended';

/** all available user-status values */
export const allUserDetailsStatuses = [
  'active',
  'invited',
  'suspended',
] as const satisfies readonly UserDetailsStatus[];

/** human-readable label per user-status */
export const userDetailsStatusLabelMap: Record<UserDetailsStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
};

/** indicator/tag color per user-status */
export const userDetailsStatusColorMap: Record<UserDetailsStatus, ComponentColor> = {
  active: 'safe',
  invited: 'info',
  suspended: 'warning',
};

/** primary role assigned to the user */
export type UserDetailsRole = 'admin' | 'maintainer' | 'member' | 'viewer' | 'guest';

/** all available primary-role values */
export const allUserDetailsRoles = [
  'admin',
  'maintainer',
  'member',
  'viewer',
  'guest',
] as const satisfies readonly UserDetailsRole[];

/** human-readable label per primary-role (used in workspace-membership dropdowns) */
export const userDetailsRoleLabelMap: Record<UserDetailsRole, string> = {
  admin: 'Admin',
  maintainer: 'Maintainer',
  member: 'Member',
  viewer: 'Viewer',
  guest: 'Guest',
};

/** one selectable card in the primary-role chooser */
export type UserDetailsRoleOption = {
  /** the role value backing this option */
  value: UserDetailsRole;
  /** the role's display name */
  label: string;
  /** sentence explaining the role's reach */
  description: string;
  /** scope chip text rendered at the bottom of the card */
  scope: string;
  /** optional badge rendered beside the label (e.g. "Elevated") */
  badge?: { label: string; color: ComponentColor };
};

/** identity-card data */
export type UserDetailsIdentitySection = {
  /** name used by the avatar (drives initials + deterministic color) */
  avatarLabel: string;
  /** explicit avatar image url (takes priority over avatarImgEmail) */
  avatarImgSrc?: string;
  /** email used to look up a gravatar image when no avatarImgSrc is set */
  avatarImgEmail?: string;
  /** first name; required field */
  firstName: string;
  /** last name */
  lastName: string;
  /** name shown above messages and in member lists */
  displayName: string;
  /** optional pronouns string */
  pronouns: string;
};

/** contact-card data */
export type UserDetailsContactSection = {
  /** primary sign-in email */
  workEmail: string;
  /** whether the work email is verified (drives the postIcon check) */
  workEmailVerified: boolean;
  /** secondary recovery email */
  personalEmail: string;
  /** sms-capable phone number */
  phone: string;
  /** city, state — free-form */
  location: string;
};

/** work-card data */
export type UserDetailsWorkSection = {
  /** job title */
  title: string;
  /** department or team name */
  department: string;
  /** the manager's display info */
  manager: { name: string; avatarLabel: string };
  /** read-only employee id set by hr */
  employeeId: string;
  /** read-only start date */
  startedAt: DateTime;
};

/** bio-card data */
export type UserDetailsBioSection = {
  /** bio body text */
  body: string;
  /** maximum character count surfaced beneath the textarea */
  maxLength: number;
};

/** linked-accounts-card data */
export type UserDetailsLinkedAccountsSection = {
  /** personal website url */
  website: string;
  /** github username */
  github: string;
  /** linkedin username */
  linkedIn: string;
};

/** localization-card data */
export type UserDetailsLocalizationSection = {
  /** timezone iana id (e.g. "America/Los_Angeles") */
  timezone: string;
  /** language tag (e.g. "en-US") */
  language: string;
};

/** preferences-card data — four toggles */
export type UserDetailsPreferencesSection = {
  /** weekly digest opt-in */
  emailDigest: boolean;
  /** push notifications when @-mentioned */
  mentionNotifications: boolean;
  /** show typing indicators to others */
  typingIndicator: boolean;
  /** tighter row heights across lists / tables / threads */
  compactDensity: boolean;
};

/** password-card data */
export type UserDetailsPasswordSection = {
  /** when the password was last changed */
  lastChangedAt: DateTime;
  /** assessed strength */
  strength: 'weak' | 'fair' | 'strong';
  /** character count of the current password */
  characterCount: number;
  /** whether the current password contains symbols */
  hasSymbols: boolean;
  /** rotation reminder interval in days */
  rotationDays: number;
  /** when the next rotation reminder fires */
  nextRotationAt: DateTime;
};

/** kind of two-factor authentication method */
export type UserDetailsTwoFactorKind = 'authenticator-app' | 'sms-backup' | 'hardware-key' | 'recovery-codes';

/** single two-factor method row */
export type UserDetailsTwoFactorMethod = {
  /** stable id used by track + outputs */
  id: string;
  /** which kind of method this row represents */
  kind: UserDetailsTwoFactorKind;
  /** method title (e.g. "Authenticator app") */
  title: string;
  /** method description */
  description: string;
  /** optional badge rendered before the action (e.g. "Primary", "Backup") */
  badge?: { label: string; color: ComponentColor };
  /** action button label */
  actionLabel: string;
  /** optional pre-icon for the action button */
  actionIcon?: IconName;
  /** whether the action is destructive (red text) */
  actionIsDestructive?: boolean;
};

/** sso-card data */
export type UserDetailsSsoSection = {
  /** the connected sso provider */
  provider: { name: string; domain: string; iconName: IconName };
  /** the email exchanged with the provider */
  connectedEmail: string;
  /** explanatory line about what the provider syncs */
  notes: string;
  /** active vs inactive status (drives the tag color) */
  status: 'active' | 'inactive';
  /** whether sso is enforced for sign-in */
  enforced: boolean;
};

/** single active-session row */
export type UserDetailsSession = {
  /** stable id used by track + outputs */
  id: string;
  /** device label (e.g. "MacBook Pro 16″") */
  device: string;
  /** client label (e.g. "Chrome 124") */
  client: string;
  /** which icon to render for the device kind */
  deviceIcon: IconName;
  /** city, state */
  location: string;
  /** ip address */
  ip: string;
  /** pre-formatted relative last-active label */
  lastActive: string;
  /** whether this is the current device */
  isCurrentDevice: boolean;
};

/** single api-token row */
export type UserDetailsApiToken = {
  /** stable id used by track + outputs */
  id: string;
  /** user-supplied token name */
  name: string;
  /** public prefix shown in monospace next to the name */
  publicPrefix: string;
  /** when the token was created */
  createdAt: DateTime;
  /** pre-formatted last-used label */
  lastUsed: string;
  /** scopes granted to the token */
  scopes: string[];
  /** whether the token is approaching expiry */
  expiring?: boolean;
};

/** single sign-in-history row */
export type UserDetailsSigninHistoryEntry = {
  /** stable id used by track */
  id: string;
  /** when the sign-in occurred */
  when: DateTime;
  /** method label (e.g. "SSO · Google") */
  method: string;
  /** city, state */
  location: string;
  /** ip address */
  ip: string;
  /** outcome of the sign-in */
  result: { kind: 'success'; label: string } | { kind: 'blocked'; label: string };
};

/** single permission row backed by a form-array entry */
export type UserDetailsPermissionResource = {
  /** stable id used by track + form-array key */
  id: string;
  /** resource label */
  label: string;
  /** resource description */
  description: string;
  /** whether the role has read access */
  read: boolean;
  /** whether the role has write access */
  write: boolean;
  /** whether the role has delete access */
  delete: boolean;
};

/** single custom-scope chip */
export type UserDetailsCustomScope = {
  /** stable id used by track + outputs */
  id: string;
  /** chip label (e.g. "read:profile") */
  label: string;
  /** chip color */
  color: ComponentColor;
};

/** single workspace-membership row */
export type UserDetailsWorkspaceMembership = {
  /** stable id used by track + outputs */
  id: string;
  /** workspace slug */
  slug: string;
  /** workspace display name */
  name: string;
  /** workspace avatar label */
  avatarLabel: string;
  /** when the user joined the workspace */
  joinedAt: DateTime;
  /** the user's per-workspace role */
  role: UserDetailsRole;
};

/** category of a role-audit entry — drives the trailing tag */
export type UserDetailsAuditCategory = 'role' | 'security' | 'profile';

/** color per audit category */
export const userDetailsAuditCategoryColorMap: Record<UserDetailsAuditCategory, ComponentColor> = {
  role: 'info',
  security: 'caution',
  profile: 'neutral',
};

/** single role-audit row */
export type UserDetailsAuditEntry = {
  /** stable id used by track */
  id: string;
  /** the actor who performed the action */
  actor: { name: string; avatarLabel: string };
  /** activity description */
  description: string;
  /** pre-formatted relative timestamp */
  occurredAt: string;
  /** entry category */
  category: UserDetailsAuditCategory;
};

/** payload emitted when the per-workspace role dropdown changes */
export type UserDetailsWorkspaceRoleChangedEvent = {
  /** the workspace whose role changed */
  workspaceId: string;
  /** the resulting role */
  role: UserDetailsRole;
};

/** payload emitted when a permission checkbox toggles */
export type UserDetailsPermissionChangedEvent = {
  /** the resource id whose permission changed */
  resourceId: string;
  /** the permission action that changed */
  action: 'read' | 'write' | 'delete';
  /** the resulting checked state */
  checked: boolean;
};

/** payload emitted when the user requests an action on a two-factor method */
export type UserDetailsTwoFactorActionEvent = {
  /** the two-factor method's id */
  id: string;
  /** the kind of method */
  kind: UserDetailsTwoFactorKind;
};

/** the editable shape pushed back via saveRequested */
export type UserDetailsFormValue = {
  identity: Pick<UserDetailsIdentitySection, 'firstName' | 'lastName' | 'displayName' | 'pronouns'>;
  contact: Pick<UserDetailsContactSection, 'workEmail' | 'personalEmail' | 'phone' | 'location'>;
  work: Pick<UserDetailsWorkSection, 'title' | 'department'> & { manager: string };
  bio: { body: string };
  linkedAccounts: UserDetailsLinkedAccountsSection;
  localization: UserDetailsLocalizationSection;
  preferences: UserDetailsPreferencesSection;
  primaryRole: UserDetailsRole;
  permissions: UserDetailsPermissionResource[];
};

/** localization option presented in the timezone / language dropdowns */
export type UserDetailsLocalizationOption = {
  /** the underlying value (e.g. "America/Los_Angeles") */
  value: string;
  /** the human-readable label shown in the dropdown */
  display: string;
};

/** the full user-details record */
export type UserDetailsData = {
  /** top-of-page header content */
  header: {
    avatarLabel: string;
    avatarImgSrc?: string;
    avatarImgEmail?: string;
    pronouns: string;
    role: UserDetailsRole;
    status: UserDetailsStatus;
    jobTitle: string;
    primaryEmail: string;
    joinedAt: DateTime;
  };
  /** profile section data */
  profile: {
    identity: UserDetailsIdentitySection;
    contact: UserDetailsContactSection;
    work: UserDetailsWorkSection;
    bio: UserDetailsBioSection;
    linkedAccounts: UserDetailsLinkedAccountsSection;
    localization: UserDetailsLocalizationSection;
    preferences: UserDetailsPreferencesSection;
  };
  /** security section data */
  security: {
    password: UserDetailsPasswordSection;
    twoFactorMethods: UserDetailsTwoFactorMethod[];
    sso: UserDetailsSsoSection;
    sessions: UserDetailsSession[];
    apiTokens: UserDetailsApiToken[];
    signinHistory: UserDetailsSigninHistoryEntry[];
  };
  /** roles & access section data */
  roles: {
    primaryRole: UserDetailsRole;
    roleOptions: UserDetailsRoleOption[];
    permissions: UserDetailsPermissionResource[];
    customScopes: UserDetailsCustomScope[];
    suggestedScopes: string[];
    workspaces: UserDetailsWorkspaceMembership[];
    auditLog: UserDetailsAuditEntry[];
  };
  /** account-at-a-glance summary surfaced in the right rail */
  glance: {
    twoFactorEnabled: boolean;
    sessionCount: number;
    apiTokenCount: number;
    workspaceCount: number;
  };
  /** options surfaced in the localization dropdowns */
  localizationOptions: {
    timezones: UserDetailsLocalizationOption[];
    languages: UserDetailsLocalizationOption[];
  };
};

/** sample timezone options used by the localization dropdown */
export const defaultUserDetailsTimezoneOptions: UserDetailsLocalizationOption[] = [
  { value: 'America/Los_Angeles', display: 'Pacific (Los Angeles) · GMT−7' },
  { value: 'America/Denver', display: 'Mountain (Denver) · GMT−6' },
  { value: 'America/Chicago', display: 'Central (Chicago) · GMT−5' },
  { value: 'America/New_York', display: 'Eastern (New York) · GMT−4' },
  { value: 'Europe/London', display: 'London · GMT+1' },
  { value: 'Europe/Berlin', display: 'Central Europe (Berlin) · GMT+2' },
  { value: 'Asia/Tokyo', display: 'Tokyo · GMT+9' },
  { value: 'Australia/Sydney', display: 'Sydney · GMT+10' },
];

/** sample language options used by the localization dropdown */
export const defaultUserDetailsLanguageOptions: UserDetailsLocalizationOption[] = [
  { value: 'en-US', display: 'English (United States)' },
  { value: 'en-GB', display: 'English (United Kingdom)' },
  { value: 'es-ES', display: 'Spanish (Spain)' },
  { value: 'fr-FR', display: 'French (France)' },
  { value: 'de-DE', display: 'German (Germany)' },
  { value: 'ja-JP', display: 'Japanese (Japan)' },
];

/** canonical seed used by storybook + tests; mirrors the screenshots end-to-end */
export const mayaBrennanUser: UserDetailsData = {
  header: {
    avatarLabel: 'Maya Brennan',
    avatarImgEmail: 'maya@acme.co',
    pronouns: 'she/her',
    role: 'admin',
    status: 'active',
    jobTitle: 'Staff Product Designer',
    primaryEmail: 'maya@acme.co',
    joinedAt: DateTime.fromISO('2022-03-04T00:00:00Z'),
  },
  profile: {
    identity: {
      avatarLabel: 'Maya Brennan',
      avatarImgEmail: 'maya@acme.co',
      firstName: 'Maya',
      lastName: 'Brennan',
      displayName: 'Maya Brennan',
      pronouns: 'she/her',
    },
    contact: {
      workEmail: 'maya@acme.co',
      workEmailVerified: true,
      personalEmail: 'maya.brennan@personal.io',
      phone: '+1 (415) 555-0142',
      location: 'San Francisco, CA',
    },
    work: {
      title: 'Staff Product Designer',
      department: 'Design Systems',
      manager: { name: 'Devin Park', avatarLabel: 'Devin Park' },
      employeeId: 'ACM-00142',
      startedAt: DateTime.fromISO('2022-03-04T00:00:00Z'),
    },
    bio: {
      body: 'Design-systems lead. Recently shipped the new chat surface and the workspace settings rebuild. Currently focused on RBAC and audit primitives.',
      maxLength: 280,
    },
    linkedAccounts: {
      website: 'mayabrennan.design',
      github: 'mayabrennan',
      linkedIn: 'maya-brennan',
    },
    localization: {
      timezone: 'America/Los_Angeles',
      language: 'en-US',
    },
    preferences: {
      emailDigest: true,
      mentionNotifications: true,
      typingIndicator: false,
      compactDensity: false,
    },
  },
  security: {
    password: {
      lastChangedAt: DateTime.fromISO('2026-04-24T00:00:00Z'),
      strength: 'strong',
      characterCount: 14,
      hasSymbols: true,
      rotationDays: 180,
      nextRotationAt: DateTime.fromISO('2026-11-11T00:00:00Z'),
    },
    twoFactorMethods: [
      {
        id: 'tf-app',
        kind: 'authenticator-app',
        title: 'Authenticator app',
        description: 'Time-based codes from 1Password, Authy, or similar.',
        badge: { label: 'Primary', color: 'safe' },
        actionLabel: 'Reconfigure',
      },
      {
        id: 'tf-sms',
        kind: 'sms-backup',
        title: 'SMS backup',
        description: '+1 ••• ••• 0142 · use if your authenticator is unavailable.',
        badge: { label: 'Backup', color: 'warning' },
        actionLabel: 'Remove',
        actionIsDestructive: true,
      },
      {
        id: 'tf-key',
        kind: 'hardware-key',
        title: 'Hardware security keys',
        description: '1 registered · YubiKey · iMac',
        actionLabel: 'Add key',
        actionIcon: 'plus',
      },
      {
        id: 'tf-codes',
        kind: 'recovery-codes',
        title: 'Recovery codes',
        description: 'Generated · 8 unused. View at least once.',
        actionLabel: 'View codes',
        actionIcon: 'eye',
      },
    ],
    sso: {
      provider: { name: 'Google Workspace', domain: 'acme.co', iconName: 'globe' },
      connectedEmail: 'maya@acme.co',
      notes: 'syncs profile photo and name',
      status: 'active',
      enforced: true,
    },
    sessions: [
      {
        id: 's-1',
        device: 'MacBook Pro 16″',
        client: 'Chrome 124',
        deviceIcon: 'laptop',
        location: 'San Francisco, CA',
        ip: '73.140.18.42',
        lastActive: 'Last active now',
        isCurrentDevice: true,
      },
      {
        id: 's-2',
        device: 'iPhone 15 Pro',
        client: 'Halcyon iOS',
        deviceIcon: 'smartphone',
        location: 'San Francisco, CA',
        ip: '73.140.18.42',
        lastActive: 'Last active 2 hours ago',
        isCurrentDevice: false,
      },
      {
        id: 's-3',
        device: 'MacBook Air',
        client: 'Safari 17.4',
        deviceIcon: 'laptop',
        location: 'Portland, OR',
        ip: '67.18.220.5',
        lastActive: 'Last active yesterday',
        isCurrentDevice: false,
      },
      {
        id: 's-4',
        device: 'Linux',
        client: 'Firefox 122',
        deviceIcon: 'monitor',
        location: 'Berlin, DE',
        ip: '85.214.10.99',
        lastActive: 'Last active 3 days ago',
        isCurrentDevice: false,
      },
    ],
    apiTokens: [
      {
        id: 'tok-1',
        name: 'CI deploy bot',
        publicPrefix: 'org_live_a4f9b2…',
        createdAt: DateTime.fromISO('2026-04-12T00:00:00Z'),
        lastUsed: 'Last used 4 minutes ago',
        scopes: ['deploy:write', 'projects:read'],
      },
      {
        id: 'tok-2',
        name: 'Personal CLI',
        publicPrefix: 'org_live_71d2c8…',
        createdAt: DateTime.fromISO('2026-01-02T00:00:00Z'),
        lastUsed: 'Last used 2 days ago',
        scopes: ['projects:write', 'read:*'],
      },
      {
        id: 'tok-3',
        name: 'Read-only analytics',
        publicPrefix: 'org_live_0b3a16…',
        createdAt: DateTime.fromISO('2025-11-18T00:00:00Z'),
        lastUsed: 'Last used expires in 12 days',
        scopes: ['read:analytics'],
        expiring: true,
      },
    ],
    signinHistory: [
      {
        id: 'sh-1',
        when: DateTime.fromISO('2026-05-17T09:14:00Z'),
        method: 'SSO · Google',
        location: 'San Francisco, CA',
        ip: '73.140.18.42',
        result: { kind: 'success', label: 'Success' },
      },
      {
        id: 'sh-2',
        when: DateTime.fromISO('2026-05-16T14:02:00Z'),
        method: 'SSO · Google',
        location: 'San Francisco, CA',
        ip: '73.140.18.42',
        result: { kind: 'success', label: 'Success' },
      },
      {
        id: 'sh-3',
        when: DateTime.fromISO('2026-05-14T22:18:00Z'),
        method: 'Password + 2FA',
        location: 'Berlin, DE',
        ip: '85.214.10.99',
        result: { kind: 'blocked', label: 'Blocked — wrong 2FA code' },
      },
      {
        id: 'sh-4',
        when: DateTime.fromISO('2026-05-12T08:43:00Z'),
        method: 'SSO · Google',
        location: 'Portland, OR',
        ip: '67.18.220.5',
        result: { kind: 'success', label: 'Success' },
      },
      {
        id: 'sh-5',
        when: DateTime.fromISO('2026-05-09T17:22:00Z'),
        method: 'Recovery code',
        location: 'San Francisco, CA',
        ip: '73.140.18.42',
        result: { kind: 'success', label: 'Success' },
      },
    ],
  },
  roles: {
    primaryRole: 'admin',
    roleOptions: [
      {
        value: 'admin',
        label: 'Admin',
        description: 'Full control of the workspace, billing, members, and audit log.',
        scope: 'workspace:*',
        badge: { label: 'Elevated', color: 'warning' },
      },
      {
        value: 'maintainer',
        label: 'Maintainer',
        description: 'Manage projects and members; cannot touch billing or destructive workspace settings.',
        scope: 'projects:* members:*',
      },
      {
        value: 'member',
        label: 'Member',
        description: 'Create and edit projects they own. Read access to shared resources.',
        scope: 'projects:write read:*',
      },
      {
        value: 'viewer',
        label: 'Viewer',
        description: 'Read-only access across the workspace. Cannot comment, edit, or share.',
        scope: 'read:*',
      },
      {
        value: 'guest',
        label: 'Guest',
        description: 'Scoped access to specific projects only. No workspace-level access.',
        scope: 'project:<id>:read',
      },
    ],
    permissions: [
      {
        id: 'projects',
        label: 'Projects',
        description: 'Project documents, threads, files.',
        read: true,
        write: true,
        delete: true,
      },
      {
        id: 'members',
        label: 'Members',
        description: 'Workspace member directory.',
        read: true,
        write: true,
        delete: true,
      },
      {
        id: 'billing',
        label: 'Billing',
        description: 'Invoices, payment methods, plan.',
        read: true,
        write: true,
        delete: true,
      },
      {
        id: 'integrations',
        label: 'Integrations',
        description: 'OAuth apps, webhooks, API.',
        read: true,
        write: true,
        delete: true,
      },
      {
        id: 'audit-log',
        label: 'Audit log',
        description: 'Org activity history.',
        read: true,
        write: false,
        delete: false,
      },
      {
        id: 'workspace-settings',
        label: 'Workspace settings',
        description: 'Branding, defaults, security.',
        read: true,
        write: true,
        delete: true,
      },
    ],
    customScopes: [
      { id: 'cs-1', label: 'read:profile', color: 'safe' },
      { id: 'cs-2', label: 'read:projects', color: 'info' },
      { id: 'cs-3', label: 'write:projects', color: 'info' },
      { id: 'cs-4', label: 'manage:members', color: 'warning' },
    ],
    suggestedScopes: ['read:billing', 'write:billing', 'manage:integrations', 'admin:audit', 'deploy:write'],
    workspaces: [
      {
        id: 'ws-halcyon',
        slug: 'halcyon',
        name: 'Halcyon',
        avatarLabel: 'Halcyon',
        joinedAt: DateTime.fromISO('2022-03-04T00:00:00Z'),
        role: 'admin',
      },
      {
        id: 'ws-acme',
        slug: 'acme',
        name: 'Acme Inc',
        avatarLabel: 'Acme Inc',
        joinedAt: DateTime.fromISO('2022-03-04T00:00:00Z'),
        role: 'member',
      },
      {
        id: 'ws-orbit',
        slug: 'orbit',
        name: 'Orbit',
        avatarLabel: 'Orbit',
        joinedAt: DateTime.fromISO('2022-03-04T00:00:00Z'),
        role: 'viewer',
      },
    ],
    auditLog: [
      {
        id: 'al-1',
        actor: { name: 'Devin Park', avatarLabel: 'Devin Park' },
        description: 'changed role to Admin',
        occurredAt: '2 hours ago',
        category: 'role',
      },
      {
        id: 'al-2',
        actor: { name: 'Maya Brennan', avatarLabel: 'Maya Brennan' },
        description: 'enabled hardware security key',
        occurredAt: 'yesterday',
        category: 'security',
      },
      {
        id: 'al-3',
        actor: { name: 'Devin Park', avatarLabel: 'Devin Park' },
        description: 'granted manage:members scope',
        occurredAt: '3 days ago',
        category: 'role',
      },
      {
        id: 'al-4',
        actor: { name: 'Maya Brennan', avatarLabel: 'Maya Brennan' },
        description: 'updated profile · title, bio',
        occurredAt: 'last week',
        category: 'profile',
      },
      {
        id: 'al-5',
        actor: { name: 'System', avatarLabel: 'System' },
        description: 'rotated session for Berlin login',
        occurredAt: 'last week',
        category: 'security',
      },
    ],
  },
  glance: {
    twoFactorEnabled: true,
    sessionCount: 4,
    apiTokenCount: 3,
    workspaceCount: 3,
  },
  localizationOptions: {
    timezones: defaultUserDetailsTimezoneOptions,
    languages: defaultUserDetailsLanguageOptions,
  },
};
