import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portfolio-overview-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-overview-page.component.html',
  styleUrl: './portfolio-overview-page.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class PortfolioOverviewPageComponent {
  protected readonly items = [
    { name: 'EventPulse', path: '/eventpulse', description: 'Events remote mounted inside the shell' },
    { name: 'Clinic Connect', path: '/clinic-connect', description: 'Healthcare booking remote' },
    { name: 'DocuShare', path: '/docushare', description: 'Document workflow remote' },
    { name: 'SkyFare', path: '/skyfare', description: 'Flights remote' },
    { name: 'StayBook', path: '/staybook', description: 'Hotels remote you can edit independently' }
  ];
}
