import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Pagination } from './pagination';

/** queries the cdk overlay panel for the items-per-page selector; overlays render outside the canvas. */
const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-drop-down-selector-overlay');

/** waits for the overlay panel to mount and returns its root element. */
const waitForOverlayPanel = async (): Promise<HTMLElement> => {
  await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

  return queryOverlayPanel() as HTMLElement;
};

/** waits for the overlay panel to unmount. */
const waitForOverlayPanelClosed = async (): Promise<void> => {
  await waitFor(() => expect(queryOverlayPanel()).toBeNull());
};

/** returns the inner native button rendered for an org-button with a given aria-label. */
const getNavButton = (host: HTMLElement, ariaLabel: string): HTMLButtonElement => {
  const button = host.querySelector<HTMLButtonElement>(`.nav button[aria-label="${ariaLabel}"]`);

  if (!button) {
    throw new Error(`unable to find nav button with aria-label "${ariaLabel}"`);
  }

  return button;
};

/** returns the inner native button representing a numeric page in the nav. */
const getPageButton = (host: HTMLElement, pageAriaLabel: string): HTMLButtonElement => {
  const button = host.querySelector<HTMLButtonElement>(`.nav button[aria-label="${pageAriaLabel}"]`);

  if (!button) {
    throw new Error(`unable to find page button with aria-label "${pageAriaLabel}"`);
  }

  return button;
};

/** returns every numeric page button (excludes first/prev/next/last) by reading aria-current candidates. */
const getAllPageButtons = (host: HTMLElement): HTMLButtonElement[] => {
  return Array.from(
    host.querySelectorAll<HTMLButtonElement>('.nav button[aria-label^="Page "], .nav button[aria-current]')
  );
};

/** returns the items-per-page trigger button inside the pagination host. */
const getItemsPerPageTrigger = (host: HTMLElement): HTMLButtonElement => {
  const trigger = host.querySelector<HTMLButtonElement>('.items-select button');

  if (!trigger) {
    throw new Error('unable to find items-per-page trigger button');
  }

  return trigger;
};

/** returns the option buttons rendered inside the items-per-page overlay panel. */
const getOverlayOptions = (panel: HTMLElement): HTMLButtonElement[] => {
  return Array.from(panel.querySelectorAll<HTMLButtonElement>('button[role="option"]'));
};

