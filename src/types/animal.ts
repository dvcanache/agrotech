export type EspecieAnimal = 
  | 'Bovinos' 
  | 'Aves de corral' 
  | 'Porcinos' 
  | 'Búfalos' 
  | 'Caprinos' 
  | 'Equinos';

export interface EspecieTaxonomyItem {
  id: EspecieAnimal;
  nombre: string;
  icono: string;
  subcategorias: string[];
}

export const ESPECIES_TAXONOMY: Record<EspecieAnimal, EspecieTaxonomyItem> = {
  'Bovinos': {
    id: 'Bovinos',
    nombre: 'Bovinos (Vacunos)',
    icono: '🐮',
    subcategorias: [
      'Vacas',
      'Novillas',
      'Mautas / Mautes',
      'Becerros / Becerras',
      'Toros'
    ]
  },
  'Aves de corral': {
    id: 'Aves de corral',
    nombre: 'Aves de corral',
    icono: '🐔',
    subcategorias: [
      'Gallinas Ponedoras',
      'Pollos de Engorde',
      'Pollonas / Pollitos',
      'Gallos Finos',
      'Gallinas Finas',
      'Pavos / Pavas',
      'Patos / Patas',
      'Pavitos / Patitos'
    ]
  },
  'Porcinos': {
    id: 'Porcinos',
    nombre: 'Porcinos',
    icono: '🐷',
    subcategorias: [
      'Cerdas Reproductoras',
      'Verracos',
      'Lechones',
      'Cerdos de Ceba',
      'Cerdas de Reemplazo'
    ]
  },
  'Búfalos': {
    id: 'Búfalos',
    nombre: 'Búfalos',
    icono: '🐃',
    subcategorias: [
      'Búfalas',
      'Bubillas',
      'Bucerros / Bucerras',
      'Padrotes / Búfalos de Ceba'
    ]
  },
  'Caprinos': {
    id: 'Caprinos',
    nombre: 'Caprinos',
    icono: '🐐',
    subcategorias: [
      'Cabras Lecheras',
      'Cabritonas / Cabritos',
      'Chivos Reproductores',
      'Caprinos de Ceba'
    ]
  },
  'Equinos': {
    id: 'Equinos',
    nombre: 'Equinos',
    icono: '🐴',
    subcategorias: [
      'Yeguas',
      'Potros / Potrancas',
      'Caballos',
      'Padrillos / Sementales'
    ]
  }
};

export interface Animal {
  practico: string;
  unico: string;
  categoria: string;
  especie?: EspecieAnimal;
  subcategoria?: string;
  estatus: string;
  fechaNacimiento: string;
  edad: string;
  lote: string;
  descripcion: string;
  composicion: string;
  racial: string;
  etiquetas: string;
  activos: string;
  padre: string;
  madre: string;
  pesoKg?: number;
  estatusReproductivo?: string;
  estatusProductivo?: string;
  color?: string;
  sexo?: 'Macho' | 'Hembra' | string;
  rfid?: string;
  diasGestacion?: number;
  partos?: number;
  ultimoParto?: string;
  ultimoPesajeLeche?: number;
  cuartosMastitis?: string[];
  alertaSanitaria?: string;
  retiroLecheHasta?: string;
  retiroCarneHasta?: string;
}

export interface AnimalFilterOptions {
  searchQuery?: string;
  especie?: EspecieAnimal | string;
  categoria?: string;
  subcategoria?: string;
  lote?: string;
}

/* =========================================================================
 * TIPOS ZOOTÉCNICOS EXPEDIENTE 360° (ANIMAL 360)
 * ========================================================================= */

export interface AlertaSanitariaRetiro {
  activo: boolean;
  tipo: 'antibiotico' | 'desparasitante' | 'antiinflamatorio' | 'vacuna';
  diagnostico: string;
  farmaco: string;
  principioActivo: string;
  dosis: string;
  via: 'Intramamaria' | 'Intramuscular' | 'Subcutánea' | 'Oral' | 'Tópica';
  cuartosAfectados?: ('AD' | 'AI' | 'PD' | 'PI')[];
  fechaInicio: string;
  fechaFinRetiroLeche: string;
  diasRestantesLeche: number;
  fechaFinRetiroCarne: string;
  diasRestantesCarne: number;
  ordenBloqueoTanque: boolean;
  veterinario: string;
}

