import React, { useState, useEffect } from 'react';
import {
  X,
  Fuel,
  Check,
  Calendar,
  Clock,
  MapPin,
  Trees,
  User,
  Zap,
  Layers
} from 'lucide-react';
import {
  EquipmentItem,
  FuelLaborRecord,
  LOCATIONS_OPTIONS,
  OPERATORS_OPTIONS,
  LABORS_OPTIONS
} from '../equipmentData';

interface CombustibleLaborModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipos: EquipmentItem[];
  preselectedEquipo?: EquipmentItem | null;
  onSave: (
    nuevoRegistro: FuelLaborRecord,
    actualizarEquipo?: {
      codigo: string;
      horasAgregadas?: number;
      nuevaUbicacion?: string;
    }
  ) => void;
}

export const CombustibleLaborModal: React.FC<CombustibleLaborModalProps> = ({
  isOpen,
  onClose,
  equipos,
  preselectedEquipo,
  onSave
}) => {
  // Motorized units (Tractores, Vehículos, Estacionarios)
  const motorizedEquipos = equipos.filter(
    e => e.variante.combustible && e.variante.combustible !== 'N/A'
  );

  // Implements list
  const implementsEquipos = equipos.filter(e => e.categoria === 'Implementos');

  const [selectedCodigo, setSelectedCodigo] = useState<string>(
    preselectedEquipo ? preselectedEquipo.codigo : (motorizedEquipos[0]?.codigo || '')
  );

  const targetEquipo = equipos.find(e => e.codigo === selectedCodigo);

  const [formData, setFormData] = useState({
    implementoCodigo: 'IMP-01',
    fecha: new Date().toISOString().split('T')[0],
    potreroId: 'Potrero 4 (Brizantha)',
    labor: LABORS_OPTIONS[0],
    horasTrabajadas: 6.5,
    hectareasTrabajadas: 8.0,
    litrosCombustible: 78.0,
    operador: OPERATORS_OPTIONS[0],
    observaciones: 'Labor agronómica regular. Rendimiento de corte y tracción óptimos.',
    updateHorometer: true,
    updateLocation: true
  });

  useEffect(() => {
    if (preselectedEquipo) {
      setSelectedCodigo(preselectedEquipo.codigo);
      if (preselectedEquipo.operadorAsignado) {
        setFormData(prev => ({
          ...prev,
          operador: preselectedEquipo.operadorAsignado
        }));
      }
    }
  }, [preselectedEquipo]);

  if (!isOpen) return null;

  // Real-time efficiency calculation
  const calcEfficiency = () => {
    const litros = Number(formData.litrosCombustible) || 0;
    const hectareas = Number(formData.hectareasTrabajadas) || 0;
    const horas = Number(formData.horasTrabajadas) || 0;

    const parts: string[] = [];
    if (hectareas > 0 && litros > 0) {
      parts.push(`${(litros / hectareas).toFixed(1)} L/ha`);
    }
    if (horas > 0 && litros > 0) {
      parts.push(`${(litros / horas).toFixed(1)} L/h`);
    }
    return parts.length > 0 ? parts.join(' • ') : '—';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCodigo) {
      alert('Seleccione un equipo motriz.');
      return;
    }

    const efficiency = calcEfficiency();

    const fuelRecord: FuelLaborRecord = {
      id: `COMB-${Date.now().toString().slice(-4)}`,
      equipoCodigo: selectedCodigo,
      implementoCodigo: formData.implementoCodigo === 'NINGUNO' ? undefined : formData.implementoCodigo,
      fecha: formData.fecha,
      potreroId: formData.potreroId,
      labor: formData.labor,
      horasTrabajadas: Number(formData.horasTrabajadas),
      hectareasTrabajadas: formData.hectareasTrabajadas ? Number(formData.hectareasTrabajadas) : undefined,
      litrosCombustible: Number(formData.litrosCombustible),
      eficienciaCalculada: efficiency,
      operador: formData.operador,
      observaciones: formData.observaciones
    };

    const actualizacion = {
      codigo: selectedCodigo,
      horasAgregadas: formData.updateHorometer ? Number(formData.horasTrabajadas) : 0,
      nuevaUbicacion: formData.updateLocation ? formData.potreroId : undefined
    };

    onSave(fuelRecord, actualizacion);
    onClose();
  };

  return (
    <div className="equipment-modal-overlay" onClick={onClose}>
      <div className="equipment-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="equipment-modal-header">
          <div className="equipment-modal-header-info">
            <div className="equipment-modal-icon-badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Fuel size={22} />
            </div>
            <div>
              <h3 className="equipment-modal-title">Cargar Combustible & Labor de Potrero</h3>
              <p className="equipment-modal-desc">
                Registro de diésel consumido, horas trabajadas y cálculo de eficiencia por hectárea
              </p>
            </div>
          </div>
          <button type="button" className="equipment-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="equipment-modal-body">
            {/* Equipment and Implement */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Equipo Tractor / Motriz *
                </label>
                <select
                  className="form-select"
                  value={selectedCodigo}
                  onChange={e => setSelectedCodigo(e.target.value)}
                >
                  {motorizedEquipos.map(eq => (
                    <option key={eq.codigo} value={eq.codigo}>
                      [{eq.codigo}] {eq.nombre} ({eq.variante.combustible})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Implemento Acoplado
                </label>
                <select
                  className="form-select"
                  value={formData.implementoCodigo}
                  onChange={e => setFormData({ ...formData, implementoCodigo: e.target.value })}
                >
                  <option value="NINGUNO">-- Ninguno / Solo Unidad --</option>
                  {implementsEquipos.map(imp => (
                    <option key={imp.codigo} value={imp.codigo}>
                      [{imp.codigo}] {imp.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paddock and Labor */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Potrero / Parcela de Labor *
                </label>
                <select
                  className="form-select"
                  value={formData.potreroId}
                  onChange={e => setFormData({ ...formData, potreroId: e.target.value })}
                >
                  {LOCATIONS_OPTIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Labor Agronómica Realizada *
                </label>
                <select
                  className="form-select"
                  value={formData.labor}
                  onChange={e => setFormData({ ...formData, labor: e.target.value })}
                >
                  {LABORS_OPTIONS.map(lab => (
                    <option key={lab} value={lab}>{lab}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Operator */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Fecha de la Labor *
                </label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={formData.fecha}
                  onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Operador / Maquinista *
                </label>
                <select
                  className="form-select"
                  value={formData.operador}
                  onChange={e => setFormData({ ...formData, operador: e.target.value })}
                >
                  {OPERATORS_OPTIONS.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hours, Hectares, Liters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Horas Trabajadas *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  className="form-input"
                  value={formData.horasTrabajadas}
                  onChange={e => setFormData({ ...formData, horasTrabajadas: parseFloat(e.target.value) || 0 })}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Hectáreas (ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-input"
                  value={formData.hectareasTrabajadas}
                  onChange={e => setFormData({ ...formData, hectareasTrabajadas: parseFloat(e.target.value) || 0 })}
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  Combustible (Litros) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  className="form-input"
                  value={formData.litrosCombustible}
                  onChange={e => setFormData({ ...formData, litrosCombustible: parseFloat(e.target.value) || 0 })}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Efficiency Live Display Box */}
            <div className="efficiency-display-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={20} />
                </div>
                <div>
                  <div className="efficiency-display-title">Eficiencia Operativa Calculada</div>
                  <div style={{ fontSize: 11.5, color: '#166534' }}>
                    Rendimiento forrajero y régimen de consumo motor
                  </div>
                </div>
              </div>
              <div className="efficiency-display-val">
                {calcEfficiency()}
              </div>
            </div>

            {/* Observations */}
            <div className="form-field">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                Observaciones de Labor
              </label>
              <textarea
                rows={2}
                className="form-input"
                placeholder="Condiciones del terreno, velocidad de avance, novedades mecánicas..."
                value={formData.observaciones}
                onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Checkboxes */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={formData.updateHorometer}
                  onChange={e => setFormData({ ...formData, updateHorometer: e.target.checked })}
                  style={{ accentColor: '#2d6a4f' }}
                />
                Sumar automáticamente las {formData.horasTrabajadas} horas al horómetro acumulado
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={formData.updateLocation}
                  onChange={e => setFormData({ ...formData, updateLocation: e.target.checked })}
                  style={{ accentColor: '#2d6a4f' }}
                />
                Actualizar ubicación asignada de la maquinaria a "{formData.potreroId}"
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
              <span>Guardar Registro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