@Component({
  selector: 'story-pagination-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .pagination-wrapper {
        width: 50rem;
      }
    `,
  ],
  template: `
    <div class="pagination-wrapper">
      <org-pagination
        data-testid="pagination"
        [totalItems]="totalItems()"
        [visiblePages]="visiblePages()"
        [itemsPerPageOptions]="itemsPerPageOptions()"
        [disabled]="disabled()"
        [currentPage]="currentPage()"
        [itemsPerPage]="itemsPerPage()"
        [ariaLabel]="ariaLabel()"
        [firstPageAriaLabel]="firstPageAriaLabel()"
        [previousPageAriaLabel]="previousPageAriaLabel()"
        [nextPageAriaLabel]="nextPageAriaLabel()"
        [lastPageAriaLabel]="lastPageAriaLabel()"
        [itemsPerPageAriaLabel]="itemsPerPageAriaLabel()"
        [pageAriaLabelFn]="pageAriaLabelFn()"
        (currentPageChange)="onCurrentPageChange($event)"
        (itemsPerPageChange)="onItemsPerPageChange($event)"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-total-25" (click)="totalItems.set(25)">total-25</button>
      <button type="button" data-testid="ctl-total-100" (click)="totalItems.set(100)">total-100</button>
      <button type="button" data-testid="ctl-total-1000" (click)="totalItems.set(1000)">total-1000</button>
      <button type="button" data-testid="ctl-total-0" (click)="totalItems.set(0)">total-0</button>
      <button type="button" data-testid="ctl-total-15" (click)="totalItems.set(15)">total-15</button>
      <button type="button" data-testid="ctl-visible-5" (click)="visiblePages.set(5)">visible-5</button>
      <button type="button" data-testid="ctl-visible-6" (click)="visiblePages.set(6)">visible-6</button>
      <button type="button" data-testid="ctl-items-options-custom" (click)="itemsPerPageOptions.set([10, 25, 50])">
        items-options-custom
      </button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-current-1" (click)="currentPage.set(1)">current-1</button>
      <button type="button" data-testid="ctl-current-5" (click)="currentPage.set(5)">current-5</button>
      <button type="button" data-testid="ctl-current-last" (click)="currentPage.set(10)">current-last</button>
      <button type="button" data-testid="ctl-items-per-page-20" (click)="itemsPerPage.set(20)">
        items-per-page-20
      </button>
      <button type="button" data-testid="ctl-aria-label-custom" (click)="ariaLabel.set('Custom pagination')">
        aria-label-custom
      </button>
      <button type="button" data-testid="ctl-first-aria-custom" (click)="firstPageAriaLabel.set('Jump to first')">
        first-aria-custom
      </button>
      <button type="button" data-testid="ctl-previous-aria-custom" (click)="previousPageAriaLabel.set('Step back')">
        previous-aria-custom
      </button>
      <button type="button" data-testid="ctl-next-aria-custom" (click)="nextPageAriaLabel.set('Step forward')">
        next-aria-custom
      </button>
      <button type="button" data-testid="ctl-last-aria-custom" (click)="lastPageAriaLabel.set('Jump to last')">
        last-aria-custom
      </button>
      <button type="button" data-testid="ctl-items-aria-custom" (click)="itemsPerPageAriaLabel.set('Page size')">
        items-aria-custom
      </button>
      <button type="button" data-testid="ctl-page-aria-fn-custom" (click)="pageAriaLabelFn.set(customPageLabel)">
        page-aria-fn-custom
      </button>
    </div>
  `,
})
class StoryPaginationTestsShell {
  protected readonly totalItems = signal<number>(100);
  protected readonly visiblePages = signal<number>(7);
  protected readonly itemsPerPageOptions = signal<number[]>([5, 10, 20, 50]);
  protected readonly disabled = signal<boolean>(false);
  protected readonly currentPage = signal<number>(1);
  protected readonly itemsPerPage = signal<number>(10);
  protected readonly ariaLabel = signal<string>('pagination');
  protected readonly firstPageAriaLabel = signal<string>('First page');
  protected readonly previousPageAriaLabel = signal<string>('Previous page');
  protected readonly nextPageAriaLabel = signal<string>('Next page');
  protected readonly lastPageAriaLabel = signal<string>('Last page');
  protected readonly itemsPerPageAriaLabel = signal<string>('Rows per page');
  protected readonly pageAriaLabelFn = signal<(page: number) => string>((page) => `Page ${page}`);

  protected readonly currentPageChangeCount = signal<number>(0);
  protected readonly itemsPerPageChangeCount = signal<number>(0);

  protected readonly customPageLabel = (page: number): string => `Go to page ${page}`;

  protected readout(): string {
    return [
      `currentPage=${this.currentPage()}`,
      `itemsPerPage=${this.itemsPerPage()}`,
      `currentPageChangeCount=${this.currentPageChangeCount()}`,
      `itemsPerPageChangeCount=${this.itemsPerPageChangeCount()}`,
    ].join(' ');
  }

  protected onCurrentPageChange(page: number): void {
    this.currentPage.set(page);
    this.currentPageChangeCount.update((value) => value + 1);
  }

  protected onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage.set(itemsPerPage);
    this.itemsPerPageChangeCount.update((value) => value + 1);
  }
}

const meta: Meta = {
  title: 'Core/Components/Pagination/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-pagination-tests-shell />`,
  moduleMetadata: { imports: [StoryPaginationTestsShell] },
});

// host landmark + aria attributes

export const HostExposesNavigationRole: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await expect(host.getAttribute('role')).toBe('navigation');
  },
};

