import { test, expect, type Page, type Locator } from '@playwright/test';
import { playwrightMockerUtils } from '$lib/utils/playwright-mocker';
import { playwrightUtils } from '$lib/utils/playwright';
import type { Placement } from '@floating-ui/dom';

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

  readonly componentContainer: Locator;

  readonly groupHeader: Locator;

  readonly clearOption: Locator;

  readonly externalEscapeTrigger: Locator;

  constructor (page: Page) {
    this.page = page;
    this.input = page.locator('[data-id="combobox"] input');
    this.typeToSearchOption = page.locator('[data-id="combobox"] [data-id="type-to-search-option"]');
    this.noResultsOption = page.locator('[data-id="combobox"] [data-id="no-results-option"]');
    this.loadingOption = page.locator('[data-id="combobox"] [data-id="loading-option"]');
    this.clickOutsideTester = page.locator('[data-id="click-outside-tester"]');
    this.options = page.locator('[data-id="combobox"] [data-id="options"]');
    this.option = page.locator('[data-id="combobox"] [data-combobox-option]');
    this.highlightedOption = page.locator('[data-id="combobox"] [data-combobox-highlighted]');
    this.dropDownSelectedOption = page.locator('[data-id="combobox"] [data-combobox-drop-down-selected]');
    this.selectedValue = page.locator('[data-id="selected-value"]');
    this.selectedChangeCount = page.locator('[data-id="selected-change-count"]');
    this.selectedIndicator = page.locator('[data-id="combobox"] [data-id="selected-indicator"]');
    this.componentContainer = page.locator('[data-id="component-container"]');
    this.groupHeader = page.locator('[data-id="group-header"]');
    this.clearOption = page.locator('[data-id="combobox"] [data-id="clear-option"]');
    this.externalEscapeTrigger = page.locator('[data-id="external-escape-trigger"]');
  }

  async goto (url: string) {
    return await playwrightUtils.goto(this.page, url);
  }

  // selectors
  optionLocator (index: number) {
    return this.page.locator('[data-id="combobox"] [data-combobox-option]').nth(index);
  }

  groupHeaderLocator (index: number) {
    return this.page.locator('[data-id="group-header"]').nth(index);
  }

  selectedIndicatorLocator (index: number) {
    return this.page.locator(`[data-id="combobox"] [data-id="selected-indicator"]:nth-of-type(${index + 1})`);
  }

  // actions
  async clickRemoveTrigger (index: number) {
    await this.page
      .locator(`[data-id="combobox"] [data-id="selected-indicator"]:nth-of-type(${index + 1}) [data-id="remove-trigger"]`)
      .click();
  }

  // because of the way the combobox handle mouse event, we need to simulate the mouse down and up manaully to
  // properly simulate the user as it would in the browser instead of the .click() api
  async clickOption (index: number) {
    await this.optionLocator(index).hover();
    await this.page.mouse.down();
    await this.page.mouse.up();
  }

  async clickInput () {
    await this.input.click();
  }

  async clickComponentContainer () {
    await this.componentContainer.click();
  }

  async fillInput (value: string) {
    await this.input.fill(value);
  }

  async pressInput (value: string) {
    await this.input.press(value);
  }

  async hoverOption (index: number) {
    await this.optionLocator(index).hover();
  }

  async clickClearOption () {
    await this.clearOption.click();
  }

  // validations
  async expectSelectedValue (value: string) {
    await expect(this.selectedValue).toHaveText(value);
  }

  async expectInputValue (value: string) {
    await expect(this.input).toHaveValue(value);
  }

  async expectHighlightedOptionDisplay (display: string) {
    await expect(this.highlightedOption).toHaveText(display);
  }

  async expectHighlightedOptionCount (count: number) {
    await expect(this.highlightedOption).toHaveCount(count);
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

  async expectGroupHeaderCount (count: number) {
    await expect(this.groupHeader).toHaveCount(count);
  }

  async expectOptionDisplay (index: number, display: string) {
    await expect(this.optionLocator(index)).toHaveText(display);
  }

  async expectNotOptionDisplay (index: number, display: string) {
    await expect(this.optionLocator(index)).not.toHaveText(display);
  }

  async expectOptionsToBeVisible () {
    await expect(this.options).toBeVisible();
  }

  async expectOptionsNotToBeVisible () {
    await expect(this.options).not.toBeVisible();
  }

  async expectDropDownSelectedOptionCount (count: number) {
    await expect(this.dropDownSelectedOption).toHaveCount(count);
  }

  async expectPlacement (placement: Placement) {
    const currentPlacement = await this.options.getAttribute('data-options-placement');

    expect(currentPlacement).toBe(placement);
  }

  async expectExternalEscapeNotTriggered () {
    await expect(this.externalEscapeTrigger).toHaveText('false');
  }

  async expectInputFocused (state: boolean) {
    if (state) {
      await expect(this.input).toBeFocused();
    }

    await expect(this.input).not.toBeFocused();
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

    test('remove items should not open the menu', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Preselected');

      await componentPage.clickRemoveTrigger(0);

      await componentPage.expectOptionsNotToBeVisible();
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

      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectSelectedIndicatorCount(1);
      await componentPage.expectSelectedIndicatorDisplay(0, 'Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('clicking an option that is already selected works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Preselected');

      await componentPage.clickInput();
      await componentPage.clickOption(1);

      await componentPage.expectSelectedIndicatorCount(1);
      await componentPage.expectSelectedIndicatorDisplay(0, 'Option 3');
      await componentPage.expectSelectedValue('[{"value":"3","display":"Option 3","meta":{"testing":"testing"}}]');
    });

    test('input filters works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Filtering');

      await componentPage.clickInput();

      await componentPage.expectOptionCount(4);

      await componentPage.fillInput('4');

      await componentPage.expectOptionCount(1);
      await componentPage.expectOptionDisplay(0, 'Option 4');
    });

    test('making selection after filtering works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Filtering');

      await componentPage.clickInput();
      await componentPage.fillInput('4');
      await componentPage.clickOption(0);

      await componentPage.expectInputValue('');
      await componentPage.expectSelectedIndicatorDisplay(0, 'Option 4');
    });

    test('selected filters works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Filtering');

      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectOptionCount(3);
      await componentPage.expectNotOptionDisplay(0, 'Option 1');
    });

    test('drop down remains opened after clicking an option', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectOptionsToBeVisible();
    });

    test('drop down remains opened after selected an item with enter key', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.clickInput();
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('Enter');

      await componentPage.expectOptionsToBeVisible();
    });

    test('escape works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.clickInput();
      await componentPage.clickOption(0);
      await componentPage.pressInput('Escape');

      await componentPage.expectOptionsNotToBeVisible();
      await componentPage.expectInputFocused(false);
    });

    test('clicking outside with a value typed in is cleared', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.fillInput('a');
      await componentPage.clickComponentContainer();

      await componentPage.expectInputValue('');
    });

    test('can disable inline selected options', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.No+Selected+Inline');

      await componentPage.expectInputValue('');
      await componentPage.expectSelectedIndicatorCount(0);
      await componentPage.expectSelectedValue('[{"value":"2","display":"Option 2","meta":{"testing":"testing"}},{"value":"3","display":"Option 3","meta":{"testing":"testing"}}]');
    });

    test('selecting with keyboard should reset the highlighted  ', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Filtering');

      await componentPage.clickInput();
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('Enter');

      await componentPage.expectHighlightedOptionCount(0);
    });
  });

  test.describe('single select', () => {
    test('clicking an option works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectInputValue('Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('escape works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.clickInput();
      await componentPage.pressInput('Escape');

      await componentPage.expectOptionsNotToBeVisible();
      await componentPage.expectInputFocused(false);
    });

    test('up arrow works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      // starts at the bottom
      await componentPage.clickInput();
      await componentPage.pressInput('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('Option 4');

      // moves up one
      await componentPage.pressInput('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('Option 3');

      // should loop to the last item
      await componentPage.pressInput('ArrowUp');
      await componentPage.pressInput('ArrowUp');
      await componentPage.pressInput('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('Option 4');
    });

    test('down arrow works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      // starts at the top
      await componentPage.clickInput();
      await componentPage.pressInput('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('Option 1');

      // moves down one
      await componentPage.pressInput('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('Option 2');

      // should loop to the first item
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('Option 1');
    });

    test('mouse hover works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.clickInput();
      await componentPage.hoverOption(2);

      await componentPage.expectHighlightedOptionDisplay('Option 3');
    });

    test('enter select highlighted option', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.clickInput();
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('Enter');

      await componentPage.expectInputValue('Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('click outside closes the options', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.clickInput();

      await expect(componentPage.options).toBeVisible();

      await componentPage.clickOutsideTester.click();

      await expect(componentPage.options).not.toBeVisible();
    });

    test('input filtering works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Filtering');

      await componentPage.clickInput();
      await componentPage.fillInput('1');

      await componentPage.expectOptionCount(1);
      await componentPage.expectOptionDisplay(0, 'Option 1');
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
      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await expect(componentPage.selectedChangeCount).toHaveText('2');

      // selecting the same value should not trigger the change
      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await expect(componentPage.selectedChangeCount).toHaveText('2');
    });

    test('blurring the input without selected should empty the input', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Filtering');

      await componentPage.fillInput('test');
      await componentPage.clickComponentContainer();

      await componentPage.expectInputValue('');
    });

    test('tabbing to element within the combobox with highlighted element keeps menu opened', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Custom+Option+Rendered');

      await componentPage.clickInput();
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('Tab');

      await componentPage.expectOptionsToBeVisible();
    });

    test('tabbing to element outside the combobox with highlighted element closed menu', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Custom+Option+Rendered');

      await componentPage.clickInput();
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('Shift+Tab');

      await componentPage.expectOptionsNotToBeVisible();
    });

    test('clear option works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.clickInput();
      await componentPage.clickOption(0);
      await componentPage.clickInput();
      await componentPage.clickClearOption();

      await componentPage.expectInputValue('');
      await componentPage.expectSelectedValue('[]');
    });

    test('clicking option should still work when combobox is in a focusable element', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.For+Tests.In+Focusable');

      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectInputValue('Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('changing the input value should reset the highlighted option', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Large+Options');

      await componentPage.clickInput();
      await componentPage.fillInput('te');
      await componentPage.pressInput('ArrowDown');
      await componentPage.pressInput('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('test 4');

      await componentPage.pressInput('Backspace');

      await componentPage.expectHighlightedOptionCount(0);
    });

    test('arrow keys should still work after text filtering eliminates some options', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Large+Options');

      await componentPage.clickInput();
      await componentPage.fillInput('te');
      await componentPage.pressInput('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('test 49');
    });

    test('the menu should not flip once opened', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      // this specifically start place at the top-start
      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.For+Tests.Menu+Flipping');

      await componentPage.clickInput();

      await componentPage.expectPlacement('top-start');

      await componentPage.fillInput('10');

      await componentPage.expectPlacement('top-start');
    });

    test('escape should not bubble outisde the combox component when active', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.For+Tests.Escape+Bubble');

      await componentPage.clickInput();
      await componentPage.pressInput('Escape');

      await componentPage.expectExternalEscapeNotTriggered();
    });
  });

  test.describe('async options', () => {
    test('displays type to search indicator', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

      await componentPage.clickInput();

      await expect(componentPage.typeToSearchOption).toBeVisible();
    });

    test('typing shows the load indicator', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 3000 });

      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

      await componentPage.fillInput('tes');

      await expect(componentPage.loadingOption).toBeVisible();
    });

    test('options show after loading', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 100 });

      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

      await componentPage.fillInput('tes');

      await expect(componentPage.option).toHaveCount(3);
    });


    test('display type to show option when removing all data in the input after showing options', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 100 });

      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

      await componentPage.fillInput('tes');

      await expect(componentPage.option).toHaveCount(3);

      await componentPage.input.fill('');

      await expect(componentPage.typeToSearchOption).toBeVisible();
    });

    test('display no results option when there are no results returned', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersNoResultsEndpoint(page);

      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

      await componentPage.fillInput('tes');

      await expect(componentPage.noResultsOption).toBeVisible();
    });

    test('menu goes back to typing indicator when the input value goes from above to below the character threshold', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 100 });
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

      await componentPage.fillInput('tes');

      await expect(componentPage.option).toHaveCount(3);

      await componentPage.pressInput('Backspace');

      await expect(componentPage.typeToSearchOption).toBeVisible();
    });
  });

  test.describe('grouped options', () => {
    test('up arrow works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Filtering');

      await componentPage.clickInput();
      await componentPage.pressInput('ArrowUp');

      await componentPage.expectHighlightedOptionDisplay('Option 2-4');
    });

    test('down arrow works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Filtering');

      await componentPage.clickInput();
      await componentPage.hoverOption(7);
      await componentPage.pressInput('ArrowDown');

      await componentPage.expectHighlightedOptionDisplay('Option 1-1');
    });

    test('input filtering works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Filtering');

      await componentPage.clickInput();
      await componentPage.fillInput('3');

      await componentPage.expectOptionCount(2);
      await componentPage.expectOptionDisplay(0, 'Option 1-3');
      await componentPage.expectOptionDisplay(1, 'Option 2-3');
    });

    test('selected filtering works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Filtering+Multiple');

      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectOptionCount(7);
      await componentPage.expectNotOptionDisplay(0, 'Option 1-1');
    });

    test('filtering removes groups that have no options', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Filtering');

      await componentPage.clickInput();
      await componentPage.fillInput('1-4');

      await componentPage.expectGroupHeaderCount(1);
    });

    test('mouse hover works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Filtering');

      await componentPage.clickInput();
      await componentPage.hoverOption(4);

      await componentPage.expectHighlightedOptionDisplay('Option 2-1');
    });

    test('async works', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 500 });
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Async');

      await componentPage.fillInput('tes');

      await componentPage.expectGroupHeaderCount(2);
      await componentPage.expectOptionCount(6);
    });

    test('static + dynamic options hovering works', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersEndpoint(page, {
        delay: 500,
        objectCount: 6,
      });
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Grouped.Async');

      await componentPage.fillInput('tes');
      await componentPage.hoverOption(3);

      await componentPage.expectHighlightedOptionDisplay('Test Admin1');
    });
  });

  test.describe('edge case bugs', { tag: ['@edge-case'] }, () => {
    test('selecting a value, clearing that select and selecting the same value works', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Simple');

      await componentPage.clickInput();
      await componentPage.clickOption(0);
      await componentPage.clickInput();
      await componentPage.clickClearOption();
      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectInputValue('Option 1');
      await componentPage.expectSelectedValue('[{"value":"1","display":"Option 1","meta":{"testing":"testing"}}]');
    });

    test('the previously highlighted option is not longer highlighted if input goes below the character threshold and then back above it', async ({ page }) => {
      await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 100 });

      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Async');

      await componentPage.fillInput('tes');
      await componentPage.hoverOption(1);

      await componentPage.expectHighlightedOptionDisplay('Test User2');

      await componentPage.pressInput('Backspace');
      await componentPage.fillInput('tes');

      await componentPage.expectHighlightedOptionCount(0);
    });

    test('clicking an option for multiple select updates selected immediately', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');

      await componentPage.clickInput();
      await componentPage.clickOption(0);

      await componentPage.expectDropDownSelectedOptionCount(1);
    });

    test('add data attribute to options to be able to test to make sure the placement on the options does not change when the height of the options change while text filtering', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Simple');
    });

    test('make a select in filtering multiple mode, typing, then clearing the type still filters select options', async ({ page }) => {
      const componentPage = new ComboboxPage(page);

      await componentPage.goto('http://localhost:3000/sandbox?component=Combobox.Multiple.Filtering');

      await componentPage.clickInput();
      await componentPage.clickOption(0);
      await componentPage.fillInput('o');

      await componentPage.expectOptionDisplay(0, 'Option 2');

      await componentPage.pressInput('Backspace');

      await componentPage.expectOptionDisplay(0, 'Option 2');
    });
  });
});
