import { Injectable, computed, signal } from '@angular/core';
import { AuthSession, LoginCredential, ProjectAccess, ProjectKey } from './auth.models';

const SESSION_KEY = 'yakshit-portfolio-session';

export const PROJECTS: ProjectAccess[] = [
  {
    key: 'eventpulse',
    name: 'EventPulse',
    route: '/projects/eventpulse',
    description: 'Events and ticketing microfrontend'
  },
  {
    key: 'clinic-connect',
    name: 'Clinic Connect',
    route: '/projects/clinic-connect',
    description: 'Clinic booking and patient intake microfrontend'
  },
  {
    key: 'docushare',
    name: 'DocuShare',
    route: '/projects/docushare',
    description: 'Document upload and approval microfrontend'
  },
  {
    key: 'skyfare',
    name: 'SkyFare',
    route: '/projects/skyfare',
    description: 'Flight booking and fare insights microfrontend'
  },
  {
    key: 'staybook',
    name: 'StayBook',
    route: '/projects/staybook',
    description: 'Hotel reservation and stay discovery microfrontend'
  }
];

export const LOGIN_CREDENTIALS: LoginCredential[] = [
  { username: 'admin', password: 'admin123', label: 'Admin', access: 'all' },
  { username: 'eventpulse', password: 'event123', label: 'EventPulse User', access: ['eventpulse'] },
  { username: 'clinic', password: 'clinic123', label: 'Clinic Connect User', access: ['clinic-connect'] },
  { username: 'docs', password: 'docs123', label: 'DocuShare User', access: ['docushare'] },
  { username: 'skyfare', password: 'sky123', label: 'SkyFare User', access: ['skyfare'] },
  { username: 'staybook', password: 'stay123', label: 'StayBook User', access: ['staybook'] }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly credentials = LOGIN_CREDENTIALS;
  readonly projects = PROJECTS;

  private readonly sessionState = signal<AuthSession | null>(this.readSession());

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionState() !== null);
  readonly allowedProjects = computed(() => {
    const session = this.sessionState();

    if (!session) {
      return [];
    }

    if (session.access === 'all') {
      return PROJECTS;
    }

    return PROJECTS.filter((project) => session.access.includes(project.key));
  });

  login(username: string, password: string): boolean {
    const credential = LOGIN_CREDENTIALS.find(
      (item) => item.username === username.trim() && item.password === password.trim()
    );

    if (!credential) {
      return false;
    }

    const session: AuthSession = {
      username: credential.username,
      label: credential.label,
      access: credential.access
    };

    this.sessionState.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }

  logout(): void {
    this.sessionState.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  canAccess(projectKey: ProjectKey): boolean {
    const session = this.sessionState();

    if (!session) {
      return false;
    }

    return session.access === 'all' || session.access.includes(projectKey);
  }

  private readSession(): AuthSession | null {
    try {
      const value = localStorage.getItem(SESSION_KEY);
      return value ? (JSON.parse(value) as AuthSession) : null;
    } catch {
      return null;
    }
  }
}
