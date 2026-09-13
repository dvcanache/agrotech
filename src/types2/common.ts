/**
 * Tipos base y enums para las entidades y reportes zootécnicos y agronómicos
 */

export type CategoriaAnimal =
  | 'Becerra'
  | 'Mauta'
  | 'Novilla'
  | 'Vaca'
  | 'Becerro'
  | 'Maute'
  | 'Novillo'
  | 'Toro'
  | 'Semen'
  | 'Embrión'
  | string;

export type EstatusAnimal = 'Activo' | 'Inactivo' | 'Referencia' | string;

export type EstatusReproductivo = 'Vacía' | 'Preñada' | 'En espera' | string;

export type EstatusProductivo = 'Seca' | 'Ordeño' | 'Criando' | 'Lactancia' | 'Postura' | 'En Producción' | 'Ceba' | 'Trabajo' | string;

export type TipoPesaje =
  | 'General'
  | 'Al nacer'
  | 'Al ingreso'
  | 'Al destete'
  | 'Al servicio'
  | 'Al parto'
  | 'Al secado'
  | 'Al salir';

export type TipoEventoReproductivo =
  | 'Servicio'
  | 'Revisión'
  | 'Parto'
  | 'Aborto'
  | 'Celo'
  | 'Embrión';

export type MetodoParto =
  | 'Normal'
  | 'Asistido'
  | 'Distócico'
  | 'Mortinato';

export type TipoOrdeno = 'Inicio' | 'Ordeño' | 'Secado';

export type EstatusPotrero =
  | 'Disponible'
  | 'Ocupado'
  | 'Activo'
  | 'En descanso'
  | 'Mantenimiento'
  | 'En mantenimiento'
  | 'En siembra';

export type TipoLaborPotrero =
  | 'Fertilización'
  | 'Limpieza y Desmalezado'
  | 'Siembra / Resiembra'
  | 'Riego'
  | 'Mantenimiento de Cercas'
  | 'Control de Plagas'
  | 'Corte / Heno';
