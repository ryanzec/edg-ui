import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, it, expect } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render nav items', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const anchorElements = compiled.querySelectorAll('a');
    const anchorElementTexts = Array.from(anchorElements).map((element) => element.textContent);

    expect(anchorElementTexts).toContain('Home');
    expect(anchorElementTexts).toContain('Bad Link');
  });
});
