import React from 'react';
import { 
  X, 
  Tag, 
  Cpu, 
  AlertTriangle, 
  PlusCircle, 
  Printer, 
  Heart, 
  Milk, 
  MapPin, 
  Clock, 
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { Animal360 } from '../../../types/animal';

interface FichaCabeceraProps {
  animal: Animal360;
  onClose: () => void;
  onOpenEventoModal?: () => void;
  onPrint?: () => void;
}

export const FichaCabecera: React.FC<FichaCabeceraProps> = ({
  animal,
  onClose,
  onOpenEventoModal,
  onPrint
}) => {
  const alerta = animal.alertaSanitaria;
  const isRetiroActivo = alerta && alerta.activo && (alerta.diasRestantesLeche > 0 || alerta.diasRestantesCarne > 0);

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Alerta Sanitaria de Retiro de Fármacos (Inocuidad Láctea y Cárnica) */}
      {isRetiroActivo && (
        <div className="ficha360-withholding-banner">
          <div className="ficha360-withholding-content">
            <div className="ficha360-withholding-icon">
              <ShieldAlert size={20} color="#ffffff" />
            </div>
            <div className="ficha360-withholding-text">
              <div>
                <strong>⚠️ ALERTA DE INOCUIDAD — TIEMPO DE RETIRO FARMACOLÓGICO ACTIVO:</strong>{' '}
                {alerta.diagnostico} ({alerta.farmaco}).
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.95, marginTop: 2 }}>
                {alerta.ordenBloqueoTanque && (
                  <span style={{ color: '#fef08a', fontWeight: 700, marginRight: 8 }}>
                    ⛔ PROHIBIDO ENVIAR A TANQUE DE ENFRIAMIENTO COMÚN O BENEFICIO.
                  </span>
                )}
                Veterinario responsable: {alerta.veterinario}
              </div>
            </div>
          </div>

          <div className="ficha360-withholding-pills">
            {alerta.diasRestantesLeche > 0 && (
              <div className="ficha360-pill-milk">
                🥛 Retiro Leche: {alerta.diasRestantesLeche}d rest. (Hasta {alerta.fechaFinRetiroLeche})
              </div>
            )}
            {alerta.diasRestantesCarne > 0 && (
              <div className="ficha360-pill-meat">
                🥩 Retiro Carne: {alerta.diasRestantesCarne}d rest. (Hasta {alerta.fechaFinRetiroCarne})
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cabecera Principal */}
      <div className="ficha360-header">
        <div className="ficha360-header-top">
          {/* Identidad del Semoviente */}
          <div className="ficha360-header-identity">
            <div className="ficha360-tag-avatar">
              <span className="ficha360-tag-label">Arete</span>
              <span className="ficha360-tag-num">{animal.practico}</span>
            </div>
            <div className="ficha360-title-block">
              <h2>
                {animal.practico}
                {animal.alias && <span className="ficha360-alias">— {animal.alias}</span>}
              </h2>
              <div className="ficha360-codes-row">
                <div className="ficha360-code-item">
                  <Tag size={12} />
                  <span>Único: <strong>{animal.unico}</strong></span>
                </div>
                <div className="ficha360-code-item">
                  <Cpu size={12} />
                  <span>RFID: <strong>{animal.rfid || 'Sin Chip'}</strong></span>
                </div>
                <div className="ficha360-code-item">
                  <MapPin size={12} />
                  <span>{animal.lote} • {animal.potrero}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="ficha360-header-actions">
            <button
              type="button"
              className="ficha360-btn ficha360-btn-primary"
              onClick={onOpenEventoModal}
              title="Registrar nuevo evento para este animal"
            >
              <PlusCircle size={15} />
              + Evento
            </button>
            <button
              type="button"
              className="ficha360-btn ficha360-btn-ghost"
              onClick={onPrint || (() => window.print())}
              title="Descargar o imprimir Ficha Técnica Zootécnica"
            >
              <Printer size={15} />
              Ficha PDF
            </button>
            <button
              type="button"
              className="ficha360-close-btn"
              onClick={onClose}
              title="Cerrar Ficha 360"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Badges y Chips Dinámicos */}
        <div className="ficha360-badges-strip">
          <span className="ficha360-badge ficha360-badge-category" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span>
              {animal.especie === 'Aves de corral' ? '🐔' :
               animal.especie === 'Porcinos' ? '🐷' :
               animal.especie === 'Búfalos' ? '🐃' :
               animal.especie === 'Caprinos' ? '🐐' :
               animal.especie === 'Equinos' ? '🐴' : '🐮'}
            </span>
            <span>{animal.subcategoria || animal.categoria}</span>
          </span>
          {animal.especie && (
            <span className="ficha360-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
              {animal.especie === 'Aves de corral' ? 'Especie Avícola' : animal.especie}
            </span>
          )}
          {(animal.especie === 'Caprinos' || animal.especie === 'Equinos') && (
            <span className="ficha360-badge" style={{ backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 600 }}>
              2 Mamas (Bipapilar)
            </span>
          )}
          {animal.especie === 'Porcinos' && (
            <span className="ficha360-badge" style={{ backgroundColor: '#fdf2f8', color: '#be185d', fontWeight: 600 }}>
              Líneas Mamarias (Multípara)
            </span>
          )}
          <span className="ficha360-badge ficha360-badge-active">
            ● {animal.estatus}
          </span>
          <span className="ficha360-badge ficha360-badge-reproductive">
            <Heart size={12} />
            {animal.estatusReproductivo}
            {animal.diasGestacion ? ` (${animal.diasGestacion}d)` : ''}
          </span>
          <span className="ficha360-badge ficha360-badge-productive">
            <Milk size={12} />
            {animal.estatusProductivo}
          </span>
          <span className="ficha360-badge ficha360-badge-metric">
            <Clock size={12} />
            {animal.edadTexto}
          </span>
          <span className="ficha360-badge ficha360-badge-metric">
            🧬 {animal.raza}
          </span>
          {animal.alertaSanitaria && animal.alertaSanitaria.activo && (
            <span className="ficha360-badge" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
              <AlertTriangle size={12} />
              Retiro Activo
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
