import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLEColors } from './colors';

const meta: Meta<EXAMPLEColors> = {
  title: 'Examples/Styling/Colors',
  component: EXAMPLEColors,
  parameters: {
    docs: {
      description: {
        component: `
# Design System Colors

This component demonstrates all the CSS color variables available in the design system.
The colors are organized by category and automatically adapt to light and dark themes.

## Features

- **Text Colors**: Primary, subtle, disabled, inverse, and semantic text colors
- **Link Colors**: Default, hover, pressed, and visited link states
- **Border Colors**: Input borders, general borders, and semantic border colors
- **Background Colors**: Base, primary, secondary, neutral, and semantic background colors
- **Theme Support**: All colors automatically adapt to light and dark themes
- **Interactive Swatches**: Visual representation of each color with variable names

## Usage

All colors are available as CSS custom properties (variables) and can be used in your styles:

\`\`\`css
.my-element {
  color: var(--color-text);
  background-color: var(--color-primary-background);
  border-color: var(--color-border);
}
\`\`\`

## Color Categories

### Text Colors
Used for all text content, including primary text, subtle text, and semantic states.

### Link Colors
Specific colors for links in different states (default, hover, pressed, visited).

### Border Colors
Colors for borders, including input borders and semantic border colors.

### Background Colors
Background colors for different components and semantic states, including hover and pressed states.

## Theme Adaptation

All colors automatically adapt when switching between light and dark themes.
The same variable names work in both themes, making it easy to maintain consistent styling.
        `,
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<EXAMPLEColors>;

/**
 * Complete showcase of all CSS color variables in the design system.
 * Colors are organized by category and show both the visual representation
 * and the CSS variable name for easy reference.
 */
export const AllColors: Story = {
  name: 'All Colors',
  parameters: {
    docs: {
      description: {
        story: `
This story shows all available color variables organized by category:

- **Text & Link Colors**: All text-related colors including semantic states
- **Border Colors**: Border colors for inputs, general borders, and semantic states
- **Background Colors**: Background colors for all components and states

Each color swatch shows:
- Visual representation of the color
- Color name
- CSS variable name
- Description of usage

Colors automatically adapt to the current theme (light/dark).
Inverse colors are automatically displayed with appropriate background colors.
        `,
      },
    },
  },
};
