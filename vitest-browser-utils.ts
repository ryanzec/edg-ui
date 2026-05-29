import { ApplicationRef, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { userEvent } from 'vitest/browser';

/**
 * shared scaffolding for vitest browser component tests. each describe block creates its own harness
 * so the tracked active fixture never leaks across test files.
 */
export type BrowserTestHarness = {
  /** creates a fixture, runs the optional configure callback before the first change detection, then attaches it to the document body. */
  createFixture: <T>(component: Type<T>, configure?: (instance: T) => void) => ComponentFixture<T>;
  /** runs change detection and waits for the fixture to stabilize. */
  flush: (fixture: ComponentFixture<unknown>) => Promise<void>;
  /** retries the assertion while running change detection on the active fixture until it passes or times out. */
  waitFor: (assertion: () => void) => Promise<void>;
  /** finds an element inside the fixture by its data-testid, throwing when it is missing. */
  queryByTestId: (fixture: ComponentFixture<unknown>, testId: string) => HTMLElement;
  /** configures and compiles the testing module; use in beforeEach. */
  setupTestBed: () => Promise<void>;
  /** destroys and detaches the active fixture; use in afterEach. */
  destroyFixture: () => void;
};

/**
 * builds a self-contained set of browser-test helpers that share a single tracked active fixture.
 */
const createBrowserTestHarness = (): BrowserTestHarness => {
  let activeFixture: ComponentFixture<unknown> | undefined;

  // stored after setupTestBed so waitFor and flush can run a global app tick in addition to the
  // fixture's own detectChanges. this is needed for CDK overlay views created via CdkMenuTrigger
  // (TemplatePortal) which are attached to ApplicationRef and therefore outside the fixture's CD tree
  let appRef: ApplicationRef | undefined;

  const createFixture = <T>(component: Type<T>, configure?: (instance: T) => void): ComponentFixture<T> => {
    const fixture = TestBed.createComponent(component);

    configure?.(fixture.componentInstance);

    activeFixture = fixture as ComponentFixture<unknown>;
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    return fixture;
  };

  const flush = async (fixture: ComponentFixture<unknown>): Promise<void> => {
    appRef?.tick();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const waitFor = (assertion: () => void): Promise<void> =>
    vi.waitFor(
      async () => {
        appRef?.tick();
        activeFixture?.detectChanges();
        await activeFixture?.whenStable();
        assertion();
      },
      { timeout: 2000, interval: 20 }
    );

  const queryByTestId = (fixture: ComponentFixture<unknown>, testId: string): HTMLElement => {
    const element = (fixture.nativeElement as HTMLElement).querySelector(`[data-testid="${testId}"]`);

    if (!element) {
      throw new Error(`could not find element with data-testid="${testId}"`);
    }

    return element as HTMLElement;
  };

  const setupTestBed = async (): Promise<void> => {
    await TestBed.configureTestingModule({}).compileComponents();
    appRef = TestBed.inject(ApplicationRef);
  };

  const destroyFixture = (): void => {
    if (!activeFixture) {
      return;
    }

    const element = activeFixture.nativeElement as HTMLElement;

    activeFixture.destroy();
    element.remove();
    activeFixture = undefined;
  };

  return { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture };
};

/**
 * focuses an input matching the selector inside the host, parking the virtual cursor on it first so a
 * later-opening overlay never renders under the cursor (which would fire a stray mouseenter elsewhere).
 */
const focusInput = async (host: HTMLElement, selector: string): Promise<HTMLInputElement> => {
  const input = host.querySelector(selector) as HTMLInputElement;

  await userEvent.hover(input);
  input.focus();

  return input;
};

/**
 * no-ops the pointer-capture methods on an element so synthetic PointerEvents never throw InvalidPointerId
 * (a real browser rejects setPointerCapture for a pointerId with no active pointer).
 */
const stubPointerCapture = (element: HTMLElement): void => {
  element.setPointerCapture = (): void => undefined;
  element.hasPointerCapture = (): boolean => false;
  element.releasePointerCapture = (): void => undefined;
};

/** queries the active cdk overlay pane (overlays render on document.body, outside any fixture). */
const queryCdkOverlayPane = (): HTMLElement | null => document.body.querySelector('.cdk-overlay-pane');

/** queries the active cdk overlay backdrop element. */
const queryCdkOverlayBackdrop = (): HTMLElement | null => document.body.querySelector('.cdk-overlay-backdrop');

/** resolves after the given number of milliseconds; used to let real timers / measurement effects settle. */
const sleep = (durationMs: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, durationMs));

/** a controllable stub for the cdk Clipboard service; only the boolean-returning copy() is modeled. */
export type ClipboardStub = {
  /** the value provided to `{ provide: Clipboard, useValue: ... }`. */
  service: { copy: (text: string) => boolean };
  /** drives the boolean that `copy()` returns so success and failure paths can both be exercised. */
  setShouldSucceed: (value: boolean) => void;
  /** clears the recorded copy state; call in beforeEach. */
  reset: () => void;
  /** how many times `copy()` has been invoked since the last reset. */
  getCopyCount: () => number;
  /** the most recent text passed to `copy()`. */
  getLastCopiedText: () => string;
};

/**
 * builds a controllable stub of the cdk Clipboard service. provide `stub.service` via
 * `{ provide: Clipboard, useValue: stub.service }` so copy interactions are fully deterministic in a
 * unit test (no reliance on the browser clipboard or cdk's internal execCommand fallback).
 */
const createClipboardStub = (): ClipboardStub => {
  let shouldSucceed = true;
  let copyCount = 0;
  let lastCopiedText = '';

  return {
    service: {
      copy: (text: string): boolean => {
        copyCount++;
        lastCopiedText = text;

        return shouldSucceed;
      },
    },
    setShouldSucceed: (value: boolean): void => {
      shouldSucceed = value;
    },
    reset: (): void => {
      shouldSucceed = true;
      copyCount = 0;
      lastCopiedText = '';
    },
    getCopyCount: (): number => copyCount,
    getLastCopiedText: (): string => lastCopiedText,
  };
};

/** shared helpers for vitest browser component tests. */
export const vitestBrowserUtils = {
  createBrowserTestHarness,
  focusInput,
  stubPointerCapture,
  queryCdkOverlayPane,
  queryCdkOverlayBackdrop,
  sleep,
  createClipboardStub,
};
