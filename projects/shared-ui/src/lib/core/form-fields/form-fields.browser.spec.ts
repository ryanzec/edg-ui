import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { FormField, type FormFieldLabelOrientation } from './form-field';
import { FormFields } from './form-fields';

@Component({
  selector: 'test-form-field-standalone-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, Label, Input],
  host: { class: 'block' },
  template: `
    <org-form-field
      data-testid="form-field"
      [labelOrientation]="labelOrientation()"
      [reserveValidationSpace]="reserveValidationSpace()"
      [validationMessage]="validationMessage()"
    >
      <org-label text="Email" htmlFor="standalone-email" />
      <org-input name="standalone-email" data-testid="projected-input" />
    </org-form-field>
  `,
})
class FormFieldStandaloneHost {
  public readonly labelOrientation = signal<FormFieldLabelOrientation | undefined>(undefined);
  public readonly reserveValidationSpace = signal<boolean | undefined>(undefined);
  public readonly validationMessage = signal<string | undefined>(undefined);
}

@Component({
  selector: 'test-form-field-with-parent-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormFields, FormField, Label, Input],
  host: { class: 'block' },
  template: `
    <org-form-fields
      data-testid="form-fields"
      [labelOrientation]="parentLabelOrientation()"
      [reserveValidationSpace]="parentReserveValidationSpace()"
      [orientation]="parentOrientation()"
    >
      <org-form-field
        data-testid="form-field"
        [labelOrientation]="childLabelOrientation()"
        [reserveValidationSpace]="childReserveValidationSpace()"
        [validationMessage]="childValidationMessage()"
      >
        <org-label text="Email" htmlFor="with-parent-email" />
        <org-input name="with-parent-email" />
      </org-form-field>
    </org-form-fields>
  `,
})
class FormFieldWithParentHost {
  public readonly parentLabelOrientation = signal<FormFieldLabelOrientation>('vertical');
  public readonly parentReserveValidationSpace = signal<boolean>(false);
  public readonly parentOrientation = signal<FormFieldLabelOrientation>('vertical');
  public readonly childLabelOrientation = signal<FormFieldLabelOrientation | undefined>(undefined);
  public readonly childReserveValidationSpace = signal<boolean | undefined>(undefined);
  public readonly childValidationMessage = signal<string | undefined>(undefined);
}

@Component({
  selector: 'test-form-fields-multiple-children-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormFields, FormField, Label, Input],
  host: { class: 'block' },
  template: `
    <org-form-fields
      data-testid="form-fields"
      [labelOrientation]="labelOrientation()"
      [reserveValidationSpace]="reserveValidationSpace()"
    >
      <org-form-field data-testid="form-field-one">
        <org-label text="First Name" htmlFor="multi-first-name" />
        <org-input name="multi-first-name" />
      </org-form-field>
      <org-form-field data-testid="form-field-two">
        <org-label text="Last Name" htmlFor="multi-last-name" />
        <org-input name="multi-last-name" />
      </org-form-field>
    </org-form-fields>
  `,
})
class FormFieldsMultipleChildrenHost {
  public readonly labelOrientation = signal<FormFieldLabelOrientation>('vertical');
  public readonly reserveValidationSpace = signal<boolean>(false);
}

type StandaloneHostConfig = {
  labelOrientation?: FormFieldLabelOrientation;
  reserveValidationSpace?: boolean;
  validationMessage?: string;
};

