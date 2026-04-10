import { Injectable } from '@angular/core';
import { ShellSharedState } from './shell-state.model';

declare global {
  interface Window {
    __PORTFOLIO_SHELL_STATE__?: ShellSharedState;
  }
}

const SHELL_STATE_EVENT = 'portfolio-shell-state-change';

@Injectable({ providedIn: 'root' })
export class ShellStateService {
  publish(state: ShellSharedState): void {
    window.__PORTFOLIO_SHELL_STATE__ = state;
    window.dispatchEvent(new CustomEvent<ShellSharedState>(SHELL_STATE_EVENT, { detail: state }));
  }
}
