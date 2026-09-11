import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { TecnicoEntity } from '../../../../types2/entities';

interface NuevoTecnicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tecnico: TecnicoEntity) => void;
}

export const NuevoTecnicoModal: React.FC<NuevoTecnicoModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [estatus, setEstatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !nombre.trim()) {
      setError('El código y el nombre del técnico son obligatorios');
      return;
    }
    setError(null);
    const nuevo: TecnicoEntity = {
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim().toUpperCase(),
      estatus,
      positivos: 0,
      negativos: 0,
      enEspera: 0,
      totalServicios: 0,
      primerServicio: 0,
      segundoServicio: 0,
      tercerServicio: 0,
      cuatroOMasServicios: 0,
      partos: 0,
      abortos: 0,
      aunPrenadas: 0,
      eficienciaPorcentaje: 0,
      serviciosPorConcepcion: 0,
      machosNacidos: 0,
      hembrasNacidas: 0,
      embrionesColocados: 0
    };
    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
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
              justifyContent: 'center'
            }}>
              <UserPlus size={20} color="#2d6a4f" />
            </div>
            <div>
              <h3 className="report-modal-title">Registrar Nuevo Técnico</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Añada un inseminador o especialista reproductivo al hato
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="report-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 6,
                fontSize: 13
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Código de Técnico (2-5 letras) *</label>
              <input
                type="text"
                placeholder="Ej: JR, MED, VET..."
                className="form-control"
                required
                maxLength={6}
                value={codigo}
                onChange={e => setCodigo(e.target.value.toUpperCase())}
              />
            </div>

            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                placeholder="Ej: CARLOS MENDEZ"
                className="form-control"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Estatus</label>
              <select
                className="form-control"
                value={estatus}
                onChange={e => setEstatus(e.target.value as 'Activo' | 'Inactivo')}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="report-modal-footer">
            <button
              type="button"
              className="btn-amber-action"
              style={{ backgroundColor: '#6b7280', boxShadow: 'none' }}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-green-export">
              Guardar Técnico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
