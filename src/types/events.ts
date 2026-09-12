export type EventIconType = 'reproductivos' | 'productivos' | 'inventarios' | 'veterinarios' | 'potreros' | 'otros';

export interface EventCategory {
  titulo: string;
  iconoType: EventIconType;
  enlaces: string[];
}
