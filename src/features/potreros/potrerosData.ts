import { EstatusPotrero } from '../../types2/common';
import { PrvStatus } from './prvUtils';
import { EspecieAnimal } from '../../types/animal';
import { TipoInstalacion } from '../mapas/mapasData';

export interface PotreroItem {
  codigo: string;
  descripcion: string;
  especie: EspecieAnimal;
  sector: string;
  tipoInstalacion: TipoInstalacion;
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
  capacidadMaxima?: number;
  sistemaAlojamiento?: string;
}

export const POTREROS_MOCK_DATA: PotreroItem[] = [
  // =========================================================================
  // 1. SECTOR BOVINOS (POTREROS TRADICIONALES 1 AL 5)
  // Factor: 1.0 UGG por bovino adulto
  // =========================================================================
  {
    codigo: 'POT1',
    descripcion: 'Potrero de la Casa',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
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
    uggPresentes: 28.0, // 28 * 1.0 UGG
    cargaActualUggHa: 0.62,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.68,
    prvStatus: 'pastoreo'
  },
  {
    codigo: 'POT2',
    descripcion: 'Potrero del Tanque',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
    areaHa: 38.0,
    perimetroM: 2520,
    especieForrajera: 'Panicum maximum (Mombaza)',
    aforoKgM2: 3.4,
    porcentajeMS: 20,
    aforoKgMsHa: 6800,
    cargaRecomendadaUggHa: 1.8,
    diasOcupacionMax: 3,
    diasOcupacionActual: 4, // Alerta sobrepastoreo
    diasDescansoRequeridos: 30,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: '02 - Novillas de Reemplazo',
    animalesPresentes: 22,
    uggPresentes: 22.0, // 22 * 1.0 UGG
    cargaActualUggHa: 0.58,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.42,
    prvStatus: 'sobrepastoreo'
  },
  {
    codigo: 'POT3',
    descripcion: 'Potrero El Mango',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
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
    diasDescansoActual: 36, // Punto óptimo
    estatus: 'En descanso',
    loteAsignado: undefined,
    animalesPresentes: 0,
    uggPresentes: 0.0,
    cargaActualUggHa: 0.0,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.82,
    prvStatus: 'optimo'
  },
  {
    codigo: 'POT4',
    descripcion: 'Potrero La Represa',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
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
    uggPresentes: 19.0, // 19 * 1.0 UGG
    cargaActualUggHa: 0.30,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.58,
    prvStatus: 'pastoreo'
  },
  {
    codigo: 'POT5',
    descripcion: 'Potrero El Jobo',
    especie: 'Bovinos',
    sector: 'Sector Bovinos',
    tipoInstalacion: 'potrero',
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
    uggPresentes: 0.0,
    cargaActualUggHa: 0.0,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.51,
    prvStatus: 'descanso'
  },

  // =========================================================================
  // 2. SECTOR BÚFALOS (SABANA BAJA Y BAJÍOS INUNDABLES)
  // Factor: 1.2 UGG por búfalo adulto
  // =========================================================================
  {
    codigo: 'SAB-BAJA',
    descripcion: 'Sabana Baja Inundable',
    especie: 'Búfalos',
    sector: 'Sector Búfalos',
    tipoInstalacion: 'sabana',
    areaHa: 68.0,
    perimetroM: 4100,
    especieForrajera: 'Echinochloa polystachya (Alemán) y Bajíos',
    aforoKgM2: 4.5,
    porcentajeMS: 19,
    aforoKgMsHa: 8550,
    cargaRecomendadaUggHa: 1.8,
    diasOcupacionMax: 4,
    diasOcupacionActual: 2,
    diasDescansoRequeridos: 35,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'BUF-01 - Búfalas de Ordeño Sabana',
    animalesPresentes: 20,
    uggPresentes: 24.0, // 20 * 1.2 UGG
    cargaActualUggHa: 0.35,
    eficienciaAprovechamiento: 80,
    ndviValue: 0.72,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Humedal natural y pastoreo de bajío'
  },
  {
    codigo: 'POT-BUF-REC',
    descripcion: 'Bajíos de Recuperación Bufalina',
    especie: 'Búfalos',
    sector: 'Sector Búfalos',
    tipoInstalacion: 'potrero',
    areaHa: 44.5,
    perimetroM: 2900,
    especieForrajera: 'Brachiaria humidicola (Humedal)',
    aforoKgM2: 3.8,
    porcentajeMS: 21,
    aforoKgMsHa: 7980,
    cargaRecomendadaUggHa: 1.6,
    diasOcupacionMax: 3,
    diasOcupacionActual: 1,
    diasDescansoRequeridos: 30,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'BUF-REC - Bubillas y Mautes Bufalinos',
    animalesPresentes: 15,
    uggPresentes: 18.0, // 15 * 1.2 UGG
    cargaActualUggHa: 0.40,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.64,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Potrero semi-inundable con cerca electrificada'
  },

  // =========================================================================
  // 3. SECTOR AVÍCOLA (GALPONES DE POSTURA, ENGORDE, GALLOS Y CRÍA)
  // Factor: 0.005 UGG por ave de corral (1 UGG = 200 aves)
  // =========================================================================
  {
    codigo: 'GALP-01',
    descripcion: 'Galpón 01 - Postura Comercial',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 1.5,
    perimetroM: 320,
    especieForrajera: 'Cama de Cascarilla de Arroz (Galpón Techado)',
    aforoKgM2: 0.0,
    porcentajeMS: 88,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 2.0,
    diasOcupacionMax: 365,
    diasOcupacionActual: 180,
    diasDescansoRequeridos: 15,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'GALP-01 - Lohmann Brown Postura',
    animalesPresentes: 400,
    uggPresentes: 2.0, // 400 * 0.005 UGG
    cargaActualUggHa: 1.33,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Jaulas Piramidales & Túnel de Viento',
    capacidadMaxima: 500
  },
  {
    codigo: 'GALP-03',
    descripcion: 'Galpón 03 - Pollos de Engorde',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 1.8,
    perimetroM: 360,
    especieForrajera: 'Ambiente Controlado / Nebulización',
    aforoKgM2: 0.0,
    porcentajeMS: 88,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 2.5,
    diasOcupacionMax: 45,
    diasOcupacionActual: 32,
    diasDescansoRequeridos: 14,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'GALP-03 - Cobb 500 Engorde',
    animalesPresentes: 500,
    uggPresentes: 2.5, // 500 * 0.005 UGG
    cargaActualUggHa: 1.39,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Piso con Cascarilla & Comederos Automáticos',
    capacidadMaxima: 600
  },
  {
    codigo: 'CAS-ELITE',
    descripcion: 'Casilleros Gallos Finos Élite',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 0.6,
    perimetroM: 180,
    especieForrajera: 'Voladeros Individuales y Ruedo de Pasto',
    aforoKgM2: 1.2,
    porcentajeMS: 25,
    aforoKgMsHa: 3000,
    cargaRecomendadaUggHa: 0.5,
    diasOcupacionMax: 90,
    diasOcupacionActual: 15,
    diasDescansoRequeridos: 10,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'CAS-ELITE - Gallos de Combate',
    animalesPresentes: 40,
    uggPresentes: 0.2, // 40 * 0.005 UGG
    cargaActualUggHa: 0.33,
    eficienciaAprovechamiento: 85,
    ndviValue: 0.55,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Casilleros Individuales Acondicionados',
    capacidadMaxima: 50
  },
  {
    codigo: 'CRIAD-01',
    descripcion: 'Criadora y Galpón de Pollitas',
    especie: 'Aves de corral',
    sector: 'Sector Avícola',
    tipoInstalacion: 'galpon',
    areaHa: 0.8,
    perimetroM: 210,
    especieForrajera: 'Maternidad Avícola con Campanas Criadoras',
    aforoKgM2: 0.0,
    porcentajeMS: 88,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 2.0,
    diasOcupacionMax: 40,
    diasOcupacionActual: 18,
    diasDescansoRequeridos: 12,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'CRIAD-01 - Pollitas en Crecimiento',
    animalesPresentes: 300,
    uggPresentes: 1.5, // 300 * 0.005 UGG
    cargaActualUggHa: 1.88,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Campanas Radiantes a Gas & Termóstatos',
    capacidadMaxima: 350
  },

  // =========================================================================
  // 4. SECTOR EQUINOS (POTRERO, CABALLERIZAS Y PICADERO)
  // Factor: 1.2 UGG por equino adulto
  // =========================================================================
  {
    codigo: 'POT-CABALL',
    descripcion: 'Potrero de Pastoreo Equino',
    especie: 'Equinos',
    sector: 'Caballerizas y Picadero',
    tipoInstalacion: 'potrero',
    areaHa: 22.5,
    perimetroM: 1950,
    especieForrajera: 'Cynodon dactylon (Bermuda / Tifton)',
    aforoKgM2: 2.9,
    porcentajeMS: 24,
    aforoKgMsHa: 6960,
    cargaRecomendadaUggHa: 1.0,
    diasOcupacionMax: 4,
    diasOcupacionActual: 2,
    diasDescansoRequeridos: 28,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'EQ-01 - Yeguas de Cría',
    animalesPresentes: 8,
    uggPresentes: 9.6, // 8 * 1.2 UGG
    cargaActualUggHa: 0.43,
    eficienciaAprovechamiento: 75,
    ndviValue: 0.67,
    prvStatus: 'pastoreo'
  },
  {
    codigo: 'CABALLERIZA-01',
    descripcion: 'Caballeriza Principal & Boxes',
    especie: 'Equinos',
    sector: 'Caballerizas y Picadero',
    tipoInstalacion: 'caballeriza',
    areaHa: 1.2,
    perimetroM: 240,
    especieForrajera: 'Boxes de Mampostería y Cama de Viruta',
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 8.0,
    diasOcupacionMax: 365,
    diasOcupacionActual: 30,
    diasDescansoRequeridos: 7,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'CABALL-01 - Caballos de Silla y Trabajo',
    animalesPresentes: 6,
    uggPresentes: 7.2, // 6 * 1.2 UGG
    cargaActualUggHa: 6.00,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.35,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Boxes Ventilados 4x4m con Bebederos Automáticos',
    capacidadMaxima: 12
  },
  {
    codigo: 'PICADERO',
    descripcion: 'Picadero & Redondel de Doma',
    especie: 'Equinos',
    sector: 'Caballerizas y Picadero',
    tipoInstalacion: 'caballeriza',
    areaHa: 0.8,
    perimetroM: 180,
    especieForrajera: 'Pista Circular de Arena Lavada y Drenaje',
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 6.0,
    diasOcupacionMax: 60,
    diasOcupacionActual: 10,
    diasDescansoRequeridos: 7,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'PICADERO - Potros en Amansamiento',
    animalesPresentes: 4,
    uggPresentes: 4.8, // 4 * 1.2 UGG
    cargaActualUggHa: 6.00,
    eficienciaAprovechamiento: 90,
    ndviValue: 0.28,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Redondel de Varas de Madera & Pista de Arena',
    capacidadMaxima: 6
  },

  // =========================================================================
  // 5. SECTOR PORCINO (MATERNIDAD, GESTACIÓN Y CEBA)
  // Factor: 0.3 UGG por cerdo adulto / reproductor
  // =========================================================================
  {
    codigo: 'COCH-PAR',
    descripcion: 'Cochinera - Maternidad & Partos',
    especie: 'Porcinos',
    sector: 'Complejo Porcino',
    tipoInstalacion: 'cochinera',
    areaHa: 1.0,
    perimetroM: 190,
    especieForrajera: 'Jaulas Parideras con Piso Slat Plástico',
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 6.0,
    diasOcupacionMax: 28,
    diasOcupacionActual: 21,
    diasDescansoRequeridos: 7,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'COCH-PAR - Cerdas en Lactancia',
    animalesPresentes: 15,
    uggPresentes: 4.5, // 15 * 0.3 UGG
    cargaActualUggHa: 4.50,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.32,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Maternidad Climatizada & Lámparas Infrarrojas',
    capacidadMaxima: 20
  },
  {
    codigo: 'COCH-GEST',
    descripcion: 'Cochinera - Gestación Confirmada',
    especie: 'Porcinos',
    sector: 'Complejo Porcino',
    tipoInstalacion: 'cochinera',
    areaHa: 1.2,
    perimetroM: 210,
    especieForrajera: 'Boxes Individuales y Corrales Dinámicos',
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 5.0,
    diasOcupacionMax: 114,
    diasOcupacionActual: 85,
    diasDescansoRequeridos: 10,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'COCH-GEST - Cerdas Gestantes',
    animalesPresentes: 12,
    uggPresentes: 3.6, // 12 * 0.3 UGG
    cargaActualUggHa: 3.00,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.32,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Boxes Semilibres con Alimentación Dosificada',
    capacidadMaxima: 16
  },
  {
    codigo: 'GALP-ENG1',
    descripcion: 'Galpón Porcino - Ceba 1',
    especie: 'Porcinos',
    sector: 'Complejo Porcino',
    tipoInstalacion: 'cochinera',
    areaHa: 1.5,
    perimetroM: 240,
    especieForrajera: 'Pisos de Concreto Ranurado y Tolvas Seco/Húmedo',
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 6.0,
    diasOcupacionMax: 105,
    diasOcupacionActual: 60,
    diasDescansoRequeridos: 10,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'GALP-ENG1 - Cerdos de Ceba',
    animalesPresentes: 24,
    uggPresentes: 7.2, // 24 * 0.3 UGG
    cargaActualUggHa: 4.80,
    eficienciaAprovechamiento: 95,
    ndviValue: 0.32,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Corrales de Ceba con Chupetes Nipple',
    capacidadMaxima: 30
  },

  // =========================================================================
  // 6. SECTOR CAPRINO (APRISCO ELEVADO, LEVANTE Y PIQUETE)
  // Factor: 0.15 UGG por caprino adulto (1 UGG = 6.67 cabras)
  // =========================================================================
  {
    codigo: 'APR-ORD',
    descripcion: 'Aprisco Central & Ordeño Caprino',
    especie: 'Caprinos',
    sector: 'Aprisco Caprino',
    tipoInstalacion: 'aprisco',
    areaHa: 1.1,
    perimetroM: 195,
    especieForrajera: 'Tarima Ranurada Elevada y Sala de Ordeño',
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 5.0,
    diasOcupacionMax: 300,
    diasOcupacionActual: 90,
    diasDescansoRequeridos: 15,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'APR-ORD - Cabras Lecheras Ordeño',
    animalesPresentes: 32,
    uggPresentes: 4.8, // 32 * 0.15 UGG
    cargaActualUggHa: 4.36,
    eficienciaAprovechamiento: 90,
    ndviValue: 0.38,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Tarima de Madera Ranurada a 1.2m de Altura',
    capacidadMaxima: 40
  },
  {
    codigo: 'APR-LEV',
    descripcion: 'Aprisco Levante & Cabaña Caprina',
    especie: 'Caprinos',
    sector: 'Aprisco Caprino',
    tipoInstalacion: 'aprisco',
    areaHa: 0.9,
    perimetroM: 180,
    especieForrajera: 'Cabaña Elevada con Salitrocheras y Heno',
    aforoKgM2: 0.0,
    porcentajeMS: 90,
    aforoKgMsHa: 0,
    cargaRecomendadaUggHa: 4.0,
    diasOcupacionMax: 120,
    diasOcupacionActual: 45,
    diasDescansoRequeridos: 15,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'APR-LEV - Cabritonas y Cabritos',
    animalesPresentes: 20,
    uggPresentes: 3.0, // 20 * 0.15 UGG
    cargaActualUggHa: 3.33,
    eficienciaAprovechamiento: 90,
    ndviValue: 0.38,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Cabaña Elevada con Zona de Sol y Heno',
    capacidadMaxima: 25
  },
  {
    codigo: 'PIQ-CHIVOS',
    descripcion: 'Piquete Silvopastoril Caprino',
    especie: 'Caprinos',
    sector: 'Aprisco Caprino',
    tipoInstalacion: 'potrero',
    areaHa: 3.5,
    perimetroM: 480,
    especieForrajera: 'Leucaena leucocephala + Pasto Estrella',
    aforoKgM2: 2.4,
    porcentajeMS: 26,
    aforoKgMsHa: 6240,
    cargaRecomendadaUggHa: 1.0,
    diasOcupacionMax: 3,
    diasOcupacionActual: 1,
    diasDescansoRequeridos: 25,
    diasDescansoActual: 0,
    estatus: 'Activo',
    loteAsignado: 'PIQ-CHIVOS - Ramoneo y Chivos',
    animalesPresentes: 14,
    uggPresentes: 2.1, // 14 * 0.15 UGG
    cargaActualUggHa: 0.60,
    eficienciaAprovechamiento: 80,
    ndviValue: 0.65,
    prvStatus: 'pastoreo',
    sistemaAlojamiento: 'Cerca Malla Ciclónica y Banco Forrajero de Proteína'
  }
];

export const PASTURE_SPECIES_OPTIONS = [
  'Brachiaria decumbens',
  'Brachiaria brizantha (Marandú)',
  'Brachiaria humidicola',
  'Panicum maximum (Mombaza)',
  'Panicum maximum (Tanzania)',
  'Cynodon nlemfuensis (Estrella)',
  'Cynodon dactylon (Bermuda / Tifton)',
  'Echinochloa polystachya (Alemán)',
  'Pennisetum purpureum (Elefante / Cuba 22)',
  'Leucaena leucocephala + Pasto',
  'Cama de Cascarilla de Arroz (Galpón Techado)',
  'Jaulas Parideras con Piso Slat Plástico',
  'Tarima Ranurada Elevada de Madera',
  'Boxes de Mampostería y Cama de Viruta'
];
