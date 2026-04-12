import { Component, ViewEncapsulation } from '@angular/core';
import { SkyfarePageComponent } from './features/skyfare/components/skyfare-page/skyfare-page.component';

@Component({
  selector: 'app-root',
  imports: [SkyfarePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {}
