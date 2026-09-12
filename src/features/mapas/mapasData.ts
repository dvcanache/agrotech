import { PrvStatus } from '../potreros/prvUtils';
import { EspecieAnimal } from '../../types/animal';

export type TipoInstalacion = 
  | 'potrero' 
  | 'sabana' 
  | 'galpon' 
  | 'cochinera' 
  | 'aprisco' 
  | 'caballeriza';

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
  especie: EspecieAnimal;
  sector: string;
  tipoInstalacion: TipoInstalacion;
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
  sistemaAlojamiento?: string;
  capacidadMaxima?: number;
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
  { id: 'gate-1', codigo: 'G1', paddockId: 'pot-1', nombre: 'Tranquera Potrero de la Casa', x: 325, y: 175, abierta: true },
  { id: 'gate-2', codigo: 'G2', paddockId: 'pot-2', nombre: 'Tranquera Potrero del Tanque', x: 335, y: 175, abierta: true },
  { id: 'gate-3', codigo: 'G3', paddockId: 'pot-3', nombre: 'Tranquera Potrero El Mango', x: 550, y: 175, abierta: false },
  { id: 'gate-4', codigo: 'G4', paddockId: 'pot-4', nombre: 'Tranquera Potrero La Represa', x: 320, y: 380, abierta: true },
  { id: 'gate-5', codigo: 'G5', paddockId: 'pot-5', nombre: 'Tranquera Potrero El Jobo', x: 325, y: 380, abierta: false },
  { id: 'gate-6', codigo: 'G6', paddockId: 'eq-pot-caball', nombre: 'Tranquera Potrero Equino', x: 540, y: 380, abierta: true },
  { id: 'gate-7', codigo: 'G7', paddockId: 'pot-buf-1', nombre: 'Tranquera Sabana Baja Búfalos', x: 310, y: 500, abierta: true },
  { id: 'gate-8', codigo: 'G8', paddockId: 'pot-buf-2', nombre: 'Tranquera Bajíos Bufalinos', x: 325, y: 500, abierta: true },
  { id: 'gate-9', codigo: 'G9', paddockId: 'porc-coch-par', nombre: 'Acceso Sanitario Porcino', x: 540, y: 500, abierta: false },
  { id: 'gate-10', codigo: 'G10', paddockId: 'cap-apr-ord', nombre: 'Acceso Pasillo Caprino', x: 755, y: 500, abierta: true },
  { id: 'gate-11', codigo: 'G11', paddockId: 'av-galp-1', nombre: 'Filtro Bioseguridad Avícola', x: 765, y: 110, abierta: true },
  { id: 'gate-12', codigo: 'G12', paddockId: 'eq-caball-1', nombre: 'Portón Acceso Caballerizas', x: 760, y: 327, abierta: true }
];

