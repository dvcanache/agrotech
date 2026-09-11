import {
  ResumenInventarioLote,
  MovimientoEntity,
  TecnicoEntity,
  ReproductorEntity
} from '../../../types2/entities';

/* =========================================================================
 * 1. DATOS DE INVENTARIOS
 * ========================================================================= */

export const MOCK_INVENTARIO_LOTES: ResumenInventarioLote[] = [
  {
    loteCodigo: 'ESCT',
    loteNombre: 'ESCT - Escotero',
    becerras: 2,
    mautas: 5,
    novillas: 3,
    vacas: 11,
    becerros: 3,
    mautes: 3,
    novillos: 0,
    toros: 1,
    total: 28
  },
  {
    loteCodigo: 'POT1',
    loteNombre: 'POT1 - Potrero 1',
    becerras: 6,
    mautas: 0,
    novillas: 0,
    vacas: 0,
    becerros: 4,
    mautes: 0,
    novillos: 0,
    toros: 1,
    total: 11
  },
  {
    loteCodigo: 'SEC1',
    loteNombre: 'SEC1 - Secas 1',
    becerras: 0,
    mautas: 0,
    novillas: 0,
    vacas: 4,
    becerros: 0,
    mautes: 0,
    novillos: 0,
    toros: 0,
    total: 4
  },
  {
    loteCodigo: '01',
    loteNombre: '01 - Lote 01',
    becerras: 0,
    mautas: 0,
    novillas: 0,
    vacas: 2,
    becerros: 0,
    mautes: 0,
    novillos: 0,
    toros: 0,
    total: 2
  }
];

export const MOCK_INVENTARIO_CATEGORIA_CHART = {
  labels: ['Becerra', 'Mauta', 'Novilla', 'Vaca', 'Becerro', 'Maute', 'Toro'],
  data: [8, 5, 3, 17, 7, 3, 2], // Sum = 45
  colors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc']
};

export const MOCK_INVENTARIO_LOCACION_CHART = {
  labels: ['01', 'SEC1', 'POT1', 'ESCT'],
  data: [2, 4, 11, 28], // 4.4%, 8.9%, 24.4%, 62.2% -> Sum = 45
  colors: ['#2d6a4f', '#52b788', '#74c69d', '#b7e4c7']
};

export const MOCK_INVENTARIO_ESTATUS_CHART = {
  labels: ['Activo'],
  data: [45],
  colors: ['#2d6a4f']
};

/* =========================================================================
 * 2. DATOS DE MOVIMIENTOS
 * ========================================================================= */

export const MOCK_MOVIMIENTOS: MovimientoEntity[] = [
  {
    fecha: '2026-09-08',
    tipo: 'Cambio de Lote',
    practico: '0001',
    unico: '0001',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Vaca',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Vaca',
    tecnico: 'JHON JAIRO RESTREPO',
    estatusActual: 'Activo',
    categoriaActual: 'Vaca',
    loteActual: '01',
    comentario: 'Traslado por inicio de protocolo de ordeño matutino'
  },
  {
    fecha: '2026-09-05',
    tipo: 'Cambio de Lote',
    practico: 'CW002',
    unico: 'CW002',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Vaca',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Vaca',
    tecnico: 'ALEJANDRA DURAN',
    estatusActual: 'Activo',
    categoriaActual: 'Vaca',
    loteActual: 'ESCT',
    comentario: 'Movimiento a lote escotero tras diagnóstico reproductivo'
  },
  {
    fecha: '2026-08-28',
    tipo: 'Cambio de Categoría',
    practico: 'CW004',
    unico: 'CW004',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Mauta',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Novilla',
    tecnico: 'TULIO HERNANDEZ',
    estatusActual: 'Activo',
    categoriaActual: 'Novilla',
    loteActual: 'ESCT',
    comentario: 'Alcanzó peso y desarrollo óptimo para servicio (>320 kg)'
  },
  {
    fecha: '2026-08-20',
    tipo: 'Cambio de Lote',
    practico: 'CW003',
    unico: 'CW003',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Vaca',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Vaca',
    tecnico: 'AUGUSTO RODRIGUEZ',
    estatusActual: 'Activo',
    categoriaActual: 'Vaca',
    loteActual: 'SEC1',
    comentario: 'Secado programado a 60 días del parto previsto'
  },
  {
    fecha: '2026-08-14',
    tipo: 'Entrada por Nacimiento',
    practico: 'BC-104',
    unico: 'VE-2026-104',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Becerro',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Becerro',
    tecnico: 'MARIA VICTORIA PEREZ',
    estatusActual: 'Activo',
    categoriaActual: 'Becerro',
    loteActual: 'POT1',
    comentario: 'Cría macho de Vaca CW002 x Toro BL001 (Parto normal)'
  },
  {
    fecha: '2026-08-01',
    tipo: 'Cambio de Rebaño',
    practico: '0002',
    unico: '0002',
    rebanoOrigen: 'Rebaño Secundario El Valle',
    categoriaOrigen: 'Vaca',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Vaca',
    tecnico: 'SANTOS MICHELENA',
    estatusActual: 'Activo',
    categoriaActual: 'Vaca',
    loteActual: '01',
    comentario: 'Integración al hato de alta producción'
  },
  {
    fecha: '2026-07-22',
    tipo: 'Cambio de Lote',
    practico: 'CW006',
    unico: 'CW006',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Vaca',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Vaca',
    tecnico: 'PEDRO PAREDES',
    estatusActual: 'Activo',
    categoriaActual: 'Vaca',
    loteActual: 'ESCT',
    comentario: 'Ajuste de carga en potrero por mantenimiento agronómico'
  },
  {
    fecha: '2026-07-10',
    tipo: 'Cambio de Lote',
    practico: 'CW008',
    unico: 'CW008',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Vaca',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Vaca',
    tecnico: 'ZULAY BERRUETA',
    estatusActual: 'Activo',
    categoriaActual: 'Vaca',
    loteActual: 'ESCT',
    comentario: 'Paso rutinario a lote de manejo'
  }
];

