import {
  CategoriaAnimal,
  EstatusAnimal,
  EstatusReproductivo,
  EstatusProductivo,
  TipoPesaje,
  TipoEventoReproductivo,
  EstatusPotrero,
  TipoLaborPotrero
} from './common';

/* =========================================================================
 * 1. ENTIDADES DE LA SECCIÓN «ANIMALES»
 * ========================================================================= */

/**
 * /reports/dams — Reporte de Vientres
 */
export interface VientreEntity {
  practico: string;
  unico: string;
  categoria: 'Novilla' | 'Vaca';
  estatus: EstatusAnimal;
  estatusReproductivo: EstatusReproductivo;
  estatusProductivo: EstatusProductivo;
  lote: string;
  edadAnos: number;
  partos: number;
  ultimoPartoAborto?: string;
  ultimoServicio?: string;
  reproductor?: string;
}

/**
 * /reports/nexttodry — Próximas a secar
 */
export interface ProximaSecarEntity {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  lote: string;
  ultimoPartoAborto?: string;
  ultimoTipoPartoAborto?: string;
  ultimoServicio?: string;
  reproductor?: string;
  fechaProximoSecado: string;
  fechaProximoParto?: string;
  diasProximoSecado: number;
  diasProximoParto?: number;
  ultimoPesajeLecheKg?: number;
  fechaUltimoPesajeLeche?: string;
}

/**
 * /reports/nexttobirth — Próximas a parir
 */
export interface ProximaParirEntity {
  practico: string;
  unico: string;
  categoria: 'Novilla' | 'Vaca';
  estatus: EstatusAnimal;
  lote: string;
  ultimoPartoAborto?: string;
  partos: number;
  montas: number;
  inseminaciones: number;
  transplantes: number;
  ultimoServicio?: string;
  reproductor?: string;
  fechaProximoParto: string;
  diasProximoParto: number;
  ultimoPesoKg?: number;
  fechaUltimoPeso?: string;
  fechaSecado?: string;
  diasSeca?: number;
}

/**
 * /reports/nexttocheck — Próximas a revisar
 */
export interface ProximaRevisarEntity {
  practico: string;
  unico: string;
  categoria: 'Novilla' | 'Vaca';
  estatus: EstatusAnimal;
  lote: string;
  ultimoPartoAborto?: string;
  partos: number;
  montas: number;
  inseminaciones: number;
  transplantes: number;
  ultimoServicio?: string;
  reproductor?: string;
  ultimaRevision?: string;
  revisiones: number;
  ultimoDiagnostico?: string;
  ultimoTratamiento?: string;
  proximaRevision: string;
  diasProximaRevision: number;
}

/**
 * /reports/drycows — Animales secos
 */
export interface AnimalSecoEntity {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  estatusReproductivo: EstatusReproductivo;
  estatusProductivo: 'Seca';
  lote: string;
  ultimoParto?: string;
  ultimoServicio?: string;
  diasServidaActual?: number;
  fechaProximoParto?: string;
  diasSeca: number;
  diasEnProduccion: number;
}

/**
 * /reports/cowsinproduction — Animales lactando
 */
export interface AnimalLactandoEntity {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  situacionReproductivaActual: EstatusReproductivo;
  situacionProductivaActual: 'Ordeño';
  lote: string;
  ultimoParto: string;
  numeroParto: number;
  ultimoServicio?: string;
  reproductor?: string;
  diasParida: number;
  diasServida?: number;
  proximoParto?: string;
  fechaProximoSecado?: string;
  diasEnProduccion: number;
  diasSeca?: number;
}

/**
 * /reports/cowsraising — Animales criando
 */
export interface AnimalCriandoEntity {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  lote: string;
  ultimoParto: string;
  codigosCriasUltimoParto: string;
  diasParidaActual: number;
}

/**
 * /reports/nodams — No Vientres
 */
export interface NoVientreEntity {
  practico: string;
  unico: string;
  categoria: 'Becerra' | 'Mauta' | 'Becerro' | 'Maute' | 'Novillo';
  estatus: EstatusAnimal;
  lote: string;
  fechaNacimiento: string;
  edadMeses: number;
  composicion: string;
  penultimoPesoKg?: number;
  fechaPenultimoPeso?: string;
  ultimoPesoKg?: number;
  fechaUltimoPeso?: string;
  gananciaParcialGramosDia?: number;
  gananciaGlobalGramosDia?: number;
  pesoIngresoKg?: number;
  fechaPesoIngreso?: string;
}

/* =========================================================================
 * 2. ENTIDADES DE LA SECCIÓN «GESTIÓN»
 * ========================================================================= */

