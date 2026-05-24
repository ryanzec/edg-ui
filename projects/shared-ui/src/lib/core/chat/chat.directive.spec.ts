import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { ChatBrainDirective, type ChatAriaLive, type ChatRole } from './chat-brain';
import { ChatMessageBrainDirective, type ChatMessageRole, type ChatMessageState } from './chat-message-brain';
import { ChatBlockBrainDirective } from './chat-block-brain';
import { ChatReactionBrainDirective } from './chat-reaction-brain';

describe('ChatBrainDirective', () => {
  @Component({
    selector: 'test-chat-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatBrainDirective],
    template: ` <div orgChatBrain [role]="role()" [ariaLive]="ariaLive()" data-testid="chat-brain"></div> `,
  })
  class ChatBrainHost {
    public readonly role = signal<ChatRole>('log');
    public readonly ariaLive = signal<ChatAriaLive>('polite');
  }

  let fixture: ComponentFixture<ChatBrainHost>;
  let component: ChatBrainHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="chat-brain"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('host aria bindings', () => {
    it('applies the default role of "log" and aria-live "polite" on the host', () => {
      const host = getHost();

      expect(host.getAttribute('role')).toBe('log');
      expect(host.getAttribute('aria-live')).toBe('polite');
    });

    it('reflects the role input on the host role attribute', async () => {
      component.role.set('feed');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('role')).toBe('feed');
    });

    it('reflects the ariaLive input on the host aria-live attribute', async () => {
      component.ariaLive.set('assertive');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('aria-live')).toBe('assertive');
    });
  });
});

describe('ChatMessageBrainDirective', () => {
  @Component({
    selector: 'test-chat-message-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatMessageBrainDirective],
    template: `
      <div
        orgChatMessageBrain
        #brain="orgChatMessageBrain"
        [role]="role()"
        [state]="state()"
        data-testid="chat-message-brain"
      ></div>
    `,
  })
  class ChatMessageBrainHost {
    public readonly role = signal<ChatMessageRole>('assistant');
    public readonly state = signal<ChatMessageState>('idle');

    public readonly brain = viewChild.required<ChatMessageBrainDirective>('brain');
  }

  let fixture: ComponentFixture<ChatMessageBrainHost>;
  let component: ChatMessageBrainHost;

  const getHost = (): HTMLElement =>
    fixture.nativeElement.querySelector('[data-testid="chat-message-brain"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('ariaRole', () => {
    it('returns "article" for assistant role by default', () => {
      expect(component.brain().ariaRole()).toBe('article');
      expect(getHost().getAttribute('role')).toBe('article');
    });

    it('returns "article" for the user role', async () => {
      component.role.set('user');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().ariaRole()).toBe('article');
      expect(getHost().getAttribute('role')).toBe('article');
    });

    it('returns "article" for the error role', async () => {
      component.role.set('error');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().ariaRole()).toBe('article');
      expect(getHost().getAttribute('role')).toBe('article');
    });

    it('returns "status" for the system role', async () => {
      component.role.set('system');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().ariaRole()).toBe('status');
      expect(getHost().getAttribute('role')).toBe('status');
    });
  });

  describe('ariaBusy and isPending', () => {
    it('is not busy and not pending in the idle state', () => {
      expect(component.brain().ariaBusy()).toBeNull();
      expect(component.brain().isPending()).toBe(false);
      expect(getHost().getAttribute('aria-busy')).toBeNull();
    });

    it('reports aria-busy="true" and isPending=true while pending', async () => {
      component.state.set('pending');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().ariaBusy()).toBe(true);
      expect(component.brain().isPending()).toBe(true);
      expect(getHost().getAttribute('aria-busy')).toBe('true');
    });

    it('stops reporting aria-busy when the state moves to failed', async () => {
      component.state.set('pending');
      fixture.detectChanges();
      await fixture.whenStable();

      component.state.set('failed');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().ariaBusy()).toBeNull();
      expect(component.brain().isPending()).toBe(false);
      expect(getHost().getAttribute('aria-busy')).toBeNull();
    });
  });

  describe('ariaInvalid and isFailed', () => {
    it('is not invalid and not failed in the idle state', () => {
      expect(component.brain().ariaInvalid()).toBeNull();
      expect(component.brain().isFailed()).toBe(false);
      expect(getHost().getAttribute('aria-invalid')).toBeNull();
    });

    it('reports aria-invalid="true" and isFailed=true while failed', async () => {
      component.state.set('failed');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().ariaInvalid()).toBe(true);
      expect(component.brain().isFailed()).toBe(true);
      expect(getHost().getAttribute('aria-invalid')).toBe('true');
    });
  });
});

