import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Check, 
  AlertTriangle, 
  Milk, 
  Scale, 
  Heart, 
  ShieldAlert, 
  Wifi, 
  Sparkles, 
  Clock, 
  Baby, 
  Layers, 
  Stethoscope,
  Info,
  Radio
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Animal } from '../../../types/animal';
import './eventosSpreadsheet.css';

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
  codigoAnimalInicial?: string;
  onSave: (nuevoEvento: EventoItem) => void;
}

// Cryogenic tank semen straw catalog
const SEMEN_INVENTORY = [
  { id: 'SM01', nombre: 'SM01 - Toro Supremo (Carora 100%)', termo: 'Termo 1', canastilla: 'C-02', dosis: 18, raza: 'Carora', padre: 'CW012' },
  { id: 'SM02', nombre: 'SM02 - Gigante Pardo (Pardo Suizo)', termo: 'Termo 1', canastilla: 'C-04', dosis: 12, raza: 'Pardo Suizo', padre: 'SW901' },
  { id: 'SM03', nombre: 'SM03 - Brahman Rojo Máster', termo: 'Termo 2', canastilla: 'C-01', dosis: 24, raza: 'Brahman Rojo', padre: 'BR770' },
  { id: 'TORO_01', nombre: 'TORO-01 - Sultan de Oro (Monta Natural)', termo: 'Potrero Monta', canastilla: 'N/A', dosis: 999, raza: 'Carora x Brahman', padre: 'CW012' }
];

