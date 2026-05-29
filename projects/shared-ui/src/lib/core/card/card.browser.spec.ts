import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import type { BoxBackground, BoxBorder, BoxPadding } from '../box/box';
import { Card, type CardColor } from './card';
import { CardContent } from './card-content';
import { CardFooter, type CardAlignment } from './card-footer';
import { CardHeader } from './card-header';
import { CardImage, type CardImageMode } from './card-image';

@Component({
  selector: 'test-card-interactive-host',
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
  `,
})
class CardInteractiveHost {
  public readonly color = signal<CardColor | undefined>(undefined);
  public readonly boxBorder = signal<BoxBorder>('bordered');
  public readonly boxBackground = signal<BoxBackground>('colored');
  public readonly boxPadding = signal<BoxPadding>('base');
  public readonly containerClass = signal<string>('');
  public readonly isExpandable = signal<boolean>(false);
  public readonly isExpanded = signal<boolean>(true);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-card-static-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card],
  host: { class: 'block' },
  template: `<org-card data-testid="card">content</org-card>`,
})
class CardStaticHost {}

@Component({
  selector: 'test-card-content-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent],
  host: { class: 'block' },
  template: `
    <org-card [isExpandable]="isExpandable()" [(isExpanded)]="isExpanded">
      <org-card-content data-testid="content">
        <span data-testid="content-child">body</span>
      </org-card-content>
    </org-card>
  `,
})
class CardContentHost {
  public readonly isExpandable = signal<boolean>(false);
  public readonly isExpanded = signal<boolean>(true);
}

@Component({
  selector: 'test-card-header-host',
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
  `,
})
class CardHeaderHost {
  public readonly title = signal<string | undefined>('Project settings');
  public readonly subtitle = signal<string | undefined>(undefined);
  public readonly headingLevel = signal<number>(3);
  public readonly isExpandable = signal<boolean>(false);
  public readonly isExpanded = signal<boolean>(true);
  public readonly showActions = signal<boolean>(false);
}

@Component({
  selector: 'test-card-header-actions-only-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardHeader],
  host: { class: 'block' },
  template: `
    <org-card>
      <org-card-header [title]="title()" data-testid="header">
        <span actions data-testid="actions">action</span>
      </org-card-header>
    </org-card>
  `,
})
class CardHeaderActionsOnlyHost {
  public readonly title = signal<string | undefined>(undefined);
}

