import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaReproductorModal } from './FichaReproductorModal';
import { NuevoReproductorModal } from './NuevoReproductorModal';
import { ReproductoresFilterDrawer, ReproductoresFilterValues } from './ReproductoresFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_REPRODUCTORES, ReproductorDetalladoEntity } from '../gestionMockData';

export const ReproductoresView: React.FC = () => {
  // Lista de reproductores
  const [reproductores, setReproductores] = useState<ReproductorDetalladoEntity[]>(MOCK_REPRODUCTORES);

  // Estados de modales y drawers
  const [selectedReproductor, setSelectedReproductor] = useState<ReproductorDetalladoEntity | null>(null);
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Filtro rápido por tipo de material
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'Todos' | 'Toro' | 'Semen' | 'Embrión'>('Todos');

  // Búsqueda y Paginación
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof ReproductorDetalladoEntity>('practico');
  const [sortAsc, setSortAsc] = useState(true);

  // Columnas configurables
  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'nombre', label: 'Nombre', visible: true },
    { key: 'categoriaActual', label: 'Categoría Actual', visible: true },
    { key: 'estatusActual', label: 'Estatus Actual', visible: true },
    { key: 'eficiencia', label: 'Eficiencia', visible: true },
    { key: 'serviciosPorConcepcion', label: 'Servicios por Concepción', visible: true },
    { key: 'loteActual', label: 'Lote Actual', visible: true },
    { key: 'stockActual', label: 'Stock / Dosis', visible: true }
  ]);

  // Filtros aplicados
  const [filters, setFilters] = useState<ReproductoresFilterValues>({
    categorias: ['Toro', 'Semen', 'Embrión'],
    estatus: ['Activo'],
    lotes: ['TERM1', 'ESCT', 'POT1', '01'],
    minEficiencia: 0
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categorias.length < 3) count++;
    if (filters.lotes.length < 4) count++;
    if (filters.minEficiencia > 0) count++;
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

  const handleSort = (field: keyof ReproductorDetalladoEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filtrado y ordenamiento
  const filteredReproductores = useMemo(() => {
    return reproductores
      .filter(r => {
        // Tab de categoría rápida
        if (selectedCategoryTab !== 'Todos' && r.categoriaActual !== selectedCategoryTab) {
          return false;
        }

        // Búsqueda
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = r.practico.toLowerCase().includes(q) || r.unico.toLowerCase().includes(q);
          const matchName = r.nombre.toLowerCase().includes(q);
          const matchBreed = r.raza.toLowerCase().includes(q);
          const matchLot = r.loteActual.toLowerCase().includes(q);
          if (!matchCode && !matchName && !matchBreed && !matchLot) return false;
        }

        // Filtro de drawer
        if (!filters.categorias.includes(r.categoriaActual)) return false;
        if (!filters.lotes.includes(r.loteActual)) return false;
        if (r.eficiencia && r.eficiencia < filters.minEficiencia) return false;

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
  }, [reproductores, selectedCategoryTab, searchQuery, filters, sortField, sortAsc]);

  // Paginación
  const totalPages = Math.ceil(filteredReproductores.length / pageSize) || 1;
  const paginatedReproductores = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReproductores.slice(start, start + pageSize);
  }, [filteredReproductores, currentPage, pageSize]);

  // Exportar XLSX
  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Nombre',
      'Categoría Actual',
      'Estatus Actual',
      'Eficiencia %',
      'Servicios por Concepción',
      'Lote Actual',
      'Stock / Dosis',
      'Raza'
    ];
    const rows = filteredReproductores.map(r => [
      r.practico,
      r.unico,
      r.nombre,
      r.categoriaActual,
      r.estatusActual,
      r.eficiencia ? `${r.eficiencia}%` : '',
      r.serviciosPorConcepcion || '',
      r.loteActual,
      `${r.stockActual} ${r.stockUnidad}`,
      r.raza
    ]);
    exportToCSV('reporte_reproductores', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  const handleAddNewReproductor = (nuevo: ReproductorDetalladoEntity) => {
    setReproductores(prev => [nuevo, ...prev]);
  };

  // Contadores para las pestañas
  const counts = useMemo(() => {
    return {
      todos: reproductores.length,
      toros: reproductores.filter(r => r.categoriaActual === 'Toro').length,
      semen: reproductores.filter(r => r.categoriaActual === 'Semen').length,
      embriones: reproductores.filter(r => r.categoriaActual === 'Embrión').length
    };
  }, [reproductores]);

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Reproductores"
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
        primaryAction={{
          label: 'Registrar Reproductor',
          onClick: () => setIsNuevoModalOpen(true),
          icon: <Plus size={16} />
        }}
      />

      {/* Píldoras de Filtro Rápido por Categoría */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        <button
          type="button"
          onClick={() => { setSelectedCategoryTab('Todos'); setCurrentPage(1); }}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: selectedCategoryTab === 'Todos' ? '1px solid var(--primary-color)' : '1px solid #e5e7eb',
            backgroundColor: selectedCategoryTab === 'Todos' ? 'var(--primary-ultra-light)' : '#ffffff',
            color: selectedCategoryTab === 'Todos' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Todos ({counts.todos})
        </button>
        <button
          type="button"
          onClick={() => { setSelectedCategoryTab('Toro'); setCurrentPage(1); }}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: selectedCategoryTab === 'Toro' ? '1px solid var(--primary-color)' : '1px solid #e5e7eb',
            backgroundColor: selectedCategoryTab === 'Toro' ? 'var(--primary-ultra-light)' : '#ffffff',
            color: selectedCategoryTab === 'Toro' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Toros ({counts.toros})
        </button>
        <button
          type="button"
          onClick={() => { setSelectedCategoryTab('Semen'); setCurrentPage(1); }}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: selectedCategoryTab === 'Semen' ? '1px solid var(--primary-color)' : '1px solid #e5e7eb',
            backgroundColor: selectedCategoryTab === 'Semen' ? 'var(--primary-ultra-light)' : '#ffffff',
            color: selectedCategoryTab === 'Semen' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Semen ({counts.semen})
        </button>
        <button
          type="button"
          onClick={() => { setSelectedCategoryTab('Embrión'); setCurrentPage(1); }}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: selectedCategoryTab === 'Embrión' ? '1px solid var(--primary-color)' : '1px solid #e5e7eb',
            backgroundColor: selectedCategoryTab === 'Embrión' ? 'var(--primary-ultra-light)' : '#ffffff',
            color: selectedCategoryTab === 'Embrión' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Embriones ({counts.embriones})
        </button>
      </div>

      {/* Tabla de Reproductores */}
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
              {isColVisible('nombre') && (
                <th onClick={() => handleSort('nombre')}>
                  <div className="th-content">
                    <span>Nombre</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('categoriaActual') && (
                <th onClick={() => handleSort('categoriaActual')}>
                  <div className="th-content">
                    <span>Categoría Actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('estatusActual') && (
                <th onClick={() => handleSort('estatusActual')}>
                  <div className="th-content">
                    <span>Estatus Actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('eficiencia') && (
                <th onClick={() => handleSort('eficiencia')}>
                  <div className="th-content">
                    <span>Eficiencia</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('serviciosPorConcepcion') && (
                <th onClick={() => handleSort('serviciosPorConcepcion')}>
                  <div className="th-content">
                    <span>Servicios por Concep...</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('loteActual') && (
                <th onClick={() => handleSort('loteActual')}>
                  <div className="th-content">
                    <span>Lote Actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('stockActual') && <th>Stock / Dosis</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedReproductores.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún reproductor encontrado con los criterios seleccionados
                </td>
              </tr>
            ) : (
              paginatedReproductores.map(r => (
                <tr
                  key={r.practico}
                  onClick={() => setSelectedReproductor(r)}
                  title="Haga click para ver la ficha completa del reproductor"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.practico}</td>
                  )}
                  {isColVisible('unico') && <td>{r.unico}</td>}
                  {isColVisible('nombre') && (
                    <td style={{ fontWeight: 500, color: r.nombre ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {r.nombre || '-'}
                    </td>
                  )}
                  {isColVisible('categoriaActual') && (
                    <td>
                      <span className="badge-category" style={{
                        backgroundColor:
                          r.categoriaActual === 'Toro' ? '#fef3c7' : r.categoriaActual === 'Semen' ? '#e0f2fe' : '#f3e8ff',
                        color:
                          r.categoriaActual === 'Toro' ? '#92400e' : r.categoriaActual === 'Semen' ? '#0369a1' : '#6b21a8'
                      }}>
                        {r.categoriaActual}
                      </span>
                    </td>
                  )}
                  {isColVisible('estatusActual') && (
                    <td>
                      <span className={`badge-status ${r.estatusActual.toLowerCase()}`}>
                        {r.estatusActual}
                      </span>
                    </td>
                  )}
                  {isColVisible('eficiencia') && (
                    <td>
                      {r.eficiencia ? (
                        <span className="badge-efficiency high">{r.eficiencia}%</span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                  )}
                  {isColVisible('serviciosPorConcepcion') && (
                    <td>
                      {r.serviciosPorConcepcion ? (
                        <span style={{ fontWeight: 600 }}>{r.serviciosPorConcepcion}</span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                  )}
                  {isColVisible('loteActual') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{r.loteActual}</span>
                    </td>
                  )}
                  {isColVisible('stockActual') && (
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {r.stockActual} {r.stockUnidad}
                    </td>
                  )}
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
        totalRecords={filteredReproductores.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Ficha Reproductor */}
      <FichaReproductorModal
        isOpen={!!selectedReproductor}
        onClose={() => setSelectedReproductor(null)}
        reproductor={selectedReproductor}
      />

      {/* Modal Nuevo Reproductor */}
      <NuevoReproductorModal
        isOpen={isNuevoModalOpen}
        onClose={() => setIsNuevoModalOpen(false)}
        onSave={handleAddNewReproductor}
      />

      {/* Drawer Filtros */}
      <ReproductoresFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            categorias: ['Toro', 'Semen', 'Embrión'],
            estatus: ['Activo'],
            lotes: ['TERM1', 'ESCT', 'POT1', '01'],
            minEficiencia: 0
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
