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
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { EventoItem } from './NuevoEventoModal';
import { EspecieAnimal } from '../../../types/animal';
import './eventosSpreadsheet.css';

export interface MilkRowData {
  id: string;
  arete: string;
  pesajeAm: number | '';
  pesajePm: number | '';
  grasa: number | '';
  rcs: number | '';
}

export interface WeightRowData {
  id: string;
  arete: string;
  pesoKg: number | '';
  condicion: number;
  observaciones: string;
}

export interface PoultryRowData {
  id: string;
  lote: string;
  avesAlojadas: number | '';
  huevosComerciales: number | '';
  huevosRotos: number | '';
  pesoPromedioHuevo: number | '';
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
  { id: 'Bovinos', label: 'Bovinos', icon: '🐮', expectedRange: '~180 - 550 kg (Becerros a Vacas/Toros)', defaultWeight: 460 },
  { id: 'Porcinos', label: 'Porcinos', icon: '🐷', expectedRange: '~80 - 110 kg (Ceba) / ~200 kg (Madres)', defaultWeight: 95 },
  { id: 'Aves de corral', label: 'Aves de corral', icon: '🐔', expectedRange: '~2.0 - 2.8 kg (Broilers / Ponedoras)', defaultWeight: 2.5 },
  { id: 'Búfalos', label: 'Búfalos', icon: '🐃', expectedRange: '~180 - 620 kg (Bucerros a Búfalas)', defaultWeight: 520 },
  { id: 'Caprinos', label: 'Caprinos', icon: '🐐', expectedRange: '~30 - 65 kg (Cabritos a Cabras)', defaultWeight: 45 },
  { id: 'Equinos', label: 'Equinos', icon: '🐴', expectedRange: '~250 - 520 kg (Potros a Adultos)', defaultWeight: 480 },
];

const INITIAL_POULTRY_ROWS: PoultryRowData[] = [
  { id: 'p-1', lote: 'GALP-01', avesAlojadas: 2500, huevosComerciales: 2380, huevosRotos: 35, pesoPromedioHuevo: 62.5, observaciones: 'Pico de producción (Lohmann Brown)' },
  { id: 'p-2', lote: 'GALP-02', avesAlojadas: 2400, huevosComerciales: 2240, huevosRotos: 42, pesoPromedioHuevo: 61.8, observaciones: 'Postura alta 95.1% (Hy-Line)' },
  { id: 'p-3', lote: 'GALP-03', avesAlojadas: 3000, huevosComerciales: 2810, huevosRotos: 48, pesoPromedioHuevo: 63.0, observaciones: 'Calidad cáscara comercial A' },
  { id: 'p-4', lote: 'GALP-LEV', avesAlojadas: 1800, huevosComerciales: 1540, huevosRotos: 22, pesoPromedioHuevo: 58.5, observaciones: 'Inicio de postura (Semana 22)' }
];

