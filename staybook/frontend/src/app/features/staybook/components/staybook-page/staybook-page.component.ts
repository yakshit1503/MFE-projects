import { Component, ViewEncapsulation, computed } from '@angular/core';
import { ShellSharedStateService } from '../../../../shared/state/shell-shared-state.service';

@Component({
  selector: 'app-staybook-page',
  templateUrl: './staybook-page.component.html',
  styleUrl: './staybook-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class StaybookPageComponent {
  protected readonly hostState;

  protected readonly summary;

  constructor(shellSharedStateService: ShellSharedStateService) {
    this.hostState = shellSharedStateService.state;
    this.summary = computed(
      () =>
        `${this.hostState().userName} is targeting ${this.hostState().audience} in ${this.hostState().city} for ${this.hostState().timeframe}.`
    );
  }
}
