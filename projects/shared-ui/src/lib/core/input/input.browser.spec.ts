import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { type IconName } from '../icon/icon-brain';
import { FormField } from '../form-fields/form-field';
import { Tag } from '../tags/tag';
import { Input, type InputInlineItem, type InputShowClearMode, type InputType, type InputVariant } from './input';

@Component({
  selector: 'test-input-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input],
  host: { class: 'block' },
  template: `
    <org-input
      data-testid="input"
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
      [inlineItems]="inlineItems()"
      (focused)="handleFocused()"
      (blurred)="handleBlurred()"
      (inlineItemRemoved)="handleInlineItemRemoved($event)"
      (cleared)="handleCleared()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class InputInteractiveHost {
  public readonly inputComponent = viewChild.required(Input);

  public readonly name = signal<string>('input-test');
  public readonly variant = signal<InputVariant>('bordered');
  public readonly type = signal<InputType>('text');
  public readonly placeholder = signal<string>('Type something');
  public readonly value = signal<string>('');
  public readonly disabled = signal<boolean>(false);
  public readonly readonly = signal<boolean>(false);
  public readonly loading = signal<boolean>(false);
  public readonly autoFocus = signal<boolean>(false);
  public readonly selectAllOnFocus = signal<boolean>(false);
  public readonly showPasswordToggle = signal<boolean>(false);
  public readonly showClear = signal<InputShowClearMode>('never');
  public readonly autocomplete = signal<string>('off');
  public readonly blockPasswordManager = signal<boolean>(true);
  public readonly asTrigger = signal<boolean>(false);
  public readonly ariaLabel = signal<string | null | undefined>(undefined);
  public readonly ariaExpanded = signal<boolean | null | undefined>(undefined);
  public readonly ariaHasPopup = signal<string | null | undefined>(undefined);
  public readonly ariaAutoComplete = signal<string | null | undefined>(undefined);
  public readonly ariaActiveDescendant = signal<string | null | undefined>(undefined);
  public readonly ariaControls = signal<string | null | undefined>(undefined);
  public readonly inputRole = signal<string | null | undefined>(undefined);
  public readonly preIcon = signal<IconName | null | undefined>(undefined);
  public readonly postIcon = signal<IconName | null | undefined>(undefined);
  public readonly inlineItems = signal<InputInlineItem[]>([]);

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

  public setTwoInlineItems(): void {
    this.inlineItems.set([
      { id: 'one', label: 'one', removable: true },
      { id: 'two', label: 'two', removable: true },
    ]);
  }

  public setAllAriaToNull(): void {
    this.ariaLabel.set(null);
    this.ariaExpanded.set(null);
    this.ariaHasPopup.set(null);
    this.ariaAutoComplete.set(null);
    this.ariaActiveDescendant.set(null);
    this.ariaControls.set(null);
    this.inputRole.set(null);
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
}

@Component({
  selector: 'test-input-output-listeners-host',
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
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class InputOutputListenersHost {
  protected readonly preCount = signal<number>(0);
  protected readonly postCount = signal<number>(0);

  protected readout(): string {
    return `preCount=${this.preCount()} postCount=${this.postCount()}`;
  }

  protected onPreClicked(): void {
    this.preCount.update((value) => value + 1);
  }

  protected onPostClicked(): void {
    this.postCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-input-projection-host',
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
class InputProjectionHost {
  protected readonly chips: InputInlineItem[] = [
    { id: 'a', label: 'design', removable: true },
    { id: 'b', label: 'tokens', removable: true },
  ];
}

@Component({
  selector: 'test-input-form-field-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="message()">
      <org-input data-testid="input" name="form-field-input" value="something" />
    </org-form-field>
  `,
})
class InputFormFieldHost {
  public readonly message = signal<string>('');
}

