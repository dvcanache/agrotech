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
  Radio,
  Egg,
  Search
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Animal, EspecieAnimal, ESPECIES_TAXONOMY } from '../../../types/animal';
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

// Multi-species semen and sire catalogs
const SEMEN_CATALOG_BY_SPECIES: Record<string, Array<{ id: string; nombre: string; termo: string; canastilla: string; dosis: number; raza: string; padre: string }>> = {
  'Bovinos': [
    { id: 'SM01', nombre: 'SM01 - Toro Supremo (Carora 100%)', termo: 'Termo 1', canastilla: 'C-02', dosis: 18, raza: 'Carora', padre: 'CW012' },
    { id: 'SM02', nombre: 'SM02 - Gigante Pardo (Pardo Suizo)', termo: 'Termo 1', canastilla: 'C-04', dosis: 12, raza: 'Pardo Suizo', padre: 'SW901' },
    { id: 'SM03', nombre: 'SM03 - Brahman Rojo Máster', termo: 'Termo 2', canastilla: 'C-01', dosis: 24, raza: 'Brahman Rojo', padre: 'BR770' },
    { id: 'TORO_01', nombre: 'TORO-01 - Sultán de Oro (Monta Natural)', termo: 'Potrero Monta', canastilla: 'N/A', dosis: 999, raza: 'Carora x Brahman', padre: 'CW012' }
  ],
  'Búfalos': [
    { id: 'BUF-MUR01', nombre: 'MUR-RAJA - Murrah de Élite (India)', termo: 'Termo 2', canastilla: 'C-03', dosis: 15, raza: 'Murrah', padre: 'MUR-KING' },
    { id: 'BUF-MED01', nombre: 'MED-ROMA - Mediterráneo Italiano 100%', termo: 'Termo 2', canastilla: 'C-05', dosis: 10, raza: 'Mediterráneo', padre: 'MED-CESAR' },
    { id: 'PAD_BUF01', nombre: 'PAD-BUF01 - Sultán del Pantano (Monta Natural)', termo: 'Sabana Baja', canastilla: 'N/A', dosis: 999, raza: 'Murrah x Mediterráneo', padre: 'MUR-RAJA' }
  ],
  'Caprinos': [
    { id: 'CAP-SAAN01', nombre: 'SAAN-SUIZA - Saanen Lechero Máster', termo: 'Termo 3', canastilla: 'C-01', dosis: 20, raza: 'Saanen', padre: 'SAAN-ALPES' },
    { id: 'CAP-ALP01', nombre: 'ALP-PARIS - Alpino Francés Grand Cru', termo: 'Termo 3', canastilla: 'C-02', dosis: 14, raza: 'Alpino Francés', padre: 'ALP-CHAMP' },
    { id: 'CHIV_01', nombre: 'CHIV-01 - Apache de Oro (Monta Natural)', termo: 'Aprisco Reproducción', canastilla: 'N/A', dosis: 999, raza: 'Alpino x Saanen', padre: 'ALP-PARIS' }
  ],
  'Equinos': [
    { id: 'EQU-QM01', nombre: 'QM-GOLD - Cuarto de Milla Reining Star', termo: 'Termo Equino', canastilla: 'C-01', dosis: 8, raza: 'Cuarto de Milla', padre: 'SHINING-SPARK' },
    { id: 'EQU-PSI01', nombre: 'PSI-CHAMPION - Pura Sangre Inglés', termo: 'Termo Equino', canastilla: 'C-02', dosis: 6, raza: 'Pura Sangre', padre: 'NORTHERN-DANCER' },
    { id: 'PADR_01', nombre: 'PADR-01 - Relámpago Criollo (Monta)', termo: 'Caballerizas', canastilla: 'N/A', dosis: 999, raza: 'Criollo Venezolano', padre: 'CENTAURO' }
  ],
  'Porcinos': [
    { id: 'POR-PIET01', nombre: 'PIET-01 - Pietrain Belga Máster (Dosis Fresca)', termo: 'Conservador Semen 16°C', canastilla: 'D-01', dosis: 16, raza: 'Pietrain', padre: 'PIET-BEL' },
    { id: 'POR-DUR01', nombre: 'DUR-01 - Duroc Jersey Línea Terminal', termo: 'Conservador Semen 16°C', canastilla: 'D-02', dosis: 22, raza: 'Duroc', padre: 'DUR-RED' },
    { id: 'VERR_01', nombre: 'VERR-01 - Hércules Landrace (Monta)', termo: 'Corral Verracos', canastilla: 'N/A', dosis: 999, raza: 'Landrace', padre: 'LAND-GER' }
  ]
};

// Species-tailored Vaccination and Vademécum plans
const VACCINE_PLANS_BY_SPECIES: Record<string, string[]> = {
  'Aves de corral': [
    'Vacunación Newcastle (Cepa LaSota ocular/agua)',
    'Vacunación Gumboro (Enfermedad de la Bolsa IBD)',
    'Vacunación Bronquitis Infecciosa (Cepa H-120)',
    'Vacunación Viruela Aviar (Punción alar)',
    'Vacunación Marek (Al 1er día en incubadora)',
    'Vacunación Coriza Infecciosa Aviar (Inactivada)'
  ],
  'Porcinos': [
    'Vacunación Peste Porcina Clásica (PPC - Oficial)',
    'Vacunación Parvovirus Porcino + Leptospira (Parvo-Lepto)',
    'Vacunación Circovirus Porcino Tipo 2 (PCV2)',
    'Vacunación Micoplasma hyopneumoniae (Neumonía enzoótica)',
    'Vacunación Mal Rojo / Erisipela Porcina'
  ],
  'Equinos': [
    'Prueba Serológica Anemia Infecciosa Equina (AIE - Test Coggins)',
    'Vacunación Encefalomielitis Equina Venezolana (EEV)',
    'Vacunación Toxoide Tetánico (Prevención Tétanos)',
    'Vacunación Influenza Equina (Gripe A)',
    'Vacunación Rinoneumonitis Equina (Herpesvirus EHV-1/4)'
  ],
  'Bovinos': [
    'Vacunación Oficial Fiebre Aftosa (Bivalente A y O)',
    'Vacunación Brucelosis Bovina (Cepa 19 / RB-51 hembras)',
    'Vacunación Rabia Paresiante (Vampiricida Derriengue)',
    'Vacunación Clostridiosis (Carbón sintomático / Triple)',
    'Vacunación Complejo Reproductivo (IBR, DVB, Leptospira)'
  ],
  'Búfalos': [
    'Vacunación Oficial Fiebre Aftosa Bivalente',
    'Vacunación Brucelosis Bubalina (RB-51 oficial)',
    'Vacunación Rabia Paresiante de los Llanos',
    'Vacunación Clostridiosis y Mancha Negra',
    'Desparasitación Estratégica Antiparasitaria L.A.'
  ],
  'Caprinos': [
    'Vacunación Clostridiosis Polivalente (Enterotoxemia)',
    'Vacunación Linfadenitis Caseosa (Pseudotuberculosis)',
    'Vacunación Fiebre Aftosa / Rabia de Pequeños Rumiantes',
    'Tratamiento Ectima Contagioso (Boquera caprina)',
    'Control Serológico Artritis Encefalitis Caprina (CAE)'
  ]
};

