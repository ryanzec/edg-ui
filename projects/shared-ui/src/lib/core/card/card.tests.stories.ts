import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { BoxBackground, BoxBorder, BoxPadding } from '../box/box';
import { Card, type CardColor } from './card';
import { CardContent } from './card-content';
import { CardFooter, type CardAlignment } from './card-footer';
import { CardHeader } from './card-header';
import { CardImage, type CardImageMode } from './card-image';

@Component({
  selector: 'story-card-host-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card],
  host: { class: 'block' },
  template: `
    <org-card
      data-testid="card"
      [color]="color()"
      [boxBorder]="boxBorder()"
      [boxBackground]="boxBackground()"
      [boxPadding]="boxPadding()"
      [containerClass]="containerClass()"
      [isExpandable]="isExpandable()"
      [(isExpanded)]="isExpanded"
      (clicked)="handleClicked()"
    >
      <span data-testid="projected">projected content</span>
    </org-card>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-color-primary" (click)="color.set('primary')">color-primary</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-color-info" (click)="color.set('info')">color-info</button>
      <button type="button" data-testid="ctl-box-border-thick" (click)="boxBorder.set('border-thick')">
        box-border-thick
      </button>
      <button type="button" data-testid="ctl-box-border-emphasize" (click)="boxBorder.set('border-emphasize')">
        box-border-emphasize
      </button>
      <button type="button" data-testid="ctl-box-background-colorless" (click)="boxBackground.set('colorless')">
        box-background-colorless
      </button>
      <button type="button" data-testid="ctl-box-padding-lg" (click)="boxPadding.set('lg')">box-padding-lg</button>
      <button type="button" data-testid="ctl-container-class-extra" (click)="containerClass.set('extra-class')">
        container-class-extra
      </button>
      <button type="button" data-testid="ctl-expandable-on" (click)="isExpandable.set(true)">expandable-on</button>
    </div>
  `,
})
class StoryCardHostShell {
  protected readonly color = signal<CardColor | undefined>(undefined);
  protected readonly boxBorder = signal<BoxBorder>('bordered');
  protected readonly boxBackground = signal<BoxBackground>('colored');
  protected readonly boxPadding = signal<BoxPadding>('base');
  protected readonly containerClass = signal<string>('');
  protected readonly isExpandable = signal<boolean>(false);
  protected readonly isExpanded = signal<boolean>(true);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-card-static-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card],
  host: { class: 'block' },
  template: `<org-card data-testid="card">content</org-card>`,
})
class StoryCardStaticShell {}

@Component({
  selector: 'story-card-content-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent],
  host: { class: 'block' },
  template: `
    <org-card [isExpandable]="isExpandable()" [(isExpanded)]="isExpanded">
      <org-card-content data-testid="content">
        <span data-testid="content-child">body</span>
      </org-card-content>
    </org-card>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-expandable-on" (click)="isExpandable.set(true)">expandable-on</button>
      <button type="button" data-testid="ctl-collapse" (click)="isExpanded.set(false)">collapse</button>
      <button type="button" data-testid="ctl-expand" (click)="isExpanded.set(true)">expand</button>
    </div>
  `,
})
class StoryCardContentShell {
  protected readonly isExpandable = signal<boolean>(false);
  protected readonly isExpanded = signal<boolean>(true);
}

@Component({
  selector: 'story-card-header-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardHeader],
  host: { class: 'block' },
  template: `
    <org-card [isExpandable]="isExpandable()" [(isExpanded)]="isExpanded">
      <org-card-header [title]="title()" [subtitle]="subtitle()" [headingLevel]="headingLevel()" data-testid="header">
        @if (showActions()) {
          <button actions type="button" data-testid="action-button">Act</button>
        }
      </org-card-header>
    </org-card>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-title-clear" (click)="title.set(undefined)">title-clear</button>
      <button type="button" data-testid="ctl-title-other" (click)="title.set('Another title')">title-other</button>
      <button type="button" data-testid="ctl-subtitle-set" (click)="subtitle.set('A descriptive subtitle.')">
        subtitle-set
      </button>
      <button type="button" data-testid="ctl-heading-level-1" (click)="headingLevel.set(1)">heading-level-1</button>
      <button type="button" data-testid="ctl-heading-level-6" (click)="headingLevel.set(6)">heading-level-6</button>
      <button type="button" data-testid="ctl-expandable-on" (click)="isExpandable.set(true)">expandable-on</button>
      <button type="button" data-testid="ctl-collapse" (click)="isExpanded.set(false)">collapse</button>
      <button type="button" data-testid="ctl-expand" (click)="isExpanded.set(true)">expand</button>
      <button type="button" data-testid="ctl-show-actions" (click)="showActions.set(true)">show-actions</button>
    </div>
  `,
})
class StoryCardHeaderShell {
  protected readonly title = signal<string | undefined>('Project settings');
  protected readonly subtitle = signal<string | undefined>(undefined);
  protected readonly headingLevel = signal<number>(3);
  protected readonly isExpandable = signal<boolean>(false);
  protected readonly isExpanded = signal<boolean>(true);
  protected readonly showActions = signal<boolean>(false);
}

