import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Milk, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  Layers,
  Syringe,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Baby
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { EventoItem } from './NuevoEventoModal';
import { EspecieAnimal } from '../../../types/animal';
import './eventosSpreadsheet.css';

/* =========================================================================
 * INTERFACES PARA LOS 5 MODOS MASIVOS
 * ========================================================================= */

// MODO 1: Control Lechero Masivo
export interface MilkRowData {
  id: string;
  arete: string;
  lote?: string;
  pesajeAm: number | '';
  pesajePm: number | '';
  grasa: number | '';
  proteina: number | '';
  rcs: number | '';
}

// MODO 2: Pesaje Ponderal & Biomasa
export interface WeightRowData {
  id: string;
  arete: string;
  categoria?: string;
  lote?: string;
  pesoAnterior: number | '';
  pesoActual: number | '';
  diasTranscurridos: number | '';
  condicion: number;
  observaciones: string;
}

// MODO 3: Control de Postura & Recolección Avícola
export interface PoultryRowData {
  id: string;
  lote: string;
  tipoAve: 'Ponedoras' | 'Reproductoras' | 'Patas' | 'Pavas' | 'Gallinas Finas';
  avesAlojadas: number | '';
  huevosComerciales: number | '';
  huevosFertiles: number | '';
  huevosRotos: number | '';
  pesoPromedioHuevo: number | '';
  observaciones: string;
}

// MODO 4: Registro Rápido de Camadas Porcinas
export interface SwineLitterRowData {
  id: string;
  areteCerda: string;
  salaMaternidad: string;
  fechaParto: string;
  lnv: number | ''; // Lechones Nacidos Vivos
  lnm: number | ''; // Lechones Nacidos Muertos
  momias: number | ''; // Momias Fetales
  pesoTotalCamada: number | ''; // kg
  pezonesFuncionales: number | '';
  adopciones: string;
  observaciones: string;
}

// MODO 5: Vacunación & Desparasitación en Bloque
export interface VaccineRowData {
  id: string;
  codigo: string;
  estadoSanitario: 'Apto para Dosis' | 'En Observación' | 'Sospechoso' | 'Cuarentena';
  dosis: string;
  loteFarmaco: string;
  medicoResponsable: string;
  diasRetiroLeche: number | '';
  diasRetiroCarne: number | '';
  observaciones: string;
}

interface SpreadsheetGridModeProps {
  onSaveBatch: (events: EventoItem[]) => void;
  onExit?: () => void;
}

export type DairySpecies = 'Bovinos' | 'Búfalos' | 'Caprinos';

export const DAIRY_SPECIES_OPTIONS: { id: DairySpecies; label: string; icon: string; animalLabel: string }[] = [
  { id: 'Bovinos', label: 'Bovinos (Vacas)', icon: '🐮', animalLabel: 'Vaca' },
  { id: 'Búfalos', label: 'Búfalos (Búfalas)', icon: '🐃', animalLabel: 'Búfala' },
  { id: 'Caprinos', label: 'Caprinos (Cabras lecheras)', icon: '🐐', animalLabel: 'Cabra' },
];

export const WEIGHT_SPECIES_OPTIONS: { id: EspecieAnimal; label: string; icon: string; expectedRange: string; defaultWeight: number }[] = [
  { id: 'Bovinos', label: 'Bovinos', icon: '🐮', expectedRange: '~180 - 550 kg (Becerros a Vacas/Toros)', defaultWeight: 450 },
  { id: 'Aves de corral', label: 'Aves de corral', icon: '🐔', expectedRange: '~1.9 - 2.8 kg (Ponedoras / Broilers)', defaultWeight: 2.5 },
  { id: 'Porcinos', label: 'Porcinos', icon: '🐷', expectedRange: '~80 - 110 kg (Ceba) / ~200 kg (Madres)', defaultWeight: 95 },
  { id: 'Búfalos', label: 'Búfalos', icon: '🐃', expectedRange: '~180 - 620 kg (Bucerros a Búfalas)', defaultWeight: 520 },
  { id: 'Caprinos', label: 'Caprinos', icon: '🐐', expectedRange: '~30 - 65 kg (Cabritos a Cabras)', defaultWeight: 45 },
  { id: 'Equinos', label: 'Equinos', icon: '🐴', expectedRange: '~250 - 520 kg (Potros a Adultos)', defaultWeight: 420 },
];

// Presets biológicos para Vacunación en bloque
export interface PlanBiolPreset {
  id: string;
  nombre: string;
  viaDefault: string;
  dosisDefault: string;
  loteDefault: string;
  retiroLecheDefault: number;
  retiroCarneDefault: number;
  medicoDefault: string;
}

