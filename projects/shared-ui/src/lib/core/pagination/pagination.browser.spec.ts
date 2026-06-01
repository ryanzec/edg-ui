import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils, type SilencedLogManager } from '../../../../../../vitest-browser-utils';
import { Pagination } from './pagination';

@Component({
  selector: 'test-pagination-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  host: { class: 'block' },
  template: `
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
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class PaginationHost {
  public readonly totalItems = signal<number>(100);
  public readonly visiblePages = signal<number>(7);
  public readonly itemsPerPageOptions = signal<number[]>([5, 10, 20, 50]);
  public readonly disabled = signal<boolean>(false);
  public readonly currentPage = signal<number>(1);
  public readonly itemsPerPage = signal<number>(10);
  public readonly ariaLabel = signal<string>('pagination');
  public readonly firstPageAriaLabel = signal<string>('First page');
  public readonly previousPageAriaLabel = signal<string>('Previous page');
  public readonly nextPageAriaLabel = signal<string>('Next page');
  public readonly lastPageAriaLabel = signal<string>('Last page');
  public readonly itemsPerPageAriaLabel = signal<string>('Rows per page');
  public readonly pageAriaLabelFn = signal<(page: number) => string>((page) => `Page ${page}`);

  protected readonly currentPageChangeCount = signal<number>(0);
  protected readonly itemsPerPageChangeCount = signal<number>(0);

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

type PaginationHostConfig = {
  totalItems?: number;
  visiblePages?: number;
  itemsPerPageOptions?: number[];
  disabled?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  ariaLabel?: string;
  firstPageAriaLabel?: string;
  previousPageAriaLabel?: string;
  nextPageAriaLabel?: string;
  lastPageAriaLabel?: string;
  itemsPerPageAriaLabel?: string;
  pageAriaLabelFn?: (page: number) => string;
};

describe('Pagination (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createPagination = (config: PaginationHostConfig = {}): ComponentFixture<PaginationHost> =>
    createFixture(PaginationHost, (instance) => {
      if (config.totalItems !== undefined) {
        instance.totalItems.set(config.totalItems);
      }

      if (config.visiblePages !== undefined) {
        instance.visiblePages.set(config.visiblePages);
      }

      if (config.itemsPerPageOptions !== undefined) {
        instance.itemsPerPageOptions.set(config.itemsPerPageOptions);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.currentPage !== undefined) {
        instance.currentPage.set(config.currentPage);
      }

      if (config.itemsPerPage !== undefined) {
        instance.itemsPerPage.set(config.itemsPerPage);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }

      if (config.firstPageAriaLabel !== undefined) {
        instance.firstPageAriaLabel.set(config.firstPageAriaLabel);
      }

      if (config.previousPageAriaLabel !== undefined) {
        instance.previousPageAriaLabel.set(config.previousPageAriaLabel);
      }

      if (config.nextPageAriaLabel !== undefined) {
        instance.nextPageAriaLabel.set(config.nextPageAriaLabel);
      }

      if (config.lastPageAriaLabel !== undefined) {
        instance.lastPageAriaLabel.set(config.lastPageAriaLabel);
      }

      if (config.itemsPerPageAriaLabel !== undefined) {
        instance.itemsPerPageAriaLabel.set(config.itemsPerPageAriaLabel);
      }

      if (config.pageAriaLabelFn !== undefined) {
        instance.pageAriaLabelFn.set(config.pageAriaLabelFn);
      }
    });

  // the cdk overlay panel for the items-per-page selector renders outside the fixture, on document.body
  const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-drop-down-selector-overlay');

  const waitForOverlayPanel = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

    return queryOverlayPanel() as HTMLElement;
  };

  const waitForOverlayPanelClosed = async (): Promise<void> => {
    await waitFor(() => expect(queryOverlayPanel()).toBeNull());
  };

  const getNavButton = (host: HTMLElement, ariaLabel: string): HTMLButtonElement => {
    const button = host.querySelector<HTMLButtonElement>(`.nav button[aria-label="${ariaLabel}"]`);

    if (!button) {
      throw new Error(`unable to find nav button with aria-label "${ariaLabel}"`);
    }

    return button;
  };

  const getPageButton = (host: HTMLElement, pageAriaLabel: string): HTMLButtonElement => {
    const button = host.querySelector<HTMLButtonElement>(`.nav button[aria-label="${pageAriaLabel}"]`);

    if (!button) {
      throw new Error(`unable to find page button with aria-label "${pageAriaLabel}"`);
    }

    return button;
  };

  const getAllPageButtons = (host: HTMLElement): HTMLButtonElement[] =>
    Array.from(host.querySelectorAll<HTMLButtonElement>('.nav button[aria-label^="Page "], .nav button[aria-current]'));

  const getItemsPerPageTrigger = (host: HTMLElement): HTMLButtonElement => {
    const trigger = host.querySelector<HTMLButtonElement>('.items-select button');

    if (!trigger) {
      throw new Error('unable to find items-per-page trigger button');
    }

    return trigger;
  };

  const getOverlayOptions = (panel: HTMLElement): HTMLButtonElement[] =>
    Array.from(panel.querySelectorAll<HTMLButtonElement>('button[role="option"]'));

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes / backdrops left in the body so a stale panel can't leak forward
    document.querySelectorAll('.org-drop-down-selector-overlay').forEach((panel) => panel.remove());
    document.querySelectorAll('.cdk-overlay-backdrop').forEach((backdrop) => backdrop.remove());
  });

  describe('host landmark and aria attributes', () => {
    it('exposes the navigation role on the host', () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      expect(host.getAttribute('role')).toBe('navigation');
    });

    it('exposes the default aria-label on the host', () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      expect(host.getAttribute('aria-label')).toBe('pagination');
    });

    it('reflects a custom aria-label on the host', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.ariaLabel.set('Custom pagination');
      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBe('Custom pagination');
    });

    it('omits aria-disabled and data-disabled by default', () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      expect(host.getAttribute('aria-disabled')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
    });

    it('reflects the disabled state on the host', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(host.getAttribute('aria-disabled')).toBe('true');
      expect(host.getAttribute('data-disabled')).toBe('');
    });
  });

  describe('result text', () => {
    it('renders the default result range', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const result = host.querySelector('.result') as HTMLElement;

      await waitFor(() => expect(result.textContent?.replace(/\s+/g, ' ').trim()).toBe('1–10 of 100'));
    });

    it('updates the result range when the current page changes', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const result = host.querySelector('.result') as HTMLElement;

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);

      await waitFor(() => expect(result.textContent?.replace(/\s+/g, ' ').trim()).toBe('41–50 of 100'));
    });

    it('renders no results when total items is zero', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const result = host.querySelector('.result') as HTMLElement;

      fixture.componentInstance.totalItems.set(0);
      await flush(fixture);

      await waitFor(() => expect(result.textContent?.trim()).toBe('No results found'));
    });
  });

  describe('visible page items', () => {
    let logManagerSilence: SilencedLogManager;

    beforeEach(() => {
      logManagerSilence = vitestBrowserUtils.silenceLogManager();
    });

    afterEach(() => {
      logManagerSilence.restore();
    });

    it('renders the expected page buttons for the first page', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      await waitFor(() => {
        const pages = getAllPageButtons(host).map((button) => button.textContent?.trim());

        expect(pages).toEqual(['1', '2', '3', '4', '5', '6', '10']);
      });
    });

    it('renders ellipsis on both sides for a middle page', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);

      await waitFor(() => {
        const ellipses = host.querySelectorAll('.ellipsis');

        expect(ellipses.length).toBe(2);
        expect(ellipses[0].getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('marks the active page with aria-current', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);

      await waitFor(() => {
        const active = host.querySelector('.nav org-button[aria-current="page"]') as HTMLElement;

        expect(active).not.toBeNull();
        expect(active.querySelector('button')?.getAttribute('aria-label')).toBe('Page 5');
      });
    });

    it('uses the default aria-label pattern for page buttons', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      await waitFor(() => {
        const pageOne = host.querySelector('.nav button[aria-label="Page 1"]') as HTMLButtonElement;

        expect(pageOne).not.toBeNull();
        expect(pageOne.textContent?.trim()).toBe('1');
      });
    });

    it('uses a custom aria-label fn for page buttons', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.pageAriaLabelFn.set((page) => `Go to page ${page}`);
      await flush(fixture);

      await waitFor(() => {
        const pageOne = host.querySelector('.nav button[aria-label="Go to page 1"]') as HTMLButtonElement;

        expect(pageOne).not.toBeNull();
      });
    });

    it('bumps an even visiblePages to the next odd count', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.visiblePages.set(6);
      await flush(fixture);

      await waitFor(() => {
        const pages = getAllPageButtons(host);

        // visiblePages=6 → bumped to 7, default totalPages=10 → 7 numeric page slots + first + last collapses to 7 + ellipsis
        expect(pages.length).toBe(7);
      });
    });
  });

  describe('navigation button clicks', () => {
    it('advances the current page when clicking next', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getNavButton(host, 'Next page'));

      await waitFor(() => expect(readout.textContent).toContain('currentPage=2'));
    });

    it('decrements the current page when clicking previous', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

      await userEvent.click(getNavButton(host, 'Previous page'));

      await waitFor(() => expect(readout.textContent).toContain('currentPage=4'));
    });

    it('jumps to page one when clicking first', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(10);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('currentPage=10'));

      await userEvent.click(getNavButton(host, 'First page'));

      await waitFor(() => expect(readout.textContent).toContain('currentPage=1'));
    });

    it('jumps to the final page when clicking last', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getNavButton(host, 'Last page'));

      await waitFor(() => expect(readout.textContent).toContain('currentPage=10'));
    });

    it('navigates to a clicked numeric page button', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getPageButton(host, 'Page 3'));

      await waitFor(() => expect(readout.textContent).toContain('currentPage=3'));
    });

    it('emits currentPageChange on navigation', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('currentPageChangeCount=0');

      await userEvent.click(getNavButton(host, 'Next page'));

      await waitFor(() => expect(readout.textContent).toContain('currentPageChangeCount=1'));
    });
  });

  describe('per-button disabled state', () => {
    it('disables first and previous on the first page', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      await waitFor(() => {
        expect(getNavButton(host, 'First page').disabled).toBe(true);
        expect(getNavButton(host, 'Previous page').disabled).toBe(true);
        expect(getNavButton(host, 'Next page').disabled).toBe(false);
        expect(getNavButton(host, 'Last page').disabled).toBe(false);
      });
    });

    it('disables next and last on the last page', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.currentPage.set(10);
      await flush(fixture);

      await waitFor(() => {
        expect(getNavButton(host, 'First page').disabled).toBe(false);
        expect(getNavButton(host, 'Previous page').disabled).toBe(false);
        expect(getNavButton(host, 'Next page').disabled).toBe(true);
        expect(getNavButton(host, 'Last page').disabled).toBe(true);
      });
    });

    it('disables all buttons when pagination is disabled', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.currentPage.set(5);
      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      await waitFor(() => {
        expect(getNavButton(host, 'First page').disabled).toBe(true);
        expect(getNavButton(host, 'Previous page').disabled).toBe(true);
        expect(getNavButton(host, 'Next page').disabled).toBe(true);
        expect(getNavButton(host, 'Last page').disabled).toBe(true);

        for (const pageButton of getAllPageButtons(host)) {
          expect(pageButton.disabled).toBe(true);
        }
      });
    });

    it('ignores navigation clicks when disabled', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(5);
      fixture.componentInstance.disabled.set(true);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

      const nextButton = getNavButton(host, 'Next page');

      nextButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('currentPage=5');
    });
  });

  describe('items-per-page selector', () => {
    it('opens the selector on trigger click', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      await userEvent.click(getItemsPerPageTrigger(host));

      const panel = await waitForOverlayPanel();
      const options = getOverlayOptions(panel);

      expect(options.map((option) => option.textContent?.trim())).toEqual(['5', '10', '20', '50']);
    });

    it('updates the value and resets current page on selection', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);
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
    });

    it('emits itemsPerPageChange on selection', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('itemsPerPageChangeCount=0');

      await userEvent.click(getItemsPerPageTrigger(host));
      const panel = await waitForOverlayPanel();
      const fiftyOption = getOverlayOptions(panel).find((option) => option.textContent?.trim() === '50');

      await userEvent.click(fiftyOption as HTMLButtonElement);

      await waitForOverlayPanelClosed();

      await waitFor(() => expect(readout.textContent).toContain('itemsPerPageChangeCount=1'));
    });

    it('disables the selector when pagination is disabled', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      await waitFor(() => expect(getItemsPerPageTrigger(host).disabled).toBe(true));
    });
  });

  describe('keyboard navigation', () => {
    it('advances the current page on ArrowRight', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      const pageOne = getPageButton(host, 'Page 1');

      pageOne.focus();
      pageOne.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('currentPage=2'));
    });

    it('decrements the current page on ArrowLeft', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

      const activePage = getPageButton(host, 'Page 5');

      activePage.focus();
      activePage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('currentPage=4'));
    });

    it('jumps to the first page on Home', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

      const activePage = getPageButton(host, 'Page 5');

      activePage.focus();
      activePage.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('currentPage=1'));
    });

    it('jumps to the last page on End', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      const pageOne = getPageButton(host, 'Page 1');

      pageOne.focus();
      pageOne.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('currentPage=10'));
    });

    it('is a no-op on ArrowLeft from the first page', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      const pageOne = getPageButton(host, 'Page 1');

      pageOne.focus();
      pageOne.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('currentPage=1');
    });

    it('ignores keyboard navigation when pagination is disabled', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(5);
      fixture.componentInstance.disabled.set(true);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

      const navGroup = host.querySelector('.nav') as HTMLElement;

      navGroup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
      navGroup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
      navGroup.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('currentPage=5');
    });
  });

  describe('brain clamping effects', () => {
    it('clamps the current page when total items shrinks', async () => {
      const fixture = createPagination();
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.currentPage.set(5);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('currentPage=5'));

      // totalItems=15, itemsPerPage=10 → totalPages=2; current=5 must clamp down to 2
      fixture.componentInstance.totalItems.set(15);
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('currentPage=2'));
    });

    it('resets items-per-page when no longer in options', async () => {
      const fixture = createPagination();
      const readout = queryByTestId(fixture, 'readout');

      // start with itemsPerPage=20 (in default options [5,10,20,50])
      fixture.componentInstance.itemsPerPage.set(20);
      await flush(fixture);
      await waitFor(() => expect(readout.textContent).toContain('itemsPerPage=20'));

      // swap options so 20 is no longer offered; brain effect resets to first option (10)
      fixture.componentInstance.itemsPerPageOptions.set([10, 25, 50]);
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('itemsPerPage=10'));
    });
  });

  describe('custom per-button aria labels', () => {
    it('applies a custom first-page aria-label to the button', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.firstPageAriaLabel.set('Jump to first');
      await flush(fixture);

      await waitFor(() => {
        expect(host.querySelector('.nav button[aria-label="Jump to first"]')).not.toBeNull();
      });
    });

    it('applies custom previous, next, and last aria-labels to the buttons', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.previousPageAriaLabel.set('Step back');
      fixture.componentInstance.nextPageAriaLabel.set('Step forward');
      fixture.componentInstance.lastPageAriaLabel.set('Jump to last');
      await flush(fixture);

      await waitFor(() => {
        expect(host.querySelector('.nav button[aria-label="Step back"]')).not.toBeNull();
        expect(host.querySelector('.nav button[aria-label="Step forward"]')).not.toBeNull();
        expect(host.querySelector('.nav button[aria-label="Jump to last"]')).not.toBeNull();
      });
    });

    it('applies a custom items-per-page aria-label to the trigger', async () => {
      const fixture = createPagination();
      const host = queryByTestId(fixture, 'pagination');

      fixture.componentInstance.itemsPerPageAriaLabel.set('Page size');
      await flush(fixture);

      await waitFor(() => {
        const trigger = getItemsPerPageTrigger(host);

        expect(trigger.getAttribute('aria-label')).toBe('Page size');
      });
    });
  });
});
