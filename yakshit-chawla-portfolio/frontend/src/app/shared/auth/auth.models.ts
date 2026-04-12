export type ProjectKey = 'eventpulse' | 'clinic-connect' | 'docushare' | 'skyfare' | 'staybook';

export interface ProjectAccess {
  key: ProjectKey;
  name: string;
  route: string;
  description: string;
}

export interface LoginCredential {
  username: string;
  password: string;
  label: string;
  access: 'all' | ProjectKey[];
}

export interface AuthSession {
  username: string;
  label: string;
  access: 'all' | ProjectKey[];
}
