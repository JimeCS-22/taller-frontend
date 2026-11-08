import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsultaComponent } from './consulta/consulta.component';

@Component({
  imports: [RouterOutlet, ConsultaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('taller-frontend');
}
