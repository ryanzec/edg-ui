import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TypedContextDirective } from './typed-context-directive';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

type DemoUser = {
  id: string;
  name: string;
  email: string;
};

const SAMPLE_USERS: DemoUser[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
];

@Component({
  selector: 'story-typed-context-object-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TypedContextDirective, NgTemplateOutlet, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Object Item Type"
      currentState="Template '$implicit' is narrowed to 'DemoUser' via the directive"
    >
      <org-storybook-example-container-section label="Rendered List">
        <ul class="flex flex-col gap-1">
          @for (user of users; track user.id) {
            <li>
              <ng-container [ngTemplateOutlet]="rowTemplateRef" [ngTemplateOutletContext]="{ $implicit: user }" />
            </li>
          }
        </ul>
      </org-storybook-example-container-section>

      <ng-template [orgTypedContext]="users" #rowTemplateRef let-user>
        <strong>{{ user.name }}</strong> &mdash; {{ user.email }}
      </ng-template>
    </org-storybook-example-container>
  `,
})
class TypedContextObjectDemo {
  protected readonly users = SAMPLE_USERS;

  @ViewChild('rowTemplateRef')
  public readonly rowTemplateRef!: TemplateRef<{ $implicit: DemoUser }>;
}

@Component({
  selector: 'story-typed-context-primitive-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TypedContextDirective, NgTemplateOutlet, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Primitive Item Type"
      currentState="Template '$implicit' is narrowed to 'string' via the directive"
    >
      <org-storybook-example-container-section label="Rendered List">
        <ul class="flex flex-col gap-1">
          @for (label of labels; track label) {
            <li>
              <ng-container [ngTemplateOutlet]="labelTemplateRef" [ngTemplateOutletContext]="{ $implicit: label }" />
            </li>
          }
        </ul>
      </org-storybook-example-container-section>

      <ng-template [orgTypedContext]="labels" #labelTemplateRef let-label>
        {{ label.toUpperCase() }}
      </ng-template>
    </org-storybook-example-container>
  `,
})
class TypedContextPrimitiveDemo {
  protected readonly labels: string[] = ['alpha', 'beta', 'gamma'];

  @ViewChild('labelTemplateRef')
  public readonly labelTemplateRef!: TemplateRef<{ $implicit: string }>;
}

const meta: Meta<TypedContextDirective<unknown>> = {
  title: 'Core/Directives/Typed Context',
  component: TypedContextDirective,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Typed Context Directive

  Provides typed \`$implicit\` context narrowing for \`<ng-template>\` slots that receive data via \`let-*\`. Replaces the prior \`@let user = asUser(tempUser)\` cast pattern with a directive-based \`ngTemplateContextGuard\` so the template type-checker can narrow the implicit value to a strong type.

  ### How It Works
  - The directive's generic \`TItem\` is inferred from the array passed to the required \`orgTypedContext\` input.
  - The runtime value of the input is **unused** — only its element type is consumed by the static \`ngTemplateContextGuard\` to narrow the template's \`$implicit\` value.
  - For templates that already have an array bound to a parent component (e.g. a table's \`[data]\` array), pass that same array directly. For templates that do not have a natural array source (e.g. single-context templates), pass a typed sentinel array property like \`protected dialogContextType: { message: string }[] = [];\`.

  ### Inputs
  - \`orgTypedContext\` (required): An array of \`TItem\`. Used purely for type inference; the runtime value is never read.

  ### Usage Examples
  \`\`\`html
  <!-- with a real data array (table row) -->
  <ng-template [orgTypedContext]="users()" #body let-user>
    {{ user.name }}
  </ng-template>

  <!-- with a typed sentinel array (single-context template) -->
  <ng-template [orgTypedContext]="dialogContextType" #dialogTemplateRef let-context>
    {{ context.message }}
  </ng-template>
  \`\`\`
  \`\`\`ts
  protected dialogContextType: { message: string }[] = [];
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TypedContextDirective<unknown>>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the directive narrowing the template context to an object type (DemoUser).',
      },
    },
  },
  render: () => ({
    template: `<story-typed-context-object-demo />`,
    moduleMetadata: {
      imports: [TypedContextObjectDemo],
    },
  }),
};

export const PrimitiveItemType: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the directive narrowing the template context to a primitive type (string). The template can call string-specific methods like `.toUpperCase()` with full type safety.',
      },
    },
  },
  render: () => ({
    template: `<story-typed-context-primitive-demo />`,
    moduleMetadata: {
      imports: [TypedContextPrimitiveDemo],
    },
  }),
};
