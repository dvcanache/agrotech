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
  Scale,
  BadgeAlert,
  Info
} from 'lucide-react';
import { exportToPDF } from '../utils/exportUtils';
import { EspecieAnimal } from '../../../types/animal';

export interface LivestockTransitItem {
  arete: string;
  nombre: string;
  categoria: string;
  raza: string;
  sexo: 'Hembra' | 'Macho';
  pesoKg: number;
  especie: EspecieAnimal;
  tipoIdentificacion: string;
  identificacionDetalle: string;
  retiroFarmacoActivo: boolean;
  diasRetiroRestantes?: number;
  farmaco?: string;
  tipoRetiro?: 'Carne' | 'Leche' | 'Carne y Huevo';
  sanitarioExtra?: string;
}

export type CattleTransitItem = LivestockTransitItem;

export const UGG_FACTORS: Record<EspecieAnimal, number> = {
  'Bovinos': 1.0,
  'Búfalos': 1.2,
  'Equinos': 1.2,
  'Porcinos': 0.3,
  'Caprinos': 0.15,
  'Aves de corral': 0.005
};

export const ESPECIE_IDENTIFICACION: Record<EspecieAnimal, { tipo: string; descripcion: string; icono: string }> = {
  'Bovinos': {
    tipo: 'Arete Oficial / Hierro',
    descripcion: 'Aretes oficiales (SENASAG/INSAI) y marcas de hierro candente',
    icono: '🐮'
  },
  'Búfalos': {
    tipo: 'Arete Oficial / Hierro',
    descripcion: 'Aretes oficiales y marcas de hierro candente',
    icono: '🐃'
  },
  'Porcinos': {
    tipo: 'Chapa / Tatuaje Camada',
    descripcion: 'Chapas de oreja y tatuaje oficial de camada',
    icono: '🐷'
  },
  'Aves de corral': {
    tipo: 'Precinto Caja / Jaula',
    descripcion: 'Precintos de cajas (100 pollitos BB) o jaulas de transporte de galpón',
    icono: '🐔'
  },
  'Caprinos': {
    tipo: 'Arete / Microchip Caprino',
    descripcion: 'Aretes de plástico inviolable y microchips caprinos',
    icono: '🐐'
  },
  'Equinos': {
    tipo: 'Pasaporte / RFID + Coggins',
    descripcion: 'Pasaporte equino oficial, microchip RFID subcutáneo y Test de Coggins AIE vigente',
    icono: '🐴'
  }
};

