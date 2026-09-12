import React, { useState } from 'react';
import { Save, Bell, ShieldAlert } from 'lucide-react';

export const AlertasConfigForm: React.FC = () => {
  const [alertas, setAlertas] = useState({
    diasAvisoPreparto: 15,
    diasPostServicioDiagnostico: 45,
    diasAvisoPresecado: 15,
    umbralCelosRepetidos: 3,
    alertaRetiroFarmacologico: true,
    alertaMastitisSinTratar: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Configuración de alertas guardada exitosamente.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#fff3e0',
        borderRadius: 8,
        border: '1px solid #ffe0b2',
        color: '#e65100',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <Bell size={18} color="#e65100" />
        <span>
          Las alertas generan avisos automáticos en el Dashboard, Centro de Eventos y Centro de Reportes
          para optimizar la atención de campo preventiva.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="form-field">
          <label className="form-label">Aviso Previo a Fecha Probable de Parto (Días)</label>
          <input
            type="number"
            className="form-input"
            value={alertas.diasAvisoPreparto}
            onChange={e => setAlertas({ ...alertas, diasAvisoPreparto: parseInt(e.target.value, 10) || 0 })}
          />
          <span className="form-hint">
            Días de anticipación para trasladar el vientre al lote de maternidad.
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">Días Post-Servicio para Diagnóstico de Preñez (Días)</label>
          <input
            type="number"
            className="form-input"
            value={alertas.diasPostServicioDiagnostico}
            onChange={e => setAlertas({ ...alertas, diasPostServicioDiagnostico: parseInt(e.target.value, 10) || 0 })}
          />
          <span className="form-hint">
            Días tras la inseminación o monta para programar palpación/ecografía.
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">Aviso Previo a Fecha de Secado (Días)</label>
          <input
            type="number"
            className="form-input"
            value={alertas.diasAvisoPresecado}
            onChange={e => setAlertas({ ...alertas, diasAvisoPresecado: parseInt(e.target.value, 10) || 0 })}
          />
          <span className="form-hint">
            Días de anticipación para programar el cese de ordeño y terapia intramamaria.
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">Alerta de Celos Repetidos (Servicios fallidos)</label>
          <input
            type="number"
            className="form-input"
            value={alertas.umbralCelosRepetidos}
            onChange={e => setAlertas({ ...alertas, umbralCelosRepetidos: parseInt(e.target.value, 10) || 0 })}
          />
          <span className="form-hint">
            Marca a la hembra como "problema reproductivo" tras este número de fallos.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={alertas.alertaRetiroFarmacologico}
            onChange={e => setAlertas({ ...alertas, alertaRetiroFarmacologico: e.target.checked })}
          />
          <div>
            <strong>Alerta de Tiempo de Retiro Farmacológico (Inocuidad Alimentaria)</strong>
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Bloquea el despacho de leche y faena de animales que se encuentren en período de resguardo médico.
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={alertas.alertaMastitisSinTratar}
            onChange={e => setAlertas({ ...alertas, alertaMastitisSinTratar: e.target.checked })}
          />
          <div>
            <strong>Alerta Inmediata de Mastitis Clínica Activa</strong>
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Notifica al encargado de ordeño para desviar la leche del tanque principal.
            </div>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={16} />
          <span>Guardar Alertas</span>
        </button>
      </div>
    </form>
  );
};
