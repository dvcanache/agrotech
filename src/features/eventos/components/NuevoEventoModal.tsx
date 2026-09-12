import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';

export interface EventoItem {
  id: string;
  fecha: string;
  codigoAnimal: string;
  categoria: string;
  tipoEvento: string;
  vencimiento: string;
  tecnico?: string;
  observaciones?: string;
}

interface NuevoEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoInicial: string;
  categoriaInicial: string;
  onSave: (nuevoEvento: EventoItem) => void;
}

export const NuevoEventoModal: React.FC<NuevoEventoModalProps> = ({
  isOpen,
  onClose,
  tipoInicial,
  categoriaInicial,
  onSave
}) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    codigoAnimal: '0001',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: '',
    // Subcampos específicos
    reproductor: 'SM01 - Toro Supremo',
    diagnostico: 'Preñada',
    diasGestacion: 45,
    pesajeAmKg: 7.5,
    pesajePmKg: 6.2,
    pesoCorporalKg: 460,
    motivoSecado: 'Programado por Gestación (60 d preparto)',
    cuartosAfectados: 'AD, AI',
    laborPotrero: 'Fertilización y Control de Malezas'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let proxVencimiento = 'Completado';
    if (tipoInicial.includes('Servicio')) {
      proxVencimiento = 'Palpación en 45 días';
    } else if (tipoInicial.includes('Revisión')) {
      proxVencimiento = formData.diagnostico === 'Preñada' ? 'Aviso de Secado en 220 días' : 'Servicio en próximo celo';
    } else if (tipoInicial.includes('Parto')) {
      proxVencimiento = 'Fin DEV en 50 días';
    } else if (tipoInicial.includes('Mastitis')) {
      proxVencimiento = 'Retiro Leche por 5 días';
    } else if (tipoInicial.includes('Secado')) {
      proxVencimiento = 'Parto en 60 días';
    }

    const nuevo: EventoItem = {
      id: String(Date.now()),
      fecha: formData.fecha,
      codigoAnimal: formData.codigoAnimal.toUpperCase(),
      categoria: categoriaInicial,
      tipoEvento: tipoInicial,
      vencimiento: proxVencimiento,
      tecnico: formData.tecnico,
      observaciones: formData.observaciones
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
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
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="report-modal-title">Registrar {tipoInicial}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                Categoría: {categoriaInicial} | Evento Operativo
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="filter-label">Fecha del Evento *</label>
                <input
                  type="date"
                  required
                  className="filter-input"
                  value={formData.fecha}
                  onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
              <div>
                <label className="filter-label">Código del Animal *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. 0001, BCA01"
                  className="filter-input"
                  value={formData.codigoAnimal}
                  onChange={e => setFormData({ ...formData, codigoAnimal: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="filter-label">Técnico / Operario Responsable</label>
              <select
                className="filter-input"
                value={formData.tecnico}
                onChange={e => setFormData({ ...formData, tecnico: e.target.value })}
              >
                <option value="Dr. Carlos Mendoza">Dr. Carlos Mendoza (Médico Veterinario)</option>
                <option value="Juan Pérez">Juan Pérez (Inseminador Artificial)</option>
                <option value="Roberto Gómez">Roberto Gómez (Palpador / Ecografista)</option>
                <option value="Luis Martínez">Luis Martínez (Mayordomo de Campo)</option>
              </select>
            </div>

            {/* Campos condicionales por tipo de evento */}
            {tipoInicial.includes('Servicio') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label className="filter-label">Reproductor / Pajuela</label>
                  <input
                    type="text"
                    className="filter-input"
                    value={formData.reproductor}
                    onChange={e => setFormData({ ...formData, reproductor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="filter-label">Modalidad</label>
                  <select className="filter-input">
                    <option>Inseminación Artificial (IA)</option>
                    <option>Monta Natural Dirigida</option>
                    <option>IATF</option>
                  </select>
                </div>
              </div>
            )}

            {tipoInicial.includes('Revisión') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label className="filter-label">Diagnóstico de Preñez</label>
                  <select
                    className="filter-input"
                    value={formData.diagnostico}
                    onChange={e => setFormData({ ...formData, diagnostico: e.target.value })}
                  >
                    <option value="Preñada">Preñada (Positivo)</option>
                    <option value="Vacía">Vacía (Negativo)</option>
                    <option value="Dudosa">Dudosa / Repetir</option>
                  </select>
                </div>
                <div>
                  <label className="filter-label">Días de Gestación Estimados</label>
                  <input
                    type="number"
                    className="filter-input"
                    value={formData.diasGestacion}
                    onChange={e => setFormData({ ...formData, diasGestacion: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>
            )}

            {tipoInicial.includes('Pesaje') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label className="filter-label">Turno Mañana (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="filter-input"
                    value={formData.pesajeAmKg}
                    onChange={e => setFormData({ ...formData, pesajeAmKg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="filter-label">Turno Tarde (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="filter-input"
                    value={formData.pesajePmKg}
                    onChange={e => setFormData({ ...formData, pesajePmKg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}

            {tipoInicial.includes('Crecimiento') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label className="filter-label">Peso en Báscula (kg)</label>
                  <input
                    type="number"
                    className="filter-input"
                    value={formData.pesoCorporalKg}
                    onChange={e => setFormData({ ...formData, pesoCorporalKg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="filter-label">Condición Corporal (1.0 - 5.0)</label>
                  <input type="number" step="0.25" defaultValue="3.25" className="filter-input" />
                </div>
              </div>
            )}

            {tipoInicial.includes('Mastitis') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label className="filter-label">Cuartos Mamarios Afectados</label>
                  <input
                    type="text"
                    className="filter-input"
                    value={formData.cuartosAfectados}
                    onChange={e => setFormData({ ...formData, cuartosAfectados: e.target.value })}
                  />
                </div>
                <div>
                  <label className="filter-label">Tiempo de Retiro Leche (días)</label>
                  <input type="number" defaultValue="5" className="filter-input" />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label className="filter-label">Observaciones y Notas de Campo</label>
              <textarea
                rows={3}
                placeholder="Anotaciones zootécnicas o comportamiento..."
                className="filter-input"
                style={{ resize: 'vertical' }}
                value={formData.observaciones}
                onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="report-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={16} />
              <span>Guardar Evento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
