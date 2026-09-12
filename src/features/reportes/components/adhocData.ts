/* =========================================================================
 * DATOS BASE Y CONFIGURACIONES PARA EL DISEÑADOR BI AD-HOC
 * ========================================================================= */

export type BaseEntityType = 'semovientes' | 'lactancias' | 'controles_lecheros' | 'eventos_veterinarios' | 'potreros';

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
  description: string;
  defaultColumns: string[];
  columns: ColumnDefinition[];
  data: any[];
}

export const ADHOC_ENTITIES: Record<BaseEntityType, EntityConfig> = {
  semovientes: {
    id: 'semovientes',
    title: 'Semovientes (Padrón General)',
    subtitle: 'Inventario de vientres, reproductores y crías',
    iconName: 'Cow',
    description: 'Catálogo exhaustivo de animales con identificación, genealogía básica, peso corporal y condición zootécnica.',
    defaultColumns: ['arete', 'nombre', 'categoria', 'raza', 'lote', 'estatus', 'edadAnos', 'ultimoPesoKg'],
    columns: [
      { key: 'arete', label: 'Arete / Único', type: 'string' },
      { key: 'nombre', label: 'Nombre Animal', type: 'string' },
      { key: 'categoria', label: 'Categoría', type: 'string' },
      { key: 'raza', label: 'Raza Predominante', type: 'string' },
      { key: 'lote', label: 'Lote Actual', type: 'string' },
      { key: 'estatus', label: 'Estatus Vital', type: 'string' },
      { key: 'estatusReproductivo', label: 'Estatus Reproductivo', type: 'string' },
      { key: 'edadAnos', label: 'Edad (Años)', type: 'number' },
      { key: 'partos', label: 'Partos Totales', type: 'number' },
      { key: 'ultimoPesoKg', label: 'Último Peso (kg)', type: 'number' },
      {
        key: 'pesoAdultoAjustado',
        label: 'Peso Adulto Estimado (kg)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Peso actual ajustado por coeficiente de madurez (kg * 1.12)',
        compute: (r: any) => parseFloat((r.ultimoPesoKg * 1.12).toFixed(1))
      },
      {
        key: 'indiceFertilidad',
        label: 'Índice Partos / Año',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Partos acumulados entre años útiles de vida (partos / (edad - 2))',
        compute: (r: any) => {
          const anosUtiles = r.edadAnos > 2 ? r.edadAnos - 2 : 1;
          return parseFloat((r.partos / anosUtiles).toFixed(2));
        }
      }
    ],
    data: [
      { id: '1', arete: '0001', nombre: 'Mariposa', categoria: 'Vaca', raza: 'Carora', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 5.4, partos: 3, ultimoPesoKg: 465 },
      { id: '2', arete: '0002', nombre: 'Esperanza', categoria: 'Vaca', raza: 'Carora', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Vacía', edadAnos: 4.8, partos: 2, ultimoPesoKg: 480 },
      { id: '3', arete: 'CW002', nombre: 'Baronesa', categoria: 'Vaca', raza: 'Gyr Lechero', lote: '02 - Ordeño', estatus: 'Activo', estatusReproductivo: 'En espera', edadAnos: 6.1, partos: 4, ultimoPesoKg: 495 },
      { id: '4', arete: 'CW003', nombre: 'Reina', categoria: 'Vaca', raza: 'Gyr Lechero', lote: '03 - Secas', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 5.9, partos: 4, ultimoPesoKg: 510 },
      { id: '5', arete: 'CW004', nombre: 'Princesa', categoria: 'Vaca', raza: 'Gyr Lechero', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 3.8, partos: 1, ultimoPesoKg: 440 },
      { id: '6', arete: 'CW005', nombre: 'Gitana', categoria: 'Vaca', raza: 'Girolando', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Vacía', edadAnos: 4.2, partos: 2, ultimoPesoKg: 475 },
      { id: '7', arete: 'CW006', nombre: 'Lucero', categoria: 'Vaca', raza: 'Brahman', lote: '02 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 4.5, partos: 2, ultimoPesoKg: 520 },
      { id: '8', arete: 'CW007', nombre: 'Estrella', categoria: 'Vaca', raza: 'Carora', lote: '03 - Secas', estatus: 'Activo', estatusReproductivo: 'Seca', edadAnos: 5.1, partos: 3, ultimoPesoKg: 450 },
      { id: '9', arete: 'CW008', nombre: 'Milenaria', categoria: 'Vaca', raza: 'Holstein', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Servida', edadAnos: 6.3, partos: 4, ultimoPesoKg: 560 },
      { id: '10', arete: 'CW009', nombre: 'Bandida', categoria: 'Vaca', raza: 'Holstein', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Vacía', edadAnos: 3.9, partos: 1, ultimoPesoKg: 530 },
      { id: '11', arete: 'CW013', nombre: 'Triunfadora', categoria: 'Novilla', raza: 'Carora', lote: '04 - Novillas', estatus: 'Activo', estatusReproductivo: 'Servida', edadAnos: 2.3, partos: 0, ultimoPesoKg: 360 },
      { id: '12', arete: 'VC-88', nombre: 'Sombra', categoria: 'Vaca', raza: 'Gyr Lechero', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 5.0, partos: 3, ultimoPesoKg: 470 },
      { id: '13', arete: 'VC-104', nombre: 'Coronela', categoria: 'Vaca', raza: 'Brahman', lote: '02 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Vacía', edadAnos: 4.1, partos: 2, ultimoPesoKg: 535 },
      { id: '14', arete: 'VC-115', nombre: 'Muñeca', categoria: 'Novilla', raza: 'Girolando', lote: '04 - Novillas', estatus: 'Activo', estatusReproductivo: 'Vacía', edadAnos: 2.1, partos: 0, ultimoPesoKg: 345 },
      { id: '15', arete: 'VC-120', nombre: 'Zafiro', categoria: 'Vaca', raza: 'Carora', lote: '01 - Ordeño', estatus: 'Activo', estatusReproductivo: 'Preñada', edadAnos: 4.9, partos: 3, ultimoPesoKg: 490 }
    ]
  },

  lactancias: {
    id: 'lactancias',
    title: 'Lactancias e Historial Lechero',
    subtitle: 'Campañas lecheras, DEL y producción acumulada',
    iconName: 'Milk',
    description: 'Comportamiento de la curva de lactancia normalizada a 305 días, días en producción y totales acumulados.',
    defaultColumns: ['arete', 'nombre', 'raza', 'lote', 'lactanciaNumero', 'diasLactancia', 'p305Kg', 'produccionTotalKg'],
    columns: [
      { key: 'arete', label: 'Arete', type: 'string' },
      { key: 'nombre', label: 'Nombre Vaca', type: 'string' },
      { key: 'raza', label: 'Raza', type: 'string' },
      { key: 'lote', label: 'Lote Actual', type: 'string' },
      { key: 'lactanciaNumero', label: 'Lactancia Nº', type: 'number' },
      { key: 'diasLactancia', label: 'Días en Leche (DEL)', type: 'number' },
      { key: 'p244Kg', label: 'Proy. 244d (kg)', type: 'number' },
      { key: 'p270Kg', label: 'Proy. 270d (kg)', type: 'number' },
      { key: 'p305Kg', label: 'Proy. 305d (kg)', type: 'number' },
      { key: 'produccionTotalKg', label: 'Total Producido (kg)', type: 'number' },
      {
        key: 'produccionDiariaDEL',
        label: 'Promedio Diario DEL (kg/d)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Producción total dividida entre días en leche (kg / DEL)',
        compute: (r: any) => parseFloat((r.produccionTotalKg / Math.max(1, r.diasLactancia)).toFixed(2))
      },
      {
        key: 'eficiencia305Relativa',
        label: 'Diferencial vs Meta 305d (kg)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Superávit o déficit contra la meta de hato de 4,000 kg (p305Kg - 4000)',
        compute: (r: any) => parseFloat((r.p305Kg - 4000).toFixed(1))
      }
    ],
    data: [
      { id: '1', arete: '0001', nombre: 'Mariposa', raza: 'Carora', lote: '01 - Ordeño', lactanciaNumero: 5, diasLactancia: 305, p244Kg: 4120, p270Kg: 4450, p305Kg: 4890, produccionTotalKg: 4920 },
      { id: '2', arete: '0002', nombre: 'Esperanza', raza: 'Carora', lote: '01 - Ordeño', lactanciaNumero: 4, diasLactancia: 310, p244Kg: 4600, p270Kg: 5010, p305Kg: 5420, produccionTotalKg: 5500 },
      { id: '3', arete: 'CW002', nombre: 'Baronesa', raza: 'Gyr Lechero', lote: '02 - Ordeño', lactanciaNumero: 4, diasLactancia: 301, p244Kg: 3850, p270Kg: 4180, p305Kg: 4520, produccionTotalKg: 4520 },
      { id: '4', arete: 'CW003', nombre: 'Reina', raza: 'Gyr Lechero', lote: '03 - Secas', lactanciaNumero: 4, diasLactancia: 290, p244Kg: 4210, p270Kg: 4580, p305Kg: 4760, produccionTotalKg: 4760 },
      { id: '5', arete: 'CW004', nombre: 'Princesa', raza: 'Gyr Lechero', lote: '01 - Ordeño', lactanciaNumero: 2, diasLactancia: 280, p244Kg: 3450, p270Kg: 3750, p305Kg: 3950, produccionTotalKg: 3950 },
      { id: '6', arete: 'CW005', nombre: 'Gitana', raza: 'Girolando', lote: '01 - Ordeño', lactanciaNumero: 3, diasLactancia: 295, p244Kg: 4100, p270Kg: 4420, p305Kg: 4680, produccionTotalKg: 4680 },
      { id: '7', arete: 'CW006', nombre: 'Lucero', raza: 'Brahman', lote: '02 - Ordeño', lactanciaNumero: 2, diasLactancia: 240, p244Kg: 2850, p270Kg: 2850, p305Kg: 2850, produccionTotalKg: 2850 },
      { id: '8', arete: 'CW007', nombre: 'Estrella', raza: 'Carora', lote: '03 - Secas', lactanciaNumero: 3, diasLactancia: 270, p244Kg: 3450, p270Kg: 3720, p305Kg: 3720, produccionTotalKg: 3720 },
      { id: '9', arete: 'CW008', nombre: 'Milenaria', raza: 'Holstein', lote: '01 - Ordeño', lactanciaNumero: 4, diasLactancia: 338, p244Kg: 4980, p270Kg: 5390, p305Kg: 5850, produccionTotalKg: 6150 },
      { id: '10', arete: 'VC-88', nombre: 'Sombra', raza: 'Gyr Lechero', lote: '01 - Ordeño', lactanciaNumero: 3, diasLactancia: 295, p244Kg: 4300, p270Kg: 4680, p305Kg: 5020, produccionTotalKg: 5020 },
      { id: '11', arete: 'VC-120', nombre: 'Zafiro', raza: 'Carora', lote: '01 - Ordeño', lactanciaNumero: 3, diasLactancia: 300, p244Kg: 4550, p270Kg: 4900, p305Kg: 5310, produccionTotalKg: 5310 }
    ]
  },

  controles_lecheros: {
    id: 'controles_lecheros',
    title: 'Controles Lecheros Diarios',
    subtitle: 'Pesajes individuales de ordeño AM y PM',
    iconName: 'ClipboardList',
    description: 'Pesajes de rutina en sala de ordeño con control de calidad de leche (Grasa, Proteína y RCS).',
    defaultColumns: ['arete', 'nombre', 'lote', 'fecha', 'pesaje1Kg', 'pesaje2Kg', 'pesajeTotalKg', 'rcsMil'],
    columns: [
      { key: 'arete', label: 'Arete', type: 'string' },
      { key: 'nombre', label: 'Nombre Vaca', type: 'string' },
      { key: 'lote', label: 'Lote', type: 'string' },
      { key: 'fecha', label: 'Fecha Control', type: 'date' },
      { key: 'pesaje1Kg', label: 'Pesaje AM (kg)', type: 'number' },
      { key: 'pesaje2Kg', label: 'Pesaje PM (kg)', type: 'number' },
      { key: 'pesajeTotalKg', label: 'Total Diario (kg)', type: 'number' },
      { key: 'relacionGrasaProteina', label: 'Relación G/P', type: 'number' },
      { key: 'rcsMil', label: 'RCS (x10³ cel/ml)', type: 'number' },
      {
        key: 'alertaCalidad',
        label: 'Diagnóstico Calidad / Mastitis',
        type: 'string',
        isCalculated: true,
        formulaDescription: 'Alerta basada en umbral de células somáticas (>200 mil) o acidosis ruminal (G/P < 1.0)',
        compute: (r: any) => {
          if (r.rcsMil > 200) return 'Mastitis Subclínica (RCS Alto)';
          if (r.relacionGrasaProteina < 1.05) return 'Riesgo Acidosis Ruminal';
          if (r.relacionGrasaProteina > 1.45) return 'Riesgo Cetosis / Déficit';
          return 'Calidad Óptima A1';
        }
      }
    ],
    data: [
      { id: '1', arete: '0001', nombre: 'Mariposa', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 9.4, pesaje2Kg: 7.2, pesajeTotalKg: 16.6, relacionGrasaProteina: 1.22, rcsMil: 140 },
      { id: '2', arete: '0002', nombre: 'Esperanza', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 10.2, pesaje2Kg: 8.5, pesajeTotalKg: 18.7, relacionGrasaProteina: 1.25, rcsMil: 110 },
      { id: '3', arete: 'CW002', nombre: 'Baronesa', lote: '02 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 8.1, pesaje2Kg: 6.4, pesajeTotalKg: 14.5, relacionGrasaProteina: 1.18, rcsMil: 180 },
      { id: '4', arete: 'CW004', nombre: 'Princesa', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 7.5, pesaje2Kg: 5.8, pesajeTotalKg: 13.3, relacionGrasaProteina: 1.20, rcsMil: 160 },
      { id: '5', arete: 'CW005', nombre: 'Gitana', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 8.8, pesaje2Kg: 6.9, pesajeTotalKg: 15.7, relacionGrasaProteina: 0.98, rcsMil: 190 },
      { id: '6', arete: 'CW008', nombre: 'Milenaria', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 11.5, pesaje2Kg: 9.2, pesajeTotalKg: 20.7, relacionGrasaProteina: 1.15, rcsMil: 280 },
      { id: '7', arete: 'CW009', nombre: 'Bandida', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 6.4, pesaje2Kg: 5.1, pesajeTotalKg: 11.5, relacionGrasaProteina: 1.50, rcsMil: 130 },
      { id: '8', arete: 'VC-88', nombre: 'Sombra', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 9.8, pesaje2Kg: 7.6, pesajeTotalKg: 17.4, relacionGrasaProteina: 1.28, rcsMil: 125 },
      { id: '9', arete: 'VC-120', nombre: 'Zafiro', lote: '01 - Ordeño', fecha: '2026-09-08', pesaje1Kg: 10.4, pesaje2Kg: 8.1, pesajeTotalKg: 18.5, relacionGrasaProteina: 1.21, rcsMil: 150 }
    ]
  },

  eventos_veterinarios: {
    id: 'eventos_veterinarios',
    title: 'Eventos Veterinarios y Fármacos',
    subtitle: 'Tratamientos, diagnósticos y tiempos de retiro',
    iconName: 'Activity',
    description: 'Registro clínico de sanidad animal, tratamientos aplicados y blindaje de inocuidad farmacológica.',
    defaultColumns: ['arete', 'nombre', 'fecha', 'tipoEvento', 'cuartoAfectado', 'diagnostico', 'tratamiento', 'diasRetiroLeche', 'estatusSanitario'],
    columns: [
      { key: 'arete', label: 'Arete', type: 'string' },
      { key: 'nombre', label: 'Nombre Animal', type: 'string' },
      { key: 'fecha', label: 'Fecha Tratamiento', type: 'date' },
      { key: 'tipoEvento', label: 'Tipo Evento', type: 'string' },
      { key: 'cuartoAfectado', label: 'Cuarto / Zona', type: 'string' },
      { key: 'diagnostico', label: 'Diagnóstico Clínico', type: 'string' },
      { key: 'tratamiento', label: 'Tratamiento / Fármaco', type: 'string' },
      { key: 'medicoResponsable', label: 'Médico Responsable', type: 'string' },
      { key: 'diasRetiroLeche', label: 'Retiro Leche (días)', type: 'number' },
      { key: 'diasRetiroCarne', label: 'Retiro Carne (días)', type: 'number' },
      { key: 'estatusSanitario', label: 'Estatus Sanitario', type: 'string' },
      {
        key: 'alertaInocuidad',
        label: 'Bloqueo Sanitario Activo',
        type: 'string',
        isCalculated: true,
        formulaDescription: 'Bandera de retención preventiva si el retiro en leche es > 0 días',
        compute: (r: any) => (r.diasRetiroLeche > 0 ? '⚠️ RETENCIÓN ACTIVA (No ordeñar al tanque)' : '✅ APTO PARA CONSUMO')
      }
    ],
    data: [
      { id: '1', arete: 'CW008', nombre: 'Milenaria', fecha: '2026-09-10', tipoEvento: 'Mastitis', cuartoAfectado: 'Posterior Derecho (PD)', diagnostico: 'Mastitis Clínica Grado 2 (CMT-2)', tratamiento: 'Cefalosporina Intramamaria (Mastijet)', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 3, diasRetiroCarne: 7, estatusSanitario: 'En Tratamiento' },
      { id: '2', arete: 'CW005', nombre: 'Gitana', fecha: '2026-09-02', tipoEvento: 'Podal', cuartoAfectado: 'Pezuña Posterior Izquierda', diagnostico: 'Dermatitis Digital Interdigital', tratamiento: 'Cura tópica oxitetraciclina + pediluvio', medicoResponsable: 'Dra. María Elena Gómez', diasRetiroLeche: 0, diasRetiroCarne: 0, estatusSanitario: 'Resuelto' },
      { id: '3', arete: 'CW009', nombre: 'Bandida', fecha: '2026-08-25', tipoEvento: 'Metabólico', cuartoAfectado: 'Sistémico', diagnostico: 'Cetosis subclínica puerperal', tratamiento: 'Propilenglicol oral + complejo B', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 0, diasRetiroCarne: 0, estatusSanitario: 'Resuelto' },
      { id: '4', arete: '0001', nombre: 'Mariposa', fecha: '2026-05-10', tipoEvento: 'Reproductivo', cuartoAfectado: 'Uterino', diagnostico: 'Parto distócico leve asistido', tratamiento: 'Aplicación antibiótica preventiva ADE', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 0, diasRetiroCarne: 0, estatusSanitario: 'Resuelto' },
      { id: '5', arete: 'VC-104', nombre: 'Coronela', fecha: '2026-09-11', tipoEvento: 'Sanitario', cuartoAfectado: 'Sistémico', diagnostico: 'Desparasitación estratégica hato', tratamiento: 'Ivermectina 1% inyectable', medicoResponsable: 'Ing. Roberto Silva', diasRetiroLeche: 28, diasRetiroCarne: 35, estatusSanitario: 'En Tratamiento' }
    ]
  },

  potreros: {
    id: 'potreros',
    title: 'Potreros y Pastoreo Voisin (PRV)',
    subtitle: 'Biomasa, aforos forrajeros y carga animal UGG/ha',
    iconName: 'MapPin',
    description: 'Gestión rotacional de potreros con cálculo de presión de pastoreo, especies forrajeras y biomasa disponible.',
    defaultColumns: ['codigo', 'descripcion', 'areaHa', 'especieForrajera', 'aforoKgM2', 'cargaRecomendadaUggHa', 'diasOcupacionActual', 'cargaActualUggHa', 'estatus'],
    columns: [
      { key: 'codigo', label: 'Código', type: 'string' },
      { key: 'descripcion', label: 'Nombre Potrero', type: 'string' },
      { key: 'areaHa', label: 'Área (ha)', type: 'number' },
      { key: 'perimetroM', label: 'Perímetro (m)', type: 'number' },
      { key: 'especieForrajera', label: 'Especie Forrajera', type: 'string' },
      { key: 'aforoKgM2', label: 'Aforo (kg MV/m²)', type: 'number' },
      { key: 'cargaRecomendadaUggHa', label: 'Carga Rec. (UGG/ha)', type: 'number' },
      { key: 'diasOcupacionActual', label: 'Ocupación (días)', type: 'number' },
      { key: 'diasDescansoActual', label: 'Descanso (días)', type: 'number' },
      { key: 'animalesPresentes', label: 'Animales en Pastura', type: 'number' },
      { key: 'cargaActualUggHa', label: 'Carga Real (UGG/ha)', type: 'number' },
      { key: 'estatus', label: 'Estatus PRV', type: 'string' },
      {
        key: 'biomasaTotalTon',
        label: 'Biomasa Verde Total (Ton)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Área en metros cuadrados multiplicada por aforo forrajero (ha * 10000 * aforo / 1000)',
        compute: (r: any) => parseFloat(((r.areaHa * 10000 * r.aforoKgM2) / 1000).toFixed(1))
      },
      {
        key: 'presionCargaRelativa',
        label: 'Presión Pastoreo (%)',
        type: 'number',
        isCalculated: true,
        formulaDescription: 'Relación porcentual entre carga actual y carga recomendada (actual / recomendada * 100)',
        compute: (r: any) => parseFloat(((r.cargaActualUggHa / Math.max(0.1, r.cargaRecomendadaUggHa)) * 100).toFixed(1))
      }
    ],
    data: [
      { id: '1', codigo: 'POT1', descripcion: 'Potrero de la Casa', areaHa: 45.5, perimetroM: 2850, especieForrajera: 'Brachiaria decumbens', aforoKgM2: 2.8, cargaRecomendadaUggHa: 1.5, diasOcupacionActual: 3, diasDescansoActual: 0, animalesPresentes: 28, cargaActualUggHa: 1.35, estatus: 'En Ocupación' },
      { id: '2', codigo: 'POT2', descripcion: 'Potrero del Tanque', areaHa: 38.0, perimetroM: 2520, especieForrajera: 'Panicum maximum (Mombaza)', aforoKgM2: 3.4, cargaRecomendadaUggHa: 1.8, diasOcupacionActual: 2, diasDescansoActual: 0, animalesPresentes: 22, cargaActualUggHa: 1.28, estatus: 'En Ocupación' },
      { id: '3', codigo: 'POT3', descripcion: 'Potrero El Mango', areaHa: 52.0, perimetroM: 3200, especieForrajera: 'Brachiaria brizantha (Marandú)', aforoKgM2: 3.1, cargaRecomendadaUggHa: 1.6, diasOcupacionActual: 0, diasDescansoActual: 34, animalesPresentes: 0, cargaActualUggHa: 0, estatus: 'Óptimo PRV (Listo)' },
      { id: '4', codigo: 'POT4', descripcion: 'Potrero La Represa', areaHa: 60.0, perimetroM: 3800, especieForrajera: 'Brachiaria humidicola', aforoKgM2: 2.2, cargaRecomendadaUggHa: 1.2, diasOcupacionActual: 0, diasDescansoActual: 22, animalesPresentes: 0, cargaActualUggHa: 0, estatus: 'En Descanso' },
      { id: '5', codigo: 'POT5', descripcion: 'Potrero Bajo Grande', areaHa: 30.0, perimetroM: 2100, especieForrajera: 'Estrella Africana (Cynodon)', aforoKgM2: 3.6, cargaRecomendadaUggHa: 2.0, diasOcupacionActual: 0, diasDescansoActual: 38, animalesPresentes: 0, cargaActualUggHa: 0, estatus: 'Óptimo PRV (Listo)' }
    ]
  }
};
