import { KpiCardData, ChartConfig } from '../../types/chart';
import { Animal, EspecieAnimal, ESPECIES_TAXONOMY } from '../../types/animal';
import { matchesEspecie, matchesSubcategoria } from '../animales/useAnimales';

export type DashboardSpeciesFilter = 'global' | EspecieAnimal;

export interface SpeciesTabOption {
  id: DashboardSpeciesFilter;
  label: string;
  name: string;
  icon: string;
}

export const SPECIES_SELECTOR_OPTIONS: SpeciesTabOption[] = [
  { id: 'global', label: '🐾 Visión Global Multiespecie', name: 'Global Multiespecie', icon: '🐾' },
  { id: 'Bovinos', label: '🐮 Bovinos (Vacunos)', name: 'Bovinos (Vacunos)', icon: '🐮' },
  { id: 'Aves de corral', label: '🐔 Aves de corral', name: 'Aves de corral', icon: '🐔' },
  { id: 'Porcinos', label: '🐷 Porcinos', name: 'Porcinos', icon: '🐷' },
  { id: 'Búfalos', label: '🐃 Búfalos', name: 'Búfalos', icon: '🐃' },
  { id: 'Caprinos', label: '🐐 Caprinos', name: 'Caprinos', icon: '🐐' },
  { id: 'Equinos', label: '🐴 Equinos', name: 'Equinos', icon: '🐴' }
];

// AgroGan Color Palette & Thematic Tones
export const PALETTE = {
  primaryDeep: '#095431',
  primaryBrand: '#2D6A4F',
  primaryLight: '#52B788',
  primaryMint: '#74C69D',
  primaryLightMint: '#B7E4C7',
  primaryPale: '#D8F3DC',
  darkForest: '#1B4332',
  terracotta: '#E76F51',
  coralApricot: '#F4A261',
  amberGold: '#E9C46A',
  earthBrown: '#8D6E63',
  siennaChestnut: '#A0522D',
  blueIndigo: '#3B82F6',
  slateGray: '#64748B',
  softGray: '#9CA3AF',
  lightGray: '#E5E7EB'
};

/* =========================================================================
 * HELPER CALCULATIONS
 * ========================================================================= */

// Helper to determine if an animal is in ceba/engorde
export const isAnimalInCeba = (a: Animal): boolean => {
  const text = `${a.categoria} ${a.subcategoria || ''} ${a.estatusProductivo || ''} ${a.etiquetas || ''}`.toLowerCase();
  return text.includes('ceba') || text.includes('engorde') || text.includes('maute') || text.includes('terminaci');
};

// Helper to estimate daily milk production for dairy animals
export const getEstimatedAnimalMilkLiters = (a: Animal): number => {
  if (a.estatus !== 'Activo') return 0;
  
  const isDairy = ['Bovinos', 'Búfalos', 'Caprinos'].includes(a.especie || '');
  if (!isDairy) return 0;

  const isMilking = a.estatusProductivo === 'Ordeño' || 
    (a.etiquetas && a.etiquetas.toLowerCase().includes('ordeño')) ||
    a.categoria === 'Cabras Lecheras' ||
    a.subcategoria === 'Cabras Lecheras';

  if (!isMilking) return 0;

  if (a.ultimoPesajeLeche && a.ultimoPesajeLeche > 0) {
    return a.ultimoPesajeLeche;
  }

  // Check etiquetas for parsed value like "8.5 L/d" or "3.8 L/d"
  if (a.etiquetas) {
    const match = a.etiquetas.match(/(\d+(?:\.\d+)?)\s*(?:l\/d|litros|l\/día)/i);
    if (match) return parseFloat(match[1]);
  }

  // Fallbacks by species standards for milking animals
  if (a.especie === 'Bovinos') return 16.5;
  if (a.especie === 'Búfalos') return 8.0;
  if (a.especie === 'Caprinos') return 3.8;

  return 0;
};

// Helper to classify an animal into its primary zootechnic purpose
export const getFinalidadZootecnica = (a: Animal): 'Leche' | 'Carne / Ceba' | 'Postura' | 'Recría' | 'Trabajo / Semental' => {
  const text = `${a.categoria} ${a.subcategoria || ''} ${a.estatusProductivo || ''} ${a.etiquetas || ''}`.toLowerCase();
  
  if (text.includes('postura') || text.includes('huevo') || text.includes('ponedora')) {
    return 'Postura';
  }
  if (text.includes('ordeño') || text.includes('leche') || text.includes('lechera') || text.includes('lact')) {
    return 'Leche';
  }
  if (isAnimalInCeba(a)) {
    return 'Carne / Ceba';
  }
  if (
    text.includes('reemplazo') || text.includes('levante') || text.includes('recría') || text.includes('recria') ||
    text.includes('novilla') || text.includes('becerr') || text.includes('bubilla') || text.includes('bucerr') ||
    text.includes('lechón') || text.includes('lechon') || text.includes('pollon') || text.includes('pollit') ||
    text.includes('cabrit') || text.includes('potr') || text.includes('cría') || text.includes('iniciaci')
  ) {
    return 'Recría';
  }
  return 'Trabajo / Semental';
};

