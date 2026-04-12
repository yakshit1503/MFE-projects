import { Component, ViewEncapsulation } from '@angular/core';
import { StaybookPageComponent } from './features/staybook/components/staybook-page/staybook-page.component';

@Component({
  selector: 'app-root',
  imports: [StaybookPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {}
