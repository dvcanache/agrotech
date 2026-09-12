export type EquipmentCategory = 'Maquinaria' | 'Vehículos' | 'Implementos' | 'Estacionarios';

export type OperationalState = 'Operativo' | 'En labor' | 'En mantenimiento' | 'Fuera de servicio';

export type MaintenanceType =
  | 'Preventivo 250h'
  | 'Preventivo 500h'
  | 'Preventivo 1000h'
  | 'Correctivo'
  | 'Calibración / Engrase';

export interface EquipmentVariant {
  potenciaHp?: number;
  traccion?: '4x4' | '4x2' | 'Oruga' | 'N/A';
  capacidad?: string;
  transmision?: string;
  combustible?: 'Diésel' | 'Gasolina' | 'Eléctrico' | 'N/A';
  ano?: number;
}

export interface MaintenanceRecord {
  id: string;
  equipoCodigo: string;
  fecha: string;
  tipo: MaintenanceType;
  horometroKmAlServicio: number;
  costoUsd: number;
  repuestosReemplazados: string[];
  tecnicoResponsable: string;
  taller: string;
  observaciones: string;
}

export interface FuelLaborRecord {
  id: string;
  equipoCodigo: string;
  implementoCodigo?: string;
  fecha: string;
  potreroId: string;
  labor: string;
  horasTrabajadas: number;
  hectareasTrabajadas?: number;
  litrosCombustible: number;
  eficienciaCalculada: string; // ej. "9.2 L/ha (13.0 L/h)" o "11.25 L/h"
  operador: string;
  observaciones?: string;
}

export interface EquipmentItem {
  codigo: string;
  nombre: string;
  categoria: EquipmentCategory;
  subtipo: string;
  marca: string;
  modelo: string;
  serialVin: string;
  placa?: string;
  variante: EquipmentVariant;
  estado: OperationalState;
  horometroActual: number;
  odometroKm?: number;
  unidadMedidaUso: 'Horas' | 'Kilómetros';
  ubicacionAsignada: string;
  operadorAsignado: string;
  intervaloMantenimientoHoras: number;
  proximoMantenimientoHorasKm: number;
  alertaMantenimiento: boolean;
  consumoPromedioLPorHora?: number;
  fechaAdquisicion: string;
  valorEstimadoUsd: number;
  historialMantenimientos: MaintenanceRecord[];
  historialCombustible: FuelLaborRecord[];
}

export const LOCATIONS_OPTIONS = [
  'Galpón Maquinaria',
  'Potrero 1 (Maternidad)',
  'Potrero 2 (Lote Novillas)',
  'Potrero 3 (Baja Carga)',
  'Potrero 4 (Brizantha)',
  'Potrero 5 (Pastura Estrella)',
  'Sala de Ordeño Mecánico',
  'Pozo Profundo 2 / Laguna Sur',
  'Taller Central'
];

export const OPERATORS_OPTIONS = [
  'Carlos Mendoza (Maquinista Senior)',
  'Pedro González (Tractorista)',
  'Ramón Pérez (Chofer / Logística)',
  'José Colmenares (Mecánico / Operador)',
  'Dr. Dave Canache (Administrador)'
];

export const LABORS_OPTIONS = [
  'Rastreo y Preparación de Suelo',
  'Corte y Picado de Forraje',
  'Siembra Directa Pastos',
  'Fertilización y Encalado',
  'Control Mecánico de Malezas',
  'Bombeo de Agua a Tanques',
  'Generación Eléctrica Emergencia',
  'Transporte de Semovientes y Alimento'
];

