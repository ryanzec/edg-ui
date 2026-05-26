import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { EmptyIndicator } from './empty-indicator';
import { EmptyIndicatorIcon, type EmptyIndicatorIconColor } from './empty-indicator-icon';
import type { BoxBackground, BoxBorder, BoxColor, BoxPadding } from '../box/box';
import type { IconName } from '../icon/icon-brain';

@Component({
  selector: 'story-empty-indicator-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyIndicator, EmptyIndicatorIcon],
  host: { class: 'block' },
  template: `
    @if (withListener()) {
      <org-empty-indicator
        data-testid="indicator"
        [header]="header()"
        [description]="description()"
        [actionLabel]="actionLabel()"
        [boxColor]="boxColor()"
        [boxBorder]="boxBorder()"
        [boxPadding]="boxPadding()"
        [boxBackground]="boxBackground()"
        [statusRole]="statusRole()"
        (actionTriggered)="handleActionTriggered()"
      >
        @if (showIcon()) {
          <org-empty-indicator-icon data-testid="icon" name="inbox" />
        }
      </org-empty-indicator>
    } @else {
      <org-empty-indicator
        data-testid="indicator"
        [header]="header()"
        [description]="description()"
        [actionLabel]="actionLabel()"
        [boxColor]="boxColor()"
        [boxBorder]="boxBorder()"
        [boxPadding]="boxPadding()"
        [boxBackground]="boxBackground()"
        [statusRole]="statusRole()"
      >
        @if (showIcon()) {
          <org-empty-indicator-icon data-testid="icon" name="inbox" />
        }
      </org-empty-indicator>
    }
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-description-set" (click)="description.set('A helpful description')">
        description-set
      </button>
      <button type="button" data-testid="ctl-description-null" (click)="description.set(null)">description-null</button>
      <button type="button" data-testid="ctl-action-label-set" (click)="actionLabel.set('Add item')">
        action-label-set
      </button>
      <button type="button" data-testid="ctl-action-label-null" (click)="actionLabel.set(null)">
        action-label-null
      </button>
      <button type="button" data-testid="ctl-listener-on" (click)="withListener.set(true)">listener-on</button>
      <button type="button" data-testid="ctl-listener-off" (click)="withListener.set(false)">listener-off</button>
      <button type="button" data-testid="ctl-status-role-off" (click)="statusRole.set(false)">status-role-off</button>
      <button type="button" data-testid="ctl-box-color-info" (click)="boxColor.set('info')">box-color-info</button>
      <button type="button" data-testid="ctl-box-color-null" (click)="boxColor.set(null)">box-color-null</button>
      <button type="button" data-testid="ctl-box-border-borderless" (click)="boxBorder.set('borderless')">
        box-border-borderless
      </button>
      <button type="button" data-testid="ctl-box-padding-lg" (click)="boxPadding.set('lg')">box-padding-lg</button>
      <button type="button" data-testid="ctl-box-background-colored" (click)="boxBackground.set('colored')">
        box-background-colored
      </button>
      <button type="button" data-testid="ctl-show-icon-on" (click)="showIcon.set(true)">show-icon-on</button>
    </div>
  `,
})
class StoryEmptyIndicatorTestsShell {
  protected readonly header = signal<string>('No items found');
  protected readonly description = signal<string | null | undefined>(undefined);
  protected readonly actionLabel = signal<string | null | undefined>(undefined);
  protected readonly boxColor = signal<BoxColor | null | undefined>(undefined);
  protected readonly boxBorder = signal<BoxBorder>('bordered');
  protected readonly boxPadding = signal<BoxPadding>('base');
  protected readonly boxBackground = signal<BoxBackground>('colorless');
  protected readonly statusRole = signal<boolean>(true);
  protected readonly withListener = signal<boolean>(false);
  protected readonly showIcon = signal<boolean>(false);

  protected readonly actionCount = signal<number>(0);

  protected readout(): string {
    return `actionCount=${this.actionCount()}`;
  }

