import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Button, type ButtonColor, type ButtonSize, type ButtonType, type ButtonVariant } from './button';
import { ButtonGroup, type ButtonGroupOrientation } from './button-group';
import { type IconName } from '../icon/icon-brain';

@Component({
  selector: 'story-button-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button
      data-testid="button"
      #buttonRef
      [label]="label()"
      [color]="color()"
      [variant]="variant()"
      [size]="size()"
      [type]="type()"
      [disabled]="disabled()"
      [loading]="loading()"
      [iconOnly]="iconOnly()"
      [isActive]="isActive()"
      [excludeSpacing]="excludeSpacing()"
      [buttonClass]="buttonClass()"
      [ariaLabel]="ariaLabel()"
      [ariaExpanded]="ariaExpanded()"
      [ariaPressed]="ariaPressed()"
      [ariaHaspopup]="ariaHaspopup()"
      [ariaControls]="ariaControls()"
      [ariaActivedescendant]="ariaActivedescendant()"
      [preIcon]="preIcon()"
      [postIcon]="postIcon()"
      (clicked)="handleClicked()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-variant-ghost" (click)="variant.set('ghost')">variant-ghost</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-base" (click)="size.set('base')">size-base</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-type-submit" (click)="type.set('submit')">type-submit</button>
      <button type="button" data-testid="ctl-button-class-extra" (click)="buttonClass.set('extra-class')">
        button-class-extra
      </button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-loading-on" (click)="loading.set(true)">loading-on</button>
      <button type="button" data-testid="ctl-loading-off" (click)="loading.set(false)">loading-off</button>
      <button type="button" data-testid="ctl-icon-only-on" (click)="iconOnly.set(true)">icon-only-on</button>
      <button type="button" data-testid="ctl-active-on" (click)="isActive.set(true)">active-on</button>
      <button type="button" data-testid="ctl-exclude-spacing-on" (click)="excludeSpacing.set(true)">
        exclude-spacing-on
      </button>
      <button type="button" data-testid="ctl-pre-icon-check" (click)="preIcon.set('check')">pre-icon-check</button>
      <button type="button" data-testid="ctl-post-icon-check" (click)="postIcon.set('check')">post-icon-check</button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('do thing')">aria-label-set</button>
      <button type="button" data-testid="ctl-aria-expanded-set" (click)="ariaExpanded.set(true)">
        aria-expanded-set
      </button>
      <button type="button" data-testid="ctl-aria-pressed-set" (click)="ariaPressed.set(false)">
        aria-pressed-set
      </button>
      <button type="button" data-testid="ctl-aria-haspopup-set" (click)="ariaHaspopup.set('menu')">
        aria-haspopup-set
      </button>
      <button type="button" data-testid="ctl-aria-controls-set" (click)="ariaControls.set('panel-1')">
        aria-controls-set
      </button>
      <button type="button" data-testid="ctl-aria-activedescendant-set" (click)="ariaActivedescendant.set('option-3')">
        aria-activedescendant-set
      </button>
      <button type="button" data-testid="ctl-aria-null-all" (click)="setAllAriaToNull()">aria-null-all</button>
    </div>
  `,
})
class StoryButtonTestsShell {
  protected readonly buttonRef = viewChild.required<Button>('buttonRef');

  protected readonly label = signal<string>('click me');
  protected readonly color = signal<ButtonColor>('primary');
  protected readonly variant = signal<ButtonVariant>('filled');
  protected readonly size = signal<ButtonSize>('base');
  protected readonly type = signal<ButtonType>('button');
  protected readonly disabled = signal<boolean>(false);
  protected readonly loading = signal<boolean>(false);
  protected readonly iconOnly = signal<boolean>(false);
  protected readonly isActive = signal<boolean>(false);
  protected readonly excludeSpacing = signal<boolean>(false);
  protected readonly buttonClass = signal<string>('');
  protected readonly ariaLabel = signal<string | null | undefined>(undefined);
  protected readonly ariaExpanded = signal<boolean | null | undefined>(undefined);
  protected readonly ariaPressed = signal<boolean | null | undefined>(undefined);
  protected readonly ariaHaspopup = signal<string | null | undefined>(undefined);
  protected readonly ariaControls = signal<string | null | undefined>(undefined);
  protected readonly ariaActivedescendant = signal<string | null | undefined>(undefined);
  protected readonly preIcon = signal<IconName | null | undefined>(undefined);
  protected readonly postIcon = signal<IconName | null | undefined>(undefined);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    const button = this.buttonRef();

    return `clickCount=${this.clickCount()} isPressed=${button.isPressed()} isFocused=${button.isFocused()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }

  protected setAllAriaToNull(): void {
    this.ariaLabel.set(null);
    this.ariaExpanded.set(null);
    this.ariaPressed.set(null);
    this.ariaHaspopup.set(null);
    this.ariaControls.set(null);
    this.ariaActivedescendant.set(null);
  }
}

@Component({
  selector: 'story-button-content-projection-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button data-testid="button-content" label="fallback">
      <ng-template #content>
        <strong data-testid="custom-content">custom</strong>
      </ng-template>
    </org-button>

    <org-button data-testid="button-pre" label="pre slot">
      <ng-template #pre>
        <span data-testid="custom-pre">custom-pre</span>
      </ng-template>
    </org-button>

    <org-button data-testid="button-post" label="post slot">
      <ng-template #post>
        <span data-testid="custom-post">custom-post</span>
      </ng-template>
    </org-button>
  `,
})
class StoryButtonContentProjectionShell {}

@Component({
  selector: 'story-button-pre-conflict-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button data-testid="button" label="conflict" preIcon="check">
      <ng-template #pre>
        <span data-testid="projected-pre">projected</span>
      </ng-template>
    </org-button>
  `,
})
class StoryButtonPreConflictShell {}

@Component({
  selector: 'story-button-post-conflict-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  template: `
    <org-button data-testid="button" label="conflict" postIcon="check">
      <ng-template #post>
        <span data-testid="projected-post">projected</span>
      </ng-template>
    </org-button>
  `,
})
class StoryButtonPostConflictShell {}

@Component({
  selector: 'story-button-group-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonGroup],
  host: { class: 'block' },
  template: `
    <org-button-group data-testid="group" [orientation]="orientation()">
      <org-button label="one" />
      <org-button label="two" />
    </org-button-group>
    <button type="button" data-testid="ctl-orientation-vertical" (click)="orientation.set('vertical')">vertical</button>
    <button type="button" data-testid="ctl-orientation-horizontal" (click)="orientation.set('horizontal')">
      horizontal
    </button>
  `,
})
class StoryButtonGroupShell {
  protected readonly orientation = signal<ButtonGroupOrientation>('horizontal');
}

const meta: Meta = {
  title: 'Core/Components/Button/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-button-tests-shell />`,
  moduleMetadata: { imports: [StoryButtonTestsShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');

    await expect(host.getAttribute('data-color')).toBe('primary');
    await expect(host.getAttribute('data-variant')).toBe('filled');
    await expect(host.getAttribute('data-size')).toBe('base');
  },
};

export const OmitsBooleanHostAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');

    await expect(host.getAttribute('data-icon-only')).toBeNull();
    await expect(host.getAttribute('data-exclude-spacing')).toBeNull();
    await expect(host.getAttribute('data-loading')).toBeNull();
    await expect(host.getAttribute('data-active')).toBeNull();
  },
};

export const ReflectsConfiguredHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await userEvent.click(canvas.getByTestId('ctl-variant-ghost'));
    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await userEvent.click(canvas.getByTestId('ctl-icon-only-on'));
    await userEvent.click(canvas.getByTestId('ctl-exclude-spacing-on'));
    await userEvent.click(canvas.getByTestId('ctl-active-on'));

    await expect(host.getAttribute('data-color')).toBe('danger');
    await expect(host.getAttribute('data-variant')).toBe('ghost');
    await expect(host.getAttribute('data-size')).toBe('lg');
    await expect(host.getAttribute('data-icon-only')).toBe('');
    await expect(host.getAttribute('data-exclude-spacing')).toBe('');
    await expect(host.getAttribute('data-active')).toBe('');
  },
};

