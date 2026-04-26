import { TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { Observable, Subject, isObservable, lastValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { unsavedChangesGuard } from './unsaved-changes-guard';
import { UnsavedChangesAware } from './unsaved-changes-aware';

const callGuard = (component: unknown): boolean | Observable<boolean> => {
  return TestBed.runInInjectionContext(() =>
    unsavedChangesGuard(component as never, null as never, null as never, null as never)
  ) as boolean | Observable<boolean>;
};

describe('unsavedChangesGuard', () => {
  let dialogClosedSubject: Subject<boolean | undefined>;
  let dialogOpenSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dialogClosedSubject = new Subject<boolean | undefined>();
    dialogOpenSpy = vi.fn().mockReturnValue({ closed: dialogClosedSubject.asObservable() });

    TestBed.configureTestingModule({
      providers: [{ provide: Dialog, useValue: { open: dialogOpenSpy } }],
    });
  });

  describe('when the component does not implement UnsavedChangesAware', () => {
    it('returns true when the component is null', () => {
      const result = callGuard(null);

      expect(result).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('returns true when the component lacks a hasUnsavedChanges method', () => {
      const result = callGuard({ unrelated: () => true });

      expect(result).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });
  });

  describe('when the component implements UnsavedChangesAware', () => {
    it('returns true and skips the dialog when hasUnsavedChanges() returns false', () => {
      const component: UnsavedChangesAware = { hasUnsavedChanges: () => false };

      const result = callGuard(component);

      expect(result).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('opens the dialog and resolves to true when the user discards changes', async () => {
      const component: UnsavedChangesAware = { hasUnsavedChanges: () => true };

      const result = callGuard(component);

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(isObservable(result)).toBe(true);

      const promise = lastValueFrom(result as Observable<boolean>);

      dialogClosedSubject.next(true);
      dialogClosedSubject.complete();

      await expect(promise).resolves.toBe(true);
    });

    it('opens the dialog and resolves to false when the user stays on the page', async () => {
      const component: UnsavedChangesAware = { hasUnsavedChanges: () => true };

      const result = callGuard(component);

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(isObservable(result)).toBe(true);

      const promise = lastValueFrom(result as Observable<boolean>);

      dialogClosedSubject.next(false);
      dialogClosedSubject.complete();

      await expect(promise).resolves.toBe(false);
    });

    it('resolves to false when the dialog is dismissed without an explicit choice', async () => {
      const component: UnsavedChangesAware = { hasUnsavedChanges: () => true };

      const result = callGuard(component);

      const promise = lastValueFrom(result as Observable<boolean>);

      dialogClosedSubject.next(undefined);
      dialogClosedSubject.complete();

      await expect(promise).resolves.toBe(false);
    });
  });
});
