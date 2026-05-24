import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Avatar, type AvatarShapeVariant, type AvatarSize } from './avatar';
import { AvatarStack, type AvatarStackSize } from './avatar-stack';

@Component({
  selector: 'story-avatar-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar],
  host: { class: 'block' },
  template: `
    <org-avatar
      data-testid="avatar"
      [label]="label()"
      [size]="size()"
      [shape]="shape()"
      [disabled]="disabled()"
      [isOverflow]="isOverflow()"
      [count]="count()"
      [hasIndicator]="hasIndicator()"
      [showLabel]="showLabel()"
      [subLabel]="subLabel()"
      [imgSrc]="imgSrc()"
      [imgEmail]="imgEmail()"
      [imgAlt]="imgAlt()"
      (clicked)="handleClicked()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-label-bob" (click)="label.set('Bob')">label-bob</button>
      <button type="button" data-testid="ctl-label-iris" (click)="label.set('Iris')">label-iris</button>
      <button type="button" data-testid="ctl-label-blank" (click)="label.set('   ')">label-blank</button>
      <button type="button" data-testid="ctl-label-empty" (click)="label.set('')">label-empty</button>
      <button type="button" data-testid="ctl-label-alpha" (click)="label.set('alpha')">label-alpha</button>
      <button type="button" data-testid="ctl-label-alice-smith" (click)="label.set('Alice Smith')">
        label-alice-smith
      </button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-shape-square" (click)="shape.set('square')">shape-square</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-overflow-on" (click)="isOverflow.set(true)">overflow-on</button>
      <button type="button" data-testid="ctl-count-12" (click)="count.set(12)">count-12</button>
      <button type="button" data-testid="ctl-show-label-on" (click)="showLabel.set(true)">show-label-on</button>
      <button type="button" data-testid="ctl-has-indicator-on" (click)="hasIndicator.set(true)">indicator-on</button>
      <button type="button" data-testid="ctl-sub-label-set" (click)="subLabel.set('Engineer')">sub-label-set</button>
      <button type="button" data-testid="ctl-img-src-set" (click)="imgSrc.set('https://example.com/img.png')">
        img-src-set
      </button>
      <button type="button" data-testid="ctl-img-src-other" (click)="imgSrc.set('https://example.com/other.png')">
        img-src-other
      </button>
      <button type="button" data-testid="ctl-img-src-clear" (click)="imgSrc.set(undefined)">img-src-clear</button>
      <button type="button" data-testid="ctl-img-email-alice" (click)="imgEmail.set('alice@example.com')">
        img-email-alice
      </button>
      <button type="button" data-testid="ctl-img-email-bob" (click)="imgEmail.set('bob@example.com')">
        img-email-bob
      </button>
      <button type="button" data-testid="ctl-img-email-clear" (click)="imgEmail.set(undefined)">img-email-clear</button>
      <button type="button" data-testid="ctl-img-alt-custom" (click)="imgAlt.set('custom alt')">img-alt-custom</button>
      <button type="button" data-testid="ctl-img-alt-null" (click)="imgAlt.set(null)">img-alt-null</button>
    </div>
  `,
})
class StoryAvatarTestsShell {
  protected readonly label = signal<string>('Alice');
  protected readonly size = signal<AvatarSize>('base');
  protected readonly shape = signal<AvatarShapeVariant>('circle');
  protected readonly disabled = signal<boolean>(false);
  protected readonly isOverflow = signal<boolean>(false);
  protected readonly count = signal<number>(5);
  protected readonly hasIndicator = signal<boolean>(false);
  protected readonly showLabel = signal<boolean>(false);
  protected readonly subLabel = signal<string | null | undefined>(undefined);
  protected readonly imgSrc = signal<string | null | undefined>(undefined);
  protected readonly imgEmail = signal<string | null | undefined>(undefined);
  protected readonly imgAlt = signal<string | null | undefined>(undefined);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-avatar-static-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar],
  host: { class: 'block' },
  template: `<org-avatar data-testid="avatar" label="Alice" />`,
})
class StoryAvatarStaticShell {}

