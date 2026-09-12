import { PrvStatus } from '../potreros/prvUtils';

export interface GisGate {
  id: string;
  codigo: string;
  paddockId: string;
  nombre: string;
  x: number;
  y: number;
  abierta: boolean;
}

export interface GisPaddock {
  id: string;
  codigo: string;
  nombre: string;
  areaHa: number;
  perimetroM: number;
  especieForrajera: string;
  lote: string;
  animales: number;
  uggPresentes: number;
  cargaUggHa: number;
  aforoKgM2: number;
  porcentajeMS: number;
  aforoKgMsHa: number;
  diasOcupacionActual: number;
  diasOcupacionMax: number;
  diasDescansoActual: number;
  diasDescansoRequeridos: number;
  eficienciaAprovechamiento: number;
  ndviValue: number; // 0.1 a 0.85
  estatus: 'Activo' | 'En descanso' | 'En mantenimiento';
  prvStatus: PrvStatus;
  color: string;
  fillColor: string;
  // Relative SVG polygon points [x, y] in a 950x720 coordinate box
  polygonPoints: string;
  center: { x: number; y: number };
}

export interface GisPointOfInterest {
  id: string;
  nombre: string;
  tipo: 'vaquera' | 'silo' | 'tanque' | 'manga' | 'laguna';
  x: number;
  y: number;
  icono?: string;
  detalle?: string;
}

export const GIS_GATES: GisGate[] = [
  { id: 'gate-1', codigo: 'G1', paddockId: 'pot-1', nombre: 'Tranquera Potrero de la Casa', x: 330, y: 185, abierta: true },
  { id: 'gate-2', codigo: 'G2', paddockId: 'pot-2', nombre: 'Tranquera Potrero del Tanque', x: 350, y: 190, abierta: true },
  { id: 'gate-3', codigo: 'G3', paddockId: 'pot-3', nombre: 'Tranquera Potrero El Mango', x: 575, y: 200, abierta: false },
  { id: 'gate-4', codigo: 'G4', paddockId: 'pot-4', nombre: 'Tranquera Potrero La Represa', x: 325, y: 395, abierta: true },
  { id: 'gate-5', codigo: 'G5', paddockId: 'pot-5', nombre: 'Tranquera Potrero El Jobo', x: 345, y: 405, abierta: false },
  { id: 'gate-6', codigo: 'G6', paddockId: 'pot-6', nombre: 'Tranquera Potrero Los Samanes', x: 565, y: 420, abierta: false },
  { id: 'gate-7', codigo: 'G7', paddockId: 'pot-7', nombre: 'Tranquera Vega del Río', x: 330, y: 535, abierta: false },
  { id: 'gate-8', codigo: 'G8', paddockId: 'pot-8', nombre: 'Tranquera Maternidad', x: 550, y: 605, abierta: true }
];