/* =========================================================================
 * 3. DATOS DE DISTRIBUCIÓN NORMAL
 * ========================================================================= */

export interface DistribucionNormalResultado {
  criterio: string;
  unidad: string;
  n: number;
  media: number;
  desviacionEstandar: number;
  mediana: number;
  coeficienteVariacion: number;
  minimo: number;
  maximo: number;
  curvaGauss: { x: number; y: number }[];
  intervalosFrecuencia: {
    rango: string;
    frecuenciaObservada: number;
    porcentajeObservado: number;
    frecuenciaEsperada: number;
    porcentajeAcumulado: number;
    zScore: number;
  }[];
}

export const MOCK_DISTRIBUCIONES_POR_CRITERIO: Record<string, DistribucionNormalResultado> = {
  'Producción - Promedio días producción': {
    criterio: 'Producción - Promedio días producción',
    unidad: 'días',
    n: 45,
    media: 214.6,
    desviacionEstandar: 32.4,
    mediana: 212.0,
    coeficienteVariacion: 15.1,
    minimo: 135.0,
    maximo: 295.0,
    curvaGauss: [
      { x: 130, y: 0.001 },
      { x: 150, y: 0.003 },
      { x: 170, y: 0.007 },
      { x: 190, y: 0.011 },
      { x: 215, y: 0.013 },
      { x: 235, y: 0.010 },
      { x: 255, y: 0.006 },
      { x: 275, y: 0.002 },
      { x: 295, y: 0.001 }
    ],
    intervalosFrecuencia: [
      { rango: '135.0 - 159.0', frecuenciaObservada: 3, porcentajeObservado: 6.7, frecuenciaEsperada: 2.8, porcentajeAcumulado: 6.7, zScore: -2.1 },
      { rango: '159.1 - 183.0', frecuenciaObservada: 6, porcentajeObservado: 13.3, frecuenciaEsperada: 5.9, porcentajeAcumulado: 20.0, zScore: -1.3 },
      { rango: '183.1 - 207.0', frecuenciaObservada: 11, porcentajeObservado: 24.4, frecuenciaEsperada: 10.8, porcentajeAcumulado: 44.4, zScore: -0.5 },
      { rango: '207.1 - 231.0', frecuenciaObservada: 14, porcentajeObservado: 31.1, frecuenciaEsperada: 13.2, porcentajeAcumulado: 75.6, zScore: 0.3 },
      { rango: '231.1 - 255.0', frecuenciaObservada: 7, porcentajeObservado: 15.6, frecuenciaEsperada: 8.1, porcentajeAcumulado: 91.1, zScore: 1.1 },
      { rango: '255.1 - 295.0', frecuenciaObservada: 4, porcentajeObservado: 8.9, frecuenciaEsperada: 4.2, porcentajeAcumulado: 100.0, zScore: 1.9 }
    ]
  },
  'Producción - Producción total de leche': {
    criterio: 'Producción - Producción total de leche',
    unidad: 'Kg',
    n: 45,
    media: 3420.5,
    desviacionEstandar: 410.2,
    mediana: 3390.0,
    coeficienteVariacion: 12.0,
    minimo: 2450.0,
    maximo: 4500.0,
    curvaGauss: [
      { x: 2400, y: 0.0002 },
      { x: 2800, y: 0.0008 },
      { x: 3100, y: 0.0016 },
      { x: 3420, y: 0.0024 },
      { x: 3700, y: 0.0017 },
      { x: 4100, y: 0.0007 },
      { x: 4500, y: 0.0002 }
    ],
    intervalosFrecuencia: [
      { rango: '2450 - 2800', frecuenciaObservada: 4, porcentajeObservado: 8.9, frecuenciaEsperada: 3.5, porcentajeAcumulado: 8.9, zScore: -1.9 },
      { rango: '2801 - 3150', frecuenciaObservada: 8, porcentajeObservado: 17.8, frecuenciaEsperada: 7.6, porcentajeAcumulado: 26.7, zScore: -1.1 },
      { rango: '3151 - 3500', frecuenciaObservada: 16, porcentajeObservado: 35.6, frecuenciaEsperada: 15.1, porcentajeAcumulado: 62.2, zScore: 0.1 },
      { rango: '3501 - 3850', frecuenciaObservada: 11, porcentajeObservado: 24.4, frecuenciaEsperada: 11.2, porcentajeAcumulado: 86.7, zScore: 0.9 },
      { rango: '3851 - 4500', frecuenciaObservada: 6, porcentajeObservado: 13.3, frecuenciaEsperada: 5.6, porcentajeAcumulado: 100.0, zScore: 1.8 }
    ]
  },
  'Crecimiento - Ganancia diaria de peso': {
    criterio: 'Crecimiento - Ganancia diaria de peso',
    unidad: 'g/día',
    n: 35,
    media: 685.0,
    desviacionEstandar: 95.5,
    mediana: 680.0,
    coeficienteVariacion: 13.9,
    minimo: 450.0,
    maximo: 920.0,
    curvaGauss: [
      { x: 450, y: 0.0008 },
      { x: 530, y: 0.0022 },
      { x: 610, y: 0.0041 },
      { x: 685, y: 0.0053 },
      { x: 760, y: 0.0039 },
      { x: 840, y: 0.0019 },
      { x: 920, y: 0.0007 }
    ],
    intervalosFrecuencia: [
      { rango: '450 - 540', frecuenciaObservada: 3, porcentajeObservado: 8.6, frecuenciaEsperada: 2.8, porcentajeAcumulado: 8.6, zScore: -1.8 },
      { rango: '541 - 630', frecuenciaObservada: 7, porcentajeObservado: 20.0, frecuenciaEsperada: 6.9, porcentajeAcumulado: 28.6, zScore: -0.9 },
      { rango: '631 - 720', frecuenciaObservada: 13, porcentajeObservado: 37.1, frecuenciaEsperada: 12.5, porcentajeAcumulado: 65.7, zScore: 0.2 },
      { rango: '721 - 810', frecuenciaObservada: 8, porcentajeObservado: 22.9, frecuenciaEsperada: 8.2, porcentajeAcumulado: 88.6, zScore: 1.0 },
      { rango: '811 - 920', frecuenciaObservada: 4, porcentajeObservado: 11.4, frecuenciaEsperada: 3.6, porcentajeAcumulado: 100.0, zScore: 1.9 }
    ]
  }
};