/* =========================================================================
 * 1. VISIÓN GLOBAL MULTIESPECIE
 * ========================================================================= */

export const calculateGlobalDashboard = (animals: Animal[]): { kpis: KpiCardData[]; charts: ChartConfig[] } => {
  const totalAnimals = animals.length;
  const activeAnimals = animals.filter(a => a.estatus === 'Activo');
  const activeCount = activeAnimals.length;
  const inactiveCount = totalAnimals - activeCount;

  // 1. Censo Total de Semovientes
  const kpiCenso: KpiCardData = {
    value: `${totalAnimals.toLocaleString('es-ES')}`,
    subtitle: `Semovientes registrados (${activeCount} activos)`,
    iconType: 'census'
  };

  // 2. Especies Productivas activas
  const activeSpeciesSet = new Set(
    activeAnimals
      .map(a => a.especie)
      .filter((sp): sp is EspecieAnimal => !!sp && sp in ESPECIES_TAXONOMY)
  );
  const activeSpeciesCount = activeSpeciesSet.size;
  const kpiEspecies: KpiCardData = {
    value: `${activeSpeciesCount} especies`,
    subtitle: 'Líneas zootécnicas en producción',
    iconType: 'species'
  };

  // 3. Producción Láctea Total Estimada (L/día combinando vacas, búfalas y cabras)
  const milkAnimals = activeAnimals.filter(a => ['Bovinos', 'Búfalos', 'Caprinos'].includes(a.especie || ''));
  let totalMilkLiters = 0;
  let cowMilk = 0;
  let bufalaMilk = 0;
  let goatMilk = 0;

  milkAnimals.forEach(a => {
    const liters = getEstimatedAnimalMilkLiters(a);
    if (liters > 0) {
      totalMilkLiters += liters;
      if (a.especie === 'Bovinos') cowMilk += liters;
      else if (a.especie === 'Búfalos') bufalaMilk += liters;
      else if (a.especie === 'Caprinos') goatMilk += liters;
    }
  });

  const kpiLeche: KpiCardData = {
    value: `${Math.round(totalMilkLiters).toLocaleString('es-ES')} L/día`,
    subtitle: `Vacas (${Math.round(cowMilk)}L) • Búfalas (${Math.round(bufalaMilk)}L) • Cabras (${Math.round(goatMilk)}L)`,
    iconType: 'milk-bucket'
  };

  // 4. Producción Avícola Diaria (Huevos/día de aves ponedoras)
  const ponedoras = activeAnimals.filter(a => 
    matchesEspecie(a, 'Aves de corral') &&
    (a.subcategoria === 'Gallinas Ponedoras' || 
     a.categoria === 'Gallinas Ponedoras' || 
     a.estatusProductivo === 'Postura Alta' || 
     (a.etiquetas && a.etiquetas.toLowerCase().includes('postura')))
  );

  let totalDailyEggs = 0;
  let totalRatePct = 0;
  ponedoras.forEach(p => {
    let rate = 0.92;
    if (p.etiquetas) {
      const match = p.etiquetas.match(/postura\s*(\d+)%/i);
      if (match) rate = parseFloat(match[1]) / 100;
    }
    totalRatePct += rate * 100;
    totalDailyEggs += rate;
  });

  const avgPosturePct = ponedoras.length > 0 ? Math.round(totalRatePct / ponedoras.length) : 0;
  const kpiAves: KpiCardData = {
    value: `${Math.round(totalDailyEggs).toLocaleString('es-ES')} huevos/día`,
    subtitle: `${ponedoras.length} ponedoras (${avgPosturePct}% postura media)`,
    iconType: 'egg'
  };

  // 5. Semovientes en Ceba / Engorde
  const cebaAnimals = activeAnimals.filter(isAnimalInCeba);
  const kpiCeba: KpiCardData = {
    value: `${cebaAnimals.length} cabezas`,
    subtitle: 'Pollos engorde, cerdos ceba, mautes y caprinos',
    iconType: 'scale-male'
  };

  // CHARTS FOR GLOBAL VIEW
  // Chart 1: Distribución del Censo por Especie
  const speciesKeys: EspecieAnimal[] = [
    'Bovinos',
    'Aves de corral',
    'Porcinos',
    'Búfalos',
    'Caprinos',
    'Equinos'
  ];

  const speciesLabels: string[] = [];
  const speciesData: number[] = [];
  const speciesColors: string[] = [
    PALETTE.primaryBrand,    // Bovinos: Dark Green
    PALETTE.terracotta,      // Aves: Coral Terracotta
    PALETTE.coralApricot,    // Porcinos: Soft Apricot
    PALETTE.darkForest,      // Búfalos: Hunter Deep Green
    PALETTE.primaryLight,    // Caprinos: Fresh Green
    PALETTE.siennaChestnut   // Equinos: Chestnut Brown
  ];

  speciesKeys.forEach(sp => {
    const count = animals.filter(a => matchesEspecie(a, sp)).length;
    speciesLabels.push(sp);
    speciesData.push(count);
  });

  const chartEspecie: ChartConfig = {
    title: 'Distribución del Censo por Especie',
    centerLabel: 'Semovientes',
    centerValue: totalAnimals,
    labels: speciesLabels,
    data: speciesData,
    colors: speciesColors
  };

  // Chart 2: Distribución por Finalidad Zootécnica
  const finalidadCounts: Record<string, number> = {
    'Leche': 0,
    'Carne / Ceba': 0,
    'Postura': 0,
    'Recría': 0,
    'Trabajo / Semental': 0
  };

  animals.forEach(a => {
    const fin = getFinalidadZootecnica(a);
    finalidadCounts[fin] = (finalidadCounts[fin] || 0) + 1;
  });

  const chartFinalidad: ChartConfig = {
    title: 'Distribución por Finalidad Zootécnica',
    centerLabel: 'Propósito',
    centerValue: totalAnimals,
    labels: ['Leche', 'Carne / Ceba', 'Postura', 'Recría', 'Trabajo / Semental'],
    data: [
      finalidadCounts['Leche'],
      finalidadCounts['Carne / Ceba'],
      finalidadCounts['Postura'],
      finalidadCounts['Recría'],
      finalidadCounts['Trabajo / Semental']
    ],
    colors: [
      PALETTE.primaryBrand,
      PALETTE.coralApricot,
      PALETTE.terracotta,
      PALETTE.primaryLight,
      PALETTE.slateGray
    ]
  };

  // Chart 3: Estatus Operativo Global
  const chartEstatus: ChartConfig = {
    title: 'Estatus Operativo Global',
    centerLabel: 'Total',
    centerValue: totalAnimals,
    labels: ['Activos', 'Inactivos'],
    data: [activeCount, inactiveCount],
    colors: [PALETTE.primaryDeep, PALETTE.softGray]
  };

  return {
    kpis: [kpiCenso, kpiEspecies, kpiLeche, kpiAves, kpiCeba],
    charts: [chartEspecie, chartFinalidad, chartEstatus]
  };
};

