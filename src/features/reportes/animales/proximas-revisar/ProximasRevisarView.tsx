import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { ProximosDiasFilterDrawer, ProximosDiasFilterValues } from '../components/ProximosDiasFilterDrawer';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { calculateDiasRestantes } from '../../utils/dateUtils';
import { MOCK_PROXIMAS_REVISAR } from '../animalesMockData';
import { ProximaRevisarEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

export const ProximasRevisarView: React.FC = () => {
  const [animales] = useState<ProximaRevisarEntity[]>(MOCK_PROXIMAS_REVISAR);

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof ProximaRevisarEntity>('diasProximaRevision');
  const [sortAsc, setSortAsc] = useState(true);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'lote', label: 'Lote', visible: true },
    { key: 'ultimoPartoAborto', label: 'Último Parto/Aborto', visible: true },
    { key: 'partos', label: 'Partos', visible: true },
    { key: 'montas', label: 'Montas', visible: true },
    { key: 'inseminaciones', label: 'Inseminaciones', visible: true },
    { key: 'transplantes', label: 'Transplantes', visible: true },
    { key: 'ultimoServicio', label: 'Último servicio', visible: true },
    { key: 'reproductor', label: 'Reproductor', visible: true },
    { key: 'ultimaRevision', label: 'Última revisión', visible: true },
    { key: 'revisiones', label: 'Revisiones', visible: true },
    { key: 'ultimoDiagnostico', label: 'Último Diagnóstico', visible: true },
    { key: 'ultimoTratamiento', label: 'Último tratamiento', visible: true },
    { key: 'proximaRevision', label: 'Próxima revisión', visible: true },
    { key: 'diasProximaRevision', label: 'Días Próxima Revisión', visible: true }
  ]);

  const [filters, setFilters] = useState<ProximosDiasFilterValues>({
    proximosDiasMaximo: 90,
    estatus: ['Activo'] as EstatusAnimal[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.proximosDiasMaximo < 90) count++;
    if (filters.estatus.length < 3) count++;
    if (filters.lotes.length < 4) count++;
    return count;
  }, [filters]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const handleSort = (field: keyof ProximaRevisarEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAnimales = useMemo(() => {
    return animales
      .filter(item => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.practico.toLowerCase().includes(q) || item.unico.toLowerCase().includes(q);
          const matchLot = item.lote.toLowerCase().includes(q);
          if (!matchCode && !matchLot) return false;
        }

        if (!filters.estatus.includes(item.estatus)) return false;
        if (!filters.lotes.includes(item.lote)) return false;
        const diasRestRevision = calculateDiasRestantes(item.proximaRevision);
        if (diasRestRevision > filters.proximosDiasMaximo) return false;

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (sortField === 'diasProximaRevision') {
          valA = calculateDiasRestantes(a.proximaRevision);
          valB = calculateDiasRestantes(b.proximaRevision);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
  }, [animales, searchQuery, filters, sortField, sortAsc]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredAnimales.length / pageSize) || 1;
  const paginatedAnimales = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredAnimales.slice(start, start + pageSize);
  }, [filteredAnimales, currentPage, totalPages, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Lote',
      'Último Parto/Aborto',
      'Partos',
      'Montas',
      'Inseminaciones',
      'Transplantes',
      'Último Servicio',
      'Reproductor',
      'Última Revisión',
      'Revisiones',
      'Último Diagnóstico',
      'Último Tratamiento',
      'Próxima Revisión',
      'Días Próxima Revisión'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.categoria,
      a.estatus,
      a.lote,
      a.ultimoPartoAborto || '',
      a.partos,
      a.montas,
      a.inseminaciones,
      a.transplantes,
      a.ultimoServicio || '',
      a.reproductor || '',
      a.ultimaRevision || '',
      a.revisiones,
      a.ultimoDiagnostico || '',
      a.ultimoTratamiento || '',
      a.proximaRevision,
      calculateDiasRestantes(a.proximaRevision)
    ]);
    exportToCSV('reporte_proximas_a_revisar', headers, rows);
  };

  const handleExportPDF = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Lote',
      'Último Parto/Aborto',
      'Partos',
      'Montas',
      'Insem.',
      'Transpl.',
      'Último Servicio',
      'Reproductor',
      'Última Revisión',
      'Revisiones',
      'Último Diagnóstico',
      'Último Tratamiento',
      'Próxima Revisión',
      'Días Próx. Revisión'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.categoria,
      a.estatus,
      a.lote,
      a.ultimoPartoAborto || '',
      a.partos,
      a.montas,
      a.inseminaciones,
      a.transplantes,
      a.ultimoServicio || '',
      a.reproductor || '',
      a.ultimaRevision || '',
      a.revisiones,
      a.ultimoDiagnostico || '',
      a.ultimoTratamiento || '',
      a.proximaRevision,
      calculateDiasRestantes(a.proximaRevision)
    ]);
    exportToPDF('reporte_proximas_a_revisar', 'Reporte de Animales Próximas a Revisar', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Próximas a revisar"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={activeFiltersCount}
        onExportXLSX={handleExportXLSX}
        onExportPDF={handleExportPDF}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <div className="report-search-bar">
            <Search className="report-search-icon" size={16} />
            <input
              type="text"
              className="report-search-input"
              placeholder="Buscar animales..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        }
      />

      {/* Tabla */}
      <div className="report-table-wrapper">
        <table className="report-grid-table">
          <thead>
            <tr>
              {isColVisible('practico') && (
                <th onClick={() => handleSort('practico')}>
                  <div className="th-content">
                    <span>Práctico</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('unico') && (
                <th onClick={() => handleSort('unico')}>
                  <div className="th-content">
                    <span>Único</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('categoria') && (
                <th onClick={() => handleSort('categoria')}>
                  <div className="th-content">
                    <span>Categoría</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('estatus') && (
                <th onClick={() => handleSort('estatus')}>
                  <div className="th-content">
                    <span>Estatus</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('lote') && (
                <th onClick={() => handleSort('lote')}>
                  <div className="th-content">
                    <span>Lote</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('ultimoPartoAborto') && <th>Último Parto/Aborto</th>}
              {isColVisible('partos') && <th>Partos</th>}
              {isColVisible('montas') && <th>Montas</th>}
              {isColVisible('inseminaciones') && <th>Inseminaciones</th>}
              {isColVisible('transplantes') && <th>Transplantes</th>}
              {isColVisible('ultimoServicio') && <th>Último servicio</th>}
              {isColVisible('reproductor') && <th>Reproductor</th>}
              {isColVisible('ultimaRevision') && <th>Última revisión</th>}
              {isColVisible('revisiones') && <th>Revisiones</th>}
              {isColVisible('ultimoDiagnostico') && <th>Último Diagnóstico</th>}
              {isColVisible('ultimoTratamiento') && <th>Último tratamiento</th>}
              {isColVisible('proximaRevision') && (
                <th onClick={() => handleSort('proximaRevision')}>
                  <div className="th-content">
                    <span>Próxima revisión</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasProximaRevision') && (
                <th onClick={() => handleSort('diasProximaRevision')}>
                  <div className="th-content">
                    <span>Días Próxima Revisión</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedAnimales.length === 0 ? (
              <tr>
                <td colSpan={18} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún registro encontrado
                </td>
              </tr>
            ) : (
              paginatedAnimales.map(a => (
                <tr
                  key={a.practico}
                  onClick={() =>
                    setSelectedAnimal({
                      practico: a.practico,
                      unico: a.unico,
                      especie: a.especie,
                      categoria: a.categoria,
                      estatus: a.estatus,
                      lote: a.lote,
                      ultimoParto: a.ultimoPartoAborto,
                      ultimoServicio: a.ultimoServicio,
                      reproductor: a.reproductor
                    })
                  }
                  title="Haga click para ver la ficha del animal"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.practico}</td>
                  )}
                  {isColVisible('unico') && <td>{a.unico}</td>}
                  {isColVisible('categoria') && <td>{a.categoria}</td>}
                  {isColVisible('estatus') && (
                    <td>
                      <span className={`badge-status ${a.estatus.toLowerCase()}`}>
                        {a.estatus}
                      </span>
                    </td>
                  )}
                  {isColVisible('lote') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{a.lote}</span>
                    </td>
                  )}
                  {isColVisible('ultimoPartoAborto') && <td>{a.ultimoPartoAborto || '-'}</td>}
                  {isColVisible('partos') && <td>{a.partos}</td>}
                  {isColVisible('montas') && <td>{a.montas}</td>}
                  {isColVisible('inseminaciones') && <td>{a.inseminaciones}</td>}
                  {isColVisible('transplantes') && <td>{a.transplantes}</td>}
                  {isColVisible('ultimoServicio') && <td>{a.ultimoServicio || '-'}</td>}
                  {isColVisible('reproductor') && <td>{a.reproductor || '-'}</td>}
                  {isColVisible('ultimaRevision') && <td>{a.ultimaRevision || '-'}</td>}
                  {isColVisible('revisiones') && <td>{a.revisiones}</td>}
                  {isColVisible('ultimoDiagnostico') && (
                    <td style={{ fontStyle: 'italic', color: '#4b5563' }}>{a.ultimoDiagnostico || '-'}</td>
                  )}
                  {isColVisible('ultimoTratamiento') && <td>{a.ultimoTratamiento || '-'}</td>}
                  {isColVisible('proximaRevision') && (
                    <td style={{ fontWeight: 600, color: '#0d9488' }}>{a.proximaRevision}</td>
                  )}
                  {isColVisible('diasProximaRevision') && (() => {
                    const diasRest = calculateDiasRestantes(a.proximaRevision);
                    return (
                      <td>
                        <span className={`badge-efficiency ${diasRest <= 7 ? 'high' : 'medium'}`}>
                          {diasRest} días
                        </span>
                      </td>
                    );
                  })()}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredAnimales.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Ficha Semoviente */}
      <FichaAnimalModal
        isOpen={!!selectedAnimal}
        onClose={() => setSelectedAnimal(null)}
        animal={selectedAnimal}
      />

      {/* Drawer Filtros */}
      <ProximosDiasFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filtros: Próximas a Revisar"
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            proximosDiasMaximo: 90,
            estatus: ['Activo'] as EstatusAnimal[],
            lotes: ['01', 'ESCT', 'POT1', 'SEC1']
          })
        }
        showCategoryFilter={false}
      />

      {/* Modal Configuración Columnas */}
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
