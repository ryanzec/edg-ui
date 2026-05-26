import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type IconName } from '../icon/icon-brain';
import { FormField } from '../form-fields/form-field';
import { Tag } from '../tags/tag';
import { Input, type InputInlineItem, type InputShowClearMode, type InputType, type InputVariant } from './input';

@Component({
  selector: 'story-input-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input],
  host: { class: 'block' },
  template: `
    <org-input
      data-testid="input"
      #inputRef
      [name]="name()"
      [variant]="variant()"
      [type]="type()"
      [placeholder]="placeholder()"
      [(value)]="value"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [autoFocus]="autoFocus()"
      [selectAllOnFocus]="selectAllOnFocus()"
      [showPasswordToggle]="showPasswordToggle()"
      [loading]="loading()"
      [showClear]="showClear()"
      [autocomplete]="autocomplete()"
      [blockPasswordManager]="blockPasswordManager()"
      [asTrigger]="asTrigger()"
      [ariaLabel]="ariaLabel()"
      [ariaExpanded]="ariaExpanded()"
      [ariaHasPopup]="ariaHasPopup()"
      [ariaAutoComplete]="ariaAutoComplete()"
      [ariaActiveDescendant]="ariaActiveDescendant()"
      [ariaControls]="ariaControls()"
      [inputRole]="inputRole()"
      [preIcon]="preIcon()"
      [postIcon]="postIcon()"
      [preIconAriaLabel]="preIconAriaLabel()"
      [postIconAriaLabel]="postIconAriaLabel()"
      [inlineItems]="inlineItems()"
      (focused)="handleFocused()"
      (blurred)="handleBlurred()"
      (inlineItemRemoved)="handleInlineItemRemoved($event)"
      (cleared)="handleCleared()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-variant-borderless" (click)="variant.set('borderless')">
        variant-borderless
      </button>
      <button type="button" data-testid="ctl-variant-inline" (click)="variant.set('inline')">variant-inline</button>
      <button type="button" data-testid="ctl-type-password" (click)="type.set('password')">type-password</button>
      <button type="button" data-testid="ctl-type-number" (click)="type.set('number')">type-number</button>
      <button type="button" data-testid="ctl-type-email" (click)="type.set('email')">type-email</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-readonly-on" (click)="readonly.set(true)">readonly-on</button>
      <button type="button" data-testid="ctl-readonly-off" (click)="readonly.set(false)">readonly-off</button>
      <button type="button" data-testid="ctl-loading-on" (click)="loading.set(true)">loading-on</button>
      <button type="button" data-testid="ctl-loading-off" (click)="loading.set(false)">loading-off</button>
      <button type="button" data-testid="ctl-show-clear-active" (click)="showClear.set('active')">
        show-clear-active
      </button>
      <button type="button" data-testid="ctl-show-clear-always" (click)="showClear.set('always')">
        show-clear-always
      </button>
      <button type="button" data-testid="ctl-show-password-toggle-on" (click)="showPasswordToggle.set(true)">
        show-password-toggle-on
      </button>
      <button type="button" data-testid="ctl-select-all-on" (click)="selectAllOnFocus.set(true)">select-all-on</button>
      <button type="button" data-testid="ctl-auto-focus-on" (click)="autoFocus.set(true)">auto-focus-on</button>
      <button type="button" data-testid="ctl-as-trigger-on" (click)="asTrigger.set(true)">as-trigger-on</button>
      <button type="button" data-testid="ctl-block-pm-off" (click)="blockPasswordManager.set(false)">
        block-pm-off
      </button>
      <button type="button" data-testid="ctl-value-hello" (click)="value.set('hello')">value-hello</button>
      <button type="button" data-testid="ctl-value-clear" (click)="value.set('')">value-clear</button>
      <button type="button" data-testid="ctl-pre-icon-mail" (click)="preIcon.set('mail')">pre-icon-mail</button>
      <button type="button" data-testid="ctl-post-icon-check" (click)="postIcon.set('check')">post-icon-check</button>
      <button type="button" data-testid="ctl-inline-items-two" (click)="useTwoInlineItems()">inline-items-two</button>
      <button type="button" data-testid="ctl-inline-items-clear" (click)="inlineItems.set([])">
        inline-items-clear
      </button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('search field')">
        aria-label-set
      </button>
      <button type="button" data-testid="ctl-aria-expanded-set" (click)="ariaExpanded.set(true)">
        aria-expanded-set
      </button>
      <button type="button" data-testid="ctl-aria-haspopup-set" (click)="ariaHasPopup.set('listbox')">
        aria-haspopup-set
      </button>
      <button type="button" data-testid="ctl-aria-autocomplete-set" (click)="ariaAutoComplete.set('list')">
        aria-autocomplete-set
      </button>
      <button type="button" data-testid="ctl-aria-activedescendant-set" (click)="ariaActiveDescendant.set('opt-3')">
        aria-activedescendant-set
      </button>
      <button type="button" data-testid="ctl-aria-controls-set" (click)="ariaControls.set('panel-1')">
        aria-controls-set
      </button>
      <button type="button" data-testid="ctl-input-role-set" (click)="inputRole.set('combobox')">input-role-set</button>
      <button type="button" data-testid="ctl-aria-null-all" (click)="setAllAriaToNull()">aria-null-all</button>
      <button type="button" data-testid="ctl-autocomplete-on" (click)="autocomplete.set('email')">
        autocomplete-on
      </button>
      <button type="button" data-testid="ctl-api-focus" (click)="inputRef.focusInput()">api-focus</button>
      <button type="button" data-testid="ctl-api-blur" (click)="inputRef.blurInput()">api-blur</button>
    </div>
  `,
})
class StoryInputTestsShell {
  protected readonly name = signal<string>('input-test');
  protected readonly variant = signal<InputVariant>('bordered');
  protected readonly type = signal<InputType>('text');
  protected readonly placeholder = signal<string>('Type something');
  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);
  protected readonly readonly = signal<boolean>(false);
  protected readonly loading = signal<boolean>(false);
  protected readonly autoFocus = signal<boolean>(false);
  protected readonly selectAllOnFocus = signal<boolean>(false);
  protected readonly showPasswordToggle = signal<boolean>(false);
  protected readonly showClear = signal<InputShowClearMode>('never');
  protected readonly autocomplete = signal<string>('off');
  protected readonly blockPasswordManager = signal<boolean>(true);
  protected readonly asTrigger = signal<boolean>(false);
  protected readonly ariaLabel = signal<string | null | undefined>(undefined);
  protected readonly ariaExpanded = signal<boolean | null | undefined>(undefined);
  protected readonly ariaHasPopup = signal<string | null | undefined>(undefined);
  protected readonly ariaAutoComplete = signal<string | null | undefined>(undefined);
  protected readonly ariaActiveDescendant = signal<string | null | undefined>(undefined);
  protected readonly ariaControls = signal<string | null | undefined>(undefined);
  protected readonly inputRole = signal<string | null | undefined>(undefined);
  protected readonly preIcon = signal<IconName | null | undefined>(undefined);
  protected readonly postIcon = signal<IconName | null | undefined>(undefined);
  protected readonly preIconAriaLabel = signal<string | null | undefined>(undefined);
  protected readonly postIconAriaLabel = signal<string | null | undefined>(undefined);
  protected readonly inlineItems = signal<InputInlineItem[]>([]);

  protected readonly focusedCount = signal<number>(0);
  protected readonly blurredCount = signal<number>(0);
  protected readonly clearedCount = signal<number>(0);
  protected readonly lastRemovedId = signal<string>('none');

  protected readout(): string {
    return [
      `value="${this.value()}"`,
      `focusedCount=${this.focusedCount()}`,
      `blurredCount=${this.blurredCount()}`,
      `clearedCount=${this.clearedCount()}`,
      `lastRemovedId=${this.lastRemovedId()}`,
    ].join(' ');
  }

  protected useTwoInlineItems(): void {
    this.inlineItems.set([
      { id: 'one', label: 'one', removable: true },
      { id: 'two', label: 'two', removable: true },
    ]);
  }

  protected handleFocused(): void {
    this.focusedCount.update((value) => value + 1);
  }

  protected handleBlurred(): void {
    this.blurredCount.update((value) => value + 1);
  }

  protected handleCleared(): void {
    this.clearedCount.update((value) => value + 1);
  }

  protected handleInlineItemRemoved(item: InputInlineItem): void {
    this.lastRemovedId.set(item.id);
  }

  protected setAllAriaToNull(): void {
    this.ariaLabel.set(null);
    this.ariaExpanded.set(null);
    this.ariaHasPopup.set(null);
    this.ariaAutoComplete.set(null);
    this.ariaActiveDescendant.set(null);
    this.ariaControls.set(null);
    this.inputRole.set(null);
  }
}

