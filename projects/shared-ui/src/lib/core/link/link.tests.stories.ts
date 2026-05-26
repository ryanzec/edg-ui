import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Link } from './link';
import { type LinkReferrerPolicy, type LinkTarget } from './link-brain';

@Component({
  selector: 'story-link-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link],
  host: { class: 'block' },
  template: `
    <org-link
      data-testid="link"
      #linkRef
      [href]="href()"
      [target]="target()"
      [rel]="rel()"
      [download]="download()"
      [hreflang]="hreflang()"
      [referrerPolicy]="referrerPolicy()"
      [ariaLabel]="ariaLabel()"
      [disabled]="disabled()"
      [affordance]="affordance()"
      (clicked)="handleClicked()"
    >
      docs
    </org-link>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-href-clear" (click)="href.set(undefined)">href-clear</button>
      <button type="button" data-testid="ctl-href-set" (click)="href.set('https://example.com')">href-set</button>
      <button type="button" data-testid="ctl-target-self" (click)="target.set('_self')">target-self</button>
      <button type="button" data-testid="ctl-target-blank" (click)="target.set('_blank')">target-blank</button>
      <button type="button" data-testid="ctl-rel-author" (click)="rel.set('author')">rel-author</button>
      <button type="button" data-testid="ctl-download-set" (click)="download.set('report.pdf')">download-set</button>
      <button type="button" data-testid="ctl-hreflang-set" (click)="hreflang.set('en')">hreflang-set</button>
      <button type="button" data-testid="ctl-referrer-policy-set" (click)="referrerPolicy.set('no-referrer')">
        referrer-policy-set
      </button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('open docs')">
        aria-label-set
      </button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-affordance-off" (click)="affordance.set(false)">affordance-off</button>
    </div>
  `,
})
class StoryLinkTestsShell {
  protected readonly linkRef = viewChild.required<Link>('linkRef');

  protected readonly href = signal<string | undefined>('https://example.com');
  protected readonly target = signal<LinkTarget | undefined>(undefined);
  protected readonly rel = signal<string | undefined>(undefined);
  protected readonly download = signal<string | undefined>(undefined);
  protected readonly hreflang = signal<string | undefined>(undefined);
  protected readonly referrerPolicy = signal<LinkReferrerPolicy | undefined>(undefined);
  protected readonly ariaLabel = signal<string | undefined>(undefined);
  protected readonly disabled = signal<boolean>(false);
  protected readonly affordance = signal<boolean>(true);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()} isActionLink=${this.linkRef().isActionLink()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-link-content-projection-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link],
  host: { class: 'block' },
  template: `
    <org-link href="https://example.com" [affordance]="false" data-testid="link-default">
      <span data-testid="default-content">default body</span>
    </org-link>

    <org-link href="https://example.com" [affordance]="false" data-testid="link-pre">
      <ng-template #pre>
        <span data-testid="custom-pre">pre body</span>
      </ng-template>
      main
    </org-link>

    <org-link href="https://example.com" [affordance]="false" data-testid="link-post">
      main
      <ng-template #post>
        <span data-testid="custom-post">post body</span>
      </ng-template>
    </org-link>
  `,
})
class StoryLinkContentProjectionShell {}

@Component({
  selector: 'story-link-post-suppress-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link],
  host: { class: 'block' },
  template: `
    <org-link href="https://example.com" target="_blank" data-testid="link">
      docs
      <ng-template #post>
        <span data-testid="custom-post">custom</span>
      </ng-template>
    </org-link>
  `,
})
class StoryLinkPostSuppressShell {}

const meta: Meta = {
  title: 'Core/Components/Link/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-link-tests-shell />`,
  moduleMetadata: { imports: [StoryLinkTestsShell] },
});

export const RendersAnchorWhenHrefProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link');

    await expect(host.querySelector('a.link')).not.toBeNull();
    await expect(host.querySelector('span.link')).toBeNull();
  },
};

export const ReflectsHrefTargetAriaLabelOnAnchor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-self'));
    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;

    await expect(anchor.getAttribute('href')).toBe('https://example.com');
    await expect(anchor.getAttribute('target')).toBe('_self');
    await expect(anchor.getAttribute('aria-label')).toBe('open docs');
  },
};

export const AutoSetsRelNoopenerNoreferrerForBlankTarget: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;

    await expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  },
};

export const ConsumerRelOverridesAutoRelForBlankTarget: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));
    await userEvent.click(canvas.getByTestId('ctl-rel-author'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;

    await expect(anchor.getAttribute('rel')).toBe('author');
  },
};

export const ReflectsDownloadHreflangAndReferrerPolicyOnAnchor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-download-set'));
    await userEvent.click(canvas.getByTestId('ctl-hreflang-set'));
    await userEvent.click(canvas.getByTestId('ctl-referrer-policy-set'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;

    await expect(anchor.getAttribute('download')).toBe('report.pdf');
    await expect(anchor.getAttribute('hreflang')).toBe('en');
    await expect(anchor.getAttribute('referrerpolicy')).toBe('no-referrer');
  },
};

