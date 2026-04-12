import { Component, ViewEncapsulation } from '@angular/core';
import { EventpulsePageComponent } from './features/eventpulse/components/eventpulse-page/eventpulse-page.component';

@Component({
  selector: 'app-root',
  imports: [EventpulsePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {}
