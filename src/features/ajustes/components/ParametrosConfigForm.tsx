import React, { useState } from 'react';
import { Save, HelpCircle } from 'lucide-react';

export const ParametrosConfigForm: React.FC = () => {
  const [params, setParams] = useState({
    diasGestacion: 283,
    dev: 50,
    periodoSeco: 60,
    edadMinServicioMeses: 16,
    pesoMinServicioKg: 320,
    edadDesteteDias: 205,
    umbralSecadoKgDia: 3.0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Parámetros zootécnicos guardados exitosamente.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--primary-ultra-light)',
        borderRadius: 8,
        border: '1px solid var(--primary-light)',
        color: '#1b4332',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <HelpCircle size={18} color="var(--primary-color)" />
        <span>
          Estas constantes biológicas calibran los algoritmos de cálculo para fechas de parto (FPP),
          secados sugeridos y pesos ajustados a 205 días.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="filter-group">
          <label className="filter-label">Duración Promedio de la Gestación (Días)</label>
          <input
            type="number"
            className="filter-input"
            value={params.diasGestacion}
            onChange={e => setParams({ ...params, diasGestacion: parseInt(e.target.value, 10) || 0 })}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>283 días estándar en vacunos; 310 en bufalinos.</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Días de Espera Voluntaria - DEV (Días post-parto)</label>
          <input
            type="number"
            className="filter-input"
            value={params.dev}
            onChange={e => setParams({ ...params, dev: parseInt(e.target.value, 10) || 0 })}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Período mínimo antes de habilitar servicios post-parto.</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Duración Ideal del Período Seco (Días)</label>
          <input
            type="number"
            className="filter-input"
            value={params.periodoSeco}
            onChange={e => setParams({ ...params, periodoSeco: parseInt(e.target.value, 10) || 0 })}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Descanso mamario recomendado antes del parto siguiente.</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Edad Estándar de Destete (Días)</label>
          <input
            type="number"
            className="filter-input"
            value={params.edadDesteteDias}
            onChange={e => setParams({ ...params, edadDesteteDias: parseInt(e.target.value, 10) || 0 })}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Base para cálculo de peso ajustado al destete (205 días).</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Edad Mínima al Primer Servicio en Novillas (Meses)</label>
          <input
            type="number"
            className="filter-input"
            value={params.edadMinServicioMeses}
            onChange={e => setParams({ ...params, edadMinServicioMeses: parseInt(e.target.value, 10) || 0 })}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Edad mínima biológica requerida para aptitud reproductiva.</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Peso Mínimo al Primer Servicio (kg)</label>
          <input
            type="number"
            className="filter-input"
            value={params.pesoMinServicioKg}
            onChange={e => setParams({ ...params, pesoMinServicioKg: parseInt(e.target.value, 10) || 0 })}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Desarrollo corporal mínimo recomendado para la monta/IA.</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Umbral de Baja Producción para Secado (kg/día)</label>
          <input
            type="number"
            step="0.1"
            className="filter-input"
            value={params.umbralSecadoKgDia}
            onChange={e => setParams({ ...params, umbralSecadoKgDia: parseFloat(e.target.value) || 0 })}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>El sistema sugiere secar si la producción desciende de este límite.</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={16} />
          <span>Guardar Parámetros</span>
        </button>
      </div>
    </form>
  );
};
