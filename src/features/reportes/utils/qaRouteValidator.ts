import { REPORT_CATEGORIES, REPORT_METADATA_MAP } from '../reportesData';

export interface RouteAuditResult {
  category: string;
  species: string;
  reportName: string;
  resolvedRoute: string | null;
  resolutionType: 'STATIC_MAP' | 'METADATA_SLUG' | 'UNRESOLVED';
  status: 'VALID' | 'WARNING' | 'ERROR';
  details?: string;
}

export interface QaAuditSummary {
  totalCategories: number;
  totalReportsChecked: number;
  validRoutesCount: number;
  unresolvedCount: number;
  results: RouteAuditResult[];
  is100PercentCovered: boolean;
}

const REPORT_ROUTES_MAP_REFERENCE: Record<string, string> = {
  // Gestión
  'Inventarios': '/reports/inventories',
  'Movimientos': '/reports/movements',
  'Distribución normal': '/reports/historics/normaldistribution',
  'Técnicos': '/reports/technicians',
  'Reproductores': '/reports/breeders',

  // Animales / Bovinos
  'Vientres': '/reports/dams',
  'Vientres y Producción Lechera': '/reports/dams',
  'Próximas a secar': '/reports/nexttodry',
  'Próximas a parir': '/reports/nexttobirth',
  'Próximas a Parir / Secar': '/reports/nexttobirth',
  'Próximas a revisar': '/reports/nexttocheck',
  'Animales secos': '/reports/drycows',
  'Animales lactando': '/reports/cowsinproduction',
  'Animales criando': '/reports/cowsraising',
  'No Vientres': '/reports/nodams',

  // Históricos
  'Historia de reproducciones': '/reports/historics/reproductions',
  'Historia de lactancias': '/reports/historics/lactations',
  'Historia de pesajes de leche': '/reports/historics/milks',
  'Historia de crecimientos': '/reports/historics/weighings',

  // Multirebaños
  'Inventario multirebaño': '/reports/multiherds/inventories',
  'Situación reproductiva actual': '/reports/multiherds/reproduction',
  'Distribución por preñez': '/reports/multiherds/pregnancy-distribution',
  'Situación productiva actual': '/reports/multiherds/production-status',
  'Transacciones': '/reports/multiherds/transactions',
  'Producciones diarias': '/reports/multiherds/daily-production'
};

export const runReportRouteAudit = (): QaAuditSummary => {
  const results: RouteAuditResult[] = [];

  for (const cat of REPORT_CATEGORIES) {
    for (const rep of cat.reportes) {
      const staticRoute = REPORT_ROUTES_MAP_REFERENCE[rep];
      const metaRoute = REPORT_METADATA_MAP[rep]?.ruta;

      if (staticRoute) {
        results.push({
          category: cat.titulo,
          species: cat.especie || 'todos',
          reportName: rep,
          resolvedRoute: staticRoute,
          resolutionType: 'STATIC_MAP',
          status: 'VALID'
        });
      } else if (metaRoute) {
        results.push({
          category: cat.titulo,
          species: cat.especie || 'todos',
          reportName: rep,
          resolvedRoute: metaRoute,
          resolutionType: 'METADATA_SLUG',
          status: 'VALID'
        });
      } else {
        results.push({
          category: cat.titulo,
          species: cat.especie || 'todos',
          reportName: rep,
          resolvedRoute: null,
          resolutionType: 'UNRESOLVED',
          status: 'ERROR',
          details: `El reporte "${rep}" no cuenta con ruta estática ni metadato de slug asociado.`
        });
      }
    }
  }

  const validRoutesCount = results.filter(r => r.status === 'VALID').length;
  const unresolvedCount = results.filter(r => r.status === 'ERROR').length;

  return {
    totalCategories: REPORT_CATEGORIES.length,
    totalReportsChecked: results.length,
    validRoutesCount,
    unresolvedCount,
    results,
    is100PercentCovered: unresolvedCount === 0
  };
};