@Component({
  selector: 'story-input-output-listeners-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input],
  host: { class: 'block' },
  template: `
    <org-input
      data-testid="input"
      name="output-listener-input"
      preIcon="mail"
      postIcon="check"
      preIconAriaLabel="open search"
      postIconAriaLabel="apply"
      (preIconClicked)="onPreClicked()"
      (postIconClicked)="onPostClicked()"
    />
    <pre data-testid="readout">preCount={{ preCount() }} postCount={{ postCount() }}</pre>
  `,
})
class StoryInputOutputListenersShell {
  protected readonly preCount = signal<number>(0);
  protected readonly postCount = signal<number>(0);

  protected onPreClicked(): void {
    this.preCount.update((value) => value + 1);
  }

  protected onPostClicked(): void {
    this.postCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-input-projection-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, Tag],
  host: { class: 'block' },
  template: `
    <org-input data-testid="input-pre" name="projection-pre" preIcon="mail">
      <ng-template #pre>
        <span data-testid="custom-pre">USD</span>
      </ng-template>
    </org-input>

    <org-input data-testid="input-post" name="projection-post" postIcon="check">
      <ng-template #post>
        <span data-testid="custom-post">.com</span>
      </ng-template>
    </org-input>

    <org-input data-testid="input-chip" name="projection-chip" [inlineItems]="chips">
      <ng-template #chip let-item>
        <org-tag color="info" data-testid="custom-chip">{{ item.label }}</org-tag>
      </ng-template>
    </org-input>
  `,
})
class StoryInputProjectionShell {
  protected readonly chips: InputInlineItem[] = [
    { id: 'a', label: 'design', removable: true },
    { id: 'b', label: 'tokens', removable: true },
  ];
}

