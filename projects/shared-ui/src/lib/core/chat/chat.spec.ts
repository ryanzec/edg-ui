import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { Chat } from './chat';
import { type ChatAriaLive, type ChatRole } from './chat-brain';
import { ChatMessage, type ChatMessageRunPosition } from './chat-message';
import { type ChatMessageRole, type ChatMessageState } from './chat-message-brain';
import { ChatBlock, type ChatBlockKind, type ChatBlockState } from './chat-block';
import { ChatComposer, type ChatComposerAttachment } from './chat-composer';
import { ChatDay } from './chat-day';
import { ChatEmptyState } from './chat-empty-state';
import { ChatQuote } from './chat-quote';
import { ChatReaction } from './chat-reaction';
import { ChatReactions } from './chat-reactions';
import { ChatStreaming } from './chat-streaming';
import { ChatSuggestion } from './chat-suggestion';
import { ChatSuggestions } from './chat-suggestions';
import { ChatTyping } from './chat-typing';
import { type IconName } from '../icon/icon-brain';

describe('Chat', () => {
  @Component({
    selector: 'test-chat-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Chat],
    template: `<org-chat [role]="role()" [ariaLive]="ariaLive()" data-testid="chat"></org-chat>`,
  })
  class ChatHost {
    public readonly role = signal<ChatRole>('log');
    public readonly ariaLive = signal<ChatAriaLive>('polite');
  }

  let fixture: ComponentFixture<ChatHost>;
  let component: ChatHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="chat"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('hostDirective aria forwarding', () => {
    it('applies the default role="log" and aria-live="polite" attributes on the host', () => {
      const host = getHost();

      expect(host.getAttribute('role')).toBe('log');
      expect(host.getAttribute('aria-live')).toBe('polite');
    });

    it('forwards the role input through the brain to the host role attribute', async () => {
      component.role.set('region');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('role')).toBe('region');
    });

    it('forwards the ariaLive input through the brain to the host aria-live attribute', async () => {
      component.ariaLive.set('off');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('aria-live')).toBe('off');
    });
  });
});

describe('Chat content projection', () => {
  @Component({
    selector: 'test-chat-projection-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Chat],
    template: `
      <org-chat data-testid="chat">
        <span data-testid="projected">message</span>
      </org-chat>
    `,
  })
  class ChatProjectionHost {}

  let fixture: ComponentFixture<ChatProjectionHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatProjectionHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatProjectionHost);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('projects children into the thread', () => {
    const host = fixture.nativeElement.querySelector('[data-testid="chat"]') as HTMLElement;

    expect(host.querySelector('[data-testid="projected"]')).not.toBeNull();
  });
});

