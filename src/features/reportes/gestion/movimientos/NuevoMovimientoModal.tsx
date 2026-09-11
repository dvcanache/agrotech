import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { MovimientoEntity } from '../../../../types2/entities';
import { CategoriaAnimal } from '../../../../types2/common';

interface NuevoMovimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movimiento: MovimientoEntity) => void;
}

export const NuevoMovimientoModal: React.FC<NuevoMovimientoModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<MovimientoEntity>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Cambio de Lote',
    practico: '',
    unico: '',
    rebanoOrigen: 'Rebaño de Prueba',
    categoriaOrigen: 'Vaca',
    rebanoDestino: 'Rebaño de Prueba',
    categoriaDestino: 'Vaca',
    tecnico: 'JHON JAIRO RESTREPO',
    estatusActual: 'Activo',
    categoriaActual: 'Vaca',
    loteActual: 'POT1',
    comentario: ''
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.practico.trim()) {
      setError('El código práctico del animal es obligatorio');
      return;
    }
    setError(null);
    onSave({
      ...formData,
      unico: formData.unico.trim() || formData.practico.trim()
    });
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowRightLeft size={20} color="#0284c7" />
            </div>
            <div>
              <h3 className="report-modal-title">Registrar Nuevo Movimiento</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Traslado de lote, cambio de rebaño o promoción de categoría
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
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

            <div className="form-grid-2">
              <div className="form-group">
                <label>Fecha del Movimiento *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.fecha}
                  onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tipo de Movimiento *</label>
                <select
                  className="form-control"
                  value={formData.tipo}
                  onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                >
                  <option value="Cambio de Lote">Cambio de Lote</option>
                  <option value="Cambio de Rebaño">Cambio de Rebaño</option>
                  <option value="Cambio de Categoría">Cambio de Categoría</option>
                  <option value="Entrada por Nacimiento">Entrada por Nacimiento</option>
                  <option value="Entrada por Compra">Entrada por Compra</option>
                  <option value="Salida por Venta">Salida por Venta</option>
                  <option value="Salida por Descarte">Salida por Descarte</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Código Práctico del Animal *</label>
                <input
                  type="text"
                  placeholder="Ej: 0001, CW002..."
                  className="form-control"
                  required
                  value={formData.practico}
                  onChange={e => setFormData({ ...formData, practico: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Código Único (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: VE-2026-0001"
                  className="form-control"
                  value={formData.unico}
                  onChange={e => setFormData({ ...formData, unico: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Rebaño Origen</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.rebanoOrigen}
                  onChange={e => setFormData({ ...formData, rebanoOrigen: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Rebaño Destino</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.rebanoDestino}
                  onChange={e => setFormData({ ...formData, rebanoDestino: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Categoría Destino</label>
                <select
                  className="form-control"
                  value={formData.categoriaDestino}
                  onChange={e => setFormData({
                    ...formData,
                    categoriaDestino: e.target.value as CategoriaAnimal,
                    categoriaActual: e.target.value as CategoriaAnimal
                  })}
                >
                  <option value="Vaca">Vaca</option>
                  <option value="Novilla">Novilla</option>
                  <option value="Mauta">Mauta</option>
                  <option value="Becerra">Becerra</option>
                  <option value="Toro">Toro</option>
                  <option value="Novillo">Novillo</option>
                  <option value="Maute">Maute</option>
                  <option value="Becerro">Becerro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Lote Destino Actual *</label>
                <select
                  className="form-control"
                  value={formData.loteActual}
                  onChange={e => setFormData({ ...formData, loteActual: e.target.value })}
                >
                  <option value="ESCT">ESCT - Escotero</option>
                  <option value="POT1">POT1 - Potrero 1</option>
                  <option value="SEC1">SEC1 - Secas 1</option>
                  <option value="01">01 - Lote 01</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Técnico Responsable</label>
              <select
                className="form-control"
                value={formData.tecnico}
                onChange={e => setFormData({ ...formData, tecnico: e.target.value })}
              >
                <option value="JHON JAIRO RESTREPO">JHON JAIRO RESTREPO</option>
                <option value="ALEJANDRA DURAN">ALEJANDRA DURAN</option>
                <option value="AUGUSTO RODRIGUEZ">AUGUSTO RODRIGUEZ</option>
                <option value="MARIA VICTORIA PEREZ">MARIA VICTORIA PEREZ</option>
                <option value="PEDRO PAREDES">PEDRO PAREDES</option>
                <option value="SANTOS MICHELENA">SANTOS MICHELENA</option>
                <option value="TULIO HERNANDEZ">TULIO HERNANDEZ</option>
                <option value="ZULAY BERRUETA">ZULAY BERRUETA</option>
              </select>
            </div>

            <div className="form-group">
              <label>Comentario / Justificación</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Motivo del movimiento, observaciones veterinarias..."
                value={formData.comentario}
                onChange={e => setFormData({ ...formData, comentario: e.target.value })}
              />
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
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
