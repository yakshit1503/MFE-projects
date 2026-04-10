import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ShellStateService } from './shell-state.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {
  protected city = 'Toronto';
  protected audience = 'Recruiters';
  protected timeframe = 'This week';
  protected userName = 'Yakshit Chawla';
  protected message = 'Shared host state is flowing from the shell into each remote.';

  constructor(private readonly shellStateService: ShellStateService) {
    this.pushState();
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
