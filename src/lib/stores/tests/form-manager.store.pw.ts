import { playwrightUtils } from '$lib/utils/playwright';
import { test, expect, type Page, type Locator } from '@playwright/test';

export class FormComponentPage {
  readonly page: Page;

  readonly addArrayValueTrigger: Locator;

  readonly addObjectValueTrigger: Locator;

  readonly submitTrigger: Locator;

  readonly submittedData: Locator;

  readonly arrayValidationMessages: Locator;

  readonly nestedValidationMessages: Locator;

  readonly checkboxValidationMessages: Locator;

  readonly toggleValidationMessages: Locator;

  readonly radioValidationMessages: Locator;

  readonly objectFirstNameInput: Locator;

  readonly objectLastNameInput: Locator;

  readonly objectFirstNameValidationMessages: Locator;

  readonly objectCheckboxValidationMessages: Locator;

  readonly objectRadioValidationMessages: Locator;

  readonly selectInput: Locator;

  readonly selectValidationMessages: Locator;

  readonly textInput: Locator;

  readonly textValidationMessages: Locator;

  readonly textValidationMessagesMessage: Locator;

  readonly textareaInput: Locator;

  readonly textareaValidationMessages: Locator;

  readonly comboboxSingleInput: Locator;

  readonly comboboxSingleOptions: Locator;

  readonly comboboxSingleValidationMessages: Locator;

  readonly comboboxMultipleInput: Locator;

  readonly comboboxMultipleOptions: Locator;

  readonly comboboxMultipleValidationMessages: Locator;

  constructor (page: Page) {
    this.page = page;
    this.addArrayValueTrigger = page.locator('[data-id="add-array-value-trigger"]');
    this.addObjectValueTrigger = page.locator('[data-id="add-object-value-trigger"]');
    this.submitTrigger = page.locator('button[type="submit"]');
    this.submittedData = page.locator('[data-id="submitted-data"]');
    this.arrayValidationMessages = page.locator('[data-id="array-container"] > [data-id="validation-messages"]');
    this.nestedValidationMessages = page.locator('[data-id="nested-container"] > [data-id="validation-messages"]');
    this.checkboxValidationMessages = page.locator('[data-id="checkbox-group"] > [data-id="validation-messages"]');
    this.radioValidationMessages = page.locator('[data-id="radio-group"] > [data-id="validation-messages"]');
    this.objectFirstNameInput = page.locator('[data-id="object"] [data-id="first-name"] input');
    this.objectLastNameInput = page.locator('[data-id="object"] [data-id="last-name"] input');
    this.objectFirstNameValidationMessages = page.locator('[data-id="object"] [data-id="first-name"] > [data-id="validation-messages"]');
    this.objectCheckboxValidationMessages = page.locator('[data-id="object"] [data-id="checkbox-group"] > [data-id="validation-messages"]');
    this.objectRadioValidationMessages = page.locator('[data-id="object"] [data-id="radio-group"] > [data-id="validation-messages"]');
    this.selectInput = page.locator('[data-id="select"] select');
    this.selectValidationMessages = page.locator('[data-id="select"] > [data-id="validation-messages"]');
    this.textInput = page.locator('[data-id="text"] input');
    this.textValidationMessages = page.locator('[data-id="text"] > [data-id="validation-messages"]');
    this.textValidationMessagesMessage = page.locator('[data-id="text"] > [data-id="validation-messages"] [data-id="message"]');
    this.textareaInput = page.locator('[data-id="textarea"] textarea');
    this.textareaValidationMessages = page.locator('[data-id="textarea"] > [data-id="validation-messages"]');
    this.comboboxSingleInput = page.locator('[data-id="combobox-single"] input');
    this.comboboxSingleOptions = page.locator('[data-id="combobox-single"] [data-id="options"]');
    this.comboboxSingleValidationMessages = page.locator('[data-id="combobox-single"] > [data-id="validation-messages"]');
    this.comboboxMultipleInput = page.locator('[data-id="combobox-multiple"] input');
    this.comboboxMultipleOptions = page.locator('[data-id="combobox-multiple"] [data-id="options"]');
    this.comboboxMultipleValidationMessages = page.locator('[data-id="combobox-multiple"] > [data-id="validation-messages"]');
    this.toggleValidationMessages = page.locator('[data-id="toggle-group"] > [data-id="validation-messages"]');
  }

  async goto (url: string) {
    return await playwrightUtils.goto(this.page, url);
  }

  arrayLocator (index: number, appendLocator: string) {
    return this.page.locator(`[data-id="array-value-${index}"] ${appendLocator}`);
  }