@Component({
  selector: 'story-card-header-actions-only-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardHeader],
  host: { class: 'block' },
  template: `
    <org-card>
      <org-card-header [title]="title()" data-testid="header">
        <span actions data-testid="actions">action</span>
      </org-card-header>
    </org-card>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-title-set" (click)="title.set('A title')">title-set</button>
    </div>
  `,
})
class StoryCardHeaderActionsOnlyShell {
  protected readonly title = signal<string | undefined>(undefined);
}

@Component({
  selector: 'story-card-image-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardImage],
  host: { class: 'block' },
  template: `
    <org-card [isExpandable]="isExpandable()" [(isExpanded)]="isExpanded">
      <org-card-image
        [mode]="mode()"
        [src]="src()"
        [alt]="alt()"
        [width]="width()"
        [height]="height()"
        [fullWidth]="fullWidth()"
        [priority]="priority()"
        data-testid="image"
      />
    </org-card>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-mode-default" (click)="mode.set('default')">mode-default</button>
      <button type="button" data-testid="ctl-src-other" (click)="src.set('https://example.com/other.png')">
        src-other
      </button>
      <button type="button" data-testid="ctl-alt-other" (click)="alt.set('a different label')">alt-other</button>
      <button type="button" data-testid="ctl-width-200" (click)="width.set(200)">width-200</button>
      <button type="button" data-testid="ctl-height-100" (click)="height.set(100)">height-100</button>
      <button type="button" data-testid="ctl-full-width-off" (click)="fullWidth.set(false)">full-width-off</button>
      <button type="button" data-testid="ctl-priority-on" (click)="priority.set(true)">priority-on</button>
      <button type="button" data-testid="ctl-expandable-on" (click)="isExpandable.set(true)">expandable-on</button>
      <button type="button" data-testid="ctl-collapse" (click)="isExpanded.set(false)">collapse</button>
      <button type="button" data-testid="ctl-expand" (click)="isExpanded.set(true)">expand</button>
    </div>
  `,
})
class StoryCardImageShell {
  protected readonly mode = signal<CardImageMode>('fill');
  protected readonly src = signal<string>('https://example.com/img.png');
  protected readonly alt = signal<string>('cover photo');
  protected readonly width = signal<number | undefined>(undefined);
  protected readonly height = signal<number | undefined>(undefined);
  protected readonly fullWidth = signal<boolean>(true);
  protected readonly priority = signal<boolean>(false);
  protected readonly isExpandable = signal<boolean>(false);
  protected readonly isExpanded = signal<boolean>(true);
}

@Component({
  selector: 'story-card-footer-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardFooter],
  host: { class: 'block' },
  template: `
    <org-card [isExpandable]="isExpandable()" [(isExpanded)]="isExpanded">
      <org-card-footer [alignment]="alignment()" data-testid="footer">
        <span data-testid="footer-child">action</span>
      </org-card-footer>
    </org-card>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-alignment-start" (click)="alignment.set('start')">alignment-start</button>
      <button type="button" data-testid="ctl-alignment-center" (click)="alignment.set('center')">
        alignment-center
      </button>
      <button type="button" data-testid="ctl-alignment-end" (click)="alignment.set('end')">alignment-end</button>
      <button type="button" data-testid="ctl-expandable-on" (click)="isExpandable.set(true)">expandable-on</button>
      <button type="button" data-testid="ctl-collapse" (click)="isExpanded.set(false)">collapse</button>
      <button type="button" data-testid="ctl-expand" (click)="isExpanded.set(true)">expand</button>
    </div>
  `,
})
class StoryCardFooterShell {
  protected readonly alignment = signal<CardAlignment>('end');
  protected readonly isExpandable = signal<boolean>(false);
  protected readonly isExpanded = signal<boolean>(true);
}