export const INITIAL_MAINTENANCE_LOG: MaintenanceRecord[] = [
  {
    id: 'MNT-001',
    equipoCodigo: 'TRAC-01',
    fecha: '2026-08-15',
    tipo: 'Preventivo 250h',
    horometroKmAlServicio: 2250,
    costoUsd: 380,
    repuestosReemplazados: ['Filtro Aceite Motor RE504836', 'Aceite 15W40 Diésel (16L)', 'Filtro Combustible Primario'],
    tecnicoResponsable: 'José Colmenares',
    taller: 'Taller Central AgroTech',
    observaciones: 'Servicio programado de 250 horas. Presión de aceite y compresión óptimas.'
  },
  {
    id: 'MNT-002',
    equipoCodigo: 'TRAC-02',
    fecha: '2026-07-28',
    tipo: 'Preventivo 250h',
    horometroKmAlServicio: 1500,
    costoUsd: 340,
    repuestosReemplazados: ['Filtro de Aceite AGCO', 'Aceite SAE 15W40 (12L)', 'Engrase Crucetas Tracción Delantera'],
    tecnicoResponsable: 'Taller Massey Repuestos',
    taller: 'Servicio Autorizado Barquisimeto',
    observaciones: 'Reemplazo regular de fluidos y chequeo de terminales de dirección.'
  },
  {
    id: 'MNT-003',
    equipoCodigo: 'VEH-01',
    fecha: '2026-08-02',
    tipo: 'Preventivo 500h',
    horometroKmAlServicio: 140000,
    costoUsd: 520,
    repuestosReemplazados: ['Pastillas de Freno Delanteras Cerámicas', 'Aceite Motor Sintético', 'Filtro Aire Alto Flujo'],
    tecnicoResponsable: 'Ramón Pérez / Taller Diésel',
    taller: 'Taller San Felipe',
    observaciones: 'Calibración de frenos y rotación de neumáticos de carga.'
  },
  {
    id: 'MNT-004',
    equipoCodigo: 'IMP-01',
    fecha: '2026-08-20',
    tipo: 'Calibración / Engrase',
    horometroKmAlServicio: 800,
    costoUsd: 180,
    repuestosReemplazados: ['2 Rodamientos Sellados Baldan 26"', 'Grasa Litio EP2 (4kg)', 'Tornillería de Grado 8'],
    tecnicoResponsable: 'José Colmenares',
    taller: 'Galpón Maquinaria',
    observaciones: 'Sustitución de rodamientos desgastados en cuerpo trasero de rastra.'
  },
  {
    id: 'MNT-005',
    equipoCodigo: 'EST-02',
    fecha: '2026-09-10',
    tipo: 'Preventivo 500h',
    horometroKmAlServicio: 1500,
    costoUsd: 450,
    repuestosReemplazados: ['Filtros Diésel Fleetguard (x2)', 'Filtro Refrigerante DCA4', 'Refrigerante Orgánico 50/50'],
    tecnicoResponsable: 'Servicio Cummins Diesel',
    taller: 'En sitio (Sala de Ordeño)',
    observaciones: 'Mantenimiento en curso por cumplimiento de intervalo mayor de 1500h.'
  }
];

