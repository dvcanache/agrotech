import { ReportCategory, ReportSpecies } from '../../types/reports';

export interface ReportTemplateMeta {
  nombre: string;
  especie: ReportSpecies;
  categoria: string;
  descripcion: string;
  formato: string;
  frecuencia: string;
  ruta?: string;
}

export interface ReporteItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  especie?: ReportSpecies;
  plantillaBase?: string;
  formato: string;
  frecuencia: string;
  rutaAsociada?: string;
  fechaCreacion: string;
}

export const INITIAL_REPORTS: ReporteItem[] = [
  {
    id: 'rep-1',
    codigo: 'RPT-001',
    nombre: 'Censo e Inventario General del Hato',
    descripcion: 'Consolidado de animales clasificados por categoría zootécnica, edad y lote actual.',
    categoria: 'Gestión',
    especie: 'todos',
    plantillaBase: 'Inventarios (Hato general y lotes)',
    formato: 'Tabla interactiva (XLSX / PDF)',
    frecuencia: 'Semanal (Lunes)',
    rutaAsociada: '/reports/inventories',
    fechaCreacion: '2026-09-01'
  },
  {
    id: 'rep-2',
    codigo: 'RPT-002',
    nombre: 'Vientres en Lactancia y Eficiencia Lechera',
    descripcion: 'Vacas en producción lechera activa con días en leche (DEL) y promedios diarios.',
    categoria: 'Animales',
    especie: 'bovinos',
    plantillaBase: 'Animales Lactando (En Ordeño)',
    formato: 'Resumen ejecutivo con KPIs',
    frecuencia: 'Diario (Automático)',
    rutaAsociada: '/reports/cowsinproduction',
    fechaCreacion: '2026-09-05'
  },
  {
    id: 'rep-3',
    codigo: 'RPT-003',
    nombre: 'Cronograma de Próximos Partos y Secados',
    descripcion: 'Programación de traslados a potrero de maternidad según fecha probable de parto.',
    categoria: 'Animales',
    especie: 'bovinos',
    plantillaBase: 'Próximas a Parir (FPP)',
    formato: 'Ficha analítica detallada',
    frecuencia: 'Bajo demanda (Manual)',
    rutaAsociada: '/reports/nexttobirth',
    fechaCreacion: '2026-09-10'
  },
  {
    id: 'rep-4',
    codigo: 'RPT-004',
    nombre: 'Balance de Postura Avícola y Curva Hy-Line',
    descripcion: 'Producción diaria de huevos comerciales AAA/AA/A, fértiles y rotos con % postura vs guía genética.',
    categoria: 'Producción',
    especie: 'aves',
    plantillaBase: 'Control Diario de Postura y Huevos',
    formato: 'Curva comparativa + Matriz diaria',
    frecuencia: 'Diario (Cierre 18:00)',
    rutaAsociada: '/reports/view/aves-postura-galpon',
    fechaCreacion: '2026-09-11'
  },
  {
    id: 'rep-5',
    codigo: 'RPT-005',
    nombre: 'Eficiencia Reproductiva de Cerdas y Balance de Camadas',
    descripcion: 'Distribución de partos en maternidad: nacidos vivos (LNV), mortinatos, momias y peso promedio de camada al destete.',
    categoria: 'Reproducción',
    especie: 'porcinos',
    plantillaBase: 'Eficiencia Reproductiva de Cerdas',
    formato: 'Matriz zootécnica porcina',
    frecuencia: 'Semanal (Viernes)',
    rutaAsociada: '/reports/view/porcinos-eficiencia-reproductoras',
    fechaCreacion: '2026-09-11'
  },
  {
    id: 'rep-6',
    codigo: 'RPT-006',
    nombre: 'Control Lechero Búfalas y Sólidos Totales 270d',
    descripcion: 'Pesajes de ordeño bufalino con determinación de grasa butirométrica (7-9%), proteína y aptitud quesera.',
    categoria: 'Producción',
    especie: 'bufalos',
    plantillaBase: 'Control Lechero Bufalino y Sólidos Totales',
    formato: 'Ficha de rendimiento quesero',
    frecuencia: 'Quincenal',
    rutaAsociada: '/reports/view/bufalos-produccion-grasa',
    fechaCreacion: '2026-09-12'
  },
  {
    id: 'rep-7',
    codigo: 'RPT-007',
    nombre: 'Control Sanitario FAMACHA Caprino y Evaluación Podal',
    descripcion: 'Evaluación de conjuntiva ocular contra Haemonchus contortus, desparasitación selectiva y recorte de pezuñas.',
    categoria: 'Sanidad',
    especie: 'caprinos',
    plantillaBase: 'Evaluación FAMACHA de Anemia Parasitaria',
    formato: 'Semáforo clínico y prescripción',
    frecuencia: 'Mensual',
    rutaAsociada: '/reports/view/caprinos-famacha',
    fechaCreacion: '2026-09-12'
  },
  {
    id: 'rep-8',
    codigo: 'RPT-008',
    nombre: 'Libro de Registro y Pasaporte Equino Oficial',
    descripcion: 'Genealogía, reseñas por microchip, vigencia de Test de Coggins oficial AIE y cronograma de herraje.',
    categoria: 'Registro Oficial',
    especie: 'equinos',
    plantillaBase: 'Libro de Registro y Pasaporte Equino',
    formato: 'Pasaporte oficial exportable (PDF)',
    frecuencia: 'Permanente',
    rutaAsociada: '/reports/view/equinos-coggins',
    fechaCreacion: '2026-09-12'
  }
];

