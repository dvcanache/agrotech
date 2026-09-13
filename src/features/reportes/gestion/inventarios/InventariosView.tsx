import React, { useState, useMemo, useEffect } from 'react';
import { Award, Filter } from 'lucide-react';
import { DoughnutChart } from '../../../../components/charts/DoughnutChart';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { SpeciesSelectorBar, SPECIES_TABS_CONFIG } from '../../components/SpeciesSelectorBar';
import { AnalisisInventarioModal } from './AnalisisInventarioModal';
import { InventariosFilterDrawer, InventariosFilterValues } from './InventariosFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { EstatusAnimal } from '../../../../types2/common';

/* =========================================================================
 * DEFINICIÓN Y CONFIGURACIÓN MULTIESPECIE PARA INVENTARIOS
 * ========================================================================= */

export interface SpeciesInventoryConfig {
  speciesId: string;
  speciesName: string;
  icon: string;
  loteLabel: string;
  subcategories: { key: string; label: string }[];
  lotes: {
    loteCodigo: string;
    loteNombre: string;
    values: Record<string, number>;
    total: number;
  }[];
  categoryChart: {
    labels: string[];
    data: number[];
    colors: string[];
  };
  locationChart: {
    labels: string[];
    data: number[];
    colors: string[];
  };
}