@Component({
  selector: 'story-input-form-field-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="message()">
      <org-input data-testid="input" name="form-field-input" value="something" />
    </org-form-field>
    <button type="button" data-testid="ctl-message-set" (click)="message.set('Field is required')">message-set</button>
    <button type="button" data-testid="ctl-message-clear" (click)="message.set('')">message-clear</button>
  `,
})
class StoryInputFormFieldShell {
  protected readonly message = signal<string>('');
}

@Component({
  selector: 'story-input-reactive-form-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form">
      <org-input data-testid="input" name="reactive-form-input" formControlName="text" />
    </form>
    <pre data-testid="readout">
value="{{ form.controls.text.value }}" touched={{ form.controls.text.touched }} disabled={{
        form.controls.text.disabled
      }}</pre
    >
    <button type="button" data-testid="ctl-form-set-hello" (click)="form.controls.text.setValue('hello')">
      form-set-hello
    </button>
    <button type="button" data-testid="ctl-form-disable" (click)="form.controls.text.disable()">form-disable</button>
    <button type="button" data-testid="ctl-form-enable" (click)="form.controls.text.enable()">form-enable</button>
  `,
})
class StoryInputReactiveFormShell {
  protected readonly form = new FormGroup({
    text: new FormControl<string>('initial', { nonNullable: true }),
  });
}

const meta: Meta = {
  title: 'Core/Components/Input/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-input-tests-shell />`,
  moduleMetadata: { imports: [StoryInputTestsShell] },
});

const renderOutputListenersShell: Story['render'] = () => ({
  template: `<story-input-output-listeners-shell />`,
  moduleMetadata: { imports: [StoryInputOutputListenersShell] },
});

const renderProjectionShell: Story['render'] = () => ({
  template: `<story-input-projection-shell />`,
  moduleMetadata: { imports: [StoryInputProjectionShell] },
});

const renderFormFieldShell: Story['render'] = () => ({
  template: `<story-input-form-field-shell />`,
  moduleMetadata: { imports: [StoryInputFormFieldShell] },
});

