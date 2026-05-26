import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ScrollArea, type ScrollAreaDirection } from './scroll-area';

@Component({
  selector: 'story-scroll-area-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollArea],
  host: { class: 'block' },
  template: `
    <org-scroll-area
      data-testid="scroll-area"
      #scrollAreaRef
      [direction]="direction()"
      [onlyShowOnHover]="onlyShowOnHover()"
      [enabled]="enabled()"
      [containerClass]="containerClass()"
      [scrollClass]="scrollClass()"
      [spacingClass]="spacingClass()"
      [role]="role()"
      [ariaLabel]="ariaLabel()"
    >
      <div data-testid="projected-content">item-one</div>
      <div>item-two</div>
      <div>item-three</div>
      <div>item-four</div>
      <div>item-five</div>
      <div>item-six</div>
      <div>item-seven</div>
      <div>item-eight</div>
      <div>item-nine</div>
      <div>item-ten</div>
      <div>item-eleven</div>
      <div>item-twelve</div>
      <div>item-thirteen</div>
      <div>item-fourteen</div>
      <div>item-fifteen</div>
    </org-scroll-area>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-direction-horizontal" (click)="direction.set('horizontal')">
        direction-horizontal
      </button>
      <button type="button" data-testid="ctl-direction-both" (click)="direction.set('both')">direction-both</button>
      <button type="button" data-testid="ctl-direction-vertical" (click)="direction.set('vertical')">
        direction-vertical
      </button>
      <button type="button" data-testid="ctl-only-show-on-hover-on" (click)="onlyShowOnHover.set(true)">
        only-show-on-hover-on
      </button>
      <button type="button" data-testid="ctl-only-show-on-hover-off" (click)="onlyShowOnHover.set(false)">
        only-show-on-hover-off
      </button>
      <button type="button" data-testid="ctl-enabled-off" (click)="enabled.set(false)">enabled-off</button>
      <button type="button" data-testid="ctl-enabled-on" (click)="enabled.set(true)">enabled-on</button>
      <button type="button" data-testid="ctl-container-class-set" (click)="containerClass.set('extra-container')">
        container-class-set
      </button>
      <button type="button" data-testid="ctl-scroll-class-set" (click)="scrollClass.set('h-3xs extra-scroll')">
        scroll-class-set
      </button>
      <button type="button" data-testid="ctl-spacing-class-set" (click)="spacingClass.set('extra-spacing')">
        spacing-class-set
      </button>
      <button type="button" data-testid="ctl-role-set" (click)="role.set('region')">role-set</button>
      <button type="button" data-testid="ctl-role-null" (click)="role.set(null)">role-null</button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('scrollable region')">
        aria-label-set
      </button>
      <button type="button" data-testid="ctl-aria-label-null" (click)="ariaLabel.set(null)">aria-label-null</button>
    </div>
  `,
})
class StoryScrollAreaTestsShell {
  protected readonly scrollAreaRef = viewChild.required<ScrollArea>('scrollAreaRef');

  protected readonly direction = signal<ScrollAreaDirection>('vertical');
  protected readonly onlyShowOnHover = signal<boolean>(false);
  protected readonly enabled = signal<boolean>(true);
  protected readonly containerClass = signal<string>('');
  protected readonly scrollClass = signal<string>('h-3xs');
  protected readonly spacingClass = signal<string>('');
  protected readonly role = signal<string | null | undefined>(undefined);
  protected readonly ariaLabel = signal<string | null | undefined>(undefined);

  protected readout(): string {
    try {
      const element = this.scrollAreaRef().containerElement();

      return `containerTag=${element.tagName} containerClasses=${element.className.trim()}`;
    } catch {
      return 'containerTag=NONE containerClasses=NONE';
    }
  }
}

@Component({
  selector: 'story-scroll-area-external-viewport-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollArea],
  host: { class: 'block' },
  template: `
    <org-scroll-area
      data-testid="scroll-area"
      direction="vertical"
      scrollClass="h-3xs"
      externalViewport=".external-viewport"
      externalContentWrapper=".external-content"
    >
      <div class="external-viewport" data-testid="external-viewport">
        <div class="external-content" data-testid="external-content">
          <div data-testid="projected-content">item-one</div>
          <div>item-two</div>
          <div>item-three</div>
          <div>item-four</div>
          <div>item-five</div>
          <div>item-six</div>
          <div>item-seven</div>
          <div>item-eight</div>
          <div>item-nine</div>
          <div>item-ten</div>
          <div>item-eleven</div>
          <div>item-twelve</div>
          <div>item-thirteen</div>
          <div>item-fourteen</div>
          <div>item-fifteen</div>
        </div>
      </div>
    </org-scroll-area>
  `,
})
class StoryScrollAreaExternalViewportShell {}

const meta: Meta = {
  title: 'Core/Components/Scroll Area/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-scroll-area-tests-shell />`,
  moduleMetadata: { imports: [StoryScrollAreaTestsShell] },
});

const renderExternalViewportShell: Story['render'] = () => ({
  template: `<story-scroll-area-external-viewport-shell />`,
  moduleMetadata: { imports: [StoryScrollAreaExternalViewportShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await expect(host.getAttribute('data-direction')).toBe('vertical');
    await expect(host.getAttribute('data-enabled')).toBe('');
    await expect(host.getAttribute('data-only-show-on-hover')).toBeNull();
  },
};

export const ReflectsDirectionInputHorizontal: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-direction-horizontal'));

    await waitFor(() => expect(host.getAttribute('data-direction')).toBe('horizontal'));
  },
};

export const ReflectsDirectionInputBoth: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-direction-both'));

    await waitFor(() => expect(host.getAttribute('data-direction')).toBe('both'));
  },
};

