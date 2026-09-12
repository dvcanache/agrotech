import React from 'react';
import {
  EquipmentItem
} from '../equipmentData';
import {
  MapPin,
  User,
  Clock,
  Gauge,
  Wrench,
  Fuel,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  MoreVertical,
  Activity
} from 'lucide-react';

interface EquipmentTableProps {
  items: EquipmentItem[];
  selectedItems: { [key: string]: boolean };
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (codigo: string) => void;
  onOpenMaintenance: (equipo: EquipmentItem) => void;
  onOpenFuel: (equipo: EquipmentItem) => void;
  onViewDetails?: (equipo: EquipmentItem) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  items,
  selectedItems,
  isSelectAll,
  onToggleSelectAll,
  onToggleSelect,
  onOpenMaintenance,
  onOpenFuel,
  onViewDetails
}) => {
  const getStatusChipClass = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return 'operativo';
      case 'En labor':
        return 'en-labor';
      case 'En mantenimiento':
        return 'en-mantenimiento';
      case 'Fuera de servicio':
        return 'fuera-de-servicio';
      default:
        return 'operativo';
    }
  };

  const formatVariant = (equipo: EquipmentItem) => {
    const parts: string[] = [];
    if (equipo.variante.potenciaHp) {
      parts.push(`${equipo.variante.potenciaHp} HP`);
    }
    if (equipo.variante.traccion && equipo.variante.traccion !== 'N/A') {
      parts.push(equipo.variante.traccion);
    }
    if (equipo.variante.capacidad) {
      parts.push(equipo.variante.capacidad);
    }
    if (equipo.variante.combustible && equipo.variante.combustible !== 'N/A') {
      parts.push(equipo.variante.combustible);
    }
    return parts.length > 0 ? parts.join(' • ') : 'Estándar';
  };

  const getServiceStatus = (equipo: EquipmentItem) => {
    const current =
      equipo.unidadMedidaUso === 'Kilómetros' && equipo.odometroKm
        ? equipo.odometroKm
        : equipo.horometroActual;
    const remaining = equipo.proximoMantenimientoHorasKm - current;
    const unit = equipo.unidadMedidaUso === 'Kilómetros' ? 'km' : 'h';

    if (remaining <= 0) {
      return {
        type: 'alert',
        text: `¡Vencido (${Math.abs(remaining).toLocaleString()} ${unit})!`,
        due: `${equipo.proximoMantenimientoHorasKm.toLocaleString()} ${unit}`
      };
    } else if (remaining <= 25) {
      return {
        type: 'warning',
        text: `En ${remaining.toFixed(0)} ${unit}`,
        due: `${equipo.proximoMantenimientoHorasKm.toLocaleString()} ${unit}`
      };
    } else {
      return {
        type: 'ok',
        text: `En ${remaining.toFixed(0)} ${unit}`,
        due: `${equipo.proximoMantenimientoHorasKm.toLocaleString()} ${unit}`
      };
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <HelpCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          No se encontraron equipos
        </div>
        <div style={{ fontSize: 13, marginTop: 4 }}>
          Pruebe ajustando el término de búsqueda o cambiando el filtro de categoría/estado.
        </div>
      </div>
    );
  }

  return (
    <div className="equipment-table-wrapper">
      <table className="equipment-table">
        <thead>
          <tr>
            <th style={{ width: 42, textAlign: 'center' }}>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={isSelectAll}
                onChange={onToggleSelectAll}
                title="Seleccionar todos"
              />
            </th>
            <th>Código / Subtipo</th>
            <th>Marca y Modelo</th>
            <th>Variante Técnica</th>
            <th>Estado</th>
            <th>Uso Acumulado</th>
            <th>Ubicación</th>
            <th>Operador Asignado</th>
            <th>Próximo Servicio</th>
            <th style={{ textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(equipo => {
            const isSelected = !!selectedItems[equipo.codigo];
            const service = getServiceStatus(equipo);

            return (
              <tr
                key={equipo.codigo}
                className={isSelected ? 'selected' : ''}
                onClick={() => onViewDetails?.(equipo)}
              >
                <td
                  style={{ textAlign: 'center' }}
                  onClick={e => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(equipo.codigo)}
                  />
                </td>

                {/* Código / Subtipo */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="code-chip">{equipo.codigo}</span>
                      {equipo.placa && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 5px',
                          borderRadius: 4,
                          background: '#f1f5f9',
                          color: '#475569',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          {equipo.placa}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                      {equipo.subtipo}
                    </span>
                  </div>
                </td>

                {/* Marca y Modelo */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {equipo.nombre}
                    </span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                      {equipo.marca} • Mod. {equipo.modelo}
                    </span>
                  </div>
                </td>

                {/* Variante */}
                <td>
                  <span style={{ fontSize: 12, color: '#334155' }}>
                    {formatVariant(equipo)}
                  </span>
                </td>

                {/* Estado */}
                <td>
                  <span className={`status-chip ${getStatusChipClass(equipo.estado)}`}>
                    <span className="status-dot" />
                    {equipo.estado}
                  </span>
                </td>

                {/* Uso Acumulado */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {equipo.unidadMedidaUso === 'Kilómetros' ? (
                      <Gauge size={15} style={{ color: '#0284c7', flexShrink: 0 }} />
                    ) : (
                      <Clock size={15} style={{ color: '#2d6a4f', flexShrink: 0 }} />
                    )}
                    <div>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 700,
                        fontSize: 13
                      }}>
                        {equipo.unidadMedidaUso === 'Kilómetros'
                          ? `${equipo.odometroKm?.toLocaleString()} km`
                          : `${equipo.horometroActual.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Ubicación */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 500 }}>
                      {equipo.ubicacionAsignada}
                    </span>
                  </div>
                </td>

                {/* Operador */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <User size={14} style={{ color: '#6366f1', flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>
                      {equipo.operadorAsignado.split(' (')[0]}
                    </span>
                  </div>
                </td>

                {/* Próximo Servicio */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className={`service-chip ${service.type}`}>
                        {service.type === 'alert' && <AlertTriangle size={12} />}
                        {service.type === 'ok' && <CheckCircle2 size={12} />}
                        {service.text}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      Meta: {service.due}
                    </span>
                  </div>
                </td>

                {/* Acciones */}
                <td onClick={e => e.stopPropagation()}>
                  <div className="actions-cell-group" style={{ justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="action-btn-mini primary"
                      title="Registrar Mantenimiento"
                      onClick={() => onOpenMaintenance(equipo)}
                    >
                      <Wrench size={13} />
                      <span>Mant.</span>
                    </button>

                    {equipo.variante.combustible && equipo.variante.combustible !== 'N/A' && (
                      <button
                        type="button"
                        className="action-btn-mini fuel"
                        title="Cargar Combustible / Labor"
                        onClick={() => onOpenFuel(equipo)}
                      >
                        <Fuel size={13} />
                        <span>Diésel</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
