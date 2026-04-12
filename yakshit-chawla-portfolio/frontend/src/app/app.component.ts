import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth/auth.service';
import { ShellStateService } from './shared/state/shell-state.service';

type ThemeMode = 'light' | 'dark';
const THEME_KEY = 'yakshit-portfolio-theme';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatSlideToggleModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {
  private readonly shellStateService = inject(ShellStateService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly session = this.authService.session;
  protected readonly theme = signal<ThemeMode>(this.readTheme());
  protected city = 'Toronto';
  protected audience = 'Recruiters';
  protected timeframe = 'This week';
  protected userName = 'Yakshit Chawla';
  protected message = 'Shared host state is flowing from the shell into each remote.';

  constructor() {
    this.applyTheme(this.theme());
    this.pushState();
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/projects');
  }

  protected projectsLink(): string {
    if (!this.session()) {
      return '/projects';
    }

    const allowedProjects = this.authService.allowedProjects();
    return allowedProjects.length === 1 ? allowedProjects[0].route : '/projects/dashboard';
  }

  protected setTheme(theme: ThemeMode | string): void {
    if (theme !== 'light' && theme !== 'dark') {
      return;
    }

    this.theme.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  protected pushState(): void {
    this.shellStateService.publish({
      activeApp: 'yakshit-chawla-portfolio',
      city: this.city,
      audience: this.audience,
      timeframe: this.timeframe,
      userName: this.userName,
      message: this.message
    });
  }

  private readTheme(): ThemeMode {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  }

  private applyTheme(theme: ThemeMode): void {
    document.documentElement.dataset['theme'] = theme;
  }
}