describe('ChatMessage', () => {
  describe('host attributes', () => {
    @Component({
      selector: 'test-chat-message-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [ChatMessage],
      template: `
        <org-chat-message
          [role]="role()"
          [state]="state()"
          [runPosition]="runPosition()"
          authorName="Alice"
          data-testid="message"
        >
          <div body>hello</div>
        </org-chat-message>
      `,
    })
    class ChatMessageAttrsHost {
      public readonly role = signal<ChatMessageRole>('assistant');
      public readonly state = signal<ChatMessageState>('idle');
      public readonly runPosition = signal<ChatMessageRunPosition>('only');
    }

    let fixture: ComponentFixture<ChatMessageAttrsHost>;
    let component: ChatMessageAttrsHost;

    const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="message"]') as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChatMessageAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChatMessageAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the role input on data-role and the brain role attribute', () => {
      const host = getHost();

      expect(host.getAttribute('data-role')).toBe('assistant');
      expect(host.getAttribute('role')).toBe('article');
    });

    it('reflects the state input on data-state', async () => {
      component.state.set('pending');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = getHost();

      expect(host.getAttribute('data-state')).toBe('pending');
      expect(host.getAttribute('aria-busy')).toBe('true');
    });

    it('reflects a failed state via aria-invalid on the host', async () => {
      component.state.set('failed');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('aria-invalid')).toBe('true');
    });

    it('reflects the runPosition input on data-run-position', async () => {
      component.runPosition.set('middle');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-run-position')).toBe('middle');
    });

    it('reports a "status" host role when role is system', async () => {
      component.role.set('system');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('role')).toBe('status');
      expect(getHost().getAttribute('data-role')).toBe('system');
    });
  });

  describe('non-system layout', () => {
    @Component({
      selector: 'test-chat-message-layout-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [ChatMessage],
      template: `
        <org-chat-message
          role="assistant"
          [runPosition]="runPosition()"
          [authorName]="authorName()"
          [time]="time()"
          [meta]="meta()"
          [edited]="edited()"
          data-testid="message"
        >
          <div body data-testid="body-content">hello body</div>
          <div quote data-testid="quote-content">quoted</div>
          <span data-testid="trailing-content">trailing</span>
          <div hoverActions data-testid="hover-content">hover</div>
        </org-chat-message>
      `,
    })
    class ChatMessageLayoutHost {
      public readonly runPosition = signal<ChatMessageRunPosition>('only');
      public readonly authorName = signal<string>('Alice');
      public readonly time = signal<string | undefined>(undefined);
      public readonly meta = signal<string | undefined>(undefined);
      public readonly edited = signal<boolean>(false);
    }

    let fixture: ComponentFixture<ChatMessageLayoutHost>;
    let component: ChatMessageLayoutHost;

    const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="message"]') as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChatMessageLayoutHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChatMessageLayoutHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the avatar with the authorName as its label', () => {
      const avatar = getHost().querySelector('org-avatar') as HTMLElement;

      expect(avatar).not.toBeNull();
      expect(avatar.textContent).toContain('A');
    });

    it('renders the author block with the author name when leading the run', () => {
      const authorName = getHost().querySelector('.author-name') as HTMLElement;

      expect(authorName).not.toBeNull();
      expect(authorName.textContent?.trim()).toBe('Alice');
    });

    it('hides the author block on continuation messages (middle / last)', async () => {
      component.runPosition.set('middle');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().querySelector('.author-name')).toBeNull();
    });

    it('marks the avatar as hidden via data-hidden on continuation messages', async () => {
      component.runPosition.set('last');
      fixture.detectChanges();
      await fixture.whenStable();

      const avatar = getHost().querySelector('org-avatar') as HTMLElement;

      expect(avatar.getAttribute('data-hidden')).toBe('1');
    });

    it('keeps the avatar fully shown (no data-hidden) on the lead of a run', () => {
      const avatar = getHost().querySelector('org-avatar') as HTMLElement;

      expect(avatar.getAttribute('data-hidden')).toBeNull();
    });

    it('renders the time as the post-meta label when time is set and meta is not', async () => {
      component.time.set('2:14 PM');
      fixture.detectChanges();
      await fixture.whenStable();

      const post = getHost().querySelector('.author-post') as HTMLElement;

      expect(post).not.toBeNull();
      expect(post.textContent?.trim()).toBe('2:14 PM');
      expect(post.classList.contains('author-post-time')).toBe(true);
    });

    it('prefers the meta value over the time value when both are present', async () => {
      component.time.set('2:14 PM');
      component.meta.set('Sending...');
      fixture.detectChanges();
      await fixture.whenStable();

      const post = getHost().querySelector('.author-post') as HTMLElement;

      expect(post.textContent?.trim()).toBe('Sending...');
      expect(post.classList.contains('author-post-meta')).toBe(true);
    });

    it('omits the post-meta label when neither time nor meta is present', () => {
      expect(getHost().querySelector('.author-post')).toBeNull();
    });

    it('renders the "(edited)" marker when edited is true', async () => {
      component.edited.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const edited = getHost().querySelector('.author-edited') as HTMLElement;

      expect(edited).not.toBeNull();
      expect(edited.textContent?.trim()).toBe('(edited)');
    });

    it('projects the body content into the message body slot', () => {
      expect(getHost().querySelector('[data-testid="body-content"]')).not.toBeNull();
    });

    it('projects the quote content above the body', () => {
      expect(getHost().querySelector('[data-testid="quote-content"]')).not.toBeNull();
    });

    it('projects trailing default-slot content into the column', () => {
      expect(getHost().querySelector('[data-testid="trailing-content"]')).not.toBeNull();
    });

    it('projects the hoverActions content into the hover actions slot', () => {
      const hoverActions = getHost().querySelector('.message-hover-actions') as HTMLElement;

      expect(hoverActions.querySelector('[data-testid="hover-content"]')).not.toBeNull();
    });
  });

  describe('useSurface (body wrapping)', () => {
    @Component({
      selector: 'test-chat-message-surface-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [ChatMessage],
      template: `
        <org-chat-message [role]="role()" authorName="Alice" data-testid="message">
          <div body>content</div>
        </org-chat-message>
      `,
    })
    class ChatMessageSurfaceHost {
      public readonly role = signal<ChatMessageRole>('user');
    }

    let fixture: ComponentFixture<ChatMessageSurfaceHost>;
    let component: ChatMessageSurfaceHost;

    const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="message"]') as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChatMessageSurfaceHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChatMessageSurfaceHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('wraps the body in an org-box for the user role', () => {
      expect(getHost().querySelector('org-box')).not.toBeNull();
    });

    it('uses the danger color box for the error role', async () => {
      component.role.set('error');
      fixture.detectChanges();
      await fixture.whenStable();

      const box = getHost().querySelector('org-box') as HTMLElement;

      expect(box).not.toBeNull();
      expect(box.getAttribute('data-color')).toBe('danger');
    });

    it('uses the neutral color box for the user role', () => {
      const box = getHost().querySelector('org-box') as HTMLElement;

      expect(box.getAttribute('data-color')).toBe('neutral');
    });

    it('does not wrap the body for the assistant role', async () => {
      component.role.set('assistant');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().querySelector('org-box')).toBeNull();
    });
  });

  describe('system layout', () => {
    @Component({
      selector: 'test-chat-message-system-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [ChatMessage],
      template: `
        <org-chat-message role="system" [systemIcon]="systemIcon()" data-testid="message">
          <div body data-testid="system-body">notice</div>
        </org-chat-message>
      `,
    })
    class ChatMessageSystemHost {
      public readonly systemIcon = signal<IconName | undefined>(undefined);
    }

    let fixture: ComponentFixture<ChatMessageSystemHost>;
    let component: ChatMessageSystemHost;

    const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="message"]') as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChatMessageSystemHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChatMessageSystemHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the body but no avatar in system mode', () => {
      const host = getHost();

      expect(host.querySelector('org-avatar')).toBeNull();
      expect(host.querySelector('[data-testid="system-body"]')).not.toBeNull();
    });

    it('omits the system icon when none is provided', () => {
      expect(getHost().querySelector('org-icon')).toBeNull();
    });

    it('renders the system icon when one is provided', async () => {
      component.systemIcon.set('info');
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = getHost().querySelector('org-icon') as HTMLElement;

      expect(icon).not.toBeNull();
      expect(icon.getAttribute('data-icon')).toBe('info');
    });
  });
});

