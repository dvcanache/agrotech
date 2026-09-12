import React from 'react';
import { 
  MapPin, 
  Layers, 
  Calendar, 
  Clock, 
  Compass, 
  Sprout, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Animal360 } from '../../../types/animal';

interface TabTrazabilidadEspacialProps {
  animal: Animal360;
}

export const TabTrazabilidadEspacial: React.FC<TabTrazabilidadEspacialProps> = ({ animal }) => {
  const { historialTraslados } = animal;
  const currentMove = historialTraslados.find(t => t.actual) || historialTraslados[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Ubicación y Pastoreo Actual */}
      {currentMove && (
        <div style={{
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
          color: '#ffffff',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 4px 14px rgba(45, 106, 79, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}>
                <Compass size={26} color="#52b788" />
              </div>
              <div>
                <span style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.5, color: '#d8f3dc', fontWeight: 700 }}>
                  Ubicación Satelital y Potrero Actual
                </span>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>
                  {currentMove.potreroNombre} ({currentMove.potreroId})
                </div>
                <div style={{ fontSize: 13, color: '#d8f3dc', opacity: 0.9 }}>
                  Lote: <strong>{currentMove.loteNombre}</strong> • Pastura: {currentMove.tipoPastura}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '8px 14px',
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{currentMove.hectareas} ha</div>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', opacity: 0.85 }}>Superficie</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '8px 14px',
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{currentMove.cargaAnimalUggHa} UGG/ha</div>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', opacity: 0.85 }}>Presión Carga</div>
              </div>
              <div style={{
                backgroundColor: '#52b788',
                color: '#081c15',
                padding: '8px 14px',
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{currentMove.diasPermanencia} días</div>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', fontWeight: 700 }}>Ocupación</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Historial de Rotación y Traslados Espaciales */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} color="#2d6a4f" />
            <span>Historial Georreferenciado de Rotaciones y Permanencia en Potrero</span>
          </div>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            Pastoreo Racional Voisin (PRV) • Trazabilidad Total
          </span>
        </div>

        <div className="ficha360-table-wrapper">
          <table className="ficha360-table">
            <thead>
              <tr>
                <th>Potrero & Código</th>
                <th>Fecha Ingreso</th>
                <th>Fecha Salida</th>
                <th>Días Estancia</th>
                <th>Pastura Forrajera</th>
                <th>Carga (UGG/ha)</th>
                <th>Motivo de Movimiento</th>
                <th>Responsable</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historialTraslados.map((traslado) => (
                <tr key={traslado.id} style={{ backgroundColor: traslado.actual ? '#f0fdf4' : undefined }}>
                  <td style={{ fontWeight: 700 }}>
                    {traslado.potreroNombre}
                  </td>
                  <td>{traslado.fechaEntrada}</td>
                  <td>{traslado.fechaSalida || 'En pastoreo actual'}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#2d6a4f' }}>
                      {traslado.diasPermanencia} días
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{traslado.tipoPastura}</td>
                  <td>{traslado.cargaAnimalUggHa} UGG/ha</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 6,
                      backgroundColor: '#e2e8f0',
                      fontSize: 11.5,
                      fontWeight: 600
                    }}>
                      {traslado.motivo}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{traslado.responsable}</td>
                  <td>
                    {traslado.actual ? (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        fontWeight: 700,
                        fontSize: 11
                      }}>
                        ● Actual
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        Histórico
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
