import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Download,
  Printer,
  Columns,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { ADHOC_ENTITIES, BaseEntityType, ColumnDefinition } from '../components/adhocData';
import { REPORT_METADATA_MAP, ReporteItem } from '../reportesData';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { ReportSpecies } from '../../../types/reports';

interface SlugConfig {
  entityId: BaseEntityType;
  title: string;
  subtitle: string;
  species: ReportSpecies;
  speciesLabel: string;
  speciesBadgeColor: string;
  speciesIcon: string;
  category: string;
  filterSpecies?: string;
  savedColumns?: string[];
}

const PRESET_SLUGS: Record<string, SlugConfig> = {
  // Aves
  'aves-postura-galpon': {
    entityId: 'postura_avicola',
    title: 'Control Diario de Postura y Huevos',
    subtitle: 'Recolección diaria clasificada: comerciales AAA/AA/A, fértiles, rotos y cálculo de % postura.',
    species: 'aves',
    speciesLabel: 'Aves de Corral',
    speciesBadgeColor: '#d97706',
    speciesIcon: '🐔',
    category: 'Producción'
  },
  'aves-curva-postura': {
    entityId: 'postura_avicola',
    title: 'Curva de Postura vs Guía Genética',
    subtitle: 'Comparativo real vs estándar genético Hy-Line Brown / Lohmann Brown según semanas de edad.',
    species: 'aves',
    speciesLabel: 'Aves de Corral',
    speciesBadgeColor: '#d97706',
    speciesIcon: '🐔',
    category: 'Genética'
  },
  'aves-conversion-alimenticia': {
    entityId: 'postura_avicola',
    title: 'Conversión Alimenticia e ICA Broilers',
    subtitle: 'Índice de Conversión Alimenticia (ICA), ganancia media diaria y consumo de pienso en pollos de engorde.',
    species: 'aves',
    speciesLabel: 'Aves de Corral',
    speciesBadgeColor: '#d97706',
    speciesIcon: '🐔',
    category: 'Crecimiento'
  },
  'aves-mortalidad-seleccion': {
    entityId: 'postura_avicola',
    title: 'Mortalidad Semanal en Galpón',
    subtitle: 'Registro de bajas por galpón, causas de necropsia (golpe de calor, ascitis) y % acumulado.',
    species: 'aves',
    speciesLabel: 'Aves de Corral',
    speciesBadgeColor: '#d97706',
    speciesIcon: '🐔',
    category: 'Sanidad'
  },
  'aves-clasificacion-huevo': {
    entityId: 'postura_avicola',
    title: 'Incubación y Eclosión por Lote',
    subtitle: 'Ovoscopía a 7d y 14d, porcentaje de fertilidad, nacimientos vivos y cálculo de Pasgar Score.',
    species: 'aves',
    speciesLabel: 'Aves de Corral',
    speciesBadgeColor: '#d97706',
    speciesIcon: '🐔',
    category: 'Reproducción'
  },
  'aves-tratamientos-vacunaciones': {
    entityId: 'postura_avicola',
    title: 'Acondicionamiento y Registro Gallos Finos',
    subtitle: 'Pesajes de combate, arreglo de espuelas, descreste y bitácora de entrenamiento de ejemplares finos.',
    species: 'aves',
    speciesLabel: 'Aves de Corral',
    speciesBadgeColor: '#d97706',
    speciesIcon: '🐔',
    category: 'Manejo'
  },

  // Porcinos
  'porcinos-eficiencia-reproductoras': {
    entityId: 'camadas_porcinas',
    title: 'Eficiencia Reproductiva de Cerdas',
    subtitle: 'Tasa de concepción, lechones destetados/cerda/año (LDCA) e intervalo destete-cubrición fértil.',
    species: 'porcinos',
    speciesLabel: 'Porcinos Piara',
    speciesBadgeColor: '#db2777',
    speciesIcon: '🐷',
    category: 'Reproducción'
  },
  'porcinos-camadas-prolificidad': {
    entityId: 'camadas_porcinas',
    title: 'Balance de Camadas (LNV / LNM / Momias)',
    subtitle: 'Distribución de partos: nacidos vivos, mortinatos, momias, peso de camada y promedio al nacer.',
    species: 'porcinos',
    speciesLabel: 'Porcinos Piara',
    speciesBadgeColor: '#db2777',
    speciesIcon: '🐷',
    category: 'Maternidad'
  },
  'porcinos-cebo-engorde': {
    entityId: 'camadas_porcinas',
    title: 'Curva de Crecimiento y Ceba Porcina',
    subtitle: 'Evolución ponderal de lotes en precebo y ceba hasta peso final de matadero (105-115 kg).',
    species: 'porcinos',
    speciesLabel: 'Porcinos Piara',
    speciesBadgeColor: '#db2777',
    speciesIcon: '🐷',
    category: 'Crecimiento'
  },
  'porcinos-conversion-lote': {
    entityId: 'camadas_porcinas',
    title: 'Espesor Grasa Dorsal P2 y Magro',
    subtitle: 'Medición ultrasonográfica del espesor de grasa dorsal P2 (mm) y estimación del porcentaje de carne magra.',
    species: 'porcinos',
    speciesLabel: 'Porcinos Piara',
    speciesBadgeColor: '#db2777',
    speciesIcon: '🐷',
    category: 'Calidad Canal'
  },
  'porcinos-destetes-gdp': {
    entityId: 'camadas_porcinas',
    title: 'Monitoreo Sanitario de Piara (PPC / Circovirus)',
    subtitle: 'Cobertura vacunal contra Peste Porcina Clásica (PPC), Circovirus PCV2 y Micoplasma hyopneumoniae.',
    species: 'porcinos',
    speciesLabel: 'Porcinos Piara',
    speciesBadgeColor: '#db2777',
    speciesIcon: '🐷',
    category: 'Sanidad'
  },

  // Búfalos
  'bufalos-produccion-grasa': {
    entityId: 'controles_lecheros',
    title: 'Control Lechero Bufalino y Sólidos Totales',
    subtitle: 'Pesajes de ordeño bufalino con grasa (7-9%), proteína y aptitud para queso Mozzarella y de mano.',
    species: 'bufalos',
    speciesLabel: 'Búfalos Sabana',
    speciesBadgeColor: '#334155',
    speciesIcon: '🐃',
    category: 'Producción',
    filterSpecies: 'Búfalo'
  },
  'bufalos-sanidad-endoparasitos': {
    entityId: 'eventos_veterinarios',
    title: 'Eficiencia y Sanidad en Sabanas Inundables',
    subtitle: 'Carga animal UGG en humedales y esteros, resistencia a parásitos de ciénaga y tratamientos sanitarios.',
    species: 'bufalos',
    speciesLabel: 'Búfalos Sabana',
    speciesBadgeColor: '#334155',
    speciesIcon: '🐃',
    category: 'Sanidad & Pastoreo',
    filterSpecies: 'Búfalo'
  },
  'bufalos-crecimiento-destete': {
    entityId: 'semovientes',
    title: 'Crecimiento y Destete de Bucerros',
    subtitle: 'Desarrollo ponderal de bucerros al pie de la madre hasta el destete a los 240 días.',
    species: 'bufalos',
    speciesLabel: 'Búfalos Sabana',
    speciesBadgeColor: '#334155',
    speciesIcon: '🐃',
    category: 'Crecimiento',
    filterSpecies: 'Búfalo'
  },
  'bufalos-lactancia-270d': {
    entityId: 'lactancias',
    title: 'Lactancias Búfalas Normalizadas 270d',
    subtitle: 'Curva de lactancia bufalina estandarizada a 270 días de duración según fisiología de la especie.',
    species: 'bufalos',
    speciesLabel: 'Búfalos Sabana',
    speciesBadgeColor: '#334155',
    speciesIcon: '🐃',
    category: 'Producción',
    filterSpecies: 'Búfalo'
  },

  // Caprinos
  'caprinos-calidad-leche': {
    entityId: 'controles_lecheros',
    title: 'Control Lechero Caprino en Tarima',
    subtitle: 'Pesajes individuales en sala de ordeño en tarima elevada con grasa (3.8-4.5%) y sólidos totales.',
    species: 'caprinos',
    speciesLabel: 'Caprinos Aprisco',
    speciesBadgeColor: '#059669',
    speciesIcon: '🐐',
    category: 'Producción',
    filterSpecies: 'Caprino'
  },
  'caprinos-famacha': {
    entityId: 'eventos_veterinarios',
    title: 'Evaluación FAMACHA de Anemia Parasitaria',
    subtitle: 'Clasificación clínica de la conjuntiva ocular (grados 1 a 5) para desparasitación selectiva de Haemonchus.',
    species: 'caprinos',
    speciesLabel: 'Caprinos Aprisco',
    speciesBadgeColor: '#059669',
    speciesIcon: '🐐',
    category: 'Sanidad',
    filterSpecies: 'Caprino'
  },
  'caprinos-podologia': {
    entityId: 'eventos_veterinarios',
    title: 'Monitoreo Podológico de Pezuñas',
    subtitle: 'Registro de recorte funcional de pezuñas, prevención de gabarro y pododermatitis en corrales.',
    species: 'caprinos',
    speciesLabel: 'Caprinos Aprisco',
    speciesBadgeColor: '#059669',
    speciesIcon: '🐐',
    category: 'Manejo',
    filterSpecies: 'Caprino'
  },
  'caprinos-curva-lactancia': {
    entityId: 'controles_lecheros',
    title: 'Lactancias Caprinas 210d',
    subtitle: 'Normalización de lactancias caprinas a 210 días con proyecciones por raza (Saanen, Alpina, Nubian).',
    species: 'caprinos',
    speciesLabel: 'Caprinos Aprisco',
    speciesBadgeColor: '#059669',
    speciesIcon: '🐐',
    category: 'Producción',
    filterSpecies: 'Caprino'
  },
  'caprinos-crecimiento-boer': {
    entityId: 'semovientes',
    title: 'Crecimiento y Rendimiento Cabritos Boer',
    subtitle: 'Ganancia diaria de peso en cabritos para carne (Boer y mestizos) hasta los 60 días de destete precoz.',
    species: 'caprinos',
    speciesLabel: 'Caprinos Aprisco',
    speciesBadgeColor: '#059669',
    speciesIcon: '🐐',
    category: 'Crecimiento',
    filterSpecies: 'Caprino'
  },

  // Equinos
  'equinos-pasaporte-genealogia': {
    entityId: 'semovientes',
    title: 'Libro de Registro y Pasaporte Equino',
    subtitle: 'Ficha oficial con identificación por microchip, señas particulares, genealogía y reseñas gráficas.',
    species: 'equinos',
    speciesLabel: 'Equinos Oficial',
    speciesBadgeColor: '#7c2d12',
    speciesIcon: '🐴',
    category: 'Registro Oficial',
    filterSpecies: 'Equino'
  },
  'equinos-herraje-desvasado': {
    entityId: 'eventos_veterinarios',
    title: 'Cronograma de Herraje y Desvasado',
    subtitle: 'Control de aplomos, herrador responsable, tipo de herraduras y alertas de vencimiento (35-45 días).',
    species: 'equinos',
    speciesLabel: 'Equinos Oficial',
    speciesBadgeColor: '#7c2d12',
    speciesIcon: '🐴',
    category: 'Manejo',
    filterSpecies: 'Equino'
  },
  'equinos-coggins': {
    entityId: 'eventos_veterinarios',
    title: 'Certificación Oficial AIE (Test Coggins)',
    subtitle: 'Vigencia de diagnósticos de Anemia Infecciosa Equina con número de protocolo de laboratorio y ente sanitario.',
    species: 'equinos',
    speciesLabel: 'Equinos Oficial',
    speciesBadgeColor: '#7c2d12',
    speciesIcon: '🐴',
    category: 'Sanidad Oficial',
    filterSpecies: 'Equino'
  },
  'equinos-foliculometria': {
    entityId: 'semovientes',
    title: 'Foliculometría y Fertilidad de Yeguas',
    subtitle: 'Monitoreo ecográfico del diámetro folicular (mm), edema uterino y programación de inseminación.',
    species: 'equinos',
    speciesLabel: 'Equinos Oficial',
    speciesBadgeColor: '#7c2d12',
    speciesIcon: '🐴',
    category: 'Reproducción',
    filterSpecies: 'Equino'
  },
  'equinos-vaqueria-faena': {
    entityId: 'faena_y_trabajo',
    title: 'Bitácora de Vaquería y Entrenamiento Deportivo',
    subtitle: 'Horas de trabajo en campo, jornadas de arreo de sabana, entrenamiento de coleo y condición atlética.',
    species: 'equinos',
    speciesLabel: 'Equinos Faena',
    speciesBadgeColor: '#7c2d12',
    speciesIcon: '🐴',
    category: 'Trabajo / Deporte',
    filterSpecies: 'Equino'
  },

  // Bovinos
  'bovinos-curvas-lactancia-wood': {
    entityId: 'lactancias',
    title: 'Curvas de Lactancia Wood 305d',
    subtitle: 'Ajuste del modelo gamma incompleto de Wood a 305 días para evaluar pico y persistencia.',
    species: 'bovinos',
    speciesLabel: 'Bovinos Leche',
    speciesBadgeColor: '#2d6a4f',
    speciesIcon: '🐮',
    category: 'Producción',
    filterSpecies: 'Bovino'
  },
  'bovinos-mastitis-sanidad': {
    entityId: 'eventos_veterinarios',
    title: 'Mastitis CMT por Cuartos Mamarios',
    subtitle: 'Puntuación California Mastitis Test (0 a 3) en cuartos AD, AI, PD, PI y tiempos de retiro.',
    species: 'bovinos',
    speciesLabel: 'Bovinos Sanidad',
    speciesBadgeColor: '#2d6a4f',
    speciesIcon: '🐮',
    category: 'Sanidad',
    filterSpecies: 'Bovino'
  }
};