const meta: Meta = {
  title: 'Core/Components/Card/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderHostShell: Story['render'] = () => ({
  template: `<story-card-host-shell />`,
  moduleMetadata: { imports: [StoryCardHostShell] },
});

const renderStaticShell: Story['render'] = () => ({
  template: `<story-card-static-shell />`,
  moduleMetadata: { imports: [StoryCardStaticShell] },
});

const renderContentShell: Story['render'] = () => ({
  template: `<story-card-content-shell />`,
  moduleMetadata: { imports: [StoryCardContentShell] },
});

const renderHeaderShell: Story['render'] = () => ({
  template: `<story-card-header-shell />`,
  moduleMetadata: { imports: [StoryCardHeaderShell] },
});

const renderHeaderActionsOnlyShell: Story['render'] = () => ({
  template: `<story-card-header-actions-only-shell />`,
  moduleMetadata: { imports: [StoryCardHeaderActionsOnlyShell] },
});

const renderImageShell: Story['render'] = () => ({
  template: `<story-card-image-shell />`,
  moduleMetadata: { imports: [StoryCardImageShell] },
});

const renderFooterShell: Story['render'] = () => ({
  template: `<story-card-footer-shell />`,
  moduleMetadata: { imports: [StoryCardFooterShell] },
});

export const AppliesDefaultBoxBorderAndBoxBackground: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await expect(host.getAttribute('data-box-border')).toBe('bordered');
    await expect(host.getAttribute('data-box-background')).toBe('colored');
  },
};

export const OmitsDataColorWhenNoColorInput: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await expect(host.getAttribute('data-color')).toBeNull();
  },
};

export const ReflectsColorBoxBorderBoxBackgroundInputs: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));
    await userEvent.click(canvas.getByTestId('ctl-box-border-thick'));
    await userEvent.click(canvas.getByTestId('ctl-box-background-colorless'));

    await waitFor(() => {
      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-box-border')).toBe('border-thick');
      expect(host.getAttribute('data-box-background')).toBe('colorless');
    });
  },
};

export const UpdatesDataColorWhenColorChanges: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));
    await waitFor(() => expect(host.getAttribute('data-color')).toBe('primary'));

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await waitFor(() => expect(host.getAttribute('data-color')).toBe('danger'));
  },
};

export const ForwardsColorBorderBackgroundPaddingToInnerBox: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await userEvent.click(canvas.getByTestId('ctl-color-info'));
    await userEvent.click(canvas.getByTestId('ctl-box-border-emphasize'));
    await userEvent.click(canvas.getByTestId('ctl-box-background-colorless'));
    await userEvent.click(canvas.getByTestId('ctl-box-padding-lg'));

    await waitFor(() => {
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-color')).toBe('info');
      expect(box.getAttribute('data-border')).toBe('border-emphasize');
      expect(box.getAttribute('data-background')).toBe('colorless');
      expect(box.getAttribute('data-padding')).toBe('lg');
    });
  },
};

export const AppliesContainerClassToInnerBox: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await userEvent.click(canvas.getByTestId('ctl-container-class-extra'));

    await waitFor(() => {
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.classList.contains('extra-class')).toBe(true);
    });
  },
};

export const ProjectsChildrenIntoInnerBox: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');
    const box = host.querySelector('org-box') as HTMLElement;

    await expect(box.querySelector('[data-testid="projected"]')).not.toBeNull();
  },
};

export const NoClickableAttrsWhenNoClickedListener: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');
    const box = host.querySelector('org-box') as HTMLElement;

    await expect(box.getAttribute('role')).toBeNull();
    await expect(box.getAttribute('tabindex')).toBeNull();
    await expect(box.getAttribute('data-clickable')).toBeNull();
  },
};

export const FlipsInnerBoxClickableWhenClickedListenerBound: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await waitFor(() => {
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBe('button');
      expect(box.getAttribute('tabindex')).toBe('0');
      expect(box.getAttribute('data-clickable')).toBe('');
    });
  },
};

export const EmitsClickedWhenInnerBoxClicked: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('clickCount=0');

    const box = host.querySelector('org-box') as HTMLElement;

    await userEvent.click(box);

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
  },
};