const renderReactiveFormShell: Story['render'] = () => ({
  template: `<story-input-reactive-form-shell />`,
  moduleMetadata: { imports: [StoryInputReactiveFormShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await expect(host.getAttribute('data-variant')).toBe('bordered');
    await expect(host.getAttribute('data-type')).toBe('text');
    await expect(host.getAttribute('data-show-clear')).toBe('never');
    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('data-readonly')).toBeNull();
    await expect(host.getAttribute('data-loading')).toBeNull();
    await expect(host.getAttribute('data-as-trigger')).toBeNull();
    await expect(host.getAttribute('data-has-value')).toBeNull();
    await expect(host.getAttribute('data-has-pre')).toBeNull();
    await expect(host.getAttribute('data-has-post')).toBeNull();
    await expect(host.getAttribute('data-has-chips')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const ReflectsVariantAndTypeHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-variant-inline'));
    await userEvent.click(canvas.getByTestId('ctl-type-email'));

    await waitFor(() => {
      expect(host.getAttribute('data-variant')).toBe('inline');
      expect(host.getAttribute('data-type')).toBe('email');
    });
  },
};

export const TogglesDataDisabledAndAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });

    await userEvent.click(canvas.getByTestId('ctl-disabled-off'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });
  },
};

export const TogglesDataReadonly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-readonly-on'));

    await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));
  },
};

export const TogglesDataLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(host.getAttribute('data-loading')).toBe(''));
  },
};

export const TogglesDataAsTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-as-trigger-on'));

    await waitFor(() => expect(host.getAttribute('data-as-trigger')).toBe(''));
  },
};

export const ReflectsHasValueAttributeWithValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-value-hello'));

    await waitFor(() => expect(host.getAttribute('data-has-value')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-value-clear'));

    await waitFor(() => expect(host.getAttribute('data-has-value')).toBeNull());
  },
};

export const ReflectsHasPreAndHasPostFromIconInputs: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-pre-icon-mail'));
    await userEvent.click(canvas.getByTestId('ctl-post-icon-check'));

    await waitFor(() => {
      expect(host.getAttribute('data-has-pre')).toBe('');
      expect(host.getAttribute('data-has-post')).toBe('');
    });
  },
};

export const ReflectsHasChipsWithInlineItems: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-inline-items-two'));

    await waitFor(() => expect(host.getAttribute('data-has-chips')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-inline-items-clear'));

    await waitFor(() => expect(host.getAttribute('data-has-chips')).toBeNull());
  },
};

export const ForwardsTypeAndNameToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.getAttribute('type')).toBe('text');
    await expect(nativeInput.getAttribute('name')).toBe('input-test');
    await expect(nativeInput.getAttribute('id')).toBe('input-test');

    await userEvent.click(canvas.getByTestId('ctl-type-email'));

    await waitFor(() => expect(nativeInput.getAttribute('type')).toBe('email'));
  },
};

export const ForwardsPlaceholderToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.getAttribute('placeholder')).toBe('Type something');
  },
};

export const ForwardsDisabledToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.disabled).toBe(false);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(nativeInput.disabled).toBe(true));
  },
};

export const ForwardsReadonlyToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-readonly-on'));

    await waitFor(() => expect(nativeInput.readOnly).toBe(true));
  },
};

export const LoadingForcesNativeReadonly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(nativeInput.readOnly).toBe(true));
  },
};

export const AsTriggerForcesNativeReadonly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-as-trigger-on'));

    await waitFor(() => expect(nativeInput.readOnly).toBe(true));
  },
};

export const ForwardsAutocompleteToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.getAttribute('autocomplete')).toBe('off');

    await userEvent.click(canvas.getByTestId('ctl-autocomplete-on'));

    await waitFor(() => expect(nativeInput.getAttribute('autocomplete')).toBe('email'));
  },
};

export const SetsDataIpIgnoreWhenBlockPasswordManagerTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.getAttribute('data-ip-ignore')).toBe('true');

    await userEvent.click(canvas.getByTestId('ctl-block-pm-off'));

    await waitFor(() => expect(nativeInput.getAttribute('data-ip-ignore')).toBeNull());
  },
};