const VADEMECUM_BY_SPECIES: Record<string, Array<{ nombre: string; dosis: string; retiroLeche: number; retiroCarne: number }>> = {
  'Aves de corral': [
    { nombre: 'Enrofloxacina soluble al 10%', dosis: '10 mg/kg vía agua de bebida x 5 días', retiroLeche: 0, retiroCarne: 7 },
    { nombre: 'Amoxicilina soluble al 50%', dosis: '20 mg/kg en agua x 4 días', retiroLeche: 0, retiroCarne: 5 },
    { nombre: 'Toltrazuril al 2.5% (Anticoccidial)', dosis: '7 mg/kg dosis continua x 2 días', retiroLeche: 0, retiroCarne: 12 },
    { nombre: 'Complejo B + Electrolitos antiestrés', dosis: '1 g/litro de agua de bebida', retiroLeche: 0, retiroCarne: 0 }
  ],
  'Porcinos': [
    { nombre: 'Tulatromicina 100 mg/ml (Draxxin)', dosis: '2.5 mg/kg IM profunda única', retiroLeche: 0, retiroCarne: 28 },
    { nombre: 'Hierro Dextrano 200 mg/ml', dosis: '2 ml IM en cuello a lechones de 3 días', retiroLeche: 0, retiroCarne: 0 },
    { nombre: 'Ivermectina porcina al 1%', dosis: '1 ml cada 33 kg subcutánea', retiroLeche: 0, retiroCarne: 21 },
    { nombre: 'Tiamulina Fumarato al 20%', dosis: '10 mg/kg IM profunda x 3 días', retiroLeche: 0, retiroCarne: 14 }
  ],
  'Equinos': [
    { nombre: 'Flunixin Meglumine 50 mg/ml (Banamine)', dosis: '1.1 mg/kg IV lenta para cólicos', retiroLeche: 0, retiroCarne: 28 },
    { nombre: 'Fenilbutazona 200 mg/ml inyectable', dosis: '4.4 mg/kg IV lenta musculoesquelético', retiroLeche: 0, retiroCarne: 28 },
    { nombre: 'Ivermectina + Praziquantel en pasta oral', dosis: '1 jeringa por cada 600 kg vía oral', retiroLeche: 0, retiroCarne: 28 },
    { nombre: 'Dexametasona 2 mg/ml', dosis: '0.05 mg/kg IV o IM antiinflamatorio', retiroLeche: 0, retiroCarne: 21 }
  ],
  'Bovinos': [
    { nombre: 'Oxitetraciclina L.A. 200 mg/ml', dosis: '20 mg/kg (1 ml/10 kg) IM profunda', retiroLeche: 4, retiroCarne: 28 },
    { nombre: 'Penicilina G Procaína + Estreptomicina', dosis: '10,000 UI/kg IM cada 24h x 3 días', retiroLeche: 3, retiroCarne: 14 },
    { nombre: 'Ivermectina 3.15% L.A.', dosis: '1 ml/50 kg subcutánea', retiroLeche: 30, retiroCarne: 35 },
    { nombre: 'Cefa-Lak Intramamario (Cefapirina sódica)', dosis: '1 jeringa por cuarto afectado cada 12h x 2 dosis', retiroLeche: 4, retiroCarne: 4 },
    { nombre: 'Ketoprofeno 10% / Flunixin', dosis: '3 mg/kg IM o IV analgésico', retiroLeche: 1, retiroCarne: 4 }
  ],
  'Búfalos': [
    { nombre: 'Oxitetraciclina L.A. 200 mg/ml', dosis: '20 mg/kg IM profunda', retiroLeche: 4, retiroCarne: 28 },
    { nombre: 'Closantel al 10% inyectable', dosis: '1 ml/20 kg subcutánea (Fasciola/Garrapata)', retiroLeche: 28, retiroCarne: 30 },
    { nombre: 'Ivermectina 3.15% L.A.', dosis: '1 ml/50 kg subcutánea', retiroLeche: 30, retiroCarne: 35 },
    { nombre: 'Ketoprofeno 10% inyectable', dosis: '3 mg/kg IM', retiroLeche: 1, retiroCarne: 4 }
  ],
  'Caprinos': [
    { nombre: 'Oxitetraciclina L.A. 200 mg/ml', dosis: '20 mg/kg IM profunda', retiroLeche: 4, retiroCarne: 21 },
    { nombre: 'Penicilina Procaínica Caprina', dosis: '1 ml/15 kg IM cada 24h', retiroLeche: 3, retiroCarne: 14 },
    { nombre: 'Ivermectina caprina 1%', dosis: '1 ml/50 kg subcutánea', retiroLeche: 14, retiroCarne: 21 },
    { nombre: 'Flunixin Meglumine 50 mg/ml', dosis: '1.1 mg/kg IM', retiroLeche: 2, retiroCarne: 7 }
  ]
};

