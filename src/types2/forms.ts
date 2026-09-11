import {
  CategoriaAnimal,
  EstatusAnimal,
  EstatusReproductivo,
  EstatusProductivo,
  TipoPesaje,
  TipoEventoReproductivo,
  MetodoParto,
  TipoOrdeno,
  EstatusPotrero,
  TipoLaborPotrero
} from './common';

/* =========================================================================
 * FORMULARIOS Y FILTROS LATERALES (DRAWERS)
 * ========================================================================= */

/**
 * Filtro para /reports/inventories
 */
export interface FormFiltroInventario {
  hastaFecha?: string; // Formato YYYY-MM-DD o Mes/Año
  estatus?: EstatusAnimal[];
  categorias?: CategoriaAnimal[];
  lotes?: string[];
}

/**
 * Filtro estándar por rango de fechas y rebaño (/reports/movements, /reports/technicians)
 */
export interface FormFiltroRangoFechas {
  desde?: string;
  hasta?: string;
  rebano?: string;
}

/**
 * Filtro para reportes de Vientres y Animales en Producción (/reports/dams, /reports/drycows)
 */
export interface FormFiltroVientres {
  categorias?: ('Novilla' | 'Vaca')[];
  estatus?: EstatusAnimal[];
  estatusReproductivo?: EstatusReproductivo[];
  estatusProductivo?: EstatusProductivo[];
  lotes?: string[];
}

/**
 * Filtro para alertas de próximos eventos (/reports/nexttodry, /reports/nexttobirth, /reports/nexttocheck)
 */
export interface FormFiltroProximas {
  proximosDiasMaximo: number;
  categorias?: ('Novilla' | 'Vaca')[];
  estatus?: EstatusAnimal[];
  lotes?: string[];
}

/**
 * Filtro de animales lactando (/reports/cowsinproduction)
 */
export interface FormFiltroAnimalesLactando {
  diasEnProduccionMaximo?: number;
  estatus?: EstatusAnimal[];
  lotes?: string[];
}

/**
 * Filtro de animales criando (/reports/cowsraising)
 */
export interface FormFiltroAnimalesCriando {
  estatus?: EstatusAnimal[];
  estatusReproductivo?: EstatusReproductivo[];
  lotes?: string[];
}

/**
 * Filtro para animales que no son vientres (/reports/nodams)
 */
export interface FormFiltroNoVientres {
  categorias?: ('Becerra' | 'Mauta' | 'Becerro' | 'Maute' | 'Novillo')[];
  estatus?: EstatusAnimal[];
  lotes?: string[];
}

/**
 * Filtro para el histórico de reproducciones (/reports/historics/reproductions)
 */
export interface FormFiltroReproducciones {
  desde?: string;
  hasta?: string;
  categorias?: ('Novilla' | 'Vaca')[];
  estatus?: EstatusAnimal[];
  tipoEvento?: TipoEventoReproductivo[];
  metodoParto?: MetodoParto[];
  lotes?: string[];
}

/**
 * Filtro para el histórico de curvas de lactancia (/reports/historics/lactations)
 */
export interface FormFiltroLactancias {
  numeroLactancia?: {
    min?: number;
    max?: number;
  };
  desde?: string;
  hasta?: string;
  categorias?: ('Novilla' | 'Vaca')[];
  estatus?: EstatusAnimal[];
  lotes?: string[];
}

/**
 * Filtro para pesajes de leche (/reports/historics/milks)
 */
export interface FormFiltroPesajesLeche {
  numeroLactancia?: {
    min?: number;
    max?: number;
  };
  desde?: string;
  hasta?: string;
  categorias?: ('Novilla' | 'Vaca')[];
  estatus?: EstatusAnimal[];
  tipoOrdeno?: TipoOrdeno[];
  lotes?: string[];
}

/**
 * Filtro para pesajes y crecimientos corporales (/reports/historics/weighings)
 */
export interface FormFiltroCrecimientos {
  rangoPesos?: {
    min?: number;
    max?: number;
  };
  desde?: string;
  hasta?: string;
  categorias?: CategoriaAnimal[];
  estatus?: EstatusAnimal[];
  tiposPesaje?: TipoPesaje[];
  lotes?: string[];
}

/**
 * Formulario de parámetros y criterios para Distribución Normal (/reports/historics/normaldistribution)
 */
export interface FormDistribucionNormal {
  criterio:
    | 'Producción - Promedio días producción'
    | 'Crecimiento - Ganancia diaria de peso'
    | 'Reproducción - Días abiertos'
    | 'Lactancia - Producción a 305 días';
  desde?: string;
  hasta?: string;
  rebano?: string;
  raza?: string;
  padre?: string;
  agruparPor?: 'Lote' | 'Raza' | 'Año' | 'Número de Parto';
}

/* =========================================================================
 * FILTROS PARA POTREROS
 * ========================================================================= */

/**
 * Filtro para catálogo general de potreros (/reports/paddocks)
 */
export interface FormFiltroPotrerosGeneral {
  estatus?: EstatusPotrero[];
  pastosPredominantes?: string[];
  rangoTamanoHa?: { min?: number; max?: number };
}

/**
 * Filtro para labores en potreros (/reports/labors)
 */
export interface FormFiltroLaboresPotrero {
  desde?: string;
  hasta?: string;
  potreros?: string[];
  labores?: (TipoLaborPotrero | string)[];
}

/**
 * Filtro para rotaciones de potreros (/reports/rotations)
 */
export interface FormFiltroRotacionesPotrero {
  desde?: string;
  hasta?: string;
  lotes?: string[];
  potreros?: string[];
}

/**
 * Filtro para planificaciones en potreros (/reports/paddockplans)
 */
export interface FormFiltroPlanificacionesPotrero {
  desde?: string;
  hasta?: string;
  potreros?: string[];
  labores?: (TipoLaborPotrero | string)[];
}

/* =========================================================================
 * FILTROS PARA MULTIREBAÑOS
 * ========================================================================= */

/**
 * Filtro general para reportes consolidados multirebaño
 */
export interface FormFiltroMultirebanos {
  rebanosSeleccionados?: string[];
  desde?: string;
  hasta?: string;
  categorias?: CategoriaAnimal[];
}