export const VACCINE_PLANS_BY_SPECIES: Record<EspecieAnimal, PlanBiolPreset[]> = {
  'Aves de corral': [
    { id: 'av-newcastle', nombre: 'Newcastle (LaSota)', viaDefault: 'Ocular', dosisDefault: '1 gota/ave', loteDefault: 'VAC-NEW-2026', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dra. María Elena' },
    { id: 'av-gumboro', nombre: 'Gumboro (Cepa Intermedia)', viaDefault: 'Agua de bebida', dosisDefault: '1 dosis/ave', loteDefault: 'GUM-BIO-14', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dra. María Elena' },
    { id: 'av-bronquitis', nombre: 'Bronquitis Infecciosa (H-120)', viaDefault: 'Aspersión', dosisDefault: '1 dosis/ave', loteDefault: 'BRO-H120-09', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dra. María Elena' },
    { id: 'av-viruela', nombre: 'Viruela Aviar (Punción alar)', viaDefault: 'Punción alar', dosisDefault: '1 punción', loteDefault: 'VIR-AL-33', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dra. María Elena' },
    { id: 'av-coccidia', nombre: 'Coccidiosis (Toltrazuril 2.5%)', viaDefault: 'Agua de bebida', dosisDefault: '7.0 mg/kg', loteDefault: 'TOL-COC-81', retiroLecheDefault: 0, retiroCarneDefault: 14, medicoDefault: 'Dr. Carlos Mendoza' }
  ],
  'Porcinos': [
    { id: 'por-ppc', nombre: 'Peste Porcina Clásica (PPC Oficial)', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'PPC-INSAI-2026', retiroLecheDefault: 0, retiroCarneDefault: 21, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'por-pcv2', nombre: 'Circovirus Porcino tipo 2 (PCV2)', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'PCV2-VAC-08', retiroLecheDefault: 0, retiroCarneDefault: 14, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'por-myco', nombre: 'Micoplasma hyopneumoniae', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'MYCO-RESP-41', retiroLecheDefault: 0, retiroCarneDefault: 14, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'por-parvo', nombre: 'Parvovirus + Leptospira (Madres)', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'LEPTO-PARV-99', retiroLecheDefault: 0, retiroCarneDefault: 14, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'por-ivm', nombre: 'Ivermectina 1% Antiparasitario', viaDefault: 'Inyectable IM/SC', dosisDefault: '1.0 mL/33kg', loteDefault: 'IVM-POR-101', retiroLecheDefault: 0, retiroCarneDefault: 28, medicoDefault: 'Dr. Carlos Mendoza' }
  ],
  'Equinos': [
    { id: 'eq-coggins', nombre: 'Test de Coggins (AIE Oficial INSAI)', viaDefault: 'Inyectable IM/SC', dosisDefault: '5.0 mL suero', loteDefault: 'AIE-OFICIAL-26', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'eq-tetanos', nombre: 'Tétanos (Toxoide Tetánico)', viaDefault: 'Inyectable IM/SC', dosisDefault: '1.0 mL', loteDefault: 'TET-EQU-12', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'eq-encefalo', nombre: 'Encefalomielitis Equina (VEE/EEE)', viaDefault: 'Inyectable IM/SC', dosisDefault: '1.0 mL', loteDefault: 'VEE-EEE-45', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'eq-influenza', nombre: 'Influenza Equina & Rinoneumonitis', viaDefault: 'Inyectable IM/SC', dosisDefault: '1.5 mL', loteDefault: 'INF-RINO-30', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'eq-pasta', nombre: 'Ivermectina + Praziquantel Gel Oral', viaDefault: 'Oral', dosisDefault: '1 jeringa/600kg', loteDefault: 'GEL-EQ-77', retiroLecheDefault: 0, retiroCarneDefault: 35, medicoDefault: 'Dr. Carlos Mendoza' }
  ],
  'Bovinos': [
    { id: 'bov-aftosa', nombre: 'Fiebre Aftosa Bivalente (Ciclo Oficial)', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'AFT-BIV-2026', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'bov-brucelosis', nombre: 'Brucelosis (Cepa 19 / RB51)', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'BRU-RB51-03', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'bov-rabia', nombre: 'Rabia Paresiante Bovina', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'RAB-PAR-11', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'bov-clostridiosis', nombre: 'Clostridiosis 8 Vías Polivalente', viaDefault: 'Inyectable IM/SC', dosisDefault: '5.0 mL', loteDefault: 'CLO-8V-90', retiroLecheDefault: 0, retiroCarneDefault: 14, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'bov-ivm', nombre: 'Ivermectina 3.15% L.A.', viaDefault: 'Inyectable IM/SC', dosisDefault: '1.0 mL/50kg', loteDefault: 'IVM-LA-882', retiroLecheDefault: 28, retiroCarneDefault: 42, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'bov-bano', nombre: 'Baño Garrapaticida / Mosquicida', viaDefault: 'Pediluvio/Baño', dosisDefault: '1:1000 dilución', loteDefault: 'ECTO-BA-15', retiroLecheDefault: 3, retiroCarneDefault: 7, medicoDefault: 'Dr. Carlos Mendoza' }
  ],
  'Búfalos': [
    { id: 'buf-aftosa', nombre: 'Fiebre Aftosa Bufalina', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'AFT-BUF-2026', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'buf-brucelosis', nombre: 'Brucelosis Búfalas (RB51)', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'BRU-BUF-04', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'buf-rabia', nombre: 'Rabia Paresiante Bufalina', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'RAB-BUF-22', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'buf-fasciola', nombre: 'Fasciolicida (Triclabendazol)', viaDefault: 'Oral', dosisDefault: '12.0 mL', loteDefault: 'TRI-FAS-99', retiroLecheDefault: 14, retiroCarneDefault: 28, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'buf-clostridiosis', nombre: 'Clostridiosis Bufalina Polivalente', viaDefault: 'Inyectable IM/SC', dosisDefault: '5.0 mL', loteDefault: 'CLO-BUF-71', retiroLecheDefault: 0, retiroCarneDefault: 14, medicoDefault: 'Dr. Carlos Mendoza' }
  ],
  'Caprinos': [
    { id: 'cap-clostridiosis', nombre: 'Clostridiosis / Enterotoxemia C y D', viaDefault: 'Inyectable IM/SC', dosisDefault: '2.0 mL', loteDefault: 'ENT-CAP-26', retiroLecheDefault: 0, retiroCarneDefault: 14, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'cap-tetanos', nombre: 'Tétanos Caprino', viaDefault: 'Inyectable IM/SC', dosisDefault: '1.0 mL', loteDefault: 'TET-CAP-05', retiroLecheDefault: 0, retiroCarneDefault: 0, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'cap-agalaxia', nombre: 'Agalaxia Contagiosa Caprina', viaDefault: 'Inyectable IM/SC', dosisDefault: '1.0 mL', loteDefault: 'AGA-CAP-18', retiroLecheDefault: 3, retiroCarneDefault: 7, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'cap-famacha', nombre: 'FAMACHA & Albendazol 10%', viaDefault: 'Oral', dosisDefault: '5.0 mL', loteDefault: 'ALB-CAP-44', retiroLecheDefault: 4, retiroCarneDefault: 10, medicoDefault: 'Dr. Carlos Mendoza' },
    { id: 'cap-ivm', nombre: 'Ivermectina Caprina Antiparasitaria', viaDefault: 'Inyectable IM/SC', dosisDefault: '0.5 mL', loteDefault: 'IVM-CAP-09', retiroLecheDefault: 7, retiroCarneDefault: 21, medicoDefault: 'Dr. Carlos Mendoza' }
  ]
};

export const VIAS_APLICACION = [
  'Inyectable IM/SC',
  'Agua de bebida',
  'Ocular',
  'Punción alar',
  'Aspersión',
  'Pediluvio/Baño',
  'Oral'
];

export const CONDICION_HENNEKE_OPTIONS = [
  { value: 1, label: '1 - Pobre / Emaciado' },
  { value: 2, label: '2 - Muy Delgado' },
  { value: 3, label: '3 - Delgado' },
  { value: 4, label: '4 - Moderadamente Delgado' },
  { value: 5, label: '5 - Moderado / Ideal' },
  { value: 6, label: '6 - Moderadamente Carnoso' },
  { value: 7, label: '7 - Carnoso' },
  { value: 8, label: '8 - Gordo' },
  { value: 9, label: '9 - Extremadamente Gordo' },
];

export const CONDICION_STANDARD_OPTIONS = [
  { value: 1.0, label: '1.0 - Muy Flaca / Emaciada' },
  { value: 2.0, label: '2.0 - Flaca' },
  { value: 2.5, label: '2.5 - Regular' },
  { value: 3.0, label: '3.0 - Óptima / Comercial' },
  { value: 3.25, label: '3.25 - Buena Condición' },
  { value: 3.5, label: '3.5 - Vigorosa' },
  { value: 4.0, label: '4.0 - Gorda' },
  { value: 5.0, label: '5.0 - Sobreengrasada' },
];

// Filas iniciales representativas para cada modo
const INITIAL_POULTRY_ROWS: PoultryRowData[] = [
  { id: 'p-1', lote: 'GALP-01', tipoAve: 'Ponedoras', avesAlojadas: 2500, huevosComerciales: 2380, huevosFertiles: 0, huevosRotos: 35, pesoPromedioHuevo: 62.5, observaciones: 'Pico de producción (Lohmann Brown)' },
  { id: 'p-2', lote: 'GALP-02', tipoAve: 'Ponedoras', avesAlojadas: 2400, huevosComerciales: 2240, huevosFertiles: 0, huevosRotos: 42, pesoPromedioHuevo: 61.8, observaciones: 'Postura alta 95.1% (Hy-Line)' },
  { id: 'p-3', lote: 'GALP-03', tipoAve: 'Ponedoras', avesAlojadas: 3000, huevosComerciales: 2810, huevosFertiles: 0, huevosRotos: 48, pesoPromedioHuevo: 63.0, observaciones: 'Calidad cáscara comercial A' },
  { id: 'p-4', lote: 'GALP-LEV', tipoAve: 'Ponedoras', avesAlojadas: 1800, huevosComerciales: 1540, huevosFertiles: 0, huevosRotos: 22, pesoPromedioHuevo: 58.5, observaciones: 'Inicio de postura (Semana 22)' },
  { id: 'p-5', lote: 'CAS-ELITE', tipoAve: 'Reproductoras', avesAlojadas: 800, huevosComerciales: 120, huevosFertiles: 650, huevosRotos: 10, pesoPromedioHuevo: 64.2, observaciones: 'Lote Reproductoras Cobb 500' }
];

const INITIAL_SWINE_ROWS: SwineLitterRowData[] = [
  { id: 's-1', areteCerda: 'POR-CR01', salaMaternidad: 'Sala M1 - Box 02', fechaParto: new Date().toISOString().split('T')[0], lnv: 13, lnm: 1, momias: 0, pesoTotalCamada: 17.8, pezonesFuncionales: 16, adopciones: 'Sin adopción', observaciones: 'Parto eutócico vigoroso' },
  { id: 's-2', areteCerda: 'POR-CR02', salaMaternidad: 'Sala M1 - Box 05', fechaParto: new Date().toISOString().split('T')[0], lnv: 12, lnm: 0, momias: 1, pesoTotalCamada: 16.2, pezonesFuncionales: 14, adopciones: '+1 adoptado', observaciones: 'Madre excelente instinto' },
  { id: 's-3', areteCerda: 'POR-CR03', salaMaternidad: 'Sala M2 - Box 01', fechaParto: new Date().toISOString().split('T')[0], lnv: 14, lnm: 1, momias: 0, pesoTotalCamada: 19.1, pezonesFuncionales: 16, adopciones: '-2 a nodriza', observaciones: 'Alta prolificidad Landrace' },
  { id: 's-4', areteCerda: 'POR-CR04', salaMaternidad: 'Sala M2 - Box 04', fechaParto: new Date().toISOString().split('T')[0], lnv: 11, lnm: 0, momias: 0, pesoTotalCamada: 15.4, pezonesFuncionales: 14, adopciones: 'Sin adopción', observaciones: 'Primeriza (F1 Yorkshire)' }
];

export const SpreadsheetGridMode: React.FC<SpreadsheetGridModeProps> = ({ onSaveBatch }) => {
  const { animals, updateAnimal } = useApp();
  
  // 5 Modos Principales
  const [activeTab, setActiveTab] = useState<'leche' | 'peso' | 'postura' | 'camadas' | 'vacunacion'>('leche');
  
  // 1. Control Lechero state
  const [selectedDairySpecies, setSelectedDairySpecies] = useState<DairySpecies>('Bovinos');
  const [selectedLoteToPopulate, setSelectedLoteToPopulate] = useState<string>('TODOS');
  
  // 2. Control Ponderal state
  const [selectedWeightSpecies, setSelectedWeightSpecies] = useState<EspecieAnimal>('Bovinos');
  
  // 4. Camadas Porcinas state
  const [selectedSwineLote, setSelectedSwineLote] = useState<string>('TODOS');

  // 5. Vacunación & Desparasitación state
  const [selectedVaccineSpecies, setSelectedVaccineSpecies] = useState<EspecieAnimal>('Bovinos');
  const [selectedVaccinePlanId, setSelectedVaccinePlanId] = useState<string>(VACCINE_PLANS_BY_SPECIES['Bovinos'][0].id);
  const [selectedVaccineVia, setSelectedVaccineVia] = useState<string>(VACCINE_PLANS_BY_SPECIES['Bovinos'][0].viaDefault);
  const [selectedVaccineLote, setSelectedVaccineLote] = useState<string>('TODOS');

  // Notification banner
  const [batchSaveResult, setBatchSaveResult] = useState<{ 
    count: number; 
    total: string; 
    average: string; 
    detail?: string; 
  } | null>(null);

  // Filas Modo 1: Leche
  const [milkRows, setMilkRows] = useState<MilkRowData[]>([
    { id: 'm-1', arete: '0001', lote: 'Lote 01', pesajeAm: 7.8, pesajePm: 6.4, grasa: 3.8, proteina: 3.2, rcs: 145 },
    { id: 'm-2', arete: '0002', lote: 'Lote 01', pesajeAm: 6.5, pesajePm: 5.9, grasa: 3.6, proteina: 3.1, rcs: 220 },
    { id: 'm-3', arete: 'BCA05', lote: 'Lote 01', pesajeAm: 8.2, pesajePm: 7.1, grasa: 4.1, proteina: 3.4, rcs: 110 }
  ]);

  // Filas Modo 2: Peso & Biomasa
  const [weightRows, setWeightRows] = useState<WeightRowData[]>([
    { id: 'w-1', arete: 'BCA01', categoria: 'Mauta', lote: 'POT1', pesoAnterior: 165, pesoActual: 185, diasTranscurridos: 30, condicion: 3.25, observaciones: 'Desarrollo óptimo recría' },
    { id: 'w-2', arete: 'BCA02', categoria: 'Mauta', lote: 'POT1', pesoAnterior: 158, pesoActual: 178, diasTranscurridos: 30, condicion: 3.0, observaciones: 'Ganancia sostenida' },
    { id: 'w-3', arete: 'BCA03', categoria: 'Novilla', lote: 'POT2', pesoAnterior: 360, pesoActual: 385, diasTranscurridos: 35, condicion: 3.5, observaciones: 'Novilla de reemplazo' },
    { id: 'w-4', arete: '0001', categoria: 'Vaca', lote: 'Lote 01', pesoAnterior: 545, pesoActual: 560, diasTranscurridos: 45, condicion: 3.25, observaciones: 'Condición post-parto estable' },
  ]);

  // Filas Modo 3: Postura Avícola
  const [poultryRows, setPoultryRows] = useState<PoultryRowData[]>(INITIAL_POULTRY_ROWS);

  // Filas Modo 4: Camadas Porcinas
  const [swineRows, setSwineRows] = useState<SwineLitterRowData[]>(INITIAL_SWINE_ROWS);

  // Filas Modo 5: Vacunación en Bloque
  const [vaccineRows, setVaccineRows] = useState<VaccineRowData[]>([
    { id: 'v-1', codigo: '0001', estadoSanitario: 'Apto para Dosis', dosis: '2.0 mL', loteFarmaco: 'AFT-BIV-2026', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 0, diasRetiroCarne: 0, observaciones: 'Dosis preventiva ciclo oficial INSAI' },
    { id: 'v-2', codigo: '0002', estadoSanitario: 'Apto para Dosis', dosis: '2.0 mL', loteFarmaco: 'AFT-BIV-2026', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 0, diasRetiroCarne: 0, observaciones: 'Dosis preventiva ciclo oficial INSAI' },
    { id: 'v-3', codigo: 'BCA05', estadoSanitario: 'Apto para Dosis', dosis: '2.0 mL', loteFarmaco: 'AFT-BIV-2026', medicoResponsable: 'Dr. Carlos Mendoza', diasRetiroLeche: 0, diasRetiroCarne: 0, observaciones: 'Dosis preventiva ciclo oficial INSAI' }
  ]);

  // Map de animales para búsqueda rápida
  const animalsByTag = useMemo(() => {
    const map = new Map<string, typeof animals[0]>();
    animals.forEach(a => map.set(a.practico.toUpperCase(), a));
    return map;
  }, [animals]);

  // Available lots based on active tab and species
  const availableLotes = useMemo(() => {
    const lotes = new Set<string>();
    let targetSpecies: string = selectedDairySpecies;
    if (activeTab === 'peso') targetSpecies = selectedWeightSpecies;
    else if (activeTab === 'postura') targetSpecies = 'Aves de corral';
    else if (activeTab === 'camadas') targetSpecies = 'Porcinos';
    else if (activeTab === 'vacunacion') targetSpecies = selectedVaccineSpecies;
    
    animals.forEach(a => {
      const matchesSpecies = a.especie === targetSpecies || (!a.especie && targetSpecies === 'Bovinos');
      if (matchesSpecies && a.lote) {
        lotes.add(a.lote);
      }
    });

    if (activeTab === 'postura') {
      lotes.add('GALP-01');
      lotes.add('GALP-02');
      lotes.add('GALP-03');
      lotes.add('GALP-LEV');
      lotes.add('CAS-ELITE');
    }

    return Array.from(lotes);
  }, [animals, activeTab, selectedDairySpecies, selectedWeightSpecies, selectedVaccineSpecies]);

  // Active dairy species metadata
  const currentDairyMeta = useMemo(() => {
    return DAIRY_SPECIES_OPTIONS.find(d => d.id === selectedDairySpecies) || DAIRY_SPECIES_OPTIONS[0];
  }, [selectedDairySpecies]);

  // Active weight species metadata
  const currentWeightMeta = useMemo(() => {
    return WEIGHT_SPECIES_OPTIONS.find(w => w.id === selectedWeightSpecies) || WEIGHT_SPECIES_OPTIONS[0];
  }, [selectedWeightSpecies]);

  // Active vaccine preset metadata
  const currentVaccinePlans = useMemo(() => {
    return VACCINE_PLANS_BY_SPECIES[selectedVaccineSpecies] || VACCINE_PLANS_BY_SPECIES['Bovinos'];
  }, [selectedVaccineSpecies]);

  const currentVaccinePlan = useMemo(() => {
    return currentVaccinePlans.find(p => p.id === selectedVaccinePlanId) || currentVaccinePlans[0];
  }, [currentVaccinePlans, selectedVaccinePlanId]);

  /* =========================================================================
   * LIVE KPIS PARA CADA MODO
   * ========================================================================= */

  // KPI Modo 1: Control Lechero
  const milkStats = useMemo(() => {
    let totalKg = 0;
    let countedAnimals = 0;
    let rcsAlerts = 0;
    let totalGrasa = 0;
    let totalProteina = 0;
    let countGrasa = 0;

    milkRows.forEach(r => {
      const am = typeof r.pesajeAm === 'number' ? r.pesajeAm : 0;
      const pm = typeof r.pesajePm === 'number' ? r.pesajePm : 0;
      const total = am + pm;
      if (total > 0 && r.arete.trim()) {
        totalKg += total;
        countedAnimals++;
      }
      if (typeof r.grasa === 'number' && r.grasa > 0) {
        totalGrasa += r.grasa;
        countGrasa++;
      }
      if (typeof r.proteina === 'number' && r.proteina > 0) {
        totalProteina += r.proteina;
      }
      if (typeof r.rcs === 'number' && r.rcs > 200) {
        rcsAlerts++;
      }
    });

    const averageKg = countedAnimals > 0 ? totalKg / countedAnimals : 0;
    const averageGrasa = countGrasa > 0 ? totalGrasa / countGrasa : (selectedDairySpecies === 'Búfalos' ? 7.8 : selectedDairySpecies === 'Caprinos' ? 4.2 : 3.8);
    const averageProteina = countGrasa > 0 ? totalProteina / countGrasa : (selectedDairySpecies === 'Búfalos' ? 4.5 : selectedDairySpecies === 'Caprinos' ? 3.5 : 3.2);

    return { totalKg, countedAnimals, averageKg, averageGrasa, averageProteina, rcsAlerts };
  }, [milkRows, selectedDairySpecies]);

  // KPI Modo 2: Pesaje Ponderal & Biomasa
  const weightStats = useMemo(() => {
    let totalKg = 0;
    let countedAnimals = 0;
    let totalGdpSum = 0;
    let gdpCount = 0;
    let positiveGrowthCount = 0;

    weightRows.forEach(r => {
      const pAct = typeof r.pesoActual === 'number' ? r.pesoActual : 0;
      const pAnt = typeof r.pesoAnterior === 'number' ? r.pesoAnterior : 0;
      const dias = typeof r.diasTranscurridos === 'number' && r.diasTranscurridos > 0 ? r.diasTranscurridos : 30;

      if (pAct > 0 && r.arete.trim()) {
        totalKg += pAct;
        countedAnimals++;

        if (pAnt > 0) {
          const gdp = ((pAct - pAnt) / dias) * 1000;
          totalGdpSum += gdp;
          gdpCount++;
          if (gdp > 0) positiveGrowthCount++;
        }
      }
    });

    const averageKg = countedAnimals > 0 ? totalKg / countedAnimals : 0;
    const averageGdp = gdpCount > 0 ? totalGdpSum / gdpCount : 0;
    const growthEfficiencyPorc = gdpCount > 0 ? (positiveGrowthCount / gdpCount) * 100 : 100;

    return { totalKg, countedAnimals, averageKg, averageGdp, growthEfficiencyPorc };
  }, [weightRows]);

  // KPI Modo 3: Control de Postura Avícola
  const poultryStats = useMemo(() => {
    let totalAves = 0;
    let totalHuevosComerciales = 0;
    let totalHuevosFertiles = 0;
    let totalHuevosRotos = 0;
    let countedGalpones = 0;

    poultryRows.forEach(r => {
      const aves = typeof r.avesAlojadas === 'number' ? r.avesAlojadas : 0;
      const com = typeof r.huevosComerciales === 'number' ? r.huevosComerciales : 0;
      const fert = typeof r.huevosFertiles === 'number' ? r.huevosFertiles : 0;
      const rot = typeof r.huevosRotos === 'number' ? r.huevosRotos : 0;
      
      if (aves > 0 && (com > 0 || fert > 0 || rot > 0)) {
        totalAves += aves;
        totalHuevosComerciales += com;
        totalHuevosFertiles += fert;
        totalHuevosRotos += rot;
        countedGalpones++;
      }
    });

    const totalHuevos = totalHuevosComerciales + totalHuevosFertiles + totalHuevosRotos;
    const porcentajePostura = totalAves > 0 ? (totalHuevos / totalAves) * 100 : 0;
    const mermaPorc = totalHuevos > 0 ? (totalHuevosRotos / totalHuevos) * 100 : 0;

    return {
      totalAves,
      totalHuevosComerciales,
      totalHuevosFertiles,
      totalHuevosRotos,
      totalHuevos,
      porcentajePostura,
      mermaPorc,
      countedGalpones
    };
  }, [poultryRows]);

  // KPI Modo 4: Registro de Camadas Porcinas
  const swineStats = useMemo(() => {
    let countedSows = 0;
    let totalLnv = 0;
    let totalLnm = 0;
    let totalMomias = 0;
    let totalPesoCamadas = 0;
    let countPesoCamadas = 0;

    swineRows.forEach(r => {
      const lnv = typeof r.lnv === 'number' ? r.lnv : 0;
      const lnm = typeof r.lnm === 'number' ? r.lnm : 0;
      const mom = typeof r.momias === 'number' ? r.momias : 0;
      const pesoCam = typeof r.pesoTotalCamada === 'number' ? r.pesoTotalCamada : 0;

      if (r.areteCerda.trim() && (lnv > 0 || lnm > 0)) {
        countedSows++;
        totalLnv += lnv;
        totalLnm += lnm;
        totalMomias += mom;
        if (pesoCam > 0) {
          totalPesoCamadas += pesoCam;
          countPesoCamadas++;
        }
      }
    });

    const totalLechones = totalLnv + totalLnm + totalMomias;
    const promLechonesPorCerda = countedSows > 0 ? totalLnv / countedSows : 0;
    const pesoMedioNacer = totalLechones > 0 && totalPesoCamadas > 0 ? totalPesoCamadas / totalLechones : (totalLnv > 0 && totalPesoCamadas > 0 ? totalPesoCamadas / totalLnv : 1.38);

    return {
      countedSows,
      totalLnv,
      totalLnm,
      totalMomias,
      totalLechones,
      promLechonesPorCerda,
      pesoMedioNacer
    };
  }, [swineRows]);

  // KPI Modo 5: Vacunación en Bloque
  const vaccineStats = useMemo(() => {
    let appliedCount = 0;
    let activeWithdrawalAlerts = 0;

    vaccineRows.forEach(r => {
      if (r.codigo.trim()) {
        appliedCount++;
        const dLeche = typeof r.diasRetiroLeche === 'number' ? r.diasRetiroLeche : 0;
        const dCarne = typeof r.diasRetiroCarne === 'number' ? r.diasRetiroCarne : 0;
        if (dLeche > 0 || dCarne > 0) {
          activeWithdrawalAlerts++;
        }
      }
    });

    const totalSpeciesAnimals = animals.filter(a => a.especie === selectedVaccineSpecies || (!a.especie && selectedVaccineSpecies === 'Bovinos')).length || appliedCount || 1;
    const herdCoveragePorc = Math.min(100, Math.round((appliedCount / totalSpeciesAnimals) * 100));

    return {
      appliedCount,
      totalSpeciesAnimals,
      herdCoveragePorc,
      activeWithdrawalAlerts,
      activePlanName: currentVaccinePlan.nombre
    };
  }, [vaccineRows, animals, selectedVaccineSpecies, currentVaccinePlan]);

  /* =========================================================================
   * NAVEGACIÓN DE TECLADO ULTRA-RÁPIDA (ENTER, FLECHAS, TAB)
   * ========================================================================= */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    prefix: string,
    rowIndex: number,
    colIndex: number,
    totalRows: number,
    isLastRow: boolean
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLastRow) {
        if (activeTab === 'leche') addMilkRow();
        else if (activeTab === 'peso') addWeightRow();
        else if (activeTab === 'postura') addPoultryRow();
        else if (activeTab === 'camadas') addSwineRow();
        else if (activeTab === 'vacunacion') addVaccineRow();

        setTimeout(() => {
          const nextInput = document.getElementById(`cell-${prefix}-${rowIndex + 1}-${colIndex}`);
          nextInput?.focus();
        }, 40);
      } else {
        const nextInput = document.getElementById(`cell-${prefix}-${rowIndex + 1}-${colIndex}`);
        nextInput?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      if (rowIndex < totalRows - 1) {
        e.preventDefault();
        const nextInput = document.getElementById(`cell-${prefix}-${rowIndex + 1}-${colIndex}`);
        nextInput?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (rowIndex > 0) {
        e.preventDefault();
        const prevInput = document.getElementById(`cell-${prefix}-${rowIndex - 1}-${colIndex}`);
        prevInput?.focus();
      }
    }
  };

  /* =========================================================================
   * AGREGAR FILAS PERSONALIZADAS POR MODO
   * ========================================================================= */
  const addMilkRow = () => {
    const defaultArete = selectedDairySpecies === 'Búfalos' ? 'BUF-' : selectedDairySpecies === 'Caprinos' ? 'CAP-' : '';
    setMilkRows(prev => [
      ...prev,
      { 
        id: `m-${Date.now()}-${Math.random()}`, 
        arete: defaultArete, 
        lote: selectedLoteToPopulate !== 'TODOS' ? selectedLoteToPopulate : 'Lote 01', 
        pesajeAm: '', 
        pesajePm: '', 
        grasa: selectedDairySpecies === 'Búfalos' ? 7.8 : selectedDairySpecies === 'Caprinos' ? 4.2 : 3.8, 
        proteina: selectedDairySpecies === 'Búfalos' ? 4.5 : selectedDairySpecies === 'Caprinos' ? 3.5 : 3.2, 
        rcs: 140 
      }
    ]);
  };

  const addWeightRow = () => {
    const defaultWeight = currentWeightMeta.defaultWeight;
    setWeightRows(prev => [
      ...prev,
      { 
        id: `w-${Date.now()}-${Math.random()}`, 
        arete: '', 
        categoria: 'General', 
        lote: 'Lote General', 
        pesoAnterior: Math.round(defaultWeight * 0.94 * 10) / 10, 
        pesoActual: defaultWeight, 
        diasTranscurridos: 30, 
        condicion: selectedWeightSpecies === 'Equinos' ? 5 : 3.0, 
        observaciones: '' 
      }
    ]);
  };

  const addPoultryRow = () => {
    setPoultryRows(prev => [
      ...prev,
      { 
        id: `p-${Date.now()}-${Math.random()}`, 
        lote: `GALP-0${prev.length + 1}`, 
        tipoAve: 'Ponedoras', 
        avesAlojadas: 2000, 
        huevosComerciales: '', 
        huevosFertiles: 0, 
        huevosRotos: '', 
        pesoPromedioHuevo: 62.0, 
        observaciones: '' 
      }
    ]);
  };

  const addSwineRow = () => {
    setSwineRows(prev => [
      ...prev,
      { 
        id: `s-${Date.now()}-${Math.random()}`, 
        areteCerda: 'POR-CR', 
        salaMaternidad: `Sala M1 - Box 0${prev.length + 1}`, 
        fechaParto: new Date().toISOString().split('T')[0], 
        lnv: '', 
        lnm: 0, 
        momias: 0, 
        pesoTotalCamada: '', 
        pezonesFuncionales: 14, 
        adopciones: 'Sin adopción', 
        observaciones: '' 
      }
    ]);
  };

  const addVaccineRow = () => {
    setVaccineRows(prev => [
      ...prev,
      { 
        id: `v-${Date.now()}-${Math.random()}`, 
        codigo: '', 
        estadoSanitario: 'Apto para Dosis', 
        dosis: currentVaccinePlan.dosisDefault, 
        loteFarmaco: currentVaccinePlan.loteDefault, 
        medicoResponsable: currentVaccinePlan.medicoDefault, 
        diasRetiroLeche: currentVaccinePlan.retiroLecheDefault, 
        diasRetiroCarne: currentVaccinePlan.retiroCarneDefault, 
        observaciones: `Plan: ${currentVaccinePlan.nombre} (${selectedVaccineVia})` 
      }
    ]);
  };

  /* =========================================================================
   * POBLACIÓN AUTOMÁTICA "CARGAR LOTE" MULTI-ESPECIE
   * ========================================================================= */

  // 1. Control Lechero: Cargar Lote
  const handlePopulateDairyLote = (species = selectedDairySpecies, lote = selectedLoteToPopulate) => {
    const lactatingFemales = animals.filter(a => {
      const isSpecies = a.especie === species || (!a.especie && species === 'Bovinos');
      if (!isSpecies || a.estatus !== 'Activo') return false;
      
      const isFemale = a.sexo !== 'Macho' && 
                       a.categoria !== 'Toro' && 
                       a.categoria !== 'Padrote' && 
                       a.categoria !== 'Chivo' && 
                       a.categoria !== 'Verraco' &&
                       !a.categoria.toLowerCase().includes('ceba');
      
      const isMilking = a.estatusProductivo === 'Ordeño' || 
                        a.categoria.toLowerCase().includes('vaca') || 
                        a.categoria.toLowerCase().includes('búfala') || 
                        a.categoria.toLowerCase().includes('cabra');

      if (!isFemale || !isMilking) return false;

      if (lote && lote !== 'TODOS') {
        return a.lote === lote;
      }
      return true;
    });

    const targetList = lactatingFemales.length > 0 
      ? lactatingFemales 
      : animals.filter(a => (a.especie === species || (!a.especie && species === 'Bovinos')) && a.estatus === 'Activo' && a.sexo !== 'Macho');

    if (targetList.length === 0) return;

    const newRows: MilkRowData[] = targetList.map((a, idx) => {
      let am = 7.5;
      let pm = 6.2;
      let fat = 3.8;
      let prot = 3.2;
      let rcs = 145;

      if (species === 'Búfalos') {
        am = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.55) * 10) / 10 : 4.8;
        pm = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.45) * 10) / 10 : 3.8;
        fat = 7.8;
        prot = 4.5;
        rcs = 120;
      } else if (species === 'Caprinos') {
        am = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.55) * 10) / 10 : 2.2;
        pm = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.45) * 10) / 10 : 1.8;
        fat = 4.2;
        prot = 3.5;
        rcs = 160;
      } else {
        am = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.55) * 10) / 10 : 7.8;
        pm = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.45) * 10) / 10 : 6.4;
        fat = 3.8;
        prot = 3.2;
        rcs = 145;
      }

      return {
        id: `m-pop-${a.practico}-${idx}-${Date.now()}`,
        arete: a.practico,
        lote: a.lote || 'Lote 01',
        pesajeAm: am,
        pesajePm: pm,
        grasa: fat,
        proteina: prot,
        rcs: rcs
      };
    });

    setMilkRows(newRows);
  };

  // 2. Control Ponderal: Cargar Lote
  const handlePopulateWeightLote = (species = selectedWeightSpecies, lote = selectedLoteToPopulate) => {
    const speciesAnimals = animals.filter(a => {
      const isSpecies = a.especie === species || (!a.especie && species === 'Bovinos');
      if (!isSpecies || a.estatus !== 'Activo') return false;
      if (lote && lote !== 'TODOS') {
        return a.lote === lote;
      }
      return true;
    });

    if (speciesAnimals.length === 0) return;

    const newRows: WeightRowData[] = speciesAnimals.map((a, idx) => {
      let expectedP = a.pesoKg;
      if (!expectedP) {
        if (species === 'Aves de corral') expectedP = 2.5;
        else if (species === 'Porcinos') expectedP = 95;
        else if (species === 'Caprinos') expectedP = 45;
        else if (species === 'Equinos') expectedP = 420;
        else if (species === 'Búfalos') expectedP = 520;
        else expectedP = 450;
      }

      const prevWeight = Math.round((expectedP * 0.94) * 10) / 10;
      const isEquine = species === 'Equinos';

      return {
        id: `w-pop-${a.practico}-${idx}-${Date.now()}`,
        arete: a.practico,
        categoria: a.categoria || 'General',
        lote: a.lote || 'General',
        pesoAnterior: prevWeight,
        pesoActual: expectedP,
        diasTranscurridos: 30,
        condicion: isEquine ? 5 : (species === 'Aves de corral' ? 3.0 : 3.25),
        observaciones: `Pesaje biomasa ${species} - Lote ${a.lote || 'General'}`
      };
    });

    setWeightRows(newRows);
  };

  // 4. Camadas Porcinas: Cargar Cerdas
  const handlePopulateSwineSows = (lote = selectedSwineLote) => {
    const swineFemales = animals.filter(a => {
      const isSwine = a.especie === 'Porcinos';
      if (!isSwine || a.estatus !== 'Activo') return false;
      const isFemale = a.sexo !== 'Macho' && a.categoria !== 'Verraco';
      if (!isFemale) return false;
      if (lote && lote !== 'TODOS') {
        return a.lote === lote;
      }
      return true;
    });

    if (swineFemales.length === 0) {
      setSwineRows(INITIAL_SWINE_ROWS);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newRows: SwineLitterRowData[] = swineFemales.map((s, idx) => {
      const lnv = 11 + (idx % 4);
      const lnm = idx % 3 === 0 ? 1 : 0;
      const mom = idx % 5 === 0 ? 1 : 0;
      const total = lnv + lnm + mom;
      const pesoCam = Math.round((total * 1.38) * 10) / 10;

      return {
        id: `s-pop-${s.practico}-${idx}-${Date.now()}`,
        areteCerda: s.practico,
        salaMaternidad: `Sala Maternidad ${Math.floor(idx / 4) + 1} - Box 0${(idx % 4) + 1}`,
        fechaParto: todayStr,
        lnv: lnv,
        lnm: lnm,
        momias: mom,
        pesoTotalCamada: pesoCam,
        pezonesFuncionales: 14 + ((idx % 2) * 2),
        adopciones: idx === 1 ? '+1 adoptado' : idx === 2 ? '-1 a nodriza' : 'Sin adopción',
        observaciones: `Parto registrado cerda ${s.practico} (${s.racial || 'Landrace/Yorkshire'})`
      };
    });

    setSwineRows(newRows);
  };

  // 5. Vacunación en Bloque: Cargar Rebaño
  const handlePopulateVaccineAnimals = (species = selectedVaccineSpecies, lote = selectedVaccineLote) => {
    const speciesAnimals = animals.filter(a => {
      const isSpecies = a.especie === species || (!a.especie && species === 'Bovinos');
      if (!isSpecies || a.estatus !== 'Activo') return false;
      if (lote && lote !== 'TODOS') {
        return a.lote === lote;
      }
      return true;
    });

    if (speciesAnimals.length === 0) return;

    const plan = currentVaccinePlan;

    const newRows: VaccineRowData[] = speciesAnimals.map((a, idx) => {
      return {
        id: `v-pop-${a.practico}-${idx}-${Date.now()}`,
        codigo: a.practico,
        estadoSanitario: 'Apto para Dosis',
        dosis: plan.dosisDefault,
        loteFarmaco: plan.loteDefault,
        medicoResponsable: plan.medicoDefault,
        diasRetiroLeche: plan.retiroLecheDefault,
        diasRetiroCarne: plan.retiroCarneDefault,
        observaciones: `Biológico: ${plan.nombre} (${selectedVaccineVia}) - Lote ${a.lote || 'General'}`
      };
    });

    setVaccineRows(newRows);
  };

  // Cambiar especie lechera
  const handleSwitchDairySpecies = (sp: DairySpecies) => {
    setSelectedDairySpecies(sp);
    setSelectedLoteToPopulate('TODOS');
    handlePopulateDairyLote(sp, 'TODOS');
  };

  // Cambiar especie pesaje
  const handleSwitchWeightSpecies = (sp: EspecieAnimal) => {
    setSelectedWeightSpecies(sp);
    setSelectedLoteToPopulate('TODOS');
    handlePopulateWeightLote(sp, 'TODOS');
  };

  // Cambiar especie vacunación
  const handleSwitchVaccineSpecies = (sp: EspecieAnimal) => {
    setSelectedVaccineSpecies(sp);
    const plans = VACCINE_PLANS_BY_SPECIES[sp] || VACCINE_PLANS_BY_SPECIES['Bovinos'];
    setSelectedVaccinePlanId(plans[0].id);
    setSelectedVaccineVia(plans[0].viaDefault);
    setSelectedVaccineLote('TODOS');
  };

  // Cambiar plan biológico de vacunación
  const handleSelectVaccinePlan = (planId: string) => {
    setSelectedVaccinePlanId(planId);
    const plan = currentVaccinePlans.find(p => p.id === planId);
    if (plan) {
      setSelectedVaccineVia(plan.viaDefault);
      setVaccineRows(prev => prev.map(r => ({
        ...r,
        dosis: plan.dosisDefault,
        loteFarmaco: plan.loteDefault,
        diasRetiroLeche: plan.retiroLecheDefault,
        diasRetiroCarne: plan.retiroCarneDefault,
        medicoResponsable: plan.medicoDefault,
        observaciones: `Biológico: ${plan.nombre} (${plan.viaDefault})`
      })));
    }
  };

  // Limpiar filas vacías
  const handleCleanEmptyRows = () => {
    if (activeTab === 'leche') {
      setMilkRows(prev => prev.filter(r => r.arete.trim().length > 0));
    } else if (activeTab === 'peso') {
      setWeightRows(prev => prev.filter(r => r.arete.trim().length > 0));
    } else if (activeTab === 'postura') {
      setPoultryRows(prev => prev.filter(r => r.lote.trim().length > 0 && typeof r.avesAlojadas === 'number' && r.avesAlojadas > 0));
    } else if (activeTab === 'camadas') {
      setSwineRows(prev => prev.filter(r => r.areteCerda.trim().length > 0));
    } else if (activeTab === 'vacunacion') {
      setVaccineRows(prev => prev.filter(r => r.codigo.trim().length > 0));
    }
  };

  /* =========================================================================
   * GUARDADO EN LOTE (BATCH SAVE) PARA LOS 5 MODOS
   * ========================================================================= */
  const handleSaveBatch = () => {
    const today = new Date().toLocaleDateString('es-ES');
    const createdEvents: EventoItem[] = [];

    // 1. CONTROL LECHERO
    if (activeTab === 'leche') {
      let savedCount = 0;
      let totalSavedKg = 0;

      milkRows.forEach(r => {
        const arete = r.arete.trim().toUpperCase();
        if (!arete) return;

        const am = typeof r.pesajeAm === 'number' ? r.pesajeAm : 0;
        const pm = typeof r.pesajePm === 'number' ? r.pesajePm : 0;
        const total = am + pm;

        if (total > 0) {
          savedCount++;
          totalSavedKg += total;

          updateAnimal(arete, {
            ultimoPesajeLeche: total
          });

          createdEvents.push({
            id: `ev-milk-${arete}-${Date.now()}-${savedCount}`,
            fecha: today,
            codigoAnimal: arete,
            categoria: 'Productivos',
            tipoEvento: 'Pesajes de leche',
            vencimiento: `Próximo control lechero (${selectedDairySpecies}) en 15 días (${total.toFixed(1)} kg)`,
            tecnico: `Control Lechero Masivo (${selectedDairySpecies})`,
            observaciones: `Especie: ${selectedDairySpecies} | Lote: ${r.lote || 'General'} | AM: ${am} kg | PM: ${pm} kg | Total: ${total.toFixed(1)} kg | Grasa: ${r.grasa}% | Proteína: ${r.proteina}% | RCS: ${r.rcs}k`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${(Math.round(totalSavedKg * 10) / 10).toLocaleString()} kg`,
          average: `${(Math.round((totalSavedKg / savedCount) * 10) / 10).toFixed(1)} kg/${currentDairyMeta.animalLabel.toLowerCase()}`,
          detail: `Especie: ${selectedDairySpecies} • Grasa Promedio: ${milkStats.averageGrasa.toFixed(1)}%`
        });
      }
    } 
    // 2. CONTROL PONDERAL & BIOMASA
    else if (activeTab === 'peso') {
      let savedCount = 0;
      let totalSavedKg = 0;

      weightRows.forEach(r => {
        const arete = r.arete.trim().toUpperCase();
        if (!arete) return;

        const pAct = typeof r.pesoActual === 'number' ? r.pesoActual : 0;
        const pAnt = typeof r.pesoAnterior === 'number' ? r.pesoAnterior : 0;
        const dias = typeof r.diasTranscurridos === 'number' && r.diasTranscurridos > 0 ? r.diasTranscurridos : 30;

        if (pAct > 0) {
          savedCount++;
          totalSavedKg += pAct;

          updateAnimal(arete, {
            pesoKg: pAct
          });

          const gdp = pAnt > 0 ? Math.round(((pAct - pAnt) / dias) * 1000) : 0;
          const gdpText = pAnt > 0 ? `${gdp >= 0 ? '+' : ''}${gdp} g/día (${dias}d)` : 'Sin pesaje ant.';

          createdEvents.push({
            id: `ev-weight-${arete}-${Date.now()}-${savedCount}`,
            fecha: today,
            codigoAnimal: arete,
            categoria: 'Productivos',
            tipoEvento: 'Crecimientos',
            vencimiento: `Pesaje bimestral (${selectedWeightSpecies}) en 60 días`,
            tecnico: `Báscula Ponderal (${selectedWeightSpecies})`,
            observaciones: `Especie: ${selectedWeightSpecies} | Actual: ${pAct} kg | Anterior: ${pAnt || '-'} kg | GDP: ${gdpText} | CC: ${r.condicion} ${r.observaciones ? `| ${r.observaciones}` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${totalSavedKg.toLocaleString()} kg biomasa`,
          average: `${(Math.round((totalSavedKg / savedCount) * 10) / 10).toFixed(1)} kg/animal`,
          detail: `Especie: ${selectedWeightSpecies} • GDP Media: ${Math.round(weightStats.averageGdp)} g/día`
        });
      }
    } 
    // 3. CONTROL DE POSTURA AVÍCOLA
    else if (activeTab === 'postura') {
      let savedCount = 0;
      let totalHuevos = 0;

      poultryRows.forEach(r => {
        const lote = r.lote.trim().toUpperCase();
        if (!lote) return;

        const aves = typeof r.avesAlojadas === 'number' ? r.avesAlojadas : 0;
        const com = typeof r.huevosComerciales === 'number' ? r.huevosComerciales : 0;
        const fert = typeof r.huevosFertiles === 'number' ? r.huevosFertiles : 0;
        const rot = typeof r.huevosRotos === 'number' ? r.huevosRotos : 0;
        const sumHuevos = com + fert + rot;

        if (aves > 0 && sumHuevos > 0) {
          savedCount++;
          totalHuevos += (com + fert);
          const porcPostura = (sumHuevos / aves) * 100;

          animals.filter(a => a.lote === lote && a.especie === 'Aves de corral').forEach(bird => {
            updateAnimal(bird.practico, {
              estatusProductivo: porcPostura > 88 ? 'Postura Alta' : 'Postura Regular'
            });
          });

          createdEvents.push({
            id: `ev-postura-${lote}-${Date.now()}-${savedCount}`,
            fecha: today,
            codigoAnimal: lote,
            categoria: 'Productivos',
            tipoEvento: 'Control de Postura',
            vencimiento: `Recolección diaria programada (% Postura: ${porcPostura.toFixed(1)}%)`,
            tecnico: 'Control Avícola Masivo',
            observaciones: `Galpón: ${lote} | Tipo: ${r.tipoAve} | Aves: ${aves.toLocaleString()} | Comerciales: ${com.toLocaleString()} | Fértiles: ${fert.toLocaleString()} | Rotos: ${rot} | Postura: ${porcPostura.toFixed(1)}% | Peso Prom: ${r.pesoPromedioHuevo || 62} g ${r.observaciones ? `| ${r.observaciones}` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${totalHuevos.toLocaleString()} huevos recolectados`,
          average: `${poultryStats.porcentajePostura.toFixed(1)}% postura ponderada`,
          detail: `Merma por rotos: ${poultryStats.mermaPorc.toFixed(1)}%`
        });
      }
    }
    // 4. REGISTRO DE CAMADAS PORCINAS
    else if (activeTab === 'camadas') {
      let savedCount = 0;
      let totalLnvSaved = 0;

      swineRows.forEach(r => {
        const arete = r.areteCerda.trim().toUpperCase();
        if (!arete) return;

        const lnv = typeof r.lnv === 'number' ? r.lnv : 0;
        const lnm = typeof r.lnm === 'number' ? r.lnm : 0;
        const mom = typeof r.momias === 'number' ? r.momias : 0;
        const total = lnv + lnm + mom;
        const pesoCam = typeof r.pesoTotalCamada === 'number' ? r.pesoTotalCamada : 0;
        const pesoMed = total > 0 && pesoCam > 0 ? (pesoCam / total) : (lnv > 0 && pesoCam > 0 ? pesoCam / lnv : 1.38);

        if (total > 0) {
          savedCount++;
          totalLnvSaved += lnv;

          const matchAnimal = animalsByTag.get(arete);
          updateAnimal(arete, {
            partos: (matchAnimal?.partos || 0) + 1,
            ultimoParto: r.fechaParto || today,
            estatusProductivo: 'Lactando',
            estatusReproductivo: 'Recién Parida'
          });

          createdEvents.push({
            id: `ev-camada-${arete}-${Date.now()}-${savedCount}`,
            fecha: r.fechaParto || today,
            codigoAnimal: arete,
            categoria: 'Reproductivos',
            tipoEvento: 'Partos',
            vencimiento: `Destete programado de camada en 21-28 días (${lnv} lechones vivos)`,
            tecnico: 'Maternidad Porcina Especializada',
            observaciones: `Parto Porcino | Sala: ${r.salaMaternidad} | LNV: ${lnv} | LNM: ${lnm} | Momias: ${mom} | Total: ${total} | Peso Camada: ${pesoCam || '-'} kg | Peso Prom/Lechón: ${pesoMed.toFixed(2)} kg | Pezones: ${r.pezonesFuncionales} | Adopción: ${r.adopciones} ${r.observaciones ? `| ${r.observaciones}` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${totalLnvSaved} lechones nacidos vivos (LNV)`,
          average: `${(totalLnvSaved / savedCount).toFixed(1)} lechones/cerda`,
          detail: `Peso Medio al Nacer: ${swineStats.pesoMedioNacer.toFixed(2)} kg`
        });
      }
    }
    // 5. VACUNACIÓN & DESPARASITACIÓN EN BLOQUE
    else if (activeTab === 'vacunacion') {
      let savedCount = 0;
      let withdrawalLocks = 0;

      vaccineRows.forEach(r => {
        const codigo = r.codigo.trim().toUpperCase();
        if (!codigo) return;

        const dLeche = typeof r.diasRetiroLeche === 'number' ? r.diasRetiroLeche : 0;
        const dCarne = typeof r.diasRetiroCarne === 'number' ? r.diasRetiroCarne : 0;
        const maxRetiro = Math.max(dLeche, dCarne);

        savedCount++;

        if (maxRetiro > 0) {
          withdrawalLocks++;
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + maxRetiro);
          const futureStr = futureDate.toLocaleDateString('es-ES');

          updateAnimal(codigo, {
            alertaSanitaria: `Retiro farmacológico activo (${currentVaccinePlan.nombre}) hasta ${futureStr}`,
            retiroLecheHasta: dLeche > 0 ? futureStr : undefined,
            retiroCarneHasta: dCarne > 0 ? futureStr : undefined
          });
        }

        createdEvents.push({
          id: `ev-vac-${codigo}-${Date.now()}-${savedCount}`,
          fecha: today,
          codigoAnimal: codigo,
          categoria: 'Veterinarios',
          tipoEvento: 'Planes sanitarios',
          vencimiento: maxRetiro > 0 ? `Fin de retiro farmacológico (${maxRetiro} días)` : `Refuerzo sanitario (${selectedVaccineSpecies}) en 6 meses`,
          tecnico: r.medicoResponsable || currentVaccinePlan.medicoDefault,
          observaciones: `Especie: ${selectedVaccineSpecies} | Biológico: ${currentVaccinePlan.nombre} | Dosis: ${r.dosis} | Vía: ${selectedVaccineVia} | Lote Fármaco: ${r.loteFarmaco} | Estado: ${r.estadoSanitario} | Retiro Leche: ${dLeche}d | Retiro Carne: ${dCarne}d ${r.observaciones ? `| ${r.observaciones}` : ''}`
        });
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${savedCount} animales dosificados (${selectedVaccineSpecies})`,
          average: `${vaccineStats.herdCoveragePorc}% cobertura estimada`,
          detail: `Biológico: ${currentVaccinePlan.nombre} • ${withdrawalLocks} con bloqueo de inocuidad activo`
        });
      }
    }
  };

  return (
    <div className="spreadsheet-container">
      {/* =====================================================================
          LIVE KPIS HEADER (DIFERENCIADO POR CADA UNO DE LOS 5 MODOS)
          ===================================================================== */}
      <div className="spreadsheet-kpi-bar">
        {/* MODO 1: LECHE */}
        {activeTab === 'leche' && (
          <>
            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#095431' }}>
                <Users size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Hembras en Control</span>
                <span className="spreadsheet-kpi-value">{milkStats.countedAnimals}</span>
                <span className="spreadsheet-kpi-sub">
                  {milkRows.length} filas • {selectedDairySpecies}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Milk size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Producción Diaria Total</span>
                <span className="spreadsheet-kpi-value">{milkStats.totalKg.toFixed(1)} L</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#2563eb' }}>
                  AM + PM jornada en curso
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
                <TrendingUp size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Promedio por {currentDairyMeta.animalLabel}</span>
                <span className="spreadsheet-kpi-value">{milkStats.averageKg.toFixed(1)} L</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#db2777' }}>
                  Estándar {selectedDairySpecies}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: milkStats.rcsAlerts > 0 ? '#fffbeb' : '#f0fdf4', color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                <AlertTriangle size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Grasa Media & RCS</span>
                <span className="spreadsheet-kpi-value" style={{ color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                  {milkStats.averageGrasa.toFixed(1)}% G • {milkStats.rcsAlerts} Alertas
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                  {milkStats.rcsAlerts > 0 ? 'RCS > 200k (Mastitis Subclínica)' : 'Sanidad de ubre óptima'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* MODO 2: PESAJE PONDERAL & BIOMASA */}
        {activeTab === 'peso' && (
          <>
            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#095431' }}>
                <Users size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Animales Pesados</span>
                <span className="spreadsheet-kpi-value">{weightStats.countedAnimals}</span>
                <span className="spreadsheet-kpi-sub">
                  {weightRows.length} registros • {selectedWeightSpecies}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Scale size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Peso Promedio Actual</span>
                <span className="spreadsheet-kpi-value">{weightStats.averageKg.toFixed(1)} kg</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#2563eb' }}>
                  Biomasa: {weightStats.totalKg.toLocaleString()} kg
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <TrendingUp size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">GDP Promedio de Lote</span>
                <span className="spreadsheet-kpi-value">
                  {weightStats.averageGdp >= 0 ? `+${Math.round(weightStats.averageGdp)}` : Math.round(weightStats.averageGdp)} g/día
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#059669' }}>
                  Ganancia diaria de peso
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <CheckCircle2 size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Eficiencia de Crecimiento</span>
                <span className="spreadsheet-kpi-value">{Math.round(weightStats.growthEfficiencyPorc)}%</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#16a34a' }}>
                  Ejemplares con balance positivo
                </span>
              </div>
            </div>
          </>
        )}

        {/* MODO 3: POSTURA AVÍCOLA */}
        {activeTab === 'postura' && (
          <>
            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <Layers size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Galpones Activos</span>
                <span className="spreadsheet-kpi-value">{poultryStats.countedGalpones}</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#d97706' }}>
                  {poultryStats.totalAves.toLocaleString()} aves alojadas
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <span style={{ fontSize: 22 }}>🥚</span>
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Total Huevos Recolectados</span>
                <span className="spreadsheet-kpi-value">
                  {poultryStats.totalHuevos.toLocaleString()} uds
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#059669' }}>
                  {poultryStats.totalHuevosComerciales.toLocaleString()} comerciales • {poultryStats.totalHuevosFertiles.toLocaleString()} fértiles
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <TrendingUp size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">% Postura Ponderado</span>
                <span className="spreadsheet-kpi-value">
                  {poultryStats.porcentajePostura.toFixed(1)}%
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#2563eb' }}>
                  {poultryStats.porcentajePostura >= 90 ? 'Pico de producción óptimo' : 'Producción estabilizada'}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: poultryStats.mermaPorc > 2.5 ? '#fff1f2' : '#f0fdf4', color: poultryStats.mermaPorc > 2.5 ? '#e11d48' : '#16a34a' }}>
                <AlertTriangle size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Merma por Rotos</span>
                <span className="spreadsheet-kpi-value" style={{ color: poultryStats.mermaPorc > 2.5 ? '#e11d48' : '#16a34a' }}>
                  {poultryStats.totalHuevosRotos} uds ({poultryStats.mermaPorc.toFixed(1)}%)
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: poultryStats.mermaPorc > 2.5 ? '#e11d48' : '#16a34a' }}>
                  {poultryStats.mermaPorc > 2.5 ? 'Merma elevada: calibrar nidos' : 'Dentro de tolerancia zootécnica'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* MODO 4: CAMADAS PORCINAS */}
        {activeTab === 'camadas' && (
          <>
            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
                <Baby size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Cerdas Paridas</span>
                <span className="spreadsheet-kpi-value">{swineStats.countedSows}</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#db2777' }}>
                  En sala de maternidad
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <span style={{ fontSize: 22 }}>🐷</span>
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Total LNV Acumulados</span>
                <span className="spreadsheet-kpi-value">{swineStats.totalLnv} lechones</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#059669' }}>
                  Nacidos vivos viables
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <TrendingUp size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Promedio Lechones/Cerda</span>
                <span className="spreadsheet-kpi-value">
                  {swineStats.promLechonesPorCerda.toFixed(1)} LNV
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#2563eb' }}>
                  {swineStats.promLechonesPorCerda >= 12 ? 'Meta de prolificidad superada' : 'Prolificidad en rango'}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <Scale size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Peso Medio al Nacer</span>
                <span className="spreadsheet-kpi-value">{swineStats.pesoMedioNacer.toFixed(2)} kg</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#16a34a' }}>
                  {swineStats.totalLnm > 0 ? `${swineStats.totalLnm} mortinatos • ${swineStats.totalMomias} momias` : 'Sin mortinatos'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* MODO 5: VACUNACIÓN & DESPARASITACIÓN */}
        {activeTab === 'vacunacion' && (
          <>
            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#095431' }}>
                <Syringe size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Dosis Aplicadas</span>
                <span className="spreadsheet-kpi-value">{vaccineStats.appliedCount}</span>
                <span className="spreadsheet-kpi-sub">
                  {selectedVaccineSpecies} en planilla
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <CheckCircle2 size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Cobertura de Especie</span>
                <span className="spreadsheet-kpi-value">{vaccineStats.herdCoveragePorc}%</span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#2563eb' }}>
                  De {vaccineStats.totalSpeciesAnimals} animales activos
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: vaccineStats.activeWithdrawalAlerts > 0 ? '#fff1f2' : '#f0fdf4', color: vaccineStats.activeWithdrawalAlerts > 0 ? '#b91c1c' : '#16a34a' }}>
                {vaccineStats.activeWithdrawalAlerts > 0 ? <ShieldAlert size={22} /> : <ShieldCheck size={22} />}
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Alertas de Retiro Activas</span>
                <span className="spreadsheet-kpi-value" style={{ color: vaccineStats.activeWithdrawalAlerts > 0 ? '#b91c1c' : '#16a34a' }}>
                  {vaccineStats.activeWithdrawalAlerts} Alertas
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: vaccineStats.activeWithdrawalAlerts > 0 ? '#b91c1c' : '#16a34a' }}>
                  {vaccineStats.activeWithdrawalAlerts > 0 ? 'Bloqueo preventivo de inocuidad' : 'Sin tiempo de retiro en leche/carne'}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#fdf4ff', color: '#9333ea' }}>
                <Layers size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Plan Biológico Activo</span>
                <span className="spreadsheet-kpi-value" style={{ fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentVaccinePlan.nombre.split('(')[0]}
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#9333ea' }}>
                  Vía: {selectedVaccineVia} • Lote: {currentVaccinePlan.loteDefault}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =====================================================================
          MAIN 5-MODE SELECTOR & OPERATIONS TOOLBAR
          ===================================================================== */}
      <div className="spreadsheet-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
        {/* 5 High-Speed Mode Selector Tabs */}
        <div className="spreadsheet-tabs">
          <button
            type="button"
            className={`spreadsheet-tab-btn ${activeTab === 'leche' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('leche');
              setSelectedLoteToPopulate('TODOS');
            }}
          >
            <Milk size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            <span>1. Control Lechero (🥛)</span>
          </button>
          <button
            type="button"
            className={`spreadsheet-tab-btn ${activeTab === 'peso' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('peso');
              setSelectedLoteToPopulate('TODOS');
            }}
          >
            <Scale size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            <span>2. Pesaje & Biomasa (⚖️)</span>
          </button>
          <button
            type="button"
            className={`spreadsheet-tab-btn ${activeTab === 'postura' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('postura');
              setSelectedLoteToPopulate('TODOS');
            }}
          >
            <span style={{ marginRight: 6, fontSize: 14 }}>🥚</span>
            <span>3. Postura Avícola</span>
          </button>
          <button
            type="button"
            className={`spreadsheet-tab-btn ${activeTab === 'camadas' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('camadas');
              setSelectedSwineLote('TODOS');
            }}
          >
            <span style={{ marginRight: 6, fontSize: 14 }}>🐷</span>
            <span>4. Camadas Porcinas</span>
          </button>
          <button
            type="button"
            className={`spreadsheet-tab-btn ${activeTab === 'vacunacion' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('vacunacion');
              setSelectedVaccineLote('TODOS');
            }}
          >
            <Syringe size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            <span>5. Vacunación en Bloque (💉)</span>
          </button>
        </div>

        {/* Batch Actions Group */}
        <div className="spreadsheet-actions-group" style={{ flexWrap: 'wrap', gap: 8 }}>
          {/* Lote Selector & Populate for Leche, Peso, Camadas, Vacunacion */}
          {(activeTab === 'leche' || activeTab === 'peso' || activeTab === 'camadas' || activeTab === 'vacunacion') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Lote:</span>
              <select
                className="form-select"
                value={activeTab === 'camadas' ? selectedSwineLote : activeTab === 'vacunacion' ? selectedVaccineLote : selectedLoteToPopulate}
                onChange={e => {
                  const val = e.target.value;
                  if (activeTab === 'camadas') setSelectedSwineLote(val);
                  else if (activeTab === 'vacunacion') setSelectedVaccineLote(val);
                  else setSelectedLoteToPopulate(val);
                }}
                style={{ height: 32, fontSize: 12, padding: '2px 8px' }}
              >
                <option value="TODOS">
                  {activeTab === 'camadas' ? 'Todas las salas maternidad' : activeTab === 'vacunacion' ? `Todos los lotes (${selectedVaccineSpecies})` : `Todos los lotes (${activeTab === 'leche' ? selectedDairySpecies : selectedWeightSpecies})`}
                </option>
                {availableLotes.map(l => (
                  <option key={l} value={l}>Lote {l}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (activeTab === 'leche') {
                    handlePopulateDairyLote(selectedDairySpecies, selectedLoteToPopulate);
                  } else if (activeTab === 'peso') {
                    handlePopulateWeightLote(selectedWeightSpecies, selectedLoteToPopulate);
                  } else if (activeTab === 'camadas') {
                    handlePopulateSwineSows(selectedSwineLote);
                  } else if (activeTab === 'vacunacion') {
                    handlePopulateVaccineAnimals(selectedVaccineSpecies, selectedVaccineLote);
                  }
                }}
                title="Cargar automáticamente los ejemplares filtrados"
                style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, fontSize: 12, padding: '0 10px' }}
              >
                <Sparkles size={14} color="#2d6a4f" />
                <span>Cargar Lote</span>
              </button>
            </div>
          )}

          {activeTab === 'postura' && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setPoultryRows(INITIAL_POULTRY_ROWS)}
              title="Cargar galpones avícolas configurados"
              style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, fontSize: 12, padding: '0 10px' }}
            >
              <Sparkles size={14} color="#2d6a4f" />
              <span>Precargar Galpones</span>
            </button>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={handleCleanEmptyRows}
            title="Eliminar filas vacías"
            style={{ height: 32, fontSize: 12, padding: '0 10px' }}
          >
            Limpiar Vacías
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={
              activeTab === 'leche' ? addMilkRow : 
              activeTab === 'peso' ? addWeightRow : 
              activeTab === 'postura' ? addPoultryRow : 
              activeTab === 'camadas' ? addSwineRow : 
              addVaccineRow
            }
            style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, fontSize: 12, padding: '0 12px' }}
          >
            <Plus size={15} />
            <span>
              {activeTab === 'postura' ? 'Agregar Galpón' : 
               activeTab === 'camadas' ? 'Agregar Camada' : 
               activeTab === 'vacunacion' ? 'Agregar Dosis' : 
               'Agregar Fila'}
            </span>
          </button>

          {/* Botón Guardar en Lote */}
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveBatch}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, fontSize: 12, padding: '0 16px' }}
          >
            <Save size={15} />
            <span>
              {activeTab === 'leche' 
                ? `Guardar ${milkStats.countedAnimals} Pesajes Lecheros` 
                : activeTab === 'peso' 
                ? `Guardar ${weightStats.countedAnimals} Pesajes Ponderales` 
                : activeTab === 'postura'
                ? `Guardar Postura (${poultryStats.countedGalpones} Galpones)`
                : activeTab === 'camadas'
                ? `Guardar ${swineStats.countedSows} Camadas Porcinas`
                : `Guardar ${vaccineStats.appliedCount} Dosis Sanitarias`}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SUB-HEADER CONTROLS & CONTEXTUAL FILTERS FOR ACTIVE MODE
          ===================================================================== */}
      
      {/* Sub-header Modo 1: Control Lechero */}
      {activeTab === 'leche' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
              Especie Lechera:
            </span>
            <div className="species-filter-nav">
              {DAIRY_SPECIES_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`species-filter-pill ${selectedDairySpecies === opt.id ? 'active' : ''}`}
                  onClick={() => handleSwitchDairySpecies(opt.id)}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            ℹ️ "Cargar Lote" extrae automáticamente las <strong>hembras en lactación/ordeño</strong> de {selectedDairySpecies}.
          </span>
        </div>
      )}

      {/* Sub-header Modo 2: Control Ponderal */}
      {activeTab === 'peso' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
              Filtrar por Especie:
            </span>
            <div className="species-filter-nav">
              {WEIGHT_SPECIES_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`species-filter-pill ${selectedWeightSpecies === opt.id ? 'active' : ''}`}
                  onClick={() => handleSwitchWeightSpecies(opt.id)}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="species-weight-hint">
            <span>🎯 <strong>Peso de Referencia:</strong> {currentWeightMeta.expectedRange}</span>
          </div>
        </div>
      )}

      {/* Sub-header Modo 4: Camadas Porcinas */}
      {activeTab === 'camadas' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
              🐷 Maternidad & Camadas:
            </span>
            <span style={{ fontSize: 12, color: '#475569' }}>
              Cálculo de LNV, mortinatos, momias, peso de camada y promedio individual por lechón al nacimiento.
            </span>
          </div>
          <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>
            🎯 Estándar Zootécnico: &ge; 12.0 LNV / cerda • Peso &ge; 1.35 kg/lechón
          </span>
        </div>
      )}

      {/* Sub-header Modo 5: Vacunación en Bloque */}
      {activeTab === 'vacunacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                Especie Pecuaria:
              </span>
              <div className="species-filter-nav">
                {WEIGHT_SPECIES_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`species-filter-pill ${selectedVaccineSpecies === opt.id ? 'active' : ''}`}
                    onClick={() => handleSwitchVaccineSpecies(opt.id)}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Plan / Biológico:</span>
                <select
                  className="form-select"
                  value={selectedVaccinePlanId}
                  onChange={e => handleSelectVaccinePlan(e.target.value)}
                  style={{ height: 32, fontSize: 12, maxWidth: 220 }}
                >
                  {currentVaccinePlans.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Vía:</span>
                <select
                  className="form-select"
                  value={selectedVaccineVia}
                  onChange={e => {
                    const via = e.target.value;
                    setSelectedVaccineVia(via);
                    setVaccineRows(prev => prev.map(r => ({
                      ...r,
                      observaciones: `Biológico: ${currentVaccinePlan.nombre} (${via})`
                    })));
                  }}
                  style={{ height: 32, fontSize: 12 }}
                >
                  {VIAS_APLICACION.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner de Notificación de Guardado Exitoso */}
      {batchSaveResult && (
        <div className="withdrawal-warning-banner" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <div style={{ flex: 1 }}>
            <strong>¡Lote guardado con éxito!</strong> Se registraron {batchSaveResult.count} eventos en el ledger zootécnico.
            <span style={{ marginLeft: 8, fontSize: 12, color: '#15803d' }}>
              (Total: {batchSaveResult.total} | Promedio: {batchSaveResult.average} {batchSaveResult.detail ? `• ${batchSaveResult.detail}` : ''})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBatchSaveResult(null)}
            style={{ color: '#15803d', fontWeight: 700, fontSize: 14 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* =====================================================================
          SPREADSHEET GRID TABLES (LOS 5 MODOS COMPLETOS)
          ===================================================================== */}
      <div className="spreadsheet-table-wrapper">
        
        {/* TAB 1: CONTROL LECHERO MASIVO */}
        {activeTab === 'leche' && (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 130 }}>Arete</th>
                <th style={{ width: 180 }}>Animal / Nombre</th>
                <th style={{ width: 110 }}>Lote / Potrero</th>
                <th style={{ width: 105, textAlign: 'right' }}>Pesaje AM (kg)</th>
                <th style={{ width: 105, textAlign: 'right' }}>Pesaje PM (kg)</th>
                <th style={{ width: 110, textAlign: 'right' }}>Total Día (kg)</th>
                <th style={{ width: 95, textAlign: 'right' }}>Grasa (%)</th>
                <th style={{ width: 95, textAlign: 'right' }}>Proteína (%)</th>
                <th style={{ width: 105, textAlign: 'right' }}>RCS (x10³)</th>
                <th style={{ width: 140 }}>Diagnóstico Calidad</th>
                <th style={{ width: 45, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {milkRows.map((row, idx) => {
                const areteClean = row.arete.trim().toUpperCase();
                const animal = animalsByTag.get(areteClean);
                const am = typeof row.pesajeAm === 'number' ? row.pesajeAm : 0;
                const pm = typeof row.pesajePm === 'number' ? row.pesajePm : 0;
                const totalDia = am + pm;
                const hasRcsAlert = typeof row.rcs === 'number' && row.rcs > 200;
                const isClinical = typeof row.rcs === 'number' && row.rcs > 400;

                // Diagnóstico de calidad de leche
                let calidadDiag = '✓ Estándar';
                let calidadClass = 'valid';
                if (isClinical) {
                  calidadDiag = '🔴 Mastitis Clínica';
                  calidadClass = 'danger';
                } else if (hasRcsAlert) {
                  calidadDiag = '⚠️ Subclínica';
                  calidadClass = 'warning';
                } else if (typeof row.grasa === 'number' && row.grasa >= (selectedDairySpecies === 'Búfalos' ? 7.5 : selectedDairySpecies === 'Caprinos' ? 4.0 : 3.7)) {
                  calidadDiag = selectedDairySpecies === 'Búfalos' ? '✓ Mozzarella Élite' : '✓ Calidad Élite A';
                  calidadClass = 'valid';
                }

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-0`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder={selectedDairySpecies === 'Búfalos' ? 'ej. BUF-01' : selectedDairySpecies === 'Caprinos' ? 'ej. CAP-CL01' : 'ej. 0001'}
                        value={row.arete}
                        onChange={e => {
                          const val = e.target.value;
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, arete: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 0, milkRows.length, idx === milkRows.length - 1)}
                        style={{ fontWeight: 600, textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      {animal ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: 12, color: '#1e293b' }}>
                            {currentDairyMeta.icon} {animal.categoria} • {animal.practico}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                            {animal.composicion || animal.racial || 'Raza Pura'}
                          </span>
                        </div>
                      ) : areteClean ? (
                        <span style={{ fontSize: 11, color: '#ef4444' }}>No registrado</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-1`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Lote 01"
                        value={row.lote || (animal?.lote || '')}
                        onChange={e => {
                          const val = e.target.value;
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, lote: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 1, milkRows.length, idx === milkRows.length - 1)}
                        style={{ fontSize: 12 }}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-2`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="0.0"
                        value={row.pesajeAm}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, pesajeAm: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 2, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-3`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="0.0"
                        value={row.pesajePm}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, pesajePm: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 3, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <span className="spreadsheet-cell-computed">
                        {totalDia > 0 ? totalDia.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-4`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="3.8"
                        value={row.grasa}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, grasa: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 4, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-5`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="3.2"
                        value={row.proteina}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, proteina: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 5, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-6`}
                        type="number"
                        step="10"
                        className={`spreadsheet-input num ${hasRcsAlert ? 'text-amber-600 font-bold' : ''}`}
                        placeholder="140"
                        value={row.rcs}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, rcs: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 6, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <span className={`badge-status-pill ${calidadClass}`}>
                        {calidadDiag}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setMilkRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ color: '#94a3b8', padding: 4 }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* TAB 2: PESAJE PONDERAL & BIOMASA */}
        {activeTab === 'peso' && (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 130 }}>Arete / Código</th>
                <th style={{ width: 160 }}>Categoría</th>
                <th style={{ width: 110 }}>Lote / Instalación</th>
                <th style={{ width: 105, textAlign: 'right' }}>Peso Ant. (kg)</th>
                <th style={{ width: 105, textAlign: 'right' }}>Peso Act. (kg)</th>
                <th style={{ width: 85, textAlign: 'right' }}>Días</th>
                <th style={{ width: 120, textAlign: 'right' }}>GDP (g/día)</th>
                <th style={{ width: 140 }}>Condición Corporal</th>
                <th style={{ width: 190 }}>Observaciones</th>
                <th style={{ width: 90 }}>Estado</th>
                <th style={{ width: 45, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {weightRows.map((row, idx) => {
                const areteClean = row.arete.trim().toUpperCase();
                const animal = animalsByTag.get(areteClean);
                const pAct = typeof row.pesoActual === 'number' ? row.pesoActual : 0;
                const pAnt = typeof row.pesoAnterior === 'number' ? row.pesoAnterior : 0;
                const dias = typeof row.diasTranscurridos === 'number' && row.diasTranscurridos > 0 ? row.diasTranscurridos : 30;
                const gdp = pAnt > 0 && pAct > 0 ? Math.round(((pAct - pAnt) / dias) * 1000) : null;
                const isEquine = selectedWeightSpecies === 'Equinos';

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-0`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="ej. BCA01"
                        value={row.arete}
                        onChange={e => {
                          const val = e.target.value;
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, arete: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 0, weightRows.length, idx === weightRows.length - 1)}
                        style={{ fontWeight: 600, textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: 12, color: '#1e293b' }}>
                        {animal?.categoria || row.categoria || 'General'}
                      </span>
                      {animal?.composicion && (
                        <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>
                          {animal.composicion}
                        </span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-1`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Potrero 1"
                        value={row.lote || (animal?.lote || '')}
                        onChange={e => {
                          const val = e.target.value;
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, lote: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 1, weightRows.length, idx === weightRows.length - 1)}
                        style={{ fontSize: 12 }}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-2`}
                        type="number"
                        step={selectedWeightSpecies === 'Aves de corral' ? '0.05' : '0.5'}
                        className="spreadsheet-input num"
                        placeholder="kg ant."
                        value={row.pesoAnterior}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, pesoAnterior: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 2, weightRows.length, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-3`}
                        type="number"
                        step={selectedWeightSpecies === 'Aves de corral' ? '0.05' : '0.5'}
                        className="spreadsheet-input num"
                        placeholder="kg act."
                        value={row.pesoActual}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, pesoActual: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 3, weightRows.length, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-4`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num"
                        placeholder="30"
                        value={row.diasTranscurridos}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, diasTranscurridos: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 4, weightRows.length, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {gdp !== null ? (
                        <span className={`postura-computed-pill ${gdp >= 500 ? 'high' : gdp >= 0 ? 'medium' : 'low'}`}>
                          {gdp >= 0 ? `+${gdp}` : gdp} g/d
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="spreadsheet-input"
                        value={row.condicion}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, condicion: val } : r));
                        }}
                        style={{ height: 32, fontSize: 11 }}
                      >
                        {isEquine 
                          ? CONDICION_HENNEKE_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))
                          : CONDICION_STANDARD_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))
                        }
                      </select>
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-5`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Notas zootécnicas..."
                        value={row.observaciones}
                        onChange={e => {
                          const val = e.target.value;
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, observaciones: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 5, weightRows.length, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td>
                      {pAct > 0 ? (
                        <span className="badge-status-pill valid">✓ Pesado</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Pendiente</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setWeightRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ color: '#94a3b8', padding: 4 }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* TAB 3: CONTROL DE POSTURA AVÍCOLA */}
        {activeTab === 'postura' && (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 120 }}>Lote / Galpón</th>
                <th style={{ width: 130 }}>Tipo de Ave</th>
                <th style={{ width: 110, textAlign: 'right' }}>Aves Alojadas</th>
                <th style={{ width: 120, textAlign: 'right' }}>Huevos Com.</th>
                <th style={{ width: 110, textAlign: 'right' }}>Fértiles</th>
                <th style={{ width: 110, textAlign: 'right' }}>Rotos / Desc.</th>
                <th style={{ width: 120, textAlign: 'right' }}>% Postura</th>
                <th style={{ width: 110, textAlign: 'right' }}>Peso Huevo (g)</th>
                <th style={{ width: 130 }}>Estado de Calidad</th>
                <th style={{ width: 180 }}>Observaciones</th>
                <th style={{ width: 45, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {poultryRows.map((row, idx) => {
                const aves = typeof row.avesAlojadas === 'number' ? row.avesAlojadas : 0;
                const com = typeof row.huevosComerciales === 'number' ? row.huevosComerciales : 0;
                const fert = typeof row.huevosFertiles === 'number' ? row.huevosFertiles : 0;
                const rot = typeof row.huevosRotos === 'number' ? row.huevosRotos : 0;
                const totalH = com + fert + rot;
                const pct = aves > 0 ? (totalH / aves) * 100 : 0;
                const merma = totalH > 0 ? (rot / totalH) * 100 : 0;

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-0`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="GALP-01"
                        value={row.lote}
                        onChange={e => {
                          const val = e.target.value;
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, lote: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 0, poultryRows.length, idx === poultryRows.length - 1)}
                        style={{ fontWeight: 700, textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      <select
                        className="spreadsheet-input"
                        value={row.tipoAve}
                        onChange={e => {
                          const val = e.target.value as PoultryRowData['tipoAve'];
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, tipoAve: val } : r));
                        }}
                        style={{ height: 32, fontSize: 12 }}
                      >
                        <option value="Ponedoras">Ponedoras</option>
                        <option value="Reproductoras">Reproductoras</option>
                        <option value="Patas">Patas</option>
                        <option value="Pavas">Pavas</option>
                        <option value="Gallinas Finas">Gallinas Finas</option>
                      </select>
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-1`}
                        type="number"
                        step="10"
                        className="spreadsheet-input num"
                        placeholder="2500"
                        value={row.avesAlojadas}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, avesAlojadas: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 1, poultryRows.length, idx === poultryRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-2`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num"
                        placeholder="2350"
                        value={row.huevosComerciales}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, huevosComerciales: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 2, poultryRows.length, idx === poultryRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-3`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num"
                        placeholder="0"
                        value={row.huevosFertiles}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, huevosFertiles: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 3, poultryRows.length, idx === poultryRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-4`}
                        type="number"
                        step="1"
                        className={`spreadsheet-input num ${merma > 2.5 ? 'text-amber-600 font-bold' : ''}`}
                        placeholder="35"
                        value={row.huevosRotos}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, huevosRotos: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 4, poultryRows.length, idx === poultryRows.length - 1)}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {pct > 0 ? (
                        <span className={`postura-computed-pill ${pct >= 90 ? 'high' : pct >= 80 ? 'medium' : 'low'}`}>
                          {pct.toFixed(1)}%
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-5`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="62.5"
                        value={row.pesoPromedioHuevo}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, pesoPromedioHuevo: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 5, poultryRows.length, idx === poultryRows.length - 1)}
                      />
                    </td>
                    <td>
                      {pct >= 90 ? (
                        <span className="badge-status-pill valid">✓ Alta Postura AAA</span>
                      ) : pct >= 80 ? (
                        <span className="badge-status-pill valid" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                          Postura Media AA
                        </span>
                      ) : pct > 0 ? (
                        <span className="badge-status-pill warning">⚠️ Revisar Lote</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Pendiente</span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-6`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Notas zootécnicas..."
                        value={row.observaciones}
                        onChange={e => {
                          const val = e.target.value;
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, observaciones: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 6, poultryRows.length, idx === poultryRows.length - 1)}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setPoultryRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ color: '#94a3b8', padding: 4 }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* TAB 4: REGISTRO RÁPIDO DE CAMADAS PORCINAS */}
        {activeTab === 'camadas' && (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 130 }}>Arete Cerda</th>
                <th style={{ width: 160 }}>Sala / Paritoria</th>
                <th style={{ width: 120 }}>Fecha Parto</th>
                <th style={{ width: 90, textAlign: 'right' }}>LNV (Vivos)</th>
                <th style={{ width: 90, textAlign: 'right' }}>LNM (Muertos)</th>
                <th style={{ width: 85, textAlign: 'right' }}>Momias</th>
                <th style={{ width: 105, textAlign: 'right' }}>Total Camada</th>
                <th style={{ width: 110, textAlign: 'right' }}>Peso Total (kg)</th>
                <th style={{ width: 115, textAlign: 'right' }}>Peso Prom/L. (kg)</th>
                <th style={{ width: 95, textAlign: 'right' }}>Pezones</th>
                <th style={{ width: 150 }}>Nodrizas / Adopción</th>
                <th style={{ width: 120 }}>Estado</th>
                <th style={{ width: 45, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {swineRows.map((row, idx) => {
                const areteClean = row.areteCerda.trim().toUpperCase();
                const animal = animalsByTag.get(areteClean);
                const lnv = typeof row.lnv === 'number' ? row.lnv : 0;
                const lnm = typeof row.lnm === 'number' ? row.lnm : 0;
                const mom = typeof row.momias === 'number' ? row.momias : 0;
                const totalCamada = lnv + lnm + mom;
                const pesoCam = typeof row.pesoTotalCamada === 'number' ? row.pesoTotalCamada : 0;
                const pesoMed = totalCamada > 0 && pesoCam > 0 ? (pesoCam / totalCamada) : (lnv > 0 && pesoCam > 0 ? (pesoCam / lnv) : 0);

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-0`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="ej. POR-CR01"
                        value={row.areteCerda}
                        onChange={e => {
                          const val = e.target.value;
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, areteCerda: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 0, swineRows.length, idx === swineRows.length - 1)}
                        style={{ fontWeight: 700, textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-1`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Sala M1 - Box 02"
                        value={row.salaMaternidad}
                        onChange={e => {
                          const val = e.target.value;
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, salaMaternidad: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 1, swineRows.length, idx === swineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-2`}
                        type="date"
                        className="spreadsheet-input"
                        value={row.fechaParto}
                        onChange={e => {
                          const val = e.target.value;
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, fechaParto: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 2, swineRows.length, idx === swineRows.length - 1)}
                        style={{ fontSize: 11 }}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-3`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num font-bold text-emerald-700"
                        placeholder="12"
                        value={row.lnv}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, lnv: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 3, swineRows.length, idx === swineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-4`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num"
                        placeholder="0"
                        value={row.lnm}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, lnm: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 4, swineRows.length, idx === swineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-5`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num"
                        placeholder="0"
                        value={row.momias}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, momias: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 5, swineRows.length, idx === swineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <span className="spreadsheet-cell-computed">
                        {totalCamada > 0 ? `${totalCamada} lech.` : '-'}
                      </span>
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-6`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="16.5"
                        value={row.pesoTotalCamada}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, pesoTotalCamada: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 6, swineRows.length, idx === swineRows.length - 1)}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="spreadsheet-cell-computed">
                        {pesoMed > 0 ? `${pesoMed.toFixed(2)} kg` : '-'}
                      </span>
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-7`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num"
                        placeholder="14"
                        value={row.pezonesFuncionales}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, pezonesFuncionales: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 7, swineRows.length, idx === swineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-camadas-${idx}-8`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Sin adopción"
                        value={row.adopciones}
                        onChange={e => {
                          const val = e.target.value;
                          setSwineRows(prev => prev.map(r => r.id === row.id ? { ...r, adopciones: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'camadas', idx, 8, swineRows.length, idx === swineRows.length - 1)}
                      />
                    </td>
                    <td>
                      {lnv >= 12 ? (
                        <span className="badge-status-pill valid">✓ Prolífica</span>
                      ) : lnv > 0 ? (
                        <span className="badge-status-pill valid" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                          Normal
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Pendiente</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setSwineRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ color: '#94a3b8', padding: 4 }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* TAB 5: VACUNACIÓN & DESPARASITACIÓN EN BLOQUE */}
        {activeTab === 'vacunacion' && (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 140 }}>Código Animal / Lote</th>
                <th style={{ width: 150 }}>Estado Sanitario</th>
                <th style={{ width: 110 }}>Dosis Aplicada</th>
                <th style={{ width: 130 }}>Lote Fármaco</th>
                <th style={{ width: 160 }}>Médico Responsable</th>
                <th style={{ width: 100, textAlign: 'right' }}>Retiro Leche</th>
                <th style={{ width: 100, textAlign: 'right' }}>Retiro Carne</th>
                <th style={{ width: 150 }}>Bloqueo Inocuidad</th>
                <th style={{ width: 190 }}>Observaciones</th>
                <th style={{ width: 45, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {vaccineRows.map((row, idx) => {
                const areteClean = row.codigo.trim().toUpperCase();
                const animal = animalsByTag.get(areteClean);
                const dLeche = typeof row.diasRetiroLeche === 'number' ? row.diasRetiroLeche : 0;
                const dCarne = typeof row.diasRetiroCarne === 'number' ? row.diasRetiroCarne : 0;
                const maxRetiro = Math.max(dLeche, dCarne);
                const hasWithdrawal = maxRetiro > 0;

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <input
                        id={`cell-vacunacion-${idx}-0`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="ej. 0001"
                        value={row.codigo}
                        onChange={e => {
                          const val = e.target.value;
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, codigo: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'vacunacion', idx, 0, vaccineRows.length, idx === vaccineRows.length - 1)}
                        style={{ fontWeight: 700, textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      <select
                        className="spreadsheet-input"
                        value={row.estadoSanitario}
                        onChange={e => {
                          const val = e.target.value as VaccineRowData['estadoSanitario'];
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, estadoSanitario: val } : r));
                        }}
                        style={{ height: 32, fontSize: 11 }}
                      >
                        <option value="Apto para Dosis">✓ Apto para Dosis</option>
                        <option value="En Observación">⚠️ En Observación</option>
                        <option value="Sospechoso">⚠️ Sospechoso</option>
                        <option value="Cuarentena">🚫 Cuarentena</option>
                      </select>
                    </td>
                    <td>
                      <input
                        id={`cell-vacunacion-${idx}-1`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="2.0 mL"
                        value={row.dosis}
                        onChange={e => {
                          const val = e.target.value;
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, dosis: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'vacunacion', idx, 1, vaccineRows.length, idx === vaccineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-vacunacion-${idx}-2`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="VAC-2026-01"
                        value={row.loteFarmaco}
                        onChange={e => {
                          const val = e.target.value;
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, loteFarmaco: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'vacunacion', idx, 2, vaccineRows.length, idx === vaccineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-vacunacion-${idx}-3`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Dr. Carlos Mendoza"
                        value={row.medicoResponsable}
                        onChange={e => {
                          const val = e.target.value;
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, medicoResponsable: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'vacunacion', idx, 3, vaccineRows.length, idx === vaccineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-vacunacion-${idx}-4`}
                        type="number"
                        step="1"
                        className={`spreadsheet-input num ${dLeche > 0 ? 'text-rose-600 font-bold' : ''}`}
                        placeholder="0"
                        value={row.diasRetiroLeche}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, diasRetiroLeche: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'vacunacion', idx, 4, vaccineRows.length, idx === vaccineRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-vacunacion-${idx}-5`}
                        type="number"
                        step="1"
                        className={`spreadsheet-input num ${dCarne > 0 ? 'text-rose-600 font-bold' : ''}`}
                        placeholder="0"
                        value={row.diasRetiroCarne}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, diasRetiroCarne: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'vacunacion', idx, 5, vaccineRows.length, idx === vaccineRows.length - 1)}
                      />
                    </td>
                    <td>
                      {hasWithdrawal ? (
                        <span className="badge-status-pill danger" title={`Bloqueo sanitario activo: ${maxRetiro} días`}>
                          🛡️ Bloqueo ({maxRetiro}d)
                        </span>
                      ) : (
                        <span className="badge-status-pill valid">
                          ✓ Libre Inocuidad
                        </span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-vacunacion-${idx}-6`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Notas sanitarias..."
                        value={row.observaciones}
                        onChange={e => {
                          const val = e.target.value;
                          setVaccineRows(prev => prev.map(r => r.id === row.id ? { ...r, observaciones: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'vacunacion', idx, 6, vaccineRows.length, idx === vaccineRows.length - 1)}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setVaccineRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ color: '#94a3b8', padding: 4 }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* =====================================================================
          SPREADSHEET KEYBOARD NAVIGATION HELP FOOTER
          ===================================================================== */}
      <div className="spreadsheet-kbd-footer">
        <div className="spreadsheet-kbd-shortcuts">
          <span style={{ fontWeight: 600, color: '#334155' }}>Atajos de Teclado:</span>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">Enter</span>
            <span>Bajar celda / Añadir fila automática al final</span>
          </div>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">Tab</span>
            <span>Avanzar a la siguiente columna</span>
          </div>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">↑ / ↓</span>
            <span>Navegación vertical rápida entre animales</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#095431', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          <span>Modo Manga Multi-Especie Activo (5 Modos Masivos AgroGan)</span>
        </div>
      </div>
    </div>
  );
};
