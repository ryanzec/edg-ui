import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { FormField } from '../form-fields/form-field';
import { Textarea, type TextareaVariant } from './textarea';
import { TextareaToolbar } from './textarea-toolbar';
import { TextareaToolbarItem } from './textarea-toolbar-item';

@Component({
  selector: 'test-textarea-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Textarea],
  host: { class: 'block' },
  template: `
    <org-textarea
      data-testid="textarea"
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
  `,
})
class TextareaHost {
  public readonly textareaComponent = viewChild.required(Textarea);

  public readonly name = signal<string>('textarea-test');
  public readonly variant = signal<TextareaVariant>('bordered');
  public readonly placeholder = signal<string>('Type something');
  public readonly value = signal<string>('');
  public readonly disabled = signal<boolean>(false);
  public readonly readonly = signal<boolean>(false);
  public readonly loading = signal<boolean>(false);
  public readonly autoFocus = signal<boolean>(false);
  public readonly selectAllOnFocus = signal<boolean>(false);
  public readonly inverseEnter = signal<boolean>(false);
  public readonly minLines = signal<number>(3);
  public readonly maxLines = signal<number>(8);

  public readonly focusedCount = signal<number>(0);
  public readonly blurredCount = signal<number>(0);
  public readonly submitKeyCount = signal<number>(0);

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
  selector: 'test-textarea-with-toolbar-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Textarea, TextareaToolbar],
  host: { class: 'block' },
  template: `
    <org-textarea data-testid="textarea" name="textarea-with-toolbar">
      <org-textarea-toolbar />
    </org-textarea>
  `,
})
class TextareaWithToolbarHost {}

@Component({
  selector: 'test-textarea-toolbar-host',
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
  `,
})
class TextareaToolbarHost {
  public readonly showSendButton = signal<boolean>(true);
  public readonly sendDisabled = signal<boolean>(false);
  public readonly sendAriaLabel = signal<string>('send');
  public readonly showHint = signal<boolean>(false);
  public readonly hintLabel = signal<string>('to send');
  public readonly hintKey = signal<string>('↵');
  public readonly showLeftItems = signal<boolean>(false);
  public readonly showRightItems = signal<boolean>(false);

  public readonly sendClickedCount = signal<number>(0);

  protected handleSendClicked(): void {
    this.sendClickedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-textarea-form-field-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Textarea, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="message()">
      <org-textarea data-testid="textarea" name="form-field-textarea" value="something" />
    </org-form-field>
  `,
})
class TextareaFormFieldHost {
  public readonly message = signal<string>('');
}