export interface PedigreeNode {
  id: string;
  arete: string;
  nombre: string;
  raza: string;
  hba?: string;
  foto?: string;
  rol?: 'Padre' | 'Madre' | 'Abuelo Paterno' | 'Abuela Paterna' | 'Abuelo Materno' | 'Abuela Materna' | 'Bisabuelo' | 'Bisabuela';
  padre?: PedigreeNode;
  madre?: PedigreeNode;
}

export interface DesgloseRacialItem {
  raza: string;
  porcentaje: number;
  colorHex: string;
}

export interface ConsanguinidadData {
  coeficienteWrightFx: number; // Ej. 0.0312 (3.12%)
  alertaEndogamia: boolean; // True si Fx > 0.0625 (6.25%)
  ancestroComun?: string;
  analisis: string;
  recomendacionCruzamiento: string;
}

export interface KpiReproductivos {
  iepPromedioDias: number; // Intervalo entre partos promedio
  diasAbiertos: number;
  serviciosPorConcepcion: number;
  devDias: number; // Días de espera voluntaria
  totalPartos: number;
  totalAbortos: number;
  fechaUltimoParto?: string;
  fechaUltimoServicio?: string;
  fechaProximoParto?: string;
  diasPrenez?: number;
}

export interface EventoGinecologico {
  id: string;
  fecha: string;
  campana: number;
  tipo: 'Celo' | 'Servicio' | 'Palpacion' | 'Parto' | 'Secado' | 'Aborto';
  titulo: string;
  descripcion: string;
  tecnico: string;
  detalles: {
    hora?: string;
    toro?: string;
    pajuelaLote?: string;
    metodoServicio?: 'IA' | 'Monta Natural' | 'IATF';
    diagnosticoEco?: string;
    cuernoUterino?: string;
    cuerpoLuteo?: string;
    sexoCria?: 'Hembra' | 'Macho';
    pesoCriaKg?: number;
    areteCria?: string;
    tipoParto?: 'Eutócico Normal' | 'Distócico Asistido' | 'Cesárea';
    productoSecado?: string;
    diasLactanciaAcumulados?: number;
  };
}

export interface CurvaLactanciaPoint {
  dim: number; // Days in milk: 15, 30, 45, 60, ..., 305
  produccionReal?: number;
  produccionWood: number;
  promedioFinca: number;
}

export interface ControlLecheroPesaje {
  id: string;
  fecha: string;
  dim: number;
  amKg: number;
  pmKg: number;
  totalKg: number;
  grasaPorc: number;
  proteinaPorc: number;
  ratioGP: number;
  alertaGP?: 'SARA' | 'Optimo' | 'Cetosis';
  rcs: number; // Células somáticas (cel/ml)
  estatusRCS: 'Excelente' | 'Normal' | 'Alerta Subclínica' | 'Mastitis';
}

export interface LactanciaStats {
  numeroLactanciaActual: number;
  diasEnLeche: number;
  produccionAcumuladaKg: number;
  proyeccion305DiasKg: number;
  promedioFinca305DiasKg: number;
  picoLactanciaKg: number;
  diaPico: number;
  persistenciaPorc: number;
  grasaMediaPorc: number;
  proteinaMediaPorc: number;
}

export interface PesajesAjustados {
  pesoNacimientoKg: number;
  pesoAjustado205dKg: number;
  pesoAjustado365dKg: number;
  pesoAjustado540dKg: number;
  pesoActualKg: number;
  gdpGlobalGramosDia: number;
}

export interface RegistroPesaje {
  id: string;
  fecha: string;
  edadMeses: number;
  diasVida: number;
  pesoKg: number;
  pesoEsperadoRazaKg: number;
  gdpPeriodoGramosDia?: number;
  condicionCorporal: number;
  metodo: 'Báscula Electrónica Tru-Test' | 'Cinta Boviométrica' | 'Báscula Mecánica';
  observaciones?: string;
}

export type GradoCMT = 'Negativo' | 'Trazas' | 'Grado 1' | 'Grado 2' | 'Grado 3';

