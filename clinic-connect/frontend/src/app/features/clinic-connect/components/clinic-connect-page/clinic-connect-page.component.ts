import { Component, ViewEncapsulation, computed } from '@angular/core';
import { ShellSharedStateService } from '../../../../shared/state/shell-shared-state.service';

@Component({
  selector: 'app-clinic-connect-page',
  templateUrl: './clinic-connect-page.component.html',
  styleUrl: './clinic-connect-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ClinicConnectPageComponent {
  protected readonly hostState;

  protected readonly summary;

  constructor(shellSharedStateService: ShellSharedStateService) {
    this.hostState = shellSharedStateService.state;
    this.summary = computed(
      () =>
        `${this.hostState().userName} is preparing clinic experiences for ${this.hostState().audience} in ${this.hostState().city} during ${this.hostState().timeframe}.`
    );
  }
}