describe('ChatBlock', () => {
  @Component({
    selector: 'test-chat-block-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatBlock],
    template: `
      <org-chat-block
        [kind]="kind()"
        [state]="state()"
        [title]="title()"
        [titleEmphasis]="titleEmphasis()"
        [meta]="meta()"
        [(expanded)]="expanded"
        data-testid="block"
      >
        <div data-testid="block-body">body content</div>
      </org-chat-block>
    `,
  })
  class ChatBlockHost {
    public readonly kind = signal<ChatBlockKind>('tool');
    public readonly state = signal<ChatBlockState>('idle');
    public readonly title = signal<string>('Calling search()');
    public readonly titleEmphasis = signal<string | undefined>(undefined);
    public readonly meta = signal<string | undefined>(undefined);
    public readonly expanded = signal<boolean>(false);
  }

  let fixture: ComponentFixture<ChatBlockHost>;
  let component: ChatBlockHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

  const getHeader = (): HTMLButtonElement => getHost().querySelector('.block-header') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBlockHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBlockHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('host attributes', () => {
    it('reflects the kind, state and expanded inputs on data attributes', () => {
      const host = getHost();

      expect(host.getAttribute('data-kind')).toBe('tool');
      expect(host.getAttribute('data-state')).toBe('idle');
      expect(host.getAttribute('data-expanded')).toBe('0');
    });

    it('updates data-expanded to "1" when expanded turns true', async () => {
      component.expanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-expanded')).toBe('1');
    });

    it('reflects the running state on data-state', async () => {
      component.state.set('running');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-state')).toBe('running');
    });
  });

  describe('kind icon mapping', () => {
    it('uses the "package" icon for the tool kind', () => {
      const icons = getHost().querySelectorAll('org-icon');
      const kindIcon = icons[0] as HTMLElement;

      expect(kindIcon.getAttribute('data-icon')).toBe('package');
    });

    it('uses the "sparkles" icon for the thinking kind', async () => {
      component.kind.set('thinking');
      fixture.detectChanges();
      await fixture.whenStable();

      const icons = getHost().querySelectorAll('org-icon');
      const kindIcon = icons[0] as HTMLElement;

      expect(kindIcon.getAttribute('data-icon')).toBe('sparkles');
    });
  });

  describe('title, emphasis, and meta rendering', () => {
    it('renders the title text when no titleEmphasis is set', () => {
      const titleEl = getHost().querySelector('.block-title') as HTMLElement;

      expect(titleEl.textContent?.trim()).toBe('Calling search()');
    });

    it('renders the titleEmphasis fragment instead of the plain title when present', async () => {
      component.titleEmphasis.set('search(query)');
      fixture.detectChanges();
      await fixture.whenStable();

      const emphasis = getHost().querySelector('.block-title-emphasis') as HTMLElement;

      expect(emphasis).not.toBeNull();
      expect(emphasis.textContent?.trim()).toBe('search(query)');
    });

    it('omits the meta line when meta is undefined', () => {
      expect(getHost().querySelector('.block-meta')).toBeNull();
    });

    it('renders the meta line when meta is set', async () => {
      component.meta.set('123ms');
      fixture.detectChanges();
      await fixture.whenStable();

      const meta = getHost().querySelector('.block-meta') as HTMLElement;

      expect(meta.textContent?.trim()).toBe('123ms');
    });
  });

  describe('expanded toggling via header button', () => {
    it('starts collapsed (aria-expanded="false") by default', () => {
      expect(getHeader().getAttribute('aria-expanded')).toBe('false');
    });

    it('flips expanded when the header button is clicked', async () => {
      getHeader().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.expanded()).toBe(true);
      expect(getHeader().getAttribute('aria-expanded')).toBe('true');
      expect(getHost().getAttribute('data-expanded')).toBe('1');
    });

    it('reflects external expanded changes on the header button', async () => {
      component.expanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHeader().getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('content projection', () => {
    it('projects body content into the block body', () => {
      expect(getHost().querySelector('[data-testid="block-body"]')).not.toBeNull();
    });
  });
});

describe('ChatComposer', () => {
  @Component({
    selector: 'test-chat-composer-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatComposer],
    template: `
      <org-chat-composer
        name="composer"
        [(value)]="value"
        [attachments]="attachments()"
        [disabled]="disabled()"
        [streaming]="streaming()"
        [showAttach]="showAttach()"
        [showHint]="showHint()"
        (sent)="onSent($event)"
        (stopped)="onStopped()"
        (attached)="onAttached()"
        (attachmentRemoved)="onAttachmentRemoved($event)"
        data-testid="composer"
      />
    `,
  })
  class ChatComposerHost {
    public readonly value = signal<string>('');
    public readonly attachments = signal<ChatComposerAttachment[]>([]);
    public readonly disabled = signal<boolean>(false);
    public readonly streaming = signal<boolean>(false);
    public readonly showAttach = signal<boolean>(true);
    public readonly showHint = signal<boolean>(true);

    public onSent = vi.fn();
    public onStopped = vi.fn();
    public onAttached = vi.fn();
    public onAttachmentRemoved = vi.fn();
  }

  let fixture: ComponentFixture<ChatComposerHost>;
  let component: ChatComposerHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="composer"]') as HTMLElement;

  const getTextarea = (): HTMLTextAreaElement => getHost().querySelector('textarea') as HTMLTextAreaElement;

  /**
   * the composer renders three icon-only buttons, each with a semantic ariaLabel: "Send" (toolbar built-in
   * send), "Stop" (streaming-mode replacement), and "Attach" (attach affordance). match on the native button's
   * aria-label attribute to locate each — that's how a viewer would identify them too.
   */
  const findButton = (ariaLabel: string): HTMLButtonElement | null =>
    getHost().querySelector(`button[aria-label="${ariaLabel}"]`) as HTMLButtonElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComposerHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComposerHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('host attributes', () => {
    it('reports data-disabled="0" and data-streaming="0" by default', () => {
      const host = getHost();

      expect(host.getAttribute('data-disabled')).toBe('0');
      expect(host.getAttribute('data-streaming')).toBe('0');
    });

    it('flips data-disabled to "1" when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-disabled')).toBe('1');
    });

    it('flips data-streaming to "1" when streaming is true', async () => {
      component.streaming.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-streaming')).toBe('1');
    });
  });

  describe('attachments rendering', () => {
    it('does not render the attachments row when there are no attachments', () => {
      expect(getHost().querySelector('.attachments')).toBeNull();
    });

    it('renders one tag per attachment when attachments are provided', async () => {
      component.attachments.set([
        { id: '1', label: 'file-1.txt' },
        { id: '2', label: 'file-2.txt' },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      const tags = getHost().querySelectorAll('.attachments org-tag');

      expect(tags.length).toBe(2);
      expect(tags[0].textContent).toContain('file-1.txt');
      expect(tags[1].textContent).toContain('file-2.txt');
    });

    it('emits attachmentRemoved with the removed attachment when its remove button is clicked', async () => {
      const attachment: ChatComposerAttachment = { id: '1', label: 'file-1.txt' };
      component.attachments.set([attachment]);
      fixture.detectChanges();
      await fixture.whenStable();

      const removeButton = getHost().querySelector('.tag-remove') as HTMLButtonElement;
      removeButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onAttachmentRemoved).toHaveBeenCalledTimes(1);
      expect(component.onAttachmentRemoved).toHaveBeenCalledWith(attachment);
    });
  });

  describe('send behavior', () => {
    it('disables the send button when the value is empty', () => {
      const sendButton = findButton('Send') as HTMLButtonElement;

      expect(sendButton).not.toBeNull();
      expect(sendButton.disabled).toBe(true);
    });

    it('keeps the send button disabled when the value is whitespace-only', async () => {
      component.value.set('   \n  ');
      fixture.detectChanges();
      await fixture.whenStable();

      const sendButton = findButton('Send') as HTMLButtonElement;

      expect(sendButton.disabled).toBe(true);
    });

    it('enables the send button once the value has real content', async () => {
      component.value.set('hello');
      fixture.detectChanges();
      await fixture.whenStable();

      const sendButton = findButton('Send') as HTMLButtonElement;

      expect(sendButton.disabled).toBe(false);
    });

    it('emits sent with the current value when the send button is clicked', async () => {
      component.value.set('hello world');
      fixture.detectChanges();
      await fixture.whenStable();

      const sendButton = findButton('Send') as HTMLButtonElement;
      sendButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onSent).toHaveBeenCalledTimes(1);
      expect(component.onSent).toHaveBeenCalledWith('hello world');
    });

    it('does not emit sent when the value is empty', () => {
      const sendButton = findButton('Send') as HTMLButtonElement;

      sendButton.click();

      expect(component.onSent).not.toHaveBeenCalled();
    });

    it('does not emit sent when whitespace-only', async () => {
      component.value.set('   ');
      fixture.detectChanges();
      await fixture.whenStable();

      const sendButton = findButton('Send') as HTMLButtonElement;
      sendButton.click();

      expect(component.onSent).not.toHaveBeenCalled();
    });

    it('emits sent when the textarea submit-key combo (shift+enter) is pressed', async () => {
      component.value.set('keyboard submit');
      fixture.detectChanges();
      await fixture.whenStable();

      const textarea = getTextarea();
      textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onSent).toHaveBeenCalledTimes(1);
      expect(component.onSent).toHaveBeenCalledWith('keyboard submit');
    });
  });

  describe('disabled state', () => {
    it('disables the textarea when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getTextarea().disabled).toBe(true);
    });

    it('disables the attach button when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const attachButton = findButton('Attach') as HTMLButtonElement;

      expect(attachButton.disabled).toBe(true);
    });

    it('keeps the send button disabled when disabled is true even with a non-empty value', async () => {
      component.value.set('hello');
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const sendButton = findButton('Send') as HTMLButtonElement;

      expect(sendButton.disabled).toBe(true);
    });
  });

  describe('streaming mode', () => {
    beforeEach(async () => {
      component.streaming.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('disables the textarea while streaming', () => {
      expect(getTextarea().disabled).toBe(true);
    });

    it('disables the attach button while streaming', () => {
      const attachButton = findButton('Attach') as HTMLButtonElement;

      expect(attachButton.disabled).toBe(true);
    });

    it('hides the built-in send button while streaming', () => {
      expect(findButton('Send')).toBeNull();
    });

    it('renders a stop button (preIcon="square") while streaming', () => {
      expect(findButton('Stop')).not.toBeNull();
    });

    it('emits stopped when the stop button is clicked', () => {
      const stopButton = findButton('Stop') as HTMLButtonElement;

      stopButton.click();

      expect(component.onStopped).toHaveBeenCalledTimes(1);
    });

    it('hides the keyboard hint while streaming', () => {
      expect(getHost().querySelector('.hint')).toBeNull();
    });
  });

  describe('attach behavior', () => {
    it('emits attached when the attach button is clicked', () => {
      const attachButton = findButton('Attach') as HTMLButtonElement;

      attachButton.click();

      expect(component.onAttached).toHaveBeenCalledTimes(1);
    });

    it('does not render the attach button when showAttach is false', async () => {
      component.showAttach.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(findButton('Attach')).toBeNull();
    });

    it('does not emit attached when disabled and the attach button is clicked', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const attachButton = findButton('Attach') as HTMLButtonElement;
      attachButton.click();

      expect(component.onAttached).not.toHaveBeenCalled();
    });
  });

  describe('hint visibility', () => {
    it('renders the keyboard hint by default', () => {
      expect(getHost().querySelector('.hint')).not.toBeNull();
    });

    it('omits the keyboard hint when showHint is false', async () => {
      component.showHint.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().querySelector('.hint')).toBeNull();
    });
  });
});