const VALIDATION_ID_PATTERN = /^form-field-validation-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('Form Fields (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createStandalone = (config: StandaloneHostConfig = {}): ComponentFixture<FormFieldStandaloneHost> =>
    createFixture(FormFieldStandaloneHost, (instance) => {
      if (config.labelOrientation !== undefined) {
        instance.labelOrientation.set(config.labelOrientation);
      }

      if (config.reserveValidationSpace !== undefined) {
        instance.reserveValidationSpace.set(config.reserveValidationSpace);
      }

      if (config.validationMessage !== undefined) {
        instance.validationMessage.set(config.validationMessage);
      }
    });

  const queryValidation = (host: HTMLElement): HTMLElement | null => host.querySelector('.form-field-validation');

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('label orientation', () => {
    it('defaults the standalone label orientation to vertical', () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      expect(host.getAttribute('data-label-orientation')).toBe('vertical');
    });

    it('reflects an explicit horizontal label orientation', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.labelOrientation.set('horizontal');
      await flush(fixture);

      expect(host.getAttribute('data-label-orientation')).toBe('horizontal');
    });

    it('inherits the label orientation from the parent', async () => {
      const fixture = createFixture(FormFieldWithParentHost);
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.parentLabelOrientation.set('horizontal');
      await flush(fixture);

      expect(host.getAttribute('data-label-orientation')).toBe('horizontal');
    });

    it('lets a per-field label orientation override the parent and revert when cleared', async () => {
      const fixture = createFixture(FormFieldWithParentHost);
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.parentLabelOrientation.set('horizontal');
      fixture.componentInstance.childLabelOrientation.set('vertical');
      await flush(fixture);

      expect(host.getAttribute('data-label-orientation')).toBe('vertical');

      fixture.componentInstance.childLabelOrientation.set(undefined);
      await flush(fixture);

      expect(host.getAttribute('data-label-orientation')).toBe('horizontal');
    });
  });

  describe('validation message rendering', () => {
    it('omits the validation div when there is no message and reserve is off', () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      expect(queryValidation(host)).toBeNull();
    });

    it('renders the validation message text', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('field is required');
      await flush(fixture);

      expect(queryValidation(host)?.textContent?.trim()).toBe('field is required');
    });

    it('updates the validation div when the message changes', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('field is required');
      await flush(fixture);

      expect(queryValidation(host)?.textContent?.trim()).toBe('field is required');

      fixture.componentInstance.validationMessage.set('must be a valid email');
      await flush(fixture);

      expect(queryValidation(host)?.textContent?.trim()).toBe('must be a valid email');
    });

    it('does not set data-has-message for a whitespace-only message', async () => {
      // reserve must be on so the validation div is in the dom while the message is whitespace
      const fixture = createStandalone({ reserveValidationSpace: true });
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('   ');
      await flush(fixture);

      const validation = queryValidation(host);

      expect(validation).not.toBeNull();
      expect(validation?.getAttribute('data-has-message')).toBeNull();
      expect(validation?.textContent?.trim()).toBe('');
    });
  });

  describe('a11y attributes', () => {
    it('sets aria-live to polite on the validation div', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('field is required');
      await flush(fixture);

      expect(queryValidation(host)?.getAttribute('aria-live')).toBe('polite');
    });

    it('sets aria-atomic to true on the validation div', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('field is required');
      await flush(fixture);

      expect(queryValidation(host)?.getAttribute('aria-atomic')).toBe('true');
    });

    it('sets data-has-message when a message is present', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('field is required');
      await flush(fixture);

      expect(queryValidation(host)?.getAttribute('data-has-message')).toBe('');
    });

    it('omits data-has-message when reserved but empty', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.reserveValidationSpace.set(true);
      await flush(fixture);

      const validation = queryValidation(host);

      expect(validation).not.toBeNull();
      expect(validation?.getAttribute('data-has-message')).toBeNull();
    });
  });

  describe('validation id', () => {
    it('matches the uuid pattern', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('field is required');
      await flush(fixture);

      expect(queryValidation(host)?.id).toMatch(VALIDATION_ID_PATTERN);
    });

    it('remains stable across input changes', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.validationMessage.set('field is required');
      await flush(fixture);

      const initialId = queryValidation(host)?.id ?? null;

      expect(initialId).not.toBeNull();

      fixture.componentInstance.validationMessage.set('must be a valid email');
      fixture.componentInstance.labelOrientation.set('horizontal');
      fixture.componentInstance.reserveValidationSpace.set(true);
      await flush(fixture);

      expect(queryValidation(host)?.id).toBe(initialId);
    });
  });

  describe('reserve validation space', () => {
    it('renders the validation div when reserve is on for a standalone field', async () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.reserveValidationSpace.set(true);
      await flush(fixture);

      expect(queryValidation(host)).not.toBeNull();
    });

    it('inherits reserve validation space from the parent', async () => {
      const fixture = createFixture(FormFieldWithParentHost);
      const host = queryByTestId(fixture, 'form-field');

      expect(queryValidation(host)).toBeNull();

      fixture.componentInstance.parentReserveValidationSpace.set(true);
      await flush(fixture);

      expect(queryValidation(host)).not.toBeNull();
    });

    it('lets a per-field false override a parent true', async () => {
      const fixture = createFixture(FormFieldWithParentHost);
      const host = queryByTestId(fixture, 'form-field');

      fixture.componentInstance.parentReserveValidationSpace.set(true);
      await flush(fixture);

      expect(queryValidation(host)).not.toBeNull();

      fixture.componentInstance.childReserveValidationSpace.set(false);
      await flush(fixture);

      expect(queryValidation(host)).toBeNull();
    });

    it('lets a per-field true override a parent false', async () => {
      const fixture = createFixture(FormFieldWithParentHost);
      const host = queryByTestId(fixture, 'form-field');

      expect(queryValidation(host)).toBeNull();

      fixture.componentInstance.childReserveValidationSpace.set(true);
      await flush(fixture);

      expect(queryValidation(host)).not.toBeNull();
    });
  });

  describe('content projection', () => {
    it('projects the label and input into the form-field-content element', () => {
      const fixture = createStandalone();
      const host = queryByTestId(fixture, 'form-field');
      const content = host.querySelector('.form-field-content');

      expect(content).not.toBeNull();
      expect(content?.querySelector('[data-testid="projected-input"]')).not.toBeNull();
      expect(content?.querySelector('org-label')).not.toBeNull();
    });
  });

  describe('form fields container', () => {
    it('defaults the container orientation to vertical', () => {
      const fixture = createFixture(FormFieldsMultipleChildrenHost);
      const container = queryByTestId(fixture, 'form-fields');

      expect(container.getAttribute('data-orientation')).toBe('vertical');
    });

    it('reflects a horizontal container orientation', async () => {
      const fixture = createFixture(FormFieldWithParentHost);
      const container = queryByTestId(fixture, 'form-fields');

      fixture.componentInstance.parentOrientation.set('horizontal');
      await flush(fixture);

      expect(container.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('projects multiple child form fields', () => {
      const fixture = createFixture(FormFieldsMultipleChildrenHost);
      const container = queryByTestId(fixture, 'form-fields');

      expect(container.querySelectorAll('org-form-field').length).toBe(2);
    });

    it('cascades the label orientation to all children', async () => {
      const fixture = createFixture(FormFieldsMultipleChildrenHost);
      const fieldOne = queryByTestId(fixture, 'form-field-one');
      const fieldTwo = queryByTestId(fixture, 'form-field-two');

      fixture.componentInstance.labelOrientation.set('horizontal');
      await flush(fixture);

      expect(fieldOne.getAttribute('data-label-orientation')).toBe('horizontal');
      expect(fieldTwo.getAttribute('data-label-orientation')).toBe('horizontal');
    });

    it('cascades reserve validation space to all children', async () => {
      const fixture = createFixture(FormFieldsMultipleChildrenHost);
      const fieldOne = queryByTestId(fixture, 'form-field-one');
      const fieldTwo = queryByTestId(fixture, 'form-field-two');

      expect(queryValidation(fieldOne)).toBeNull();
      expect(queryValidation(fieldTwo)).toBeNull();

      fixture.componentInstance.reserveValidationSpace.set(true);
      await flush(fixture);

      expect(queryValidation(fieldOne)).not.toBeNull();
      expect(queryValidation(fieldTwo)).not.toBeNull();
    });
  });
});
