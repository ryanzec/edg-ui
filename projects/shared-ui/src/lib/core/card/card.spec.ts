import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import { Card } from './card';
import { CardContent } from './card-content';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';
import { CardImage } from './card-image';

describe('Card', () => {
  describe('host attributes — defaults', () => {
    @Component({
      selector: 'test-card-defaults-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card],
      template: `<org-card data-testid="card" />`,
    })
    class CardDefaultsHost {}

    let fixture: ComponentFixture<CardDefaultsHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardDefaultsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardDefaultsHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default boxBorder and boxBackground attributes', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="card"]') as HTMLElement;

      expect(host.getAttribute('data-box-border')).toBe('bordered');
      expect(host.getAttribute('data-box-background')).toBe('colored');
    });

    it('omits data-color when no color input is provided', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="card"]') as HTMLElement;

      expect(host.getAttribute('data-color')).toBeNull();
    });
  });

  describe('host attributes — driven by inputs', () => {
    @Component({
      selector: 'test-card-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card],
      template: `
        <org-card [color]="color()" [boxBorder]="boxBorder()" [boxBackground]="boxBackground()" data-testid="card" />
      `,
    })
    class CardAttrsHost {
      public readonly color = signal<'primary' | 'danger' | undefined>('primary');
      public readonly boxBorder = signal<'bordered' | 'border-thick' | 'borderless'>('border-thick');
      public readonly boxBackground = signal<'colored' | 'colorless'>('colorless');
    }

    let fixture: ComponentFixture<CardAttrsHost>;
    let component: CardAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the color, boxBorder, and boxBackground inputs on the host', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="card"]') as HTMLElement;

      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-box-border')).toBe('border-thick');
      expect(host.getAttribute('data-box-background')).toBe('colorless');
    });

    it('updates the data-color attribute when the color input changes', async () => {
      component.color.set('danger');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="card"]') as HTMLElement;

      expect(host.getAttribute('data-color')).toBe('danger');
    });
  });

  describe('forwarding to inner org-box', () => {
    @Component({
      selector: 'test-card-box-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card],
      template: `
        <org-card
          color="info"
          boxBorder="border-emphasize"
          boxBackground="colorless"
          boxPadding="lg"
          containerClass="extra-class"
          data-testid="card"
        />
      `,
    })
    class CardBoxHost {}

    let fixture: ComponentFixture<CardBoxHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardBoxHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardBoxHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('forwards color, border, background, and padding inputs to the inner org-box', () => {
      const box = fixture.nativeElement.querySelector('[data-testid="card"] org-box') as HTMLElement;

      expect(box.getAttribute('data-color')).toBe('info');
      expect(box.getAttribute('data-border')).toBe('border-emphasize');
      expect(box.getAttribute('data-background')).toBe('colorless');
      expect(box.getAttribute('data-padding')).toBe('lg');
    });

    it('applies the containerClass input to the inner org-box element', () => {
      const box = fixture.nativeElement.querySelector('[data-testid="card"] org-box') as HTMLElement;

      expect(box.classList.contains('extra-class')).toBe(true);
    });
  });

  describe('content projection', () => {
    @Component({
      selector: 'test-card-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card],
      template: `
        <org-card data-testid="card">
          <span data-testid="projected">projected content</span>
        </org-card>
      `,
    })
    class CardProjectionHost {}

    it('projects children into the inner org-box', async () => {
      await TestBed.configureTestingModule({
        imports: [CardProjectionHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(CardProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const box = fixture.nativeElement.querySelector('[data-testid="card"] org-box') as HTMLElement;

      expect(box.querySelector('[data-testid="projected"]')).not.toBeNull();
    });
  });

  describe('clickable forwarding', () => {
    @Component({
      selector: 'test-card-clickable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card],
      template: `
        <org-card (clicked)="onClicked()" data-testid="clickable" />
        <org-card data-testid="static" />
      `,
    })
    class CardClickableHost {
      public onClicked = vi.fn();
    }

    let fixture: ComponentFixture<CardClickableHost>;
    let component: CardClickableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardClickableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardClickableHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not mark the inner box clickable when no clicked listener is bound', () => {
      const box = fixture.nativeElement.querySelector('[data-testid="static"] org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBeNull();
      expect(box.getAttribute('tabindex')).toBeNull();
      expect(box.getAttribute('data-clickable')).toBeNull();
    });

    it('flips the inner box into clickable mode when a clicked listener is bound', () => {
      const box = fixture.nativeElement.querySelector('[data-testid="clickable"] org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBe('button');
      expect(box.getAttribute('tabindex')).toBe('0');
      expect(box.getAttribute('data-clickable')).toBe('');
    });

    it('emits clicked when the inner box is clicked', () => {
      const box = fixture.nativeElement.querySelector('[data-testid="clickable"] org-box') as HTMLElement;

      box.click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });
  });

  describe('clickable forwarding in expandable mode', () => {
    @Component({
      selector: 'test-card-expandable-clickable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card],
      template: `<org-card [isExpandable]="true" (clicked)="onClicked()" data-testid="card" />`,
    })
    class CardExpandableClickableHost {
      public onClicked = vi.fn();
    }

    let fixture: ComponentFixture<CardExpandableClickableHost>;
    let component: CardExpandableClickableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardExpandableClickableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardExpandableClickableHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not flip the inner box into clickable mode when expandable', () => {
      const box = fixture.nativeElement.querySelector('[data-testid="card"] org-box') as HTMLElement;

      expect(box.getAttribute('role')).toBeNull();
      expect(box.getAttribute('data-clickable')).toBeNull();
    });

    it('does not emit clicked when the inner box is clicked in expandable mode', () => {
      const box = fixture.nativeElement.querySelector('[data-testid="card"] org-box') as HTMLElement;

      box.click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });
});

describe('CardContent', () => {
  describe('default rendering', () => {
    @Component({
      selector: 'test-card-content-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardContent],
      template: `
        <org-card>
          <org-card-content data-testid="content">
            <span data-testid="content-child">body</span>
          </org-card-content>
        </org-card>
      `,
    })
    class CardContentHost {}

    let fixture: ComponentFixture<CardContentHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardContentHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardContentHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the projected content', () => {
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      expect(content.querySelector('[data-testid="content-child"]')).not.toBeNull();
    });

    it('does not apply data-hidden when the card is not expandable', () => {
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      expect(content.getAttribute('data-hidden')).toBeNull();
    });
  });

  describe('expandable visibility', () => {
    @Component({
      selector: 'test-card-content-expandable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardContent],
      template: `
        <org-card [isExpandable]="true" [(isExpanded)]="isExpanded">
          <org-card-content data-testid="content">body</org-card-content>
        </org-card>
      `,
    })
    class CardContentExpandableHost {
      public readonly isExpanded = signal<boolean>(true);
    }

    let fixture: ComponentFixture<CardContentExpandableHost>;
    let component: CardContentExpandableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardContentExpandableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardContentExpandableHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not apply data-hidden when expandable and expanded', () => {
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      expect(content.getAttribute('data-hidden')).toBeNull();
    });

    it('applies data-hidden when expandable and collapsed', async () => {
      component.isExpanded.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      expect(content.getAttribute('data-hidden')).toBe('');
    });
  });
});

