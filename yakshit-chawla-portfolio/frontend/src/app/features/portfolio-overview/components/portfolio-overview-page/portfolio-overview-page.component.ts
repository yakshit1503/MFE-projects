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
  protected readonly highlights = [
    { value: '8+', label: 'Years delivering enterprise web apps' },
    { value: '3', label: 'Global clients: Cisco, Fidelity, Citibank' },
    { value: 'MEAN', label: 'Angular, Node, Express, MongoDB focus' }
  ];

  protected readonly strengths = [
    'Angular 19, standalone components, Signals, RxJS, NgRx',
    'React, Next.js, TypeScript, accessible UI systems',
    'Node.js, Express.js, NestJS, REST APIs, microservices',
    'MongoDB, Microsoft SQL Server, CI/CD, Docker, Agile delivery'
  ];

  protected readonly roles = [
    {
      company: 'Synechron Canada Inc.',
      meta: 'Senior Associate - Technology | Client: Citibank',
      detail: 'Architected Angular 19 applications with Signals, standalone components, deferrable views, reactive forms, and enterprise microservice integration.'
    },
    {
      company: 'NTT DATA Canada Inc.',
      meta: 'Software Development Senior Specialist | Client: Fidelity Charitable',
      detail: 'Delivered Angular 16/NestJS features from Figma patterns, built scalable ag-Grid tables, and strengthened responsive/accessibility practices.'
    },
    {
      company: 'Intelligaia Technologies',
      meta: 'Software Engineer | Client: Cisco Systems',
      detail: 'Migrated AngularJS applications, introduced Nx-style architecture, created reusable Angular/Node libraries, and built D3 dashboard tooling.'
    }
  ];
}