export const GIS_PADDOCKS: GisPaddock[] = [
  // =========================================================================
  // 1. SECTOR BOVINOS (POTREROS 1 AL 5)
  // =========================================================================
  {
    id: 'pot-1',
    codigo: 'POT1',
    nombre: 'Potrero de la Casa',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
    areaHa: 45.5,
    perimetroM: 2850,
    especieForrajera: 'Brachiaria decumbens',
    lote: 'Lote 01 (Ordeño)',
    animales: 28,
    uggPresentes: 28.0, // 28 * 1.0 UGG
    cargaUggHa: 0.62,
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
    polygonPoints: '105,80 325,80 320,270 105,260',
    center: { x: 215, y: 175 }
  },
  {
    id: 'pot-2',
    codigo: 'POT2',
    nombre: 'Potrero del Tanque',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
    areaHa: 38.0,
    perimetroM: 2520,
    especieForrajera: 'Panicum maximum (Mombaza)',
    lote: 'Lote 02 (Novillas)',
    animales: 22,
    uggPresentes: 22.0, // 22 * 1.0 UGG
    cargaUggHa: 0.58,
    aforoKgM2: 3.4,
    porcentajeMS: 20,
    aforoKgMsHa: 6800,
    diasOcupacionActual: 4, // >2 días: sobrepastoreo
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 30,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.42,
    estatus: 'Activo',
    prvStatus: 'sobrepastoreo',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.35)',
    polygonPoints: '340,80 545,80 535,270 335,270',
    center: { x: 440, y: 175 }
  },
  {
    id: 'pot-3',
    codigo: 'POT3',
    nombre: 'Potrero El Mango',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
    areaHa: 52.0,
    perimetroM: 3200,
    especieForrajera: 'Brachiaria brizantha (Marandú)',
    lote: 'Sin Lote (Listo para pastoreo)',
    animales: 0,
    uggPresentes: 0.0,
    cargaUggHa: 0.0,
    aforoKgM2: 3.1,
    porcentajeMS: 22,
    aforoKgMsHa: 6820,
    diasOcupacionActual: 0,
    diasOcupacionMax: 3,
    diasDescansoActual: 36, // Listo
    diasDescansoRequeridos: 35,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.82,
    estatus: 'En descanso',
    prvStatus: 'optimo',
    color: '#22c55e',
    fillColor: 'rgba(34, 197, 94, 0.45)',
    polygonPoints: '560,80 750,80 740,270 550,270',
    center: { x: 650, y: 175 }
  },
  {
    id: 'pot-4',
    codigo: 'POT4',
    nombre: 'Potrero La Represa',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
    areaHa: 64.2,
    perimetroM: 3800,
    especieForrajera: 'Brachiaria humidicola',
    lote: 'Lote 03 (Vacas Secas)',
    animales: 19,
    uggPresentes: 19.0, // 19 * 1.0 UGG
    cargaUggHa: 0.30,
    aforoKgM2: 2.5,
    porcentajeMS: 22,
    aforoKgMsHa: 5500,
    diasOcupacionActual: 1,
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 32,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.58,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#1b4332',
    fillColor: 'rgba(27, 67, 50, 0.45)',
    polygonPoints: '105,285 320,285 315,480 90,470',
    center: { x: 205, y: 380 }
  },
  {
    id: 'pot-5',
    codigo: 'POT5',
    nombre: 'Potrero El Jobo',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
    areaHa: 41.8,
    perimetroM: 2650,
    especieForrajera: 'Cynodon nlemfuensis (Estrella)',
    lote: 'Sin Lote (En descanso)',
    animales: 0,
    uggPresentes: 0.0,
    cargaUggHa: 0.0,
    aforoKgM2: 3.0,
    porcentajeMS: 24,
    aforoKgMsHa: 7200,
    diasOcupacionActual: 0,
    diasOcupacionMax: 3,
    diasDescansoActual: 14,
    diasDescansoRequeridos: 25,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.51,
    estatus: 'En descanso',
    prvStatus: 'descanso',
    color: '#3b82f6',
    fillColor: 'rgba(59, 130, 246, 0.35)',
    polygonPoints: '335,285 535,285 525,480 325,480',
    center: { x: 430, y: 380 }
  },

  // =========================================================================
  // 2. SECTOR BÚFALOS (SABANA BAJA Y BAJÍOS INUNDABLES)
  // =========================================================================
  {
    id: 'pot-buf-1',
    codigo: 'SAB-BAJA',
    nombre: 'Sabana Baja Inundable',
    especie: 'Búfalos',
    sector: 'Sector Búfalos',
    tipoInstalacion: 'sabana',
    areaHa: 68.0,
    perimetroM: 4100,
    especieForrajera: 'Echinochloa polystachya (Alemán) y Bajíos',
    lote: 'Lote Sabana Baja (Búfalas Ordeño)',
    animales: 20,
    uggPresentes: 24.0, // 20 * 1.2 UGG
    cargaUggHa: 0.35,
    aforoKgM2: 4.5,
    porcentajeMS: 19,
    aforoKgMsHa: 8550,
    diasOcupacionActual: 2,
    diasOcupacionMax: 4,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 35,
    eficienciaAprovechamiento: 80,
    ndviValue: 0.72,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#0891b2',
    fillColor: 'rgba(8, 145, 178, 0.40)',
    polygonPoints: '80,500 315,500 305,685 60,670',
    center: { x: 190, y: 590 },
    sistemaAlojamiento: 'Humedal natural y pastoreo de bajío'
  },
  {
    id: 'pot-buf-2',
    codigo: 'POT-BUF-REC',
    nombre: 'Bajíos de Recuperación Bufalina',
    especie: 'Búfalos',
    sector: 'Sector Búfalos',
    tipoInstalacion: 'potrero',
    areaHa: 44.5,
    perimetroM: 2900,
    especieForrajera: 'Brachiaria humidicola (Humedal)',
    lote: 'Lote Bubillas y Mautes Bufalinos',
    animales: 15,
    uggPresentes: 18.0, // 15 * 1.2 UGG
    cargaUggHa: 0.40,
    aforoKgM2: 3.8,
    porcentajeMS: 21,
    aforoKgMsHa: 7980,
    diasOcupacionActual: 1,
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 30,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.64,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#0e7490',
    fillColor: 'rgba(14, 116, 144, 0.40)',
    polygonPoints: '330,500 525,500 515,685 320,685',
    center: { x: 420, y: 590 },
    sistemaAlojamiento: 'Potrero semi-inundable con cerca electrificada'
  },

  // =========================================================================
  // 3. SECTOR AVÍCOLA (GALPONES DE POSTURA, ENGORDE, GALLOS Y CRÍA)
  // =========================================================================
  {
    id: 'av-galp-1',
    codigo: 'GALP-01',
    nombre: 'Galpón 01 - Postura Comercial',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 1.5,
    perimetroM: 320,
    especieForrajera: 'Cama de Cascarilla de Arroz (Galpón Techado)',
    lote: 'Lote GALP-01 (Lohmann Brown)',
    animales: 400,
    uggPresentes: 2.0, // 400 * 0.005 UGG
    cargaUggHa: 1.33,
    aforoKgM2: 0.0,
    porcentajeMS: 88,
    aforoKgMsHa: 0,
    diasOcupacionActual: 180,
    diasOcupacionMax: 365,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 15,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#d97706',
    fillColor: 'rgba(217, 119, 6, 0.45)',
    polygonPoints: '765,70 840,70 840,150 765,150',
    center: { x: 802, y: 110 },
    sistemaAlojamiento: 'Jaulas Piramidales & Túnel de Viento',
    capacidadMaxima: 500
  },
  {
    id: 'av-galp-3',
    codigo: 'GALP-03',
    nombre: 'Galpón 03 - Pollos de Engorde',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 1.8,
    perimetroM: 360,
    especieForrajera: 'Ambiente Controlado / Nebulización',
    lote: 'Lote GALP-03 (Cobb 500 Engorde)',
    animales: 500,
    uggPresentes: 2.5, // 500 * 0.005 UGG
    cargaUggHa: 1.39,
    aforoKgM2: 0.0,
    porcentajeMS: 88,
    aforoKgMsHa: 0,
    diasOcupacionActual: 32,
    diasOcupacionMax: 45,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 14,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#b45309',
    fillColor: 'rgba(180, 83, 9, 0.45)',
    polygonPoints: '855,70 930,70 930,150 855,150',
    center: { x: 892, y: 110 },
    sistemaAlojamiento: 'Piso con Cascarilla & Comederos Automáticos',
    capacidadMaxima: 600
  },
  {
    id: 'av-cas-elite',
    codigo: 'CAS-ELITE',
    nombre: 'Casilleros Gallos Finos Élite',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 0.6,
    perimetroM: 180,
    especieForrajera: 'Voladeros Individuales y Ruedo de Pasto',
    lote: 'Lote CAS-ELITE (Gallos de Combate)',
    animales: 40,
    uggPresentes: 0.2, // 40 * 0.005 UGG
    cargaUggHa: 0.33,
    aforoKgM2: 1.2,
    porcentajeMS: 25,
    aforoKgMsHa: 3000,
    diasOcupacionActual: 15,
    diasOcupacionMax: 90,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 10,
    eficienciaAprovechamiento: 85,
    ndviValue: 0.55,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.45)',
    polygonPoints: '765,165 840,165 840,245 765,245',
    center: { x: 802, y: 205 },
    sistemaAlojamiento: 'Casilleros Individuales Acondicionados',
    capacidadMaxima: 50
  },
  {
    id: 'av-criad-1',
    codigo: 'CRIAD-01',
    nombre: 'Criadora y Galpón de Pollitas',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 0.8,
    perimetroM: 210,
    especieForrajera: 'Maternidad Avícola con Campanas Criadoras',
    lote: 'Lote CRIAD-01 (Pollitas en Crecimiento)',
    animales: 300,
    uggPresentes: 1.5, // 300 * 0.005 UGG
    cargaUggHa: 1.88,
    aforoKgM2: 0.0,
    porcentajeMS: 88,
    aforoKgMsHa: 0,
    diasOcupacionActual: 18,
    diasOcupacionMax: 40,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 12,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#ca8a04',
    fillColor: 'rgba(202, 138, 4, 0.45)',
    polygonPoints: '855,165 930,165 930,245 855,245',
    center: { x: 892, y: 205 },
    sistemaAlojamiento: 'Campanas Radiantes a Gas & Termóstatos',
    capacidadMaxima: 350
  },

  // =========================================================================
  // 4. SECTOR EQUINOS (POTRERO, CABALLERIZAS Y PICADERO)
  // =========================================================================
  {
    id: 'eq-pot-caball',
    codigo: 'POT-CABALL',
    nombre: 'Potrero de Pastoreo Equino',
    especie: 'Equinos',
    sector: 'Caballerizas y Picadero',
    tipoInstalacion: 'potrero',
    areaHa: 22.5,
    perimetroM: 1950,
    especieForrajera: 'Cynodon dactylon (Bermuda / Tifton)',
    lote: 'Lote POT-CABALL (Yeguas de Cría)',
    animales: 8,
    uggPresentes: 9.6, // 8 * 1.2 UGG
    cargaUggHa: 0.43,
    aforoKgM2: 2.9,
    porcentajeMS: 24,
    aforoKgMsHa: 6960,
    diasOcupacionActual: 2,
    diasOcupacionMax: 4,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 28,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.67,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#a16207',
    fillColor: 'rgba(161, 98, 7, 0.45)',
    polygonPoints: '540,285 745,285 735,475 540,475',
    center: { x: 642, y: 380 }
  },
  {
    id: 'eq-caball-1',
    codigo: 'CABALLERIZA-01',
    nombre: 'Caballeriza Principal & Boxes',
    especie: 'Equinos',
    sector: 'Caballerizas y Picadero',
    tipoInstalacion: 'caballeriza',
    areaHa: 1.2,
    perimetroM: 240,
    especieForrajera: 'Boxes de Mampostería y Cama de Viruta',
    lote: 'Lote CABALLERIZA-01 (Caballos de Silla)',
    animales: 6,
    uggPresentes: 7.2, // 6 * 1.2 UGG
    cargaUggHa: 6.00,
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    diasOcupacionActual: 30,
    diasOcupacionMax: 365,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 7,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#854d0e',
    fillColor: 'rgba(133, 77, 14, 0.45)',
    polygonPoints: '760,285 840,285 840,370 760,370',
    center: { x: 800, y: 327 },
    sistemaAlojamiento: 'Boxes Ventilados 4x4m con Bebederos Automáticos',
    capacidadMaxima: 12
  },
  {
    id: 'eq-picadero',
    codigo: 'PICADERO',
    nombre: 'Picadero & Redondel de Doma',
    especie: 'Equinos',
    sector: 'Caballerizas y Picadero',
    tipoInstalacion: 'caballeriza',
    areaHa: 0.8,
    perimetroM: 180,
    especieForrajera: 'Pista Circular de Arena Lavada y Drenaje',
    lote: 'Lote PICADERO (Potros en Amansamiento)',
    animales: 4,
    uggPresentes: 4.8, // 4 * 1.2 UGG
    cargaUggHa: 6.00,
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    diasOcupacionActual: 10,
    diasOcupacionMax: 60,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 7,
    eficienciaAprovechamiento: 90,
    ndviValue: 0.28,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#ca8a04',
    fillColor: 'rgba(202, 138, 4, 0.45)',
    polygonPoints: '760,385 840,385 840,470 760,470',
    center: { x: 800, y: 427 },
    sistemaAlojamiento: 'Redondel de Varas de Madera & Pista de Arena',
    capacidadMaxima: 6
  },

  // =========================================================================
  // 5. SECTOR PORCINO (MATERNIDAD, GESTACIÓN Y CEBA)
  // =========================================================================
  {
    id: 'porc-coch-par',
    codigo: 'COCH-PAR',
    nombre: 'Cochinera - Maternidad & Partos',
    especie: 'Porcinos',
    sector: 'Complejo Porcino',
    tipoInstalacion: 'cochinera',
    areaHa: 1.0,
    perimetroM: 190,
    especieForrajera: 'Jaulas Parideras con Piso Slat Plástico',
    lote: 'Lote COCH-PAR (Cerdas en Lactancia)',
    animales: 15,
    uggPresentes: 4.5, // 15 * 0.3 UGG
    cargaUggHa: 4.50,
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    diasOcupacionActual: 21,
    diasOcupacionMax: 28,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 7,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.32,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#e11d48',
    fillColor: 'rgba(225, 29, 72, 0.45)',
    polygonPoints: '540,500 630,500 630,585 540,585',
    center: { x: 585, y: 542 },
    sistemaAlojamiento: 'Maternidad Climatizada & Lámparas Infrarrojas',
    capacidadMaxima: 20
  },
  {
    id: 'porc-coch-gest',
    codigo: 'COCH-GEST',
    nombre: 'Cochinera - Gestación Confirmada',
    especie: 'Porcinos',
    sector: 'Complejo Porcino',
    tipoInstalacion: 'cochinera',
    areaHa: 1.2,
    perimetroM: 210,
    especieForrajera: 'Boxes Individuales y Corrales Dinámicos',
    lote: 'Lote COCH-GEST (Cerdas Gestantes)',
    animales: 12,
    uggPresentes: 3.6, // 12 * 0.3 UGG
    cargaUggHa: 3.00,
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    diasOcupacionActual: 85,
    diasOcupacionMax: 114,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 10,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.32,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#be185d',
    fillColor: 'rgba(190, 24, 93, 0.45)',
    polygonPoints: '645,500 735,500 735,585 645,585',
    center: { x: 690, y: 542 },
    sistemaAlojamiento: 'Boxes Semilibres con Alimentación Dosificada',
    capacidadMaxima: 16
  },
  {
    id: 'porc-galp-eng1',
    codigo: 'GALP-ENG1',
    nombre: 'Galpón Porcino - Ceba 1',
    especie: 'Porcinos',
    sector: 'Complejo Porcino',
    tipoInstalacion: 'cochinera',
    areaHa: 1.5,
    perimetroM: 240,
    especieForrajera: 'Pisos de Concreto Ranurado y Tolvas Seco/Húmedo',
    lote: 'Lote GALP-ENG1 (Cerdos de Ceba)',
    animales: 24,
    uggPresentes: 7.2, // 24 * 0.3 UGG
    cargaUggHa: 4.80,
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    diasOcupacionActual: 60,
    diasOcupacionMax: 105,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 10,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.32,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#9f1239',
    fillColor: 'rgba(159, 18, 57, 0.45)',
    polygonPoints: '540,600 630,600 630,685 540,685',
    center: { x: 585, y: 642 },
    sistemaAlojamiento: 'Corrales de Ceba con Chupetes Nipple',
    capacidadMaxima: 30
  },

  // =========================================================================
  // 6. SECTOR CAPRINO (APRISCO ELEVADO, LEVANTE Y PIQUETE)
  // =========================================================================
  {
    id: 'cap-apr-ord',
    codigo: 'APR-ORD',
    nombre: 'Aprisco Central & Ordeño Caprino',
    especie: 'Caprinos',
    sector: 'Aprisco Caprino',
    tipoInstalacion: 'aprisco',
    areaHa: 1.1,
    perimetroM: 195,
    especieForrajera: 'Tarima Ranurada Elevada y Sala de Ordeño',
    lote: 'Lote APR-ORD (Cabras Lecheras Ordeño)',
    animales: 32,
    uggPresentes: 4.8, // 32 * 0.15 UGG
    cargaUggHa: 4.36,
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    diasOcupacionActual: 90,
    diasOcupacionMax: 300,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 15,
    eficienciaAprovechamiento: 90,
    ndviValue: 0.38,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#7c3aed',
    fillColor: 'rgba(124, 58, 237, 0.45)',
    polygonPoints: '755,500 840,500 840,585 755,585',
    center: { x: 797, y: 542 },
    sistemaAlojamiento: 'Tarima de Madera Ranurada a 1.2m de Altura',
    capacidadMaxima: 40
  },
  {
    id: 'cap-apr-lev',
    codigo: 'APR-LEV',
    nombre: 'Aprisco Levante & Cabaña Caprina',
    especie: 'Caprinos',
    sector: 'Aprisco Caprino',
    tipoInstalacion: 'aprisco',
    areaHa: 0.9,
    perimetroM: 180,
    especieForrajera: 'Cabaña Elevada con Salitrocheras y Heno',
    lote: 'Lote APR-LEV (Cabritonas y Cabritos)',
    animales: 20,
    uggPresentes: 3.0, // 20 * 0.15 UGG
    cargaUggHa: 3.33,
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    diasOcupacionActual: 45,
    diasOcupacionMax: 120,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 15,
    eficienciaAprovechamiento: 90,
    ndviValue: 0.38,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#6d28d9',
    fillColor: 'rgba(109, 40, 217, 0.45)',
    polygonPoints: '755,600 840,600 840,685 755,685',
    center: { x: 797, y: 642 },
    sistemaAlojamiento: 'Cabaña Elevada con Zona de Sol y Heno',
    capacidadMaxima: 25
  },
  {
    id: 'cap-piq-chivos',
    codigo: 'PIQ-CHIVOS',
    nombre: 'Piquete Silvopastoril Caprino',
    especie: 'Caprinos',
    sector: 'Aprisco Caprino',
    tipoInstalacion: 'potrero',
    areaHa: 3.5,
    perimetroM: 480,
    especieForrajera: 'Leucaena leucocephala + Pasto Estrella',
    lote: 'Lote PIQ-CHIVOS (Ramoneo y Chivos)',
    animales: 14,
    uggPresentes: 2.1, // 14 * 0.15 UGG
    cargaUggHa: 0.60,
    aforoKgM2: 2.4,
    porcentajeMS: 26,
    aforoKgMsHa: 6240,
    diasOcupacionActual: 1,
    diasOcupacionMax: 3,
    diasDescansoActual: 0,
    diasDescansoRequeridos: 25,
    eficienciaAprovechamiento: 80,
    ndviValue: 0.65,
    estatus: 'Activo',
    prvStatus: 'pastoreo',
    color: '#8b5cf6',
    fillColor: 'rgba(139, 92, 246, 0.40)',
    polygonPoints: '855,500 930,500 930,685 855,685',
    center: { x: 892, y: 592 },
    sistemaAlojamiento: 'Cerca Malla Ciclónica y Banco Forrajero de Proteína'
  }
];

