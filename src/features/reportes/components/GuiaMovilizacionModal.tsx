import React, { useState, useMemo } from 'react';
import {
  X,
  FileCheck2,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Save,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Hash,
  Scale
} from 'lucide-react';
import { exportToPDF } from '../utils/exportUtils';

export interface CattleTransitItem {
  arete: string;
  nombre: string;
  categoria: string;
  raza: string;
  sexo: 'Hembra' | 'Macho';
  pesoKg: number;
  retiroFarmacoActivo: boolean;
  diasRetiroRestantes?: number;
  farmaco?: string;
}

const MOCK_TRANSIT_ANIMALS: CattleTransitItem[] = [
  { arete: '0001', nombre: 'Mariposa', categoria: 'Vaca', raza: 'Carora', sexo: 'Hembra', pesoKg: 465, retiroFarmacoActivo: false },
  { arete: '0002', nombre: 'Esperanza', categoria: 'Vaca', raza: 'Carora', sexo: 'Hembra', pesoKg: 480, retiroFarmacoActivo: false },
  { arete: 'CW002', nombre: 'Baronesa', categoria: 'Vaca', raza: 'Gyr Lechero', sexo: 'Hembra', pesoKg: 495, retiroFarmacoActivo: false },
  { arete: 'CW003', nombre: 'Reina', categoria: 'Vaca', raza: 'Gyr Lechero', sexo: 'Hembra', pesoKg: 510, retiroFarmacoActivo: false },
  { arete: 'CW004', nombre: 'Princesa', categoria: 'Vaca', raza: 'Gyr Lechero', sexo: 'Hembra', pesoKg: 440, retiroFarmacoActivo: false },
  { arete: 'CW005', nombre: 'Gitana', categoria: 'Vaca', raza: 'Girolando', sexo: 'Hembra', pesoKg: 475, retiroFarmacoActivo: false },
  { arete: 'CW006', nombre: 'Lucero', categoria: 'Vaca', raza: 'Brahman', sexo: 'Hembra', pesoKg: 520, retiroFarmacoActivo: false },
  { arete: 'CW007', nombre: 'Estrella', categoria: 'Vaca', raza: 'Carora', sexo: 'Hembra', pesoKg: 450, retiroFarmacoActivo: false },
  { arete: 'CW008', nombre: 'Milenaria', categoria: 'Vaca', raza: 'Holstein', sexo: 'Hembra', pesoKg: 560, retiroFarmacoActivo: true, diasRetiroRestantes: 5, farmaco: 'Cefalosporina Intramamaria' },
  { arete: 'CW009', nombre: 'Bandida', categoria: 'Vaca', raza: 'Holstein', sexo: 'Hembra', pesoKg: 530, retiroFarmacoActivo: false },
  { arete: 'CW013', nombre: 'Triunfadora', categoria: 'Novilla', raza: 'Carora', sexo: 'Hembra', pesoKg: 360, retiroFarmacoActivo: false },
  { arete: 'VC-88', nombre: 'Sombra', categoria: 'Vaca', raza: 'Gyr Lechero', sexo: 'Hembra', pesoKg: 470, retiroFarmacoActivo: false },
  { arete: 'VC-104', nombre: 'Coronela', categoria: 'Vaca', raza: 'Brahman', sexo: 'Hembra', pesoKg: 535, retiroFarmacoActivo: true, diasRetiroRestantes: 22, farmaco: 'Ivermectina 1% inyectable' },
  { arete: 'VC-115', nombre: 'Muñeca', categoria: 'Novilla', raza: 'Girolando', sexo: 'Hembra', pesoKg: 345, retiroFarmacoActivo: false },
  { arete: 'VC-120', nombre: 'Zafiro', categoria: 'Vaca', raza: 'Carora', sexo: 'Hembra', pesoKg: 490, retiroFarmacoActivo: false },
  { arete: 'NV-201', nombre: 'Novillo 201', categoria: 'Novillo', raza: 'Brahman', sexo: 'Macho', pesoKg: 430, retiroFarmacoActivo: false },
  { arete: 'NV-202', nombre: 'Novillo 202', categoria: 'Novillo', raza: 'Carora', sexo: 'Macho', pesoKg: 415, retiroFarmacoActivo: false },
  { arete: 'NV-205', nombre: 'Novillo 205', categoria: 'Novillo', raza: 'Brahman', sexo: 'Macho', pesoKg: 450, retiroFarmacoActivo: false }
];

