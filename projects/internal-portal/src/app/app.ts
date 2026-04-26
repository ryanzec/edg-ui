import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UiThemeSwitcher } from '@organization/shared-ui';

@Component({
  selector: 'ip-root',
  imports: [RouterOutlet, RouterLink, UiThemeSwitcher],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('customer-portal');
}
