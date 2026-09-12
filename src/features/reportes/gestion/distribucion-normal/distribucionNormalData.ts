import { EspecieAnimal } from '../../../../types/animal';

export interface AnimalZootecnico {
  id: string;
  arete: string;
  nombre: string;
  raza: string;
  categoria: string;
  lote: string;
  sexo: 'Hembra' | 'Macho';
  edadAnos: number;
  valor: number;
  zScore?: number;
  percentil?: number;
  recomendacionGenetica?: 'Descarte Sugerido' | 'Promedio Poblacional' | 'Donadora Élite' | 'Selección Élite';
}

export interface ZootechVariableConfig {
  id: string;
  especie: EspecieAnimal;
  nombre: string;
  subtitulo: string;
  unidad: string;
  esMenorMejor?: boolean; // true para IEP, ICA, Grasa Dorsal
  descripcion: string;
  valorIdealMin: number;
  valorIdealMax: number;
  paso: number;
}

export interface SpeciesOption {
  id: EspecieAnimal;
  nombre: string;
  icono: string;
  defaultVariable: string;
  descripcion: string;
}

export const SPECIES_OPTIONS: SpeciesOption[] = [
  { id: 'Bovinos', nombre: 'Bovinos', icono: '🐮', defaultVariable: 'produccion_305', descripcion: 'Ganado vacuno lechero, cárnico y doble propósito' },
  { id: 'Aves de corral', nombre: 'Aves de corral', icono: '🐔', defaultVariable: 'postura_pct', descripcion: 'Líneas ponedoras y pollos de engorde industrial' },
  { id: 'Porcinos', nombre: 'Porcinos', icono: '🐷', defaultVariable: 'lnv_camada', descripcion: 'Cerdas reproductoras y lotes de ceba terminal' },
  { id: 'Búfalos', nombre: 'Búfalos', icono: '🐃', defaultVariable: 'leche_bufala_270', descripcion: 'Búfalas lecheras de agua y bucerros de cría' },
  { id: 'Caprinos', nombre: 'Caprinos', icono: '🐐', defaultVariable: 'leche_cabra_210', descripcion: 'Cabras lecheras especializadas y caprinos de carne' },
  { id: 'Equinos', nombre: 'Equinos', icono: '🐴', defaultVariable: 'alzada_cruz', descripcion: 'Caballos de trabajo, silla, deporte y tiro' }
];

export const ZOOTECH_VARIABLES: ZootechVariableConfig[] = [
  // =========================================================================
  // 🐮 1. BOVINOS
  // =========================================================================
  {
    id: 'peso_destete',
    especie: 'Bovinos',
    nombre: 'Peso al Destete (205d)',
    subtitulo: 'Ajuste estandarizado zootécnico a 205 días',
    unidad: 'kg',
    descripcion: 'Evalúa la habilidad materna de la vaca y el potencial de crecimiento pre-destete de los terneros.',
    valorIdealMin: 195,
    valorIdealMax: 260,
    paso: 1
  },
  {
    id: 'produccion_305',
    especie: 'Bovinos',
    nombre: 'Producción 305 Días (kg)',
    subtitulo: 'Lactancia proyectada normalizada a 305 días',
    unidad: 'kg',
    descripcion: 'Estima la producción total equivalente por campaña según el modelo biométrico de Wood.',
    valorIdealMin: 3200,
    valorIdealMax: 5000,
    paso: 10
  },
  {
    id: 'gdp',
    especie: 'Bovinos',
    nombre: 'Ganancia Diaria de Peso (GDP)',
    subtitulo: 'Velocidad de desarrollo ponderal en g/d',
    unidad: 'g/día',
    descripcion: 'Velocidad de incremento ponderal diario entre pesajes sucesivos en corrales o pastoreo.',
    valorIdealMin: 650,
    valorIdealMax: 1050,
    paso: 5
  },
  {
    id: 'iep',
    especie: 'Bovinos',
    nombre: 'Intervalo Entre Partos (IEP)',
    subtitulo: 'Días transcurridos entre partos consecutivos',
    unidad: 'días',
    esMenorMejor: true,
    descripcion: 'Indicador ginecológico maestro de fertilidad y eficiencia reproductiva del hato.',
    valorIdealMin: 365,
    valorIdealMax: 410,
    paso: 1
  },

  // =========================================================================
  // 🐔 2. AVES DE CORRAL
  // =========================================================================
  {
    id: 'postura_pct',
    especie: 'Aves de corral',
    nombre: '% Postura Semanal',
    subtitulo: 'Tasa promedio de postura por lote activo',
    unidad: '%',
    descripcion: 'Porcentaje de producción de huevos por ave encasetada en la semana de evaluación.',
    valorIdealMin: 90,
    valorIdealMax: 98,
    paso: 0.5
  },
  {
    id: 'peso_faena_pollo',
    especie: 'Aves de corral',
    nombre: 'Peso al Sacrificio (42d)',
    subtitulo: 'Peso vivo final al cierre de ciclo de engorde',
    unidad: 'g',
    descripcion: 'Peso corporal vivo a los 42 días previo al procesamiento industrial en canal.',
    valorIdealMin: 2400,
    valorIdealMax: 2800,
    paso: 10
  },
  {
    id: 'ica_avicola',
    especie: 'Aves de corral',
    nombre: 'Índice de Conversión Alimenticia (ICA)',
    subtitulo: 'kg alimento consumido / kg biomasa ganada',
    unidad: 'ICA',
    esMenorMejor: true,
    descripcion: 'Eficiencia biológica en convertir ración balanceada en peso corporal (menor es mejor).',
    valorIdealMin: 1.55,
    valorIdealMax: 1.70,
    paso: 0.01
  },

  // =========================================================================
  // 🐷 3. PORCINOS
  // =========================================================================
  {
    id: 'lnv_camada',
    especie: 'Porcinos',
    nombre: 'Lechones Nacidos Vivos / Camada',
    subtitulo: 'Prolificidad materna por camada al parto',
    unidad: 'lechones',
    descripcion: 'Número de lechones vivos viables por camada al nacimiento en líneas hiperprolíficas.',
    valorIdealMin: 13,
    valorIdealMax: 16,
    paso: 1
  },
  {
    id: 'gdp_porcina',
    especie: 'Porcinos',
    nombre: 'Ganancia Diaria de Peso en Ceba',
    subtitulo: 'Incremento ponderal diario en etapa de engorde',
    unidad: 'g/día',
    descripcion: 'Tasa de incremento ponderal diario en las etapas de crecimiento y terminación.',
    valorIdealMin: 800,
    valorIdealMax: 950,
    paso: 5
  },
  {
    id: 'grasa_dorsal',
    especie: 'Porcinos',
    nombre: 'Espesor de Grasa Dorsal (P2)',
    subtitulo: 'Medición ecográfica en punto P2 (mm)',
    unidad: 'mm',
    esMenorMejor: true,
    descripcion: 'Espesor de tocino dorsal; indicador de rendimiento magro de la canal (menor es mejor).',
    valorIdealMin: 10,
    valorIdealMax: 14,
    paso: 0.2
  },

  // =========================================================================
  // 🐃 4. BÚFALOS
  // =========================================================================
  {
    id: 'leche_bufala_270',
    especie: 'Búfalos',
    nombre: 'Producción Leche Búfala (270d)',
    subtitulo: 'Lactancia estandarizada a 270 días',
    unidad: 'kg',
    descripcion: 'Producción láctea total equivalente en búfalas de agua bajo ordeño semi-intensivo.',
    valorIdealMin: 2200,
    valorIdealMax: 3200,
    paso: 10
  },
  {
    id: 'grasa_bufala_pct',
    especie: 'Búfalos',
    nombre: '% Grasa Láctea Búfala',
    subtitulo: 'Concentración de materia grasa',
    unidad: '% Grasa',
    descripcion: 'Porcentaje de grasa butirométrica indispensable para óptimo rendimiento quesero en mozzarella.',
    valorIdealMin: 7.2,
    valorIdealMax: 8.5,
    paso: 0.1
  },
  {
    id: 'peso_destete_bucerro',
    especie: 'Búfalos',
    nombre: 'Peso Destete Bucerros',
    subtitulo: 'Peso ajustado al destete (8 meses)',
    unidad: 'kg',
    descripcion: 'Desarrollo ponderal de crías bubalinas criadas al pie de la madre hasta el destete.',
    valorIdealMin: 120,
    valorIdealMax: 160,
    paso: 1
  },

  // =========================================================================
  // 🐐 5. CAPRINOS
  // =========================================================================
  {
    id: 'leche_cabra_210',
    especie: 'Caprinos',
    nombre: 'Producción Láctea Caprina (210d)',
    subtitulo: 'Lactancia normalizada a 210 días',
    unidad: 'L',
    descripcion: 'Volumen total de leche ordeñada en cabras lecheras especializadas durante la curva de lactación.',
    valorIdealMin: 650,
    valorIdealMax: 950,
    paso: 5
  },
  {
    id: 'peso_destete_cabrito',
    especie: 'Caprinos',
    nombre: 'Peso al Destete (60d)',
    subtitulo: 'Peso corporal al destete a 60 días',
    unidad: 'kg',
    descripcion: 'Masa corporal al cese del amamantamiento en cabritos de razas lecheras y carniceras.',
    valorIdealMin: 18,
    valorIdealMax: 26,
    paso: 0.5
  },
  {
    id: 'gdp_caprina',
    especie: 'Caprinos',
    nombre: 'Ganancia Diaria de Peso Caprina',
    subtitulo: 'Tasa de crecimiento diario pre y post destete',
    unidad: 'g/día',
    descripcion: 'Incremento de peso diario en lotes caprinos bajo pastoreo rotacional o suplementación.',
    valorIdealMin: 160,
    valorIdealMax: 240,
    paso: 2
  },

  // =========================================================================
  // 🐴 6. EQUINOS
  // =========================================================================
  {
    id: 'alzada_cruz',
    especie: 'Equinos',
    nombre: 'Alzada a la Cruz',
    subtitulo: 'Estatura morfométrica medida con hipómetro',
    unidad: 'cm',
    descripcion: 'Altura vertical desde el suelo hasta el punto de la cruz; estándar zootécnico funcional.',
    valorIdealMin: 145,
    valorIdealMax: 160,
    paso: 0.5
  },
  {
    id: 'perimetro_toracico',
    especie: 'Equinos',
    nombre: 'Perímetro Torácico',
    subtitulo: 'Circunferencia torácica post-escapular',
    unidad: 'cm',
    descripcion: 'Dimensión torácica que correlaciona con la capacidad cardiopulmonar y el peso corporal.',
    valorIdealMin: 175,
    valorIdealMax: 195,
    paso: 0.5
  },
  {
    id: 'condicion_equina',
    especie: 'Equinos',
    nombre: 'Condición Corporal Henneke',
    subtitulo: 'Escala zootécnica de 1 a 9',
    unidad: 'pts',
    descripcion: 'Calificación biométrica de reservas energéticas corporales según el método estándar Henneke.',
    valorIdealMin: 5,
    valorIdealMax: 6,
    paso: 0.25
  }
];