@Component({
  selector: 'test-input-reactive-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form">
      <org-input data-testid="input" name="reactive-form-input" formControlName="text" />
    </form>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class InputReactiveFormHost {
  public readonly form = new FormGroup({
    text: new FormControl<string>('initial', { nonNullable: true }),
  });

  protected readout(): string {
    return [
      `value="${this.form.controls.text.value}"`,
      `touched=${this.form.controls.text.touched}`,
      `disabled=${this.form.controls.text.disabled}`,
    ].join(' ');
  }
}

type InputHostConfig = {
  name?: string;
  variant?: InputVariant;
  type?: InputType;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  selectAllOnFocus?: boolean;
  showPasswordToggle?: boolean;
  showClear?: InputShowClearMode;
  autocomplete?: string;
  blockPasswordManager?: boolean;
  asTrigger?: boolean;
  preIcon?: IconName;
  postIcon?: IconName;
  inlineItems?: InputInlineItem[];
};

describe('Input (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveInput = (config: InputHostConfig = {}): ComponentFixture<InputInteractiveHost> =>
    createFixture(InputInteractiveHost, (instance) => {
      if (config.name !== undefined) {
        instance.name.set(config.name);
      }

      if (config.variant !== undefined) {
        instance.variant.set(config.variant);
      }

      if (config.type !== undefined) {
        instance.type.set(config.type);
      }

      if (config.placeholder !== undefined) {
        instance.placeholder.set(config.placeholder);
      }

      if (config.value !== undefined) {
        instance.value.set(config.value);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.readonly !== undefined) {
        instance.readonly.set(config.readonly);
      }

      if (config.loading !== undefined) {
        instance.loading.set(config.loading);
      }

      if (config.selectAllOnFocus !== undefined) {
        instance.selectAllOnFocus.set(config.selectAllOnFocus);
      }

      if (config.showPasswordToggle !== undefined) {
        instance.showPasswordToggle.set(config.showPasswordToggle);
      }

      if (config.showClear !== undefined) {
        instance.showClear.set(config.showClear);
      }

      if (config.autocomplete !== undefined) {
        instance.autocomplete.set(config.autocomplete);
      }

      if (config.blockPasswordManager !== undefined) {
        instance.blockPasswordManager.set(config.blockPasswordManager);
      }

      if (config.asTrigger !== undefined) {
        instance.asTrigger.set(config.asTrigger);
      }

      if (config.preIcon !== undefined) {
        instance.preIcon.set(config.preIcon);
      }

      if (config.postIcon !== undefined) {
        instance.postIcon.set(config.postIcon);
      }

      if (config.inlineItems !== undefined) {
        instance.inlineItems.set(config.inlineItems);
      }
    });

  const getNativeInput = (host: HTMLElement): HTMLInputElement =>
    host.querySelector('input.native') as HTMLInputElement;

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  describe('host data attributes', () => {
    it('renders the default host data attributes', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');

      await flush(fixture);

      expect(host.getAttribute('data-variant')).toBe('bordered');
      expect(host.getAttribute('data-type')).toBe('text');
      expect(host.getAttribute('data-show-clear')).toBe('never');
      expect(host.getAttribute('data-state')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('data-readonly')).toBeNull();
      expect(host.getAttribute('data-loading')).toBeNull();
      expect(host.getAttribute('data-as-trigger')).toBeNull();
      expect(host.getAttribute('data-has-value')).toBeNull();
      expect(host.getAttribute('data-has-pre')).toBeNull();
      expect(host.getAttribute('data-has-post')).toBeNull();
      expect(host.getAttribute('data-has-chips')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects the variant and type host attributes', async () => {
      const fixture = createInteractiveInput({ variant: 'inline', type: 'email' });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        expect(host.getAttribute('data-variant')).toBe('inline');
        expect(host.getAttribute('data-type')).toBe('email');
      });
    });

    it('toggles data-disabled and aria-disabled', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');

      fixture.componentInstance.disabled.set(true);

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
      });

      fixture.componentInstance.disabled.set(false);

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBeNull();
        expect(host.getAttribute('aria-disabled')).toBeNull();
      });
    });

    it('toggles data-readonly', async () => {
      const fixture = createInteractiveInput({ readonly: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));
    });

    it('toggles data-loading', async () => {
      const fixture = createInteractiveInput({ loading: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => expect(host.getAttribute('data-loading')).toBe(''));
    });

    it('toggles data-as-trigger', async () => {
      const fixture = createInteractiveInput({ asTrigger: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => expect(host.getAttribute('data-as-trigger')).toBe(''));
    });

    it('reflects data-has-value when a value is present', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');

      fixture.componentInstance.value.set('hello');

      await waitFor(() => expect(host.getAttribute('data-has-value')).toBe(''));

      fixture.componentInstance.value.set('');

      await waitFor(() => expect(host.getAttribute('data-has-value')).toBeNull());
    });

    it('reflects data-has-pre and data-has-post from the icon inputs', async () => {
      const fixture = createInteractiveInput({ preIcon: 'mail', postIcon: 'check' });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        expect(host.getAttribute('data-has-pre')).toBe('');
        expect(host.getAttribute('data-has-post')).toBe('');
      });
    });

    it('reflects data-has-chips with inline items', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');

      fixture.componentInstance.setTwoInlineItems();

      await waitFor(() => expect(host.getAttribute('data-has-chips')).toBe(''));

      fixture.componentInstance.inlineItems.set([]);

      await waitFor(() => expect(host.getAttribute('data-has-chips')).toBeNull());
    });
  });

  describe('native input forwarding', () => {
    it('forwards type, name and id to the native input', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await flush(fixture);

      expect(nativeInput.getAttribute('type')).toBe('text');
      expect(nativeInput.getAttribute('name')).toBe('input-test');
      expect(nativeInput.getAttribute('id')).toBe('input-test');

      fixture.componentInstance.type.set('email');

      await waitFor(() => expect(nativeInput.getAttribute('type')).toBe('email'));
    });

    it('forwards the placeholder to the native input', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await flush(fixture);

      expect(nativeInput.getAttribute('placeholder')).toBe('Type something');
    });

    it('forwards disabled to the native input', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await flush(fixture);
      expect(nativeInput.disabled).toBe(false);

      fixture.componentInstance.disabled.set(true);

      await waitFor(() => expect(nativeInput.disabled).toBe(true));
    });

    it('forwards readonly to the native input', async () => {
      const fixture = createInteractiveInput({ readonly: true });
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await waitFor(() => expect(nativeInput.readOnly).toBe(true));
    });

    it('forces the native input readonly while loading', async () => {
      const fixture = createInteractiveInput({ loading: true });
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await waitFor(() => expect(nativeInput.readOnly).toBe(true));
    });

    it('forces the native input readonly when used as a trigger', async () => {
      const fixture = createInteractiveInput({ asTrigger: true });
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await waitFor(() => expect(nativeInput.readOnly).toBe(true));
    });

    it('forwards autocomplete to the native input', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await flush(fixture);
      expect(nativeInput.getAttribute('autocomplete')).toBe('off');

      fixture.componentInstance.autocomplete.set('email');

      await waitFor(() => expect(nativeInput.getAttribute('autocomplete')).toBe('email'));
    });

    it('sets data-ip-ignore when blockPasswordManager is true', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await flush(fixture);
      expect(nativeInput.getAttribute('data-ip-ignore')).toBe('true');

      fixture.componentInstance.blockPasswordManager.set(false);

      await waitFor(() => expect(nativeInput.getAttribute('data-ip-ignore')).toBeNull());
    });
  });

  describe('a11y attributes', () => {
    it('applies the aria attributes to the native input', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      fixture.componentInstance.ariaLabel.set('search field');
      fixture.componentInstance.ariaExpanded.set(true);
      fixture.componentInstance.ariaHasPopup.set('listbox');
      fixture.componentInstance.ariaAutoComplete.set('list');
      fixture.componentInstance.ariaActiveDescendant.set('opt-3');
      fixture.componentInstance.ariaControls.set('panel-1');
      fixture.componentInstance.inputRole.set('combobox');

      await waitFor(() => {
        expect(nativeInput.getAttribute('aria-label')).toBe('search field');
        expect(nativeInput.getAttribute('aria-expanded')).toBe('true');
        expect(nativeInput.getAttribute('aria-haspopup')).toBe('listbox');
        expect(nativeInput.getAttribute('aria-autocomplete')).toBe('list');
        expect(nativeInput.getAttribute('aria-activedescendant')).toBe('opt-3');
        expect(nativeInput.getAttribute('aria-controls')).toBe('panel-1');
        expect(nativeInput.getAttribute('role')).toBe('combobox');
      });
    });

    it('transforms null aria values to omitted attributes', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      fixture.componentInstance.ariaLabel.set('search field');
      fixture.componentInstance.ariaExpanded.set(true);
      fixture.componentInstance.ariaHasPopup.set('listbox');
      fixture.componentInstance.setAllAriaToNull();

      await waitFor(() => {
        expect(nativeInput.getAttribute('aria-label')).toBeNull();
        expect(nativeInput.getAttribute('aria-expanded')).toBeNull();
        expect(nativeInput.getAttribute('aria-haspopup')).toBeNull();
        expect(nativeInput.getAttribute('aria-autocomplete')).toBeNull();
        expect(nativeInput.getAttribute('aria-activedescendant')).toBeNull();
        expect(nativeInput.getAttribute('aria-controls')).toBeNull();
        expect(nativeInput.getAttribute('role')).toBeNull();
      });
    });
  });

  describe('value and focus', () => {
    it('updates the value model while typing', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(nativeInput);
      await userEvent.type(nativeInput, 'hi');

      await waitFor(() => expect(readout.textContent).toContain('value="hi"'));
    });

    it('writes an external value to the native input', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      fixture.componentInstance.value.set('hello');

      await waitFor(() => expect(nativeInput.value).toBe('hello'));
    });

    it('emits focused and blurred on focus changes', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);
      const readout = queryByTestId(fixture, 'readout');

      nativeInput.focus();

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

      nativeInput.blur();

      await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
    });

    it('selects existing text on focus when selectAllOnFocus is on', async () => {
      const fixture = createInteractiveInput({ value: 'hello', selectAllOnFocus: true });
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      nativeInput.focus();

      await waitFor(() => {
        expect(nativeInput.selectionStart).toBe(0);
        expect(nativeInput.selectionEnd).toBe('hello'.length);
      });
    });

    it('focuses the native input when autoFocus is flipped on', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      fixture.componentInstance.autoFocus.set(true);

      await waitFor(() => expect(document.activeElement).toBe(nativeInput));
    });

    it('focuses and blurs the native input via the public api', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      fixture.componentInstance.inputComponent().focusInput();

      await waitFor(() => expect(document.activeElement).toBe(nativeInput));

      fixture.componentInstance.inputComponent().blurInput();

      await waitFor(() => expect(document.activeElement).not.toBe(nativeInput));
    });

    it('gates the programmatic focus api when disabled', async () => {
      const fixture = createInteractiveInput({ disabled: true });
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await flush(fixture);

      fixture.componentInstance.inputComponent().focusInput();
      await flush(fixture);

      expect(document.activeElement).not.toBe(nativeInput);
    });
  });

  describe('pre and post icons', () => {
    it('renders the pre-icon non-interactive by default', async () => {
      const fixture = createInteractiveInput({ preIcon: 'mail' });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        const preSlot = host.querySelector('.pre');

        expect(preSlot?.querySelector('button')).toBeNull();
        expect(preSlot?.querySelector('span.icon-btn')).not.toBeNull();
        expect(preSlot?.querySelector('org-icon')).not.toBeNull();
      });
    });

    it('renders the pre-icon as a button when a listener is attached', async () => {
      const fixture = createFixture(InputOutputListenersHost);
      const host = queryByTestId(fixture, 'input');

      await flush(fixture);

      const preButton = host.querySelector('.pre button') as HTMLButtonElement | null;

      expect(preButton).not.toBeNull();
      expect(preButton?.getAttribute('aria-label')).toBe('open search');
    });

    it('renders the post-icon non-interactive by default', async () => {
      const fixture = createInteractiveInput({ postIcon: 'check' });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        const postSlot = host.querySelector('.post');

        expect(postSlot?.querySelector('span.icon-btn')).not.toBeNull();
        expect(postSlot?.querySelector('button.icon-btn')).toBeNull();
      });
    });

    it('renders the post-icon as a button when a listener is attached', async () => {
      const fixture = createFixture(InputOutputListenersHost);
      const host = queryByTestId(fixture, 'input');

      await flush(fixture);

      const postButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement | null;

      expect(postButton).not.toBeNull();
      expect(postButton?.getAttribute('aria-label')).toBe('apply');
    });

    it('emits preIconClicked when the pre-icon button is clicked', async () => {
      const fixture = createFixture(InputOutputListenersHost);
      const host = queryByTestId(fixture, 'input');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const preButton = host.querySelector('.pre button') as HTMLButtonElement;
      await userEvent.click(preButton);

      await waitFor(() => expect(readout.textContent).toContain('preCount=1'));
    });

    it('emits postIconClicked when the post-icon button is clicked', async () => {
      const fixture = createFixture(InputOutputListenersHost);
      const host = queryByTestId(fixture, 'input');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const postButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement;
      await userEvent.click(postButton);

      await waitFor(() => expect(readout.textContent).toContain('postCount=1'));
    });
  });

  describe('password toggle', () => {
    it('renders an interactive eye icon for password type with toggle', async () => {
      const fixture = createInteractiveInput({ type: 'password', showPasswordToggle: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        const postButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement | null;

        expect(postButton).not.toBeNull();
        expect(postButton?.getAttribute('aria-label')).toBe('Show password');
        expect(postButton?.querySelector('org-icon')?.getAttribute('data-icon')).toBe('eye');
      });
    });

    it('swaps the native type and icon when the toggle is clicked', async () => {
      const fixture = createInteractiveInput({ type: 'password', showPasswordToggle: true });
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await waitFor(() => expect(nativeInput.getAttribute('type')).toBe('password'));

      await userEvent.click(host.querySelector('.post button.icon-btn') as HTMLButtonElement);

      await waitFor(() => {
        expect(nativeInput.getAttribute('type')).toBe('text');

        const refreshedButton = host.querySelector('.post button.icon-btn') as HTMLButtonElement;

        expect(refreshedButton.getAttribute('aria-label')).toBe('Hide password');
        expect(refreshedButton.querySelector('org-icon')?.getAttribute('data-icon')).toBe('eye-off');
      });

      await userEvent.click(host.querySelector('.post button.icon-btn') as HTMLButtonElement);

      await waitFor(() => expect(nativeInput.getAttribute('type')).toBe('password'));
    });
  });

  describe('number stepper', () => {
    it('renders the stepper for number type', async () => {
      const fixture = createInteractiveInput({ type: 'number' });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        expect(host.querySelector('.stepper-up')).not.toBeNull();
        expect(host.querySelector('.stepper-down')).not.toBeNull();
      });
    });

    it('increments the value via the stepper', async () => {
      const fixture = createInteractiveInput({ type: 'number' });
      const host = queryByTestId(fixture, 'input');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(host.querySelector('.stepper-up')).not.toBeNull());

      await userEvent.click(host.querySelector('.stepper-up') as HTMLButtonElement);

      await waitFor(() => expect(readout.textContent).toContain('value="1"'));
    });

    it('decrements the value via the stepper', async () => {
      const fixture = createInteractiveInput({ type: 'number' });
      const host = queryByTestId(fixture, 'input');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(host.querySelector('.stepper-down')).not.toBeNull());

      await userEvent.click(host.querySelector('.stepper-down') as HTMLButtonElement);

      await waitFor(() => expect(readout.textContent).toContain('value="-1"'));
    });

    it('disables the stepper when the input is disabled', async () => {
      const fixture = createInteractiveInput({ type: 'number', disabled: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        const stepperUp = host.querySelector('.stepper-up') as HTMLButtonElement;
        const stepperDown = host.querySelector('.stepper-down') as HTMLButtonElement;

        expect(stepperUp.disabled).toBe(true);
        expect(stepperDown.disabled).toBe(true);
      });
    });

    it('disables the stepper when the input is readonly', async () => {
      const fixture = createInteractiveInput({ type: 'number', readonly: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        const stepperUp = host.querySelector('.stepper-up') as HTMLButtonElement;

        expect(stepperUp.disabled).toBe(true);
      });
    });
  });

  describe('clear button', () => {
    it('hides the clear button when showClear is never', async () => {
      const fixture = createInteractiveInput({ value: 'hello' });
      const host = queryByTestId(fixture, 'input');

      await flush(fixture);

      expect(host.querySelector('.clear')).toBeNull();
    });

    it('renders the clear button when showClear is always and a value is present', async () => {
      const fixture = createInteractiveInput({ showClear: 'always', value: 'hello' });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => expect(host.querySelector('.clear')).not.toBeNull());
    });

    it('wipes the value and emits cleared when the clear button is clicked', async () => {
      const fixture = createInteractiveInput({ showClear: 'always', value: 'hello' });
      const host = queryByTestId(fixture, 'input');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(host.querySelector('.clear')).not.toBeNull());

      await userEvent.click(host.querySelector('.clear button') as HTMLButtonElement);

      await waitFor(() => {
        expect(readout.textContent).toContain('value=""');
        expect(readout.textContent).toContain('clearedCount=1');
      });
    });

    it('disables the clear button when the input is disabled', async () => {
      const fixture = createInteractiveInput({ showClear: 'always', value: 'hello', disabled: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => {
        const clearButton = host.querySelector('.clear button') as HTMLButtonElement;

        expect(clearButton.disabled).toBe(true);
      });
    });
  });

  describe('loading', () => {
    it('renders the spinner while loading', async () => {
      const fixture = createInteractiveInput({ loading: true });
      const host = queryByTestId(fixture, 'input');

      await waitFor(() => expect(host.querySelector('org-loading-spinner')).not.toBeNull());
    });
  });

  describe('inline items', () => {
    it('renders inline items as tags', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');

      fixture.componentInstance.setTwoInlineItems();

      await waitFor(() => {
        const tags = host.querySelectorAll('.chips org-tag');

        expect(tags.length).toBe(2);
        expect(tags[0].textContent?.trim()).toBe('one');
        expect(tags[1].textContent?.trim()).toBe('two');
      });
    });

    it('emits inlineItemRemoved when an item remove is clicked', async () => {
      const fixture = createInteractiveInput();
      const host = queryByTestId(fixture, 'input');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.setTwoInlineItems();

      await waitFor(() => expect(host.querySelector('.chips org-tag')).not.toBeNull());

      const firstTag = host.querySelector('.chips org-tag') as HTMLElement;
      const removeButton = firstTag.querySelector('button') as HTMLButtonElement;
      await userEvent.click(removeButton);

      await waitFor(() => expect(readout.textContent).toContain('lastRemovedId=one'));
    });

    it('gates inline item removal when disabled', async () => {
      const fixture = createInteractiveInput({ disabled: true });
      const host = queryByTestId(fixture, 'input');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.setTwoInlineItems();

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      expect(readout.textContent).toContain('lastRemovedId=none');
    });
  });

  describe('content projection', () => {
    it('renders the projected pre template over the pre-icon', async () => {
      const fixture = createFixture(InputProjectionHost);
      const host = queryByTestId(fixture, 'input-pre');

      await flush(fixture);

      expect(host.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
      expect(host.querySelector('.pre org-icon')).toBeNull();
    });

    it('renders the projected post template over the post-icon', async () => {
      const fixture = createFixture(InputProjectionHost);
      const host = queryByTestId(fixture, 'input-post');

      await flush(fixture);

      expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
      expect(host.querySelector('.post org-icon')).toBeNull();
    });

    it('renders the projected chip template for each item', async () => {
      const fixture = createFixture(InputProjectionHost);
      const host = queryByTestId(fixture, 'input-chip');

      await flush(fixture);

      const customChips = host.querySelectorAll('[data-testid="custom-chip"]');

      expect(customChips.length).toBe(2);
      expect(customChips[0].textContent?.trim()).toBe('design');
      expect(customChips[1].textContent?.trim()).toBe('tokens');
    });
  });

  describe('form-field integration', () => {
    it('sets the error state from the form-field validation message', async () => {
      const fixture = createFixture(InputFormFieldHost);
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await flush(fixture);

      expect(host.getAttribute('data-state')).toBeNull();
      expect(nativeInput.getAttribute('aria-invalid')).toBeNull();
      expect(nativeInput.getAttribute('aria-describedby')).toBeNull();

      fixture.componentInstance.message.set('Field is required');

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBe('error');
        expect(nativeInput.getAttribute('aria-invalid')).toBe('true');
        expect(nativeInput.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
      });

      fixture.componentInstance.message.set('');

      await waitFor(() => {
        expect(host.getAttribute('data-state')).toBeNull();
        expect(nativeInput.getAttribute('aria-invalid')).toBeNull();
        expect(nativeInput.getAttribute('aria-describedby')).toBeNull();
      });
    });
  });

  describe('reactive form integration', () => {
    it('writes the initial value to the native input', async () => {
      const fixture = createFixture(InputReactiveFormHost);
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      await waitFor(() => expect(nativeInput.value).toBe('initial'));
    });

    it('updates the form control while typing', async () => {
      const fixture = createFixture(InputReactiveFormHost);
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(nativeInput);
      await userEvent.clear(nativeInput);
      await userEvent.type(nativeInput, 'updated');

      await waitFor(() => expect(readout.textContent).toContain('value="updated"'));
    });

    it('marks the control touched on blur', async () => {
      const fixture = createFixture(InputReactiveFormHost);
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);
      const readout = queryByTestId(fixture, 'readout');

      nativeInput.focus();
      nativeInput.blur();

      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });

    it('writes a form-control setValue to the native input', async () => {
      const fixture = createFixture(InputReactiveFormHost);
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      fixture.componentInstance.form.controls.text.setValue('hello');

      await waitFor(() => expect(nativeInput.value).toBe('hello'));
    });

    it('reflects a form-control disable in the native input', async () => {
      const fixture = createFixture(InputReactiveFormHost);
      const host = queryByTestId(fixture, 'input');
      const nativeInput = getNativeInput(host);

      fixture.componentInstance.form.controls.text.disable();

      await waitFor(() => {
        expect(nativeInput.disabled).toBe(true);
        expect(host.getAttribute('data-disabled')).toBe('');
      });

      fixture.componentInstance.form.controls.text.enable();

      await waitFor(() => {
        expect(nativeInput.disabled).toBe(false);
        expect(host.getAttribute('data-disabled')).toBeNull();
      });
    });
  });
});