  protected handleActionTriggered(): void {
    this.actionCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-empty-indicator-icon-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyIndicator, EmptyIndicatorIcon],
  host: { class: 'block' },
  template: `
    <org-empty-indicator data-testid="indicator" header="header">
      <org-empty-indicator-icon data-testid="icon" [name]="name()" [color]="color()" [label]="label()" />
    </org-empty-indicator>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-name-search" (click)="name.set('search')">name-search</button>
      <button type="button" data-testid="ctl-color-primary" (click)="color.set('primary')">color-primary</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-label-set" (click)="label.set('No inbox items')">label-set</button>
      <button type="button" data-testid="ctl-label-null" (click)="label.set(null)">label-null</button>
    </div>
  `,
})
class StoryEmptyIndicatorIconTestsShell {
  protected readonly name = signal<IconName>('inbox');
  protected readonly color = signal<EmptyIndicatorIconColor>('inherit');
  protected readonly label = signal<string | null | undefined>(undefined);
}

const meta: Meta = {
  title: 'Core/Components/Empty Indicator/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-empty-indicator-tests-shell />`,
  moduleMetadata: { imports: [StoryEmptyIndicatorTestsShell] },
});

const renderIconShell: Story['render'] = () => ({
  template: `<story-empty-indicator-icon-tests-shell />`,
  moduleMetadata: { imports: [StoryEmptyIndicatorIconTestsShell] },
});

export const RendersRequiredHeaderText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicator = await canvas.findByTestId('indicator');
    const header = indicator.querySelector('h3');

    await expect(header?.textContent?.trim()).toBe('No items found');
  },
};

export const NoDescriptionByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicator = await canvas.findByTestId('indicator');

    await expect(indicator.querySelector('.description')).toBeNull();
  },
};

export const RendersDescriptionWhenProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-description-set'));

    const indicator = await canvas.findByTestId('indicator');

    await waitFor(() => {
      const description = indicator.querySelector('.description');

      expect(description?.textContent?.trim()).toBe('A helpful description');
    });
  },
};

export const NullDescriptionTransformsToOmitted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-description-set'));

    const indicator = await canvas.findByTestId('indicator');

    await waitFor(() => expect(indicator.querySelector('.description')).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-description-null'));

    await waitFor(() => expect(indicator.querySelector('.description')).toBeNull());
  },
};

export const NoActionButtonByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicator = await canvas.findByTestId('indicator');

    await expect(indicator.querySelector('org-button')).toBeNull();
  },
};

export const NoActionButtonWhenLabelButNoListener: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-action-label-set'));

    const indicator = await canvas.findByTestId('indicator');

    await expect(indicator.querySelector('org-button')).toBeNull();
  },
};

export const RendersActionButtonWhenLabelAndListenerPresent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-listener-on'));
    await userEvent.click(canvas.getByTestId('ctl-action-label-set'));

    await waitFor(() => {
      const indicator = canvas.getByTestId('indicator');

      expect(indicator.querySelector('org-button')).not.toBeNull();
    });
  },
};

export const ActionButtonHidesWhenListenerUnsubscribes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-listener-on'));
    await userEvent.click(canvas.getByTestId('ctl-action-label-set'));

    await waitFor(() => expect(canvas.getByTestId('indicator').querySelector('org-button')).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-listener-off'));

    await waitFor(() => expect(canvas.getByTestId('indicator').querySelector('org-button')).toBeNull());
  },
};

export const ActionButtonClickEmitsActionTriggered: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-listener-on'));
    await userEvent.click(canvas.getByTestId('ctl-action-label-set'));

    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('actionCount=0');

    await waitFor(() => expect(canvas.getByTestId('indicator').querySelector('org-button button')).not.toBeNull());

    const indicator = canvas.getByTestId('indicator');
    const actionButton = indicator.querySelector('org-button button') as HTMLButtonElement;

    await userEvent.click(actionButton);

    await waitFor(() => expect(readout.textContent).toContain('actionCount=1'));
  },
};

export const NullActionLabelTransformsToOmitted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-listener-on'));
    await userEvent.click(canvas.getByTestId('ctl-action-label-set'));

    await waitFor(() => expect(canvas.getByTestId('indicator').querySelector('org-button')).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-action-label-null'));

    await waitFor(() => expect(canvas.getByTestId('indicator').querySelector('org-button')).toBeNull());
  },
};

export const ForwardsBoxColorToInnerBox: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-box-color-info'));

    const indicator = await canvas.findByTestId('indicator');
    const innerBox = indicator.querySelector('org-box');

    await waitFor(() => expect(innerBox?.getAttribute('data-color')).toBe('info'));
  },
};

export const ForwardsBoxBorderToInnerBox: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-box-border-borderless'));

    const indicator = await canvas.findByTestId('indicator');
    const innerBox = indicator.querySelector('org-box');

    await waitFor(() => expect(innerBox?.getAttribute('data-border')).toBe('borderless'));
  },
};

