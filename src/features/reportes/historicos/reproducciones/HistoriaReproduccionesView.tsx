import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaHistoricoModal, HistoricoModalData } from '../components/FichaHistoricoModal';
import { ReproduccionesFilterDrawer, ReproduccionesFilterValues } from '../components/ReproduccionesFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_HISTORIA_REPRODUCCIONES } from '../historicosMockData';
import { ReproduccionHistoricoEntity } from '../../../../types2/entities';
import { EstatusAnimal, TipoEventoReproductivo } from '../../../../types2/common';

export const HistoriaReproduccionesView: React.FC = () => {
  const [eventos] = useState<ReproduccionHistoricoEntity[]>(MOCK_HISTORIA_REPRODUCCIONES);

  const [selectedRecord, setSelectedRecord] = useState<HistoricoModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof ReproduccionHistoricoEntity>('fechaEvento');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'loteActual', label: 'Lote', visible: true },
    { key: 'eventoNumero', label: 'No. Evento', visible: true },
    { key: 'tipoEvento', label: 'Tipo Evento', visible: true },
    { key: 'subtipoEvento', label: 'Subtipo', visible: true },
    { key: 'fechaEvento', label: 'Fecha', visible: true },
    { key: 'tecnicoResponsable', label: 'Técnico Responsable', visible: true },
    { key: 'machosVivos', label: 'Machos', visible: true },
    { key: 'hembrasVivas', label: 'Hembras', visible: true },
    { key: 'reproductor', label: 'Reproductor', visible: true },
    { key: 'diagnostico', label: 'Diagnóstico', visible: true },
    { key: 'tratamiento', label: 'Tratamiento', visible: true },
    { key: 'rebano', label: 'Rebaño', visible: false }
  ]);

  const [filters, setFilters] = useState<ReproduccionesFilterValues>({
    desde: undefined,
    hasta: undefined,
    tipoEvento: ['Parto', 'Servicio', 'Revisión', 'Aborto', 'Celo', 'Embrión'] as TipoEventoReproductivo[],
    estatus: ['Activo'] as EstatusAnimal[],
    categorias: ['Vaca', 'Novilla'],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.desde || filters.hasta) count++;
    if (filters.tipoEvento.length < 6) count++;
    if (filters.estatus.length < 3) count++;
    if (filters.categorias.length < 2) count++;
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

  const handleSort = (field: keyof ReproduccionHistoricoEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredEventos = useMemo(() => {
    return eventos
      .filter(item => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.practico.toLowerCase().includes(q) || item.unico.toLowerCase().includes(q);
          const matchTec = item.tecnicoResponsable.toLowerCase().includes(q);
          const matchRep = (item.reproductor || '').toLowerCase().includes(q);
          const matchLot = item.loteActual.toLowerCase().includes(q);
          if (!matchCode && !matchTec && !matchRep && !matchLot) return false;
        }

        if (filters.desde && item.fechaEvento < filters.desde) return false;
        if (filters.hasta && item.fechaEvento > filters.hasta) return false;
        if (!filters.tipoEvento.includes(item.tipoEvento)) return false;
        if (!filters.estatus.includes(item.estatus)) return false;
        if (!filters.categorias.includes(item.categoria as 'Novilla' | 'Vaca')) return false;
        if (!filters.lotes.includes(item.loteActual)) return false;

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
  }, [eventos, searchQuery, filters, sortField, sortAsc]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredEventos.length / pageSize) || 1;
  const paginatedEventos = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredEventos.slice(start, start + pageSize);
  }, [filteredEventos, currentPage, totalPages, pageSize]);

  // KPIs
  const kpiStats = useMemo(() => {
    const total = filteredEventos.length;
    const partos = filteredEventos.filter(e => e.tipoEvento === 'Parto').length;
    const servicios = filteredEventos.filter(e => e.tipoEvento === 'Servicio').length;
    const revisiones = filteredEventos.filter(e => e.tipoEvento === 'Revisión').length;
    return { total, partos, servicios, revisiones };
  }, [filteredEventos]);

  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Lote Actual',
      'No. Evento',
      'Tipo de Evento',
      'Subtipo',
      'Fecha Evento',
      'Técnico Responsable',
      'Machos Vivos',
      'Hembras Vivas',
      'Reproductor',
      'Diagnóstico',
      'Tratamiento',
      'Rebaño'
    ];
    const rows = filteredEventos.map(e => [
      e.practico,
      e.unico,
      e.categoria,
      e.estatus,
      e.loteActual,
      e.eventoNumero,
      e.tipoEvento,
      e.subtipoEvento || '',
      e.fechaEvento,
      e.tecnicoResponsable,
      e.machosVivos,
      e.hembrasVivas,
      e.reproductor || '',
      e.diagnostico || '',
      e.tratamiento || '',
      e.rebano
    ]);
    exportToCSV('reporte_historia_reproducciones', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  const getTipoEventoColor = (tipo: TipoEventoReproductivo) => {
    switch (tipo) {
      case 'Parto':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'Servicio':
        return { bg: '#eff6ff', text: '#1d4ed8' };
      case 'Revisión':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'Aborto':
        return { bg: '#fee2e2', text: '#b91c1c' };
      case 'Celo':
        return { bg: '#fdf4ff', text: '#a21caf' };
      case 'Embrión':
        return { bg: '#f0fdfa', text: '#0f766e' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Historia de reproducciones"
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
              placeholder="Buscar por animal, técnico o toro..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        }
      />

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 16
        }}
      >
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Eventos</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{kpiStats.total}</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Partos Registrados</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{kpiStats.partos}</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Servicios / IATF</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{kpiStats.servicios}</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Revisiones Ginecológicas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>{kpiStats.revisiones}</div>
        </div>
      </div>

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
              {isColVisible('loteActual') && (
                <th onClick={() => handleSort('loteActual')}>
                  <div className="th-content">
                    <span>Lote</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('eventoNumero') && <th>No.</th>}
              {isColVisible('tipoEvento') && (
                <th onClick={() => handleSort('tipoEvento')}>
                  <div className="th-content">
                    <span>Tipo Evento</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('subtipoEvento') && <th>Subtipo</th>}
              {isColVisible('fechaEvento') && (
                <th onClick={() => handleSort('fechaEvento')}>
                  <div className="th-content">
                    <span>Fecha</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('tecnicoResponsable') && <th>Técnico</th>}
              {isColVisible('machosVivos') && <th>Machos</th>}
              {isColVisible('hembrasVivas') && <th>Hembras</th>}
              {isColVisible('reproductor') && <th>Reproductor</th>}
              {isColVisible('diagnostico') && <th>Diagnóstico</th>}
              {isColVisible('tratamiento') && <th>Tratamiento</th>}
              {isColVisible('rebano') && <th>Rebaño</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedEventos.length === 0 ? (
              <tr>
                <td colSpan={16} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún evento reproductivo encontrado
                </td>
              </tr>
            ) : (
              paginatedEventos.map((e, idx) => {
                const colorBadge = getTipoEventoColor(e.tipoEvento);
                return (
                  <tr
                    key={`${e.practico}-${e.eventoNumero}-${idx}`}
                    onClick={() =>
                      setSelectedRecord({
                        tipo: 'reproduccion',
                        titulo: `Evento Reproductivo: ${e.tipoEvento}`,
                        practico: e.practico,
                        unico: e.unico,
                        categoria: e.categoria,
                        estatus: e.estatus,
                        lote: e.loteActual,
                        fecha: e.fechaEvento,
                        observaciones: e.diagnostico || e.tratamiento,
                        detalles: [
                          { label: 'Tipo de Evento', value: e.tipoEvento },
                          { label: 'Subtipo', value: e.subtipoEvento },
                          { label: 'No. Evento', value: e.eventoNumero },
                          { label: 'Técnico Responsable', value: e.tecnicoResponsable },
                          { label: 'Reproductor / Semen', value: e.reproductor },
                          { label: 'Crías Machos Vivos', value: e.machosVivos },
                          { label: 'Crías Hembras Vivas', value: e.hembrasVivas },
                          { label: 'Rebaño', value: e.rebano }
                        ]
                      })
                    }
                    title="Haga click para ver detalles del evento"
                  >
                    {isColVisible('practico') && (
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{e.practico}</td>
                    )}
                    {isColVisible('unico') && <td>{e.unico}</td>}
                    {isColVisible('categoria') && <td>{e.categoria}</td>}
                    {isColVisible('estatus') && (
                      <td>
                        <span className={`badge-status ${e.estatus.toLowerCase()}`}>
                          {e.estatus}
                        </span>
                      </td>
                    )}
                    {isColVisible('loteActual') && (
                      <td>
                        <span style={{ fontWeight: 600, color: '#166534' }}>{e.loteActual}</span>
                      </td>
                    )}
                    {isColVisible('eventoNumero') && <td>#{e.eventoNumero}</td>}
                    {isColVisible('tipoEvento') && (
                      <td>
                        <span
                          className="badge-category"
                          style={{
                            backgroundColor: colorBadge.bg,
                            color: colorBadge.text,
                            fontWeight: 700
                          }}
                        >
                          {e.tipoEvento}
                        </span>
                      </td>
                    )}
                    {isColVisible('subtipoEvento') && <td>{e.subtipoEvento || '-'}</td>}
                    {isColVisible('fechaEvento') && (
                      <td style={{ fontWeight: 600 }}>{e.fechaEvento}</td>
                    )}
                    {isColVisible('tecnicoResponsable') && <td>{e.tecnicoResponsable}</td>}
                    {isColVisible('machosVivos') && <td>{e.machosVivos}</td>}
                    {isColVisible('hembrasVivas') && <td>{e.hembrasVivas}</td>}
                    {isColVisible('reproductor') && <td>{e.reproductor || '-'}</td>}
                    {isColVisible('diagnostico') && (
                      <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {e.diagnostico || '-'}
                      </td>
                    )}
                    {isColVisible('tratamiento') && (
                      <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {e.tratamiento || '-'}
                      </td>
                    )}
                    {isColVisible('rebano') && <td>{e.rebano}</td>}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredEventos.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Ficha Histórico */}
      <FichaHistoricoModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        data={selectedRecord}
      />

      {/* Drawer Filtros */}
      <ReproduccionesFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            desde: undefined,
            hasta: undefined,
            tipoEvento: ['Parto', 'Servicio', 'Revisión', 'Aborto', 'Celo', 'Embrión'],
            estatus: ['Activo'] as EstatusAnimal[],
            categorias: ['Vaca', 'Novilla'],
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
