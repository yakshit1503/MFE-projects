import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { PortfolioOverviewPageComponent } from '../../features/portfolio-overview/components/portfolio-overview-page/portfolio-overview-page.component';

export const routes: Routes = [
  {
    path: '',
    component: PortfolioOverviewPageComponent
  },
  {
    path: 'eventpulse',
    loadComponent: () => loadRemoteModule('eventbrite-clone', './Component').then((m) => m.App)
  },
  {
    path: 'clinic-connect',
    loadComponent: () => loadRemoteModule('appointment-booking', './Component').then((m) => m.App)
  },
  {
    path: 'docushare',
    loadComponent: () => loadRemoteModule('document-upload', './Component').then((m) => m.App)
  },
  {
    path: 'skyfare',
    loadComponent: () => loadRemoteModule('flight-booking', './Component').then((m) => m.App)
  },
  {
    path: 'staybook',
    loadComponent: () => loadRemoteModule('hotel-reservation', './Component').then((m) => m.App)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