const MOCK_TRANSIT_ANIMALS: LivestockTransitItem[] = [
  // --- 🐮 BOVINOS (Factor UGG: 1.0) ---
  {
    arete: '0001',
    nombre: 'Mariposa',
    categoria: 'Vaca',
    raza: 'Carora',
    sexo: 'Hembra',
    pesoKg: 465,
    especie: 'Bovinos',
    tipoIdentificacion: 'Arete SENASAG / Hierro',
    identificacionDetalle: 'Arete 0001 / Hierro Candente #12',
    retiroFarmacoActivo: false
  },
  {
    arete: '0002',
    nombre: 'Esperanza',
    categoria: 'Vaca',
    raza: 'Carora',
    sexo: 'Hembra',
    pesoKg: 480,
    especie: 'Bovinos',
    tipoIdentificacion: 'Arete SENASAG / Hierro',
    identificacionDetalle: 'Arete 0002 / Hierro Candente #12',
    retiroFarmacoActivo: false
  },
  {
    arete: 'CW002',
    nombre: 'Baronesa',
    categoria: 'Vaca',
    raza: 'Gyr Lechero',
    sexo: 'Hembra',
    pesoKg: 495,
    especie: 'Bovinos',
    tipoIdentificacion: 'Arete SENASAG / Hierro',
    identificacionDetalle: 'Arete CW002 / Hierro Candente #44',
    retiroFarmacoActivo: false
  },
  {
    arete: 'CW003',
    nombre: 'Reina',
    categoria: 'Vaca',
    raza: 'Gyr Lechero',
    sexo: 'Hembra',
    pesoKg: 510,
    especie: 'Bovinos',
    tipoIdentificacion: 'Arete SENASAG / Hierro',
    identificacionDetalle: 'Arete CW003 / Hierro Candente #44',
    retiroFarmacoActivo: false
  },
  {
    arete: 'CW008',
    nombre: 'Milenaria',
    categoria: 'Vaca',
    raza: 'Holstein',
    sexo: 'Hembra',
    pesoKg: 560,
    especie: 'Bovinos',
    tipoIdentificacion: 'Arete SENASAG / Hierro',
    identificacionDetalle: 'Arete CW008 / Hierro Candente #88',
    retiroFarmacoActivo: true,
    diasRetiroRestantes: 5,
    farmaco: 'Cefalosporina Intramamaria',
    tipoRetiro: 'Leche'
  },
  {
    arete: 'VC-104',
    nombre: 'Coronela',
    categoria: 'Vaca',
    raza: 'Brahman',
    sexo: 'Hembra',
    pesoKg: 535,
    especie: 'Bovinos',
    tipoIdentificacion: 'Arete SENASAG / Hierro',
    identificacionDetalle: 'Arete VC-104 / Hierro Candente #22',
    retiroFarmacoActivo: true,
    diasRetiroRestantes: 22,
    farmaco: 'Ivermectina 1% inyectable',
    tipoRetiro: 'Carne'
  },
  {
    arete: 'NV-201',
    nombre: 'Novillo 201',
    categoria: 'Novillo',
    raza: 'Brahman',
    sexo: 'Macho',
    pesoKg: 430,
    especie: 'Bovinos',
    tipoIdentificacion: 'Arete SENASAG / Hierro',
    identificacionDetalle: 'Arete NV-201 / Hierro Candente #05',
    retiroFarmacoActivo: false
  },

  // --- 🐃 BÚFALOS (Factor UGG: 1.2) ---
  {
    arete: 'BUF-01',
    nombre: 'Moza Murrah',
    categoria: 'Búfala',
    raza: 'Murrah',
    sexo: 'Hembra',
    pesoKg: 640,
    especie: 'Búfalos',
    tipoIdentificacion: 'Arete Oficial / Hierro',
    identificacionDetalle: 'Arete BUF-001 / Hierro Candente BF-10',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Vacunación Aftosa/Rabia al día'
  },
  {
    arete: 'BUF-02',
    nombre: 'Perla Negra',
    categoria: 'Búfala',
    raza: 'Mediterráneo',
    sexo: 'Hembra',
    pesoKg: 610,
    especie: 'Búfalos',
    tipoIdentificacion: 'Arete Oficial / Hierro',
    identificacionDetalle: 'Arete BUF-002 / Hierro Candente BF-10',
    retiroFarmacoActivo: false
  },
  {
    arete: 'BUF-03',
    nombre: 'Sombra Llanera',
    categoria: 'Bubilla',
    raza: 'Murrah',
    sexo: 'Hembra',
    pesoKg: 490,
    especie: 'Búfalos',
    tipoIdentificacion: 'Arete Oficial / Hierro',
    identificacionDetalle: 'Arete BUF-003 / Hierro Candente BF-10',
    retiroFarmacoActivo: false
  },
  {
    arete: 'BUF-04',
    nombre: 'Trueno Murrah',
    categoria: 'Padrote',
    raza: 'Murrah',
    sexo: 'Macho',
    pesoKg: 780,
    especie: 'Búfalos',
    tipoIdentificacion: 'Arete Oficial / Hierro',
    identificacionDetalle: 'Arete BUF-004 / Hierro Candente BF-01',
    retiroFarmacoActivo: true,
    diasRetiroRestantes: 14,
    farmaco: 'Oxitetraciclina 200 LA',
    tipoRetiro: 'Carne'
  },
  {
    arete: 'BUF-CEB01',
    nombre: 'Cebón Bufalino',
    categoria: 'Búfalo de Ceba',
    raza: 'Mediterráneo',
    sexo: 'Macho',
    pesoKg: 445,
    especie: 'Búfalos',
    tipoIdentificacion: 'Arete Oficial / Hierro',
    identificacionDetalle: 'Arete BUF-CEB-12 / Hierro BF-20',
    retiroFarmacoActivo: false
  },

  // --- 🐷 PORCINOS (Factor UGG: 0.3) ---
  {
    arete: 'POR-101',
    nombre: 'Matriarca 101',
    categoria: 'Cerda Reproductora',
    raza: 'Landrace',
    sexo: 'Hembra',
    pesoKg: 225,
    especie: 'Porcinos',
    tipoIdentificacion: 'Chapa / Tatuaje Camada',
    identificacionDetalle: 'Chapa Oreja CH-101 / Tatuaje Camada P-12',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Plan PPC y Circovirus certificado'
  },
  {
    arete: 'POR-102',
    nombre: 'Bella Landrace',
    categoria: 'Cerda Reproductora',
    raza: 'Landrace',
    sexo: 'Hembra',
    pesoKg: 210,
    especie: 'Porcinos',
    tipoIdentificacion: 'Chapa / Tatuaje Camada',
    identificacionDetalle: 'Chapa Oreja CH-102 / Tatuaje Camada P-14',
    retiroFarmacoActivo: false
  },
  {
    arete: 'POR-C01',
    nombre: 'Lote Ceba Alpha',
    categoria: 'Cerdo de Ceba',
    raza: 'Pietrain',
    sexo: 'Macho',
    pesoKg: 95,
    especie: 'Porcinos',
    tipoIdentificacion: 'Chapa / Tatuaje Camada',
    identificacionDetalle: 'Chapa Lote CH-301 / Muesca Oreja #3',
    retiroFarmacoActivo: false
  },
  {
    arete: 'POR-C02',
    nombre: 'Lote Ceba Beta',
    categoria: 'Cerdo de Ceba',
    raza: 'Pietrain',
    sexo: 'Macho',
    pesoKg: 98,
    especie: 'Porcinos',
    tipoIdentificacion: 'Chapa / Tatuaje Camada',
    identificacionDetalle: 'Chapa Lote CH-302 / Muesca Oreja #3',
    retiroFarmacoActivo: true,
    diasRetiroRestantes: 8,
    farmaco: 'Tilosina Inyectable',
    tipoRetiro: 'Carne'
  },
  {
    arete: 'VER-01',
    nombre: 'Campeón Pietrain',
    categoria: 'Verraco',
    raza: 'Pietrain Puro',
    sexo: 'Macho',
    pesoKg: 260,
    especie: 'Porcinos',
    tipoIdentificacion: 'Chapa / Tatuaje Camada',
    identificacionDetalle: 'Chapa Oreja CH-001 / Tatuaje Genealógico V-01',
    retiroFarmacoActivo: false
  },

  // --- 🐔 AVES DE CORRAL (Factor UGG: 0.005) ---
  {
    arete: 'AVE-C01',
    nombre: 'Caja 100 Pollitos BB #1',
    categoria: 'Pollonas / Pollitos',
    raza: 'Ross 308',
    sexo: 'Hembra',
    pesoKg: 4.5,
    especie: 'Aves de corral',
    tipoIdentificacion: 'Precinto Caja / Jaula',
    identificacionDetalle: 'Precinto Caja #8801 / Lote Incubadora INC-44',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Vacunación Marek aplicada en planta de incubación'
  },
  {
    arete: 'AVE-C02',
    nombre: 'Caja 100 Pollitos BB #2',
    categoria: 'Pollonas / Pollitos',
    raza: 'Cobb 500',
    sexo: 'Macho',
    pesoKg: 4.5,
    especie: 'Aves de corral',
    tipoIdentificacion: 'Precinto Caja / Jaula',
    identificacionDetalle: 'Precinto Caja #8802 / Lote Incubadora INC-44',
    retiroFarmacoActivo: false
  },
  {
    arete: 'AVE-J01',
    nombre: 'Jaula 20 Ponedoras Hy-Line',
    categoria: 'Gallinas Ponedoras',
    raza: 'Hy-Line Brown',
    sexo: 'Hembra',
    pesoKg: 38,
    especie: 'Aves de corral',
    tipoIdentificacion: 'Precinto Caja / Jaula',
    identificacionDetalle: 'Precinto Jaula JAULA-201 / Galpón 01',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Newcastle LaSota y Gumboro vigentes'
  },
  {
    arete: 'AVE-J02',
    nombre: 'Jaula 20 Ponedoras Lohmann',
    categoria: 'Gallinas Ponedoras',
    raza: 'Lohmann White',
    sexo: 'Hembra',
    pesoKg: 36,
    especie: 'Aves de corral',
    tipoIdentificacion: 'Precinto Caja / Jaula',
    identificacionDetalle: 'Precinto Jaula JAULA-202 / Galpón 02',
    retiroFarmacoActivo: true,
    diasRetiroRestantes: 6,
    farmaco: 'Enrofloxacina oral en agua',
    tipoRetiro: 'Carne y Huevo'
  },
  {
    arete: 'AVE-GL01',
    nombre: 'Gallo Espartaco',
    categoria: 'Gallos Finos',
    raza: 'Combatiente Criollo',
    sexo: 'Macho',
    pesoKg: 2.3,
    especie: 'Aves de corral',
    tipoIdentificacion: 'Precinto Caja / Jaula',
    identificacionDetalle: 'Anillo Alar Metálico GL-992 / Registro Pedigrí',
    retiroFarmacoActivo: false
  },
  {
    arete: 'AVE-PV01',
    nombre: 'Jaula 4 Pavos Pechuga Blanca',
    categoria: 'Pavos / Pavas',
    raza: 'Nicholas White',
    sexo: 'Macho',
    pesoKg: 48,
    especie: 'Aves de corral',
    tipoIdentificacion: 'Precinto Caja / Jaula',
    identificacionDetalle: 'Precinto Jaula PAV-101 / Galpón 03',
    retiroFarmacoActivo: false
  },

  // --- 🐐 CAPRINOS (Factor UGG: 0.15) ---
  {
    arete: 'CAP-201',
    nombre: 'Princesa Saanen',
    categoria: 'Cabras Lecheras',
    raza: 'Saanen Puro',
    sexo: 'Hembra',
    pesoKg: 62,
    especie: 'Caprinos',
    tipoIdentificacion: 'Arete / Microchip Caprino',
    identificacionDetalle: 'Arete Caprino CAP-201 / Microchip RFID 98102',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Diagnóstico CAE Seronegativo verificado'
  },
  {
    arete: 'CAP-202',
    nombre: 'Estrella Alpina',
    categoria: 'Cabras Lecheras',
    raza: 'Alpina Francesa',
    sexo: 'Hembra',
    pesoKg: 58,
    especie: 'Caprinos',
    tipoIdentificacion: 'Arete / Microchip Caprino',
    identificacionDetalle: 'Arete Caprino CAP-202 / Microchip RFID 98103',
    retiroFarmacoActivo: false
  },
  {
    arete: 'CAP-203',
    nombre: 'Flor de Montaña',
    categoria: 'Cabritonas / Cabritos',
    raza: 'Saanen',
    sexo: 'Hembra',
    pesoKg: 38,
    especie: 'Caprinos',
    tipoIdentificacion: 'Arete / Microchip Caprino',
    identificacionDetalle: 'Arete Caprino CAP-203 / Microchip RFID 98104',
    retiroFarmacoActivo: true,
    diasRetiroRestantes: 10,
    farmaco: 'Albendazol 10% oral',
    tipoRetiro: 'Carne y Leche'
  },
  {
    arete: 'CHV-01',
    nombre: 'Gran Sultán Boer',
    categoria: 'Chivos Reproductores',
    raza: 'Boer Puro',
    sexo: 'Macho',
    pesoKg: 92,
    especie: 'Caprinos',
    tipoIdentificacion: 'Arete / Microchip Caprino',
    identificacionDetalle: 'Arete Caprino CAP-001 / Tatuaje Oreja BOER-1',
    retiroFarmacoActivo: false
  },
  {
    arete: 'CAP-CEB01',
    nombre: 'Lote Chivatos Ceba',
    categoria: 'Caprinos de Ceba',
    raza: 'Mestizo Boer',
    sexo: 'Macho',
    pesoKg: 34,
    especie: 'Caprinos',
    tipoIdentificacion: 'Arete / Microchip Caprino',
    identificacionDetalle: 'Arete Lote CAP-CEB-15',
    retiroFarmacoActivo: false
  },

  // --- 🐴 EQUINOS (Factor UGG: 1.2) ---
  {
    arete: 'EQU-301',
    nombre: 'Gitana Real',
    categoria: 'Yeguas',
    raza: 'Cuarto de Milla',
    sexo: 'Hembra',
    pesoKg: 480,
    especie: 'Equinos',
    tipoIdentificacion: 'Pasaporte / RFID + Coggins',
    identificacionDetalle: 'Pasaporte Oficial EQ-8841 / Microchip RFID 982000214',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Test de Coggins Negativo Certificado (INSAI-2026-AIE-4491, Vence: 2026-11-15)'
  },
  {
    arete: 'EQU-302',
    nombre: 'Huracán del Llano',
    categoria: 'Caballos',
    raza: 'Criollo Venezolano',
    sexo: 'Macho',
    pesoKg: 435,
    especie: 'Equinos',
    tipoIdentificacion: 'Pasaporte / RFID + Coggins',
    identificacionDetalle: 'Pasaporte Oficial EQ-8842 / Microchip RFID 982000215',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Test de Coggins Negativo Certificado (INSAI-2026-AIE-4492, Vence: 2026-12-01)'
  },
  {
    arete: 'EQU-303',
    nombre: 'Centella Dorada',
    categoria: 'Potros / Potrancas',
    raza: 'Paso Fino',
    sexo: 'Hembra',
    pesoKg: 310,
    especie: 'Equinos',
    tipoIdentificacion: 'Pasaporte / RFID + Coggins',
    identificacionDetalle: 'Pasaporte Oficial EQ-8843 / Microchip RFID 982000216',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Test de Coggins Negativo Certificado (INSAI-2026-AIE-4493, Vence: 2026-10-30)'
  },
  {
    arete: 'EQU-304',
    nombre: 'Monarca del Valle',
    categoria: 'Padrillos / Sementales',
    raza: 'Pura Sangre',
    sexo: 'Macho',
    pesoKg: 520,
    especie: 'Equinos',
    tipoIdentificacion: 'Pasaporte / RFID + Coggins',
    identificacionDetalle: 'Pasaporte Oficial EQ-8844 / Microchip RFID 982000217',
    retiroFarmacoActivo: true,
    diasRetiroRestantes: 4,
    farmaco: 'Flunixin Meglumine inyectable',
    tipoRetiro: 'Carne',
    sanitarioExtra: 'Test de Coggins Negativo (INSAI-2026-AIE-4494, Vence: 2026-11-20)'
  },
  {
    arete: 'EQU-305',
    nombre: 'Relámpago',
    categoria: 'Caballos',
    raza: 'Cuarto de Milla',
    sexo: 'Macho',
    pesoKg: 475,
    especie: 'Equinos',
    tipoIdentificacion: 'Pasaporte / RFID + Coggins',
    identificacionDetalle: 'Pasaporte Oficial EQ-8845 / Microchip RFID 982000218',
    retiroFarmacoActivo: false,
    sanitarioExtra: 'Test de Coggins Negativo Certificado (INSAI-2026-AIE-4495, Vence: 2027-01-10)'
  }
];