@Component({
  selector: 'story-avatar-stack-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, AvatarStack],
  host: { class: 'block' },
  template: `
    <org-avatar data-testid="solo" label="Solo" size="sm" />
    <org-avatar-stack data-testid="stack" [size]="stackSize()">
      <org-avatar data-testid="stacked" label="Stacked" size="sm" />
      <org-avatar label="Bob" />
    </org-avatar-stack>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-stack-size-base" (click)="stackSize.set('base')">stack-size-base</button>
      <button type="button" data-testid="ctl-stack-size-lg" (click)="stackSize.set('lg')">stack-size-lg</button>
      <button type="button" data-testid="ctl-stack-size-sm" (click)="stackSize.set('sm')">stack-size-sm</button>
    </div>
  `,
})
class StoryAvatarStackShell {
  protected readonly stackSize = signal<AvatarStackSize>('lg');
}

const meta: Meta = {
  title: 'Core/Components/Avatar/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-avatar-tests-shell />`,
  moduleMetadata: { imports: [StoryAvatarTestsShell] },
});

const renderStaticShell: Story['render'] = () => ({
  template: `<story-avatar-static-shell />`,
  moduleMetadata: { imports: [StoryAvatarStaticShell] },
});

const renderStackShell: Story['render'] = () => ({
  template: `<story-avatar-stack-shell />`,
  moduleMetadata: { imports: [StoryAvatarStackShell] },
});

export const RendersDefaultSizeShapeAndColorIndex: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-shape')).toBe('circle');
    await expect(host.getAttribute('data-color-index')).toBe('1');
  },
};

export const OmitsOverflowAndDisabledByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.getAttribute('data-overflow')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
  },
};

export const StaticAvatarOmitsClickableAttribute: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.getAttribute('data-clickable')).toBeNull();
  },
};

export const ReflectsSizeAndShapeInputs: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await userEvent.click(canvas.getByTestId('ctl-shape-square'));

    await waitFor(() => {
      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-shape')).toBe('square');
    });
  },
};

export const ReflectsOverflowAttributeWhenIsOverflowTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-overflow-on'));

    await waitFor(() => expect(host.getAttribute('data-overflow')).toBe('true'));
  },
};

export const ReflectsDisabledAttributeWhenDisabledTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe('true'));
  },
};

export const ColorIndexFallsBackToZeroForBlankLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-label-blank'));

    await waitFor(() => expect(host.getAttribute('data-color-index')).toBe('0'));
  },
};

export const ColorIndexDiffersForDifferentLeadingChars: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    // default label is 'Alice' (starts with 'a')
    const aliceIndex = host.getAttribute('data-color-index');

    await userEvent.click(canvas.getByTestId('ctl-label-bob'));
    await waitFor(() => expect(host.getAttribute('data-color-index')).not.toBe(aliceIndex));
  },
};

export const ColorIndexWrapsUsingModulo: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    // 'a' (97) % 8 === 1
    const aIndex = host.getAttribute('data-color-index');

    await userEvent.click(canvas.getByTestId('ctl-label-iris'));

    // 'i' (105) % 8 === 1 — same as 'a'
    await waitFor(() => expect(host.getAttribute('data-color-index')).toBe(aIndex));
  },
};

export const SoloAvatarUsesLocalSize: Story = {
  render: renderStackShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const solo = await canvas.findByTestId('solo');

    await expect(solo.getAttribute('data-size')).toBe('sm');
  },
};

export const StackedAvatarInheritsStackSizeOverLocal: Story = {
  render: renderStackShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stacked = await canvas.findByTestId('stacked');

    await expect(stacked.getAttribute('data-size')).toBe('lg');
  },
};

export const StackedAvatarUpdatesWhenStackSizeChanges: Story = {
  render: renderStackShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stacked = await canvas.findByTestId('stacked');

    await userEvent.click(canvas.getByTestId('ctl-stack-size-base'));

    await waitFor(() => expect(stacked.getAttribute('data-size')).toBe('base'));
  },
};

export const OverflowRendersPlusNCountInShape: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-overflow-on'));

    await waitFor(() => {
      const shape = host.querySelector('org-avatar-shape') as HTMLElement | null;

      expect(shape?.textContent?.trim()).toBe('+5');
    });
  },
};

export const OverflowSuppressesIndicatorImageAndLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-has-indicator-on'));
    await userEvent.click(canvas.getByTestId('ctl-show-label-on'));
    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));
    await userEvent.click(canvas.getByTestId('ctl-overflow-on'));

    await waitFor(() => {
      expect(host.querySelector('org-indicator')).toBeNull();
      expect(host.querySelector('org-avatar-image')).toBeNull();
      expect(host.querySelector('org-avatar-label')).toBeNull();
    });
  },
};

export const NoImageRenderedByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.querySelector('org-avatar-image')).toBeNull();
  },
};

export const ImageRenderedWhenImgSrcProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));

    await waitFor(() => expect(host.querySelector('org-avatar-image')).not.toBeNull());
  },
};

export const ImageRenderedWhenImgEmailProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-email-alice'));

    await waitFor(() => expect(host.querySelector('org-avatar-image')).not.toBeNull());
  },
};

export const NoIndicatorByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.querySelector('org-indicator')).toBeNull();
  },
};

export const IndicatorRenderedWhenHasIndicatorTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-has-indicator-on'));

    await waitFor(() => expect(host.querySelector('org-indicator')).not.toBeNull());
  },
};

export const NoLabelByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.querySelector('org-avatar-label')).toBeNull();
  },
};

export const LabelRenderedWhenShowLabelTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-show-label-on'));

    await waitFor(() => expect(host.querySelector('org-avatar-label')).not.toBeNull());
  },
};

export const ClickableRendersInnerButtonWithAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    const innerButton = host.querySelector('button') as HTMLButtonElement | null;

    await expect(innerButton).not.toBeNull();
    await expect(innerButton?.getAttribute('aria-label')).toBe('Alice');
    await expect(host.getAttribute('data-clickable')).toBe('true');
  },
};

export const StaticRendersSpanInsteadOfButton: Story = {
  render: renderStaticShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.querySelector('button')).toBeNull();
    await expect(host.querySelector(':scope > span')).not.toBeNull();
  },
};

export const EmitsClickedOnInnerButtonClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('clickCount=0');

    await userEvent.click(innerButton);

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
  },
};

export const DisablesInnerButtonWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      const innerButton = host.querySelector('button') as HTMLButtonElement;

      expect(innerButton.disabled).toBe(true);
    });
  },
};

export const DoesNotEmitClickedWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('avatar');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    innerButton.click();

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const ImgAltFallsBackToParentLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-label-alice-smith'));
    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('Alice Smith');
    });
  },
};

export const ImgAltUsesExplicitImgAlt: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));
    await userEvent.click(canvas.getByTestId('ctl-img-alt-custom'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('custom alt');
    });
  },
};

export const ImgAltFallsBackWhenImgAltIsNull: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-label-alice-smith'));
    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));
    await userEvent.click(canvas.getByTestId('ctl-img-alt-custom'));
    await userEvent.click(canvas.getByTestId('ctl-img-alt-null'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('alt')).toBe('Alice Smith');
    });
  },
};

export const NoImgWhenNoSource: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await expect(host.querySelector('img')).toBeNull();
  },
};

export const ImgSrcReflectsProvidedSrc: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
    });
  },
};

export const GravatarUrlMatchesExpectedShape: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-email-alice'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toMatch(/^https:\/\/www\.gravatar\.com\/avatar\/[0-9a-f]{32}\?d=404$/);
    });
  },
};

export const DifferentEmailsProduceDifferentGravatarUrls: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-email-alice'));

    let aliceUrl: string | null = null;

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      aliceUrl = img.getAttribute('src');

      expect(aliceUrl).not.toBeNull();
    });

    await userEvent.click(canvas.getByTestId('ctl-img-email-bob'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;
      const bobUrl = img.getAttribute('src');

      expect(bobUrl).not.toBe(aliceUrl);
    });
  },
};

export const ExplicitImgSrcWinsOverImgEmail: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-email-alice'));
    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.getAttribute('src')).toBe('https://example.com/img.png');
    });
  },
};

