import { Component, ViewEncapsulation, computed } from '@angular/core';
import { ShellSharedStateService } from '../../../../shared/state/shell-shared-state.service';

@Component({
  selector: 'app-eventpulse-page',
  templateUrl: './eventpulse-page.component.html',
  styleUrl: './eventpulse-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class EventpulsePageComponent {
  protected readonly hostState;

  protected readonly summary;

  constructor(shellSharedStateService: ShellSharedStateService) {
    this.hostState = shellSharedStateService.state;
    this.summary = computed(
      () =>
        `${this.hostState().userName} is curating ${this.hostState().audience} events in ${this.hostState().city} for ${this.hostState().timeframe}.`
    );
  }
}
