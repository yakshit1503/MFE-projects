import { Component, ViewEncapsulation } from '@angular/core';
import { ClinicConnectPageComponent } from './features/clinic-connect/components/clinic-connect-page/clinic-connect-page.component';

@Component({
  selector: 'app-root',
  imports: [ClinicConnectPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {}
