import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'org-tags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags {}