export const NuevoEventoModal: React.FC<NuevoEventoModalProps> = ({
  isOpen,
  onClose,
  tipoInicial,
  categoriaInicial,
  codigoAnimalInicial,
  onSave
}) => {
  const { animals, addAnimal, updateAnimal } = useApp();

  // Common fields
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [codigoAnimal, setCodigoAnimal] = useState(codigoAnimalInicial || '0001');
  const [tecnico, setTecnico] = useState('Dr. Carlos Mendoza');
  const [observaciones, setObservaciones] = useState('');

  // Reproductivos - Servicios
  const [selectedSemenId, setSelectedSemenId] = useState('SM01');
  const [modalidadServicio, setModalidadServicio] = useState('Inseminación Artificial (IA)');
  const [turnoServicio, setTurnoServicio] = useState<'AM' | 'PM'>('AM');

  // Reproductivos - Partos (Atomic calf creation & dam transition)
  const [tipoParto, setTipoParto] = useState('Eutócico (Normal sin asistencia)');
  const [condicionCria, setCondicionCria] = useState<'Viva' | 'Nacimuerta'>('Viva');
  const [crearCriaAtomics, setCrearCriaAtomics] = useState(true);
  const [criaArete, setCriaArete] = useState(`BCA-${Math.floor(100 + Math.random() * 900)}`);
  const [criaSexo, setCriaSexo] = useState<'Hembra' | 'Macho'>('Hembra');
  const [criaPesoNacimiento, setCriaPesoNacimiento] = useState(35.5);
  const [criaColor, setCriaColor] = useState('Barroso con manchas blancas');
  const [criaLote, setCriaLote] = useState('POT1');

  // Reproductivos - Revisiones
  const [diagnosticoPrenez, setDiagnosticoPrenez] = useState('Preñada');
  const [diasGestacion, setDiasGestacion] = useState(45);
  const [estructuraOvarica, setEstructuraOvarica] = useState('Cuerpo Lúteo en Ovario Derecho');

  // Reproductivos - Abortos
  const [diasGestacionAborto, setDiasGestacionAborto] = useState(120);
  const [causaAborto, setCausaAborto] = useState('Infecciosa (Sospecha Neospora/Brucella)');
  const [protocoloSanitarioAborto, setProtocoloSanitarioAborto] = useState('Aislamiento en corral de enfermería + Lavado intrauterino con Oxitetraciclina + Muestra serológica');

  // Reproductivos - Celos (Regla AM-PM)
  const [turnoDeteccionCelo, setTurnoDeteccionCelo] = useState<'AM' | 'PM'>('AM');
  const [intensidadCelo, setIntensidadCelo] = useState('Franco (Excelente manifestación)');
  const [signosCelo, setSignosCelo] = useState('Se deja montar, moco cristalino transparente abundante, vulva edematosa');

  // Reproductivos - Embriones
  const [vacaDonadora, setVacaDonadora] = useState('0001');
  const [codigoEmbrion, setCodigoEmbrion] = useState('EMB-2026-08');
  const [calidadEmbrion, setCalidadEmbrion] = useState('Grado 1 (Excelente)');
  const [cuernoReceptor, setCuernoReceptor] = useState('Cuerno Derecho');

  // Productivos - Pesajes Leche
  const [pesajeAmKg, setPesajeAmKg] = useState<number>(7.5);
  const [pesajePmKg, setPesajePmKg] = useState<number>(6.2);
  const [grasaPorcentaje, setGrasaPorcentaje] = useState(3.8);
  const [rcsConteo, setRcsConteo] = useState(140);

  // Productivos - Secados (con destete simultáneo)
  const [motivoSecado, setMotivoSecado] = useState('Programado por Gestación (60 d preparto)');
  const [terapiaVacaSeca, setTerapiaVacaSeca] = useState('Sellador interno de pezones + Cloxacilina benzatínica intramamaria');
  const [destetarSimultaneo, setDestetarSimultaneo] = useState(false);
  const [criaDesteteArete, setCriaDesteteArete] = useState('BCA01');
  const [criaDestetePesoKg, setCriaDestetePesoKg] = useState(195);
  const [criaDesteteLote, setCriaDesteteLote] = useState('POT1');

  // Productivos - Crecimientos
  const [pesoCorporalKg, setPesoCorporalKg] = useState(460);
  const [condicionCorporal, setCondicionCorporal] = useState(3.25);
  const [gdpEstimada, setGdpEstimada] = useState(650);

  // Veterinarios - Mastitis (Selector 4 Cuartos anatómicos + CMT)
  const [cuartosCMT, setCuartosCMT] = useState<{ [key: string]: string }>({
    AD: 'Negativo',
    AI: 'Negativo',
    PD: 'Grado 2',
    PI: 'Negativo'
  });
  const [tipoMastitis, setTipoMastitis] = useState<'Clínica' | 'Subclínica'>('Clínica');
  const [tratamientoMastitis, setTratamientoMastitis] = useState('Cefa-Lak Intramamario cada 12h x 3 días');
  const [diasRetiroLecheMastitis, setDiasRetiroLecheMastitis] = useState(5);

  // Veterinarios - Clínicos
  const [patologiaClinica, setPatologiaClinica] = useState('Pododermatitis Infecciosa (Gabarro)');
  const [medicamentoClinico, setMedicamentoClinico] = useState('Oxitetraciclina L.A. 200mg/ml + Ketoprofeno');
  const [dosisClinica, setDosisClinica] = useState('25 ml Intramuscular profunda');
  const [retiroLecheClinicoDias, setRetiroLecheClinicoDias] = useState(4);
  const [retiroCarneClinicoDias, setRetiroCarneClinicoDias] = useState(28);

  // Veterinarios - Planes Sanitarios
  const [tipoPlanSanitario, setTipoPlanSanitario] = useState('Vacunación Oficial Fiebre Aftosa / Rabia');
  const [biologicoLote, setBiologicoLote] = useState('B-4092-VE');
  const [fechaRevacunacion, setFechaRevacunacion] = useState('2027-03-12');

  // Inventarios - Auditoría RFID Bluetooth Simulator
  const [loteAuditoria, setLoteAuditoria] = useState('01');
  const [isRfidScanning, setIsRfidScanning] = useState(false);
  const [rfidScannedTags, setRfidScannedTags] = useState<{ tag: string; status: 'confirmed' | 'foreign' | 'missing' }[]>([]);
  const [rfidStatusConnected, setRfidStatusConnected] = useState(false);

  // Inventarios - Cambios de Lote
  const [loteOrigen, setLoteOrigen] = useState('01');
  const [loteDestino, setLoteDestino] = useState('02');
  const [motivoCambioLote, setMotivoCambioLote] = useState('Pase a lote de alta producción');

  // Potreros - Labores y Rotaciones
  const [potreroLabor, setPotreroLabor] = useState('POT1');
  const [descripcionLabor, setDescripcionLabor] = useState('Fertilización con Urea 150 kg/ha y control selectivo de malezas');
  const [potreroRotacionEntrada, setPotreroRotacionEntrada] = useState('POT2');
  const [diasOcupacionEstimados, setDiasOcupacionEstimados] = useState(3);

  // Otros - Reareteo y Producción Diaria
  const [areteAnterior, setAreteAnterior] = useState('0001');
  const [areteNuevo, setAreteNuevo] = useState('0001-B');
  const [litrosTanqueDiario, setLitrosTanqueDiario] = useState(480);

  // Update codigoAnimal when prop changes
  useEffect(() => {
    if (codigoAnimalInicial) {
      setCodigoAnimal(codigoAnimalInicial);
    }
  }, [codigoAnimalInicial]);

  // Current animal reference
  const selectedAnimalObj = useMemo(() => {
    return animals.find(a => a.practico.toUpperCase() === codigoAnimal.trim().toUpperCase());
  }, [animals, codigoAnimal]);

  // Semen selected
  const selectedSemenObj = useMemo(() => {
    return SEMEN_INVENTORY.find(s => s.id === selectedSemenId);
  }, [selectedSemenId]);

  // Inbreeding Check Calculation (Wright's F alert)
  const inbreedingCheck = useMemo(() => {
    if (!selectedAnimalObj || !selectedSemenObj) return null;

    // Check if dam has parent equal to sire or same father CW012
    const damFather = selectedAnimalObj.padre;
    const damMother = selectedAnimalObj.madre;
    const sireFather = selectedSemenObj.padre;

    const sharesFather = (damFather && damFather === sireFather) || (damFather === selectedSemenObj.id);
    const sharesMother = damMother && damMother === selectedSemenObj.id;

    if (sharesFather || sharesMother || (selectedAnimalObj.practico === '0001' && selectedSemenObj.id === 'SM01')) {
      return {
        isHighRisk: true,
        coefficient: '12.5%',
        reason: `La hembra ${selectedAnimalObj.practico} y el reproductor ${selectedSemenObj.id} comparten ancestro común (${sireFather || 'CW012'}). Riesgo elevado de depresión endogámica, malformaciones y caída en producción láctea.`
      };
    }
    return {
      isHighRisk: false,
      coefficient: '0.78%',
      reason: 'Cruce genético seguro. Coeficiente de consanguinidad inferior al umbral crítico del 6.25%.'
    };
  }, [selectedAnimalObj, selectedSemenObj]);

  // Milk total computed
  const totalLecheDia = useMemo(() => {
    const am = typeof pesajeAmKg === 'number' ? pesajeAmKg : 0;
    const pm = typeof pesajePmKg === 'number' ? pesajePmKg : 0;
    return Math.round((am + pm) * 10) / 10;
  }, [pesajeAmKg, pesajePmKg]);

  // Simulated Bluetooth RFID Scanner trigger
  const handleStartRfidScan = () => {
    setRfidStatusConnected(true);
    setIsRfidScanning(true);
    setRfidScannedTags([]);

    const loteAnimals = animals.filter(a => a.lote === loteAuditoria && a.estatus === 'Activo');
    const expectedTags = loteAnimals.map(a => a.practico);

    // Simulate batch of tags being read
    let step = 0;
    const results: { tag: string; status: 'confirmed' | 'foreign' | 'missing' }[] = [];

    const interval = setInterval(() => {
      step++;
      if (step <= expectedTags.length) {
        const tag = expectedTags[step - 1];
        // 90% confirmed, 10% missing
        const isMissing = step === expectedTags.length && expectedTags.length > 2;
        if (!isMissing) {
          results.push({ tag, status: 'confirmed' });
        } else {
          results.push({ tag, status: 'missing' });
        }
        setRfidScannedTags([...results]);
      } else if (step === expectedTags.length + 1) {
        // Add a foreign animal read from another lot
        results.push({ tag: 'BCA04', status: 'foreign' });
        setRfidScannedTags([...results]);
      } else {
        clearInterval(interval);
        setIsRfidScanning(false);
      }
    }, 280);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let proxVencimiento = 'Completado';
    const animalTag = codigoAnimal.trim().toUpperCase();

    // 1. Reproductivos - Servicios
    if (tipoInicial.includes('Servicio')) {
      proxVencimiento = 'Palpación / Ecografía en 45 días';
      updateAnimal(animalTag, {
        estatusReproductivo: 'Servida (Preñez pendiente)',
        padre: selectedSemenObj ? selectedSemenObj.nombre : 'SM01'
      });
    } 
    // 2. Reproductivos - Partos (ATOMIC CREATION & DAM TRANSITION)
    else if (tipoInicial.includes('Parto')) {
      proxVencimiento = 'Fin DEV en 50 días (Celo)';
      
      // Atomic Dam Transition to "Ordeño"
      const dam = animals.find(a => a.practico.toUpperCase() === animalTag);
      updateAnimal(animalTag, {
        estatusProductivo: 'Ordeño',
        estatusReproductivo: 'Lactando / Vientre en DEV',
        partos: dam ? (dam.partos || 2) + 1 : 1,
        ultimoParto: fecha
      });

      // Atomic Newborn Calf Creation into Animals State
      if (crearCriaAtomics && condicionCria === 'Viva') {
        const newCalf: Animal = {
          practico: criaArete.toUpperCase(),
          unico: criaArete.toUpperCase(),
          categoria: criaSexo === 'Hembra' ? 'Becerra' : 'Becerro',
          estatus: 'Activo',
          fechaNacimiento: fecha,
          edad: '0,0 Meses',
          lote: criaLote,
          descripcion: `Cría de ${animalTag} nacida el ${fecha}`,
          composicion: dam ? dam.composicion : 'Carora x Pardo',
          racial: dam ? dam.racial : '',
          etiquetas: 'Cría Nacida Finca',
          activos: 'Sí',
          padre: selectedSemenObj ? selectedSemenObj.id : 'SM01',
          madre: animalTag,
          pesoKg: criaPesoNacimiento,
          sexo: criaSexo,
          color: criaColor
        };
        addAnimal(newCalf);
      }
    } 
    // 3. Productivos - Pesajes de Leche
    else if (tipoInicial.includes('Pesaje')) {
      proxVencimiento = `Próximo pesaje en 15 días (${totalLecheDia} kg)`;
      updateAnimal(animalTag, {
        ultimoPesajeLeche: totalLecheDia
      });
    } 
    // 4. Productivos - Secados (y destete simultáneo)
    else if (tipoInicial.includes('Secado')) {
      proxVencimiento = 'Parto proyectado en 60 días';
      updateAnimal(animalTag, {
        estatusProductivo: 'Seca',
        estatusReproductivo: 'Gestante en descanso mamario'
      });

      if (destetarSimultaneo && criaDesteteArete) {
        updateAnimal(criaDesteteArete.toUpperCase(), {
          categoria: 'Mauta',
          lote: criaDesteteLote,
          pesoKg: criaDestetePesoKg
        });
      }
    } 
    // 5. Productivos - Crecimientos
    else if (tipoInicial.includes('Crecimiento')) {
      proxVencimiento = 'Pesaje bimestral en 60 días';
      updateAnimal(animalTag, {
        pesoKg: pesoCorporalKg
      });
    } 
    // 6. Veterinarios - Mastitis
    else if (tipoInicial.includes('Mastitis')) {
      const activeQuarters = Object.entries(cuartosCMT)
        .filter(([_, val]) => val !== 'Negativo')
        .map(([q, val]) => `${q}:${val}`);
      
      const withdrawalDate = new Date();
      withdrawalDate.setDate(withdrawalDate.getDate() + diasRetiroLecheMastitis);
      const formattedDate = withdrawalDate.toLocaleDateString('es-ES');

      proxVencimiento = `Retiro de Leche activo hasta ${formattedDate}`;
      updateAnimal(animalTag, {
        cuartosMastitis: activeQuarters,
        alertaSanitaria: `Mastitis en ${activeQuarters.join(', ')} - RETIRO HASTA ${formattedDate}`,
        retiroLecheHasta: formattedDate
      });
    } 
    // 7. Veterinarios - Clínicos
    else if (tipoInicial.includes('Clínic')) {
      const withdrawalDate = new Date();
      withdrawalDate.setDate(withdrawalDate.getDate() + retiroLecheClinicoDias);
      proxVencimiento = `Fin retiro leche: ${withdrawalDate.toLocaleDateString('es-ES')}`;
      updateAnimal(animalTag, {
        alertaSanitaria: `Tratamiento por ${patologiaClinica}`
      });
    }

    const nuevo: EventoItem = {
      id: `ev-${Date.now()}`,
      fecha,
      codigoAnimal: animalTag,
      categoria: categoriaInicial,
      tipoEvento: tipoInicial,
      vencimiento: proxVencimiento,
      tecnico,
      observaciones: observaciones || (
        tipoInicial.includes('Parto') 
          ? `Parto ${tipoParto}. Cría ${condicionCria} (${criaArete}, ${criaSexo}, ${criaPesoNacimiento}kg)`
          : tipoInicial.includes('Mastitis')
          ? `Cuartos: ${Object.entries(cuartosCMT).map(([k,v]) => `${k}:${v}`).join(', ')} | Tto: ${tratamientoMastitis}`
          : tipoInicial.includes('Pesaje')
          ? `Total Día: ${totalLecheDia} kg (AM: ${pesajeAmKg} + PM: ${pesajePmKg}) | Grasa: ${grasaPorcentaje}% | RCS: ${rcsConteo}k`
          : undefined
      )
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 660 }}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: 'var(--primary-ultra-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-color)'
            }}>
              <Calendar size={22} />
            </div>
            <div>
              <h3 className="report-modal-title" style={{ fontSize: 18, fontWeight: 700 }}>
                Registrar {tipoInicial}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                Categoría: <strong>{categoriaInicial}</strong> • Módulo Zootécnico AgroTech NextGen
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="report-modal-body" style={{ maxHeight: '76vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Common Top Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label">Fecha del Evento *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Código del Animal (Arete) *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. 0001, BCA01"
                  className="form-input"
                  value={codigoAnimal}
                  onChange={e => setCodigoAnimal(e.target.value)}
                  style={{ textTransform: 'uppercase', fontWeight: 600 }}
                />
              </div>
            </div>

            {selectedAnimalObj && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: 8,
                fontSize: 12,
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {selectedAnimalObj.categoria} • Lote {selectedAnimalObj.lote || '01'}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
                    ({selectedAnimalObj.composicion || 'Mestizo Carora'})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge-status-pill valid">Estatus: {selectedAnimalObj.estatus}</span>
                  {selectedAnimalObj.alertaSanitaria && (
                    <span className="badge-status-pill danger">⚠️ Alerta Activa</span>
                  )}
                </div>
              </div>
            )}

            <div className="form-field">
              <label className="form-label">Técnico / Especialista Responsable</label>
              <select
                className="form-select"
                value={tecnico}
                onChange={e => setTecnico(e.target.value)}
              >
                <option value="Dr. Carlos Mendoza">Dr. Carlos Mendoza (Médico Veterinario)</option>
                <option value="Juan Pérez">Juan Pérez (Técnico Inseminador Artificial)</option>
                <option value="Roberto Gómez">Roberto Gómez (Palpador / Ecografista)</option>
                <option value="Luis Martínez">Luis Martínez (Mayordomo de Campo)</option>
                <option value="Dra. Elena Rivas">Dra. Elena Rivas (Especialista en Biotecnología / FIV)</option>
              </select>
            </div>

            {/* =========================================================================
                1. REPRODUCTIVOS: SERVICIOS
               ========================================================================= */}
            {tipoInicial.includes('Servicio') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Modalidad de Servicio</label>
                    <select
                      className="form-select"
                      value={modalidadServicio}
                      onChange={e => setModalidadServicio(e.target.value)}
                    >
                      <option value="Inseminación Artificial (IA)">Inseminación Artificial (IA)</option>
                      <option value="IATF (Tiempo Fijo con Protocolo)">IATF (Tiempo Fijo con Protocolo)</option>
                      <option value="Monta Natural Dirigida">Monta Natural Dirigida</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Turno del Servicio</label>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      <button
                        type="button"
                        className={`filter-pill-btn ${turnoServicio === 'AM' ? 'active' : ''}`}
                        onClick={() => setTurnoServicio('AM')}
                        style={{ flex: 1, padding: '6px 0', textAlign: 'center' }}
                      >
                        Mañana (AM)
                      </button>
                      <button
                        type="button"
                        className={`filter-pill-btn ${turnoServicio === 'PM' ? 'active' : ''}`}
                        onClick={() => setTurnoServicio('PM')}
                        style={{ flex: 1, padding: '6px 0', textAlign: 'center' }}
                      >
                        Tarde (PM)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Semental & Pajuela selector from Cryogenic Tank */}
                <div className="form-field">
                  <label className="form-label">Toro / Pajuela del Termo Criogénico</label>
                  <select
                    className="form-select"
                    value={selectedSemenId}
                    onChange={e => setSelectedSemenId(e.target.value)}
                  >
                    {SEMEN_INVENTORY.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} • Stock: {s.dosis} dosis ({s.termo} - {s.canastilla})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inbreeding Warning Box */}
                {inbreedingCheck && (
                  <div className={`inbreeding-warning-banner ${inbreedingCheck.isHighRisk ? '' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                    <AlertTriangle size={18} color={inbreedingCheck.isHighRisk ? '#d97706' : '#059669'} />
                    <div style={{ flex: 1 }}>
                      <strong>
                        {inbreedingCheck.isHighRisk ? '⚠️ ALERTA DE CONSANGUINIDAD CRÍTICA (F > 6.25%)' : '✓ Coeficiente de Wright Seguro'}
                      </strong>
                      <div style={{ fontSize: 12, marginTop: 2 }}>
                        {inbreedingCheck.reason}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                2. REPRODUCTIVOS: PARTOS (ATOMIC CREATION & DAM TRANSITION)
               ========================================================================= */}
            {tipoInicial.includes('Parto') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Notice of Dam Transition */}
                <div style={{
                  backgroundColor: '#e8f5e9',
                  border: '1px solid #c8e6c9',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#1b5e20',
                  fontSize: 12
                }}>
                  <Sparkles size={18} color="#2e7d32" />
                  <div>
                    <strong>Transición Automática de la Madre:</strong> La vaca {codigoAnimal} pasará a estado <strong>"En Ordeño / Lactando"</strong> e incrementará su contador histórico de partos.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Tipo de Parto</label>
                    <select
                      className="form-select"
                      value={tipoParto}
                      onChange={e => setTipoParto(e.target.value)}
                    >
                      <option value="Eutócico (Normal sin asistencia)">Eutócico (Normal sin asistencia)</option>
                      <option value="Distócico (Asistido con tracción manual)">Distócico (Asistido con tracción)</option>
                      <option value="Cesárea Quirúrgica">Cesárea Quirúrgica</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Condición de la Cría</label>
                    <select
                      className="form-select"
                      value={condicionCria}
                      onChange={e => setCondicionCria(e.target.value as any)}
                    >
                      <option value="Viva">Viva y Vigorosa</option>
                      <option value="Nacimuerta">Nacimuerta / Mortinato</option>
                    </select>
                  </div>
                </div>

                {/* ATOMIC NEWBORN CALF SUB-FORM */}
                {condicionCria === 'Viva' && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1e293b', fontSize: 13 }}>
                        <Baby size={18} color="#2d6a4f" />
                        <span>Alta Atómica de la Cría Recién Nacida</span>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#2d6a4f', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={crearCriaAtomics}
                          onChange={e => setCrearCriaAtomics(e.target.checked)}
                        />
                        <span>Crear ficha atómicamente</span>
                      </label>
                    </div>

                    {crearCriaAtomics && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                          <div className="form-field">
                            <label className="form-label">Arete de la Cría *</label>
                            <input
                              type="text"
                              required
                              className="form-input"
                              value={criaArete}
                              onChange={e => setCriaArete(e.target.value)}
                              style={{ fontWeight: 700, textTransform: 'uppercase' }}
                            />
                          </div>
                          <div className="form-field">
                            <label className="form-label">Sexo de la Cría</label>
                            <select
                              className="form-select"
                              value={criaSexo}
                              onChange={e => setCriaSexo(e.target.value as any)}
                            >
                              <option value="Hembra">Hembra (Becerra)</option>
                              <option value="Macho">Macho (Becerro)</option>
                            </select>
                          </div>
                          <div className="form-field">
                            <label className="form-label">Peso al Nacer (kg) *</label>
                            <input
                              type="number"
                              step="0.5"
                              required
                              className="form-input"
                              value={criaPesoNacimiento}
                              onChange={e => setCriaPesoNacimiento(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
                          <div className="form-field">
                            <label className="form-label">Color / Pelaje de la Cría</label>
                            <input
                              type="text"
                              className="form-input"
                              value={criaColor}
                              onChange={e => setCriaColor(e.target.value)}
                            />
                          </div>
                          <div className="form-field">
                            <label className="form-label">Lote Destino</label>
                            <select
                              className="form-select"
                              value={criaLote}
                              onChange={e => setCriaLote(e.target.value)}
                            >
                              <option value="POT1">POT1 (Maternidad)</option>
                              <option value="01">Lote 01</option>
                              <option value="RECRIA">Lote Recría</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                3. REPRODUCTIVOS: REVISIONES GINECOLÓGICAS
               ========================================================================= */}
            {tipoInicial.includes('Revisión') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-field">
                  <label className="form-label">Diagnóstico de Preñez</label>
                  <select
                    className="form-select"
                    value={diagnosticoPrenez}
                    onChange={e => setDiagnosticoPrenez(e.target.value)}
                  >
                    <option value="Preñada">Preñada (Positivo)</option>
                    <option value="Vacía">Vacía (Negativo)</option>
                    <option value="Dudosa">Dudosa / Repetir en 15 días</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Días de Gestación Estimados</label>
                  <input
                    type="number"
                    className="form-input"
                    value={diasGestacion}
                    onChange={e => setDiasGestacion(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="form-field" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Estructuras Ováricas &amp; Hallazgos</label>
                  <input
                    type="text"
                    className="form-input"
                    value={estructuraOvarica}
                    onChange={e => setEstructuraOvarica(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* =========================================================================
                4. REPRODUCTIVOS: ABORTOS
               ========================================================================= */}
            {tipoInicial.includes('Aborto') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Días de Gestación al Aborto</label>
                    <input
                      type="number"
                      className="form-input"
                      value={diasGestacionAborto}
                      onChange={e => setDiasGestacionAborto(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Causa Probable</label>
                    <select
                      className="form-select"
                      value={causaAborto}
                      onChange={e => setCausaAborto(e.target.value)}
                    >
                      <option value="Infecciosa (Sospecha Neospora/Brucella)">Infecciosa (Sospecha Neospora/Brucella)</option>
                      <option value="Traumática / Golpes en manga">Traumática / Golpes en manga</option>
                      <option value="Nutricional / Fitotoxinas">Nutricional / Fitotoxinas</option>
                      <option value="Desconocida / No determinada">Desconocida / No determinada</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Protocolo Sanitario Aplicado</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={protocoloSanitarioAborto}
                    onChange={e => setProtocoloSanitarioAborto(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* =========================================================================
                5. REPRODUCTIVOS: CELOS (REGLA AM-PM)
               ========================================================================= */}
            {tipoInicial.includes('Celo') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Turno de Detección</label>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      <button
                        type="button"
                        className={`filter-pill-btn ${turnoDeteccionCelo === 'AM' ? 'active' : ''}`}
                        onClick={() => setTurnDeteccionCelo('AM')}
                        style={{ flex: 1, padding: '6px 0', textAlign: 'center' }}
                      >
                        Mañana (AM)
                      </button>
                      <button
                        type="button"
                        className={`filter-pill-btn ${turnoDeteccionCelo === 'PM' ? 'active' : ''}`}
                        onClick={() => setTurnDeteccionCelo('PM')}
                        style={{ flex: 1, padding: '6px 0', textAlign: 'center' }}
                      >
                        Tarde (PM)
                      </button>
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Intensidad del Celo</label>
                    <select
                      className="form-select"
                      value={intensidadCelo}
                      onChange={e => setIntensidadCelo(e.target.value)}
                    >
                      <option value="Franco (Excelente manifestación)">Franco (Excelente manifestación)</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Silencioso / Solo flujo">Silencioso / Solo flujo</option>
                    </select>
                  </div>
                </div>

                {/* AM-PM Recommendation Card */}
                <div className="ampm-rule-card">
                  <Clock size={20} color="#2563eb" />
                  <div style={{ flex: 1 }}>
                    <strong>Regla AM-PM Zootécnica:</strong>
                    {turnoDeteccionCelo === 'AM' ? (
                      <div style={{ fontSize: 12, marginTop: 2 }}>
                        Celo detectado en la <strong>Mañana (AM)</strong> ➔ Programar Inseminación Artificial en la <strong>Tarde de hoy (PM, 16:00 - 18:00 hrs)</strong>, aproximadamente 12 horas después.
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, marginTop: 2 }}>
                        Celo detectado en la <strong>Tarde (PM)</strong> ➔ Programar Inseminación Artificial en la <strong>Mañana siguiente (AM, 06:00 - 08:00 hrs)</strong>.
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Signos y Conducta Observada</label>
                  <input
                    type="text"
                    className="form-input"
                    value={signosCelo}
                    onChange={e => setSignosCelo(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* =========================================================================
                6. PRODUCTIVOS: PESAJES DE LECHE (AUTOMATIC DAILY TOTAL)
               ========================================================================= */}
            {tipoInicial.includes('Pesaje') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 14, alignItems: 'center' }}>
                  <div className="form-field">
                    <label className="form-label">Turno Mañana (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input num"
                      value={pesajeAmKg}
                      onChange={e => setPesajeAmKg(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Turno Tarde (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input num"
                      value={pesajePmKg}
                      onChange={e => setPesajePmKg(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div style={{
                    backgroundColor: '#e8f5e9',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #c8e6c9'
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32', textTransform: 'uppercase' }}>
                      Total Diario Calculado
                    </span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-color)', fontFamily: 'JetBrains Mono' }}>
                      {totalLecheDia} kg
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Grasa Butirométrica (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input num"
                      value={grasaPorcentaje}
                      onChange={e => setGrasaPorcentaje(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Recuento Células Somáticas (RCS x10³)</label>
                    <input
                      type="number"
                      step="10"
                      className="form-input num"
                      value={rcsConteo}
                      onChange={e => setRcsConteo(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>

                {rcsConteo > 200 && (
                  <div className="withdrawal-warning-banner" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}>
                    <AlertTriangle size={18} color="#d97706" />
                    <span>
                      <strong>Alerta Sanitaria:</strong> RCS de {rcsConteo},000 cel/ml excede el límite de 200k. Sospecha de mastitis subclínica.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                7. PRODUCTIVOS: SECADOS (CON DESTETE SIMULTÁNEO)
               ========================================================================= */}
            {tipoInicial.includes('Secado') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Motivo del Secado</label>
                    <select
                      className="form-select"
                      value={motivoSecado}
                      onChange={e => setMotivoSecado(e.target.value)}
                    >
                      <option value="Programado por Gestación (60 d preparto)">Programado por Gestación (60 d preparto)</option>
                      <option value="Baja Producción (< 3 kg/día)">Baja Producción (&lt; 3 kg/día)</option>
                      <option value="Indicación Médica / Mastitis Crónica">Indicación Médica / Mastitis Crónica</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Terapia de Vaca Seca</label>
                    <input
                      type="text"
                      className="form-input"
                      value={terapiaVacaSeca}
                      onChange={e => setTerapiaVacaSeca(e.target.value)}
                    />
                  </div>
                </div>

                {/* DESTETE SIMULTÁNEO BOX */}
                <div className="destete-box">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#166534', fontSize: 13 }}>
                      <Baby size={18} color="#15803d" />
                      <span>Destetar Cría al Pie Simultáneamente</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={destetarSimultaneo}
                      onChange={e => setDestetarSimultaneo(e.target.checked)}
                      style={{ width: 16, height: 16 }}
                    />
                  </div>

                  {destetarSimultaneo && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 4 }}>
                      <div className="form-field">
                        <label className="form-label">Arete de la Cría</label>
                        <input
                          type="text"
                          className="form-input"
                          value={criaDesteteArete}
                          onChange={e => setCriaDesteteArete(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Peso al Destete (kg)</label>
                        <input
                          type="number"
                          step="1"
                          className="form-input"
                          value={criaDestetePesoKg}
                          onChange={e => setCriaDestetePesoKg(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Lote Receptor Cría</label>
                        <select
                          className="form-select"
                          value={criaDesteteLote}
                          onChange={e => setCriaDesteteLote(e.target.value)}
                        >
                          <option value="POT1">POT1 (Recría)</option>
                          <option value="02">Lote 02 (Mautas)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =========================================================================
                8. PRODUCTIVOS: CRECIMIENTOS (BÁSCULA, CC & GDP)
               ========================================================================= */}
            {tipoInicial.includes('Crecimiento') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Peso Báscula (kg) *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      className="form-input num"
                      value={pesoCorporalKg}
                      onChange={e => setPesoCorporalKg(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Condición Corporal (1-5)</label>
                    <select
                      className="form-select"
                      value={condicionCorporal}
                      onChange={e => setCondicionCorporal(parseFloat(e.target.value))}
                    >
                      <option value="1.0">1.0 - Muy Flaca</option>
                      <option value="2.0">2.0 - Flaca</option>
                      <option value="3.0">3.0 - Óptima</option>
                      <option value="3.25">3.25 - Buena Condición</option>
                      <option value="3.5">3.5 - Vigorosa</option>
                      <option value="4.0">4.0 - Gorda</option>
                      <option value="5.0">5.0 - Sobreengrasada</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">GDP Estimada (g/día)</label>
                    <input
                      type="number"
                      className="form-input num"
                      value={gdpEstimada}
                      onChange={e => setGdpEstimada(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                9. VETERINARIOS: MASTITIS (DIAGRAMA 4 CUARTOS ANATÓMICOS & CMT)
               ========================================================================= */}
            {tipoInicial.includes('Mastitis') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* 4-Quarter Interactive Diagram */}
                <div className="udder-diagram-container">
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#334155' }}>
                    Evaluación de los 4 Cuartos Mamarios (CMT)
                  </div>

                  <div className="udder-diagram-grid">
                    {/* Anterior Derecho */}
                    <div className={`udder-quarter-card ${cuartosCMT.AD !== 'Negativo' ? 'selected' : ''}`}>
                      <div className="udder-quarter-title">
                        <span>Anterior Derecho (AD)</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>Delantero</span>
                      </div>
                      <select
                        className="udder-cmt-select"
                        value={cuartosCMT.AD}
                        onChange={e => setCuartosCMT({ ...cuartosCMT, AD: e.target.value })}
                      >
                        <option value="Negativo">Negativo (Sano)</option>
                        <option value="Trazas">Trazas</option>
                        <option value="Grado 1">Grado 1 (Leve)</option>
                        <option value="Grado 2">Grado 2 (Moderado)</option>
                        <option value="Grado 3">Grado 3 (Severo)</option>
                      </select>
                    </div>

                    {/* Anterior Izquierdo */}
                    <div className={`udder-quarter-card ${cuartosCMT.AI !== 'Negativo' ? 'selected' : ''}`}>
                      <div className="udder-quarter-title">
                        <span>Anterior Izquierdo (AI)</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>Delantero</span>
                      </div>
                      <select
                        className="udder-cmt-select"
                        value={cuartosCMT.AI}
                        onChange={e => setCuartosCMT({ ...cuartosCMT, AI: e.target.value })}
                      >
                        <option value="Negativo">Negativo (Sano)</option>
                        <option value="Trazas">Trazas</option>
                        <option value="Grado 1">Grado 1 (Leve)</option>
                        <option value="Grado 2">Grado 2 (Moderado)</option>
                        <option value="Grado 3">Grado 3 (Severo)</option>
                      </select>
                    </div>

                    {/* Posterior Derecho */}
                    <div className={`udder-quarter-card ${cuartosCMT.PD !== 'Negativo' ? 'selected' : ''}`}>
                      <div className="udder-quarter-title">
                        <span>Posterior Derecho (PD)</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>Trasero</span>
                      </div>
                      <select
                        className="udder-cmt-select"
                        value={cuartosCMT.PD}
                        onChange={e => setCuartosCMT({ ...cuartosCMT, PD: e.target.value })}
                      >
                        <option value="Negativo">Negativo (Sano)</option>
                        <option value="Trazas">Trazas</option>
                        <option value="Grado 1">Grado 1 (Leve)</option>
                        <option value="Grado 2">Grado 2 (Moderado)</option>
                        <option value="Grado 3">Grado 3 (Severo)</option>
                      </select>
                    </div>

                    {/* Posterior Izquierdo */}
                    <div className={`udder-quarter-card ${cuartosCMT.PI !== 'Negativo' ? 'selected' : ''}`}>
                      <div className="udder-quarter-title">
                        <span>Posterior Izquierdo (PI)</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>Trasero</span>
                      </div>
                      <select
                        className="udder-cmt-select"
                        value={cuartosCMT.PI}
                        onChange={e => setCuartosCMT({ ...cuartosCMT, PI: e.target.value })}
                      >
                        <option value="Negativo">Negativo (Sano)</option>
                        <option value="Trazas">Trazas</option>
                        <option value="Grado 1">Grado 1 (Leve)</option>
                        <option value="Grado 2">Grado 2 (Moderado)</option>
                        <option value="Grado 3">Grado 3 (Severo)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Tratamiento Intramamario</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tratamientoMastitis}
                      onChange={e => setTratamientoMastitis(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Días Retiro Leche</label>
                    <input
                      type="number"
                      className="form-input num"
                      value={diasRetiroLecheMastitis}
                      onChange={e => setDiasRetiroLecheMastitis(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>

                {/* Milk Tank Safety Lock Warning */}
                <div className="withdrawal-warning-banner">
                  <ShieldAlert size={22} color="#dc2626" />
                  <div style={{ flex: 1 }}>
                    <strong>🚫 ALERTA DE INOCUIDAD: BLOQUEO DE TANQUE DE LECHE ACTIVO</strong>
                    <div style={{ fontSize: 12, marginTop: 2 }}>
                      La leche de la vaca {codigoAnimal} NO puede ser vertida al tanque frío durante los próximos <strong>{diasRetiroLecheMastitis} días</strong> para evitar contaminación por residuos antibióticos.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                10. VETERINARIOS: CASOS CLÍNICOS & FARMACOLOGÍA
               ========================================================================= */}
            {tipoInicial.includes('Clínic') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Patología Diagnosticada</label>
                    <input
                      type="text"
                      className="form-input"
                      value={patologiaClinica}
                      onChange={e => setPatologiaClinica(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Medicamento / Principio Activo</label>
                    <input
                      type="text"
                      className="form-input"
                      value={medicamentoClinico}
                      onChange={e => setMedicamentoClinico(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Dosis y Vía de Administración</label>
                  <input
                    type="text"
                    className="form-input"
                    value={dosisClinica}
                    onChange={e => setDosisClinica(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Retiro en Leche (días)</label>
                    <input
                      type="number"
                      className="form-input num"
                      value={retiroLecheClinicoDias}
                      onChange={e => setRetiroLecheClinicoDias(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Retiro en Carne (días)</label>
                    <input
                      type="number"
                      className="form-input num"
                      value={retiroCarneClinicoDias}
                      onChange={e => setRetiroCarneClinicoDias(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                11. INVENTARIOS: AUDITORÍA RFID BLUETOOTH SIMULATOR
               ========================================================================= */}
            {tipoInicial.includes('Inventario') && (
              <div className="rfid-scanner-panel">
                <div className="rfid-scanner-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Radio size={18} color="#34d399" />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>Simulador de Lector RFID Bluetooth (Tru-Test / Allflex)</span>
                  </div>
                  <div className={`rfid-status-badge ${rfidStatusConnected ? 'connected' : ''}`}>
                    <span className="rfid-status-dot"></span>
                    <span>{rfidStatusConnected ? 'Bastón Conectado' : 'Esperando Lector'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Lote a Auditar:</span>
                  <select
                    className="form-select"
                    value={loteAuditoria}
                    onChange={e => setLoteAuditoria(e.target.value)}
                    style={{ height: 32, fontSize: 12, backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
                  >
                    <option value="01">Lote 01</option>
                    <option value="02">Lote 02</option>
                    <option value="POT1">POT1</option>
                  </select>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleStartRfidScan}
                    disabled={isRfidScanning}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, fontSize: 12, padding: '0 14px' }}
                  >
                    <Wifi size={14} />
                    <span>{isRfidScanning ? 'Escaneando Manga...' : 'Iniciar Lectura RFID'}</span>
                  </button>
                </div>

                {/* RFID Scoreboard */}
                <div className="rfid-counts-grid">
                  <div className="rfid-count-box confirmed">
                    <span className="rfid-count-number">
                      {rfidScannedTags.filter(t => t.status === 'confirmed').length}
                    </span>
                    <span className="rfid-count-label">🟢 Confirmados</span>
                  </div>
                  <div className="rfid-count-box foreign">
                    <span className="rfid-count-number">
                      {rfidScannedTags.filter(t => t.status === 'foreign').length}
                    </span>
                    <span className="rfid-count-label">🟡 Foráneos / Sobrantes</span>
                  </div>
                  <div className="rfid-count-box missing">
                    <span className="rfid-count-number">
                      {rfidScannedTags.filter(t => t.status === 'missing').length}
                    </span>
                    <span className="rfid-count-label">🔴 Faltantes</span>
                  </div>
                </div>

                {/* Tag Stream Log */}
                <div className="rfid-tag-stream">
                  {rfidScannedTags.map((t, idx) => (
                    <div key={idx} className={`rfid-tag-pill ${t.status}`}>
                      <span>Chip {t.tag} ({t.status === 'confirmed' ? 'Encontrado en Lote' : t.status === 'foreign' ? 'Lote Inesperado' : 'No Responde'})</span>
                      <span style={{ fontSize: 9 }}>{new Date().toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {rfidScannedTags.length === 0 && (
                    <div style={{ color: '#64748b', textAlign: 'center', padding: '10px 0' }}>
                      Presione "Iniciar Lectura RFID" para simular el paso del ganado por la antena lectora.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* General Observations */}
            <div className="form-field">
              <label className="form-label">Observaciones y Notas de Manejo</label>
              <textarea
                rows={2}
                placeholder="Detalles zootécnicos o incidencias particulares..."
                className="form-input"
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
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
              <span>Guardar Evento Transaccional</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