@Component({
  selector: 'test-card-image-host',
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
  `,
})
class CardImageHost {
  public readonly mode = signal<CardImageMode>('fill');
  public readonly src = signal<string>('https://example.com/img.png');
  public readonly alt = signal<string>('cover photo');
  public readonly width = signal<number | undefined>(undefined);
  public readonly height = signal<number | undefined>(undefined);
  public readonly fullWidth = signal<boolean>(true);
  public readonly priority = signal<boolean>(false);
  public readonly isExpandable = signal<boolean>(false);
  public readonly isExpanded = signal<boolean>(true);
}

@Component({
  selector: 'test-card-footer-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardFooter],
  host: { class: 'block' },
  template: `
    <org-card [isExpandable]="isExpandable()" [(isExpanded)]="isExpanded">
      <org-card-footer [alignment]="alignment()" data-testid="footer">
        <span data-testid="footer-child">action</span>
      </org-card-footer>
    </org-card>
  `,
})
class CardFooterHost {
  public readonly alignment = signal<CardAlignment>('end');
  public readonly isExpandable = signal<boolean>(false);
  public readonly isExpanded = signal<boolean>(true);
}

type CardHostConfig = {
  color?: CardColor;
  boxBorder?: BoxBorder;
  boxBackground?: BoxBackground;
  boxPadding?: BoxPadding;
  containerClass?: string;
  isExpandable?: boolean;
  isExpanded?: boolean;
};

type CardHeaderConfig = {
  title?: string;
  subtitle?: string;
  headingLevel?: number;
  isExpandable?: boolean;
  isExpanded?: boolean;
  showActions?: boolean;
};

type CardImageConfig = {
  mode?: CardImageMode;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fullWidth?: boolean;
  priority?: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
};

describe('Card (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createCardHost = (config: CardHostConfig = {}): ComponentFixture<CardInteractiveHost> =>
    createFixture(CardInteractiveHost, (instance) => {
      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.boxBorder !== undefined) {
        instance.boxBorder.set(config.boxBorder);
      }

      if (config.boxBackground !== undefined) {
        instance.boxBackground.set(config.boxBackground);
      }

      if (config.boxPadding !== undefined) {
        instance.boxPadding.set(config.boxPadding);
      }

      if (config.containerClass !== undefined) {
        instance.containerClass.set(config.containerClass);
      }

      if (config.isExpandable !== undefined) {
        instance.isExpandable.set(config.isExpandable);
      }

      if (config.isExpanded !== undefined) {
        instance.isExpanded.set(config.isExpanded);
      }
    });

  const createCardHeader = (config: CardHeaderConfig = {}): ComponentFixture<CardHeaderHost> =>
    createFixture(CardHeaderHost, (instance) => {
      if (config.title !== undefined) {
        instance.title.set(config.title);
      }

      if (config.subtitle !== undefined) {
        instance.subtitle.set(config.subtitle);
      }

      if (config.headingLevel !== undefined) {
        instance.headingLevel.set(config.headingLevel);
      }

      if (config.isExpandable !== undefined) {
        instance.isExpandable.set(config.isExpandable);
      }

      if (config.isExpanded !== undefined) {
        instance.isExpanded.set(config.isExpanded);
      }

      if (config.showActions !== undefined) {
        instance.showActions.set(config.showActions);
      }
    });

  const createCardImage = (config: CardImageConfig = {}): ComponentFixture<CardImageHost> =>
    createFixture(CardImageHost, (instance) => {
      if (config.mode !== undefined) {
        instance.mode.set(config.mode);
      }

      if (config.src !== undefined) {
        instance.src.set(config.src);
      }

      if (config.alt !== undefined) {
        instance.alt.set(config.alt);
      }

      if (config.width !== undefined) {
        instance.width.set(config.width);
      }

      if (config.height !== undefined) {
        instance.height.set(config.height);
      }

      if (config.fullWidth !== undefined) {
        instance.fullWidth.set(config.fullWidth);
      }

      if (config.priority !== undefined) {
        instance.priority.set(config.priority);
      }

      if (config.isExpandable !== undefined) {
        instance.isExpandable.set(config.isExpandable);
      }

      if (config.isExpanded !== undefined) {
        instance.isExpanded.set(config.isExpanded);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('card host', () => {
    it('applies the default box border and box background attributes', () => {
      const fixture = createCardHost();
      const host = queryByTestId(fixture, 'card');

      expect(host.getAttribute('data-box-border')).toBe('bordered');
      expect(host.getAttribute('data-box-background')).toBe('colored');
    });

    it('omits the data-color attribute when no color input is provided', () => {
      const fixture = createCardHost();
      const host = queryByTestId(fixture, 'card');

      expect(host.getAttribute('data-color')).toBeNull();
    });

    it('reflects the color, box border, and box background inputs on the host', () => {
      const fixture = createCardHost({ color: 'primary', boxBorder: 'border-thick', boxBackground: 'colorless' });
      const host = queryByTestId(fixture, 'card');

      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-box-border')).toBe('border-thick');
      expect(host.getAttribute('data-box-background')).toBe('colorless');
    });

    it('updates the data-color attribute when the color input changes', async () => {
      const fixture = createCardHost();
      const host = queryByTestId(fixture, 'card');

      fixture.componentInstance.color.set('primary');
      await flush(fixture);
      expect(host.getAttribute('data-color')).toBe('primary');

      fixture.componentInstance.color.set('danger');
      await flush(fixture);
      expect(host.getAttribute('data-color')).toBe('danger');
    });

    it('forwards color, border, background, and padding to the inner box', () => {
      const fixture = createCardHost({
        color: 'info',
        boxBorder: 'border-emphasize',
        boxBackground: 'colorless',
        boxPadding: 'lg',
      });
      const host = queryByTestId(fixture, 'card');
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-color')).toBe('info');
      expect(box.getAttribute('data-border')).toBe('border-emphasize');
      expect(box.getAttribute('data-background')).toBe('colorless');
      expect(box.getAttribute('data-padding')).toBe('lg');
    });

    it('applies the container class to the inner box', () => {
      const fixture = createCardHost({ containerClass: 'extra-class' });
      const host = queryByTestId(fixture, 'card');
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.classList.contains('extra-class')).toBe(true);
    });

    it('projects children into the inner box', () => {
      const fixture = createCardHost();
      const host = queryByTestId(fixture, 'card');
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.querySelector('[data-testid="projected"]')).not.toBeNull();
    });

    it('omits the clickable attributes on the inner box when there is no clicked listener', () => {
      const fixture = createFixture(CardStaticHost);
      const host = queryByTestId(fixture, 'card');
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBeNull();
      expect(box.getAttribute('tabindex')).toBeNull();
      expect(box.getAttribute('data-clickable')).toBeNull();
    });

    it('flips the inner box to clickable when a clicked listener is bound', () => {
      const fixture = createCardHost();
      const host = queryByTestId(fixture, 'card');
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBe('button');
      expect(box.getAttribute('tabindex')).toBe('0');
      expect(box.getAttribute('data-clickable')).toBe('');
    });

    it('emits clicked when the inner box is clicked', async () => {
      const fixture = createCardHost();
      const host = queryByTestId(fixture, 'card');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('clickCount=0');

      const box = host.querySelector('org-box') as HTMLElement;

      await userEvent.click(box);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=1');
    });

    it('does not flip the inner box to clickable when the card is expandable', () => {
      const fixture = createCardHost({ isExpandable: true });
      const host = queryByTestId(fixture, 'card');
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBeNull();
      expect(box.getAttribute('data-clickable')).toBeNull();
    });

    it('does not emit clicked when the card is expandable', async () => {
      const fixture = createCardHost({ isExpandable: true });
      const host = queryByTestId(fixture, 'card');
      const readout = queryByTestId(fixture, 'readout');
      const box = host.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-clickable')).toBeNull();

      box.click();
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });
  });

  describe('card-content', () => {
    it('renders its projected content', () => {
      const fixture = createFixture(CardContentHost);
      const content = queryByTestId(fixture, 'content');

      expect(content.querySelector('[data-testid="content-child"]')).not.toBeNull();
    });

    it('has no data-hidden attribute when the card is not expandable', () => {
      const fixture = createFixture(CardContentHost);
      const content = queryByTestId(fixture, 'content');

      expect(content.getAttribute('data-hidden')).toBeNull();
    });

    it('has no data-hidden attribute when the card is expandable and expanded', () => {
      const fixture = createFixture(CardContentHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const content = queryByTestId(fixture, 'content');

      expect(content.getAttribute('data-hidden')).toBeNull();
    });

    it('applies data-hidden when the card is expandable and collapsed', async () => {
      const fixture = createFixture(CardContentHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const content = queryByTestId(fixture, 'content');

      fixture.componentInstance.isExpanded.set(false);
      await flush(fixture);

      expect(content.getAttribute('data-hidden')).toBe('');
    });
  });

  describe('card-header', () => {
    it('renders the title in an h3 by default', () => {
      const fixture = createCardHeader();
      const header = queryByTestId(fixture, 'header');
      const heading = header.querySelector('h3.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('omits the subtitle when none is provided', () => {
      const fixture = createCardHeader();
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('.header-subtitle')).toBeNull();
    });

    it('renders the subtitle text when provided', () => {
      const fixture = createCardHeader({ subtitle: 'A descriptive subtitle.' });
      const header = queryByTestId(fixture, 'header');
      const subtitle = header.querySelector('.header-subtitle') as HTMLElement;

      expect(subtitle.textContent?.trim()).toBe('A descriptive subtitle.');
    });

    it('does not render the heading when the title is empty', () => {
      const fixture = createFixture(CardHeaderHost, (instance) => {
        instance.title.set(undefined);
      });
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('.header-title')).toBeNull();
    });

    it('renders an h1 when the heading level is 1', () => {
      const fixture = createCardHeader({ headingLevel: 1 });
      const header = queryByTestId(fixture, 'header');
      const heading = header.querySelector('h1.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('renders an h6 when the heading level is 6', () => {
      const fixture = createCardHeader({ headingLevel: 6 });
      const header = queryByTestId(fixture, 'header');
      const heading = header.querySelector('h6.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('applies data-actions-only when there is no title or subtitle', () => {
      const fixture = createFixture(CardHeaderActionsOnlyHost);
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-actions-only')).toBe('');
    });

    it('omits data-actions-only when a title is provided', async () => {
      const fixture = createFixture(CardHeaderActionsOnlyHost);
      const header = queryByTestId(fixture, 'header');

      fixture.componentInstance.title.set('A title');
      await flush(fixture);

      expect(header.getAttribute('data-actions-only')).toBeNull();
    });

    it('applies data-expandable when the parent card is expandable', () => {
      const fixture = createCardHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-expandable')).toBe('');
    });

    it('renders the toggle with a chevron labeled Collapse when expanded', () => {
      const fixture = createCardHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');
      const toggle = header.querySelector('button.header-toggle') as HTMLButtonElement;

      expect(toggle).not.toBeNull();
      expect(toggle.querySelector('h3.header-title')?.textContent?.trim()).toBe('Project settings');

      const indicatorButton = toggle.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Collapse');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('switches the indicator to Expand when collapsed', async () => {
      const fixture = createCardHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');

      fixture.componentInstance.isExpanded.set(false);
      await flush(fixture);

      const indicatorButton = header.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Expand');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles the expanded state when the toggle is clicked', async () => {
      const fixture = createCardHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');
      const toggle = header.querySelector('button.header-toggle') as HTMLButtonElement;

      const indicatorButton = (): HTMLButtonElement =>
        header.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton().getAttribute('aria-expanded')).toBe('true');

      await userEvent.click(toggle);

      await waitFor(() => expect(indicatorButton().getAttribute('aria-expanded')).toBe('false'));
    });

    it('projects elements with the actions attribute into the header', () => {
      const fixture = createCardHeader({ showActions: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('[data-testid="action-button"]')).not.toBeNull();
    });
  });

  describe('card-image', () => {
    it('renders an img with the provided src and alt', () => {
      const fixture = createCardImage();
      const image = queryByTestId(fixture, 'image');
      const img = image.querySelector('img') as HTMLImageElement;

      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
      expect(img.getAttribute('alt')).toBe('cover photo');
    });

    it('applies the default host attributes in fill mode', () => {
      const fixture = createCardImage();
      const image = queryByTestId(fixture, 'image');

      expect(image.getAttribute('data-full-width')).toBe('1');
      expect(image.getAttribute('data-mode')).toBe('fill');
      expect(image.getAttribute('data-priority')).toBeNull();
    });

    it('updates the img src when the src input changes', async () => {
      const fixture = createCardImage();
      const image = queryByTestId(fixture, 'image');

      fixture.componentInstance.src.set('https://example.com/other.png');
      await flush(fixture);

      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toBe('https://example.com/other.png');
    });

    it('updates the img alt when the alt input changes', async () => {
      const fixture = createCardImage();
      const image = queryByTestId(fixture, 'image');

      fixture.componentInstance.alt.set('a different label');
      await flush(fixture);

      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('a different label');
    });

    it('renders the img with explicit width and height in default mode', () => {
      const fixture = createCardImage({ width: 200, height: 100, mode: 'default' });
      const image = queryByTestId(fixture, 'image');
      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('width')).toBe('200');
      expect(img.getAttribute('height')).toBe('100');
    });

    it('reflects full-width zero, null mode, and priority in the host attributes', () => {
      const fixture = createCardImage({
        width: 200,
        height: 100,
        mode: 'default',
        fullWidth: false,
        priority: true,
      });
      const image = queryByTestId(fixture, 'image');

      expect(image.getAttribute('data-full-width')).toBe('0');
      expect(image.getAttribute('data-mode')).toBeNull();
      expect(image.getAttribute('data-priority')).toBe('');
    });

    it('has no data-hidden attribute when the card is expanded', () => {
      const fixture = createCardImage({ isExpandable: true });
      const image = queryByTestId(fixture, 'image');

      expect(image.getAttribute('data-hidden')).toBeNull();
    });

    it('applies data-hidden when the card is collapsed', async () => {
      const fixture = createCardImage({ isExpandable: true });
      const image = queryByTestId(fixture, 'image');

      fixture.componentInstance.isExpanded.set(false);
      await flush(fixture);

      expect(image.getAttribute('data-hidden')).toBe('');
    });
  });

  describe('card-footer', () => {
    it('applies the default end alignment', () => {
      const fixture = createFixture(CardFooterHost);
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.getAttribute('data-alignment')).toBe('end');
    });

    it('renders its projected children', () => {
      const fixture = createFixture(CardFooterHost);
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.querySelector('[data-testid="footer-child"]')).not.toBeNull();
    });

    it('reflects the alignment input', () => {
      const fixture = createFixture(CardFooterHost, (instance) => {
        instance.alignment.set('start');
      });
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.getAttribute('data-alignment')).toBe('start');
    });

    it('updates the alignment when the input changes', async () => {
      const fixture = createFixture(CardFooterHost);
      const footer = queryByTestId(fixture, 'footer');

      fixture.componentInstance.alignment.set('start');
      await flush(fixture);
      expect(footer.getAttribute('data-alignment')).toBe('start');

      fixture.componentInstance.alignment.set('center');
      await flush(fixture);
      expect(footer.getAttribute('data-alignment')).toBe('center');
    });

    it('has no data-hidden attribute when the card is expanded', () => {
      const fixture = createFixture(CardFooterHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.getAttribute('data-hidden')).toBeNull();
    });

    it('applies data-hidden when the card is collapsed', async () => {
      const fixture = createFixture(CardFooterHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const footer = queryByTestId(fixture, 'footer');

      fixture.componentInstance.isExpanded.set(false);
      await flush(fixture);

      expect(footer.getAttribute('data-hidden')).toBe('');
    });
  });
});
