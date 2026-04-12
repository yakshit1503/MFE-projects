import { Injectable, signal } from '@angular/core';
import { ShellSharedState } from './shell-shared-state.model';

declare global {
  interface Window {
    __PORTFOLIO_SHELL_STATE__?: ShellSharedState;
  }
}

const SHELL_STATE_EVENT = 'portfolio-shell-state-change';

@Injectable({ providedIn: 'root' })
export class ShellSharedStateService {
  readonly state = signal<ShellSharedState>({
    activeApp: 'yakshit-chawla-portfolio',
    city: 'Toronto',
    audience: 'Recruiters',
    timeframe: 'This week',
    userName: 'Yakshit Chawla',
    message: 'Waiting for shell data.',
    theme: 'dark'
  });

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.__PORTFOLIO_SHELL_STATE__) {
      this.state.set(window.__PORTFOLIO_SHELL_STATE__);
    }

    window.addEventListener(SHELL_STATE_EVENT, this.handleShellState as EventListener);
  }

  private readonly handleShellState = (event: CustomEvent<ShellSharedState>) => {
    this.state.set(event.detail);
  };
}
