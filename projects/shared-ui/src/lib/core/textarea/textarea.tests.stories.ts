import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { FormField } from '../form-fields/form-field';
import { Textarea, type TextareaVariant } from './textarea';
import { TextareaToolbar } from './textarea-toolbar';
import { TextareaToolbarItem } from './textarea-toolbar-item';

@Component({
  selector: 'story-textarea-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Textarea],
  host: { class: 'block' },
  template: `
    <org-textarea
      data-testid="textarea"
      #textareaRef
      [name]="name()"
      [variant]="variant()"
      [placeholder]="placeholder()"
      [(value)]="value"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [loading]="loading()"
      [autoFocus]="autoFocus()"
      [selectAllOnFocus]="selectAllOnFocus()"
      [inverseEnter]="inverseEnter()"
      [minLines]="minLines()"
      [maxLines]="maxLines()"
      (focused)="handleFocused()"
      (blurred)="handleBlurred()"
      (submitKeyPressed)="handleSubmitKeyPressed()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-variant-borderless" (click)="variant.set('borderless')">
        variant-borderless
      </button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-readonly-on" (click)="readonly.set(true)">readonly-on</button>
      <button type="button" data-testid="ctl-readonly-off" (click)="readonly.set(false)">readonly-off</button>
      <button type="button" data-testid="ctl-loading-on" (click)="loading.set(true)">loading-on</button>
      <button type="button" data-testid="ctl-loading-off" (click)="loading.set(false)">loading-off</button>
      <button type="button" data-testid="ctl-auto-focus-on" (click)="autoFocus.set(true)">auto-focus-on</button>
      <button type="button" data-testid="ctl-select-all-on" (click)="selectAllOnFocus.set(true)">select-all-on</button>
      <button type="button" data-testid="ctl-inverse-enter-on" (click)="inverseEnter.set(true)">
        inverse-enter-on
      </button>
      <button type="button" data-testid="ctl-min-lines-6" (click)="minLines.set(6)">min-lines-6</button>
      <button type="button" data-testid="ctl-max-lines-12" (click)="maxLines.set(12)">max-lines-12</button>
      <button type="button" data-testid="ctl-value-hello" (click)="value.set('hello')">value-hello</button>
      <button type="button" data-testid="ctl-value-clear" (click)="value.set('')">value-clear</button>
      <button type="button" data-testid="ctl-api-focus" (click)="textareaRef.focusInput()">api-focus</button>
      <button type="button" data-testid="ctl-api-blur" (click)="textareaRef.blurInput()">api-blur</button>
    </div>
  `,
})
class StoryTextareaTestsShell {
  protected readonly name = signal<string>('textarea-test');
  protected readonly variant = signal<TextareaVariant>('bordered');
  protected readonly placeholder = signal<string>('Type something');
  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);
  protected readonly readonly = signal<boolean>(false);
  protected readonly loading = signal<boolean>(false);
  protected readonly autoFocus = signal<boolean>(false);
  protected readonly selectAllOnFocus = signal<boolean>(false);
  protected readonly inverseEnter = signal<boolean>(false);
  protected readonly minLines = signal<number>(3);
  protected readonly maxLines = signal<number>(8);

  protected readonly focusedCount = signal<number>(0);
  protected readonly blurredCount = signal<number>(0);
  protected readonly submitKeyCount = signal<number>(0);

  protected readout(): string {
    return [
      `value="${this.value()}"`,
      `focusedCount=${this.focusedCount()}`,
      `blurredCount=${this.blurredCount()}`,
      `submitKeyCount=${this.submitKeyCount()}`,
    ].join(' ');
  }

  protected handleFocused(): void {
    this.focusedCount.update((value) => value + 1);
  }

  protected handleBlurred(): void {
    this.blurredCount.update((value) => value + 1);
  }

  protected handleSubmitKeyPressed(): void {
    this.submitKeyCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-textarea-with-toolbar-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Textarea, TextareaToolbar],
  host: { class: 'block' },
  template: `
    <org-textarea data-testid="textarea" name="textarea-with-toolbar">
      <org-textarea-toolbar />
    </org-textarea>
  `,
})
class StoryTextareaWithToolbarShell {}

