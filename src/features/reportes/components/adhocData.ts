/* =========================================================================
 * DATOS BASE Y CONFIGURACIONES PARA EL DISEÑADOR BI AD-HOC MULTIESPECIE
 * Soporta las 6 especies: Bovinos, Aves, Porcinos, Búfalos, Caprinos, Equinos
 * ========================================================================= */

export type BaseEntityType =
  | 'semovientes'
  | 'lactancias'
  | 'controles_lecheros'
  | 'postura_avicola'
  | 'camadas_porcinas'
  | 'eventos_veterinarios'
  | 'potreros_e_instalaciones'
  | 'faena_y_trabajo';

export interface ColumnDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date';
  isCalculated?: boolean;
  formulaDescription?: string;
  compute?: (row: any) => any;
}

export interface EntityConfig {
  id: BaseEntityType;
  title: string;
  subtitle: string;
  iconName: string;
  speciesBadge: string;
  description: string;
  defaultColumns: string[];
  columns: ColumnDefinition[];
  data: any[];
}

export const ADHOC_ENTITIES: Record<BaseEntityType, EntityConfig> = {
  // 1. SEMOVIENTES (PADRÓN GENERAL MULTIESPECIE)
  semovientes: {
    id: 'semovientes',
    title: 'Semovientes (Padrón Maestro)',
    subtitle: 'Inventario de las 6 especies zootécnicas',
    iconName: 'Users',
    speciesBadge: '🐾 6 Especies',
    description: 'Catálogo exhaustivo unificado con arete/identificador oficial, especie, subcategoría zootécnica, raza, lote, condición reproductiva y pesos.',
    defaultColumns: ['arete', 'nombre', 'especie', 'subcategoria', 'raza', 'lote', 'edadAnos', 'ultimoPesoKg', 'pesoAdultoAjustado'],
    columns: [
      { key: 'arete', label: 'Arete / ID Único', type: 'string' },
      { key: 'nombre', label: 'Nombre / Alias', type: 'string' },
      { key: 'especie', label: 'Especie Pecuaria', type: 'string' },
      { key: 'subcategoria', label: 'Subcategoría Zootécnica', type: 'string' },
      { key: 'raza', label: 'Raza / Línea Genética', type: 'string' },
      { key: 'lote', label: 'Lote / Galpón / Aprisco', type: 'string' },
      { key: 'estatus', label: 'Estatus Vital', type: 'string' },
      { key: 'estatusReproductivo', label: 'Estatus Reproductivo', type: 'string' },
      { key: 'edadAnos', label: 'Edad (Años)', type: 'number' },
      { key: 'partos', label: 'Partos / Ciclos', type: 'number' },
      { key: 'ultimoPesoKg', label: 'Último Peso (kg)', type: 'number' },
      {
        key: 'pesoAdultoAjustado',
        label: 'Peso Adulto Estimado (kg)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Peso ajustado según coeficiente de madurez por especie',
        compute: (r: any) => {
          const factor = r.especie === 'Porcino' ? 1.15 : r.especie === 'Equino' ? 1.08 : r.especie === 'Ave' ? 1.02 : 1.12;
          return parseFloat((r.ultimoPesoKg * factor).toFixed(1));
        }
      },
      {
        key: 'indiceFertilidad',
        label: 'Índice Partos/Año',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Partos acumulados divididos entre vida útil productiva',
        compute: (r: any) => {
          const vidaUtil = Math.max(1, (r.edadAnos || 2) - 1.5);
          return parseFloat(((r.partos || 0) / vidaUtil).toFixed(2));
        }
      }
    ],
    data: [
      // Bovinos
      { id: '1', arete: '0001', nombre: 'Mariposa', especie: 'Bovino', subcategoria: 'Vaca Ordeño', raza: 'Carora', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 5.4, partos: 3, ultimoPesoKg: 465 },
      { id: '2', arete: '0002', nombre: 'Esperanza', especie: 'Bovino', subcategoria: 'Vaca Ordeño', raza: 'Carora', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Vacía', edadAnos: 4.8, partos: 2, ultimoPesoKg: 480 },
      { id: '3', arete: 'CW002', nombre: 'Baronesa', especie: 'Bovino', subcategoria: 'Vaca Ordeño', raza: 'Gyr Lechero', lote: '02 - Ordeño', estatus: 'Activo', estatusReproductivo: 'En servicio', edadAnos: 6.1, partos: 4, ultimoPesoKg: 495 },
      { id: '4', arete: 'CW007', nombre: 'Estrella', especie: 'Bovino', subcategoria: 'Vaca Seca', raza: 'Carora', lote: '03 - Secas', estatus: 'Activo', estatusReproductivo: 'Seca / FPP', edadAnos: 5.1, partos: 3, ultimoPesoKg: 450 },
      { id: '5', arete: 'VC-115', nombre: 'Muñeca', especie: 'Bovino', subcategoria: 'Novilla', raza: 'Girolando', lote: '04 - Novillas', estatus: 'Activo', estatusReproductivo: 'Apta servicio', edadAnos: 2.1, partos: 0, ultimoPesoKg: 345 },
      // Aves
      { id: '6', arete: 'AV-G01', nombre: 'Lote Ponedoras G1', especie: 'Ave', subcategoria: 'Gallina Ponedora', raza: 'Lohmann Brown', lote: 'Galpón 01', estatus: 'Activo', estatusReproductivo: 'En postura (88%)', edadAnos: 0.8, partos: 1, ultimoPesoKg: 1.95 },
      { id: '7', arete: 'AV-G02', nombre: 'Lote Ponedoras G2', especie: 'Ave', subcategoria: 'Gallina Ponedora', raza: 'Hy-Line Brown', lote: 'Galpón 02', estatus: 'Activo', estatusReproductivo: 'En postura (92%)', edadAnos: 0.6, partos: 1, ultimoPesoKg: 1.88 },
      { id: '8', arete: 'AV-GF01', nombre: 'El Sultán', especie: 'Ave', subcategoria: 'Gallo Fino', raza: 'Criollo Combate', lote: 'Ronda Gallos', estatus: 'Activo', estatusReproductivo: 'Reproductor', edadAnos: 1.8, partos: 0, ultimoPesoKg: 2.15 },
      // Porcinos
      { id: '9', arete: 'PC-M01', nombre: 'Matriarca P01', especie: 'Porcino', subcategoria: 'Cerda Reproductora', raza: 'Landrace F1', lote: 'Maternidad 01', estatus: 'Activo', estatusReproductivo: 'Gestación 108d', edadAnos: 2.5, partos: 4, ultimoPesoKg: 240 },
      { id: '10', arete: 'PC-M02', nombre: 'Duquesa P02', especie: 'Porcino', subcategoria: 'Cerda Reproductora', raza: 'Yorkshire', lote: 'Gestación A', estatus: 'Activo', estatusReproductivo: 'Inseminada', edadAnos: 1.9, partos: 2, ultimoPesoKg: 225 },
      { id: '11', arete: 'PC-VR01', nombre: 'Titán', especie: 'Porcino', subcategoria: 'Verraco Semental', raza: 'Pietrain Puro', lote: 'Corral Verracos', estatus: 'Activo', estatusReproductivo: 'Padrote activo', edadAnos: 2.2, partos: 0, ultimoPesoKg: 285 },
      // Búfalos
      { id: '12', arete: 'BF-001', nombre: 'Doña Bárbara', especie: 'Búfalo', subcategoria: 'Búfala Ordeño', raza: 'Murrah', lote: 'Sabana 01', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 6.2, partos: 4, ultimoPesoKg: 580 },
      { id: '13', arete: 'BF-002', nombre: 'Caranta', especie: 'Búfalo', subcategoria: 'Búfala Ordeño', raza: 'Mediterráneo', lote: 'Sabana 01', estatus: 'Activo', estatusReproductivo: 'Lactando', edadAnos: 5.5, partos: 3, ultimoPesoKg: 560 },
      { id: '14', arete: 'BF-BU03', nombre: 'Trueno Bucérrico', especie: 'Búfalo', subcategoria: 'Bucerro Crecimiento', raza: 'Murrah', lote: 'Lote Bucerros', estatus: 'Activo', estatusReproductivo: 'Cría', edadAnos: 0.7, partos: 0, ultimoPesoKg: 175 },
      // Caprinos
      { id: '15', arete: 'CP-01', nombre: 'Blanquita', especie: 'Caprino', subcategoria: 'Cabra Lechera', raza: 'Saanen', lote: 'Aprisco Tarima', estatus: 'Activo', estatusReproductivo: 'Lactando', edadAnos: 3.2, partos: 2, ultimoPesoKg: 62 },
      { id: '16', arete: 'CP-02', nombre: 'Estrella Alpina', especie: 'Caprino', subcategoria: 'Cabra Lechera', raza: 'Alpina Francesa', lote: 'Aprisco Tarima', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 2.8, partos: 2, ultimoPesoKg: 58 },
      { id: '17', arete: 'CP-BOER', nombre: 'Sultancito', especie: 'Caprino', subcategoria: 'Chivo Reproductor', raza: 'Boer', lote: 'Corral Machos', estatus: 'Activo', estatusReproductivo: 'Padrote activo', edadAnos: 2.4, partos: 0, ultimoPesoKg: 85 },
      // Equinos
      { id: '18', arete: 'EQ-001', nombre: 'Centauro', especie: 'Equino', subcategoria: 'Caballo de Trabajo', raza: 'Criollo Llanero', lote: 'Caballeriza Principal', estatus: 'Activo', estatusReproductivo: 'Castrado', edadAnos: 7.0, partos: 0, ultimoPesoKg: 440 },
      { id: '19', arete: 'EQ-002', nombre: 'Victoria', especie: 'Equino', subcategoria: 'Yegua Reproductora', raza: 'Cuarto de Milla', lote: 'Piquete Yeguas', estatus: 'Activo', estatusReproductivo: 'Preñada 6m', edadAnos: 5.8, partos: 2, ultimoPesoKg: 490 }
    ]
  },

  // 2. LACTANCIAS MULTIESPECIE (BOVINOS, BÚFALOS, CAPRINOS)
  lactancias: {
    id: 'lactancias',
    title: 'Lactancias Multiespecie (Bov, Búf, Cap)',
    subtitle: 'Campañas lecheras, DEL y proyecciones 210d / 270d / 305d',
    iconName: 'Milk',
    speciesBadge: '🐮 🐃 🐐 Lecheras',
    description: 'Comportamiento de campañas lecheras estandarizadas según la fisiología de cada especie (Caprinos 210d, Búfalos 270d, Vacas 305d) y totales acumulados.',
    defaultColumns: ['arete', 'nombre', 'especie', 'raza', 'lactanciaNumero', 'diasLactancia', 'proyeccionEstandarKg', 'produccionTotalKg', 'produccionDiariaDEL'],
    columns: [
      { key: 'arete', label: 'Arete / ID', type: 'string' },
      { key: 'nombre', label: 'Nombre Hembra', type: 'string' },
      { key: 'especie', label: 'Especie', type: 'string' },
      { key: 'raza', label: 'Raza Predominante', type: 'string' },
      { key: 'lactanciaNumero', label: 'Lactancia Nº', type: 'number' },
      { key: 'diasLactancia', label: 'Días en Leche (DEL)', type: 'number' },
      { key: 'p210Kg', label: 'Proy. Caprina 210d (kg)', type: 'number' },
      { key: 'p270Kg', label: 'Proy. Bufalina 270d (kg)', type: 'number' },
      { key: 'p305Kg', label: 'Proy. Bovina 305d (kg)', type: 'number' },
      { key: 'produccionTotalKg', label: 'Total Acumulado (kg)', type: 'number' },
      {
        key: 'proyeccionEstandarKg',
        label: 'Proyección Oficial Especie (kg)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Selecciona 210d para caprinos, 270d para búfalos y 305d para vacas',
        compute: (r: any) => {
          if (r.especie === 'Caprino') return r.p210Kg || 0;
          if (r.especie === 'Búfalo') return r.p270Kg || 0;
          return r.p305Kg || 0;
        }
      },
      {
        key: 'produccionDiariaDEL',
        label: 'Promedio DEL (kg/día)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Producción total acumulada dividida entre días en leche (kg / DEL)',
        compute: (r: any) => parseFloat(((r.produccionTotalKg || 0) / Math.max(1, r.diasLactancia || 1)).toFixed(2))
      }
    ],
    data: [
      // Vacas 305d
      { id: '1', arete: '0001', nombre: 'Mariposa', especie: 'Bovino', raza: 'Carora', lactanciaNumero: 5, diasLactancia: 305, p210Kg: 3500, p270Kg: 4450, p305Kg: 4890, produccionTotalKg: 4920 },
      { id: '2', arete: '0002', nombre: 'Esperanza', especie: 'Bovino', raza: 'Carora', lactanciaNumero: 4, diasLactancia: 310, p210Kg: 3800, p270Kg: 5010, p305Kg: 5420, produccionTotalKg: 5500 },
      { id: '3', arete: 'CW002', nombre: 'Baronesa', especie: 'Bovino', raza: 'Gyr Lechero', lactanciaNumero: 4, diasLactancia: 301, p210Kg: 3100, p270Kg: 4180, p305Kg: 4520, produccionTotalKg: 4520 },
      { id: '4', arete: 'CW008', nombre: 'Milenaria', especie: 'Bovino', raza: 'Holstein', lactanciaNumero: 4, diasLactancia: 338, p210Kg: 4200, p270Kg: 5390, p305Kg: 5850, produccionTotalKg: 6150 },
      // Búfalas 270d
      { id: '5', arete: 'BF-001', nombre: 'Doña Bárbara', especie: 'Búfalo', raza: 'Murrah', lactanciaNumero: 4, diasLactancia: 270, p210Kg: 1850, p270Kg: 2350, p305Kg: 2480, produccionTotalKg: 2350 },
      { id: '6', arete: 'BF-002', nombre: 'Caranta', especie: 'Búfalo', raza: 'Mediterráneo', lactanciaNumero: 3, diasLactancia: 265, p210Kg: 1720, p270Kg: 2180, p305Kg: 2280, produccionTotalKg: 2160 },
      { id: '7', arete: 'BF-003', nombre: 'Perla Negra', especie: 'Búfalo', raza: 'Murrah', lactanciaNumero: 2, diasLactancia: 250, p210Kg: 1600, p270Kg: 2040, p305Kg: 2120, produccionTotalKg: 1980 },
      // Cabras 210d
      { id: '8', arete: 'CP-01', nombre: 'Blanquita', especie: 'Caprino', raza: 'Saanen', lactanciaNumero: 2, diasLactancia: 210, p210Kg: 780, p270Kg: 850, p305Kg: 890, produccionTotalKg: 790 },
      { id: '9', arete: 'CP-02', nombre: 'Estrella Alpina', especie: 'Caprino', raza: 'Alpina Francesa', lactanciaNumero: 2, diasLactancia: 205, p210Kg: 690, p270Kg: 740, p305Kg: 780, produccionTotalKg: 685 },
      { id: '10', arete: 'CP-03', nombre: 'Mora Nubiana', especie: 'Caprino', raza: 'Anglo Nubian', lactanciaNumero: 3, diasLactancia: 195, p210Kg: 620, p270Kg: 660, p305Kg: 700, produccionTotalKg: 610 }
    ]
  },

  // 3. CONTROLES LECHEROS & CALIDAD FISICOQUÍMICA
  controles_lecheros: {
    id: 'controles_lecheros',
    title: 'Controles Lecheros & Calidad',
    subtitle: 'Pesajes AM/PM, grasa %, proteína %, relación G/P y RCS',
    iconName: 'ClipboardList',
    speciesBadge: '🥛 Calidad Láctea',
    description: 'Pesajes de rutina en sala de ordeño con análisis de grasa butirométrica, proteína cruda, relación G/P, conteo de células somáticas (RCS) y alertas de mastitis.',
    defaultColumns: ['arete', 'nombre', 'especie', 'fecha', 'pesaje1Kg', 'pesaje2Kg', 'pesajeTotalKg', 'grasaPorc', 'proteinaPorc', 'relacionGrasaProteina', 'rcsMil', 'alertaCalidad'],
    columns: [
      { key: 'arete', label: 'Arete / ID', type: 'string' },
      { key: 'nombre', label: 'Nombre Hembra', type: 'string' },
      { key: 'especie', label: 'Especie', type: 'string' },
      { key: 'lote', label: 'Lote / Tarima', type: 'string' },
      { key: 'fecha', label: 'Fecha Control', type: 'date' },
      { key: 'pesaje1Kg', label: 'Pesaje AM (kg)', type: 'number' },
      { key: 'pesaje2Kg', label: 'Pesaje PM (kg)', type: 'number' },
      { key: 'pesajeTotalKg', label: 'Total Diario (kg)', type: 'number' },
      { key: 'grasaPorc', label: 'Grasa (%)', type: 'number' },
      { key: 'proteinaPorc', label: 'Proteína (%)', type: 'number' },
      { key: 'relacionGrasaProteina', label: 'Relación G/P', type: 'number' },
      { key: 'rcsMil', label: 'RCS (x10³ cel/ml)', type: 'number' },
      {
        key: 'solidosTotalesPorc',
        label: 'Sólidos Totales (%)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Sólidos totales estimados: Grasa + Proteína + Lactosa/Minerales (~5.0%)',
        compute: (r: any) => parseFloat(((r.grasaPorc || 0) + (r.proteinaPorc || 0) + 5.1).toFixed(2))
      },
      {
        key: 'alertaCalidad',
        label: 'Diagnóstico Fisicoquímico',
        type: 'string',
        isCalculated: true,
        formulaDescription: 'Alerta sanitaria contextual por especie (RCS elevado o desbalance G/P)',
        compute: (r: any) => {
          if (r.especie === 'Caprino') {
            if (r.rcsMil > 800) return 'RCS Alto Caprino';
            return 'Calidad Caprina Óptima';
          }
          if (r.especie === 'Búfalo') {
            if (r.grasaPorc < 6.5) return 'Grasa Bufalina Baja';
            if (r.rcsMil > 200) return 'Mastitis Subclínica Bufalina';
            return 'Apta Quesera Mozzarella A1';
          }
          // Bovino
          if (r.rcsMil > 200) return 'Mastitis Subclínica (RCS > 200k)';
          if (r.relacionGrasaProteina < 1.05) return 'Riesgo Acidosis Ruminal';
          if (r.relacionGrasaProteina > 1.45) return 'Riesgo Cetosis';
          return 'Calidad Óptima A1';
        }
      }
    ],
    data: [
      // Bovinos
      { id: '1', arete: '0001', nombre: 'Mariposa', especie: 'Bovino', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 9.4, pesaje2Kg: 7.2, pesajeTotalKg: 16.6, grasaPorc: 3.85, proteinaPorc: 3.15, relacionGrasaProteina: 1.22, rcsMil: 140 },
      { id: '2', arete: '0002', nombre: 'Esperanza', especie: 'Bovino', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 10.2, pesaje2Kg: 8.5, pesajeTotalKg: 18.7, grasaPorc: 3.90, proteinaPorc: 3.12, relacionGrasaProteina: 1.25, rcsMil: 110 },
      { id: '3', arete: 'CW008', nombre: 'Milenaria', especie: 'Bovino', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 11.5, pesaje2Kg: 9.2, pesajeTotalKg: 20.7, grasaPorc: 3.55, proteinaPorc: 3.08, relacionGrasaProteina: 1.15, rcsMil: 280 },
      // Búfalas (grasa alta 7.5-8.8%)
      { id: '4', arete: 'BF-001', nombre: 'Doña Bárbara', especie: 'Búfalo', lote: 'Ordeño Sabana', fecha: '2026-09-08', pesaje1Kg: 5.2, pesaje2Kg: 3.9, pesajeTotalKg: 9.1, grasaPorc: 8.40, proteinaPorc: 4.35, relacionGrasaProteina: 1.93, rcsMil: 95 },
      { id: '5', arete: 'BF-002', nombre: 'Caranta', especie: 'Búfalo', lote: 'Ordeño Sabana', fecha: '2026-09-08', pesaje1Kg: 4.8, pesaje2Kg: 3.5, pesajeTotalKg: 8.3, grasaPorc: 8.10, proteinaPorc: 4.20, relacionGrasaProteina: 1.92, rcsMil: 120 },
      // Caprinos (tarima 2.5-4.5 kg)
      { id: '6', arete: 'CP-01', nombre: 'Blanquita', especie: 'Caprino', lote: 'Aprisco Tarima', fecha: '2026-09-08', pesaje1Kg: 2.1, pesaje2Kg: 1.7, pesajeTotalKg: 3.8, grasaPorc: 4.10, proteinaPorc: 3.40, relacionGrasaProteina: 1.20, rcsMil: 480 },
      { id: '7', arete: 'CP-02', nombre: 'Estrella Alpina', especie: 'Caprino', lote: 'Aprisco Tarima', fecha: '2026-09-08', pesaje1Kg: 1.9, pesaje2Kg: 1.5, pesajeTotalKg: 3.4, grasaPorc: 3.95, proteinaPorc: 3.35, relacionGrasaProteina: 1.18, rcsMil: 510 }
    ]
  },

  // 4. POSTURA AVÍCOLA DIARIA
  postura_avicola: {
    id: 'postura_avicola',
    title: 'Control Diario de Postura Avícola',
    subtitle: 'Galpones, recolección de huevos, % postura y mermas',
    iconName: 'Egg',
    speciesBadge: '🐔 Aves de Corral',
    description: 'Registro de postura diaria por galpón y estirpe genética: conteo de huevos comerciales clasificados, huevos fértiles, rotos/sucios, peso medio y conversión.',
    defaultColumns: ['galpon', 'lote', 'lineaGenetica', 'fecha', 'avesAlojadas', 'huevosComerciales', 'huevosFertiles', 'huevosRotos', 'porcentajePostura', 'pesoMedioGramos', 'clasificacionLote'],
    columns: [
      { key: 'galpon', label: 'Galpón', type: 'string' },
      { key: 'lote', label: 'Lote / Parvada', type: 'string' },
      { key: 'lineaGenetica', label: 'Línea Genética', type: 'string' },
      { key: 'semanaVida', label: 'Semana de Edad', type: 'number' },
      { key: 'fecha', label: 'Fecha Recolección', type: 'date' },
      { key: 'avesAlojadas', label: 'Aves Vivas Alojadas', type: 'number' },
      { key: 'huevosComerciales', label: 'Huevos Comerciales', type: 'number' },
      { key: 'huevosFertiles', label: 'Huevos Fértiles', type: 'number' },
      { key: 'huevosRotos', label: 'Huevos Rotos / Sucios', type: 'number' },
      { key: 'pesoMedioGramos', label: 'Peso Medio Huevo (g)', type: 'number' },
      { key: 'consumoAlimentoKg', label: 'Consumo Pienso (kg)', type: 'number' },
      {
        key: 'porcentajePostura',
        label: '% Postura del Lote',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Huevos totales recolectados entre aves alojadas multiplicado por 100',
        compute: (r: any) => {
          const totalHuevos = (r.huevosComerciales || 0) + (r.huevosFertiles || 0) + (r.huevosRotos || 0);
          return parseFloat(((totalHuevos / Math.max(1, r.avesAlojadas || 1)) * 100).toFixed(1));
        }
      },
      {
        key: 'clasificacionLote',
        label: 'Clasificación Comercial',
        type: 'string',
        isCalculated: true,
        formulaDescription: 'Tipificación comercial según peso medio: AAA (>67g), AA (60-66g), A (53-59g)',
        compute: (r: any) => {
          const p = r.pesoMedioGramos || 0;
          if (p >= 67) return 'Categoría AAA (Extra Grande)';
          if (p >= 60) return 'Categoría AA (Grande)';
          if (p >= 53) return 'Categoría A (Mediano)';
          return 'Categoría B (Pequeño)';
        }
      }
    ],
    data: [
      { id: '1', galpon: 'Galpón 01', lote: 'Lote-LB-2025', lineaGenetica: 'Lohmann Brown', semanaVida: 34, fecha: '2026-09-10', avesAlojadas: 4850, huevosComerciales: 4320, huevosFertiles: 0, huevosRotos: 48, pesoMedioGramos: 63.4, consumoAlimentoKg: 545 },
      { id: '2', galpon: 'Galpón 01', lote: 'Lote-LB-2025', lineaGenetica: 'Lohmann Brown', semanaVida: 34, fecha: '2026-09-11', avesAlojadas: 4848, huevosComerciales: 4345, huevosFertiles: 0, huevosRotos: 42, pesoMedioGramos: 63.6, consumoAlimentoKg: 548 },
      { id: '3', galpon: 'Galpón 02', lote: 'Lote-HL-2026', lineaGenetica: 'Hy-Line Brown', semanaVida: 28, fecha: '2026-09-10', avesAlojadas: 5120, huevosComerciales: 4760, huevosFertiles: 0, huevosRotos: 35, pesoMedioGramos: 61.8, consumoAlimentoKg: 580 },
      { id: '4', galpon: 'Galpón 02', lote: 'Lote-HL-2026', lineaGenetica: 'Hy-Line Brown', semanaVida: 28, fecha: '2026-09-11', avesAlojadas: 5116, huevosComerciales: 4790, huevosFertiles: 0, huevosRotos: 31, pesoMedioGramos: 62.1, consumoAlimentoKg: 582 },
      { id: '5', galpon: 'Galpón 03 (Reprod)', lote: 'Lote-R308-R', lineaGenetica: 'Ross 308 Parental', semanaVida: 42, fecha: '2026-09-10', avesAlojadas: 2400, huevosComerciales: 280, huevosFertiles: 1650, huevosRotos: 22, pesoMedioGramos: 66.5, consumoAlimentoKg: 380 },
      { id: '6', galpon: 'Galpón 04 (Finos)', lote: 'Lote-GF-Cria', lineaGenetica: 'Criollo Gallo Fino', semanaVida: 50, fecha: '2026-09-10', avesAlojadas: 180, huevosComerciales: 25, huevosFertiles: 98, huevosRotos: 3, pesoMedioGramos: 54.0, consumoAlimentoKg: 22 }
    ]
  },

  // 5. CAMADAS & PARTOS PORCINOS
  camadas_porcinas: {
    id: 'camadas_porcinas',
    title: 'Camadas & Partos Porcinos',
    subtitle: 'Cerdas, maternidad, lechones vivos (LNV), momias y destetes',
    iconName: 'Baby',
    speciesBadge: '🐷 Porcinos Piara',
    description: 'Control de partos y maternidad porcina: lechones nacidos vivos (LNV), mortinatos, momias, peso de camada, promedio por lechón y balance al destete.',
    defaultColumns: ['areteCerda', 'nombreCerda', 'salaMaternidad', 'raza', 'numeroParto', 'fechaParto', 'lnv', 'lnm', 'momias', 'pesoCamadaKg', 'pesoPromedioLechonKg', 'tasaMortalidadParto'],
    columns: [
      { key: 'areteCerda', label: 'Arete Cerda', type: 'string' },
      { key: 'nombreCerda', label: 'Nombre Cerda', type: 'string' },
      { key: 'salaMaternidad', label: 'Sala / Jaula', type: 'string' },
      { key: 'raza', label: 'Línea Genética Cerda', type: 'string' },
      { key: 'numeroParto', label: 'Nº de Parto', type: 'number' },
      { key: 'fechaParto', label: 'Fecha Parto', type: 'date' },
      { key: 'lnv', label: 'Nacidos Vivos (LNV)', type: 'number' },
      { key: 'lnm', label: 'Nacidos Muertos (LNM)', type: 'number' },
      { key: 'momias', label: 'Momias Fetales', type: 'number' },
      { key: 'pesoCamadaKg', label: 'Peso Total Camada (kg)', type: 'number' },
      { key: 'lechonesDestetados', label: 'Destetados (21d)', type: 'number' },
      { key: 'pesoDesteteKg', label: 'Peso al Destete (kg)', type: 'number' },
      {
        key: 'pesoPromedioLechonKg',
        label: 'Peso Promedio/Lechón (kg)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Peso total de camada al nacer dividido entre nacidos vivos (LNV)',
        compute: (r: any) => parseFloat(((r.pesoCamadaKg || 0) / Math.max(1, r.lnv || 1)).toFixed(2))
      },
      {
        key: 'tasaMortalidadParto',
        label: '% Pérdida Perinatal',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Porcentaje de mortinatos y momias sobre total de lechones paridos',
        compute: (r: any) => {
          const total = (r.lnv || 0) + (r.lnm || 0) + (r.momias || 0);
          return parseFloat(((((r.lnm || 0) + (r.momias || 0)) / Math.max(1, total)) * 100).toFixed(1));
        }
      }
    ],
    data: [
      { id: '1', areteCerda: 'PC-M01', nombreCerda: 'Matriarca P01', salaMaternidad: 'Sala 01 - Jaula 04', raza: 'Landrace F1', numeroParto: 4, fechaParto: '2026-08-20', lnv: 14, lnm: 1, momias: 0, pesoCamadaKg: 19.8, lechonesDestetados: 13, pesoDesteteKg: 82.5 },
      { id: '2', areteCerda: 'PC-M02', nombreCerda: 'Duquesa P02', salaMaternidad: 'Sala 01 - Jaula 06', raza: 'Yorkshire', numeroParto: 2, fechaParto: '2026-08-22', lnv: 13, lnm: 0, momias: 1, pesoCamadaKg: 18.2, lechonesDestetados: 12, pesoDesteteKg: 75.0 },
      { id: '3', areteCerda: 'PC-M03', nombreCerda: 'Princesa P03', salaMaternidad: 'Sala 02 - Jaula 02', raza: 'Topigs 20', numeroParto: 3, fechaParto: '2026-08-25', lnv: 16, lnm: 1, momias: 0, pesoCamadaKg: 22.4, lechonesDestetados: 15, pesoDesteteKg: 94.2 },
      { id: '4', areteCerda: 'PC-M04', nombreCerda: 'Corona P04', salaMaternidad: 'Sala 02 - Jaula 05', raza: 'PIC Camborough', numeroParto: 5, fechaParto: '2026-08-28', lnv: 15, lnm: 0, momias: 0, pesoCamadaKg: 21.5, lechonesDestetados: 14, pesoDesteteKg: 89.0 },
      { id: '5', areteCerda: 'PC-M05', nombreCerda: 'Rubí P05', salaMaternidad: 'Sala 02 - Jaula 08', raza: 'Landrace F1', numeroParto: 1, fechaParto: '2026-09-02', lnv: 12, lnm: 2, momias: 0, pesoCamadaKg: 15.6, lechonesDestetados: 11, pesoDesteteKg: 68.0 }
    ]
  },

  // 6. EVENTOS VETERINARIOS & BLINDAJE DE INOCUIDAD
  eventos_veterinarios: {
    id: 'eventos_veterinarios',
    title: 'Eventos Veterinarios & Inocuidad',
    subtitle: 'Clínica multiespecie, tratamientos y tiempos de retiro',
    iconName: 'Activity',
    speciesBadge: '🏥 Clínica & Fármacos',
    description: 'Registro clínico multiespecie: diagnósticos veterinarios, fármacos aplicados, médico responsable y control estricto de períodos de retiro en leche y carne.',
    defaultColumns: ['arete', 'nombre', 'especie', 'fecha', 'tipoEvento', 'diagnostico', 'tratamiento', 'diasRetiroLeche', 'diasRetiroCarne', 'alertaInocuidad'],
    columns: [
      { key: 'arete', label: 'Arete / ID Animal', type: 'string' },
      { key: 'nombre', label: 'Nombre / Lote', type: 'string' },
      { key: 'especie', label: 'Especie Pecuaria', type: 'string' },
      { key: 'fecha', label: 'Fecha Tratamiento', type: 'date' },
      { key: 'tipoEvento', label: 'Tipo de Evento', type: 'string' },
      { key: 'diagnostico', label: 'Diagnóstico Clínico', type: 'string' },
      { key: 'tratamiento', label: 'Tratamiento Administrado', type: 'string' },
      { key: 'medicoResponsable', label: 'Médico Veterinario', type: 'string' },
      { key: 'diasRetiroLeche', label: 'Retiro Leche (días)', type: 'number' },
      { key: 'diasRetiroCarne', label: 'Retiro Carne (días)', type: 'number' },
      { key: 'estatusSanitario', label: 'Estatus Sanitario', type: 'string' },
      {
        key: 'alertaInocuidad',
        label: 'Bloqueo Sanitario Activo',
        type: 'string',
        isCalculated: true,
        formulaDescription: 'Alerta preventiva de inocuidad si el retiro en leche o carne es mayor a 0 días',
        compute: (r: any) => {
          if ((r.diasRetiroLeche || 0) > 0) return '⚠️ RETENCIÓN LECHE (Retiro Activo)';
          if ((r.diasRetiroCarne || 0) > 0) return '⚠️ RETENCIÓN CARNE (Retiro Activo)';
          return '✅ APTO PARA CONSUMO';
        }
      }
    ],
    data: [
      // Bovino
      { id: '1', arete: 'CW008', nombre: 'Milenaria', especie: 'Bovino', fecha: '2026-09-10', tipoEvento: 'Mastitis', diagnostico: 'Mastitis Clínica CMT-2 Cuarto PD', tratamiento: 'Cefalosporina Intramamaria (Mastijet)', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 3, diasRetiroCarne: 7, estatusSanitario: 'En Tratamiento' },
      // Caprino
      { id: '2', arete: 'CP-01', nombre: 'Blanquita', especie: 'Caprino', fecha: '2026-09-06', tipoEvento: 'Sanitario', diagnostico: 'Parasitismo Haemonchus FAMACHA Grado 4', tratamiento: 'Levamisol oral + Hierro inyectable', medicoResponsable: 'Dra. María Elena Gómez', diasRetiroLeche: 4, diasRetiroCarne: 14, estatusSanitario: 'En Tratamiento' },
      // Porcino
      { id: '3', arete: 'PC-M01', nombre: 'Matriarca P01', especie: 'Porcino', fecha: '2026-08-15', tipoEvento: 'Vacunación', diagnostico: 'Plan Vacunal Prevención Peste Porcina', tratamiento: 'Vacuna Peste Porcina Clásica (PPC) Cepa China', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 0, diasRetiroCarne: 0, estatusSanitario: 'Resuelto' },
      // Equino
      { id: '4', arete: 'EQ-001', nombre: 'Centauro', especie: 'Equino', fecha: '2026-09-01', tipoEvento: 'Certificación AIE', diagnostico: 'Evaluación Oficial Anemia Infecciosa Equina', tratamiento: 'Test de Coggins Oficial Negativo (Lab INSAI)', medicoResponsable: 'Dr. Juan P. Albarrán', diasRetiroLeche: 0, diasRetiroCarne: 0, estatusSanitario: 'Certificado Vigente' },
      // Ave
      { id: '5', arete: 'AV-G01', nombre: 'Lote Ponedoras G1', especie: 'Ave', fecha: '2026-08-25', tipoEvento: 'Vacunación Masiva', diagnostico: 'Refuerzo Prevención Newcastle / Bronquitis', tratamiento: 'Vacuna Newcastle LaSota vía aspersión', medicoResponsable: 'Dra. María Elena Gómez', diasRetiroLeche: 0, diasRetiroCarne: 0, estatusSanitario: 'Resuelto' },
      // Búfalo
      { id: '6', arete: 'BF-001', nombre: 'Doña Bárbara', especie: 'Búfalo', fecha: '2026-09-05', tipoEvento: 'Baño Sanitario', diagnostico: 'Control Garrapata y Mosca de Sabana', tratamiento: 'Baño de inmersión Flumetrina 1%', medicoResponsable: 'Ing. Roberto Silva', diasRetiroLeche: 0, diasRetiroCarne: 14, estatusSanitario: 'En Tratamiento' }
    ]
  },

  // 7. POTREROS E INSTALACIONES INTENSIVAS
  potreros_e_instalaciones: {
    id: 'potreros_e_instalaciones',
    title: 'Potreros, Apriscos & Galpones',
    subtitle: 'Infraestructura pecuaria, superficie, carga UGG y capacidad',
    iconName: 'Warehouse',
    speciesBadge: '🌾 Infraestructura',
    description: 'Gestión integral de instalaciones intensivas y extensivas: potreros PRV, sabanas inundables bufalinas, galpones avícolas, salas de maternidad porcina, apriscos y caballerizas.',
    defaultColumns: ['codigo', 'nombre', 'tipoInstalacion', 'especieAlojada', 'areaHaM2', 'animalesPresentes', 'cargaUggTotal', 'estatusOcupacion', 'presionOcupacionPorc'],
    columns: [
      { key: 'codigo', label: 'Código Instalación', type: 'string' },
      { key: 'nombre', label: 'Nombre Instalación', type: 'string' },
      { key: 'tipoInstalacion', label: 'Tipo de Instalación', type: 'string' },
      { key: 'especieAlojada', label: 'Especie Alojada', type: 'string' },
      { key: 'areaHaM2', label: 'Superficie (ha / m²)', type: 'string' },
      { key: 'capacidadMaxima', label: 'Capacidad Máxima (plazas/animales)', type: 'number' },
      { key: 'animalesPresentes', label: 'Animales Ocupantes', type: 'number' },
      { key: 'cargaUggTotal', label: 'Carga Total (UGG)', type: 'number' },
      { key: 'diasOcupacion', label: 'Días Ocupación', type: 'number' },
      { key: 'diasDescanso', label: 'Días Descanso', type: 'number' },
      { key: 'estatusOcupacion', label: 'Estatus Instalación', type: 'string' },
      {
        key: 'presionOcupacionPorc',
        label: '% Ocupación / Capacidad',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Relación porcentual entre ocupantes actuales y capacidad máxima de plazas',
        compute: (r: any) => parseFloat((((r.animalesPresentes || 0) / Math.max(1, r.capacidadMaxima || 1)) * 100).toFixed(1))
      }
    ],
    data: [
      { id: '1', codigo: 'POT-PRV1', nombre: 'Potrero de la Casa', tipoInstalacion: 'Potrero PRV', especieAlojada: 'Bovino', areaHaM2: '45.5 ha', capacidadMaxima: 35, animalesPresentes: 28, cargaUggTotal: 26.5, diasOcupacion: 3, diasDescanso: 0, estatusOcupacion: 'En Pastoreo' },
      { id: '2', codigo: 'POT-PRV3', nombre: 'Potrero El Mango', tipoInstalacion: 'Potrero PRV', especieAlojada: 'Bovino', areaHaM2: '52.0 ha', capacidadMaxima: 40, animalesPresentes: 0, cargaUggTotal: 0, diasOcupacion: 0, diasDescanso: 36, estatusOcupacion: 'Óptimo PRV (Listo)' },
      { id: '3', codigo: 'GALP-01', nombre: 'Galpón de Postura 01', tipoInstalacion: 'Galpón Avícola Automatizado', especieAlojada: 'Ave', areaHaM2: '1,200 m²', capacidadMaxima: 5000, animalesPresentes: 4848, cargaUggTotal: 2.4, diasOcupacion: 180, diasDescanso: 0, estatusOcupacion: 'En Producción' },
      { id: '4', codigo: 'PIARA-MAT1', nombre: 'Sala de Maternidad Porcina 01', tipoInstalacion: 'Maternidad con Jaulas', especieAlojada: 'Porcino', areaHaM2: '450 m²', capacidadMaxima: 16, animalesPresentes: 12, cargaUggTotal: 3.6, diasOcupacion: 28, diasDescanso: 0, estatusOcupacion: 'Lactancia Activa' },
      { id: '5', codigo: 'SAB-BUF1', nombre: 'Sabana Inundable Caño Dulce', tipoInstalacion: 'Sabana Bajas / Humedal', especieAlojada: 'Búfalo', areaHaM2: '120.0 ha', capacidadMaxima: 80, animalesPresentes: 65, cargaUggTotal: 78.0, diasOcupacion: 12, diasDescanso: 0, estatusOcupacion: 'En Pastoreo Sabana' },
      { id: '6', codigo: 'APR-CAP1', nombre: 'Aprisco Tarima El Mirador', tipoInstalacion: 'Aprisco con Tarima Ranurada', especieAlojada: 'Caprino', areaHaM2: '320 m²', capacidadMaxima: 60, animalesPresentes: 44, cargaUggTotal: 4.4, diasOcupacion: 45, diasDescanso: 0, estatusOcupacion: 'En Producción' },
      { id: '7', codigo: 'CAB-EQ1', nombre: 'Caballeriza Principal La Llanera', tipoInstalacion: 'Boxes Individuales', especieAlojada: 'Equino', areaHaM2: '600 m²', capacidadMaxima: 12, animalesPresentes: 8, cargaUggTotal: 8.8, diasOcupacion: 90, diasDescanso: 0, estatusOcupacion: 'Ocupación Parcial' }
    ]
  },

  // 8. FAENA, RENDIMIENTO EN CANAL & TRABAJO PECUARIO
  faena_y_trabajo: {
    id: 'faena_y_trabajo',
    title: 'Faena, Rendimiento & Trabajo',
    subtitle: 'Equinos de faena, lotes a matadero y gallos finos',
    iconName: 'Trophy',
    speciesBadge: '🐴 🐷 🐔 Trabajo & Canal',
    description: 'Bitácora operativa de rendimiento físico: jornadas de vaquería llanera equina, lotes de porcinos/bovinos despachados a matadero con rendimiento en canal, y registros de gallos de combate.',
    defaultColumns: ['ejemplar', 'especie', 'laborODisciplina', 'fecha', 'horasOJornadas', 'pesoEntradaKg', 'rendimientoEstimadoPorc', 'estadoAptitud', 'kilosCanalProyectados'],
    columns: [
      { key: 'ejemplar', label: 'Ejemplar / Lote Matadero', type: 'string' },
      { key: 'especie', label: 'Especie', type: 'string' },
      { key: 'laborODisciplina', label: 'Labor / Destino', type: 'string' },
      { key: 'fecha', label: 'Fecha de Faena / Despacho', type: 'date' },
      { key: 'horasOJornadas', label: 'Horas / Días Laborados', type: 'number' },
      { key: 'pesoEntradaKg', label: 'Peso Entrada en Vivo (kg)', type: 'number' },
      { key: 'rendimientoEstimadoPorc', label: 'Rendimiento Canal (%)', type: 'number' },
      { key: 'estadoAptitud', label: 'Estado de Aptitud', type: 'string' },
      {
        key: 'kilosCanalProyectados',
        label: 'Kilos Canal Frigorífico (kg)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Kilos de carne en canal estimados: Peso en vivo multiplicado por rendimiento porcentual',
        compute: (r: any) => parseFloat((((r.pesoEntradaKg || 0) * (r.rendimientoEstimadoPorc || 0)) / 100).toFixed(1))
      }
    ],
    data: [
      { id: '1', ejemplar: 'Centauro (EQ-001)', especie: 'Equino', laborODisciplina: 'Vaquería y Arreo Sabana Llanera', fecha: '2026-09-09', horasOJornadas: 8, pesoEntradaKg: 440, rendimientoEstimadoPorc: 0, estadoAptitud: 'Sobresaliente / Óptimo' },
      { id: '2', ejemplar: 'Relámpago (EQ-003)', especie: 'Equino', laborODisciplina: 'Entrenamiento Deporte / Coleo', fecha: '2026-09-10', horasOJornadas: 3, pesoEntradaKg: 465, rendimientoEstimadoPorc: 0, estadoAptitud: 'Condición Atlética A1' },
      { id: '3', ejemplar: 'Lote Porcino Ceba 04 (40 cerdos)', especie: 'Porcino', laborODisciplina: 'Despacho a Frigorífico Industrial', fecha: '2026-09-08', horasOJornadas: 1, pesoEntradaKg: 4280, rendimientoEstimadoPorc: 78.5, estadoAptitud: 'Apto para Beneficio' },
      { id: '4', ejemplar: 'Lote Novillos Brahman (15 mautes)', especie: 'Bovino', laborODisciplina: 'Despacho a Matadero Municipal', fecha: '2026-09-05', horasOJornadas: 1, pesoEntradaKg: 7350, rendimientoEstimadoPorc: 54.2, estadoAptitud: 'Apto para Beneficio' },
      { id: '5', ejemplar: 'El Sultán (Gallo Fino AV-GF01)', especie: 'Ave', laborODisciplina: 'Acondicionamiento Físico & Espuelas', fecha: '2026-09-07', horasOJornadas: 2, pesoEntradaKg: 2.15, rendimientoEstimadoPorc: 0, estadoAptitud: 'Peso Combate Óptimo' },
      { id: '6', ejemplar: 'Trueno Padrote (BF-BU01)', especie: 'Búfalo', laborODisciplina: 'Tracción & Carga de Leña en Humedal', fecha: '2026-09-04', horasOJornadas: 5, pesoEntradaKg: 620, rendimientoEstimadoPorc: 0, estadoAptitud: 'Excelente Fuerza y Tracción' }
    ]
  }
};
