import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { PortfolioOverviewPageComponent } from '../../features/portfolio-overview/components/portfolio-overview-page/portfolio-overview-page.component';
import { ProjectsDashboardPageComponent } from '../../features/projects-dashboard/components/projects-dashboard-page/projects-dashboard-page.component';
import { ProjectsLoginPageComponent } from '../../features/projects-login/components/projects-login-page/projects-login-page.component';
import { authGuard } from '../../shared/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PortfolioOverviewPageComponent
  },
  {
    path: 'projects',
    component: ProjectsLoginPageComponent
  },
  {
    path: 'projects/dashboard',
    component: ProjectsDashboardPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/eventpulse',
    canActivate: [authGuard],
    data: { projectKey: 'eventpulse' },
    loadComponent: () => loadRemoteModule('eventbrite-clone', './Component').then((m) => m.App)
  },
  {
    path: 'projects/clinic-connect',
    canActivate: [authGuard],
    data: { projectKey: 'clinic-connect' },
    loadComponent: () => loadRemoteModule('appointment-booking', './Component').then((m) => m.App)
  },
  {
    path: 'projects/docushare',
    canActivate: [authGuard],
    data: { projectKey: 'docushare' },
    loadComponent: () => loadRemoteModule('document-upload', './Component').then((m) => m.App)
  },
  {
    path: 'projects/skyfare',
    canActivate: [authGuard],
    data: { projectKey: 'skyfare' },
    loadComponent: () => loadRemoteModule('flight-booking', './Component').then((m) => m.App)
  },
  {
    path: 'projects/staybook',
    canActivate: [authGuard],
    data: { projectKey: 'staybook' },
    loadComponent: () => loadRemoteModule('hotel-reservation', './Component').then((m) => m.App)
  },
  {
    path: 'eventpulse',
    redirectTo: 'projects/eventpulse'
  },
  {
    path: 'clinic-connect',
    redirectTo: 'projects/clinic-connect'
  },
  {
    path: 'docushare',
    redirectTo: 'projects/docushare'
  },
  {
    path: 'skyfare',
    redirectTo: 'projects/skyfare'
  },
  {
    path: 'staybook',
    redirectTo: 'projects/staybook'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