export const SpreadsheetGridMode: React.FC<SpreadsheetGridModeProps> = ({ onSaveBatch }) => {
  const { animals, updateAnimal } = useApp();
  const [activeTab, setActiveTab] = useState<'leche' | 'peso' | 'postura'>('leche');
  
  // 1. Control Lechero state
  const [selectedDairySpecies, setSelectedDairySpecies] = useState<DairySpecies>('Bovinos');
  const [selectedLoteToPopulate, setSelectedLoteToPopulate] = useState<string>('TODOS');
  
  // 2. Control Ponderal state
  const [selectedWeightSpecies, setSelectedWeightSpecies] = useState<EspecieAnimal>('Bovinos');
  
  // Notification banner
  const [batchSaveResult, setBatchSaveResult] = useState<{ count: number; total: string; average: string; detail?: string } | null>(null);

  // Initial Milk Rows
  const [milkRows, setMilkRows] = useState<MilkRowData[]>([
    { id: 'm-1', arete: '0001', pesajeAm: 7.8, pesajePm: 6.4, grasa: 3.8, rcs: 145 },
    { id: 'm-2', arete: '0002', pesajeAm: 6.5, pesajePm: 5.9, grasa: 3.6, rcs: 220 },
    { id: 'm-3', arete: 'BCA05', pesajeAm: 8.2, pesajePm: 7.1, grasa: 4.1, rcs: 110 }
  ]);

  // Initial Weight Rows
  const [weightRows, setWeightRows] = useState<WeightRowData[]>([
    { id: 'w-1', arete: 'BCA01', pesoKg: 185, condicion: 3.25, observaciones: 'Desarrollo óptimo recría' },
    { id: 'w-2', arete: 'BCA02', pesoKg: 178, condicion: 3.0, observaciones: 'Ganancia sostenida' },
    { id: 'w-3', arete: 'BCA03', pesoKg: 385, condicion: 3.5, observaciones: 'Novilla de reemplazo' },
    { id: 'w-4', arete: '0001', pesoKg: 560, condicion: 3.25, observaciones: 'Condición post-parto' },
  ]);

  // Initial Poultry Rows
  const [poultryRows, setPoultryRows] = useState<PoultryRowData[]>(INITIAL_POULTRY_ROWS);

  // Available lots based on active tab and selected species
  const availableLotes = useMemo(() => {
    const lotes = new Set<string>();
    const targetSpecies = activeTab === 'leche' ? selectedDairySpecies : activeTab === 'peso' ? selectedWeightSpecies : 'Aves de corral';
    
    animals.forEach(a => {
      const matchesSpecies = a.especie === targetSpecies || (!a.especie && targetSpecies === 'Bovinos');
      if (matchesSpecies && a.lote) {
        lotes.add(a.lote);
      }
    });

    // For poultry, guarantee common farm house codes
    if (activeTab === 'postura') {
      lotes.add('GALP-01');
      lotes.add('GALP-02');
      lotes.add('GALP-03');
      lotes.add('GALP-LEV');
    }

    return Array.from(lotes);
  }, [animals, activeTab, selectedDairySpecies, selectedWeightSpecies]);

  // Animal Map for quick validation and lookup
  const animalsByTag = useMemo(() => {
    const map = new Map<string, typeof animals[0]>();
    animals.forEach(a => map.set(a.practico.toUpperCase(), a));
    return map;
  }, [animals]);

  // Active dairy species metadata
  const currentDairyMeta = useMemo(() => {
    return DAIRY_SPECIES_OPTIONS.find(d => d.id === selectedDairySpecies) || DAIRY_SPECIES_OPTIONS[0];
  }, [selectedDairySpecies]);

  // Active weight species metadata
  const currentWeightMeta = useMemo(() => {
    return WEIGHT_SPECIES_OPTIONS.find(w => w.id === selectedWeightSpecies) || WEIGHT_SPECIES_OPTIONS[0];
  }, [selectedWeightSpecies]);

  // Milk Stats
  const milkStats = useMemo(() => {
    let totalKg = 0;
    let countedAnimals = 0;
    let rcsAlerts = 0;

    milkRows.forEach(r => {
      const am = typeof r.pesajeAm === 'number' ? r.pesajeAm : 0;
      const pm = typeof r.pesajePm === 'number' ? r.pesajePm : 0;
      const total = am + pm;
      if (total > 0 && r.arete.trim()) {
        totalKg += total;
        countedAnimals++;
      }
      if (typeof r.rcs === 'number' && r.rcs > 200) {
        rcsAlerts++;
      }
    });

    const averageKg = countedAnimals > 0 ? totalKg / countedAnimals : 0;
    return { totalKg, countedAnimals, averageKg, rcsAlerts };
  }, [milkRows]);

  // Weight Stats
  const weightStats = useMemo(() => {
    let totalKg = 0;
    let countedAnimals = 0;

    weightRows.forEach(r => {
      const p = typeof r.pesoKg === 'number' ? r.pesoKg : 0;
      if (p > 0 && r.arete.trim()) {
        totalKg += p;
        countedAnimals++;
      }
    });

    const averageKg = countedAnimals > 0 ? totalKg / countedAnimals : 0;
    return { totalKg, countedAnimals, averageKg };
  }, [weightRows]);

  // Poultry Stats
  const poultryStats = useMemo(() => {
    let totalAves = 0;
    let totalHuevosComerciales = 0;
    let totalHuevosRotos = 0;
    let countedGalpones = 0;

    poultryRows.forEach(r => {
      const aves = typeof r.avesAlojadas === 'number' ? r.avesAlojadas : 0;
      const com = typeof r.huevosComerciales === 'number' ? r.huevosComerciales : 0;
      const rot = typeof r.huevosRotos === 'number' ? r.huevosRotos : 0;
      
      if (aves > 0 && (com > 0 || rot > 0)) {
        totalAves += aves;
        totalHuevosComerciales += com;
        totalHuevosRotos += rot;
        countedGalpones++;
      }
    });

    const totalHuevos = totalHuevosComerciales + totalHuevosRotos;
    const porcentajePostura = totalAves > 0 ? (totalHuevos / totalAves) * 100 : 0;
    const mermaPorc = totalHuevos > 0 ? (totalHuevosRotos / totalHuevos) * 100 : 0;

    return {
      totalAves,
      totalHuevosComerciales,
      totalHuevosRotos,
      totalHuevos,
      porcentajePostura,
      mermaPorc,
      countedGalpones
    };
  }, [poultryRows]);

  // Key Navigation helper
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
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
        else addPoultryRow();

        setTimeout(() => {
          const nextInput = document.getElementById(`cell-${prefix}-${rowIndex + 1}-${colIndex}`);
          nextInput?.focus();
        }, 30);
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

  // Add Row Handlers
  const addMilkRow = () => {
    const defaultArete = selectedDairySpecies === 'Búfalos' ? 'BUF-' : selectedDairySpecies === 'Caprinos' ? 'CAP-' : '';
    setMilkRows(prev => [
      ...prev,
      { id: `m-${Date.now()}-${Math.random()}`, arete: defaultArete, pesajeAm: '', pesajePm: '', grasa: '', rcs: '' }
    ]);
  };

  const addWeightRow = () => {
    const defaultWeight = currentWeightMeta.defaultWeight;
    setWeightRows(prev => [
      ...prev,
      { id: `w-${Date.now()}-${Math.random()}`, arete: '', pesoKg: defaultWeight, condicion: 3.0, observaciones: '' }
    ]);
  };

  const addPoultryRow = () => {
    setPoultryRows(prev => [
      ...prev,
      { id: `p-${Date.now()}-${Math.random()}`, lote: `GALP-0${prev.length + 1}`, avesAlojadas: 2000, huevosComerciales: '', huevosRotos: '', pesoPromedioHuevo: 62.0, observaciones: '' }
    ]);
  };

  // Populate Entire Lot for Dairy Species
  const handlePopulateDairyLote = (species = selectedDairySpecies, lote = selectedLoteToPopulate) => {
    // Pull only lactating females of the selected dairy species
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

    if (lactatingFemales.length === 0) {
      // Fallback to all active females of that species if lot specific has none
      const anyFemales = animals.filter(a => {
        const isSpecies = a.especie === species || (!a.especie && species === 'Bovinos');
        return isSpecies && a.estatus === 'Activo' && a.sexo !== 'Macho';
      });

      if (anyFemales.length === 0) return;

      const newRows: MilkRowData[] = anyFemales.map((a, idx) => ({
        id: `m-pop-${a.practico}-${idx}-${Date.now()}`,
        arete: a.practico,
        pesajeAm: species === 'Búfalos' ? 4.5 : species === 'Caprinos' ? 2.1 : 7.5,
        pesajePm: species === 'Búfalos' ? 3.6 : species === 'Caprinos' ? 1.7 : 6.2,
        grasa: species === 'Búfalos' ? 7.8 : species === 'Caprinos' ? 4.2 : 3.8,
        rcs: species === 'Búfalos' ? 120 : species === 'Caprinos' ? 160 : 145
      }));
      setMilkRows(newRows);
      return;
    }

    const newRows: MilkRowData[] = lactatingFemales.map((a, idx) => {
      let am = 7.5;
      let pm = 6.2;
      let fat = 3.8;
      let rcs = 145;

      if (species === 'Búfalos') {
        am = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.55) * 10) / 10 : 4.8;
        pm = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.45) * 10) / 10 : 3.8;
        fat = 7.8;
        rcs = 120;
      } else if (species === 'Caprinos') {
        am = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.55) * 10) / 10 : 2.2;
        pm = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.45) * 10) / 10 : 1.7;
        fat = 4.2;
        rcs = 160;
      } else {
        am = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.55) * 10) / 10 : 7.8;
        pm = a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.45) * 10) / 10 : 6.4;
        fat = 3.8;
        rcs = 145;
      }

      return {
        id: `m-pop-${a.practico}-${idx}-${Date.now()}`,
        arete: a.practico,
        pesajeAm: am,
        pesajePm: pm,
        grasa: fat,
        rcs: rcs
      };
    });

    setMilkRows(newRows);
  };

  // Populate Entire Lot for Weight Species
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
        if (species === 'Aves de corral') expectedP = 2.45;
        else if (species === 'Porcinos') expectedP = 92;
        else if (species === 'Caprinos') expectedP = 46;
        else if (species === 'Equinos') expectedP = 485;
        else if (species === 'Búfalos') expectedP = 540;
        else expectedP = 460;
      }

      return {
        id: `w-pop-${a.practico}-${idx}-${Date.now()}`,
        arete: a.practico,
        pesoKg: expectedP,
        condicion: species === 'Aves de corral' ? 3.0 : 3.25,
        observaciones: `Pesaje ordinario ${species} - Lote ${a.lote || 'General'}`
      };
    });

    setWeightRows(newRows);
  };

  // Switch Dairy Species and auto-populate
  const handleSwitchDairySpecies = (sp: DairySpecies) => {
    setSelectedDairySpecies(sp);
    setSelectedLoteToPopulate('TODOS');
    handlePopulateDairyLote(sp, 'TODOS');
  };

  // Switch Weight Species and auto-populate
  const handleSwitchWeightSpecies = (sp: EspecieAnimal) => {
    setSelectedWeightSpecies(sp);
    setSelectedLoteToPopulate('TODOS');
    handlePopulateWeightLote(sp, 'TODOS');
  };

  // Clean empty rows
  const handleCleanEmptyRows = () => {
    if (activeTab === 'leche') {
      setMilkRows(prev => prev.filter(r => r.arete.trim().length > 0));
    } else if (activeTab === 'peso') {
      setWeightRows(prev => prev.filter(r => r.arete.trim().length > 0));
    } else {
      setPoultryRows(prev => prev.filter(r => r.lote.trim().length > 0 && typeof r.avesAlojadas === 'number' && r.avesAlojadas > 0));
    }
  };

  // Batch Save Handler
  const handleSaveBatch = () => {
    const today = new Date().toLocaleDateString('es-ES');
    const createdEvents: EventoItem[] = [];

    // 1. Control Lechero
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
            observaciones: `Especie: ${selectedDairySpecies} | AM: ${am} kg | PM: ${pm} kg | Total: ${total.toFixed(1)} kg ${r.grasa ? `| Grasa: ${r.grasa}%` : ''} ${r.rcs ? `| RCS: ${r.rcs}k` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${(Math.round(totalSavedKg * 10) / 10).toLocaleString()} kg`,
          average: `${(Math.round((totalSavedKg / savedCount) * 10) / 10).toFixed(1)} kg/${currentDairyMeta.animalLabel.toLowerCase()}`,
          detail: `Especie: ${selectedDairySpecies}`
        });
      }
    } 
    // 2. Control Ponderal
    else if (activeTab === 'peso') {
      let savedCount = 0;
      let totalSavedKg = 0;

      weightRows.forEach(r => {
        const arete = r.arete.trim().toUpperCase();
        if (!arete) return;

        const p = typeof r.pesoKg === 'number' ? r.pesoKg : 0;
        if (p > 0) {
          savedCount++;
          totalSavedKg += p;

          updateAnimal(arete, {
            pesoKg: p
          });

          createdEvents.push({
            id: `ev-weight-${arete}-${Date.now()}-${savedCount}`,
            fecha: today,
            codigoAnimal: arete,
            categoria: 'Productivos',
            tipoEvento: 'Crecimientos',
            vencimiento: `Pesaje bimestral (${selectedWeightSpecies}) en 60 días`,
            tecnico: `Báscula Ponderal (${selectedWeightSpecies})`,
            observaciones: `Especie: ${selectedWeightSpecies} | Peso: ${p} kg | Condición: ${r.condicion} ${r.observaciones ? `| ${r.observaciones}` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${totalSavedKg.toLocaleString()} kg`,
          average: `${(Math.round((totalSavedKg / savedCount) * 10) / 10).toFixed(1)} kg/animal`,
          detail: `Especie: ${selectedWeightSpecies}`
        });
      }
    } 
    // 3. Control de Postura Avícola
    else {
      let savedCount = 0;
      let totalHuevos = 0;

      poultryRows.forEach(r => {
        const lote = r.lote.trim().toUpperCase();
        if (!lote) return;

        const aves = typeof r.avesAlojadas === 'number' ? r.avesAlojadas : 0;
        const com = typeof r.huevosComerciales === 'number' ? r.huevosComerciales : 0;
        const rot = typeof r.huevosRotos === 'number' ? r.huevosRotos : 0;
        const sumHuevos = com + rot;

        if (aves > 0 && sumHuevos > 0) {
          savedCount++;
          totalHuevos += com;
          const porcPostura = (sumHuevos / aves) * 100;

          // Update poultry animals in that lot
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
            observaciones: `Galpón: ${lote} | Aves: ${aves.toLocaleString()} | Huevos Comerciales: ${com.toLocaleString()} Uds | Rotos/Descarte: ${rot} Uds | Postura: ${porcPostura.toFixed(1)}% | Peso Prom: ${r.pesoPromedioHuevo || 62} g ${r.observaciones ? `| ${r.observaciones}` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: `${totalHuevos.toLocaleString()} huevos comerciales`,
          average: `${poultryStats.porcentajePostura.toFixed(1)}% postura ponderada`,
          detail: 'Lotes / Galpones Avícolas'
        });
      }
    }
  };

  return (
    <div className="spreadsheet-container">
      {/* Live KPIs Header */}
      <div className="spreadsheet-kpi-bar">
        {activeTab === 'postura' ? (
          <>
            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <Layers size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Galpones en Control</span>
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
                <span className="spreadsheet-kpi-label">Huevos Comerciales</span>
                <span className="spreadsheet-kpi-value">
                  {poultryStats.totalHuevosComerciales.toLocaleString()} uds
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#059669' }}>
                  Aptos para empaque
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
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: poultryStats.mermaPorc > 2 ? '#fff1f2' : '#f0fdf4', color: poultryStats.mermaPorc > 2 ? '#e11d48' : '#16a34a' }}>
                <AlertTriangle size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Descarte / Rotos</span>
                <span className="spreadsheet-kpi-value" style={{ color: poultryStats.mermaPorc > 2 ? '#e11d48' : '#16a34a' }}>
                  {poultryStats.totalHuevosRotos} uds ({poultryStats.mermaPorc.toFixed(1)}%)
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: poultryStats.mermaPorc > 2 ? '#e11d48' : '#16a34a' }}>
                  {poultryStats.mermaPorc > 2 ? 'Merma alta: revisar nidos' : 'Merma dentro de estándar'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
                <Users size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">Animales en Planilla</span>
                <span className="spreadsheet-kpi-value">
                  {activeTab === 'leche' ? milkStats.countedAnimals : weightStats.countedAnimals}
                </span>
                <span className="spreadsheet-kpi-sub">
                  {activeTab === 'leche' ? `${milkRows.length} filas • ${selectedDairySpecies}` : `${weightRows.length} filas • ${selectedWeightSpecies}`}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                {activeTab === 'leche' ? <Milk size={22} /> : <Scale size={22} />}
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">
                  {activeTab === 'leche' ? `Producción Total (${selectedDairySpecies})` : `Biomasa Total (${selectedWeightSpecies})`}
                </span>
                <span className="spreadsheet-kpi-value">
                  {activeTab === 'leche' ? `${milkStats.totalKg.toFixed(1)} kg` : `${weightStats.totalKg.toLocaleString()} kg`}
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#2563eb' }}>
                  {activeTab === 'leche' ? `AM + PM de la jornada` : `Báscula en vivo`}
                </span>
              </div>
            </div>

            <div className="spreadsheet-kpi-card">
              <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
                <TrendingUp size={22} />
              </div>
              <div className="spreadsheet-kpi-info">
                <span className="spreadsheet-kpi-label">
                  {activeTab === 'leche' ? `Promedio por ${currentDairyMeta.animalLabel}` : 'Peso Promedio'}
                </span>
                <span className="spreadsheet-kpi-value">
                  {activeTab === 'leche' ? `${milkStats.averageKg.toFixed(1)} kg` : `${weightStats.averageKg.toFixed(1)} kg`}
                </span>
                <span className="spreadsheet-kpi-sub" style={{ color: '#db2777' }}>
                  {activeTab === 'leche' ? `Estándar ${selectedDairySpecies}` : `Ponderado del lote`}
                </span>
              </div>
            </div>

            {activeTab === 'leche' && (
              <div className="spreadsheet-kpi-card">
                <div className="spreadsheet-kpi-icon" style={{ backgroundColor: milkStats.rcsAlerts > 0 ? '#fffbeb' : '#f0fdf4', color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                  <AlertTriangle size={22} />
                </div>
                <div className="spreadsheet-kpi-info">
                  <span className="spreadsheet-kpi-label">Alertas RCS (&gt;200k)</span>
                  <span className="spreadsheet-kpi-value" style={{ color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                    {milkStats.rcsAlerts} {milkStats.rcsAlerts === 1 ? currentDairyMeta.animalLabel.toLowerCase() : `${currentDairyMeta.animalLabel.toLowerCase()}s`}
                  </span>
                  <span className="spreadsheet-kpi-sub" style={{ color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                    {milkStats.rcsAlerts > 0 ? 'Sospecha de Mastitis' : 'Sanidad de ubre óptima'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Main Mode Switcher & Operations Toolbar */}
      <div className="spreadsheet-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
        {/* 3 Mode Tabs */}
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
            Control Lechero (AM / PM)
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
            Pesaje Ponderal (Biomasa)
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
            Control de Postura Avícola
          </button>
        </div>

        {/* Batch Actions Group */}
        <div className="spreadsheet-actions-group" style={{ flexWrap: 'wrap', gap: 8 }}>
          {/* Lote Selector & Populate for Leche and Peso */}
          {activeTab !== 'postura' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Lote:</span>
              <select
                className="form-select"
                value={selectedLoteToPopulate}
                onChange={e => setSelectedLoteToPopulate(e.target.value)}
                style={{ height: 32, fontSize: 12, padding: '2px 8px' }}
              >
                <option value="TODOS">Todos los lotes ({activeTab === 'leche' ? selectedDairySpecies : selectedWeightSpecies})</option>
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
                  } else {
                    handlePopulateWeightLote(selectedWeightSpecies, selectedLoteToPopulate);
                  }
                }}
                title="Cargar automáticamente los animales filtrados"
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
            onClick={activeTab === 'leche' ? addMilkRow : activeTab === 'peso' ? addWeightRow : addPoultryRow}
            style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, fontSize: 12, padding: '0 12px' }}
          >
            <Plus size={15} />
            <span>{activeTab === 'postura' ? 'Agregar Galpón' : 'Agregar Fila'}</span>
          </button>

          {/* Batch Save Button */}
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveBatch}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, fontSize: 12, padding: '0 16px' }}
          >
            <Save size={15} />
            <span>
              {activeTab === 'leche' 
                ? `Guardar ${milkStats.countedAnimals} Pesajes` 
                : activeTab === 'peso' 
                ? `Guardar ${weightStats.countedAnimals} Pesajes` 
                : `Guardar Postura (${poultryStats.countedGalpones} Galpones)`}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Header: Species Filter Tabs */}
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
            ℹ️ El botón "Cargar Lote" extrae únicamente las <strong>hembras en lactación/ordeño</strong> de {selectedDairySpecies}.
          </span>
        </div>
      )}

      {activeTab === 'peso' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        </div>
      )}

      {/* Batch Save Success Modal / Banner */}
      {batchSaveResult && (
        <div className="withdrawal-warning-banner" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <div style={{ flex: 1 }}>
            <strong>¡Lote guardado con éxito!</strong> Se registraron {batchSaveResult.count} registros en base de datos.
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

      {/* Spreadsheet Grid Table */}
      <div className="spreadsheet-table-wrapper">
        {/* TAB 1: CONTROL LECHERO */}
        {activeTab === 'leche' && (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 140 }}>Arete / Código</th>
                <th style={{ width: 190 }}>Hembra ({currentDairyMeta.label})</th>
                <th style={{ width: 110, textAlign: 'right' }}>Pesaje AM (kg)</th>
                <th style={{ width: 110, textAlign: 'right' }}>Pesaje PM (kg)</th>
                <th style={{ width: 110, textAlign: 'right' }}>Total Día (kg)</th>
                <th style={{ width: 100, textAlign: 'right' }}>Grasa (%)</th>
                <th style={{ width: 110, textAlign: 'right' }}>RCS (x10³)</th>
                <th style={{ width: 140 }}>Estado</th>
                <th style={{ width: 50, textAlign: 'center' }}></th>
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
                            {currentDairyMeta.icon} {animal.categoria} • {animal.lote ? `Lote ${animal.lote}` : 'Sin lote'}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                            {animal.composicion || animal.racial || 'Raza Pura / Mestiza'}
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
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="0.0"
                        value={row.pesajeAm}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, pesajeAm: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 1, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-2`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="0.0"
                        value={row.pesajePm}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, pesajePm: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 2, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <span className="spreadsheet-cell-computed">
                        {totalDia > 0 ? totalDia.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-3`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder={selectedDairySpecies === 'Búfalos' ? '7.8' : selectedDairySpecies === 'Caprinos' ? '4.2' : '3.8'}
                        value={row.grasa}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, grasa: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 3, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-4`}
                        type="number"
                        step="10"
                        className={`spreadsheet-input num ${hasRcsAlert ? 'text-amber-600 font-bold' : ''}`}
                        placeholder="140"
                        value={row.rcs}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, rcs: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'leche', idx, 4, milkRows.length, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      {hasRcsAlert ? (
                        <span className="badge-status-pill warning" title="RCS superior a 200,000 cel/ml">
                          ⚠️ RCS Alto
                        </span>
                      ) : totalDia > 0 && animal ? (
                        <span className="badge-status-pill valid">
                          ✓ Válido
                        </span>
                      ) : !areteClean ? (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Vacía</span>
                      ) : (
                        <span className="badge-status-pill danger">Incompleto</span>
                      )}
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

        {/* TAB 2: PESAJE PONDERAL (BIOMASA MULTI-ESPECIE) */}
        {activeTab === 'peso' && (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 140 }}>Arete / Código</th>
                <th style={{ width: 190 }}>Semoviente ({currentWeightMeta.label})</th>
                <th style={{ width: 130, textAlign: 'right' }}>Peso Actual (kg)</th>
                <th style={{ width: 130, textAlign: 'right' }}>Condición Corporal</th>
                <th style={{ width: 260 }}>Observaciones / Crecimiento</th>
                <th style={{ width: 120 }}>Estado</th>
                <th style={{ width: 50, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {weightRows.map((row, idx) => {
                const areteClean = row.arete.trim().toUpperCase();
                const animal = animalsByTag.get(areteClean);
                const hasWeight = typeof row.pesoKg === 'number' && row.pesoKg > 0;

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
                        placeholder={
                          selectedWeightSpecies === 'Porcinos' ? 'ej. POR-CR01' :
                          selectedWeightSpecies === 'Aves de corral' ? 'ej. AVE-GP01' :
                          selectedWeightSpecies === 'Búfalos' ? 'ej. BUF-01' :
                          selectedWeightSpecies === 'Caprinos' ? 'ej. CAP-CL01' :
                          selectedWeightSpecies === 'Equinos' ? 'ej. EQU-YG01' :
                          'ej. BCA01'
                        }
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
                      {animal ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: 12, color: '#1e293b' }}>
                            {currentWeightMeta.icon} {animal.categoria} • {animal.lote ? `Lote ${animal.lote}` : 'Sin lote'}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                            {animal.composicion || animal.racial || 'Mestizo'}
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
                        id={`cell-peso-${idx}-1`}
                        type="number"
                        step={selectedWeightSpecies === 'Aves de corral' ? '0.05' : '0.5'}
                        className="spreadsheet-input num"
                        placeholder="kg"
                        value={row.pesoKg}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, pesoKg: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 1, weightRows.length, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td>
                      <select
                        className="spreadsheet-input"
                        value={row.condicion}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, condicion: val } : r));
                        }}
                        style={{ height: 32, fontSize: 12 }}
                      >
                        <option value="1.0">1.0 - Muy Flaca / Emaciada</option>
                        <option value="2.0">2.0 - Flaca</option>
                        <option value="2.5">2.5 - Regular</option>
                        <option value="3.0">3.0 - Óptima / Comercial</option>
                        <option value="3.25">3.25 - Buena Condición</option>
                        <option value="3.5">3.5 - Vigorosa</option>
                        <option value="4.0">4.0 - Gorda</option>
                        <option value="5.0">5.0 - Sobreengrasada</option>
                      </select>
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-2`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Notas zootécnicas..."
                        value={row.observaciones}
                        onChange={e => {
                          const val = e.target.value;
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, observaciones: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'peso', idx, 2, weightRows.length, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td>
                      {hasWeight && animal ? (
                        <span className="badge-status-pill valid">
                          ✓ Válido
                        </span>
                      ) : !areteClean ? (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Vacía</span>
                      ) : (
                        <span className="badge-status-pill danger">Incompleto</span>
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
                <th style={{ width: 140 }}>Lote / Galpón</th>
                <th style={{ width: 130, textAlign: 'right' }}>Aves Alojadas</th>
                <th style={{ width: 150, textAlign: 'right' }}>Huevos Comerciales (Uds)</th>
                <th style={{ width: 150, textAlign: 'right' }}>Descarte / Rotos (Uds)</th>
                <th style={{ width: 130, textAlign: 'right' }}>% Postura Calculado</th>
                <th style={{ width: 140, textAlign: 'right' }}>Peso Prom. Huevo (g)</th>
                <th style={{ width: 140 }}>Estado / Calidad</th>
                <th style={{ width: 190 }}>Observaciones</th>
                <th style={{ width: 50, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {poultryRows.map((row, idx) => {
                const aves = typeof row.avesAlojadas === 'number' ? row.avesAlojadas : 0;
                const com = typeof row.huevosComerciales === 'number' ? row.huevosComerciales : 0;
                const rot = typeof row.huevosRotos === 'number' ? row.huevosRotos : 0;
                const totalH = com + rot;
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
                        placeholder="ej. GALP-01"
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
                        className={`spreadsheet-input num ${merma > 2.5 ? 'text-amber-600 font-bold' : ''}`}
                        placeholder="35"
                        value={row.huevosRotos}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, huevosRotos: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 3, poultryRows.length, idx === poultryRows.length - 1)}
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
                        id={`cell-postura-${idx}-4`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="62.5"
                        value={row.pesoPromedioHuevo}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, pesoPromedioHuevo: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 4, poultryRows.length, idx === poultryRows.length - 1)}
                      />
                    </td>
                    <td>
                      {pct >= 90 ? (
                        <span className="badge-status-pill valid">✓ Alta Postura</span>
                      ) : pct >= 80 ? (
                        <span className="badge-status-pill valid" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                          Postura Media
                        </span>
                      ) : pct > 0 ? (
                        <span className="badge-status-pill warning">⚠️ Revisar Lote</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Pendiente</span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-postura-${idx}-5`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Notas de manejo / salud..."
                        value={row.observaciones}
                        onChange={e => {
                          const val = e.target.value;
                          setPoultryRows(prev => prev.map(r => r.id === row.id ? { ...r, observaciones: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, 'postura', idx, 5, poultryRows.length, idx === poultryRows.length - 1)}
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
      </div>

      {/* Spreadsheet Keyboard Navigation Help Footer */}
      <div className="spreadsheet-kbd-footer">
        <div className="spreadsheet-kbd-shortcuts">
          <span style={{ fontWeight: 600, color: '#334155' }}>Atajos de Teclado:</span>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">Enter</span>
            <span>Bajar a siguiente celda / Añadir fila al final</span>
          </div>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">Tab</span>
            <span>Avanzar a siguiente columna</span>
          </div>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">↑ / ↓</span>
            <span>Navegación vertical rápida</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          <span>Modo Manga Multi-Especie Activo (AgroGan NextGen)</span>
        </div>
      </div>
    </div>
  );
};
