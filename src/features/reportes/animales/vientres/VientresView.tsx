import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { VientresFilterDrawer, VientresFilterValues } from '../components/VientresFilterDrawer';
import { SpeciesSelectorBar, SPECIES_TABS_CONFIG } from '../../components/SpeciesSelectorBar';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { MOCK_VIENTRES } from '../animalesMockData';
import { VientreEntity } from '../../../../types2/entities';
import { EstatusAnimal, EstatusReproductivo, EstatusProductivo } from '../../../../types2/common';

const ALL_VIENTRES_CATEGORIAS = [
  'Novilla', 'Vaca',
  'Cerda Reproductora', 'Cerda de Reemplazo',
  'Búfala', 'Bubilla',
  'Cabra Lechera', 'Cabritona',
  'Yegua', 'Potranca',
  'Gallina Ponedora', 'Pava', 'Pata', 'Gallina Fina'
];

export const VientresView: React.FC = () => {
  const [vientres] = useState<VientreEntity[]>(MOCK_VIENTRES);

  // Especie activa
  const [selectedSpecies, setSelectedSpecies] = useState<string>('TODAS');

  // Estados de modales y drawers
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Búsqueda y Paginación
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof VientreEntity>('practico');
  const [sortAsc, setSortAsc] = useState(true);

  // Conteo dinámico por especie
  const speciesCounts = useMemo(() => {
    const counts: Record<string, number> = { TODAS: vientres.length };
    SPECIES_TABS_CONFIG.forEach(t => {
      if (t.id !== 'TODAS') {
        counts[t.id] = vientres.filter(v => (v.especie || 'Bovinos') === t.id).length;
      }
    });
    return counts;
  }, [vientres]);

  // Columnas configurables
  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'especie', label: 'Especie', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'estatusReproductivo', label: 'Estatus Reproductivo', visible: true },
    { key: 'estatusProductivo', label: 'Estatus Productivo', visible: true },
    { key: 'lote', label: 'Lote', visible: true },
    { key: 'edadAnos', label: 'Edad (Años)', visible: true },
    { key: 'partos', label: 'Partos', visible: true },
    { key: 'ultimoPartoAborto', label: 'Último parto/aborto', visible: true },
    { key: 'ultimoServicio', label: 'Último servicio', visible: true },
    { key: 'reproductor', label: 'Reproductor', visible: true }
  ]);

  // Filtros aplicados
  const [filters, setFilters] = useState<VientresFilterValues>({
    categorias: ALL_VIENTRES_CATEGORIAS,
    estatus: ['Activo'] as EstatusAnimal[],
    estatusReproductivo: ['Vacía', 'Preñada', 'En espera'] as EstatusReproductivo[],
    estatusProductivo: ['Criando', 'Ordeño', 'Seca', 'Lactancia', 'Postura', 'En Producción', 'Trabajo'] as EstatusProductivo[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1', 'TERM1', 'GALP-01', 'GALP-02', 'GALP-03', 'PIARA-01', 'CAB-01', 'APR-01', 'BUF-01']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categorias.length < ALL_VIENTRES_CATEGORIAS.length) count++;
    if (filters.estatus.length < 3) count++;
    if (filters.estatusReproductivo.length < 3) count++;
    if (filters.estatusProductivo.length < 7) count++;
    if (filters.lotes.length < 12) count++;
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

  const handleSort = (field: keyof VientreEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filtrado y ordenamiento dinámico
  const filteredVientres = useMemo(() => {
    return vientres
      .filter(v => {
        // Filtro por especie activa
        const sp = v.especie || 'Bovinos';
        if (selectedSpecies !== 'TODAS' && sp !== selectedSpecies) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = v.practico.toLowerCase().includes(q) || v.unico.toLowerCase().includes(q);
          const matchLot = v.lote.toLowerCase().includes(q);
          const matchCat = v.categoria.toLowerCase().includes(q);
          if (!matchCode && !matchLot && !matchCat) return false;
        }

        if (filters.categorias.length > 0 && !filters.categorias.includes(v.categoria)) return false;
        if (!filters.estatus.includes(v.estatus)) return false;
        if (!filters.estatusReproductivo.includes(v.estatusReproductivo)) return false;
        if (!filters.estatusProductivo.includes(v.estatusProductivo)) return false;
        if (filters.lotes.length > 0 && !filters.lotes.includes(v.lote)) return false;

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
  }, [vientres, selectedSpecies, searchQuery, filters, sortField, sortAsc]);

  // Reset page on filter, species or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecies, filters, searchQuery]);

  // Paginación
  const totalPages = Math.ceil(filteredVientres.length / pageSize) || 1;
  const paginatedVientres = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredVientres.slice(start, start + pageSize);
  }, [filteredVientres, currentPage, totalPages, pageSize]);

  // Exportar XLSX
  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Estatus Reproductivo',
      'Estatus Productivo',
      'Lote',
      'Edad (Años)',
      'Partos',
      'Último parto/aborto',
      'Último servicio',
      'Reproductor'
    ];
    const rows = filteredVientres.map(v => [
      v.practico,
      v.unico,
      v.categoria,
      v.estatus,
      v.estatusReproductivo,
      v.estatusProductivo,
      v.lote,
      v.edadAnos,
      v.partos,
      v.ultimoPartoAborto || '',
      v.ultimoServicio || '',
      v.reproductor || ''
    ]);
    exportToCSV('reporte_vientres', headers, rows);
  };

  const handleExportPDF = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Estatus Reproductivo',
      'Estatus Productivo',
      'Lote',
      'Edad (Años)',
      'Partos',
      'Último parto/aborto',
      'Último servicio',
      'Reproductor'
    ];
    const rows = filteredVientres.map(v => [
      v.practico,
      v.unico,
      v.categoria,
      v.estatus,
      v.estatusReproductivo,
      v.estatusProductivo,
      v.lote,
      v.edadAnos,
      v.partos,
      v.ultimoPartoAborto || '',
      v.ultimoServicio || '',
      v.reproductor || ''
    ]);
    exportToPDF('reporte_vientres', 'Reporte de Vientres', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Vientres"
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

      {/* Barra Selectora Multiespecie */}
      <SpeciesSelectorBar
        selectedSpecies={selectedSpecies}
        onSelectSpecies={setSelectedSpecies}
        speciesCounts={speciesCounts}
      />

      {/* Tabla de Vientres */}
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
              {isColVisible('especie') && (
                <th onClick={() => handleSort('especie' as any)}>
                  <div className="th-content">
                    <span>Especie</span>
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
              {isColVisible('estatusProductivo') && (
                <th onClick={() => handleSort('estatusProductivo')}>
                  <div className="th-content">
                    <span>Estatus Productivo</span>
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
              {isColVisible('edadAnos') && (
                <th onClick={() => handleSort('edadAnos')}>
                  <div className="th-content">
                    <span>Edad (Años)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('partos') && <th>Partos</th>}
              {isColVisible('ultimoPartoAborto') && <th>Último parto/aborto</th>}
              {isColVisible('ultimoServicio') && <th>Último servicio</th>}
              {isColVisible('reproductor') && <th>Reproductor</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedVientres.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún registro encontrado
                </td>
              </tr>
            ) : (
              paginatedVientres.map(v => (
                <tr
                  key={v.practico}
                  onClick={() =>
                    setSelectedAnimal({
                      practico: v.practico,
                      unico: v.unico,
                      especie: v.especie,
                      categoria: v.categoria,
                      estatus: v.estatus,
                      lote: v.lote,
                      estatusReproductivo: v.estatusReproductivo,
                      estatusProductivo: v.estatusProductivo,
                      edadAnos: v.edadAnos,
                      partos: v.partos,
                      ultimoParto: v.ultimoPartoAborto,
                      ultimoServicio: v.ultimoServicio,
                      reproductor: v.reproductor
                    })
                  }
                  title="Haga click para ver la ficha completa del vientre"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{v.practico}</td>
                  )}
                  {isColVisible('especie') && (
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                        <span>
                          {v.especie === 'Aves de corral' ? '🐔' :
                           v.especie === 'Porcinos' ? '🐷' :
                           v.especie === 'Búfalos' ? '🐃' :
                           v.especie === 'Caprinos' ? '🐐' :
                           v.especie === 'Equinos' ? '🐴' : '🐮'}
                        </span>
                        <span>{v.especie || 'Bovinos'}</span>
                      </span>
                    </td>
                  )}
                  {isColVisible('unico') && <td>{v.unico}</td>}
                  {isColVisible('categoria') && <td>{v.categoria}</td>}
                  {isColVisible('estatus') && (
                    <td>
                      <span className={`badge-status ${v.estatus.toLowerCase()}`}>
                        {v.estatus}
                      </span>
                    </td>
                  )}
                  {isColVisible('estatusReproductivo') && (
                    <td>
                      <span
                        className="badge-category"
                        style={{
                          backgroundColor:
                            v.estatusReproductivo === 'Preñada'
                              ? '#dcfce7'
                              : v.estatusReproductivo === 'En espera'
                              ? '#fef9c3'
                              : '#fee2e2',
                          color:
                            v.estatusReproductivo === 'Preñada'
                              ? '#15803d'
                              : v.estatusReproductivo === 'En espera'
                              ? '#854d0e'
                              : '#991b1b'
                        }}
                      >
                        {v.estatusReproductivo}
                      </span>
                    </td>
                  )}
                  {isColVisible('estatusProductivo') && (
                    <td>
                      <span
                        className="badge-category"
                        style={{
                          backgroundColor:
                            v.estatusProductivo === 'Ordeño'
                              ? '#e0f2fe'
                              : v.estatusProductivo === 'Criando'
                              ? '#f3e8ff'
                              : '#f3f4f6',
                          color:
                            v.estatusProductivo === 'Ordeño'
                              ? '#0369a1'
                              : v.estatusProductivo === 'Criando'
                              ? '#6b21a8'
                              : '#4b5563'
                        }}
                      >
                        {v.estatusProductivo}
                      </span>
                    </td>
                  )}
                  {isColVisible('lote') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{v.lote}</span>
                    </td>
                  )}
                  {isColVisible('edadAnos') && <td>{v.edadAnos.toFixed(2)}</td>}
                  {isColVisible('partos') && <td>{v.partos || '-'}</td>}
                  {isColVisible('ultimoPartoAborto') && <td>{v.ultimoPartoAborto || '-'}</td>}
                  {isColVisible('ultimoServicio') && <td>{v.ultimoServicio || '-'}</td>}
                  {isColVisible('reproductor') && <td>{v.reproductor || '-'}</td>}
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
        totalRecords={filteredVientres.length}
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
      <VientresFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        availableCategorias={ALL_VIENTRES_CATEGORIAS}
        onReset={() =>
          setFilters({
            categorias: ALL_VIENTRES_CATEGORIAS,
            estatus: ['Activo'] as EstatusAnimal[],
            estatusReproductivo: ['Vacía', 'Preñada', 'En espera'] as EstatusReproductivo[],
            estatusProductivo: ['Criando', 'Ordeño', 'Seca', 'Lactancia', 'Postura', 'En Producción', 'Trabajo'] as EstatusProductivo[],
            lotes: ['01', 'ESCT', 'POT1', 'SEC1', 'TERM1', 'GALP-01', 'GALP-02', 'GALP-03', 'PIARA-01', 'CAB-01', 'APR-01', 'BUF-01']
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
