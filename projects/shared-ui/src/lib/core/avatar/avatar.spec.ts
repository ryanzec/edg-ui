import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import { Avatar } from './avatar';
import { AvatarStack } from './avatar-stack';

describe('Avatar', () => {
  describe('host attributes — defaults', () => {
    @Component({
      selector: 'test-avatar-defaults-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `<org-avatar label="Alice" data-testid="avatar" />`,
    })
    class AvatarDefaultsHost {}

    let fixture: ComponentFixture<AvatarDefaultsHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarDefaultsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarDefaultsHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default size, shape, and a derived color index', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-shape')).toBe('circle');
      expect(host.getAttribute('data-color-index')).toBe('1');
    });

    it('omits data-overflow, data-clickable, and data-disabled when not applicable', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.getAttribute('data-overflow')).toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
    });
  });

  describe('host attributes — driven by inputs', () => {
    @Component({
      selector: 'test-avatar-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `
        <org-avatar
          label="Alice"
          [size]="size()"
          [shape]="shape()"
          [isOverflow]="isOverflow()"
          [disabled]="disabled()"
          data-testid="avatar"
        />
      `,
    })
    class AvatarAttrsHost {
      public readonly size = signal<'sm' | 'base' | 'lg'>('lg');
      public readonly shape = signal<'circle' | 'square'>('square');
      public readonly isOverflow = signal<boolean>(false);
      public readonly disabled = signal<boolean>(false);
    }

    let fixture: ComponentFixture<AvatarAttrsHost>;
    let component: AvatarAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the size and shape inputs on the host', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-shape')).toBe('square');
    });

    it('reflects data-overflow as "true" when the isOverflow input is true', async () => {
      component.isOverflow.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.getAttribute('data-overflow')).toBe('true');
    });

    it('reflects data-disabled as "true" when the disabled input is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.getAttribute('data-disabled')).toBe('true');
    });
  });

  describe('color index derivation', () => {
    @Component({
      selector: 'test-avatar-color-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `<org-avatar [label]="label()" data-testid="avatar" />`,
    })
    class AvatarColorHost {
      public readonly label = signal<string>('A');
    }

    let fixture: ComponentFixture<AvatarColorHost>;
    let component: AvatarColorHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarColorHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarColorHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const readIndex = () =>
      (fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement).getAttribute('data-color-index');

    it('falls back to index 0 for a whitespace-only label', async () => {
      component.label.set('   ');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(readIndex()).toBe('0');
    });

    it('produces different indices for labels starting with different characters', async () => {
      component.label.set('A');
      fixture.detectChanges();
      await fixture.whenStable();
      const aIndex = readIndex();

      component.label.set('B');
      fixture.detectChanges();
      await fixture.whenStable();
      const bIndex = readIndex();

      expect(aIndex).not.toBe(bIndex);
    });

    it('wraps around the 8-color cycle using modulo on the first character code point', async () => {
      component.label.set('A');
      fixture.detectChanges();
      await fixture.whenStable();
      const aIndex = readIndex();

      component.label.set('I');
      fixture.detectChanges();
      await fixture.whenStable();
      const iIndex = readIndex();

      expect(aIndex).toBe(iIndex);
    });
  });

  describe('effective size via avatar stack', () => {
    @Component({
      selector: 'test-avatar-stack-size-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar, AvatarStack],
      template: `
        <org-avatar label="Solo" size="sm" data-testid="solo" />
        <org-avatar-stack [size]="stackSize()" data-testid="stack">
          <org-avatar label="Stacked" size="sm" data-testid="stacked" />
        </org-avatar-stack>
      `,
    })
    class AvatarStackSizeHost {
      public readonly stackSize = signal<'sm' | 'base' | 'lg'>('lg');
    }

    let fixture: ComponentFixture<AvatarStackSizeHost>;
    let component: AvatarStackSizeHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarStackSizeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarStackSizeHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('uses the local size input when no avatar-stack is present', () => {
      const solo = fixture.nativeElement.querySelector('[data-testid="solo"]') as HTMLElement;

      expect(solo.getAttribute('data-size')).toBe('sm');
    });

    it('uses the parent avatar-stack size over the local size when present', () => {
      const stacked = fixture.nativeElement.querySelector('[data-testid="stacked"]') as HTMLElement;

      expect(stacked.getAttribute('data-size')).toBe('lg');
    });

    it('updates the effective size when the stack size changes', async () => {
      component.stackSize.set('base');
      fixture.detectChanges();
      await fixture.whenStable();

      const stacked = fixture.nativeElement.querySelector('[data-testid="stacked"]') as HTMLElement;

      expect(stacked.getAttribute('data-size')).toBe('base');
    });
  });

  describe('overflow rendering', () => {
    @Component({
      selector: 'test-avatar-overflow-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `
        <org-avatar
          label="More"
          [isOverflow]="true"
          [count]="5"
          [hasIndicator]="true"
          [showLabel]="true"
          imgSrc="https://example.com/img.png"
          data-testid="avatar"
        />
      `,
    })
    class AvatarOverflowHost {}

    let fixture: ComponentFixture<AvatarOverflowHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarOverflowHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarOverflowHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the +N count text inside the avatar shape', () => {
      const shape = fixture.nativeElement.querySelector('[data-testid="avatar"] org-avatar-shape') as HTMLElement;

      expect(shape.textContent?.trim()).toBe('+5');
    });

    it('suppresses indicator, image, and label rendering when in overflow mode', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-indicator')).toBeNull();
      expect(host.querySelector('org-avatar-image')).toBeNull();
      expect(host.querySelector('org-avatar-label')).toBeNull();
    });
  });

  describe('image rendering', () => {
    @Component({
      selector: 'test-avatar-image-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: ` <org-avatar label="Alice" [imgSrc]="imgSrc()" [imgEmail]="imgEmail()" data-testid="avatar" /> `,
    })
    class AvatarImageHost {
      public readonly imgSrc = signal<string | undefined>(undefined);
      public readonly imgEmail = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<AvatarImageHost>;
    let component: AvatarImageHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarImageHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarImageHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render the avatar image when neither imgSrc nor imgEmail is provided', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-avatar-image')).toBeNull();
    });

    it('renders the avatar image when imgSrc is provided', async () => {
      component.imgSrc.set('https://example.com/img.png');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-avatar-image')).not.toBeNull();
    });

    it('renders the avatar image when imgEmail is provided', async () => {
      component.imgEmail.set('alice@example.com');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-avatar-image')).not.toBeNull();
    });
  });

  describe('indicator rendering', () => {
    @Component({
      selector: 'test-avatar-indicator-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `<org-avatar label="Alice" [hasIndicator]="hasIndicator()" data-testid="avatar" />`,
    })
    class AvatarIndicatorHost {
      public readonly hasIndicator = signal<boolean>(false);
    }

    let fixture: ComponentFixture<AvatarIndicatorHost>;
    let component: AvatarIndicatorHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarIndicatorHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarIndicatorHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render the indicator by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-indicator')).toBeNull();
    });

    it('renders the indicator when hasIndicator is true', async () => {
      component.hasIndicator.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-indicator')).not.toBeNull();
    });
  });

  describe('label rendering', () => {
    @Component({
      selector: 'test-avatar-label-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `<org-avatar label="Alice Smith" [showLabel]="showLabel()" data-testid="avatar" />`,
    })
    class AvatarLabelToggleHost {
      public readonly showLabel = signal<boolean>(false);
    }

    let fixture: ComponentFixture<AvatarLabelToggleHost>;
    let component: AvatarLabelToggleHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarLabelToggleHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarLabelToggleHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render the avatar label by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-avatar-label')).toBeNull();
    });

    it('renders the avatar label when showLabel is true', async () => {
      component.showLabel.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('org-avatar-label')).not.toBeNull();
    });
  });

  describe('clickable button rendering', () => {
    @Component({
      selector: 'test-avatar-clickable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `
        <org-avatar label="Alice" [disabled]="disabled()" (clicked)="onClicked()" data-testid="clickable" />
        <org-avatar label="Bob" data-testid="static" />
      `,
    })
    class AvatarClickableHost {
      public readonly disabled = signal<boolean>(false);
      public onClicked = vi.fn();
    }

    let fixture: ComponentFixture<AvatarClickableHost>;
    let component: AvatarClickableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarClickableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarClickableHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders an inner button with the label as aria-label when a clicked listener is bound', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="clickable"]') as HTMLElement;
      const button = host.querySelector('button');

      expect(button).not.toBeNull();
      expect(button?.getAttribute('aria-label')).toBe('Alice');
      expect(host.getAttribute('data-clickable')).toBe('true');
    });

    it('renders a span instead of a button when no clicked listener is bound', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="static"]') as HTMLElement;

      expect(host.querySelector('button')).toBeNull();
      expect(host.querySelector(':scope > span')).not.toBeNull();
      expect(host.getAttribute('data-clickable')).toBeNull();
    });

    it('emits clicked when the inner button is clicked', () => {
      const button = fixture.nativeElement.querySelector('[data-testid="clickable"] button') as HTMLButtonElement;

      button.click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('disables the inner button when the disabled input is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector('[data-testid="clickable"] button') as HTMLButtonElement;

      expect(button.disabled).toBe(true);
    });

    it('does not emit clicked when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector('[data-testid="clickable"] button') as HTMLButtonElement;
      button.click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });
});

describe('AvatarImage', () => {
  describe('effectiveAlt', () => {
    @Component({
      selector: 'test-avatar-image-alt-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `
        <org-avatar label="Alice Smith" imgSrc="https://example.com/img.png" [imgAlt]="imgAlt()" data-testid="avatar" />
      `,
    })
    class AvatarImageAltHost {
      public readonly imgAlt = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<AvatarImageAltHost>;
    let component: AvatarImageAltHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarImageAltHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarImageAltHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('falls back to the parent avatar label when imgAlt is not provided', () => {
      const img = fixture.nativeElement.querySelector('[data-testid="avatar"] img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('Alice Smith');
    });

    it('uses the explicit imgAlt input when provided', async () => {
      component.imgAlt.set('custom alt');
      fixture.detectChanges();
      await fixture.whenStable();

      const img = fixture.nativeElement.querySelector('[data-testid="avatar"] img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('custom alt');
    });
  });

  describe('rendering', () => {
    @Component({
      selector: 'test-avatar-image-render-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `<org-avatar label="Alice" [imgSrc]="imgSrc()" data-testid="avatar" />`,
    })
    class AvatarImageRenderHost {
      public readonly imgSrc = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<AvatarImageRenderHost>;
    let component: AvatarImageRenderHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarImageRenderHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarImageRenderHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render an <img> when no source is available', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="avatar"]') as HTMLElement;

      expect(host.querySelector('img')).toBeNull();
    });

    it('renders the <img> with the provided src when imgSrc is set', async () => {
      component.imgSrc.set('https://example.com/img.png');
      fixture.detectChanges();
      await fixture.whenStable();

      const img = fixture.nativeElement.querySelector('[data-testid="avatar"] img') as HTMLImageElement;

      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
    });
  });
});

describe('AvatarLabel', () => {
  @Component({
    selector: 'test-avatar-label-content-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Avatar],
    template: ` <org-avatar [label]="label()" [subLabel]="subLabel()" [showLabel]="true" data-testid="avatar" /> `,
  })
  class AvatarLabelContentHost {
    public readonly label = signal<string>('Alice Smith');
    public readonly subLabel = signal<string | undefined>(undefined);
  }

  let fixture: ComponentFixture<AvatarLabelContentHost>;
  let component: AvatarLabelContentHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarLabelContentHost],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarLabelContentHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the main label text from the parent avatar brain', () => {
    const main = fixture.nativeElement.querySelector('[data-testid="avatar"] org-avatar-label .label') as HTMLElement;

    expect(main.textContent?.trim()).toBe('Alice Smith');
  });

  it('does not render the sub-label when not provided', () => {
    const subLabel = fixture.nativeElement.querySelector('[data-testid="avatar"] org-avatar-label .sub-label');

    expect(subLabel).toBeNull();
  });

  it('renders the sub-label text when provided', async () => {
    component.subLabel.set('Engineer');
    fixture.detectChanges();
    await fixture.whenStable();

    const subLabel = fixture.nativeElement.querySelector(
      '[data-testid="avatar"] org-avatar-label .sub-label'
    ) as HTMLElement;

    expect(subLabel.textContent?.trim()).toBe('Engineer');
  });
});

describe('AvatarShape', () => {
  describe('initials rendering', () => {
    @Component({
      selector: 'test-avatar-shape-initials-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: `<org-avatar [label]="label()" [isOverflow]="isOverflow()" data-testid="avatar" />`,
    })
    class AvatarShapeInitialsHost {
      public readonly label = signal<string>('Alice Smith');
      public readonly isOverflow = signal<boolean>(false);
    }

    let fixture: ComponentFixture<AvatarShapeInitialsHost>;
    let component: AvatarShapeInitialsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarShapeInitialsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarShapeInitialsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const readInitials = () =>
      (
        fixture.nativeElement.querySelector('[data-testid="avatar"] org-avatar-shape span') as HTMLElement | null
      )?.textContent?.trim();

    it('renders the derived initials text when the label has content', () => {
      expect(readInitials()).toBe('AS');
    });

    it('does not render the initials span when the label is empty', async () => {
      component.label.set('');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(readInitials()).toBeUndefined();
    });

    it('does not render the initials span when in overflow mode', async () => {
      component.isOverflow.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const span = fixture.nativeElement.querySelector(
        '[data-testid="avatar"] org-avatar-shape span:not([class~="absolute"])'
      ) as HTMLElement | null;

      const initials = fixture.nativeElement.querySelector('[data-testid="avatar"] org-avatar-shape span.absolute');

      expect(initials).toBeNull();
      expect(span).toBeNull();
    });
  });

  describe('content projection', () => {
    @Component({
      selector: 'test-avatar-shape-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Avatar],
      template: ` <org-avatar label="Many" [isOverflow]="true" [count]="12" data-testid="avatar" /> `,
    })
    class AvatarShapeProjectionHost {}

    it('projects content into the avatar shape', async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarShapeProjectionHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(AvatarShapeProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const shape = fixture.nativeElement.querySelector('[data-testid="avatar"] org-avatar-shape') as HTMLElement;

      expect(shape.textContent?.trim()).toBe('+12');
    });
  });
});

describe('AvatarStack', () => {
  describe('host attribute', () => {
    @Component({
      selector: 'test-avatar-stack-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AvatarStack, Avatar],
      template: `
        <org-avatar-stack [size]="size()" data-testid="stack">
          <org-avatar label="Alice" />
          <org-avatar label="Bob" />
        </org-avatar-stack>
      `,
    })
    class AvatarStackTestHost {
      public readonly size = signal<'sm' | 'base' | 'lg'>('sm');
    }

    let fixture: ComponentFixture<AvatarStackTestHost>;
    let component: AvatarStackTestHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarStackTestHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AvatarStackTestHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the size input on the host data-size attribute', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="stack"]') as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('sm');
    });

    it('updates the data-size attribute when the size input changes', async () => {
      component.size.set('lg');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="stack"]') as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('lg');
    });

    it('projects child avatars into the stack', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="stack"]') as HTMLElement;

      expect(host.querySelectorAll('org-avatar').length).toBe(2);
    });
  });
});