export const ImgNotHiddenInitially: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));

    await waitFor(() => {
      const img = host.querySelector('img') as HTMLImageElement;

      expect(img.hidden).toBe(false);
    });
  },
};

export const ImgHiddenAfterErrorFires: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));

    let img: HTMLImageElement | null = null;

    await waitFor(() => {
      img = host.querySelector('img') as HTMLImageElement;

      expect(img).not.toBeNull();
    });

    fireEvent.error(img!);

    await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(true));
  },
};

export const ImgHiddenResetsWhenSrcChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-src-set'));

    await waitFor(() => expect(host.querySelector('img')).not.toBeNull());

    fireEvent.error(host.querySelector('img') as HTMLImageElement);

    await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(true));

    await userEvent.click(canvas.getByTestId('ctl-img-src-other'));

    await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(false));
  },
};

export const ImgHiddenResetsWhenEmailChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-img-email-alice'));

    await waitFor(() => expect(host.querySelector('img')).not.toBeNull());

    fireEvent.error(host.querySelector('img') as HTMLImageElement);

    await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(true));

    // clear email first so the img unmounts; setting bob then remounts a fresh img with
    // loadError=false from the brain's reset effect, without racing a second network 404
    await userEvent.click(canvas.getByTestId('ctl-img-email-clear'));
    await userEvent.click(canvas.getByTestId('ctl-img-email-bob'));

    await waitFor(() => expect((host.querySelector('img') as HTMLImageElement).hidden).toBe(false));
  },
};

export const RendersMainLabelText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-label-alice-smith'));
    await userEvent.click(canvas.getByTestId('ctl-show-label-on'));

    await waitFor(() => {
      const main = host.querySelector('org-avatar-label .label') as HTMLElement;

      expect(main.textContent?.trim()).toBe('Alice Smith');
    });
  },
};

export const NoSubLabelByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-show-label-on'));

    await waitFor(() => expect(host.querySelector('org-avatar-label')).not.toBeNull());

    await expect(host.querySelector('org-avatar-label .sub-label')).toBeNull();
  },
};

export const RendersSubLabelWhenProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-show-label-on'));
    await userEvent.click(canvas.getByTestId('ctl-sub-label-set'));

    await waitFor(() => {
      const subLabel = host.querySelector('org-avatar-label .sub-label') as HTMLElement;

      expect(subLabel.textContent?.trim()).toBe('Engineer');
    });
  },
};

export const RendersTwoWordInitials: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-label-alice-smith'));

    await waitFor(() => {
      const initials = host.querySelector('org-avatar-shape span') as HTMLElement;

      expect(initials.textContent?.trim()).toBe('AS');
    });
  },
};

export const RendersSingleWordInitials: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-label-alpha'));

    await waitFor(() => {
      const initials = host.querySelector('org-avatar-shape span') as HTMLElement;

      expect(initials.textContent?.trim()).toBe('AL');
    });
  },
};

export const NoInitialsSpanWhenLabelEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-label-empty'));

    await waitFor(() => expect(host.querySelector('org-avatar-shape span')).toBeNull());
  },
};

export const NoInitialsSpanWhenOverflow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('avatar');

    await userEvent.click(canvas.getByTestId('ctl-overflow-on'));

    await waitFor(() => {
      const shape = host.querySelector('org-avatar-shape') as HTMLElement;

      expect(shape.querySelector('span')).toBeNull();
    });
  },
};

export const StackReflectsSizeAttribute: Story = {
  render: renderStackShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stack = await canvas.findByTestId('stack');

    await expect(stack.getAttribute('data-size')).toBe('lg');
  },
};

export const StackUpdatesSizeAttributeWhenChanged: Story = {
  render: renderStackShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stack = await canvas.findByTestId('stack');

    await userEvent.click(canvas.getByTestId('ctl-stack-size-sm'));

    await waitFor(() => expect(stack.getAttribute('data-size')).toBe('sm'));
  },
};

export const StackProjectsChildAvatars: Story = {
  render: renderStackShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stack = await canvas.findByTestId('stack');

    await expect(stack.querySelectorAll('org-avatar').length).toBe(2);
  },
};
