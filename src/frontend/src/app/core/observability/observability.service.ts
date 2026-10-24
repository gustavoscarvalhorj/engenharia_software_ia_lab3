import { Injectable, isDevMode } from '@angular/core';

export type AppEvent =
  | 'search_submitted'
  | 'search_succeeded'
  | 'search_empty'
  | 'search_failed'
  | 'checkout_viewed';

export interface EventData {
  readonly event: AppEvent;
  readonly durationMs?: number;
  readonly destination?: string;
  readonly resultCount?: number;
  readonly correlationId?: string;
}

@Injectable({ providedIn: 'root' })
export class ObservabilityService {
  track(data: EventData): void {
    if (isDevMode()) {
      console.info({
        timestamp: new Date().toISOString(),
        ...data,
      });
    }
  }
}
