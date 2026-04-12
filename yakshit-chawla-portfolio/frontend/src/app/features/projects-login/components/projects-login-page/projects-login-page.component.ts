import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';

@Component({
  selector: 'app-projects-login-page',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
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
      void this.router.navigateByUrl(this.getPostLoginRoute());
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
    void this.router.navigateByUrl(this.getPostLoginRoute());
  }

  private getPostLoginRoute(): string {
    const allowedProjects = this.authService.allowedProjects();
    return allowedProjects.length === 1 ? allowedProjects[0].route : '/projects/dashboard';
  }
}
