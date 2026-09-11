/**
 * Tipos literales para las rutas del sistema y Centro de Reportes
 */

export type RutasCentroReportes = '/reports' | '/reports/allreports';

export type RutasGestion =
  | '/reports/inventories'
  | '/reports/movements'
  | '/reports/historics/normaldistribution'
  | '/reports/technicians'
  | '/reports/breeders';

export type RutasAnimales =
  | '/reports/dams'
  | '/reports/nexttodry'
  | '/reports/nexttobirth'
  | '/reports/nexttocheck'
  | '/reports/drycows'
  | '/reports/cowsinproduction'
  | '/reports/cowsraising'
  | '/reports/nodams';

export type RutasHistoricos =
  | '/reports/historics/reproductions'
  | '/reports/historics/lactations'
  | '/reports/historics/milks'
  | '/reports/historics/weighings';

export type RutasPotreros =
  | '/reports/paddocks'
  | '/reports/labors'
  | '/reports/rotations'
  | '/reports/paddockplans';

export type RutasMultirebanos =
  | '/reports/multiherds/inventories'
  | '/reports/multiherds/reproduction'
  | '/reports/multiherds/pregnancy-distribution'
  | '/reports/multiherds/production-status'
  | '/reports/multiherds/transactions'
  | '/reports/multiherds/daily-production';

/**
 * Unión de todos los literales de rutas de reportes y navegación
 */
export type Rutas =
  | RutasCentroReportes
  | RutasGestion
  | RutasAnimales
  | RutasHistoricos
  | RutasPotreros
  | RutasMultirebanos;