describe('ChatDay', () => {
  @Component({
    selector: 'test-chat-day-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatDay],
    template: `<org-chat-day [label]="label()" data-testid="day"></org-chat-day>`,
  })
  class ChatDayHost {
    public readonly label = signal<string>('Today');
  }

  let fixture: ComponentFixture<ChatDayHost>;
  let component: ChatDayHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDayHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatDayHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the label inside the day separator', () => {
    const label = fixture.nativeElement.querySelector('[data-testid="day"] .day-label') as HTMLElement;

    expect(label.textContent?.trim()).toBe('Today');
  });

  it('updates the rendered label when the input changes', async () => {
    component.label.set('Yesterday');
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('[data-testid="day"] .day-label') as HTMLElement;

    expect(label.textContent?.trim()).toBe('Yesterday');
  });
});

describe('ChatEmptyState', () => {
  @Component({
    selector: 'test-chat-empty-state-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatEmptyState],
    template: `
      <org-chat-empty-state
        [icon]="icon()"
        [heading]="heading()"
        [supportingCopy]="supportingCopy()"
        data-testid="empty"
      >
        <div data-testid="starter-content">starter row</div>
      </org-chat-empty-state>
    `,
  })
  class ChatEmptyStateHost {
    public readonly icon = signal<IconName | undefined>('sparkles');
    public readonly heading = signal<string>('Ask anything');
    public readonly supportingCopy = signal<string | undefined>(undefined);
  }

  let fixture: ComponentFixture<ChatEmptyStateHost>;
  let component: ChatEmptyStateHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="empty"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatEmptyStateHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatEmptyStateHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the icon when icon is provided', () => {
    const icon = getHost().querySelector('org-icon') as HTMLElement;

    expect(icon).not.toBeNull();
    expect(icon.getAttribute('data-icon')).toBe('sparkles');
  });

  it('omits the icon when icon is undefined', async () => {
    component.icon.set(undefined);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getHost().querySelector('org-icon')).toBeNull();
  });

  it('renders the heading text', () => {
    const heading = getHost().querySelector('.empty-state-heading') as HTMLElement;

    expect(heading.textContent?.trim()).toBe('Ask anything');
  });

  it('does not render the supporting copy by default', () => {
    expect(getHost().querySelector('.empty-state-copy')).toBeNull();
  });

  it('renders the supporting copy when set', async () => {
    component.supportingCopy.set('Start a conversation');
    fixture.detectChanges();
    await fixture.whenStable();

    const copy = getHost().querySelector('.empty-state-copy') as HTMLElement;

    expect(copy.textContent?.trim()).toBe('Start a conversation');
  });

  it('projects default-slot content (e.g. a starter row)', () => {
    expect(getHost().querySelector('[data-testid="starter-content"]')).not.toBeNull();
  });
});

