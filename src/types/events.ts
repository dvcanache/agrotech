import { EspecieAnimal } from './animal';

export type EventIconType = 'reproductivos' | 'productivos' | 'inventarios' | 'veterinarios' | 'manejo' | 'potreros' | 'otros';

export interface EventCategory {
  titulo: string;
  iconoType: EventIconType;
  enlaces: string[];
}

export interface EventoItem {
  id: string;
  fecha: string;
  codigoAnimal: string;
  especie?: EspecieAnimal;
  categoria: string;
  tipoEvento: string;
  vencimiento: string;
  tecnico?: string;
  observaciones?: string;
}
