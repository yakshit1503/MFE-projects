import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth/auth.service';
import { ShellStateService } from './shared/state/shell-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {
  private readonly shellStateService = inject(ShellStateService);
  private readonly authService = inject(AuthService);

  protected readonly session = this.authService.session;
  protected readonly projectsLink = () => (this.session() ? '/projects/dashboard' : '/projects');
  protected city = 'Toronto';
  protected audience = 'Recruiters';
  protected timeframe = 'This week';
  protected userName = 'Yakshit Chawla';
  protected message = 'Shared host state is flowing from the shell into each remote.';

  constructor() {
    this.pushState();
  }

  protected logout(): void {
    this.authService.logout();
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
}
