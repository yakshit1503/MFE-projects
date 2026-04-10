import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shell-home',
  standalone: true,
  templateUrl: './shell-home.component.html',
  styleUrl: './shell-home.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class ShellHomeComponent {
  protected readonly items = [
    { name: 'EventPulse', path: '/eventpulse', description: 'Events remote mounted inside the shell' },
    { name: 'Clinic Connect', path: '/clinic-connect', description: 'Healthcare booking remote' },
    { name: 'DocuShare', path: '/docushare', description: 'Document workflow remote' },
    { name: 'SkyFare', path: '/skyfare', description: 'Flights remote' },
    { name: 'StayBook', path: '/staybook', description: 'Hotels remote you can edit independently' }
  ];
}
