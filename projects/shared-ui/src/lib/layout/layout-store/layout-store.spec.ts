import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect } from 'vitest';

import { LayoutStore } from './layout-store';

describe('LayoutStore', () => {
  let store: LayoutStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(LayoutStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('exposes hardcoded organization, user, navigation, and settings defaults', () => {
      expect(store.currentOrganization().id).toBe('halcyon');
      expect(store.currentOrganization().name).toBe('Halcyon');
      expect(store.availableOrganizations().length).toBeGreaterThan(1);
      expect(store.availableOrganizations()[0].id).toBe('halcyon');
      expect(store.userName()).toBe('Maya Brennan');
      expect(store.userEmail()).toBe('maya@acme.co');
      expect(store.userStatusColor()).toBe('safe');
      expect(store.navigationItems().length).toBeGreaterThan(0);
      expect(store.settingsMenuItems().length).toBeGreaterThan(0);
    });

    it('starts with the sidebar expanded', () => {
      expect(store.collapsed()).toBe(false);
    });
  });

  describe('setCurrentOrganization', () => {
    it('updates the current organization to the provided value', () => {
      const next = { id: 'acme', name: 'Acme Co.' };

      store.setCurrentOrganization(next);

      expect(store.currentOrganization()).toEqual(next);
    });
  });

  describe('setCollapsed', () => {
    it('sets the collapsed state to the provided value', () => {
      store.setCollapsed(true);
      expect(store.collapsed()).toBe(true);

      store.setCollapsed(false);
      expect(store.collapsed()).toBe(false);
    });
  });

  describe('toggleCollapsed', () => {
    it('flips the collapsed state on each call', () => {
      expect(store.collapsed()).toBe(false);

      store.toggleCollapsed();
      expect(store.collapsed()).toBe(true);

      store.toggleCollapsed();
      expect(store.collapsed()).toBe(false);
    });
  });
});