export const DoesNotFlipClickableWhenExpandable: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => {
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBeNull();
      expect(box.getAttribute('data-clickable')).toBeNull();
    });
  },
};

export const DoesNotEmitClickedWhenExpandable: Story = {
  render: renderHostShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('card');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => expect(host.querySelector('org-box')?.getAttribute('data-clickable')).toBeNull());

    const box = host.querySelector('org-box') as HTMLElement;

    box.click();

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const ContentRendersProjectedContent: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = await canvas.findByTestId('content');

    await expect(content.querySelector('[data-testid="content-child"]')).not.toBeNull();
  },
};

export const ContentNoDataHiddenWhenCardNotExpandable: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = await canvas.findByTestId('content');

    await expect(content.getAttribute('data-hidden')).toBeNull();
  },
};

export const ContentNoDataHiddenWhenExpandableAndExpanded: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = await canvas.findByTestId('content');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => expect(content.getAttribute('data-hidden')).toBeNull());
  },
};

export const ContentAppliesDataHiddenWhenExpandableAndCollapsed: Story = {
  render: renderContentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = await canvas.findByTestId('content');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));
    await userEvent.click(canvas.getByTestId('ctl-collapse'));

    await waitFor(() => expect(content.getAttribute('data-hidden')).toBe(''));
  },
};

export const HeaderRendersTitleInH3ByDefault: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');
    const heading = header.querySelector('h3.header-title') as HTMLElement;

    await expect(heading).not.toBeNull();
    await expect(heading.textContent?.trim()).toBe('Project settings');
  },
};

export const HeaderOmitsSubtitleWhenNotProvided: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await expect(header.querySelector('.header-subtitle')).toBeNull();
  },
};

export const HeaderRendersSubtitleTextWhenProvided: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-subtitle-set'));

    await waitFor(() => {
      const subtitle = header.querySelector('.header-subtitle') as HTMLElement;

      expect(subtitle.textContent?.trim()).toBe('A descriptive subtitle.');
    });
  },
};

export const HeaderDoesNotRenderHeadingWhenTitleEmpty: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-title-clear'));

    await waitFor(() => expect(header.querySelector('.header-title')).toBeNull());
  },
};

export const HeaderRendersH1WhenHeadingLevel1: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-heading-level-1'));

    await waitFor(() => {
      const heading = header.querySelector('h1.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });
  },
};

export const HeaderRendersH6WhenHeadingLevel6: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-heading-level-6'));

    await waitFor(() => {
      const heading = header.querySelector('h6.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });
  },
};

export const HeaderAppliesDataActionsOnlyWhenNoTitleOrSubtitle: Story = {
  render: renderHeaderActionsOnlyShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await expect(header.getAttribute('data-actions-only')).toBe('');
  },
};

export const HeaderOmitsDataActionsOnlyWhenTitleProvided: Story = {
  render: renderHeaderActionsOnlyShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-title-set'));

    await waitFor(() => expect(header.getAttribute('data-actions-only')).toBeNull());
  },
};

export const HeaderAppliesDataExpandableWhenCardExpandable: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => expect(header.getAttribute('data-expandable')).toBe(''));
  },
};

export const HeaderRendersToggleWithChevronLabeledCollapseWhenExpanded: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => {
      const toggle = header.querySelector('button.header-toggle') as HTMLButtonElement;

      expect(toggle).not.toBeNull();
      expect(toggle.querySelector('h3.header-title')?.textContent?.trim()).toBe('Project settings');

      const indicatorButton = toggle.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Collapse');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('true');
    });
  },
};

export const HeaderSwitchesIndicatorToExpandWhenCollapsed: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));
    await userEvent.click(canvas.getByTestId('ctl-collapse'));

    await waitFor(() => {
      const indicatorButton = header.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Expand');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('false');
    });
  },
};

export const HeaderTogglesIsExpandedWhenToggleClicked: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    let toggle: HTMLButtonElement | null = null;

    await waitFor(() => {
      toggle = header.querySelector('button.header-toggle') as HTMLButtonElement;
      expect(toggle).not.toBeNull();
    });

    const indicatorButton = () => header.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

    await expect(indicatorButton().getAttribute('aria-expanded')).toBe('true');

    await userEvent.click(toggle!);

    await waitFor(() => expect(indicatorButton().getAttribute('aria-expanded')).toBe('false'));
  },
};

