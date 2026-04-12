import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';

@Component({
  selector: 'app-projects-login-page',
  imports: [FormsModule],
  templateUrl: './projects-login-page.component.html',
  styleUrl: './projects-login-page.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectsLoginPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected username = '';
  protected password = '';
  protected errorMessage = '';
  protected readonly credentials = this.authService.credentials;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl('/projects/dashboard');
    }
  }

  protected fillCredential(username: string, password: string): void {
    this.username = username;
    this.password = password;
    this.errorMessage = '';
  }

  protected login(): void {
    if (!this.authService.login(this.username, this.password)) {
      this.errorMessage = 'Invalid login. Pick one of the credentials from the right panel.';
      return;
    }

    this.errorMessage = '';
    void this.router.navigateByUrl('/projects/dashboard');
  }
}
