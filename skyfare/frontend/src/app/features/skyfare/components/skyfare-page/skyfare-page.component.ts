import { Component, ViewEncapsulation, computed } from '@angular/core';
import { ShellSharedStateService } from '../../../../shared/state/shell-shared-state.service';

@Component({
  selector: 'app-skyfare-page',
  templateUrl: './skyfare-page.component.html',
  styleUrl: './skyfare-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SkyfarePageComponent {
  protected readonly hostState;

  protected readonly summary;

  constructor(shellSharedStateService: ShellSharedStateService) {
    this.hostState = shellSharedStateService.state;
    this.summary = computed(
      () =>
        `${this.hostState().userName} is targeting ${this.hostState().audience} travel demand in ${this.hostState().city} for ${this.hostState().timeframe}.`
    );
  }
}