  nestedObjectLocator (objectIndex: number, appendLocator: string = '', arrayIndex?: number) {
    if (arrayIndex !== undefined) {
      return this.page.locator(`[data-id="object-value-${objectIndex}"] [data-id="array-value-${arrayIndex}"] ${appendLocator}`);
    }

    return this.page.locator(`[data-id="object-value-${objectIndex}"] ${appendLocator}`);
  }

  arrayValidationMessagesLocator (index: number) {
    return this.page.locator(`[data-id="array-value-${index}"] [data-id="validation-messages"]`);
  }

  checkboxLocator (index: number) {
    return this.page.locator(`[data-id="checkbox-group"] label:nth-of-type(${index + 1}) svg`);
  }

  toggleLocator (index: number) {
    return this.page.locator(`[data-id="toggle-group"] label:nth-of-type(${index + 1}) [data-id="bar"]`);
  }

  radioLocator (index: number) {
    return this.page.locator(`[data-id="radio-group"] label:nth-of-type(${index + 1}) svg`);
  }

  objectCheckboxLocator (index: number) {
    return this.page.locator(`[data-id="object"] [data-id="checkbox-group"] label:nth-of-type(${index + 1}) svg`);
  }

  objectToggleLocator (index: number) {
    return this.page.locator(`[data-id="object"] [data-id="toggle-group"] label:nth-of-type(${index + 1}) [data-id="bar"]`);
  }

  objectRadioLocator (index: number) {
    return this.page.locator(`[data-id="object"] [data-id="radio-group"] label:nth-of-type(${index + 1}) svg`);
  }

  comboboxSingleOptionLocator (index: number) {
    return this.page.locator(`[data-id="combobox-single"] [data-id="option"]:nth-of-type(${index + 1})`);
  }

  comboboxMultipleOptionLocator (index: number) {
    return this.page.locator(`[data-id="combobox-multiple"] [data-id="option"]:nth-of-type(${index + 1})`);
  }

  async openComboboxSingle () {
    await this.comboboxSingleInput.click();

    return this.comboboxSingleOptions.waitFor();
  }

  async openComboboxMultiple () {
    await this.comboboxMultipleInput.click();

    return this.comboboxMultipleOptions.waitFor();
  }

  async addArrayValue (index: number, value?: string) {
    await this.page.locator('[data-id="add-array-value-trigger"]').click();

    if (value) {
      return await this.fillArrayValue(index, value);
    }

    // return await this.arrayLocator(index, 'input').waitFor();
    return await this.page.waitForSelector(`[data-id="array-value-${index}"] input`);
  }

  async addObjectValue (index: number) {
    await this.page.locator('[data-id="add-object-value-trigger"]').click();

    return await this.nestedObjectLocator(index, '[data-id="first-name"] input').waitFor();
  }

  async addObjectArrayValue (objectIndex: number, arrayIndex: number) {
    await this.nestedObjectLocator(objectIndex, '[data-id="add-array-value-trigger"]').click();

    return this.nestedObjectLocator(objectIndex, 'input', arrayIndex).waitFor();
  }

  async fillArrayValue (index: number, value: string) {
    return await this.arrayLocator(index, 'input').fill(value);
  }

  async fillObjectValue (index: number, dataId: string, value: string) {
    return await this.nestedObjectLocator(index, `[data-id="${dataId}"] input`).fill(value);
  }

  async fillObjectArrayValue (objectIndex: number, arrayIndex: number, value: string) {
    return await this.nestedObjectLocator(objectIndex, 'input', arrayIndex).fill(value);
  }

  async expectSubmittedData (value: string) {
    return await expect(this.submittedData).toHaveText(value);
  }

  async expectSubmittedDataNot (value: string) {
    return await expect(this.submittedData).not.toHaveText(value);
  }
}