export const TogglesDataLoadingAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');

    await expect(host.getAttribute('data-loading')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await expect(host.getAttribute('data-loading')).toBe('');
  },
};

export const RendersLabelInsideSpan: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const labelSpan = innerButton.querySelector('span');

    await expect(labelSpan?.textContent?.trim()).toBe('click me');
  },
};

export const ForwardsTypeToNativeButton: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-type-submit'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.type).toBe('submit');
  },
};

export const AppliesButtonClassToInnerButton: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-button-class-extra'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.classList.contains('extra-class')).toBe(true);
  },
};

export const DisablesInnerButtonWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.disabled).toBe(false);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(innerButton.disabled).toBe(true);
  },
};

export const IconOnlyHidesLabelSpan: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));
    await userEvent.click(canvas.getByTestId('ctl-pre-icon-check'));
    await userEvent.click(canvas.getByTestId('ctl-icon-only-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.querySelector('span')).toBeNull();
  },
};

export const LoadingRendersSpinnerAndHidesIcons: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-pre-icon-check'));
    await userEvent.click(canvas.getByTestId('ctl-post-icon-check'));
    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.querySelector('org-loading-spinner')).not.toBeNull();
    await expect(innerButton.querySelector('.pre-icon')).toBeNull();
    await expect(innerButton.querySelector('.post-icon')).toBeNull();
  },
};

