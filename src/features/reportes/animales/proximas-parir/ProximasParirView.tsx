import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { ProximosDiasFilterDrawer, ProximosDiasFilterValues } from '../components/ProximosDiasFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_PROXIMAS_PARIR } from '../animalesMockData';
import { ProximaParirEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

export const ProximasParirView: React.FC = () => {
  const [animales] = useState<ProximaParirEntity[]>(MOCK_PROXIMAS_PARIR);

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof ProximaParirEntity>('diasProximoParto');
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
    { key: 'fechaProximoParto', label: 'Fecha próximo parto', visible: true },
    { key: 'diasProximoParto', label: 'Días próximo parto', visible: true },
    { key: 'ultimoPesoKg', label: 'Último Peso', visible: true },
    { key: 'fechaUltimoPeso', label: 'Fecha último peso', visible: true },
    { key: 'fechaSecado', label: 'Fecha de Secado', visible: true },
    { key: 'diasSeca', label: 'Días seca', visible: true }
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

  const handleSort = (field: keyof ProximaParirEntity) => {
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
        if (item.diasProximoParto > filters.proximosDiasMaximo) return false;

        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
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
      'Fecha Próximo Parto',
      'Días Próximo Parto',
      'Último Peso (Kg)',
      'Fecha Último Peso',
      'Fecha de Secado',
      'Días Seca'
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
      a.fechaProximoParto,
      a.diasProximoParto,
      a.ultimoPesoKg || '',
      a.fechaUltimoPeso || '',
      a.fechaSecado || '',
      a.diasSeca !== undefined ? a.diasSeca : ''
    ]);
    exportToCSV('reporte_proximas_a_parir', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Próximas a parir"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={activeFiltersCount}
        onExportXLSX={handleExportXLSX}
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
              {isColVisible('fechaProximoParto') && (
                <th onClick={() => handleSort('fechaProximoParto')}>
                  <div className="th-content">
                    <span>Fecha próximo parto</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasProximoParto') && (
                <th onClick={() => handleSort('diasProximoParto')}>
                  <div className="th-content">
                    <span>Días próximo parto</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('ultimoPesoKg') && <th>Último Peso</th>}
              {isColVisible('fechaUltimoPeso') && <th>Fecha último peso</th>}
              {isColVisible('fechaSecado') && <th>Fecha de Secado</th>}
              {isColVisible('diasSeca') && <th>Días seca</th>}
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
                      categoria: a.categoria,
                      estatus: a.estatus,
                      lote: a.lote,
                      ultimoParto: a.ultimoPartoAborto,
                      ultimoServicio: a.ultimoServicio,
                      reproductor: a.reproductor,
                      fechaProximoParto: a.fechaProximoParto
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
                  {isColVisible('fechaProximoParto') && (
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{a.fechaProximoParto}</td>
                  )}
                  {isColVisible('diasProximoParto') && (
                    <td>
                      <span className={`badge-efficiency ${a.diasProximoParto <= 15 ? 'high' : 'medium'}`}>
                        {a.diasProximoParto} días
                      </span>
                    </td>
                  )}
                  {isColVisible('ultimoPesoKg') && (
                    <td style={{ fontWeight: 600 }}>{a.ultimoPesoKg ? `${a.ultimoPesoKg} Kg` : '-'}</td>
                  )}
                  {isColVisible('fechaUltimoPeso') && <td>{a.fechaUltimoPeso || '-'}</td>}
                  {isColVisible('fechaSecado') && <td>{a.fechaSecado || '-'}</td>}
                  {isColVisible('diasSeca') && <td>{a.diasSeca !== undefined ? `${a.diasSeca} días` : '-'}</td>}
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
        title="Filtros: Próximas a Parir"
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