const SPECIES_TABS: { id: EspecieAnimal; nombre: string; icono: string }[] = [
  { id: 'Bovinos', nombre: 'Bovinos', icono: '🐮' },
  { id: 'Aves de corral', nombre: 'Aves de corral', icono: '🐔' },
  { id: 'Porcinos', nombre: 'Porcinos', icono: '🐷' },
  { id: 'Búfalos', nombre: 'Búfalos', icono: '🐃' },
  { id: 'Caprinos', nombre: 'Caprinos', icono: '🐐' },
  { id: 'Equinos', nombre: 'Equinos', icono: '🐴' }
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
  const [guiaNumber] = useState(`GS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
  const [activeSpeciesTab, setActiveSpeciesTab] = useState<EspecieAnimal>('Bovinos');
  const [originHerd, setOriginHerd] = useState('Hacienda La Alborada (Predio Principal - RUNA #BOV-491)');
  const [destinationHerd, setDestinationHerd] = useState('Finca Santa Inés (Predio de Ceba y Pastoreo - RUNA #BOV-882)');
  const [purpose, setPurpose] = useState('Traslado a Pastoreo / Rotación');
  const [truckPlate, setTruckPlate] = useState('A84CD2K');
  const [truckModel, setTruckModel] = useState('Camión Ganadero Ford F-750 (Capacidad 25 UGG)');
  const [truckCapacityUGG, setTruckCapacityUGG] = useState(25.0);
  const [driverName, setDriverName] = useState('Pedro José Morales');
  const [driverId, setDriverId] = useState('V-14.892.301');
  const [securitySeals, setSecuritySeals] = useState('PRC-90412, PRC-90413');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  // Semovientes seleccionados
  const [selectedTags, setSelectedTags] = useState<string[]>(['0001', '0002', 'CW002']);
  const [searchTerm, setSearchTerm] = useState('');

  // Animales de la pestaña de especie activa
  const speciesAnimals = useMemo(() => {
    return MOCK_TRANSIT_ANIMALS.filter(a => a.especie === activeSpeciesTab);
  }, [activeSpeciesTab]);

  // Filtrado por búsqueda en la especie activa
  const filteredAnimals = useMemo(() => {
    return speciesAnimals.filter(a => {
      const q = searchTerm.toLowerCase().trim();
      if (!q) return true;
      return (
        a.arete.toLowerCase().includes(q) ||
        a.nombre.toLowerCase().includes(q) ||
        a.raza.toLowerCase().includes(q) ||
        a.identificacionDetalle.toLowerCase().includes(q)
      );
    });
  }, [speciesAnimals, searchTerm]);

  // Lista global de animales seleccionados
  const selectedAnimalsList = useMemo(() => {
    return MOCK_TRANSIT_ANIMALS.filter(a => selectedTags.includes(a.arete));
  }, [selectedTags]);

  // Cálculo de UGG transportadas usando los factores de conversión oficiales
  const totalUGGTransported = useMemo(() => {
    return selectedAnimalsList.reduce((acc, a) => {
      const factor = UGG_FACTORS[a.especie] || 1.0;
      return acc + factor;
    }, 0);
  }, [selectedAnimalsList]);

  // Peso vivo total en kg
  const totalLiveWeightKg = useMemo(() => {
    return selectedAnimalsList.reduce((acc, a) => acc + a.pesoKg, 0);
  }, [selectedAnimalsList]);

  // Blindaje estricto de retiro farmacológico
  const animalsWithActiveWithdrawal = useMemo(() => {
    return selectedAnimalsList.filter(a => a.retiroFarmacoActivo);
  }, [selectedAnimalsList]);

  // Verificación sanitaria obligatoria para Equinos (Test de Coggins AIE)
  const equinesWithoutCoggins = useMemo(() => {
    return selectedAnimalsList.filter(
      a => a.especie === 'Equinos' && (!a.sanitarioExtra || !a.sanitarioExtra.includes('Test de Coggins Negativo'))
    );
  }, [selectedAnimalsList]);

  const isSlaughterhouse = purpose === 'Faena / Matadero';
  const hasCriticalSanitaryBlock = isSlaughterhouse && animalsWithActiveWithdrawal.length > 0;
  const isCapacityExceeded = totalUGGTransported > truckCapacityUGG;

  const toggleSelectAnimal = (arete: string) => {
    setSelectedTags(prev =>
      prev.includes(arete) ? prev.filter(t => t !== arete) : [...prev, arete]
    );
  };

  const toggleSelectAllCurrentSpecies = () => {
    const currentSpeciesAretes = speciesAnimals.map(a => a.arete);
    const allSelected = currentSpeciesAretes.every(t => selectedTags.includes(t));
    if (allSelected) {
      setSelectedTags(prev => prev.filter(t => !currentSpeciesAretes.includes(t)));
    } else {
      setSelectedTags(prev => Array.from(new Set([...prev, ...currentSpeciesAretes])));
    }
  };

  // Imprimir Guía Sanitaria Oficial en PDF
  const handlePrintOfficialPDF = () => {
    const headers = [
      'ID Oficial / Arete',
      'Nombre / Lote',
      'Especie',
      'Categoría',
      'Raza / Línea',
      'Sexo',
      'Peso (kg)',
      'Factor UGG',
      'Estatus Sanitario / Retiro'
    ];

    const rows = selectedAnimalsList.map(a => {
      const uFactor = UGG_FACTORS[a.especie] || 1.0;
      const statusText = a.retiroFarmacoActivo
        ? `⚠️ RETIRO ACTIVO (${a.diasRetiroRestantes}d - ${a.farmaco})`
        : a.especie === 'Equinos'
        ? `✅ APTO (Coggins Negativo)`
        : '✅ APTO ZOOSANITARIO';

      return [
        a.identificacionDetalle,
        a.nombre,
        a.especie,
        a.categoria,
        a.raza,
        a.sexo,
        `${a.pesoKg} kg`,
        `${uFactor.toFixed(3)} UGG`,
        statusText
      ];
    });

    const title = `REPÚBLICA BOLIVARIANA DE VENEZUELA - INSAI / SENASAG\nGUÍA SANITARIA OFICIAL DE MOVILIZACIÓN PECUARIA MULTIESPECIE Nº ${guiaNumber}`;
    exportToPDF(`guia_movilizacion_${guiaNumber}`, title, headers, rows);
  };

  // Guardar y registrar guía
  const handleSaveGuide = () => {
    if (hasCriticalSanitaryBlock) {
      alert(
        'BLOQUEO SANITARIO CRÍTICO DE INOCUIDAD ALIMENTARIA:\nEstá estrictamente prohibido emitir guías de movilización a mataderos/faena con animales en período de retiro farmacológico activo (carne/leche).'
      );
      return;
    }
    if (selectedTags.length === 0) {
      alert('Debe seleccionar al menos un semoviente para emitir la guía de movilización.');
      return;
    }

    const guiaData = {
      id: guiaNumber,
      fecha: issueDate,
      vencimiento: validUntil,
      tipoTransaccion: 'Traslado Multiespecie',
      especiePrincipal: activeSpeciesTab,
      rebanoOrigen: originHerd,
      rebanoDestino: destinationHerd,
      cantidadAnimales: selectedTags.length,
      totalUGG: Number(totalUGGTransported.toFixed(2)),
      pesoVivoTotalKg: totalLiveWeightKg,
      capacidadVehiculoUGG: truckCapacityUGG,
      placa: truckPlate,
      modeloCamion: truckModel,
      choferCedula: driverId,
      choferNombre: driverName,
      precintos: securitySeals,
      motivo: purpose,
      animales: selectedAnimalsList.map(a => ({
        arete: a.arete,
        nombre: a.nombre,
        especie: a.especie,
        categoria: a.categoria,
        identificacion: a.identificacionDetalle,
        pesoKg: a.pesoKg,
        ugg: UGG_FACTORS[a.especie]
      }))
    };

    if (onSuccess) {
      onSuccess(guiaData);
    }
    alert(
      `¡Guía Oficial de Movilización ${guiaNumber} emitida con éxito!\n\nSemovientes: ${selectedTags.length}\nTotal UGG: ${totalUGGTransported.toFixed(2)} / ${truckCapacityUGG} UGG\nPeso total: ${totalLiveWeightKg.toLocaleString()} kg`
    );
    onClose();
  };

  if (!isOpen) return null;

  const currentActiveIdent = ESPECIE_IDENTIFICACION[activeSpeciesTab];

  return (
    <div className="adhoc-modal-backdrop" onClick={onClose}>
      <div className="transit-guide-modal-window" onClick={e => e.stopPropagation()}>
        {/* Cabecera Oficial con Sellos */}
        <div className="transit-header-seal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                backgroundColor: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #4ade80'
              }}
            >
              <ShieldCheck size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 0.3 }}>
                GUÍA SANITARIA OFICIAL DE MOVILIZACIÓN PECUARIA MULTIESPECIE
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>
                Control sanitario de tránsito inter-predial, cálculo de UGG y bioseguridad agroalimentaria
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="transit-seal-badge">Nº OFICIAL: {guiaNumber}</span>
            <button
              type="button"
              onClick={onClose}
              style={{ color: '#ffffff', background: 'transparent', border: 'none', cursor: 'pointer' }}
              title="Cerrar modal"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="adhoc-modal-body">
          {/* Alerta Roja Crítica de Retiro Farmacológico */}
          {animalsWithActiveWithdrawal.length > 0 && (
            <div className={`sanitary-withdrawal-alert ${hasCriticalSanitaryBlock ? 'critical' : ''}`}>
              <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>
                  {hasCriticalSanitaryBlock
                    ? '⛔ BLOQUEO SANITARIO CRÍTICO: VIOLACIÓN DE INOCUIDAD AGROALIMENTARIA (DESPACHO A MATADERO)'
                    : '⚠️ ADVERTENCIA ESTRICTA DE RETIRO FARMACOLÓGICO / BIOSEGURIDAD'}
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: 12.5, lineHeight: 1.4 }}>
                  Los siguientes semovientes seleccionados tienen <strong>período de retiro activo</strong>:{' '}
                  {animalsWithActiveWithdrawal.map(a => (
                    <span key={a.arete} style={{ display: 'inline-block', marginRight: 6 }}>
                      <code>{a.arete} ({a.nombre})</code> — {a.farmaco} ({a.diasRetiroRestantes} días restantes para {a.tipoRetiro || 'carne/leche'}).
                    </span>
                  ))}
                </p>
                {hasCriticalSanitaryBlock && (
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>
                    ¡Normativa Sanitaria: Está penalizado por la ley trasladar a faena o consumo humano semovientes con residuos de antibióticos o antiparasitarios!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Formulario de Información Oficial de Tránsito */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-gray)',
              borderRadius: 10,
              padding: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 12,
              marginBottom: 16
            }}
          >
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Building size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Predio / Rebaño Origen:
              </label>
              <input
                type="text"
                className="form-control"
                value={originHerd}
                onChange={e => setOriginHerd(e.target.value)}
                style={{ fontSize: 12 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Building size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Predio / Destino:
              </label>
              <input
                type="text"
                className="form-control"
                value={destinationHerd}
                onChange={e => setDestinationHerd(e.target.value)}
                style={{ fontSize: 12 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                Finalidad de Movilización:
              </label>
              <select
                className="form-control"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                style={{ fontSize: 12.5 }}
              >
                <option value="Traslado a Pastoreo / Rotación">Traslado a Pastoreo / Rotación</option>
                <option value="Venta de Ganado Comercial">Venta de Ganado Comercial</option>
                <option value="Faena / Matadero">Faena / Matadero (Consumo)</option>
                <option value="Exposición / Feria Ganadera">Exposición / Feria Ganadera</option>
                <option value="Servicio Reproductivo / Monta">Servicio Reproductivo / Monta</option>
                <option value="Traslado entre Galpones / Piara">Traslado entre Galpones / Piara</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Truck size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Vehículo y Placa:
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  className="form-control"
                  value={truckPlate}
                  onChange={e => setTruckPlate(e.target.value)}
                  placeholder="Placa..."
                  style={{ width: 90, fontSize: 12, fontWeight: 700 }}
                />
                <input
                  type="text"
                  className="form-control"
                  value={truckModel}
                  onChange={e => setTruckModel(e.target.value)}
                  placeholder="Modelo camión..."
                  style={{ flex: 1, fontSize: 12 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Scale size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Capacidad del Camión (UGG):
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="100"
                className="form-control"
                value={truckCapacityUGG}
                onChange={e => setTruckCapacityUGG(Number(e.target.value) || 25)}
                style={{ fontSize: 12.5, fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <User size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Chofer Transportista:
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  className="form-control"
                  value={driverId}
                  onChange={e => setDriverId(e.target.value)}
                  placeholder="Cédula..."
                  style={{ width: 100, fontSize: 12 }}
                />
                <input
                  type="text"
                  className="form-control"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  placeholder="Nombre..."
                  style={{ flex: 1, fontSize: 12 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Hash size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Precintos Zoosanitarios:
              </label>
              <input
                type="text"
                className="form-control"
                value={securitySeals}
                onChange={e => setSecuritySeals(e.target.value)}
                placeholder="Precintos oficiales..."
                style={{ fontSize: 12 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                <Calendar size={14} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                Vigencia (Emisión / Vence):
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="date"
                  className="form-control"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  style={{ fontSize: 11.5 }}
                />
                <input
                  type="date"
                  className="form-control"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                  style={{ fontSize: 11.5 }}
                />
              </div>
            </div>
          </div>

          {/* Medidores de Carga UGG y Bienestar Animal */}
          <div
            style={{
              background: '#f8fafc',
              border: `1.5px solid ${isCapacityExceeded ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Cabezas / Lotes:
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                  {selectedTags.length} semovientes
                </div>
              </div>

              <div style={{ height: 32, width: 1, backgroundColor: '#cbd5e1' }} />

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Biomasa Total:
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                  {totalLiveWeightKg.toLocaleString()} kg
                </div>
              </div>

              <div style={{ height: 32, width: 1, backgroundColor: '#cbd5e1' }} />

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Carga UGG Calculada:
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: isCapacityExceeded ? '#dc2626' : '#15803d' }}>
                  {totalUGGTransported.toFixed(2)} UGG / {truckCapacityUGG.toFixed(1)} UGG
                </div>
              </div>
            </div>

            {/* Barra de progreso de capacidad */}
            <div style={{ minWidth: 220, flex: 1, maxWidth: 360 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>
                <span>Ocupación de Capacidad:</span>
                <span style={{ color: isCapacityExceeded ? '#dc2626' : '#15803d' }}>
                  {truckCapacityUGG > 0 ? ((totalUGGTransported / truckCapacityUGG) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div style={{ width: '100%', height: 10, backgroundColor: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, truckCapacityUGG > 0 ? (totalUGGTransported / truckCapacityUGG) * 100 : 0)}%`,
                    height: '100%',
                    backgroundColor: isCapacityExceeded ? '#ef4444' : totalUGGTransported > truckCapacityUGG * 0.85 ? '#f59e0b' : '#10b981',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              {isCapacityExceeded && (
                <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700, marginTop: 2, display: 'block' }}>
                  ⚠️ ¡Sobrecarga! Excede en {(totalUGGTransported - truckCapacityUGG).toFixed(2)} UGG el límite del camión.
                </span>
              )}
            </div>
          </div>

          {/* Selector de Pestañas por Especie Pecuaria */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                Seleccione la Especie Pecuaria a Inspeccionar / Agregar:
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Factor UGG: <strong>Bovino 1.0</strong> | <strong>Búfalo 1.2</strong> | <strong>Equino 1.2</strong> | <strong>Porcino 0.3</strong> | <strong>Caprino 0.15</strong> | <strong>Aves 0.005</strong>
              </span>
            </div>

            <div className="species-selector-bar" style={{ margin: 0, paddingBottom: 6 }}>
              {SPECIES_TABS.map(sp => {
                const countInSpecies = MOCK_TRANSIT_ANIMALS.filter(a => a.especie === sp.id).length;
                const countSelectedInSpecies = selectedAnimalsList.filter(a => a.especie === sp.id).length;

                return (
                  <button
                    key={sp.id}
                    type="button"
                    className={`species-tab-btn ${activeSpeciesTab === sp.id ? 'active' : ''}`}
                    onClick={() => setActiveSpeciesTab(sp.id)}
                    style={{ padding: '7px 14px' }}
                  >
                    <span className="species-tab-icon">{sp.icono}</span>
                    <span className="species-tab-name">{sp.nombre}</span>
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 11,
                        padding: '1px 6px',
                        borderRadius: 10,
                        backgroundColor: countSelectedInSpecies > 0 ? 'var(--primary-color)' : '#f1f5f9',
                        color: countSelectedInSpecies > 0 ? '#ffffff' : '#64748b',
                        fontWeight: 700
                      }}
                    >
                      {countSelectedInSpecies}/{countInSpecies}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner de Identificación Oficial por Especie */}
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12.5,
              color: '#065f46'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{currentActiveIdent.icono}</span>
              <span>
                <strong>Tipo de Identificación Oficial Requerida ({activeSpeciesTab}):</strong>{' '}
                {currentActiveIdent.descripcion}
              </span>
            </div>
            {activeSpeciesTab === 'Equinos' && (
              <span style={{ fontWeight: 700, color: '#166534', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: 6 }}>
                Requisito Estricto: Test de Coggins AIE Vigente
              </span>
            )}
          </div>

          {/* Tabla de Semovientes de la Especie Activa */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-gray)',
              borderRadius: 10,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>
                  Inventario Disponible ({activeSpeciesTab}):
                </strong>
                <span className="badge-category" style={{ backgroundColor: '#e8f5e9', color: 'var(--primary-color)', fontWeight: 700 }}>
                  {filteredAnimals.length} ejemplares
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={toggleSelectAllCurrentSpecies}
                  style={{ fontSize: 12, color: 'var(--primary-color)', fontWeight: 600 }}
                >
                  Alternar Selección de {activeSpeciesTab}
                </button>
                <div className="report-search-bar" style={{ width: 220 }}>
                  <Search className="report-search-icon" size={14} />
                  <input
                    type="text"
                    className="report-search-input"
                    placeholder={`Buscar en ${activeSpeciesTab}...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            </div>

            <div className="animal-select-table-box" style={{ maxHeight: 260 }}>
              <table className="report-grid-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Sel.</th>
                    <th>Identificación Oficial de la Especie</th>
                    <th>Nombre / Lote</th>
                    <th>Categoría</th>
                    <th>Raza / Línea</th>
                    <th>Sexo</th>
                    <th>Peso Vivo</th>
                    <th>UGG</th>
                    <th>Estatus Sanitario / Retiro Farmacológico</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnimals.map(animal => {
                    const isChecked = selectedTags.includes(animal.arete);
                    const factorUGG = UGG_FACTORS[animal.especie] || 1.0;

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
                        <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1e293b' }}>
                          {animal.identificacionDetalle}
                        </td>
                        <td style={{ fontWeight: 600 }}>{animal.nombre}</td>
                        <td>{animal.categoria}</td>
                        <td>{animal.raza}</td>
                        <td>{animal.sexo}</td>
                        <td>{animal.pesoKg} kg</td>
                        <td style={{ fontWeight: 700, color: '#334155' }}>
                          {factorUGG.toFixed(3)} UGG
                        </td>
                        <td>
                          {animal.retiroFarmacoActivo ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#991b1b',
                                backgroundColor: '#fee2e2',
                                padding: '2px 6px',
                                borderRadius: 4
                              }}
                            >
                              <AlertTriangle size={12} />
                              Retiro Activo: {animal.diasRetiroRestantes}d ({animal.farmaco})
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#15803d',
                                backgroundColor: '#dcfce7',
                                padding: '2px 6px',
                                borderRadius: 4
                              }}
                            >
                              <CheckCircle2 size={12} />
                              {animal.sanitarioExtra || 'Liberado / Apto'}
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

        {/* Footer con Acciones y Resumen Consolidado */}
        <div className="adhoc-modal-footer">
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Total seleccionados: <strong>{selectedTags.length} animales</strong> | Carga acumulada:{' '}
            <strong style={{ color: isCapacityExceeded ? '#dc2626' : '#15803d' }}>
              {totalUGGTransported.toFixed(2)} UGG
            </strong>{' '}
            ({totalLiveWeightKg.toLocaleString()} kg de biomasa)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrintOfficialPDF}
              disabled={selectedTags.length === 0}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
              title="Descargar o imprimir Guía Sanitaria Oficial"
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
                opacity: hasCriticalSanitaryBlock || selectedTags.length === 0 ? 0.6 : 1,
                backgroundColor: hasCriticalSanitaryBlock ? '#ef4444' : undefined
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