export const HeaderProjectsActionsAttributeElementsIntoHeader: Story = {
  render: renderHeaderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('header');

    await userEvent.click(canvas.getByTestId('ctl-show-actions'));

    await waitFor(() => expect(header.querySelector('[data-testid="action-button"]')).not.toBeNull());
  },
};

export const ImageRendersImgWithSrcAndAlt: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');
    const img = image.querySelector('img') as HTMLImageElement;

    await expect(img).not.toBeNull();
    await expect(img.getAttribute('src')).toBe('https://example.com/img.png');
    await expect(img.getAttribute('alt')).toBe('cover photo');
  },
};

export const ImageAppliesFillModeDefaultHostAttrs: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');

    await expect(image.getAttribute('data-full-width')).toBe('1');
    await expect(image.getAttribute('data-mode')).toBe('fill');
    await expect(image.getAttribute('data-priority')).toBeNull();
  },
};

export const ImageUpdatesSrcWhenInputChanges: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');

    await userEvent.click(canvas.getByTestId('ctl-src-other'));

    await waitFor(() => {
      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toBe('https://example.com/other.png');
    });
  },
};

export const ImageUpdatesAltWhenInputChanges: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');

    await userEvent.click(canvas.getByTestId('ctl-alt-other'));

    await waitFor(() => {
      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('a different label');
    });
  },
};

export const ImageRendersImgWithExplicitWidthAndHeight: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');

    await userEvent.click(canvas.getByTestId('ctl-width-200'));
    await userEvent.click(canvas.getByTestId('ctl-height-100'));
    await userEvent.click(canvas.getByTestId('ctl-mode-default'));

    await waitFor(() => {
      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('width')).toBe('200');
      expect(img.getAttribute('height')).toBe('100');
    });
  },
};

export const ImageReflectsFullWidthZeroModeNullAndPriority: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');

    await userEvent.click(canvas.getByTestId('ctl-width-200'));
    await userEvent.click(canvas.getByTestId('ctl-height-100'));
    await userEvent.click(canvas.getByTestId('ctl-mode-default'));
    await userEvent.click(canvas.getByTestId('ctl-full-width-off'));
    await userEvent.click(canvas.getByTestId('ctl-priority-on'));

    await waitFor(() => {
      expect(image.getAttribute('data-full-width')).toBe('0');
      expect(image.getAttribute('data-mode')).toBeNull();
      expect(image.getAttribute('data-priority')).toBe('');
    });
  },
};

export const ImageNoDataHiddenWhenExpanded: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => expect(image.getAttribute('data-hidden')).toBeNull());
  },
};

export const ImageAppliesDataHiddenWhenCollapsed: Story = {
  render: renderImageShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByTestId('image');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));
    await userEvent.click(canvas.getByTestId('ctl-collapse'));

    await waitFor(() => expect(image.getAttribute('data-hidden')).toBe(''));
  },
};

export const FooterAppliesDefaultEndAlignment: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');

    await expect(footer.getAttribute('data-alignment')).toBe('end');
  },
};

export const FooterRendersProjectedChildren: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');

    await expect(footer.querySelector('[data-testid="footer-child"]')).not.toBeNull();
  },
};

export const FooterReflectsAlignmentInput: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');

    await userEvent.click(canvas.getByTestId('ctl-alignment-start'));

    await waitFor(() => expect(footer.getAttribute('data-alignment')).toBe('start'));
  },
};

export const FooterUpdatesAlignmentWhenInputChanges: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');

    await userEvent.click(canvas.getByTestId('ctl-alignment-start'));
    await waitFor(() => expect(footer.getAttribute('data-alignment')).toBe('start'));

    await userEvent.click(canvas.getByTestId('ctl-alignment-center'));
    await waitFor(() => expect(footer.getAttribute('data-alignment')).toBe('center'));
  },
};

export const FooterNoDataHiddenWhenExpanded: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));

    await waitFor(() => expect(footer.getAttribute('data-hidden')).toBeNull());
  },
};

export const FooterAppliesDataHiddenWhenCollapsed: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');

    await userEvent.click(canvas.getByTestId('ctl-expandable-on'));
    await userEvent.click(canvas.getByTestId('ctl-collapse'));

    await waitFor(() => expect(footer.getAttribute('data-hidden')).toBe(''));
  },
};
