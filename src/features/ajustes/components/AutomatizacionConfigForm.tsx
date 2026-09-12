import React, { useState } from 'react';
import { Save, Zap, Check } from 'lucide-react';

export const AutomatizacionConfigForm: React.FC = () => {
  const [rules, setRules] = useState({
    transicionEtariaAutomatica: true,
    mesesBecerraMauta: 8,
    mesesMautaNovilla: 18,
    ascensoVacaPrimerParto: true,
    cambioSecaAlRegistrarSecado: true,
    cambioPreñadaPorRevision: true,
    desteteAutomaticoAlSecar: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reglas de automatización guardadas exitosamente.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
        border: '1px solid var(--primary-light)',
        color: '#1b4332',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <Zap size={18} color="var(--primary-color)" />
        <span>
          Las reglas de automatización modifican automáticamente las categorías y estados zootécnicos de los animales
          en respuesta a eventos biológicos (edad, partos, secados, revisiones).
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Regla 1: Transición Etaria */}
        <div style={{
          padding: 14,
          border: '1px solid var(--border-gray)',
          borderRadius: 8,
          backgroundColor: '#fafafa'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={rules.transicionEtariaAutomatica}
              onChange={e => setRules({ ...rules, transicionEtariaAutomatica: e.target.checked })}
            />
            <strong>Transición Automática de Categorías por Edad</strong>
          </label>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '6px 0 10px 24px' }}>
            Promueve automáticamente a los semovientes según los meses de edad cumplidos.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginLeft: 24 }}>
            <div className="form-field">
              <label className="form-label">Pase Becerra/Becerro a Mauta/Maute (Meses)</label>
              <input
                type="number"
                className="form-input"
                value={rules.mesesBecerraMauta}
                disabled={!rules.transicionEtariaAutomatica}
                onChange={e => setRules({ ...rules, mesesBecerraMauta: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Pase Mauta a Novilla de Vientre (Meses)</label>
              <input
                type="number"
                className="form-input"
                value={rules.mesesMautaNovilla}
                disabled={!rules.transicionEtariaAutomatica}
                onChange={e => setRules({ ...rules, mesesMautaNovilla: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          </div>
        </div>

        {/* Regla 2: Novilla a Vaca */}
        <div style={{
          padding: 14,
          border: '1px solid var(--border-gray)',
          borderRadius: 8,
          backgroundColor: '#fafafa'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={rules.ascensoVacaPrimerParto}
              onChange={e => setRules({ ...rules, ascensoVacaPrimerParto: e.target.checked })}
            />
            <div>
              <strong>Promoción Inmediata a "Vaca" al Registrar Primer Parto</strong>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Toda Novilla pasa automáticamente a categoría Vaca y abre su Lactancia #1.
              </div>
            </div>
          </label>
        </div>

        {/* Regla 3: Cambio de Estado Productivo */}
        <div style={{
          padding: 14,
          border: '1px solid var(--border-gray)',
          borderRadius: 8,
          backgroundColor: '#fafafa'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={rules.cambioSecaAlRegistrarSecado}
              onChange={e => setRules({ ...rules, cambioSecaAlRegistrarSecado: e.target.checked })}
            />
            <div>
              <strong>Conmutar Situación Productiva a "Seca" al Registrar Secado</strong>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Cierra la lactancia en curso, calcula días en leche (DEL) y traslada al hato seco.
              </div>
            </div>
          </label>
        </div>

        {/* Regla 4: Cambio de Estado Reproductivo */}
        <div style={{
          padding: 14,
          border: '1px solid var(--border-gray)',
          borderRadius: 8,
          backgroundColor: '#fafafa'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={rules.cambioPreñadaPorRevision}
              onChange={e => setRules({ ...rules, cambioPreñadaPorRevision: e.target.checked })}
            />
            <div>
              <strong>Actualizar Situación Reproductiva a "Preñada" tras Palpación Positiva</strong>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Establece los días de gestación estimados y calcula la fecha probable de parto (FPP).
              </div>
            </div>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={16} />
          <span>Guardar Reglas</span>
        </button>
      </div>
    </form>
  );
};