export const AppliesAriaAttributesToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-expanded-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-haspopup-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-autocomplete-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-activedescendant-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-controls-set'));
    await userEvent.click(canvas.getByTestId('ctl-input-role-set'));

    await waitFor(() => {
      expect(nativeInput.getAttribute('aria-label')).toBe('search field');
      expect(nativeInput.getAttribute('aria-expanded')).toBe('true');
      expect(nativeInput.getAttribute('aria-haspopup')).toBe('listbox');
      expect(nativeInput.getAttribute('aria-autocomplete')).toBe('list');
      expect(nativeInput.getAttribute('aria-activedescendant')).toBe('opt-3');
      expect(nativeInput.getAttribute('aria-controls')).toBe('panel-1');
      expect(nativeInput.getAttribute('role')).toBe('combobox');
    });
  },
};

export const TransformsNullAriaToOmittedAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-expanded-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-haspopup-set'));
    await userEvent.click(canvas.getByTestId('ctl-aria-null-all'));

    await waitFor(() => {
      expect(nativeInput.getAttribute('aria-label')).toBeNull();
      expect(nativeInput.getAttribute('aria-expanded')).toBeNull();
      expect(nativeInput.getAttribute('aria-haspopup')).toBeNull();
      expect(nativeInput.getAttribute('aria-autocomplete')).toBeNull();
      expect(nativeInput.getAttribute('aria-activedescendant')).toBeNull();
      expect(nativeInput.getAttribute('aria-controls')).toBeNull();
      expect(nativeInput.getAttribute('role')).toBeNull();
    });
  },
};

export const TypingUpdatesValueModel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(nativeInput);
    await userEvent.type(nativeInput, 'hi');

    await waitFor(() => expect(readout.textContent).toContain('value="hi"'));
  },
};

export const ExternalValueWritesToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-value-hello'));

    await waitFor(() => expect(nativeInput.value).toBe('hello'));
  },
};

export const FocusEmitsFocusedAndUpdatesIsFocused: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    const readout = await canvas.findByTestId('readout');

    nativeInput.focus();

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

    nativeInput.blur();

    await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
  },
};

export const SelectAllOnFocusSelectsExistingText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-value-hello'));
    await userEvent.click(canvas.getByTestId('ctl-select-all-on'));

    nativeInput.focus();

    await waitFor(() => {
      expect(nativeInput.selectionStart).toBe(0);
      expect(nativeInput.selectionEnd).toBe('hello'.length);
    });
  },
};

export const AutoFocusFocusesNativeInputWhenFlippedOn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-auto-focus-on'));

    await waitFor(() => expect(document.activeElement).toBe(nativeInput));
  },
};

export const ProgrammaticFocusAndBlurApi: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-api-focus'));

    await waitFor(() => expect(document.activeElement).toBe(nativeInput));

    await userEvent.click(canvas.getByTestId('ctl-api-blur'));

    await waitFor(() => expect(document.activeElement).not.toBe(nativeInput));
  },
};

export const ProgrammaticFocusGatedWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-focus'));

    await expect(document.activeElement).not.toBe(nativeInput);
  },
};

export const PreIconRendersNonInteractiveByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-pre-icon-mail'));

    await waitFor(() => {
      const preSlot = host.querySelector('.pre');

      expect(preSlot?.querySelector('button')).toBeNull();
      expect(preSlot?.querySelector('span.icon-btn')).not.toBeNull();
      expect(preSlot?.querySelector('org-icon')).not.toBeNull();
    });
  },
};

export const PreIconRendersButtonWhenListenerAttached: Story = {
  render: renderOutputListenersShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    const preButton = host.querySelector('.pre button') as HTMLButtonElement | null;

    await expect(preButton).not.toBeNull();
    await expect(preButton?.getAttribute('aria-label')).toBe('open search');
  },
};

export const PostIconRendersNonInteractiveByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-post-icon-check'));

    await waitFor(() => {
      const postSlot = host.querySelector('.post');

      expect(postSlot?.querySelector('span.icon-btn')).not.toBeNull();
      expect(postSlot?.querySelector('button.icon-btn')).toBeNull();
    });
  },
};

export const PostIconRendersButtonWhenListenerAttached: Story = {
  render: renderOutputListenersShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    const postButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement | null;

    await expect(postButton).not.toBeNull();
    await expect(postButton?.getAttribute('aria-label')).toBe('apply');
  },
};