export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    titulo: "Bovinos (Vacunos & Doble Propósito)",
    iconoType: "bovinos",
    especie: "bovinos",
    subtitulo: "Lactancias Wood 305d, vientres, FPP y mastitis CMT",
    reportes: [
      "Vientres y Producción Lechera",
      "Próximas a Parir / Secar",
      "Curvas de Lactancia Wood 305d",
      "Mastitis CMT por Cuartos Mamarios",
      "Vientres",
      "Animales lactando",
      "Animales secos",
      "Animales criando",
      "No Vientres"
    ]
  },
  {
    titulo: "Aves de corral (Ponedoras & Pollos)",
    iconoType: "aves",
    especie: "aves",
    subtitulo: "Postura, curvas genéticas, ICA broilers y galpones",
    reportes: [
      "Control Diario de Postura y Huevos",
      "Curva de Postura vs Guía Genética",
      "Conversión Alimenticia e ICA Broilers",
      "Mortalidad Semanal en Galpón",
      "Incubación y Eclosión por Lote",
      "Acondicionamiento y Registro Gallos Finos"
    ]
  },
  {
    titulo: "Porcinos (Piara & Ceba Intensiva)",
    iconoType: "porcinos",
    especie: "porcinos",
    subtitulo: "Camadas LNV/LNM, grasa P2 y sanidad piara",
    reportes: [
      "Eficiencia Reproductiva de Cerdas",
      "Balance de Camadas (LNV / LNM / Momias)",
      "Curva de Crecimiento y Ceba Porcina",
      "Espesor Grasa Dorsal P2 y Magro",
      "Monitoreo Sanitario de Piara (PPC / Circovirus)"
    ]
  },
  {
    titulo: "Búfalos (Sabana Inundable & Quesera)",
    iconoType: "bufalos",
    especie: "bufalos",
    subtitulo: "Sólidos totales, lactancias 270d y bucerros",
    reportes: [
      "Control Lechero Bufalino y Sólidos Totales",
      "Eficiencia en Sabanas Inundables",
      "Crecimiento y Destete de Bucerros",
      "Lactancias Búfalas Normalizadas 270d"
    ]
  },
  {
    titulo: "Caprinos (Aprisco & Tarima)",
    iconoType: "caprinos",
    especie: "caprinos",
    subtitulo: "Tarima lechera 210d, FAMACHA podología y Boer",
    reportes: [
      "Control Lechero Caprino en Tarima",
      "Evaluación FAMACHA de Anemia Parasitaria",
      "Monitoreo Podológico de Pezuñas",
      "Lactancias Caprinas 210d",
      "Crecimiento y Rendimiento Cabritos Boer"
    ]
  },
  {
    titulo: "Equinos (Registro, Deporte & Faena)",
    iconoType: "equinos",
    especie: "equinos",
    subtitulo: "Pasaporte, Test Coggins, herraje y vaquería",
    reportes: [
      "Libro de Registro y Pasaporte Equino",
      "Cronograma de Herraje y Desvasado",
      "Certificación Oficial AIE (Test Coggins)",
      "Foliculometría y Fertilidad de Yeguas",
      "Bitácora de Vaquería y Entrenamiento Deportivo"
    ]
  },
  {
    titulo: "Gestión Pecuaria General",
    iconoType: "gestion",
    especie: "todos",
    subtitulo: "Censos, movimientos y genealogía",
    reportes: [
      "Inventarios",
      "Movimientos",
      "Distribución normal",
      "Técnicos",
      "Reproductores"
    ]
  },
  {
    titulo: "Históricos & Series de Tiempo",
    iconoType: "historicos",
    especie: "todos",
    subtitulo: "Curvas históricas de producción y reproducción",
    reportes: [
      "Historia de reproducciones",
      "Historia de lactancias",
      "Historia de pesajes de leche",
      "Historia de crecimientos"
    ]
  },
  {
    titulo: "Multirebaños & Consolidado Global",
    iconoType: "multirebanos",
    especie: "todos",
    subtitulo: "Auditoría entre fincas y transacciones globales",
    reportes: [
      "Inventario multirebaño",
      "Situación reproductiva actual",
      "Distribución por preñez",
      "Situación productiva actual",
      "Transacciones",
      "Producciones diarias"
    ]
  }
];