@Component({
  selector: 'test-textarea-reactive-form-host',
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
  `,
})
class TextareaReactiveFormHost {
  public readonly form = new FormGroup({
    text: new FormControl<string>('initial', { nonNullable: true }),
  });
}

describe('Textarea (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  const getNativeTextarea = (fixture: ComponentFixture<unknown>): HTMLTextAreaElement => {
    const host = queryByTestId(fixture, 'textarea');

    return host.querySelector('textarea.native') as HTMLTextAreaElement;
  };

  describe('host attributes', () => {
    it('renders the default host attributes', async () => {
      const fixture = createFixture(TextareaHost);
      const host = queryByTestId(fixture, 'textarea');

      await flush(fixture);

      expect(host.getAttribute('data-variant')).toBe('bordered');
      expect(host.getAttribute('data-state')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('data-readonly')).toBeNull();
      expect(host.getAttribute('data-loading')).toBeNull();
      expect(host.getAttribute('data-has-toolbar')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects the variant host attribute', async () => {
      const fixture = createFixture(TextareaHost);
      const host = queryByTestId(fixture, 'textarea');

      fixture.componentInstance.variant.set('borderless');
      await flush(fixture);

      expect(host.getAttribute('data-variant')).toBe('borderless');
    });

    it('toggles data-disabled and aria-disabled', async () => {
      const fixture = createFixture(TextareaHost);
      const host = queryByTestId(fixture, 'textarea');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');

      fixture.componentInstance.disabled.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('toggles data-readonly', async () => {
      const fixture = createFixture(TextareaHost);
      const host = queryByTestId(fixture, 'textarea');

      fixture.componentInstance.readonly.set(true);
      await flush(fixture);
      expect(host.getAttribute('data-readonly')).toBe('');

      fixture.componentInstance.readonly.set(false);
      await flush(fixture);
      expect(host.getAttribute('data-readonly')).toBeNull();
    });

    it('toggles data-loading', async () => {
      const fixture = createFixture(TextareaHost);
      const host = queryByTestId(fixture, 'textarea');

      fixture.componentInstance.loading.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-loading')).toBe('');
    });

    it('does not set the data-readonly attribute when loading', async () => {
      const fixture = createFixture(TextareaHost);
      const host = queryByTestId(fixture, 'textarea');

      fixture.componentInstance.loading.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-loading')).toBe('');
      expect(host.getAttribute('data-readonly')).toBeNull();
    });

    it('reflects minLines and maxLines as style variables', async () => {
      const fixture = createFixture(TextareaHost);
      const host = queryByTestId(fixture, 'textarea');

      await flush(fixture);

      expect(host.style.getPropertyValue('--textarea-min-lines')).toBe('3');
      expect(host.style.getPropertyValue('--textarea-max-lines')).toBe('8');

      fixture.componentInstance.minLines.set(6);
      fixture.componentInstance.maxLines.set(12);
      await flush(fixture);

      expect(host.style.getPropertyValue('--textarea-min-lines')).toBe('6');
      expect(host.style.getPropertyValue('--textarea-max-lines')).toBe('12');
    });
  });

  describe('native textarea forwarding', () => {
    it('forwards name to the native textarea as name and id', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      expect(nativeTextarea.getAttribute('name')).toBe('textarea-test');
      expect(nativeTextarea.getAttribute('id')).toBe('textarea-test');
    });

    it('forwards placeholder to the native textarea', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      expect(nativeTextarea.getAttribute('placeholder')).toBe('Type something');
    });

    it('forwards disabled to the native textarea', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      expect(nativeTextarea.disabled).toBe(false);

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(nativeTextarea.disabled).toBe(true);
    });

    it('forwards readonly to the native textarea', async () => {
      const fixture = createFixture(TextareaHost);

      fixture.componentInstance.readonly.set(true);
      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      expect(nativeTextarea.readOnly).toBe(true);
    });

    it('forces native readonly when loading', async () => {
      const fixture = createFixture(TextareaHost);

      fixture.componentInstance.loading.set(true);
      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      expect(nativeTextarea.readOnly).toBe(true);
    });

    it('forwards aria-disabled to the native textarea when disabled', async () => {
      const fixture = createFixture(TextareaHost);

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      expect(nativeTextarea.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('value handling', () => {
    it('updates the value model when typing', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(nativeTextarea);
      await userEvent.type(nativeTextarea, 'hi');

      await waitFor(() => expect(readout.textContent).toContain('value="hi"'));
    });

    it('writes an external value to the native textarea', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      fixture.componentInstance.value.set('hello');
      await flush(fixture);

      expect(nativeTextarea.value).toBe('hello');
    });
  });

  describe('focus and blur', () => {
    it('emits focused on focus and blurred on blur', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      nativeTextarea.focus();

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

      nativeTextarea.blur();

      await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
    });

    it('selects existing text on focus when selectAllOnFocus is on', async () => {
      const fixture = createFixture(TextareaHost);

      fixture.componentInstance.value.set('hello');
      fixture.componentInstance.selectAllOnFocus.set(true);
      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      nativeTextarea.focus();

      await waitFor(() => {
        expect(nativeTextarea.selectionStart).toBe(0);
        expect(nativeTextarea.selectionEnd).toBe('hello'.length);
      });
    });

    it('auto-focuses the native textarea when autoFocus is flipped on', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      fixture.componentInstance.autoFocus.set(true);
      await flush(fixture);

      await waitFor(() => expect(document.activeElement).toBe(nativeTextarea));
    });

    it('focuses and blurs via the imperative api', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      fixture.componentInstance.textareaComponent().focusInput();
      await flush(fixture);

      await waitFor(() => expect(document.activeElement).toBe(nativeTextarea));

      fixture.componentInstance.textareaComponent().blurInput();
      await flush(fixture);

      await waitFor(() => expect(document.activeElement).not.toBe(nativeTextarea));
    });

    it('gates the programmatic focus api when disabled', async () => {
      const fixture = createFixture(TextareaHost);

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      fixture.componentInstance.textareaComponent().focusInput();
      await flush(fixture);

      expect(document.activeElement).not.toBe(nativeTextarea);
    });
  });

  describe('submit key handling', () => {
    it('emits submitKeyPressed on shift+enter by default', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      nativeTextarea.focus();
      await userEvent.keyboard('{Shift>}{Enter}{/Shift}');

      await waitFor(() => expect(readout.textContent).toContain('submitKeyCount=1'));
    });

    it('does not emit submitKeyPressed on plain enter by default', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      nativeTextarea.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
      expect(readout.textContent).toContain('submitKeyCount=0');
    });

    it('emits submitKeyPressed on plain enter when inverseEnter is on', async () => {
      const fixture = createFixture(TextareaHost);

      fixture.componentInstance.inverseEnter.set(true);
      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      nativeTextarea.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => expect(readout.textContent).toContain('submitKeyCount=1'));
    });

    it('does not emit submitKeyPressed on shift+enter when inverseEnter is on', async () => {
      const fixture = createFixture(TextareaHost);

      fixture.componentInstance.inverseEnter.set(true);
      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      nativeTextarea.focus();
      await userEvent.keyboard('{Shift>}{Enter}{/Shift}');

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
      expect(readout.textContent).toContain('submitKeyCount=0');
    });

    it('does not emit submitKeyPressed on non-enter keys', async () => {
      const fixture = createFixture(TextareaHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      nativeTextarea.focus();
      await userEvent.keyboard('{Shift>}a{/Shift}');
      await userEvent.keyboard('{Tab}');

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
      expect(readout.textContent).toContain('submitKeyCount=0');
    });
  });

  describe('toolbar projection', () => {
    it('reflects data-has-toolbar when a toolbar is projected', async () => {
      const fixture = createFixture(TextareaWithToolbarHost);
      const host = queryByTestId(fixture, 'textarea');

      await flush(fixture);

      expect(host.getAttribute('data-has-toolbar')).toBe('');
    });

    it('renders the send button by default', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      await flush(fixture);

      const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement | null;

      expect(sendButton).not.toBeNull();
      expect(sendButton?.getAttribute('aria-label')).toBe('send');
    });

    it('hides the send button when showSendButton is false', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      fixture.componentInstance.showSendButton.set(false);
      await flush(fixture);

      expect(toolbar.querySelector('.right button')).toBeNull();
    });

    it('applies a custom send aria-label', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      fixture.componentInstance.sendAriaLabel.set('submit reply');
      await flush(fixture);

      const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement;

      expect(sendButton.getAttribute('aria-label')).toBe('submit reply');
    });

    it('hides the hint by default', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      await flush(fixture);

      expect(toolbar.querySelector('.hint')).toBeNull();
    });

    it('renders the hint when showHint is true', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      fixture.componentInstance.showHint.set(true);
      await flush(fixture);

      const hint = toolbar.querySelector('.hint') as HTMLElement;

      expect(hint).not.toBeNull();
      expect(hint.querySelector('kbd')?.textContent?.trim()).toBe('↵');
      expect(hint.textContent).toContain('to send');
    });

    it('reflects a custom hint label and hint key', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      fixture.componentInstance.showHint.set(true);
      fixture.componentInstance.hintLabel.set('to send · ⇧↵ for new line');
      fixture.componentInstance.hintKey.set('⌘↵');
      await flush(fixture);

      const hint = toolbar.querySelector('.hint') as HTMLElement;

      expect(hint.querySelector('kbd')?.textContent?.trim()).toBe('⌘↵');
      expect(hint.textContent).toContain('to send · ⇧↵ for new line');
    });

    it('emits sendClicked when the send button is clicked', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement;
      await userEvent.click(sendButton);

      await waitFor(() => expect(readout.textContent).toContain('sendClickedCount=1'));
    });

    it('does not emit sendClicked when the send button is disabled', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.sendDisabled.set(true);
      await flush(fixture);

      const sendButton = toolbar.querySelector('.right button') as HTMLButtonElement;
      expect(sendButton.disabled).toBe(true);

      sendButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('sendClickedCount=0');
    });

    it('projects default-slot items into the left region', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      fixture.componentInstance.showLeftItems.set(true);
      await flush(fixture);

      const leftRegion = toolbar.querySelector('.left') as HTMLElement;
      const projectedItems = leftRegion.querySelectorAll('org-textarea-toolbar-item');

      expect(projectedItems.length).toBe(2);
      expect(leftRegion.querySelector('[data-testid="left-item-one"]')).not.toBeNull();
      expect(leftRegion.querySelector('[data-testid="left-item-two"]')).not.toBeNull();
    });

    it('projects the toolbar-right slot into the right region', async () => {
      const fixture = createFixture(TextareaToolbarHost);
      const toolbar = queryByTestId(fixture, 'toolbar');

      fixture.componentInstance.showRightItems.set(true);
      await flush(fixture);

      const rightRegion = toolbar.querySelector('.right') as HTMLElement;

      expect(rightRegion.querySelector('[data-testid="right-item-one"]')).not.toBeNull();
    });
  });

  describe('form-field integration', () => {
    it('sets the error state and aria-invalid from a validation message', async () => {
      const fixture = createFixture(TextareaFormFieldHost);
      const host = queryByTestId(fixture, 'textarea');

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      expect(host.getAttribute('data-state')).toBeNull();
      expect(nativeTextarea.getAttribute('aria-invalid')).toBeNull();
      expect(nativeTextarea.getAttribute('aria-describedby')).toBeNull();

      fixture.componentInstance.message.set('Description is required');
      await flush(fixture);

      expect(host.getAttribute('data-state')).toBe('error');
      expect(nativeTextarea.getAttribute('aria-invalid')).toBe('true');
      expect(nativeTextarea.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);

      fixture.componentInstance.message.set('');
      await flush(fixture);

      expect(host.getAttribute('data-state')).toBeNull();
      expect(nativeTextarea.getAttribute('aria-invalid')).toBeNull();
      expect(nativeTextarea.getAttribute('aria-describedby')).toBeNull();
    });
  });

  describe('reactive form integration', () => {
    it('writes the initial form value to the native textarea', async () => {
      const fixture = createFixture(TextareaReactiveFormHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      await waitFor(() => expect(nativeTextarea.value).toBe('initial'));
    });

    it('updates the form control when typing', async () => {
      const fixture = createFixture(TextareaReactiveFormHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(nativeTextarea);
      await userEvent.clear(nativeTextarea);
      await userEvent.type(nativeTextarea, 'updated');

      await waitFor(() => expect(readout.textContent).toContain('value="updated"'));
    });

    it('marks the form control touched on blur', async () => {
      const fixture = createFixture(TextareaReactiveFormHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);
      const readout = queryByTestId(fixture, 'readout');

      nativeTextarea.focus();
      nativeTextarea.blur();

      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });

    it('writes a form setValue to the native textarea', async () => {
      const fixture = createFixture(TextareaReactiveFormHost);

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      fixture.componentInstance.form.controls.text.setValue('hello');
      await flush(fixture);

      await waitFor(() => expect(nativeTextarea.value).toBe('hello'));
    });

    it('reflects a form-control disable in the native textarea and host', async () => {
      const fixture = createFixture(TextareaReactiveFormHost);
      const host = queryByTestId(fixture, 'textarea');

      await flush(fixture);

      const nativeTextarea = getNativeTextarea(fixture);

      fixture.componentInstance.form.controls.text.disable();
      await flush(fixture);

      expect(nativeTextarea.disabled).toBe(true);
      expect(host.getAttribute('data-disabled')).toBe('');

      fixture.componentInstance.form.controls.text.enable();
      await flush(fixture);

      expect(nativeTextarea.disabled).toBe(false);
      expect(host.getAttribute('data-disabled')).toBeNull();
    });
  });
});
