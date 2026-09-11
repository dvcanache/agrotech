import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { SecosFilterDrawer, SecosFilterValues } from '../components/SecosFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_ANIMALES_SECOS } from '../animalesMockData';
import { AnimalSecoEntity } from '../../../../types2/entities';
import { EstatusAnimal, EstatusReproductivo } from '../../../../types2/common';

export const AnimalesSecosView: React.FC = () => {
  const [animales] = useState<AnimalSecoEntity[]>(MOCK_ANIMALES_SECOS);

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof AnimalSecoEntity>('diasSeca');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'estatusReproductivo', label: 'Estatus Reproductivo', visible: true },
    { key: 'estatusProductivo', label: 'Estatus Productivo', visible: true },
    { key: 'lote', label: 'Lote', visible: true },
    { key: 'ultimoParto', label: 'Último parto', visible: true },
    { key: 'ultimoServicio', label: 'Último servicio', visible: true },
    { key: 'diasServidaActual', label: 'Días de servida actual', visible: true },
    { key: 'fechaProximoParto', label: 'Fecha próximo parto', visible: true },
    { key: 'diasSeca', label: 'Días seca', visible: true },
    { key: 'diasEnProduccion', label: 'Días en producción', visible: true }
  ]);

  const [filters, setFilters] = useState<SecosFilterValues>({
    estatus: ['Activo'] as EstatusAnimal[],
    estatusReproductivo: ['Vacía', 'Preñada', 'En espera'] as EstatusReproductivo[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estatus.length < 3) count++;
    if (filters.estatusReproductivo.length < 3) count++;
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

  const handleSort = (field: keyof AnimalSecoEntity) => {
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
        if (!filters.estatusReproductivo.includes(item.estatusReproductivo)) return false;
        if (!filters.lotes.includes(item.lote)) return false;

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

  const totalPages = Math.ceil(filteredAnimales.length / pageSize) || 1;
  const paginatedAnimales = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAnimales.slice(start, start + pageSize);
  }, [filteredAnimales, currentPage, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Estatus Reproductivo',
      'Estatus Productivo',
      'Lote',
      'Último Parto',
      'Último Servicio',
      'Días Servida Actual',
      'Fecha Próximo Parto',
      'Días Seca',
      'Días en Producción'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.categoria,
      a.estatus,
      a.estatusReproductivo,
      a.estatusProductivo,
      a.lote,
      a.ultimoParto || '',
      a.ultimoServicio || '',
      a.diasServidaActual !== undefined ? a.diasServidaActual : '',
      a.fechaProximoParto || '',
      a.diasSeca,
      a.diasEnProduccion
    ]);
    exportToCSV('reporte_animales_secos', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Animales secos"
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
              {isColVisible('estatusReproductivo') && (
                <th onClick={() => handleSort('estatusReproductivo')}>
                  <div className="th-content">
                    <span>Estatus Reproductivo</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('estatusProductivo') && <th>Estatus Productivo</th>}
              {isColVisible('lote') && (
                <th onClick={() => handleSort('lote')}>
                  <div className="th-content">
                    <span>Lote</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('ultimoParto') && <th>Último parto</th>}
              {isColVisible('ultimoServicio') && <th>Último servicio</th>}
              {isColVisible('diasServidaActual') && (
                <th onClick={() => handleSort('diasServidaActual')}>
                  <div className="th-content">
                    <span>Días de servida actual</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('fechaProximoParto') && <th>Fecha próximo parto</th>}
              {isColVisible('diasSeca') && (
                <th onClick={() => handleSort('diasSeca')}>
                  <div className="th-content">
                    <span>Días seca</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasEnProduccion') && <th>Días en producción</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedAnimales.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
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
                      estatusReproductivo: a.estatusReproductivo,
                      estatusProductivo: a.estatusProductivo,
                      ultimoParto: a.ultimoParto,
                      ultimoServicio: a.ultimoServicio,
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
                  {isColVisible('estatusReproductivo') && (
                    <td>
                      <span className={`badge-repro ${a.estatusReproductivo.toLowerCase().replace(' ', '-')}`}>
                        {a.estatusReproductivo}
                      </span>
                    </td>
                  )}
                  {isColVisible('estatusProductivo') && <td>{a.estatusProductivo}</td>}
                  {isColVisible('lote') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{a.lote}</span>
                    </td>
                  )}
                  {isColVisible('ultimoParto') && <td>{a.ultimoParto || '-'}</td>}
                  {isColVisible('ultimoServicio') && <td>{a.ultimoServicio || '-'}</td>}
                  {isColVisible('diasServidaActual') && (
                    <td>{a.diasServidaActual !== undefined ? `${a.diasServidaActual} días` : '-'}</td>
                  )}
                  {isColVisible('fechaProximoParto') && (
                    <td style={{ fontWeight: 600, color: a.fechaProximoParto ? '#2563eb' : 'inherit' }}>
                      {a.fechaProximoParto || '-'}
                    </td>
                  )}
                  {isColVisible('diasSeca') && (
                    <td>
                      <span className="badge-efficiency medium">{a.diasSeca} días</span>
                    </td>
                  )}
                  {isColVisible('diasEnProduccion') && <td>{a.diasEnProduccion} días</td>}
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
      <SecosFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            estatus: ['Activo'] as EstatusAnimal[],
            estatusReproductivo: ['Vacía', 'Preñada', 'En espera'] as EstatusReproductivo[],
            lotes: ['01', 'ESCT', 'POT1', 'SEC1']
          })
        }
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