describe('CardHeader', () => {
  describe('title and subtitle rendering', () => {
    @Component({
      selector: 'test-card-header-title-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardHeader],
      template: `
        <org-card>
          <org-card-header [title]="title()" [subtitle]="subtitle()" data-testid="header" />
        </org-card>
      `,
    })
    class CardHeaderTitleHost {
      public readonly title = signal<string | undefined>('Project settings');
      public readonly subtitle = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<CardHeaderTitleHost>;
    let component: CardHeaderTitleHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeaderTitleHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeaderTitleHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the title inside an h3 element by default', () => {
      const heading = fixture.nativeElement.querySelector('[data-testid="header"] h3.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Project settings');
    });

    it('does not render the subtitle when not provided', () => {
      const subtitle = fixture.nativeElement.querySelector('[data-testid="header"] .header-subtitle');

      expect(subtitle).toBeNull();
    });

    it('renders the subtitle text when provided', async () => {
      component.subtitle.set('Configuration shared across every environment.');
      fixture.detectChanges();
      await fixture.whenStable();

      const subtitle = fixture.nativeElement.querySelector('[data-testid="header"] .header-subtitle') as HTMLElement;

      expect(subtitle.textContent?.trim()).toBe('Configuration shared across every environment.');
    });

    it('does not render a heading element when the title is empty', async () => {
      component.title.set(undefined);
      fixture.detectChanges();
      await fixture.whenStable();

      const header = fixture.nativeElement.querySelector('[data-testid="header"]') as HTMLElement;

      expect(header.querySelector('.header-title')).toBeNull();
    });
  });

  describe('heading level via brain directive', () => {
    @Component({
      selector: 'test-card-header-level-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardHeader],
      template: `
        <org-card>
          <org-card-header title="Title" [headingLevel]="headingLevel()" data-testid="header" />
        </org-card>
      `,
    })
    class CardHeaderLevelHost {
      public readonly headingLevel = signal<number>(1);
    }

    let fixture: ComponentFixture<CardHeaderLevelHost>;
    let component: CardHeaderLevelHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeaderLevelHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeaderLevelHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the title in an h1 when headingLevel is 1', () => {
      const heading = fixture.nativeElement.querySelector('[data-testid="header"] h1.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Title');
    });

    it('renders the title in an h6 when headingLevel is 6', async () => {
      component.headingLevel.set(6);
      fixture.detectChanges();
      await fixture.whenStable();

      const heading = fixture.nativeElement.querySelector('[data-testid="header"] h6.header-title') as HTMLElement;

      expect(heading).not.toBeNull();
      expect(heading.textContent?.trim()).toBe('Title');
    });
  });

  describe('actions-only mode', () => {
    @Component({
      selector: 'test-card-header-actions-only-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardHeader],
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

    let fixture: ComponentFixture<CardHeaderActionsOnlyHost>;
    let component: CardHeaderActionsOnlyHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeaderActionsOnlyHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeaderActionsOnlyHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies data-actions-only when no title or subtitle is provided', () => {
      const header = fixture.nativeElement.querySelector('[data-testid="header"]') as HTMLElement;

      expect(header.getAttribute('data-actions-only')).toBe('');
    });

    it('omits data-actions-only when a title is provided', async () => {
      component.title.set('a title');
      fixture.detectChanges();
      await fixture.whenStable();

      const header = fixture.nativeElement.querySelector('[data-testid="header"]') as HTMLElement;

      expect(header.getAttribute('data-actions-only')).toBeNull();
    });
  });

  describe('expandable mode', () => {
    @Component({
      selector: 'test-card-header-expandable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardHeader],
      template: `
        <org-card [isExpandable]="true" [(isExpanded)]="isExpanded">
          <org-card-header title="Expandable title" data-testid="header" />
        </org-card>
      `,
    })
    class CardHeaderExpandableHost {
      public readonly isExpanded = signal<boolean>(true);
    }

    let fixture: ComponentFixture<CardHeaderExpandableHost>;
    let component: CardHeaderExpandableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeaderExpandableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeaderExpandableHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies data-expandable on the header host when the parent card is expandable', () => {
      const header = fixture.nativeElement.querySelector('[data-testid="header"]') as HTMLElement;

      expect(header.getAttribute('data-expandable')).toBe('');
    });

    it('renders the toggle button containing the title and a chevron indicator labelled Collapse when expanded', () => {
      const header = fixture.nativeElement.querySelector('[data-testid="header"]') as HTMLElement;
      const toggle = header.querySelector('button.header-toggle') as HTMLButtonElement;

      expect(toggle).not.toBeNull();
      expect(toggle.querySelector('h3.header-title')?.textContent?.trim()).toBe('Expandable title');

      const indicatorButton = toggle.querySelector('org-button.header-toggle-icon button') as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Collapse');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('switches the chevron indicator label to Expand and aria-expanded to false when collapsed', async () => {
      component.isExpanded.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      const indicatorButton = fixture.nativeElement.querySelector(
        '[data-testid="header"] org-button.header-toggle-icon button'
      ) as HTMLButtonElement;

      expect(indicatorButton.getAttribute('aria-label')).toBe('Expand');
      expect(indicatorButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles isExpanded when the toggle button is clicked', () => {
      const toggle = fixture.nativeElement.querySelector(
        '[data-testid="header"] button.header-toggle'
      ) as HTMLButtonElement;

      toggle.click();

      expect(component.isExpanded()).toBe(false);
    });
  });

  describe('actions projection', () => {
    @Component({
      selector: 'test-card-header-actions-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardHeader],
      template: `
        <org-card>
          <org-card-header title="Title" data-testid="header">
            <button actions data-testid="action-button" type="button">Act</button>
          </org-card-header>
        </org-card>
      `,
    })
    class CardHeaderActionsHost {}

    it('projects elements marked with the actions attribute selector into the header', async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeaderActionsHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(CardHeaderActionsHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const header = fixture.nativeElement.querySelector('[data-testid="header"]') as HTMLElement;

      expect(header.querySelector('[data-testid="action-button"]')).not.toBeNull();
    });
  });
});

