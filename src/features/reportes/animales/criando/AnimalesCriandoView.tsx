import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_ANIMALES_CRIANDO } from '../animalesMockData';
import { AnimalCriandoEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1'];

export const AnimalesCriandoView: React.FC = () => {
  const [animales] = useState<AnimalCriandoEntity[]>(MOCK_ANIMALES_CRIANDO);

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof AnimalCriandoEntity>('diasParidaActual');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'lote', label: 'Lote', visible: true },
    { key: 'ultimoParto', label: 'Último parto', visible: true },
    { key: 'codigosCriasUltimoParto', label: 'Códigos crías último parto', visible: true },
    { key: 'diasParidaActual', label: 'Días de parida actual', visible: true }
  ]);

  const [filterEstatus, setFilterEstatus] = useState<EstatusAnimal[]>(['Activo']);
  const [filterLotes, setFilterLotes] = useState<string[]>(['01', 'ESCT', 'POT1', 'SEC1']);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterEstatus.length < 3) count++;
    if (filterLotes.length < 4) count++;
    return count;
  }, [filterEstatus, filterLotes]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const handleSort = (field: keyof AnimalCriandoEntity) => {
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
          const matchCrias = item.codigosCriasUltimoParto.toLowerCase().includes(q);
          const matchLot = item.lote.toLowerCase().includes(q);
          if (!matchCode && !matchCrias && !matchLot) return false;
        }

        if (!filterEstatus.includes(item.estatus)) return false;
        if (!filterLotes.includes(item.lote)) return false;

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
  }, [animales, searchQuery, filterEstatus, filterLotes, sortField, sortAsc]);

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
      'Lote',
      'Último Parto',
      'Códigos Crías Último Parto',
      'Días de Parida Actual'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.categoria,
      a.estatus,
      a.lote,
      a.ultimoParto,
      a.codigosCriasUltimoParto,
      a.diasParidaActual
    ]);
    exportToCSV('reporte_animales_criando', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  const toggleArrayItem = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Animales criando"
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
              placeholder="Buscar por vaca o código de cría..."
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
              {isColVisible('ultimoParto') && <th>Último parto</th>}
              {isColVisible('codigosCriasUltimoParto') && <th>Códigos crías último parto</th>}
              {isColVisible('diasParidaActual') && (
                <th onClick={() => handleSort('diasParidaActual')}>
                  <div className="th-content">
                    <span>Días de parida actual</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedAnimales.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
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
                      ultimoParto: a.ultimoParto,
                      estatusProductivo: 'Criando'
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
                  {isColVisible('ultimoParto') && <td>{a.ultimoParto}</td>}
                  {isColVisible('codigosCriasUltimoParto') && (
                    <td>
                      <span className="badge-category" style={{ backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 600 }}>
                        {a.codigosCriasUltimoParto}
                      </span>
                    </td>
                  )}
                  {isColVisible('diasParidaActual') && (
                    <td>
                      <span className="badge-efficiency medium">{a.diasParidaActual} días</span>
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
      <ReportFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filtros: Animales Criando"
        onClear={() => {
          setFilterEstatus(['Activo']);
          setFilterLotes(['01', 'ESCT', 'POT1', 'SEC1']);
        }}
      >
        <div className="filter-section">
          <div className="filter-section-title">Estatus</div>
          <div className="filter-checkbox-list">
            {ALL_ESTATUS.map(st => (
              <label key={st} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filterEstatus.includes(st)}
                  onChange={() => setFilterEstatus(toggleArrayItem(filterEstatus, st))}
                />
                <span>{st}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-section-title">Lotes</div>
          <div className="filter-checkbox-list">
            {ALL_LOTES.map(l => (
              <label key={l} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filterLotes.includes(l)}
                  onChange={() => setFilterLotes(toggleArrayItem(filterLotes, l))}
                />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </div>
      </ReportFilterDrawer>

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