export const OmitsRoleAndTabindexWhenHrefProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;

    await expect(anchor.getAttribute('role')).toBeNull();
    await expect(anchor.getAttribute('tabindex')).toBeNull();
  },
};

export const ActionLinkRendersAnchorWithRoleButtonAndTabindexZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;

    await expect(anchor).not.toBeNull();
    await expect(anchor.getAttribute('role')).toBe('button');
    await expect(anchor.getAttribute('tabindex')).toBe('0');
  },
};

export const ActionLinkOmitsHrefAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;

    await expect(anchor.getAttribute('href')).toBeNull();
  },
};

export const ActionLinkExposesIsActionLinkTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('isActionLink=true');
  },
};

export const DisabledRendersSpanInsteadOfAnchor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('link');

    await expect(host.querySelector('a.link')).toBeNull();
    await expect(host.querySelector('span.link')).not.toBeNull();
  },
};

export const DisabledSpanHasDataDisabledAndTabindexNegativeOne: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('link');
    const span = host.querySelector('span.link') as HTMLSpanElement;

    await expect(span.getAttribute('data-disabled')).toBe('1');
    await expect(span.getAttribute('tabindex')).toBe('-1');
  },
};

export const DisabledClearsHrefTargetAndRelOnSpan: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('link');
    const span = host.querySelector('span.link') as HTMLSpanElement;

    await expect(span.getAttribute('href')).toBeNull();
    await expect(span.getAttribute('target')).toBeNull();
    await expect(span.getAttribute('rel')).toBeNull();
  },
};

export const ActionLinkEmitsClickedOnClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('clickCount=0');

    await userEvent.click(anchor);

    await expect(readout.textContent).toContain('clickCount=1');
  },
};

export const ActionLinkEmitsClickedOnEnterKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.keyDown(anchor, { key: 'Enter' });

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
  },
};

export const ActionLinkEmitsClickedOnSpaceKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.keyDown(anchor, { key: ' ' });

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
  },
};

export const ActionLinkDoesNotEmitClickedOnOtherKeys: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;
    const readout = await canvas.findByTestId('readout');

    fireEvent.keyDown(anchor, { key: 'Tab' });

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const DoesNotEmitClickedWhenHrefIsProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link');
    const anchor = host.querySelector('a.link') as HTMLAnchorElement;
    const readout = await canvas.findByTestId('readout');

    anchor.addEventListener('click', (event) => event.preventDefault(), { once: true });
    await userEvent.click(anchor);

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const DoesNotEmitClickedWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-href-clear'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('link');
    const span = host.querySelector('span.link') as HTMLSpanElement;
    const readout = await canvas.findByTestId('readout');

    // fireEvent bypasses the css pointer-events:none guard so we exercise the underlying handler-gated path
    fireEvent.click(span);

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const NoAffordanceIconForInternalLink: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link');

    await expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
  },
};

export const RendersExternalLinkAffordanceIconForBlankTarget: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));

    const host = await canvas.findByTestId('link');
    const icon = host.querySelector('org-icon[data-position="post"]') as HTMLElement;

    await expect(icon).not.toBeNull();
    await expect(icon.getAttribute('data-icon')).toBe('external-link');
  },
};

export const RendersDownloadAffordanceIconWhenDownloadIsSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-download-set'));

    const host = await canvas.findByTestId('link');
    const icon = host.querySelector('org-icon[data-position="post"]') as HTMLElement;

    await expect(icon).not.toBeNull();
    await expect(icon.getAttribute('data-icon')).toBe('download');
  },
};

export const DownloadAffordanceWinsWhenBlankTargetAndDownloadSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));
    await userEvent.click(canvas.getByTestId('ctl-download-set'));

    const host = await canvas.findByTestId('link');
    const icon = host.querySelector('org-icon[data-position="post"]') as HTMLElement;

    await expect(icon.getAttribute('data-icon')).toBe('download');
  },
};

export const NoAffordanceIconWhenAffordanceIsFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));
    await userEvent.click(canvas.getByTestId('ctl-affordance-off'));

    const host = await canvas.findByTestId('link');

    await expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
  },
};

export const NoAffordanceIconInActionLinkMode: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));
    await userEvent.click(canvas.getByTestId('ctl-href-clear'));

    const host = await canvas.findByTestId('link');

    await expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
  },
};

export const NoAffordanceIconWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-target-blank'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('link');

    await expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
  },
};

export const PostTemplateSuppressesAutoAffordanceIcon: Story = {
  render: () => ({
    template: `<story-link-post-suppress-shell />`,
    moduleMetadata: { imports: [StoryLinkPostSuppressShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link');

    await expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
    await expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
  },
};

const renderProjectionShell: Story['render'] = () => ({
  template: `<story-link-content-projection-shell />`,
  moduleMetadata: { imports: [StoryLinkContentProjectionShell] },
});

export const RendersProjectedDefaultContent: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link-default');

    await expect(host.querySelector('[data-testid="default-content"]')).not.toBeNull();
  },
};

export const RendersProjectedPreTemplate: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link-pre');

    await expect(host.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
  },
};

export const RendersProjectedPostTemplate: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('link-post');

    await expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
  },
};