interface GuiaMovilizacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (guia: any) => void;
}

export const GuiaMovilizacionModal: React.FC<GuiaMovilizacionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  // Datos oficiales de la Guía
  const [guiaNumber, setGuiaNumber] = useState(`GS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
  const [originHerd, setOriginHerd] = useState('Hacienda La Alborada (Rebaño Principal)');
  const [destinationHerd, setDestinationHerd] = useState('Finca Santa Inés (Lote de Ceba y Pastoreo)');
  const [purpose, setPurpose] = useState('Traslado a Pastoreo / Rotación');
  const [truckPlate, setTruckPlate] = useState('A84CD2K');
  const [truckModel, setTruckModel] = useState('Camión Ganadero Ford F-750 (Capacidad 25 UGG)');
  const [driverName, setDriverName] = useState('Pedro José Morales');
  const [driverId, setDriverId] = useState('V-14.892.301');
  const [driverPhone, setDriverPhone] = useState('+58 414-555-0192');
  const [securitySeals, setSecuritySeals] = useState('PRC-90412, PRC-90413');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  // Selección de semovientes
  const [selectedTags, setSelectedTags] = useState<string[]>(['0001', '0002', 'CW002', 'CW004', 'CW005']);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado de la lista de animales disponibles
  const filteredAnimals = useMemo(() => {
    return MOCK_TRANSIT_ANIMALS.filter(a => {
      const q = searchTerm.toLowerCase();
      return a.arete.toLowerCase().includes(q) || a.nombre.toLowerCase().includes(q) || a.raza.toLowerCase().includes(q);
    });
  }, [searchTerm]);

  const selectedAnimalsList = useMemo(() => {
    return MOCK_TRANSIT_ANIMALS.filter(a => selectedTags.includes(a.arete));
  }, [selectedTags]);

  // Chequeo de blindaje de inocuidad sanitaria (animales con tiempo de retiro activo)
  const animalsWithActiveWithdrawal = useMemo(() => {
    return selectedAnimalsList.filter(a => a.retiroFarmacoActivo);
  }, [selectedAnimalsList]);

  const toggleSelectAll = () => {
    if (selectedTags.length === MOCK_TRANSIT_ANIMALS.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(MOCK_TRANSIT_ANIMALS.map(a => a.arete));
    }
  };

  const toggleSelectAnimal = (arete: string) => {
    setSelectedTags(prev =>
      prev.includes(arete) ? prev.filter(t => t !== arete) : [...prev, arete]
    );
  };

  const isSlaughterhouse = purpose === 'Faena / Matadero';
  const hasCriticalSanitaryBlock = isSlaughterhouse && animalsWithActiveWithdrawal.length > 0;

  // Imprimir Guía Sanitaria Oficial en PDF
  const handlePrintOfficialPDF = () => {
    const headers = ['Nº Arete', 'Nombre', 'Categoría', 'Raza', 'Sexo', 'Peso (kg)', 'Estatus Retiro'];
    const rows = selectedAnimalsList.map(a => [
      a.arete,
      a.nombre,
      a.categoria,
      a.raza,
      a.sexo,
      `${a.pesoKg} kg`,
      a.retiroFarmacoActivo ? `RETIRO (${a.diasRetiroRestantes}d - ${a.farmaco})` : 'Liberado'
    ]);

    const title = `GUÍA SANITARIA OFICIAL DE MOVILIZACIÓN PECUARIA — Nº ${guiaNumber}`;
    exportToPDF(
      `guia_movilizacion_${guiaNumber}`,
      title,
      headers,
      rows
    );
  };

  // Guardar y registrar
  const handleSaveGuide = () => {
    if (hasCriticalSanitaryBlock) {
      alert('Error Crítico de Inocuidad: No se puede emitir una guía a matadero con animales en tiempo de retiro farmacológico.');
      return;
    }
    if (selectedTags.length === 0) {
      alert('Debe seleccionar al menos un semoviente para emitir la guía de movilización.');
      return;
    }

    const guiaData = {
      id: guiaNumber,
      fecha: issueDate,
      tipoTransaccion: 'Traslado',
      rebanoOrigen: originHerd,
      rebanoDestino: destinationHerd,
      cantidadAnimales: selectedTags.length,
      responsable: driverName,
      montoTotal: 0,
      precintos: securitySeals,
      placa: truckPlate,
      choferCedula: driverId,
      choferNombre: driverName,
      motivo: purpose,
      animales: selectedTags
    };

    if (onSuccess) {
      onSuccess(guiaData);
    }
    alert(`¡Guía Oficial de Movilización ${guiaNumber} generada y registrada con éxito!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="adhoc-modal-backdrop" onClick={onClose}>
      <div className="transit-guide-modal-window" onClick={e => e.stopPropagation()}>
        {/* Cabecera Oficial */}
        <div className="transit-header-seal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #4ade80'
            }}>
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 0.3 }}>
                GUÍA DE MOVILIZACIÓN PECUARIA & SANITARIA
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>
                Control de tránsito inter-predios y blindaje de bioseguridad zootécnica
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="transit-seal-badge">
              Nº {guiaNumber}
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{ color: '#ffffff', background: 'transparent', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="adhoc-modal-body">
          {/* Alerta de Retiro Farmacológico si aplica */}
          {animalsWithActiveWithdrawal.length > 0 && (
            <div className={`sanitary-withdrawal-alert ${hasCriticalSanitaryBlock ? 'critical' : ''}`}>
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>
                  {hasCriticalSanitaryBlock
                    ? 'BLOQUEO SANITARIO CRÍTICO: VIOLACIÓN DE INOCUIDAD AGROALIMENTARIA'
                    : 'ADVERTENCIA DE BIOSEGURIDAD: ANIMALES EN TRATAMIENTO'}
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: 12.5 }}>
                  Los siguientes semovientes seleccionados tienen tiempo de retiro farmacológico activo:{' '}
                  {animalsWithActiveWithdrawal.map(a => `${a.arete} (${a.farmaco} - ${a.diasRetiroRestantes}d)`).join(', ')}.
                  {hasCriticalSanitaryBlock && ' ¡ESTÁ PROHIBIDO TRASLADAR ANIMALES EN RETIRO A MATADEROS O FAENA!'}
                </p>
              </div>
            </div>
          )}

          {/* Bloque de Información del Tránsito */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-gray)',
            borderRadius: 10,
            padding: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 16
          }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Building size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Predio / Rebaño de Origen:
              </label>
              <select
                className="form-control"
                value={originHerd}
                onChange={e => setOriginHerd(e.target.value)}
                style={{ fontSize: 12.5 }}
              >
                <option value="Hacienda La Alborada (Rebaño Principal)">Hacienda La Alborada (Rebaño Principal)</option>
                <option value="Finca Santa Inés (Rebaño 02)">Finca Santa Inés (Rebaño 02)</option>
                <option value="Agropecuaria El Valle (HERD-03)">Agropecuaria El Valle (HERD-03)</option>
                <option value="Hato El Porvenir (HERD-04)">Hato El Porvenir (HERD-04)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Building size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Predio / Destino:
              </label>
              <select
                className="form-control"
                value={destinationHerd}
                onChange={e => setDestinationHerd(e.target.value)}
                style={{ fontSize: 12.5 }}
              >
                <option value="Finca Santa Inés (Lote de Ceba y Pastoreo)">Finca Santa Inés (Lote de Ceba y Pastoreo)</option>
                <option value="Hacienda La Alborada (Rebaño Principal)">Hacienda La Alborada (Rebaño Principal)</option>
                <option value="Agropecuaria El Valle (HERD-03)">Agropecuaria El Valle (HERD-03)</option>
                <option value="Matadero Frigorífico Industrial San Francisco">Matadero Frigorífico Industrial San Francisco</option>
                <option value="Centro de Subastas y Remates Agropecuarios">Centro de Subastas y Remates Agropecuarios</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                Finalidad de la Movilización:
              </label>
              <select
                className="form-control"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                style={{ fontSize: 12.5 }}
              >
                <option value="Traslado a Pastoreo / Rotación">Traslado a Pastoreo / Rotación</option>
                <option value="Venta de Ganado Comercial">Venta de Ganado Comercial</option>
                <option value="Faena / Matadero">Faena / Matadero</option>
                <option value="Exposición / Feria Ganadera">Exposición / Feria Ganadera</option>
                <option value="Servicio Reproductivo / Monta">Servicio Reproductivo / Monta</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Truck size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Placa y Modelo del Camión:
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  className="form-control"
                  value={truckPlate}
                  onChange={e => setTruckPlate(e.target.value)}
                  placeholder="Placa..."
                  style={{ width: 100, fontSize: 12.5, fontWeight: 700 }}
                />
                <input
                  type="text"
                  className="form-control"
                  value={truckModel}
                  onChange={e => setTruckModel(e.target.value)}
                  placeholder="Modelo vehículo..."
                  style={{ flex: 1, fontSize: 12.5 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <User size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Chofer Transportista (Cédula y Nombre):
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  className="form-control"
                  value={driverId}
                  onChange={e => setDriverId(e.target.value)}
                  placeholder="Cédula..."
                  style={{ width: 110, fontSize: 12.5 }}
                />
                <input
                  type="text"
                  className="form-control"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  placeholder="Nombre completo..."
                  style={{ flex: 1, fontSize: 12.5 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Hash size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Precintos de Seguridad:
              </label>
              <input
                type="text"
                className="form-control"
                value={securitySeals}
                onChange={e => setSecuritySeals(e.target.value)}
                placeholder="Códigos de precintos..."
                style={{ fontSize: 12.5 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Calendar size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Fecha Emisión / Vence:
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="date"
                  className="form-control"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  style={{ fontSize: 12 }}
                />
                <input
                  type="date"
                  className="form-control"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                  style={{ fontSize: 12 }}
                />
              </div>
            </div>
          </div>

          {/* Selector de Semovientes Transportados */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-gray)',
            borderRadius: 10,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  Inventario de Semovientes a Movilizar
                </strong>
                <span className="badge-category" style={{ backgroundColor: '#e8f5e9', color: 'var(--primary-color)', fontWeight: 700 }}>
                  {selectedTags.length} de {MOCK_TRANSIT_ANIMALS.length} seleccionados
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={toggleSelectAll}
                  style={{ fontSize: 12, color: 'var(--primary-color)' }}
                >
                  {selectedTags.length === MOCK_TRANSIT_ANIMALS.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                </button>
                <div className="report-search-bar" style={{ width: 220 }}>
                  <Search className="report-search-icon" size={14} />
                  <input
                    type="text"
                    className="report-search-input"
                    placeholder="Buscar por arete..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            </div>

            <div className="animal-select-table-box">
              <table className="report-grid-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Sel.</th>
                    <th>Arete</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Raza</th>
                    <th>Sexo</th>
                    <th>Peso Vivo</th>
                    <th>Estado Sanitario / Inocuidad</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnimals.map(animal => {
                    const isChecked = selectedTags.includes(animal.arete);
                    return (
                      <tr
                        key={animal.arete}
                        onClick={() => toggleSelectAnimal(animal.arete)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isChecked ? '#f0fdf4' : animal.retiroFarmacoActivo ? '#fffbeb' : 'transparent'
                        }}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ accentColor: 'var(--primary-color)' }}
                          />
                        </td>
                        <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{animal.arete}</td>
                        <td style={{ fontWeight: 600 }}>{animal.nombre}</td>
                        <td>{animal.categoria}</td>
                        <td>{animal.raza}</td>
                        <td>{animal.sexo}</td>
                        <td>{animal.pesoKg} kg</td>
                        <td>
                          {animal.retiroFarmacoActivo ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#991b1b',
                              backgroundColor: '#fee2e2',
                              padding: '2px 6px',
                              borderRadius: 4
                            }}>
                              <AlertTriangle size={12} />
                              Retiro: {animal.diasRetiroRestantes}d ({animal.farmaco})
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              color: '#15803d',
                              backgroundColor: '#dcfce7',
                              padding: '2px 6px',
                              borderRadius: 4
                            }}>
                              <CheckCircle2 size={12} />
                              Sanitariamente Apto
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="adhoc-modal-footer">
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Total animales a transportar: <strong>{selectedTags.length}</strong> | Carga estimada: <strong>{selectedAnimalsList.reduce((acc, a) => acc + a.pesoKg, 0).toLocaleString()} kg</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrintOfficialPDF}
              disabled={selectedTags.length === 0}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
            >
              <Printer size={15} />
              <span>Imprimir Guía Sanitaria</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleSaveGuide}
              disabled={hasCriticalSanitaryBlock || selectedTags.length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                opacity: (hasCriticalSanitaryBlock || selectedTags.length === 0) ? 0.6 : 1
              }}
            >
              <Save size={15} />
              <span>Generar y Registrar Guía</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