export interface CuartoMamarioInfo {
  codigo: 'AD' | 'AI' | 'PD' | 'PI';
  nombre: 'Anterior Derecho' | 'Anterior Izquierdo' | 'Posterior Derecho' | 'Posterior Izquierdo';
  cmt: GradoCMT;
  estadoClinico: 'Sano' | 'Mastitis Subclínica' | 'Mastitis Clínica' | 'Ciego / Atrofiado';
  conductividadMs?: number;
  ultimoTratamiento?: string;
}

export interface TratamientoSanitarioItem {
  id: string;
  fecha: string;
  diagnostico: string;
  farmaco: string;
  principioActivo: string;
  dosis: string;
  via: 'Intramamaria' | 'Intramuscular' | 'Subcutánea' | 'Oral' | 'Tópica';
  cuartosAfectados?: string[];
  retiroLecheHoras: number;
  retiroCarneDias: number;
  fechaFinRetiroLeche: string;
  fechaFinRetiroCarne: string;
  diasRestantesRetiro: number;
  activo: boolean;
  veterinario: string;
}

export interface VacunaPlanItem {
  id: string;
  enfermedad: string;
  producto: string;
  laboratorio: string;
  lote: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  estado: 'Vigente' | 'Por Vencer' | 'Vencida';
  veterinario: string;
}

export interface TrasladoEspacialItem {
  id: string;
  fechaEntrada: string;
  fechaSalida?: string;
  diasPermanencia: number;
  potreroId: string;
  potreroNombre: string;
  hectareas: number;
  tipoPastura: string;
  loteNombre: string;
  cargaAnimalUggHa: number;
  motivo: 'Rotación PRV' | 'Manejo Sanitario' | 'Cambio de Lote' | 'Pre-Parto' | 'Recría';
  responsable: string;
  actual: boolean;
}

export interface Animal360 {
  // Cabecera Dinámica
  practico: string;
  unico: string;
  rfid: string;
  categoria: string;
  subcategoria?: string;
  estatus: 'Activo' | 'Inactivo' | 'Descartado' | 'Vendido' | 'Fallecido';
  estatusReproductivo: 'Vacía' | 'Servida' | 'Preñada' | 'En espera';
  diasGestacion?: number;
  estatusProductivo: 'Ordeño' | 'Seca' | 'Criando' | 'Ceba' | 'Levante';
  fechaNacimiento: string;
  edadAnos: number;
  edadMeses: number;
  edadTexto: string;
  raza: string;
  lote: string;
  potrero: string;
  alertaSanitaria?: AlertaSanitariaRetiro;

  // Pestaña 1: Ficha General & Identificación
  fotoUrl?: string;
  alias?: string;
  colorPelaje: string;
  hierroMarca: {
    codigo: string;
    posicion: string;
    tipo: string;
  };
  propietario: string;
  porcentajeTenencia: number;
  origen: string;
  tatuaje: string;
  especie: string;
  sexo: 'Hembra' | 'Macho';
  finalidad: string;
  notasZootecnicas: string;

  // Pestaña 2: Genealogía & Consanguinidad
  pedigri: PedigreeNode;
  consanguinidad: ConsanguinidadData;
  desgloseRacial: DesgloseRacialItem[];

  // Pestaña 3: Historial Reproductivo
  kpisReproductivos: KpiReproductivos;
  timelineGinecologico: EventoGinecologico[];

  // Pestaña 4: Curvas de Lactancia
  lactanciaStats: LactanciaStats;
  curvaWoodData: CurvaLactanciaPoint[];
  controlesLecheros: ControlLecheroPesaje[];

  // Pestaña 5: Desarrollo Ponderal
  pesajesAjustados: PesajesAjustados;
  historialPesajes: RegistroPesaje[];
  condicionCorporalActual: number;

  // Pestaña 6: Sanidad & Ubre
  cuartosMamarios: {
    AD: CuartoMamarioInfo;
    AI: CuartoMamarioInfo;
    PD: CuartoMamarioInfo;
    PI: CuartoMamarioInfo;
  };
  tratamientosSanitarios: TratamientoSanitarioItem[];
  planVacunacion: VacunaPlanItem[];

  // Pestaña 7: Trazabilidad Espacial & Lotes
  historialTraslados: TrasladoEspacialItem[];
}