@Component({
  selector: 'story-textarea-toolbar-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaToolbar, TextareaToolbarItem],
  host: { class: 'block' },
  template: `
    <org-textarea-toolbar
      data-testid="toolbar"
      [showSendButton]="showSendButton()"
      [sendDisabled]="sendDisabled()"
      [sendAriaLabel]="sendAriaLabel()"
      [showHint]="showHint()"
      [hintLabel]="hintLabel()"
      [hintKey]="hintKey()"
      (sendClicked)="handleSendClicked()"
    >
      @if (showLeftItems()) {
        <org-textarea-toolbar-item>
          <button type="button" data-testid="left-item-one">left-one</button>
        </org-textarea-toolbar-item>
        <org-textarea-toolbar-item>
          <button type="button" data-testid="left-item-two">left-two</button>
        </org-textarea-toolbar-item>
      }
      @if (showRightItems()) {
        <button toolbar-right type="button" data-testid="right-item-one">right-one</button>
      }
    </org-textarea-toolbar>
    <pre data-testid="readout">sendClickedCount={{ sendClickedCount() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-show-send-off" (click)="showSendButton.set(false)">show-send-off</button>
      <button type="button" data-testid="ctl-send-disabled-on" (click)="sendDisabled.set(true)">
        send-disabled-on
      </button>
      <button type="button" data-testid="ctl-send-aria-label-set" (click)="sendAriaLabel.set('submit reply')">
        send-aria-label-set
      </button>
      <button type="button" data-testid="ctl-show-hint-on" (click)="showHint.set(true)">show-hint-on</button>
      <button type="button" data-testid="ctl-hint-label-set" (click)="hintLabel.set('to send · ⇧↵ for new line')">
        hint-label-set
      </button>
      <button type="button" data-testid="ctl-hint-key-set" (click)="hintKey.set('⌘↵')">hint-key-set</button>
      <button type="button" data-testid="ctl-left-items-on" (click)="showLeftItems.set(true)">left-items-on</button>
      <button type="button" data-testid="ctl-right-items-on" (click)="showRightItems.set(true)">right-items-on</button>
    </div>
  `,
})
class StoryTextareaToolbarTestsShell {
  protected readonly showSendButton = signal<boolean>(true);
  protected readonly sendDisabled = signal<boolean>(false);
  protected readonly sendAriaLabel = signal<string>('send');
  protected readonly showHint = signal<boolean>(false);
  protected readonly hintLabel = signal<string>('to send');
  protected readonly hintKey = signal<string>('↵');
  protected readonly showLeftItems = signal<boolean>(false);
  protected readonly showRightItems = signal<boolean>(false);

  protected readonly sendClickedCount = signal<number>(0);

  protected handleSendClicked(): void {
    this.sendClickedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-textarea-form-field-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Textarea, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="message()">
      <org-textarea data-testid="textarea" name="form-field-textarea" value="something" />
    </org-form-field>
    <button type="button" data-testid="ctl-message-set" (click)="message.set('Description is required')">
      message-set
    </button>
    <button type="button" data-testid="ctl-message-clear" (click)="message.set('')">message-clear</button>
  `,
})
class StoryTextareaFormFieldShell {
  protected readonly message = signal<string>('');
}

@Component({
  selector: 'story-textarea-reactive-form-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Textarea, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form">
      <org-textarea data-testid="textarea" name="reactive-form-textarea" formControlName="text" />
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
class StoryTextareaReactiveFormShell {
  protected readonly form = new FormGroup({
    text: new FormControl<string>('initial', { nonNullable: true }),
  });
}

const meta: Meta = {
  title: 'Core/Components/Textarea/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-textarea-tests-shell />`,
  moduleMetadata: { imports: [StoryTextareaTestsShell] },
});