export const DynamicReportViewer: React.FC = () => {
  const { reportSlug } = useParams<{ reportSlug: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectedLoteFilter, setSelectedLoteFilter] = useState<string>('TODOS');
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);

  // 1. Resolver configuración del reporte
  const reportConfig: SlugConfig = useMemo(() => {
    const slug = reportSlug || 'aves-postura-galpon';

    // Coincidencia exacta en preconfigurados
    if (PRESET_SLUGS[slug]) {
      return PRESET_SLUGS[slug];
    }

    // Comprobar si es una plantilla Ad-Hoc guardada en localStorage
    try {
      const adhocDirect = localStorage.getItem(`agrotech_adhoc_template_${slug}`);
      if (adhocDirect) {
        const adhoc = JSON.parse(adhocDirect);
        return {
          entityId: adhoc.entityKey || 'semovientes',
          title: adhoc.nombre,
          subtitle: adhoc.descripcion,
          species: 'todos',
          speciesLabel: 'BI AD-HOC',
          speciesBadgeColor: 'var(--primary-color)',
          speciesIcon: '📊',
          category: 'Personalizado',
          savedColumns: adhoc.selectedColumns
        };
      }
      const adhocCollection = localStorage.getItem('agrotech_adhoc_templates');
      if (adhocCollection) {
        const list = JSON.parse(adhocCollection);
        const adhoc = list.find((t: any) => t.id === slug || t.codigo?.toLowerCase() === slug.toLowerCase());
        if (adhoc) {
          return {
            entityId: adhoc.entityKey || 'semovientes',
            title: adhoc.nombre,
            subtitle: adhoc.descripcion,
            species: 'todos',
            speciesLabel: 'BI AD-HOC',
            speciesBadgeColor: 'var(--primary-color)',
            speciesIcon: '📊',
            category: 'Personalizado',
            savedColumns: adhoc.selectedColumns
          };
        }
      }
    } catch {
      // Ignore
    }

    // Comprobar si es un reporte guardado en localStorage (ad-hoc o creado)
    try {
      const saved = localStorage.getItem('agrogan_saved_reports_v2');
      if (saved) {
        const parsed: ReporteItem[] = JSON.parse(saved);
        const match = parsed.find(
          r => r.id === slug || r.rutaAsociada?.endsWith(`/${slug}`) || r.codigo.toLowerCase() === slug.toLowerCase()
        );
        if (match) {
          let detectedEntity: BaseEntityType = 'semovientes';
          const pb = (match.plantillaBase || '').toLowerCase();
          if (pb.includes('postura') || pb.includes('ave') || pb.includes('huevo')) detectedEntity = 'postura_avicola';
          else if (pb.includes('camada') || pb.includes('porcin') || pb.includes('cerda')) detectedEntity = 'camadas_porcinas';
          else if (pb.includes('control') || pb.includes('pesaje') || pb.includes('leche')) detectedEntity = 'controles_lecheros';
          else if (pb.includes('veterin') || pb.includes('sanidad') || pb.includes('famacha') || pb.includes('coggins')) detectedEntity = 'eventos_veterinarios';
          else if (pb.includes('lactan')) detectedEntity = 'lactancias';
          else if (pb.includes('faena') || pb.includes('trabajo')) detectedEntity = 'faena_y_trabajo';
          else if (pb.includes('potrero') || pb.includes('instalacion')) detectedEntity = 'potreros_e_instalaciones';

          return {
            entityId: detectedEntity,
            title: match.nombre,
            subtitle: match.descripcion,
            species: match.especie || 'todos',
            speciesLabel: match.especie ? match.especie.toUpperCase() : 'BI Ad-Hoc',
            speciesBadgeColor: 'var(--primary-color)',
            speciesIcon: '📊',
            category: match.categoria || 'Personalizado'
          };
        }
      }
    } catch {
      // Ignore localStorage error
    }

    // Búsqueda en REPORT_METADATA_MAP
    const metaEntries = Object.entries(REPORT_METADATA_MAP);
    const metaMatch = metaEntries.find(([, meta]) => meta.ruta?.endsWith(`/${slug}`));
    if (metaMatch) {
      const [nombre, meta] = metaMatch;
      let detectedEntity: BaseEntityType = 'semovientes';
      if (meta.especie === 'aves') detectedEntity = 'postura_avicola';
      else if (meta.especie === 'porcinos') detectedEntity = 'camadas_porcinas';
      else if (meta.especie === 'bufalos') {
        detectedEntity = nombre.includes('Lechero') ? 'controles_lecheros' : 'semovientes';
      } else if (meta.especie === 'caprinos') {
        detectedEntity = nombre.includes('FAMACHA') ? 'eventos_veterinarios' : 'controles_lecheros';
      } else if (meta.especie === 'equinos') {
        detectedEntity = nombre.includes('Coggins') || nombre.includes('Herraje') ? 'eventos_veterinarios' : nombre.includes('Vaquería') ? 'faena_y_trabajo' : 'semovientes';
      }

      return {
        entityId: detectedEntity,
        title: meta.nombre,
        subtitle: meta.descripcion,
        species: meta.especie,
        speciesLabel: meta.especie.toUpperCase(),
        speciesBadgeColor: '#2d6a4f',
        speciesIcon: '📋',
        category: meta.categoria
      };
    }

    // Heurística de fallback inteligente
    const lowerSlug = slug.toLowerCase();
    let fallbackEntity: BaseEntityType = 'semovientes';
    let fallbackSpecies: ReportSpecies = 'todos';
    let fallbackLabel = 'Multiespecie';
    let fallbackIcon = '🐾';
    let fallbackColor = '#475569';

    if (lowerSlug.includes('ave') || lowerSlug.includes('postura') || lowerSlug.includes('huevo') || lowerSlug.includes('galpon')) {
      fallbackEntity = 'postura_avicola';
      fallbackSpecies = 'aves';
      fallbackLabel = 'Aves de Corral';
      fallbackIcon = '🐔';
      fallbackColor = '#d97706';
    } else if (lowerSlug.includes('porcin') || lowerSlug.includes('cerda') || lowerSlug.includes('camada') || lowerSlug.includes('ceba')) {
      fallbackEntity = 'camadas_porcinas';
      fallbackSpecies = 'porcinos';
      fallbackLabel = 'Porcinos';
      fallbackIcon = '🐷';
      fallbackColor = '#db2777';
    } else if (lowerSlug.includes('bufal')) {
      fallbackEntity = lowerSlug.includes('grasa') || lowerSlug.includes('leche') ? 'controles_lecheros' : 'semovientes';
      fallbackSpecies = 'bufalos';
      fallbackLabel = 'Búfalos';
      fallbackIcon = '🐃';
      fallbackColor = '#334155';
    } else if (lowerSlug.includes('caprin') || lowerSlug.includes('cabra')) {
      fallbackEntity = lowerSlug.includes('famacha') ? 'eventos_veterinarios' : 'controles_lecheros';
      fallbackSpecies = 'caprinos';
      fallbackLabel = 'Caprinos';
      fallbackIcon = '🐐';
      fallbackColor = '#059669';
    } else if (lowerSlug.includes('equin') || lowerSlug.includes('caballo')) {
      fallbackEntity = lowerSlug.includes('vaqueria') ? 'faena_y_trabajo' : 'semovientes';
      fallbackSpecies = 'equinos';
      fallbackLabel = 'Equinos';
      fallbackIcon = '🐴';
      fallbackColor = '#7c2d12';
    } else if (lowerSlug.includes('mastitis') || lowerSlug.includes('sanidad') || lowerSlug.includes('coggins')) {
      fallbackEntity = 'eventos_veterinarios';
      fallbackSpecies = 'bovinos';
      fallbackLabel = 'Bovinos Sanidad';
      fallbackIcon = '🏥';
      fallbackColor = '#2d6a4f';
    }

    const readableTitle = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      entityId: fallbackEntity,
      title: readableTitle,
      subtitle: `Visor dinámico de datos zootécnicos para ${readableTitle}.`,
      species: fallbackSpecies,
      speciesLabel: fallbackLabel,
      speciesBadgeColor: fallbackColor,
      speciesIcon: fallbackIcon,
      category: 'Zootecnia Dinámica'
    };
  }, [reportSlug]);

  // 2. Entidad Base correspondiente
  const currentEntityConfig = useMemo(() => {
    return ADHOC_ENTITIES[reportConfig.entityId] || ADHOC_ENTITIES.semovientes;
  }, [reportConfig.entityId]);

  // 3. Columnas visibles activas
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    return reportConfig.savedColumns || currentEntityConfig.defaultColumns;
  });

  // Sincronizar columnas al cambiar de entidad o plantilla
  useEffect(() => {
    setVisibleColumns(reportConfig.savedColumns || currentEntityConfig.defaultColumns);
    setSortKey('');
    setCurrentPage(1);
    setSelectedLoteFilter('TODOS');
  }, [currentEntityConfig, reportConfig.savedColumns]);

  // 4. Filas calculadas con campos derivados
  const allRows = useMemo(() => {
    let dataset = [...currentEntityConfig.data];

    // Si la configuración requiere filtrar por especie específica
    if (reportConfig.filterSpecies) {
      const specFiltered = dataset.filter(r => {
        const rowEspecie = r.especie || r.especieAlojada || '';
        return rowEspecie.toLowerCase().includes(reportConfig.filterSpecies!.toLowerCase());
      });
      if (specFiltered.length > 0) {
        dataset = specFiltered;
      }
    }

    // Calcular valores de fórmulas automáticas
    return dataset.map(row => {
      const computed = { ...row };
      currentEntityConfig.columns.forEach(col => {
        if (col.isCalculated && col.compute) {
          computed[col.key] = col.compute(computed);
        }
      });
      return computed;
    });
  }, [currentEntityConfig, reportConfig.filterSpecies]);

  // Lotes o agrupadores disponibles para filtro rápido
  const availableLotes = useMemo(() => {
    const lotes = new Set<string>();
    allRows.forEach(r => {
      if (r.lote) lotes.add(String(r.lote));
      if (r.galpon) lotes.add(String(r.galpon));
      if (r.salaMaternidad) lotes.add(String(r.salaMaternidad));
    });
    return Array.from(lotes);
  }, [allRows]);

  // 5. Filas filtradas por búsqueda y lote
  const filteredRows = useMemo(() => {
    return allRows.filter(row => {
      // Filtro de lote
      if (selectedLoteFilter !== 'TODOS') {
        const loteVal = row.lote || row.galpon || row.salaMaternidad;
        if (loteVal !== selectedLoteFilter) return false;
      }

      // Filtro de búsqueda
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return Object.values(row).some(v => {
        if (v === null || v === undefined) return false;
        return String(v).toLowerCase().includes(q);
      });
    });
  }, [allRows, selectedLoteFilter, searchQuery]);

  // 6. Filas ordenadas
  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredRows, sortKey, sortAsc]);

  // 7. Paginación
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  // 8. Cálculo dinámico de los 4 KPIs superiores según entidad
  const kpis = useMemo(() => {
    const totalCount = filteredRows.length;
    const entity = reportConfig.entityId;

    if (entity === 'postura_avicola') {
      const totalAves = filteredRows.reduce((acc, r) => acc + (Number(r.avesAlojadas) || 0), 0);
      const totalHuevos = filteredRows.reduce(
        (acc, r) => acc + (Number(r.huevosComerciales) || 0) + (Number(r.huevosFertiles) || 0),
        0
      );
      const avgPostura =
        totalCount > 0
          ? (
              filteredRows.reduce((acc, r) => acc + (Number(r.porcentajePostura) || 0), 0) /
              totalCount
            ).toFixed(1)
          : '0.0';
      const totalRotos = filteredRows.reduce((acc, r) => acc + (Number(r.huevosRotos) || 0), 0);

      return [
        { label: 'Aves Alojadas Totales', val: totalAves.toLocaleString('es-VE'), tag: 'Población Activa', color: '#0369a1' },
        { label: 'Huevos Recolectados', val: totalHuevos.toLocaleString('es-VE'), tag: 'Comercial + Fértil', color: '#16a34a' },
        { label: '% Postura Promedio', val: `${avgPostura}%`, tag: 'Eficiencia Galpón', color: '#d97706' },
        { label: 'Huevos Rotos / Merma', val: totalRotos.toLocaleString('es-VE'), tag: 'Control de Merma', color: '#dc2626' }
      ];
    }

    if (entity === 'camadas_porcinas') {
      const totalLNV = filteredRows.reduce((acc, r) => acc + (Number(r.lnv) || 0), 0);
      const avgLNV = totalCount > 0 ? (totalLNV / totalCount).toFixed(1) : '0.0';
      const avgMortalidad =
        totalCount > 0
          ? (
              filteredRows.reduce((acc, r) => acc + (Number(r.tasaMortalidadParto) || 0), 0) /
              totalCount
            ).toFixed(1)
          : '0.0';
      const totalDestete = filteredRows.reduce(
        (acc, r) => acc + (Number(r.lechonesDestetados) || 0),
        0
      );

      return [
        { label: 'Partos / Camadas', val: totalCount.toString(), tag: 'Maternidad Activa', color: '#0369a1' },
        { label: 'Total Nacidos Vivos (LNV)', val: totalLNV.toLocaleString('es-VE'), tag: 'Lechones Vivos', color: '#16a34a' },
        { label: 'Promedio LNV / Cerda', val: avgLNV, tag: 'Prolificidad Piara', color: '#db2777' },
        { label: 'Total Destetados (21d)', val: totalDestete.toLocaleString('es-VE'), tag: `Pérdida: ${avgMortalidad}%`, color: '#16a34a' }
      ];
    }

    if (entity === 'controles_lecheros') {
      const totalLitros = filteredRows.reduce((acc, r) => acc + (Number(r.pesajeTotalKg) || 0), 0);
      const avgLitros = totalCount > 0 ? (totalLitros / totalCount).toFixed(1) : '0.0';
      const avgGrasa =
        totalCount > 0
          ? (
              filteredRows.reduce((acc, r) => acc + (Number(r.grasaPorc) || 0), 0) / totalCount
            ).toFixed(2)
          : '0.00';
      const avgRCS =
        totalCount > 0
          ? Math.round(
              filteredRows.reduce((acc, r) => acc + (Number(r.rcsMil) || 0), 0) / totalCount
            )
          : 0;

      return [
        { label: 'Animales en Control', val: totalCount.toString(), tag: 'Ordeño Registrado', color: '#0369a1' },
        { label: 'Producción Diaria Total', val: `${totalLitros.toFixed(1)} kg`, tag: `Prom: ${avgLitros} kg/hembra`, color: '#16a34a' },
        { label: 'Grasa Butirométrica', val: `${avgGrasa}%`, tag: 'Aptitud Quesera', color: '#d97706' },
        { label: 'RCS Células Somáticas', val: `${avgRCS}k`, tag: 'cel/ml (Salud Ubre)', color: '#7c3aed' }
      ];
    }

    if (entity === 'eventos_veterinarios') {
      const retiroLeche = filteredRows.filter(r => (Number(r.diasRetiroLeche) || 0) > 0).length;
      const retiroCarne = filteredRows.filter(r => (Number(r.diasRetiroCarne) || 0) > 0).length;
      const aptosConsumo = filteredRows.filter(
        r => (Number(r.diasRetiroLeche) || 0) === 0 && (Number(r.diasRetiroCarne) || 0) === 0
      ).length;

      return [
        { label: 'Eventos Sanitarios', val: totalCount.toString(), tag: 'Tratamientos & Fármacos', color: '#0369a1' },
        { label: 'Retención Leche Activa', val: retiroLeche.toString(), tag: 'Bloqueo Ordeño', color: retiroLeche > 0 ? '#dc2626' : '#16a34a' },
        { label: 'Retención Carne Activa', val: retiroCarne.toString(), tag: 'Bloqueo Matadero', color: retiroCarne > 0 ? '#ea580c' : '#16a34a' },
        { label: 'Lotes Aptos para Consumo', val: aptosConsumo.toString(), tag: 'Inocuidad Garantizada', color: '#16a34a' }
      ];
    }

    if (entity === 'faena_y_trabajo') {
      const totalHoras = filteredRows.reduce((acc, r) => acc + (Number(r.horasOJornadas) || 0), 0);
      const totalKilos = filteredRows.reduce(
        (acc, r) => acc + (Number(r.kilosCanalProyectados) || 0),
        0
      );
      const avgRend =
        totalCount > 0
          ? (
              filteredRows.reduce((acc, r) => acc + (Number(r.rendimientoEstimadoPorc) || 0), 0) /
              totalCount
            ).toFixed(1)
          : '0.0';

      return [
        { label: 'Ejemplares / Lotes', val: totalCount.toString(), tag: 'Bitácora Operativa', color: '#0369a1' },
        { label: 'Horas / Jornadas Labor', val: `${totalHoras} h`, tag: 'Trabajo & Faena', color: '#7c2d12' },
        { label: 'Rendimiento en Canal', val: `${avgRend}%`, tag: 'Promedio Frigorífico', color: '#16a34a' },
        { label: 'Carne en Canal Proyectada', val: `${totalKilos.toLocaleString('es-VE')} kg`, tag: 'Rinde Estimado', color: '#d97706' }
      ];
    }

    // Default: Semovientes / Padrón General
    const avgPeso =
      totalCount > 0
        ? (
            filteredRows.reduce((acc, r) => acc + (Number(r.ultimoPesoKg) || 0), 0) / totalCount
          ).toFixed(1)
        : '0.0';
    const totalPartos = filteredRows.reduce((acc, r) => acc + (Number(r.partos) || 0), 0);
    const avgEdad =
      totalCount > 0
        ? (
            filteredRows.reduce((acc, r) => acc + (Number(r.edadAnos) || 0), 0) / totalCount
          ).toFixed(1)
        : '0.0';

    return [
      { label: 'Padrón de Animales', val: totalCount.toString(), tag: 'Semovientes Censados', color: '#0369a1' },
      { label: 'Peso Corporal Promedio', val: `${avgPeso} kg`, tag: 'Condición Física', color: '#16a34a' },
      { label: 'Edad Promedio Hato', val: `${avgEdad} años`, tag: 'Estructura Etaria', color: '#7c3aed' },
      { label: 'Partos Acumulados', val: totalPartos.toString(), tag: 'Vida Reproductiva', color: '#d97706' }
    ];
  }, [filteredRows, reportConfig.entityId]);

  // Manejo de ordenamiento por columna
  const handleSort = (colKey: string) => {
    if (sortKey === colKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(colKey);
      setSortAsc(true);
    }
  };

  // Manejo de visibilidad de columnas
  const toggleColumn = (colKey: string) => {
    if (visibleColumns.includes(colKey)) {
      if (visibleColumns.length <= 2) return; // Mantener al menos 2 columnas
      setVisibleColumns(visibleColumns.filter(c => c !== colKey));
    } else {
      setVisibleColumns([...visibleColumns, colKey]);
    }
  };

  // Columnas activas para renderizado y exportación
  const activeColDefs: ColumnDefinition[] = useMemo(() => {
    return currentEntityConfig.columns.filter(c => visibleColumns.includes(c.key));
  }, [currentEntityConfig.columns, visibleColumns]);

  // Exportar a CSV
  const handleExportCSV = () => {
    const filename = `reporte_${reportSlug || 'dinamico'}`;
    const headers = activeColDefs.map(c => c.label);
    const rows = sortedRows.map(row => activeColDefs.map(col => row[col.key]));
    exportToCSV(filename, headers, rows);
  };

  // Exportar a PDF
  const handleExportPDF = () => {
    const headers = activeColDefs.map(c => c.label);
    const rows = sortedRows.map(row => activeColDefs.map(col => row[col.key]));
    exportToPDF(reportSlug || 'reporte', reportConfig.title, headers, rows);
  };

  // Formateador de celdas
  const renderCellValue = (row: any, col: ColumnDefinition) => {
    const val = row[col.key];
    if (val === undefined || val === null || val === '') {
      return <span style={{ color: '#94a3b8' }}>—</span>;
    }

    // Diagnósticos y alertas sanitarias
    if (col.key === 'alertaCalidad' || col.key === 'alertaInocuidad') {
      const strVal = String(val);
      const isOk = strVal.includes('Óptima') || strVal.includes('APTO') || strVal.includes('A1');
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 700,
            backgroundColor: isOk ? '#ecfdf5' : '#fef2f2',
            color: isOk ? '#065f46' : '#991b1b',
            border: `1px solid ${isOk ? '#a7f3d0' : '#fecaca'}`
          }}
        >
          {isOk ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          {strVal}
        </span>
      );
    }

    // Clasificación de huevos
    if (col.key === 'clasificacionLote') {
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 700,
            backgroundColor: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #bfdbfe'
          }}
        >
          {String(val)}
        </span>
      );
    }

    // Estatus de salud o vital
    if (col.key === 'estatus' || col.key === 'estatusSanitario' || col.key === 'estadoAptitud') {
      const strVal = String(val);
      const isPositive =
        strVal.includes('Activo') || strVal.includes('Resuelto') || strVal.includes('Óptimo') || strVal.includes('Vigente');
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: 11.5,
            fontWeight: 600,
            backgroundColor: isPositive ? '#dcfce7' : '#fef3c7',
            color: isPositive ? '#166534' : '#92400e'
          }}
        >
          {strVal}
        </span>
      );
    }

    // Números formateados
    if (col.type === 'number' && typeof val === 'number') {
      if (Number.isInteger(val)) {
        return <strong style={{ color: '#1e293b' }}>{val.toLocaleString('es-VE')}</strong>;
      }
      return <strong style={{ color: '#1e293b' }}>{val.toFixed(2)}</strong>;
    }

    return String(val);
  };

  return (
    <div className="report-view-container" style={{ padding: '24px 32px', maxWidth: 1440, margin: '0 auto' }}>
      {/* 1. Cabecera con botón de retroceso */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <button
            type="button"
            onClick={() => navigate('/reports')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              border: '1.5px solid var(--border-gray)',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s ease',
              marginTop: 2
            }}
            title="Regresar al Centro de Reportes"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {reportConfig.title}
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: `${reportConfig.speciesBadgeColor}18`,
                  color: reportConfig.speciesBadgeColor,
                  border: `1px solid ${reportConfig.speciesBadgeColor}35`
                }}
              >
                <span>{reportConfig.speciesIcon}</span>
                <span>{reportConfig.speciesLabel}</span>
              </span>
              <span
                style={{
                  padding: '3px 9px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#475569'
                }}
              >
                {reportConfig.category}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#16a34a',
                  backgroundColor: '#ecfdf5',
                  padding: '2px 8px',
                  borderRadius: 6
                }}
              >
                <CheckCircle2 size={12} /> Motor BI en Vivo
              </span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 850, lineHeight: 1.45 }}>
              {reportConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Acciones de exportación */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportPDF}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 13 }}
          >
            <Printer size={15} />
            <span>Imprimir / PDF</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13 }}
          >
            <Download size={15} />
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Cuatro Tarjetas KPI Superiores */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14,
          marginBottom: 22
        }}
      >
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              border: '1.5px solid var(--border-gray)',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                {kpi.label}
              </span>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: `${kpi.color}15`,
                  color: kpi.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingUp size={15} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {kpi.val}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: kpi.color,
                  backgroundColor: `${kpi.color}12`,
                  padding: '2px 8px',
                  borderRadius: 6
                }}
              >
                {kpi.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Barra de Control: Búsqueda, Filtros de Lote y Columnas */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1.5px solid var(--border-gray)',
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        {/* Buscador reactivo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: 380
            }}
          >
            <Search
              size={17}
              style={{ position: 'absolute', left: 12, color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Buscar en registros (arete, galpón, lote, estatus)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 8,
                border: '1.5px solid var(--border-gray)',
                fontSize: 13,
                outline: 'none'
              }}
            />
          </div>

          {/* Filtro por Lote o Galpón si existen */}
          {availableLotes.length > 0 && (
            <select
              value={selectedLoteFilter}
              onChange={e => {
                setSelectedLoteFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1.5px solid var(--border-gray)',
                fontSize: 13,
                color: '#334155',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="TODOS">Todos los Lotes / Galpones</option>
              {availableLotes.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selector de Columnas y Contador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
            {filteredRows.length} {filteredRows.length === 1 ? 'registro' : 'registros'}
          </span>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
              padding: '7px 12px'
            }}
          >
            <Columns size={14} />
            <span>Columnas ({visibleColumns.length})</span>
          </button>

          {/* Popover de Selector de Columnas */}
          {isColumnPickerOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                zIndex: 40,
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-gray)',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: 12,
                width: 250,
                maxHeight: 320,
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: '#334155' }}>
                Columnas Visibles
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentEntityConfig.columns.map(col => (
                  <label
                    key={col.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => {
                    setVisibleColumns(currentEntityConfig.defaultColumns);
                    setIsColumnPickerOpen(false);
                  }}
                  style={{
                    fontSize: 11,
                    color: 'var(--primary-color)',
                    background: 'none',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Restablecer Predeterminadas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Tabla Principal */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1.5px solid var(--border-gray)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid var(--border-gray)' }}>
                {activeColDefs.map(col => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{
                        padding: '12px 14px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: isSorted ? 'var(--primary-color)' : '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span>{col.label}</span>
                        <ArrowUpDown size={12} style={{ opacity: isSorted ? 1 : 0.3 }} />
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeColDefs.length}
                    style={{ padding: '36px 16px', textAlign: 'center', color: '#64748b' }}
                  >
                    No se encontraron registros que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, rIdx) => (
                  <tr
                    key={row.id || rIdx}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fafafa',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f0fdf4';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        rIdx % 2 === 0 ? '#ffffff' : '#fafafa';
                    }}
                  >
                    {activeColDefs.map(col => (
                      <td
                        key={col.key}
                        style={{
                          padding: '11px 14px',
                          color: '#334155',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {renderCellValue(row, col)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Barra de Paginación */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#ffffff',
            borderTop: '1.5px solid var(--border-gray)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Filas por página:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid var(--border-gray)',
                fontSize: 12,
                backgroundColor: '#ffffff',
                color: '#334155'
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              Mostrando {sortedRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} a{' '}
              {Math.min(currentPage * pageSize, sortedRows.length)} de {sortedRows.length} registros
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '5px 10px',
                fontSize: 12,
                opacity: currentPage === 1 ? 0.4 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={15} />
              <span>Anterior</span>
            </button>

            <span style={{ fontSize: 12.5, fontWeight: 700, padding: '0 8px', color: '#334155' }}>
              Página {currentPage} de {totalPages}
            </span>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '5px 10px',
                fontSize: 12,
                opacity: currentPage === totalPages ? 0.4 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Siguiente</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