export const ReflectsOnlyShowOnHoverWhenTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-only-show-on-hover-on'));

    await waitFor(() => expect(host.getAttribute('data-only-show-on-hover')).toBe(''));
  },
};

export const ReflectsOnlyShowOnHoverWhenFalseOmitsAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-only-show-on-hover-on'));
    await waitFor(() => expect(host.getAttribute('data-only-show-on-hover')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-only-show-on-hover-off'));

    await waitFor(() => expect(host.getAttribute('data-only-show-on-hover')).toBeNull());
  },
};

export const ReflectsEnabledFalseOmitsAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-enabled-off'));

    await waitFor(() => expect(host.getAttribute('data-enabled')).toBeNull());
  },
};

export const ReflectsEnabledTrueSetsEmptyStringAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-enabled-off'));
    await waitFor(() => expect(host.getAttribute('data-enabled')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-enabled-on'));

    await waitFor(() => expect(host.getAttribute('data-enabled')).toBe(''));
  },
};

export const ForwardsRoleAttributeToNgScrollbar: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-role-set'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.getAttribute('role')).toBe('region');
    });
  },
};

export const ForwardsAriaLabelAttributeToNgScrollbar: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.getAttribute('aria-label')).toBe('scrollable region');
    });
  },
};

export const OmitsRoleAttributeWhenSetToNull: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-role-set'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.getAttribute('role')).toBe('region');
    });

    await userEvent.click(canvas.getByTestId('ctl-role-null'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.getAttribute('role')).toBeNull();
    });
  },
};

export const OmitsAriaLabelAttributeWhenSetToNull: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.getAttribute('aria-label')).toBe('scrollable region');
    });

    await userEvent.click(canvas.getByTestId('ctl-aria-label-null'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.getAttribute('aria-label')).toBeNull();
    });
  },
};

export const AppliesContainerClassToNgScrollbarHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-container-class-set'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.classList.contains('extra-container')).toBe(true);
    });
  },
};

export const AppliesScrollClassToNgScrollbarHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-scroll-class-set'));

    await waitFor(() => {
      const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

      expect(ngScrollbar.classList.contains('extra-scroll')).toBe(true);
    });
  },
};

export const AppliesSpacingClassToInnerWrapperDiv: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-spacing-class-set'));

    await waitFor(() => {
      const projected = host.querySelector('[data-testid="projected-content"]') as HTMLElement;
      const wrapper = projected.parentElement as HTMLElement;

      expect(wrapper.classList.contains('extra-spacing')).toBe(true);
    });
  },
};

export const HidesTrackAndThumbWhenEnabledFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await userEvent.click(canvas.getByTestId('ctl-enabled-off'));

    await waitFor(() => {
      const track = host.querySelector('.ng-scrollbar-track') as HTMLElement | null;
      const thumb = host.querySelector('.ng-scrollbar-thumb') as HTMLElement | null;

      expect(track).not.toBeNull();
      expect(thumb).not.toBeNull();
      expect(track?.classList.contains('org-scroll-area-hidden-scrollbar')).toBe(true);
      expect(thumb?.classList.contains('org-scroll-area-hidden-scrollbar')).toBe(true);
    });
  },
};

export const ShowsTrackAndThumbWhenEnabledTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    await waitFor(() => {
      const track = host.querySelector('.ng-scrollbar-track') as HTMLElement | null;
      const thumb = host.querySelector('.ng-scrollbar-thumb') as HTMLElement | null;

      expect(track).not.toBeNull();
      expect(thumb).not.toBeNull();
      expect(track?.classList.contains('org-scroll-area-hidden-scrollbar')).toBe(false);
      expect(thumb?.classList.contains('org-scroll-area-hidden-scrollbar')).toBe(false);
    });
  },
};

export const RendersProjectedContent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    const projected = host.querySelector('[data-testid="projected-content"]') as HTMLElement;

    await expect(projected).not.toBeNull();
    await expect(projected.textContent?.trim()).toBe('item-one');
  },
};

export const ExposesContainerElementAfterInit: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    // in standard mode, ngx-scrollbar uses its own `<ng-scrollbar>` host element as the scroll viewport
    // (adapter.init(this.nativeElement, ...)), so containerElement() returns that host element
    await waitFor(() => {
      expect(readout.textContent).toContain('containerTag=NG-SCROLLBAR');
      expect(readout.textContent).toContain('ng-scrollbar');
    });
  },
};

export const ExternalViewportAttachesToConsumerElement: Story = {
  render: renderExternalViewportShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    const consumerViewport = await canvas.findByTestId('external-viewport');

    await expect(consumerViewport).not.toBeNull();
    await expect(host.contains(consumerViewport)).toBe(true);
  },
};

export const ExternalViewportSkipsInternalSpacingWrapper: Story = {
  render: renderExternalViewportShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    const consumerViewport = host.querySelector('[data-testid="external-viewport"]') as HTMLElement;
    const ngScrollbar = host.querySelector('ng-scrollbar') as HTMLElement;

    // in external viewport mode, the consumer-provided viewport element is a direct child of ng-scrollbar
    // with no internal `[class]="spacingClass()"` wrapper inserted between them
    await expect(consumerViewport.parentElement).toBe(ngScrollbar);
  },
};

export const ExternalViewportRendersProjectedContent: Story = {
  render: renderExternalViewportShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('scroll-area');

    const projected = host.querySelector('[data-testid="projected-content"]') as HTMLElement;

    await expect(projected).not.toBeNull();
    await expect(projected.textContent?.trim()).toBe('item-one');
  },
};
