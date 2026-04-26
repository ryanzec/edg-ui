import type { Meta, StoryObj } from '@storybook/angular';
import { UiThemeSwitcher } from './ui-theme-switcher';
import { UiThemeManager } from '../ui-theme-manager/ui-theme-manager';
import { importProvidersFrom } from '@angular/core';

const meta: Meta<UiThemeSwitcher> = {
  title: 'UI Theme/Components/UI Theme Switcher',
  component: UiThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (story) => ({
      ...story(),
      providers: [importProvidersFrom(UiThemeManager)],
    }),
  ],
};

export default meta;
type Story = StoryObj<UiThemeSwitcher>;

export const Default: Story = {};
