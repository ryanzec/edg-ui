import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type ButtonSize } from '../button/button';
import { ButtonToggle, type ButtonToggleItem } from './button-toggle';

const defaultItems: ButtonToggleItem[] = [
  { label: 'Left', value: 'left', buttonColor: 'primary' },
  { label: 'Center', value: 'center', buttonColor: 'primary' },
  { label: 'Right', value: 'right', buttonColor: 'primary' },
];

const itemsWithDisabled: ButtonToggleItem[] = [
  { label: 'Left', value: 'left', buttonColor: 'primary' },
  { label: 'Center', value: 'center', buttonColor: 'primary', buttonDisabled: true },
  { label: 'Right', value: 'right', buttonColor: 'primary' },
];

@Component({
  selector: 'story-button-toggle-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonToggle],
  host: { class: 'block' },
  template: `
    <org-button-toggle
      data-testid="toggle"
      [items]="items()"
      [value]="value()"
      [disabled]="disabled()"
      [fullWidth]="fullWidth()"
      [buttonSize]="buttonSize()"
      (changed)="handleChanged($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-value-left" (click)="value.set('left')">value-left</button>
      <button type="button" data-testid="ctl-value-center" (click)="value.set('center')">value-center</button>
      <button type="button" data-testid="ctl-value-right" (click)="value.set('right')">value-right</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-full-width-on" (click)="fullWidth.set(true)">full-width-on</button>
      <button type="button" data-testid="ctl-full-width-off" (click)="fullWidth.set(false)">full-width-off</button>
      <button type="button" data-testid="ctl-items-empty" (click)="items.set([])">items-empty</button>
      <button type="button" data-testid="ctl-items-with-disabled" (click)="items.set(itemsWithDisabledList)">
        items-with-disabled
      </button>
      <button type="button" data-testid="ctl-items-default" (click)="items.set(defaultItemsList)">items-default</button>
    </div>
  `,
})
class StoryButtonToggleTestsShell {
  protected readonly defaultItemsList = defaultItems;
  protected readonly itemsWithDisabledList = itemsWithDisabled;

  protected readonly items = signal<ButtonToggleItem[]>(defaultItems);
  protected readonly value = signal<string>('center');
  protected readonly disabled = signal<boolean>(false);
  protected readonly fullWidth = signal<boolean>(false);
  protected readonly buttonSize = signal<ButtonSize>('base');

  protected readonly changedCount = signal<number>(0);
  protected readonly lastChangedValue = signal<string>('');

  protected readout(): string {
    return `changedCount=${this.changedCount()} lastChangedValue=${this.lastChangedValue()}`;
  }

  protected handleChanged(value: string): void {
    this.changedCount.update((count) => count + 1);
    this.lastChangedValue.set(value);
  }
}

@Component({
  selector: 'story-button-toggle-reactive-form-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonToggle, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-button-toggle data-testid="toggle" [items]="items" [formControl]="formControl" />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-form-set-left" (click)="formControl.setValue('left')">
        form-set-left
      </button>
      <button type="button" data-testid="ctl-form-set-center" (click)="formControl.setValue('center')">
        form-set-center
      </button>
      <button type="button" data-testid="ctl-form-set-right" (click)="formControl.setValue('right')">
        form-set-right
      </button>
      <button type="button" data-testid="ctl-form-set-null" (click)="formControl.setValue(null)">form-set-null</button>
      <button type="button" data-testid="ctl-form-disable" (click)="formControl.disable()">form-disable</button>
      <button type="button" data-testid="ctl-form-enable" (click)="formControl.enable()">form-enable</button>
    </div>
  `,
})
class StoryButtonToggleReactiveFormShell {
  protected readonly items = defaultItems;
  protected readonly formControl = new FormControl<string | null>('center');

  /**
   * subscribes to every form-control event so OnPush change detection re-runs the readout after the cva chain
   * finishes pushing into the formControl. without this, the readout can race the cva _onChange callback and
   * show stale values.
   */
  private readonly _formEvents = toSignal(this.formControl.events, { initialValue: null });

  protected readout(): string {
    this._formEvents();

    return [
      `value=${this.formControl.value}`,
      `disabled=${this.formControl.disabled}`,
      `touched=${this.formControl.touched}`,
    ].join(' ');
  }
}

const meta: Meta = {
  title: 'Core/Components/Button Toggle/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-button-toggle-tests-shell />`,
  moduleMetadata: { imports: [StoryButtonToggleTestsShell] },
});