/**
 * /reports/inventories — Fila de resumen de inventario por lote
 */
export interface ResumenInventarioLote {
  loteCodigo: string;
  loteNombre: string;
  becerras: number;
  mautas: number;
  novillas: number;
  vacas: number;
  becerros: number;
  mautes: number;
  novillos: number;
  toros: number;
  total: number;
}

/**
 * /reports/movements — Registro de movimientos entre rebaños/lotes
 */
export interface MovimientoEntity {
  fecha: string;
  tipo: string;
  practico: string;
  unico: string;
  rebanoOrigen: string;
  categoriaOrigen: CategoriaAnimal;
  rebanoDestino: string;
  categoriaDestino: CategoriaAnimal;
  tecnico: string;
  estatusActual: EstatusAnimal;
  categoriaActual: CategoriaAnimal;
  loteActual: string;
  comentario?: string;
}

/**
 * /reports/technicians — Desempeño y estadísticas de técnicos e inseminadores
 */
export interface TecnicoEntity {
  codigo: string;
  nombre: string;
  estatus: 'Activo' | 'Inactivo';
  positivos: number;
  negativos: number;
  enEspera: number;
  totalServicios: number;
  primerServicio: number;
  segundoServicio: number;
  tercerServicio: number;
  cuatroOMasServicios: number;
  partos: number;
  abortos: number;
  aunPrenadas: number;
  eficienciaPorcentaje: number;
  serviciosPorConcepcion: number;
  machosNacidos: number;
  hembrasNacidas: number;
  ovulosViables?: number;
  ovulosTotales?: number;
  embrionesColocados?: number;
  viablesPorDosis?: number;
}

/**
 * /reports/breeders — Ficha de toros, semen y reproductores
 */
export interface ReproductorEntity {
  practico: string;
  unico: string;
  nombre: string;
  categoriaActual: 'Toro' | 'Semen' | 'Embrión';
  estatusActual: EstatusAnimal;
  eficiencia?: number;
  serviciosPorConcepcion?: number;
  loteActual: string;
}

/* =========================================================================
 * 3. ENTIDADES DE LA SECCIÓN «HISTÓRICOS»
 * ========================================================================= */

/**
 * /reports/historics/reproductions — Historial de eventos reproductivos
 */
export interface ReproduccionHistoricoEntity {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  loteActual: string;
  eventoNumero: number;
  tipoEvento: TipoEventoReproductivo;
  subtipoEvento?: string;
  fechaEvento: string;
  tecnicoResponsable: string;
  machosVivos: number;
  hembrasVivas: number;
  reproductor?: string;
  diagnostico?: string;
  tratamiento?: string;
  rebano: string;
}

/**
 * /reports/historics/lactations — Historial de curvas de lactancia
 */
export interface LactanciaHistoricoEntity {
  practico: string;
  unico: string;
  categoria: 'Novilla' | 'Vaca';
  estatus: EstatusAnimal;
  loteActual: string;
  fecha: string;
  lactanciaNumero: number;
  diasLactancia: number;
  p244Kg: number;
  p270Kg: number;
  p305Kg: number;
  produccionTotalKg: number;
  rebano: string;
}

/**
 * /reports/historics/milks — Historial de pesajes individuales de leche
 */
export interface PesajeLecheHistoricoEntity {
  practico: string;
  unico: string;
  categoria: 'Novilla' | 'Vaca';
  estatus: EstatusAnimal;
  loteActual: string;
  fecha: string;
  lactanciaNumero: number;
  tipoPesaje: 'Inicio' | 'Ordeño' | 'Secado';
  pesaje1Kg?: number;
  pesaje2Kg?: number;
  pesaje3Kg?: number;
  pesajeTotalKg: number;
  comentario?: string;
}

/**
 * /reports/historics/weighings — Historial de pesajes de crecimiento y ganancia de peso
 */
export interface CrecimientoHistoricoEntity {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  loteActual: string;
  fecha: string;
  tipoPesaje: TipoPesaje;
  pesoKg: number;
  gananciaGramosDia?: number;
  alturaMetros?: number;
  gananciaCmDia?: number;
  diasEntreFechas?: number;
  tecnicoResponsable?: string;
}

/* =========================================================================
 * 4. ENTIDADES DE LA SECCIÓN «POTREROS»
 * ========================================================================= */

/**
 * /reports/paddocks — Catálogo e inventario general de potreros
 */