export const INITIAL_FUEL_LOG: FuelLaborRecord[] = [
  {
    id: 'COMB-001',
    equipoCodigo: 'TRAC-01',
    implementoCodigo: 'IMP-01',
    fecha: '2026-09-08',
    potreroId: 'Potrero 4 (Brizantha)',
    labor: 'Rastreo y Preparación de Suelo',
    horasTrabajadas: 8.5,
    hectareasTrabajadas: 12.0,
    litrosCombustible: 110.5,
    eficienciaCalculada: '9.2 L/ha (13.0 L/h)',
    operador: 'Carlos Mendoza',
    observaciones: 'Preparación de cama de siembra en suelo arcilloso húmedo.'
  },
  {
    id: 'COMB-002',
    equipoCodigo: 'TRAC-02',
    implementoCodigo: 'IMP-02',
    fecha: '2026-09-09',
    potreroId: 'Potrero 5 (Pastura Estrella)',
    labor: 'Corte y Picado de Forraje',
    horasTrabajadas: 6.0,
    hectareasTrabajadas: 7.5,
    litrosCombustible: 68.0,
    eficienciaCalculada: '9.1 L/ha (11.3 L/h)',
    operador: 'Pedro González',
    observaciones: 'Corte para ensilaje de reserva forrajera de verano.'
  },
  {
    id: 'COMB-003',
    equipoCodigo: 'VEH-01',
    fecha: '2026-09-10',
    potreroId: 'Galpón Maquinaria',
    labor: 'Transporte de Semovientes y Alimento',
    horasTrabajadas: 4.0,
    litrosCombustible: 45.0,
    eficienciaCalculada: '11.25 L/h',
    operador: 'Ramón Pérez',
    observaciones: 'Traslado de 120 sacos de concentrado proteico desde acopio comercial.'
  },
  {
    id: 'COMB-004',
    equipoCodigo: 'EST-01',
    fecha: '2026-09-11',
    potreroId: 'Pozo Profundo 2 / Laguna Sur',
    labor: 'Bombeo de Agua a Tanques',
    horasTrabajadas: 5.0,
    litrosCombustible: 12.5,
    eficienciaCalculada: '2.5 L/h',
    operador: 'José Colmenares',
    observaciones: 'Llenado de tanques australianos para abastecer bebederos de potreros 1 al 4.'
  },
  {
    id: 'COMB-005',
    equipoCodigo: 'TRAC-01',
    implementoCodigo: 'IMP-01',
    fecha: '2026-09-11',
    potreroId: 'Potrero 4 (Brizantha)',
    labor: 'Rastreo y Preparación de Suelo',
    horasTrabajadas: 7.0,
    hectareasTrabajadas: 9.0,
    litrosCombustible: 94.0,
    eficienciaCalculada: '10.4 L/ha (13.4 L/h)',
    operador: 'Carlos Mendoza',
    observaciones: 'Segunda pasada de rastra pesada.'
  }
];

