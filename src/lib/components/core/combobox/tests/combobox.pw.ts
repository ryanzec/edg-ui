import { test, expect, type Page, type Locator } from '@playwright/test';
import { playwrightMockerUtils } from '$lib/utils/playwright-mocker';
import { playwrightUtils } from '$lib/utils/playwright';

export class ComboboxPage {
  readonly page: Page;

  readonly input: Locator;

  readonly typeToSearchOption: Locator;

  readonly noResultsOption: Locator;

  readonly loadingOption: Locator;

  readonly clickOutsideTester: Locator;

  readonly options: Locator;

  readonly option: Locator;

  readonly highlightedOption: Locator;

  readonly dropDownSelectedOption: Locator;

  readonly selectedValue: Locator;

  readonly selectedChangeCount: Locator;

  readonly selectedIndicator: Locator;

  constructor (page: Page) {
    this.page = page;
    this.input = page.locator('[data-id="combobox"] input');
    this.typeToSearchOption = page.locator('[data-id="combobox"] [data-id="type-to-search-option"]');
    this.noResultsOption = page.locator('[data-id="combobox"] [data-id="no-results-option"]');
    this.loadingOption = page.locator('[data-id="combobox"] [data-id="loading-option"]');
    this.clickOutsideTester = page.locator('[data-id="click-outside-tester"]');
    this.options = page.locator('[data-id="combobox"] [data-id="options"]');
    this.option = page.locator('[data-id="combobox"] [data-id="option"]');
    this.highlightedOption = page.locator('[data-id="combobox"] [data-combobox-highlighted]');
    this.dropDownSelectedOption = page.locator('[data-id="combobox"] [data-combobox-drop-down-selected]');
    this.selectedValue = page.locator('[data-id="selected-value"]');
    this.selectedChangeCount = page.locator('[data-id="selected-change-count"]');
    this.selectedIndicator = page.locator('[data-id="combobox"] [data-id="selected-indicator"]');
  }

  async goto (url: string) {
    return await playwrightUtils.goto(this.page, url);
  }

  optionLocator (index: number) {
    return this.page.locator(`[data-id="combobox"] [data-id="option"]:nth-of-type(${index + 1})`);
  }

  selectedIndicatorLocator (index: number) {
    return this.page.locator(`[data-id="combobox"] [data-id="selected-indicator"]:nth-of-type(${index + 1})`);
  }

  async clickRemoveTrigger (index: number) {
    await this.page
      .locator(`[data-id="combobox"] [data-id="selected-indicator"]:nth-of-type(${index + 1}) [data-id="remove-trigger"]`)
      .click();
  }

  async expectSelectedValue (value: string) {
    await expect(this.selectedValue).toHaveText(value);
  }

  async expectInputValue (value: string) {
    await expect(this.input).toHaveValue(value);
  }

  async expectHighlightedOptionDisplay (display: string) {
    await expect(this.highlightedOption).toHaveText(display);
  }

  async expectSelectedIndicatorDisplay (index: number, display: string) {
    await expect(this.selectedIndicatorLocator(index)).toContainText(display);
  }

  async expectSelectedIndicatorCount (count: number) {
    await expect(this.selectedIndicator).toHaveCount(count);
  }

  async expectOptionCount (count: number) {
    await expect(this.option).toHaveCount(count);
  }

  async expectOptionDisplay (index: number, display: string) {
    await expect(this.optionLocator(index)).toHaveText(display);
  }

  async expectOptionsToBeVisible () {
    await expect(this.options).toBeVisible();
  }
}