export const SPECIES_INVENTORY_DATA: Record<string, SpeciesInventoryConfig> = {
  TODAS: {
    speciesId: 'TODAS',
    speciesName: 'Todas las Especies',
    icon: '🐾',
    loteLabel: 'Sectores / Instalaciones',
    subcategories: [
      { key: 'bovinos', label: 'Bovinos 🐮' },
      { key: 'aves', label: 'Aves 🐔' },
      { key: 'porcinos', label: 'Porcinos 🐷' },
      { key: 'bufalos', label: 'Búfalos 🐃' },
      { key: 'caprinos', label: 'Caprinos 🐐' },
      { key: 'equinos', label: 'Equinos 🐴' }
    ],
    lotes: [
      {
        loteCodigo: 'SEC-POT',
        loteNombre: 'Potreros de Pastoreo Abierto',
        values: { bovinos: 28, aves: 0, porcinos: 0, bufalos: 36, caprinos: 0, equinos: 17 },
        total: 81
      },
      {
        loteCodigo: 'SEC-INT',
        loteNombre: 'Galpones e Instalaciones Confinadas',
        values: { bovinos: 0, aves: 1047, porcinos: 101, bufalos: 0, caprinos: 37, equinos: 3 },
        total: 1188
      },
      {
        loteCodigo: 'SEC-ORD',
        loteNombre: 'Salas de Ordeño & Vaqueras',
        values: { bovinos: 6, aves: 0, porcinos: 0, bufalos: 13, caprinos: 14, equinos: 0 },
        total: 33
      },
      {
        loteCodigo: 'SEC-MAT',
        loteNombre: 'Maternidad, Cría y Precebo',
        values: { bovinos: 11, aves: 28, porcinos: 28, bufalos: 11, caprinos: 3, equinos: 7 },
        total: 88
      }
    ],
    categoryChart: {
      labels: ['Aves de corral', 'Porcinos', 'Búfalos', 'Caprinos', 'Bovinos', 'Equinos'],
      data: [1075, 129, 60, 54, 45, 27],
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#10b981', '#6366f1']
    },
    locationChart: {
      labels: ['Galpones e Instalaciones', 'Maternidad y Cría', 'Potreros de Pastoreo', 'Salas de Ordeño'],
      data: [1188, 88, 81, 33],
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
    }
  },
  Bovinos: {
    speciesId: 'Bovinos',
    speciesName: 'Bovinos',
    icon: '🐮',
    loteLabel: 'Lotes',
    subcategories: [
      { key: 'becerras', label: 'Becerras' },
      { key: 'mautas', label: 'Mautas' },
      { key: 'novillas', label: 'Novillas' },
      { key: 'vacas', label: 'Vacas' },
      { key: 'becerros', label: 'Becerros' },
      { key: 'mautes', label: 'Mautes' },
      { key: 'novillos', label: 'Novillos' },
      { key: 'toros', label: 'Toros' }
    ],
    lotes: [
      {
        loteCodigo: 'ESCT',
        loteNombre: 'ESCT - Escotero',
        values: { becerras: 2, mautas: 5, novillas: 3, vacas: 11, becerros: 3, mautes: 3, novillos: 0, toros: 1 },
        total: 28
      },
      {
        loteCodigo: 'POT1',
        loteNombre: 'POT1 - Potrero 1',
        values: { becerras: 6, mautas: 0, novillas: 0, vacas: 0, becerros: 4, mautes: 0, novillos: 0, toros: 1 },
        total: 11
      },
      {
        loteCodigo: 'SEC1',
        loteNombre: 'SEC1 - Secas 1',
        values: { becerras: 0, mautas: 0, novillas: 0, vacas: 4, becerros: 0, mautes: 0, novillos: 0, toros: 0 },
        total: 4
      },
      {
        loteCodigo: '01',
        loteNombre: '01 - Lote 01',
        values: { becerras: 0, mautas: 0, novillas: 0, vacas: 2, becerros: 0, mautes: 0, novillos: 0, toros: 0 },
        total: 2
      }
    ],
    categoryChart: {
      labels: ['Becerra', 'Mauta', 'Novilla', 'Vaca', 'Becerro', 'Maute', 'Toro'],
      data: [8, 5, 3, 17, 7, 3, 2],
      colors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc']
    },
    locationChart: {
      labels: ['01', 'SEC1', 'POT1', 'ESCT'],
      data: [2, 4, 11, 28],
      colors: ['#2d6a4f', '#52b788', '#74c69d', '#b7e4c7']
    }
  },
  'Aves de corral': {
    speciesId: 'Aves de corral',
    speciesName: 'Aves de corral',
    icon: '🐔',
    loteLabel: 'Galpones / Lotes',
    subcategories: [
      { key: 'pollitos', label: 'Pollitos/as (Cría)' },
      { key: 'pollonas', label: 'Pollonas (Levante)' },
      { key: 'gallinas_postura', label: 'Gallinas Postura' },
      { key: 'pollos_engorde', label: 'Pollos Engorde' },
      { key: 'gallos_reprod', label: 'Gallos Reproductores' },
      { key: 'gallos_finos', label: 'Gallos Finos & Castas' }
    ],
    lotes: [
      {
        loteCodigo: 'GALP-01',
        loteNombre: 'GALP-01 - Ponedoras Hy-Line',
        values: { pollitos: 0, pollonas: 0, gallinas_postura: 450, pollos_engorde: 0, gallos_reprod: 12, gallos_finos: 0 },
        total: 462
      },
      {
        loteCodigo: 'GALP-02',
        loteNombre: 'GALP-02 - Broilers Ross 308',
        values: { pollitos: 0, pollonas: 0, gallinas_postura: 0, pollos_engorde: 380, gallos_reprod: 0, gallos_finos: 0 },
        total: 380
      },
      {
        loteCodigo: 'GALP-03',
        loteNombre: 'GALP-03 - Cría y Recría',
        values: { pollitos: 120, pollonas: 85, gallinas_postura: 0, pollos_engorde: 0, gallos_reprod: 0, gallos_finos: 0 },
        total: 205
      },
      {
        loteCodigo: 'GALP-04',
        loteNombre: 'GALP-04 - Gallos Finos & Castas',
        values: { pollitos: 0, pollonas: 0, gallinas_postura: 8, pollos_engorde: 0, gallos_reprod: 2, gallos_finos: 18 },
        total: 28
      }
    ],
    categoryChart: {
      labels: ['Gallinas Postura', 'Pollos Engorde', 'Pollitos/as', 'Pollonas', 'Gallos Finos', 'Gallos Reprod'],
      data: [458, 380, 120, 85, 18, 14],
      colors: ['#f59e0b', '#d97706', '#fbbf24', '#fde68a', '#b45309', '#78350f']
    },
    locationChart: {
      labels: ['GALP-01', 'GALP-02', 'GALP-03', 'GALP-04'],
      data: [462, 380, 205, 28],
      colors: ['#f59e0b', '#d97706', '#fbbf24', '#b45309']
    }
  },
  Porcinos: {
    speciesId: 'Porcinos',
    speciesName: 'Porcinos',
    icon: '🐷',
    loteLabel: 'Salas / Lotes',
    subcategories: [
      { key: 'lechones', label: 'Lechones Lactantes' },
      { key: 'destetados', label: 'Destetados / Precebo' },
      { key: 'cerdas_reemplazo', label: 'Cerdas Reemplazo' },
      { key: 'cerdas_gestantes', label: 'Cerdas Gestantes' },
      { key: 'cerdas_lactantes', label: 'Cerdas Lactantes' },
      { key: 'cerdos_ceba', label: 'Cerdos Ceba' },
      { key: 'verracos', label: 'Verracos' }
    ],
    lotes: [
      {
        loteCodigo: 'MAT-01',
        loteNombre: 'MAT-01 - Sala Maternidad',
        values: { lechones: 36, destetados: 0, cerdas_reemplazo: 0, cerdas_gestantes: 0, cerdas_lactantes: 4, cerdos_ceba: 0, verracos: 0 },
        total: 40
      },
      {
        loteCodigo: 'GES-02',
        loteNombre: 'GES-02 - Gestación Individual',
        values: { lechones: 0, destetados: 0, cerdas_reemplazo: 5, cerdas_gestantes: 18, cerdas_lactantes: 0, cerdos_ceba: 0, verracos: 0 },
        total: 23
      },
      {
        loteCodigo: 'PRE-01',
        loteNombre: 'PRE-01 - Galpón Precebo',
        values: { lechones: 0, destetados: 28, cerdas_reemplazo: 0, cerdas_gestantes: 0, cerdas_lactantes: 0, cerdos_ceba: 0, verracos: 0 },
        total: 28
      },
      {
        loteCodigo: 'CEB-03',
        loteNombre: 'CEB-03 - Sala Ceba y Engorde',
        values: { lechones: 0, destetados: 0, cerdas_reemplazo: 0, cerdas_gestantes: 0, cerdas_lactantes: 0, cerdos_ceba: 35, verracos: 0 },
        total: 35
      },
      {
        loteCodigo: 'VERR-01',
        loteNombre: 'VERR-01 - Módulo Verracos',
        values: { lechones: 0, destetados: 0, cerdas_reemplazo: 0, cerdas_gestantes: 0, cerdas_lactantes: 0, cerdos_ceba: 0, verracos: 3 },
        total: 3
      }
    ],
    categoryChart: {
      labels: ['Lechones Lactantes', 'Cerdos Ceba', 'Destetados', 'Cerdas Gestantes', 'Cerdas Reemplazo', 'Cerdas Lactantes', 'Verracos'],
      data: [36, 35, 28, 18, 5, 4, 3],
      colors: ['#ec4899', '#f472b6', '#db2777', '#be185d', '#9d174d', '#fbcfe8', '#831843']
    },
    locationChart: {
      labels: ['MAT-01', 'CEB-03', 'PRE-01', 'GES-02', 'VERR-01'],
      data: [40, 35, 28, 23, 3],
      colors: ['#ec4899', '#f472b6', '#db2777', '#be185d', '#9d174d']
    }
  },
  'Búfalos': {
    speciesId: 'Búfalos',
    speciesName: 'Búfalos',
    icon: '🐃',
    loteLabel: 'Mangas / Lotes',
    subcategories: [
      { key: 'bucerras', label: 'Bucerras' },
      { key: 'bubillas', label: 'Bubillas' },
      { key: 'bufalas', label: 'Búfalas' },
      { key: 'bucerros', label: 'Bucerros' },
      { key: 'bubillos', label: 'Bubillos' },
      { key: 'toretes', label: 'Toretes' },
      { key: 'padrotes', label: 'Padrotes' }
    ],
    lotes: [
      {
        loteCodigo: 'BUF-01',
        loteNombre: 'BUF-01 - Manga Sabana Baja',
        values: { bucerras: 3, bubillas: 4, bufalas: 8, bucerros: 3, bubillos: 2, toretes: 1, padrotes: 1 },
        total: 22
      },
      {
        loteCodigo: 'BUF-ORD',
        loteNombre: 'BUF-ORD - Ordeño Bufalero',
        values: { bucerras: 1, bubillas: 0, bufalas: 12, bucerros: 0, bubillos: 0, toretes: 0, padrotes: 0 },
        total: 13
      },
      {
        loteCodigo: 'BUF-REV',
        loteNombre: 'BUF-REV - Humedal y Revolcadero',
        values: { bucerras: 0, bubillas: 3, bufalas: 6, bucerros: 0, bubillos: 2, toretes: 2, padrotes: 1 },
        total: 14
      },
      {
        loteCodigo: 'BUF-CEB',
        loteNombre: 'BUF-CEB - Ceba Palustre',
        values: { bucerras: 0, bubillas: 0, bufalas: 0, bucerros: 2, bubillos: 4, toretes: 5, padrotes: 0 },
        total: 11
      }
    ],
    categoryChart: {
      labels: ['Búfalas', 'Bubillos', 'Toretes', 'Bubillas', 'Bucerros', 'Bucerras', 'Padrotes'],
      data: [26, 8, 8, 7, 5, 4, 2],
      colors: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']
    },
    locationChart: {
      labels: ['BUF-01', 'BUF-REV', 'BUF-ORD', 'BUF-CEB'],
      data: [22, 14, 13, 11],
      colors: ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa']
    }
  },
  Caprinos: {
    speciesId: 'Caprinos',
    speciesName: 'Caprinos',
    icon: '🐐',
    loteLabel: 'Apriscos / Corrales',
    subcategories: [
      { key: 'cabritos', label: 'Cabritos/as Lactantes' },
      { key: 'cabritonas', label: 'Cabritonas (Levante)' },
      { key: 'cabras_ordeno', label: 'Cabras en Ordeño' },
      { key: 'cabras_secas', label: 'Cabras Secas' },
      { key: 'chivos_ceba', label: 'Chivos de Ceba' },
      { key: 'sementales', label: 'Sementales' }
    ],
    lotes: [
      {
        loteCodigo: 'APR-01',
        loteNombre: 'APR-01 - Ordeño en Tarima',
        values: { cabritos: 0, cabritonas: 0, cabras_ordeno: 16, cabras_secas: 4, chivos_ceba: 0, sementales: 0 },
        total: 20
      },
      {
        loteCodigo: 'APR-02',
        loteNombre: 'APR-02 - Cabriteros & Cría',
        values: { cabritos: 14, cabritonas: 0, cabras_ordeno: 0, cabras_secas: 0, chivos_ceba: 0, sementales: 0 },
        total: 14
      },
      {
        loteCodigo: 'APR-03',
        loteNombre: 'APR-03 - Levante y Ceba',
        values: { cabritos: 0, cabritonas: 9, cabras_ordeno: 0, cabras_secas: 0, chivos_ceba: 8, sementales: 0 },
        total: 17
      },
      {
        loteCodigo: 'APR-PAD',
        loteNombre: 'APR-PAD - Corral Sementales',
        values: { cabritos: 0, cabritonas: 0, cabras_ordeno: 0, cabras_secas: 0, chivos_ceba: 0, sementales: 3 },
        total: 3
      }
    ],
    categoryChart: {
      labels: ['Cabras en Ordeño', 'Cabritos Lactantes', 'Cabritonas', 'Chivos de Ceba', 'Cabras Secas', 'Sementales'],
      data: [16, 14, 9, 8, 4, 3],
      colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']
    },
    locationChart: {
      labels: ['APR-01', 'APR-03', 'APR-02', 'APR-PAD'],
      data: [20, 17, 14, 3],
      colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']
    }
  },
  Equinos: {
    speciesId: 'Equinos',
    speciesName: 'Equinos',
    icon: '🐴',
    loteLabel: 'Caballerizas / Potreros',
    subcategories: [
      { key: 'potros', label: 'Potros/as Lactantes' },
      { key: 'potrancas', label: 'Potrancas / Potros Levante' },
      { key: 'yeguas_madres', label: 'Yeguas Madres' },
      { key: 'yeguas_escoteras', label: 'Yeguas Escoteras' },
      { key: 'caballos_trabajo', label: 'Caballos de Trabajo' },
      { key: 'padrillos', label: 'Padrillos / Sementales' }
    ],
    lotes: [
      {
        loteCodigo: 'POT-YEG',
        loteNombre: 'POT-YEG - Potrero Yeguas Madres',
        values: { potros: 2, potrancas: 1, yeguas_madres: 6, yeguas_escoteras: 2, caballos_trabajo: 0, padrillos: 0 },
        total: 11
      },
      {
        loteCodigo: 'CAB-TRAB',
        loteNombre: 'CAB-TRAB - Caballeriza de Faena',
        values: { potros: 0, potrancas: 0, yeguas_madres: 0, yeguas_escoteras: 0, caballos_trabajo: 7, padrillos: 0 },
        total: 7
      },
      {
        loteCodigo: 'POT-POTR',
        loteNombre: 'POT-POTR - Potrero Potros y Doma',
        values: { potros: 3, potrancas: 3, yeguas_madres: 0, yeguas_escoteras: 0, caballos_trabajo: 0, padrillos: 0 },
        total: 6
      },
      {
        loteCodigo: 'CAB-01',
        loteNombre: 'CAB-01 - Boxes y Padrilleras',
        values: { potros: 0, potrancas: 0, yeguas_madres: 0, yeguas_escoteras: 0, caballos_trabajo: 0, padrillos: 3 },
        total: 3
      }
    ],
    categoryChart: {
      labels: ['Caballos de Trabajo', 'Yeguas Madres', 'Potros Lactantes', 'Potrancas Levante', 'Padrillos', 'Yeguas Escoteras'],
      data: [7, 6, 5, 4, 3, 2],
      colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1']
    },
    locationChart: {
      labels: ['POT-YEG', 'CAB-TRAB', 'POT-POTR', 'CAB-01'],
      data: [11, 7, 6, 3],
      colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4']
    }
  }
};