const renderWithToolbarShell: Story['render'] = () => ({
  template: `<story-textarea-with-toolbar-shell />`,
  moduleMetadata: { imports: [StoryTextareaWithToolbarShell] },
});

const renderToolbarShell: Story['render'] = () => ({
  template: `<story-textarea-toolbar-tests-shell />`,
  moduleMetadata: { imports: [StoryTextareaToolbarTestsShell] },
});

const renderFormFieldShell: Story['render'] = () => ({
  template: `<story-textarea-form-field-shell />`,
  moduleMetadata: { imports: [StoryTextareaFormFieldShell] },
});

const renderReactiveFormShell: Story['render'] = () => ({
  template: `<story-textarea-reactive-form-shell />`,
  moduleMetadata: { imports: [StoryTextareaReactiveFormShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');

    await expect(host.getAttribute('data-variant')).toBe('bordered');
    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('data-readonly')).toBeNull();
    await expect(host.getAttribute('data-loading')).toBeNull();
    await expect(host.getAttribute('data-has-toolbar')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const ReflectsVariantHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');

    await userEvent.click(canvas.getByTestId('ctl-variant-borderless'));

    await waitFor(() => expect(host.getAttribute('data-variant')).toBe('borderless'));
  },
};

export const TogglesDataDisabledAndAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');

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
    const host = await canvas.findByTestId('textarea');

    await userEvent.click(canvas.getByTestId('ctl-readonly-on'));

    await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-readonly-off'));

    await waitFor(() => expect(host.getAttribute('data-readonly')).toBeNull());
  },
};

export const TogglesDataLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(host.getAttribute('data-loading')).toBe(''));
  },
};

export const LoadingDoesNotSetDataReadonlyAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(host.getAttribute('data-loading')).toBe(''));

    await expect(host.getAttribute('data-readonly')).toBeNull();
  },
};

export const ReflectsMinLinesAndMaxLinesAsStyleVariables: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');

    await expect(host.style.getPropertyValue('--textarea-min-lines')).toBe('3');
    await expect(host.style.getPropertyValue('--textarea-max-lines')).toBe('8');

    await userEvent.click(canvas.getByTestId('ctl-min-lines-6'));
    await userEvent.click(canvas.getByTestId('ctl-max-lines-12'));

    await waitFor(() => {
      expect(host.style.getPropertyValue('--textarea-min-lines')).toBe('6');
      expect(host.style.getPropertyValue('--textarea-max-lines')).toBe('12');
    });
  },
};

export const ForwardsNameToNativeTextareaAsNameAndId: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await expect(nativeTextarea.getAttribute('name')).toBe('textarea-test');
    await expect(nativeTextarea.getAttribute('id')).toBe('textarea-test');
  },
};

export const ForwardsPlaceholderToNativeTextarea: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await expect(nativeTextarea.getAttribute('placeholder')).toBe('Type something');
  },
};

export const ForwardsDisabledToNativeTextarea: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await expect(nativeTextarea.disabled).toBe(false);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(nativeTextarea.disabled).toBe(true));
  },
};

export const ForwardsReadonlyToNativeTextarea: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-readonly-on'));

    await waitFor(() => expect(nativeTextarea.readOnly).toBe(true));
  },
};

export const LoadingForcesNativeReadonly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(nativeTextarea.readOnly).toBe(true));
  },
};

export const ForwardsAriaDisabledToNativeTextareaWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(nativeTextarea.getAttribute('aria-disabled')).toBe('true'));
  },
};

export const TypingUpdatesValueModel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(nativeTextarea);
    await userEvent.type(nativeTextarea, 'hi');

    await waitFor(() => expect(readout.textContent).toContain('value="hi"'));
  },
};

export const ExternalValueWritesToNativeTextarea: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-value-hello'));

    await waitFor(() => expect(nativeTextarea.value).toBe('hello'));
  },
};

export const FocusEmitsFocusedAndBlurEmitsBlurred: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    nativeTextarea.focus();

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

    nativeTextarea.blur();

    await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
  },
};