export const LoadingOffRestoresIcons: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-pre-icon-check'));
    await userEvent.click(canvas.getByTestId('ctl-post-icon-check'));
    await userEvent.click(canvas.getByTestId('ctl-loading-on'));
    await userEvent.click(canvas.getByTestId('ctl-loading-off'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.querySelector('org-loading-spinner')).toBeNull();
    await expect(innerButton.querySelector('.pre-icon')).not.toBeNull();
    await expect(innerButton.querySelector('.post-icon')).not.toBeNull();
  },
};

export const IconSizeMapsForSmall: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-pre-icon-check'));
    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    const host = await canvas.findByTestId('button');
    const icon = host.querySelector('org-icon') as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('xs');
  },
};

export const IconSizeMapsForBase: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-pre-icon-check'));

    const host = await canvas.findByTestId('button');
    const icon = host.querySelector('org-icon') as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('base');
  },
};

export const IconSizeMapsForLarge: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-pre-icon-check'));
    await userEvent.click(canvas.getByTestId('ctl-size-lg'));

    const host = await canvas.findByTestId('button');
    const icon = host.querySelector('org-icon') as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('2xl');
  },
};

export const RendersProjectedContentTemplate: Story = {
  render: () => ({
    template: `<story-button-content-projection-shell />`,
    moduleMetadata: { imports: [StoryButtonContentProjectionShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button-content');

    await expect(host.querySelector('[data-testid="custom-content"]')).not.toBeNull();
    await expect(host.querySelector('button > span')).toBeNull();
  },
};

export const RendersProjectedPreTemplate: Story = {
  render: () => ({
    template: `<story-button-content-projection-shell />`,
    moduleMetadata: { imports: [StoryButtonContentProjectionShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button-pre');

    await expect(host.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
  },
};

export const RendersProjectedPostTemplate: Story = {
  render: () => ({
    template: `<story-button-content-projection-shell />`,
    moduleMetadata: { imports: [StoryButtonContentProjectionShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button-post');

    await expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
  },
};

export const PreTemplateWinsOverPreIcon: Story = {
  render: () => ({
    template: `<story-button-pre-conflict-shell />`,
    moduleMetadata: { imports: [StoryButtonPreConflictShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');

    await expect(host.querySelector('[data-testid="projected-pre"]')).not.toBeNull();
    await expect(host.querySelector('.pre-icon')).toBeNull();
  },
};

export const PostTemplateWinsOverPostIcon: Story = {
  render: () => ({
    template: `<story-button-post-conflict-shell />`,
    moduleMetadata: { imports: [StoryButtonPostConflictShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');

    await expect(host.querySelector('[data-testid="projected-post"]')).not.toBeNull();
    await expect(host.querySelector('.post-icon')).toBeNull();
  },
};

export const EmitsClickedOnClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('clickCount=0');

    await userEvent.click(innerButton);

    await expect(readout.textContent).toContain('clickCount=1');
  },
};

export const DoesNotEmitClickedWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    innerButton.click();

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const DoesNotEmitClickedWhenLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    innerButton.click();

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const AppliesAriaLabelAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-label')).toBe('do thing');
  },
};

export const AppliesAriaExpandedAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-expanded-set'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-expanded')).toBe('true');
  },
};

export const AppliesAriaPressedAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-pressed-set'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-pressed')).toBe('false');
  },
};

export const AppliesAriaHaspopupAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-haspopup-set'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-haspopup')).toBe('menu');
  },
};

