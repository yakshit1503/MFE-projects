import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portfolio-overview-page',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './portfolio-overview-page.component.html',
  styleUrl: './portfolio-overview-page.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class PortfolioOverviewPageComponent {
  protected readonly highlights = [
    { value: '8+', label: 'Years delivering enterprise web apps' },
    { value: '4', label: 'Enterprise teams across banking, charity, legal, and networking' },
    { value: 'MEAN', label: 'Angular, Node, Express, MongoDB, AWS-ready architecture' }
  ];

  protected readonly strengths = [
    'Angular 19, standalone components, Signals, RxJS, NgRx, reactive forms',
    'React, Next.js, TypeScript, accessible component systems, design-system thinking',
    'Node.js, Express.js, NestJS, REST APIs, microservices, JWT/OAuth/OIDC',
    'MongoDB, Microsoft SQL Server, CI/CD, Docker, Jenkins, Agile delivery',
    'Performance tuning, code quality, reusable architecture, frontend platform ownership'
  ];

  protected readonly deliveryHighlights = [
    {
      title: 'Frontend Architecture',
      detail: 'Modern Angular patterns, feature-based modules, reusable UI foundations, and MFE-ready boundaries.'
    },
    {
      title: 'Product Delivery',
      detail: 'Close collaboration with UX, backend, QA, and business teams to convert complex workflows into usable screens.'
    },
    {
      title: 'Full-Stack Depth',
      detail: 'MEAN-stack API integration, auth flows, MongoDB-backed features, and deployment-minded structure.'
    }
  ];

  protected readonly roles = [
    {
      company: 'Synechron Canada Inc.',
      meta: 'Senior Associate - Technology | Client: Citibank | Sep 2025 - Mar 2026',
      detail: 'Built enterprise-grade Angular 19 applications for banking workflows with a focus on performance, accessibility, and maintainable architecture.',
      bullets: [
        'Architected standalone Angular features using Signals, deferrable views, reactive forms, and reusable UI patterns.',
        'Integrated frontend flows with enterprise microservices while keeping components testable and release-friendly.',
        'Partnered with distributed teams in Agile delivery, code reviews, and CI/CD-driven development.'
      ]
    },
    {
      company: 'NTT DATA Canada Inc.',
      meta: 'Software Development Senior Specialist | Client: Fidelity Charitable | Feb 2024 - Apr 2025',
      detail: 'Delivered donor and operations-facing product experiences using Angular, NestJS, and scalable UI patterns.',
      bullets: [
        'Converted Figma workflows into responsive Angular 16 screens with polished interaction and accessibility behavior.',
        'Built complex ag-Grid experiences for high-volume data review, filtering, and operational decision-making.',
        'Strengthened backend collaboration through NestJS API integration, validation, and predictable data contracts.'
      ]
    },
    {
      company: 'Dye & Durham',
      meta: 'Software Developer | Aug 2022 - Sep 2023',
      detail: 'Supported legal-tech product delivery with reliable frontend features, API integration, and maintainable release work.',
      bullets: [
        'Implemented UI improvements and workflow enhancements for document-heavy business processes.',
        'Collaborated across product and engineering teams to reduce friction in user-facing flows.',
        'Maintained code quality through debugging, incremental refactors, and release-ready delivery.'
      ]
    },
    {
      company: 'Intelligaia Technologies',
      meta: 'Software Engineer | Client: Cisco Systems | Oct 2016 - Apr 2021',
      detail: 'Built and modernized Angular/Node applications for Cisco teams, including dashboards, reusable libraries, and migration work.',
      bullets: [
        'Migrated AngularJS experiences toward modern Angular patterns and reusable component architecture.',
        'Created Angular/Node libraries and dashboard tooling that improved consistency across internal products.',
        'Built data visualization experiences with D3 and supported maintainable frontend platform practices.'
      ]
    }
  ];
}