describe('ChatBlockBrainDirective', () => {
  @Component({
    selector: 'test-chat-block-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatBlockBrainDirective],
    template: `
      <button orgChatBlockBrain #brain="orgChatBlockBrain" [(expanded)]="expanded" data-testid="chat-block-brain">
        toggle
      </button>
    `,
  })
  class ChatBlockBrainHost {
    public readonly expanded = signal<boolean>(false);

    public readonly brain = viewChild.required<ChatBlockBrainDirective>('brain');
  }

  let fixture: ComponentFixture<ChatBlockBrainHost>;
  let component: ChatBlockBrainHost;

  const getButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('[data-testid="chat-block-brain"]') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBlockBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBlockBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('host bindings', () => {
    it('forces a type="button" attribute on the host element', () => {
      expect(getButton().getAttribute('type')).toBe('button');
    });

    it('reflects the expanded model on aria-expanded', async () => {
      expect(getButton().getAttribute('aria-expanded')).toBe('false');

      component.expanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton().getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('toggle and click', () => {
    it('flips the expanded model when toggle() is called', () => {
      expect(component.brain().expanded()).toBe(false);

      component.brain().toggle();

      expect(component.brain().expanded()).toBe(true);

      component.brain().toggle();

      expect(component.brain().expanded()).toBe(false);
    });

    it('flips the expanded model when the host button is clicked', async () => {
      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().expanded()).toBe(true);
      expect(getButton().getAttribute('aria-expanded')).toBe('true');
    });

    it('syncs the parent host model when the host button is clicked (two-way bind)', async () => {
      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.expanded()).toBe(true);
    });

    it('reflects an outside-driven expanded change on the brain (controlled mode)', async () => {
      component.expanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().expanded()).toBe(true);
      expect(getButton().getAttribute('aria-expanded')).toBe('true');
    });
  });
});

describe('ChatReactionBrainDirective', () => {
  @Component({
    selector: 'test-chat-reaction-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatReactionBrainDirective],
    template: `
      <button
        orgChatReactionBrain
        #brain="orgChatReactionBrain"
        [(selected)]="selected"
        [(disabled)]="disabled"
        (toggled)="onToggled($event)"
        data-testid="chat-reaction-brain"
      >
        emoji
      </button>
    `,
  })
  class ChatReactionBrainHost {
    public readonly selected = signal<boolean>(false);
    public readonly disabled = signal<boolean>(false);
    public onToggled = vi.fn();

    public readonly brain = viewChild.required<ChatReactionBrainDirective>('brain');
  }

  let fixture: ComponentFixture<ChatReactionBrainHost>;
  let component: ChatReactionBrainHost;

  const getButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('[data-testid="chat-reaction-brain"]') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReactionBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatReactionBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('host bindings', () => {
    it('forces a type="button" attribute on the host element', () => {
      expect(getButton().getAttribute('type')).toBe('button');
    });

    it('reflects the selected model on aria-pressed', async () => {
      expect(getButton().getAttribute('aria-pressed')).toBe('false');

      component.selected.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton().getAttribute('aria-pressed')).toBe('true');
    });

    it('does not set aria-disabled or disabled by default', () => {
      expect(getButton().getAttribute('aria-disabled')).toBeNull();
      expect(getButton().disabled).toBe(false);
    });

    it('sets aria-disabled and the native disabled attribute when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton().getAttribute('aria-disabled')).toBe('true');
      expect(getButton().disabled).toBe(true);
    });
  });

  describe('click handling', () => {
    it('flips the selected model and emits toggled with the next value on click', async () => {
      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().selected()).toBe(true);
      expect(component.selected()).toBe(true);
      expect(component.onToggled).toHaveBeenCalledTimes(1);
      expect(component.onToggled).toHaveBeenLastCalledWith(true);
    });

    it('toggles back to false on a second click', async () => {
      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().selected()).toBe(false);
      expect(component.selected()).toBe(false);
      expect(component.onToggled).toHaveBeenCalledTimes(2);
      expect(component.onToggled).toHaveBeenLastCalledWith(false);
    });

    it('does not toggle or emit when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().selected()).toBe(false);
      expect(component.onToggled).not.toHaveBeenCalled();
    });
  });
});