export const SelectAllOnFocusSelectsExistingText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-value-hello'));
    await userEvent.click(canvas.getByTestId('ctl-select-all-on'));

    nativeTextarea.focus();

    await waitFor(() => {
      expect(nativeTextarea.selectionStart).toBe(0);
      expect(nativeTextarea.selectionEnd).toBe('hello'.length);
    });
  },
};

export const AutoFocusFocusesNativeTextareaWhenFlippedOn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-auto-focus-on'));

    await waitFor(() => expect(document.activeElement).toBe(nativeTextarea));
  },
};

export const ProgrammaticFocusAndBlurApi: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-api-focus'));

    await waitFor(() => expect(document.activeElement).toBe(nativeTextarea));

    await userEvent.click(canvas.getByTestId('ctl-api-blur'));

    await waitFor(() => expect(document.activeElement).not.toBe(nativeTextarea));
  },
};

export const ProgrammaticFocusGatedWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await userEvent.click(canvas.getByTestId('ctl-api-focus'));

    await expect(document.activeElement).not.toBe(nativeTextarea);
  },
};

export const SubmitKeyEmitsOnShiftEnterByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    nativeTextarea.focus();
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');

    await waitFor(() => expect(readout.textContent).toContain('submitKeyCount=1'));
  },
};

export const SubmitKeyDoesNotEmitOnPlainEnterByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    nativeTextarea.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    await expect(readout.textContent).toContain('submitKeyCount=0');
  },
};

export const SubmitKeyEmitsOnPlainEnterWhenInverseEnter: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-inverse-enter-on'));

    nativeTextarea.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('submitKeyCount=1'));
  },
};

export const SubmitKeyDoesNotEmitOnShiftEnterWhenInverseEnter: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-inverse-enter-on'));

    nativeTextarea.focus();
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    await expect(readout.textContent).toContain('submitKeyCount=0');
  },
};

export const SubmitKeyDoesNotEmitOnNonEnterKeys: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    nativeTextarea.focus();
    await userEvent.keyboard('{Shift>}a{/Shift}');
    await userEvent.keyboard('{Tab}');

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    await expect(readout.textContent).toContain('submitKeyCount=0');
  },
};

export const ReflectsHasToolbarWhenToolbarProjected: Story = {
  render: renderWithToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');

    await expect(host.getAttribute('data-has-toolbar')).toBe('');
  },
};

export const ToolbarRendersSendButtonByDefault: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement | null;

    await expect(sendButton).not.toBeNull();
    await expect(sendButton?.getAttribute('aria-label')).toBe('send');
  },
};

export const ToolbarHidesSendButtonWhenShowSendButtonFalse: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    await userEvent.click(canvas.getByTestId('ctl-show-send-off'));

    await waitFor(() => expect(toolbar.querySelector('.right button')).toBeNull());
  },
};

export const ToolbarAppliesCustomSendAriaLabel: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    await userEvent.click(canvas.getByTestId('ctl-send-aria-label-set'));

    await waitFor(() => {
      const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement;

      expect(sendButton.getAttribute('aria-label')).toBe('submit reply');
    });
  },
};

export const ToolbarHidesHintByDefault: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    await expect(toolbar.querySelector('.hint')).toBeNull();
  },
};

export const ToolbarRendersHintWhenShowHintTrue: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    await userEvent.click(canvas.getByTestId('ctl-show-hint-on'));

    await waitFor(() => {
      const hint = toolbar.querySelector('.hint') as HTMLElement;

      expect(hint).not.toBeNull();
      expect(hint.querySelector('kbd')?.textContent?.trim()).toBe('↵');
      expect(hint.textContent).toContain('to send');
    });
  },
};

export const ToolbarReflectsCustomHintLabelAndHintKey: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    await userEvent.click(canvas.getByTestId('ctl-show-hint-on'));
    await userEvent.click(canvas.getByTestId('ctl-hint-label-set'));
    await userEvent.click(canvas.getByTestId('ctl-hint-key-set'));

    await waitFor(() => {
      const hint = toolbar.querySelector('.hint') as HTMLElement;

      expect(hint.querySelector('kbd')?.textContent?.trim()).toBe('⌘↵');
      expect(hint.textContent).toContain('to send · ⇧↵ for new line');
    });
  },
};

