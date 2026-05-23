// jsdom-style test environments do not implement window.matchMedia; stub it so services that read
// media queries (e.g. UiThemeManager) can be instantiated by the testbed.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom-style test environments do not implement IntersectionObserver; stub it so components that
// observe element visibility (e.g. UserDetails) can be instantiated by the testbed.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class {
    public readonly root = null;
    public readonly rootMargin = '';
    public readonly thresholds: readonly number[] = [];
    public observe(): void {}
    public unobserve(): void {}
    public disconnect(): void {}
    public takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}
