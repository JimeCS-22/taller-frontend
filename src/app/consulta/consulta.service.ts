import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaResponse } from './consulta.models';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private http = inject(HttpClient);
  private readonly url = 'http://localhost:8084/api/consultas';

  consultar(pregunta: string): Observable<ConsultaResponse> {
    // ====== TODO 3 (Paso 3): enviar la pregunta al back-end con HttpClient.post ======
    return this.http.post<ConsultaResponse>(this.url, { pregunta });
    // ====== FIN TODO 3 ======
  }
}