export const HostExposesDefaultAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await expect(host.getAttribute('aria-label')).toBe('pagination');
  },
};

export const HostReflectsCustomAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-custom'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Custom pagination'));
  },
};

export const HostOmitsAriaDisabledAndDataDisabledByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await expect(host.getAttribute('aria-disabled')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
  },
};

export const HostReflectsDisabledState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('aria-disabled')).toBe('true');
      expect(host.getAttribute('data-disabled')).toBe('');
    });
  },
};

// result text

export const RendersDefaultResultRange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const result = host.querySelector('.result') as HTMLElement;

    await waitFor(() => {
      expect(result.textContent?.replace(/\s+/g, ' ').trim()).toBe('1–10 of 100');
    });
  },
};

export const UpdatesResultRangeWhenCurrentPageChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const result = host.querySelector('.result') as HTMLElement;

    await userEvent.click(canvas.getByTestId('ctl-current-5'));

    await waitFor(() => {
      expect(result.textContent?.replace(/\s+/g, ' ').trim()).toBe('41–50 of 100');
    });
  },
};

export const RendersNoResultsWhenTotalItemsIsZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const result = host.querySelector('.result') as HTMLElement;

    await userEvent.click(canvas.getByTestId('ctl-total-0'));

    await waitFor(() => expect(result.textContent?.trim()).toBe('No results found'));
  },
};

// visible page items

export const RendersExpectedPageButtonsForFirstPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await waitFor(() => {
      const pages = getAllPageButtons(host).map((button) => button.textContent?.trim());

      expect(pages).toEqual(['1', '2', '3', '4', '5', '6', '10']);
    });
  },
};

export const RendersEllipsisOnBothSidesForMiddlePage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));

    await waitFor(() => {
      const ellipses = host.querySelectorAll('.ellipsis');

      expect(ellipses.length).toBe(2);
      expect(ellipses[0].getAttribute('aria-hidden')).toBe('true');
    });
  },
};

export const ActivePageHasAriaCurrent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));

    await waitFor(() => {
      const active = host.querySelector('.nav org-button[aria-current="page"]') as HTMLElement;

      expect(active).not.toBeNull();
      expect(active.querySelector('button')?.getAttribute('aria-label')).toBe('Page 5');
    });
  },
};

export const PageButtonsUseDefaultAriaLabelPattern: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await waitFor(() => {
      const pageOne = host.querySelector('.nav button[aria-label="Page 1"]') as HTMLButtonElement;

      expect(pageOne).not.toBeNull();
      expect(pageOne.textContent?.trim()).toBe('1');
    });
  },
};

export const PageButtonsUseCustomAriaLabelFn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-page-aria-fn-custom'));

    await waitFor(() => {
      const pageOne = host.querySelector('.nav button[aria-label="Go to page 1"]') as HTMLButtonElement;

      expect(pageOne).not.toBeNull();
    });
  },
};

export const EvenVisiblePagesRendersAsOddCountPlusOne: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-visible-6'));

    await waitFor(() => {
      const pages = getAllPageButtons(host);

      // visiblePages=6 → bumped to 7, default totalPages=10 → 7 numeric page slots + first + last collapses to 7 + ellipsis
      expect(pages.length).toBe(7);
    });
  },
};

// navigation button clicks

export const ClickingNextPageAdvancesCurrentPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getNavButton(host, 'Next page'));

    await waitFor(() => expect(readout.textContent).toContain('currentPage=2'));
  },
};

export const ClickingPreviousPageDecrementsCurrentPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

    await userEvent.click(getNavButton(host, 'Previous page'));

    await waitFor(() => expect(readout.textContent).toContain('currentPage=4'));
  },
};

export const ClickingFirstPageJumpsToPageOne: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-last'));
    await waitFor(() => expect(readout.textContent).toContain('currentPage=10'));

    await userEvent.click(getNavButton(host, 'First page'));

    await waitFor(() => expect(readout.textContent).toContain('currentPage=1'));
  },
};

export const ClickingLastPageJumpsToFinalPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getNavButton(host, 'Last page'));

    await waitFor(() => expect(readout.textContent).toContain('currentPage=10'));
  },
};

export const ClickingNumericPageButtonNavigatesToThatPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getPageButton(host, 'Page 3'));

    await waitFor(() => expect(readout.textContent).toContain('currentPage=3'));
  },
};

export const NavigationEmitsCurrentPageChange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('currentPageChangeCount=0');

    await userEvent.click(getNavButton(host, 'Next page'));

    await waitFor(() => expect(readout.textContent).toContain('currentPageChangeCount=1'));
  },
};

// disabled state per button

export const FirstAndPreviousDisabledOnFirstPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await waitFor(() => {
      expect(getNavButton(host, 'First page').disabled).toBe(true);
      expect(getNavButton(host, 'Previous page').disabled).toBe(true);
      expect(getNavButton(host, 'Next page').disabled).toBe(false);
      expect(getNavButton(host, 'Last page').disabled).toBe(false);
    });
  },
};

export const NextAndLastDisabledOnLastPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-current-last'));

    await waitFor(() => {
      expect(getNavButton(host, 'First page').disabled).toBe(false);
      expect(getNavButton(host, 'Previous page').disabled).toBe(false);
      expect(getNavButton(host, 'Next page').disabled).toBe(true);
      expect(getNavButton(host, 'Last page').disabled).toBe(true);
    });
  },
};

export const AllButtonsDisabledWhenPaginationDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(getNavButton(host, 'First page').disabled).toBe(true);
      expect(getNavButton(host, 'Previous page').disabled).toBe(true);
      expect(getNavButton(host, 'Next page').disabled).toBe(true);
      expect(getNavButton(host, 'Last page').disabled).toBe(true);

      for (const pageButton of getAllPageButtons(host)) {
        expect(pageButton.disabled).toBe(true);
      }
    });
  },
};

export const DisabledPaginationIgnoresNavigationClicks: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const nextButton = getNavButton(host, 'Next page');

    nextButton.click();

    await expect(readout.textContent).toContain('currentPage=5');
  },
};

// items-per-page selector (real overlay interaction)

export const ItemsPerPageSelectorOpensOnTriggerClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(getItemsPerPageTrigger(host));

    const panel = await waitForOverlayPanel();
    const options = getOverlayOptions(panel);

    await expect(options.map((option) => option.textContent?.trim())).toEqual(['5', '10', '20', '50']);
  },
};

export const SelectingItemsPerPageUpdatesValueAndResetsCurrentPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

    await userEvent.click(getItemsPerPageTrigger(host));
    const panel = await waitForOverlayPanel();
    const twentyOption = getOverlayOptions(panel).find((option) => option.textContent?.trim() === '20');

    await userEvent.click(twentyOption as HTMLButtonElement);

    await waitForOverlayPanelClosed();

    await waitFor(() => {
      expect(readout.textContent).toContain('itemsPerPage=20');
      expect(readout.textContent).toContain('currentPage=1');
    });
  },
};

export const SelectingItemsPerPageEmitsItemsPerPageChange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('itemsPerPageChangeCount=0');

    await userEvent.click(getItemsPerPageTrigger(host));
    const panel = await waitForOverlayPanel();
    const fiftyOption = getOverlayOptions(panel).find((option) => option.textContent?.trim() === '50');

    await userEvent.click(fiftyOption as HTMLButtonElement);

    await waitForOverlayPanelClosed();

    await waitFor(() => expect(readout.textContent).toContain('itemsPerPageChangeCount=1'));
  },
};

export const ItemsPerPageSelectorDisabledWhenPaginationDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(getItemsPerPageTrigger(host).disabled).toBe(true));
  },
};

// keyboard navigation

export const ArrowRightAdvancesCurrentPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    const pageOne = getPageButton(host, 'Page 1');

    pageOne.focus();
    fireEvent.keyDown(pageOne, { key: 'ArrowRight' });

    await waitFor(() => expect(readout.textContent).toContain('currentPage=2'));
  },
};

export const ArrowLeftDecrementsCurrentPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

    const activePage = getPageButton(host, 'Page 5');

    activePage.focus();
    fireEvent.keyDown(activePage, { key: 'ArrowLeft' });

    await waitFor(() => expect(readout.textContent).toContain('currentPage=4'));
  },
};

export const HomeKeyJumpsToFirstPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

    const activePage = getPageButton(host, 'Page 5');

    activePage.focus();
    fireEvent.keyDown(activePage, { key: 'Home' });

    await waitFor(() => expect(readout.textContent).toContain('currentPage=1'));
  },
};

export const EndKeyJumpsToLastPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    const pageOne = getPageButton(host, 'Page 1');

    pageOne.focus();
    fireEvent.keyDown(pageOne, { key: 'End' });

    await waitFor(() => expect(readout.textContent).toContain('currentPage=10'));
  },
};

export const ArrowLeftIsNoOpOnFirstPage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    const pageOne = getPageButton(host, 'Page 1');

    pageOne.focus();
    fireEvent.keyDown(pageOne, { key: 'ArrowLeft' });

    await expect(readout.textContent).toContain('currentPage=1');
  },
};

export const KeyboardNavigationDisabledWhenPaginationDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

    const navGroup = host.querySelector('.nav') as HTMLElement;

    fireEvent.keyDown(navGroup, { key: 'ArrowRight' });
    fireEvent.keyDown(navGroup, { key: 'Home' });
    fireEvent.keyDown(navGroup, { key: 'End' });

    await expect(readout.textContent).toContain('currentPage=5');
  },
};

// brain effects (clamping)

export const CurrentPageClampsWhenTotalItemsShrinks: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-current-5'));
    await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

    // totalItems=15, itemsPerPage=10 → totalPages=2; current=5 must clamp down to 2
    await userEvent.click(canvas.getByTestId('ctl-total-15'));

    await waitFor(() => expect(readout.textContent).toContain('currentPage=2'));
  },
};

export const ItemsPerPageResetsWhenNoLongerInOptions: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    // start with itemsPerPage=20 (in default options [5,10,20,50])
    await userEvent.click(canvas.getByTestId('ctl-items-per-page-20'));
    await waitFor(() => expect(readout.textContent).toContain('itemsPerPage=20'));

    // swap options so 20 is no longer offered; brain effect resets to first option (10)
    await userEvent.click(canvas.getByTestId('ctl-items-options-custom'));

    await waitFor(() => expect(readout.textContent).toContain('itemsPerPage=10'));
  },
};

// custom per-button aria labels

export const CustomFirstPageAriaLabelAppliedToButton: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-first-aria-custom'));

    await waitFor(() => {
      expect(host.querySelector('.nav button[aria-label="Jump to first"]')).not.toBeNull();
    });
  },
};

export const CustomPreviousNextAndLastAriaLabelsAppliedToButtons: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-previous-aria-custom'));
    await userEvent.click(canvas.getByTestId('ctl-next-aria-custom'));
    await userEvent.click(canvas.getByTestId('ctl-last-aria-custom'));

    await waitFor(() => {
      expect(host.querySelector('.nav button[aria-label="Step back"]')).not.toBeNull();
      expect(host.querySelector('.nav button[aria-label="Step forward"]')).not.toBeNull();
      expect(host.querySelector('.nav button[aria-label="Jump to last"]')).not.toBeNull();
    });
  },
};

export const CustomItemsPerPageAriaLabelAppliedToTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('pagination');

    await userEvent.click(canvas.getByTestId('ctl-items-aria-custom'));

    await waitFor(() => {
      const trigger = getItemsPerPageTrigger(host);

      expect(trigger.getAttribute('aria-label')).toBe('Page size');
    });
  },
};