export const ForwardsBoxPaddingToInnerBox: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-box-padding-lg'));

    const indicator = await canvas.findByTestId('indicator');
    const innerBox = indicator.querySelector('org-box');

    await waitFor(() => expect(innerBox?.getAttribute('data-padding')).toBe('lg'));
  },
};

export const ForwardsBoxBackgroundToInnerBox: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-box-background-colored'));

    const indicator = await canvas.findByTestId('indicator');
    const innerBox = indicator.querySelector('org-box');

    await waitFor(() => expect(innerBox?.getAttribute('data-background')).toBe('colored'));
  },
};

export const NullBoxColorTransformsToOmittedDataColor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-box-color-info'));

    const indicator = await canvas.findByTestId('indicator');
    const innerBox = indicator.querySelector('org-box');

    await waitFor(() => expect(innerBox?.getAttribute('data-color')).toBe('info'));

    await userEvent.click(canvas.getByTestId('ctl-box-color-null'));

    await waitFor(() => expect(innerBox?.getAttribute('data-color')).toBeNull());
  },
};

export const DefaultStatusRoleAppliesRoleStatusToHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicator = await canvas.findByTestId('indicator');

    await expect(indicator.getAttribute('role')).toBe('status');
  },
};

export const StatusRoleFalseOmitsRoleAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-status-role-off'));

    const indicator = await canvas.findByTestId('indicator');

    await waitFor(() => expect(indicator.getAttribute('role')).toBeNull());
  },
};

export const ProjectsEmptyIndicatorIconAboveHeader: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicator = await canvas.findByTestId('indicator');

    await expect(indicator.querySelector('org-empty-indicator-icon')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-show-icon-on'));

    await waitFor(() => expect(indicator.querySelector('org-empty-indicator-icon')).not.toBeNull());
  },
};

export const IconDefaultDataColorIsInherit: Story = {
  render: renderIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('icon');

    await expect(icon.getAttribute('data-color')).toBe('inherit');
  },
};

export const IconReflectsDataColorAttribute: Story = {
  render: renderIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));

    await waitFor(() => expect(icon.getAttribute('data-color')).toBe('primary'));

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    await waitFor(() => expect(icon.getAttribute('data-color')).toBe('danger'));
  },
};

export const IconForwardsNameToInnerIcon: Story = {
  render: renderIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('icon');

    const innerIconBefore = icon.querySelector('org-icon') as HTMLElement;

    await expect(innerIconBefore.getAttribute('data-icon')).toBe('inbox');

    await userEvent.click(canvas.getByTestId('ctl-name-search'));

    await waitFor(() => {
      const innerIcon = icon.querySelector('org-icon') as HTMLElement;

      expect(innerIcon.getAttribute('data-icon')).toBe('search');
    });
  },
};

export const IconInnerIconIsAlways4xl: Story = {
  render: renderIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('icon');
    const innerIcon = icon.querySelector('org-icon') as HTMLElement;

    await expect(innerIcon.getAttribute('data-size')).toBe('4xl');

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));

    // size stays pinned to 4xl regardless of host color
    await waitFor(() => expect(innerIcon.getAttribute('data-size')).toBe('4xl'));
  },
};

export const IconInnerIconColorIsAlwaysInherit: Story = {
  render: renderIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('icon');
    const innerIcon = icon.querySelector('org-icon') as HTMLElement;

    await expect(innerIcon.getAttribute('data-color')).toBe('inherit');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    // inner icon color stays at "inherit" so the slot color flows through via currentColor
    await waitFor(() => expect(innerIcon.getAttribute('data-color')).toBe('inherit'));
  },
};

export const IconForwardsLabelToInnerIconAriaLabel: Story = {
  render: renderIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-label-set'));

    await waitFor(() => {
      const svg = icon.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('aria-label')).toBe('No inbox items');
      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.getAttribute('aria-hidden')).toBeNull();
    });
  },
};

export const IconNullLabelTransformsToDecorative: Story = {
  render: renderIconShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-label-set'));

    await waitFor(() => {
      const svg = icon.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('aria-label')).toBe('No inbox items');
    });

    await userEvent.click(canvas.getByTestId('ctl-label-null'));

    await waitFor(() => {
      const svg = icon.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('aria-label')).toBeNull();
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.getAttribute('role')).toBeNull();
    });
  },
};