export const EQUIPMENT_MOCK_DATA: EquipmentItem[] = [
  // 1. Tractores (Maquinaria)
  {
    codigo: 'TRAC-01',
    nombre: 'John Deere 6125M Premium',
    categoria: 'Maquinaria',
    subtipo: 'Tractor Agrícola Pesado',
    marca: 'John Deere',
    modelo: '6125M',
    serialVin: '1L06125MKKD894211',
    variante: {
      potenciaHp: 125,
      traccion: '4x4',
      capacidad: 'Enganche Cat. III (5.3 Ton)',
      transmision: 'PowerQuad Plus 24x24 con Inversor',
      combustible: 'Diésel',
      ano: 2021
    },
    estado: 'En labor',
    horometroActual: 2415.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Potrero 4 (Brizantha)',
    operadorAsignado: 'Carlos Mendoza (Maquinista Senior)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 2500.0,
    alertaMantenimiento: false, // 2500 - 2415 = 85h restantes
    consumoPromedioLPorHora: 13.2,
    fechaAdquisicion: '2021-04-10',
    valorEstimadoUsd: 85000,
    historialMantenimientos: INITIAL_MAINTENANCE_LOG.filter(m => m.equipoCodigo === 'TRAC-01'),
    historialCombustible: INITIAL_FUEL_LOG.filter(f => f.equipoCodigo === 'TRAC-01')
  },
  {
    codigo: 'TRAC-02',
    nombre: 'Massey Ferguson 4708 Global Series',
    categoria: 'Maquinaria',
    subtipo: 'Tractor Agrícola Utilitario',
    marca: 'Massey Ferguson',
    modelo: 'MF-4708',
    serialVin: 'AGCO4708MF928174',
    variante: {
      potenciaHp: 85,
      traccion: '4x4',
      capacidad: 'Enganche Cat. II (3.0 Ton)',
      transmision: 'SynchroMesh 12x12 Mecánica',
      combustible: 'Diésel',
      ano: 2022
    },
    estado: 'Operativo',
    horometroActual: 1742.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Galpón Maquinaria',
    operadorAsignado: 'Pedro González (Tractorista)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 1750.0,
    alertaMantenimiento: true, // Faltan solo 8 horas -> Alerta Preventivo Inminente!
    consumoPromedioLPorHora: 10.5,
    fechaAdquisicion: '2022-09-18',
    valorEstimadoUsd: 52000,
    historialMantenimientos: INITIAL_MAINTENANCE_LOG.filter(m => m.equipoCodigo === 'TRAC-02'),
    historialCombustible: INITIAL_FUEL_LOG.filter(f => f.equipoCodigo === 'TRAC-02')
  },
  {
    codigo: 'TRAC-03',
    nombre: 'New Holland TT4.75 All-Rounder',
    categoria: 'Maquinaria',
    subtipo: 'Tractor Agrícola Mediano',
    marca: 'New Holland',
    modelo: 'TT4.75',
    serialVin: 'NH-TT475-2019-4410',
    variante: {
      potenciaHp: 75,
      traccion: '4x4',
      capacidad: 'Enganche Cat. II (2.5 Ton)',
      transmision: 'Synchro Command 12x12',
      combustible: 'Diésel',
      ano: 2019
    },
    estado: 'Fuera de servicio',
    horometroActual: 3120.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Taller Central',
    operadorAsignado: 'José Colmenares (Mecánico / Operador)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 3250.0,
    alertaMantenimiento: false,
    consumoPromedioLPorHora: 9.8,
    fechaAdquisicion: '2019-11-05',
    valorEstimadoUsd: 38000,
    historialMantenimientos: [],
    historialCombustible: []
  },

  // 2. Vehículos
  {
    codigo: 'VEH-01',
    nombre: 'Ford F-350 Super Duty Ganadero',
    categoria: 'Vehículos',
    subtipo: 'Camión de Estacas Ganadero',
    marca: 'Ford',
    modelo: 'F-350 XL V8',
    serialVin: '1FT8W3B68KEC91024',
    placa: 'A82BC3D',
    variante: {
      potenciaHp: 385,
      traccion: '4x4',
      capacidad: 'Carga Útil 4.2 Toneladas',
      transmision: 'TorqShift Automática 6 Velocidades',
      combustible: 'Diésel',
      ano: 2019
    },
    estado: 'Operativo',
    horometroActual: 4820.0,
    odometroKm: 142850,
    unidadMedidaUso: 'Kilómetros',
    ubicacionAsignada: 'Galpón Maquinaria',
    operadorAsignado: 'Ramón Pérez (Chofer / Logística)',
    intervaloMantenimientoHoras: 500, // Cada 5000 km o 500h
    proximoMantenimientoHorasKm: 145000,
    alertaMantenimiento: false,
    consumoPromedioLPorHora: 11.2,
    fechaAdquisicion: '2019-03-12',
    valorEstimadoUsd: 34000,
    historialMantenimientos: INITIAL_MAINTENANCE_LOG.filter(m => m.equipoCodigo === 'VEH-01'),
    historialCombustible: INITIAL_FUEL_LOG.filter(f => f.equipoCodigo === 'VEH-01')
  },
  {
    codigo: 'VEH-02',
    nombre: 'Toyota Hilux Doble Cabina 4x4',
    categoria: 'Vehículos',
    subtipo: 'Camioneta Pick-up de Campo',
    marca: 'Toyota',
    modelo: 'Hilux SRV 2.8 D-4D',
    serialVin: '8AJBA3CD9P8104821',
    placa: 'AB594XP',
    variante: {
      potenciaHp: 204,
      traccion: '4x4',
      capacidad: 'Carga Útil 1.0 Tonelada',
      transmision: 'Manual 6 Velocidades con Reductora',
      combustible: 'Diésel',
      ano: 2023
    },
    estado: 'En labor',
    horometroActual: 1950.0,
    odometroKm: 58400,
    unidadMedidaUso: 'Kilómetros',
    ubicacionAsignada: 'Potrero 1 (Maternidad)',
    operadorAsignado: 'Dr. Dave Canache (Administrador)',
    intervaloMantenimientoHoras: 500,
    proximoMantenimientoHorasKm: 60000,
    alertaMantenimiento: false,
    consumoPromedioLPorHora: 8.5,
    fechaAdquisicion: '2023-01-20',
    valorEstimadoUsd: 46000,
    historialMantenimientos: [],
    historialCombustible: []
  },

  // 3. Implementos
  {
    codigo: 'IMP-01',
    nombre: 'Rastra Baldan 24 Discos Pesada',
    categoria: 'Implementos',
    subtipo: 'Rastra de Tiro Desarmable',
    marca: 'Baldan',
    modelo: 'CRSG 24x26',
    serialVin: 'BLDN-CRSG-88910',
    variante: {
      potenciaHp: 120, // Requerida
      traccion: 'N/A',
      capacidad: '24 Discos Ø 26" x 6.0 mm',
      transmision: 'N/A',
      combustible: 'N/A',
      ano: 2020
    },
    estado: 'En labor',
    horometroActual: 890.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Potrero 4 (Brizantha)',
    operadorAsignado: 'Carlos Mendoza (Maquinista Senior)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 1000.0,
    alertaMantenimiento: false,
    fechaAdquisicion: '2020-05-14',
    valorEstimadoUsd: 14500,
    historialMantenimientos: INITIAL_MAINTENANCE_LOG.filter(m => m.equipoCodigo === 'IMP-01'),
    historialCombustible: []
  },
  {
    codigo: 'IMP-02',
    nombre: 'Segadora Kuhn GMD 280 Forrajera',
    categoria: 'Implementos',
    subtipo: 'Segadora de Discos para Pastos',
    marca: 'Kuhn',
    modelo: 'GMD 280 Premium',
    serialVin: 'KHN-GMD280-92812',
    variante: {
      potenciaHp: 65, // Requerida
      traccion: 'N/A',
      capacidad: '7 Discos de Corte (Ancho 2.80 m)',
      transmision: 'Toma de Fuerza 540 RPM',
      combustible: 'N/A',
      ano: 2021
    },
    estado: 'Operativo',
    horometroActual: 512.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Galpón Maquinaria',
    operadorAsignado: 'Pedro González (Tractorista)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 750.0,
    alertaMantenimiento: false,
    fechaAdquisicion: '2021-08-30',
    valorEstimadoUsd: 18200,
    historialMantenimientos: [],
    historialCombustible: []
  },
  {
    codigo: 'IMP-03',
    nombre: 'Sembradora Neumática Vence Tudo',
    categoria: 'Implementos',
    subtipo: 'Sembradora de Grano Grueso y Pasto',
    marca: 'Vence Tudo',
    modelo: 'SA 11500',
    serialVin: 'VT-SA11-2022-7712',
    variante: {
      potenciaHp: 110,
      traccion: 'N/A',
      capacidad: '9 Líneas neumáticas con fertilizador',
      transmision: 'Cardán 540 RPM',
      combustible: 'N/A',
      ano: 2022
    },
    estado: 'Operativo',
    horometroActual: 320.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Galpón Maquinaria',
    operadorAsignado: 'Carlos Mendoza (Maquinista Senior)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 500.0,
    alertaMantenimiento: false,
    fechaAdquisicion: '2022-10-15',
    valorEstimadoUsd: 26500,
    historialMantenimientos: [],
    historialCombustible: []
  },

  // 4. Estacionarios
  {
    codigo: 'EST-01',
    nombre: 'Motobomba Honda GX240 Caudal Alto',
    categoria: 'Estacionarios',
    subtipo: 'Bomba Centrífuga de Riego y Llenado',
    marca: 'Honda',
    modelo: 'WT30XK4',
    serialVin: 'HND-GX240-66291',
    variante: {
      potenciaHp: 8,
      traccion: 'N/A',
      capacidad: 'Caudal 1,210 L/min (3" Succión/Descarga)',
      transmision: 'Acople Directo',
      combustible: 'Gasolina',
      ano: 2022
    },
    estado: 'Operativo',
    horometroActual: 640.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Pozo Profundo 2 / Laguna Sur',
    operadorAsignado: 'José Colmenares (Mecánico / Operador)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 750.0,
    alertaMantenimiento: false,
    consumoPromedioLPorHora: 2.5,
    fechaAdquisicion: '2022-03-05',
    valorEstimadoUsd: 3200,
    historialMantenimientos: [],
    historialCombustible: INITIAL_FUEL_LOG.filter(f => f.equipoCodigo === 'EST-01')
  },
  {
    codigo: 'EST-02',
    nombre: 'Planta Eléctrica Cummins 60 kVA',
    categoria: 'Estacionarios',
    subtipo: 'Generador Diésel Standby Silenciado',
    marca: 'Cummins',
    modelo: 'C60 D5e PowerCommand',
    serialVin: 'CUM-GEN-2018-9941',
    variante: {
      potenciaHp: 92,
      traccion: 'N/A',
      capacidad: '60 kVA / 48 kW Trifásica 208/120V',
      transmision: 'N/A',
      combustible: 'Diésel',
      ano: 2018
    },
    estado: 'En mantenimiento',
    horometroActual: 1510.0,
    unidadMedidaUso: 'Horas',
    ubicacionAsignada: 'Sala de Ordeño Mecánico',
    operadorAsignado: 'José Colmenares (Mecánico / Operador)',
    intervaloMantenimientoHoras: 250,
    proximoMantenimientoHorasKm: 1500.0,
    alertaMantenimiento: true, // Horómetro 1510 >= 1500 (Vencido por 10h)
    consumoPromedioLPorHora: 9.5,
    fechaAdquisicion: '2018-07-22',
    valorEstimadoUsd: 22000,
    historialMantenimientos: INITIAL_MAINTENANCE_LOG.filter(m => m.equipoCodigo === 'EST-02'),
    historialCombustible: []
  }
];

