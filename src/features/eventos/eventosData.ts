import { EventCategory } from '../../types/events';

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    titulo: "Reproductivos",
    iconoType: "reproductivos",
    enlaces: ["Servicios", "Revisiones", "Partos", "Abortos", "Celos", "Embriones"]
  },
  {
    titulo: "Productivos",
    iconoType: "productivos",
    enlaces: ["Pesajes de leche", "Secados", "Crecimientos"]
  },
  {
    titulo: "Inventarios",
    iconoType: "inventarios",
    enlaces: ["Inventarios", "Cambios de lote"]
  },
  {
    titulo: "Veterinarios",
    iconoType: "veterinarios",
    enlaces: ["Mastitis", "Clínicos", "Planes sanitarios"]
  },
  {
    titulo: "Otros",
    iconoType: "otros",
    enlaces: ["Comentarios", "Otros cambios", "Eliminación Eventos", "Afiliaciones", "Producciones diarias"]
  }
];
