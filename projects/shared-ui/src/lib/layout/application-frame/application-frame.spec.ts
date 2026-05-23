import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, it, expect } from 'vitest';

import { ApplicationFrame } from './application-frame';

describe('ApplicationFrame', () => {
  let component: ApplicationFrame;
  let fixture: ComponentFixture<ApplicationFrame>;

  beforeEach(async () => {
    window.matchMedia = ((): MediaQueryList => ({
      matches: false,
      media: '',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as Window['matchMedia'];

    await TestBed.configureTestingModule({
      imports: [ApplicationFrame],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationFrame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
