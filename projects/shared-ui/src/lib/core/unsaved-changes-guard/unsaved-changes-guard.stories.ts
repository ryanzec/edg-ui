import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { DialogRef } from '@angular/cdk/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ROUTES, Router, RouterOutlet, Routes } from '@angular/router';

import { unsavedChangesGuard } from './unsaved-changes-guard';
import { UnsavedChangesAware } from './unsaved-changes-aware';
import { UnsavedChangesDirective } from '../unsaved-changes-dialog/unsaved-changes-directive';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { Dialog } from '../dialog/dialog';
import { DialogHeader } from '../dialog/dialog-header';
import { DialogContent } from '../dialog/dialog-content';
import { DialogFooter } from '../dialog/dialog-footer';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-custom-unsaved-changes-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, DialogFooter, Button],
  template: `
    <org-dialog>
      <org-dialog-header title="Discard Edits?" />
      <org-dialog-content>
        Hold up — your edits on this page haven't been saved. Want to keep editing or leave anyway?
      </org-dialog-content>
      <org-dialog-footer>
        <org-button color="neutral" label="Keep Editing" (clicked)="cancel()" />
        <org-button color="warning" label="Discard &amp; Leave" (clicked)="confirm()" />
      </org-dialog-footer>
    </org-dialog>
  `,
})
class StoryCustomUnsavedChangesDialog {
  private readonly _dialogRef = inject(DialogRef<boolean>);

  protected cancel(): void {
    this._dialogRef.close(false);
  }

  protected confirm(): void {
    this._dialogRef.close(true);
  }
}

@Component({
  selector: 'story-unsaved-changes-standard-dialog-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Input, Button, UnsavedChangesDirective],
  template: `
    <div [orgUnsavedChanges]="isDirty()" class="flex flex-col gap-3 p-4 border rounded-base">
      <h3 class="font-medium">Standard Dialog View (Guarded)</h3>
      <org-input
        name="standardFormName"
        [formControl]="nameControl"
        placeholder="Type something..."
        data-testid="standard-form-input"
      />
      <div class="flex flex-col gap-1 text-sm">
        <div><strong>Last Saved Value:</strong> "{{ lastSavedValue() }}"</div>
        <div><strong>Current Value:</strong> "{{ currentValue() }}"</div>
        <div><strong>Has Unsaved Changes:</strong> {{ isDirty() }}</div>
      </div>
      <div class="flex gap-2">
        <org-button label="Save" (clicked)="save()" data-testid="standard-form-save" />
      </div>
      <p class="text-sm">
        Type into the input to mark the form dirty, then click "Custom Dialog" to see the standard guard prompt.
        Reloading the browser tab while dirty also triggers the native "leave page" prompt via the directive.
      </p>
    </div>
  `,
})
class StoryUnsavedChangesStandardDialogView implements UnsavedChangesAware {
  protected readonly nameControl = new FormControl<string>('', { nonNullable: true });
  protected readonly currentValue = toSignal(this.nameControl.valueChanges, { initialValue: '' });
  protected readonly lastSavedValue = signal<string>('');
  protected readonly isDirty = computed<boolean>(() => this.currentValue() !== this.lastSavedValue());

  public hasUnsavedChanges(): boolean {
    return this.isDirty();
  }

  protected save(): void {
    this.lastSavedValue.set(this.currentValue());
  }
}

@Component({
  selector: 'story-unsaved-changes-custom-dialog-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Input, Button, UnsavedChangesDirective],
  template: `
    <div [orgUnsavedChanges]="isDirty()" class="flex flex-col gap-3 p-4 border rounded-base">
      <h3 class="font-medium">Custom Dialog View (Guarded)</h3>
      <org-input
        name="customFormName"
        [formControl]="nameControl"
        placeholder="Type something..."
        data-testid="custom-form-input"
      />
      <div class="flex flex-col gap-1 text-sm">
        <div><strong>Last Saved Value:</strong> "{{ lastSavedValue() }}"</div>
        <div><strong>Current Value:</strong> "{{ currentValue() }}"</div>
        <div><strong>Has Unsaved Changes:</strong> {{ isDirty() }}</div>
      </div>
      <div class="flex gap-2">
        <org-button label="Save" (clicked)="save()" data-testid="custom-form-save" />
      </div>
      <p class="text-sm">
        Same form contract as the standard view, but this one supplies a custom dialog component via
        <code>getDialogComponent()</code>. The prompt that appears uses different copy, button labels, and color.
      </p>
    </div>
  `,
})
class StoryUnsavedChangesCustomDialogView implements UnsavedChangesAware {
  protected readonly nameControl = new FormControl<string>('', { nonNullable: true });
  protected readonly currentValue = toSignal(this.nameControl.valueChanges, { initialValue: '' });
  protected readonly lastSavedValue = signal<string>('');
  protected readonly isDirty = computed<boolean>(() => this.currentValue() !== this.lastSavedValue());

