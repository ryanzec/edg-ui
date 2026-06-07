import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Box, type BoxExpandedState, type BoxPaddingApplication } from './box';
import { BoxContent } from './box-content';
import { BoxFooter, type BoxFooterAlignment } from './box-footer';
import { BoxHeader, type BoxHeaderVariant } from './box-header';
import { BoxImage, type BoxImageMode } from './box-image';
import { BoxOuterHeader } from './box-outer-header';

@Component({
  selector: 'test-box-content-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxContent],
  host: { class: 'block' },
  template: `
    <org-box [isExpandable]="isExpandable()" [(expandedState)]="expandedState">
      <org-box-content data-testid="content">
        <span data-testid="content-child">body</span>
      </org-box-content>
    </org-box>
  `,
})
class BoxContentHost {
  public readonly isExpandable = signal<boolean>(false);
  public readonly expandedState = signal<BoxExpandedState>('full');
}

@Component({
  selector: 'test-box-header-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxHeader],
  host: { class: 'block' },
  template: `
    <org-box [isExpandable]="isExpandable()" [(expandedState)]="expandedState">
      <org-box-header
        [title]="title()"
        [subtitle]="subtitle()"
        [headingLevel]="headingLevel()"
        [hasDivider]="hasDivider()"
        [variant]="variant()"
        [isEmphasized]="isEmphasized()"
        data-testid="header"
      >
        @if (showPre()) {
          <span pre data-testid="pre-content">pre</span>
        }
        @if (showPost()) {
          <span post data-testid="post-content">post</span>
        }
        @if (showActions()) {
          <ng-template #actions>
            <button type="button" data-testid="action-button">Act</button>
          </ng-template>
        }
      </org-box-header>
    </org-box>
  `,
})
class BoxHeaderHost {
  public readonly title = signal<string | undefined>('Project settings');
  public readonly subtitle = signal<string | undefined>(undefined);
  public readonly headingLevel = signal<number>(3);
  public readonly hasDivider = signal<boolean>(false);
  public readonly variant = signal<BoxHeaderVariant>('default');
  public readonly isEmphasized = signal<boolean>(false);
  public readonly isExpandable = signal<boolean>(false);
  public readonly expandedState = signal<BoxExpandedState>('full');
  public readonly showActions = signal<boolean>(false);
  public readonly showPre = signal<boolean>(false);
  public readonly showPost = signal<boolean>(false);
}

@Component({
  selector: 'test-box-header-actions-only-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxHeader],
  host: { class: 'block' },
  template: `
    <org-box>
      <org-box-header [title]="title()" data-testid="header">
        <ng-template #actions>
          <span data-testid="actions">action</span>
        </ng-template>
      </org-box-header>
    </org-box>
  `,
})
class BoxHeaderActionsOnlyHost {
  public readonly title = signal<string | undefined>(undefined);
}

@Component({
  selector: 'test-box-image-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxImage],
  host: { class: 'block' },
  template: `
    <org-box [isExpandable]="isExpandable()" [(expandedState)]="expandedState">
      <org-box-image
        [mode]="mode()"
        [src]="src()"
        [alt]="alt()"
        [width]="width()"
        [height]="height()"
        [fullWidth]="fullWidth()"
        [priority]="priority()"
        data-testid="image"
      />
    </org-box>
  `,
})
class BoxImageHost {
  public readonly mode = signal<BoxImageMode>('fill');
  public readonly src = signal<string>('https://example.com/img.png');
  public readonly alt = signal<string>('cover photo');
  public readonly width = signal<number | undefined>(undefined);
  public readonly height = signal<number | undefined>(undefined);
  public readonly fullWidth = signal<boolean>(true);
  public readonly priority = signal<boolean>(false);
  public readonly isExpandable = signal<boolean>(false);
  public readonly expandedState = signal<BoxExpandedState>('full');
}

