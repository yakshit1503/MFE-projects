import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ProjectKey } from './auth.models';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const projectKey = route.data['projectKey'] as ProjectKey | undefined;

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/projects']);
  }

  if (projectKey && !authService.canAccess(projectKey)) {
    return router.createUrlTree(['/projects/dashboard']);
  }

  return true;
};
