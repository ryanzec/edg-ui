import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { UserDetails } from './user-details';
import {
  mayaBrennanUser,
  type UserDetailsData,
  type UserDetailsFormValue,
  type UserDetailsPermissionChangedEvent,
  type UserDetailsTwoFactorActionEvent,
  type UserDetailsWorkspaceRoleChangedEvent,
} from './user-details-types';

const suspendedUser: UserDetailsData = {
  ...mayaBrennanUser,
  header: { ...mayaBrennanUser.header, status: 'suspended' },
};

const invitedUser: UserDetailsData = {
  ...mayaBrennanUser,
  header: { ...mayaBrennanUser.header, status: 'invited' },
  security: {
    ...mayaBrennanUser.security,
    sessions: [],
    apiTokens: [],
    signinHistory: [],
  },
  glance: {
    ...mayaBrennanUser.glance,
    sessionCount: 0,
    apiTokenCount: 0,
  },
};

@Component({
  selector: 'story-user-details-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserDetails],
  template: `
    <div class="p-4 h-screen">
      <org-user-details
        [user]="currentUser()"
        (saveRequested)="onSaveRequested($event)"
        (messageRequested)="logEvent('messageRequested')"
        (overflowMenuRequested)="logEvent('overflowMenuRequested')"
        (uploadPhotoRequested)="logEvent('uploadPhotoRequested')"
        (removePhotoRequested)="logEvent('removePhotoRequested')"
        (useGravatarRequested)="logEvent('useGravatarRequested')"
        (changePasswordRequested)="logEvent('changePasswordRequested')"
        (twoFactorManageRequested)="logEvent('twoFactorManageRequested')"
        (twoFactorMethodActionRequested)="onTwoFactorMethodAction($event)"
        (ssoDisconnectRequested)="logEvent('ssoDisconnectRequested')"
        (ssoEnforcedChanged)="logEvent('ssoEnforcedChanged=' + $event)"
        (sessionRevoked)="logEvent('sessionRevoked=' + $event)"
        (signedOutAllOthers)="logEvent('signedOutAllOthers')"
        (apiTokenRevoked)="logEvent('apiTokenRevoked=' + $event)"
        (apiTokenCreated)="logEvent('apiTokenCreated')"
        (suspendRequested)="logEvent('suspendRequested')"
        (deleteRequested)="logEvent('deleteRequested')"
        (scopeAdded)="logEvent('scopeAdded=' + $event)"
        (scopeRemoved)="logEvent('scopeRemoved=' + $event)"
        (workspaceAdded)="logEvent('workspaceAdded')"
        (workspaceRemoved)="logEvent('workspaceRemoved=' + $event)"
        (workspaceRoleChanged)="onWorkspaceRoleChanged($event)"
        (permissionChanged)="onPermissionChanged($event)"
        (auditSeeAllRequested)="logEvent('auditSeeAllRequested')"
      />
    </div>
    <div class="mt-2 px-4 text-xs text-muted">Last event: {{ lastEvent() ?? '—' }}</div>
  `,
})
class UserDetailsLiveDemoStory {
  protected readonly currentUser = signal<UserDetailsData>(mayaBrennanUser);

  protected readonly lastEvent = signal<string | null>(null);

  protected logEvent(event: string): void {
    this.lastEvent.set(event);
  }

  protected onSaveRequested(value: UserDetailsFormValue): void {
    this.logEvent(`saveRequested: ${value.identity.firstName} ${value.identity.lastName} · role=${value.primaryRole}`);
  }

  protected onTwoFactorMethodAction(event: UserDetailsTwoFactorActionEvent): void {
    this.logEvent(`twoFactorMethodAction: ${event.kind} (${event.id})`);
  }

  protected onWorkspaceRoleChanged(event: UserDetailsWorkspaceRoleChangedEvent): void {
    this.logEvent(`workspaceRoleChanged: ${event.workspaceId} → ${event.role}`);
  }

  protected onPermissionChanged(event: UserDetailsPermissionChangedEvent): void {
    this.logEvent(`permissionChanged: ${event.resourceId}.${event.action} = ${event.checked}`);
  }
}

const meta: Meta<UserDetails> = {
  title: 'Templates/User Details',
  component: UserDetails,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        UserDetails,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## User Details

  A composite template view for editing a user profile across three anchored sections: Profile, Security,
  and Roles & access. Includes a sticky right rail with an "On this page" scroll-spy nav, account-at-a-glance
  stats, and a Save button that respects form dirtiness.

  ### Features
  - Single \`user\` input accepting the full \`UserDetailsData\` record
  - Unified reactive \`FormGroup\` backing every editable field; \`saveRequested\` emits the typed value
  - Save button is always visible & always enabled — pristine clicks no-op; invalid clicks surface validation
  - \`IntersectionObserver\` scroll-spy tracks the active section and highlights the right-rail nav entry
  - Per-section sub-components for identity, contact, work, bio, linked-accounts, localization, preferences,
    password, two-factor, sso, sessions, api tokens, sign-in history, danger zone, roles, permissions,
    custom scopes, workspaces, and role audit log
  - All user interactions surface as outputs the parent can wire to its own data flow
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<UserDetails>;

export const Default: Story = {
  args: {
    user: mayaBrennanUser,
  },
  argTypes: {
    user: {
      control: 'object',
      description: 'The UserDetailsData record to render',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default user-details view. Use the controls to adjust the user record.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4 h-screen">
        <org-user-details [user]="user" />
      </div>
    `,
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo where outputs are wired to update local state. Editing a field flips the right-rail status to "Unsaved changes"; clicking Save with no changes silently no-ops; clicking Save after editing emits saveRequested and resets the status. The on-this-page nav updates as the page scrolls.',
      },
    },
  },
  render: () => ({
    template: '<story-user-details-live-demo />',
    moduleMetadata: {
      imports: [UserDetailsLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of distinct user-status variants: canonical active user, suspended user, and invited user with no sessions / tokens.',
      },
    },
  },
  render: () => ({
    props: {
      mayaBrennanUser,
      suspendedUser,
      invitedUser,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="User Details — Showcase" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Active (Maya Brennan)</div>
            <div class="h-screen">
              <org-user-details [user]="mayaBrennanUser" />
            </div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Suspended</div>
            <div class="h-screen">
              <org-user-details [user]="suspendedUser" />
            </div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Invited (no sessions / tokens)</div>
            <div class="h-screen">
              <org-user-details [user]="invitedUser" />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The header status tag color reflects the user's status</li>
          <li>The right rail stays pinned while the content column scrolls</li>
          <li>The on-this-page nav highlights the section whose anchor crosses the top 30% of the viewport</li>
          <li>The Save button is always enabled; clicking it with no changes does not submit or validate</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
  }),
};
