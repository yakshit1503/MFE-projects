import { Component, ViewEncapsulation } from '@angular/core';
import { DocusharePageComponent } from './features/docushare/components/docushare-page/docushare-page.component';

@Component({
  selector: 'app-root',
  imports: [DocusharePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {}
