import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { LactandoFilterDrawer, LactandoFilterValues } from '../components/LactandoFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_ANIMALES_LACTANDO } from '../animalesMockData';
import { AnimalLactandoEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

export const AnimalesLactandoView: React.FC = () => {
  const [animales] = useState<AnimalLactandoEntity[]>(MOCK_ANIMALES_LACTANDO);

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof AnimalLactandoEntity>('diasEnProduccion');
  const [sortAsc, setSortAsc] = useState(true);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'situacionReproductivaActual', label: 'Situación reproductiva actual', visible: true },
    { key: 'situacionProductivaActual', label: 'Situación productiva actual', visible: true },
    { key: 'lote', label: 'Lote', visible: true },
    { key: 'ultimoParto', label: 'Último Parto', visible: true },
    { key: 'numeroParto', label: 'Número de parto', visible: true },
    { key: 'ultimoServicio', label: 'Último servicio', visible: true },
    { key: 'reproductor', label: 'Reproductor', visible: true },
    { key: 'diasParida', label: 'Días parida', visible: true },
    { key: 'diasServida', label: 'Días servida', visible: true },
    { key: 'proximoParto', label: 'Próximo parto', visible: true },
    { key: 'fechaProximoSecado', label: 'Fecha próximo secado', visible: true },
    { key: 'diasEnProduccion', label: 'Días en producción', visible: true },
    { key: 'diasSeca', label: 'Días seca', visible: true }
  ]);

  const [filters, setFilters] = useState<LactandoFilterValues>({
    diasProduccionMaximo: undefined,
    estatus: ['Activo'] as EstatusAnimal[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.diasProduccionMaximo !== undefined) count++;
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

  const handleSort = (field: keyof AnimalLactandoEntity) => {
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
        if (
          filters.diasProduccionMaximo !== undefined &&
          item.diasEnProduccion > filters.diasProduccionMaximo
        ) {
          return false;
        }

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
      'Situación Reproductiva',
      'Situación Productiva',
      'Lote',
      'Último Parto',
      'Número de Parto',
      'Último Servicio',
      'Reproductor',
      'Días Parida',
      'Días Servida',
      'Próximo Parto',
      'Fecha Próximo Secado',
      'Días en Producción',
      'Días Seca'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.categoria,
      a.estatus,
      a.situacionReproductivaActual,
      a.situacionProductivaActual,
      a.lote,
      a.ultimoParto,
      a.numeroParto,
      a.ultimoServicio || '',
      a.reproductor || '',
      a.diasParida,
      a.diasServida !== undefined ? a.diasServida : '',
      a.proximoParto || '',
      a.fechaProximoSecado || '',
      a.diasEnProduccion,
      a.diasSeca !== undefined ? a.diasSeca : ''
    ]);
    exportToCSV('reporte_animales_lactando', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Animales lactando"
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
              {isColVisible('situacionReproductivaActual') && (
                <th onClick={() => handleSort('situacionReproductivaActual')}>
                  <div className="th-content">
                    <span>Situación reproductiva actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('situacionProductivaActual') && <th>Situación productiva actual</th>}
              {isColVisible('lote') && (
                <th onClick={() => handleSort('lote')}>
                  <div className="th-content">
                    <span>Lote</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('ultimoParto') && <th>Último Parto</th>}
              {isColVisible('numeroParto') && <th>Número de parto</th>}
              {isColVisible('ultimoServicio') && <th>Último servicio</th>}
              {isColVisible('reproductor') && <th>Reproductor</th>}
              {isColVisible('diasParida') && (
                <th onClick={() => handleSort('diasParida')}>
                  <div className="th-content">
                    <span>Días parida</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasServida') && <th>Días servida</th>}
              {isColVisible('proximoParto') && <th>Próximo parto</th>}
              {isColVisible('fechaProximoSecado') && <th>Fecha próximo secado</th>}
              {isColVisible('diasEnProduccion') && (
                <th onClick={() => handleSort('diasEnProduccion')}>
                  <div className="th-content">
                    <span>Días en producción</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasSeca') && <th>Días seca</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedAnimales.length === 0 ? (
              <tr>
                <td colSpan={17} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
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
                      estatusReproductivo: a.situacionReproductivaActual,
                      estatusProductivo: a.situacionProductivaActual,
                      ultimoParto: a.ultimoParto,
                      ultimoServicio: a.ultimoServicio,
                      reproductor: a.reproductor,
                      fechaProximoParto: a.proximoParto,
                      fechaProximoSecado: a.fechaProximoSecado
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
                  {isColVisible('situacionReproductivaActual') && (
                    <td>
                      <span className={`badge-repro ${a.situacionReproductivaActual.toLowerCase().replace(' ', '-')}`}>
                        {a.situacionReproductivaActual}
                      </span>
                    </td>
                  )}
                  {isColVisible('situacionProductivaActual') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{a.situacionProductivaActual}</span>
                    </td>
                  )}
                  {isColVisible('lote') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{a.lote}</span>
                    </td>
                  )}
                  {isColVisible('ultimoParto') && <td>{a.ultimoParto}</td>}
                  {isColVisible('numeroParto') && <td>{a.numeroParto}</td>}
                  {isColVisible('ultimoServicio') && <td>{a.ultimoServicio || '-'}</td>}
                  {isColVisible('reproductor') && <td>{a.reproductor || '-'}</td>}
                  {isColVisible('diasParida') && <td>{a.diasParida} días</td>}
                  {isColVisible('diasServida') && <td>{a.diasServida !== undefined ? `${a.diasServida} días` : '-'}</td>}
                  {isColVisible('proximoParto') && (
                    <td style={{ fontWeight: 600, color: a.proximoParto ? '#2563eb' : 'inherit' }}>
                      {a.proximoParto || '-'}
                    </td>
                  )}
                  {isColVisible('fechaProximoSecado') && (
                    <td style={{ fontWeight: 600, color: '#d97706' }}>{a.fechaProximoSecado || '-'}</td>
                  )}
                  {isColVisible('diasEnProduccion') && (
                    <td>
                      <span className="badge-efficiency medium">{a.diasEnProduccion} días</span>
                    </td>
                  )}
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
      <LactandoFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            diasProduccionMaximo: undefined,
            estatus: ['Activo'] as EstatusAnimal[],
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