// Muestra poblacional enriquecida por variable y especie
export const MOCK_POBLACION_ZOOTECNICA: Record<string, AnimalZootecnico[]> = {
  // 🐮 Bovinos
  peso_destete: [
    { id: '1', arete: '0001', nombre: 'Mariposa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.4, valor: 218 },
    { id: '2', arete: '0002', nombre: 'Esperanza', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 224 },
    { id: '3', arete: 'CW002', nombre: 'Baronesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.1, valor: 205 },
    { id: '4', arete: 'CW003', nombre: 'Reina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.9, valor: 232 },
    { id: '5', arete: 'CW004', nombre: 'Princesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.8, valor: 210 },
    { id: '6', arete: 'CW005', nombre: 'Gitana', raza: 'Girolando', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 245 },
    { id: '7', arete: 'CW006', nombre: 'Lucero', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 238 },
    { id: '8', arete: 'CW007', nombre: 'Estrella', raza: 'Carora', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 198 },
    { id: '9', arete: 'CW008', nombre: 'Milenaria', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.3, valor: 252 },
    { id: '10', arete: 'CW009', nombre: 'Bandida', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 185 },
    { id: '11', arete: 'CW010', nombre: 'Paloma', raza: 'Carora', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 215 },
    { id: '12', arete: 'CW013', nombre: 'Triunfadora', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.3, valor: 228 },
    { id: '13', arete: 'VC-88', nombre: 'Sombra', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 172 },
    { id: '14', arete: 'VC-104', nombre: 'Coronela', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 240 },
    { id: '15', arete: 'VC-115', nombre: 'Muñeca', raza: 'Girolando', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.1, valor: 220 },
    { id: '16', arete: 'VC-120', nombre: 'Zafiro', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 260 },
    { id: '17', arete: 'VC-122', nombre: 'Esmeralda', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.2, valor: 255 },
    { id: '18', arete: 'VC-130', nombre: 'Flor de Loto', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.7, valor: 178 },
    { id: '19', arete: 'VC-135', nombre: 'Centella', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 192 },
    { id: '20', arete: 'VC-140', nombre: 'Cariñosa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.5, valor: 202 },
    { id: '21', arete: 'T-01', nombre: 'Titan 01', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 195 },
    { id: '22', arete: 'T-02', nombre: 'Titan 02', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.1, valor: 212 },
    { id: '23', arete: 'T-03', nombre: 'Titan 03', raza: 'Girolando', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.3, valor: 235 },
    { id: '24', arete: 'T-04', nombre: 'Titan 04', raza: 'Gyr Lechero', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 188 },
    { id: '25', arete: 'T-05', nombre: 'Titan 05', raza: 'Brahman', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.4, valor: 248 },
    { id: '26', arete: 'B-101', nombre: 'Becerro 101', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 226 },
    { id: '27', arete: 'B-102', nombre: 'Becerro 102', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 165 },
    { id: '28', arete: 'B-103', nombre: 'Becerro 103', raza: 'Holstein', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 268 },
    { id: '29', arete: 'B-104', nombre: 'Becerro 104', raza: 'Gyr Lechero', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.6, valor: 182 },
    { id: '30', arete: 'B-105', nombre: 'Becerro 105', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 250 },
    { id: '31', arete: 'BL001', nombre: 'Sultán del Valle', raza: 'Carora', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 6.8, valor: 262 },
    { id: '32', arete: 'BL002', nombre: 'Rey Criollo', raza: 'Carora', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 5.2, valor: 258 },
    { id: '33', arete: 'SM01', nombre: 'Gyr Master', raza: 'Gyr Lechero', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 4.8, valor: 242 },
    { id: '34', arete: 'SM02', nombre: 'Brahman Real', raza: 'Brahman', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 5.9, valor: 270 },
    { id: '35', arete: 'H-301', nombre: 'Holandesa 301', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 214 },
    { id: '36', arete: 'H-302', nombre: 'Holandesa 302', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.5, valor: 190 },
    { id: '37', arete: 'H-303', nombre: 'Holandesa 303', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.0, valor: 230 },
    { id: '38', arete: 'G-401', nombre: 'Gloriosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.6, valor: 222 },
    { id: '39', arete: 'G-402', nombre: 'Granadina', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 208 },
    { id: '40', arete: 'G-403', nombre: 'Galana', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 216 },
    { id: '41', arete: 'G-404', nombre: 'Gaviota', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.2, valor: 175 },
    { id: '42', arete: 'G-405', nombre: 'Genovesa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.0, valor: 236 },
    { id: '43', arete: 'M-501', nombre: 'Mantecosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.3, valor: 246 },
    { id: '44', arete: 'M-502', nombre: 'Morenita', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 200 },
    { id: '45', arete: 'M-503', nombre: 'Majestuosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 265 }
  ],
  produccion_305: [
    { id: '1', arete: '0001', nombre: 'Mariposa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.4, valor: 4890 },
    { id: '2', arete: '0002', nombre: 'Esperanza', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 5420 },
    { id: '3', arete: 'CW002', nombre: 'Baronesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.1, valor: 4520 },
    { id: '4', arete: 'CW003', nombre: 'Reina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.9, valor: 4760 },
    { id: '5', arete: 'CW004', nombre: 'Princesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.8, valor: 3950 },
    { id: '6', arete: 'CW005', nombre: 'Gitana', raza: 'Girolando', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 4680 },
    { id: '7', arete: 'CW006', nombre: 'Lucero', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 2850 },
    { id: '8', arete: 'CW007', nombre: 'Estrella', raza: 'Carora', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 3720 },
    { id: '9', arete: 'CW008', nombre: 'Milenaria', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.3, valor: 5850 },
    { id: '10', arete: 'CW009', nombre: 'Bandida', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 3120 },
    { id: '11', arete: 'CW010', nombre: 'Paloma', raza: 'Carora', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 4050 },
    { id: '12', arete: 'CW013', nombre: 'Triunfadora', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.3, valor: 3600 },
    { id: '13', arete: 'VC-88', nombre: 'Sombra', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 5020 },
    { id: '14', arete: 'VC-104', nombre: 'Coronela', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 2650 },
    { id: '15', arete: 'VC-115', nombre: 'Muñeca', raza: 'Girolando', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.1, valor: 3850 },
    { id: '16', arete: 'VC-120', nombre: 'Zafiro', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 5310 },
    { id: '17', arete: 'VC-122', nombre: 'Esmeralda', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.2, valor: 5120 },
    { id: '18', arete: 'VC-130', nombre: 'Flor de Loto', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.7, valor: 3340 },
    { id: '19', arete: 'VC-135', nombre: 'Centella', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 4180 },
    { id: '20', arete: 'VC-140', nombre: 'Cariñosa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.5, valor: 2950 },
    { id: '21', arete: 'H-301', nombre: 'Holandesa 301', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 5600 },
    { id: '22', arete: 'H-302', nombre: 'Holandesa 302', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.5, valor: 3480 },
    { id: '23', arete: 'H-303', nombre: 'Holandesa 303', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.0, valor: 4420 },
    { id: '24', arete: 'G-401', nombre: 'Gloriosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.6, valor: 4950 },
    { id: '25', arete: 'G-402', nombre: 'Granadina', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 4320 },
    { id: '26', arete: 'G-403', nombre: 'Galana', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 4210 },
    { id: '27', arete: 'G-404', nombre: 'Gaviota', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.2, valor: 3550 },
    { id: '28', arete: 'G-405', nombre: 'Genovesa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.0, valor: 2780 },
    { id: '29', arete: 'M-501', nombre: 'Mantecosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.3, valor: 5240 },
    { id: '30', arete: 'M-502', nombre: 'Morenita', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 4620 },
    { id: '31', arete: 'M-503', nombre: 'Majestuosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 6100 },
    { id: '32', arete: 'CW015', nombre: 'Dulcinea', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 4780 },
    { id: '33', arete: 'CW016', nombre: 'Campesina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 4100 },
    { id: '34', arete: 'CW017', nombre: 'Sirena', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.6, valor: 5350 },
    { id: '35', arete: 'CW018', nombre: 'Preciosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.8, valor: 5050 },
    { id: '36', arete: 'CW019', nombre: 'Perla Negra', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 4380 },
    { id: '37', arete: 'CW020', nombre: 'Alondra', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.2, valor: 4690 },
    { id: '38', arete: 'CW021', nombre: 'Aurora', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 2580 },
    { id: '39', arete: 'CW022', nombre: 'Bambina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 3880 },
    { id: '40', arete: 'CW023', nombre: 'Cantinera', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 4820 },
    { id: '41', arete: 'CW024', nombre: 'Diosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 5720 },
    { id: '42', arete: 'CW025', nombre: 'Hechicera', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.7, valor: 4150 },
    { id: '43', arete: 'CW026', nombre: 'Milenaria II', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.4, valor: 4400 },
    { id: '44', arete: 'CW027', nombre: 'Primavera', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 4290 },
    { id: '45', arete: 'CW028', nombre: 'Soberana', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 5180 }
  ],
  gdp: [
    { id: '1', arete: 'T-01', nombre: 'Titan 01', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 680 },
    { id: '2', arete: 'T-02', nombre: 'Titan 02', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.1, valor: 740 },
    { id: '3', arete: 'T-03', nombre: 'Titan 03', raza: 'Girolando', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.3, valor: 810 },
    { id: '4', arete: 'T-04', nombre: 'Titan 04', raza: 'Gyr Lechero', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 610 },
    { id: '5', arete: 'T-05', nombre: 'Titan 05', raza: 'Brahman', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.4, valor: 890 },
    { id: '6', arete: 'B-101', nombre: 'Becerro 101', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 760 },
    { id: '7', arete: 'B-102', nombre: 'Becerro 102', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 520 },
    { id: '8', arete: 'B-103', nombre: 'Becerro 103', raza: 'Holstein', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 940 },
    { id: '9', arete: 'B-104', nombre: 'Becerro 104', raza: 'Gyr Lechero', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.6, valor: 580 },
    { id: '10', arete: 'B-105', nombre: 'Becerro 105', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 870 },
    { id: '11', arete: 'NV-201', nombre: 'Novillo 201', raza: 'Brahman', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.1, valor: 980 },
    { id: '12', arete: 'NV-202', nombre: 'Novillo 202', raza: 'Carora', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.0, valor: 750 },
    { id: '13', arete: 'NV-203', nombre: 'Novillo 203', raza: 'Girolando', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.2, valor: 830 },
    { id: '14', arete: 'NV-204', nombre: 'Novillo 204', raza: 'Gyr Lechero', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.9, valor: 640 },
    { id: '15', arete: 'NV-205', nombre: 'Novillo 205', raza: 'Brahman', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.3, valor: 1040 },
    { id: '16', arete: 'NV-206', nombre: 'Novillo 206', raza: 'Holstein', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.0, valor: 860 },
    { id: '17', arete: 'NV-207', nombre: 'Novillo 207', raza: 'Carora', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.1, valor: 710 },
    { id: '18', arete: 'NV-208', nombre: 'Novillo 208', raza: 'Brahman', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.2, valor: 920 },
    { id: '19', arete: 'NV-209', nombre: 'Novillo 209', raza: 'Girolando', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.8, valor: 790 },
    { id: '20', arete: 'NV-210', nombre: 'Novillo 210', raza: 'Gyr Lechero', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.0, valor: 590 },
    { id: '21', arete: 'CW013', nombre: 'Triunfadora', raza: 'Carora', categoria: 'Novilla', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 2.3, valor: 730 },
    { id: '22', arete: 'VC-115', nombre: 'Muñeca', raza: 'Girolando', categoria: 'Novilla', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 2.1, valor: 780 },
    { id: '23', arete: 'G-404', nombre: 'Gaviota', raza: 'Carora', categoria: 'Novilla', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 2.2, valor: 560 },
    { id: '24', arete: 'MT-11', nombre: 'Maute 11', raza: 'Brahman', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 910 },
    { id: '25', arete: 'MT-12', nombre: 'Maute 12', raza: 'Carora', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.6, valor: 690 },
    { id: '26', arete: 'MT-13', nombre: 'Maute 13', raza: 'Girolando', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.4, valor: 820 },
    { id: '27', arete: 'MT-14', nombre: 'Maute 14', raza: 'Holstein', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 850 },
    { id: '28', arete: 'MT-15', nombre: 'Maute 15', raza: 'Gyr Lechero', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.6, valor: 620 },
    { id: '29', arete: 'MT-16', nombre: 'Maute 16', raza: 'Brahman', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.7, valor: 1010 },
    { id: '30', arete: 'MT-17', nombre: 'Maute 17', raza: 'Carora', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 720 },
    { id: '31', arete: 'MT-18', nombre: 'Maute 18', raza: 'Girolando', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.6, valor: 840 },
    { id: '32', arete: 'MT-19', nombre: 'Maute 19', raza: 'Brahman', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.4, valor: 880 },
    { id: '33', arete: 'MT-20', nombre: 'Maute 20', raza: 'Carora', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 670 },
    { id: '34', arete: 'T-06', nombre: 'Titan 06', raza: 'Holstein', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.3, valor: 800 },
    { id: '35', arete: 'T-07', nombre: 'Titan 07', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 710 },
    { id: '36', arete: 'T-08', nombre: 'Titan 08', raza: 'Gyr Lechero', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.1, valor: 630 },
    { id: '37', arete: 'T-09', nombre: 'Titan 09', raza: 'Brahman', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.4, valor: 860 },
    { id: '38', arete: 'T-10', nombre: 'Titan 10', raza: 'Girolando', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 770 },
    { id: '39', arete: 'B-106', nombre: 'Becerro 106', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 740 },
    { id: '40', arete: 'B-107', nombre: 'Becerro 107', raza: 'Holstein', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 900 },
    { id: '41', arete: 'B-108', nombre: 'Becerro 108', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.9, valor: 930 },
    { id: '42', arete: 'B-109', nombre: 'Becerro 109', raza: 'Gyr Lechero', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.6, valor: 540 },
    { id: '43', arete: 'B-110', nombre: 'Becerro 110', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 690 },
    { id: '44', arete: 'B-111', nombre: 'Becerro 111', raza: 'Girolando', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 810 },
    { id: '45', arete: 'B-112', nombre: 'Becerro 112', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 1080 }
  ],
  iep: [
    { id: '1', arete: '0001', nombre: 'Mariposa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.4, valor: 382 },
    { id: '2', arete: '0002', nombre: 'Esperanza', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 368 },
    { id: '3', arete: 'CW002', nombre: 'Baronesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.1, valor: 412 },
    { id: '4', arete: 'CW003', nombre: 'Reina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.9, valor: 395 },
    { id: '5', arete: 'CW004', nombre: 'Princesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.8, valor: 374 },
    { id: '6', arete: 'CW005', nombre: 'Gitana', raza: 'Girolando', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 425 },
    { id: '7', arete: 'CW006', nombre: 'Lucero', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 448 },
    { id: '8', arete: 'CW007', nombre: 'Estrella', raza: 'Carora', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 388 },
    { id: '9', arete: 'CW008', nombre: 'Milenaria', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.3, valor: 462 },
    { id: '10', arete: 'CW009', nombre: 'Bandida', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 478 },
    { id: '11', arete: 'CW010', nombre: 'Paloma', raza: 'Carora', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 404 },
    { id: '12', arete: 'VC-88', nombre: 'Sombra', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 362 },
    { id: '13', arete: 'VC-104', nombre: 'Coronela', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 456 },
    { id: '14', arete: 'VC-120', nombre: 'Zafiro', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 370 },
    { id: '15', arete: 'VC-122', nombre: 'Esmeralda', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.2, valor: 376 },
    { id: '16', arete: 'VC-130', nombre: 'Flor de Loto', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.7, valor: 485 },
    { id: '17', arete: 'VC-135', nombre: 'Centella', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 418 },
    { id: '18', arete: 'VC-140', nombre: 'Cariñosa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.5, valor: 434 },
    { id: '19', arete: 'H-301', nombre: 'Holandesa 301', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 430 },
    { id: '20', arete: 'H-302', nombre: 'Holandesa 302', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.5, valor: 492 },
    { id: '21', arete: 'H-303', nombre: 'Holandesa 303', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.0, valor: 415 },
    { id: '22', arete: 'G-401', nombre: 'Gloriosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.6, valor: 366 },
    { id: '23', arete: 'G-402', nombre: 'Granadina', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 390 },
    { id: '24', arete: 'G-403', nombre: 'Galana', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 422 },
    { id: '25', arete: 'G-405', nombre: 'Genovesa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.0, valor: 442 },
    { id: '26', arete: 'M-501', nombre: 'Mantecosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.3, valor: 378 },
    { id: '27', arete: 'M-502', nombre: 'Morenita', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 428 },
    { id: '28', arete: 'M-503', nombre: 'Majestuosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 450 },
    { id: '29', arete: 'CW015', nombre: 'Dulcinea', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 384 },
    { id: '30', arete: 'CW016', nombre: 'Campesina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 408 },
    { id: '31', arete: 'CW017', nombre: 'Sirena', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.6, valor: 468 },
    { id: '32', arete: 'CW018', nombre: 'Preciosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.8, valor: 372 },
    { id: '33', arete: 'CW019', nombre: 'Perla Negra', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 414 },
    { id: '34', arete: 'CW020', nombre: 'Alondra', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.2, valor: 392 },
    { id: '35', arete: 'CW021', nombre: 'Aurora', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 472 },
    { id: '36', arete: 'CW022', nombre: 'Bambina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 400 },
    { id: '37', arete: 'CW023', nombre: 'Cantinera', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 380 },
    { id: '38', arete: 'CW024', nombre: 'Diosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 436 },
    { id: '39', arete: 'CW025', nombre: 'Hechicera', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.7, valor: 410 },
    { id: '40', arete: 'CW026', nombre: 'Milenaria II', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.4, valor: 386 },
    { id: '41', arete: 'CW027', nombre: 'Primavera', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 398 },
    { id: '42', arete: 'CW028', nombre: 'Soberana', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 364 },
    { id: '43', arete: 'CW029', nombre: 'Amapola', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 389 },
    { id: '44', arete: 'CW030', nombre: 'Candelaria', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 420 },
    { id: '45', arete: 'CW031', nombre: 'Camelia', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 460 }
  ],

  // 🐔 Aves de corral
  postura_pct: [
    { id: 'AVE-P-1', arete: 'AVE-P001', nombre: 'Lohmann Oro', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.2, valor: 86.8 },
    { id: 'AVE-P-2', arete: 'AVE-P002', nombre: 'HyLine Ultra', raza: 'Hy-Line Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.4, valor: 88.2 },
    { id: 'AVE-P-3', arete: 'AVE-P003', nombre: 'Isa Sol', raza: 'Isa Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.6, valor: 89.1 },
    { id: 'AVE-P-4', arete: 'AVE-P004', nombre: 'Dekalb Alba', raza: 'Dekalb White', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.8, valor: 89.8 },
    { id: 'AVE-P-5', arete: 'AVE-P005', nombre: 'Leghorn Prime', raza: 'Leghorn', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 2, valor: 90.4 },
    { id: 'AVE-P-6', arete: 'AVE-P006', nombre: 'Cobb Fuerte', raza: 'Lohmann Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.2, valor: 91 },
    { id: 'AVE-P-7', arete: 'AVE-P007', nombre: 'Ross Pluma', raza: 'Hy-Line Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.4, valor: 91.5 },
    { id: 'AVE-P-8', arete: 'AVE-P008', nombre: 'Hubbard Robusta', raza: 'Isa Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.6, valor: 91.8 },
    { id: 'AVE-P-9', arete: 'AVE-P009', nombre: 'Arbor Ámbar', raza: 'Dekalb White', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.8, valor: 92.2 },
    { id: 'AVE-P-10', arete: 'AVE-P010', nombre: 'Perla Marrón', raza: 'Leghorn', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 2, valor: 92.5 },
    { id: 'AVE-P-11', arete: 'AVE-P011', nombre: 'Lohmann Ruby', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.2, valor: 92.8 },
    { id: 'AVE-P-12', arete: 'AVE-P012', nombre: 'HyLine Star', raza: 'Hy-Line Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.4, valor: 93 },
    { id: 'AVE-P-13', arete: 'AVE-P013', nombre: 'Isa Reina', raza: 'Isa Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.6, valor: 93.2 },
    { id: 'AVE-P-14', arete: 'AVE-P014', nombre: 'Dekalb Nieve', raza: 'Dekalb White', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.8, valor: 93.5 },
    { id: 'AVE-P-15', arete: 'AVE-P015', nombre: 'Leghorn Alba', raza: 'Leghorn', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 2, valor: 93.7 },
    { id: 'AVE-P-16', arete: 'AVE-P016', nombre: 'Lohmann Oro 2', raza: 'Lohmann Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.2, valor: 93.9 },
    { id: 'AVE-P-17', arete: 'AVE-P017', nombre: 'HyLine Ultra 2', raza: 'Hy-Line Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.4, valor: 94.1 },
    { id: 'AVE-P-18', arete: 'AVE-P018', nombre: 'Isa Sol 2', raza: 'Isa Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.6, valor: 94.3 },
    { id: 'AVE-P-19', arete: 'AVE-P019', nombre: 'Dekalb Alba 2', raza: 'Dekalb White', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.8, valor: 94.5 },
    { id: 'AVE-P-20', arete: 'AVE-P020', nombre: 'Leghorn Prime 2', raza: 'Leghorn', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 2, valor: 94.7 },
    { id: 'AVE-P-21', arete: 'AVE-P021', nombre: 'Cobb Fuerte 2', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.2, valor: 94.9 },
    { id: 'AVE-P-22', arete: 'AVE-P022', nombre: 'Ross Pluma 2', raza: 'Hy-Line Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.4, valor: 95.1 },
    { id: 'AVE-P-23', arete: 'AVE-P023', nombre: 'Hubbard Robusta 2', raza: 'Isa Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.6, valor: 95.3 },
    { id: 'AVE-P-24', arete: 'AVE-P024', nombre: 'Arbor Ámbar 2', raza: 'Dekalb White', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.8, valor: 95.5 },
    { id: 'AVE-P-25', arete: 'AVE-P025', nombre: 'Perla Marrón 2', raza: 'Leghorn', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 2, valor: 95.7 },
    { id: 'AVE-P-26', arete: 'AVE-P026', nombre: 'Lohmann Ruby 2', raza: 'Lohmann Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.2, valor: 95.9 },
    { id: 'AVE-P-27', arete: 'AVE-P027', nombre: 'HyLine Star 2', raza: 'Hy-Line Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.4, valor: 96.1 },
    { id: 'AVE-P-28', arete: 'AVE-P028', nombre: 'Isa Reina 2', raza: 'Isa Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.6, valor: 96.3 },
    { id: 'AVE-P-29', arete: 'AVE-P029', nombre: 'Dekalb Nieve 2', raza: 'Dekalb White', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.8, valor: 96.5 },
    { id: 'AVE-P-30', arete: 'AVE-P030', nombre: 'Leghorn Alba 2', raza: 'Leghorn', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 2, valor: 96.7 },
    { id: 'AVE-P-31', arete: 'AVE-P031', nombre: 'Lohmann Oro 3', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.2, valor: 97 },
    { id: 'AVE-P-32', arete: 'AVE-P032', nombre: 'HyLine Ultra 3', raza: 'Hy-Line Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.4, valor: 97.2 },
    { id: 'AVE-P-33', arete: 'AVE-P033', nombre: 'Isa Sol 3', raza: 'Isa Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.6, valor: 97.4 },
    { id: 'AVE-P-34', arete: 'AVE-P034', nombre: 'Dekalb Alba 3', raza: 'Dekalb White', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.8, valor: 97.6 },
    { id: 'AVE-P-35', arete: 'AVE-P035', nombre: 'Leghorn Prime 3', raza: 'Leghorn', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 2, valor: 97.8 },
    { id: 'AVE-P-36', arete: 'AVE-P036', nombre: 'Cobb Fuerte 3', raza: 'Lohmann Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 1.2, valor: 98 },
    { id: 'AVE-P-37', arete: 'AVE-P037', nombre: 'Ross Pluma 3', raza: 'Hy-Line Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón 01 - Postura', sexo: 'Hembra', edadAnos: 1.4, valor: 98.2 },
    { id: 'AVE-P-38', arete: 'AVE-P038', nombre: 'Hubbard Robusta 3', raza: 'Isa Brown', categoria: 'Aves Reproductoras', lote: 'Galpón 02 - Postura', sexo: 'Hembra', edadAnos: 1.6, valor: 98.4 },
    { id: 'AVE-P-39', arete: 'AVE-P039', nombre: 'Arbor Ámbar 3', raza: 'Dekalb White', categoria: 'Gallinas Ponedoras', lote: 'Galpón 03 - Postura', sexo: 'Hembra', edadAnos: 1.8, valor: 98.6 },
    { id: 'AVE-P-40', arete: 'AVE-P040', nombre: 'Perla Marrón 3', raza: 'Leghorn', categoria: 'Aves Reproductoras', lote: 'Galpón 04 - Reproductoras', sexo: 'Hembra', edadAnos: 2, valor: 98.8 }
  ],
  peso_faena_pollo: [
    { id: 'POL-F-1', arete: 'POL-F001', nombre: 'Cobb Titan', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 2240 },
    { id: 'POL-F-2', arete: 'POL-F002', nombre: 'Ross Max', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 2310 },
    { id: 'POL-F-3', arete: 'POL-F003', nombre: 'Hubbard Gold', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Macho', edadAnos: 0.12, valor: 2360 },
    { id: 'POL-F-4', arete: 'POL-F004', nombre: 'Arbor Power', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 2410 },
    { id: 'POL-F-5', arete: 'POL-F005', nombre: 'Cobb Super', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 2440 },
    { id: 'POL-F-6', arete: 'POL-F006', nombre: 'Ross Premium', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Hembra', edadAnos: 0.12, valor: 2470 },
    { id: 'POL-F-7', arete: 'POL-F007', nombre: 'Hubbard Flex', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 2500 },
    { id: 'POL-F-8', arete: 'POL-F008', nombre: 'Arbor Prime', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 2520 },
    { id: 'POL-F-9', arete: 'POL-F009', nombre: 'Cobb Gigante', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Macho', edadAnos: 0.12, valor: 2550 },
    { id: 'POL-F-10', arete: 'POL-F010', nombre: 'Ross Campeón', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 2570 },
    { id: 'POL-F-11', arete: 'POL-F011', nombre: 'Cobb Titan 2', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 2590 },
    { id: 'POL-F-12', arete: 'POL-F012', nombre: 'Ross Max 2', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Hembra', edadAnos: 0.12, valor: 2610 },
    { id: 'POL-F-13', arete: 'POL-F013', nombre: 'Hubbard Gold 2', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 2620 },
    { id: 'POL-F-14', arete: 'POL-F014', nombre: 'Arbor Power 2', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 2640 },
    { id: 'POL-F-15', arete: 'POL-F015', nombre: 'Cobb Super 2', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Macho', edadAnos: 0.12, valor: 2650 },
    { id: 'POL-F-16', arete: 'POL-F016', nombre: 'Ross Premium 2', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 2660 },
    { id: 'POL-F-17', arete: 'POL-F017', nombre: 'Hubbard Flex 2', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 2670 },
    { id: 'POL-F-18', arete: 'POL-F018', nombre: 'Arbor Prime 2', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Hembra', edadAnos: 0.12, valor: 2680 },
    { id: 'POL-F-19', arete: 'POL-F019', nombre: 'Cobb Gigante 2', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 2690 },
    { id: 'POL-F-20', arete: 'POL-F020', nombre: 'Ross Campeón 2', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 2700 },
    { id: 'POL-F-21', arete: 'POL-F021', nombre: 'Cobb Titan 3', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Macho', edadAnos: 0.12, valor: 2710 },
    { id: 'POL-F-22', arete: 'POL-F022', nombre: 'Ross Max 3', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 2720 },
    { id: 'POL-F-23', arete: 'POL-F023', nombre: 'Hubbard Gold 3', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 2730 },
    { id: 'POL-F-24', arete: 'POL-F024', nombre: 'Arbor Power 3', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Hembra', edadAnos: 0.12, valor: 2740 },
    { id: 'POL-F-25', arete: 'POL-F025', nombre: 'Cobb Super 3', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 2750 },
    { id: 'POL-F-26', arete: 'POL-F026', nombre: 'Ross Premium 3', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 2770 },
    { id: 'POL-F-27', arete: 'POL-F027', nombre: 'Hubbard Flex 3', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Macho', edadAnos: 0.12, valor: 2780 },
    { id: 'POL-F-28', arete: 'POL-F028', nombre: 'Arbor Prime 3', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 2790 },
    { id: 'POL-F-29', arete: 'POL-F029', nombre: 'Cobb Gigante 3', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 2810 },
    { id: 'POL-F-30', arete: 'POL-F030', nombre: 'Ross Campeón 3', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Hembra', edadAnos: 0.12, valor: 2820 },
    { id: 'POL-F-31', arete: 'POL-F031', nombre: 'Cobb Titan 4', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 2840 },
    { id: 'POL-F-32', arete: 'POL-F032', nombre: 'Ross Max 4', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 2860 },
    { id: 'POL-F-33', arete: 'POL-F033', nombre: 'Hubbard Gold 4', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Macho', edadAnos: 0.12, valor: 2880 },
    { id: 'POL-F-34', arete: 'POL-F034', nombre: 'Arbor Power 4', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 2900 },
    { id: 'POL-F-35', arete: 'POL-F035', nombre: 'Cobb Super 4', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 2920 },
    { id: 'POL-F-36', arete: 'POL-F036', nombre: 'Ross Premium 4', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Hembra', edadAnos: 0.12, valor: 2940 },
    { id: 'POL-F-37', arete: 'POL-F037', nombre: 'Hubbard Flex 4', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 2960 },
    { id: 'POL-F-38', arete: 'POL-F038', nombre: 'Arbor Prime 4', raza: 'Ross 308', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 2980 },
    { id: 'POL-F-39', arete: 'POL-F039', nombre: 'Cobb Gigante 4', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 03', sexo: 'Macho', edadAnos: 0.12, valor: 3010 },
    { id: 'POL-F-40', arete: 'POL-F040', nombre: 'Ross Campeón 4', raza: 'Arbor Acres', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 3040 }
  ],
  ica_avicola: [
    { id: 'ICA-AV-1', arete: 'ICA-AV001', nombre: 'Lote Conversión A', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 1.49 },
    { id: 'ICA-AV-2', arete: 'ICA-AV002', nombre: 'Lote Conversión B', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 1.52 },
    { id: 'ICA-AV-3', arete: 'ICA-AV003', nombre: 'Lote Rendimiento C', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Postura 01', sexo: 'Macho', edadAnos: 1.4, valor: 1.54 },
    { id: 'ICA-AV-4', arete: 'ICA-AV004', nombre: 'Lote Eficiente D', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 1.55 },
    { id: 'ICA-AV-5', arete: 'ICA-AV005', nombre: 'Lote Balanceado E', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 1.56 },
    { id: 'ICA-AV-6', arete: 'ICA-AV006', nombre: 'Lote Crecimiento F', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Postura 01', sexo: 'Hembra', edadAnos: 1.4, valor: 1.57 },
    { id: 'ICA-AV-7', arete: 'ICA-AV007', nombre: 'Lote Genética G', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 1.58 },
    { id: 'ICA-AV-8', arete: 'ICA-AV008', nombre: 'Lote Bioeficiencia H', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 1.59 },
    { id: 'ICA-AV-9', arete: 'ICA-AV009', nombre: 'Lote Conversión A 2', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Postura 01', sexo: 'Macho', edadAnos: 1.4, valor: 1.6 },
    { id: 'ICA-AV-10', arete: 'ICA-AV010', nombre: 'Lote Conversión B 2', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 1.61 },
    { id: 'ICA-AV-11', arete: 'ICA-AV011', nombre: 'Lote Rendimiento C 2', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 1.61 },
    { id: 'ICA-AV-12', arete: 'ICA-AV012', nombre: 'Lote Eficiente D 2', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Postura 01', sexo: 'Hembra', edadAnos: 1.4, valor: 1.62 },
    { id: 'ICA-AV-13', arete: 'ICA-AV013', nombre: 'Lote Balanceado E 2', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 1.62 },
    { id: 'ICA-AV-14', arete: 'ICA-AV014', nombre: 'Lote Crecimiento F 2', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 1.63 },
    { id: 'ICA-AV-15', arete: 'ICA-AV015', nombre: 'Lote Genética G 2', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Postura 01', sexo: 'Macho', edadAnos: 1.4, valor: 1.63 },
    { id: 'ICA-AV-16', arete: 'ICA-AV016', nombre: 'Lote Bioeficiencia H 2', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 1.64 },
    { id: 'ICA-AV-17', arete: 'ICA-AV017', nombre: 'Lote Conversión A 3', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 1.64 },
    { id: 'ICA-AV-18', arete: 'ICA-AV018', nombre: 'Lote Conversión B 3', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Postura 01', sexo: 'Hembra', edadAnos: 1.4, valor: 1.65 },
    { id: 'ICA-AV-19', arete: 'ICA-AV019', nombre: 'Lote Rendimiento C 3', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 1.65 },
    { id: 'ICA-AV-20', arete: 'ICA-AV020', nombre: 'Lote Eficiente D 3', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 1.65 },
    { id: 'ICA-AV-21', arete: 'ICA-AV021', nombre: 'Lote Balanceado E 3', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Postura 01', sexo: 'Macho', edadAnos: 1.4, valor: 1.66 },
    { id: 'ICA-AV-22', arete: 'ICA-AV022', nombre: 'Lote Crecimiento F 3', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 1.66 },
    { id: 'ICA-AV-23', arete: 'ICA-AV023', nombre: 'Lote Genética G 3', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 1.67 },
    { id: 'ICA-AV-24', arete: 'ICA-AV024', nombre: 'Lote Bioeficiencia H 3', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Postura 01', sexo: 'Hembra', edadAnos: 1.4, valor: 1.67 },
    { id: 'ICA-AV-25', arete: 'ICA-AV025', nombre: 'Lote Conversión A 4', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 1.68 },
    { id: 'ICA-AV-26', arete: 'ICA-AV026', nombre: 'Lote Conversión B 4', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 1.68 },
    { id: 'ICA-AV-27', arete: 'ICA-AV027', nombre: 'Lote Rendimiento C 4', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Postura 01', sexo: 'Macho', edadAnos: 1.4, valor: 1.69 },
    { id: 'ICA-AV-28', arete: 'ICA-AV028', nombre: 'Lote Eficiente D 4', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 1.69 },
    { id: 'ICA-AV-29', arete: 'ICA-AV029', nombre: 'Lote Balanceado E 4', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 1.7 },
    { id: 'ICA-AV-30', arete: 'ICA-AV030', nombre: 'Lote Crecimiento F 4', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Postura 01', sexo: 'Hembra', edadAnos: 1.4, valor: 1.71 },
    { id: 'ICA-AV-31', arete: 'ICA-AV031', nombre: 'Lote Genética G 4', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 1.71 },
    { id: 'ICA-AV-32', arete: 'ICA-AV032', nombre: 'Lote Bioeficiencia H 4', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 1.72 },
    { id: 'ICA-AV-33', arete: 'ICA-AV033', nombre: 'Lote Conversión A 5', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Postura 01', sexo: 'Macho', edadAnos: 1.4, valor: 1.73 },
    { id: 'ICA-AV-34', arete: 'ICA-AV034', nombre: 'Lote Conversión B 5', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 1.74 },
    { id: 'ICA-AV-35', arete: 'ICA-AV035', nombre: 'Lote Rendimiento C 5', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 02', sexo: 'Macho', edadAnos: 0.12, valor: 1.75 },
    { id: 'ICA-AV-36', arete: 'ICA-AV036', nombre: 'Lote Eficiente D 5', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Postura 01', sexo: 'Hembra', edadAnos: 1.4, valor: 1.76 },
    { id: 'ICA-AV-37', arete: 'ICA-AV037', nombre: 'Lote Balanceado E 5', raza: 'Cobb 500', categoria: 'Pollos de Engorde', lote: 'Galpón Ceba 01', sexo: 'Macho', edadAnos: 0.12, valor: 1.77 },
    { id: 'ICA-AV-38', arete: 'ICA-AV038', nombre: 'Lote Crecimiento F 5', raza: 'Ross 308', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 02', sexo: 'Hembra', edadAnos: 0.12, valor: 1.79 },
    { id: 'ICA-AV-39', arete: 'ICA-AV039', nombre: 'Lote Genética G 5', raza: 'Hubbard Flex', categoria: 'Pollos de Engorde', lote: 'Galpón Postura 01', sexo: 'Macho', edadAnos: 1.4, valor: 1.81 },
    { id: 'ICA-AV-40', arete: 'ICA-AV040', nombre: 'Lote Bioeficiencia H 5', raza: 'Lohmann Brown', categoria: 'Gallinas Ponedoras', lote: 'Galpón Ceba 01', sexo: 'Hembra', edadAnos: 0.12, valor: 1.83 }
  ],

  // 🐷 Porcinos
  lnv_camada: [
    { id: 'POR-M-1', arete: 'POR-M001', nombre: 'Matrona Real', raza: 'Landrace', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 1.8, valor: 10 },
    { id: 'POR-M-2', arete: 'POR-M002', nombre: 'Duquesa F1', raza: 'Yorkshire', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 2.2, valor: 11 },
    { id: 'POR-M-3', arete: 'POR-M003', nombre: 'Pandora Camborough', raza: 'F1 Camborough', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 2.7, valor: 11 },
    { id: 'POR-M-4', arete: 'POR-M004', nombre: 'Bella Vista', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 3.1, valor: 12 },
    { id: 'POR-M-5', arete: 'POR-M005', nombre: 'Reina Landrace', raza: 'Duroc', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 3.5, valor: 12 },
    { id: 'POR-M-6', arete: 'POR-M006', nombre: 'Sultana York', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 1.8, valor: 12 },
    { id: 'POR-M-7', arete: 'POR-M007', nombre: 'Emperatriz', raza: 'Yorkshire', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 2.2, valor: 13 },
    { id: 'POR-M-8', arete: 'POR-M008', nombre: 'Victoria', raza: 'F1 Camborough', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 2.7, valor: 13 },
    { id: 'POR-M-9', arete: 'POR-M009', nombre: 'Atenea', raza: 'Large White', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 3.1, valor: 13 },
    { id: 'POR-M-10', arete: 'POR-M010', nombre: 'Cleopatra', raza: 'Duroc', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 3.5, valor: 13 },
    { id: 'POR-M-11', arete: 'POR-M011', nombre: 'Diana', raza: 'Landrace', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 1.8, valor: 14 },
    { id: 'POR-M-12', arete: 'POR-M012', nombre: 'Minerva', raza: 'Yorkshire', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 2.2, valor: 14 },
    { id: 'POR-M-13', arete: 'POR-M013', nombre: 'Olimpia', raza: 'F1 Camborough', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 2.7, valor: 14 },
    { id: 'POR-M-14', arete: 'POR-M014', nombre: 'Valquiria', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 3.1, valor: 14 },
    { id: 'POR-M-15', arete: 'POR-M015', nombre: 'Dafne', raza: 'Duroc', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 3.5, valor: 14 },
    { id: 'POR-M-16', arete: 'POR-M016', nombre: 'Matrona Real 2', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 1.8, valor: 14 },
    { id: 'POR-M-17', arete: 'POR-M017', nombre: 'Duquesa F1 2', raza: 'Yorkshire', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 2.2, valor: 15 },
    { id: 'POR-M-18', arete: 'POR-M018', nombre: 'Pandora Camborough 2', raza: 'F1 Camborough', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 2.7, valor: 15 },
    { id: 'POR-M-19', arete: 'POR-M019', nombre: 'Bella Vista 2', raza: 'Large White', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 3.1, valor: 15 },
    { id: 'POR-M-20', arete: 'POR-M020', nombre: 'Reina Landrace 2', raza: 'Duroc', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 3.5, valor: 15 },
    { id: 'POR-M-21', arete: 'POR-M021', nombre: 'Sultana York 2', raza: 'Landrace', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 1.8, valor: 15 },
    { id: 'POR-M-22', arete: 'POR-M022', nombre: 'Emperatriz 2', raza: 'Yorkshire', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 2.2, valor: 15 },
    { id: 'POR-M-23', arete: 'POR-M023', nombre: 'Victoria 2', raza: 'F1 Camborough', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 2.7, valor: 15 },
    { id: 'POR-M-24', arete: 'POR-M024', nombre: 'Atenea 2', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 3.1, valor: 15 },
    { id: 'POR-M-25', arete: 'POR-M025', nombre: 'Cleopatra 2', raza: 'Duroc', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 3.5, valor: 16 },
    { id: 'POR-M-26', arete: 'POR-M026', nombre: 'Diana 2', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 1.8, valor: 16 },
    { id: 'POR-M-27', arete: 'POR-M027', nombre: 'Minerva 2', raza: 'Yorkshire', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 2.2, valor: 16 },
    { id: 'POR-M-28', arete: 'POR-M028', nombre: 'Olimpia 2', raza: 'F1 Camborough', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 2.7, valor: 16 },
    { id: 'POR-M-29', arete: 'POR-M029', nombre: 'Valquiria 2', raza: 'Large White', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 3.1, valor: 16 },
    { id: 'POR-M-30', arete: 'POR-M030', nombre: 'Dafne 2', raza: 'Duroc', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 3.5, valor: 16 },
    { id: 'POR-M-31', arete: 'POR-M031', nombre: 'Matrona Real 3', raza: 'Landrace', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 1.8, valor: 16 },
    { id: 'POR-M-32', arete: 'POR-M032', nombre: 'Duquesa F1 3', raza: 'Yorkshire', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 2.2, valor: 17 },
    { id: 'POR-M-33', arete: 'POR-M033', nombre: 'Pandora Camborough 3', raza: 'F1 Camborough', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 2.7, valor: 17 },
    { id: 'POR-M-34', arete: 'POR-M034', nombre: 'Bella Vista 3', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 3.1, valor: 17 },
    { id: 'POR-M-35', arete: 'POR-M035', nombre: 'Reina Landrace 3', raza: 'Duroc', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 3.5, valor: 17 },
    { id: 'POR-M-36', arete: 'POR-M036', nombre: 'Sultana York 3', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 1.8, valor: 17 },
    { id: 'POR-M-37', arete: 'POR-M037', nombre: 'Emperatriz 3', raza: 'Yorkshire', categoria: 'Cerdas Reproductoras', lote: 'Maternidad 01', sexo: 'Hembra', edadAnos: 2.2, valor: 18 },
    { id: 'POR-M-38', arete: 'POR-M038', nombre: 'Victoria 3', raza: 'F1 Camborough', categoria: 'Cerdas de Reemplazo', lote: 'Maternidad 02', sexo: 'Hembra', edadAnos: 2.7, valor: 18 },
    { id: 'POR-M-39', arete: 'POR-M039', nombre: 'Atenea 3', raza: 'Large White', categoria: 'Cerdas Reproductoras', lote: 'Gestación 01', sexo: 'Hembra', edadAnos: 3.1, valor: 18 },
    { id: 'POR-M-40', arete: 'POR-M040', nombre: 'Cleopatra 3', raza: 'Duroc', categoria: 'Cerdas de Reemplazo', lote: 'Gestación 02', sexo: 'Hembra', edadAnos: 3.5, valor: 18 }
  ],
  gdp_porcina: [
    { id: 'POR-C-1', arete: 'POR-C001', nombre: 'Cerdito Max', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.42, valor: 730 },
    { id: 'POR-C-2', arete: 'POR-C002', nombre: 'Duroc Power', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 760 },
    { id: 'POR-C-3', arete: 'POR-C003', nombre: 'Topigs Fuerte', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Macho', edadAnos: 0.48, valor: 780 },
    { id: 'POR-C-4', arete: 'POR-C004', nombre: 'Pietrain Sprint', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Hembra', edadAnos: 0.42, valor: 800 },
    { id: 'POR-C-5', arete: 'POR-C005', nombre: 'York Ceba', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Macho', edadAnos: 0.45, valor: 810 },
    { id: 'POR-C-6', arete: 'POR-C006', nombre: 'Land Crecimiento', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Hembra', edadAnos: 0.48, valor: 820 },
    { id: 'POR-C-7', arete: 'POR-C007', nombre: 'Lechón Titán', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.42, valor: 830 },
    { id: 'POR-C-8', arete: 'POR-C008', nombre: 'Gorrino Veloz', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 840 },
    { id: 'POR-C-9', arete: 'POR-C009', nombre: 'Duroc Campeón', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Macho', edadAnos: 0.48, valor: 850 },
    { id: 'POR-C-10', arete: 'POR-C010', nombre: 'Magro Plus', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Hembra', edadAnos: 0.42, valor: 855 },
    { id: 'POR-C-11', arete: 'POR-C011', nombre: 'Cerdito Max 2', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Macho', edadAnos: 0.45, valor: 860 },
    { id: 'POR-C-12', arete: 'POR-C012', nombre: 'Duroc Power 2', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Hembra', edadAnos: 0.48, valor: 865 },
    { id: 'POR-C-13', arete: 'POR-C013', nombre: 'Topigs Fuerte 2', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.42, valor: 870 },
    { id: 'POR-C-14', arete: 'POR-C014', nombre: 'Pietrain Sprint 2', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 875 },
    { id: 'POR-C-15', arete: 'POR-C015', nombre: 'York Ceba 2', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Macho', edadAnos: 0.48, valor: 880 },
    { id: 'POR-C-16', arete: 'POR-C016', nombre: 'Land Crecimiento 2', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Hembra', edadAnos: 0.42, valor: 885 },
    { id: 'POR-C-17', arete: 'POR-C017', nombre: 'Lechón Titán 2', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Macho', edadAnos: 0.45, valor: 890 },
    { id: 'POR-C-18', arete: 'POR-C018', nombre: 'Gorrino Veloz 2', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Hembra', edadAnos: 0.48, valor: 895 },
    { id: 'POR-C-19', arete: 'POR-C019', nombre: 'Duroc Campeón 2', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.42, valor: 900 },
    { id: 'POR-C-20', arete: 'POR-C020', nombre: 'Magro Plus 2', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 905 },
    { id: 'POR-C-21', arete: 'POR-C021', nombre: 'Cerdito Max 3', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Macho', edadAnos: 0.48, valor: 910 },
    { id: 'POR-C-22', arete: 'POR-C022', nombre: 'Duroc Power 3', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Hembra', edadAnos: 0.42, valor: 915 },
    { id: 'POR-C-23', arete: 'POR-C023', nombre: 'Topigs Fuerte 3', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Macho', edadAnos: 0.45, valor: 920 },
    { id: 'POR-C-24', arete: 'POR-C024', nombre: 'Pietrain Sprint 3', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Hembra', edadAnos: 0.48, valor: 925 },
    { id: 'POR-C-25', arete: 'POR-C025', nombre: 'York Ceba 3', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.42, valor: 930 },
    { id: 'POR-C-26', arete: 'POR-C026', nombre: 'Land Crecimiento 3', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 935 },
    { id: 'POR-C-27', arete: 'POR-C027', nombre: 'Lechón Titán 3', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Macho', edadAnos: 0.48, valor: 940 },
    { id: 'POR-C-28', arete: 'POR-C028', nombre: 'Gorrino Veloz 3', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Hembra', edadAnos: 0.42, valor: 945 },
    { id: 'POR-C-29', arete: 'POR-C029', nombre: 'Duroc Campeón 3', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Macho', edadAnos: 0.45, valor: 950 },
    { id: 'POR-C-30', arete: 'POR-C030', nombre: 'Magro Plus 3', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Hembra', edadAnos: 0.48, valor: 955 },
    { id: 'POR-C-31', arete: 'POR-C031', nombre: 'Cerdito Max 4', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.42, valor: 960 },
    { id: 'POR-C-32', arete: 'POR-C032', nombre: 'Duroc Power 4', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 965 },
    { id: 'POR-C-33', arete: 'POR-C033', nombre: 'Topigs Fuerte 4', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Macho', edadAnos: 0.48, valor: 970 },
    { id: 'POR-C-34', arete: 'POR-C034', nombre: 'Pietrain Sprint 4', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Hembra', edadAnos: 0.42, valor: 980 },
    { id: 'POR-C-35', arete: 'POR-C035', nombre: 'York Ceba 4', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Macho', edadAnos: 0.45, valor: 990 },
    { id: 'POR-C-36', arete: 'POR-C036', nombre: 'Land Crecimiento 4', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Hembra', edadAnos: 0.48, valor: 995 },
    { id: 'POR-C-37', arete: 'POR-C037', nombre: 'Lechón Titán 4', raza: 'Duroc x Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.42, valor: 1005 },
    { id: 'POR-C-38', arete: 'POR-C038', nombre: 'Gorrino Veloz 4', raza: 'Landrace x Yorkshire', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 1015 },
    { id: 'POR-C-39', arete: 'POR-C039', nombre: 'Duroc Campeón 4', raza: 'Topigs Norsvin', categoria: 'Cerdos de Ceba', lote: 'Desarrollo', sexo: 'Macho', edadAnos: 0.48, valor: 1025 },
    { id: 'POR-C-40', arete: 'POR-C040', nombre: 'Magro Plus 4', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Hembra', edadAnos: 0.42, valor: 1040 }
  ],
  grasa_dorsal: [
    { id: 'POR-P2-1', arete: 'POR-P2001', nombre: 'Canal Magra', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.45, valor: 8.8 },
    { id: 'POR-P2-2', arete: 'POR-P2002', nombre: 'Pietrain P2', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.5, valor: 9.2 },
    { id: 'POR-P2-3', arete: 'POR-P2003', nombre: 'Dorsal Slim', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.55, valor: 9.5 },
    { id: 'POR-P2-4', arete: 'POR-P2004', nombre: 'Lomo Magro', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 9.9 },
    { id: 'POR-P2-5', arete: 'POR-P2005', nombre: 'Línea Magra', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.5, valor: 10.2 },
    { id: 'POR-P2-6', arete: 'POR-P2006', nombre: 'Canal Selecta', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.55, valor: 10.5 },
    { id: 'POR-P2-7', arete: 'POR-P2007', nombre: 'Espesor P2', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.45, valor: 10.8 },
    { id: 'POR-P2-8', arete: 'POR-P2008', nombre: 'Corte Magro', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.5, valor: 11 },
    { id: 'POR-P2-9', arete: 'POR-P2009', nombre: 'Canal Magra 2', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.55, valor: 11.2 },
    { id: 'POR-P2-10', arete: 'POR-P2010', nombre: 'Pietrain P2 2', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 11.4 },
    { id: 'POR-P2-11', arete: 'POR-P2011', nombre: 'Dorsal Slim 2', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.5, valor: 11.6 },
    { id: 'POR-P2-12', arete: 'POR-P2012', nombre: 'Lomo Magro 2', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.55, valor: 11.8 },
    { id: 'POR-P2-13', arete: 'POR-P2013', nombre: 'Línea Magra 2', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.45, valor: 12 },
    { id: 'POR-P2-14', arete: 'POR-P2014', nombre: 'Canal Selecta 2', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.5, valor: 12.1 },
    { id: 'POR-P2-15', arete: 'POR-P2015', nombre: 'Espesor P2 2', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.55, valor: 12.3 },
    { id: 'POR-P2-16', arete: 'POR-P2016', nombre: 'Corte Magro 2', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 12.4 },
    { id: 'POR-P2-17', arete: 'POR-P2017', nombre: 'Canal Magra 3', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.5, valor: 12.5 },
    { id: 'POR-P2-18', arete: 'POR-P2018', nombre: 'Pietrain P2 3', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.55, valor: 12.6 },
    { id: 'POR-P2-19', arete: 'POR-P2019', nombre: 'Dorsal Slim 3', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.45, valor: 12.7 },
    { id: 'POR-P2-20', arete: 'POR-P2020', nombre: 'Lomo Magro 3', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.5, valor: 12.8 },
    { id: 'POR-P2-21', arete: 'POR-P2021', nombre: 'Línea Magra 3', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.55, valor: 12.9 },
    { id: 'POR-P2-22', arete: 'POR-P2022', nombre: 'Canal Selecta 3', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 13 },
    { id: 'POR-P2-23', arete: 'POR-P2023', nombre: 'Espesor P2 3', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.5, valor: 13.1 },
    { id: 'POR-P2-24', arete: 'POR-P2024', nombre: 'Corte Magro 3', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.55, valor: 13.2 },
    { id: 'POR-P2-25', arete: 'POR-P2025', nombre: 'Canal Magra 4', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.45, valor: 13.4 },
    { id: 'POR-P2-26', arete: 'POR-P2026', nombre: 'Pietrain P2 4', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.5, valor: 13.6 },
    { id: 'POR-P2-27', arete: 'POR-P2027', nombre: 'Dorsal Slim 4', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.55, valor: 13.8 },
    { id: 'POR-P2-28', arete: 'POR-P2028', nombre: 'Lomo Magro 4', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 14 },
    { id: 'POR-P2-29', arete: 'POR-P2029', nombre: 'Línea Magra 4', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.5, valor: 14.2 },
    { id: 'POR-P2-30', arete: 'POR-P2030', nombre: 'Canal Selecta 4', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.55, valor: 14.4 },
    { id: 'POR-P2-31', arete: 'POR-P2031', nombre: 'Espesor P2 4', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.45, valor: 14.6 },
    { id: 'POR-P2-32', arete: 'POR-P2032', nombre: 'Corte Magro 4', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.5, valor: 14.8 },
    { id: 'POR-P2-33', arete: 'POR-P2033', nombre: 'Canal Magra 5', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.55, valor: 15.1 },
    { id: 'POR-P2-34', arete: 'POR-P2034', nombre: 'Pietrain P2 5', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 15.4 },
    { id: 'POR-P2-35', arete: 'POR-P2035', nombre: 'Dorsal Slim 5', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.5, valor: 15.6 },
    { id: 'POR-P2-36', arete: 'POR-P2036', nombre: 'Lomo Magro 5', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.55, valor: 15.9 },
    { id: 'POR-P2-37', arete: 'POR-P2037', nombre: 'Línea Magra 5', raza: 'Pietrain', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.45, valor: 16.2 },
    { id: 'POR-P2-38', arete: 'POR-P2038', nombre: 'Canal Selecta 5', raza: 'Landrace', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.5, valor: 16.5 },
    { id: 'POR-P2-39', arete: 'POR-P2039', nombre: 'Espesor P2 5', raza: 'Duroc', categoria: 'Cerdos de Ceba', lote: 'Ceba Intensiva A', sexo: 'Macho', edadAnos: 0.55, valor: 16.8 },
    { id: 'POR-P2-40', arete: 'POR-P2040', nombre: 'Corte Magro 5', raza: 'Large White', categoria: 'Cerdas de Reemplazo', lote: 'Ceba Intensiva B', sexo: 'Hembra', edadAnos: 0.45, valor: 17.2 }
  ],

  // 🐃 Búfalos
  leche_bufala_270: [
    { id: 'BUF-L-1', arete: 'BUF-L001', nombre: 'Negra Linda', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 3.8, valor: 1920 },
    { id: 'BUF-L-2', arete: 'BUF-L002', nombre: 'Sultana del Este', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 4.5, valor: 2040 },
    { id: 'BUF-L-3', arete: 'BUF-L003', nombre: 'India Bonita', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 5.2, valor: 2120 },
    { id: 'BUF-L-4', arete: 'BUF-L004', nombre: 'Morena de Agua', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.1, valor: 2190 },
    { id: 'BUF-L-5', arete: 'BUF-L005', nombre: 'Carabao Queen', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7.4, valor: 2250 },
    { id: 'BUF-L-6', arete: 'BUF-L006', nombre: 'Pampeana', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 8.2, valor: 2310 },
    { id: 'BUF-L-7', arete: 'BUF-L007', nombre: 'Preciosa B', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 3.8, valor: 2370 },
    { id: 'BUF-L-8', arete: 'BUF-L008', nombre: 'Nilo Star', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 4.5, valor: 2420 },
    { id: 'BUF-L-9', arete: 'BUF-L009', nombre: 'Amazona', raza: 'Murrah', categoria: 'Búfalas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 5.2, valor: 2480 },
    { id: 'BUF-L-10', arete: 'BUF-L010', nombre: 'Selvática', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.1, valor: 2520 },
    { id: 'BUF-L-11', arete: 'BUF-L011', nombre: 'Ganga', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7.4, valor: 2560 },
    { id: 'BUF-L-12', arete: 'BUF-L012', nombre: 'Perla Negra B', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 8.2, valor: 2600 },
    { id: 'BUF-L-13', arete: 'BUF-L013', nombre: 'Titana Bubalina', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 3.8, valor: 2630 },
    { id: 'BUF-L-14', arete: 'BUF-L014', nombre: 'Princesa del Pantano', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 4.5, valor: 2670 },
    { id: 'BUF-L-15', arete: 'BUF-L015', nombre: 'Moza Murrah', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 5.2, valor: 2700 },
    { id: 'BUF-L-16', arete: 'BUF-L016', nombre: 'Negra Linda 2', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.1, valor: 2720 },
    { id: 'BUF-L-17', arete: 'BUF-L017', nombre: 'Sultana del Este 2', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7.4, valor: 2750 },
    { id: 'BUF-L-18', arete: 'BUF-L018', nombre: 'India Bonita 2', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 8.2, valor: 2780 },
    { id: 'BUF-L-19', arete: 'BUF-L019', nombre: 'Morena de Agua 2', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 3.8, valor: 2810 },
    { id: 'BUF-L-20', arete: 'BUF-L020', nombre: 'Carabao Queen 2', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 4.5, valor: 2830 },
    { id: 'BUF-L-21', arete: 'BUF-L021', nombre: 'Pampeana 2', raza: 'Murrah', categoria: 'Búfalas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 5.2, valor: 2860 },
    { id: 'BUF-L-22', arete: 'BUF-L022', nombre: 'Preciosa B 2', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.1, valor: 2890 },
    { id: 'BUF-L-23', arete: 'BUF-L023', nombre: 'Nilo Star 2', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7.4, valor: 2920 },
    { id: 'BUF-L-24', arete: 'BUF-L024', nombre: 'Amazona 2', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 8.2, valor: 2950 },
    { id: 'BUF-L-25', arete: 'BUF-L025', nombre: 'Selvática 2', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 3.8, valor: 2980 },
    { id: 'BUF-L-26', arete: 'BUF-L026', nombre: 'Ganga 2', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 4.5, valor: 3010 },
    { id: 'BUF-L-27', arete: 'BUF-L027', nombre: 'Perla Negra B 2', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 5.2, valor: 3050 },
    { id: 'BUF-L-28', arete: 'BUF-L028', nombre: 'Titana Bubalina 2', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.1, valor: 3090 },
    { id: 'BUF-L-29', arete: 'BUF-L029', nombre: 'Princesa del Pantano 2', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7.4, valor: 3120 },
    { id: 'BUF-L-30', arete: 'BUF-L030', nombre: 'Moza Murrah 2', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 8.2, valor: 3160 },
    { id: 'BUF-L-31', arete: 'BUF-L031', nombre: 'Negra Linda 3', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 3.8, valor: 3200 },
    { id: 'BUF-L-32', arete: 'BUF-L032', nombre: 'Sultana del Este 3', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 4.5, valor: 3240 },
    { id: 'BUF-L-33', arete: 'BUF-L033', nombre: 'India Bonita 3', raza: 'Murrah', categoria: 'Búfalas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 5.2, valor: 3280 },
    { id: 'BUF-L-34', arete: 'BUF-L034', nombre: 'Morena de Agua 3', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.1, valor: 3320 },
    { id: 'BUF-L-35', arete: 'BUF-L035', nombre: 'Carabao Queen 3', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7.4, valor: 3360 },
    { id: 'BUF-L-36', arete: 'BUF-L036', nombre: 'Pampeana 3', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 8.2, valor: 3410 },
    { id: 'BUF-L-37', arete: 'BUF-L037', nombre: 'Preciosa B 3', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 3.8, valor: 3460 },
    { id: 'BUF-L-38', arete: 'BUF-L038', nombre: 'Nilo Star 3', raza: 'Mediterráneo', categoria: 'Bubillas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 4.5, valor: 3500 },
    { id: 'BUF-L-39', arete: 'BUF-L039', nombre: 'Amazona 3', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Búfalas Secas', sexo: 'Hembra', edadAnos: 5.2, valor: 3540 },
    { id: 'BUF-L-40', arete: 'BUF-L040', nombre: 'Selvática 3', raza: 'Mestizo Bubalino', categoria: 'Bubillas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.1, valor: 3580 }
  ],
  grasa_bufala_pct: [
    { id: 'BUF-G-1', arete: 'BUF-G001', nombre: 'Mozzarella Oro', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 6.7 },
    { id: 'BUF-G-2', arete: 'BUF-G002', nombre: 'Grasa Murrah', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 6.9 },
    { id: 'BUF-G-3', arete: 'BUF-G003', nombre: 'Crema Bubalina', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 7.1 },
    { id: 'BUF-G-4', arete: 'BUF-G004', nombre: 'Riqueza Láctea', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 7.2 },
    { id: 'BUF-G-5', arete: 'BUF-G005', nombre: 'Búfala Grasa', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 7.3 },
    { id: 'BUF-G-6', arete: 'BUF-G006', nombre: 'Sol Sólido', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 7.4 },
    { id: 'BUF-G-7', arete: 'BUF-G007', nombre: 'Sólidos Murrah', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 7.4 },
    { id: 'BUF-G-8', arete: 'BUF-G008', nombre: 'Grasa Óptima', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 7.5 },
    { id: 'BUF-G-9', arete: 'BUF-G009', nombre: 'Mozzarella Oro 2', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 7.5 },
    { id: 'BUF-G-10', arete: 'BUF-G010', nombre: 'Grasa Murrah 2', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 7.6 },
    { id: 'BUF-G-11', arete: 'BUF-G011', nombre: 'Crema Bubalina 2', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 7.6 },
    { id: 'BUF-G-12', arete: 'BUF-G012', nombre: 'Riqueza Láctea 2', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 7.7 },
    { id: 'BUF-G-13', arete: 'BUF-G013', nombre: 'Búfala Grasa 2', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 7.7 },
    { id: 'BUF-G-14', arete: 'BUF-G014', nombre: 'Sol Sólido 2', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 7.8 },
    { id: 'BUF-G-15', arete: 'BUF-G015', nombre: 'Sólidos Murrah 2', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 7.8 },
    { id: 'BUF-G-16', arete: 'BUF-G016', nombre: 'Grasa Óptima 2', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 7.8 },
    { id: 'BUF-G-17', arete: 'BUF-G017', nombre: 'Mozzarella Oro 3', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 7.9 },
    { id: 'BUF-G-18', arete: 'BUF-G018', nombre: 'Grasa Murrah 3', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 7.9 },
    { id: 'BUF-G-19', arete: 'BUF-G019', nombre: 'Crema Bubalina 3', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 7.9 },
    { id: 'BUF-G-20', arete: 'BUF-G020', nombre: 'Riqueza Láctea 3', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 8 },
    { id: 'BUF-G-21', arete: 'BUF-G021', nombre: 'Búfala Grasa 3', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 8 },
    { id: 'BUF-G-22', arete: 'BUF-G022', nombre: 'Sol Sólido 3', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 8 },
    { id: 'BUF-G-23', arete: 'BUF-G023', nombre: 'Sólidos Murrah 3', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 8.1 },
    { id: 'BUF-G-24', arete: 'BUF-G024', nombre: 'Grasa Óptima 3', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 8.1 },
    { id: 'BUF-G-25', arete: 'BUF-G025', nombre: 'Mozzarella Oro 4', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 8.2 },
    { id: 'BUF-G-26', arete: 'BUF-G026', nombre: 'Grasa Murrah 4', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 8.2 },
    { id: 'BUF-G-27', arete: 'BUF-G027', nombre: 'Crema Bubalina 4', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 8.3 },
    { id: 'BUF-G-28', arete: 'BUF-G028', nombre: 'Riqueza Láctea 4', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 8.3 },
    { id: 'BUF-G-29', arete: 'BUF-G029', nombre: 'Búfala Grasa 4', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 8.4 },
    { id: 'BUF-G-30', arete: 'BUF-G030', nombre: 'Sol Sólido 4', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 8.4 },
    { id: 'BUF-G-31', arete: 'BUF-G031', nombre: 'Sólidos Murrah 4', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 8.5 },
    { id: 'BUF-G-32', arete: 'BUF-G032', nombre: 'Grasa Óptima 4', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 8.5 },
    { id: 'BUF-G-33', arete: 'BUF-G033', nombre: 'Mozzarella Oro 5', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 8.6 },
    { id: 'BUF-G-34', arete: 'BUF-G034', nombre: 'Grasa Murrah 5', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 8.6 },
    { id: 'BUF-G-35', arete: 'BUF-G035', nombre: 'Crema Bubalina 5', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 8.7 },
    { id: 'BUF-G-36', arete: 'BUF-G036', nombre: 'Riqueza Láctea 5', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 8.8 },
    { id: 'BUF-G-37', arete: 'BUF-G037', nombre: 'Búfala Grasa 5', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 4, valor: 8.8 },
    { id: 'BUF-G-38', arete: 'BUF-G038', nombre: 'Sol Sólido 5', raza: 'Mediterráneo', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 5, valor: 8.9 },
    { id: 'BUF-G-39', arete: 'BUF-G039', nombre: 'Sólidos Murrah 5', raza: 'Jafarabadi', categoria: 'Búfalas', lote: 'Ordeño Bubalino 01', sexo: 'Hembra', edadAnos: 6.2, valor: 9 },
    { id: 'BUF-G-40', arete: 'BUF-G040', nombre: 'Grasa Óptima 5', raza: 'Murrah', categoria: 'Búfalas', lote: 'Ordeño Bubalino 02', sexo: 'Hembra', edadAnos: 7, valor: 9.1 }
  ],
  peso_destete_bucerro: [
    { id: 'BUF-B-1', arete: 'BUF-B001', nombre: 'Bucerro Titán', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 108 },
    { id: 'BUF-B-2', arete: 'BUF-B002', nombre: 'Bucerra Estrella', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 114 },
    { id: 'BUF-B-3', arete: 'BUF-B003', nombre: 'Bucerro Bravo', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 118 },
    { id: 'BUF-B-4', arete: 'BUF-B004', nombre: 'Bucerro Negro', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 122 },
    { id: 'BUF-B-5', arete: 'BUF-B005', nombre: 'Bucerra Nube', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 125 },
    { id: 'BUF-B-6', arete: 'BUF-B006', nombre: 'Bucerro Centella', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 128 },
    { id: 'BUF-B-7', arete: 'BUF-B007', nombre: 'Bucerro Moro', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 130 },
    { id: 'BUF-B-8', arete: 'BUF-B008', nombre: 'Bucerro Pampa', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 133 },
    { id: 'BUF-B-9', arete: 'BUF-B009', nombre: 'Bucerro Titán 2', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 135 },
    { id: 'BUF-B-10', arete: 'BUF-B010', nombre: 'Bucerra Estrella 2', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 137 },
    { id: 'BUF-B-11', arete: 'BUF-B011', nombre: 'Bucerro Bravo 2', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 138 },
    { id: 'BUF-B-12', arete: 'BUF-B012', nombre: 'Bucerro Negro 2', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 140 },
    { id: 'BUF-B-13', arete: 'BUF-B013', nombre: 'Bucerra Nube 2', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 141 },
    { id: 'BUF-B-14', arete: 'BUF-B014', nombre: 'Bucerro Centella 2', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 142 },
    { id: 'BUF-B-15', arete: 'BUF-B015', nombre: 'Bucerro Moro 2', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 143 },
    { id: 'BUF-B-16', arete: 'BUF-B016', nombre: 'Bucerro Pampa 2', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 144 },
    { id: 'BUF-B-17', arete: 'BUF-B017', nombre: 'Bucerro Titán 3', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 145 },
    { id: 'BUF-B-18', arete: 'BUF-B018', nombre: 'Bucerra Estrella 3', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 146 },
    { id: 'BUF-B-19', arete: 'BUF-B019', nombre: 'Bucerro Bravo 3', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 147 },
    { id: 'BUF-B-20', arete: 'BUF-B020', nombre: 'Bucerro Negro 3', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 148 },
    { id: 'BUF-B-21', arete: 'BUF-B021', nombre: 'Bucerra Nube 3', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 149 },
    { id: 'BUF-B-22', arete: 'BUF-B022', nombre: 'Bucerro Centella 3', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 150 },
    { id: 'BUF-B-23', arete: 'BUF-B023', nombre: 'Bucerro Moro 3', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 151 },
    { id: 'BUF-B-24', arete: 'BUF-B024', nombre: 'Bucerro Pampa 3', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 152 },
    { id: 'BUF-B-25', arete: 'BUF-B025', nombre: 'Bucerro Titán 4', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 153 },
    { id: 'BUF-B-26', arete: 'BUF-B026', nombre: 'Bucerra Estrella 4', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 155 },
    { id: 'BUF-B-27', arete: 'BUF-B027', nombre: 'Bucerro Bravo 4', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 156 },
    { id: 'BUF-B-28', arete: 'BUF-B028', nombre: 'Bucerro Negro 4', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 157 },
    { id: 'BUF-B-29', arete: 'BUF-B029', nombre: 'Bucerra Nube 4', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 159 },
    { id: 'BUF-B-30', arete: 'BUF-B030', nombre: 'Bucerro Centella 4', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 160 },
    { id: 'BUF-B-31', arete: 'BUF-B031', nombre: 'Bucerro Moro 4', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 162 },
    { id: 'BUF-B-32', arete: 'BUF-B032', nombre: 'Bucerro Pampa 4', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 164 },
    { id: 'BUF-B-33', arete: 'BUF-B033', nombre: 'Bucerro Titán 5', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 165 },
    { id: 'BUF-B-34', arete: 'BUF-B034', nombre: 'Bucerra Estrella 5', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 167 },
    { id: 'BUF-B-35', arete: 'BUF-B035', nombre: 'Bucerro Bravo 5', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 169 },
    { id: 'BUF-B-36', arete: 'BUF-B036', nombre: 'Bucerro Negro 5', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 171 },
    { id: 'BUF-B-37', arete: 'BUF-B037', nombre: 'Bucerra Nube 5', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 173 },
    { id: 'BUF-B-38', arete: 'BUF-B038', nombre: 'Bucerro Centella 5', raza: 'Mediterráneo', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 175 },
    { id: 'BUF-B-39', arete: 'BUF-B039', nombre: 'Bucerro Moro 5', raza: 'Mestizo Bubalino', categoria: 'Bucerros / Bucerras', lote: 'Crías Bubalinas', sexo: 'Macho', edadAnos: 0.65, valor: 177 },
    { id: 'BUF-B-40', arete: 'BUF-B040', nombre: 'Bucerro Pampa 5', raza: 'Murrah', categoria: 'Bucerros / Bucerras', lote: 'Levante Bubalino', sexo: 'Hembra', edadAnos: 0.65, valor: 179 }
  ],

  // 🐐 Caprinos
  leche_cabra_210: [
    { id: 'CAP-L-1', arete: 'CAP-L001', nombre: 'Blanca Nieves', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 2.1, valor: 520 },
    { id: 'CAP-L-2', arete: 'CAP-L002', nombre: 'Canela Saanen', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 2.8, valor: 570 },
    { id: 'CAP-L-3', arete: 'CAP-L003', nombre: 'Sultana Caprina', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 3.4, valor: 610 },
    { id: 'CAP-L-4', arete: 'CAP-L004', nombre: 'Alpina Star', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 4.2, valor: 640 },
    { id: 'CAP-L-5', arete: 'CAP-L005', nombre: 'Chispa Toggenburg', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 5.1, valor: 670 },
    { id: 'CAP-L-6', arete: 'CAP-L006', nombre: 'Murciana Real', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 2.1, valor: 690 },
    { id: 'CAP-L-7', arete: 'CAP-L007', nombre: 'Flor de Saanen', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 2.8, valor: 710 },
    { id: 'CAP-L-8', arete: 'CAP-L008', nombre: 'Campanita', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 3.4, valor: 730 },
    { id: 'CAP-L-9', arete: 'CAP-L009', nombre: 'Duquesa Caprina', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 4.2, valor: 745 },
    { id: 'CAP-L-10', arete: 'CAP-L010', nombre: 'Bella Alpina', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 5.1, valor: 760 },
    { id: 'CAP-L-11', arete: 'CAP-L011', nombre: 'Zafira', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 2.1, valor: 770 },
    { id: 'CAP-L-12', arete: 'CAP-L012', nombre: 'Maravilla', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 2.8, valor: 780 },
    { id: 'CAP-L-13', arete: 'CAP-L013', nombre: 'Estrella Blanca', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 3.4, valor: 790 },
    { id: 'CAP-L-14', arete: 'CAP-L014', nombre: 'Nieve Alpina', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 4.2, valor: 800 },
    { id: 'CAP-L-15', arete: 'CAP-L015', nombre: 'Blanca Nieves 2', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 810 },
    { id: 'CAP-L-16', arete: 'CAP-L016', nombre: 'Canela Saanen 2', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 2.1, valor: 820 },
    { id: 'CAP-L-17', arete: 'CAP-L017', nombre: 'Sultana Caprina 2', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 2.8, valor: 830 },
    { id: 'CAP-L-18', arete: 'CAP-L018', nombre: 'Alpina Star 2', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 3.4, valor: 840 },
    { id: 'CAP-L-19', arete: 'CAP-L019', nombre: 'Chispa Toggenburg 2', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 4.2, valor: 850 },
    { id: 'CAP-L-20', arete: 'CAP-L020', nombre: 'Murciana Real 2', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 5.1, valor: 860 },
    { id: 'CAP-L-21', arete: 'CAP-L021', nombre: 'Flor de Saanen 2', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 2.1, valor: 870 },
    { id: 'CAP-L-22', arete: 'CAP-L022', nombre: 'Campanita 2', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 2.8, valor: 880 },
    { id: 'CAP-L-23', arete: 'CAP-L023', nombre: 'Duquesa Caprina 2', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 3.4, valor: 890 },
    { id: 'CAP-L-24', arete: 'CAP-L024', nombre: 'Bella Alpina 2', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 4.2, valor: 900 },
    { id: 'CAP-L-25', arete: 'CAP-L025', nombre: 'Zafira 2', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 5.1, valor: 910 },
    { id: 'CAP-L-26', arete: 'CAP-L026', nombre: 'Maravilla 2', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 2.1, valor: 920 },
    { id: 'CAP-L-27', arete: 'CAP-L027', nombre: 'Estrella Blanca 2', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 2.8, valor: 930 },
    { id: 'CAP-L-28', arete: 'CAP-L028', nombre: 'Nieve Alpina 2', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 3.4, valor: 940 },
    { id: 'CAP-L-29', arete: 'CAP-L029', nombre: 'Blanca Nieves 3', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 4.2, valor: 950 },
    { id: 'CAP-L-30', arete: 'CAP-L030', nombre: 'Canela Saanen 3', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 960 },
    { id: 'CAP-L-31', arete: 'CAP-L031', nombre: 'Sultana Caprina 3', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 2.1, valor: 970 },
    { id: 'CAP-L-32', arete: 'CAP-L032', nombre: 'Alpina Star 3', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 2.8, valor: 985 },
    { id: 'CAP-L-33', arete: 'CAP-L033', nombre: 'Chispa Toggenburg 3', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 3.4, valor: 1000 },
    { id: 'CAP-L-34', arete: 'CAP-L034', nombre: 'Murciana Real 3', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 4.2, valor: 1015 },
    { id: 'CAP-L-35', arete: 'CAP-L035', nombre: 'Flor de Saanen 3', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 5.1, valor: 1030 },
    { id: 'CAP-L-36', arete: 'CAP-L036', nombre: 'Campanita 3', raza: 'Saanen', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 2.1, valor: 1045 },
    { id: 'CAP-L-37', arete: 'CAP-L037', nombre: 'Duquesa Caprina 3', raza: 'Alpina Francesa', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 2.8, valor: 1060 },
    { id: 'CAP-L-38', arete: 'CAP-L038', nombre: 'Bella Alpina 3', raza: 'Murciano-Granadina', categoria: 'Cabras Lecheras', lote: 'Redil 02 - Cabras Primerizas', sexo: 'Hembra', edadAnos: 3.4, valor: 1075 },
    { id: 'CAP-L-39', arete: 'CAP-L039', nombre: 'Zafira 3', raza: 'Toggenburg', categoria: 'Cabras Lecheras', lote: 'Cabras Secas', sexo: 'Hembra', edadAnos: 4.2, valor: 1090 },
    { id: 'CAP-L-40', arete: 'CAP-L040', nombre: 'Maravilla 3', raza: 'Anglo-Nubiana', categoria: 'Cabras Lecheras', lote: 'Redil 01 - Alta Producción', sexo: 'Hembra', edadAnos: 5.1, valor: 1105 }
  ],
  peso_destete_cabrito: [
    { id: 'CAP-D-1', arete: 'CAP-D001', nombre: 'Cabrito Boer', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 15.2 },
    { id: 'CAP-D-2', arete: 'CAP-D002', nombre: 'Cabrita Saanen', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 16.3 },
    { id: 'CAP-D-3', arete: 'CAP-D003', nombre: 'Cabrito Nubiano', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 17.1 },
    { id: 'CAP-D-4', arete: 'CAP-D004', nombre: 'Cabrito Alpino', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 17.8 },
    { id: 'CAP-D-5', arete: 'CAP-D005', nombre: 'Cabrito Campeón', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 18.2 },
    { id: 'CAP-D-6', arete: 'CAP-D006', nombre: 'Cabrita Flor', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 18.7 },
    { id: 'CAP-D-7', arete: 'CAP-D007', nombre: 'Cabrito Titán', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 19.1 },
    { id: 'CAP-D-8', arete: 'CAP-D008', nombre: 'Cabrita Lucero', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 19.5 },
    { id: 'CAP-D-9', arete: 'CAP-D009', nombre: 'Cabrito Boer 2', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 19.9 },
    { id: 'CAP-D-10', arete: 'CAP-D010', nombre: 'Cabrita Saanen 2', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 20.3 },
    { id: 'CAP-D-11', arete: 'CAP-D011', nombre: 'Cabrito Nubiano 2', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 20.7 },
    { id: 'CAP-D-12', arete: 'CAP-D012', nombre: 'Cabrito Alpino 2', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 21 },
    { id: 'CAP-D-13', arete: 'CAP-D013', nombre: 'Cabrito Campeón 2', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 21.3 },
    { id: 'CAP-D-14', arete: 'CAP-D014', nombre: 'Cabrita Flor 2', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 21.6 },
    { id: 'CAP-D-15', arete: 'CAP-D015', nombre: 'Cabrito Titán 2', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 21.9 },
    { id: 'CAP-D-16', arete: 'CAP-D016', nombre: 'Cabrita Lucero 2', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 22.1 },
    { id: 'CAP-D-17', arete: 'CAP-D017', nombre: 'Cabrito Boer 3', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 22.3 },
    { id: 'CAP-D-18', arete: 'CAP-D018', nombre: 'Cabrita Saanen 3', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 22.5 },
    { id: 'CAP-D-19', arete: 'CAP-D019', nombre: 'Cabrito Nubiano 3', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 22.7 },
    { id: 'CAP-D-20', arete: 'CAP-D020', nombre: 'Cabrito Alpino 3', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 22.9 },
    { id: 'CAP-D-21', arete: 'CAP-D021', nombre: 'Cabrito Campeón 3', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 23.1 },
    { id: 'CAP-D-22', arete: 'CAP-D022', nombre: 'Cabrita Flor 3', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 23.3 },
    { id: 'CAP-D-23', arete: 'CAP-D023', nombre: 'Cabrito Titán 3', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 23.6 },
    { id: 'CAP-D-24', arete: 'CAP-D024', nombre: 'Cabrita Lucero 3', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 23.9 },
    { id: 'CAP-D-25', arete: 'CAP-D025', nombre: 'Cabrito Boer 4', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 24.1 },
    { id: 'CAP-D-26', arete: 'CAP-D026', nombre: 'Cabrita Saanen 4', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 24.4 },
    { id: 'CAP-D-27', arete: 'CAP-D027', nombre: 'Cabrito Nubiano 4', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 24.7 },
    { id: 'CAP-D-28', arete: 'CAP-D028', nombre: 'Cabrito Alpino 4', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 25.1 },
    { id: 'CAP-D-29', arete: 'CAP-D029', nombre: 'Cabrito Campeón 4', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 25.5 },
    { id: 'CAP-D-30', arete: 'CAP-D030', nombre: 'Cabrita Flor 4', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 25.9 },
    { id: 'CAP-D-31', arete: 'CAP-D031', nombre: 'Cabrito Titán 4', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 26.2 },
    { id: 'CAP-D-32', arete: 'CAP-D032', nombre: 'Cabrita Lucero 4', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 26.6 },
    { id: 'CAP-D-33', arete: 'CAP-D033', nombre: 'Cabrito Boer 5', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 27 },
    { id: 'CAP-D-34', arete: 'CAP-D034', nombre: 'Cabrita Saanen 5', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 27.4 },
    { id: 'CAP-D-35', arete: 'CAP-D035', nombre: 'Cabrito Nubiano 5', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 27.8 },
    { id: 'CAP-D-36', arete: 'CAP-D036', nombre: 'Cabrito Alpino 5', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 28.2 },
    { id: 'CAP-D-37', arete: 'CAP-D037', nombre: 'Cabrito Campeón 5', raza: 'Boer', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 28.6 },
    { id: 'CAP-D-38', arete: 'CAP-D038', nombre: 'Cabrita Flor 5', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 29 },
    { id: 'CAP-D-39', arete: 'CAP-D039', nombre: 'Cabrito Titán 5', raza: 'Saanen', categoria: 'Cabritonas / Cabritos', lote: 'Corral de Cría', sexo: 'Macho', edadAnos: 0.16, valor: 29.3 },
    { id: 'CAP-D-40', arete: 'CAP-D040', nombre: 'Cabrita Lucero 5', raza: 'Alpina Francesa', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.16, valor: 29.7 }
  ],
  gdp_caprina: [
    { id: 'CAP-G-1', arete: 'CAP-G001', nombre: 'Boer Ceba', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.5, valor: 135 },
    { id: 'CAP-G-2', arete: 'CAP-G002', nombre: 'Nubiana Plus', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.8, valor: 146 },
    { id: 'CAP-G-3', arete: 'CAP-G003', nombre: 'Alpina Speed', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 1.1, valor: 154 },
    { id: 'CAP-G-4', arete: 'CAP-G004', nombre: 'Criollo Ágil', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.5, valor: 162 },
    { id: 'CAP-G-5', arete: 'CAP-G005', nombre: 'Caprino Fuerte', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.8, valor: 167 },
    { id: 'CAP-G-6', arete: 'CAP-G006', nombre: 'Boer Máximo', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 1.1, valor: 171 },
    { id: 'CAP-G-7', arete: 'CAP-G007', nombre: 'Cabrito Ponderal', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.5, valor: 176 },
    { id: 'CAP-G-8', arete: 'CAP-G008', nombre: 'Chivo Vigor', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.8, valor: 180 },
    { id: 'CAP-G-9', arete: 'CAP-G009', nombre: 'Boer Ceba 2', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 1.1, valor: 184 },
    { id: 'CAP-G-10', arete: 'CAP-G010', nombre: 'Nubiana Plus 2', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.5, valor: 188 },
    { id: 'CAP-G-11', arete: 'CAP-G011', nombre: 'Alpina Speed 2', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.8, valor: 191 },
    { id: 'CAP-G-12', arete: 'CAP-G012', nombre: 'Criollo Ágil 2', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 1.1, valor: 194 },
    { id: 'CAP-G-13', arete: 'CAP-G013', nombre: 'Caprino Fuerte 2', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.5, valor: 197 },
    { id: 'CAP-G-14', arete: 'CAP-G014', nombre: 'Boer Máximo 2', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.8, valor: 200 },
    { id: 'CAP-G-15', arete: 'CAP-G015', nombre: 'Cabrito Ponderal 2', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 1.1, valor: 203 },
    { id: 'CAP-G-16', arete: 'CAP-G016', nombre: 'Chivo Vigor 2', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.5, valor: 205 },
    { id: 'CAP-G-17', arete: 'CAP-G017', nombre: 'Boer Ceba 3', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.8, valor: 207 },
    { id: 'CAP-G-18', arete: 'CAP-G018', nombre: 'Nubiana Plus 3', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 1.1, valor: 209 },
    { id: 'CAP-G-19', arete: 'CAP-G019', nombre: 'Alpina Speed 3', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.5, valor: 211 },
    { id: 'CAP-G-20', arete: 'CAP-G020', nombre: 'Criollo Ágil 3', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.8, valor: 213 },
    { id: 'CAP-G-21', arete: 'CAP-G021', nombre: 'Caprino Fuerte 3', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 1.1, valor: 215 },
    { id: 'CAP-G-22', arete: 'CAP-G022', nombre: 'Boer Máximo 3', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.5, valor: 217 },
    { id: 'CAP-G-23', arete: 'CAP-G023', nombre: 'Cabrito Ponderal 3', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.8, valor: 219 },
    { id: 'CAP-G-24', arete: 'CAP-G024', nombre: 'Chivo Vigor 3', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 1.1, valor: 221 },
    { id: 'CAP-G-25', arete: 'CAP-G025', nombre: 'Boer Ceba 4', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.5, valor: 224 },
    { id: 'CAP-G-26', arete: 'CAP-G026', nombre: 'Nubiana Plus 4', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.8, valor: 227 },
    { id: 'CAP-G-27', arete: 'CAP-G027', nombre: 'Alpina Speed 4', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 1.1, valor: 230 },
    { id: 'CAP-G-28', arete: 'CAP-G028', nombre: 'Criollo Ágil 4', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.5, valor: 233 },
    { id: 'CAP-G-29', arete: 'CAP-G029', nombre: 'Caprino Fuerte 4', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.8, valor: 236 },
    { id: 'CAP-G-30', arete: 'CAP-G030', nombre: 'Boer Máximo 4', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 1.1, valor: 239 },
    { id: 'CAP-G-31', arete: 'CAP-G031', nombre: 'Cabrito Ponderal 4', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.5, valor: 243 },
    { id: 'CAP-G-32', arete: 'CAP-G032', nombre: 'Chivo Vigor 4', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.8, valor: 247 },
    { id: 'CAP-G-33', arete: 'CAP-G033', nombre: 'Boer Ceba 5', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 1.1, valor: 251 },
    { id: 'CAP-G-34', arete: 'CAP-G034', nombre: 'Nubiana Plus 5', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.5, valor: 255 },
    { id: 'CAP-G-35', arete: 'CAP-G035', nombre: 'Alpina Speed 5', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.8, valor: 259 },
    { id: 'CAP-G-36', arete: 'CAP-G036', nombre: 'Criollo Ágil 5', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 1.1, valor: 263 },
    { id: 'CAP-G-37', arete: 'CAP-G037', nombre: 'Caprino Fuerte 5', raza: 'Boer', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 0.5, valor: 267 },
    { id: 'CAP-G-38', arete: 'CAP-G038', nombre: 'Boer Máximo 5', raza: 'Anglo-Nubiana', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.8, valor: 271 },
    { id: 'CAP-G-39', arete: 'CAP-G039', nombre: 'Cabrito Ponderal 5', raza: 'Alpina Francesa', categoria: 'Caprinos de Ceba', lote: 'Ceba y Engorde Caprino', sexo: 'Macho', edadAnos: 1.1, valor: 274 },
    { id: 'CAP-G-40', arete: 'CAP-G040', nombre: 'Chivo Vigor 5', raza: 'Criollo', categoria: 'Cabritonas / Cabritos', lote: 'Levante Caprino', sexo: 'Hembra', edadAnos: 0.5, valor: 278 }
  ],

  // 🐴 Equinos
  alzada_cruz: [
    { id: 'EQ-A-1', arete: 'EQ-A001', nombre: 'Centauro del Llano', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 3.5, valor: 139 },
    { id: 'EQ-A-2', arete: 'EQ-A002', nombre: 'Relámpago QM', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 4.2, valor: 141.5 },
    { id: 'EQ-A-3', arete: 'EQ-A003', nombre: 'Palomino Real', raza: 'Criollo Llanero', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Macho', edadAnos: 5, valor: 143.5 },
    { id: 'EQ-A-4', arete: 'EQ-A004', nombre: 'Tornado Árabe', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Hembra', edadAnos: 6.3, valor: 145 },
    { id: 'EQ-A-5', arete: 'EQ-A005', nombre: 'Eclipse Moro', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Macho', edadAnos: 7.8, valor: 146 },
    { id: 'EQ-A-6', arete: 'EQ-A006', nombre: 'Faraón Paso Fino', raza: 'Lusitano', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Hembra', edadAnos: 3.5, valor: 147 },
    { id: 'EQ-A-7', arete: 'EQ-A007', nombre: 'Gitano Criollo', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4.2, valor: 148 },
    { id: 'EQ-A-8', arete: 'EQ-A008', nombre: 'Zafiro Negro', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5, valor: 149 },
    { id: 'EQ-A-9', arete: 'EQ-A009', nombre: 'Don Quijote', raza: 'Criollo Llanero', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Macho', edadAnos: 6.3, valor: 150 },
    { id: 'EQ-A-10', arete: 'EQ-A010', nombre: 'Bandolero', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Hembra', edadAnos: 7.8, valor: 150.5 },
    { id: 'EQ-A-11', arete: 'EQ-A011', nombre: 'Pegaso', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Macho', edadAnos: 3.5, valor: 151 },
    { id: 'EQ-A-12', arete: 'EQ-A012', nombre: 'Lucero Criollo', raza: 'Lusitano', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Hembra', edadAnos: 4.2, valor: 151.5 },
    { id: 'EQ-A-13', arete: 'EQ-A013', nombre: 'Bravo Alazán', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5, valor: 152 },
    { id: 'EQ-A-14', arete: 'EQ-A014', nombre: 'Comanche QM', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.3, valor: 152.5 },
    { id: 'EQ-A-15', arete: 'EQ-A015', nombre: 'Caramelo Real', raza: 'Criollo Llanero', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Macho', edadAnos: 7.8, valor: 153 },
    { id: 'EQ-A-16', arete: 'EQ-A016', nombre: 'Centauro del Llano 2', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Hembra', edadAnos: 3.5, valor: 153 },
    { id: 'EQ-A-17', arete: 'EQ-A017', nombre: 'Relámpago QM 2', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Macho', edadAnos: 4.2, valor: 153.5 },
    { id: 'EQ-A-18', arete: 'EQ-A018', nombre: 'Palomino Real 2', raza: 'Lusitano', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Hembra', edadAnos: 5, valor: 154 },
    { id: 'EQ-A-19', arete: 'EQ-A019', nombre: 'Tornado Árabe 2', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6.3, valor: 154.5 },
    { id: 'EQ-A-20', arete: 'EQ-A020', nombre: 'Eclipse Moro 2', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.8, valor: 154.5 },
    { id: 'EQ-A-21', arete: 'EQ-A021', nombre: 'Faraón Paso Fino 2', raza: 'Criollo Llanero', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Macho', edadAnos: 3.5, valor: 155 },
    { id: 'EQ-A-22', arete: 'EQ-A022', nombre: 'Gitano Criollo 2', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Hembra', edadAnos: 4.2, valor: 155.5 },
    { id: 'EQ-A-23', arete: 'EQ-A023', nombre: 'Zafiro Negro 2', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Macho', edadAnos: 5, valor: 156 },
    { id: 'EQ-A-24', arete: 'EQ-A024', nombre: 'Don Quijote 2', raza: 'Lusitano', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Hembra', edadAnos: 6.3, valor: 156.5 },
    { id: 'EQ-A-25', arete: 'EQ-A025', nombre: 'Bandolero 2', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 7.8, valor: 157 },
    { id: 'EQ-A-26', arete: 'EQ-A026', nombre: 'Pegaso 2', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.5, valor: 157.5 },
    { id: 'EQ-A-27', arete: 'EQ-A027', nombre: 'Lucero Criollo 2', raza: 'Criollo Llanero', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Macho', edadAnos: 4.2, valor: 158 },
    { id: 'EQ-A-28', arete: 'EQ-A028', nombre: 'Bravo Alazán 2', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Hembra', edadAnos: 5, valor: 158.5 },
    { id: 'EQ-A-29', arete: 'EQ-A029', nombre: 'Comanche QM 2', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Macho', edadAnos: 6.3, valor: 159 },
    { id: 'EQ-A-30', arete: 'EQ-A030', nombre: 'Caramelo Real 2', raza: 'Lusitano', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Hembra', edadAnos: 7.8, valor: 159.5 },
    { id: 'EQ-A-31', arete: 'EQ-A031', nombre: 'Centauro del Llano 3', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 3.5, valor: 160.5 },
    { id: 'EQ-A-32', arete: 'EQ-A032', nombre: 'Relámpago QM 3', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 4.2, valor: 161 },
    { id: 'EQ-A-33', arete: 'EQ-A033', nombre: 'Palomino Real 3', raza: 'Criollo Llanero', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Macho', edadAnos: 5, valor: 162 },
    { id: 'EQ-A-34', arete: 'EQ-A034', nombre: 'Tornado Árabe 3', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Hembra', edadAnos: 6.3, valor: 162.5 },
    { id: 'EQ-A-35', arete: 'EQ-A035', nombre: 'Eclipse Moro 3', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Macho', edadAnos: 7.8, valor: 163.5 },
    { id: 'EQ-A-36', arete: 'EQ-A036', nombre: 'Faraón Paso Fino 3', raza: 'Lusitano', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Hembra', edadAnos: 3.5, valor: 164 },
    { id: 'EQ-A-37', arete: 'EQ-A037', nombre: 'Gitano Criollo 3', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4.2, valor: 165 },
    { id: 'EQ-A-38', arete: 'EQ-A038', nombre: 'Zafiro Negro 3', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5, valor: 165.5 },
    { id: 'EQ-A-39', arete: 'EQ-A039', nombre: 'Don Quijote 3', raza: 'Criollo Llanero', categoria: 'Padrillos / Sementales', lote: 'Boxes Reproductores', sexo: 'Macho', edadAnos: 6.3, valor: 166 },
    { id: 'EQ-A-40', arete: 'EQ-A040', nombre: 'Bandolero 3', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Hembra', edadAnos: 7.8, valor: 166.5 }
  ],
  perimetro_toracico: [
    { id: 'EQ-PT-1', arete: 'EQ-PT001', nombre: 'Centauro Torácico', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 166 },
    { id: 'EQ-PT-2', arete: 'EQ-PT002', nombre: 'Poderoso QM', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 169.5 },
    { id: 'EQ-PT-3', arete: 'EQ-PT003', nombre: 'Caja Ancha', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 172 },
    { id: 'EQ-PT-4', arete: 'EQ-PT004', nombre: 'Pecho Criollo', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 174 },
    { id: 'EQ-PT-5', arete: 'EQ-PT005', nombre: 'Fuerza Llanera', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 175.5 },
    { id: 'EQ-PT-6', arete: 'EQ-PT006', nombre: 'Torso Árabe', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 177 },
    { id: 'EQ-PT-7', arete: 'EQ-PT007', nombre: 'Galeno QM', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 178 },
    { id: 'EQ-PT-8', arete: 'EQ-PT008', nombre: 'Bravío Alazán', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 179.5 },
    { id: 'EQ-PT-9', arete: 'EQ-PT009', nombre: 'Centauro Torácico 2', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 180.5 },
    { id: 'EQ-PT-10', arete: 'EQ-PT010', nombre: 'Poderoso QM 2', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 181.5 },
    { id: 'EQ-PT-11', arete: 'EQ-PT011', nombre: 'Caja Ancha 2', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 182.5 },
    { id: 'EQ-PT-12', arete: 'EQ-PT012', nombre: 'Pecho Criollo 2', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 183.5 },
    { id: 'EQ-PT-13', arete: 'EQ-PT013', nombre: 'Fuerza Llanera 2', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 184 },
    { id: 'EQ-PT-14', arete: 'EQ-PT014', nombre: 'Torso Árabe 2', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 185 },
    { id: 'EQ-PT-15', arete: 'EQ-PT015', nombre: 'Galeno QM 2', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 185.5 },
    { id: 'EQ-PT-16', arete: 'EQ-PT016', nombre: 'Bravío Alazán 2', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 186 },
    { id: 'EQ-PT-17', arete: 'EQ-PT017', nombre: 'Centauro Torácico 3', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 186.5 },
    { id: 'EQ-PT-18', arete: 'EQ-PT018', nombre: 'Poderoso QM 3', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 187 },
    { id: 'EQ-PT-19', arete: 'EQ-PT019', nombre: 'Caja Ancha 3', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 187.5 },
    { id: 'EQ-PT-20', arete: 'EQ-PT020', nombre: 'Pecho Criollo 3', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 188 },
    { id: 'EQ-PT-21', arete: 'EQ-PT021', nombre: 'Fuerza Llanera 3', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 188.5 },
    { id: 'EQ-PT-22', arete: 'EQ-PT022', nombre: 'Torso Árabe 3', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 189 },
    { id: 'EQ-PT-23', arete: 'EQ-PT023', nombre: 'Galeno QM 3', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 189.5 },
    { id: 'EQ-PT-24', arete: 'EQ-PT024', nombre: 'Bravío Alazán 3', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 190 },
    { id: 'EQ-PT-25', arete: 'EQ-PT025', nombre: 'Centauro Torácico 4', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 190.5 },
    { id: 'EQ-PT-26', arete: 'EQ-PT026', nombre: 'Poderoso QM 4', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 191.5 },
    { id: 'EQ-PT-27', arete: 'EQ-PT027', nombre: 'Caja Ancha 4', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 192 },
    { id: 'EQ-PT-28', arete: 'EQ-PT028', nombre: 'Pecho Criollo 4', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 193 },
    { id: 'EQ-PT-29', arete: 'EQ-PT029', nombre: 'Fuerza Llanera 4', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 193.5 },
    { id: 'EQ-PT-30', arete: 'EQ-PT030', nombre: 'Torso Árabe 4', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 194.5 },
    { id: 'EQ-PT-31', arete: 'EQ-PT031', nombre: 'Galeno QM 4', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 195.5 },
    { id: 'EQ-PT-32', arete: 'EQ-PT032', nombre: 'Bravío Alazán 4', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 196.5 },
    { id: 'EQ-PT-33', arete: 'EQ-PT033', nombre: 'Centauro Torácico 5', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 197.5 },
    { id: 'EQ-PT-34', arete: 'EQ-PT034', nombre: 'Poderoso QM 5', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 198.5 },
    { id: 'EQ-PT-35', arete: 'EQ-PT035', nombre: 'Caja Ancha 5', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 199.5 },
    { id: 'EQ-PT-36', arete: 'EQ-PT036', nombre: 'Pecho Criollo 5', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 200.5 },
    { id: 'EQ-PT-37', arete: 'EQ-PT037', nombre: 'Fuerza Llanera 5', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 4, valor: 201 },
    { id: 'EQ-PT-38', arete: 'EQ-PT038', nombre: 'Torso Árabe 5', raza: 'Pura Sangre', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 5.2, valor: 201.5 },
    { id: 'EQ-PT-39', arete: 'EQ-PT039', nombre: 'Galeno QM 5', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 6, valor: 202.5 },
    { id: 'EQ-PT-40', arete: 'EQ-PT040', nombre: 'Bravío Alazán 5', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 7.5, valor: 203 }
  ],
  condicion_equina: [
    { id: 'EQ-CC-1', arete: 'EQ-CC001', nombre: 'Henneke Óptimo', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 3.9 },
    { id: 'EQ-CC-2', arete: 'EQ-CC002', nombre: 'Henneke Eval', raza: 'Paso Fino', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 4.2 },
    { id: 'EQ-CC-3', arete: 'EQ-CC003', nombre: 'Balance Henneke', raza: 'Criollo Llanero', categoria: 'Potros / Potrancas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 4.4 },
    { id: 'EQ-CC-4', arete: 'EQ-CC004', nombre: 'Condición Corporal Equina', raza: 'Árabe', categoria: 'Caballos', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 4.6 },
    { id: 'EQ-CC-5', arete: 'EQ-CC005', nombre: 'Reserva Grasa', raza: 'Cuarto de Milla', categoria: 'Yeguas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 4.7 },
    { id: 'EQ-CC-6', arete: 'EQ-CC006', nombre: 'Condición Atlético', raza: 'Paso Fino', categoria: 'Potros / Potrancas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 4.8 },
    { id: 'EQ-CC-7', arete: 'EQ-CC007', nombre: 'Morfología Henneke', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 4.9 },
    { id: 'EQ-CC-8', arete: 'EQ-CC008', nombre: 'Henneke Óptimo 2', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 5 },
    { id: 'EQ-CC-9', arete: 'EQ-CC009', nombre: 'Henneke Eval 2', raza: 'Cuarto de Milla', categoria: 'Potros / Potrancas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 5.1 },
    { id: 'EQ-CC-10', arete: 'EQ-CC010', nombre: 'Balance Henneke 2', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 5.1 },
    { id: 'EQ-CC-11', arete: 'EQ-CC011', nombre: 'Condición Corporal Equina 2', raza: 'Criollo Llanero', categoria: 'Yeguas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 5.2 },
    { id: 'EQ-CC-12', arete: 'EQ-CC012', nombre: 'Reserva Grasa 2', raza: 'Árabe', categoria: 'Potros / Potrancas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 5.2 },
    { id: 'EQ-CC-13', arete: 'EQ-CC013', nombre: 'Condición Atlético 2', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 5.3 },
    { id: 'EQ-CC-14', arete: 'EQ-CC014', nombre: 'Morfología Henneke 2', raza: 'Paso Fino', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 5.3 },
    { id: 'EQ-CC-15', arete: 'EQ-CC015', nombre: 'Henneke Óptimo 3', raza: 'Criollo Llanero', categoria: 'Potros / Potrancas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 5.4 },
    { id: 'EQ-CC-16', arete: 'EQ-CC016', nombre: 'Henneke Eval 3', raza: 'Árabe', categoria: 'Caballos', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 5.4 },
    { id: 'EQ-CC-17', arete: 'EQ-CC017', nombre: 'Balance Henneke 3', raza: 'Cuarto de Milla', categoria: 'Yeguas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 5.5 },
    { id: 'EQ-CC-18', arete: 'EQ-CC018', nombre: 'Condición Corporal Equina 3', raza: 'Paso Fino', categoria: 'Potros / Potrancas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 5.5 },
    { id: 'EQ-CC-19', arete: 'EQ-CC019', nombre: 'Reserva Grasa 3', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 5.5 },
    { id: 'EQ-CC-20', arete: 'EQ-CC020', nombre: 'Condición Atlético 3', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 5.5 },
    { id: 'EQ-CC-21', arete: 'EQ-CC021', nombre: 'Morfología Henneke 3', raza: 'Cuarto de Milla', categoria: 'Potros / Potrancas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 5.6 },
    { id: 'EQ-CC-22', arete: 'EQ-CC022', nombre: 'Henneke Óptimo 4', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 5.6 },
    { id: 'EQ-CC-23', arete: 'EQ-CC023', nombre: 'Henneke Eval 4', raza: 'Criollo Llanero', categoria: 'Yeguas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 5.6 },
    { id: 'EQ-CC-24', arete: 'EQ-CC024', nombre: 'Balance Henneke 4', raza: 'Árabe', categoria: 'Potros / Potrancas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 5.7 },
    { id: 'EQ-CC-25', arete: 'EQ-CC025', nombre: 'Condición Corporal Equina 4', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 5.7 },
    { id: 'EQ-CC-26', arete: 'EQ-CC026', nombre: 'Reserva Grasa 4', raza: 'Paso Fino', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 5.8 },
    { id: 'EQ-CC-27', arete: 'EQ-CC027', nombre: 'Condición Atlético 4', raza: 'Criollo Llanero', categoria: 'Potros / Potrancas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 5.8 },
    { id: 'EQ-CC-28', arete: 'EQ-CC028', nombre: 'Morfología Henneke 4', raza: 'Árabe', categoria: 'Caballos', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 5.9 },
    { id: 'EQ-CC-29', arete: 'EQ-CC029', nombre: 'Henneke Óptimo 5', raza: 'Cuarto de Milla', categoria: 'Yeguas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 5.9 },
    { id: 'EQ-CC-30', arete: 'EQ-CC030', nombre: 'Henneke Eval 5', raza: 'Paso Fino', categoria: 'Potros / Potrancas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 6 },
    { id: 'EQ-CC-31', arete: 'EQ-CC031', nombre: 'Balance Henneke 5', raza: 'Criollo Llanero', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 6.1 },
    { id: 'EQ-CC-32', arete: 'EQ-CC032', nombre: 'Condición Corporal Equina 5', raza: 'Árabe', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 6.2 },
    { id: 'EQ-CC-33', arete: 'EQ-CC033', nombre: 'Reserva Grasa 5', raza: 'Cuarto de Milla', categoria: 'Potros / Potrancas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 6.3 },
    { id: 'EQ-CC-34', arete: 'EQ-CC034', nombre: 'Condición Atlético 5', raza: 'Paso Fino', categoria: 'Caballos', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 6.4 },
    { id: 'EQ-CC-35', arete: 'EQ-CC035', nombre: 'Morfología Henneke 5', raza: 'Criollo Llanero', categoria: 'Yeguas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 6.5 },
    { id: 'EQ-CC-36', arete: 'EQ-CC036', nombre: 'Henneke Óptimo 6', raza: 'Árabe', categoria: 'Potros / Potrancas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 6.7 },
    { id: 'EQ-CC-37', arete: 'EQ-CC037', nombre: 'Henneke Eval 6', raza: 'Cuarto de Milla', categoria: 'Caballos', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 2.5, valor: 6.8 },
    { id: 'EQ-CC-38', arete: 'EQ-CC038', nombre: 'Balance Henneke 6', raza: 'Paso Fino', categoria: 'Yeguas', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 3.8, valor: 7 },
    { id: 'EQ-CC-39', arete: 'EQ-CC039', nombre: 'Condición Corporal Equina 6', raza: 'Criollo Llanero', categoria: 'Potros / Potrancas', lote: 'Potrero Caballerizas', sexo: 'Macho', edadAnos: 5.2, valor: 7.1 },
    { id: 'EQ-CC-40', arete: 'EQ-CC040', nombre: 'Reserva Grasa 6', raza: 'Árabe', categoria: 'Caballos', lote: 'Picadero y Entrenamiento', sexo: 'Hembra', edadAnos: 6.5, valor: 7.3 }
  ]
};

export interface ZootechDistributionStats {
  n: number;
  media: number;
  desviacionEstandar: number;
  varianza: number;
  mediana: number;
  coeficienteVariacion: number;
  minimo: number;
  maximo: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  precision: number;
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

// Cálculo de percentil de un arreglo ordenado
export const getPercentile = (sorted: number[], p: number): number => {
  if (sorted.length === 0) return 0;
  if (p <= 0) return sorted[0];
  if (p >= 100) return sorted[sorted.length - 1];

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

// Función de densidad normal gaussiana
export const gaussianDensity = (x: number, mean: number, stdDev: number): number => {
  if (stdDev === 0) return 0;
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

// Función de distribución acumulada normal aproximada (CDF)
export const normalCdf = (x: number, mean: number, stdDev: number): number => {
  if (stdDev === 0) return x < mean ? 0 : 1;
  const z = (x - mean) / stdDev;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
};

// Cálculo exhaustivo de estadísticas zootécnicas con adaptación para variables decimales o enteras
export const calculateZootechStats = (animals: AnimalZootecnico[]): ZootechDistributionStats => {
  const values = animals.map(a => a.valor).sort((a, b) => a - b);
  const n = values.length;

  if (n === 0) {
    return {
      n: 0,
      media: 0,
      desviacionEstandar: 0,
      varianza: 0,
      mediana: 0,
      coeficienteVariacion: 0,
      minimo: 0,
      maximo: 0,
      p10: 0,
      p25: 0,
      p50: 0,
      p75: 0,
      p90: 0,
      precision: 0,
      curvaGauss: [],
      intervalosFrecuencia: []
    };
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  const totalRange = values[values.length - 1] - values[0];
  const precision = totalRange < 2 ? 2 : totalRange < 15 ? 1 : totalRange < 60 ? 1 : 0;
  const statPrecision = Math.max(1, precision);

  const media = parseFloat((sum / n).toFixed(statPrecision));

  // Varianza muestral
  const varianceSum = values.reduce((acc, val) => acc + Math.pow(val - media, 2), 0);
  const varianza = parseFloat((n > 1 ? varianceSum / (n - 1) : 0).toFixed(statPrecision));
  const desviacionEstandar = parseFloat(Math.sqrt(varianza).toFixed(statPrecision));

  const mediana = parseFloat(getPercentile(values, 50).toFixed(statPrecision));
  const cv = media > 0 ? parseFloat(((desviacionEstandar / media) * 100).toFixed(1)) : 0;
  const minimo = values[0];
  const maximo = values[values.length - 1];

  const p10 = parseFloat(getPercentile(values, 10).toFixed(statPrecision));
  const p25 = parseFloat(getPercentile(values, 25).toFixed(statPrecision));
  const p50 = mediana;
  const p75 = parseFloat(getPercentile(values, 75).toFixed(statPrecision));
  const p90 = parseFloat(getPercentile(values, 90).toFixed(statPrecision));

  // Puntos de la campana de Gauss adaptativos
  const numCurvePoints = 36;
  const effStdDev = desviacionEstandar > 0 ? desviacionEstandar : 1;
  const startX = media - 3.2 * effStdDev;
  const endX = media + 3.2 * effStdDev;
  const step = (endX - startX) / numCurvePoints;

  const curvaGauss: { x: number; y: number }[] = [];
  for (let i = 0; i <= numCurvePoints; i++) {
    const rawX = startX + i * step;
    const roundedX = precision === 0 ? Math.round(rawX) : parseFloat(rawX.toFixed(precision));
    const y = gaussianDensity(roundedX, media, effStdDev);
    curvaGauss.push({ x: roundedX, y: parseFloat(y.toFixed(5)) });
  }

  // Intervalos de frecuencia
  const numIntervalos = 6;
  const intervalWidth = (maximo - minimo) / numIntervalos;
  const intervalosFrecuencia = [];
  let acum = 0;

  const formatIntervalVal = (val: number): string => {
    if (precision === 0) return Math.round(val).toString();
    return val.toFixed(precision);
  };

  for (let i = 0; i < numIntervalos; i++) {
    const rStart = minimo + i * intervalWidth;
    const rEnd = i === numIntervalos - 1 ? maximo : rStart + intervalWidth;
    const count = values.filter(v => (i === numIntervalos - 1 ? v >= rStart && v <= rEnd : v >= rStart && v < rEnd)).length;
    const pct = parseFloat(((count / n) * 100).toFixed(1));
    acum += pct;

    const mid = (rStart + rEnd) / 2;
    const zScore = effStdDev > 0 ? parseFloat(((mid - media) / effStdDev).toFixed(2)) : 0;

    // Frecuencia esperada bajo la normal teórica
    const cdf1 = normalCdf(rStart, media, effStdDev);
    const cdf2 = normalCdf(rEnd, media, effStdDev);
    const fe = parseFloat(((cdf2 - cdf1) * n).toFixed(1));

    intervalosFrecuencia.push({
      rango: `${formatIntervalVal(rStart)} - ${formatIntervalVal(rEnd)}`,
      frecuenciaObservada: count,
      porcentajeObservado: pct,
      frecuenciaEsperada: fe,
      porcentajeAcumulado: Math.min(100, parseFloat(acum.toFixed(1))),
      zScore
    });
  }

  return {
    n,
    media,
    desviacionEstandar,
    varianza,
    mediana,
    coeficienteVariacion: cv,
    minimo,
    maximo,
    p10,
    p25,
    p50,
    p75,
    p90,
    precision,
    curvaGauss,
    intervalosFrecuencia
  };
};

export interface GeneticSimulationResult {
  lowerThresholdPercent: number;
  upperThresholdPercent: number;
  lowerCutoffValue: number;
  upperCutoffValue: number;
  cullingAnimals: AnimalZootecnico[];
  eliteAnimals: AnimalZootecnico[];
  remainingAnimalsCount: number;
  remainingMean: number;
  potentialHerdGain: number;
  eliteMean: number;
  selectionDifferential: number;
  isLowerBetter: boolean;
}

// Simulación de selección y culling zootécnico adaptativo
export const calculateGeneticSimulation = (
  animals: AnimalZootecnico[],
  stats: ZootechDistributionStats,
  lowerPct: number, // 0 - 30%
  upperPct: number, // 0 - 30%
  isLowerBetter = false
): GeneticSimulationResult => {
  const values = animals.map(a => a.valor).sort((a, b) => a - b);
  const precision = stats.precision ?? 1;
  const statPrec = Math.max(1, precision);

  const roundCutoff = (v: number) => precision === 0 ? Math.round(v) : parseFloat(v.toFixed(precision));
  const roundStat = (v: number) => parseFloat(v.toFixed(statPrec));

  let lowerCutoffValue: number;
  let upperCutoffValue: number;
  let cullingAnimals: AnimalZootecnico[];
  let eliteAnimals: AnimalZootecnico[];
  let remainingAnimals: AnimalZootecnico[];

  if (!isLowerBetter) {
    // Para producción, peso, postura, GDP, LNV: valores bajos se descartan, valores altos son élite
    lowerCutoffValue = roundCutoff(getPercentile(values, lowerPct));
    upperCutoffValue = roundCutoff(getPercentile(values, 100 - upperPct));

    cullingAnimals = animals
      .filter(a => a.valor <= lowerCutoffValue)
      .sort((a, b) => a.valor - b.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Descarte Sugerido' as const
      }));

    eliteAnimals = animals
      .filter(a => a.valor >= upperCutoffValue)
      .sort((a, b) => b.valor - a.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Donadora Élite' as const
      }));

    remainingAnimals = animals.filter(a => a.valor > lowerCutoffValue);
  } else {
    // Para variables donde menor es mejor (IEP, ICA, Grasa Dorsal):
    // Valores altos son peores (descarte), valores bajos son élite
    lowerCutoffValue = roundCutoff(getPercentile(values, 100 - lowerPct));
    upperCutoffValue = roundCutoff(getPercentile(values, upperPct));

    cullingAnimals = animals
      .filter(a => a.valor >= lowerCutoffValue)
      .sort((a, b) => b.valor - a.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Descarte Sugerido' as const
      }));

    eliteAnimals = animals
      .filter(a => a.valor <= upperCutoffValue)
      .sort((a, b) => a.valor - b.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Donadora Élite' as const
      }));

    remainingAnimals = animals.filter(a => a.valor < lowerCutoffValue);
  }

  const remainingMean = remainingAnimals.length > 0
    ? roundStat(remainingAnimals.reduce((acc, a) => acc + a.valor, 0) / remainingAnimals.length)
    : stats.media;

  // Ganancia potencial del rebaño
  let potentialHerdGain = 0;
  if (!isLowerBetter) {
    potentialHerdGain = roundStat(remainingMean - stats.media);
  } else {
    // En variables donde menor es mejor (IEP, ICA, grasa dorsal), la reducción es una mejora
    potentialHerdGain = roundStat(stats.media - remainingMean);
  }

  const eliteMean = eliteAnimals.length > 0
    ? roundStat(eliteAnimals.reduce((acc, a) => acc + a.valor, 0) / eliteAnimals.length)
    : stats.media;

  let selectionDifferential = 0;
  if (!isLowerBetter) {
    selectionDifferential = roundStat(eliteMean - stats.media);
  } else {
    selectionDifferential = roundStat(stats.media - eliteMean);
  }

  return {
    lowerThresholdPercent: lowerPct,
    upperThresholdPercent: upperPct,
    lowerCutoffValue,
    upperCutoffValue,
    cullingAnimals,
    eliteAnimals,
    remainingAnimalsCount: remainingAnimals.length,
    remainingMean,
    potentialHerdGain,
    eliteMean,
    selectionDifferential,
    isLowerBetter
  };
};
