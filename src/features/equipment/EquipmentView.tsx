import React, { useState, useMemo } from 'react';
import {
  EQUIPMENT_MOCK_DATA,
  INITIAL_MAINTENANCE_LOG,
  INITIAL_FUEL_LOG,
  EquipmentItem,
  EquipmentCategory,
  OperationalState,
  MaintenanceRecord,
  FuelLaborRecord,
  calculateEquipmentKpis
} from './equipmentData';
import { EquipmentTable } from './components/EquipmentTable';
import { NuevoEquipoModal } from './components/NuevoEquipoModal';
import { MantenimientoModal } from './components/MantenimientoModal';
import { CombustibleLaborModal } from './components/CombustibleLaborModal';
import { ReportPagination } from '../reportes/components/ReportPagination';
import { exportToCSV, exportToPDF } from '../reportes/utils/exportUtils';
import './equipment.css';
import {
  Tractor,
  CheckCircle2,
  Wrench,
  Fuel,
  AlertTriangle,
  Plus,
  Search,
  FileSpreadsheet,
  Printer,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Gauge,
  User,
  Zap,
  DollarSign,
  Truck,
  Activity,
  X
} from 'lucide-react';

export const EquipmentView: React.FC = () => {
  // State
  const [equipos, setEquipos] = useState<EquipmentItem[]>(EQUIPMENT_MOCK_DATA);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE_LOG);
  const [fuelLogs, setFuelLogs] = useState<FuelLaborRecord[]>(INITIAL_FUEL_LOG);

  // Filters & Tabs
  const [activeCategory, setActiveCategory] = useState<'Todos' | EquipmentCategory>('Todos');
  const [activeTab, setActiveTab] = useState<'flota' | 'combustible' | 'mantenimientos'>('flota');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Modals state
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false);
  const [isMantenimientoModalOpen, setIsMantenimientoModalOpen] = useState(false);
  const [isCombustibleModalOpen, setIsCombustibleModalOpen] = useState(false);
  const [selectedEquipoForAction, setSelectedEquipoForAction] = useState<EquipmentItem | null>(null);

  // Details modal state
  const [inspectingEquipo, setInspectingEquipo] = useState<EquipmentItem | null>(null);

  // Selection
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered equipments
  const filteredEquipos = useMemo(() => {
    return equipos.filter(item => {
      // Category tab
      if (activeCategory !== 'Todos' && item.categoria !== activeCategory) {
        return false;
      }

      // Status dropdown
      if (statusFilter !== 'todos' && item.estado !== statusFilter) {
        return false;
      }

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          item.codigo.toLowerCase().includes(query) ||
          item.nombre.toLowerCase().includes(query) ||
          item.marca.toLowerCase().includes(query) ||
          item.modelo.toLowerCase().includes(query) ||
          item.subtipo.toLowerCase().includes(query) ||
          item.ubicacionAsignada.toLowerCase().includes(query) ||
          item.operadorAsignado.toLowerCase().includes(query) ||
          (item.placa && item.placa.toLowerCase().includes(query)) ||
          item.serialVin.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [equipos, activeCategory, statusFilter, searchTerm]);

  // Pagination slice for Flota
  const totalPages = Math.max(1, Math.ceil(filteredEquipos.length / pageSize));
  const currentEquipos = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredEquipos.slice(start, start + pageSize);
  }, [filteredEquipos, currentPage, totalPages]);

  // Selection handlers
  const isSelectAll =
    currentEquipos.length > 0 &&
    currentEquipos.every(item => !!selectedRows[item.codigo]);

  const handleToggleSelectAll = () => {
    if (isSelectAll) {
      const next = { ...selectedRows };
      currentEquipos.forEach(item => delete next[item.codigo]);
      setSelectedRows(next);
    } else {
      const next = { ...selectedRows };
      currentEquipos.forEach(item => {
        next[item.codigo] = true;
      });
      setSelectedRows(next);
    }
  };

  const handleToggleSelect = (codigo: string) => {
    setSelectedRows(prev => ({
      ...prev,
      [codigo]: !prev[codigo]
    }));
  };

  // KPIs
  const kpis = useMemo(() => {
    return calculateEquipmentKpis(equipos, fuelLogs);
  }, [equipos, fuelLogs]);

  // Counts per category for tabs
  const categoryCounts = useMemo(() => {
    return {
      Todos: equipos.length,
      Maquinaria: equipos.filter(e => e.categoria === 'Maquinaria').length,
      Vehículos: equipos.filter(e => e.categoria === 'Vehículos').length,
      Implementos: equipos.filter(e => e.categoria === 'Implementos').length,
      Estacionarios: equipos.filter(e => e.categoria === 'Estacionarios').length
    };
  }, [equipos]);

  // Modal Triggers
  const handleOpenMaintenance = (equipo?: EquipmentItem) => {
    setSelectedEquipoForAction(equipo || null);
    setIsMantenimientoModalOpen(true);
  };

  const handleOpenFuel = (equipo?: EquipmentItem) => {
    setSelectedEquipoForAction(equipo || null);
    setIsCombustibleModalOpen(true);
  };

  // Save new equipment
  const handleSaveNuevoEquipo = (nuevo: EquipmentItem) => {
    setEquipos(prev => [nuevo, ...prev]);
  };

  // Save maintenance
  const handleSaveMaintenance = (
    nuevoMnt: MaintenanceRecord,
    actualizacion?: {
      codigo: string;
      nuevoHorometro?: number;
      nuevoEstado?: string;
      nuevoProximoMantenimiento?: number;
      alertaMantenimiento?: boolean;
    }
  ) => {
    setMaintenanceLogs(prev => [nuevoMnt, ...prev]);

    if (actualizacion) {
      setEquipos(prev =>
        prev.map(item => {
          if (item.codigo === actualizacion.codigo) {
            const isKm = item.unidadMedidaUso === 'Kilómetros';
            return {
              ...item,
              estado: (actualizacion.nuevoEstado as OperationalState) || item.estado,
              horometroActual: !isKm && actualizacion.nuevoHorometro !== undefined ? actualizacion.nuevoHorometro : item.horometroActual,
              odometroKm: isKm && actualizacion.nuevoHorometro !== undefined ? actualizacion.nuevoHorometro : item.odometroKm,
              proximoMantenimientoHorasKm: actualizacion.nuevoProximoMantenimiento !== undefined ? actualizacion.nuevoProximoMantenimiento : item.proximoMantenimientoHorasKm,
              alertaMantenimiento: actualizacion.alertaMantenimiento !== undefined ? actualizacion.alertaMantenimiento : item.alertaMantenimiento,
              historialMantenimientos: [nuevoMnt, ...item.historialMantenimientos]
            };
          }
          return item;
        })
      );
    }
  };

  // Save fuel labor
  const handleSaveFuel = (
    nuevoReg: FuelLaborRecord,
    actualizacion?: {
      codigo: string;
      horasAgregadas?: number;
      nuevaUbicacion?: string;
    }
  ) => {
    setFuelLogs(prev => [nuevoReg, ...prev]);

    if (actualizacion) {
      setEquipos(prev =>
        prev.map(item => {
          if (item.codigo === actualizacion.codigo) {
            const added = actualizacion.horasAgregadas || 0;
            return {
              ...item,
              horometroActual: item.horometroActual + added,
              ubicacionAsignada: actualizacion.nuevaUbicacion || item.ubicacionAsignada,
              historialCombustible: [nuevoReg, ...item.historialCombustible]
            };
          }
          return item;
        })
      );
    }
  };

  // Exports
  const handleExportExcel = () => {
    const headers = [
      'Código',
      'Nombre',
      'Categoría',
      'Subtipo',
      'Marca',
      'Modelo',
      'Estado',
      'Uso Actual',
      'Unidad',
      'Ubicación',
      'Operador',
      'Próximo Servicio',
      'Año'
    ];
    const rows = filteredEquipos.map(e => [
      e.codigo,
      e.nombre,
      e.categoria,
      e.subtipo,
      e.marca,
      e.modelo,
      e.estado,
      e.unidadMedidaUso === 'Kilómetros' ? e.odometroKm : e.horometroActual,
      e.unidadMedidaUso,
      e.ubicacionAsignada,
      e.operadorAsignado,
      e.proximoMantenimientoHorasKm,
      e.variante.ano || 'N/A'
    ]);
    exportToCSV('inventario_maquinaria_equipos', headers, rows);
  };

  const handleExportPdf = () => {
    const headers = ['Código', 'Equipo / Modelo', 'Categoría', 'Estado', 'Uso Acumulado', 'Ubicación', 'Próximo Servicio'];
    const rows = filteredEquipos.map(e => [
      e.codigo,
      `${e.nombre} (${e.marca})`,
      e.categoria,
      e.estado,
      e.unidadMedidaUso === 'Kilómetros' ? `${e.odometroKm} km` : `${e.horometroActual} h`,
      e.ubicacionAsignada,
      `${e.proximoMantenimientoHorasKm} ${e.unidadMedidaUso === 'Kilómetros' ? 'km' : 'h'}`
    ]);
    exportToPDF('inventario_maquinaria_equipos', 'Inventario General de Maquinaria y Equipos', headers, rows);
  };

  return (
    <div className="equipment-container">
      {/* Header */}
      <div className="equipment-header">
        <div className="equipment-header-left">
          <div className="equipment-title-row">
            <div className="equipment-title-icon">
              <Tractor size={24} />
            </div>
            <div>
              <h1 className="equipment-main-title">Maquinaria, Vehículos, Implementos y Combustible</h1>
              <span className="equipment-subtitle">
                Gestión de parque mecanizado, horómetros, labores de campo, bitácora de diésel y mantenimiento preventivo
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="equipment-header-actions">
          <button
            type="button"
            className="btn-amber-action"
            onClick={() => handleOpenMaintenance()}
            title="Registrar servicio preventivo o reparación"
          >
            <Wrench size={16} />
            <span>Registrar Mantenimiento</span>
          </button>

          <button
            type="button"
            className="btn-blue-icon"
            onClick={() => handleOpenFuel()}
            title="Registrar consumo de combustible y labor agronómica"
            style={{ borderRadius: 20, padding: '7px 18px' }}
          >
            <Fuel size={16} />
            <span>Cargar Combustible</span>
          </button>

          <button
            type="button"
            className="btn-green-export"
            onClick={() => setIsNuevoModalOpen(true)}
            style={{ borderRadius: 20, padding: '7px 18px' }}
          >
            <Plus size={16} />
            <span>+ Nuevo Equipo</span>
          </button>

          <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
            <button
              type="button"
              className="action-btn-mini"
              onClick={handleExportExcel}
              title="Exportar a CSV / Excel"
            >
              <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />
            </button>
            <button
              type="button"
              className="action-btn-mini"
              onClick={handleExportPdf}
              title="Imprimir / Exportar a PDF"
            >
              <Printer size={15} style={{ color: '#0284c7' }} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="equipment-kpi-grid">
        {/* Total Equipos */}
        <div className="equipment-kpi-card">
          <div className="equipment-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
            <Tractor size={24} />
          </div>
          <div className="equipment-kpi-info">
            <span className="equipment-kpi-label">Total Unidades</span>
            <span className="equipment-kpi-value">{kpis.totalEquipos}</span>
            <span className="equipment-kpi-sub">Flota registrada activa</span>
          </div>
        </div>

        {/* Operativos */}
        <div className="equipment-kpi-card">
          <div className="equipment-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="equipment-kpi-info">
            <span className="equipment-kpi-label">Operativos / En Labor</span>
            <span className="equipment-kpi-value">
              {kpis.operativos + kpis.enLabor}
            </span>
            <span className="equipment-kpi-sub" style={{ color: '#059669', fontWeight: 600 }}>
              {Math.round(((kpis.operativos + kpis.enLabor) / (kpis.totalEquipos || 1)) * 100)}% disponibilidad
            </span>
          </div>
        </div>

        {/* En Mantenimiento */}
        <div className="equipment-kpi-card">
          <div className="equipment-kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Wrench size={24} />
          </div>
          <div className="equipment-kpi-info">
            <span className="equipment-kpi-label">En Mantenimiento</span>
            <span className="equipment-kpi-value">{kpis.enMantenimiento}</span>
            <span className="equipment-kpi-sub">
              {kpis.fueraDeServicio > 0 ? `+${kpis.fueraDeServicio} fuera de servicio` : 'Parada técnica'}
            </span>
          </div>
        </div>

        {/* Consumo Diésel Mensual */}
        <div className="equipment-kpi-card">
          <div className="equipment-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Fuel size={24} />
          </div>
          <div className="equipment-kpi-info">
            <span className="equipment-kpi-label">Consumo Diésel L</span>
            <span className="equipment-kpi-value">{kpis.consumoDieselMensualL.toFixed(1)} L</span>
            <span className="equipment-kpi-sub">
              {kpis.horasTotalesTrabajadas > 0
                ? `${(kpis.consumoDieselMensualL / kpis.horasTotalesTrabajadas).toFixed(1)} L/h prom. labores`
                : 'Mes en curso'}
            </span>
          </div>
        </div>

        {/* Mantenimientos Pendientes */}
        <div className="equipment-kpi-card">
          <div className="equipment-kpi-icon" style={{
            backgroundColor: kpis.mantenimientosPendientes > 0 ? '#fef2f2' : '#f0fdf4',
            color: kpis.mantenimientosPendientes > 0 ? '#dc2626' : '#16a34a'
          }}>
            <AlertTriangle size={24} />
          </div>
          <div className="equipment-kpi-info">
            <span className="equipment-kpi-label">Mant. Próximos / Venc.</span>
            <span className="equipment-kpi-value" style={{
              color: kpis.mantenimientosPendientes > 0 ? '#dc2626' : 'inherit'
            }}>
              {kpis.mantenimientosPendientes}
            </span>
            <span className="equipment-kpi-sub" style={{
              color: kpis.mantenimientosPendientes > 0 ? '#b91c1c' : '#15803d',
              fontWeight: 600
            }}>
              {kpis.mantenimientosPendientes > 0 ? '¡Requieren atención!' : 'Ciclos al día'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls & Filter Panel */}
      <div className="equipment-controls-panel">
        <div className="equipment-controls-top">
          {/* Category Tabs */}
          <div className="category-filter-tabs">
            {(['Todos', 'Maquinaria', 'Vehículos', 'Implementos', 'Estacionarios'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
              >
                <span>{cat}</span>
                <span className="category-tab-count">{categoryCounts[cat]}</span>
              </button>
            ))}
          </div>

          {/* Search bar & status filter */}
          <div className="equipment-filter-bar">
            <div className="equipment-search-wrapper">
              <Search size={16} className="equipment-search-icon" />
              <input
                type="text"
                placeholder="Buscar por código, modelo, operador, potrero..."
                className="equipment-search-input"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="equipment-select-filter"
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="todos">Todos los Estados</option>
              <option value="Operativo">Operativo</option>
              <option value="En labor">En labor</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="Fuera de servicio">Fuera de servicio</option>
            </select>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`view-mode-tab ${activeTab === 'flota' ? 'active' : ''}`}
            onClick={() => setActiveTab('flota')}
          >
            <Layers size={16} />
            <span>Flota e Inventario General ({filteredEquipos.length})</span>
          </button>

          <button
            type="button"
            className={`view-mode-tab ${activeTab === 'combustible' ? 'active' : ''}`}
            onClick={() => setActiveTab('combustible')}
          >
            <Fuel size={16} />
            <span>Bitácora de Labores y Combustible ({fuelLogs.length})</span>
          </button>

          <button
            type="button"
            className={`view-mode-tab ${activeTab === 'mantenimientos' ? 'active' : ''}`}
            onClick={() => setActiveTab('mantenimientos')}
          >
            <Wrench size={16} />
            <span>Historial de Mantenimientos ({maintenanceLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content by Tab */}
      {activeTab === 'flota' && (
        <div className="equipment-table-card">
          <EquipmentTable
            items={currentEquipos}
            selectedItems={selectedRows}
            isSelectAll={isSelectAll}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelect={handleToggleSelect}
            onOpenMaintenance={handleOpenMaintenance}
            onOpenFuel={handleOpenFuel}
            onViewDetails={eq => setInspectingEquipo(eq)}
          />

          <ReportPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredEquipos.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Sub-view 2: Fuel & Labors Log */}
      {activeTab === 'combustible' && (
        <div className="equipment-table-card">
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Equipo Motriz</th>
                  <th>Implemento</th>
                  <th>Potrero / Parcela</th>
                  <th>Labor Agronómica</th>
                  <th>Horas</th>
                  <th>Hectáreas</th>
                  <th>Combustible</th>
                  <th>Eficiencia</th>
                  <th>Operador</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map(log => {
                  const eq = equipos.find(e => e.codigo === log.equipoCodigo);
                  const imp = log.implementoCodigo ? equipos.find(e => e.codigo === log.implementoCodigo) : null;

                  return (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{log.fecha}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="code-chip">{log.equipoCodigo}</span>
                          <span style={{ fontSize: 12.5, fontWeight: 500 }}>{eq?.nombre || log.equipoCodigo}</span>
                        </div>
                      </td>
                      <td>
                        {imp ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="code-chip" style={{ background: '#f8fafc', color: '#475569' }}>{imp.codigo}</span>
                            <span style={{ fontSize: 12 }}>{imp.nombre}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} style={{ color: '#16a34a' }} />
                          <span style={{ fontSize: 12.5 }}>{log.potreroId}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{log.labor}</span>
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                        {log.horasTrabajadas} h
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {log.hectareasTrabajadas ? `${log.hectareasTrabajadas} ha` : '—'}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#2563eb' }}>
                        {log.litrosCombustible} L
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 6,
                          backgroundColor: '#f0fdf4',
                          color: '#15803d',
                          fontWeight: 700,
                          fontSize: 12,
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          {log.eficienciaCalculada}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <User size={13} style={{ color: '#6366f1' }} />
                          <span style={{ fontSize: 12 }}>{log.operador.split(' (')[0]}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-view 3: Maintenance History */}
      {activeTab === 'mantenimientos' && (
        <div className="equipment-table-card">
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Equipo</th>
                  <th>Tipo de Servicio</th>
                  <th>Horómetro / Km</th>
                  <th>Costo (USD)</th>
                  <th>Repuestos & Fluidos</th>
                  <th>Técnico / Taller</th>
                  <th>Diagnóstico & Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceLogs.map(mnt => {
                  const eq = equipos.find(e => e.codigo === mnt.equipoCodigo);

                  return (
                    <tr key={mnt.id}>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{mnt.fecha}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="code-chip">{mnt.equipoCodigo}</span>
                          <span style={{ fontSize: 12.5, fontWeight: 500 }}>{eq?.nombre || mnt.equipoCodigo}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 6,
                          backgroundColor: mnt.tipo.includes('250') ? '#ecfdf5' : '#fffbeb',
                          color: mnt.tipo.includes('250') ? '#065f46' : '#b45309',
                          fontWeight: 600,
                          fontSize: 12
                        }}>
                          {mnt.tipo}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                        {mnt.horometroKmAlServicio.toLocaleString()}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#059669' }}>
                        ${mnt.costoUsd}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {mnt.repuestosReemplazados.map((rep, idx) => (
                            <span key={idx} style={{
                              fontSize: 11,
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 6px',
                              borderRadius: 4
                            }}>
                              {rep}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{mnt.tecnicoResponsable}</span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>{mnt.taller}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: '#475569' }}>{mnt.observaciones}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment Details Modal (Drawer) */}
      {inspectingEquipo && (
        <div className="equipment-modal-overlay" onClick={() => setInspectingEquipo(null)}>
          <div className="equipment-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="equipment-modal-header">
              <div className="equipment-modal-header-info">
                <div className="equipment-modal-icon-badge">
                  <Tractor size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="code-chip">{inspectingEquipo.codigo}</span>
                    <h3 className="equipment-modal-title">{inspectingEquipo.nombre}</h3>
                  </div>
                  <p className="equipment-modal-desc">{inspectingEquipo.subtipo} • {inspectingEquipo.marca}</p>
                </div>
              </div>
              <button
                type="button"
                className="equipment-modal-close-btn"
                onClick={() => setInspectingEquipo(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="equipment-modal-body" style={{ gap: 16 }}>
              {/* Technical Specifications Grid */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12
              }}>
                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Estado Actual</span>
                  <div style={{ marginTop: 2 }}>
                    <span className={`status-chip ${inspectingEquipo.estado.toLowerCase().replace(/ /g, '-')}`}>
                      {inspectingEquipo.estado}
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Ubicación Asignada</span>
                  <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MapPin size={14} style={{ color: '#16a34a' }} />
                    {inspectingEquipo.ubicacionAsignada}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Uso Acumulado</span>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                    {inspectingEquipo.unidadMedidaUso === 'Kilómetros'
                      ? `${inspectingEquipo.odometroKm?.toLocaleString()} km`
                      : `${inspectingEquipo.horometroActual} horas`}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Próximo Servicio</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#2d6a4f', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                    {inspectingEquipo.proximoMantenimientoHorasKm} {inspectingEquipo.unidadMedidaUso === 'Kilómetros' ? 'km' : 'h'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Operador Responsable</span>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>
                    {inspectingEquipo.operadorAsignado}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Serial / VIN</span>
                  <div style={{ fontSize: 12.5, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                    {inspectingEquipo.serialVin}
                  </div>
                </div>
              </div>

              {/* Variant Specs */}
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  Especificaciones y Variante
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  fontSize: 12.5
                }}>
                  {inspectingEquipo.variante.potenciaHp && (
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 8 }}>
                      <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Potencia</span>
                      <strong>{inspectingEquipo.variante.potenciaHp} HP</strong>
                    </div>
                  )}
                  {inspectingEquipo.variante.traccion && (
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 8 }}>
                      <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Tracción</span>
                      <strong>{inspectingEquipo.variante.traccion}</strong>
                    </div>
                  )}
                  {inspectingEquipo.variante.combustible && (
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 8 }}>
                      <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Combustible</span>
                      <strong>{inspectingEquipo.variante.combustible}</strong>
                    </div>
                  )}
                  {inspectingEquipo.variante.capacidad && (
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 8, gridColumn: 'span 2' }}>
                      <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Capacidad / Implemento</span>
                      <strong>{inspectingEquipo.variante.capacidad}</strong>
                    </div>
                  )}
                  {inspectingEquipo.variante.ano && (
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 8 }}>
                      <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Año</span>
                      <strong>{inspectingEquipo.variante.ano}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick action buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn-amber-action"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setInspectingEquipo(null);
                    handleOpenMaintenance(inspectingEquipo);
                  }}
                >
                  <Wrench size={16} />
                  <span>Mantenimiento</span>
                </button>

                {inspectingEquipo.variante.combustible && inspectingEquipo.variante.combustible !== 'N/A' && (
                  <button
                    type="button"
                    className="btn-blue-icon"
                    style={{ flex: 1, justifyContent: 'center', borderRadius: 20 }}
                    onClick={() => {
                      setInspectingEquipo(null);
                      handleOpenFuel(inspectingEquipo);
                    }}
                  >
                    <Fuel size={16} />
                    <span>Cargar Diésel / Labor</span>
                  </button>
                )}
              </div>
            </div>

            <div className="equipment-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setInspectingEquipo(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <NuevoEquipoModal
        isOpen={isNuevoModalOpen}
        onClose={() => setIsNuevoModalOpen(false)}
        onSave={handleSaveNuevoEquipo}
      />

      <MantenimientoModal
        isOpen={isMantenimientoModalOpen}
        onClose={() => setIsMantenimientoModalOpen(false)}
        equipos={equipos}
        preselectedEquipo={selectedEquipoForAction}
        onSave={handleSaveMaintenance}
      />

      <CombustibleLaborModal
        isOpen={isCombustibleModalOpen}
        onClose={() => setIsCombustibleModalOpen(false)}
        equipos={equipos}
        preselectedEquipo={selectedEquipoForAction}
        onSave={handleSaveFuel}
      />
    </div>
  );
};