export const AppliesAriaControlsAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-controls-set'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-controls')).toBe('panel-1');
  },
};

export const AppliesAriaActivedescendantAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-activedescendant-set'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-activedescendant')).toBe('option-3');
  },
};

export const TransformsNullAriaToOmittedAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-expanded-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-pressed-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-haspopup-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-controls-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-activedescendant-set'));

    await userEvent.click(canvas.getByTestId('ctl-aria-null-all'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.getAttribute('aria-label')).toBeNull();
    await expect(innerButton.getAttribute('aria-expanded')).toBeNull();
    await expect(innerButton.getAttribute('aria-pressed')).toBeNull();
    await expect(innerButton.getAttribute('aria-haspopup')).toBeNull();
    await expect(innerButton.getAttribute('aria-controls')).toBeNull();
    await expect(innerButton.getAttribute('aria-activedescendant')).toBeNull();
  },
};

export const DefaultsToNotDisabledAndNoAriaBusy: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.disabled).toBe(false);
    await expect(innerButton.getAttribute('aria-disabled')).toBeNull();
    await expect(innerButton.getAttribute('aria-busy')).toBeNull();
  },
};

export const DisabledSetsNativeDisabledAndAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.disabled).toBe(true);
    await expect(innerButton.getAttribute('aria-disabled')).toBe('true');
  },
};

export const LoadingSetsAriaBusyAndAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;

    await expect(innerButton.disabled).toBe(true);
    await expect(innerButton.getAttribute('aria-disabled')).toBe('true');
    await expect(innerButton.getAttribute('aria-busy')).toBe('true');
  },
};

export const MouseDownSetsPressedMouseUpClearsIt: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.mouseDown(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

    fireEvent.mouseUp(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
  },
};

export const MouseLeaveClearsPressed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.mouseDown(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

    fireEvent.mouseLeave(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
  },
};

export const DoesNotEnterPressedOnMouseDownWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.mouseDown(innerButton);

    await expect(readout.textContent).toContain('isPressed=false');
  },
};

export const TouchStartSetsPressedTouchEndClearsIt: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.touchStart(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

    fireEvent.touchEnd(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
  },
};

export const TouchCancelClearsPressed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.touchStart(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=true'));

    fireEvent.touchCancel(innerButton);
    await waitFor(() => expect(readout.textContent).toContain('isPressed=false'));
  },
};

export const DoesNotEnterPressedOnTouchStartWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.touchStart(innerButton);

    await expect(readout.textContent).toContain('isPressed=false');
  },
};

export const FocusBlurUpdatesIsFocused: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('button');
    const innerButton = host.querySelector('button') as HTMLButtonElement;
    const readout = await canvas.findByTestId('readout');

    innerButton.focus();
    await waitFor(() => expect(readout.textContent).toContain('isFocused=true'));

    innerButton.blur();
    await waitFor(() => expect(readout.textContent).toContain('isFocused=false'));
  },
};

const renderGroupShell: Story['render'] = () => ({
  template: `<story-button-group-shell />`,
  moduleMetadata: { imports: [StoryButtonGroupShell] },
});

export const ButtonGroupRendersDefaultHorizontalOrientation: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await expect(group.getAttribute('data-orientation')).toBe('horizontal');
  },
};

export const ButtonGroupReflectsOrientationInput: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-orientation-vertical'));

    await expect(group.getAttribute('data-orientation')).toBe('vertical');

    await userEvent.click(canvas.getByTestId('ctl-orientation-horizontal'));

    await expect(group.getAttribute('data-orientation')).toBe('horizontal');
  },
};

export const ButtonGroupRendersProjectedButtonChildren: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await expect(group.querySelectorAll('org-button').length).toBe(2);
  },
};