test.describe('combobox', () => {
  test.describe('multiple select', () => {
    test('preselection works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Preselected');

      await componentPage.expectInputValue('');
      await componentPage.expectSelectedIndicatorCount(2);
      await componentPage.expectSelectedIndicatorDisplay(0, 'Option 2');
      await componentPage.expectSelectedIndicatorDisplay(1, 'Option 3');
      await componentPage.expectSelectedValue('[{"value":"2","display":"Option 2","meta":{"testing":"testing"}},{"value":"3","display":"Option 3","meta":{"testing":"testing"}}]');
    });

    test('the remove trigger from the selected indicator works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Preselected');

      await componentPage.clickRemoveTrigger(0);

      await componentPage.expectSelectedIndicatorCount(1);
      await componentPage.expectSelectedIndicatorDisplay(0, 'Option 3');
      await componentPage.expectSelectedValue('[{"value":"3","display":"Option 3","meta":{"testing":"testing"}}]');
    });

    test('clicking an option that is not already selected works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.input.click();
      await componentPage.optionLocator(0).click();

      await componentPage.expectSelectedIndicatorCount(1);
      await componentPage.expectSelectedIndicatorDisplay(0, 'Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('clicking an option that is already selected works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Preselected');

      await componentPage.input.click();
      await componentPage.optionLocator(1).click();

      await componentPage.expectSelectedIndicatorCount(1);
      await componentPage.expectSelectedIndicatorDisplay(0, 'Option 3');
      await componentPage.expectSelectedValue('[{"value":"3","display":"Option 3","meta":{"testing":"testing"}}]');
    });

    test('filters works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Filtering');

      await componentPage.input.click();

      await componentPage.expectOptionCount(4);

      await componentPage.input.fill('4');

      await componentPage.expectOptionCount(1);
      await componentPage.expectOptionDisplay(0, 'Option 4');
    });

    test('drop down remains opened after clicking an option', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.input.click();
      await componentPage.optionLocator(0).click();

      await componentPage.expectOptionsToBeVisible();
    });

    test('drop down remains opened after selected an item with enter key', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.input.click();
      await componentPage.input.press('ArrowDown');
      await componentPage.input.press('Enter');

      await componentPage.expectOptionsToBeVisible();
    });

    test('clear on escape works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Clear+on+Escape');

      // focusing the input to be able to press this shows the drop down so this closes it
      await componentPage.input.press('Escape');

      // this trigger the real functionalitry
      await componentPage.input.press('Escape');

      await componentPage.expectSelectedIndicatorCount(0);
      await componentPage.expectOptionCount(0);
      await componentPage.expectSelectedValue('[]');
    });
  });

  test.describe('single select', () => {
    test.describe('async options', () => {
      test('displays loading indicator', async ({ page }) => {
        const componentPage = new ComboboxPage(page);

        await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

        await componentPage.input.click();

        await expect(componentPage.typeToSearchOption).toBeVisible();
      });

      test('typing shows the load indicator', async ({ page }) => {
        await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 3000 });

        const componentPage = new ComboboxPage(page);

        await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

        await componentPage.input.fill('a');

        await expect(componentPage.loadingOption).toBeVisible();
      });

      test('options show after loading', async ({ page }) => {
        await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 500 });

        const componentPage = new ComboboxPage(page);

        await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

        await componentPage.input.fill('a');

        await expect(componentPage.option).toHaveCount(3);
      });


      test('display type to show option when removing all data in the input after showing options', async ({ page }) => {
        await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 500 });

        const componentPage = new ComboboxPage(page);

        await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

        await componentPage.input.fill('a');

        await expect(componentPage.option).toHaveCount(3);

        await componentPage.input.fill('');

        await expect(componentPage.typeToSearchOption).toBeVisible();
      });

      test('display no results option when there are no results returned', async ({ page }) => {
        await playwrightMockerUtils.mockGetUsersNoResultsEndpoint(page);

        const componentPage = new ComboboxPage(page);

        await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

        await componentPage.input.fill('a');

        await expect(componentPage.noResultsOption).toBeVisible();
      });
    });

    test('clicking an option works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.input.click();
      await componentPage.optionLocator(0).click();

      await componentPage.expectInputValue('Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('clear on escape works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Clear+on+Escape');

      await componentPage.input.click();
      await componentPage.optionLocator(0).click();
      // this triggers the close of the combobox drop dow
      await componentPage.input.press('Escape');
      // this triggers the clear on escape functionality
      await componentPage.input.press('Escape');

      await componentPage.expectInputValue('');
      await componentPage.expectSelectedValue('[]');
    });

    test('up arrow works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      // starts at the bottom
      await componentPage.input.click();
      await componentPage.input.press('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('Option 4');

      // moves up one
      await componentPage.input.press('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('Option 3');

      // should loop to the last item
      await componentPage.input.press('ArrowUp');
      await componentPage.input.press('ArrowUp');
      await componentPage.input.press('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('Option 4');
    });

    test('down arrow works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      // starts at the top
      await componentPage.input.click();
      await componentPage.input.press('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('Option 1');

      // moves down one
      await componentPage.input.press('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('Option 2');

      // should loop to the first item
      await componentPage.input.press('ArrowDown');
      await componentPage.input.press('ArrowDown');
      await componentPage.input.press('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('Option 1');
    });

    test('enter select highlighted option', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.input.click();
      await componentPage.input.press('ArrowDown');
      await componentPage.input.press('Enter');

      await componentPage.expectInputValue('Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('click outside closes the options', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.input.click();

      await expect(componentPage.options).toBeVisible();

      await componentPage.clickOutsideTester.click();

      await expect(componentPage.options).not.toBeVisible();
    });

    test('filtering works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.input.click();
      await componentPage.input.fill('1');

      await expect(componentPage.options).toHaveCount(1);
      await expect(componentPage.optionLocator(0)).toHaveText('Option 1');
    });

    test('preselected works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Preselected');

      await componentPage.expectInputValue('Option 2');
      await componentPage.expectSelectedValue('[{"value":"2","display":"Option 2","meta":{"testing":"testing"}}]');
    });

    test('selected change works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Selected+Change');

      // the initia load runs this once
      await expect(componentPage.selectedChangeCount).toHaveText('1');

      // selecting a new value should trigger the change
      await componentPage.input.click();
      await componentPage.optionLocator(0).click();

      await expect(componentPage.selectedChangeCount).toHaveText('2');

      // selecting the same value should not trigger the change
      await componentPage.input.click();
      await componentPage.optionLocator(0).click();

      await expect(componentPage.selectedChangeCount).toHaveText('2');
    });
  });

  test.describe('edge case bugs', { tag: ['@edge-case'] }, () => {
    test('selecting a value, clearing that select and selecting the same value works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Clear+on+Escape');

      await componentPage.input.click();
      await componentPage.optionLocator(0).click();

      // this triggers the close of the combobox drop dow
      await componentPage.input.press('Escape');
      // this triggers the clear on escape functionality
      await componentPage.input.press('Escape');

      await componentPage.input.click();
      await componentPage.optionLocator(0).click();

      await componentPage.expectInputValue('Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });
  });
});