  public hasUnsavedChanges(): boolean {
    return this.isDirty();
  }

  public getDialogComponent(): ComponentType<unknown> {
    return StoryCustomUnsavedChangesDialog;
  }

  protected save(): void {
    this.lastSavedValue.set(this.currentValue());
  }
}

@Component({
  selector: 'story-unsaved-changes-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Button, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Unsaved Changes Guard"
      currentState="Two guarded routes wired up: /standard (default dialog) and /custom (custom dialog via getDialogComponent). Navigate between them to see each prompt."
    >
      <org-storybook-example-container-section label="Navigation">
        <div class="flex gap-2">
          <org-button
            color="primary"
            label="Standard Dialog"
            (clicked)="navigateTo('/standard')"
            data-testid="nav-standard-dialog"
          />
          <org-button
            color="neutral"
            label="Custom Dialog"
            (clicked)="navigateTo('/custom')"
            data-testid="nav-custom-dialog"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Active Route">
        <router-outlet />
      </org-storybook-example-container-section>

      <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
        <li>Navigating between routes while the active form is clean goes through immediately</li>
        <li>Navigating away from the standard view while dirty opens the default <code>UnsavedChangesDialog</code></li>
        <li>
          Navigating away from the custom view while dirty opens the story-supplied dialog (different copy, button
          labels, and color)
        </li>
        <li>Choosing the cancel option in either dialog keeps the user on the page</li>
        <li>Choosing the discard option in either dialog allows the navigation to proceed</li>
        <li>Reloading the browser tab while a form is dirty triggers the native browser leave-page prompt</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class StoryUnsavedChangesShell {
  private readonly _router = inject(Router);

  constructor() {
    this._router.navigateByUrl('/standard');
  }

  protected navigateTo(path: string): void {
    this._router.navigateByUrl(path);
  }
}

const storyRoutes: Routes = [
  {
    path: 'standard',
    component: StoryUnsavedChangesStandardDialogView,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'custom',
    component: StoryUnsavedChangesCustomDialogView,
    canDeactivate: [unsavedChangesGuard],
  },
];

const meta: Meta<StoryUnsavedChangesShell> = {
  title: 'Core/Guards/UnsavedChanges',
  component: StoryUnsavedChangesShell,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [{ provide: ROUTES, useValue: storyRoutes, multi: true }],
    }),
    moduleMetadata({
      imports: [StoryUnsavedChangesShell, StoryUnsavedChangesStandardDialogView, StoryUnsavedChangesCustomDialogView],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Unsaved Changes Guard

  A route \`CanDeactivateFn\` that prompts the user before navigating away from a view that holds unsaved changes.

  ### Pieces

  - \`unsavedChangesGuard\` — the route guard. Wire it up via \`canDeactivate: [unsavedChangesGuard]\` on a route.
  - \`UnsavedChangesAware\` — interface a route component implements. Required: \`hasUnsavedChanges(): boolean\`. Optional: \`getDialogComponent?(): ComponentType<unknown>\` to supply a custom dialog.
  - \`UnsavedChangesDialog\` — the default confirmation dialog opened by the guard when no custom one is supplied.
  - \`UnsavedChangesDirective\` — \`[orgUnsavedChanges]\` directive that wires the browser \`beforeunload\` prompt for tab close / page reload (the route guard cannot cover those paths).

  ### How it Works

  1. The router invokes \`unsavedChangesGuard\` on every attempted navigation away from the route.
  2. If the route component does not implement \`UnsavedChangesAware\` or \`hasUnsavedChanges()\` returns false, the navigation proceeds.
  3. Otherwise the guard opens a dialog. If the component returns a component from \`getDialogComponent()\`, that one is used; otherwise the default \`UnsavedChangesDialog\` is used.
  4. The dialog component is responsible for closing its \`DialogRef<boolean>\` with \`true\` to allow navigation or anything else to keep the user on the page.
  5. The \`[orgUnsavedChanges]\` directive separately handles tab close / hard reload via \`beforeunload\`.
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryUnsavedChangesShell>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two guarded routes registered for this story only. The standard route uses the default dialog; the custom route supplies its own dialog via getDialogComponent.',
      },
    },
  },
  render: () => ({
    template: `<story-unsaved-changes-shell />`,
  }),
};
