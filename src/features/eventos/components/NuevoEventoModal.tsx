import { validateBrucellosisVaccination } from '../utils/brucellosisValidator';
import { validatePregnancyExamTiming, MetodoDiagnosticoPrenez } from '../utils/pregnancyExamValidator';
import { validarPesoNacimiento } from '../utils/neonatalWeightValidator';
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
  Sparkles, 
  Baby, 
  Layers, 
  Stethoscope,
  Egg,
  Scissors,
  Wrench,
  Eye,
  Activity,
  FileCheck,
  FileText
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Animal, EspecieAnimal, ESPECIES_TAXONOMY } from '../../../types/animal';
import { EVENT_CATEGORIES, getEventCategoriesForSpecies } from '../eventosData';
import { EventoItem } from '../../../types/events';
import './eventosSpreadsheet.css';

export type { EventoItem };

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
    'Vacunación Newcastle (Cepa LaSota ocular/agua/aspersión)',
    'Vacunación Gumboro (Enfermedad de la Bolsa IBD)',
    'Vacunación Bronquitis Infecciosa (Cepa H-120)',
    'Vacunación Viruela Aviar (Punción alar)',
    'Vacunación Marek (Al 1er día en incubadora subcutánea)',
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
    'Vacunación Influenza Equina (Gripe A1/A2)',
    'Vacunación Rinoneumonitis Equina (Herpesvirus EHV-1/4)'
  ],
  'Bovinos': [
    'Vacunación Oficial Fiebre Aftosa (Bivalente A y O)',
    'Vacunación Brucelosis Bovina (Cepa 19 / RB-51 hembras)',
    'Vacunación Antirrábica Bovina (Virus Inactivado)',
    'Vacunación Clostridiosis (Carbón sintomático / Triple)',
    'Vacunación Complejo Reproductivo (IBR, DVB, Leptospira)'
  ],
  'Búfalos': [
    'Vacunación Oficial Fiebre Aftosa Bivalente',
    'Vacunación Brucelosis Bubalina (RB-51 oficial)',
    'Vacunación Rabia Paresiante de los Llanos',
    'Vacunación Clostridiosis y Mancha Negra',
    'Desparasitación Estratégica Antiparasitaria L.A. (Fasciola)'
  ],
  'Caprinos': [
    'Vacunación Clostridiosis Polivalente (Enterotoxemia tipo C y D)',
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
    { nombre: 'Eprinomectina 0.5% (Apto Ordeño)', dosis: '1 ml/10 kg pour-on tópico (0.5 mg/kg)', retiroLeche: 0, retiroCarne: 0 },
    { nombre: 'Cefa-Lak Intramamario (Cefapirina sódica)', dosis: '1 jeringa por cuarto afectado cada 12h x 2 dosis', retiroLeche: 4, retiroCarne: 4 },
    { nombre: 'Ketoprofeno 10% / Flunixin', dosis: '3 mg/kg IM o IV analgésico', retiroLeche: 1, retiroCarne: 4 }
  ],
  'Búfalos': [
    { nombre: 'Oxitetraciclina L.A. 200 mg/ml', dosis: '20 mg/kg IM profunda', retiroLeche: 4, retiroCarne: 28 },
    { nombre: 'Closantel al 10% inyectable', dosis: '1 ml/20 kg subcutánea (Fasciola/Garrapata)', retiroLeche: 28, retiroCarne: 30 },
    { nombre: 'Eprinomectina 0.5% (Apto Ordeño)', dosis: '1 ml/10 kg pour-on tópico', retiroLeche: 0, retiroCarne: 0 },
    { nombre: 'Ketoprofeno 10% inyectable', dosis: '3 mg/kg IM', retiroLeche: 1, retiroCarne: 4 }
  ],
  'Caprinos': [
    { nombre: 'Oxitetraciclina L.A. 200 mg/ml', dosis: '20 mg/kg IM profunda', retiroLeche: 4, retiroCarne: 21 },
    { nombre: 'Penicilina Procaínica Caprina', dosis: '1 ml/15 kg IM cada 24h', retiroLeche: 3, retiroCarne: 14 },
    { nombre: 'Eprinomectina 0.5% Caprina (Apto Ordeño)', dosis: '1 ml/10 kg pour-on tópico', retiroLeche: 0, retiroCarne: 0 },
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

  // Active Category & Type in state (initialized from props)
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [tipoEvento, setTipoEvento] = useState(tipoInicial);

  // Common fields
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [codigoAnimal, setCodigoAnimal] = useState(codigoAnimalInicial || '0001');
  const [tecnico, setTecnico] = useState('Dr. Carlos Mendoza');
  const [observaciones, setObservaciones] = useState('');

  // Sync props when modal is triggered
  useEffect(() => {
    if (isOpen) {
      setCategoria(categoriaInicial);
      setTipoEvento(tipoInicial);
      if (codigoAnimalInicial) {
        setCodigoAnimal(codigoAnimalInicial);
        const matched = animals.find(a => a.practico.toUpperCase() === codigoAnimalInicial.toUpperCase());
        if (matched?.especie) {
          setFilterSpecies(matched.especie);
        }
      }
    }
  }, [isOpen, tipoInicial, categoriaInicial, codigoAnimalInicial, animals]);

  // Selected animal reference
  const selectedAnimalObj = useMemo(() => {
    return animals.find(a => a.practico.toUpperCase() === codigoAnimal.trim().toUpperCase());
  }, [animals, codigoAnimal]);

  // Detected active species
  const currentSpecies: EspecieAnimal = useMemo(() => {
    if (selectedAnimalObj?.especie) return selectedAnimalObj.especie;
    const tag = codigoAnimal.toUpperCase();
    if (tag.startsWith('AVE-') || tag.startsWith('GALP-') || tag.startsWith('INC-') || tag.startsWith('GF-')) return 'Aves de corral';
    if (tag.startsWith('POR-') || tag.startsWith('LECH-') || tag.startsWith('VERR-')) return 'Porcinos';
    if (tag.startsWith('BUF-') || tag.startsWith('BUC-') || tag.startsWith('PAD-BUF')) return 'Búfalos';
    if (tag.startsWith('CAP-') || tag.startsWith('CHIV-') || tag.startsWith('CAB-')) return 'Caprinos';
    if (tag.startsWith('EQU-') || tag.startsWith('POT-') || tag.startsWith('PADR-')) return 'Equinos';
    return 'Bovinos';
  }, [selectedAnimalObj, codigoAnimal]);

  // Taxonomy item for icons & metadata
  const speciesTaxonomy = ESPECIES_TAXONOMY[currentSpecies] || ESPECIES_TAXONOMY['Bovinos'];
  const isDairySpecies = currentSpecies === 'Bovinos' || currentSpecies === 'Búfalos' || currentSpecies === 'Caprinos';
  const isPoultry = currentSpecies === 'Aves de corral';
  const isSwine = currentSpecies === 'Porcinos';
  const isEquine = currentSpecies === 'Equinos';
  const isCaprine = currentSpecies === 'Caprinos';
  const isRuminant = currentSpecies === 'Bovinos' || currentSpecies === 'Búfalos' || currentSpecies === 'Caprinos';

  // Filtered animal list for dropdown
  const filteredAnimalsList = useMemo(() => {
    if (filterSpecies === 'Todas') return animals;
    return animals.filter(a => a.especie === filterSpecies || (!a.especie && filterSpecies === 'Bovinos'));
  }, [animals, filterSpecies]);

  // Species-tailored event categories
  const currentSpeciesCategories = useMemo(() => {
    return getEventCategoriesForSpecies(currentSpecies);
  }, [currentSpecies]);

  // Available event types for selected category (zootechnically filtered by species)
  const availableEventTypes = useMemo(() => {
    const cat = currentSpeciesCategories.find(c => c.titulo.toLowerCase() === categoria.toLowerCase());
    return cat ? cat.enlaces : [tipoEvento];
  }, [currentSpeciesCategories, categoria, tipoEvento]);

  // Auto-correct event type if it does not apply to the current species (e.g. birds don't have mastitis or lactation)
  useEffect(() => {
    if (availableEventTypes.length > 0 && !availableEventTypes.includes(tipoEvento)) {
      setTipoEvento(availableEventTypes[0]);
    }
  }, [availableEventTypes, tipoEvento]);

  // Semen catalog for current species
  const semenOptions = useMemo(() => {
    return SEMEN_CATALOG_BY_SPECIES[currentSpecies] || SEMEN_CATALOG_BY_SPECIES['Bovinos'];
  }, [currentSpecies]);

  // -------------------------------------------------------------
  // REPRODUCTIVOS STATES
  // -------------------------------------------------------------
  // Servicios & Celos
  const [selectedSemenId, setSelectedSemenId] = useState('SM01');
  const [modalidadServicio, setModalidadServicio] = useState('Inseminación Artificial (IA)');
  const [turnoServicio, setTurnoServicio] = useState<'AM' | 'PM'>('AM');
  const [turnoDeteccionCelo, setTurnoDeteccionCelo] = useState<'AM' | 'PM'>('AM');
  const [intensidadCelo, setIntensidadCelo] = useState('Franco (Excelente manifestación)');
  const [signosCelo, setSignosCelo] = useState('Reflejo de inmovilidad, secreción mucosa transparente');

  // Partos (Bovinos, Búfalos, Equinos)
  const [tipoParto, setTipoParto] = useState('Eutócico (Normal sin asistencia)');
  const [condicionCria, setCondicionCria] = useState<'Viva' | 'Nacimuerta'>('Viva');
  const [crearCriaAtomics, setCrearCriaAtomics] = useState(true);
  const [criaArete, setCriaArete] = useState(`CRIA-${Math.floor(100 + Math.random() * 900)}`);
  const [criaSexo, setCriaSexo] = useState<'Hembra' | 'Macho'>('Hembra');
  const [criaPesoNacimiento, setCriaPesoNacimiento] = useState(36.0);
  const [criaColor, setCriaColor] = useState('Color característico racial');
  const [criaLote, setCriaLote] = useState('POT1');

  // Porcino: Camadas de Lechones
  const [lechonesVivos, setLechonesVivos] = useState(13);
  const [lechonesMuertos, setLechonesMuertos] = useState(1);
  const [momias, setMomias] = useState(0);
  const [pesoCamadaKg, setPesoCamadaKg] = useState(18.2);
  const [pezonesFuncionales, setPezonesFuncionales] = useState(14);
  const [salaMaternidad, setSalaMaternidad] = useState('GALP-PAR');
  const [adopcionesNodriza, setAdopcionesNodriza] = useState(0);

  // Aves: Incubación / Eclosión
  const [huevosFertilesIncubados, setHuevosFertilesIncubados] = useState(150);
  const [diasIncubacion, setDiasIncubacion] = useState(21);
  const [ovoscopia7d, setOvoscopia7d] = useState(94);
  const [ovoscopia14d, setOvoscopia14d] = useState(91);
  const [pollitosVivos, setPollitosVivos] = useState(138);
  const [huevosInfertiles, setHuevosInfertiles] = useState(8);
  const [muerteEmbrionaria, setMuerteEmbrionaria] = useState(4);
  const [salaIncubacion, setSalaIncubacion] = useState('INC-01');
  const [calidadPollito, setCalidadPollito] = useState('Grado 1 Élite (Pasgar Score 9+)');

  // Equinos: Foliculometría & Parto Equino
  const [diametroFolículoMm, setDiametroFolículoMm] = useState(42);
  const [edemaUterinoGrado, setEdemaUterinoGrado] = useState(3);
  const [ovarioActivo, setOvarioActivo] = useState('Ovario Izquierdo');
  const [tipoSemenEquino, setTipoSemenEquino] = useState('Semen refrigerado (diluyente 24-48h)');
  const [tiempoExpulsionPlacentaMin, setTiempoExpulsionPlacentaMin] = useState(45);
  const [placentaIntegra, setPlacentaIntegra] = useState(true);
  const [expulsionMeconio, setExpulsionMeconio] = useState('Expulsado espontáneo normal (< 3h)');

  // Caprinos: Parto Múltiple & Desbotonado
  const [tipoPartoCaprino, setTipoPartoCaprino] = useState<'Simple' | 'Mellizos' | 'Trillizos'>('Mellizos');
  const [pesoCabrito1, setPesoCabrito1] = useState(3.8);
  const [pesoCabrito2, setPesoCabrito2] = useState(3.5);
  const [pesoCabrito3, setPesoCabrito3] = useState(3.2);
  const [desbotonadoRealizado, setDesbotonadoRealizado] = useState(true);
  const [encalostradoAsistido, setEncalostradoAsistido] = useState(true);

  // Estados especializados (Parches Veterinarios)
  const [metodoDiagnosticoPrenez, setMetodoDiagnosticoPrenez] = useState<MetodoDiagnosticoPrenez>('PalpacionTransrectal');
  const [diasPostServicioDiagnostico, setDiasPostServicioDiagnostico] = useState<number>(45);

  // Revisiones / Abortos
  const [diagnosticoPrenez, setDiagnosticoPrenez] = useState('Preñada');
  const [diasGestacion, setDiasGestacion] = useState(45);
  const [estructuraOvarica, setEstructuraOvarica] = useState('Cuerpo Lúteo en Ovario Derecho');
  const [diasGestacionAborto, setDiasGestacionAborto] = useState(120);
  const [causaAborto, setCausaAborto] = useState('Infecciosa (Sospecha Neospora/Brucella)');

  // -------------------------------------------------------------
  // PRODUCTIVOS STATES
  // -------------------------------------------------------------
  // Dairy milk
  const [pesajeAmKg, setPesajeAmKg] = useState<number>(7.8);
  const [pesajePmKg, setPesajePmKg] = useState<number>(6.4);
  const [grasaPorcentaje, setGrasaPorcentaje] = useState(3.8);
  const [rcsConteo, setRcsConteo] = useState(145);

  // Poultry eggs
  const [huevosAAA, setHuevosAAA] = useState<number>(1820);
  const [huevosAA, setHuevosAA] = useState<number>(560);
  const [huevosA, setHuevosA] = useState<number>(120);
  const [huevosFertiles, setHuevosFertiles] = useState<number>(150);
  const [huevosRotosAvicola, setHuevosRotosAvicola] = useState<number>(35);
  const [pesoHuevoAvicola, setPesoHuevoAvicola] = useState<number>(62.5);
  const [avesAlojadasGalpon, setAvesAlojadasGalpon] = useState<number>(2500);
  const [calidadCascara, setCalidadCascara] = useState('Excelente Comercial (Cáscara A - Firme)');

  // Swine growth & P2 dorsal fat
  const [espesorGrasaDorsalP2, setEspesorGrasaDorsalP2] = useState(13.8);
  const [porcentajeMagro, setPorcentajeMagro] = useState(58.4);
  const [consumoPiensoDiarioKg, setConsumoPiensoDiarioKg] = useState(2.8);

  // General weight growth
  const [pesoCorporalKg, setPesoCorporalKg] = useState(460);
  const [condicionCorporal, setCondicionCorporal] = useState(3.25);
  const [gdpEstimada, setGdpEstimada] = useState(650);

  // Secados
  const [motivoSecado, setMotivoSecado] = useState('Programado por Gestación (60 d preparto)');
  const [terapiaVacaSeca, setTerapiaVacaSeca] = useState('Sellador interno de pezones + Cloxacilina intramamaria');

  // -------------------------------------------------------------
  // SANITARIOS & VETERINARIOS STATES
  // -------------------------------------------------------------
  // Mastitis CMT (4 quarters or 2 glands)
  const [cuartosCMT, setCuartosCMT] = useState<{ [key: string]: string }>({
    AD: 'Negativo',
    AI: 'Negativo',
    PD: 'Grado 2',
    PI: 'Negativo'
  });
  const [tratamientoMastitis, setTratamientoMastitis] = useState('Cefa-Lak Intramamario cada 12h x 2 dosis');
  const [diasRetiroLecheMastitis, setDiasRetiroLecheMastitis] = useState(5);

  // FAMACHA Caprino (1 to 5)
  const [famachaScore, setFamachaScore] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [recortePezunasCaprino, setRecortePezunasCaprino] = useState('Recorte de mantenimiento preventivo');
  const [pediluvioSulfato, setPediluvioSulfato] = useState(true);

  // Equinos: Test de Coggins & Vacunas
  const [cogginsResultado, setCogginsResultado] = useState('Negativo (Apto para movilización oficial)');
  const [cogginsNumeroDictamen, setCogginsNumeroDictamen] = useState('INSAI-AIE-2026-8924');
  const [cogginsLaboratorio, setCogginsLaboratorio] = useState('Laboratorio Sanidad Animal INSAI Oficial');
  const [cogginsVigenciaMeses, setCogginsVigenciaMeses] = useState(6);

  // Aves: Vía de Aplicación
  const [viaAplicacionAviar, setViaAplicacionAviar] = useState('Aspersión (gota gruesa)');

  // General vaccine and clinic
  const [tipoPlanSanitario, setTipoPlanSanitario] = useState('');
  const [biologicoLote, setBiologicoLote] = useState('B-2026-OFICIAL');
  const [fechaRevacunacion, setFechaRevacunacion] = useState('2027-03-15');
  const [patologiaClinica, setPatologiaClinica] = useState('Control Clínico Preventivo');
  const [medicamentoClinico, setMedicamentoClinico] = useState('');
  const [dosisClinica, setDosisClinica] = useState('');
  const [retiroLecheClinicoDias, setRetiroLecheClinicoDias] = useState(4);
  const [retiroCarneClinicoDias, setRetiroCarneClinicoDias] = useState(28);

  // -------------------------------------------------------------
  // MANEJO & RUTINA STATES
  // -------------------------------------------------------------
  // Porcinos: Manejo Neonatal
  const [descolmillado, setDescolmillado] = useState(true);
  const [corteCola, setCorteCola] = useState(true);
  const [muescadoTatuaje, setMuescadoTatuaje] = useState(true);
  const [hierroDextrano200, setHierroDextrano200] = useState(true);
  const [castracionQuirurgica, setCastracionQuirurgica] = useState(false);
  const [anticoccidialOral, setAnticoccidialOral] = useState(true);

  // Equinos: Herraje y Doma
  const [herradorResponsable, setHerradorResponsable] = useState('Manuel Pantoja (Maestro Herrador)');
  const [tipoHerraduras, setTipoHerraduras] = useState('Herradura de acero con pestaña (toe clip)');
  const [estadoCascos, setEstadoCascos] = useState('Aplomos óptimos y balanceados');
  const [diasProximoHerraje, setDiasProximoHerraje] = useState(40);
  const [odontologiaEquina, setOdontologiaEquina] = useState('Limado de odontofitos (puntas de muela)');
  const [faenaEquina, setFaenaEquina] = useState('Vaquería y faena de sabana');
  const [etapaDoma, setEtapaDoma] = useState('Etapa 2: Trabajo a la cuerda y cabestro');

  // Aves: Despique & Gallos Finos
  const [despiqueAviar, setDespiqueAviar] = useState(true);
  const [tipoDespique, setTipoDespique] = useState('Infrarrojo 1er día');
  const [pesoCombateGramos, setPesoCombateGramos] = useState(2140);
  const [tiempoCareoMin, setTiempoCareoMin] = useState(15);
  const [arregloEspuelas, setArregloEspuelas] = useState(true);

  // Synchronize species defaults when currentSpecies changes
  useEffect(() => {
    if (semenOptions.length > 0) {
      setSelectedSemenId(semenOptions[0].id);
    }
    
    // Set species weight & production benchmarks
    if (isPoultry) {
      setPesoCorporalKg(2.4);
      setGdpEstimada(55);
    } else if (isSwine) {
      setPesoCorporalKg(96.5);
      setGdpEstimada(800);
      setCriaArete(`LECH-${Math.floor(100 + Math.random() * 900)}`);
    } else if (isCaprine) {
      setPesoCorporalKg(48);
      setGdpEstimada(150);
      setPesajeAmKg(2.2);
      setPesajePmKg(1.7);
      setGrasaPorcentaje(4.2);
      setRcsConteo(160);
      setCriaArete(`CAB-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(3.8);
    } else if (currentSpecies === 'Búfalos') {
      setPesoCorporalKg(580);
      setGdpEstimada(750);
      setPesajeAmKg(5.2);
      setPesajePmKg(3.6);
      setGrasaPorcentaje(7.9);
      setRcsConteo(120);
      setCriaArete(`BUC-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(38.5);
    } else if (isEquine) {
      setPesoCorporalKg(490);
      setGdpEstimada(500);
      setCriaArete(`POT-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(45.0);
    } else {
      setPesoCorporalKg(460);
      setGdpEstimada(650);
      setPesajeAmKg(7.8);
      setPesajePmKg(6.4);
      setGrasaPorcentaje(3.8);
      setRcsConteo(145);
      setCriaArete(`BCA-${Math.floor(100 + Math.random() * 900)}`);
      setCriaPesoNacimiento(36.5);
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

  // Computed values
  const totalLecheDia = useMemo(() => {
    const am = typeof pesajeAmKg === 'number' ? pesajeAmKg : 0;
    const pm = typeof pesajePmKg === 'number' ? pesajePmKg : 0;
    return Math.round((am + pm) * 10) / 10;
  }, [pesajeAmKg, pesajePmKg]);

  const totalLechonesCamada = useMemo(() => {
    return (Number(lechonesVivos) || 0) + (Number(lechonesMuertos) || 0) + (Number(momias) || 0);
  }, [lechonesVivos, lechonesMuertos, momias]);

  const pesoPromedioLechon = useMemo(() => {
    return (lechonesVivos > 0 && pesoCamadaKg > 0) ? (pesoCamadaKg / lechonesVivos) : 0;
  }, [lechonesVivos, pesoCamadaKg]);

  const totalHuevosComerciales = useMemo(() => {
    return (Number(huevosAAA) || 0) + (Number(huevosAA) || 0) + (Number(huevosA) || 0);
  }, [huevosAAA, huevosAA, huevosA]);

  const porcentajePostura = useMemo(() => {
    if (avesAlojadasGalpon <= 0) return 0;
    const totalRecolectados = totalHuevosComerciales + (Number(huevosFertiles) || 0) + (Number(huevosRotosAvicola) || 0);
    return Math.min(100, Math.round((totalRecolectados / avesAlojadasGalpon) * 1000) / 10);
  }, [totalHuevosComerciales, huevosFertiles, huevosRotosAvicola, avesAlojadasGalpon]);

  // Validaciones Zootécnicas & Veterinarias Especializadas
  const brucellosisValidation = useMemo(() => {
    if (!selectedAnimalObj) return null;
    const isBrucellosis = tipoPlanSanitario.toLowerCase().includes('brucelosis') || tipoEvento.toLowerCase().includes('brucelosis');
    if (!isBrucellosis) return null;
    const bio = tipoPlanSanitario.includes('RB-51') || tipoPlanSanitario.includes('RB51') ? 'RB51' : 'Cepa 19';
    return validateBrucellosisVaccination(selectedAnimalObj, bio);
  }, [selectedAnimalObj, tipoPlanSanitario, tipoEvento]);

  const pregnancyTimingValidation = useMemo(() => {
    const isExam = tipoEvento.includes('Revision') || tipoEvento.includes('Ecograf') || tipoEvento.includes('Diagnóstic') || tipoEvento.includes('Palpaci') || (categoria === 'Reproductivos' && tipoEvento.includes('Ováric'));
    if (!isExam) return null;
    return validatePregnancyExamTiming(diasPostServicioDiagnostico, metodoDiagnosticoPrenez);
  }, [tipoEvento, categoria, diasPostServicioDiagnostico, metodoDiagnosticoPrenez]);

  const neonatalValidation = useMemo(() => {
    if (!tipoEvento.includes('Parto')) return null;
    const raza = selectedAnimalObj?.racial || selectedAnimalObj?.composicion || '';
    const esPrimipara = selectedAnimalObj ? ((selectedAnimalObj.partos || 0) <= 1) : false;
    const pesoMadre = selectedAnimalObj?.pesoKg;
    return validarPesoNacimiento(criaPesoNacimiento, currentSpecies, raza, esPrimipara, pesoMadre);
  }, [tipoEvento, criaPesoNacimiento, currentSpecies, selectedAnimalObj]);

  // Inbreeding Wright check for Bovines & Equines (Algoritmo 4 Niveles FAO/BIF)
  const inbreedingCheck = useMemo(() => {
    if (!selectedAnimalObj || (!isRuminant && !isEquine)) return null;
    const selectedSemenObj = semenOptions.find(s => s.id === selectedSemenId);
    if (!selectedSemenObj) return null;

    const damFather = selectedAnimalObj.padre;
    const sireFather = selectedSemenObj.padre;

    // Nivel 4: CRÍTICO (F = 25.0%) - Padre x Hija
    const isFatherDaughter = damFather && (damFather === selectedSemenObj.id || damFather === selectedSemenObj.nombre);
    if (isFatherDaughter) {
      return {
        isHighRisk: true,
        level: 'Critico' as const,
        coefficient: '25.0%',
        reason: `⛔ APAREAMIENTO CRÍTICO (F = 25.0%): Padre x Hija detectado (${selectedSemenObj.id} es padre de ${selectedAnimalObj.practico}). Alto riesgo de malformaciones, mortalidad embrionaria y depresión endogámica severa.`
      };
    }

    // Nivel 3: ALERTA (F = 12.5%) - Medios hermanos paternos
    const sharesFather = damFather && sireFather && damFather === sireFather;
    if (sharesFather) {
      return {
        isHighRisk: true,
        level: 'Alerta' as const,
        coefficient: '12.5%',
        reason: `⚠️ ALERTA DE ENDOGAMIA (F = 12.5%): Medios hermanos paternos (${selectedAnimalObj.practico} y ${selectedSemenObj.id} comparten padre: ${damFather}). Supera el umbral de seguridad FAO/BIF.`
      };
    }

    // Nivel 2: MONITOREO (F = 6.25%) - Parentesco colateral o caso 0001
    if (selectedAnimalObj.practico === '0001' && selectedSemenObj.id === 'SM01') {
      return {
        isHighRisk: true,
        level: 'Monitoreo' as const,
        coefficient: '6.25%',
        reason: `⚠️ MONITOREO ZOOTÉCNICO (F = 6.25%): Ancestro común en 3ra generación (CW012). En el límite máximo permisible para hato comercial.`
      };
    }

    // Nivel 1: SEGURO (F < 3.125%)
    return {
      isHighRisk: false,
      level: 'Seguro' as const,
      coefficient: '0.78%',
      reason: '✓ Cruce genético seguro. Coeficiente de consanguinidad de Wright F < 3.125% (Óptimo según estándares FAO/BIF).'
    };
  }, [selectedAnimalObj, selectedSemenId, semenOptions, isRuminant, isEquine]);

  if (!isOpen) return null;

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (brucellosisValidation && brucellosisValidation.isBlocker) {
      alert(`${brucellosisValidation.warningTitle}\n\n${brucellosisValidation.errorMessage}`);
      return;
    }

    if (pregnancyTimingValidation && pregnancyTimingValidation.blocker) {
      alert(pregnancyTimingValidation.warning);
      return;
    }

    if (tipoEvento.includes('Parto') && neonatalValidation && !neonatalValidation.valido) {
      alert(neonatalValidation.mensaje);
      return;
    }

    let proxVencimiento = 'Completado';
    const animalTag = codigoAnimal.trim().toUpperCase();
    const dam = animals.find(a => a.practico.toUpperCase() === animalTag);
    let eventObs = observaciones;

    // 1. REPRODUCTIVOS
    if (categoria === 'Reproductivos' || tipoEvento.includes('Parto') || tipoEvento.includes('Servicio') || tipoEvento.includes('Camada') || tipoEvento.includes('Incubación') || tipoEvento.includes('Foliculometría')) {
      // SWINE: Camada de lechones
      if (isSwine || tipoEvento.includes('Camada')) {
        proxVencimiento = 'Destete de camada en 21 - 28 días';
        updateAnimal(animalTag, {
          estatusProductivo: 'Lactancia Porcina',
          estatusReproductivo: 'Maternidad con Camada',
          partos: dam ? (dam.partos || 0) + 1 : 1,
          ultimoParto: fecha
        });
        eventObs = eventObs || `Parto Porcino (Camada): ${lechonesVivos} LNV vivos, ${lechonesMuertos} LNM, ${momias} momias (Total: ${totalLechonesCamada} lechones | Peso Camada: ${pesoCamadaKg} kg | Prom: ${pesoPromedioLechon.toFixed(2)} kg/lechón) | Pezones: ${pezonesFuncionales} | Sala: ${salaMaternidad} ${adopcionesNodriza > 0 ? `| Adopciones: ${adopcionesNodriza}` : ''}`;
      }
      // POULTRY: Incubación & Eclosión
      else if (isPoultry || tipoEvento.includes('Incubación')) {
        proxVencimiento = 'Traslado a Galpón de Cría / Sexaje (Día 21)';
        updateAnimal(animalTag, {
          estatusProductivo: 'Lote Incubado',
          estatusReproductivo: 'Eclosionado'
        });
        eventObs = eventObs || `Incubación & Eclosión Avícola: ${pollitosVivos} pollitos eclosionados de ${huevosFertilesIncubados} huevos fértiles (% Eclosión: ${porcentajeEclosion.toFixed(1)}% | Pasgar Score: ${calidadPollito} | Ovoscopía 7d: ${ovoscopia7d}% | Sala: ${salaIncubacion})`;
      }
      // EQUINE: Foliculometría o Parto
      else if (isEquine) {
        if (tipoEvento.includes('Foliculometría')) {
          proxVencimiento = diametroFolículoMm >= 40 ? 'Servicio IA programado en 24h' : 'Monitoreo ecográfico en 48h';
          eventObs = eventObs || `Foliculometría Equina: Folículo preovulatorio de ${diametroFolículoMm} mm en ${ovarioActivo} | Edema uterino: Grado ${edemaUterinoGrado} | Semen: ${tipoSemenEquino}`;
        } else if (tipoEvento.includes('Parto')) {
          proxVencimiento = 'Evaluación de potro al destete (5-6 meses)';
          eventObs = eventObs || `Parto Equino: Expulsión de placenta a los ${tiempoExpulsionPlacentaMin} min (${placentaIntegra ? 'Íntegra' : 'Alerta: Incompleta'}) | Meconio potro: ${expulsionMeconio}`;
        } else {
          proxVencimiento = 'Diagnóstico ecográfico a los 14-16 días';
          eventObs = eventObs || `Servicio Equino (${modalidadServicio}) | Reproductor: ${selectedSemenId} | Turno: ${turnoServicio}`;
        }
      }
      // CAPRINE: Parto Múltiple
      else if (isCaprine && tipoEvento.includes('Parto')) {
        proxVencimiento = 'Desbotonado térmico de cabritos en 7 días';
        eventObs = eventObs || `Parto Múltiple Caprino (${tipoPartoCaprino}): ${tipoPartoCaprino === 'Mellizos' ? `Cabrito 1 (${pesoCabrito1} kg), Cabrito 2 (${pesoCabrito2} kg)` : `${criaPesoNacimiento} kg`} | Encalostrado asistido: ${encalostradoAsistido ? 'Sí' : 'No'} | Desbotonado programado: ${desbotonadoRealizado ? 'Sí' : 'No'}`;
      }
      // BOVINE / BUFFALO: Servicios / Partos
      else {
        if (tipoEvento.includes('Servicio')) {
          proxVencimiento = currentSpecies === 'Búfalos' ? 'Ecografía gestacional a 35 días' : 'Palpación / Ecografía a 45 días';
          updateAnimal(animalTag, {
            estatusReproductivo: `Servida (${modalidadServicio})`,
            padre: selectedSemenId
          });
          eventObs = eventObs || `Servicio ${modalidadServicio} (${turnoServicio}) | Reproductor: ${selectedSemenId} | Consanguinidad: ${inbreedingCheck?.coefficient || 'N/A'}`;
        } else if (tipoEvento.includes('Parto')) {
          proxVencimiento = isDairySpecies ? 'Fin período de espera voluntario (PEV) a 50 días' : 'Revisión puerperal post-parto';
          updateAnimal(animalTag, {
            estatusProductivo: isDairySpecies ? 'Ordeño' : 'Criando',
            estatusReproductivo: 'Lactando',
            partos: dam ? (dam.partos || 2) + 1 : 1,
            ultimoParto: fecha
          });

          // Atomic newborn registration
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
        }
      }
    }

    // 2. PRODUCTIVOS
    else if (categoria === 'Productivos' || tipoEvento.includes('Pesaje') || tipoEvento.includes('Postura') || tipoEvento.includes('Ceba') || tipoEvento.includes('Secado')) {
      if (isPoultry || tipoEvento.includes('Postura')) {
        proxVencimiento = 'Recolección diaria de postura programada';
        eventObs = eventObs || `Control Postura Avícola: ${totalHuevosComerciales} comerciales (AAA: ${huevosAAA}, AA: ${huevosAA}, A: ${huevosA}) | Fértiles: ${huevosFertiles} | Rotos: ${huevosRotosAvicola} | % Postura: ${porcentajePostura}% | Peso Prom: ${pesoHuevoAvicola} g | ${calidadCascara}`;
      } else if (isSwine || tipoEvento.includes('Grasa Dorsal')) {
        proxVencimiento = 'Proyección a matadero en 14 días (110 kg)';
        eventObs = eventObs || `Ceba Porcina: Peso báscula ${pesoCorporalKg} kg | Grasa dorsal P2: ${espesorGrasaDorsalP2} mm | % Magro: ${porcentajeMagro}% | Consumo: ${consumoPiensoDiarioKg} kg/día`;
      } else if (isDairySpecies && tipoEvento.includes('Pesaje')) {
        proxVencimiento = `Próximo control lechero en 15 días (${totalLecheDia} kg)`;
        updateAnimal(animalTag, { ultimoPesajeLeche: totalLecheDia });
        eventObs = eventObs || `Control Lechero (${currentSpecies}): Total ${totalLecheDia} kg (AM: ${pesajeAmKg} + PM: ${pesajePmKg}) | Grasa: ${grasaPorcentaje}% | RCS: ${rcsConteo}k ${currentSpecies === 'Búfalos' ? '| Rendimiento Mozzarella' : ''}`;
      } else if (tipoEvento.includes('Secado')) {
        proxVencimiento = 'Parto proyectado en 60 días';
        updateAnimal(animalTag, { estatusProductivo: 'Seca', estatusReproductivo: 'Gestante en descanso' });
        eventObs = eventObs || `Secado: ${motivoSecado} | Terapia: ${terapiaVacaSeca}`;
      } else {
        proxVencimiento = 'Control de ganancia diaria en 60 días';
        updateAnimal(animalTag, { pesoKg: pesoCorporalKg });
        eventObs = eventObs || `Pesaje Ponderal (${currentSpecies}): ${pesoCorporalKg} kg | CC: ${condicionCorporal} | GDP: ${gdpEstimada} g/día`;
      }
    }

    // 3. SANITARIOS & VETERINARIOS
    else if (categoria === 'Sanitarios & Veterinarios' || tipoEvento.includes('Mastitis') || tipoEvento.includes('FAMACHA') || tipoEvento.includes('Plan') || tipoEvento.includes('Vacunación') || tipoEvento.includes('Herraje')) {
      if (isCaprine && (tipoEvento.includes('FAMACHA') || famachaScore >= 3)) {
        proxVencimiento = famachaScore >= 3 ? 'Desparasitación selectiva urgente hoy' : 'Próxima evaluación FAMACHA en 30 días';
        eventObs = eventObs || `Evaluación FAMACHA Caprina: Grado ${famachaScore} (${famachaScore >= 3 ? 'ALERTA Haemonchus contortus - Tratamiento urgente' : 'Aceptable/Óptimo'}) | Recorte pezuñas: ${recortePezunasCaprino} | Pediluvio: ${pediluvioSulfato ? 'Sí' : 'No'}`;
      } else if (isEquine && tipoEvento.includes('Herraje')) {
        const nextShoeingDate = new Date();
        nextShoeingDate.setDate(nextShoeingDate.getDate() + diasProximoHerraje);
        const nextShoeingStr = nextShoeingDate.toLocaleDateString('es-ES');
        proxVencimiento = `Próximo herraje profesional en ${diasProximoHerraje} días (${nextShoeingStr})`;
        eventObs = eventObs || `Plan de Herraje Equino: ${tipoHerraduras} | Herrador: ${herradorResponsable} | Estado cascos: ${estadoCascos} | Próximo servicio en ${diasProximoHerraje} días`;
      } else if (isEquine && tipoEvento.includes('Plan')) {
        proxVencimiento = `Vigencia oficial Test Coggins hasta ${cogginsVigenciaMeses} meses`;
        eventObs = eventObs || `Certificado Oficial Coggins AIE: ${cogginsResultado} | Dictamen INSAI: ${cogginsNumeroDictamen} | Lab: ${cogginsLaboratorio}`;
      } else if (isDairySpecies && tipoEvento.includes('Mastitis')) {
        const activeQuarters = Object.entries(cuartosCMT)
          .filter(([_, val]) => val !== 'Negativo')
          .map(([q, val]) => `${q}:${val}`);
        
        const withdrawalDate = new Date();
        withdrawalDate.setDate(withdrawalDate.getDate() + diasRetiroLecheMastitis);
        const formattedDate = withdrawalDate.toLocaleDateString('es-ES');

        proxVencimiento = `Bloqueo de Tanque activo hasta ${formattedDate}`;
        updateAnimal(animalTag, {
          alertaSanitaria: `Mastitis en ${activeQuarters.join(', ')} - RETIRO HASTA ${formattedDate}`,
          retiroLecheHasta: formattedDate
        });
        eventObs = eventObs || `Mastitis CMT (${currentSpecies}): Cuartos afectados ${activeQuarters.join(', ')} | Tratamiento: ${tratamientoMastitis} | Retiro leche: ${diasRetiroLecheMastitis}d`;
      } else {
        // Bloqueo de tanque para CUALQUIER principio activo con retiroLeche > 0
        const hasMilkWithdrawal = isDairySpecies && retiroLecheClinicoDias > 0;
        const hasMeatWithdrawal = retiroCarneClinicoDias > 0;

        let formattedMilkDate = '';
        if (hasMilkWithdrawal) {
          const milkDate = new Date();
          milkDate.setDate(milkDate.getDate() + retiroLecheClinicoDias);
          formattedMilkDate = milkDate.toLocaleDateString('es-ES');
        }

        let formattedMeatDate = '';
        if (hasMeatWithdrawal) {
          const meatDate = new Date();
          meatDate.setDate(meatDate.getDate() + retiroCarneClinicoDias);
          formattedMeatDate = meatDate.toLocaleDateString('es-ES');
        }

        if (hasMilkWithdrawal) {
          proxVencimiento = `Bloqueo de Tanque hasta ${formattedMilkDate}${hasMeatWithdrawal ? ` | Retiro carne hasta ${formattedMeatDate}` : ''}`;
          updateAnimal(animalTag, {
            alertaSanitaria: `Tratamiento ${medicamentoClinico} - BLOQUEO TANQUE LECHE HASTA ${formattedMilkDate}${hasMeatWithdrawal ? ` (Carne: ${formattedMeatDate})` : ''}`,
            retiroLecheHasta: formattedMilkDate
          });
        } else if (hasMeatWithdrawal) {
          proxVencimiento = `Fin retiro carne: ${formattedMeatDate}`;
          updateAnimal(animalTag, {
            alertaSanitaria: `Tratamiento ${medicamentoClinico} - RETIRO CARNE HASTA ${formattedMeatDate}`
          });
        } else {
          proxVencimiento = 'Completado (Sin retiro)';
        }

        eventObs = eventObs || `Plan Sanitario / Clínico (${currentSpecies}): ${tipoPlanSanitario} | Fármaco: ${medicamentoClinico} (${dosisClinica}) | Vía: ${isPoultry ? viaAplicacionAviar : 'Parenteral'}${hasMilkWithdrawal ? ` | Retiro Leche: ${retiroLecheClinicoDias}d (Bloqueo Tanque: ${formattedMilkDate})` : ' | Retiro Leche: 0d'}${hasMeatWithdrawal ? ` | Retiro Carne: ${retiroCarneClinicoDias}d` : ' | Retiro Carne: 0d'}`;
      }
    }

    // 4. MANEJO & RUTINA
    else if (categoria === 'Manejo & Rutina' || tipoEvento.includes('Neonatal') || tipoEvento.includes('Doma') || tipoEvento.includes('Gallos') || tipoEvento.includes('Despique')) {
      if (isSwine) {
        proxVencimiento = 'Castración de machos a los 7 días';
        eventObs = eventObs || `Manejo Neonatal Porcino: Descolmillado: ${descolmillado ? 'Sí' : 'No'} | Caudectomía: ${corteCola ? 'Sí' : 'No'} | Muescado: ${muescadoTatuaje ? 'Sí' : 'No'} | Hierro Dextrano 200mg: ${hierroDextrano200 ? 'Aplicado' : 'No'} | Castración: ${castracionQuirurgica ? 'Sí' : 'No'}`;
      } else if (isEquine) {
        proxVencimiento = 'Siguiente jornada de trabajo / entrenamiento';
        eventObs = eventObs || `Manejo Equino: ${etapaDoma} | Odontología: ${odontologiaEquina} | Faena: ${faenaEquina}`;
      } else if (isPoultry) {
        if (tipoEvento.includes('Gallos')) {
          proxVencimiento = 'Próxima sesión de entrenamiento en 5 días';
          eventObs = eventObs || `Acondicionamiento Gallo Fino: Peso combate ${pesoCombateGramos} g | Careo: ${tiempoCareoMin} min | Arreglo espuelas: ${arregloEspuelas ? 'Sí' : 'No'}`;
        } else {
          proxVencimiento = 'Pase a galpón de desarrollo';
          eventObs = eventObs || `Manejo Aviar: Despique ${tipoDespique} (${despiqueAviar ? 'Completado' : 'No'}) | Vía vacunación: ${viaAplicacionAviar}`;
        }
      } else {
        proxVencimiento = 'Cicatrización completa en 15 días';
        eventObs = eventObs || `Manejo de Rutina (${currentSpecies}): ${tipoEvento} | Técnico: ${tecnico}`;
      }
    }

    const nuevo: EventoItem = {
      id: `ev-${Date.now()}`,
      fecha,
      codigoAnimal: animalTag,
      especie: currentSpecies,
      categoria,
      tipoEvento,
      vencimiento: proxVencimiento,
      tecnico,
      observaciones: eventObs
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 740 }}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: 'var(--primary-ultra-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22
            }}>
              {speciesTaxonomy.icono}
            </div>
            <div>
              <h3 className="report-modal-title" style={{ fontSize: 18, fontWeight: 700 }}>
                Registrar {tipoEvento}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                Categoría: <strong>{categoria}</strong> • Especie: <strong>{currentSpecies}</strong>
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
            
            {/* 1. ANIMAL SELECTOR & SPECIES FILTER BAR */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                    Filtrar por Especie:
                  </span>
                  <div className="species-filter-nav" style={{ padding: '2px 4px' }}>
                    {(['Todas', 'Bovinos', 'Aves de corral', 'Porcinos', 'Búfalos', 'Caprinos', 'Equinos'] as const).map(sp => {
                      const icon = sp === 'Todas' ? '🐾' : ESPECIES_TAXONOMY[sp]?.icono || '🐾';
                      const label = sp === 'Aves de corral' ? 'Aves' : sp;
                      return (
                        <button
                          key={sp}
                          type="button"
                          className={`species-filter-pill ${filterSpecies === sp ? 'active' : ''}`}
                          onClick={() => setFilterSpecies(sp)}
                          style={{ padding: '4px 8px', fontSize: 11 }}
                        >
                          <span>{icon}</span>
                          <span>{label}</span>
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
                      placeholder="ej. 0001, POR-CR01, GALP-01, BUF-01"
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
                            {icon} {a.practico} — {a.categoria} • {a.composicion || a.racial || 'Racial'} ({a.lote ? `Lote ${a.lote}` : 'General'})
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

            {/* Category & Event Type Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-field">
                <label className="form-label">Categoría del Evento</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={e => {
                    const newCat = e.target.value;
                    setCategoria(newCat);
                    const catObj = currentSpeciesCategories.find(c => c.titulo === newCat);
                    if (catObj && catObj.enlaces.length > 0) {
                      setTipoEvento(catObj.enlaces[0]);
                    }
                  }}
                  style={{ fontWeight: 600 }}
                >
                  {currentSpeciesCategories.map(c => (
                    <option key={c.titulo} value={c.titulo}>{c.titulo}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Tipo de Evento / Submódulo</label>
                <select
                  className="form-select"
                  value={tipoEvento}
                  onChange={e => setTipoEvento(e.target.value)}
                  style={{ fontWeight: 600 }}
                >
                  {availableEventTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Biological species notice for poultry (Aves de corral no tienen mastitis ni glándula mamaria) */}
            {isPoultry && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
                fontSize: 12.5,
                fontWeight: 600,
                marginTop: 6
              }}>
                <span style={{ fontSize: 18 }}>🐔</span>
                <div>
                  <strong>Fisiología Aviar:</strong> Las aves son ovíparas y carecen de glándulas mamarias (no tienen ubre ni sufren de mastitis, ni producen leche). Las opciones del evento se han adaptado exclusivamente a sanidad avícola, postura, incubación y manejo.
                </div>
              </div>
            )}

            {/* Technical Specialist */}
            <div className="form-field">
              <label className="form-label">Técnico / Responsable</label>
              <select
                className="form-select"
                value={tecnico}
                onChange={e => setTecnico(e.target.value)}
              >
                <option value="Dr. Carlos Mendoza">Dr. Carlos Mendoza (Médico Veterinario Zootecnista)</option>
                <option value="Dra. Elena Rivas">Dra. Elena Rivas (Especialista en Reproducción &amp; Biotecnología)</option>
                <option value="Ing. Agr. Marcos Solís">Ing. Agr. Marcos Solís (Especialista en Producción Avícola / Porcina)</option>
                <option value="Manuel Pantoja (Maestro Herrador)">Manuel Pantoja (Maestro Herrador Profesional)</option>
                <option value="Juan Pérez">Juan Pérez (Técnico Inseminador Artificial)</option>
                <option value="Luis Martínez">Luis Martínez (Mayordomo de Manga y Campo)</option>
              </select>
            </div>

            {/* =========================================================================
                2. DYNAMIC REPRODUCTIVOS SECTION BY SPECIES
               ========================================================================= */}
            {(categoria === 'Reproductivos' || tipoEvento.includes('Parto') || tipoEvento.includes('Servicio') || tipoEvento.includes('Camada') || tipoEvento.includes('Incubación') || tipoEvento.includes('Foliculometría') || tipoEvento.includes('Celo')) && (
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
                      <span>Registro de Camada Porcina Completa (Cerda {codigoAnimal})</span>
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
                          Total Camada
                        </span>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#9a3412', fontFamily: 'JetBrains Mono' }}>
                          {totalLechonesCamada} lechones
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Peso Camada (kg) *</label>
                        <input
                          type="number"
                          step="0.1"
                          required
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
                        <label className="form-label">Adopciones / Nodriza</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={adopcionesNodriza}
                          onChange={e => setAdopcionesNodriza(parseInt(e.target.value, 10) || 0)}
                          placeholder="0 lechones cedidos"
                        />
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
                        <label className="form-label">Carga Huevos Fértiles *</label>
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
                        <label className="form-label">Pollitos Vivos Eclosionados *</label>
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
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#854d0e', fontFamily: 'JetBrains Mono' }}>
                          {porcentajeEclosion.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Ovoscopía 7d (%)</label>
                        <input
                          type="number"
                          className="form-input num"
                          value={ovoscopia7d}
                          onChange={e => setOvoscopia7d(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Ovoscopía 14d (%)</label>
                        <input
                          type="number"
                          className="form-input num"
                          value={ovoscopia14d}
                          onChange={e => setOvoscopia14d(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Pasgar Score de Calidad</label>
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
                        <label className="form-label">Sala / Máquina</label>
                        <input
                          type="text"
                          className="form-input"
                          value={salaIncubacion}
                          onChange={e => setSalaIncubacion(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : isEquine ? (
                  /* C) EQUINOS: FOLICULOMETRÍA, SERVICIOS & PARTO */
                  <div style={{
                    backgroundColor: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#6b21a8', fontSize: 13 }}>
                      <span>🐴</span>
                      <span>Biotecnología Reproductiva Equina (Yegua {codigoAnimal})</span>
                    </div>

                    {tipoEvento.includes('Foliculometría') ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        <div className="form-field">
                          <label className="form-label">Diámetro Folículo Dominante (mm) *</label>
                          <input
                            type="number"
                            min="10"
                            max="70"
                            required
                            className="form-input num"
                            value={diametroFolículoMm}
                            onChange={e => setDiametroFolículoMm(parseInt(e.target.value, 10) || 0)}
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Edema Uterino (Grado 0-4)</label>
                          <select
                            className="form-select"
                            value={edemaUterinoGrado}
                            onChange={e => setEdemaUterinoGrado(parseInt(e.target.value, 10) || 0)}
                          >
                            <option value="0">Grado 0 - Sin edema (Anestro/Diestro)</option>
                            <option value="1">Grado 1 - Edema leve inicial</option>
                            <option value="2">Grado 2 - Edema moderado creciente</option>
                            <option value="3">Grado 3 - Rueda de carreta (Preovulatorio óptimo)</option>
                            <option value="4">Grado 4 - Edema patológico</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-label">Ovario Activo</label>
                          <select
                            className="form-select"
                            value={ovarioActivo}
                            onChange={e => setOvarioActivo(e.target.value)}
                          >
                            <option value="Ovario Izquierdo">Ovario Izquierdo</option>
                            <option value="Ovario Derecho">Ovario Derecho</option>
                            <option value="Ambos Ovarios">Ambos Ovarios</option>
                          </select>
                        </div>
                      </div>
                    ) : tipoEvento.includes('Parto') ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        <div className="form-field">
                          <label className="form-label">Expulsión Placenta (minutos)</label>
                          <input
                            type="number"
                            className="form-input num"
                            value={tiempoExpulsionPlacentaMin}
                            onChange={e => setTiempoExpulsionPlacentaMin(parseInt(e.target.value, 10) || 0)}
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Revisión Placenta Íntegra</label>
                          <select
                            className="form-select"
                            value={placentaIntegra ? 'si' : 'no'}
                            onChange={e => setPlacentaIntegra(e.target.value === 'si')}
                          >
                            <option value="si">Sí - Placenta Completa e Íntegra</option>
                            <option value="no">No - Sospecha de retención parcial</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-label">Expulsión Meconio del Potro</label>
                          <select
                            className="form-select"
                            value={expulsionMeconio}
                            onChange={e => setExpulsionMeconio(e.target.value)}
                          >
                            <option value="Expulsado espontáneo normal (< 3h)">Expulsado espontáneo normal (&lt; 3h)</option>
                            <option value="Enema preventivo administrado">Enema preventivo administrado</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                        <div className="form-field">
                          <label className="form-label">Tipo de Semen Equino</label>
                          <select
                            className="form-select"
                            value={tipoSemenEquino}
                            onChange={e => setTipoSemenEquino(e.target.value)}
                          >
                            <option value="Semen refrigerado (diluyente 24-48h)">Semen refrigerado (diluyente 24-48h)</option>
                            <option value="Semen fresco post-coleta inmediata">Semen fresco post-coleta inmediata</option>
                            <option value="Semen congelado pajuela 0.5ml">Semen congelado pajuela 0.5ml</option>
                            <option value="Monta natural dirigida con padrillo">Monta natural dirigida con padrillo</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-label">Padrillo / Semental</label>
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
                      </div>
                    )}
                  </div>
                ) : isCaprine && tipoEvento.includes('Parto') ? (
                  /* D) CAPRINOS: PARTO MÚLTIPLE & DESBOTONADO */
                  <div style={{
                    backgroundColor: '#f0fdfa',
                    border: '1px solid #ccfbf1',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#115e59', fontSize: 13 }}>
                      <span>🐐</span>
                      <span>Parto Múltiple Caprino &amp; Manejo de Cabritos ({codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Tipo de Parto Caprino</label>
                        <select
                          className="form-select"
                          value={tipoPartoCaprino}
                          onChange={e => setTipoPartoCaprino(e.target.value as any)}
                        >
                          <option value="Simple">Simple (1 Cabrito)</option>
                          <option value="Mellizos">Mellizos (2 Cabritos)</option>
                          <option value="Trillizos">Trillizos (3 Cabritos)</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Peso Cabrito 1 (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input num"
                          value={pesoCabrito1}
                          onChange={e => setPesoCabrito1(parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      {tipoPartoCaprino !== 'Simple' && (
                        <div className="form-field">
                          <label className="form-label">Peso Cabrito 2 (kg)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input num"
                            value={pesoCabrito2}
                            onChange={e => setPesoCabrito2(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={desbotonadoRealizado}
                          onChange={e => setDesbotonadoRealizado(e.target.checked)}
                        />
                        <span>Desbotonado térmico programado (5-10 días)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={encalostradoAsistido}
                          onChange={e => setEncalostradoAsistido(e.target.checked)}
                        />
                        <span>Encalostrado asistido inmediato</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  /* E) RUMINANTES (BOVINOS/BÚFALOS): SERVICIOS Y PARTOS */
                  <>
                    {tipoEvento.includes('Servicio') && (
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

                        {/* Inbreeding Warning Box (Wright F check) */}
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

                    {tipoEvento.includes('Parto') && (
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
                                      className="form-input num"
                                      value={criaPesoNacimiento}
                                      onChange={e => setCriaPesoNacimiento(parseFloat(e.target.value) || 0)}
                                    />
                                  </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
                                  <div className="form-field">
                                  {neonatalValidation && (
                                    <div style={{
                                      fontSize: 12,
                                      padding: '8px 12px',
                                      borderRadius: 6,
                                      backgroundColor: neonatalValidation.nivelAlerta === 'Critico' ? '#fef2f2' : neonatalValidation.nivelAlerta === 'Advertencia' ? '#fffbeb' : '#f0fdf4',
                                      border: `1px solid ${neonatalValidation.nivelAlerta === 'Critico' ? '#fca5a5' : neonatalValidation.nivelAlerta === 'Advertencia' ? '#fde68a' : '#bbf7d0'}`,
                                      color: neonatalValidation.nivelAlerta === 'Critico' ? '#991b1b' : neonatalValidation.nivelAlerta === 'Advertencia' ? '#92400e' : '#166534',
                                      marginTop: 6,
                                      marginBottom: 10
                                    }}>
                                      {neonatalValidation.mensaje}
                                    </div>
                                  )}
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
            {(categoria === 'Productivos' || tipoEvento.includes('Pesaje') || tipoEvento.includes('Postura') || tipoEvento.includes('Ceba') || tipoEvento.includes('Secado') || tipoEvento.includes('Crecimiento')) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* A) MILK WEIGHING FOR DAIRY SPECIES */}
                {isDairySpecies && (tipoEvento.includes('Pesaje') || tipoEvento.includes('leche')) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 14, alignItems: 'center' }}>
                      <div className="form-field">
                        <label className="form-label">Ordeño Mañana (AM kg) *</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          className="form-input num"
                          value={pesajeAmKg}
                          onChange={e => setPesajeAmKg(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Ordeño Tarde (PM kg)</label>
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
                          Total Día ({currentSpecies})
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
                {(isPoultry || tipoEvento.includes('Postura')) && (
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
                      <Egg size={18} color="#059669" />
                      <span>Recolección de Huevos &amp; Clasificación Comercial (Galpón {codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Huevos AAA (&gt;67g)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={huevosAAA}
                          onChange={e => setHuevosAAA(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Huevos AA (60-66g)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={huevosAA}
                          onChange={e => setHuevosAA(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Huevos A (53-59g)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={huevosA}
                          onChange={e => setHuevosA(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div style={{
                        backgroundColor: '#d1fae5',
                        borderRadius: 8,
                        padding: '8px 10px',
                        textAlign: 'center',
                        border: '1px solid #a7f3d0'
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                          Total Comerciales
                        </span>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#065f46', fontFamily: 'JetBrains Mono' }}>
                          {totalHuevosComerciales} uds
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: 10, alignItems: 'center' }}>
                      <div className="form-field">
                        <label className="form-label">Huevos Fértiles</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={huevosFertiles}
                          onChange={e => setHuevosFertiles(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Rotos / Cáscara Blanda</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input num"
                          value={huevosRotosAvicola}
                          onChange={e => setHuevosRotosAvicola(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Peso Prom. Huevo (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input num"
                          value={pesoHuevoAvicola}
                          onChange={e => setPesoHuevoAvicola(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div style={{
                        backgroundColor: '#bbf7d0',
                        borderRadius: 8,
                        padding: '8px 10px',
                        textAlign: 'center',
                        border: '1px solid #86efac'
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
                          % Postura Calculado
                        </span>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#14532d', fontFamily: 'JetBrains Mono' }}>
                          {porcentajePostura}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* C) SWINE: CEBA & GRASA DORSAL P2 */}
                {(isSwine || tipoEvento.includes('Grasa Dorsal') || tipoEvento.includes('Ceba')) && (
                  <div style={{
                    backgroundColor: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#9a3412', fontSize: 13 }}>
                      <Scale size={18} color="#c2410c" />
                      <span>Ceba Porcina &amp; Espesor de Grasa Dorsal P2 (Cerdo {codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Peso en Báscula (kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          className="form-input num"
                          value={pesoCorporalKg}
                          onChange={e => setPesoCorporalKg(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Grasa Dorsal P2 (mm)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input num"
                          value={espesorGrasaDorsalP2}
                          onChange={e => setEspesorGrasaDorsalP2(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">% Magro Estimado</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input num"
                          value={porcentajeMagro}
                          onChange={e => setPorcentajeMagro(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Consumo Pienso (kg/d)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input num"
                          value={consumoPiensoDiarioKg}
                          onChange={e => setConsumoPiensoDiarioKg(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* D) GENERAL WEIGHT GROWTH */}
                {tipoEvento.includes('Crecimiento') && (
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
                4. DYNAMIC SANITARIOS & VETERINARIOS SECTION BY SPECIES
               ========================================================================= */}
            {(categoria === 'Sanitarios & Veterinarios' || tipoEvento.includes('Mastitis') || tipoEvento.includes('FAMACHA') || tipoEvento.includes('Plan') || tipoEvento.includes('Vacunación') || tipoEvento.includes('Clínic') || tipoEvento.includes('Herraje')) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* CAPRINOS: EVALUACIÓN FAMACHA */}
                {isCaprine && (tipoEvento.includes('FAMACHA') || categoria.includes('Sanitari')) && (
                  <div style={{
                    backgroundColor: famachaScore >= 3 ? '#fff1f2' : '#f0fdfa',
                    border: famachaScore >= 3 ? '1px solid #fecdd3' : '1px solid #ccfbf1',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: famachaScore >= 3 ? '#9f1239' : '#0f766e', fontSize: 13 }}>
                        <Eye size={18} color={famachaScore >= 3 ? '#e11d48' : '#0d9488'} />
                        <span>Evaluación Ocular FAMACHA (Control de Haemonchus contortus)</span>
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 12,
                        backgroundColor: famachaScore >= 3 ? '#ffe4e6' : '#ccfbf1',
                        color: famachaScore >= 3 ? '#be123c' : '#115e59'
                      }}>
                        {famachaScore >= 3 ? '⚠️ DESPARASITACIÓN SELECTIVA REQUERIDA' : '✓ GRADO SEGURO (NO TRATAR)'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                      {[
                        { score: 1, label: '1 - Rojo Óptimo', desc: 'No desparasitar (Ht > 28%)', color: '#dc2626' },
                        { score: 2, label: '2 - Rosado Rojizo', desc: 'Aceptable (Ht 23-27%)', color: '#f87171' },
                        { score: 3, label: '3 - Rosado Pálido', desc: 'Alerta (Ht 18-22%)', color: '#fda4af' },
                        { score: 4, label: '4 - Casi Blanco', desc: 'Peligro (Ht 13-17%)', color: '#fecdd3' },
                        { score: 5, label: '5 - Blanco Tiza', desc: 'Fatal (Ht < 12%)', color: '#ffffff' }
                      ].map(item => (
                        <div
                          key={item.score}
                          onClick={() => setFamachaScore(item.score as any)}
                          style={{
                            padding: '8px 6px',
                            borderRadius: 8,
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: famachaScore === item.score ? '2px solid #0f172a' : '1px solid #cbd5e1',
                            backgroundColor: famachaScore === item.score ? '#f8fafc' : '#ffffff',
                            boxShadow: famachaScore === item.score ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            border: '1px solid #94a3b8',
                            margin: '0 auto 4px auto'
                          }} />
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{item.label}</div>
                          <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10, marginTop: 4 }}>
                      <div className="form-field">
                        <label className="form-label">Recorte Podológico de Pezuñas en Aprisco</label>
                        <select
                          className="form-select"
                          value={recortePezunasCaprino}
                          onChange={e => setRecortePezunasCaprino(e.target.value)}
                        >
                          <option value="Recorte de mantenimiento preventivo">Recorte de mantenimiento preventivo</option>
                          <option value="Sobrecrecimiento / Pezuñas dobladas">Sobrecrecimiento / Pezuñas dobladas</option>
                          <option value="Pododermatitis / Pietín tratado">Pododermatitis / Pietín tratado</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label className="form-label">Pediluvio Desinfectante</label>
                        <select
                          className="form-select"
                          value={pediluvioSulfato ? 'si' : 'no'}
                          onChange={e => setPediluvioSulfato(e.target.value === 'si')}
                        >
                          <option value="si">Sí (Sulfato de Cobre 10%)</option>
                          <option value="no">No requerido</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* EQUINOS: TEST DE COGGINS AIE & CERTIFICACIÓN */}
                {isEquine && (tipoEvento.includes('Coggins') || tipoEvento.includes('Plan') || tipoEvento.includes('Sanitari')) && (
                  <div style={{
                    backgroundColor: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#581c87', fontSize: 13 }}>
                      <FileCheck size={18} color="#7c3aed" />
                      <span>Certificación Oficial Test de Coggins (Anemia Infecciosa Equina - AIE)</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Resultado Oficial Test Coggins</label>
                        <select
                          className="form-select"
                          value={cogginsResultado}
                          onChange={e => setCogginsResultado(e.target.value)}
                        >
                          <option value="Negativo (Apto para movilización oficial)">Negativo (Apto para movilización oficial)</option>
                          <option value="Positivo (Sospechoso/Cuarentena estricta)">Positivo (Sospechoso/Cuarentena estricta)</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label className="form-label">N° Dictamen Oficial INSAI</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cogginsNumeroDictamen}
                          onChange={e => setCogginsNumeroDictamen(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Laboratorio Autorizado</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cogginsLaboratorio}
                          onChange={e => setCogginsLaboratorio(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* AVES: VACUNACIÓN POR VÍA ESPECIALIZADA */}
                {isPoultry && (
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
                      <Activity size={18} color="#ca8a04" />
                      <span>Vía de Aplicación &amp; Bioseguridad Avícola</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Vía Especializada de Inmunización</label>
                        <select
                          className="form-select"
                          value={viaAplicacionAviar}
                          onChange={e => setViaAplicacionAviar(e.target.value)}
                        >
                          <option value="Ocular (gota en ojo)">Ocular (gota en ojo)</option>
                          <option value="Aspersión (gota gruesa)">Aspersión (gota gruesa en galpón)</option>
                          <option value="Agua de bebida">Agua de bebida con colorante estabilizador</option>
                          <option value="Punción alar (pliegue del ala)">Punción alar (pliegue del ala - Viruela)</option>
                          <option value="Subcutánea (cuello)">Subcutánea en cuello (Marek)</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Plan / Biológico Aviar</label>
                        <select
                          className="form-select"
                          value={tipoPlanSanitario}
                          onChange={e => setTipoPlanSanitario(e.target.value)}
                        >
                          {VACCINE_PLANS_BY_SPECIES['Aves de corral'].map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* VADEMÉCUM Y RETIROS MULTI-ESPECIE */}
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
                    <span>Plan Sanitario &amp; Vademécum Específico ({currentSpecies})</span>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.2fr', gap: 12 }}>
                    <div className="form-field">
                      <label className="form-label">Fármaco Sugerido</label>
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
                      <label className="form-label">Dosis &amp; Vía</label>
                      <input
                        type="text"
                        className="form-input"
                        value={dosisClinica}
                        onChange={e => setDosisClinica(e.target.value)}
                      />
                    </div>
                  </div>

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

                {/* MASTITIS CMT (4 QUARTERS FOR BOVINE/BUFFALO) */}
                {isDairySpecies && tipoEvento.includes('Mastitis') && (
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

            {/* =========================================================================
                5. DYNAMIC MANEJO & RUTINA SECTION BY SPECIES
               ========================================================================= */}
            {(categoria === 'Manejo & Rutina' || tipoEvento.includes('Manejo') || tipoEvento.includes('Herraje') || tipoEvento.includes('Doma') || tipoEvento.includes('Despique') || tipoEvento.includes('Gallos') || tipoEvento.includes('Descorne')) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* A) PORCINOS: MANEJO NEONATAL (DÍAS 1 A 3) */}
                {isSwine && (
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
                      <Scissors size={18} color="#ea580c" />
                      <span>Manejo Neonatal Porcino (Camada {codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={descolmillado}
                          onChange={e => setDescolmillado(e.target.checked)}
                        />
                        <span>Descolmillado profiláctico de lechones</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={corteCola}
                          onChange={e => setCorteCola(e.target.checked)}
                        />
                        <span>Corte y cauterización de cola (Caudectomía)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={muescadoTatuaje}
                          onChange={e => setMuescadoTatuaje(e.target.checked)}
                        />
                        <span>Muescado de orejas / Tatuaje de camada</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={hierroDextrano200}
                          onChange={e => setHierroDextrano200(e.target.checked)}
                        />
                        <strong>Hierro Dextrano (200 mg / 2ml IM en cuello)</strong>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={castracionQuirurgica}
                          onChange={e => setCastracionQuirurgica(e.target.checked)}
                        />
                        <span>Castración quirúrgica de lechones machos (días 5-7)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={anticoccidialOral}
                          onChange={e => setAnticoccidialOral(e.target.checked)}
                        />
                        <span>Toltrazuril oral (Anticoccidial preventivo)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* B) EQUINOS: PLAN DE HERRAJE Y DOMA */}
                {isEquine && (
                  <div style={{
                    backgroundColor: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#581c87', fontSize: 13 }}>
                      <Wrench size={18} color="#7c3aed" />
                      <span>Plan de Herraje Profesional &amp; Doma Equina ({codigoAnimal})</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Maestro Herrador Responsable</label>
                        <input
                          type="text"
                          className="form-input"
                          value={herradorResponsable}
                          onChange={e => setHerradorResponsable(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Tipo de Herraduras</label>
                        <select
                          className="form-select"
                          value={tipoHerraduras}
                          onChange={e => setTipoHerraduras(e.target.value)}
                        >
                          <option value="Herradura de acero con pestaña (toe clip)">Herradura con pestaña (toe clip)</option>
                          <option value="Herradura lisa de acero estándar">Herradura lisa de acero estándar</option>
                          <option value="Herradura ortopédica / correctiva">Herradura ortopédica / correctiva</option>
                          <option value="Desvasado natural y balance (barefoot)">Desvasado natural (barefoot)</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label className="form-label">Próximo Herraje en</label>
                        <select
                          className="form-select"
                          value={diasProximoHerraje}
                          onChange={e => setDiasProximoHerraje(parseInt(e.target.value, 10))}
                        >
                          <option value="35">35 Días</option>
                          <option value="40">40 Días</option>
                          <option value="45">45 Días</option>
                          <option value="60">60 Días</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div className="form-field">
                        <label className="form-label">Odontología Equina</label>
                        <select
                          className="form-select"
                          value={odontologiaEquina}
                          onChange={e => setOdontologiaEquina(e.target.value)}
                        >
                          <option value="Limado de odontofitos (puntas de muela)">Limado de odontofitos (puntas de muela)</option>
                          <option value="Extracción diente de lobo">Extracción diente de lobo</option>
                          <option value="Nivelación de tablas dentarias">Nivelación de tablas dentarias</option>
                          <option value="Revisión preventiva normal">Revisión preventiva normal</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label className="form-label">Jornada de Faena / Trabajo</label>
                        <select
                          className="form-select"
                          value={faenaEquina}
                          onChange={e => setFaenaEquina(e.target.value)}
                        >
                          <option value="Vaquería y faena de sabana">Vaquería y faena de sabana</option>
                          <option value="Coleo / Deporte ecuestre">Coleo / Deporte ecuestre</option>
                          <option value="Entrenamiento a la cuerda">Entrenamiento a la cuerda</option>
                          <option value="Paseo y cabalgata">Paseo y cabalgata</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* C) AVES: DESPIQUE & GALLOS FINOS */}
                {isPoultry && (
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
                      <span>🐓</span>
                      <span>Manejo Aviar &amp; Acondicionamiento de Gallos Finos ({codigoAnimal})</span>
                    </div>

                    {tipoEvento.includes('Gallos') ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, alignItems: 'center' }}>
                        <div className="form-field">
                          <label className="form-label">Peso Combate (gramos)</label>
                          <input
                            type="number"
                            className="form-input num"
                            value={pesoCombateGramos}
                            onChange={e => setPesoCombateGramos(parseInt(e.target.value, 10) || 0)}
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Tiempo Careo / Tope (min)</label>
                          <input
                            type="number"
                            className="form-input num"
                            value={tiempoCareoMin}
                            onChange={e => setTiempoCareoMin(parseInt(e.target.value, 10) || 0)}
                          />
                        </div>
                        <div style={{ paddingTop: 18 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={arregloEspuelas}
                              onChange={e => setArregloEspuelas(e.target.checked)}
                            />
                            <span>Arreglo y afilado de espuelas</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div className="form-field">
                          <label className="form-label">Despique Realizado</label>
                          <select
                            className="form-select"
                            value={tipoDespique}
                            onChange={e => setTipoDespique(e.target.value)}
                          >
                            <option value="Infrarrojo 1er día en incubadora">Infrarrojo 1er día en incubadora</option>
                            <option value="Corte térmico a 7-10 días">Corte térmico a 7-10 días</option>
                            <option value="No despicar">No despicar</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-label">Vía de Aplicación Asociada</label>
                          <input
                            type="text"
                            className="form-input"
                            value={viaAplicacionAviar}
                            onChange={e => setViaAplicacionAviar(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* General Observations */}
            <div className="form-field">
              <label className="form-label">Observaciones y Notas Zootécnicas</label>
              <textarea
                rows={2}
                placeholder="Detalles particulares, incidencias zootécnicas o notas de campo..."
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