@Component({
  selector: 'test-box-footer-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxFooter],
  host: { class: 'block' },
  template: `
    <org-box [isExpandable]="isExpandable()" [(expandedState)]="expandedState">
      <org-box-footer [alignment]="alignment()" [hasDivider]="hasDivider()" data-testid="footer">
        <span data-testid="footer-child">action</span>
      </org-box-footer>
    </org-box>
  `,
})
class BoxFooterHost {
  public readonly alignment = signal<BoxFooterAlignment>('end');
  public readonly hasDivider = signal<boolean>(false);
  public readonly isExpandable = signal<boolean>(false);
  public readonly expandedState = signal<BoxExpandedState>('full');
}

@Component({
  selector: 'test-box-outer-header-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxOuterHeader, BoxContent],
  host: { class: 'block' },
  template: `
    <org-box [isExpandable]="isExpandable()" [(expandedState)]="expandedState">
      <org-box-outer-header [title]="title()" [subtitle]="subtitle()" data-testid="outer-header">
        @if (showPre()) {
          <span pre data-testid="outer-pre-content">pre</span>
        }
        @if (showPost()) {
          <span post data-testid="outer-post-content">post</span>
        }
        @if (showActions()) {
          <ng-template #actions>
            <button type="button" data-testid="outer-action-button">Act</button>
          </ng-template>
        }
      </org-box-outer-header>
      <org-box-content data-testid="outer-content">
        <span data-testid="outer-content-child">body</span>
      </org-box-content>
    </org-box>
  `,
})
class BoxOuterHeaderHost {
  public readonly title = signal<string | undefined>('Project settings');
  public readonly subtitle = signal<string | undefined>(undefined);
  public readonly isExpandable = signal<boolean>(true);
  public readonly expandedState = signal<BoxExpandedState>('full');
  public readonly showActions = signal<boolean>(false);
  public readonly showPre = signal<boolean>(false);
  public readonly showPost = signal<boolean>(false);
}

@Component({
  selector: 'test-box-padding-application-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxHeader, BoxContent, BoxFooter, BoxImage],
  host: { class: 'block' },
  template: `
    <!--
      the headless test harness does not load the global design-token stylesheets, so var(--spacing-3) (which the
      default padding='base' resolves --box-padding to) would compute to 0. pin --spacing-3 here so the padding
      chain resolves to a real value and the relative assertions below are meaningful.
    -->
    <org-box
      style="--spacing-3: 1rem"
      [paddingApplication]="paddingApplication()"
      [isExpandable]="isExpandable()"
      [(expandedState)]="expandedState"
      data-testid="box"
    >
      <org-box-header title="Title" [hasDivider]="true" data-testid="pa-header" />
      <org-box-content data-testid="pa-content">body</org-box-content>
      <org-box-image src="https://example.com/inset.png" alt="inset" [fullWidth]="false" data-testid="pa-image-inset" />
      <org-box-image src="https://example.com/full.png" alt="full" data-testid="pa-image-full" />
      <org-box-footer [hasDivider]="true" data-testid="pa-footer">
        <span>action</span>
      </org-box-footer>
    </org-box>
  `,
})
class BoxPaddingApplicationHost {
  public readonly paddingApplication = signal<BoxPaddingApplication>('container');
  public readonly isExpandable = signal<boolean>(false);
  public readonly expandedState = signal<BoxExpandedState>('full');
}

type BoxHeaderConfig = {
  title?: string;
  subtitle?: string;
  headingLevel?: number;
  hasDivider?: boolean;
  variant?: BoxHeaderVariant;
  isEmphasized?: boolean;
  isExpandable?: boolean;
  expandedState?: BoxExpandedState;
  showActions?: boolean;
  showPre?: boolean;
  showPost?: boolean;
};

type BoxImageConfig = {
  mode?: BoxImageMode;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fullWidth?: boolean;
  priority?: boolean;
  isExpandable?: boolean;
  expandedState?: BoxExpandedState;
};