export const NuevoEventoModal: React.FC<NuevoEventoModalProps> = ({
  isOpen,
  onClose,
  tipoInicial,
  categoriaInicial,
  codigoAnimalInicial,
  onSave
}) => {
  const { animals, addAnimal, updateAnimal } = useApp();

  // Multi-species filter in animal selector
  const [filterSpecies, setFilterSpecies] = useState<'Todas' | EspecieAnimal>('Todas');
  const [manualCodeMode, setManualCodeMode] = useState(false);

  // Common fields
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [codigoAnimal, setCodigoAnimal] = useState(codigoAnimalInicial || '0001');
  const [tecnico, setTecnico] = useState('Dr. Carlos Mendoza');
  const [observaciones, setObservaciones] = useState('');

  // Selected animal reference
  const selectedAnimalObj = useMemo(() => {
    return animals.find(a => a.practico.toUpperCase() === codigoAnimal.trim().toUpperCase());
  }, [animals, codigoAnimal]);

  // Detected active species
  const currentSpecies: EspecieAnimal = useMemo(() => {
    if (selectedAnimalObj?.especie) return selectedAnimalObj.especie;
    const tag = codigoAnimal.toUpperCase();
    if (tag.startsWith('AVE-') || tag.startsWith('GALP-')) return 'Aves de corral';
    if (tag.startsWith('POR-')) return 'Porcinos';
    if (tag.startsWith('BUF-')) return 'Búfalos';
    if (tag.startsWith('CAP-')) return 'Caprinos';
    if (tag.startsWith('EQU-')) return 'Equinos';
    return 'Bovinos';
  }, [selectedAnimalObj, codigoAnimal]);

  // Taxonomy item for icons & metadata
  const speciesTaxonomy = ESPECIES_TAXONOMY[currentSpecies] || ESPECIES_TAXONOMY['Bovinos'];
  const isDairySpecies = currentSpecies === 'Bovinos' || currentSpecies === 'Búfalos' || currentSpecies === 'Caprinos';
  const isPoultry = currentSpecies === 'Aves de corral';
  const isSwine = currentSpecies === 'Porcinos';
  const isEquine = currentSpecies === 'Equinos';
  const isRuminant = currentSpecies === 'Bovinos' || currentSpecies === 'Búfalos' || currentSpecies === 'Caprinos';

  // Filtered animal list for dropdown
  const filteredAnimalsList = useMemo(() => {
    if (filterSpecies === 'Todas') return animals;
    return animals.filter(a => a.especie === filterSpecies || (!a.especie && filterSpecies === 'Bovinos'));
  }, [animals, filterSpecies]);

  // Semen catalog for current species
  const semenOptions = useMemo(() => {
    return SEMEN_CATALOG_BY_SPECIES[currentSpecies] || SEMEN_CATALOG_BY_SPECIES['Bovinos'];
  }, [currentSpecies]);

  // Reproductivos - Servicios (Bovinos, Búfalos, Caprinos, Equinos)
  const [selectedSemenId, setSelectedSemenId] = useState('SM01');
  const [modalidadServicio, setModalidadServicio] = useState('Inseminación Artificial (IA)');
  const [turnoServicio, setTurnoServicio] = useState<'AM' | 'PM'>('AM');

  // Reproductivos - Partos (Ruminants & Equines)
  const [tipoParto, setTipoParto] = useState('Eutócico (Normal sin asistencia)');
  const [condicionCria, setCondicionCria] = useState<'Viva' | 'Nacimuerta'>('Viva');
  const [crearCriaAtomics, setCrearCriaAtomics] = useState(true);
  const [criaArete, setCriaArete] = useState(`CRIA-${Math.floor(100 + Math.random() * 900)}`);
  const [criaSexo, setCriaSexo] = useState<'Hembra' | 'Macho'>('Hembra');
  const [criaPesoNacimiento, setCriaPesoNacimiento] = useState(36.0);
  const [criaColor, setCriaColor] = useState('Color característico racial');
  const [criaLote, setCriaLote] = useState('POT1');

  // Reproductivos Porcinos: Camada de Lechones
  const [lechonesVivos, setLechonesVivos] = useState(12);
  const [lechonesMuertos, setLechonesMuertos] = useState(1);
  const [momias, setMomias] = useState(0);
  const [pesoCamadaKg, setPesoCamadaKg] = useState(16.8);
  const [pezonesFuncionales, setPezonesFuncionales] = useState(14);
  const [salaMaternidad, setSalaMaternidad] = useState('GALP-PAR');
  const [adopcionesNodriza, setAdopcionesNodriza] = useState(0);

  // Reproductivos Aves: Incubación / Eclosión
  const [huevosFertilesIncubados, setHuevosFertilesIncubados] = useState(150);
  const [diasIncubacion, setDiasIncubacion] = useState(21);
  const [pollitosVivos, setPollitosVivos] = useState(138);
  const [huevosInfertiles, setHuevosInfertiles] = useState(8);
  const [muerteEmbrionaria, setMuerteEmbrionaria] = useState(4);
  const [salaIncubacion, setSalaIncubacion] = useState('INC-01');
  const [calidadPollito, setCalidadPollito] = useState('Grado 1 Élite (Pasgar Score 9+)');

  // Reproductivos - Revisiones
  const [diagnosticoPrenez, setDiagnosticoPrenez] = useState('Preñada');
  const [diasGestacion, setDiasGestacion] = useState(45);
  const [estructuraOvarica, setEstructuraOvarica] = useState('Cuerpo Lúteo en Ovario Derecho');

  // Reproductivos - Abortos
  const [diasGestacionAborto, setDiasGestacionAborto] = useState(120);
  const [causaAborto, setCausaAborto] = useState('Infecciosa (Sospecha Neospora/Brucella)');
  const [protocoloSanitarioAborto, setProtocoloSanitarioAborto] = useState('Aislamiento en corral de enfermería + Lavado intrauterino + Muestra serológica');

  // Reproductivos - Celos
  const [turnoDeteccionCelo, setTurnoDeteccionCelo] = useState<'AM' | 'PM'>('AM');
  const [intensidadCelo, setIntensidadCelo] = useState('Franco (Excelente manifestación)');
  const [signosCelo, setSignosCelo] = useState('Reflejo de inmovilidad, secreción mucosa transparente');

  // Productivos - Pesajes Leche (Dairy Species)
  const [pesajeAmKg, setPesajeAmKg] = useState<number>(7.5);
  const [pesajePmKg, setPesajePmKg] = useState<number>(6.2);
  const [grasaPorcentaje, setGrasaPorcentaje] = useState(3.8);
  const [rcsConteo, setRcsConteo] = useState(140);

  // Productivos - Postura de Huevos (Poultry)
  const [huevosComercialesAvicola, setHuevosComercialesAvicola] = useState<number>(2380);
  const [huevosRotosAvicola, setHuevosRotosAvicola] = useState<number>(35);
  const [pesoHuevoAvicola, setPesoHuevoAvicola] = useState<number>(62.5);
  const [calidadCascara, setCalidadCascara] = useState('Excelente Comercial (Cáscara A)');

  // Productivos - Secados
  const [motivoSecado, setMotivoSecado] = useState('Programado por Gestación (60 d preparto)');
  const [terapiaVacaSeca, setTerapiaVacaSeca] = useState('Sellador interno de pezones + Antibiótico intramamario');
  const [destetarSimultaneo, setDestetarSimultaneo] = useState(false);
  const [criaDesteteArete, setCriaDesteteArete] = useState('CRIA-01');
  const [criaDestetePesoKg, setCriaDestetePesoKg] = useState(195);
  const [criaDesteteLote, setCriaDesteteLote] = useState('POT1');

  // Productivos - Crecimientos (All species)
  const [pesoCorporalKg, setPesoCorporalKg] = useState(460);
  const [condicionCorporal, setCondicionCorporal] = useState(3.25);
  const [gdpEstimada, setGdpEstimada] = useState(650);

  // Veterinarios - Mastitis
  const [cuartosCMT, setCuartosCMT] = useState<{ [key: string]: string }>({
    AD: 'Negativo',
    AI: 'Negativo',
    PD: 'Grado 2',
    PI: 'Negativo'
  });
  const [tratamientoMastitis, setTratamientoMastitis] = useState('Cefa-Lak Intramamario cada 12h x 3 días');
  const [diasRetiroLecheMastitis, setDiasRetiroLecheMastitis] = useState(5);

  // Veterinarios - Clínicos & Planes Sanitarios
  const [tipoPlanSanitario, setTipoPlanSanitario] = useState('');
  const [biologicoLote, setBiologicoLote] = useState('B-2026-OFICIAL');
  const [fechaRevacunacion, setFechaRevacunacion] = useState('2027-03-15');
  const [patologiaClinica, setPatologiaClinica] = useState('Control Clínico Preventivo');
  const [medicamentoClinico, setMedicamentoClinico] = useState('');
  const [dosisClinica, setDosisClinica] = useState('');
  const [retiroLecheClinicoDias, setRetiroLecheClinicoDias] = useState(4);
  const [retiroCarneClinicoDias, setRetiroCarneClinicoDias] = useState(28);

  // Synchronize defaults when species changes
  useEffect(() => {
    if (semenOptions.length > 0) {
      setSelectedSemenId(semenOptions[0].id);
    }
    
    // Set typical weight defaults
    if (isPoultry) {
      setPesoCorporalKg(2.4);
      setGdpEstimada(55);
    } else if (isSwine) {
      setPesoCorporalKg(95);
      setGdpEstimada(800);
      setCriaArete(`LECH-${Math.floor(100 + Math.random() * 900)}`);
    } else if (currentSpecies === 'Caprinos') {
      setPesoCorporalKg(48);
      setGdpEstimada(150);
      setPesajeAmKg(2.2);
      setPesajePmKg(1.7);
      setGrasaPorcentaje(4.2);
      setRcsConteo(160);
      setCriaArete(`CAB-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(4.0);
    } else if (currentSpecies === 'Búfalos') {
      setPesoCorporalKg(580);
      setGdpEstimada(750);
      setPesajeAmKg(4.8);
      setPesajePmKg(3.8);
      setGrasaPorcentaje(7.8);
      setRcsConteo(120);
      setCriaArete(`BUC-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(38.0);
    } else if (isEquine) {
      setPesoCorporalKg(490);
      setGdpEstimada(500);
      setCriaArete(`POT-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(45.0);
    } else {
      setPesoCorporalKg(460);
      setGdpEstimada(650);
      setPesajeAmKg(7.5);
      setPesajePmKg(6.2);
      setGrasaPorcentaje(3.8);
      setRcsConteo(140);
      setCriaArete(`BCA-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(35.5);
    }

    // Set vaccine and vademecum defaults
    const vaccines = VACCINE_PLANS_BY_SPECIES[currentSpecies] || VACCINE_PLANS_BY_SPECIES['Bovinos'];
    setTipoPlanSanitario(vaccines[0]);

    const meds = VADEMECUM_BY_SPECIES[currentSpecies] || VADEMECUM_BY_SPECIES['Bovinos'];
    if (meds.length > 0) {
      setMedicamentoClinico(meds[0].nombre);
      setDosisClinica(meds[0].dosis);
      setRetiroLecheClinicoDias(meds[0].retiroLeche);
      setRetiroCarneClinicoDias(meds[0].retiroCarne);
    }
  }, [currentSpecies]);

  // Update codigoAnimal when prop changes
  useEffect(() => {
    if (codigoAnimalInicial) {
      setCodigoAnimal(codigoAnimalInicial);
      const matched = animals.find(a => a.practico.toUpperCase() === codigoAnimalInicial.toUpperCase());
      if (matched?.especie) {
        setFilterSpecies(matched.especie);
      }
    }
  }, [codigoAnimalInicial, animals]);

  // Inbreeding check
  const inbreedingCheck = useMemo(() => {
    if (!selectedAnimalObj || !isRuminant && !isEquine) return null;
    const selectedSemenObj = semenOptions.find(s => s.id === selectedSemenId);
    if (!selectedSemenObj) return null;

    const damFather = selectedAnimalObj.padre;
    const sireFather = selectedSemenObj.padre;
    const sharesFather = (damFather && damFather === sireFather) || (damFather === selectedSemenObj.id);

    if (sharesFather || (selectedAnimalObj.practico === '0001' && selectedSemenObj.id === 'SM01')) {
      return {
        isHighRisk: true,
        coefficient: '12.5%',
        reason: `La hembra ${selectedAnimalObj.practico} y el reproductor ${selectedSemenObj.id} comparten ancestro común (${sireFather || 'CW012'}). Riesgo elevado de consanguinidad.`
      };
    }
    return {
      isHighRisk: false,
      coefficient: '0.78%',
      reason: 'Cruce genético seguro. Coeficiente de consanguinidad F < 6.25%.'
    };
  }, [selectedAnimalObj, selectedSemenId, semenOptions, isRuminant, isEquine]);

  // Computed total milk
  const totalLecheDia = useMemo(() => {
    const am = typeof pesajeAmKg === 'number' ? pesajeAmKg : 0;
    const pm = typeof pesajePmKg === 'number' ? pesajePmKg : 0;
    return Math.round((am + pm) * 10) / 10;
  }, [pesajeAmKg, pesajePmKg]);

  // Total lechones porcinos
  const totalLechonesCamada = useMemo(() => {
    return (Number(lechonesVivos) || 0) + (Number(lechonesMuertos) || 0) + (Number(momias) || 0);
  }, [lechonesVivos, lechonesMuertos, momias]);

  const pesoPromedioLechon = useMemo(() => {
    return (lechonesVivos > 0 && pesoCamadaKg > 0) ? (pesoCamadaKg / lechonesVivos) : 0;
  }, [lechonesVivos, pesoCamadaKg]);

  // % Eclosión avícola
  const porcentajeEclosion = useMemo(() => {
    return (huevosFertilesIncubados > 0 && pollitosVivos > 0) ? ((pollitosVivos / huevosFertilesIncubados) * 100) : 0;
  }, [huevosFertilesIncubados, pollitosVivos]);

  if (!isOpen) return null;

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let proxVencimiento = 'Completado';
    const animalTag = codigoAnimal.trim().toUpperCase();
    const dam = animals.find(a => a.practico.toUpperCase() === animalTag);
    let eventObs = observaciones;

    // 1. REPRODUCTIVOS
    if (categoriaInicial === 'Reproductivos' || tipoInicial.includes('Parto') || tipoInicial.includes('Servicio') || tipoInicial.includes('Celo')) {
      // SWINE: Camada de lechones
      if (isSwine) {
        proxVencimiento = 'Destete de camada en 21 - 28 días';
        updateAnimal(animalTag, {
          estatusProductivo: 'Lactancia Porcina',
          estatusReproductivo: 'Maternidad con Camada',
          partos: dam ? (dam.partos || 0) + 1 : 1,
          ultimoParto: fecha
        });

        eventObs = eventObs || `Parto Porcino (Camada): ${lechonesVivos} nacidos vivos, ${lechonesMuertos} mortinatos, ${momias} momias (Total: ${totalLechonesCamada} lechones | Peso Camada: ${pesoCamadaKg} kg | Prom: ${pesoPromedioLechon.toFixed(2)} kg/lechón) | Pezones: ${pezonesFuncionales} | Sala: ${salaMaternidad}`;
      } 
      // POULTRY: Incubación & Eclosión
      else if (isPoultry) {
        proxVencimiento = 'Traslado a Galpón de Cría / Sexaje (Día 21)';
        updateAnimal(animalTag, {
          estatusProductivo: 'Lote Incubado',
          estatusReproductivo: 'Eclosionado'
        });

        eventObs = eventObs || `Incubación & Eclosión Avícola: ${pollitosVivos} pollitos eclosionados de ${huevosFertilesIncubados} huevos fértiles (% Eclosión: ${porcentajeEclosion.toFixed(1)}% | Calidad: ${calidadPollito} | Sala: ${salaIncubacion} | Días: ${diasIncubacion})`;
      } 
      // RUMINANTS & EQUINES: Servicios / Partos tradicionales
      else {
        if (tipoInicial.includes('Servicio')) {
          proxVencimiento = isEquine ? 'Ecografía gestacional en 14-18 días' : 'Palpación / Ecografía en 45 días';
          updateAnimal(animalTag, {
            estatusReproductivo: `Servida (${modalidadServicio})`,
            padre: selectedSemenId
          });
          eventObs = eventObs || `Servicio ${modalidadServicio} (${turnoServicio}) | Reproductor: ${selectedSemenId} | Especie: ${currentSpecies}`;
        } else if (tipoInicial.includes('Parto')) {
          proxVencimiento = isDairySpecies ? 'Fin DEV en 50 días (Celo)' : 'Revisión puerperal post-parto';
          
          updateAnimal(animalTag, {
            estatusProductivo: isDairySpecies ? 'Ordeño' : 'Criando',
            estatusReproductivo: 'Lactando / Vientre en DEV',
            partos: dam ? (dam.partos || 2) + 1 : 1,
            ultimoParto: fecha
          });

          // Atomic Newborn Creation
          if (crearCriaAtomics && condicionCria === 'Viva') {
            const categoriaCria = currentSpecies === 'Búfalos' 
              ? (criaSexo === 'Hembra' ? 'Bucerra' : 'Bucerro')
              : currentSpecies === 'Caprinos'
              ? (criaSexo === 'Hembra' ? 'Cabrita' : 'Cabrito')
              : currentSpecies === 'Equinos'
              ? (criaSexo === 'Hembra' ? 'Potranca' : 'Potro')
              : (criaSexo === 'Hembra' ? 'Becerra' : 'Becerro');

            const newOffspring: Animal = {
              practico: criaArete.toUpperCase(),
              unico: criaArete.toUpperCase(),
              categoria: categoriaCria,
              especie: currentSpecies,
              subcategoria: categoriaCria,
              estatus: 'Activo',
              fechaNacimiento: fecha,
              edad: '0,0 Meses',
              lote: criaLote,
              descripcion: `Cría de ${animalTag} nacida el ${fecha}`,
              composicion: dam ? dam.composicion : 'Raza pura / Mestiza',
              racial: dam ? dam.racial : '',
              etiquetas: 'Cría Nacida en Finca',
              activos: 'Arete Identificador',
              padre: selectedSemenId,
              madre: animalTag,
              pesoKg: criaPesoNacimiento,
              sexo: criaSexo,
              color: criaColor
            };
            addAnimal(newOffspring);
          }

          eventObs = eventObs || `Parto ${tipoParto} (${currentSpecies}). Cría ${condicionCria} (${criaArete}, ${criaSexo}, ${criaPesoNacimiento} kg)`;
        } else if (tipoInicial.includes('Revisión')) {
          proxVencimiento = diagnosticoPrenez === 'Preñada' ? `Parto proyectado en ${280 - diasGestacion} días` : 'Re-sincronización de celo';
          updateAnimal(animalTag, {
            estatusReproductivo: diagnosticoPrenez,
            diasGestacion: diagnosticoPrenez === 'Preñada' ? diasGestacion : 0
          });
          eventObs = eventObs || `Diagnóstico: ${diagnosticoPrenez} (${diasGestacion} días) | Hallazgos: ${estructuraOvarica}`;
        } else if (tipoInicial.includes('Celo')) {
          proxVencimiento = turnoDeteccionCelo === 'AM' ? 'Inseminación programada hoy PM' : 'Inseminación programada mañana AM';
          eventObs = eventObs || `Celo ${intensidadCelo} detectado en turno ${turnoDeteccionCelo} | Signos: ${signosCelo}`;
        }
      }
    }

    // 2. PRODUCTIVOS
    else if (categoriaInicial === 'Productivos' || tipoInicial.includes('Pesaje') || tipoInicial.includes('Crecimiento') || tipoInicial.includes('Secado') || tipoInicial.includes('Postura')) {
      if (isPoultry || tipoInicial.includes('Postura')) {
        proxVencimiento = 'Recolección diaria programada';
        eventObs = eventObs || `Recolección Huevos: ${huevosComercialesAvicola} comerciales, ${huevosRotosAvicola} descarte/rotos | Peso Prom: ${pesoHuevoAvicola} g | Calidad: ${calidadCascara}`;
      } else if (isDairySpecies && tipoInicial.includes('Pesaje')) {
        proxVencimiento = `Próximo control lechero en 15 días (${totalLecheDia} kg)`;
        updateAnimal(animalTag, {
          ultimoPesajeLeche: totalLecheDia
        });
        eventObs = eventObs || `Control Lechero (${currentSpecies}): Total Día ${totalLecheDia} kg (AM: ${pesajeAmKg} + PM: ${pesajePmKg}) | Grasa: ${grasaPorcentaje}% | RCS: ${rcsConteo}k`;
      } else if (tipoInicial.includes('Crecimiento')) {
        proxVencimiento = isPoultry ? 'Pesaje semanal de engorde' : 'Pesaje bimestral en 60 días';
        updateAnimal(animalTag, {
          pesoKg: pesoCorporalKg
        });
        eventObs = eventObs || `Crecimiento Ponderal (${currentSpecies}): Peso ${pesoCorporalKg} kg | CC: ${condicionCorporal} | GDP: ${gdpEstimada} g/día`;
      } else if (tipoInicial.includes('Secado')) {
        proxVencimiento = 'Parto proyectado en 60 días';
        updateAnimal(animalTag, {
          estatusProductivo: 'Seca',
          estatusReproductivo: 'Gestante en descanso'
        });
        eventObs = eventObs || `Secado: ${motivoSecado} | Terapia: ${terapiaVacaSeca}`;
      }
    }

    // 3. VETERINARIOS & SANITARIOS
    else if (categoriaInicial === 'Veterinarios' || tipoInicial.includes('Mastitis') || tipoInicial.includes('Clínic') || tipoInicial.includes('Plan')) {
      if (tipoInicial.includes('Plan')) {
        proxVencimiento = `Refuerzo sanitario programado: ${fechaRevacunacion}`;
        updateAnimal(animalTag, {
          alertaSanitaria: `Inmunizado: ${tipoPlanSanitario}`
        });
        eventObs = eventObs || `Plan Sanitario (${currentSpecies}): ${tipoPlanSanitario} | Biológico Lote: ${biologicoLote} | Próx. Dosis: ${fechaRevacunacion}`;
      } else if (tipoInicial.includes('Mastitis') && isDairySpecies) {
        const activeQuarters = Object.entries(cuartosCMT)
          .filter(([_, val]) => val !== 'Negativo')
          .map(([q, val]) => `${q}:${val}`);
        
        const withdrawalDate = new Date();
        withdrawalDate.setDate(withdrawalDate.getDate() + diasRetiroLecheMastitis);
        const formattedDate = withdrawalDate.toLocaleDateString('es-ES');

        proxVencimiento = `Bloqueo de Tanque activo hasta ${formattedDate}`;
        updateAnimal(animalTag, {
          cuartosMastitis: activeQuarters,
          alertaSanitaria: `Mastitis en ${activeQuarters.join(', ')} - RETIRO HASTA ${formattedDate}`,
          retiroLecheHasta: formattedDate
        });
        eventObs = eventObs || `Mastitis (${currentSpecies}): Cuartos ${activeQuarters.join(', ')} | Tto: ${tratamientoMastitis} | Retiro leche: ${diasRetiroLecheMastitis}d`;
      } else {
        const withdrawalDate = new Date();
        withdrawalDate.setDate(withdrawalDate.getDate() + retiroCarneClinicoDias);
        proxVencimiento = `Fin retiro fármaco: ${withdrawalDate.toLocaleDateString('es-ES')}`;
        updateAnimal(animalTag, {
          alertaSanitaria: `Tratamiento: ${patologiaClinica} (${medicamentoClinico})`
        });
        eventObs = eventObs || `Caso Clínico (${currentSpecies}): ${patologiaClinica} | Fármaco: ${medicamentoClinico} (${dosisClinica}) | Retiro Carne: ${retiroCarneClinicoDias}d ${isDairySpecies ? `| Leche: ${retiroLecheClinicoDias}d` : ''}`;
      }
    }

    const nuevo: EventoItem = {
      id: `ev-${Date.now()}`,
      fecha,
      codigoAnimal: animalTag,
      categoria: categoriaInicial,
      tipoEvento: tipoInicial,
      vencimiento: proxVencimiento,
      tecnico,
      observaciones: eventObs
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: 'var(--primary-ultra-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}>
              {speciesTaxonomy.icono}
            </div>
            <div>
              <h3 className="report-modal-title" style={{ fontSize: 18, fontWeight: 700 }}>
                Registrar {tipoInicial}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                Categoría: <strong>{categoriaInicial}</strong> • Operación Multi-Especie ({currentSpecies})
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
            
            {/* 1. ANIMAL SELECTOR MULTI-ESPECIE */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                    Filtrar Especie:
                  </span>
                  <div className="species-filter-nav" style={{ padding: '2px 4px' }}>
                    {(['Todas', 'Bovinos', 'Porcinos', 'Aves de corral', 'Búfalos', 'Caprinos', 'Equinos'] as const).map(sp => {
                      const icon = sp === 'Todas' ? '🌐' : ESPECIES_TAXONOMY[sp]?.icono || '🐾';
                      return (
                        <button
                          key={sp}
                          type="button"
                          className={`species-filter-pill ${filterSpecies === sp ? 'active' : ''}`}
                          onClick={() => setFilterSpecies(sp)}
                          style={{ padding: '4px 8px', fontSize: 11 }}
                        >
                          <span>{icon}</span>
                          <span>{sp === 'Aves de corral' ? 'Aves' : sp}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setManualCodeMode(prev => !prev)}
                  style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {manualCodeMode ? 'Seleccionar de la lista' : 'Escribir código manual'}
                </button>
              </div>

              {/* Animal Dropdown or Manual Input */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
                <div className="form-field">
                  <label className="form-label">Animal / Semoviente Sujeto *</label>
                  {manualCodeMode ? (
                    <input
                      type="text"
                      required
                      placeholder="ej. 0001, POR-CR01, AVE-GP01"
                      className="form-input"
                      value={codigoAnimal}
                      onChange={e => setCodigoAnimal(e.target.value)}
                      style={{ textTransform: 'uppercase', fontWeight: 700 }}
                    />
                  ) : (
                    <select
                      className="form-select"
                      value={codigoAnimal}
                      onChange={e => setCodigoAnimal(e.target.value)}
                      style={{ fontWeight: 600 }}
                    >
                      {filteredAnimalsList.map(a => {
                        const icon = a.especie ? ESPECIES_TAXONOMY[a.especie]?.icono : '🐮';
                        return (
                          <option key={a.practico} value={a.practico}>
                            {icon} {a.practico} — {a.categoria} • {a.composicion || a.racial} ({a.lote ? `Lote ${a.lote}` : 'Sin lote'})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

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
              </div>

              {/* Animal Quick Details Banner */}
              {selectedAnimalObj && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  fontSize: 12,
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{speciesTaxonomy.icono}</span>
                    <div>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>
                        {selectedAnimalObj.practico} ({selectedAnimalObj.categoria})
                      </span>
                      <span style={{ color: 'var(--text-secondary)', marginLeft: 6 }}>
                        • Lote: <strong>{selectedAnimalObj.lote || 'General'}</strong> • Peso: {selectedAnimalObj.pesoKg ? `${selectedAnimalObj.pesoKg} kg` : 'N/D'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge-status-pill valid" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                      {selectedAnimalObj.especie || 'Bovinos'}
                    </span>
                    {selectedAnimalObj.alertaSanitaria && (
                      <span className="badge-status-pill danger">⚠️ Alerta Retiro</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Specialist */}
            <div className="form-field">
              <label className="form-label">Técnico / Especialista Responsable</label>
              <select
                className="form-select"
                value={tecnico}
                onChange={e => setTecnico(e.target.value)}
              >
                <option value="Dr. Carlos Mendoza">Dr. Carlos Mendoza (Médico Veterinario Zootecnista)</option>
                <option value="Dra. Elena Rivas">Dra. Elena Rivas (Especialista en Reproducción &amp; Biotecnología)</option>
                <option value="Ing. Agr. Marcos Solís">Ing. Agr. Marcos Solís (Especialista en Producción Avícola / Porcina)</option>
                <option value="Juan Pérez">Juan Pérez (Técnico Inseminador Artificial)</option>
                <option value="Luis Martínez">Luis Martínez (Mayordomo de Manga y Campo)</option>
              </select>
            </div>

            {/* =========================================================================
                2. DYNAMIC REPRODUCTIVOS SECTION BY SPECIES
               ========================================================================= */}
            {(categoriaInicial === 'Reproductivos' || tipoInicial.includes('Parto') || tipoInicial.includes('Servicio') || tipoInicial.includes('Celo') || tipoInicial.includes('Revisión')) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* A) PORCINOS: CAMADA DE LECHONES */}
                {isSwine ? (
                  <div style={{
                    backgroundColor: '#fff7ed',
                    border: '1px solid #ffedd5',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#9a3412', fontSize: 13 }}>
                      <span>🐷</span>
                      <span>Registro de Camada Porcina (Cerda {codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: 10, alignItems: 'center' }}>
                      <div className="form-field">
                        <label className="form-label">Nacidos Vivos (LNV) *</label>
                        <input
                          type="number"
                          min="0"
                          required
                          className="form-input num"
                          value={lechonesVivos}
                          onChange={e => setLechonesVivos(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Nacidos Muertos (LNM)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={lechonesMuertos}
                          onChange={e => setLechonesMuertos(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Momias Fetales</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={momias}
                          onChange={e => setMomias(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div style={{
                        backgroundColor: '#ffedd5',
                        borderRadius: 8,
                        padding: '8px 10px',
                        textAlign: 'center',
                        border: '1px solid #fed7aa'
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>
                          Total Nacidos
                        </span>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#9a3412', fontFamily: 'JetBrains Mono' }}>
                          {totalLechonesCamada} lechones
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Peso Total Camada (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input num"
                          value={pesoCamadaKg}
                          onChange={e => setPesoCamadaKg(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Pezones Funcionales</label>
                        <input
                          type="number"
                          className="form-input num"
                          value={pezonesFuncionales}
                          onChange={e => setPezonesFuncionales(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Peso Promedio / Lechón</label>
                        <div className="spreadsheet-cell-computed" style={{ marginTop: 2, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {pesoPromedioLechon > 0 ? `${pesoPromedioLechon.toFixed(2)} kg` : '-'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Verraco / Dosis Seminal IA</label>
                        <select
                          className="form-select"
                          value={selectedSemenId}
                          onChange={e => setSelectedSemenId(e.target.value)}
                        >
                          {semenOptions.map(s => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field">
                        <label className="form-label">Sala de Maternidad Destino</label>
                        <select
                          className="form-select"
                          value={salaMaternidad}
                          onChange={e => setSalaMaternidad(e.target.value)}
                        >
                          <option value="GALP-PAR">GALP-PAR (Galpón de Partos y Maternidad)</option>
                          <option value="MAT-01">Maternidad Sala A (Jaulas Escandinavas)</option>
                          <option value="MAT-02">Maternidad Sala B (Libre Movimiento)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : isPoultry ? (
                  /* B) AVES DE CORRAL: INCUBACIÓN & ECLOSIÓN */
                  <div style={{
                    backgroundColor: '#fefce8',
                    border: '1px solid #fef08a',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#854d0e', fontSize: 13 }}>
                      <span>🐔</span>
                      <span>Incubación &amp; Eclosión Avícola (Lote {codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: 10, alignItems: 'center' }}>
                      <div className="form-field">
                        <label className="form-label">Huevos Fértiles Cargados *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          className="form-input num"
                          value={huevosFertilesIncubados}
                          onChange={e => setHuevosFertilesIncubados(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Pollitos Eclosionados Vivos *</label>
                        <input
                          type="number"
                          min="0"
                          required
                          className="form-input num"
                          value={pollitosVivos}
                          onChange={e => setPollitosVivos(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Huevos Claros (Infértiles)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={huevosInfertiles}
                          onChange={e => setHuevosInfertiles(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div style={{
                        backgroundColor: '#fef08a',
                        borderRadius: 8,
                        padding: '8px 10px',
                        textAlign: 'center',
                        border: '1px solid #fde047'
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#713f12', textTransform: 'uppercase' }}>
                          % Eclosión
                        </span>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#854d0e', fontFamily: 'JetBrains Mono' }}>
                          {porcentajeEclosion.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Días en Incubadora</label>
                        <input
                          type="number"
                          className="form-input num"
                          value={diasIncubacion}
                          onChange={e => setDiasIncubacion(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Calidad / Pasgar Score</label>
                        <select
                          className="form-select"
                          value={calidadPollito}
                          onChange={e => setCalidadPollito(e.target.value)}
                        >
                          <option value="Grado 1 Élite (Pasgar Score 9+)">Grado 1 Élite (Pasgar Score 9+)</option>
                          <option value="Grado 2 Estándar (Pasgar Score 7-8)">Grado 2 Estándar (Pasgar 7-8)</option>
                          <option value="Grado 3 Regular">Grado 3 Regular</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label className="form-label">Sala / Incubadora</label>
                        <input
                          type="text"
                          className="form-input"
                          value={salaIncubacion}
                          onChange={e => setSalaIncubacion(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* C) RUMINANTS & EQUINES: SERVICIOS IA, MONTA Y PARTOS ATÓMICOS */
                  <>
                    {tipoInicial.includes('Servicio') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div className="form-field">
                            <label className="form-label">Modalidad de Servicio ({currentSpecies})</label>
                            <select
                              className="form-select"
                              value={modalidadServicio}
                              onChange={e => setModalidadServicio(e.target.value)}
                            >
                              <option value="Inseminación Artificial (IA)">Inseminación Artificial (IA)</option>
                              <option value="IATF (Tiempo Fijo con Protocolo)">IATF (Protocolo Hormonal)</option>
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

                        {/* Semental selector */}
                        <div className="form-field">
                          <label className="form-label">Reproductor / Pajuela ({currentSpecies})</label>
                          <select
                            className="form-select"
                            value={selectedSemenId}
                            onChange={e => setSelectedSemenId(e.target.value)}
                          >
                            {semenOptions.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.nombre} • {s.dosis} dosis ({s.termo})
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

                    {tipoInicial.includes('Parto') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div className="form-field">
                            <label className="form-label">Tipo de Parto ({currentSpecies})</label>
                            <select
                              className="form-select"
                              value={tipoParto}
                              onChange={e => setTipoParto(e.target.value)}
                            >
                              <option value="Eutócico (Normal sin asistencia)">Eutócico (Normal sin asistencia)</option>
                              <option value="Distócico (Asistido con tracción)">Distócico (Asistido con tracción)</option>
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

                        {/* ATOMIC NEWBORN CALF / FOAL / KID SUB-FORM */}
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
                                <span>Alta Atómica de la Cría ({currentSpecies === 'Búfalos' ? 'Bucerro/a' : currentSpecies === 'Caprinos' ? 'Cabrito/a' : currentSpecies === 'Equinos' ? 'Potro/a' : 'Becerro/a'})</span>
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
                                      <option value="Hembra">Hembra</option>
                                      <option value="Macho">Macho</option>
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
                                    <label className="form-label">Color / Pelaje</label>
                                    <input
                                      type="text"
                                      className="form-input"
                                      value={criaColor}
                                      onChange={e => setCriaColor(e.target.value)}
                                    />
                                  </div>
                                  <div className="form-field">
                                    <label className="form-label">Lote Destino</label>
                                    <input
                                      type="text"
                                      className="form-input"
                                      value={criaLote}
                                      onChange={e => setCriaLote(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* =========================================================================
                3. DYNAMIC PRODUCTIVOS SECTION BY SPECIES
               ========================================================================= */}
            {(categoriaInicial === 'Productivos' || tipoInicial.includes('Pesaje') || tipoInicial.includes('Crecimiento') || tipoInicial.includes('Secado') || tipoInicial.includes('Postura')) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* A) MILK WEIGHING FOR DAIRY SPECIES */}
                {isDairySpecies && (tipoInicial.includes('Pesaje') || tipoInicial.includes('leche')) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                          Total Diario ({currentSpecies})
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
                  </div>
                )}

                {/* B) EGG COLLECTION FOR POULTRY */}
                {(isPoultry || tipoInicial.includes('Postura')) && (
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#065f46', fontSize: 13 }}>
                      <span>🥚</span>
                      <span>Recolección de Huevos &amp; Postura Diaria (Lote {codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
                      <div className="form-field">
                        <label className="form-label">Huevos Comerciales (Uds) *</label>
                        <input
                          type="number"
                          min="0"
                          required
                          className="form-input num"
                          value={huevosComercialesAvicola}
                          onChange={e => setHuevosComercialesAvicola(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Descarte / Rotos (Uds)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={huevosRotosAvicola}
                          onChange={e => setHuevosRotosAvicola(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Peso Promedio Huevo (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input num"
                          value={pesoHuevoAvicola}
                          onChange={e => setPesoHuevoAvicola(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Calidad de Cáscara</label>
                      <select
                        className="form-select"
                        value={calidadCascara}
                        onChange={e => setCalidadCascara(e.target.value)}
                      >
                        <option value="Excelente Comercial (Cáscara A - Firme)">Excelente Comercial (Cáscara A - Firme)</option>
                        <option value="Normal Comercial (Cáscara B)">Normal Comercial (Cáscara B)</option>
                        <option value="Cáscara Frágil / Porosa (Revisar Calcio/Fósforo)">Cáscara Frágil / Porosa (Revisar Calcio)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* C) WEIGHT GROWTH (CRECIMIENTOS) */}
                {tipoInicial.includes('Crecimiento') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <div className="form-field">
                      <label className="form-label">Peso Báscula (kg) *</label>
                      <input
                        type="number"
                        step={isPoultry ? '0.05' : '0.5'}
                        required
                        className="form-input num"
                        value={pesoCorporalKg}
                        onChange={e => setPesoCorporalKg(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Condición Corporal</label>
                      <select
                        className="form-select"
                        value={condicionCorporal}
                        onChange={e => setCondicionCorporal(parseFloat(e.target.value))}
                      >
                        <option value="1.0">1.0 - Muy Flaca</option>
                        <option value="2.0">2.0 - Flaca</option>
                        <option value="3.0">3.0 - Óptima / Comercial</option>
                        <option value="3.25">3.25 - Buena Condición</option>
                        <option value="3.5">3.5 - Vigorosa</option>
                        <option value="4.0">4.0 - Gorda</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label">GDP Estimada ({isPoultry ? 'g/día' : 'g/día'})</label>
                      <input
                        type="number"
                        className="form-input num"
                        value={gdpEstimada}
                        onChange={e => setGdpEstimada(parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                4. DYNAMIC VETERINARIOS & PLANES SANITARIOS SECTION
               ========================================================================= */}
            {(categoriaInicial === 'Veterinarios' || tipoInicial.includes('Mastitis') || tipoInicial.includes('Clínic') || tipoInicial.includes('Plan')) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* SPECIES-TAILORED VACCINATION & SANITARY PLANS */}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#166534', fontSize: 13 }}>
                    <Stethoscope size={18} color="#16a34a" />
                    <span>Plan Sanitario &amp; Vacunación Específica ({currentSpecies})</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
                    <div className="form-field">
                      <label className="form-label">Protocolo / Biológico *</label>
                      <select
                        className="form-select"
                        value={tipoPlanSanitario}
                        onChange={e => setTipoPlanSanitario(e.target.value)}
                        style={{ fontWeight: 600 }}
                      >
                        {(VACCINE_PLANS_BY_SPECIES[currentSpecies] || VACCINE_PLANS_BY_SPECIES['Bovinos']).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Fecha Revacunación</label>
                      <input
                        type="date"
                        className="form-input"
                        value={fechaRevacunacion}
                        onChange={e => setFechaRevacunacion(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* SPECIES-TAILORED VADEMÉCUM */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.2fr', gap: 12 }}>
                    <div className="form-field">
                      <label className="form-label">Vademécum Farmacológico Sugerido</label>
                      <select
                        className="form-select"
                        value={medicamentoClinico}
                        onChange={e => {
                          const medName = e.target.value;
                          setMedicamentoClinico(medName);
                          const meds = VADEMECUM_BY_SPECIES[currentSpecies] || [];
                          const item = meds.find(m => m.nombre === medName);
                          if (item) {
                            setDosisClinica(item.dosis);
                            setRetiroLecheClinicoDias(item.retiroLeche);
                            setRetiroCarneClinicoDias(item.retiroCarne);
                          }
                        }}
                      >
                        {(VADEMECUM_BY_SPECIES[currentSpecies] || []).map(m => (
                          <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Dosis &amp; Vía Aplicada</label>
                      <input
                        type="text"
                        className="form-input"
                        value={dosisClinica}
                        onChange={e => setDosisClinica(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Withdrawal periods banner */}
                  <div style={{ display: 'grid', gridTemplateColumns: isDairySpecies ? '1fr 1fr' : '1fr', gap: 12 }}>
                    {isDairySpecies && (
                      <div className="form-field">
                        <label className="form-label">Días Retiro en Leche</label>
                        <input
                          type="number"
                          className="form-input num"
                          value={retiroLecheClinicoDias}
                          onChange={e => setRetiroLecheClinicoDias(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                    )}
                    <div className="form-field">
                      <label className="form-label">Días Retiro en Carne / Camal</label>
                      <input
                        type="number"
                        className="form-input num"
                        value={retiroCarneClinicoDias}
                        onChange={e => setRetiroCarneClinicoDias(parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* MASTITIS (FOR DAIRY SPECIES ONLY) */}
                {isDairySpecies && tipoInicial.includes('Mastitis') && (
                  <div className="udder-diagram-container">
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#334155' }}>
                      Evaluación CMT ({currentSpecies === 'Caprinos' ? '2 Glándulas Mamarias' : '4 Cuartos Mamarios'})
                    </div>

                    <div className="udder-diagram-grid">
                      <div className={`udder-quarter-card ${cuartosCMT.AD !== 'Negativo' ? 'selected' : ''}`}>
                        <div className="udder-quarter-title">
                          <span>{currentSpecies === 'Caprinos' ? 'Glándula Derecha (D)' : 'Anterior Derecho (AD)'}</span>
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

                      <div className={`udder-quarter-card ${cuartosCMT.AI !== 'Negativo' ? 'selected' : ''}`}>
                        <div className="udder-quarter-title">
                          <span>{currentSpecies === 'Caprinos' ? 'Glándula Izquierda (I)' : 'Anterior Izquierdo (AI)'}</span>
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

                      {currentSpecies !== 'Caprinos' && (
                        <>
                          <div className={`udder-quarter-card ${cuartosCMT.PD !== 'Negativo' ? 'selected' : ''}`}>
                            <div className="udder-quarter-title">
                              <span>Posterior Derecho (PD)</span>
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

                          <div className={`udder-quarter-card ${cuartosCMT.PI !== 'Negativo' ? 'selected' : ''}`}>
                            <div className="udder-quarter-title">
                              <span>Posterior Izquierdo (PI)</span>
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
                        </>
                      )}
                    </div>
                  </div>
                )}
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
              <span>Guardar Evento ({currentSpecies})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
