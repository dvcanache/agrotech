import React, { useState } from 'react';
import { X, Trees, Check } from 'lucide-react';
import { PotreroItem, PASTURE_SPECIES_OPTIONS } from '../potrerosData';
import { EstatusPotrero } from '../../../types2/common';

interface NuevoPotreroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoPotrero: PotreroItem) => void;
}

export const NuevoPotreroModal: React.FC<NuevoPotreroModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    areaHa: 25.0,
    perimetroM: 2000,
    especieForrajera: PASTURE_SPECIES_OPTIONS[0],
    aforoKgM2: 3.0,
    cargaRecomendadaUggHa: 1.5,
    diasOcupacionMax: 5,
    diasDescansoRequeridos: 30,
    estatus: 'En descanso' as EstatusPotrero,
    loteAsignado: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo.trim() || !formData.descripcion.trim()) {
      alert('Por favor ingrese el código y la descripción del potrero.');
      return;
    }

    const nuevo: PotreroItem = {
      codigo: formData.codigo.trim().toUpperCase(),
      descripcion: formData.descripcion.trim(),
      areaHa: Number(formData.areaHa),
      perimetroM: Number(formData.perimetroM),
      especieForrajera: formData.especieForrajera,
      aforoKgM2: Number(formData.aforoKgM2),
      cargaRecomendadaUggHa: Number(formData.cargaRecomendadaUggHa),
      diasOcupacionMax: Number(formData.diasOcupacionMax),
      diasOcupacionActual: 0,
      diasDescansoRequeridos: Number(formData.diasDescansoRequeridos),
      diasDescansoActual: 0,
      estatus: formData.estatus,
      loteAsignado: formData.loteAsignado ? formData.loteAsignado : undefined,
      animalesPresentes: 0,
      cargaActualUggHa: 0.0
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2d6a4f'
            }}>
              <Trees size={20} />
            </div>
            <div>
              <h3 className="report-modal-title">Registrar Nuevo Potrero</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                Definición zootécnica y agronómica de parcela de pastoreo
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="report-modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="filter-label">Código *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. POT9"
                  className="filter-input"
                  value={formData.codigo}
                  onChange={e => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>
              <div>
                <label className="filter-label">Descripción / Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Potrero El Rincón"
                  className="filter-input"
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="filter-label">Superficie (ha) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="filter-input"
                  value={formData.areaHa}
                  onChange={e => setFormData({ ...formData, areaHa: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="filter-label">Perímetro Lineal (m)</label>
                <input
                  type="number"
                  className="filter-input"
                  value={formData.perimetroM}
                  onChange={e => setFormData({ ...formData, perimetroM: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="filter-label">Especie Forrajera Dominante</label>
              <select
                className="filter-input"
                value={formData.especieForrajera}
                onChange={e => setFormData({ ...formData, especieForrajera: e.target.value })}
              >
                {PASTURE_SPECIES_OPTIONS.map(specie => (
                  <option key={specie} value={specie}>{specie}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="filter-label">Aforo Estimado (kg MV/m²)</label>
                <input
                  type="number"
                  step="0.1"
                  className="filter-input"
                  value={formData.aforoKgM2}
                  onChange={e => setFormData({ ...formData, aforoKgM2: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="filter-label">Carga Máxima (UGG/ha)</label>
                <input
                  type="number"
                  step="0.1"
                  className="filter-input"
                  value={formData.cargaRecomendadaUggHa}
                  onChange={e => setFormData({ ...formData, cargaRecomendadaUggHa: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="filter-label">Días Ocupación Máx.</label>
                <input
                  type="number"
                  className="filter-input"
                  value={formData.diasOcupacionMax}
                  onChange={e => setFormData({ ...formData, diasOcupacionMax: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
              <div>
                <label className="filter-label">Días Descanso Requeridos</label>
                <input
                  type="number"
                  className="filter-input"
                  value={formData.diasDescansoRequeridos}
                  onChange={e => setFormData({ ...formData, diasDescansoRequeridos: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="filter-label">Estatus Inicial</label>
                <select
                  className="filter-input"
                  value={formData.estatus}
                  onChange={e => setFormData({ ...formData, estatus: e.target.value as EstatusPotrero })}
                >
                  <option value="Activo">Activo</option>
                  <option value="En descanso">En descanso</option>
                  <option value="En mantenimiento">En mantenimiento</option>
                  <option value="En siembra">En siembra</option>
                </select>
              </div>
              <div>
                <label className="filter-label">Lote Asignado (opcional)</label>
                <input
                  type="text"
                  placeholder="ej. Lote 01 (Ordeño)"
                  className="filter-input"
                  value={formData.loteAsignado}
                  onChange={e => setFormData({ ...formData, loteAsignado: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="report-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={16} />
              <span>Guardar Potrero</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
