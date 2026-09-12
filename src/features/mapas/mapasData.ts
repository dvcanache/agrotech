export interface GisPaddock {
  id: string;
  codigo: string;
  nombre: string;
  areaHa: number;
  perimetroM: number;
  especieForrajera: string;
  lote: string;
  animales: number;
  cargaUggHa: number;
  estatus: 'Activo' | 'En descanso' | 'En mantenimiento';
  color: string;
  fillColor: string;
  // Relative SVG polygon points [x, y] in a 1000x700 coordinate box
  polygonPoints: string;
  center: { x: number; y: number };
}

export interface GisPointOfInterest {
  id: string;
  nombre: string;
  tipo: 'vaquera' | 'silo' | 'tanque' | 'manga' | 'laguna';
  x: number;
  y: number;
}

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
    cargaUggHa: 1.35,
    estatus: 'Activo',
    color: '#2d6a4f',
    fillColor: 'rgba(45, 106, 79, 0.45)',
    polygonPoints: '120,80 340,90 330,280 110,270',
    center: { x: 225, y: 180 }
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
    cargaUggHa: 1.28,
    estatus: 'Activo',
    color: '#386a20',
    fillColor: 'rgba(56, 106, 32, 0.45)',
    polygonPoints: '350,90 580,100 560,290 340,280',
    center: { x: 455, y: 190 }
  },
  {
    id: 'pot-3',
    codigo: 'POT3',
    nombre: 'Potrero El Mango',
    areaHa: 52.0,
    perimetroM: 3200,
    especieForrajera: 'Brachiaria brizantha',
    lote: 'Sin Lote (En descanso)',
    animales: 0,
    cargaUggHa: 0.0,
    estatus: 'En descanso',
    color: '#d4a373',
    fillColor: 'rgba(212, 163, 115, 0.35)',
    polygonPoints: '590,100 840,110 820,310 570,295',
    center: { x: 705, y: 200 }
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
    cargaUggHa: 0.89,
    estatus: 'Activo',
    color: '#1b4332',
    fillColor: 'rgba(27, 67, 50, 0.45)',
    polygonPoints: '110,280 330,290 320,520 90,500',
    center: { x: 210, y: 400 }
  },
  {
    id: 'pot-5',
    codigo: 'POT5',
    nombre: 'Potrero El Jobo',
    areaHa: 41.8,
    perimetroM: 2650,
    especieForrajera: 'Cynodon nlemfuensis (Estrella)',
    lote: 'Sin Lote (En descanso)',
    animales: 0,
    cargaUggHa: 0.0,
    estatus: 'En descanso',
    color: '#cca000',
    fillColor: 'rgba(204, 160, 0, 0.35)',
    polygonPoints: '340,295 560,305 540,530 330,525',
    center: { x: 440, y: 410 }
  },
  {
    id: 'pot-6',
    codigo: 'POT6',
    nombre: 'Potrero Los Samanes',
    areaHa: 58.5,
    perimetroM: 3400,
    especieForrajera: 'Panicum maximum (Tanzania)',
    lote: 'Lote 04 (Mautes)',
    animales: 34,
    cargaUggHa: 1.45,
    estatus: 'Activo',
    color: '#2d6a4f',
    fillColor: 'rgba(45, 106, 79, 0.45)',
    polygonPoints: '570,310 820,325 800,550 550,535',
    center: { x: 685, y: 425 }
  },
  {
    id: 'pot-7',
    codigo: 'POT7',
    nombre: 'Potrero Vega del Río',
    areaHa: 72.0,
    perimetroM: 4200,
    especieForrajera: 'Echinochloa polystachya',
    lote: 'En Mantenimiento',
    animales: 0,
    cargaUggHa: 0.0,
    estatus: 'En mantenimiento',
    color: '#e76f51',
    fillColor: 'rgba(231, 111, 81, 0.35)',
    polygonPoints: '90,510 540,540 520,670 70,640',
    center: { x: 300, y: 590 }
  },
  {
    id: 'pot-8',
    codigo: 'POT8',
    nombre: 'Potrero Maternidad',
    areaHa: 18.0,
    perimetroM: 1750,
    especieForrajera: 'Brachiaria decumbens',
    lote: 'Lote 05 (Maternidad)',
    animales: 6,
    cargaUggHa: 0.67,
    estatus: 'Activo',
    color: '#52b788',
    fillColor: 'rgba(82, 183, 136, 0.45)',
    polygonPoints: '550,545 790,560 770,680 530,670',
    center: { x: 660, y: 615 }
  }
];

export const GIS_POINTS_OF_INTEREST: GisPointOfInterest[] = [
  { id: 'poi-1', nombre: 'Vaquera & Sala de Ordeño', tipo: 'vaquera', x: 230, y: 260 },
  { id: 'poi-2', nombre: 'Tanque Australiano & Molino', tipo: 'tanque', x: 450, y: 275 },
  { id: 'poi-3', nombre: 'Laguna & Abrevadero Central', tipo: 'laguna', x: 550, y: 310 },
  { id: 'poi-4', nombre: 'Manga de Manejo y Báscula', tipo: 'manga', x: 670, y: 410 },
  { id: 'poi-5', nombre: 'Silos de Forraje & Heno', tipo: 'silo', x: 250, y: 300 }
];
