import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * the "Expected behaviour" block rendered beneath an `org-design-system-demo` — a fixed-purpose
 * documentation primitive for listing the behavioral expectations of the demoed component variants.
 * The heading text is fixed; the list content is freely projected (typically a `<ul>`).
 */
@Component({
  selector: 'org-design-system-demo-expected-behaviour',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-demo-expected-behaviour.html',
  styleUrl: './design-system-demo-expected-behaviour.css',
})
export class DesignSystemDemoExpectedBehaviour {}