/* =========================================================================
 * 4. DATOS DE TÉCNICOS
 * ========================================================================= */

export const MOCK_TECNICOS: TecnicoEntity[] = [
  {
    codigo: 'AD',
    nombre: 'ALEJANDRA DURAN',
    estatus: 'Activo',
    positivos: 31,
    negativos: 8,
    enEspera: 3,
    totalServicios: 42,
    primerServicio: 24,
    segundoServicio: 12,
    tercerServicio: 4,
    cuatroOMasServicios: 2,
    partos: 26,
    abortos: 2,
    aunPrenadas: 5,
    eficienciaPorcentaje: 73.8,
    serviciosPorConcepcion: 1.35,
    machosNacidos: 14,
    hembrasNacidas: 12,
    ovulosViables: 0,
    ovulosTotales: 0,
    embrionesColocados: 6,
    viablesPorDosis: 0.85
  },
  {
    codigo: 'AR',
    nombre: 'AUGUSTO RODRIGUEZ',
    estatus: 'Activo',
    positivos: 28,
    negativos: 7,
    enEspera: 3,
    totalServicios: 38,
    primerServicio: 21,
    segundoServicio: 11,
    tercerServicio: 4,
    cuatroOMasServicios: 2,
    partos: 23,
    abortos: 1,
    aunPrenadas: 4,
    eficienciaPorcentaje: 73.7,
    serviciosPorConcepcion: 1.36,
    machosNacidos: 11,
    hembrasNacidas: 12,
    ovulosViables: 0,
    ovulosTotales: 0,
    embrionesColocados: 4,
    viablesPorDosis: 0.82
  },
  {
    codigo: 'JJR',
    nombre: 'JHON JAIRO RESTREPO',
    estatus: 'Activo',
    positivos: 41,
    negativos: 10,
    enEspera: 4,
    totalServicios: 55,
    primerServicio: 32,
    segundoServicio: 15,
    tercerServicio: 6,
    cuatroOMasServicios: 2,
    partos: 34,
    abortos: 2,
    aunPrenadas: 7,
    eficienciaPorcentaje: 74.5,
    serviciosPorConcepcion: 1.34,
    machosNacidos: 18,
    hembrasNacidas: 16,
    ovulosViables: 15,
    ovulosTotales: 18,
    embrionesColocados: 12,
    viablesPorDosis: 0.88
  },
  {
    codigo: 'MVP',
    nombre: 'MARIA VICTORIA PEREZ',
    estatus: 'Activo',
    positivos: 39,
    negativos: 6,
    enEspera: 3,
    totalServicios: 48,
    primerServicio: 31,
    segundoServicio: 12,
    tercerServicio: 3,
    cuatroOMasServicios: 2,
    partos: 32,
    abortos: 1,
    aunPrenadas: 6,
    eficienciaPorcentaje: 81.3,
    serviciosPorConcepcion: 1.23,
    machosNacidos: 15,
    hembrasNacidas: 17,
    ovulosViables: 24,
    ovulosTotales: 27,
    embrionesColocados: 18,
    viablesPorDosis: 0.92
  },
  {
    codigo: 'PD',
    nombre: 'PEDRO PAREDES',
    estatus: 'Activo',
    positivos: 24,
    negativos: 8,
    enEspera: 3,
    totalServicios: 35,
    primerServicio: 18,
    segundoServicio: 11,
    tercerServicio: 4,
    cuatroOMasServicios: 2,
    partos: 20,
    abortos: 1,
    aunPrenadas: 3,
    eficienciaPorcentaje: 68.6,
    serviciosPorConcepcion: 1.46,
    machosNacidos: 9,
    hembrasNacidas: 11,
    ovulosViables: 0,
    ovulosTotales: 0,
    embrionesColocados: 0,
    viablesPorDosis: 0.78
  },
  {
    codigo: 'SAMI',
    nombre: 'SANTOS MICHELENA',
    estatus: 'Activo',
    positivos: 45,
    negativos: 13,
    enEspera: 4,
    totalServicios: 62,
    primerServicio: 36,
    segundoServicio: 17,
    tercerServicio: 6,
    cuatroOMasServicios: 3,
    partos: 38,
    abortos: 3,
    aunPrenadas: 7,
    eficienciaPorcentaje: 72.6,
    serviciosPorConcepcion: 1.38,
    machosNacidos: 20,
    hembrasNacidas: 18,
    ovulosViables: 0,
    ovulosTotales: 0,
    embrionesColocados: 8,
    viablesPorDosis: 0.81
  },
  {
    codigo: 'TH',
    nombre: 'TULIO HERNANDEZ',
    estatus: 'Activo',
    positivos: 22,
    negativos: 5,
    enEspera: 2,
    totalServicios: 29,
    primerServicio: 19,
    segundoServicio: 7,
    tercerServicio: 2,
    cuatroOMasServicios: 1,
    partos: 18,
    abortos: 1,
    aunPrenadas: 3,
    eficienciaPorcentaje: 75.9,
    serviciosPorConcepcion: 1.32,
    machosNacidos: 10,
    hembrasNacidas: 8,
    ovulosViables: 0,
    ovulosTotales: 0,
    embrionesColocados: 0,
    viablesPorDosis: 0.84
  },
  {
    codigo: 'ZB',
    nombre: 'ZULAY BERRUETA',
    estatus: 'Activo',
    positivos: 35,
    negativos: 6,
    enEspera: 3,
    totalServicios: 44,
    primerServicio: 28,
    segundoServicio: 11,
    tercerServicio: 3,
    cuatroOMasServicios: 2,
    partos: 29,
    abortos: 1,
    aunPrenadas: 5,
    eficienciaPorcentaje: 79.5,
    serviciosPorConcepcion: 1.26,
    machosNacidos: 16,
    hembrasNacidas: 13,
    ovulosViables: 18,
    ovulosTotales: 21,
    embrionesColocados: 10,
    viablesPorDosis: 0.89
  }
];

