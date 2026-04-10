import { Component, ViewEncapsulation, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellSharedStateService } from './shell-shared-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {
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