describe('Box composition (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createBoxHeader = (config: BoxHeaderConfig = {}): ComponentFixture<BoxHeaderHost> =>
    createFixture(BoxHeaderHost, (instance) => {
      if (config.title !== undefined) {
        instance.title.set(config.title);
      }

      if (config.subtitle !== undefined) {
        instance.subtitle.set(config.subtitle);
      }

      if (config.headingLevel !== undefined) {
        instance.headingLevel.set(config.headingLevel);
      }

      if (config.hasDivider !== undefined) {
        instance.hasDivider.set(config.hasDivider);
      }

      if (config.variant !== undefined) {
        instance.variant.set(config.variant);
      }

      if (config.isEmphasized !== undefined) {
        instance.isEmphasized.set(config.isEmphasized);
      }

      if (config.isExpandable !== undefined) {
        instance.isExpandable.set(config.isExpandable);
      }

      if (config.expandedState !== undefined) {
        instance.expandedState.set(config.expandedState);
      }

      if (config.showActions !== undefined) {
        instance.showActions.set(config.showActions);
      }

      if (config.showPre !== undefined) {
        instance.showPre.set(config.showPre);
      }

      if (config.showPost !== undefined) {
        instance.showPost.set(config.showPost);
      }
    });

  const createBoxImage = (config: BoxImageConfig = {}): ComponentFixture<BoxImageHost> =>
    createFixture(BoxImageHost, (instance) => {
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

      if (config.expandedState !== undefined) {
        instance.expandedState.set(config.expandedState);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('box-content', () => {
    it('renders its projected content', () => {
      const fixture = createFixture(BoxContentHost);
      const content = queryByTestId(fixture, 'content');

      expect(content.querySelector('[data-testid="content-child"]')).not.toBeNull();
    });

    it('remains visible when the box is not expandable', () => {
      const fixture = createFixture(BoxContentHost);
      const content = queryByTestId(fixture, 'content');
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-collapsed')).toBeNull();
      expect(getComputedStyle(content).display).not.toBe('none');
    });

    it('remains visible when the box is expandable and expanded', () => {
      const fixture = createFixture(BoxContentHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const content = queryByTestId(fixture, 'content');
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-collapsed')).toBeNull();
      expect(getComputedStyle(content).display).not.toBe('none');
    });

    it('is hidden when the box is expandable and collapsed', async () => {
      const fixture = createFixture(BoxContentHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const content = queryByTestId(fixture, 'content');
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      fixture.componentInstance.expandedState.set('header-only');
      await flush(fixture);

      expect(box.getAttribute('data-collapsed')).toBe('');
      expect(getComputedStyle(content).display).toBe('none');
    });

    it('renders inside the box surface when the box surface is present', () => {
      const fixture = createFixture(BoxContentHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const surface = fixture.nativeElement.querySelector('org-box .box-surface');

      expect(surface).not.toBeNull();
      expect(surface?.querySelector('[data-testid="content"]')).not.toBeNull();
    });

    it('removes the box surface and its content entirely when expandedState is none', async () => {
      const fixture = createFixture(BoxContentHost, (instance) => {
        instance.isExpandable.set(true);
      });

      fixture.componentInstance.expandedState.set('none');
      await flush(fixture);

      expect(fixture.nativeElement.querySelector('org-box .box-surface')).toBeNull();
      expect(fixture.nativeElement.querySelector('[data-testid="content"]')).toBeNull();
    });
  });

  describe('box-header', () => {
    it('renders the title in an h3 by default', () => {
      const fixture = createBoxHeader();
      const header = queryByTestId(fixture, 'header');
      const heading = header.querySelector('h3.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('omits the subtitle when none is provided', () => {
      const fixture = createBoxHeader();
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('.header-subtitle')).toBeNull();
    });

    it('renders the subtitle text when provided', () => {
      const fixture = createBoxHeader({ subtitle: 'A descriptive subtitle.' });
      const header = queryByTestId(fixture, 'header');
      const subtitle = header.querySelector('.header-subtitle') as HTMLElement;

      expect(subtitle.textContent?.trim()).toBe('A descriptive subtitle.');
    });

    it('does not render the heading when the title is empty', () => {
      const fixture = createFixture(BoxHeaderHost, (instance) => {
        instance.title.set(undefined);
      });
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('.header-title')).toBeNull();
    });

    it('renders an h1 when the heading level is 1', () => {
      const fixture = createBoxHeader({ headingLevel: 1 });
      const header = queryByTestId(fixture, 'header');
      const heading = header.querySelector('h1.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('renders an h6 when the heading level is 6', () => {
      const fixture = createBoxHeader({ headingLevel: 6 });
      const header = queryByTestId(fixture, 'header');
      const heading = header.querySelector('h6.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('applies data-actions-only when there is no title or subtitle', () => {
      const fixture = createFixture(BoxHeaderActionsOnlyHost);
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-actions-only')).toBe('');
    });

    it('omits data-actions-only when a title is provided', async () => {
      const fixture = createFixture(BoxHeaderActionsOnlyHost);
      const header = queryByTestId(fixture, 'header');

      fixture.componentInstance.title.set('A title');
      await flush(fixture);

      expect(header.getAttribute('data-actions-only')).toBeNull();
    });

    it('applies data-expandable when the parent box is expandable', () => {
      const fixture = createBoxHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-expandable')).toBe('');
    });

    it('renders the toggle with a chevron labeled Collapse when expanded', () => {
      const fixture = createBoxHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');
      const toggle = header.querySelector('.header-title-row') as HTMLElement;

      expect(toggle).not.toBeNull();
      expect(toggle.querySelector('h3.header-title')?.textContent?.trim()).toBe('Project settings');

      const indicatorButton = toggle.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Collapse');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('switches the indicator to Expand when collapsed', async () => {
      const fixture = createBoxHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');

      fixture.componentInstance.expandedState.set('header-only');
      await flush(fixture);

      const indicatorButton = header.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Expand');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles the expanded state when the toggle is clicked', async () => {
      const fixture = createBoxHeader({ isExpandable: true });
      const header = queryByTestId(fixture, 'header');
      const toggle = header.querySelector('.header-title-row') as HTMLElement;

      const indicatorButton = (): HTMLButtonElement =>
        header.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton().getAttribute('aria-expanded')).toBe('true');

      await userEvent.click(toggle);

      await waitFor(() => expect(indicatorButton().getAttribute('aria-expanded')).toBe('false'));
    });

    it('projects elements with the actions attribute into the header', () => {
      const fixture = createBoxHeader({ showActions: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('[data-testid="action-button"]')).not.toBeNull();
    });

    it('projects elements with the pre attribute into the header', () => {
      const fixture = createBoxHeader({ showPre: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('[data-testid="pre-content"]')).not.toBeNull();
    });

    it('projects elements with the post attribute into the header', () => {
      const fixture = createBoxHeader({ showPost: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('[data-testid="post-content"]')).not.toBeNull();
    });

    it('does not render a divider by default', () => {
      const fixture = createBoxHeader();
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('org-divider')).toBeNull();
    });

    it('renders a divider with no padding when hasDivider is true', () => {
      const fixture = createBoxHeader({ hasDivider: true });
      const header = queryByTestId(fixture, 'header');
      const divider = header.querySelector('org-divider') as HTMLElement;

      expect(divider).not.toBeNull();
      expect(divider.getAttribute('data-padding')).toBe('none');
    });

    it('toggles the divider when hasDivider changes', async () => {
      const fixture = createBoxHeader({ hasDivider: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.querySelector('org-divider')).not.toBeNull();

      fixture.componentInstance.hasDivider.set(false);
      await flush(fixture);

      expect(header.querySelector('org-divider')).toBeNull();
    });

    it('reflects the default variant on the host', () => {
      const fixture = createBoxHeader();
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-variant')).toBe('default');
    });

    it('reflects the muted variant on the host', () => {
      const fixture = createBoxHeader({ variant: 'muted' });
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-variant')).toBe('muted');
    });

    it('updates the variant when the input changes', async () => {
      const fixture = createBoxHeader();
      const header = queryByTestId(fixture, 'header');

      fixture.componentInstance.variant.set('muted');
      await flush(fixture);

      expect(header.getAttribute('data-variant')).toBe('muted');
    });

    it('omits data-emphasized by default', () => {
      const fixture = createBoxHeader();
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-emphasized')).toBeNull();
    });

    it('applies data-emphasized and uppercases the title visually while leaving the text unchanged', () => {
      const fixture = createBoxHeader({ isEmphasized: true });
      const header = queryByTestId(fixture, 'header');
      const heading = header.querySelector('h3.header-title') as HTMLElement;

      expect(header.getAttribute('data-emphasized')).toBe('');
      // uppercasing is purely visual — the underlying text content stays mixed-case for assistive tech
      expect(heading.textContent?.trim()).toBe('Project settings');
      expect(getComputedStyle(heading).textTransform).toBe('uppercase');
    });

    it('toggles data-emphasized when the input changes', async () => {
      const fixture = createBoxHeader({ isEmphasized: true });
      const header = queryByTestId(fixture, 'header');

      expect(header.getAttribute('data-emphasized')).toBe('');

      fixture.componentInstance.isEmphasized.set(false);
      await flush(fixture);

      expect(header.getAttribute('data-emphasized')).toBeNull();
    });
  });

  describe('box-image', () => {
    it('renders an img with the provided src and alt', () => {
      const fixture = createBoxImage();
      const image = queryByTestId(fixture, 'image');
      const img = image.querySelector('img') as HTMLImageElement;

      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
      expect(img.getAttribute('alt')).toBe('cover photo');
    });

    it('applies the default host attributes in fill mode', () => {
      const fixture = createBoxImage();
      const image = queryByTestId(fixture, 'image');

      expect(image.getAttribute('data-full-width')).toBe('1');
      expect(image.getAttribute('data-mode')).toBe('fill');
      expect(image.getAttribute('data-priority')).toBeNull();
    });

    it('updates the img src when the src input changes', async () => {
      const fixture = createBoxImage();
      const image = queryByTestId(fixture, 'image');

      fixture.componentInstance.src.set('https://example.com/other.png');
      await flush(fixture);

      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toBe('https://example.com/other.png');
    });

    it('updates the img alt when the alt input changes', async () => {
      const fixture = createBoxImage();
      const image = queryByTestId(fixture, 'image');

      fixture.componentInstance.alt.set('a different label');
      await flush(fixture);

      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('a different label');
    });

    it('renders the img with explicit width and height in default mode', () => {
      const fixture = createBoxImage({ width: 200, height: 100, mode: 'default' });
      const image = queryByTestId(fixture, 'image');
      const img = image.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('width')).toBe('200');
      expect(img.getAttribute('height')).toBe('100');
    });

    it('reflects full-width zero, null mode, and priority in the host attributes', () => {
      const fixture = createBoxImage({
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

    it('remains visible on the image when the box is expanded', () => {
      const fixture = createBoxImage({ isExpandable: true });
      const image = queryByTestId(fixture, 'image');
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-collapsed')).toBeNull();
      expect(getComputedStyle(image).display).not.toBe('none');
    });

    it('hides the image when the box is collapsed', async () => {
      const fixture = createBoxImage({ isExpandable: true });
      const image = queryByTestId(fixture, 'image');
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      fixture.componentInstance.expandedState.set('header-only');
      await flush(fixture);

      expect(box.getAttribute('data-collapsed')).toBe('');
      expect(getComputedStyle(image).display).toBe('none');
    });
  });

  describe('box-footer', () => {
    it('applies the default end alignment', () => {
      const fixture = createFixture(BoxFooterHost);
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.getAttribute('data-alignment')).toBe('end');
    });

    it('renders its projected children', () => {
      const fixture = createFixture(BoxFooterHost);
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.querySelector('[data-testid="footer-child"]')).not.toBeNull();
    });

    it('does not render a divider by default', () => {
      const fixture = createFixture(BoxFooterHost);
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.querySelector('org-divider')).toBeNull();
    });

    it('renders a no-padding divider above the button row when hasDivider is true', () => {
      const fixture = createFixture(BoxFooterHost, (instance) => {
        instance.hasDivider.set(true);
      });
      const footer = queryByTestId(fixture, 'footer');
      const divider = footer.querySelector('org-divider') as HTMLElement;
      const actions = footer.querySelector('.footer-actions') as HTMLElement;

      expect(divider).not.toBeNull();
      expect(divider.getAttribute('data-padding')).toBe('none');
      // the divider sits at the top, so it precedes the button row in document order
      expect(divider.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('toggles the divider when hasDivider changes', async () => {
      const fixture = createFixture(BoxFooterHost, (instance) => {
        instance.hasDivider.set(true);
      });
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.querySelector('org-divider')).not.toBeNull();

      fixture.componentInstance.hasDivider.set(false);
      await flush(fixture);

      expect(footer.querySelector('org-divider')).toBeNull();
    });

    it('reflects the alignment input', () => {
      const fixture = createFixture(BoxFooterHost, (instance) => {
        instance.alignment.set('start');
      });
      const footer = queryByTestId(fixture, 'footer');

      expect(footer.getAttribute('data-alignment')).toBe('start');
    });

    it('updates the alignment when the input changes', async () => {
      const fixture = createFixture(BoxFooterHost);
      const footer = queryByTestId(fixture, 'footer');

      fixture.componentInstance.alignment.set('start');
      await flush(fixture);
      expect(footer.getAttribute('data-alignment')).toBe('start');

      fixture.componentInstance.alignment.set('center');
      await flush(fixture);
      expect(footer.getAttribute('data-alignment')).toBe('center');
    });

    it('remains visible on the footer when the box is expanded', () => {
      const fixture = createFixture(BoxFooterHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const footer = queryByTestId(fixture, 'footer');
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-collapsed')).toBeNull();
      expect(getComputedStyle(footer).display).not.toBe('none');
    });

    it('hides the footer when the box is collapsed', async () => {
      const fixture = createFixture(BoxFooterHost, (instance) => {
        instance.isExpandable.set(true);
      });
      const footer = queryByTestId(fixture, 'footer');
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      fixture.componentInstance.expandedState.set('header-only');
      await flush(fixture);

      expect(box.getAttribute('data-collapsed')).toBe('');
      expect(getComputedStyle(footer).display).toBe('none');
    });
  });

  describe('box-outer-header', () => {
    it('renders the outer header title in an h3 by default', () => {
      const fixture = createFixture(BoxOuterHeaderHost);
      const header = queryByTestId(fixture, 'outer-header');
      const heading = header.querySelector('h3.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('projects the outer header outside the box surface', () => {
      const fixture = createFixture(BoxOuterHeaderHost);
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;
      const surface = box.querySelector('.box-surface');

      expect(box.querySelector('[data-testid="outer-header"]')).not.toBeNull();
      expect(surface?.querySelector('[data-testid="outer-header"]')).toBeNull();
    });

    it('renders the outer toggle labeled Collapse with aria-expanded true when full', () => {
      const fixture = createFixture(BoxOuterHeaderHost);
      const header = queryByTestId(fixture, 'outer-header');
      const indicatorButton = header.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Collapse');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('removes the box surface but keeps the outer header when toggled to none', async () => {
      const fixture = createFixture(BoxOuterHeaderHost);
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;
      const toggle = queryByTestId(fixture, 'outer-header').querySelector('.header-title-row') as HTMLElement;

      await userEvent.click(toggle);
      await waitFor(() => expect(box.querySelector('.box-surface')).toBeNull());

      const outerHeader = box.querySelector('[data-testid="outer-header"]');
      const indicatorButton = outerHeader?.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(outerHeader).not.toBeNull();
      expect(box.querySelector('[data-testid="outer-content"]')).toBeNull();
      expect(indicatorButton.getAttribute('aria-label')).toBe('Expand');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('restores the box surface when toggled back from none', async () => {
      const fixture = createFixture(BoxOuterHeaderHost, (instance) => {
        instance.expandedState.set('none');
      });
      const box = fixture.nativeElement.querySelector('org-box') as HTMLElement;

      expect(box.querySelector('.box-surface')).toBeNull();

      const toggle = queryByTestId(fixture, 'outer-header').querySelector('.header-title-row') as HTMLElement;

      await userEvent.click(toggle);

      await waitFor(() => expect(box.querySelector('.box-surface')).not.toBeNull());
      expect(box.querySelector('[data-testid="outer-content"]')).not.toBeNull();
    });

    it('projects elements with the actions attribute into the outer header', () => {
      const fixture = createFixture(BoxOuterHeaderHost, (instance) => {
        instance.showActions.set(true);
      });
      const header = queryByTestId(fixture, 'outer-header');

      expect(header.querySelector('[data-testid="outer-action-button"]')).not.toBeNull();
    });

    it('projects elements with the pre attribute into the outer header', () => {
      const fixture = createFixture(BoxOuterHeaderHost, (instance) => {
        instance.showPre.set(true);
      });
      const header = queryByTestId(fixture, 'outer-header');

      expect(header.querySelector('[data-testid="outer-pre-content"]')).not.toBeNull();
    });

    it('projects elements with the post attribute into the outer header', () => {
      const fixture = createFixture(BoxOuterHeaderHost, (instance) => {
        instance.showPost.set(true);
      });
      const header = queryByTestId(fixture, 'outer-header');

      expect(header.querySelector('[data-testid="outer-post-content"]')).not.toBeNull();
    });
  });

  describe('padding application', () => {
    const paddingLeftOf = (element: Element): number => parseFloat(getComputedStyle(element).paddingLeft);
    const paddingBottomOf = (element: Element): number => parseFloat(getComputedStyle(element).paddingBottom);

    it('pads the box surface and not the header content in container mode', () => {
      const fixture = createFixture(BoxPaddingApplicationHost);
      const surface = fixture.nativeElement.querySelector('.box-surface') as HTMLElement;
      const headerTitles = queryByTestId(fixture, 'pa-header').querySelector('.header-titles') as HTMLElement;

      expect(paddingLeftOf(surface)).toBeGreaterThan(0);
      expect(paddingLeftOf(headerTitles)).toBe(0);
    });

    it('moves the padding off the surface and onto the region content in inner-items mode', () => {
      const fixture = createFixture(BoxPaddingApplicationHost, (instance) => {
        instance.paddingApplication.set('inner-items');
      });
      const surface = fixture.nativeElement.querySelector('.box-surface') as HTMLElement;
      const headerTitles = queryByTestId(fixture, 'pa-header').querySelector('.header-titles') as HTMLElement;

      expect(paddingLeftOf(surface)).toBe(0);
      expect(paddingLeftOf(headerTitles)).toBeGreaterThan(0);
    });

    it('insets a constrained image but bleeds a full-width image in inner-items mode', () => {
      const fixture = createFixture(BoxPaddingApplicationHost, (instance) => {
        instance.paddingApplication.set('inner-items');
      });
      const insetImage = queryByTestId(fixture, 'pa-image-inset');
      const fullImage = queryByTestId(fixture, 'pa-image-full');

      expect(paddingLeftOf(insetImage)).toBeGreaterThan(0);
      expect(paddingLeftOf(fullImage)).toBe(0);
    });

    it('gives the collapsed header trailing padding in inner-items mode', async () => {
      const fixture = createFixture(BoxPaddingApplicationHost, (instance) => {
        instance.paddingApplication.set('inner-items');
        instance.isExpandable.set(true);
      });
      const header = queryByTestId(fixture, 'pa-header');

      fixture.componentInstance.expandedState.set('header-only');
      await flush(fixture);

      expect(paddingBottomOf(header)).toBeGreaterThan(0);
    });
  });
});
