import React, { useState, useEffect } from 'react';
import {
  X,
  Wrench,
  Check,
  Calendar,
  DollarSign,
  User,
  Clock,
  AlertCircle,
  Package
} from 'lucide-react';
import {
  EquipmentItem,
  MaintenanceRecord,
  MaintenanceType,
  OPERATORS_OPTIONS
} from '../equipmentData';

interface MantenimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipos: EquipmentItem[];
  preselectedEquipo?: EquipmentItem | null;
  onSave: (
    nuevoMantenimiento: MaintenanceRecord,
    actualizarEquipo?: {
      codigo: string;
      nuevoHorometro?: number;
      nuevoEstado?: string;
      nuevoProximoMantenimiento?: number;
      alertaMantenimiento?: boolean;
    }
  ) => void;
}

export const MantenimientoModal: React.FC<MantenimientoModalProps> = ({
  isOpen,
  onClose,
  equipos,
  preselectedEquipo,
  onSave
}) => {
  const [selectedCodigo, setSelectedCodigo] = useState<string>(
    preselectedEquipo ? preselectedEquipo.codigo : (equipos[0]?.codigo || '')
  );

  const targetEquipo = equipos.find(e => e.codigo === selectedCodigo);

  const [formData, setFormData] = useState({
    tipo: 'Preventivo 250h' as MaintenanceType,
    fecha: new Date().toISOString().split('T')[0],
    horometroKmAlServicio: 0,
    costoUsd: 280,
    repuestosTexto: 'Filtro Aceite Motor, Aceite Diésel 15W40 (16L), Filtro Combustible Primario',
    tecnicoResponsable: OPERATORS_OPTIONS[3] || 'José Colmenares (Mecánico / Operador)',
    taller: 'Taller Central AgroTech',
    observaciones: 'Servicio preventivo regular. Limpieza de radiador, chequeo de mangueras y engrase general.',
    resetNextService: true,
    setOperativo: true
  });

  useEffect(() => {
    if (preselectedEquipo) {
      setSelectedCodigo(preselectedEquipo.codigo);
      const isKm = preselectedEquipo.unidadMedidaUso === 'Kilómetros';
      const current = isKm && preselectedEquipo.odometroKm ? preselectedEquipo.odometroKm : preselectedEquipo.horometroActual;
      setFormData(prev => ({
        ...prev,
        horometroKmAlServicio: current
      }));
    } else if (targetEquipo) {
      const isKm = targetEquipo.unidadMedidaUso === 'Kilómetros';
      const current = isKm && targetEquipo.odometroKm ? targetEquipo.odometroKm : targetEquipo.horometroActual;
      setFormData(prev => ({
        ...prev,
        horometroKmAlServicio: current
      }));
    }
  }, [preselectedEquipo, selectedCodigo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCodigo) {
      alert('Seleccione un equipo.');
      return;
    }

    const repuestos = formData.repuestosTexto
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const mntRecord: MaintenanceRecord = {
      id: `MNT-${Date.now().toString().slice(-4)}`,
      equipoCodigo: selectedCodigo,
      fecha: formData.fecha,
      tipo: formData.tipo,
      horometroKmAlServicio: Number(formData.horometroKmAlServicio),
      costoUsd: Number(formData.costoUsd),
      repuestosReemplazados: repuestos,
      tecnicoResponsable: formData.tecnicoResponsable,
      taller: formData.taller,
      observaciones: formData.observaciones
    };

    let actualizacion;
    if (targetEquipo) {
      const interval = targetEquipo.intervaloMantenimientoHoras;
      const isKm = targetEquipo.unidadMedidaUso === 'Kilómetros';
      const addedInterval = isKm ? interval * 10 : interval;

      actualizacion = {
        codigo: selectedCodigo,
        nuevoHorometro: Number(formData.horometroKmAlServicio),
        nuevoEstado: formData.setOperativo ? 'Operativo' : targetEquipo.estado,
        nuevoProximoMantenimiento: formData.resetNextService
          ? Number(formData.horometroKmAlServicio) + addedInterval
          : targetEquipo.proximoMantenimientoHorasKm,
        alertaMantenimiento: formData.resetNextService ? false : targetEquipo.alertaMantenimiento
      };
    }

    onSave(mntRecord, actualizacion);
    onClose();
  };

  return (
    <div className="equipment-modal-overlay" onClick={onClose}>
      <div className="equipment-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="equipment-modal-header">
          <div className="equipment-modal-header-info">
            <div className="equipment-modal-icon-badge" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
              <Wrench size={22} />
            </div>
            <div>
              <h3 className="equipment-modal-title">Registrar Mantenimiento o Reparación</h3>
              <p className="equipment-modal-desc">
                Bitácora de servicios preventivos (250h/500h), correctivos, repuestos y costos
              </p>
            </div>
          </div>
          <button type="button" className="equipment-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="equipment-modal-body">
            {/* Equipment Selector */}
            <div className="form-field">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, display: 'block' }}>
                Equipo o Maquinaria Intervenida *
              </label>
              <select
                className="form-select"
                value={selectedCodigo}
                onChange={e => setSelectedCodigo(e.target.value)}
                style={{ fontSize: 13.5, fontWeight: 500 }}
              >
                {equipos.map(eq => (
                  <option key={eq.codigo} value={eq.codigo}>
                    [{eq.codigo}] {eq.nombre} — {eq.estado} ({eq.unidadMedidaUso === 'Kilómetros' ? `${eq.odometroKm} km` : `${eq.horometroActual} h`})
                  </option>
                ))}
              </select>
            </div>

            {targetEquipo && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12.5
              }}>
                <div>
                  <span style={{ color: '#64748b' }}>Ubicación: </span>
                  <span style={{ fontWeight: 600 }}>{targetEquipo.ubicacionAsignada}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Horómetro/Km actual: </span>
                  <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    {targetEquipo.unidadMedidaUso === 'Kilómetros'
                      ? `${targetEquipo.odometroKm} km`
                      : `${targetEquipo.horometroActual} h`}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Próximo estipulado: </span>
                  <span style={{ fontWeight: 700, color: '#2d6a4f', fontFamily: 'JetBrains Mono, monospace' }}>
                    {targetEquipo.proximoMantenimientoHorasKm} {targetEquipo.unidadMedidaUso === 'Kilómetros' ? 'km' : 'h'}
                  </span>
                </div>
              </div>
            )}

            {/* Type & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Tipo de Mantenimiento *
                </label>
                <select
                  className="form-select"
                  value={formData.tipo}
                  onChange={e => setFormData({ ...formData, tipo: e.target.value as MaintenanceType })}
                >
                  <option value="Preventivo 250h">Preventivo 250 Horas (Fluidos Básicos & Filtros)</option>
                  <option value="Preventivo 500h">Preventivo 500 Horas (Aceite Hidráulico & Transmisión)</option>
                  <option value="Preventivo 1000h">Preventivo 1,000 Horas / Anual Mayor</option>
                  <option value="Calibración / Engrase">Calibración / Engrase y Rodamientos</option>
                  <option value="Correctivo">Correctivo / Reparación de Falla</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Fecha de la Intervención *
                </label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={formData.fecha}
                  onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
            </div>

            {/* Horometro at service & Cost */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Horómetro / Km al Servicio *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="form-input"
                  value={formData.horometroKmAlServicio}
                  onChange={e => setFormData({ ...formData, horometroKmAlServicio: parseFloat(e.target.value) || 0 })}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Costo Total del Servicio (USD) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  className="form-input"
                  value={formData.costoUsd}
                  onChange={e => setFormData({ ...formData, costoUsd: parseFloat(e.target.value) || 0 })}
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                />
              </div>
            </div>

            {/* Responsible technician & Workshop */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Técnico o Mecánico Responsable
                </label>
                <input
                  type="text"
                  placeholder="ej. José Colmenares"
                  className="form-input"
                  value={formData.tecnicoResponsable}
                  onChange={e => setFormData({ ...formData, tecnicoResponsable: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Taller o Centro de Servicio
                </label>
                <input
                  type="text"
                  placeholder="ej. Taller Central AgroTech"
                  className="form-input"
                  value={formData.taller}
                  onChange={e => setFormData({ ...formData, taller: e.target.value })}
                />
              </div>
            </div>

            {/* Replaced Parts */}
            <div className="form-field">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                Repuestos e Insumos Reemplazados (separados por comas)
              </label>
              <textarea
                rows={2}
                className="form-input"
                placeholder="Filtro aceite motor RE504836, Aceite 15W40 (16L), Filtro diésel primario, etc."
                value={formData.repuestosTexto}
                onChange={e => setFormData({ ...formData, repuestosTexto: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Observations */}
            <div className="form-field">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                Observaciones Técnicas y Diagnóstico
              </label>
              <textarea
                rows={2}
                className="form-input"
                placeholder="Detalle el estado mecánico encontrado, ajustes realizados o recomendaciones..."
                value={formData.observaciones}
                onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Checkboxes for automatic updates */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: '#166534', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.resetNextService}
                  onChange={e => setFormData({ ...formData, resetNextService: e.target.checked })}
                  style={{ accentColor: '#2d6a4f' }}
                />
                Restablecer ciclo y reprogramar próximo mantenimiento (+250h / +500h)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: '#166534', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.setOperativo}
                  onChange={e => setFormData({ ...formData, setOperativo: e.target.checked })}
                  style={{ accentColor: '#2d6a4f' }}
                />
                Marcar estado de la unidad como "Operativo"
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="equipment-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Check size={16} />
              <span>Registrar Servicio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
