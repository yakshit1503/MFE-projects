import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';

@Component({
  selector: 'app-projects-dashboard-page',
  imports: [MatCardModule, RouterLink],
  templateUrl: './projects-dashboard-page.component.html',
  styleUrl: './projects-dashboard-page.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectsDashboardPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly session = this.authService.session;
  protected readonly projects = this.authService.allowedProjects;
}