/* =========================================================================
 * 5. DATOS DE REPRODUCTORES
 * ========================================================================= */

export interface ReproductorDetalladoEntity extends ReproductorEntity {
  raza: string;
  padre?: string;
  madre?: string;
  stockActual: number;
  stockUnidad: string;
  centroGenetico?: string;
  criasNacidasTotal?: number;
  criasMachos?: number;
  criasHembras?: number;
}

export const MOCK_REPRODUCTORES: ReproductorDetalladoEntity[] = [
  {
    practico: 'EM01',
    unico: 'EM01',
    nombre: 'Embrión Supremo FIV',
    categoriaActual: 'Embrión',
    estatusActual: 'Activo',
    eficiencia: 72.0,
    serviciosPorConcepcion: 1.39,
    loteActual: 'TERM1',
    raza: 'Brahman Americano Gris',
    padre: 'MR V8 194/7',
    madre: 'MISS DIAMOND 402',
    stockActual: 14,
    stockUnidad: 'embriones',
    centroGenetico: 'Bovigenetics International',
    criasNacidasTotal: 18,
    criasMachos: 10,
    criasHembras: 8
  },
  {
    practico: 'SM01',
    unico: 'SM01',
    nombre: 'Pajuela Gyr Lechero Elite',
    categoriaActual: 'Semen',
    estatusActual: 'Activo',
    eficiencia: 68.0,
    serviciosPorConcepcion: 1.47,
    loteActual: 'TERM1',
    raza: 'Gyr Lechero',
    padre: 'C.A. SANSON',
    madre: 'RADIANTE DE BRASILIA',
    stockActual: 48,
    stockUnidad: 'pajuelas',
    centroGenetico: 'Alta Genetics Brasil',
    criasNacidasTotal: 42,
    criasMachos: 20,
    criasHembras: 22
  },
  {
    practico: 'SM02',
    unico: 'SM02',
    nombre: 'Pajuela Brahman Rojo Campeón',
    categoriaActual: 'Semen',
    estatusActual: 'Activo',
    eficiencia: 75.0,
    serviciosPorConcepcion: 1.33,
    loteActual: 'TERM1',
    raza: 'Brahman Rojo',
    padre: 'HK MAGNETIC 844',
    madre: 'VL ROJA ELENA 2/50',
    stockActual: 32,
    stockUnidad: 'pajuelas',
    centroGenetico: 'Semex C.A.',
    criasNacidasTotal: 38,
    criasMachos: 19,
    criasHembras: 19
  },
  {
    practico: 'BL001',
    unico: 'BL001',
    nombre: 'Toro Sultán del Valle',
    categoriaActual: 'Toro',
    estatusActual: 'Activo',
    eficiencia: 80.0,
    serviciosPorConcepcion: 1.25,
    loteActual: 'ESCT',
    raza: 'Carora Puro',
    padre: 'DON TITO 14',
    madre: 'CARORA BELLA 88',
    stockActual: 1,
    stockUnidad: 'reproductor en monta',
    centroGenetico: 'Hacienda El Juncal',
    criasNacidasTotal: 65,
    criasMachos: 33,
    criasHembras: 32
  },
  {
    practico: 'BL002',
    unico: 'BL002',
    nombre: 'Toro Relámpago Jr.',
    categoriaActual: 'Toro',
    estatusActual: 'Activo',
    eficiencia: 70.0,
    serviciosPorConcepcion: 1.43,
    loteActual: 'POT1',
    raza: 'Guzerá Doble Propósito',
    padre: 'GUZERÁ NOBRE',
    madre: 'GUZERÁ FLOR 10',
    stockActual: 1,
    stockUnidad: 'reproductor en monta',
    centroGenetico: 'Agropecuaria San José',
    criasNacidasTotal: 29,
    criasMachos: 14,
    criasHembras: 15
  },
  {
    practico: 'CW015-EEE',
    unico: 'CW015-EEE',
    nombre: 'Embrión Girolando Plus F1',
    categoriaActual: 'Embrión',
    estatusActual: 'Activo',
    eficiencia: 65.0,
    serviciosPorConcepcion: 1.54,
    loteActual: '01',
    raza: 'Girolando 5/8',
    padre: 'VALE OURO TE SILVANIA',
    madre: 'HOLSTEIN GLORY 902',
    stockActual: 9,
    stockUnidad: 'embriones',
    centroGenetico: 'InVitro Brasil / GanSoft Tech',
    criasNacidasTotal: 12,
    criasMachos: 5,
    criasHembras: 7
  }
];
