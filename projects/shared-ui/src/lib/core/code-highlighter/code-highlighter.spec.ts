import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, it, describe, beforeEach } from 'vitest';

import { CodeHighlighter } from './code-highlighter';

describe('CodeHighlighter', () => {
  let component: CodeHighlighter;
  let fixture: ComponentFixture<CodeHighlighter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeHighlighter],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeHighlighter);
    fixture.componentRef.setInput('text', 'const value = 1;');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