describe('CardImage', () => {
  describe('fill mode rendering (default)', () => {
    @Component({
      selector: 'test-card-image-fill-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardImage],
      template: `
        <org-card>
          <org-card-image src="https://example.com/img.png" alt="cover photo" data-testid="image" />
        </org-card>
      `,
    })
    class CardImageFillHost {}

    let fixture: ComponentFixture<CardImageFillHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardImageFillHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardImageFillHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders an img element with the src and alt forwarded from the brain', () => {
      const img = fixture.nativeElement.querySelector('[data-testid="image"] img') as HTMLImageElement;

      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
      expect(img.getAttribute('alt')).toBe('cover photo');
    });

    it('applies the default data-full-width="1", data-mode="fill" and omits data-priority host attributes', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="image"]') as HTMLElement;

      expect(host.getAttribute('data-full-width')).toBe('1');
      expect(host.getAttribute('data-mode')).toBe('fill');
      expect(host.getAttribute('data-priority')).toBeNull();
    });
  });

  describe('default mode rendering', () => {
    @Component({
      selector: 'test-card-image-default-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardImage],
      template: `
        <org-card>
          <org-card-image
            mode="default"
            src="https://example.com/img.png"
            alt="cover"
            [width]="200"
            [height]="100"
            [fullWidth]="false"
            [priority]="true"
            data-testid="image"
          />
        </org-card>
      `,
    })
    class CardImageDefaultHost {}

    let fixture: ComponentFixture<CardImageDefaultHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardImageDefaultHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardImageDefaultHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the img with explicit width and height attributes in default mode', () => {
      const img = fixture.nativeElement.querySelector('[data-testid="image"] img') as HTMLImageElement;

      expect(img.getAttribute('width')).toBe('200');
      expect(img.getAttribute('height')).toBe('100');
    });

    it('reflects fullWidth=false, mode=default, and priority on the host attributes', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="image"]') as HTMLElement;

      expect(host.getAttribute('data-full-width')).toBe('0');
      expect(host.getAttribute('data-mode')).toBeNull();
      expect(host.getAttribute('data-priority')).toBe('');
    });
  });

  describe('expandable visibility', () => {
    @Component({
      selector: 'test-card-image-expandable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardImage],
      template: `
        <org-card [isExpandable]="true" [(isExpanded)]="isExpanded">
          <org-card-image src="https://example.com/img.png" alt="cover" data-testid="image" />
        </org-card>
      `,
    })
    class CardImageExpandableHost {
      public readonly isExpanded = signal<boolean>(true);
    }

    let fixture: ComponentFixture<CardImageExpandableHost>;
    let component: CardImageExpandableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardImageExpandableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardImageExpandableHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not apply data-hidden when the card is expandable and expanded', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="image"]') as HTMLElement;

      expect(host.getAttribute('data-hidden')).toBeNull();
    });

    it('applies data-hidden when the card is expandable and collapsed', async () => {
      component.isExpanded.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="image"]') as HTMLElement;

      expect(host.getAttribute('data-hidden')).toBe('');
    });
  });
});