export const REPORT_METADATA_MAP: Record<string, ReportTemplateMeta> = {
  // Aves
  'Control Diario de Postura y Huevos': {
    nombre: 'Control Diario de Postura y Huevos',
    especie: 'aves',
    categoria: 'Producción',
    descripcion: 'Recolección diaria clasificada: comerciales AAA/AA/A, fértiles, rotos y cálculo de % postura.',
    formato: 'Matriz diaria con semáforo productivo',
    frecuencia: 'Diario (Cierre de tarde)',
    ruta: '/reports/view/aves-postura-galpon'
  },
  'Curva de Postura vs Guía Genética': {
    nombre: 'Curva de Postura vs Guía Genética',
    especie: 'aves',
    categoria: 'Genética',
    descripcion: 'Comparativo real vs estándar genético Hy-Line Brown / Lohmann Brown según semanas de edad.',
    formato: 'Gráfico bivariado + Tabla de desvío',
    frecuencia: 'Semanal',
    ruta: '/reports/view/aves-curva-postura'
  },
  'Conversión Alimenticia e ICA Broilers': {
    nombre: 'Conversión Alimenticia e ICA Broilers',
    especie: 'aves',
    categoria: 'Crecimiento',
    descripcion: 'Índice de Conversión Alimenticia (ICA), ganancia media diaria y consumo de pienso en pollos de engorde.',
    formato: 'Curva de eficiencia y peso medio',
    frecuencia: 'Semanal',
    ruta: '/reports/view/aves-conversion-alimenticia'
  },
  'Mortalidad Semanal en Galpón': {
    nombre: 'Mortalidad Semanal en Galpón',
    especie: 'aves',
    categoria: 'Sanidad',
    descripcion: 'Registro de bajas por galpón, causas de necropsia (golpe de calor, ascitis) y % acumulado.',
    formato: 'Tablero epidemiológico de piara/galpón',
    frecuencia: 'Semanal',
    ruta: '/reports/view/aves-mortalidad-seleccion'
  },
  'Incubación y Eclosión por Lote': {
    nombre: 'Incubación y Eclosión por Lote',
    especie: 'aves',
    categoria: 'Reproducción',
    descripcion: 'Ovoscopía a 7d y 14d, porcentaje de fertilidad, nacimientos vivos y cálculo de Pasgar Score.',
    formato: 'Ficha de lote de incubadora',
    frecuencia: 'Por lote incubado',
    ruta: '/reports/view/aves-clasificacion-huevo'
  },
  'Acondicionamiento y Registro Gallos Finos': {
    nombre: 'Acondicionamiento y Registro Gallos Finos',
    especie: 'aves',
    categoria: 'Manejo',
    descripcion: 'Pesajes de combate, arreglo de espuelas, descreste y bitácora de entrenamiento de ejemplares finos.',
    formato: 'Ficha individual de combate',
    frecuencia: 'Bajo demanda',
    ruta: '/reports/view/aves-tratamientos-vacunaciones'
  },

  // Porcinos
  'Eficiencia Reproductiva de Cerdas': {
    nombre: 'Eficiencia Reproductiva de Cerdas',
    especie: 'porcinos',
    categoria: 'Reproducción',
    descripcion: 'Tasa de concepción, lechones destetados/cerda/año (LDCA) e intervalo destete-cubrición fértil.',
    formato: 'KPIs reproductivos y ranking de reproductoras',
    frecuencia: 'Mensual',
    ruta: '/reports/view/porcinos-eficiencia-reproductoras'
  },
  'Balance de Camadas (LNV / LNM / Momias)': {
    nombre: 'Balance de Camadas (LNV / LNM / Momias)',
    especie: 'porcinos',
    categoria: 'Maternidad',
    descripcion: 'Distribución de partos: nacidos vivos, mortinatos, momias, peso de camada y promedio al nacer.',
    formato: 'Matriz de maternidad por sala',
    frecuencia: 'Semanal',
    ruta: '/reports/view/porcinos-camadas-prolificidad'
  },
  'Curva de Crecimiento y Ceba Porcina': {
    nombre: 'Curva de Crecimiento y Ceba Porcina',
    especie: 'porcinos',
    categoria: 'Crecimiento',
    descripcion: 'Evolución ponderal de lotes en precebo y ceba hasta peso final de matadero (105-115 kg).',
    formato: 'Curva de ganancia diaria (GDP)',
    frecuencia: 'Quincenal',
    ruta: '/reports/view/porcinos-cebo-engorde'
  },
  'Espesor Grasa Dorsal P2 y Magro': {
    nombre: 'Espesor Grasa Dorsal P2 y Magro',
    especie: 'porcinos',
    categoria: 'Calidad Canal',
    descripcion: 'Medición ultrasonográfica del espesor de grasa dorsal P2 (mm) y estimación del porcentaje de carne magra.',
    formato: 'Informe de tipificación y rinde en canal',
    frecuencia: 'Por lote a beneficio',
    ruta: '/reports/view/porcinos-conversion-lote'
  },
  'Monitoreo Sanitario de Piara (PPC / Circovirus)': {
    nombre: 'Monitoreo Sanitario de Piara (PPC / Circovirus)',
    especie: 'porcinos',
    categoria: 'Sanidad',
    descripcion: 'Cobertura vacunal contra Peste Porcina Clásica (PPC), Circovirus PCV2 y Micoplasma hyopneumoniae.',
    formato: 'Certificado de bioseguridad y cronograma',
    frecuencia: 'Mensual',
    ruta: '/reports/view/porcinos-destetes-gdp'
  },

  // Búfalos
  'Control Lechero Bufalino y Sólidos Totales': {
    nombre: 'Control Lechero Bufalino y Sólidos Totales',
    especie: 'bufalos',
    categoria: 'Producción',
    descripcion: 'Pesajes de ordeño bufalino con grasa (7-9%), proteína y aptitud para queso Mozzarella y de mano.',
    formato: 'Matriz de rendimiento quesero',
    frecuencia: 'Quincenal',
    ruta: '/reports/view/bufalos-produccion-grasa'
  },
  'Eficiencia en Sabanas Inundables': {
    nombre: 'Eficiencia en Sabanas Inundables',
    especie: 'bufalos',
    categoria: 'Pastoreo',
    descripcion: 'Carga animal UGG en humedales y esteros, resistencia a parásitos de ciénaga y ganancias de peso.',
    formato: 'Mapa de presión de sabana y aforo',
    frecuencia: 'Mensual',
    ruta: '/reports/view/bufalos-sanidad-endoparasitos'
  },
  'Crecimiento y Destete de Bucerros': {
    nombre: 'Crecimiento y Destete de Bucerros',
    especie: 'bufalos',
    categoria: 'Crecimiento',
    descripcion: 'Desarrollo ponderal de bucerros al pie de la madre hasta el destete a los 240 días.',
    formato: 'Curva ponderal bufalina',
    frecuencia: 'Mensual',
    ruta: '/reports/view/bufalos-crecimiento-destete'
  },
  'Lactancias Búfalas Normalizadas 270d': {
    nombre: 'Lactancias Búfalas Normalizadas 270d',
    especie: 'bufalos',
    categoria: 'Producción',
    descripcion: 'Curva de lactancia bufalina estandarizada a 270 días de duración según fisiología de la especie.',
    formato: 'Curva de persistencia láctea bufalina',
    frecuencia: 'Bajo demanda',
    ruta: '/reports/view/bufalos-lactancia-270d'
  },

  // Caprinos
  'Control Lechero Caprino en Tarima': {
    nombre: 'Control Lechero Caprino en Tarima',
    especie: 'caprinos',
    categoria: 'Producción',
    descripcion: 'Pesajes individuales en sala de ordeño en tarima elevada con grasa (3.8-4.5%) y sólidos totales.',
    formato: 'Ficha de producción individual en aprisco',
    frecuencia: 'Quincenal',
    ruta: '/reports/view/caprinos-calidad-leche'
  },
  'Evaluación FAMACHA de Anemia Parasitaria': {
    nombre: 'Evaluación FAMACHA de Anemia Parasitaria',
    especie: 'caprinos',
    categoria: 'Sanidad',
    descripcion: 'Clasificación clínica de la conjuntiva ocular (grados 1 a 5) para desparasitación selectiva de Haemonchus.',
    formato: 'Semáforo FAMACHA y prescripción dirigida',
    frecuencia: 'Mensual',
    ruta: '/reports/view/caprinos-famacha'
  },
  'Monitoreo Podológico de Pezuñas': {
    nombre: 'Monitoreo Podológico de Pezuñas',
    especie: 'caprinos',
    categoria: 'Manejo',
    descripcion: 'Registro de recorte funcional de pezuñas, prevención de gabarro y pododermatitis en corrales.',
    formato: 'Cronograma podológico del rebaño',
    frecuencia: 'Bimestral',
    ruta: '/reports/view/caprinos-podologia'
  },
  'Lactancias Caprinas 210d': {
    nombre: 'Lactancias Caprinas 210d',
    especie: 'caprinos',
    categoria: 'Producción',
    descripcion: 'Normalización de lactancias caprinas a 210 días con proyecciones por raza (Saanen, Alpina, Nubian).',
    formato: 'Curva de lactación caprina',
    frecuencia: 'Bajo demanda',
    ruta: '/reports/view/caprinos-curva-lactancia'
  },
  'Crecimiento y Rendimiento Cabritos Boer': {
    nombre: 'Crecimiento y Rendimiento Cabritos Boer',
    especie: 'caprinos',
    categoria: 'Crecimiento',
    descripcion: 'Ganancia diaria de peso en cabritos para carne (Boer y mestizos) hasta los 60 días de destete precoz.',
    formato: 'Tabla de conversión cárnica caprina',
    frecuencia: 'Quincenal',
    ruta: '/reports/view/caprinos-crecimiento-boer'
  },

  // Equinos
  'Libro de Registro y Pasaporte Equino': {
    nombre: 'Libro de Registro y Pasaporte Equino',
    especie: 'equinos',
    categoria: 'Registro Oficial',
    descripcion: 'Ficha oficial con identificación por microchip, señas particulares, genealogía y reseñas gráficas.',
    formato: 'Pasaporte oficial exportable PDF',
    frecuencia: 'Permanente',
    ruta: '/reports/view/equinos-pasaporte-genealogia'
  },
  'Cronograma de Herraje y Desvasado': {
    nombre: 'Cronograma de Herraje y Desvasado',
    especie: 'equinos',
    categoria: 'Manejo',
    descripcion: 'Control de aplomos, herrador responsable, tipo de herraduras y alertas de vencimiento (35-45 días).',
    formato: 'Calendario podológico equino',
    frecuencia: 'Mensual',
    ruta: '/reports/view/equinos-herraje-desvasado'
  },
  'Certificación Oficial AIE (Test Coggins)': {
    nombre: 'Certificación Oficial AIE (Test Coggins)',
    especie: 'equinos',
    categoria: 'Sanidad Oficial',
    descripcion: 'Vigencia de diagnósticos de Anemia Infecciosa Equina con número de protocolo de laboratorio y ente sanitario.',
    formato: 'Certificado de movilización y vigencia',
    frecuencia: 'Semestral',
    ruta: '/reports/view/equinos-coggins'
  },
  'Foliculometría y Fertilidad de Yeguas': {
    nombre: 'Foliculometría y Fertilidad de Yeguas',
    especie: 'equinos',
    categoria: 'Reproducción',
    descripcion: 'Monitoreo ecográfico del diámetro folicular (mm), edema uterino y programación de inseminación.',
    formato: 'Ficha folicular ginecológica',
    frecuencia: 'En temporada reproductiva',
    ruta: '/reports/view/equinos-foliculometria'
  },
  'Bitácora de Vaquería y Entrenamiento Deportivo': {
    nombre: 'Bitácora de Vaquería y Entrenamiento Deportivo',
    especie: 'equinos',
    categoria: 'Trabajo / Deporte',
    descripcion: 'Horas de trabajo en campo, jornadas de arreo de sabana, entrenamiento de coleo y condición atlética.',
    formato: 'Bitácora de esfuerzo y recuperación',
    frecuencia: 'Semanal',
    ruta: '/reports/view/equinos-vaqueria-faena'
  },

  // Bovinos
  'Vientres y Producción Lechera': {
    nombre: 'Vientres y Producción Lechera',
    especie: 'bovinos',
    categoria: 'Producción',
    descripcion: 'Hembras activas en ordeño con días en leche, promedios diarios y persistencia láctea.',
    formato: 'Resumen ejecutivo de ordeño',
    frecuencia: 'Diario',
    ruta: '/reports/dams'
  },
  'Próximas a Parir / Secar': {
    nombre: 'Próximas a Parir / Secar',
    especie: 'bovinos',
    categoria: 'Reproducción',
    descripcion: 'Alertas de traslado a maternidad y fecha de secado según días de gestación confirmada.',
    formato: 'Cronograma de traslados a maternidad',
    frecuencia: 'Semanal',
    ruta: '/reports/nexttobirth'
  },
  'Curvas de Lactancia Wood 305d': {
    nombre: 'Curvas de Lactancia Wood 305d',
    especie: 'bovinos',
    categoria: 'Producción',
    descripcion: 'Ajuste del modelo gamma incompleto de Wood a 305 días para evaluar pico y persistencia.',
    formato: 'Curva matemática + Datos tabulares',
    frecuencia: 'Mensual',
    ruta: '/reports/view/bovinos-curvas-lactancia-wood'
  },
  'Mastitis CMT por Cuartos Mamarios': {
    nombre: 'Mastitis CMT por Cuartos Mamarios',
    especie: 'bovinos',
    categoria: 'Sanidad',
    descripcion: 'Puntuación California Mastitis Test (0 a 3) en cuartos AD, AI, PD, PI y tiempos de retiro.',
    formato: 'Mapeo mamario interactivo',
    frecuencia: 'Quincenal',
    ruta: '/reports/view/bovinos-mastitis-sanidad'
  }
};
