import { PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

export default [
  provideZonelessChangeDetection(),
  provideRouter([{ path: '**', children: [] }]),
  // blocklists the example.com test image host so the NgOptimizedImage preconnect check (NG02956) does not
  // warn for priority remote images in tests (the blocklist matches by exact hostname, not a wildcard)
  { provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'example.com' },
];