export const GIS_PADDOCKS: GisPaddock[] = [
  {
    id: 'pot-1',
    codigo: 'POT1',
    nombre: 'Potrero de la Casa',
    areaHa: 45.5,
    perimetroM: 2850,
    especieForrajera: 'Brachiaria decumbens',
    lote: 'Lote 01 (Ordeño)',
    animales: 28,
    uggPresentes: 23.8,
    cargaUggHa: 1.35,
    aforoKgM2: 2.8,
    porcentajeMS: 22,
    aforoKgMsHa: 6160,
    diasOcupacionActual: 2,
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 28,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.68,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#2d6a4f',
    fillColor: 'rgba(45, 106, 79, 0.45)',
    polygonPoints: '120,80 330,90 325,280 110,270',
    center: { x: 220, y: 180 }
  },
  {
    id: 'pot-2',
    codigo: 'POT2',
    nombre: 'Potrero del Tanque',
    areaHa: 38.0,
    perimetroM: 2520,
    especieForrajera: 'Panicum maximum (Mombaza)',
    lote: 'Lote 02 (Novillas)',
    animales: 22,
    uggPresentes: 18.7,
    cargaUggHa: 1.28,
    aforoKgM2: 3.4,
    porcentajeMS: 20,
    aforoKgMsHa: 6800,
    diasOcupacionActual: 4, // > 2 días: Alerta sobrepastoreo
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 30,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.42,
    estatus: 'Activo',
    prvStatus: 'sobrepastoreo',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.35)',
    polygonPoints: '350,90 570,100 555,290 345,280',
    center: { x: 450, y: 190 }
  },
  {
    id: 'pot-3',
    codigo: 'POT3',
    nombre: 'Potrero El Mango',
    areaHa: 52.0,
    perimetroM: 3200,
    especieForrajera: 'Brachiaria brizantha (Marandú)',
    lote: 'Sin Lote (Listo para pastoreo)',
    animales: 0,
    uggPresentes: 0,
    cargaUggHa: 0.0,
    aforoKgM2: 3.1,
    porcentajeMS: 22,
    aforoKgMsHa: 6820,
    diasOcupacionActual: 0,
    diasOcupacionMax: 3,
    diasDescansoActual: 36, // > 35 días: Punto Óptimo de Reposo
    diasDescansoRequeridos: 35,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.82,
    estatus: 'En descanso',
    prvStatus: 'optimo',
    color: '#22c55e',
    fillColor: 'rgba(34, 197, 94, 0.45)',
    polygonPoints: '585,100 840,110 820,310 570,295',
    center: { x: 700, y: 200 }
  },
  {
    id: 'pot-4',
    codigo: 'POT4',
    nombre: 'Potrero La Represa',
    areaHa: 64.2,
    perimetroM: 3800,
    especieForrajera: 'Brachiaria humidicola',
    lote: 'Lote 03 (Vacas Secas)',
    animales: 19,
    uggPresentes: 17.1,
    cargaUggHa: 0.89,
    aforoKgM2: 2.5,
    porcentajeMS: 22,
    aforoKgMsHa: 5500,
    diasOcupacionActual: 1, // 1 día de ocupación: Activo normal
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 32,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.58,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#1b4332',
    fillColor: 'rgba(27, 67, 50, 0.45)',
    polygonPoints: '110,285 325,295 315,520 90,500',
    center: { x: 210, y: 400 }
  },
  {
    id: 'pot-5',
    codigo: 'POT5',
    nombre: 'Potrero El Jobo',
    areaHa: 41.8,
    perimetroM: 2650,
    especieForrajera: 'Cynodon nlemfuensis (Estrella)',
    lote: 'Sin Lote (En recuperación)',
    animales: 0,
    uggPresentes: 0,
    cargaUggHa: 0.0,
    aforoKgM2: 3.0,
    porcentajeMS: 24,
    aforoKgMsHa: 7200,
    diasOcupacionActual: 0,
    diasOcupacionMax: 3,
    diasDescansoActual: 14, // 14 de 25 días: En descanso
    diasDescansoRequeridos: 25,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.51,
    estatus: 'En descanso',
    prvStatus: 'descanso',
    color: '#3b82f6',
    fillColor: 'rgba(59, 130, 246, 0.35)',
    polygonPoints: '345,295 555,305 540,530 330,525',
    center: { x: 440, y: 410 }
  },
  {
    id: 'pot-6',
    codigo: 'POT6',
    nombre: 'Potrero Los Samanes',
    areaHa: 58.5,
    perimetroM: 3400,
    especieForrajera: 'Panicum maximum (Tanzania)',
    lote: 'Sin Lote (Listo para pastoreo)',
    animales: 0,
    uggPresentes: 0,
    cargaUggHa: 0.0,
    aforoKgM2: 3.6,
    porcentajeMS: 20,
    aforoKgMsHa: 7200,
    diasOcupacionActual: 0,
    diasOcupacionMax: 3,
    diasDescansoActual: 38, // 38 de 30 días: Punto Óptimo
    diasDescansoRequeridos: 30,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.79,
    estatus: 'En descanso',
    prvStatus: 'optimo',
    color: '#22c55e',
    fillColor: 'rgba(34, 197, 94, 0.45)',
    polygonPoints: '570,310 820,325 800,550 555,535',
    center: { x: 685, y: 425 }
  },
  {
    id: 'pot-7',
    codigo: 'POT7',
    nombre: 'Potrero Vega del Río',
    areaHa: 72.0,
    perimetroM: 4200,
    especieForrajera: 'Echinochloa polystachya (Alemán)',
    lote: 'En Mantenimiento agronómico',
    animales: 0,
    uggPresentes: 0,
    cargaUggHa: 0.0,
    aforoKgM2: 4.2,
    porcentajeMS: 18,
    aforoKgMsHa: 7560,
    diasOcupacionActual: 0,
    diasOcupacionMax: 3,
    diasDescansoActual: 12, // 12 de 40 días: En descanso
    diasDescansoRequeridos: 40,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.38,
    estatus: 'En mantenimiento',
    prvStatus: 'descanso',
    color: '#3b82f6',
    fillColor: 'rgba(59, 130, 246, 0.35)',
    polygonPoints: '90,510 535,540 515,670 70,640',
    center: { x: 300, y: 590 }
  },
  {
    id: 'pot-8',
    codigo: 'POT8',
    nombre: 'Potrero Maternidad',
    areaHa: 18.0,
    perimetroM: 1750,
    especieForrajera: 'Brachiaria decumbens',
    lote: 'Lote 05 (Maternidad y Partos)',
    animales: 6,
    uggPresentes: 5.4,
    cargaUggHa: 0.67,
    aforoKgM2: 3.2,
    porcentajeMS: 22,
    aforoKgMsHa: 7040,
    diasOcupacionActual: 2,
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 21,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.65,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.45)',
    polygonPoints: '545,545 790,560 770,680 525,670',
    center: { x: 655, y: 615 }
  }
];

export const GIS_POINTS_OF_INTEREST: GisPointOfInterest[] = [
  { id: 'poi-1', nombre: 'Vaquera & Sala de Ordeño', tipo: 'vaquera', x: 230, y: 260, detalle: 'Ordeño mecánico 2x, capacidad 12 plazas' },
  { id: 'poi-2', nombre: 'Tanque Australiano & Molino', tipo: 'tanque', x: 450, y: 275, detalle: 'Capacidad 120,000 L con bomba solar' },
  { id: 'poi-3', nombre: 'Laguna & Abrevadero Central', tipo: 'laguna', x: 550, y: 310, detalle: 'Espejo de agua natural para acueducto por gravedad' },
  { id: 'poi-4', nombre: 'Manga de Manejo y Báscula', tipo: 'manga', x: 670, y: 495, detalle: 'Báscula Tru-Test + manga de 15m' },
  { id: 'poi-5', nombre: 'Silos de Forraje & Heno', tipo: 'silo', x: 250, y: 300, detalle: 'Reserva estratégica: 80 ton ensilaje de maíz' }
];