describe('ChatQuote', () => {
  @Component({
    selector: 'test-chat-quote-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatQuote],
    template: `
      <org-chat-quote
        [quoteAuthor]="quoteAuthor()"
        [quoteBody]="quoteBody()"
        (clicked)="onClicked()"
        data-testid="quote"
      ></org-chat-quote>
    `,
  })
  class ChatQuoteHost {
    public readonly quoteAuthor = signal<string>('Alice');
    public readonly quoteBody = signal<string>('hello there');
    public onClicked = vi.fn();
  }

  let fixture: ComponentFixture<ChatQuoteHost>;
  let component: ChatQuoteHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="quote"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatQuoteHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatQuoteHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('host attributes', () => {
    it('applies role="button" and tabindex="0" on the host', () => {
      const host = getHost();

      expect(host.getAttribute('role')).toBe('button');
      expect(host.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('content rendering', () => {
    it('renders the quote author and body', () => {
      const host = getHost();
      const author = host.querySelector('.quote-author') as HTMLElement;
      const body = host.querySelector('.quote-body') as HTMLElement;

      expect(author.textContent?.trim()).toBe('Alice');
      expect(body.textContent?.trim()).toBe('hello there');
    });
  });

  describe('activation', () => {
    it('emits clicked when the host is clicked', () => {
      getHost().click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('emits clicked when Enter is pressed on the host', () => {
      getHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('emits clicked and prevents default when Space is pressed on the host', () => {
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      getHost().dispatchEvent(event);

      expect(component.onClicked).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });
  });
});

describe('ChatReaction', () => {
  @Component({
    selector: 'test-chat-reaction-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatReaction],
    template: `
      <org-chat-reaction
        [emoji]="emoji()"
        [count]="count()"
        [(selected)]="selected"
        [disabled]="disabled()"
        (toggled)="onToggled($event)"
        data-testid="reaction"
      />
    `,
  })
  class ChatReactionHost {
    public readonly emoji = signal<string>('👍');
    public readonly count = signal<number>(0);
    public readonly selected = signal<boolean>(false);
    public readonly disabled = signal<boolean>(false);
    public onToggled = vi.fn();
  }

  let fixture: ComponentFixture<ChatReactionHost>;
  let component: ChatReactionHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="reaction"]') as HTMLElement;

  const getButton = (): HTMLButtonElement => getHost().querySelector('button.reaction-button') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReactionHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatReactionHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('rendering', () => {
    it('renders the emoji glyph', () => {
      const emoji = getHost().querySelector('.reaction-emoji') as HTMLElement;

      expect(emoji.textContent?.trim()).toBe('👍');
    });

    it('does not render the count when count is zero', () => {
      expect(getHost().querySelector('.reaction-count')).toBeNull();
    });

    it('renders the count once it is greater than zero', async () => {
      component.count.set(3);
      fixture.detectChanges();
      await fixture.whenStable();

      const count = getHost().querySelector('.reaction-count') as HTMLElement;

      expect(count.textContent?.trim()).toBe('3');
    });
  });

  describe('selected state', () => {
    it('reflects selected=false via data-selected="0" by default', () => {
      expect(getHost().getAttribute('data-selected')).toBe('0');
    });

    it('reflects selected=true via data-selected="1"', async () => {
      component.selected.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-selected')).toBe('1');
    });
  });

  describe('toggling', () => {
    it('toggles selected and emits toggled with the next value when clicked', async () => {
      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selected()).toBe(true);
      expect(component.onToggled).toHaveBeenCalledTimes(1);
      expect(component.onToggled).toHaveBeenCalledWith(true);
    });

    it('toggles back to false on the second click', async () => {
      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selected()).toBe(false);
      expect(component.onToggled).toHaveBeenLastCalledWith(false);
    });

    it('does not toggle when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getButton().click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selected()).toBe(false);
      expect(component.onToggled).not.toHaveBeenCalled();
    });
  });
});

describe('ChatReactions', () => {
  @Component({
    selector: 'test-chat-reactions-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatReactions],
    template: `
      <org-chat-reactions data-testid="reactions">
        <span data-testid="chip-a">a</span>
        <span data-testid="chip-b">b</span>
      </org-chat-reactions>
    `,
  })
  class ChatReactionsHost {}

  it('projects all reaction chips into the row', async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReactionsHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(ChatReactionsHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="reactions"]') as HTMLElement;

    expect(host.querySelector('[data-testid="chip-a"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="chip-b"]')).not.toBeNull();
  });
});

describe('ChatStreaming', () => {
  @Component({
    selector: 'test-chat-streaming-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatStreaming],
    template: `<org-chat-streaming [label]="label()" data-testid="streaming"></org-chat-streaming>`,
  })
  class ChatStreamingHost {
    public readonly label = signal<string>('Streaming...');
  }

  let fixture: ComponentFixture<ChatStreamingHost>;
  let component: ChatStreamingHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatStreamingHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatStreamingHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('reports role="status" on the host element', () => {
    const host = fixture.nativeElement.querySelector('[data-testid="streaming"]') as HTMLElement;

    expect(host.getAttribute('role')).toBe('status');
  });

  it('renders the label text', () => {
    const label = fixture.nativeElement.querySelector('[data-testid="streaming"] .streaming-label') as HTMLElement;

    expect(label.textContent?.trim()).toBe('Streaming...');
  });

  it('updates the label when the input changes', async () => {
    component.label.set('Thinking...');
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('[data-testid="streaming"] .streaming-label') as HTMLElement;

    expect(label.textContent?.trim()).toBe('Thinking...');
  });
});

describe('ChatSuggestion', () => {
  @Component({
    selector: 'test-chat-suggestion-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatSuggestion],
    template: `
      <org-chat-suggestion
        [label]="label()"
        [icon]="icon()"
        [disabled]="disabled()"
        (clicked)="onClicked()"
        data-testid="suggestion"
      />
    `,
  })
  class ChatSuggestionHost {
    public readonly label = signal<string>('Summarize');
    public readonly icon = signal<IconName | undefined>(undefined);
    public readonly disabled = signal<boolean>(false);
    public onClicked = vi.fn();
  }

  let fixture: ComponentFixture<ChatSuggestionHost>;
  let component: ChatSuggestionHost;

  const getHost = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="suggestion"]') as HTMLElement;

  const getButton = (): HTMLButtonElement => getHost().querySelector('button.suggestion-button') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSuggestionHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatSuggestionHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('rendering', () => {
    it('renders the suggestion label', () => {
      const label = getHost().querySelector('.suggestion-label') as HTMLElement;

      expect(label.textContent?.trim()).toBe('Summarize');
    });

    it('does not render the icon when none is provided', () => {
      expect(getHost().querySelector('org-icon')).toBeNull();
    });

    it('renders the icon when one is provided', async () => {
      component.icon.set('sparkles');
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = getHost().querySelector('org-icon') as HTMLElement;

      expect(icon).not.toBeNull();
      expect(icon.getAttribute('data-icon')).toBe('sparkles');
    });
  });

  describe('activation', () => {
    it('emits clicked when the inner button is clicked', () => {
      getButton().click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('disables the inner button when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getButton().disabled).toBe(true);
    });

    it('does not emit clicked when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getButton().click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });
});

describe('ChatSuggestions', () => {
  @Component({
    selector: 'test-chat-suggestions-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatSuggestions],
    template: `
      <org-chat-suggestions data-testid="suggestions">
        <span data-testid="chip-1">one</span>
        <span data-testid="chip-2">two</span>
      </org-chat-suggestions>
    `,
  })
  class ChatSuggestionsHost {}

  it('projects all suggestion chips into the row', async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSuggestionsHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(ChatSuggestionsHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="suggestions"]') as HTMLElement;

    expect(host.querySelector('[data-testid="chip-1"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="chip-2"]')).not.toBeNull();
  });
});

describe('ChatTyping', () => {
  @Component({
    selector: 'test-chat-typing-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChatTyping],
    template: `<org-chat-typing data-testid="typing"></org-chat-typing>`,
  })
  class ChatTypingHost {}

  it('reports the typing aria semantics on the host element', async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTypingHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(ChatTypingHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="typing"]') as HTMLElement;

    expect(host.getAttribute('role')).toBe('status');
    expect(host.getAttribute('aria-label')).toBe('Assistant is typing');
  });
});