export const InventariosView: React.FC = () => {
  // Especie activa
  const [selectedSpecies, setSelectedSpecies] = useState<string>('TODAS');

  // Configuración de la especie activa
  const activeConfig = useMemo(() => {
    return SPECIES_INVENTORY_DATA[selectedSpecies] || SPECIES_INVENTORY_DATA.TODAS;
  }, [selectedSpecies]);

  // Conteos dinámicos por especie para la barra superior
  const speciesCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SPECIES_TABS_CONFIG.forEach(tab => {
      const cfg = SPECIES_INVENTORY_DATA[tab.id];
      if (cfg) {
        counts[tab.id] = cfg.lotes.reduce((sum, l) => sum + l.total, 0);
      }
    });
    return counts;
  }, []);

  // Estados de modales y drawers
  const [isAnalisisModalOpen, setIsAnalisisModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Columnas configurables
  const [columns, setColumns] = useState<ColumnSetting[]>(() => [
    { key: 'lote', label: activeConfig.loteLabel, visible: true },
    ...activeConfig.subcategories.map(sub => ({ key: sub.key, label: sub.label, visible: true })),
    { key: 'total', label: 'Total', visible: true }
  ]);

  // Filtros aplicados
  const [filters, setFilters] = useState<InventariosFilterValues>(() => ({
    lotes: activeConfig.lotes.map(l => l.loteCodigo),
    estatus: ['Activo'] as EstatusAnimal[],
    categorias: activeConfig.subcategories.map(s => s.key),
    fechaCorte: new Date().toISOString().split('T')[0]
  }));

  // Sincronizar columnas y filtros al cambiar de especie
  useEffect(() => {
    setColumns([
      { key: 'lote', label: activeConfig.loteLabel, visible: true },
      ...activeConfig.subcategories.map(sub => ({ key: sub.key, label: sub.label, visible: true })),
      { key: 'total', label: 'Total', visible: true }
    ]);

    setFilters(prev => ({
      ...prev,
      lotes: activeConfig.lotes.map(l => l.loteCodigo),
      categorias: activeConfig.subcategories.map(s => s.key)
    }));
  }, [selectedSpecies, activeConfig]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.lotes.length < activeConfig.lotes.length) count++;
    if (filters.estatus.length < 3) count++;
    if (filters.categorias.length < activeConfig.subcategories.length) count++;
    return count;
  }, [filters, activeConfig]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const isColVisible = (key: string) => {
    const col = columns.find(c => c.key === key);
    if (col && !col.visible) return false;
    if (key !== 'lote' && key !== 'total') {
      return filters.categorias.includes(key);
    }
    return true;
  };

  // Helper para calcular total por fila considerando categorías activas
  const getRowTotal = (r: typeof activeConfig.lotes[0]) => {
    return activeConfig.subcategories.reduce((acc, sub) => {
      if (filters.categorias.includes(sub.key)) {
        return acc + (r.values[sub.key] || 0);
      }
      return acc;
    }, 0);
  };

  // Filtrado de filas de la matriz
  const filteredRows = useMemo(() => {
    return activeConfig.lotes.filter(lote =>
      filters.lotes.includes(lote.loteCodigo)
    );
  }, [activeConfig.lotes, filters.lotes]);

  // Totales por subcategoría calculados
  const totals = useMemo(() => {
    const subTotals: Record<string, number> = {};
    activeConfig.subcategories.forEach(sub => {
      subTotals[sub.key] = 0;
    });

    let grandTotal = 0;

    filteredRows.forEach(r => {
      activeConfig.subcategories.forEach(sub => {
        if (filters.categorias.includes(sub.key)) {
          const val = r.values[sub.key] || 0;
          subTotals[sub.key] += val;
        }
      });
      grandTotal += getRowTotal(r);
    });

    return {
      subTotals,
      total: grandTotal
    };
  }, [filteredRows, filters.categorias, activeConfig]);

  // Gráfico filtrado por categorías activas
  const categoryChartData = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];

    activeConfig.categoryChart.labels.forEach((lbl, idx) => {
      // Buscar si corresponde a alguna de las subcategorías activas
      const matchingSub = activeConfig.subcategories.find(
        s => s.label.toLowerCase().includes(lbl.toLowerCase()) || lbl.toLowerCase().includes(s.label.toLowerCase()) || s.key.toLowerCase().includes(lbl.toLowerCase())
      );

      const isIncluded = matchingSub ? filters.categorias.includes(matchingSub.key) : true;
      if (isIncluded) {
        labels.push(lbl);
        data.push(activeConfig.categoryChart.data[idx]);
        colors.push(activeConfig.categoryChart.colors[idx]);
      }
    });

    return {
      labels: labels.length > 0 ? labels : ['Sin datos'],
      data: data.length > 0 ? data : [0],
      colors: colors.length > 0 ? colors : ['#cbd5e1']
    };
  }, [filters.categorias, activeConfig]);

  // Gráfico filtrado por locaciones activas
  const locationChartData = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];

    activeConfig.locationChart.labels.forEach((lbl, idx) => {
      const matchingLote = activeConfig.lotes.find(
        l => l.loteCodigo === lbl || l.loteNombre.toLowerCase().includes(lbl.toLowerCase())
      );
      const isIncluded = matchingLote ? filters.lotes.includes(matchingLote.loteCodigo) : true;

      if (isIncluded) {
        labels.push(lbl);
        data.push(activeConfig.locationChart.data[idx]);
        colors.push(activeConfig.locationChart.colors[idx] || '#2d6a4f');
      }
    });

    return {
      labels: labels.length > 0 ? labels : ['Sin datos'],
      data: data.length > 0 ? data : [0],
      colors: colors.length > 0 ? colors : ['#cbd5e1']
    };
  }, [filters.lotes, activeConfig]);

  const handleExportXLSX = () => {
    const visibleSubcategories = activeConfig.subcategories.filter(s => isColVisible(s.key));
    const headers = [
      activeConfig.loteLabel,
      ...visibleSubcategories.map(s => s.label),
      'Total'
    ];

    const rows: (string | number)[][] = filteredRows.map(r => [
      r.loteNombre,
      ...visibleSubcategories.map(s => (filters.categorias.includes(s.key) ? (r.values[s.key] || 0) : 0)),
      getRowTotal(r)
    ]);

    // Fila Total Activos
    rows.push([
      'Total activos',
      ...visibleSubcategories.map(s => totals.subTotals[s.key] || 0),
      totals.total
    ]);

    // Fila Total General
    rows.push([
      'Total',
      ...visibleSubcategories.map(s => totals.subTotals[s.key] || 0),
      totals.total
    ]);

    exportToCSV(`reporte_inventarios_${selectedSpecies.toLowerCase().replace(/\s+/g, '_')}`, headers, rows);
  };

  return (
    <div className="report-view-container">
      {/* Encabezado con botones */}
      <ReportViewHeader
        title="Inventarios"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={activeFiltersCount}
        onExportXLSX={handleExportXLSX}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <button
            type="button"
            className="btn-amber-action"
            onClick={() => setIsAnalisisModalOpen(true)}
            title="Abrir análisis detallado de inventario"
          >
            <Award size={16} />
            <span>Análisis de Inventario</span>
          </button>
        }
      />

      {/* Barra de Selección de Especies */}
      <SpeciesSelectorBar
        selectedSpecies={selectedSpecies}
        onSelectSpecies={setSelectedSpecies}
        speciesCounts={speciesCounts}
      />

      {/* Fila de 3 Gráficos Donut Dinámicos */}
      <div className="inventories-charts-grid">
        {/* Gráfico 1: Categoría */}
        <div className="inventory-chart-card">
          <div className="chart-card-title">
            {selectedSpecies === 'TODAS'
              ? 'Inventario global por especie'
              : `Inventario ${activeConfig.speciesName.toLowerCase()} por categoría`}
          </div>
          <div className="donut-wrapper-relative">
            <DoughnutChart
              labels={categoryChartData.labels}
              data={categoryChartData.data}
              colors={categoryChartData.colors}
            />
            <div className="donut-center-metric">{totals.total}</div>
          </div>
          <div className="chart-custom-legend">
            {categoryChartData.labels.map((lbl, idx) => (
              <span key={lbl} className="legend-pill">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: categoryChartData.colors[idx] }}
                ></span>
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Gráfico 2: Locación */}
        <div className="inventory-chart-card">
          <div className="chart-card-title">Inventario por locación / lote</div>
          <div className="donut-wrapper-relative">
            <DoughnutChart
              labels={locationChartData.labels}
              data={locationChartData.data}
              colors={locationChartData.colors}
            />
            <div className="donut-center-metric">{totals.total}</div>
          </div>
          <div className="chart-custom-legend">
            {locationChartData.labels.map((lbl, idx) => (
              <span key={lbl} className="legend-pill">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: locationChartData.colors[idx] }}
                ></span>
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Gráfico 3: Estatus */}
        <div className="inventory-chart-card">
          <div className="chart-card-title">Inventario por estatus sanitario</div>
          <div className="donut-wrapper-relative">
            <DoughnutChart
              labels={['Activo']}
              data={[totals.total]}
              colors={['#2d6a4f']}
            />
            <div className="donut-center-metric">{totals.total}</div>
          </div>
          <div className="chart-custom-legend">
            <span className="legend-pill">
              <span className="legend-dot" style={{ backgroundColor: '#2d6a4f' }}></span>
              Activo ({totals.total})
            </span>
          </div>
        </div>
      </div>

      {/* Matriz de Lotes vs Subcategorías Dinámicas */}
      <div className="matrix-table-container">
        <table className="matrix-table">
          <thead>
            <tr>
              {isColVisible('lote') && (
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{activeConfig.loteLabel}</span>
                    <Filter size={13} style={{ color: '#9ca3af' }} />
                  </div>
                </th>
              )}
              {activeConfig.subcategories.map(sub => (
                isColVisible(sub.key) && <th key={sub.key}>{sub.label}</th>
              ))}
              {isColVisible('total') && <th>Total</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <tr key={row.loteCodigo}>
                {isColVisible('lote') && <td>{row.loteNombre}</td>}
                {activeConfig.subcategories.map(sub => (
                  isColVisible(sub.key) && (
                    <td key={sub.key}>
                      {filters.categorias.includes(sub.key) ? (row.values[sub.key] || 0) : 0}
                    </td>
                  )
                ))}
                {isColVisible('total') && (
                  <td style={{ fontWeight: 700 }}>{getRowTotal(row)}</td>
                )}
              </tr>
            ))}

            {/* Fila Total Activos */}
            <tr className="total-active-row">
              {isColVisible('lote') && <td>Total activos</td>}
              {activeConfig.subcategories.map(sub => (
                isColVisible(sub.key) && (
                  <td key={sub.key}>{totals.subTotals[sub.key] || 0}</td>
                )
              ))}
              {isColVisible('total') && <td>{totals.total}</td>}
            </tr>

            {/* Fila Total General */}
            <tr className="total-general-row">
              {isColVisible('lote') && <td>Total</td>}
              {activeConfig.subcategories.map(sub => (
                isColVisible(sub.key) && (
                  <td key={sub.key}>{totals.subTotals[sub.key] || 0}</td>
                )
              ))}
              {isColVisible('total') && <td>{totals.total}</td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Análisis de Inventario */}
      <AnalisisInventarioModal
        isOpen={isAnalisisModalOpen}
        onClose={() => setIsAnalisisModalOpen(false)}
        totalAnimales={totals.total}
      />

      {/* Drawer de Filtros */}
      <InventariosFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        availableLotes={activeConfig.lotes.map(l => ({ codigo: l.loteCodigo, nombre: l.loteNombre }))}
        availableCategorias={activeConfig.subcategories}
        onReset={() =>
          setFilters({
            lotes: activeConfig.lotes.map(l => l.loteCodigo),
            estatus: ['Activo'] as EstatusAnimal[],
            categorias: activeConfig.subcategories.map(s => s.key),
            fechaCorte: new Date().toISOString().split('T')[0]
          })
        }
      />

      {/* Modal de Configuración de Columnas */}
      <ReportSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        columns={columns}
        onToggleColumn={toggleColumn}
        onResetColumns={resetColumns}
      />
    </div>
  );
};