const renderReactiveShell: Story['render'] = () => ({
  template: `<story-button-toggle-reactive-form-shell />`,
  moduleMetadata: { imports: [StoryButtonToggleReactiveFormShell] },
});

const getInnerButtons = (host: HTMLElement): HTMLButtonElement[] =>
  Array.from(host.querySelectorAll('button')) as HTMLButtonElement[];

export const AppliesRoleGroupOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(host.getAttribute('role')).toBe('group');
  },
};

export const OmitsBooleanHostAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
    await expect(host.getAttribute('data-full-width')).toBeNull();
  },
};

export const SetsDataAndAriaDisabledWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const SetsDataFullWidthWhenFullWidthTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-full-width-on'));

    await waitFor(() => expect(host.getAttribute('data-full-width')).toBe(''));
  },
};

export const RemovesDataFullWidthWhenFullWidthFlipsBack: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-full-width-on'));
    await waitFor(() => expect(host.getAttribute('data-full-width')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-full-width-off'));

    await waitFor(() => expect(host.getAttribute('data-full-width')).toBeNull());
  },
};

export const RendersOneButtonPerItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(getInnerButtons(host)).toHaveLength(defaultItems.length);
  },
};

export const RendersZeroButtonsWhenItemsEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-items-empty'));

    await waitFor(() => expect(getInnerButtons(host)).toHaveLength(0));
  },
};

export const RendersItemLabels: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    const labels = getInnerButtons(host).map((button) => button.textContent?.trim());

    await expect(labels).toEqual(['Left', 'Center', 'Right']);
  },
};

export const MarksMatchingButtonAriaPressed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const buttons = getInnerButtons(host);

    await expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    await expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    await expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
  },
};

export const MovesActiveButtonWhenValueChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-value-right'));

    await waitFor(() => {
      const buttons = getInnerButtons(host);

      expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
      expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
      expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
    });
  },
};

export const DisablesEveryInnerButtonWhenWrapperDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true));
  },
};

export const DisablesOnlyButtonDisabledItemsWhenWrapperEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-items-with-disabled'));

    await waitFor(() => {
      const buttons = getInnerButtons(host);

      expect(buttons[0].disabled).toBe(false);
      expect(buttons[1].disabled).toBe(true);
      expect(buttons[2].disabled).toBe(false);
    });
  },
};

export const EmitsChangedOnNonActiveButtonClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('changedCount=0');

    await userEvent.click(getInnerButtons(host)[2]);

    await waitFor(() => {
      expect(readout.textContent).toContain('changedCount=1');
      expect(readout.textContent).toContain('lastChangedValue=right');
    });
  },
};

export const DoesNotEmitChangedWhenActiveButtonClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getInnerButtons(host)[1]);

    await expect(readout.textContent).toContain('changedCount=0');
  },
};

export const DoesNotEmitChangedWhenWrapperDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true));

    getInnerButtons(host)[2].click();

    await expect(readout.textContent).toContain('changedCount=0');
  },
};

export const MarksInitialFormControlValueAsActive: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const buttons = getInnerButtons(host);

    await expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  },
};

export const UpdatesFormControlValueWhenButtonClicked: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getInnerButtons(host)[2]);

    await waitFor(() => expect(readout.textContent).toContain('value=right'));
  },
};

export const MarksButtonActiveWhenFormControlSetProgrammatically: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-form-set-left'));

    await waitFor(() => {
      const buttons = getInnerButtons(host);

      expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
      expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    });
  },
};

export const PropagatesControlDisableToHostAndInnerButtons: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
      expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true);
    });
  },
};

export const MarksFormControlAsTouchedAfterClick: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('touched=false');

    await userEvent.click(getInnerButtons(host)[2]);

    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};

export const DoesNotEmitChangedWhenFormDisabled: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true));

    getInnerButtons(host)[2].click();

    await expect(readout.textContent).toContain('value=center');
  },
};

export const FallsBackToEmptyStringWhenFormControlSetToNull: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-form-set-null'));

    await waitFor(() => {
      const buttons = getInnerButtons(host);

      expect(buttons.every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true);
    });
  },
};
