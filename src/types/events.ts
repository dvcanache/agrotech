export type EventIconType = 'reproductivos' | 'productivos' | 'inventarios' | 'veterinarios' | 'otros';

export interface EventCategory {
  titulo: string;
  iconoType: EventIconType;
  enlaces: string[];
}