/* =========================================================================
 * 2. CÁLCULOS ESPECÍFICOS POR ESPECIE
 * ========================================================================= */

export const calculateSpeciesDashboard = (
  species: EspecieAnimal,
  animals: Animal[]
): { kpis: KpiCardData[]; charts: ChartConfig[] } => {
  const speciesAnimals = animals.filter(a => matchesEspecie(a, species));
  const activeAnimals = speciesAnimals.filter(a => a.estatus === 'Activo');
  const taxonomy = ESPECIES_TAXONOMY[species];
  const subcategories = taxonomy ? taxonomy.subcategorias : [];

  // Chart 1: Subcategory distribution
  const subcatLabels: string[] = [];
  const subcatData: number[] = [];
  const baseColors = [
    PALETTE.primaryBrand,
    PALETTE.primaryLight,
    PALETTE.primaryMint,
    PALETTE.primaryLightMint,
    PALETTE.darkForest,
    PALETTE.terracotta,
    PALETTE.coralApricot,
    PALETTE.siennaChestnut
  ];

  subcategories.forEach(subcat => {
    const count = speciesAnimals.filter(a => matchesSubcategoria(a, subcat)).length;
    subcatLabels.push(subcat);
    subcatData.push(count);
  });

  const chartSubcategorias: ChartConfig = {
    title: `Inventario ${species}: Subcategorías`,
    centerLabel: 'Ejemplares',
    centerValue: speciesAnimals.length,
    labels: subcatLabels,
    data: subcatData,
    colors: baseColors.slice(0, subcatLabels.length)
  };

  // Switch by species to compute exact specialized KPIs and secondary charts
  switch (species) {
    case 'Bovinos': {
      // 1. Vacas ordeño
      const vacasOrdeño = activeAnimals.filter(a => 
        matchesSubcategoria(a, 'Vacas') && (a.estatusProductivo === 'Ordeño' || (a.etiquetas && a.etiquetas.toLowerCase().includes('ordeño')))
      );
      // 2. Vacas secas
      const vacasSecas = activeAnimals.filter(a => 
        matchesSubcategoria(a, 'Vacas') && (a.estatusProductivo === 'Seca' || (a.etiquetas && a.etiquetas.toLowerCase().includes('seca')))
      );
      // 3. Promedio leche
      let totalBovinoMilk = 0;
      vacasOrdeño.forEach(v => { totalBovinoMilk += getEstimatedAnimalMilkLiters(v); });
      const avgBovinoMilk = vacasOrdeño.length > 0 ? (totalBovinoMilk / vacasOrdeño.length).toFixed(1) : '0';
      // 4. GDP medio estimado
      const gdpValue = '0,512 kg/d';
      // 5. Recría y Levante
      const recriaBovinos = activeAnimals.filter(a => 
        matchesSubcategoria(a, 'Novillas') || matchesSubcategoria(a, 'Mautas / Mautes') || matchesSubcategoria(a, 'Becerros / Becerras')
      );

      const kpis: KpiCardData[] = [
        {
          value: `${vacasOrdeño.length} vacas`,
          subtitle: 'Vacas en ordeño activo',
          iconType: 'milk-bucket'
        },
        {
          value: `${vacasSecas.length} vacas`,
          subtitle: 'Vacas en periodo seco',
          iconType: 'scale-female'
        },
        {
          value: `${avgBovinoMilk} L/vaca`,
          subtitle: `Total hato: ${Math.round(totalBovinoMilk)} L/día estimados`,
          iconType: 'milk-bucket'
        },
        {
          value: gdpValue,
          subtitle: 'Ganancia diaria ponderal estimada',
          iconType: 'weight-maute'
        },
        {
          value: `${recriaBovinos.length} cabezas`,
          subtitle: 'Novillas, mautas y becerros en recría',
          iconType: 'baby'
        }
      ];

      // Chart 2: Situación Reproductiva
      const repCounts: Record<string, number> = { 'Preñada': 0, 'Vacía': 0, 'En espera': 0, 'Sementales': 0 };
      speciesAnimals.forEach(a => {
        if (matchesSubcategoria(a, 'Toros')) repCounts['Sementales']++;
        else if (a.estatusReproductivo === 'Preñada') repCounts['Preñada']++;
        else if (a.estatusReproductivo === 'Vacía') repCounts['Vacía']++;
        else repCounts['En espera']++;
      });

      const chartReproductiva: ChartConfig = {
        title: 'Situación Reproductiva Actual',
        centerLabel: 'Vientres',
        centerValue: speciesAnimals.length,
        labels: ['Preñada', 'Vacía', 'En espera', 'Sementales'],
        data: [repCounts['Preñada'], repCounts['Vacía'], repCounts['En espera'], repCounts['Sementales']],
        colors: [PALETTE.darkForest, PALETTE.primaryLight, PALETTE.primaryMint, PALETTE.slateGray]
      };

      // Chart 3: Situación Productiva
      const prodCounts: Record<string, number> = { 'Ordeño': 0, 'Seca': 0, 'Recría / Levante': 0, 'Ceba / Padrote': 0 };
      speciesAnimals.forEach(a => {
        if (a.estatusProductivo === 'Ordeño' || a.etiquetas?.toLowerCase().includes('ordeño')) prodCounts['Ordeño']++;
        else if (a.estatusProductivo === 'Seca' || a.etiquetas?.toLowerCase().includes('seca')) prodCounts['Seca']++;
        else if (matchesSubcategoria(a, 'Novillas') || matchesSubcategoria(a, 'Mautas / Mautes') || matchesSubcategoria(a, 'Becerros / Becerras')) prodCounts['Recría / Levante']++;
        else prodCounts['Ceba / Padrote']++;
      });

      const chartProductiva: ChartConfig = {
        title: 'Situación Productiva Actual',
        centerLabel: 'Bovinos',
        centerValue: speciesAnimals.length,
        labels: ['Ordeño', 'Seca', 'Recría / Levante', 'Ceba / Padrote'],
        data: [prodCounts['Ordeño'], prodCounts['Seca'], prodCounts['Recría / Levante'], prodCounts['Ceba / Padrote']],
        colors: [PALETTE.primaryBrand, PALETTE.primaryMint, PALETTE.primaryLight, PALETTE.terracotta]
      };

      return { kpis, charts: [chartSubcategorias, chartReproductiva, chartProductiva] };
    }

    case 'Aves de corral': {
      const ponedoras = activeAnimals.filter(a => 
        matchesSubcategoria(a, 'Gallinas Ponedoras') || a.estatusProductivo === 'Postura Alta' || a.etiquetas?.toLowerCase().includes('postura')
      );
      const engorde = activeAnimals.filter(a => 
        matchesSubcategoria(a, 'Pollos de Engorde') || a.estatusProductivo === 'Ceba' || a.etiquetas?.toLowerCase().includes('ceba')
      );
      const recria = activeAnimals.filter(a => 
        matchesSubcategoria(a, 'Pollonas / Pollitos') || matchesSubcategoria(a, 'Pavitos / Patitos')
      );

      let postureRateSum = 0;
      ponedoras.forEach(p => {
        let r = 94;
        const match = p.etiquetas && p.etiquetas.match(/postura\s*(\d+)%/i);
        if (match) r = parseFloat(match[1]);
        postureRateSum += r;
      });
      const avgPosture = ponedoras.length > 0 ? (postureRateSum / ponedoras.length).toFixed(1) : '0';

      // Est. feed consumption: ~115g/layer, ~160g/broiler, ~250g turkey/duck, ~60g chick
      let totalFeedKg = 0;
      activeAnimals.forEach(a => {
        if (matchesSubcategoria(a, 'Gallinas Ponedoras')) totalFeedKg += 0.115;
        else if (matchesSubcategoria(a, 'Pollos de Engorde')) totalFeedKg += 0.160;
        else if (matchesSubcategoria(a, 'Pavos / Pavas') || matchesSubcategoria(a, 'Patos / Patas')) totalFeedKg += 0.250;
        else totalFeedKg += 0.080;
      });

      const kpis: KpiCardData[] = [
        {
          value: `${avgPosture}%`,
          subtitle: 'Tasa media de postura comercial',
          iconType: 'egg'
        },
        {
          value: `${ponedoras.length} aves`,
          subtitle: 'Aves en postura activa de huevo',
          iconType: 'egg'
        },
        {
          value: `${engorde.length} pollos`,
          subtitle: 'Pollos en engorde / ceba intensiva',
          iconType: 'meat'
        },
        {
          value: `${totalFeedKg.toFixed(1)} kg/d`,
          subtitle: 'Consumo de alimento balanceado estimado',
          iconType: 'wheat'
        },
        {
          value: `${speciesAnimals.length} aves`,
          subtitle: `${recria.length} crías • ${speciesAnimals.length - ponedoras.length - engorde.length - recria.length} reproductores`,
          iconType: 'feather'
        }
      ];

      // Chart 2: Línea Productiva
      const lineCounts = { 'Postura Comercial': ponedoras.length, 'Ceba Broiler': engorde.length, 'Cría y Levante': recria.length, 'Aves Especiales / Finas': speciesAnimals.length - ponedoras.length - engorde.length - recria.length };
      const chartLineas: ChartConfig = {
        title: 'Distribución por Línea de Explotación',
        centerLabel: 'Aves',
        centerValue: speciesAnimals.length,
        labels: ['Postura Comercial', 'Ceba Broiler', 'Cría y Levante', 'Aves Especiales / Finas'],
        data: [lineCounts['Postura Comercial'], lineCounts['Ceba Broiler'], lineCounts['Cría y Levante'], lineCounts['Aves Especiales / Finas']],
        colors: [PALETTE.terracotta, PALETTE.coralApricot, PALETTE.primaryLight, PALETTE.primaryBrand]
      };

      // Chart 3: Rango de Peso
      let livianas = 0;
      let medianas = 0;
      let pesadas = 0;
      speciesAnimals.forEach(a => {
        const peso = a.pesoKg || 1.5;
        if (peso < 1.0) livianas++;
        else if (peso <= 3.0) medianas++;
        else pesadas++;
      });

      const chartPesos: ChartConfig = {
        title: 'Estratificación por Rango de Peso',
        centerLabel: 'Galpones',
        centerValue: speciesAnimals.length,
        labels: ['Iniciación (< 1 kg)', 'Medianas (1.0 - 3.0 kg)', 'Pesadas (> 3.0 kg)'],
        data: [livianas, medianas, pesadas],
        colors: [PALETTE.primaryMint, PALETTE.primaryBrand, PALETTE.siennaChestnut]
      };

      return { kpis, charts: [chartSubcategorias, chartLineas, chartPesos] };
    }

    case 'Porcinos': {
      const cerdasRepro = activeAnimals.filter(a => matchesSubcategoria(a, 'Cerdas Reproductoras'));
      const verracos = activeAnimals.filter(a => matchesSubcategoria(a, 'Verracos'));
      const lechones = activeAnimals.filter(a => matchesSubcategoria(a, 'Lechones'));
      const cerdosCeba = activeAnimals.filter(a => matchesSubcategoria(a, 'Cerdos de Ceba'));
      const reemplazo = activeAnimals.filter(a => matchesSubcategoria(a, 'Cerdas de Reemplazo'));

      const kpis: KpiCardData[] = [
        {
          value: `${cerdasRepro.length} cerdas`,
          subtitle: 'Cerdas reproductoras en piara',
          iconType: 'pig'
        },
        {
          value: `${lechones.length} lechones`,
          subtitle: 'Lechones en lactancia / destete',
          iconType: 'baby'
        },
        {
          value: `${cerdosCeba.length} cerdos`,
          subtitle: 'Cerdos en ceba terminal',
          iconType: 'meat'
        },
        {
          value: `${verracos.length} verracos`,
          subtitle: 'Padrillos terminales (Pietrain/Duroc)',
          iconType: 'scale-male'
        },
        {
          value: '0,850 kg/d',
          subtitle: 'Ganancia diaria media (GDP ceba)',
          iconType: 'weight-maute'
        }
      ];

      // Chart 2: Estado Reproductivo y Fisiológico
      let lactando = 0;
      let gestando = 0;
      let reemplazosCount = reemplazo.length;
      let padrotesCount = verracos.length;
      let cebaCount = cerdosCeba.length + lechones.length;

      cerdasRepro.forEach(c => {
        if (c.estatusReproductivo === 'Lactando') lactando++;
        else gestando++;
      });

      const chartFisiologico: ChartConfig = {
        title: 'Situación Fisiológica de la Piara',
        centerLabel: 'Piara',
        centerValue: speciesAnimals.length,
        labels: ['Maternidad (Lactando)', 'Gestación Confirmada', 'Ceba y Crecimiento', 'Sementales y Reemplazo'],
        data: [lactando, gestando, cebaCount, padrotesCount + reemplazosCount],
        colors: [PALETTE.terracotta, PALETTE.primaryBrand, PALETTE.coralApricot, PALETTE.primaryLight]
      };

      // Chart 3: Líneas Genéticas
      const chartGenetica: ChartConfig = {
        title: 'Composición Racial y Genética',
        centerLabel: 'Líneas',
        centerValue: speciesAnimals.length,
        labels: ['Maternal F1 (Landrace/Large White)', 'Pietrain Terminal', 'Duroc Cárnico'],
        data: [
          cerdasRepro.length + reemplazo.length,
          speciesAnimals.filter(a => a.racial?.includes('Pietrain')).length || 1,
          speciesAnimals.filter(a => a.racial?.includes('Duroc')).length || 1
        ],
        colors: [PALETTE.primaryBrand, PALETTE.darkForest, PALETTE.coralApricot]
      };

      return { kpis, charts: [chartSubcategorias, chartFisiologico, chartGenetica] };
    }

    case 'Búfalos': {
      const bufalas = activeAnimals.filter(a => matchesSubcategoria(a, 'Búfalas'));
      const bufalasOrdeño = bufalas.filter(b => b.estatusProductivo === 'Ordeño' || b.etiquetas?.toLowerCase().includes('ordeño'));
      const bubillas = activeAnimals.filter(a => matchesSubcategoria(a, 'Bubillas'));
      const bucerros = activeAnimals.filter(a => matchesSubcategoria(a, 'Bucerros / Bucerras'));
      const cebaPadrotes = activeAnimals.filter(a => matchesSubcategoria(a, 'Padrotes / Búfalos de Ceba'));

      let totalBufalaMilk = 0;
      bufalasOrdeño.forEach(b => { totalBufalaMilk += getEstimatedAnimalMilkLiters(b); });

      const kpis: KpiCardData[] = [
        {
          value: `${bufalasOrdeño.length} búfalas`,
          subtitle: 'Búfalas en ordeño activo',
          iconType: 'milk-bucket'
        },
        {
          value: `${totalBufalaMilk.toFixed(1)} L/d`,
          subtitle: 'Producción láctea bufalina (Grasa ~7.8%)',
          iconType: 'milk-bucket'
        },
        {
          value: `${bubillas.length + bucerros.length} crías`,
          subtitle: 'Bubillas de reemplazo y bucerros',
          iconType: 'baby'
        },
        {
          value: `${cebaPadrotes.length} cabezas`,
          subtitle: 'Padrotes y ceba en pasto húmedo',
          iconType: 'meat'
        },
        {
          value: `${speciesAnimals.length} búfalos`,
          subtitle: 'Censo bufalino total adaptado',
          iconType: 'census'
        }
      ];

      // Chart 2: Situación Reproductiva
      let preñadas = 0;
      let vacias = 0;
      let servicio = 0;
      speciesAnimals.forEach(a => {
        if (a.estatusReproductivo === 'Preñada') preñadas++;
        else if (a.estatusReproductivo === 'Vacía') vacias++;
        else servicio++;
      });

      const chartReproductivaBufalos: ChartConfig = {
        title: 'Situación Reproductiva Bufalina',
        centerLabel: 'Búfalos',
        centerValue: speciesAnimals.length,
        labels: ['Preñadas', 'Vacías', 'En servicio / Juveniles'],
        data: [preñadas, vacias, servicio],
        colors: [PALETTE.darkForest, PALETTE.primaryLight, PALETTE.primaryMint]
      };

      // Chart 3: Destino Zootécnico
      const chartAptitudBufalos: ChartConfig = {
        title: 'Aptitud Zootécnica en Humedales',
        centerLabel: 'Propósito',
        centerValue: speciesAnimals.length,
        labels: ['Ordeño Mozzarella', 'Ceba Rústica en Sabana', 'Recría y Levante'],
        data: [bufalas.length, cebaPadrotes.length, bubillas.length + bucerros.length],
        colors: [PALETTE.primaryBrand, PALETTE.coralApricot, PALETTE.primaryLight]
      };

      return { kpis, charts: [chartSubcategorias, chartReproductivaBufalos, chartAptitudBufalos] };
    }

    case 'Caprinos': {
      const cabrasLecheras = activeAnimals.filter(a => matchesSubcategoria(a, 'Cabras Lecheras'));
      const cabrasOrdeño = cabrasLecheras.filter(c => c.estatusProductivo === 'Ordeño' || c.etiquetas?.toLowerCase().includes('ordeño'));
      const cabritos = activeAnimals.filter(a => matchesSubcategoria(a, 'Cabritonas / Cabritos'));
      const chivos = activeAnimals.filter(a => matchesSubcategoria(a, 'Chivos Reproductores'));
      const cebaCaprina = activeAnimals.filter(a => matchesSubcategoria(a, 'Caprinos de Ceba'));

      let totalCabraMilk = 0;
      cabrasOrdeño.forEach(c => { totalCabraMilk += getEstimatedAnimalMilkLiters(c); });

      const kpis: KpiCardData[] = [
        {
          value: `${cabrasOrdeño.length} cabras`,
          subtitle: 'Cabras lecheras en ordeño',
          iconType: 'milk-bucket'
        },
        {
          value: `${totalCabraMilk.toFixed(1)} L/d`,
          subtitle: 'Producción láctea caprina diaria',
          iconType: 'milk-bucket'
        },
        {
          value: `${cabritos.length} crías`,
          subtitle: 'Cabritonas y cabritos en aprisco',
          iconType: 'baby'
        },
        {
          value: `${cebaCaprina.length} caprinos`,
          subtitle: 'Terminación cárnica (Boer)',
          iconType: 'meat'
        },
        {
          value: `${chivos.length} chivos`,
          subtitle: 'Chivos sementales Boer y Alpino',
          iconType: 'scale-male'
        }
      ];

      // Chart 2: Destino Productivo del Aprisco
      const chartDestinoCaprino: ChartConfig = {
        title: 'Destino Productivo del Aprisco',
        centerLabel: 'Aprisco',
        centerValue: speciesAnimals.length,
        labels: ['Leche (Alpina / Saanen)', 'Carne (Boer Ceba)', 'Cría y Levante', 'Sementales'],
        data: [cabrasLecheras.length, cebaCaprina.length, cabritos.length, chivos.length],
        colors: [PALETTE.primaryBrand, PALETTE.coralApricot, PALETTE.primaryLight, PALETTE.darkForest]
      };

      // Chart 3: Situación Reproductiva
      let prepCap = 0;
      let vacCap = 0;
      let srvCap = 0;
      speciesAnimals.forEach(a => {
        if (a.estatusReproductivo === 'Preñada') prepCap++;
        else if (a.estatusReproductivo === 'Vacía') vacCap++;
        else srvCap++;
      });

      const chartReproductivaCaprina: ChartConfig = {
        title: 'Situación Reproductiva en Aprisco',
        centerLabel: 'Vientres',
        centerValue: speciesAnimals.length,
        labels: ['Preñadas', 'Vacías', 'Cubrición / Crecimiento'],
        data: [prepCap, vacCap, srvCap],
        colors: [PALETTE.primaryBrand, PALETTE.primaryLight, PALETTE.primaryMint]
      };

      return { kpis, charts: [chartSubcategorias, chartDestinoCaprino, chartReproductivaCaprina] };
    }

    case 'Equinos': {
      const yeguas = activeAnimals.filter(a => matchesSubcategoria(a, 'Yeguas'));
      const potros = activeAnimals.filter(a => matchesSubcategoria(a, 'Potros / Potrancas'));
      const caballos = activeAnimals.filter(a => matchesSubcategoria(a, 'Caballos'));
      const padrillos = activeAnimals.filter(a => matchesSubcategoria(a, 'Padrillos / Sementales'));

      const kpis: KpiCardData[] = [
        {
          value: `${caballos.length} caballos`,
          subtitle: 'Caballos de vaquería y faena de campo',
          iconType: 'horse'
        },
        {
          value: `${yeguas.length} yeguas`,
          subtitle: 'Yeguas reproductoras y matrices',
          iconType: 'scale-female'
        },
        {
          value: `${potros.length} potros`,
          subtitle: 'Potros en picadero y amansamiento',
          iconType: 'baby'
        },
        {
          value: `${padrillos.length} padrillos`,
          subtitle: 'Sementales Paso Fino y Quarter Horse',
          iconType: 'scale-male'
        },
        {
          value: `${speciesAnimals.length} equinos`,
          subtitle: 'Plantel equino total en caballerizas',
          iconType: 'census'
        }
      ];

      // Chart 2: Aptitud y Función
      const chartAptitudEquina: ChartConfig = {
        title: 'Aptitud y Función del Plantel',
        centerLabel: 'Caballeriza',
        centerValue: speciesAnimals.length,
        labels: ['Vaquería y Trabajo', 'Cría y Genética', 'Doma y Picadero', 'Padrillos'],
        data: [caballos.length, yeguas.length, potros.length, padrillos.length],
        colors: [PALETTE.siennaChestnut, PALETTE.primaryBrand, PALETTE.coralApricot, PALETTE.darkForest]
      };

      // Chart 3: Estado Reproductivo
      let preñadasEq = 0;
      let vaciasEq = 0;
      let machosEq = caballos.length + padrillos.length;
      yeguas.forEach(y => {
        if (y.estatusReproductivo === 'Preñada') preñadasEq++;
        else vaciasEq++;
      });

      const chartReproductivaEquina: ChartConfig = {
        title: 'Estado Reproductivo de Yeguas',
        centerLabel: 'Yeguas',
        centerValue: speciesAnimals.length,
        labels: ['Yeguas Gestantes', 'Yeguas Vacías', 'Potros / Machos'],
        data: [preñadasEq, vaciasEq, potros.length + machosEq],
        colors: [PALETTE.darkForest, PALETTE.primaryMint, PALETTE.siennaChestnut]
      };

      return { kpis, charts: [chartSubcategorias, chartAptitudEquina, chartReproductivaEquina] };
    }

    default: {
      // Generic fallback for any other species
      const kpis: KpiCardData[] = [
        {
          value: `${speciesAnimals.length} ejemplares`,
          subtitle: `Censo total de ${species}`,
          iconType: 'census'
        },
        {
          value: `${activeAnimals.length} activos`,
          subtitle: 'Ejemplares en producción activa',
          iconType: 'activity'
        },
        {
          value: `${subcatLabels.length} grupos`,
          subtitle: 'Subcategorías registradas',
          iconType: 'species'
        },
        {
          value: `${activeAnimals.filter(isAnimalInCeba).length} ceba`,
          subtitle: 'Ejemplares en ceba/engorde',
          iconType: 'scale-male'
        }
      ];

      const chartGenerico: ChartConfig = {
        title: `Estado Operativo: ${species}`,
        centerLabel: 'Total',
        centerValue: speciesAnimals.length,
        labels: ['Activos', 'Inactivos'],
        data: [activeAnimals.length, speciesAnimals.length - activeAnimals.length],
        colors: [PALETTE.primaryBrand, PALETTE.softGray]
      };

      return { kpis, charts: [chartSubcategorias, chartGenerico] };
    }
  }
};

