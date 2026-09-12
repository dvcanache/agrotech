import { EstatusPotrero } from '../../types2/common';

export interface PotreroItem {
  codigo: string;
  descripcion: string;
  areaHa: number;
  perimetroM: number;
  especieForrajera: string;
  aforoKgM2: number;
  cargaRecomendadaUggHa: number;
  diasOcupacionMax: number;
  diasOcupacionActual: number;
  diasDescansoRequeridos: number;
  diasDescansoActual: number;
  estatus: EstatusPotrero;
  loteAsignado?: string;
  animalesPresentes: number;
  cargaActualUggHa: number;
}

export const POTREROS_MOCK_DATA: PotreroItem[] = [
  {
    codigo: 'POT1',
    descripcion: 'Potrero de la Casa',
    areaHa: 45.5,
    perimetroM: 2850,
    especieForrajera: 'Brachiaria decumbens',
    aforoKgM2: 2.8,
    cargaRecomendadaUggHa: 1.5,
    diasOcupacionMax: 5,
    diasOcupacionActual: 3,
    diasDescansoRequeridos: 28,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '01 - Lote 01 (Ordeño)',
    animalesPresentes: 28,
    cargaActualUggHa: 1.35
  },
  {
    codigo: 'POT2',
    descripcion: 'Potrero del Tanque',
    areaHa: 38.0,
    perimetroM: 2520,
    especieForrajera: 'Panicum maximum (Mombaza)',
    aforoKgM2: 3.4,
    cargaRecomendadaUggHa: 1.8,
    diasOcupacionMax: 4,
    diasOcupacionActual: 2,
    diasDescansoRequeridos: 30,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '02 - Novillas de Reemplazo',
    animalesPresentes: 22,
    cargaActualUggHa: 1.28
  },
  {
    codigo: 'POT3',
    descripcion: 'Potrero El Mango',
    areaHa: 52.0,
    perimetroM: 3200,
    especieForrajera: 'Brachiaria brizantha (Marandú)',
    aforoKgM2: 3.1,
    cargaRecomendadaUggHa: 1.6,
    diasOcupacionMax: 6,
    diasOcupacionActual: 0,
    diasDescansoRequeridos: 35,
    diasDescansoActual: 18,
    estatus: 'En descanso',
    loteAsignado: undefined,
    animalesPresentes: 0,
    cargaActualUggHa: 0.0
  },
  {
    codigo: 'POT4',
    descripcion: 'Potrero La Represa',
    areaHa: 64.2,
    perimetroM: 3800,
    especieForrajera: 'Brachiaria humidicola',
    aforoKgM2: 2.5,
    cargaRecomendadaUggHa: 1.2,
    diasOcupacionMax: 7,
    diasOcupacionActual: 4,
    diasDescansoRequeridos: 32,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '03 - Vacas Secas y Transición',
    animalesPresentes: 19,
    cargaActualUggHa: 0.89
  },
  {
    codigo: 'POT5',
    descripcion: 'Potrero El Jobo',
    areaHa: 41.8,
    perimetroM: 2650,
    especieForrajera: 'Cynodon nlemfuensis (Estrella)',
    aforoKgM2: 3.0,
    cargaRecomendadaUggHa: 1.7,
    diasOcupacionMax: 4,
    diasOcupacionActual: 0,
    diasDescansoRequeridos: 25,
    diasDescansoActual: 24,
    estatus: 'En descanso',
    loteAsignado: undefined,
    animalesPresentes: 0,
    cargaActualUggHa: 0.0
  },
  {
    codigo: 'POT6',
    descripcion: 'Potrero Los Samanes',
    areaHa: 58.5,
    perimetroM: 3400,
    especieForrajera: 'Panicum maximum (Tanzania)',
    aforoKgM2: 3.6,
    cargaRecomendadaUggHa: 2.0,
    diasOcupacionMax: 5,
    diasOcupacionActual: 1,
    diasDescansoRequeridos: 30,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '04 - Mautes y Becerros',
    animalesPresentes: 34,
    cargaActualUggHa: 1.45
  },
  {
    codigo: 'POT7',
    descripcion: 'Potrero Vega del Río',
    areaHa: 72.0,
    perimetroM: 4200,
    especieForrajera: 'Echinochloa polystachya (Alemán)',
    aforoKgM2: 4.2,
    cargaRecomendadaUggHa: 2.2,
    diasOcupacionMax: 7,
    diasOcupacionActual: 0,
    diasDescansoRequeridos: 40,
    diasDescansoActual: 0,
    estatus: 'En mantenimiento',
    loteAsignado: undefined,
    animalesPresentes: 0,
    cargaActualUggHa: 0.0
  },
  {
    codigo: 'POT8',
    descripcion: 'Potrero Maternidad',
    areaHa: 18.0,
    perimetroM: 1750,
    especieForrajera: 'Brachiaria decumbens',
    aforoKgM2: 3.2,
    cargaRecomendadaUggHa: 1.5,
    diasOcupacionMax: 3,
    diasOcupacionActual: 2,
    diasDescansoRequeridos: 21,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '05 - Maternidad y Partos',
    animalesPresentes: 6,
    cargaActualUggHa: 0.67
  }
];

export const PASTURE_SPECIES_OPTIONS = [
  'Brachiaria decumbens',
  'Brachiaria brizantha (Marandú)',
  'Brachiaria humidicola',
  'Panicum maximum (Mombaza)',
  'Panicum maximum (Tanzania)',
  'Cynodon nlemfuensis (Estrella)',
  'Echinochloa polystachya (Alemán)',
  'Pennisetum purpureum (Elefante / Cuba 22)'
];