export const ToolbarSendClickedEmitsWhenSendButtonClicked: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');
    const readout = await canvas.findByTestId('readout');

    const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement;

    await userEvent.click(sendButton);

    await waitFor(() => expect(readout.textContent).toContain('sendClickedCount=1'));
  },
};

export const ToolbarSendClickedDoesNotEmitWhenSendDisabled: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-send-disabled-on'));

    await waitFor(() => {
      const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement;

      expect(sendButton.disabled).toBe(true);
    });

    const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement;
    sendButton.click();

    await expect(readout.textContent).toContain('sendClickedCount=0');
  },
};

export const ToolbarProjectsDefaultSlotItemsIntoLeftRegion: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    await userEvent.click(canvas.getByTestId('ctl-left-items-on'));

    await waitFor(() => {
      const leftRegion = toolbar.querySelector('.left') as HTMLElement;
      const projectedItems = leftRegion.querySelectorAll('org-textarea-toolbar-item');

      expect(projectedItems.length).toBe(2);
      expect(leftRegion.querySelector('[data-testid="left-item-one"]')).not.toBeNull();
      expect(leftRegion.querySelector('[data-testid="left-item-two"]')).not.toBeNull();
    });
  },
};

export const ToolbarProjectsToolbarRightSlotIntoRightRegion: Story = {
  render: renderToolbarShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = await canvas.findByTestId('toolbar');

    await userEvent.click(canvas.getByTestId('ctl-right-items-on'));

    await waitFor(() => {
      const rightRegion = toolbar.querySelector('.right') as HTMLElement;

      expect(rightRegion.querySelector('[data-testid="right-item-one"]')).not.toBeNull();
    });
  },
};

export const FormFieldValidationMessageSetsErrorStateAndAriaInvalid: Story = {
  render: renderFormFieldShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(nativeTextarea.getAttribute('aria-invalid')).toBeNull();
    await expect(nativeTextarea.getAttribute('aria-describedby')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-message-set'));

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBe('error');
      expect(nativeTextarea.getAttribute('aria-invalid')).toBe('true');
      expect(nativeTextarea.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
    });

    await userEvent.click(canvas.getByTestId('ctl-message-clear'));

    await waitFor(() => {
      expect(host.getAttribute('data-state')).toBeNull();
      expect(nativeTextarea.getAttribute('aria-invalid')).toBeNull();
      expect(nativeTextarea.getAttribute('aria-describedby')).toBeNull();
    });
  },
};

export const ReactiveFormWritesInitialValueToNativeTextarea: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await waitFor(() => expect(nativeTextarea.value).toBe('initial'));
  },
};

export const ReactiveFormTypingUpdatesFormControl: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(nativeTextarea);
    await userEvent.clear(nativeTextarea);
    await userEvent.type(nativeTextarea, 'updated');

    await waitFor(() => expect(readout.textContent).toContain('value="updated"'));
  },
};

export const ReactiveFormBlurMarksControlTouched: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;
    const readout = await canvas.findByTestId('readout');

    nativeTextarea.focus();
    nativeTextarea.blur();

    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};

export const ReactiveFormSetValueWritesToNativeTextarea: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-form-set-hello'));

    await waitFor(() => expect(nativeTextarea.value).toBe('hello'));
  },
};

export const ReactiveFormDisableReflectsInNativeTextareaAndHost: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('textarea');
    const nativeTextarea = host.querySelector('textarea.native') as HTMLTextAreaElement;

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      expect(nativeTextarea.disabled).toBe(true);
      expect(host.getAttribute('data-disabled')).toBe('');
    });

    await userEvent.click(canvas.getByTestId('ctl-form-enable'));

    await waitFor(() => {
      expect(nativeTextarea.disabled).toBe(false);
      expect(host.getAttribute('data-disabled')).toBeNull();
    });
  },
};