/* =========================================================================
 * UNIFIED ENTRYPOINT
 * ========================================================================= */

export const calculateDashboardData = (
  animals: Animal[],
  filter: DashboardSpeciesFilter
): { kpis: KpiCardData[]; charts: ChartConfig[] } => {
  if (filter === 'global') {
    return calculateGlobalDashboard(animals);
  }
  return calculateSpeciesDashboard(filter, animals);
};

/* =========================================================================
 * BACKWARDS COMPATIBILITY STATIC EXPORTS
 * ========================================================================= */

export const KPI_CARDS: KpiCardData[] = [
  {
    value: "2,899 kg",
    subtitle: "Promedio diario Última Lactancia",
    iconType: 'milk-bucket'
  },
  {
    value: "0,503 kg",
    subtitle: "Ganancia global de peso Hembras",
    iconType: 'scale-female'
  },
  {
    value: "0,335 kg",
    subtitle: "Ganancia global de peso Machos",
    iconType: 'scale-male'
  },
  {
    value: "0,211 kg",
    subtitle: "Ganancia global de peso Maute",
    iconType: 'weight-maute'
  }
];

export const CHART_1_INVENTARIO: ChartConfig = {
  title: "Inventario Actual",
  centerLabel: "Semovientes",
  centerValue: 45,
  labels: ["Becerra", "Mauta", "Novilla", "Vaca", "Becerro", "Maute", "Toro"],
  data: [17, 7, 3, 2, 8, 5, 3],
  colors: [
    "#74c69d",
    "#b7e4c7",
    "#d8f3dc",
    "#5c3d2e",
    "#1b4332",
    "#2d6a4f",
    "#40916c"
  ]
};

export const CHART_2_REPRODUCTIVA: ChartConfig = {
  title: "Situación reproductiva actual",
  centerLabel: "Vientres",
  centerValue: 20,
  labels: ["Vacía", "Preñada", "En espera"],
  data: [2, 15, 3],
  colors: [
    "#40916c",
    "#1b4332",
    "#74c69d"
  ]
};

export const CHART_3_PRODUCTIVA: ChartConfig = {
  title: "Situación productiva actual",
  centerLabel: "Vacas",
  centerValue: 17,
  labels: ["Seca", "Ordeño", "Criando"],
  data: [6, 7, 4],
  colors: [
    "#52b788",
    "#2d6a4f",
    "#1b4332"
  ]
};
