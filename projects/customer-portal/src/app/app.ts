import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AuthenticationManager, SettingsMenuItem, ApplicationFrame } from '@organization/shared-ui';
import { CommonModule } from '@angular/common';
import { cssUtils } from '@organization/shared-utils';

@Component({
  selector: 'cp-root',
  imports: [RouterOutlet, CommonModule, CdkScrollable, ApplicationFrame],
  templateUrl: './app.html',
})
export class App {
  public readonly authenticationManager = inject(AuthenticationManager);

  protected readonly title = signal('customer-portal');

  protected readonly isAuthenticated = computed(() => this.authenticationManager.isAuthenticated());
  protected readonly hasInitialized = computed(() => this.authenticationManager.hasInitialized());

  protected mergeClasses = cssUtils.merge;

  constructor() {
    this.authenticationManager.check();
  }

  protected onSettingsMenuItemClick(item: SettingsMenuItem): void {
    console.log('Settings menu item clicked:', item);
  }

  protected onLogout(): void {
    this.authenticationManager.logout();
  }
}