export const PreIconClickEmitsPreIconClicked: Story = {
  render: renderOutputListenersShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const readout = await canvas.findByTestId('readout');

    const preButton = host.querySelector('.pre button') as HTMLButtonElement;

    await userEvent.click(preButton);

    await waitFor(() => expect(readout.textContent).toContain('preCount=1'));
  },
};

export const PostIconClickEmitsPostIconClicked: Story = {
  render: renderOutputListenersShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const readout = await canvas.findByTestId('readout');

    const postButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement;

    await userEvent.click(postButton);

    await waitFor(() => expect(readout.textContent).toContain('postCount=1'));
  },
};

export const PasswordTypeWithToggleRendersInteractiveEyeIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-type-password'));
    await userEvent.click(canvas.getByTestId('ctl-show-password-toggle-on'));

    await waitFor(() => {
      const postButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement | null;

      expect(postButton).not.toBeNull();
      expect(postButton?.getAttribute('aria-label')).toBe('Show password');
      expect(postButton?.querySelector('org-icon')?.getAttribute('data-icon')).toBe('eye');
    });
  },
};

export const PasswordToggleSwapsNativeTypeAndIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-type-password'));
    await userEvent.click(canvas.getByTestId('ctl-show-password-toggle-on'));

    await waitFor(() => expect(nativeInput.getAttribute('type')).toBe('password'));

    const postButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement;

    await userEvent.click(postButton);

    await waitFor(() => {
      expect(nativeInput.getAttribute('type')).toBe('text');
      const refreshedButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement;
      expect(refreshedButton.getAttribute('aria-label')).toBe('Hide password');
      expect(refreshedButton.querySelector('org-icon')?.getAttribute('data-icon')).toBe('eye-off');
    });

    await userEvent.click(host.querySelector('.post button.icon-btn') as HTMLButtonElement);

    await waitFor(() => expect(nativeInput.getAttribute('type')).toBe('password'));
  },
};

export const NumberTypeRendersStepper: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-type-number'));

    await waitFor(() => {
      expect(host.querySelector('.stepper-up')).not.toBeNull();
      expect(host.querySelector('.stepper-down')).not.toBeNull();
    });
  },
};

export const NumberStepperIncrementsValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-type-number'));

    await waitFor(() => expect(host.querySelector('.stepper-up')).not.toBeNull());

    const stepperUp = host.querySelector('.stepper-up') as HTMLButtonElement;

    await userEvent.click(stepperUp);

    await waitFor(() => expect(readout.textContent).toContain('value="1"'));
  },
};

export const NumberStepperDecrementsValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-type-number'));

    await waitFor(() => expect(host.querySelector('.stepper-down')).not.toBeNull());

    const stepperDown = host.querySelector('.stepper-down') as HTMLButtonElement;

    await userEvent.click(stepperDown);

    await waitFor(() => expect(readout.textContent).toContain('value="-1"'));
  },
};

export const NumberStepperDisabledWhenInputDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-type-number'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      const stepperUp = host.querySelector('.stepper-up') as HTMLButtonElement;
      const stepperDown = host.querySelector('.stepper-down') as HTMLButtonElement;

      expect(stepperUp.disabled).toBe(true);
      expect(stepperDown.disabled).toBe(true);
    });
  },
};

export const NumberStepperDisabledWhenReadonly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-type-number'));
    await userEvent.click(canvas.getByTestId('ctl-readonly-on'));

    await waitFor(() => {
      const stepperUp = host.querySelector('.stepper-up') as HTMLButtonElement;

      expect(stepperUp.disabled).toBe(true);
    });
  },
};

export const ClearButtonHiddenWhenShowClearNever: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-value-hello'));

    await waitFor(() => expect(host.querySelector('.clear')).toBeNull());
  },
};

export const ClearButtonRendersWhenShowClearAlwaysAndHasValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-show-clear-always'));
    await userEvent.click(canvas.getByTestId('ctl-value-hello'));

    await waitFor(() => expect(host.querySelector('.clear')).not.toBeNull());
  },
};

