import { Component, ViewEncapsulation, computed } from '@angular/core';
import { ShellSharedStateService } from '../../../../shared/state/shell-shared-state.service';

@Component({
  selector: 'app-docushare-page',
  templateUrl: './docushare-page.component.html',
  styleUrl: './docushare-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DocusharePageComponent {
  protected readonly hostState;

  protected readonly summary;

  constructor(shellSharedStateService: ShellSharedStateService) {
    this.hostState = shellSharedStateService.state;
    this.summary = computed(
      () =>
        `${this.hostState().userName} is routing document workflows for ${this.hostState().audience} in ${this.hostState().city} over ${this.hostState().timeframe}.`
    );
  }
}