describe('CardFooter', () => {
  describe('default alignment and projection', () => {
    @Component({
      selector: 'test-card-footer-default-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardFooter],
      template: `
        <org-card>
          <org-card-footer data-testid="footer">
            <span data-testid="footer-child">action</span>
          </org-card-footer>
        </org-card>
      `,
    })
    class CardFooterDefaultHost {}

    let fixture: ComponentFixture<CardFooterDefaultHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardFooterDefaultHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardFooterDefaultHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default end alignment on the host attribute', () => {
      const footer = fixture.nativeElement.querySelector('[data-testid="footer"]') as HTMLElement;

      expect(footer.getAttribute('data-alignment')).toBe('end');
    });

    it('renders the projected children', () => {
      const footer = fixture.nativeElement.querySelector('[data-testid="footer"]') as HTMLElement;

      expect(footer.querySelector('[data-testid="footer-child"]')).not.toBeNull();
    });
  });

  describe('alignment input', () => {
    @Component({
      selector: 'test-card-footer-alignment-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardFooter],
      template: `
        <org-card>
          <org-card-footer [alignment]="alignment()" data-testid="footer">action</org-card-footer>
        </org-card>
      `,
    })
    class CardFooterAlignmentHost {
      public readonly alignment = signal<'start' | 'center' | 'end'>('start');
    }

    let fixture: ComponentFixture<CardFooterAlignmentHost>;
    let component: CardFooterAlignmentHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardFooterAlignmentHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardFooterAlignmentHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the alignment input on the host data-alignment attribute', () => {
      const footer = fixture.nativeElement.querySelector('[data-testid="footer"]') as HTMLElement;

      expect(footer.getAttribute('data-alignment')).toBe('start');
    });

    it('updates the data-alignment attribute when the input changes', async () => {
      component.alignment.set('center');
      fixture.detectChanges();
      await fixture.whenStable();

      const footer = fixture.nativeElement.querySelector('[data-testid="footer"]') as HTMLElement;

      expect(footer.getAttribute('data-alignment')).toBe('center');
    });
  });

  describe('expandable visibility', () => {
    @Component({
      selector: 'test-card-footer-expandable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Card, CardFooter],
      template: `
        <org-card [isExpandable]="true" [(isExpanded)]="isExpanded">
          <org-card-footer data-testid="footer">action</org-card-footer>
        </org-card>
      `,
    })
    class CardFooterExpandableHost {
      public readonly isExpanded = signal<boolean>(true);
    }

    let fixture: ComponentFixture<CardFooterExpandableHost>;
    let component: CardFooterExpandableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardFooterExpandableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardFooterExpandableHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not apply data-hidden when expandable and expanded', () => {
      const footer = fixture.nativeElement.querySelector('[data-testid="footer"]') as HTMLElement;

      expect(footer.getAttribute('data-hidden')).toBeNull();
    });

    it('applies data-hidden when expandable and collapsed', async () => {
      component.isExpanded.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      const footer = fixture.nativeElement.querySelector('[data-testid="footer"]') as HTMLElement;

      expect(footer.getAttribute('data-hidden')).toBe('');
    });
  });
});