test.describe('form manager', () => {
  test.describe('input types', () => {
    test.describe('arrays', () => {
      test('displays validation message for the array in general', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Array');

        await expect(formPage.arrayValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.arrayValidationMessages).toHaveCount(1);
      });

      test('displays validation message for the array item', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Array');

        await formPage.addArrayValue(0);
        await formPage.addArrayValue(1);

        await formPage.submitTrigger.click();

        await expect(formPage.arrayValidationMessages).toHaveCount(0);
        await expect(formPage.arrayValidationMessagesLocator(0)).toHaveCount(1);
        await expect(formPage.arrayValidationMessagesLocator(1)).toHaveCount(1);
      });

      test('requires all validations to be resolved before submitted data', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Array');

        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('undefined');

        await formPage.addArrayValue(0);
        await formPage.addArrayValue(1);

        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('undefined');

        await formPage.fillArrayValue(0, 'value');

        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('undefined');
      });

      test('submitted data is formatted properly', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Array');

        await formPage.addArrayValue(0, 'value');
        await formPage.addArrayValue(1, 'value2');

        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"simpleArray":["value","value2"]}');
      });
    });

    test.describe('nested structure', () => {
      test('displays validation message for the nested structure in general', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Nested');

        await expect(formPage.nestedValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.nestedValidationMessages).toHaveCount(1);
      });

      test('displays validation message for the elements in the nested structure', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Nested');

        await formPage.addObjectValue(0);
        await formPage.submitTrigger.click();

        await expect(formPage.nestedObjectLocator(0, '> [data-id="first-name"] > [data-id="validation-messages"]')).toHaveCount(1);
        await expect(formPage.nestedObjectLocator(0, '> [data-id="array-container"] > [data-id="validation-messages"]')).toHaveCount(1);

        await formPage.addObjectArrayValue(0, 0);
        await formPage.submitTrigger.click();

        await expect(formPage.nestedObjectLocator(0, '> [data-id="array-container"] > [data-id="validation-messages"]')).toHaveCount(0);
        await expect(formPage.nestedObjectLocator(0, '> [data-id="validation-messages"]', 0)).toHaveCount(1);
      });

      test('requires all validations to be resolved before submitted data', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Nested');

        await formPage.addObjectValue(0);
        await formPage.addObjectArrayValue(0, 0);
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('undefined');

        await formPage.fillObjectValue(0, 'first-name', 'first');
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('undefined');

        await formPage.fillObjectArrayValue(0, 0, 'string1');
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedDataNot('undefined');
      });

      test('submitted data is formatted properly for single object', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Nested');

        await formPage.addObjectValue(0);
        await formPage.addObjectArrayValue(0, 0);
        await formPage.addObjectArrayValue(0, 1);

        await formPage.fillObjectValue(0, 'first-name', 'first');
        await formPage.fillObjectArrayValue(0, 0, 'string1');
        await formPage.fillObjectArrayValue(0, 1, 'string2');

        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"complexArray":[{"firstName":"first","lastName":"","simpleArray":["string1","string2"]}]}');
      });

      test('submitted data is formatted properly for multiple object', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Nested');

        await formPage.addObjectValue(0);
        await formPage.addObjectValue(1);
        await formPage.addObjectArrayValue(0, 0);
        await formPage.addObjectArrayValue(0, 1);
        await formPage.addObjectArrayValue(1, 0);
        await formPage.addObjectArrayValue(1, 1);

        await formPage.fillObjectValue(0, 'first-name', 'first');
        await formPage.fillObjectArrayValue(0, 0, 'string1');
        await formPage.fillObjectArrayValue(0, 1, 'string2');
        await formPage.fillObjectValue(1, 'first-name', 'first-2');
        await formPage.fillObjectArrayValue(1, 0, 'string1-2');
        await formPage.fillObjectArrayValue(1, 1, 'string2-2');

        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"complexArray":[{"firstName":"first","lastName":"","simpleArray":["string1","string2"]},{"firstName":"first-2","lastName":"","simpleArray":["string1-2","string2-2"]}]}');
      });
    });

    test.describe('checkbox', () => {
      test('displays validation message', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Checkbox');

        await expect(formPage.checkboxValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.checkboxValidationMessages).toHaveCount(1);
      });

      test('validation message goes away after adding value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Checkbox');

        await formPage.submitTrigger.click();
        await formPage.checkboxLocator(0).click();
        await formPage.submitTrigger.click();

        await expect(formPage.checkboxValidationMessages).toHaveCount(0);
      });

      test('submitted value properly formatted for single value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Checkbox');

        await formPage.checkboxLocator(0).click();
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"checkbox":["one"]}');
      });

      test('submitted value properly formatted for multiple values', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Checkbox');

        await formPage.checkboxLocator(0).click();
        await formPage.checkboxLocator(1).click();
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"checkbox":["one","two"]}');
      });
    });

    test.describe('toggle', () => {
      test('displays validation message', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Toggle');

        await expect(formPage.toggleValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.toggleValidationMessages).toHaveCount(1);
      });

      test('validation message goes away after adding value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Toggle');

        await formPage.submitTrigger.click();
        await formPage.toggleLocator(0).click();
        await formPage.submitTrigger.click();

        await expect(formPage.toggleValidationMessages).toHaveCount(0);
      });

      test('submitted value properly formatted for single value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Toggle');

        await formPage.toggleLocator(0).click();
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"toggle":["one"]}');
      });

      test('submitted value properly formatted for multiple values', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Toggle');

        await formPage.toggleLocator(0).click();
        await formPage.toggleLocator(1).click();
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"toggle":["one","two"]}');
      });
    });

    test.describe('radio', () => {
      test('displays validation message', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Radio');

        await expect(formPage.radioValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.radioValidationMessages).toHaveCount(1);
      });

      test('validation message goes away after adding value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Radio');

        await formPage.submitTrigger.click();
        await formPage.radioLocator(0).click();
        await formPage.submitTrigger.click();

        await expect(formPage.radioValidationMessages).toHaveCount(0);
      });

      test('submitted value properly formatted for single value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Radio');

        await formPage.radioLocator(0).click();
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"radio":"one"}');

        await formPage.radioLocator(1).click();
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"radio":"two"}');
      });
    });

    test.describe('object', () => {
      test('displays validation messages', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Object');

        await expect(formPage.objectFirstNameValidationMessages).toHaveCount(0);
        await expect(formPage.objectCheckboxValidationMessages).toHaveCount(0);
        await expect(formPage.objectRadioValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.objectFirstNameValidationMessages).toHaveCount(1);
        await expect(formPage.objectCheckboxValidationMessages).toHaveCount(1);
        await expect(formPage.objectRadioValidationMessages).toHaveCount(1);
      });

      test('validation messages goes away after adding value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Object');

        await formPage.submitTrigger.click();

        await formPage.objectFirstNameInput.fill('first');
        await formPage.objectLastNameInput.fill('last');
        await formPage.objectCheckboxLocator(0).click();
        await formPage.objectRadioLocator(0).click();

        await formPage.submitTrigger.click();

        await expect(formPage.objectFirstNameValidationMessages).toHaveCount(0);
        await expect(formPage.objectCheckboxValidationMessages).toHaveCount(0);
        await expect(formPage.objectRadioValidationMessages).toHaveCount(0);
      });

      test('submitted value properly formatted for single value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Object');

        await formPage.objectFirstNameInput.fill('first');
        await formPage.objectLastNameInput.fill('last');
        await formPage.objectCheckboxLocator(0).click();
        await formPage.objectToggleLocator(1).click();
        await formPage.objectRadioLocator(0).click();
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"complex":{"firstName":"first","lastName":"last","checkbox":["one"],"toggle":["two"],"radio":"one"}}');
      });
    });

    test.describe('select', () => {
      test('displays validation messages', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Select');

        await expect(formPage.selectValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.selectValidationMessages).toHaveCount(1);
      });

      test('validation messages goes away after adding value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Select');

        await formPage.submitTrigger.click();

        await formPage.selectInput.selectOption('one');

        await formPage.submitTrigger.click();

        await expect(formPage.objectFirstNameValidationMessages).toHaveCount(0);
      });

      test('submitted value properly formatted for single value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Select');

        await formPage.selectInput.selectOption('one');
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"select":"one"}');
      });
    });

    test.describe('text', () => {
      test('displays validation messages', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Text');

        await expect(formPage.textValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.textValidationMessages).toHaveCount(1);
      });

      test('validation messages goes away after adding value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Text');

        await formPage.submitTrigger.click();

        await formPage.textInput.fill('test');

        await formPage.submitTrigger.click();

        await expect(formPage.textValidationMessages).toHaveCount(0);
      });

      test('submitted value properly formatted for single value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Text');

        await formPage.textInput.fill('test');
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"text":"test"}');
      });
    });

    test.describe('textarea', () => {
      test('displays validation messages', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Textarea');

        await expect(formPage.textareaValidationMessages).toHaveCount(0);

        await formPage.submitTrigger.click();

        await expect(formPage.textareaValidationMessages).toHaveCount(1);
      });

      test('validation messages goes away after adding value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Textarea');

        await formPage.submitTrigger.click();

        await formPage.textareaInput.fill('1');

        await formPage.submitTrigger.click();

        await expect(formPage.textareaValidationMessages).toHaveCount(0);
      });

      test('submitted value properly formatted for single value', async ({ page }) => {
        const formPage = new FormComponentPage(page);

        await formPage.goto('/sandbox?component=Form.Input+Types.Textarea');

        await formPage.textareaInput.fill('1');
        await formPage.submitTrigger.click();

        await formPage.expectSubmittedData('{"textarea":"1"}');
      });
    });

    test.describe('combobox', () => {
      test.describe('single value', () => {
        test('displays validation messages', async ({ page }) => {
          const formPage = new FormComponentPage(page);

          await formPage.goto('/sandbox?component=Form.Input+Types.Combobox+Single');

          await expect(formPage.comboboxSingleValidationMessages).toHaveCount(0);

          await formPage.submitTrigger.click();

          await expect(formPage.comboboxSingleValidationMessages).toHaveCount(1);
        });

        test('validation messages goes away after adding value', async ({ page }) => {
          const formPage = new FormComponentPage(page);

          await formPage.goto('/sandbox?component=Form.Input+Types.Combobox+Single');

          await formPage.submitTrigger.click();

          await formPage.openComboboxSingle();
          await formPage.comboboxSingleOptionLocator(0).click();

          await formPage.submitTrigger.click();

          await expect(formPage.comboboxSingleValidationMessages).toHaveCount(0);
        });

        test('submitted value properly formatted for single value', async ({ page }) => {
          const formPage = new FormComponentPage(page);

          await formPage.goto('/sandbox?component=Form.Input+Types.Combobox+Single');

          await formPage.openComboboxSingle();
          await formPage.comboboxSingleOptionLocator(0).click();
          await formPage.submitTrigger.click();

          await formPage.expectSubmittedData('{"userRole":[{"display":"Admin","value":"admin"}]}');
        });
      });

      test.describe('multiple valus', () => {
        test('displays validation messages', async ({ page }) => {
          const formPage = new FormComponentPage(page);

          await formPage.goto('/sandbox?component=Form.Input+Types.Combobox+Multiple');

          await expect(formPage.comboboxMultipleValidationMessages).toHaveCount(0);

          await formPage.submitTrigger.click();

          await expect(formPage.comboboxMultipleValidationMessages).toHaveCount(1);
        });

        test('validation messages goes away after adding value', async ({ page }) => {
          const formPage = new FormComponentPage(page);

          await formPage.goto('/sandbox?component=Form.Input+Types.Combobox+Multiple');

          await formPage.submitTrigger.click();

          await formPage.openComboboxMultiple();
          await formPage.comboboxMultipleOptionLocator(0).click();
          await formPage.comboboxMultipleOptionLocator(1).click();
          await formPage.comboboxMultipleInput.press('Escape');

          await formPage.submitTrigger.click();

          await expect(formPage.comboboxMultipleValidationMessages).toHaveCount(0);
        });

        test('submitted value properly formatted for single value', async ({ page }) => {
          const formPage = new FormComponentPage(page);

          await formPage.goto('/sandbox?component=Form.Input+Types.Combobox+Multiple');

          await formPage.openComboboxMultiple();
          await formPage.comboboxMultipleOptionLocator(0).click();
          await formPage.comboboxMultipleOptionLocator(1).click();
          await formPage.comboboxMultipleInput.press('Escape');
          await formPage.submitTrigger.click();

          await formPage.expectSubmittedData('{"userRoles":[{"display":"Admin","value":"admin"},{"display":"User","value":"user"}]}');
        });
      });
    });
  });

  test('multiple validations', async ({ page }) => {
    const formPage = new FormComponentPage(page);

    await formPage.goto('/sandbox?component=Form.Input+Types.Text');

    await formPage.submitTrigger.click();

    await expect(formPage.textValidationMessagesMessage).toHaveCount(2);

    await formPage.textInput.fill('tes');

    await expect(formPage.textValidationMessagesMessage).toHaveCount(1);

    await formPage.textInput.fill('test');

    await expect(formPage.textValidationMessagesMessage).toHaveCount(0);
  });

  test.describe('complete form', () => {
    test('submitted data is good', async ({ page }) => {
      const formPage = new FormComponentPage(page);

      await formPage.goto('/sandbox?component=Form.Complete+Prepopulated');

      formPage.submitTrigger.click();

      await formPage.expectSubmittedData('{"text":"test","checkbox":["two"],"toggle":["one","two"],"radio":"one","textarea":"3","select":"two","userRole":[{"value":"admin","display":"Admin"}],"userRoles":[{"value":"admin","display":"Admin"},{"value":"user","display":"User"}],"simpleArray":["test"],"complexArray":[{"firstName":"test","lastName":"test","simpleArray":["test","test2"]}],"complex":{"firstName":"first name","lastName":"last name"}}');
    });
  });
});