export interface PotreroGeneralEntity {
  codigo: string;
  descripcion: string;
  estatus: EstatusPotrero;
  pastoPredominante: string;
  tamanoHa: number;
  perimetroM: number;
  ultimoUsoEntrada?: string;
  ultimoUsoSalida?: string;
  ultimaOcupacionHoras?: number;
  ultimoDescansoDias?: number;
  promedioOcupacionHoras?: number;
  promedioDescansoDias?: number;
  vecesOcupado: number;
  vecesDescanso: number;
  ultimaICAHaHr?: number;
  promedioICAHaHr?: number;
  animalesUltimaOcupacion?: number;
  promedioAnimales?: number;
  uaUltimaOcupacion?: number; // Unidades Animales
  promedioUA?: number;
}

/**
 * /reports/labors — Registro histórico de labores agronómicas en potreros
 */
export interface LaborPotreroEntity {
  potrero: string;
  fechaInicio: string;
  fechaFinal: string;
  labor: TipoLaborPotrero | string;
  duracionHoras: number;
  veces: number;
  duracionUltimaHoras?: number;
  duracionPromedioHoras?: number;
}

/**
 * /reports/rotations — Reporte de rotaciones y ocupaciones de potreros
 */
export interface RotacionPotreroEntity {
  lote: string;
  potrero: string;
  fechaInicio: string;
  fechaFinal: string;
  ultimaOcupacionHoras: number;
  ultimoDescansoDias: number;
  numeroOcupaciones: number;
  promedioOcupacionesHoras: number;
  promedioDescansoDias: number;
  uaUltimaOcupacion: number;
  promedioUA: number;
  animalesUltimaOcupacion: number;
  promedioAnimales: number;
}

/**
 * /reports/paddockplans — Planificaciones y tareas programadas en potreros
 */
export interface PlanificacionPotreroEntity {
  potrero: string;
  fechaInicio: string;
  fechaFinal: string;
  labor: TipoLaborPotrero | string;
  faltanDias: number;
  duracionHoras: number;
  periodicidadDias: number;
  veces: number;
  duracionUltimaHoras?: number;
  duracionPromedioHoras?: number;
}

/* =========================================================================
 * 5. ENTIDADES DE LA SECCIÓN «MULTIREBAÑOS»
 * ========================================================================= */

/**
 * /reports/multiherds/inventories — Consolidado de inventario entre múltiples rebaños
 */
export interface MultirebanoInventarioEntity {
  rebanoId: string;
  rebanoNombre: string;
  totalAnimales: number;
  vacas: number;
  novillas: number;
  mautas: number;
  becerras: number;
  toros: number;
  novillos: number;
  mautes: number;
  becerros: number;
  unidadesAnimalesTotales: number;
}

/**
 * /reports/multiherds/reproduction — Situación reproductiva consolidada multirebaño
 */
export interface MultirebanoSituacionReproductivaEntity {
  rebanoId: string;
  rebanoNombre: string;
  vientresTotales: number;
  prenadas: number;
  vacias: number;
  enEspera: number;
  porcentajePrenez: number;
  diasAbiertosPromedio: number;
}

/**
 * /reports/multiherds/pregnancy-distribution — Distribución por tiempo de preñez multirebaño
 */
export interface MultirebanoDistribucionPrenezEntity {
  rebanoId: string;
  rebanoNombre: string;
  primerTercio: number; // 1-3 meses
  segundoTercio: number; // 4-6 meses
  tercerTercio: number; // 7-9 meses
  proximasParir: number;
}

/**
 * /reports/multiherds/production-status — Situación productiva consolidada multirebaño
 */
export interface MultirebanoSituacionProductivaEntity {
  rebanoId: string;
  rebanoNombre: string;
  enOrdeno: number;
  secas: number;
  criando: number;
  porcentajeOrdeno: number;
  litrosPromedioVacaDia: number;
}

/**
 * /reports/multiherds/transactions — Transacciones y transferencias entre rebaños
 */
export interface MultirebanoTransaccionEntity {
  id: string;
  fecha: string;
  tipoTransaccion: 'Traslado' | 'Compra' | 'Venta' | 'Muerte' | 'Descarte';
  rebanoOrigen?: string;
  rebanoDestino?: string;
  cantidadAnimales: number;
  montoTotal?: number;
  responsable: string;
}

/**
 * /reports/multiherds/daily-production — Comparativa de producción diaria entre rebaños
 */
export interface MultirebanoProduccionDiariaEntity {
  fecha: string;
  rebanoId: string;
  rebanoNombre: string;
  vacasOrdenadas: number;
  lecheTotalLitros: number;
  promedioLitrosVaca: number;
}