export const GIS_POINTS_OF_INTEREST: GisPointOfInterest[] = [
  { id: 'poi-1', nombre: 'Vaquera & Sala de Ordeño Bovino', tipo: 'vaquera', x: 215, y: 260, detalle: 'Ordeño mecánico 2x, capacidad 12 plazas' },
  { id: 'poi-2', nombre: 'Tanque Australiano & Molino Solar', tipo: 'tanque', x: 440, y: 270, detalle: 'Capacidad 120,000 L con acueducto por gravedad' },
  { id: 'poi-3', nombre: 'Laguna Central & Bajíos Bufalinos', tipo: 'laguna', x: 215, y: 490, detalle: 'Espejo de agua natural para termorregulación de búfalos' },
  { id: 'poi-4', nombre: 'Manga de Manejo y Báscula Tru-Test', tipo: 'manga', x: 535, y: 485, detalle: 'Báscula electrónica y manga techada de 18m' },
  { id: 'poi-5', nombre: 'Silos de Forraje & Fábrica de Alimento', tipo: 'silo', x: 650, y: 270, detalle: 'Reserva de ensilaje de maíz y planta de alimento' },
  { id: 'poi-6', nombre: 'Túnel de Bioseguridad & Silos Aves', tipo: 'silo', x: 848, y: 110, detalle: 'Tolvas de alimento a granel y desinfección' },
  { id: 'poi-7', nombre: 'Biodigestor & Fosa de Purines Porcinos', tipo: 'tanque', x: 638, y: 640, detalle: 'Tratamiento ecológico de efluentes y biogás' },
  { id: 'poi-8', nombre: 'Quesería Artesanal & Sala Ordeño Caprino', tipo: 'vaquera', x: 797, y: 590, detalle: 'Planta de queso de cabra madurado y yogur' }
];
