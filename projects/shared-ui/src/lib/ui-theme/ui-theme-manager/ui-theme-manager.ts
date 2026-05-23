import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  // makes the service a singleton available app-wide
  providedIn: 'root',
})
export class UiThemeManager {
  private readonly document = inject(DOCUMENT);

  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    const isOSDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.setDarkMode(isOSDarkMode);
    this.updateDisplay(this.isDarkMode());

    // keep the document theme class in sync whenever the dark mode preference changes
    effect(() => {
      this.updateDisplay(this.isDarkMode());
    });
  }

  public setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }

  public toggleMode(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  private updateDisplay(isDarkMode: boolean): void {
    const htmlElement = this.document.documentElement;

    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
