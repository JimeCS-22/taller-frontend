import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ConsultaService } from './consulta.service';
import { ConsultaResponse } from './consulta.models';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <main class="wrap">
      <h1>🎬 Asistente de Películas</h1>
      <p class="sub">Búsqueda semántica con RAG + Ollama (local)</p>

      <div class="barra">
        <input [(ngModel)]="pregunta" (keyup.enter)="enviar()"
               placeholder="Ej: ¿Qué película de ciencia ficción recomiendas para ver en familia?" />
        <button (click)="enviar()" [disabled]="cargando()">Preguntar</button>
      </div>

      @if (cargando()) { <p class="estado">⏳ Pensando... (en CPU puede tardar unos segundos)</p> }
      @if (error()) { <p class="error">⚠️ {{ error() }}</p> }

      @if (resp(); as r) {
        <section class="card resumen">
          <h2>Resumen ejecutivo</h2>
          <p>{{ r.analisis.resumen_ejecutivo }}</p>
          <h3>Recomendación</h3>
          <p>{{ r.analisis.recomendacion }}</p>
        </section>

        <h2>Películas recuperadas (por similitud)</h2>
        <div class="grid">
          @for (x of r.registros; track x.pelicula.id) {
            <article class="card">
              <span class="badge">{{ x.similitud | number: '1.2-2' }}</span>
              <h3>{{ x.pelicula.titulo }} ({{ x.pelicula.anio }})</h3>
              <p class="meta">{{ x.pelicula.genero }} · {{ x.pelicula.clasificacion }} ·
                {{ x.pelicula.recaudacionMillones }} M USD</p>
              <p>{{ x.pelicula.sinopsis }}</p>
            </article>
          }
        </div>

        <h2>Análisis del modelo</h2>
        <table>
          <thead><tr><th>ID</th><th>Título</th><th>Motivo</th></tr></thead>
          <tbody>
            @for (e of r.analisis.elementos_filtrados; track e.id) {
              <tr><td>{{ e.id }}</td><td>{{ e.titulo }}</td><td>{{ e.motivo }}</td></tr>
            }
          </tbody>
        </table>
      }
    </main>
  `,
  styles: [`
    .wrap { max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: system-ui, sans-serif; }
    .sub { color: #666; margin-top: -.5rem; }
    .barra { display: flex; gap: .5rem; margin: 1rem 0; }
    input { flex: 1; padding: .7rem; border: 1px solid #bbb; border-radius: 8px; font-size: 1rem; }
    button { padding: .7rem 1.2rem; border: 0; border-radius: 8px; background: #1f6feb; color: #fff; cursor: pointer; }
    button:disabled { opacity: .5; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
    .card { position: relative; border: 1px solid #ddd; border-radius: 12px; padding: 1rem; background: #fff; }
    .resumen { background: #f3f8ff; margin: 1rem 0; }
    .badge { position: absolute; top: .6rem; right: .6rem; background: #1f6feb; color: #fff; border-radius: 999px; padding: .1rem .6rem; font-size: .8rem; }
    .meta { color: #666; font-size: .85rem; }
    .error { color: #b42318; } .estado { color: #555; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: .5rem; text-align: left; }
    th { background: #f5f5f5; }
  `]
})
export class ConsultaComponent {
  private servicio = inject(ConsultaService);

  pregunta = '';
  resp = signal<ConsultaResponse | null>(null);
  cargando = signal(false);
  error = signal('');

  enviar() {
    if (!this.pregunta.trim()) return;
    this.cargando.set(true);
    this.error.set('');
    this.resp.set(null);

    // ====== TODO 3 (parte 2): suscribirse y llenar las tarjetas ======
    this.servicio.consultar(this.pregunta).subscribe({
      next: r => { this.resp.set(r); this.cargando.set(false); },
      error: e => {
        this.error.set(e.error?.message ?? 'No se pudo consultar el back-end.');
        this.cargando.set(false);
      }
    });
    // ====== FIN TODO 3 ======
  }
}