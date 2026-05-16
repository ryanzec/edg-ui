import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { logManager } from '@organization/shared-utils';
import {
  ApplicationNavigation,
  type NavigationItem,
  type NavigationSubItem,
  type SettingsMenuItem,
  type Theme,
} from '../../core/application-navigation/application-navigation';
import { UiThemeManager } from '../../ui-theme/ui-theme-manager/ui-theme-manager';
import { LayoutStore } from '../layout-store/layout-store';
import { ScrollArea } from '@organization/shared-ui';

/**
 * top-level layout shell that renders `<org-application-navigation>` against the data exposed by
 * `LayoutStore` and projects page content into the main content area. theme state is bridged to
 * `UiThemeManager` so the appearance toggle in settings stays in sync with the rest of the app.
 */
@Component({
  selector: 'org-application-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApplicationNavigation, ScrollArea],
  templateUrl: './application-frame.html',
  styleUrl: './application-frame.css',
  host: {
    class: 'flex h-full min-h-0',
  },
})
export class ApplicationFrame {
  protected readonly layoutStore = inject(LayoutStore);
  private readonly _uiThemeManager = inject(UiThemeManager);

  /** the current theme reflected back to the navigation appearance toggle */
  protected readonly theme = computed<Theme>(() => (this._uiThemeManager.isDarkMode() ? 'dark' : 'light'));

  /** routes nav collapse changes through the layout store */
  protected onCollapsedChange(collapsed: boolean): void {
    this.layoutStore.setCollapsed(collapsed);
  }

  /** maps the nav's theme selection onto the ui theme manager; 'system' re-reads the OS preference */
  protected onThemeChange(theme: Theme | undefined): void {
    if (theme === undefined) {
      return;
    }

    if (theme === 'dark') {
      this._uiThemeManager.setDarkMode(true);

      return;
    }

    if (theme === 'light') {
      this._uiThemeManager.setDarkMode(false);

      return;
    }

    if (theme === 'system') {
      const isOSDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

      this._uiThemeManager.setDarkMode(isOSDarkMode);

      return;
    }
  }

  /** logs a workspace-header click for observability */
  protected onWorkspaceClicked(): void {
    logManager.log({ type: 'application-frame-workspace-clicked' });
  }

  /** logs a top-level navigation item click for observability */
  protected onNavigationItemClicked(item: NavigationItem): void {
    logManager.log({ type: 'application-frame-navigation-clicked', item });
  }

  /** logs a nested navigation sub-item click for observability */
  protected onSubNavigationItemClicked(subItem: NavigationSubItem): void {
    logManager.log({ type: 'application-frame-sub-navigation-clicked', subItem });
  }

  /** logs a settings menu item click for observability */
  protected onSettingsMenuItemClicked(item: SettingsMenuItem): void {
    logManager.log({ type: 'application-frame-settings-clicked', item });
  }

  /** logs a logout request for observability */
  protected onLogout(): void {
    logManager.log({ type: 'application-frame-logout' });
  }
}
