import { EstatusPotrero } from '../../types2/common';
import { PrvStatus } from './prvUtils';

export interface PotreroItem {
  codigo: string;
  descripcion: string;
  areaHa: number;
  perimetroM: number;
  especieForrajera: string;
  aforoKgM2: number;
  porcentajeMS: number;
  aforoKgMsHa: number;
  cargaRecomendadaUggHa: number;
  diasOcupacionMax: number;
  diasOcupacionActual: number;
  diasDescansoRequeridos: number;
  diasDescansoActual: number;
  estatus: EstatusPotrero;
  loteAsignado?: string;
  animalesPresentes: number;
  uggPresentes: number;
  cargaActualUggHa: number;
  eficienciaAprovechamiento: number;
  ndviValue: number;
  prvStatus?: PrvStatus;
}

export const POTREROS_MOCK_DATA: PotreroItem[] = [
  {
    codigo: 'POT1',
    descripcion: 'Potrero de la Casa',
    areaHa: 45.5,
    perimetroM: 2850,
    especieForrajera: 'Brachiaria decumbens',
    aforoKgM2: 2.8,
    porcentajeMS: 22,
    aforoKgMsHa: 6160,
    cargaRecomendadaUggHa: 1.5,
    diasOcupacionMax: 3,
    diasOcupacionActual: 2,
    diasDescansoRequeridos: 28,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '01 - Lote 01 (Ordeño)',
    animalesPresentes: 28,
    uggPresentes: 23.8,
    cargaActualUggHa: 1.35,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.68,
    prvStatus: 'pastoreo'
  },
  {
    codigo: 'POT2',
    descripcion: 'Potrero del Tanque',
    areaHa: 38.0,
    perimetroM: 2520,
    especieForrajera: 'Panicum maximum (Mombaza)',
    aforoKgM2: 3.4,
    porcentajeMS: 20,
    aforoKgMsHa: 6800,
    cargaRecomendadaUggHa: 1.8,
    diasOcupacionMax: 3,
    diasOcupacionActual: 4,
    diasDescansoRequeridos: 30,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '02 - Novillas de Reemplazo',
    animalesPresentes: 22,
    uggPresentes: 18.7,
    cargaActualUggHa: 1.28,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.42,
    prvStatus: 'sobrepastoreo'
  },
  {
    codigo: 'POT3',
    descripcion: 'Potrero El Mango',
    areaHa: 52.0,
    perimetroM: 3200,
    especieForrajera: 'Brachiaria brizantha (Marandú)',
    aforoKgM2: 3.1,
    porcentajeMS: 22,
    aforoKgMsHa: 6820,
    cargaRecomendadaUggHa: 1.6,
    diasOcupacionMax: 3,
    diasOcupacionActual: 0,
    diasDescansoRequeridos: 35,
    diasDescansoActual: 36,
    estatus: 'En descanso',
    loteAsignado: undefined,
    animalesPresentes: 0,
    uggPresentes: 0,
    cargaActualUggHa: 0.0,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.82,
    prvStatus: 'optimo'
  },
  {
    codigo: 'POT4',
    descripcion: 'Potrero La Represa',
    areaHa: 64.2,
    perimetroM: 3800,
    especieForrajera: 'Brachiaria humidicola',
    aforoKgM2: 2.5,
    porcentajeMS: 22,
    aforoKgMsHa: 5500,
    cargaRecomendadaUggHa: 1.2,
    diasOcupacionMax: 3,
    diasOcupacionActual: 1,
    diasDescansoRequeridos: 32,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '03 - Vacas Secas y Transición',
    animalesPresentes: 19,
    uggPresentes: 17.1,
    cargaActualUggHa: 0.89,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.58,
    prvStatus: 'pastoreo'
  },
  {
    codigo: 'POT5',
    descripcion: 'Potrero El Jobo',
    areaHa: 41.8,
    perimetroM: 2650,
    especieForrajera: 'Cynodon nlemfuensis (Estrella)',
    aforoKgM2: 3.0,
    porcentajeMS: 24,
    aforoKgMsHa: 7200,
    cargaRecomendadaUggHa: 1.7,
    diasOcupacionMax: 3,
    diasOcupacionActual: 0,
    diasDescansoRequeridos: 25,
    diasDescansoActual: 14,
    estatus: 'En descanso',
    loteAsignado: undefined,
    animalesPresentes: 0,
    uggPresentes: 0,
    cargaActualUggHa: 0.0,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.51,
    prvStatus: 'descanso'
  },
  {
    codigo: 'POT6',
    descripcion: 'Potrero Los Samanes',
    areaHa: 58.5,
    perimetroM: 3400,
    especieForrajera: 'Panicum maximum (Tanzania)',
    aforoKgM2: 3.6,
    porcentajeMS: 20,
    aforoKgMsHa: 7200,
    cargaRecomendadaUggHa: 2.0,
    diasOcupacionMax: 3,
    diasOcupacionActual: 0,
    diasDescansoRequeridos: 30,
    diasDescansoActual: 38,
    estatus: 'En descanso',
    loteAsignado: undefined,
    animalesPresentes: 0,
    uggPresentes: 0,
    cargaActualUggHa: 0.0,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.79,
    prvStatus: 'optimo'
  },
  {
    codigo: 'POT7',
    descripcion: 'Potrero Vega del Río',
    areaHa: 72.0,
    perimetroM: 4200,
    especieForrajera: 'Echinochloa polystachya (Alemán)',
    aforoKgM2: 4.2,
    porcentajeMS: 18,
    aforoKgMsHa: 7560,
    cargaRecomendadaUggHa: 2.2,
    diasOcupacionMax: 3,
    diasOcupacionActual: 0,
    diasDescansoRequeridos: 40,
    diasDescansoActual: 12,
    estatus: 'En mantenimiento',
    loteAsignado: undefined,
    animalesPresentes: 0,
    uggPresentes: 0,
    cargaActualUggHa: 0.0,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.38,
    prvStatus: 'descanso'
  },
  {
    codigo: 'POT8',
    descripcion: 'Potrero Maternidad',
    areaHa: 18.0,
    perimetroM: 1750,
    especieForrajera: 'Brachiaria decumbens',
    aforoKgM2: 3.2,
    porcentajeMS: 22,
    aforoKgMsHa: 7040,
    cargaRecomendadaUggHa: 1.5,
    diasOcupacionMax: 3,
    diasOcupacionActual: 2,
    diasDescansoRequeridos: 21,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '05 - Maternidad y Partos',
    animalesPresentes: 6,
    uggPresentes: 5.4,
    cargaActualUggHa: 0.67,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.65,
    prvStatus: 'pastoreo'
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