export const ClickingClearWipesValueAndEmitsCleared: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-show-clear-always'));
    await userEvent.click(canvas.getByTestId('ctl-value-hello'));

    await waitFor(() => expect(host.querySelector('.clear')).not.toBeNull());

    const clearButton = host.querySelector('.clear button') as HTMLButtonElement;

    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(readout.textContent).toContain('value=""');
      expect(readout.textContent).toContain('clearedCount=1');
    });
  },
};

export const ClearButtonDisabledWhenInputDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-show-clear-always'));
    await userEvent.click(canvas.getByTestId('ctl-value-hello'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      const clearButton = host.querySelector('.clear button') as HTMLButtonElement;

      expect(clearButton.disabled).toBe(true);
    });
  },
};

export const LoadingRendersSpinner: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(host.querySelector('org-loading-spinner')).not.toBeNull());
  },
};

export const InlineItemsRenderAsTags: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');

    await userEvent.click(canvas.getByTestId('ctl-inline-items-two'));

    await waitFor(() => {
      const tags = host.querySelectorAll('.chips org-tag');

      expect(tags.length).toBe(2);
      expect(tags[0].textContent?.trim()).toBe('one');
      expect(tags[1].textContent?.trim()).toBe('two');
    });
  },
};

export const InlineItemRemoveEmitsInlineItemRemoved: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-inline-items-two'));

    await waitFor(() => expect(host.querySelector('.chips org-tag')).not.toBeNull());

    const firstTag = host.querySelector('.chips org-tag') as HTMLElement;
    const removeButton = firstTag.querySelector('button') as HTMLButtonElement;

    await userEvent.click(removeButton);

    await waitFor(() => expect(readout.textContent).toContain('lastRemovedId=one'));
  },
};

export const InlineItemRemoveGatedWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-inline-items-two'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    await expect(readout.textContent).toContain('lastRemovedId=none');
  },
};

export const ProjectedPreTemplateWinsOverPreIcon: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input-pre');

    await expect(host.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
    await expect(host.querySelector('.pre org-icon')).toBeNull();
  },
};

export const ProjectedPostTemplateWinsOverPostIcon: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input-post');

    await expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    await expect(host.querySelector('.post org-icon')).toBeNull();
  },
};

export const ProjectedChipTemplateRendersForEachItem: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input-chip');

    const customChips = host.querySelectorAll('[data-testid="custom-chip"]');

    await expect(customChips.length).toBe(2);
    await expect(customChips[0].textContent?.trim()).toBe('design');
    await expect(customChips[1].textContent?.trim()).toBe('tokens');
  },
};

export const FormFieldValidationMessageSetsErrorState: Story = {
  render: renderFormFieldShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(nativeInput.getAttribute('aria-invalid')).toBeNull();
    await expect(nativeInput.getAttribute('aria-describedby')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-message-set'));

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('error');
      expect(nativeInput.getAttribute('aria-invalid')).toBe('true');
      expect(nativeInput.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
    });

    await userEvent.click(canvas.getByTestId('ctl-message-clear'));

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBeNull();
      expect(nativeInput.getAttribute('aria-invalid')).toBeNull();
      expect(nativeInput.getAttribute('aria-describedby')).toBeNull();
    });
  },
};

export const ReactiveFormWritesInitialValueToNativeInput: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await waitFor(() => expect(nativeInput.value).toBe('initial'));
  },
};

export const ReactiveFormTypingUpdatesFormControl: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(nativeInput);
    await userEvent.clear(nativeInput);
    await userEvent.type(nativeInput, 'updated');

    await waitFor(() => expect(readout.textContent).toContain('value="updated"'));
  },
};

export const ReactiveFormBlurMarksControlTouched: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    const readout = await canvas.findByTestId('readout');

    nativeInput.focus();
    nativeInput.blur();

    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};

export const ReactiveFormSetValueWritesToNativeInput: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-form-set-hello'));

    await waitFor(() => expect(nativeInput.value).toBe('hello'));
  },
};

export const ReactiveFormDisableReflectsInNativeInput: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('input');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      expect(nativeInput.disabled).toBe(true);
      expect(host.getAttribute('data-disabled')).toBe('');
    });

    await userEvent.click(canvas.getByTestId('ctl-form-enable'));

    await waitFor(() => {
      expect(nativeInput.disabled).toBe(false);
      expect(host.getAttribute('data-disabled')).toBeNull();
    });
  },
};
