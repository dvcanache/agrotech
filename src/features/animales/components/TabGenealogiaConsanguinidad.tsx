import React, { useState } from 'react';
import { 
  GitBranch, 
  AlertTriangle, 
  CheckCircle, 
  PieChart as PieIcon, 
  Dna, 
  ChevronRight, 
  Layers,
  Info
} from 'lucide-react';
import { Animal360, PedigreeNode } from '../../../types/animal';

interface TabGenealogiaConsanguinidadProps {
  animal: Animal360;
}

export const TabGenealogiaConsanguinidad: React.FC<TabGenealogiaConsanguinidadProps> = ({ animal }) => {
  const [selectedNode, setSelectedNode] = useState<PedigreeNode | null>(null);
  const { consanguinidad, pedigri, desgloseRacial } = animal;

  const fxPercent = (consanguinidad.coeficienteWrightFx * 100).toFixed(2);
  const isHighRisk = consanguinidad.alertaEndogamia || consanguinidad.coeficienteWrightFx > 0.0625;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Alerta / Widget del Coeficiente de Wright Fx */}
      <div className={`wright-box ${isHighRisk ? 'wright-box-warning' : 'wright-box-safe'}`}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          {isHighRisk ? (
            <AlertTriangle size={24} color="#dc2626" />
          ) : (
            <CheckCircle size={24} color="#16a34a" />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              {isHighRisk ? '⚠️ ALERTA: Coeficiente de Consanguinidad Elevado' : '✅ Coeficiente de Consanguinidad Óptimo'}
              <span style={{ 
                marginLeft: 10, 
                padding: '2px 10px', 
                borderRadius: 20, 
                backgroundColor: isHighRisk ? '#dc2626' : '#16a34a', 
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 800
              }}>
                Fx = {fxPercent}%
              </span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>
              Umbral crítico zootécnico: 6.25%
            </span>
          </div>

          <p style={{ fontSize: 13, marginTop: 6, marginBottom: 6, lineHeight: 1.5 }}>
            {consanguinidad.analisis}
          </p>

          {consanguinidad.ancestroComun && (
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dna size={14} />
              <span>Ancestro Común Detectado: <strong>{consanguinidad.ancestroComun}</strong></span>
            </div>
          )}

          <div style={{ 
            marginTop: 8, 
            padding: '8px 12px', 
            borderRadius: 6, 
            backgroundColor: isHighRisk ? '#fee2e2' : '#dcfce7',
            fontSize: 12,
            lineHeight: 1.4
          }}>
            <strong>Recomendación para Apareamiento:</strong> {consanguinidad.recomendacionCruzamiento}
          </div>
        </div>
      </div>

      {/* 2. Desglose Racial y Pureza de Sangre */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <PieIcon size={16} color="#2d6a4f" />
          Composición Racial y Desglose Genético
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Barra acumulativa visual */}
          <div style={{ 
            height: 18, 
            width: '100%', 
            borderRadius: 9, 
            overflow: 'hidden', 
            display: 'flex',
            backgroundColor: '#e2e8f0'
          }}>
            {desgloseRacial.map(item => (
              <div
                key={item.raza}
                style={{
                  width: `${item.porcentaje}%`,
                  backgroundColor: item.colorHex,
                  height: '100%'
                }}
                title={`${item.raza}: ${item.porcentaje}%`}
              />
            ))}
          </div>

          {/* Badges de razas */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {desgloseRacial.map(item => (
              <div 
                key={item.raza} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.colorHex }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{item.raza}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: item.colorHex }}>{item.porcentaje}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Árbol Genealógico Interactivo de 3 Generaciones */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitBranch size={16} color="#2d6a4f" />
            <span>Árbol Genealógico Interactivo (3 Generaciones)</span>
          </div>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
            Haga clic en cualquier nodo para inspeccionar ascendiente
          </span>
        </div>

        <div className="pedigree-tree">
          {/* Columna 1: Animal Proband */}
          <div className="pedigree-col" style={{ maxWidth: 200 }}>
            <div 
              className="pedigree-node-card proband"
              onClick={() => setSelectedNode(pedigri)}
            >
              <div className="pedigree-node-role">Individuo (Proband)</div>
              <div className="pedigree-node-name">{pedigri.arete} — {pedigri.nombre}</div>
              <div className="pedigree-node-meta">
                <span>{pedigri.raza}</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Generación 1 (Padres) */}
          <div className="pedigree-col" style={{ maxWidth: 220 }}>
            {/* Padre */}
            {pedigri.padre && (
              <div 
                className="pedigree-node-card"
                onClick={() => setSelectedNode(pedigri.padre || null)}
              >
                <div className="pedigree-node-role">Sire (Padre)</div>
                <div className="pedigree-node-name">{pedigri.padre.arete} — {pedigri.padre.nombre}</div>
                <div className="pedigree-node-meta">
                  <span>{pedigri.padre.raza}</span>
                  {pedigri.padre.hba && <span>• {pedigri.padre.hba}</span>}
                </div>
              </div>
            )}

            {/* Madre */}
            {pedigri.madre && (
              <div 
                className="pedigree-node-card"
                onClick={() => setSelectedNode(pedigri.madre || null)}
              >
                <div className="pedigree-node-role">Dam (Madre)</div>
                <div className="pedigree-node-name">{pedigri.madre.arete} — {pedigri.madre.nombre}</div>
                <div className="pedigree-node-meta">
                  <span>{pedigri.madre.raza}</span>
                  {pedigri.madre.hba && <span>• {pedigri.madre.hba}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Columna 3: Generación 2 (Abuelos) */}
          <div className="pedigree-col" style={{ maxWidth: 230 }}>
            {/* Abuelo Paterno */}
            {pedigri.padre?.padre && (
              <div 
                className="pedigree-node-card"
                onClick={() => setSelectedNode(pedigri.padre?.padre || null)}
              >
                <div className="pedigree-node-role">Abuelo Paterno</div>
                <div className="pedigree-node-name">{pedigri.padre.padre.arete} — {pedigri.padre.padre.nombre}</div>
                <div className="pedigree-node-meta">
                  <span>{pedigri.padre.padre.raza}</span>
                </div>
              </div>
            )}

            {/* Abuela Paterna */}
            {pedigri.padre?.madre && (
              <div 
                className="pedigree-node-card"
                onClick={() => setSelectedNode(pedigri.padre?.madre || null)}
              >
                <div className="pedigree-node-role">Abuela Paterna</div>
                <div className="pedigree-node-name">{pedigri.padre.madre.arete} — {pedigri.padre.madre.nombre}</div>
                <div className="pedigree-node-meta">
                  <span>{pedigri.padre.madre.raza}</span>
                </div>
              </div>
            )}

            {/* Abuelo Materno */}
            {pedigri.madre?.padre && (
              <div 
                className="pedigree-node-card"
                onClick={() => setSelectedNode(pedigri.madre?.padre || null)}
              >
                <div className="pedigree-node-role">Abuelo Materno</div>
                <div className="pedigree-node-name">{pedigri.madre.padre.arete} — {pedigri.madre.padre.nombre}</div>
                <div className="pedigree-node-meta">
                  <span>{pedigri.madre.padre.raza}</span>
                </div>
              </div>
            )}

            {/* Abuela Materna */}
            {pedigri.madre?.madre && (
              <div 
                className="pedigree-node-card"
                onClick={() => setSelectedNode(pedigri.madre?.madre || null)}
              >
                <div className="pedigree-node-role">Abuela Materna</div>
                <div className="pedigree-node-name">{pedigri.madre.madre.arete} — {pedigri.madre.madre.nombre}</div>
                <div className="pedigree-node-meta">
                  <span>{pedigri.madre.madre.raza}</span>
                </div>
              </div>
            )}
          </div>

          {/* Columna 4: Generación 3 (Bisabuelos muestra) */}
          <div className="pedigree-col" style={{ maxWidth: 220 }}>
            <div className="pedigree-node-card" style={{ fontSize: 11, padding: '6px 10px' }}>
              <div className="pedigree-node-role">Bisabuelos (8 Líneas)</div>
              <div style={{ color: '#334155', fontWeight: 600 }}>• CAR-002 Conquistador</div>
              <div style={{ color: '#334155', fontWeight: 600 }}>• CAR-008 Reina de Oro</div>
              <div style={{ color: '#334155', fontWeight: 600 }}>• HOL-102 Elevation</div>
              <div style={{ color: '#dc2626', fontWeight: 700 }}>• CAR-014 Sultán Negro (*)</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>(*) Ancestro duplicado</div>
            </div>
          </div>
        </div>

        {/* Modal / Detalle de Nodo Seleccionado */}
        {selectedNode && (
          <div style={{ 
            marginTop: 14, 
            padding: 12, 
            borderRadius: 8, 
            backgroundColor: '#f1f5f9', 
            border: '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                Ascendiente Seleccionado:
              </span>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>
                {selectedNode.arete} — {selectedNode.nombre} ({selectedNode.raza})
              </div>
              <div style={{ fontSize: 12, color: '#475569' }}>
                Registro Genealógico / HBA: {selectedNode.hba || 'Registro de Campo'}
              </div>
            </div>
            <button
              type="button"
              className="ficha360-btn ficha360-btn-ghost"
              style={{ color: '#2d6a4f', borderColor: '#2d6a4f', backgroundColor: '#ffffff' }}
              onClick={() => setSelectedNode(null)}
            >
              Cerrar Detalle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
