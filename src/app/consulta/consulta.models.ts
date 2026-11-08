// Interfaces que espejan los DTOs del back-end (mismo contrato JSON).
export interface ElementoFiltrado {
  id: number;
  titulo: string;
  motivo: string;
}

export interface RespuestaIA {
  resumen_ejecutivo: string;
  elementos_filtrados: ElementoFiltrado[];
  recomendacion: string;
}

export interface Pelicula {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  recaudacionMillones: number;
  clasificacion: string;
  sinopsis: string;
}

export interface ResultadoSimilitud {
  pelicula: Pelicula;
  similitud: number;
}

export interface ConsultaResponse {
  analisis: RespuestaIA;
  registros: ResultadoSimilitud[];
}