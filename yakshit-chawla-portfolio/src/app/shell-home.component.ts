import { Component } from '@angular/core';

@Component({
  selector: 'app-shell-home',
  standalone: true,
  template: `
    <section class="home-card">
      <h2>Microfrontend Overview</h2>
      <p>
        This shell hosts EventPulse, Clinic Connect, DocuShare, SkyFare, and StayBook as remote Angular applications.
      </p>
      <p>
        Each project will also include a lightweight Express and Mongo-ready backend scaffold so the overall architecture stays MEAN aligned.
      </p>
    </section>
  `,
  styles: [
    `
      .home-card {
        padding: 2rem;
        border-radius: 1.5rem;
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(124, 45, 18, 0.12);
        line-height: 1.7;
      }

      h2 {
        margin-top: 0;
      }
    `
  ]
})
export class ShellHomeComponent {}