export interface EquipmentKpis {
  totalEquipos: number;
  operativos: number;
  enLabor: number;
  enMantenimiento: number;
  fueraDeServicio: number;
  consumoDieselMensualL: number;
  mantenimientosPendientes: number;
  horasTotalesTrabajadas: number;
}

export function calculateEquipmentKpis(
  equipos: EquipmentItem[],
  fuelRecords: FuelLaborRecord[]
): EquipmentKpis {
  const totalEquipos = equipos.length;
  const operativos = equipos.filter(e => e.estado === 'Operativo').length;
  const enLabor = equipos.filter(e => e.estado === 'En labor').length;
  const enMantenimiento = equipos.filter(e => e.estado === 'En mantenimiento').length;
  const fueraDeServicio = equipos.filter(e => e.estado === 'Fuera de servicio').length;

  const mantenimientosPendientes = equipos.filter(e => {
    if (e.alertaMantenimiento) return true;
    const restante = e.proximoMantenimientoHorasKm - (e.unidadMedidaUso === 'Kilómetros' && e.odometroKm ? e.odometroKm : e.horometroActual);
    return restante <= 25; // Menos de 25 horas o km para el servicio
  }).length;

  const consumoDieselMensualL = fuelRecords.reduce((acc, curr) => acc + curr.litrosCombustible, 0);
  const horasTotalesTrabajadas = fuelRecords.reduce((acc, curr) => acc + curr.horasTrabajadas, 0);

  return {
    totalEquipos,
    operativos,
    enLabor,
    enMantenimiento,
    fueraDeServicio,
    consumoDieselMensualL,
    mantenimientosPendientes,
    horasTotalesTrabajadas
  };
}
